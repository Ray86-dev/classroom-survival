// ============================================================
// Classroom Survival — proxy del ranking mundial (Cloudflare Worker)
// Guarda el token de Upstash como SECRETO (Settings → Variables).
// El token NUNCA va en el juego ni en este archivo.
// Endpoints:
//   GET  /top?board=all|5|10|15|25|50  → [{id,name,score,dur,alumnos,win,mins,con,combo,date}]
//   POST /submit {name,score,dur,alumnos,win,mins,con,combo} → {rank,id}
// Despliegue: Workers & Pages → Create Worker → Edit code → pegar esto → Deploy
//   → Settings → Variables and Secrets → UPSTASH_URL (texto) + UPSTASH_TOKEN (secreto, Encrypt)
// ============================================================

const BOARDS = ['5', '10', '15', '25', '50'];
const lastHit = new Map(); // rate-limit best-effort por IP (1 envío / 10 s)

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function cleanName(v) {
  return String(v ?? 'Anónimo').replace(/[<>{}\/\\]/g, '').trim().slice(0, 16) || 'Anónimo';
}

async function up(env, cmds) {
  const r = await fetch(env.UPSTASH_URL + '/pipeline', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + env.UPSTASH_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds),
  });
  if (!r.ok) throw new Error('upstash ' + r.status);
  return r.json();
}

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors() });
    const url = new URL(req.url);
    try {
      // ---- Lectura del top 10 ----
      if (url.pathname === '/top') {
        const b = url.searchParams.get('board') || 'all';
        const key = 'cs1:lb:' + (b === 'all' ? 'all' : (BOARDS.includes(b) ? b : 'all'));
        const z = await up(env, [['ZREVRANGE', key, '0', '9', 'WITHSCORES']]);
        const arr = (z[0] && z[0].result) || [];
        if (!arr.length) return Response.json([], { headers: cors() });
        const gets = [];
        for (let i = 0; i < arr.length; i += 2) gets.push(['HGETALL', 'cs1:run:' + arr[i]]);
        const hs = await up(env, gets);
        const out = [];
        for (let k = 0; k < gets.length; k++) {
          const a = (hs[k] && hs[k].result) || [];
          const o = {};
          for (let j = 0; j < a.length; j += 2) o[a[j]] = a[j + 1];
          o.score = arr[k * 2 + 1];
          o.id = arr[k * 2];
          if (o.name != null) out.push(o);
        }
        return Response.json(out, { headers: cors() });
      }
      // ---- Envío de puntuación (validada) ----
      if (url.pathname === '/submit' && req.method === 'POST') {
        const ip = req.headers.get('cf-connecting-ip') || 'x';
        const now = Date.now();
        if (lastHit.get(ip) && now - lastHit.get(ip) < 10000) {
          return Response.json({ error: 'rate' }, { status: 429, headers: cors() });
        }
        let e = {};
        try { e = await req.json(); }
        catch { return Response.json({ error: 'json' }, { status: 400, headers: cors() }); }
        const score = Math.floor(Number(e.score));
        const dur = String(e.dur);
        const alumnos = Math.floor(Number(e.alumnos));
        if (!Number.isFinite(score) || score <= 0 || score > 99999) {
          return Response.json({ error: 'score' }, { status: 400, headers: cors() });
        }
        if (!BOARDS.includes(dur)) return Response.json({ error: 'dur' }, { status: 400, headers: cors() });
        if (!Number.isFinite(alumnos) || alumnos < 6 || alumnos > 30) {
          return Response.json({ error: 'alumnos' }, { status: 400, headers: cors() });
        }
        const mins = Math.max(0, Math.min(55, Number(e.mins) || 0));
        const con = Math.max(0, Math.min(100, Math.round(Number(e.con) || 0)));
        const combo = Math.max(0, Math.min(99, Math.round(Number(e.combo) || 0)));
        lastHit.set(ip, now);
        const id = Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36);
        await up(env, [
          ['ZADD', 'cs1:lb:all', score, id],
          ['ZADD', 'cs1:lb:' + dur, score, id],
          ['HSET', 'cs1:run:' + id, 'name', cleanName(e.name), 'score', String(score), 'dur', dur,
            'alumnos', String(alumnos), 'win', e.win ? '1' : '0', 'mins', mins.toFixed(1),
            'con', String(con), 'combo', String(combo), 'date', new Date().toISOString().slice(0, 10)],
          ['ZREMRANGEBYRANK', 'cs1:lb:all', '0', '-101'],
          ['ZREMRANGEBYRANK', 'cs1:lb:' + dur, '0', '-101'],
        ]);
        let rank = null;
        try {
          const r = await fetch(env.UPSTASH_URL + '/zrevrank/cs1:lb:' + dur + '/' + id, {
            method: 'POST', headers: { Authorization: 'Bearer ' + env.UPSTASH_TOKEN },
          });
          if (r.ok) rank = (await r.json()).result;
        } catch {}
        return Response.json({ rank, id }, { headers: cors() });
      }
      return new Response('nah', { status: 404, headers: cors() });
    } catch (err) {
      return Response.json({ error: 'ups' }, { status: 500, headers: cors() });
    }
  },
};
