# Portfolio Setup - Instrucciones para Supabase

## Crear la tabla `portfolio`

Para que el nuevo item "Portfolio" funcione correctamente en el CMS, necesitas crear la siguiente tabla en Supabase.

### SQL para crear la tabla

Copia y ejecuta este SQL en el editor SQL de Supabase:

```sql
CREATE TABLE portfolio (
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

-- Crear índice para las búsquedas
CREATE INDEX portfolio_published_idx ON portfolio(published);
CREATE INDEX portfolio_created_at_idx ON portfolio(created_at);

-- Crear trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_portfolio_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_portfolio_updated_at_trigger
BEFORE UPDATE ON portfolio
FOR EACH ROW
EXECUTE FUNCTION update_portfolio_updated_at();
```

### Crear Storage Bucket para imágenes

También necesitas crear un bucket en Supabase Storage para almacenar las imágenes del portfolio:

1. Ve a **Storage** en tu proyecto Supabase
2. Haz clic en **New Bucket**
3. Nombre: `portfolio-images`
4. Asegúrate de que sea **Public** si quieres que las imágenes sean accesibles públicamente
5. Haz clic en **Create Bucket**

### Pasos en Supabase

1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Abre el **SQL Editor**
3. Haz clic en **New Query**
4. Copia y pega el SQL anterior
5. Haz clic en **Run** o presiona `Cmd+Enter`

¡Listo! Ahora puedes usar el nuevo item "Portfolio" en tu CMS.

## Estructura de la tabla

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID | Identificador único |
| `title` | TEXT | Título del proyecto |
| `category` | TEXT | Categoría (Diseño Web, Marketing, etc.) |
| `description` | TEXT | Descripción del proyecto con HTML/formato |
| `image_url` | TEXT | URL de la imagen del proyecto |
| `project_url` | TEXT | URL externa del proyecto |
| `published` | BOOLEAN | Indica si está publicado o en borrador |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |
