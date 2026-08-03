# Políticas de RLS para Storage - Portfolio

El error al subir imágenes indica que falta configurar las políticas de RLS en el bucket `portfolio-images`.

## SQL para agregar políticas de Storage

Copia y ejecuta esto en tu SQL Editor de Supabase:

```sql
-- Crear tabla storage.objects si no existe (normalmente ya existe)
-- Solo ejecutar si recibes error de tabla no encontrada

-- Políticas para el bucket portfolio-images
-- Permitir que usuarios autenticados suban imágenes
CREATE POLICY "Allow authenticated users to upload portfolio images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio-images' 
  AND auth.uid() IS NOT NULL
);

-- Permitir que usuarios autenticados actualicen sus imágenes
CREATE POLICY "Allow authenticated users to update portfolio images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'portfolio-images' AND auth.uid() IS NOT NULL)
WITH CHECK (bucket_id = 'portfolio-images' AND auth.uid() IS NOT NULL);

-- Permitir que usuarios autenticados eliminen sus imágenes
CREATE POLICY "Allow authenticated users to delete portfolio images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'portfolio-images' AND auth.uid() IS NOT NULL);

-- Permitir a cualquiera ver las imágenes públicas
CREATE POLICY "Allow public to view portfolio images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'portfolio-images');
```

## Pasos:

1. **Ve a Supabase** → Tu proyecto
2. **SQL Editor** → New Query
3. **Copia y pega** el SQL anterior
4. **Ejecuta** (Cmd+Enter o botón Run)

## Si aún sigue sin funcionar:

Si después de aplicar las políticas sigue sin funcionar, probablemente sea un problema con cómo se está capturando el error. En ese caso, prueba esto:

1. Haz login en el dashboard
2. Intenta subir una imagen nuevamente
3. Comparte el error exacto que aparece

¿Ya ejecutaste estas políticas de storage?
