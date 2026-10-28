-- ============================================================
-- Classroom Survival — ranking mundial (Supabase)
-- Pégalo entero en Supabase → SQL Editor → New query → Run.
-- Crea la tabla + seguridad: cualquiera puede LEER el top y
-- AÑADIR marcas válidas; nadie puede modificar ni borrar nada.
-- ============================================================

create table if not exists public.scores (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  name text not null check (char_length(name) between 1 and 16),
  score int not null check (score > 0 and score <= 99999),
  dur smallint not null check (dur in (5, 10, 15, 25, 50)),
  alumnos smallint not null check (alumnos between 6 and 30),
  win boolean not null default false,
  mins numeric(4, 1) not null default 0 check (mins >= 0 and mins <= 55),
  con smallint not null default 0 check (con between 0 and 100),
  combo smallint not null default 0 check (combo between 0 and 99)
);

alter table public.scores enable row level security;

drop policy if exists "leer top" on public.scores;
create policy "leer top" on public.scores
  for select using (true);

drop policy if exists "insertar marca valida" on public.scores;
create policy "insertar marca valida" on public.scores
  for insert with check (
    score > 0 and score <= 99999
    and dur in (5, 10, 15, 25, 50)
    and alumnos between 6 and 30
    and char_length(name) between 1 and 16
  );

-- Sin políticas de update/delete: ni siquiera el propio jugador
-- puede editar ni borrar puntuaciones desde el juego.
