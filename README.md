# Visit Barichara

Directorio bilingüe (es/en) de hoteles, restaurantes y comercios de Barichara, Santander. Incluye panel de administración con CRUD de negocios y fotos, y un chat bot guía turístico impulsado por Claude.

Stack: Next.js 16 (App Router + Turbopack), next-intl, Supabase (Postgres + Auth + Storage), Anthropic SDK.

## Configuración

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Crear un proyecto en [Supabase](https://supabase.com) y ejecutar `supabase/schema.sql` completo en el SQL Editor del proyecto. Esto crea las tablas `businesses` y `business_photos`, las políticas de RLS y el bucket público `business-photos`.

3. Crear el usuario administrador en **Authentication → Users** del proyecto de Supabase (correo + contraseña). Con ese usuario se inicia sesión en `/admin/login`.

4. Copiar `.env.example` a `.env.local` y completar:

   - `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`: en Project Settings → API del proyecto de Supabase.
   - `ANTHROPIC_API_KEY`: en [console.anthropic.com](https://console.anthropic.com) (necesaria para el chat bot; sin ella el bot responde con un mensaje de "no configurado" en vez de fallar).
   - `NEXT_PUBLIC_SITE_URL`: dominio público del sitio, para el SEO (hreflang, sitemap.xml).
   - `NEXT_PUBLIC_SOLUTIONS_WHATSAPP`: WhatsApp de contacto en la página "¿Tienes un negocio?" (opcional; sin ella el botón queda deshabilitado con un aviso).

   Si el proyecto de Supabase ya tenía el esquema inicial aplicado, corre también `supabase/migration_02_categories_and_clicks.sql` y `supabase/migration_03_website_instagram_source.sql` para quedar al día. Opcionalmente `supabase/seed_sample_businesses.sql` para ver el directorio lleno con negocios de ejemplo (`is_sample = true`), o `supabase/seed_verified_businesses.sql` para cargar los negocios reales investigados (quedan con `active = false`, revisar y activar desde `/admin`).

5. Levantar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abrir [http://localhost:3000](http://localhost:3000).

## Estructura

- `app/[locale]/` — páginas públicas (inicio, directorio, detalle de negocio, `/negocios` y `/business` para dueños de negocio, política de privacidad) y panel `/admin`.
- `app/go/[slug]/` — redirección de WhatsApp: registra el clic en `business_clicks` y manda a `wa.me` con el mensaje en el idioma correcto.
- `app/api/chat/` — endpoint del chat bot (usa Claude + la lista de negocios activos como contexto).
- `app/sitemap.ts` — sitemap.xml dinámico (páginas estáticas + cada negocio activo, en ambos idiomas).
- `lib/supabase/` — clientes de Supabase para navegador y servidor, y helper de URLs de Storage.
- `lib/claude.ts` / `lib/barichara-guide.ts` — configuración del modelo y guía turística que alimenta el system prompt.
- `lib/attractions.ts` — contenido estático de "Qué hacer en Barichara" del inicio.
- `messages/es.json`, `messages/en.json` — textos traducidos de la interfaz pública.
- `supabase/schema.sql` — esquema completo para un proyecto nuevo. `supabase/migration_02_categories_and_clicks.sql` y `supabase/seed_sample_businesses.sql` — incrementales para un proyecto que ya tenía el esquema inicial.

## Notas

- Un negocio solo aparece en el sitio público si `active = true` (se usa como control de "pago al día").
- Categorías: `experiencia`, `taller`, `transporte`, `evento`, `hotel`, `restaurante`, `comercio` — Experiencias va primero en el inicio y el directorio.
- Las fotos se guardan en el bucket `business-photos` de Supabase Storage, organizadas por `business_id`.
- El chat bot solo recomienda negocios activos de la base de datos; si ninguno aplica, lo indica en vez de inventar.
- El hero del inicio busca `/public/hero-barichara.jpg`; si el archivo no existe simplemente no se muestra y queda el degradado de respaldo — basta con poner ahí una foto con ese nombre exacto para que aparezca, sin tocar código.
- Los negocios con `is_sample = true` llevan la etiqueta "Ejemplo" en el directorio; se pueden borrar en bloque con `delete from public.businesses where is_sample = true;` cuando haya negocios reales en esas categorías.
