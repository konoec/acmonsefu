-- =============================================================
-- AC MONSEFÚ — Esquema Supabase (Festival Golpe Tierra)
-- -------------------------------------------------------------
-- Esquema recuperado del historial del repo (la base anterior
-- fue eliminada). Ejecutar en el SQL Editor del proyecto nuevo.
-- Ajustar seed data e IDs según la convocatoria 2027.
-- =============================================================

-- ---------- Tablas ----------
create table if not exists public.modalidad (
  id        int primary key,
  nombre    text not null,
  estado    text not null default 'A'   -- A=activa, I=inactiva
);

create table if not exists public.tipo_participacion (
  id                int primary key,
  nombre            text not null,
  cantidad_minima   int not null default 1,
  cantidad_maxima   int not null default 2
);

create table if not exists public.modalidad_tipo (
  modalidad_id          int not null references public.modalidad(id) on delete cascade,
  tipo_participacion_id int not null references public.tipo_participacion(id) on delete cascade,
  primary key (modalidad_id, tipo_participacion_id)
);

create table if not exists public.modalidad_regla_sexo (
  modalidad_id          int not null references public.modalidad(id) on delete cascade,
  tipo_participacion_id int not null references public.tipo_participacion(id) on delete cascade,
  regla_sexo            text not null default 'A',  -- M, F, X (dama+varón), LIBRE/A
  primary key (modalidad_id, tipo_participacion_id)
);

create table if not exists public.categoria (
  id     int primary key,
  nombre text not null
);

create table if not exists public.modalidad_categoria (
  modalidad_id int not null references public.modalidad(id) on delete cascade,
  categoria_id int not null references public.categoria(id) on delete cascade,
  estado       text not null default 'A',
  primary key (modalidad_id, categoria_id)
);

create table if not exists public.inscripcion (
  id            bigint generated always as identity primary key,
  id_modalidad  int not null references public.modalidad(id),
  categoria_id  int not null references public.categoria(id),
  academia      text not null,
  estado        text not null default 'P',  -- A=aprobado, P=pendiente, I=inactivo
  fecha_registro timestamptz not null default now()
);

create table if not exists public.detalle_inscripcion (
  id                   bigint generated always as identity primary key,
  inscripcion_id       bigint not null references public.inscripcion(id) on delete cascade,
  tipo_participacion_id int not null references public.tipo_participacion(id),
  nombres              text not null,
  apellidos            text not null,
  dni                  text not null,
  telefono             text not null,
  sexo                 text not null,
  fecha_nacimiento     date not null
);

-- ---------- Función de registro ----------
create or replace function public.registrar_inscripcion(
  p_modalidad_id int,
  p_categoria_id int,
  p_academia text,
  p_personas jsonb
) returns public.inscripcion
language plpgsql
security definer set search_path = public
as $$
declare
  v_inscripcion public.inscripcion;
  v_persona jsonb;
begin
  insert into public.inscripcion (id_modalidad, categoria_id, academia, estado)
  values (p_modalidad_id, p_categoria_id, p_academia, 'P')
  returning * into v_inscripcion;

  for v_persona in select * from jsonb_array_elements(p_personas)
  loop
    insert into public.detalle_inscripcion (
      inscripcion_id, tipo_participacion_id, nombres, apellidos, dni,
      telefono, sexo, fecha_nacimiento
    ) values (
      v_inscripcion.id,
      (v_persona->>'tipo_participacion_id')::int,
      v_persona->>'nombres',
      v_persona->>'apellidos',
      v_persona->>'dni',
      v_persona->>'telefono',
      v_persona->>'sexo',
      (v_persona->>'fecha_nacimiento')::date
    );
  end loop;

  return v_inscripcion;
end;
$$;

-- ---------- Row Level Security ----------
alter table public.modalidad            enable row level security;
alter table public.tipo_participacion   enable row level security;
alter table public.modalidad_tipo       enable row level security;
alter table public.modalidad_regla_sexo enable row level security;
alter table public.categoria            enable row level security;
alter table public.modalidad_categoria  enable row level security;
alter table public.inscripcion          enable row level security;
alter table public.detalle_inscripcion  enable row level security;

-- Lectura pública de catálogos (modalidades, categorías, tipos)
create policy "catálogos: lectura pública" on public.modalidad
  for select using (true);
create policy "catálogos: lectura pública" on public.tipo_participacion
  for select using (true);
create policy "catálogos: lectura pública" on public.categoria
  for select using (true);
create policy "catálogos: lectura pública" on public.modalidad_tipo
  for select using (true);
create policy "catálogos: lectura pública" on public.modalidad_regla_sexo
  for select using (true);
create policy "catálogos: lectura pública" on public.modalidad_categoria
  for select using (true);

-- Inserción pública vía la función RPC (security definer)
create policy "registro: inserción pública" on public.inscripcion
  for insert with check (true);
create policy "registro: inserción pública" on public.detalle_inscripcion
  for insert with check (true);

-- Admin (usuario autenticado) puede leer y actualizar inscripciones
create policy "admin: lectura" on public.inscripcion
  for select to authenticated using (true);
create policy "admin: actualización" on public.inscripcion
  for update to authenticated using (true) with check (true);
create policy "admin: lectura" on public.detalle_inscripcion
  for select to authenticated using (true);
create policy "admin: actualización" on public.detalle_inscripcion
  for update to authenticated using (true) with check (true);

-- =============================================================
-- SEED DATA (referencia convocatoria 2026 — ajustar para 2027)
-- =============================================================
-- insert into public.modalidad (id, nombre, estado) values
--   (1, 'Tondero', 'A'),
--   (2, 'Marinera Tradicional', 'A'),
--   (3, 'Marinera Norteña', 'A'),
--   (4, 'Baile Tierra', 'A');
-- insert into public.categoria (id, nombre) values
--   (1, 'Infantil'), (2, 'Junior'), (3, 'Juvenil'), (4, 'Adultos'),
--   (5, 'Pre Infante'), (6, 'Infante'), (7, 'Senior');
-- insert into public.tipo_participacion (id, nombre, cantidad_minima, cantidad_maxima) values
--   (1, 'Individual', 1, 1),
--   (2, 'Pareja', 2, 2),
--   (3, 'Seriado', 1, 4);
-- insert into public.modalidad_tipo (modalidad_id, tipo_participacion_id) values
--   (1, 1), (1, 2), (2, 2), (3, 1), (3, 3), (4, 2);
-- insert into public.modalidad_regla_sexo (modalidad_id, tipo_participacion_id, regla_sexo) values
--   (1, 1, 'F'), (1, 2, 'X'), (2, 2, 'X'), (3, 1, 'A'), (3, 3, 'F'), (4, 2, 'X');
-- insert into public.modalidad_categoria (modalidad_id, categoria_id, estado) values
--   (1, 1, 'A'), (1, 2, 'A'), (1, 3, 'A'), (1, 4, 'A'),
--   (2, 1, 'A'), (2, 2, 'A'), (2, 3, 'A'), (2, 4, 'A'),
--   (3, 5, 'A'), (3, 6, 'A'), (3, 1, 'A'), (3, 2, 'A'),
--   (4, 1, 'A'), (4, 2, 'A'), (4, 4, 'A');
-- =============================================================