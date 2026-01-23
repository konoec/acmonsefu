create or replace function registrar_inscripcion(
  p_modalidad_id int,
  p_personas jsonb
)
returns int
language plpgsql
as $$
declare
  v_inscripcion_id int;
  persona jsonb;
  v_total_personas int;
begin
  -- ===============================
  -- 0. Validación básica de cantidad
  -- ===============================
  v_total_personas := jsonb_array_length(p_personas);

  if v_total_personas < 1 or v_total_personas > 2 then
    raise exception 'Cantidad inválida de participantes (solo 1 o 2 permitidos)';
  end if;

  -- ===============================
  -- 1. Insertar cabecera
  -- ===============================
  insert into inscripcion (
    id_modalidad,
    estado,
    fecha_registro
  )
  values (
    p_modalidad_id,
    'P',
    now()
  )
  returning id into v_inscripcion_id;

  -- ===============================
  -- 2. Insertar participantes
  -- ===============================
  for persona in
    select * from jsonb_array_elements(p_personas)
  loop

    -- 🔒 No repetir DNI en la MISMA modalidad
    if exists (
      select 1
      from detalle_inscripcion di
      join inscripcion i on i.id = di.inscripcion_id
      where di.dni = persona->>'dni'
        and i.id_modalidad = p_modalidad_id
        and di.estado not in ('X', 'I')
    ) then
      raise exception
        'El participante con DNI % ya está inscrito en esta modalidad',
        persona->>'dni';
    end if;

    -- 🔒 Sexo válido
    if persona->>'sexo' not in ('M','F') then
      raise exception 'Sexo inválido para el participante con DNI %', persona->>'dni';
    end if;

    -- 🔒 Validar regla de sexo (CORREGIDO)
    -- Se verifica que exista AL MENOS UNA regla que autorice el sexo ingresado.
    -- Puede ser:
    -- A) Una regla 'FM' (Pareja Mixta o Abierto)
    -- B) Una regla específica igual al sexo ingresado ('M' o 'F')
    if not exists (
      select 1
      from modalidad_regla_sexo
      where modalidad_id = p_modalidad_id
        and tipo_participacion_id = (persona->>'tipo_participacion_id')::int
        and estado = 'A'
        and (
            regla_sexo = 'FM'
            or
            regla_sexo = persona->>'sexo'
        )
    ) then
      raise exception
        'El sexo (%) del participante con DNI % no es válido según las reglas de esta categoría.',
        persona->>'sexo',
        persona->>'dni';
    end if;

    -- ✅ Insertar detalle
    insert into detalle_inscripcion (
      inscripcion_id,
      tipo_participacion_id,
      nombres,
      apellidos,
      dni,
      telefono,
      sexo,
      estado,
      fecha_registro
    )
    values (
      v_inscripcion_id,
      (persona->>'tipo_participacion_id')::int,
      persona->>'nombres',
      persona->>'apellidos',
      persona->>'dni',
      persona->>'telefono',
      persona->>'sexo',
      'P',
      now()
    );

  end loop;

  -- ===============================
  -- 3. OK
  -- ===============================
  return v_inscripcion_id;

exception
  when others then
    raise exception 'Error al registrar inscripción: %', sqlerrm;
end;
$$;
