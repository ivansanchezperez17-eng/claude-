-- Precios estructurados en pesos colombianos + configuración del sitio.
-- El texto libre "price_from" queda solo como respaldo histórico.

alter table public.businesses
  add column if not exists price_from_cop integer check (price_from_cop is null or price_from_cop >= 0),
  add column if not exists price_unit text,
  add column if not exists price_type text not null default 'fijo';

alter table public.businesses drop constraint if exists businesses_price_unit_check;
alter table public.businesses add constraint businesses_price_unit_check
  check (price_unit is null or price_unit in ('persona', 'noche', 'entrada', 'pieza', 'trayecto'));

alter table public.businesses drop constraint if exists businesses_price_type_check;
alter table public.businesses add constraint businesses_price_type_check
  check (price_type in ('fijo', 'voluntario', 'gratis'));

-- Configuración editable (tasa del dólar, precios de planes, etc.)
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;

create policy "public read site settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "admin manage site settings"
  on public.site_settings for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- TRM del 6 de octubre de 2026 (fuente: capitalcolombia.com / mundonow.com)
insert into public.site_settings (key, value)
values ('usd_cop_rate', '3210'::jsonb)
on conflict (key) do nothing;

-- Conversión de los precios existentes. Los que venían en dólares
-- (plataformas como Civitatis o Booking, tarifas dinámicas) se pasan a COP
-- con la TRM de 3.210 y se redondean al millar.
update public.businesses set price_from_cop = 42000,  price_unit = 'persona'  where slug = 'alex-barichara-visita-guiada';
update public.businesses set price_from_cop = 898000, price_unit = 'persona'  where slug = 'bnb-colombia-coffee-tour';
update public.businesses set price_from_cop = 474000, price_unit = 'persona'  where slug = 'bnb-colombia-history-tour';
update public.businesses set price_from_cop = 80000,  price_unit = 'persona'  where slug = 'civitatis-camino-real-guane';
update public.businesses set price_from_cop = 414000, price_unit = 'noche'    where slug = 'casa-barichara-boutique';
update public.businesses set price_from_cop = 311000, price_unit = 'noche'    where slug = 'nativo-eco-hotel';
update public.businesses set price_from_cop = 427000, price_unit = 'noche'    where slug = 'santa-sofia-casa-boutique';
update public.businesses set price_from_cop = 109000, price_unit = 'persona'  where slug = 'civitatis-taller-artesania';
update public.businesses set price_from_cop = 109000, price_unit = 'trayecto' where slug = 'daytrip-transfers';

update public.businesses set price_from_cop = 15000,  price_unit = 'pieza'    where slug = 'tienda-ceramica-ejemplo';
update public.businesses set price_from_cop = 100000, price_unit = 'persona'  where slug = 'cabalgata-atardecer-ejemplo';
update public.businesses set price_from_cop = 80000,  price_unit = 'persona'  where slug = 'tour-fotografico-ejemplo';
update public.businesses set price_from_cop = 150000, price_unit = 'noche'    where slug = 'posada-ejemplo';
update public.businesses set price_from_cop = 20000,  price_unit = 'persona'  where slug = 'fogon-muestra';
update public.businesses set price_from_cop = 3000,   price_unit = 'entrada'  where slug = 'taller-papel-san-lorenzo';
update public.businesses set price_from_cop = 65000,  price_unit = 'persona'  where slug = 'taller-talla-piedra-ejemplo';
update public.businesses set price_from_cop = 6500,   price_unit = 'trayecto' where slug = 'cotrasangil';
update public.businesses set price_from_cop = 25000,  price_unit = 'persona'  where slug = 'transporte-sangil-ejemplo';

update public.businesses set price_type = 'voluntario' where slug in ('guruwalk-barichara-magica', 'macondo-project-free-tour');
update public.businesses set price_type = 'gratis'     where slug = 'festival-cuadros-ejemplo';
