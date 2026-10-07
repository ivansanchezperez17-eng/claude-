-- Visit Barichara — migración incremental (fase 4) para proyectos que ya
-- tenían aplicado supabase/migration_02_categories_and_clicks.sql.
-- Ejecutar una sola vez en el SQL Editor de Supabase.

alter table public.businesses add column if not exists website text;
alter table public.businesses add column if not exists instagram text;
alter table public.businesses add column if not exists source_url text;
