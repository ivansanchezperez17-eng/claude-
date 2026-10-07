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

5. Levantar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abrir [http://localhost:3000](http://localhost:3000).

## Estructura

- `app/[locale]/` — páginas públicas (inicio, directorio, detalle de negocio) y panel `/admin`.
- `app/api/chat/` — endpoint del chat bot (usa Claude + la lista de negocios activos como contexto).
- `lib/supabase/` — clientes de Supabase para navegador y servidor, y helper de URLs de Storage.
- `lib/claude.ts` / `lib/barichara-guide.ts` — configuración del modelo y guía turística que alimenta el system prompt.
- `messages/es.json`, `messages/en.json` — textos traducidos de la interfaz pública.
- `supabase/schema.sql` — esquema de base de datos, políticas RLS y bucket de Storage.

## Notas

- Un negocio solo aparece en el sitio público si `active = true` (se usa como control de "pago al día").
- Las fotos se guardan en el bucket `business-photos` de Supabase Storage, organizadas por `business_id`.
- El chat bot solo recomienda negocios activos de la base de datos; si ninguno aplica, lo indica en vez de inventar.
