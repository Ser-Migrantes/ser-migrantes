# Análisis de Base44 — Fase 1

Fecha: 2026-10-29 · Estado: **aprobado** el 29/10/2026 como análisis. Las propuestas técnicas de Postgres se aprueban en `docs/DATA_MODEL.md` (Fase 2).

Fuente: `reference/base44/` (exportación del 28/10/2026). Solo lectura: no se ha ejecutado ni importado nada de ahí.
Convenciones:
- **[no confirmado]**: no verificable desde el código ni los CSV.
- **[provisional]**: dato encontrado que necesita tu confirmación antes de reutilizarlo.
- **[pendiente]**: decisión abierta (ver §10).

Objetivo actual: publicar un **MVP de demostración** con los datos de ejemplo (ver §9). Este documento recoge las decisiones del 29/10/2026.

---

## 1. Fuentes

| Archivo | Contenido | Notas |
|---|---|---|
| `src/` | Código React (Vite + React Router + TanStack Query + shadcn/ui) | Cada archivo que usaba el SDK empieza con un objeto `db` de relleno (`globalThis.__B44_DB__ \|\| {…}`) añadido por la exportación |
| `base44/entities/*.jsonc` | Esquemas: `Microrelato`, `Pregunta`, `Solicitud`, `Evento`, `User` | **Falta `Servicio.jsonc`** (ver §5.3) |
| `tablas.md` | Mapa de migración redactado a partir de los CSV | Punto de partida, no esquema oficial. Corregido en esta fase |
| `Microrelato_export.csv` | 6 registros | |
| `Pregunta_export.csv` | 12 registros | |
| `Servicio_export.csv` | 4 registros | |
| `Evento_export.csv` | ≈152 registros (recuento de líneas; filas no leídas) | |
| `Solicitud_export.csv` | **0 bytes**: sin cabeceras ni registros | |
| `export-report.json` | Informe de exportación | `assetCount: 0`: no se exportó ninguna imagen |

Los CSV originales se conservan sin cambios como referencia.

## 2. Inventario de pantallas

| Ruta Base44 | Página | MVP |
|---|---|---|
| `/` | `Home` | Sí (Fase 5) |
| `/historias` | `Relatos` | Sí. Nombre de ruta **[pendiente]**: PRD usa `/microrelatos` |
| `/historias/:slug` | `RelatoDetalle` | Sí. Ruta PRD: `/microrelatos/[slug]` **[pendiente]** |
| `/preguntas-frecuentes` | `Preguntas` | Sí |
| `/servicios` | `Servicios` | Sí |
| `/contacto` | `Contacto` | Sí (Fase 7, en modo demostración: §9.3) |
| `/aviso-legal`, `/privacidad`, `/cookies` | `Legal` (una página, 3 documentos) | Sí (Fase 8, como borradores) |
| `/relatos`, `/relatos/:slug` | `RedirigirRelato` → `/historias…` | Redirección de rutas antiguas de Base44 |
| `/preguntas` | Redirección → `/preguntas-frecuentes` | |
| `*` | `PageNotFound` | Sí (404) |
| `/admin` | `Admin` (+ `components/admin/*`) | **No** (PRD §4: sin panel) |
| `/login`, `/register`, `/forgot-password`, `/reset-password`, OAuth | Autenticación | **No** |

### Componentes propios (`src/components/`)
- **Layout**:
  - `Layout`: enlace "Saltar al contenido" y `<main id="contenido">`.
  - `SiteHeader`: navegación, menú móvil y CTA.
  - `SiteFooter`: columnas, enlaces legales y aviso jurídico.
  - `BrandMark`: icono + "SeR MigranteS"; no usa el logo PNG.
  - `Divisor`: onda SVG.
  - `LlamadaFlotante`: aviso flotante con teléfono y WhatsApp (ver §8.1).
  - `ScrollToTop`, `Breadcrumbs`.
- **UI de contenido**:
  - `Boton`: variantes primario, secundario, claro, contornoClaro y enlace.
  - `RelatoCard`, `PreguntaAcordeon`, `ResultadosBusqueda`.
  - `FiltroCasuistica`: búsqueda + casuística + perfil.
  - `Reveal`: aparición al hacer scroll; respeta `prefers-reduced-motion`.
- **Portada** (`home/`): `Hero`, `FranjaImpacto`, `Acompanamiento`, `HistoriasDestacadas`, `PreguntasDestacadas`, `ServiciosDestacados`, `CierreContacto`.
- **Fuera del MVP**: `admin/*`, `AuthLayout`, `ProtectedRoute`, `UserNotRegisteredError`, `GoogleIcon`.
- **`ui/`**: ~45 componentes shadcn/Radix. Sirven solo como referencia visual; su uso real en páginas públicas **[no confirmado]** (no se han revisado uno a uno).
- **Lógica** (`src/lib/`):
  - `busqueda.js`: filtrado local.
  - `casuisticas.js`: listas de valores.
  - `seo.js`: metadatos y JSON-LD.
  - `slug.js`, `urls.js`: slugs y rutas.
  - `eventos.js`: ver §7.

## 3. Diseño (para tokens Tailwind en Fase 4)

Fuente: `src/index.css` y `tailwind.config.js`. Hex calculado a partir del HSL original.

| Token | HSL (original) | Hex | Uso |
|---|---|---|---|
| `crema` | 45 100% 97% | `#fffbf0` | Texto sobre fondos oscuros |
| `crema-alta` | 45 100% 93% | `#fff6db` | |
| `turquesa` | 177 98% 34% | `#02aca3` | Marca |
| `mostaza` / `acento` | 43 94% 61% | `#f9c43e` | Acento, selección de texto |
| `tinta` / `texto` | 68 50% 7% | `#181b09` | Texto principal |
| `texto-suave` | 70 14% 31% | `#565a44` | Texto secundario |
| `fondo`, `superficie` | 0 0% 100% | `#ffffff` | Fondo y tarjetas |
| `superficie-suave` | 45 100% 96% | `#fffaeb` | Bandas crema |
| `primario` | 182 92% 24% | `#057276` | Botones, enlaces, foco |
| `primario-suave` | 45 100% 93% | `#fff6db` | |
| `secundario` | 184 96% 15% | `#02464b` | Titulares, footer, hover |
| `border` | 45 30% 88% | `#eae5d7` | |
| `input` | 45 28% 86% | `#e5e0d1` | |
| `ring` | 182 92% 30% | `#068e93` | |
| `destructive` | 0 70% 40% | `#ad1f1f` | Errores |
| `muted` / `muted-foreground` | 45 40% 94% / 70 14% 32% | `#f6f3ea` / `#595d46` | |

- **Color de tema**: `theme-color` en `index.html` es `#fdfbf3`.
- **Modo oscuro**: existe una paleta `.dark`, pero no se encontró nada que la active **[no confirmado si se usaba]**.
- **Tipografías**: Fraunces para titulares (`font-heading`, pesos 500/600/700 y cursiva 500) e Inter para texto (400/500/600), desde Google Fonts. Las definitivas están **[pendientes, PRD §11.8]**.
- **Texto base**:
  - `body`: 1.0625rem, interlineado 1.7.
  - Titulares: `letter-spacing: -0.02em`, `line-height: 1.12`, `text-wrap: balance`.
- **Sombras**:
  - `suave`: `0 2px 4px -2px rgba(26,28,9,.06), 0 12px 28px -20px rgba(26,28,9,.25)`
  - `elevada`: `0 6px 12px -6px rgba(26,28,9,.08), 0 28px 56px -34px rgba(26,28,9,.4)`
  - `flotante`: `0 30px 70px -45px rgba(26,28,9,.55)`
- **Radios**: base `1.5rem`; tarjetas entre `1.75rem` y `2.5rem`; botones `rounded-full`.
- **Utilidades**:
  - `.contenedor`: `max-w-6xl`, `px-5/6/8`.
  - `.seccion`: `py-16 md:py-24`.
  - `.etiqueta`: 0.72rem, mayúsculas, `tracking 0.16em`.
  - `.prosa-lectura`: 68ch.
  - `.revelar` / `.revelar-visible`: animación de aparición.
- **Accesibilidad**:
  - foco visible `3px solid primario` con offset de 3px;
  - objetivos táctiles de al menos 44px;
  - respeta `prefers-reduced-motion`.

## 4. Llamadas al SDK y equivalente en Supabase

| Llamada Base44 | Dónde | Equivalente propuesto | MVP |
|---|---|---|---|
| `Microrelato.filter({estado:'publicado'}, sort -fecha_publicacion)` | `useContenidoPublico` | `select` en `microrelatos` desde Server Component (`src/lib/data/`); RLS pública solo para `publicado` | Sí |
| `Pregunta.filter({estado:'publicado'}, sort pregunta)` | `useContenidoPublico` | `select` en `faqs` + `microrelatos_faqs` | Sí |
| `Servicio.filter({estado:'activo'}, sort nombre)` | `useContenidoPublico` | `select` en `servicios` ordenado por `orden` (PRD §5), sin columnas internas | Sí |
| `Solicitud.create` | `Contacto` | `insert` en `solicitudes_contacto` desde Server Action, sin devolver datos, también en la versión pública (§9.3) | Sí (Fase 7) |
| `Evento.create` | `lib/eventos.js` | Ninguno sin decisión adicional (§7) | — |
| `*.list/create/update/delete/count`, `Evento.aggregate` | `components/admin/*` | Table Editor de Supabase | No |
| `auth.*` (13 llamadas) | Login, registro, OAuth, `AuthContext` | Ninguno (sin login en el MVP) | No |
| `integrations.*` | — | Sin uso real (solo en el objeto de relleno) | — |

Nota: en Base44 la carga y el filtrado ocurren en el navegador (`useEffect` + `busqueda.js`). En Next.js la lectura pasará al servidor. El buscador de FAQs podrá seguir filtrando en el navegador; se decide en la Fase 5.

## 5. Esquema por entidad

Leyenda de restricciones:
- **B44**: definida en el esquema `.jsonc` de Base44.
- **CSV**: observada en los datos exportados.
- **Propuesta**: propuesta de `tablas.md`/PRD para Postgres. No está adoptada; se decide en la Fase 2.

**IDs de Base44:** no se conservan. En la Fase 2 se generarán nuevas claves primarias y las relaciones se reconstruirán por slug y por el mapa de servicios aprobado. **No se ha encontrado ninguna dependencia real de los IDs originales**:
- todas las relaciones usan slug o nombre;
- `urls.js` solo recurre al `id` si un relato no tiene slug, y los 6 lo tienen;
- el resto de usos de `id` están en el panel de admin, que queda fuera del MVP.

### 5.1 Microrelato → `microrelatos`

| Campo Base44 | B44 | CSV (6 registros) | Propuesta Postgres | Riesgo de importación |
|---|---|---|---|---|
| titulo | obligatorio | todos con valor | `text not null` | — |
| slug | opcional | todos con valor, únicos | `text not null unique` | Más estricta que B44; los datos actuales cumplen |
| resumen | obligatorio | | `text not null` | — |
| contenido | obligatorio; párrafos separados por línea en blanco | | `text not null` | — |
| casuistica | obligatorio; enum de 8 | 6 valores distintos usados | `text not null` + `check` | — |
| perfil | opcional; enum de **6** | 4 valores usados | `text not null` + `check` | `not null` es más estricta que B44; los datos actuales cumplen |
| etiquetas | array de texto | array JSON serializado | `text[] not null default '{}'` | — |
| estado | enum `publicado`/`borrador`, por defecto `borrador` | todos `publicado` | igual | Se importan como `publicado` por autorización expresa (§9.1) |
| fecha_publicacion | fecha | todos con valor (2026-08-21 … 2026-10-06) | `date` | — |
| cta_principal | opcional | 3 valores distintos | `text` | — |
| servicio_relacionado | texto = **nombre** del servicio | 5 coinciden con un nombre; **1 = "Wellcomy"** (ver §6) | `servicio_relacionado_id uuid references servicios(id)` | **Sí**: "Wellcomy" no coincide con ningún nombre; necesita el mapeo de §6 |
| — | | | `origen text` (nullable, **sin valor por defecto**) | Nueva. `'base44_prueba'` solo en los registros importados |
| created_date / updated_date | sistema | | `created_at` / `updated_at` | — |
| id, created_by_id, is_sample | sistema | `is_sample = false` en todos | No se migran | — |

- Casuísticas (B44 y `lib/casuisticas.js`): Regularización y arraigo · Documentación y NIE · Empleo y trabajo · Vivienda · Estudios y formación · Familia y reagrupación · Salud y bienestar · Idioma y cultura.
- Perfiles **permitidos por el esquema** (6, se conservan todos): Recién llegada/o · Familia · Estudiante · Trabajador/a · Emprendedor/a · Persona refugiada.
- Perfiles **presentes en los registros exportados** (4): Recién llegada/o · Familia · Estudiante · Trabajador/a.

### 5.2 Pregunta → `faqs`

| Campo Base44 | B44 | CSV (12 registros) | Propuesta Postgres | Riesgo de importación |
|---|---|---|---|---|
| pregunta | obligatorio | | `text not null` | — |
| respuesta | obligatorio | | `text not null` | — |
| casuistica | **opcional**; enum de 8 | todos con valor | `text not null` + `check` | Más estricta que B44; los datos actuales cumplen |
| etiquetas | array | | `text[] not null default '{}'` | — |
| microrelatos_asociados | array de **slugs** | 10 con asociación, 2 vacíos; todos los slugs existen | Tabla puente `microrelatos_faqs` (slug → id nuevo) | — |
| estado | enum, por defecto `borrador` | todos `publicado` | igual | Se importan como `publicado` (§9.1) |
| — | | | `origen text` (sin valor por defecto) | Nueva |

### 5.3 Servicio → `servicios`

**Limitación de la exportación (no bloquea):** no hay `Servicio.jsonc`, aunque el código usa `entities.Servicio` (lectura pública y CRUD en el admin). Todo lo siguiente se deduce del CSV y del código.

| Campo | Observado en el CSV (4 registros) | Valores permitidos en el código | Propuesta Postgres |
|---|---|---|---|
| nombre | 4 nombres distintos | — | `text not null` |
| descripcion | con valor | — | `text not null` |
| tipo | aliado (2), propio (1), colaborador (1) | `TIPOS_SERVICIO` = propio, aliado, colaborador | `text not null` + `check` |
| proveedor | Red de intérpretes · ServiR Migrantes · Gestorías colaboradoras · Wellcomy | — | `text not null` |
| url_destino | **vacío en los 4** | — | `text` (nullable) |
| comision_modelo | con valor en los 4 | — | **Dato comercial interno [provisional]**. Se conservan los valores; en la Fase 2 se propondrán almacenamiento y permisos **sin acceso público** (no basta con ocultarlo en la interfaz). Ver PRD §5 |
| estado | `activo` en los 4 | `ESTADOS_SERVICIO` = activo, inactivo | `text not null default 'activo'` + `check` |
| — | no existe en Base44 | — | `orden` (PRD §5), columna nueva |

- **Reglas de acceso originales de Servicio: desconocidas.** No hay esquema ni otra fuente. En la Fase 2 se propondrán las políticas RLS del MVP según el PRD y `CLAUDE.md`.
- **Orden**: Base44 ordena por `nombre`; el MVP usará `orden` del PRD §5.

### 5.4 Solicitud → `solicitudes_contacto`

La entidad **sí existe** en Base44 (esquema, formulario `Contacto` y panel `AdminSolicitudes`). El CSV exportado está vacío (0 bytes), así que no hay datos que importar. El modelo de destino es el del **PRD §7**; no se modifica para copiar Base44.

| Campo Base44 | B44 | Destino PRD §7 | Mapeo |
|---|---|---|---|
| nombre | obligatorio | `nombre` | directo |
| email | obligatorio, formato email | `email` | directo |
| telefono | opcional | `telefono` (nullable) | directo |
| necesidad | obligatorio | `mensaje` | `necesidad → mensaje` |
| servicio_interes | opcional, **nombre** del servicio (`""` = "Todavía no lo sé") | `servicio_interes_id` (FK; NULL = "todavía no lo sé") | nombre → id |
| microrelato_origen | opcional, **slug** (parámetro `?relato=`) | `microrelato_origen_id` (nullable) | slug → id |
| consentimiento | obligatorio, boolean | `consentimiento` (`check = true`) | directo |
| fecha | date-time enviado por el cliente | `created_at` | `fecha → created_at` (en el MVP lo pone el servidor) |

- **Reglas B44**: crear = cualquiera; leer, editar y borrar = solo admin.
- **Validación en el navegador (B44)**: nombre no vacío; email por regex; `necesidad` de al menos 15 caracteres; consentimiento marcado. El mínimo de 15 caracteres no está en el PRD.
- **Consentimiento**: el texto de B44 es el mismo que el del PRD §6 (incluye "No se comparten con terceros"). Ver §8.2.

### 5.5 Otras entidades
- **Evento**: ver §7.
- **User**: fuera del MVP; solo tiene `role: admin|user`. Sus identificadores (`created_by_id`) no se importan.

## 6. Relaciones e importación

| Relación | Base44 | Destino | Observaciones |
|---|---|---|---|
| Microrelato → Servicio | `servicio_relacionado` = nombre | `servicio_relacionado_id` FK | 5 de 6 coinciden por nombre. **"Wellcomy"** (relato `alquilar-una-habitacion`) es un proveedor, no un nombre de servicio |
| Pregunta ↔ Microrelato | `microrelatos_asociados` = slugs | `microrelatos_faqs` (N:M) | Todos los slugs existen. 2 FAQs sin relato (Salud y bienestar; Regularización y arraigo): se importan igualmente. 1 FAQ de "Vivienda" está asociada a `reagrupar-a-mi-hija` (Familia y reagrupación) y a `alquilar-una-habitacion`: relación entre casuísticas distintas, se conserva tal cual |
| Solicitud → Servicio | nombre | `servicio_interes_id` | Sin datos |
| Solicitud → Microrelato | slug | `microrelato_origen_id` | Sin datos |

**Mapeo propuesto para "Wellcomy" (pendiente de tu confirmación antes de la importación):**
`servicio_relacionado = "Wellcomy"` → servicio **"Plataforma de extranjería"** (proveedor "Wellcomy").
No se crea un quinto servicio ni se cambian el título, el texto ni la casuística del relato.

**Requisitos de la importación (Fase 2):**
- Leer los valores directamente de los CSV, sin inventarlos ni resumirlos.
- Repetible sin duplicados, apoyándose en claves naturales únicas: `slug` en microrelatos y `nombre` en servicios. Para las FAQs, la clave (p. ej. el texto de `pregunta`) está **[pendiente]**.
- Comprobar al final que no se pierde ninguna relación:
  - 6 microrelatos con su servicio;
  - el número de pares FAQ–relato coincide con los arrays del CSV.
- Fuera de la importación: eventos, `created_by_id`, `is_sample` e IDs de Base44.

## 7. Eventos (`Evento`)

**Cabeceras del CSV:** `tipo, referencia, termino, fecha, id, created_date, updated_date, created_by_id, is_sample`. No se han leído las filas.

**Cómo se generaban** (`lib/eventos.js` → `registrarEvento`; en el navegador, ignorando errores):

| tipo | Cuándo | referencia | termino |
|---|---|---|---|
| `visita` | Al cargar la portada (solo `/`) | `'inicio'` | — |
| `busqueda` | Al buscar en `FiltroCasuistica` | casuística elegida | texto escrito por la persona |
| `clic_servicio` | Clic en "Ir al servicio" o "Solicitar información" (portada y `/servicios`) | nombre del servicio | — |
| `clic_relato` | Al **abrir** la ficha de un relato (no es un clic en una tarjeta) | slug | — |
| `solicitud` | Tras enviar el formulario | servicio de interés | — |

- **Acceso B44**: crear = cualquiera; leer, editar y borrar = admin.
- **Uso**: solo `AdminResumen`, que muestra contadores agrupados por `tipo`.
- `fecha` duplica a `created_date`.
- **Procedencia de los ≈152 registros: no verificada.** No se sabe si son pruebas o tráfico real.

Hay tres decisiones separadas. Ninguna se implementa sin una decisión adicional y **ninguna bloquea la demostración**.

**7.1 Importar el historial de eventos**
- Si no se importa, se pierden los ≈152 registros y sus contadores, y los términos de búsqueda que contengan.
- Riesgo: `termino` y `referencia` pueden contener texto libre escrito por personas, incluidos posibles datos personales.

**7.2 Registrar eventos nuevos (registro propio)**
- Si no se hace, el MVP no tendrá:
  - contadores propios sin terceros ni cookies (visitas, búsquedas, clics a servicios, relatos vistos);
  - los **términos de búsqueda**, que indican qué contenido falta;
  - la atribución de clics a servicios.
- Las solicitudes podrán contarse desde `solicitudes_contacto` cuando el formulario guarde datos.
- Implementarlo exigiría escritura anónima en otra tabla, algo que `CLAUDE.md` prohíbe salvo para `solicitudes_contacto`: necesitaría tu autorización expresa. También requeriría límites contra spam.

**7.3 Herramienta externa de analítica**
- Es la Fase 9 condicional y PRD §11.4 (Vercel Analytics, Google Analytics o ninguna).
- Si usa cookies, requiere consentimiento y banner.

## 8. Datos de negocio, textos legales e imágenes

### 8.1 Datos de negocio [provisional]
No se publican como oficiales mientras no los confirmes (§9.4).

| Dato | Valor encontrado | Ubicación | En la demo |
|---|---|---|---|
| Teléfono | `+34 600 982 993` | `components/home/Hero.jsx` (L42, L46, L96; "agenda tu cita en esta línea"); `components/LlamadaFlotante.jsx` (L4–5) | Se omite; botones de llamada desactivados |
| WhatsApp | `34600982993` (`wa.me`) | `components/LlamadaFlotante.jsx` (L6, L51) | Se omite; botón desactivado |
| Denominación societaria | "SeR MigranteS S.L." | `components/SiteFooter.jsx` (L94) | Se omite; se usa "Ser Migrantes" |
| Dominio | `https://sermigrantes.es` | `lib/seo.js` (L5), `pages/Legal.jsx`, `pages/Home.jsx` (JSON-LD), footer | No conectado (PRD §11.7) |
| Nombre de marca | "SeR MigranteS" (logo y `BrandMark`) frente a "Ser Migrantes" (textos y metadatos) | `BrandMark.jsx`, en general | Texto: "Ser Migrantes"; el logo PNG se mantiene |
| Proveedor del servicio propio | "ServiR Migrantes" | `Servicio_export.csv`, PRD §5 | Dato del CSV, con aviso de demostración |
| Correo de contacto | **No encontrado** | — | No se inventa |
| NIF, domicilio | **No encontrados** (huecos en los textos legales) | `pages/Legal.jsx` | No se inventan |

### 8.2 Textos legales: borradores
- **Fuente**: `pages/Legal.jsx`. No se crea `reference/base44/privacidad.md`; la página `/privacidad` de Next.js sigue prevista.
- Se conservan como **borradores**: no están revisados ni garantizan el cumplimiento legal.
- **Huecos** (marcados en el código como "Texto pendiente de revisión legal"):
  - Aviso legal: titular (nombre o razón social, NIF, domicilio, correo); legislación aplicable y jurisdicción.
  - Privacidad: responsable del tratamiento (mismos datos); plazo de conservación.
  - Cookies: cookies de analítica o publicidad (proveedor, duración).
- **Otros puntos a revisar**:
  - Privacidad dice "No cedemos tus datos a terceros ajenos a la atención de tu consulta", y el consentimiento dice "No se comparten con terceros": son formulaciones distintas.
  - Internamente, el servicio de Wellcomy se describe como "del mismo grupo" (`comision_modelo`). Esto conecta con PRD §6 y §11.9.
  - Cookies menciona "tu sesión si accedes al área privada del equipo", que no existe en el MVP.
  - El pie de página dice "Los relatos son casos reales reescritos y adaptados". **No puede aplicarse a los relatos de ejemplo** (§9.2).
- Antes de abrir el formulario a consultas reales, deben completarse la información del responsable y la política de privacidad (pendiente de lanzamiento). Las pruebas se hacen con datos ficticios.

### 8.3 Textos de interfaz
- Los textos de la portada (Hero, frase de impacto, "Tres formas de sentirte acompañado", cierre), de la cabecera y del pie están en `components/home/*`, `SiteHeader.jsx` y `SiteFooter.jsx`.
- **Textos que no se pueden reutilizar tal cual** porque presentan el contenido como casos reales:
  - Hero: "Casos reales adaptados…";
  - `Acompanamiento`: "Lee casos reales adaptados…";
  - `HistoriasDestacadas`: "Casos reales reescritos…";
  - pie de página: "Los relatos son casos reales reescritos y adaptados…".
- Discrepancia menor: el H1 del Hero dice "sin empezar de **0**"; el mensaje de marca del PRD dice "de **cero**".

### 8.4 Imágenes

| Imagen | URL | Uso | ¿Disponible localmente? |
|---|---|---|---|
| Hero | `https://media.db.com/images/public/6adf86f7b399e0d3d17171c2/3271a1ce3_generated_image.png` | `home/Hero.jsx` (alt: mujer joven con mochila en una calle de barrio); también `og:image` e `IMAGEN_DEFECTO` (`lib/seo.js`, logo del JSON-LD) | **No** |
| Cierre de contacto | `https://media.db.com/images/public/6adf86f7b399e0d3d17171c2/42995b94b_generated_image.png` | `home/CierreContacto.jsx` (alt: grupo diverso conversando en un patio) | **No** |
| Favicon | `https://db.com/logo_v2.svg` | `index.html` | **No** |
| Imagen de reserva | `https://static.wixstatic.com/media/12d367_4f26ccd17f8f4e3a8958306ea08c2332~mv2.png` | `components/ui/image.jsx` (cuando falta imagen) | **No** |
| Logo | `reference/brand/logo-v1_SeR_MigranteS-light.png` → `public/logo.png` | Base44 no lo usa (usa `BrandMark`) | **Sí** |

- Los nombres `generated_image.png` sugieren imágenes generadas por IA **[no confirmado]**.
- Los dominios `media.db.com` y `db.com` parecen URLs reescritas por la exportación **[no confirmado]**.
- En la demo se prioriza el logo local y se publica **sin imágenes** si faltan. No se generarán ni contratarán imágenes sin tu aprobación, ni se usarán imágenes que aparenten mostrar a protagonistas reales de los relatos de ejemplo.

## 9. Modo demostración (decisiones del 29/10/2026)

### 9.1 Contenido de ejemplo publicado
- Se importan y se muestran públicamente los 6 microrelatos, las 12 FAQs (incluidas las 2 sin relato asociado) y los 4 servicios, con los valores del CSV.
- Microrelatos y FAQs se importan como `publicado`, **por autorización expresa** para la demostración. No significa que estén verificados, que sean testimonios reales ni que sus afirmaciones jurídicas estén aprobadas.
- Microrelatos y FAQs importados llevan `origen = 'base44_prueba'`. **No es el valor por defecto** de la columna: el contenido futuro no lo hereda.
- El contenido nuevo sigue naciendo como `borrador` (PRD §4).
- No se genera contenido ni registros de ejemplo nuevos.

### 9.2 Avisos visibles
- **Aviso general de versión de demostración**, en todo el sitio.
- **Indicación de contenido de ejemplo** en las fichas de microrelatos y en las FAQs con `origen = 'base44_prueba'`. Debe decir que son ejemplos generados para mostrar el funcionamiento, no testimonios verificados ni asesoramiento profesional.
- Los relatos de prueba **no se presentan como "casos reales adaptados"**. Esa descripción se reserva al contenido futuro que tenga ese origen y esté aprobado (ver §8.3).
- Servicios: se muestran con el aviso de demostración, sin presentar como verificados su disponibilidad ni sus acuerdos.

### 9.3 Formulario de contacto
- El formulario se implementa completo (campos, validación, consentimiento; PRD §6).
- El modo demostración **no** afecta al formulario: es funcional también en la versión pública. Comportamiento requerido:
  - validación de campos y consentimiento;
  - envío mediante Server Action de Next.js;
  - inserción en `solicitudes_contacto`;
  - mensaje de éxito solo tras confirmar la inserción;
  - mensaje de error si falla;
  - sin lectura pública de las solicitudes ni registro de sus datos en logs;
  - medidas antispam previstas en el plan (honeypot y límite básico de envíos).
- En desarrollo y comprobaciones se usan **solo datos ficticios**.
- **Pendiente de lanzamiento**: la información del responsable del tratamiento y la política de privacidad, necesarias antes de abrir el formulario a consultas reales (§8.2). El formulario funcional no se sustituye por una simulación.

### 9.4 Datos de negocio en la demo
- Se omiten los datos de contacto no confirmados y se desactivan los botones de llamada y WhatsApp.
- Marca: «Ser Migrantes», sin forma societaria.
- No se inventan NIF, domicilio, correo, precios, acuerdos comerciales ni credenciales profesionales.
- `comision_modelo` no se publica (§5.3).

### 9.5 Paso de la demostración al lanzamiento definitivo
Antes del lanzamiento definitivo habrá que:
- revisar, sustituir o aprobar los microrelatos y FAQs de ejemplo;
- retirar los avisos solo donde corresponda;
- completar y aprobar los textos legales;
- confirmar los datos de negocio.

## 10. Decisiones pendientes

| # | Decisión | Origen | Bloquea |
|---|---|---|---|
| 1 | Confirmar el mapeo "Wellcomy" → "Plataforma de extranjería" | §6 | Importación (Fase 2) |
| 2 | Adoptar o no restricciones más estrictas que las de Base44 (`slug`/`perfil` not null en microrelatos, `casuistica` not null en FAQs). Los datos actuales cumplen, pero cambia el comportamiento al crear contenido nuevo | §5.1, §5.2 | Fase 2 |
| 3 | Clave natural de las FAQs para que la importación no duplique al repetirse | §6 | Fase 2 |
| 4 | Almacenamiento y permisos de `comision_modelo` sin acceso público | §5.3, PRD §5 | Fase 2 |
| 5 | Eventos: historial (7.1), registro propio (7.2), analítica externa (7.3) | §7 | No bloquea la demo |
| 6 | Rutas: `/historias` (Base44) frente a `/microrelatos` (PRD); mantener o no las redirecciones | §2 | Fase 5 |
| 7 | Confirmar los datos de negocio | §8.1 | Publicarlos |
| 8 | Datos del responsable del tratamiento y política de privacidad; coherencia del consentimiento con la derivación a terceros | §8.2, PRD §11.6 y §11.9 | Abrir el formulario a consultas reales (no bloquea implementarlo ni probarlo con datos ficticios) |
| 9 | Mínimo de 15 caracteres en el mensaje (Base44) frente a PRD sin mínimo | §5.4 | Fase 7 |
| 10 | Etiqueta del servicio propio: "Servicio propio" (Base44) frente a "Servicio propio – ServiR Migrantes" (PRD §5) | §5.3 | Fase 5 |
| 11 | Tipografías definitivas (Fraunces/Inter como referencia) | §3, PRD §11.8 | Fase 4 |
| 12 | Imágenes sustitutas (herramienta, coste, estilo) | §8.4 | No bloquea la demo |
