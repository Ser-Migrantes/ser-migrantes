# Análisis de Base44 — Fase 1

Fecha: 2026-10-29 · Estado: **aprobado** el 29/10/2026 como análisis y actualizado ese mismo día con nuevas fuentes y decisiones. Las propuestas técnicas de Postgres se aprueban en `docs/DATA_MODEL.md` (Fase 2), salvo las que ya se han aprobado (§5).

Fuente: `reference/base44/` (exportación del 28/10/2026) e imágenes en `reference/images/`. Solo lectura: no se ha ejecutado ni importado nada de ahí.
Convenciones:
- **[no confirmado]**: no verificable desde el código ni los CSV.
- **[provisional]**: dato encontrado que necesita tu confirmación antes de tratarlo como oficial.
- **[pendiente]**: decisión abierta (ver §10).
- **[futuro]**: implementación posible que no se hace en el MVP hasta que la confirmes expresamente.

Marca: **SeR MigranteS**.

Objetivo actual: publicar un **MVP de demostración** con los datos de ejemplo (ver §9).

---

## 1. Fuentes

| Archivo | Contenido | Notas |
|---|---|---|
| `src/` | Código React (Vite + React Router + TanStack Query + shadcn/ui) | Cada archivo que usaba el SDK empieza con un objeto `db` de relleno (`globalThis.__B44_DB__ \|\| {…}`) añadido por la exportación |
| `base44/entities/*.jsonc` | Esquemas: `Microrelato`, `Pregunta`, `Servicio`, `Solicitud`, `Evento`, `User` | `Servicio.jsonc` aportado el 29/10/2026 |
| `tablas.md` | Mapa de migración redactado a partir de los CSV | Punto de partida, no esquema oficial. Corregido en esta fase |
| `Microrelato_export.csv` | 6 registros | |
| `Pregunta_export.csv` | 12 registros | |
| `Servicio_export.csv` | 4 registros | |
| `Evento_export.csv` | ≈152 registros (recuento de líneas; filas no leídas) | |
| `Solicitud_export.csv` | Solo cabeceras, sin registros | Ver §5.4 |
| `export-report.json` | Informe de exportación | `assetCount: 0`: la exportación no incluyó imágenes; se descargaron manualmente (ver §8.4) |
| `reference/images/*.png` | Imágenes de Hero y Cierre de contacto | Descargadas de Base44; en PNG desde el 29/10/2026 (sustituyen a las AVIF, eliminadas). Copiadas a `public/images/` |

Los CSV originales se conservan como referencia.

## 2. Inventario de pantallas

La web de Base44 **nunca fue pública**, así que no hay enlaces antiguos que conservar ni redirecciones que implementar.

| Ruta Base44 | Página | MVP (ruta Next.js) |
|---|---|---|
| `/` | `Home` | Sí: `/` (Fase 5) |
| `/historias` | `Relatos` | Sí: `/historias` |
| `/historias/:slug` | `RelatoDetalle` | Sí: `/historias/[slug]` |
| `/preguntas-frecuentes` | `Preguntas` | Sí: `/preguntas-frecuentes` |
| `/servicios` | `Servicios` | Sí: `/servicios` |
| `/contacto` | `Contacto` | Sí: `/contacto` (Fase 7; formulario real, §9.3) |
| `/aviso-legal`, `/privacidad`, `/cookies` | `Legal` (una página, 3 documentos) | Se **crean pero no son accesibles** desde la web (§8.2, decisión provisional) |
| `/relatos`, `/relatos/:slug`, `/preguntas` | Redirecciones de Base44 | **No se implementan** |
| `*` | `PageNotFound` | Sí (404) |
| `/admin` | `Admin` (+ `components/admin/*`) | **[futuro]**, pendiente de confirmación |
| `/login`, `/register`, `/forgot-password`, `/reset-password`, OAuth | Autenticación (+ `AuthContext`) | **[futuro]**, pendiente de confirmación |

### Funcionalidades que se pierden al no implementar admin ni login en el MVP
Fuente: `pages/Admin.jsx` y `components/admin/*`.
1. **Resumen** (`AdminResumen`):
   - contadores de solicitudes, visitas a portada, búsquedas, clics a servicios y relatos vistos (estos cuatro dependen de eventos, §7);
   - totales de relatos, preguntas y servicios;
   - últimas 5 solicitudes.
2. **Relatos, Preguntas y Servicios** (`AdminRelatos`, `AdminPreguntas`, `AdminServicios`): crear, editar y borrar desde formularios propios, con los valores permitidos (casuísticas, perfiles, tipos, estados).
3. **Solicitudes** (`AdminSolicitudes`): listado, respuesta rápida por correo (`mailto:`) y borrado.
4. **Acceso**:
   - login con email y contraseña, Google OAuth, registro con código OTP y recuperación de contraseña;
   - roles `admin`/`user` (entidad `User`) y rutas protegidas (`ProtectedRoute`).

**Sustituto en el MVP**: el Table Editor o SQL de Supabase. Eso implica:
- no hay contadores;
- no hay aviso de nuevas solicitudes (PRD §11.3);
- quien gestione el contenido necesita acceso técnico a Supabase y debe respetar a mano los valores permitidos (las restricciones `check` de la base de datos ayudan).

### Componentes propios (`src/components/`)
- **Layout**:
  - `Layout`: enlace "Saltar al contenido" y `<main id="contenido">`.
  - `SiteHeader`: navegación, menú móvil y CTA.
  - `SiteFooter`: columnas, enlaces legales (no se mostrarán, §8.2) y aviso jurídico.
  - `BrandMark`: icono + "SeR MigranteS". En el MVP:
    - **cabecera**: `logo.png`;
    - **pie**: se mantiene `BrandMark` (icono + texto en tono claro), porque el logo actual no tiene contraste sobre fondo oscuro. Se sustituirá cuando aportes un logo para fondos oscuros (§10).
  - `Divisor`: onda SVG.
  - `LlamadaFlotante`: aviso flotante con teléfono y WhatsApp (datos de prueba, §8.1).
  - `ScrollToTop`, `Breadcrumbs`.
- **UI de contenido**:
  - `Boton`: variantes primario, secundario, claro, contornoClaro y enlace.
  - `RelatoCard`, `PreguntaAcordeon`, `ResultadosBusqueda`.
  - `FiltroCasuistica`: búsqueda + casuística + perfil.
  - `Reveal`: aparición al hacer scroll; respeta `prefers-reduced-motion`.
- **Portada** (`home/`): `Hero`, `FranjaImpacto`, `Acompanamiento`, `HistoriasDestacadas`, `PreguntasDestacadas`, `ServiciosDestacados`, `CierreContacto`.
- **[futuro]**: `admin/*`, `AuthLayout`, `ProtectedRoute`, `UserNotRegisteredError`, `GoogleIcon`.
- **`ui/`**: ~45 componentes shadcn/Radix. Sirven solo como referencia visual; su uso real en páginas públicas **[no confirmado]** (no se han revisado uno a uno). `ui/image.jsx` ver §8.4.
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
- **Modo oscuro**:
  - Base44 define una paleta `.dark`, pero no se encontró nada que la active **[no confirmado si se usaba]**.
  - En el MVP es **[futuro]**, pendiente de confirmación.
  - El scaffold de Next.js trae un modo oscuro automático (`prefers-color-scheme: dark` en `globals.css`) que se quitará en la Fase 4.
- **Tipografías**: se mantienen las de Base44 hasta que se pida cambiarlas:
  - Fraunces para titulares (`font-heading`, pesos 500/600/700 y cursiva 500);
  - Inter para texto (400/500/600).
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
- **Logo**:
  - `logo.png` en la cabecera;
  - en el pie (fondo `secundario`, oscuro) se mantiene el icono de Base44 (`BrandMark` en tono claro), porque solo existe la versión *light* del logo, con texto oscuro;
  - **[pendiente]**: que aportes en `reference/brand/` un logo con contraste para fondos oscuros (§10).

## 4. Llamadas al SDK y equivalente en Supabase

| Llamada Base44 | Dónde | Equivalente propuesto | MVP |
|---|---|---|---|
| `Microrelato.filter({estado:'publicado'}, sort -fecha_publicacion)` | `useContenidoPublico` | `select` en `microrelatos` desde Server Component (`src/lib/data/`); RLS pública solo para `publicado` | Sí |
| `Pregunta.filter({estado:'publicado'}, sort pregunta)` | `useContenidoPublico` | `select` en `faqs` + `microrelatos_faqs` | Sí |
| `Servicio.filter({estado:'activo'}, sort nombre)` | `useContenidoPublico` | `select` en `servicios` ordenado por `orden` (PRD §5), sin columnas internas | Sí |
| `Solicitud.create` | `Contacto` | `insert` en `solicitudes_contacto` desde Server Action, sin devolver datos, también en la versión pública (§9.3) | Sí (Fase 7) |
| `Evento.create` | `lib/eventos.js` | Ninguno de momento (§7) | **[futuro]** |
| `*.list/create/update/delete/count`, `Evento.aggregate` | `components/admin/*` | Table Editor de Supabase | **[futuro]** |
| `auth.*` (13 llamadas) | Login, registro, OAuth, `AuthContext` | Ninguno (sin login en el MVP) | **[futuro]** |
| `integrations.*` | — | Sin uso real (solo en el objeto de relleno): **se ignora** | No |

Nota: en Base44 la carga y el filtrado ocurren en el navegador (`useEffect` + `busqueda.js`). En Next.js la lectura pasará al servidor. El buscador de FAQs podrá seguir filtrando en el navegador; se decide en la Fase 5.

## 5. Esquema por entidad

Leyenda de restricciones:
- **B44**: definida en el esquema `.jsonc` de Base44.
- **CSV**: observada en los datos exportados.
- **Propuesta**: propuesta para Postgres.

**Estado de aprobación** (29/10/2026):
- `microrelatos` y `faqs`: **estructura aprobada**, incluidas las restricciones más estrictas que Base44.
- `solicitudes_contacto`: **mapeo aprobado**.
- `servicios`: **estructura aprobada** (§5.3), con `comision_modelo` en la tabla privada `servicios_comisiones`.
- Clave única de `faqs`: **`pregunta`**, para evitar preguntas duplicadas (§5.2).
- Los tipos SQL exactos, índices y RLS se detallan en `DATA_MODEL.md`.

**Columna `origen`** en `microrelatos` y `faqs`. Marca el contenido de ejemplo importado de Base44:
- `'base44_prueba'` en los registros de Base44;
- **NULL** en el contenido propio, revisado o definitivo;
- sin valor por defecto.
- **No se usa en `solicitudes_contacto`**: no hace falta distinguir solicitudes de prueba de solicitudes reales (decisión del 29/10/2026, que sustituye la anterior de añadirlo también allí).

**IDs de Base44:** no se conservan. En la Fase 2 se generarán nuevas claves primarias y las relaciones se reconstruirán por slug y por el mapa de servicios (§6). **No se ha encontrado ninguna dependencia real de los IDs originales**:
- todas las relaciones usan slug o nombre;
- `urls.js` solo recurre al `id` si un relato no tiene slug, y los 6 lo tienen;
- el resto de usos de `id` están en el panel de admin, que no se implementa.

### 5.1 Microrelato → `microrelatos` (estructura aprobada)

| Campo Base44 | B44 | CSV (6 registros) | Postgres (aprobado) | Riesgo de importación |
|---|---|---|---|---|
| titulo | obligatorio | todos con valor | `text not null` | — |
| slug | opcional | todos con valor, únicos | `text not null unique` | Más estricta que B44; los datos actuales cumplen |
| resumen | obligatorio | | `text not null` | — |
| contenido | obligatorio; párrafos separados por línea en blanco | | `text not null` | — |
| casuistica | obligatorio; enum de 8 | 6 valores distintos usados | `text not null` + `check` | — |
| perfil | opcional; enum de **6** | 4 valores usados | `text not null` + `check` | Más estricta que B44; los datos actuales cumplen |
| etiquetas | array de texto | array JSON serializado | `text[] not null default '{}'` | — |
| estado | enum `publicado`/`borrador`, por defecto `borrador` | todos `publicado` | igual | Se importan como `publicado` por autorización expresa (§9.1) |
| fecha_publicacion | fecha | todos con valor (2026-08-21 … 2026-10-06) | `date` | — |
| cta_principal | opcional | 3 valores distintos | `text` | — |
| servicio_relacionado | texto = **nombre** del servicio | 5 coinciden con un nombre; 1 = "Wellcomy" | `servicio_relacionado_id uuid references servicios(id)` | Resuelto con el mapeo de §6 |
| — | | | `origen text` (nullable, sin valor por defecto) | `'base44_prueba'` en los importados |
| created_date / updated_date | sistema | | `created_at` / `updated_at` | — |
| id, created_by_id, is_sample | sistema | `is_sample = false` en todos | No se migran | — |

- Casuísticas (B44 y `lib/casuisticas.js`): Regularización y arraigo · Documentación y NIE · Empleo y trabajo · Vivienda · Estudios y formación · Familia y reagrupación · Salud y bienestar · Idioma y cultura.
- Perfiles **permitidos por el esquema** (6, se conservan todos): Recién llegada/o · Familia · Estudiante · Trabajador/a · Emprendedor/a · Persona refugiada.
- Perfiles **presentes en los registros exportados** (4): Recién llegada/o · Familia · Estudiante · Trabajador/a.

### 5.2 Pregunta → `faqs` (estructura aprobada)

| Campo Base44 | B44 | CSV (12 registros) | Postgres (aprobado) | Riesgo de importación |
|---|---|---|---|---|
| pregunta | obligatorio | 12 preguntas | `text not null unique` | `unique` es la clave natural de la importación y evita preguntas duplicadas (aprobado). Habrá que comprobar en la importación que las 12 son distintas |
| respuesta | obligatorio | | `text not null` | — |
| casuistica | **opcional**; enum de 8 | todos con valor | `text not null` + `check` | Más estricta que B44; los datos actuales cumplen |
| etiquetas | array | | `text[] not null default '{}'` | — |
| microrelatos_asociados | array de **slugs** | 10 con asociación, 2 vacíos; todos los slugs existen | Tabla puente `microrelatos_faqs` (slug → id nuevo) | — |
| estado | enum, por defecto `borrador` | todos `publicado` | igual | Se importan como `publicado` (§9.1) |
| — | | | `origen text` (sin valor por defecto) | `'base44_prueba'` en los importados |

### 5.3 Servicio → `servicios` (estructura aprobada)

Fuente: `Servicio.jsonc` (aportado el 29/10/2026), `Servicio_export.csv` y `lib/casuisticas.js`.

| Campo | B44 (`Servicio.jsonc`) | Observado en el CSV (4 registros) | Propuesta Postgres | Diferencia con B44 |
|---|---|---|---|---|
| nombre | obligatorio; "Nombre público del servicio" | 4 nombres distintos | `text not null unique` | `unique` es nuevo: sirve como clave natural de la importación |
| descripcion | obligatorio; "Qué resuelve el servicio" | con valor | `text not null` | — |
| tipo | **opcional**; enum `propio`, `aliado`, `colaborador` | aliado (2), propio (1), colaborador (1) | `text not null` + `check` | **Más estricta**: obligatorio. Los datos actuales cumplen |
| proveedor | **opcional**; "Wellcomy u otro proveedor" | Red de intérpretes · ServiR Migrantes · Gestorías colaboradoras · Wellcomy | `text not null` | **Más estricta**: obligatorio. Los datos actuales cumplen |
| url_destino | opcional; "Enlace externo. Si está vacío, la solicitud se hace desde el formulario de contacto" | vacío en los 4 | `text` (nullable) | — |
| comision_modelo | opcional; "Descripción comercial interna del acuerdo" | con valor en los 4 | **Fuera de la tabla pública**: en la tabla privada `servicios_comisiones` (ver abajo) | **Cambio de acceso** (ver hallazgo) |
| estado | enum `activo`/`inactivo`, por defecto `activo` | `activo` en los 4 | `text not null default 'activo'` + `check` | — |
| — | no existe | — | `orden int` (PRD §5) | Columna nueva |
| — | no existe | — | sin `origen` | Los 4 servicios no se consideran datos de prueba |
| created_date / updated_date | sistema | | `created_at` / `updated_at` | — |
| id, created_by_id, is_sample | sistema | | No se migran | — |

- **Reglas de acceso B44 (confirmadas):** lectura si `estado = 'activo'` o si eres admin; crear, editar y borrar solo admin.
- **Hallazgo:** en Base44 la regla de lectura se aplicaba a la fila entera, así que **`comision_modelo` era legible por cualquiera** en los servicios activos. En el MVP no podrá leerse con la clave pública.
- **Propuesta RLS del MVP** (se detalla en `DATA_MODEL.md`): público solo `SELECT` de servicios `activo`; sin escritura pública.
- **Tabla privada `servicios_comisiones`** (aprobada el 29/10/2026):
  - campos: `servicio_id` (FK a `servicios`), `comision_modelo` y `updated_at`;
  - `servicios` es pública (solo lectura de activos); `servicios_comisiones` solo es accesible desde Supabase (panel o clave secreta), con RLS activada y sin políticas para el público;
  - la clave primaria (p. ej. `servicio_id`, relación 1:1) y cómo se cargan los valores sin dejarlos en el repositorio se detallan en `DATA_MODEL.md`.
- **Orden**: Base44 ordenaba por `nombre`; el MVP usará `orden` del PRD §5.

### 5.4 Solicitud → `solicitudes_contacto` (mapeo aprobado)

La entidad existe en Base44 (esquema, formulario `Contacto` y panel `AdminSolicitudes`). `Solicitud_export.csv` contiene **solo las cabeceras originales**, sin registros, así que no hay datos que importar. El modelo de destino es el del **PRD §7**.

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

`solicitudes_contacto` **no lleva `origen`**: esa columna solo marca contenido de ejemplo importado de Base44.

- **Cabeceras del CSV**: `nombre, email, telefono, necesidad, microrelato_origen, servicio_interes, consentimiento, fecha, Creado, Última actualización, Creado por`.
- **Discrepancias del CSV** (informativas, no afectan porque no se importa nada):
  - el archivo empieza con BOM;
  - los campos de sistema usan etiquetas del panel en español ("Creado", "Última actualización", "Creado por"), mientras los demás CSV usan `created_date`, `updated_date`, `created_by_id`;
  - al final hay líneas vacías y una línea con solo `,`.
- **Reglas B44**: crear = cualquiera; leer, editar y borrar = solo admin.
- **Validación en el navegador (B44)**: nombre no vacío; email por regex; `necesidad` de al menos 15 caracteres; consentimiento marcado. El mínimo de 15 caracteres no está en el PRD.
- **Consentimiento**: el texto de B44 es el mismo que el del PRD §6 (incluye "No se comparten con terceros"). Ver §8.2.

### 5.5 Otras entidades
- **Evento**: ver §7. **[futuro]**.
- **User**: solo tiene `role: admin|user`. Sin panel de admin ni login no hay roles, así que queda como **[futuro]**, pendiente de confirmación. Sus identificadores (`created_by_id`) no se importan.

## 6. Relaciones e importación

| Relación | Base44 | Destino | Observaciones |
|---|---|---|---|
| Microrelato → Servicio | `servicio_relacionado` = nombre | `servicio_relacionado_id` FK | 5 de 6 coinciden por nombre. "Wellcomy" (relato `alquilar-una-habitacion`) es un proveedor: se resuelve con el mapeo de abajo |
| Pregunta ↔ Microrelato | `microrelatos_asociados` = slugs | `microrelatos_faqs` (N:M) | Todos los slugs existen. 2 FAQs sin relato (Salud y bienestar; Regularización y arraigo): se importan igualmente. 1 FAQ de "Vivienda" está asociada a `reagrupar-a-mi-hija` (Familia y reagrupación) y a `alquilar-una-habitacion`: relación entre casuísticas distintas, se conserva tal cual |
| Solicitud → Servicio | nombre | `servicio_interes_id` | Sin datos |
| Solicitud → Microrelato | slug | `microrelato_origen_id` | Sin datos |

**Mapeo de "Wellcomy" (se aplica en la importación, decisión del 29/10/2026):**
`servicio_relacionado = "Wellcomy"` → servicio **"Plataforma de extranjería"** (proveedor "Wellcomy").
Así se mantiene la clave foránea aprobada. No se crea un quinto servicio ni se cambian el título, el texto ni la casuística del relato.

**Requisitos de la importación (Fase 2):**
- Leer los valores directamente de los CSV, sin inventarlos ni resumirlos.
- Repetible sin duplicados, apoyándose en claves naturales únicas: `slug` en microrelatos, `nombre` en servicios y `pregunta` en FAQs.
- `comision_modelo` se carga en `servicios_comisiones`, no en `servicios`.
- Comprobar al final que no se pierde ninguna relación:
  - 6 microrelatos con su servicio, incluido el mapeo de Wellcomy;
  - el número de pares FAQ–relato coincide con los arrays del CSV.
- Fuera de la importación: eventos, `created_by_id`, `is_sample` e IDs de Base44.

## 7. Eventos (`Evento`) — [futuro]

**No se implementa en el MVP.** Es una implementación futura posible, que solo se hará cuando la confirmes expresamente. La opción más probable es la 7.3 (herramienta externa de analítica), sin confirmar.

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

Hay tres decisiones separadas. Ninguna bloquea la demostración.

**7.1 Importar el historial de eventos**
- Si no se importa, se pierden los ≈152 registros y sus contadores, y los términos de búsqueda que contengan.
- Riesgo: `termino` y `referencia` pueden contener texto libre escrito por personas, incluidos posibles datos personales.

**7.2 Registrar eventos nuevos (registro propio)**
- Si no se hace, el MVP no tendrá:
  - contadores propios sin terceros ni cookies (visitas, búsquedas, clics a servicios, relatos vistos);
  - los **términos de búsqueda**, que indican qué contenido falta;
  - la atribución de clics a servicios.
- Las solicitudes podrán contarse desde `solicitudes_contacto`.
- Implementarlo exigiría escritura anónima en otra tabla, algo que `CLAUDE.md` prohíbe salvo para `solicitudes_contacto`: necesitaría tu autorización expresa. También requeriría límites contra spam.

**7.3 Herramienta externa de analítica** (opción probable, sin confirmar)
- Es la Fase 9 condicional y PRD §11.4 (Vercel Analytics, Google Analytics o ninguna).
- Si usa cookies, requiere consentimiento y banner.

## 8. Datos de negocio, textos legales e imágenes

### 8.1 Datos de negocio: datos de prueba [provisional]
Los datos de contacto de Base44 **se muestran en la demo como datos de prueba**, junto con los componentes que los contienen (Hero, `LlamadaFlotante`, pie). Siguen pendientes:
- hasta que se confirmen los datos de negocio oficiales que deban insertarse, o
- hasta que se confirme que estos datos de prueba se usarán como oficiales.

| Dato | Valor encontrado | Ubicación | En la demo |
|---|---|---|---|
| Teléfono | `+34 600 982 993` | `components/home/Hero.jsx` (L42, L46, L96; "agenda tu cita en esta línea"); `components/LlamadaFlotante.jsx` (L4–5) | Se muestra (dato de prueba); botones de llamada activos |
| WhatsApp | `34600982993` (`wa.me`) | `components/LlamadaFlotante.jsx` (L6, L51) | Se muestra (dato de prueba); botón activo |
| Denominación societaria | "SeR MigranteS S.L." | `components/SiteFooter.jsx` (L94) | Se muestra «© SeR MigranteS S.L.» (dato de prueba) |
| Dominio | `https://sermigrantes.es` | `lib/seo.js` (L5), `pages/Legal.jsx`, `pages/Home.jsx` (JSON-LD), footer | Se conectará en breve |
| Nombre de marca | **SeR MigranteS** | Logo, `BrandMark.jsx` | Marca oficial en textos, metadatos y documentación |
| Proveedor del servicio propio | "ServiR Migrantes" | `Servicio_export.csv`, PRD §5 | Dato del CSV, con aviso de demostración |
| Correo de contacto | **No encontrado** | — | No se inventa |
| NIF, domicilio | **No encontrados** (huecos en los textos legales) | `pages/Legal.jsx` | No se inventan |

Se mantienen estas decisiones:
- `comision_modelo` no se publica;
- no se inventan NIF, domicilio, correo, precios, acuerdos comerciales ni credenciales profesionales.

### 8.2 Textos legales: borradores no accesibles (decisión provisional)
- **Fuente**: `pages/Legal.jsx`. No se crea `reference/base44/privacidad.md`.
- Las páginas `/aviso-legal`, `/privacidad` y `/cookies` **se crean con los textos tal como estaban**, incluidos los "Texto pendiente de revisión legal", pero **no son accesibles desde la web**: sin enlaces, fuera del sitemap y devolviendo 404.
- Se harán accesibles cuando aportes los datos oficiales y indiques eliminar los textos pendientes. Mientras no digas lo contrario, esta decisión provisional se mantiene.
- No están revisadas ni garantizan el cumplimiento legal.
- **Huecos** (marcados en el código como "Texto pendiente de revisión legal"):
  - Aviso legal: titular (nombre o razón social, NIF, domicilio, correo); legislación aplicable y jurisdicción.
  - Privacidad: responsable del tratamiento (mismos datos); plazo de conservación.
  - Cookies: cookies de analítica o publicidad (proveedor, duración).
- **Formulario mientras `/privacidad` no sea accesible**: se mantiene la casilla de consentimiento obligatoria con su texto. Debajo del botón se muestra el texto **sin enlace** a `/privacidad`, con una nota de que la política de privacidad está pendiente.
- **Riesgo abierto, ligado a esta decisión**:
  - el formulario guardará datos personales en público sin una política de privacidad accesible;
  - las páginas legales todavía no pueden hacerse accesibles: faltan los datos oficiales del responsable y están llenas de marcadores y avisos de borrador;
  - el riesgo se cierra cuando aportes los datos oficiales y se activen las páginas (cambio futuro pendiente, §10).
- **Otros puntos a revisar**:
  - Privacidad dice "No cedemos tus datos a terceros ajenos a la atención de tu consulta", y el consentimiento dice "No se comparten con terceros": son formulaciones distintas.
  - Internamente, el servicio de Wellcomy se describe como "del mismo grupo" (`comision_modelo`). Esto conecta con PRD §6 y §11.9.
  - Cookies menciona "tu sesión si accedes al área privada del equipo", que no existe en el MVP.
  - El pie de página dice "Los relatos son casos reales reescritos y adaptados". **No puede aplicarse a los relatos de ejemplo** (§9.2).

### 8.3 Textos de interfaz
- Los textos de la portada (Hero, frase de impacto, "Tres formas de sentirte acompañado", cierre), de la cabecera y del pie están en `components/home/*`, `SiteHeader.jsx` y `SiteFooter.jsx`.
- **Textos que no se pueden reutilizar tal cual** porque presentan el contenido como casos reales:
  - Hero: "Casos reales adaptados…";
  - `Acompanamiento`: "Lee casos reales adaptados…";
  - `HistoriasDestacadas`: "Casos reales reescritos…";
  - pie de página: "Los relatos son casos reales reescritos y adaptados…".
- **Corrección decidida**: el H1 del Hero "Ser migrante es volver a empezar sin empezar de 0." se escribirá "**de cero**", igual que el mensaje de marca del PRD.
- **Marca**: «SeR MigranteS» en los textos de la interfaz. No cambian las frases de marca «Ser migrante es…».

### 8.4 Imágenes

| Imagen | Origen en Base44 | Uso | Archivo local |
|---|---|---|---|
| Hero | `…/3271a1ce3_generated_image.png` (CDN de Base44) | `home/Hero.jsx` (alt: mujer joven con mochila en una calle de barrio); también `og:image` e `IMAGEN_DEFECTO` (`lib/seo.js`, logo del JSON-LD) | `public/images/3271a1ce3_generated_image.png` (970×1213, 1,1 MB) |
| Cierre de contacto | `…/42995b94b_generated_image.png` (CDN de Base44) | `home/CierreContacto.jsx`, sección "Ser migrantes es construir un lugar para todos." (alt: grupo diverso conversando en un patio) | `public/images/42995b94b_generated_image.png` (1029×937, 1,8 MB) |
| Favicon | `https://db.com/logo_v2.svg` | `index.html` | **Decisión: el favicon será el logo** (`logo.png`); se implementa en la Fase 4 |
| Imagen de reserva | `https://static.wixstatic.com/media/12d367_…~mv2.png` | `components/ui/image.jsx` | **Se ignora** (ver abajo) |
| Logo | `reference/brand/logo-v1_SeR_MigranteS-light.png` | Cabecera y pie en lugar de `BrandMark` | `public/logo.png` |

- Las imágenes de Hero y Cierre se descargaron manualmente de Base44 y son las dos únicas que existen en la web.
  - Desde el 29/10/2026 se usan en **PNG**; las versiones AVIF se eliminaron de `reference/images/` y de `public/images/`.
  - Los originales se conservan en `reference/images/`.
- **Imagen de reserva**:
  - la usa solo el componente `ui/image.jsx`, que a su vez solo usan `Hero` y `CierreContacto`;
  - es el marcador que mostraba el editor visual de Base44 cuando no había imagen elegida o la original fallaba al cargar;
  - no aporta nada en Next.js con imágenes locales, así que no se usa.
- Los nombres `generated_image` sugieren imágenes generadas por IA **[no confirmado]**. No representan a protagonistas de los relatos de ejemplo.
- **[pendiente, Fase 4]**: integrar las imágenes PNG y verificar visualización, peso y compatibilidad.
  - Pesan 1,1 y 1,8 MB (en AVIF eran 79 y 224 KB).
  - **Aprobado (29/10/2026):** se sirven con `next/image`, que genera versiones optimizadas (AVIF/WebP) según el navegador. En la Fase 4 hay que comprobar el resultado y los límites de optimización de imágenes del plan gratuito de Vercel.
- `og:image`: el PNG de Hero sirve para la vista previa en redes (Fase 6); ya no hace falta convertir.

## 9. Modo demostración (decisiones del 29/10/2026)

### 9.1 Contenido de ejemplo publicado
- Se importan y se muestran públicamente los 6 microrelatos, las 12 FAQs (incluidas las 2 sin relato asociado) y los 4 servicios, con los valores del CSV.
- Microrelatos y FAQs se importan como `publicado`, **por autorización expresa** para la demostración. No significa que estén verificados, que sean testimonios reales ni que sus afirmaciones jurídicas estén aprobadas.
- Microrelatos y FAQs importados llevan `origen = 'base44_prueba'`. **No es el valor por defecto** de la columna: el contenido futuro no lo hereda; el contenido propio o definitivo lleva `origen` NULL.
- El contenido nuevo sigue naciendo como `borrador` (PRD §4).
- No se genera contenido ni registros de ejemplo nuevos.

### 9.2 Avisos visibles
- **Aviso general de versión de demostración**, en todo el sitio.
- **Indicación de contenido de ejemplo** en las fichas de microrelatos y en las FAQs con `origen = 'base44_prueba'`. Debe decir que son ejemplos generados para mostrar el funcionamiento, no testimonios verificados ni asesoramiento profesional.
- Los relatos de prueba **no se presentan como "casos reales adaptados"** (ver §8.3).
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
- Mientras `/privacidad` no sea accesible, el texto bajo el botón va sin enlace (§8.2).
- **Pendiente de lanzamiento**: la información del responsable del tratamiento y la política de privacidad, necesarias antes de abrir el formulario a consultas reales (§8.2). El formulario funcional no se sustituye por una simulación.

### 9.4 Datos de negocio en la demo
- Teléfono, WhatsApp y «SeR MigranteS S.L.» se muestran como **datos de prueba** (§8.1), con sus componentes y botones.
- Marca: «SeR MigranteS».
- No se inventan NIF, domicilio, correo, precios, acuerdos comerciales ni credenciales profesionales.
- `comision_modelo` no se publica (§5.3).

### 9.5 Paso de la demostración al lanzamiento definitivo
Antes del lanzamiento definitivo habrá que:
- revisar, sustituir o aprobar los microrelatos y FAQs de ejemplo;
- retirar los avisos solo donde corresponda;
- completar y aprobar los textos legales y hacer accesibles sus páginas;
- confirmar o sustituir los datos de negocio de prueba.

## 10. Decisiones pendientes

| # | Decisión | Origen | Bloquea |
|---|---|---|---|
| 1 | Cómo cargar `comision_modelo` en `servicios_comisiones` sin dejar los valores en el repositorio (con los datos de prueba actuales no importa) | §5.3, PRD §5 | Fase 2 (`DATA_MODEL.md`) |
| 2 | Datos de negocio oficiales, o confirmar los de prueba como oficiales | §8.1 | Lanzamiento definitivo |
| 3 | **[futuro]** Datos del responsable del tratamiento, textos legales definitivos y coherencia del consentimiento con la derivación a terceros; después, hacer accesibles las páginas legales. **Riesgo abierto** mientras tanto: el formulario guarda datos sin política de privacidad accesible (§8.2) | §8.2, PRD §11.6 y §11.9 | Activar las páginas legales y abrir el formulario a consultas reales |
| 4 | Que aportes en `reference/brand/` un logo con contraste para fondos oscuros, para sustituir el icono de Base44 en el pie | §3 | Fase 4 (mientras tanto, icono de Base44) |
| 5 | Integrar las imágenes PNG con `next/image` (aprobado) y verificar visualización, peso servido y límites de Vercel | §8.4 | Fase 4 |
| 6 | Mínimo de 15 caracteres en el mensaje (Base44) frente a PRD sin mínimo | §5.4 | Fase 7 |
| 7 | Etiqueta del servicio propio: "Servicio propio" (Base44) frente a "Servicio propio – ServiR Migrantes" (PRD §5) | §5.3 | Fase 5 |
| 8 | **[futuro]** Eventos: historial (7.1), registro propio (7.2), analítica externa (7.3, probable) | §7 | No bloquea la demo |
| 9 | **[futuro]** Admin, login, registro, OAuth y entidad User | §2, §5.5 | No bloquea la demo |
| 10 | **[futuro]** Modo oscuro | §3 | No bloquea la demo |

**Resueltas el 29/10/2026**:
- **Rutas**: `/historias`, `/historias/[slug]` y `/preguntas-frecuentes`, sin redirecciones.
- **Wellcomy**: se mapea a "Plataforma de extranjería".
- **Restricciones de microrelatos y FAQs**: estructura aprobada.
- **Tipografías**: Fraunces e Inter hasta nuevo aviso.
- **Imágenes**: ya no hacen falta sustitutas; se usan las PNG existentes (sustituyen a las AVIF).
- **`servicios`**: estructura aprobada; `comision_modelo` en la tabla privada `servicios_comisiones`.
- **FAQs**: `pregunta` como clave única.
- **`origen`**: solo en `microrelatos` y `faqs`; no se usa para clasificar solicitudes.
- **Pie de página**: icono de Base44 hasta tener un logo para fondos oscuros.
- **Favicon**: será el logo.
- **Imagen de reserva**: se ignora.
- **Marca**: SeR MigranteS.
- **Datos de contacto**: se muestran como datos de prueba.
- **Páginas legales**: se crean pero no son accesibles.
