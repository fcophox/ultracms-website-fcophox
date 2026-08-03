# Portfolio Setup - SQL Completo con RLS

Si ya ejecutaste el primer SQL, ejecuta ESTE SQL que incluye las políticas de seguridad (RLS) necesarias.

## SQL Completo para Portfolio

Copia y pega TODO esto en el SQL Editor de Supabase y ejecútalo:

```sql
-- 1. Crear la tabla portfolio (si no existe)
CREATE TABLE IF NOT EXISTS portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT,
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear índices
CREATE INDEX IF NOT EXISTS portfolio_published_idx ON portfolio(published);
CREATE INDEX IF NOT EXISTS portfolio_created_at_idx ON portfolio(created_at);

-- 3. Crear trigger para updated_at
CREATE OR REPLACE FUNCTION update_portfolio_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_portfolio_updated_at_trigger ON portfolio;
CREATE TRIGGER update_portfolio_updated_at_trigger
BEFORE UPDATE ON portfolio
FOR EACH ROW
EXECUTE FUNCTION update_portfolio_updated_at();

-- 4. Habilitar RLS
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

-- 5. Crear políticas de RLS
DROP POLICY IF EXISTS "Anyone can view published portfolio" ON portfolio;
DROP POLICY IF EXISTS "Authenticated users can insert portfolio" ON portfolio;
DROP POLICY IF EXISTS "Authenticated users can update own portfolio" ON portfolio;
DROP POLICY IF EXISTS "Authenticated users can delete own portfolio" ON portfolio;

-- Permitir a cualquiera ver proyectos publicados
CREATE POLICY "Anyone can view published portfolio" ON portfolio
FOR SELECT USING (published = true OR auth.uid() IS NOT NULL);

-- Permitir a usuarios autenticados crear proyectos
CREATE POLICY "Authenticated users can insert portfolio" ON portfolio
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Permitir a usuarios autenticados actualizar
CREATE POLICY "Authenticated users can update own portfolio" ON portfolio
FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Permitir a usuarios autenticados eliminar
CREATE POLICY "Authenticated users can delete own portfolio" ON portfolio
FOR DELETE USING (auth.uid() IS NOT NULL);
```

## Pasos:

1. Ve a tu proyecto en **Supabase**
2. Abre **SQL Editor**
3. Haz clic en **New Query**
4. Copia y pega el SQL anterior COMPLETO
5. Haz clic en **Run**
6. Espera a que termine

## ¿Ya ejecutaste? Verifica:

Ejecuta esta consulta de prueba para confirmar que funciona:

```sql
SELECT COUNT(*) FROM portfolio;
```

Si devuelve un número (ejemplo: 0), ¡está funcionando!

## Crear el Bucket en Storage

Luego de ejecutar el SQL, crea el bucket en **Storage**:

1. Ve a **Storage** en Supabase
2. Haz clic en **+ Create a new bucket**
3. **Name**: `portfolio-images`
4. Marca ✅ **Public bucket**
5. Haz clic en **Create bucket**

¡Listo! Ahora todo debería funcionar.
