/*
# Fix: insertar identities para usuarios demo (sin columna email generada)
*/

INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'b1000001-0000-0000-0000-000000000001',
    'b1000001-0000-0000-0000-000000000001',
    '{"sub":"b1000001-0000-0000-0000-000000000001","email":"admin_sur@novastock.local","email_verified":true,"provider":"email"}',
    'email',
    now(), now(), now()
  ),
  (
    gen_random_uuid(),
    'b1000002-0000-0000-0000-000000000002',
    'b1000002-0000-0000-0000-000000000002',
    '{"sub":"b1000002-0000-0000-0000-000000000002","email":"admin_tec@novastock.local","email_verified":true,"provider":"email"}',
    'email',
    now(), now(), now()
  ),
  (
    gen_random_uuid(),
    'b1000003-0000-0000-0000-000000000003',
    'b1000003-0000-0000-0000-000000000003',
    '{"sub":"b1000003-0000-0000-0000-000000000003","email":"admin_norte@novastock.local","email_verified":true,"provider":"email"}',
    'email',
    now(), now(), now()
  )
ON CONFLICT (provider, provider_id) DO NOTHING;
