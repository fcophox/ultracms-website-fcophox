# Configuración de Portfolio - Templates

Ejecuta este SQL en Supabase SQL Editor para crear la tabla de configuración:

```sql
-- Crear tabla de configuración del portfolio
CREATE TABLE IF NOT EXISTS portfolio_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_type TEXT DEFAULT 'grid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice
CREATE INDEX IF NOT EXISTS portfolio_config_template_idx ON portfolio_config(template_type);

-- Habilitar RLS
ALTER TABLE portfolio_config ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS
DROP POLICY IF EXISTS "Anyone can view portfolio config" ON portfolio_config;
DROP POLICY IF EXISTS "Authenticated users can update config" ON portfolio_config;

CREATE POLICY "Anyone can view portfolio config" ON portfolio_config
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update config" ON portfolio_config
FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert config" ON portfolio_config
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Insertar configuración por defecto
INSERT INTO portfolio_config (template_type) VALUES ('grid')
ON CONFLICT DO NOTHING;
```

## Pasos:

1. Ve a **SQL Editor** en Supabase
2. **New Query**
3. Copia y pega el SQL anterior
4. **Run**

¡Listo! Ahora ejecuta y luego procede con los cambios en el código.
