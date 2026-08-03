# Actualizar Portfolio Config - Agregar Visibilidad

Ejecuta este SQL en Supabase SQL Editor para agregar el campo de visibilidad:

```sql
-- Agregar columna visible a portfolio_config
ALTER TABLE portfolio_config 
ADD COLUMN visible BOOLEAN DEFAULT false;

-- Actualizar la configuración existente para que sea visible
UPDATE portfolio_config SET visible = false WHERE visible IS NULL;
```

¡Listo! Ahora el portfolio tiene control de visibilidad.
