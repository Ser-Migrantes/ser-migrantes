<!-- fases y estado (leer al empezar cada sesión) -->

# PLAN — SeR MigranteS MVP

Leyenda: [ ] pendiente · [x] hecho. Una fase cada vez; el detalle de la fase en curso está en `docs/TASKS.md`.
Estado actual: **Fase 2** (no iniciada)

## Fase 0 — Preparación y scaffolding
- [x] Material de Base44 en `reference/base44/`: código React (sin `node_modules`, `.env*`, `.git`), `tablas.md` y los 4 CSV
- [x] `CLAUDE.md`/`AGENTS.md`/`README.md` de Base44 renombrados a `.txt`
- [x] Logo PNG en `reference/brand/` y copia en `public/`
- [x] Crear app Next.js + TS + Tailwind + App Router en la raíz
- [x] Scripts `typecheck` y `lint`; `.gitignore` con `.env*`; `.env.example`
- [x] Commit y push
**Hecha cuando:** `dev`, `build`, `lint` y `typecheck` pasan.

## Fase 1 — Análisis de Base44
- [x] Inventario de pantallas y componentes
- [x] Extraer paleta, tipografías y estilos reales a una lista (valores exactos para tokens Tailwind)
- [x] Lista de llamadas al SDK (`entities.*`, `auth.*`, `integrations.*`) y su equivalente en Supabase
- [x] Esquema de datos: contrastar `reference/base44/tablas.md` y los CSV con `docs/PRD.md` §7
- [x] Marcar como "no confirmado" todo campo o relación que no se pueda verificar desde el código o los CSV
- [x] NO generar datos de ejemplo: los CSV ya contienen los datos de arranque
**Hecha cuando:** existe `docs/BASE44_ANALYSIS.md` aprobado por mí. (Aprobado el 29/10/2026; las propuestas técnicas de Postgres se aprueban en `DATA_MODEL.md`, Fase 2.)

## Fase 2 — Supabase: modelo de datos y seguridad
- [ ] Proyecto Supabase Free creado por mí
- [ ] Crear `docs/DATA_MODEL.md` a partir de `docs/BASE44_ANALYSIS.md`, `reference/base44/tablas.md` y `docs/PRD.md` §7 (tipos exactos, claves foráneas, índices, valores por defecto y políticas RLS por tabla)
- [ ] Migraciones: microrelatos, faqs, microrelatos_faqs, servicios, servicios_comisiones (privada), solicitudes_contacto (`origen` solo en microrelatos y faqs; `pregunta` única en faqs)
- [ ] RLS en todas las tablas (público: SELECT publicado/activo; contacto: solo INSERT)
- [ ] Migración de inserción leyendo los CSV: 4 servicios + 6 microrelatos y 12 FAQs de prueba (estos dos con `origen = 'base44_prueba'`), aplicando el mapeo "Wellcomy" → "Plataforma de extranjería", repetible sin duplicados
- [ ] Tipos TypeScript generados
**Hecha cuando:** `DATA_MODEL.md` aprobado, tablas creadas, RLS probado con la clave pública y los datos de los CSV cargados.

## Fase 3 — Conexión y capa de datos
- [ ] Instalar `@supabase/supabase-js` y `@supabase/ssr`
- [ ] `src/lib/supabase/client.ts` y `server.ts`
- [ ] `.env.local` con `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- [ ] Funciones en `src/lib/data/` (microrelatos, faqs, servicios)
**Hecha cuando:** una página lista los servicios desde Supabase.

## Fase 4 — Layout y diseño
- [ ] Tokens Tailwind con la paleta de Base44; tipografías Fraunces e Inter; quitar el modo oscuro automático del scaffold (el modo oscuro es futuro, pendiente de confirmación)
- [ ] `logo.png` en el header; en el footer (fondo oscuro), el icono de Base44 (`BrandMark` en tono claro) hasta tener un logo con contraste para fondos oscuros; favicon = logo
- [ ] Pendiente de ti: aportar en `reference/brand/` un logo con contraste para fondos oscuros; después, sustituir el icono del footer
- [ ] Integrar las imágenes PNG de `public/images/` (Hero y Cierre) con `next/image` (aprobado) y verificar visualización, peso servido (originales de 1,1 y 1,8 MB), compatibilidad y límites de optimización de Vercel Hobby
- [ ] Header, footer, navegación, botones, tarjetas, formularios accesibles
- [ ] Datos de contacto de prueba visibles (teléfono, WhatsApp, aviso flotante, «© SeR MigranteS S.L.»)
**Hecha cuando:** layout responsive aprobado en móvil y escritorio.

## Fase 5 — Páginas públicas
- [ ] Landing
- [ ] Listado de microrelatos en `/historias` (6 de prueba)
- [ ] Ficha `/historias/[slug]` con FAQs asociadas
- [ ] FAQs con buscador y etiquetas en `/preguntas-frecuentes`
- [ ] Sin redirecciones de rutas antiguas de Base44 (nunca fue pública)
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
- [ ] `/privacidad`, `/aviso-legal`, `/cookies` creadas con los textos de Base44 tal como estaban ("Texto pendiente de revisión legal")
- [ ] **Decisión provisional:** páginas no accesibles (sin enlaces en footer ni formulario, fuera del sitemap, 404) hasta que aportes los datos oficiales e indiques retirar los textos pendientes. **Riesgo abierto** mientras tanto: el formulario guarda datos sin política de privacidad accesible
- [ ] Formulario: texto "Al enviar aceptas la política de privacidad" sin enlace, con nota de política pendiente
- [ ] Aviso "información general, no asesoramiento jurídico"
**Hecha cuando:** las páginas existen en el código, no son accesibles y el aviso jurídico es visible. Revisión jurídica y activación pendientes por mi parte.

## Fase 9 — Analítica (CONDICIONAL: solo si decido usarla)
- [ ] Decidir herramienta (PRD §11.4)
- [ ] Si Google Analytics: cargar solo tras consentimiento + banner de cookies
- [ ] Actualizar política de cookies
**Hecha cuando:** no se cargan scripts de analítica sin consentimiento.

## Fase 10 — Despliegue
- [ ] **OBLIGATORIO antes del despliegue o de cualquier publicación pública (y mientras tanto, repo privado):**
  - [ ] Auditar el historial de Git.
  - [ ] Eliminar o reescribir los commits que contengan CSV con `comision_modelo`, eventos u otros datos sensibles (incluido el commit `0220cb7`).
  - [ ] Verificar que no quedan copias en ramas, tags, releases ni archivos del árbol actual (incluidos la tabla de modelo comercial de `docs/PRD.md` §5, el teléfono y WhatsApp de `docs/BASE44_ANALYSIS.md` §8.1 y las migraciones de la Fase 2 que pudieran contener esos datos).
  - [ ] Confirmar que `.gitignore` impide volver a añadir exportaciones o datos de negocio.
- [ ] `npm run build` OK y repo en GitHub actualizado
- [ ] Proyecto en Vercel importado (preset Next.js)
- [ ] Variables de entorno en Vercel (Production y Preview)
- [ ] Prueba end-to-end en la URL pública: lectura desde Supabase y envío real del formulario, verificando que la solicitud se guarda en `solicitudes_contacto`
- [ ] Comprobar que el formulario muestra éxito solo cuando la inserción se confirma y un error claro si falla
- [ ] Comprobar que las solicitudes guardadas no son legibles públicamente
- [ ] Dominio sermigrantes.es cuando se decida
- [ ] Documentar los pasos reales seguidos en `docs/DEPLOY.md`
**Hecha cuando:** la URL pública lee de Supabase con los avisos de demostración correspondientes al contenido de ejemplo; el formulario guarda correctamente las solicitudes en `solicitudes_contacto`; las solicitudes no son legibles públicamente; y `docs/DEPLOY.md` refleja lo realmente hecho.
Las pruebas se realizan con datos ficticios. Antes de abrir el formulario a consultas reales, deben completarse la información del responsable y la política de privacidad.

## Fase 11 — QA y seguridad
- [ ] Revisión: secretos, tablas sin RLS, clave secreta, validación de entradas
- [ ] Accesibilidad (teclado, contraste, lector de pantalla)
- [ ] Móviles y navegadores principales
- [ ] Verificar límites de Supabase Free y condiciones comerciales de Vercel Hobby
**Hecha cuando:** sin críticos abiertos.

## Fase 12 — Backlog post-MVP (NO empezar sin decisión)
- [ ] Panel de administración con login, registro, OAuth y roles (entidad User) (CRUD de contenido y solicitudes); pendiente de confirmación
- [ ] Registro propio de eventos o analítica (ver `BASE44_ANALYSIS.md` §7); pendiente de confirmación
- [ ] Modo oscuro; pendiente de confirmación
- [ ] Notificación por email de solicitudes
- [ ] Buscador por casuística con cobro progresivo (PRD §8) y pasarela de pago
- [ ] Área privada de usuarios
- [ ] Vídeos, multiidioma
- [ ] Columnas/tablas de comisión (privadas)
- [ ] Mover lógica de servidor a backend dedicado si hace falta
