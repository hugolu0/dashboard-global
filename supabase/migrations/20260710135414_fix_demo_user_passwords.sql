/*
# Fix: actualizar contraseñas de usuarios demo

Los usuarios demo tenían el hash de "password" en lugar de "Demo1234!".
Esta migración recalcula el hash correcto con pgcrypto y lo aplica.
*/

UPDATE auth.users
SET
  encrypted_password = crypt('Demo1234!', gen_salt('bf', 10)),
  updated_at         = now()
WHERE email IN (
  'admin_sur@novastock.local',
  'admin_tec@novastock.local',
  'admin_norte@novastock.local'
);
