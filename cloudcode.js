// ============================================================
// Classroom Survival — validación del ranking (Back4App)
// Pégalo en Back4App → Cloud Code → Deploy.
// Solo deja guardar marcas válidas y con los campos exactos;
// combin teammate con CLP pública (Find+Count+Create) es suficiente.
// ============================================================

Parse.Cloud.beforeSave('Scores', (req) => {
  const o = req.object;
  const allowed = ['name', 'score', 'dur', 'alumnos', 'win', 'mins', 'con', 'combo', 'date'];

  // Elimina campos desconocidos (la base es schemaless).
  Object.keys(o.attributes).forEach((k) => {
    if (!allowed.includes(k)) o.unset(k);
  });

  // Nombre: 1-16 caracteres, sin < > { } / \.
  const rawName = String(o.get('name') ?? '');
  if (rawName.length < 1 || rawName.length > 16) throw 'nombre inválido';
  const name = rawName.replace(/[<>{}\/\\]/g, '').trim().slice(0, 16) || 'Anónimo';
  o.set('name', name);

  // Puntos: entero 1-99999.
  const score = o.get('score');
  if (!Number.isInteger(score) || score <= 0 || score > 99999) throw 'puntos inválidos';

  // Duración: solo las del juego.
  if (![5, 10, 15, 25, 50].includes(o.get('dur'))) throw 'duración inválida';

  // Alumnos: 6-30.
  const alumnos = o.get('alumnos');
  if (!Number.isInteger(alumnos) || alumnos < 6 || alumnos > 30) throw 'alumnos inválidos';

  // Resto: saneado a rango.
  const num = (v, a, b) => {
    v = Number(v);
    return Number.isFinite(v) ? Math.max(a, Math.min(b, v)) : a;
  };
  o.set('mins', Math.round(num(o.get('mins'), 0, 55) * 10) / 10);
  o.set('con', Math.round(num(o.get('con'), 0, 100)));
  o.set('combo', Math.round(num(o.get('combo'), 0, 99)));
  o.set('win', !!o.get('win'));
  o.set('date', String(o.get('date') || '').slice(0, 10));
});
