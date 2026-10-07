-- Formulario de inscripción de negocios + configuración editable del sitio.

-- 1. Configuración: WhatsApp de contacto y precios de los planes ----------
insert into public.site_settings (key, value) values
  ('contact_whatsapp', '"573004678975"'::jsonb),
  ('plans', '{"basico": {"price_cop": 100000}, "destacado": {"price_cop": null}, "destacado_bilingue": {"price_cop": null}}'::jsonb)
on conflict (key) do nothing;

-- 2. Solicitudes que llegan por el formulario público ----------------------
create table if not exists public.business_applications (
  id uuid primary key default gen_random_uuid(),
  business_name text not null check (char_length(business_name) between 2 and 120),
  contact_name text not null check (char_length(contact_name) between 2 and 120),
  phone text not null check (phone ~ '^[0-9+ ()-]{7,20}$'),
  email text check (email is null or char_length(email) <= 200),
  category text not null check (
    category in ('experiencia', 'taller', 'transporte', 'evento', 'hotel', 'restaurante', 'comercio')
  ),
  description text not null check (char_length(description) between 10 and 1500),
  photo_paths text[] not null default '{}' check (cardinality(photo_paths) <= 8),
  authorized boolean not null check (authorized),
  privacy_accepted boolean not null check (privacy_accepted),
  locale text not null default 'es' check (locale in ('es', 'en')),
  status text not null default 'nueva' check (status in ('nueva', 'convertida', 'descartada')),
  business_id uuid references public.businesses (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.business_applications enable row level security;

-- El público solo puede crear solicitudes nuevas; nunca leerlas.
create policy "public submit applications"
  on public.business_applications for insert
  to anon, authenticated
  with check (status = 'nueva' and business_id is null);

create policy "admin manage applications"
  on public.business_applications for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- 3. Bucket PRIVADO para las fotos de las solicitudes ----------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('applications', 'applications', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- El público solo puede SUBIR a la carpeta pending/ (no ver, ni cambiar, ni borrar).
create policy "public upload application photos"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'applications' and (storage.foldername(name))[1] = 'pending');

create policy "admin manage application photos"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'applications' and (select public.is_admin()))
  with check (bucket_id = 'applications' and (select public.is_admin()));
