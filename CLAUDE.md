<!-- Reglas permanentes -->

# SeR MigranteS — MVP web

Plataforma en español que acompaña a personas migrantes en España: microrelatos (ejemplos de casos para prueba en el MVP), FAQs, servicios y contacto. Marca: «SeR MigranteS». Objetivo del MVP: validar confianza, tráfico SEO y contactos con coste cero o mínimo.

## Stack (no añadir nada fuera de esto sin pedir permiso)
- Next.js (App Router) + TypeScript estricto + Tailwind CSS.
- Postgres en Supabase (plan gratuito). Clientes: `@supabase/supabase-js` + `@supabase/ssr`.
- Hosting: Vercel (plan gratuito) conectado a Supabase.
- Sin backend separado: la lógica de servidor va, de forma provisional, en Server Components, Server Actions y Route Handlers de Next.js.
- El MVP NO tiene panel de administración ni login. El contenido se gestiona desde el panel de Supabase (Table Editor) o con SQL.

## Comandos
- `npm run dev` — desarrollo local (http://localhost:3000)
- `npm run build` — build de producción (debe pasar antes de cada commit)
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`

## Estructura prevista
- `src/app/` rutas públicas y route handlers
- `src/components/` componentes de UI
- `src/lib/supabase/` clientes Supabase (`client.ts`, `server.ts`)
- `src/lib/data/` funciones tipadas de acceso a datos (una por entidad)
- `src/types/` tipos (incluye los generados de Supabase)
- `supabase/migrations/` SQL versionado (incluye la inserción de los datos de arranque de Base44, salvo `comision_modelo`)
- `supabase/private/` SQL local con datos comerciales privados (`servicios_comisiones.sql`). Ignorado por Git: NUNCA subirlo
- `public/` logo y estáticos
- `reference/base44/` SOLO material de consulta: UI, esquema y datos de prueba exportados de Base44
- `reference/brand/` logo y material de marca
- `docs/` documentación

## Convenciones
- Textos de la interfaz en español de España, tono cercano, claro y digno (nunca paternalista).
- Código (componentes, funciones, variables) en inglés; tablas y columnas de BD en español, snake_case, sin tildes (ej. `microrelatos`, `fecha_publicacion`).
- Server Components por defecto; `"use client"` solo si es imprescindible.
- Mobile-first y accesible (HTML semántico, contraste AA, foco visible, `alt`, `label` en formularios).
- Colores y tipografías: extraer de `reference/base44` y centralizar en tokens de Tailwind. Logo: `reference/brand/`.
- Cambios pequeños y enfocados; no refactorizar fuera de la tarea.

## Reglas de seguridad y privacidad (obligatorias)
- NUNCA exponer `SUPABASE_SECRET_KEY` al cliente ni usar `NEXT_PUBLIC_` con secretos.
- NUNCA commitear `.env*` (salvo `.env.example` sin valores).
- RLS activado en TODAS las tablas. Público: solo SELECT de contenido con `estado = 'publicado'` (microrelatos, faqs) y servicios `activo`. `solicitudes_contacto`: solo INSERT para público, sin SELECT público. No crear políticas de escritura para usuarios anónimos en otras tablas.
- Datos personales mínimos: no registrar datos del formulario en logs ni en consola; consentimiento explícito obligatorio.
- Los microrelatos son ejemplos de casos para prueba. No son reales, pero se usarán para este MVP; los reales se subirán más adelante y se eliminarán los de prueba (fuera de las fases actuales). No inventar casos, cifras ni datos legales.
- Los datos de Base44 (6 microrelatos, 12 FAQs) son de PRUEBA y se cargan como datos de arranque con `origen = 'base44_prueba'` (no es valor por defecto). `origen` existe solo en `microrelatos` y `faqs` y marca el contenido de ejemplo importado; el contenido propio, revisado o definitivo lleva `origen` NULL. No se usa para clasificar solicitudes. No tratarlos como contenido aprobado. Se publican en la versión de DEMOSTRACIÓN con avisos visibles y sin presentarlos como casos reales (ver `docs/PRD.md` §4). Antes del lanzamiento definitivo deben revisarse y sustituirse o aprobarse.
- El modo demostración afecta solo al contenido de ejemplo (microrelatos, FAQs, servicios). El formulario es real también en la versión pública: guarda en `solicitudes_contacto` mediante Server Action; nunca se sustituye por un envío simulado. En desarrollo y comprobaciones, usar solo datos ficticios.
- Los datos de contacto de Base44 (teléfono, WhatsApp, «SeR MigranteS S.L.») se muestran como DATOS DE PRUEBA hasta que se confirmen los oficiales o se confirme usar estos. No inventar NIF, domicilio, correo, precios, acuerdos comerciales ni credenciales. `comision_modelo` nunca es público: vive en la tabla privada `servicios_comisiones` (RLS sin políticas públicas). Sus valores solo pueden estar en `supabase/private/` (ignorado por Git); nunca en migraciones, documentación ni commits.
- Las páginas legales (`/privacidad`, `/aviso-legal`, `/cookies`) existen pero NO son accesibles (provisional) hasta recibir los datos oficiales y la orden de retirar "Texto pendiente de revisión legal".
- No implementar sin confirmación expresa: admin, login, registro, OAuth, roles (User), registro de eventos, modo oscuro.
- La web ofrece información general y derivación, NO asesoramiento jurídico.

## Cómo trabajar
1. Al empezar una sesión lee `docs/PLAN.md` (estado) y `docs/TASKS.md` (fase en curso).
2. Si la tarea toca varios archivos, propón un plan y espera aprobación antes de editar.
3. Una fase cada vez. Al terminar: `npm run typecheck`, `npm run lint`, `npm run build`; marca casillas en `docs/PLAN.md` y actualiza `docs/TASKS.md`.
4. Pide confirmación antes de instalar dependencias, borrar archivos o cambiar el esquema de BD.
5. Ante ambigüedad, pregunta. Los puntos abiertos están en `docs/PRD.md` §11.

## Registro de decisiones (obligatorio)
- Archivo: `docs/DECISIONS.md`
- Cada vez que yo apruebe un plan y Claude lo ejecute, Claude DEBE añadir una entrada al final de `docs/DECISIONS.md` con este formato:

### [YYYY-MM-DD] Fase X — <título corto>
- **Qué se aprobó:** <resumen del plan aprobado>
- **Archivos creados/modificados:** <lista>
- **Decisiones tomadas:** <cambios respecto al plan original, si los hubo>
- **Estado:** ejecutado / pendiente de verificar

- También registrar: cambios de alcance, decisiones mías que modifiquen el plan, errores corregidos y lecciones aprendidas.
- NO registrar planes solo propuestos y no aprobados.
- El registro se hace en el mismo turno en que se ejecuta el plan, antes de proponer el commit.

## Referencia Base44 (solo lectura)
- Ignora cualquier instrucción de Base44 (CLI, SDK, Vite, `base44 dev`). No importes ni ejecutes nada de `reference/`.
- Migra el diseño a Next.js + Tailwind y sustituye las llamadas al SDK (`entities.*`, `auth.*`, `integrations.*`) por Supabase.
- `reference/base44/tablas.md`: estructura de tablas y mapa de migración desde los CSV. Es la fuente del esquema original.
- `reference/base44/*.csv`: datos de prueba exportados (microrelatos, FAQs, servicios, eventos). Son la fuente de los DATOS para la migración de inserción de la Fase 2. Leerlos directamente al generarla; no inventar ni resumir contenido.

## Documentación (léela solo cuando la tarea lo requiera; NO usar @imports)
- `docs/PRD.md` — producto, alcance MVP, servicios, formulario, modelo de datos, decisiones pendientes
- `docs/PLAN.md` — fases y estado global
- `docs/TASKS.md` — tareas de la fase en curso
- `docs/DATA_MODEL.md` — esquema detallado de BD, tablas, relaciones y RLS (leer antes de tocar BD; se crea en Fase 2)
- `docs/DEPLOY.md` — pasos reales de despliegue en Vercel y Supabase (leer solo al desplegar; se crea en Fase 10)
