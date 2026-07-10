/*
# Empresas y Usuarios — Paso 1: tablas base

Crea las tablas `empresas` y `usuarios` con RLS habilitado.
Las políticas de `empresas` se agregan en el paso 2 (después de que `usuarios` existe).

## Tablas nuevas

### `empresas`
- `id` uuid PK
- `empresa_nomb` — Nombre de la empresa/cliente
- `api_url` — URL base de la API REST propia de cada empresa
- `api_key` — Token opcional para la API
- `activa` — Estado de la empresa
- `created_at`

### `usuarios`
- `id` uuid PK
- `empresa_id` — FK → empresas (cada usuario pertenece a una empresa)
- `auth_uid` — FK → auth.users (vincula con Supabase Auth)
- `usu_nomb` — Nombre de usuario único (se usa para el login)
- `usu_desc` — Nombre completo / descripción
- `activo`
- `created_at`
*/

-- ================================================================
-- EMPRESAS
-- ================================================================
CREATE TABLE IF NOT EXISTS empresas (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_nomb  text NOT NULL,
  api_url       text NOT NULL,
  api_key       text,
  activa        boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- USUARIOS
-- ================================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id  uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  auth_uid    uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  usu_nomb    text NOT NULL UNIQUE,
  usu_desc    text,
  activo      boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- DATOS DE EJEMPLO
-- ================================================================
INSERT INTO empresas (id, empresa_nomb, api_url, activa) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 'Distribuidora del Sur SA',  'https://api.distrosur.com/v1',     true),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'Tecnología Avanzada SRL',   'https://api.tecnoavanzada.com/v1', true),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'Comercializadora Norte',    'https://api.comnorte.com/v1',      true)
ON CONFLICT (id) DO NOTHING;
