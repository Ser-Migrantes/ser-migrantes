<!-- fases y estado (leer al empezar cada sesión) -->

# PLAN — Ser Migrantes MVP

Leyenda: [ ] pendiente · [x] hecho. Una fase cada vez; el detalle de la fase en curso está en `docs/TASKS.md`.
Estado actual: **Fase 1**

## Fase 0 — Preparación y scaffolding
- [x] Material de Base44 en `reference/base44/`: código React (sin `node_modules`, `.env*`, `.git`), `tablas.md` y los 4 CSV
- [x] `CLAUDE.md`/`AGENTS.md`/`README.md` de Base44 renombrados a `.txt`
- [x] Logo PNG en `reference/brand/` y copia en `public/`
- [x] Crear app Next.js + TS + Tailwind + App Router en la raíz
- [x] Scripts `typecheck` y `lint`; `.gitignore` con `.env*`; `.env.example`
- [x] Commit y push
**Hecha cuando:** `dev`, `build`, `lint` y `typecheck` pasan.

## Fase 1 — Análisis de Base44
- [ ] Inventario de pantallas y componentes
- [ ] Extraer paleta, tipografías y estilos reales a una lista (valores exactos para tokens Tailwind)
- [ ] Lista de llamadas al SDK (`entities.*`, `auth.*`, `integrations.*`) y su equivalente en Supabase
- [ ] Esquema de datos: contrastar `reference/base44/tablas.md` y los CSV con `docs/PRD.md` §7
- [ ] Marcar como "no confirmado" todo campo o relación que no se pueda verificar desde el código o los CSV
- [ ] NO generar datos de ejemplo: los CSV ya contienen los datos de arranque
**Hecha cuando:** existe `docs/BASE44_ANALYSIS.md` aprobado por mí.

## Fase 2 — Supabase: modelo de datos y seguridad
- [ ] Proyecto Supabase Free creado por mí
- [ ] Crear `docs/DATA_MODEL.md` a partir de `docs/BASE44_ANALYSIS.md`, `reference/base44/tablas.md` y `docs/PRD.md` §7 (tipos exactos, claves foráneas, índices, valores por defecto y políticas RLS por tabla)
- [ ] Migraciones: microrelatos, faqs, microrelatos_faqs, servicios, solicitudes_contacto
- [ ] RLS en todas las tablas (público: SELECT publicado/activo; contacto: solo INSERT)
- [ ] Migración de inserción leyendo los CSV: 4 servicios reales + 6 microrelatos y 12 FAQs de prueba, todos con `origen = 'base44_prueba'`
- [ ] Tipos TypeScript generados
**Hecha cuando:** `DATA_MODEL.md` aprobado, tablas creadas, RLS probado con la clave pública y los datos de los CSV cargados.

## Fase 3 — Conexión y capa de datos
- [ ] Instalar `@supabase/supabase-js` y `@supabase/ssr`
- [ ] `src/lib/supabase/client.ts` y `server.ts`
- [ ] `.env.local` con `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- [ ] Funciones en `src/lib/data/` (microrelatos, faqs, servicios)
**Hecha cuando:** una página lista los servicios desde Supabase.

## Fase 4 — Layout y diseño
- [ ] Tokens Tailwind con la paleta de Base44; logo en header
- [ ] Header, footer, navegación, botones, tarjetas, formularios accesibles
**Hecha cuando:** layout responsive aprobado en móvil y escritorio.

## Fase 5 — Páginas públicas
- [ ] Landing
- [ ] Listado de microrelatos (6 de prueba)
- [ ] Ficha `/microrelatos/[slug]` con FAQs asociadas
- [ ] FAQs con buscador y etiquetas
- [ ] Servicios (4) con tipo y CTA al formulario
- [ ] 404 personalizada
**Hecha cuando:** todas las páginas leen datos reales de Supabase y los estados vacíos están cubiertos.

## Fase 6 — SEO
- [ ] `generateMetadata`, Open Graph
- [ ] `sitemap.xml` y `robots.txt` dinámicos
- [ ] Datos estructurados donde aplique
- [ ] Revalidación del contenido publicado
**Hecha cuando:** Lighthouse SEO y accesibilidad ≥ 90 en páginas clave.

## Fase 7 — Formulario de contacto
- [ ] Formulario según PRD §6 (campos, opciones de servicio, consentimiento)
- [ ] Server Action con validación servidor, honeypot y límite básico de envíos
- [ ] Inserción en `solicitudes_contacto` (sin devolver datos)
- [ ] Origen desde microrelato (parámetro opcional)
- [ ] Mensajes de éxito y error
**Hecha cuando:** un envío de prueba aparece en Supabase y no es legible con la clave pública.

## Fase 8 — Páginas legales
- [ ] `/privacidad`, `/aviso-legal`, `/cookies` con texto provisional (marcado)
- [ ] Enlaces en footer y formulario
- [ ] Aviso "información general, no asesoramiento jurídico"
**Hecha cuando:** enlaces visibles. Revisión jurídica pendiente por mi parte.

## Fase 9 — Analítica (CONDICIONAL: solo si decido usarla)
- [ ] Decidir herramienta (PRD §11.4)
- [ ] Si Google Analytics: cargar solo tras consentimiento + banner de cookies
- [ ] Actualizar política de cookies
**Hecha cuando:** no se cargan scripts de analítica sin consentimiento.

## Fase 10 — Despliegue
- [ ] `npm run build` OK y repo en GitHub actualizado
- [ ] Proyecto en Vercel importado (preset Next.js)
- [ ] Variables de entorno en Vercel (Production y Preview)
- [ ] Prueba end-to-end en la URL pública (lectura y envío del formulario)
- [ ] Dominio sermigrantes.es cuando se decida
- [ ] Documentar los pasos reales seguidos en `docs/DEPLOY.md`
**Hecha cuando:** la URL pública lee y escribe en Supabase y `docs/DEPLOY.md` refleja lo realmente hecho.

## Fase 11 — QA y seguridad
- [ ] Revisión: secretos, tablas sin RLS, clave secreta, validación de entradas
- [ ] Accesibilidad (teclado, contraste, lector de pantalla)
- [ ] Móviles y navegadores principales
- [ ] Verificar límites de Supabase Free y condiciones comerciales de Vercel Hobby
**Hecha cuando:** sin críticos abiertos.

## Fase 12 — Backlog post-MVP (NO empezar sin decisión)
- [ ] Panel de administración con login (CRUD de contenido y solicitudes)
- [ ] Notificación por email de solicitudes
- [ ] Buscador por casuística con cobro progresivo (PRD §8) y pasarela de pago
- [ ] Área privada de usuarios
- [ ] Vídeos, multiidioma
- [ ] Columnas/tablas de comisión (privadas)
- [ ] Mover lógica de servidor a backend dedicado si hace falta
