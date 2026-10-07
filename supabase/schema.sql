-- Visit Barichara — esquema de base de datos para Supabase
-- Ejecutar completo en el SQL Editor del proyecto de Supabase.

create extension if not exists "pgcrypto";

-- Tabla principal de negocios del directorio
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null check (
    category in ('experiencia', 'taller', 'transporte', 'evento', 'hotel', 'restaurante', 'comercio')
  ),
  zone text,
  description_es text,
  description_en text,
  phone text,
  whatsapp text,
  price_range text,
  price_from text,
  schedule text,
  duration text,
  map_url text,
  is_sample boolean not null default false,
  active boolean not null default false,
  next_payment_due date,
  created_at timestamptz not null default now()
);

create index if not exists businesses_active_idx on public.businesses (active);
create index if not exists businesses_category_idx on public.businesses (category);

-- Fotos asociadas a cada negocio (almacenadas en Supabase Storage)
create table if not exists public.business_photos (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  storage_path text not null,
  position integer not null default 0
);

create index if not exists business_photos_business_id_idx on public.business_photos (business_id);

-- Registro de clics al botón de WhatsApp de cada negocio (vía /go/[slug])
create table if not exists public.business_clicks (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  clicked_at timestamptz not null default now(),
  locale text not null check (locale in ('es', 'en'))
);

create index if not exists business_clicks_business_id_idx on public.business_clicks (business_id);

-- Row Level Security
alter table public.businesses enable row level security;
alter table public.business_photos enable row level security;
alter table public.business_clicks enable row level security;

-- Cualquier visitante (anon o autenticado) puede leer negocios activos
drop policy if exists "public read active businesses" on public.businesses;
create policy "public read active businesses"
  on public.businesses for select
  to anon, authenticated
  using (active = true);

-- El admin autenticado puede leer y gestionar todos los negocios
drop policy if exists "authenticated manage businesses" on public.businesses;
create policy "authenticated manage businesses"
  on public.businesses for all
  to authenticated
  using (true)
  with check (true);

-- Fotos: lectura pública solo si el negocio asociado está activo
drop policy if exists "public read photos of active businesses" on public.business_photos;
create policy "public read photos of active businesses"
  on public.business_photos for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.businesses b
      where b.id = business_photos.business_id and b.active = true
    )
  );

-- El admin autenticado puede gestionar todas las fotos
drop policy if exists "authenticated manage photos" on public.business_photos;
create policy "authenticated manage photos"
  on public.business_photos for all
  to authenticated
  using (true)
  with check (true);

-- Cualquiera puede registrar un clic (botón de WhatsApp público)
drop policy if exists "insert business clicks" on public.business_clicks;
create policy "insert business clicks"
  on public.business_clicks for insert
  to anon, authenticated
  with check (true);

-- Solo el admin autenticado puede leer los clics registrados
drop policy if exists "authenticated read business clicks" on public.business_clicks;
create policy "authenticated read business clicks"
  on public.business_clicks for select
  to authenticated
  using (true);

-- Bucket de Storage para las fotos de negocios (público para lectura)
insert into storage.buckets (id, name, public)
values ('business-photos', 'business-photos', true)
on conflict (id) do nothing;

drop policy if exists "public read business photos" on storage.objects;
create policy "public read business photos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'business-photos');

drop policy if exists "authenticated manage business photos" on storage.objects;
create policy "authenticated manage business photos"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'business-photos')
  with check (bucket_id = 'business-photos');
