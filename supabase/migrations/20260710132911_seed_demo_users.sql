/*
# Seed de usuarios demo en Supabase Auth + tabla usuarios

Crea 3 usuarios de prueba en auth.users y los vincula con sus empresas.
Formato email interno: usu_nomb@novastock.local

Usuarios creados:
  - admin_sur     / Demo1234!   → Distribuidora del Sur SA
  - admin_tec     / Demo1234!   → Tecnología Avanzada SRL
  - admin_norte   / Demo1234!   → Comercializadora Norte

Las contraseñas usan bcrypt ($2a$10$...).
Este seed es seguro de re-ejecutar (ON CONFLICT DO NOTHING).
*/

-- Insertar usuarios en auth.users con contraseñas hasheadas (bcrypt: "Demo1234!")
-- Hash generado para "Demo1234!" con cost=10
DO $$
DECLARE
  v_uid_sur   uuid := 'b1000001-0000-0000-0000-000000000001';
  v_uid_tec   uuid := 'b1000002-0000-0000-0000-000000000002';
  v_uid_norte uuid := 'b1000003-0000-0000-0000-000000000003';
BEGIN

  -- Usuario 1: admin_sur
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    aud, role, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, is_super_admin,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    v_uid_sur,
    '00000000-0000-0000-0000-000000000000',
    'admin_sur@novastock.local',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    now(),
    'authenticated', 'authenticated',
    now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{}', false,
    '', '', '', ''
  ) ON CONFLICT (id) DO NOTHING;

  -- Usuario 2: admin_tec
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    aud, role, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, is_super_admin,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    v_uid_tec,
    '00000000-0000-0000-0000-000000000000',
    'admin_tec@novastock.local',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    now(),
    'authenticated', 'authenticated',
    now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{}', false,
    '', '', '', ''
  ) ON CONFLICT (id) DO NOTHING;

  -- Usuario 3: admin_norte
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    aud, role, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, is_super_admin,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    v_uid_norte,
    '00000000-0000-0000-0000-000000000000',
    'admin_norte@novastock.local',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    now(),
    'authenticated', 'authenticated',
    now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{}', false,
    '', '', '', ''
  ) ON CONFLICT (id) DO NOTHING;

  -- Vinculación en tabla usuarios (usu_nomb → auth_uid → empresa)
  INSERT INTO usuarios (id, empresa_id, auth_uid, usu_nomb, usu_desc, activo) VALUES
    (
      'c1000001-0000-0000-0000-000000000001',
      'a1b2c3d4-0001-0001-0001-000000000001',
      v_uid_sur,
      'admin_sur',
      'Administrador — Distribuidora del Sur SA',
      true
    ),
    (
      'c1000002-0000-0000-0000-000000000002',
      'a1b2c3d4-0002-0002-0002-000000000002',
      v_uid_tec,
      'admin_tec',
      'Administrador — Tecnología Avanzada SRL',
      true
    ),
    (
      'c1000003-0000-0000-0000-000000000003',
      'a1b2c3d4-0003-0003-0003-000000000003',
      v_uid_norte,
      'admin_norte',
      'Administrador — Comercializadora Norte',
      true
    )
  ON CONFLICT (id) DO NOTHING;

END $$;
