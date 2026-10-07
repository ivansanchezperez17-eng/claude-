-- Estados de publicación, administrador único y demo con contraseña.
-- La contraseña de la demo NO va en este archivo: se fija aparte con
--   insert into private.demo_settings (id, password_hash)
--   values (1, extensions.crypt('LA-CONTRASEÑA', extensions.gen_salt('bf')))
--   on conflict (id) do update set password_hash = excluded.password_hash;

-- 1. Estado, plan y autorización de cada negocio ---------------------------
alter table public.businesses
  add column if not exists status text not null default 'borrador',
  add column if not exists plan text,
  add column if not exists authorized_at timestamptz,
  add column if not exists authorized_by text,
  add column if not exists authorization_channel text;

alter table public.businesses drop constraint if exists businesses_status_check;
alter table public.businesses add constraint businesses_status_check
  check (status in ('borrador', 'aprobado', 'rechazado'));

alter table public.businesses drop constraint if exists businesses_plan_check;
alter table public.businesses add constraint businesses_plan_check
  check (plan is null or plan in ('basico', 'destacado', 'destacado_bilingue'));

alter table public.businesses drop constraint if exists businesses_authorization_channel_check;
alter table public.businesses add constraint businesses_authorization_channel_check
  check (authorization_channel is null or authorization_channel in ('whatsapp', 'correo', 'firma', 'formulario'));

-- Ningún negocio real ha autorizado aún: todos a borrador. Los de ejemplo
-- son ficticios y se muestran como aprobados.
update public.businesses
set status = case when is_sample then 'aprobado' else 'borrador' end
where true;

-- Los negocios genéricos de la primera carga, nunca reconfirmados con fuente,
-- quedan rechazados: no salen ni en público ni en la demo.
update public.businesses
set status = 'rechazado'
where is_sample = false and source_url is null;

create index if not exists businesses_status_idx on public.businesses (status);

-- 2. Administradores -------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
-- Sin políticas a propósito: nadie la lee ni la escribe por la API.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

insert into public.admins (user_id)
select id from auth.users where email = 'ivansanchezperez17@gmail.com'
on conflict (user_id) do nothing;

-- 3. Políticas: el público solo ve aprobados; solo el admin administra ----
-- Nota: en el proyecto en producción las políticas viejas se neutralizaron
-- con "alter policy ... using (false)" en vez de borrarse (la herramienta
-- de Supabase pide confirmación humana para DROP). No dan acceso a nada.
-- Para borrarlas del todo, correr en el SQL Editor:
--   drop policy "authenticated full access businesses" on public.businesses;
--   drop policy "public can read active businesses" on public.businesses;
--   drop policy "authenticated full access photos" on public.business_photos;
--   drop policy "public can read photos of active businesses" on public.business_photos;
drop policy if exists "public can read active businesses" on public.businesses;
drop policy if exists "public read active businesses" on public.businesses;
drop policy if exists "authenticated full access businesses" on public.businesses;
drop policy if exists "authenticated manage businesses" on public.businesses;

create policy "public read approved businesses"
  on public.businesses for select
  to anon, authenticated
  using (status = 'aprobado');

create policy "admin manage businesses"
  on public.businesses for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "public can read photos of active businesses" on public.business_photos;
drop policy if exists "public read photos of active businesses" on public.business_photos;
drop policy if exists "authenticated full access photos" on public.business_photos;
drop policy if exists "authenticated manage photos" on public.business_photos;

create policy "public read photos of approved businesses"
  on public.business_photos for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.businesses b
      where b.id = business_photos.business_id and b.status = 'aprobado'
    )
  );

create policy "admin manage photos"
  on public.business_photos for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "insert business clicks" on public.business_clicks;
drop policy if exists "authenticated read business clicks" on public.business_clicks;

create policy "insert clicks for approved businesses"
  on public.business_clicks for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = business_clicks.business_id and b.status = 'aprobado'
    )
  );

create policy "admin read business clicks"
  on public.business_clicks for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "authenticated manage business photos" on storage.objects;
create policy "admin manage business photos"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'business-photos' and (select public.is_admin()))
  with check (bucket_id = 'business-photos' and (select public.is_admin()));

-- 4. Demo con contraseña ---------------------------------------------------
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.demo_settings (
  id int primary key default 1 check (id = 1),
  password_hash text not null
);

create or replace function public.demo_check(p_password text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from private.demo_settings
    where password_hash = extensions.crypt(p_password, password_hash)
  );
$$;

create or replace function public.demo_businesses(p_password text)
returns setof public.businesses
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.demo_check(p_password) then
    raise exception 'invalid demo password' using errcode = '28P01';
  end if;
  return query
    select * from public.businesses
    where status in ('borrador', 'aprobado')
    order by name;
end;
$$;

create or replace function public.demo_business(p_password text, p_slug text)
returns setof public.businesses
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.demo_check(p_password) then
    raise exception 'invalid demo password' using errcode = '28P01';
  end if;
  return query
    select * from public.businesses
    where slug = p_slug and status in ('borrador', 'aprobado');
end;
$$;

revoke all on function public.demo_check(text) from public;
revoke all on function public.demo_businesses(text) from public;
revoke all on function public.demo_business(text, text) from public;
grant execute on function public.demo_check(text) to anon, authenticated;
grant execute on function public.demo_businesses(text) to anon, authenticated;
grant execute on function public.demo_business(text, text) to anon, authenticated;
