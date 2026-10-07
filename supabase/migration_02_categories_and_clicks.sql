-- Visit Barichara — migración incremental (fase 2) para proyectos que ya
-- tenían el esquema inicial (supabase/schema.sql) aplicado.
-- Ejecutar una sola vez en el SQL Editor de Supabase.

alter table public.businesses drop constraint businesses_category_check;
alter table public.businesses add constraint businesses_category_check
  check (category in ('hotel', 'restaurante', 'comercio', 'experiencia', 'taller', 'transporte', 'evento'));

alter table public.businesses add column if not exists price_from text;
alter table public.businesses add column if not exists schedule text;
alter table public.businesses add column if not exists duration text;
alter table public.businesses add column if not exists map_url text;
alter table public.businesses add column if not exists is_sample boolean not null default false;

create table if not exists public.business_clicks (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  clicked_at timestamptz not null default now(),
  locale text not null check (locale in ('es', 'en'))
);

create index if not exists business_clicks_business_id_idx on public.business_clicks (business_id);

alter table public.business_clicks enable row level security;

drop policy if exists "insert business clicks" on public.business_clicks;
create policy "insert business clicks"
  on public.business_clicks for insert
  to anon, authenticated
  with check (true);

drop policy if exists "authenticated read business clicks" on public.business_clicks;
create policy "authenticated read business clicks"
  on public.business_clicks for select
  to authenticated
  using (true);
