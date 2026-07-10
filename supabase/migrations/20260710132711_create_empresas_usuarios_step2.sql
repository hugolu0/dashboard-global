/*
# Empresas y Usuarios — Paso 2: políticas RLS

Agrega las políticas de Row Level Security ahora que ambas tablas existen.

## Políticas

### `usuarios`
- SELECT: cada usuario autenticado sólo puede leer su propio registro (auth_uid = auth.uid())
- UPDATE: cada usuario sólo puede actualizar su propio registro

### `empresas`
- SELECT: un usuario autenticado sólo puede leer la empresa a la que pertenece
*/

-- ================================================================
-- RLS: usuarios
-- ================================================================
DROP POLICY IF EXISTS "select_own_usuario" ON usuarios;
CREATE POLICY "select_own_usuario" ON usuarios
  FOR SELECT TO authenticated
  USING (auth_uid = auth.uid());

DROP POLICY IF EXISTS "update_own_usuario" ON usuarios;
CREATE POLICY "update_own_usuario" ON usuarios
  FOR UPDATE TO authenticated
  USING (auth_uid = auth.uid())
  WITH CHECK (auth_uid = auth.uid());

-- ================================================================
-- RLS: empresas
-- ================================================================
DROP POLICY IF EXISTS "select_own_empresa" ON empresas;
CREATE POLICY "select_own_empresa" ON empresas
  FOR SELECT TO authenticated
  USING (
    id = (
      SELECT empresa_id FROM usuarios
      WHERE auth_uid = auth.uid()
      LIMIT 1
    )
  );
