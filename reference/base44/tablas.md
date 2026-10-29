# Tablas de Base44 — exportación CSV (28/10/2026)

Fuente: exportación CSV del panel de Base44 y esquemas en `base44/entities/*.jsonc`. Revisado en la Fase 1 (29/10/2026); el análisis completo está en `docs/BASE44_ANALYSIS.md`.

Las propuestas de Postgres de este documento son un **punto de partida, no el esquema oficial**. El esquema definitivo se fija en `docs/DATA_MODEL.md` (Fase 2).

Los 6 microrelatos y las 12 FAQs son datos de PRUEBA generados por Base44, no contenido aprobado. Se importan como datos de arranque para una web de demostración, con `estado = 'publicado'` por autorización expresa y `origen = 'base44_prueba'`. Eso no implica que estén verificados, que sean testimonios reales ni que sus afirmaciones jurídicas estén aprobadas.

## Archivos CSV originales en `reference/base44/`

| Archivo | Registros | Notas |
|---|---|---|
| `Microrelato_export.csv` | 6 | |
| `Pregunta_export.csv` | 12 | |
| `Servicio_export.csv` | 4 | |
| `Evento_export.csv` | ≈152 (recuento de líneas) | No se importa (ver Evento) |
| `Solicitud_export.csv` | 0 | Solo cabeceras originales (aportadas el 29/10/2026), sin registros |

Los CSV se conservan sin cambios como referencia.

## Convenciones observadas
- **IDs**: texto hexadecimal (p. ej. `6adf88d81612eb3bc8ebc3fa`). **No se migran**: Supabase genera claves nuevas y las relaciones se reconstruyen por slug y nombre de servicio. No se ha encontrado ninguna dependencia real de los IDs originales.
- **Fechas**: ISO 8601 (`2026-10-26T17:07:36.633000`).
- **Arrays** (etiquetas y relaciones): JSON serializado como texto, con comillas dobles escapadas.
- **`is_sample`**: booleano; `false` en todos los registros exportados. No se migra.
- **`created_by_id`**: referencia a un usuario de Base44. No se migra.

## Leyenda
- **Esquema B44**: lo que define el `.jsonc` de Base44 (restricción original).
- **Observado**: lo que aparece en los registros exportados.
- **Propuesta Postgres**: restricción propuesta para el MVP. Puede ser más estricta que la original; se confirma en la Fase 2.

## Microrelato (`microrelatos`)
| Campo Base44 | Esquema B44 | Observado | Propuesta Postgres |
|---|---|---|---|
| id | sistema | | `id uuid primary key default gen_random_uuid()` (clave nueva) |
| titulo | obligatorio | | `titulo text not null` |
| slug | opcional | único en los 6 | `slug text not null unique` (más estricta que B44) |
| resumen | obligatorio | | `resumen text not null` |
| contenido | obligatorio | | `contenido text not null` |
| casuistica | obligatorio, enum de 8 | | `casuistica text not null` + `check` |
| perfil | **opcional**, enum de 6 | 4 valores usados | `perfil text not null` + `check` (más estricta que B44) |
| etiquetas | array de texto | | `etiquetas text[] not null default '{}'` |
| estado | `publicado` / `borrador`, por defecto `borrador` | todos `publicado` | `estado text not null default 'borrador' check (estado in ('borrador','publicado'))` |
| fecha_publicacion | fecha | | `fecha_publicacion date` |
| cta_principal | opcional | | `cta_principal text` |
| servicio_relacionado | texto = nombre del servicio (NO id) | 5 coinciden con un nombre; 1 = "Wellcomy" (proveedor, no nombre) | `servicio_relacionado_id uuid references servicios(id)`, migrado por nombre + mapeo de abajo |
| — | — | — | `origen text` (nullable, **sin valor por defecto**); `'base44_prueba'` solo en los registros importados |
| created_date / updated_date | sistema | | `created_at`, `updated_at` |
| created_by_id / is_sample | sistema | | NO migrar |

**Casuísticas** (esquema, 8): Regularización y arraigo · Documentación y NIE · Empleo y trabajo · Vivienda · Estudios y formación · Familia y reagrupación · Salud y bienestar · Idioma y cultura.

**Perfiles:**
- Permitidos por el esquema (6, se conservan todos): Recién llegada/o · Familia · Estudiante · Trabajador/a · Emprendedor/a · Persona refugiada.
- Presentes en los registros exportados (4): Recién llegada/o · Familia · Estudiante · Trabajador/a.

**Mapeo que se aplica en la importación (decisión del 29/10/2026):** `servicio_relacionado = "Wellcomy"` (relato `alquilar-una-habitacion`) → servicio "Plataforma de extranjería" (proveedor "Wellcomy"). No se crea un quinto servicio ni se modifica el relato.

**Estructura de `microrelatos` y `faqs`: aprobada el 29/10/2026**, incluidas las restricciones más estrictas que Base44.

## Pregunta frecuente (`faqs`)
| Campo Base44 | Esquema B44 | Observado | Propuesta Postgres |
|---|---|---|---|
| id | sistema | | `id uuid primary key default gen_random_uuid()` (clave nueva) |
| pregunta | obligatorio | | `pregunta text not null unique` (aprobado: evita duplicados y es la clave de la importación) |
| respuesta | obligatorio | | `respuesta text not null` |
| casuistica | **opcional**, enum de 8 | todas con valor | `casuistica text not null` + `check` (más estricta que B44) |
| etiquetas | array de texto | | `etiquetas text[] not null default '{}'` |
| microrelatos_asociados | array de slugs | 10 con asociación, 2 vacías; todos los slugs existen | relación N:M vía `microrelatos_faqs` (migrar por slug) |
| estado | `publicado` / `borrador`, por defecto `borrador` | todas `publicado` | `estado text not null default 'borrador' check (estado in ('borrador','publicado'))` |
| — | — | — | `origen text` (sin valor por defecto) |
| created_date / updated_date | sistema | | `created_at`, `updated_at` |
| created_by_id / is_sample | sistema | | NO migrar |

Nota: la relación es por SLUG del microrelato, no por id. Una FAQ puede asociarse a varios microrelatos y viceversa. Las FAQs sin microrelato asociado también se importan.

## Servicio (`servicios`) — estructura aprobada (29/10/2026)
Fuente: `base44/entities/Servicio.jsonc` (aportado el 29/10/2026), el CSV y `src/lib/casuisticas.js`.

**Reglas de acceso B44 (confirmadas):** lectura si `estado = 'activo'` o si eres admin; crear, editar y borrar solo admin. En Base44 la lectura se aplicaba a la fila entera, así que `comision_modelo` era legible públicamente en los servicios activos. En el MVP no lo será.

| Campo Base44 | Esquema B44 | Observado (CSV) | Propuesta Postgres |
|---|---|---|---|
| id | sistema | texto | `id uuid primary key default gen_random_uuid()` (clave nueva) |
| nombre | obligatorio | 4 nombres distintos | `nombre text not null unique` (`unique`: clave natural de la importación) |
| descripcion | obligatorio | con valor | `descripcion text not null` |
| tipo | **opcional**, enum `propio`/`aliado`/`colaborador` | aliado (2), propio (1), colaborador (1) | `tipo text not null check (tipo in ('aliado','propio','colaborador'))` (más estricta que B44) |
| proveedor | **opcional** | con valor | `proveedor text not null` (más estricta que B44) |
| url_destino | opcional; vacío = la solicitud va por el formulario de contacto | VACÍO en los 4 | `url_destino text` (nullable) |
| comision_modelo | opcional; "descripción comercial interna del acuerdo" | con valor en los 4 | **Se conserva** como dato comercial interno provisional en la tabla **privada** `servicios_comisiones` (`servicio_id`, `comision_modelo`, `updated_at`), accesible solo desde Supabase. No va en `servicios` |
| estado | enum `activo`/`inactivo`, por defecto `activo` | `activo` en los 4 | `estado text not null default 'activo' check (estado in ('activo','inactivo'))` |
| — | — | — | `orden int` (PRD §5) |
| — | — | — | Sin `origen`: los 4 servicios no se tratan como datos de prueba |
| created_date / updated_date | sistema | | `created_at`, `updated_at` |
| created_by_id / is_sample | sistema | | NO migrar |

Los 4 servicios se importan y se muestran. `url_destino` está pendiente de aportar.

## Solicitud (`solicitudes_contacto`)
La entidad **existe** en Base44 (`base44/entities/Solicitud.jsonc`, formulario de contacto y panel de admin). Su CSV solo tiene cabeceras, así que no hay datos que importar. El modelo de destino es el del PRD §7; el **mapeo está aprobado** (29/10/2026).

Cabeceras del CSV: `nombre, email, telefono, necesidad, microrelato_origen, servicio_interes, consentimiento, fecha, Creado, Última actualización, Creado por`. Los campos de sistema llevan etiquetas del panel en español, a diferencia de los demás CSV. El archivo tiene BOM y, al final, líneas vacías y una línea `,`.

| Campo Base44 | Esquema B44 | Destino (PRD §7) |
|---|---|---|
| nombre | obligatorio | `nombre` |
| email | obligatorio, formato email | `email` |
| telefono | opcional | `telefono` |
| necesidad | obligatorio | `mensaje` |
| servicio_interes | opcional, nombre del servicio | `servicio_interes_id` (FK; NULL = "todavía no lo sé") |
| microrelato_origen | opcional, slug | `microrelato_origen_id` |
| consentimiento | obligatorio, boolean | `consentimiento` (`check = true`) |
| fecha | date-time | `created_at` |

Reglas B44: crear = cualquiera; leer, editar y borrar = solo admin.

**Columna `origen`**: está solo en `microrelatos` y `faqs` y marca el contenido de ejemplo importado de Base44. Vale `'base44_prueba'` en esos datos y NULL en el contenido propio o definitivo. `solicitudes_contacto` no la lleva.

## User — implementación futura
Sin panel de admin ni login en el MVP no hay roles: queda como implementación futura, pendiente de confirmación. `created_by_id` no se migra.

## Evento (`eventos`) — NO se importa (implementación futura, pendiente de confirmación)
- **Cabeceras**: `tipo, referencia, termino, fecha, id, created_date, updated_date, created_by_id, is_sample`.
- **Qué registraba**: interacciones (`visita`, `busqueda`, `clic_servicio`, `clic_relato`, `solicitud`).
- **Procedencia de los registros: no verificada.**
- Hay tres decisiones separadas y pendientes: importar el historial, registrar eventos nuevos y elegir una analítica externa (ver `docs/BASE44_ANALYSIS.md` §7).

## Relaciones
- `microrelatos.servicio_relacionado` → `servicios`: por nombre en Base44; por FK en Postgres, aplicando el mapeo de "Wellcomy" → "Plataforma de extranjería".
- `faqs.microrelatos_asociados` ↔ `microrelatos` N:M: por slug en Base44; tabla puente `microrelatos_faqs` en Postgres.
- `solicitudes.servicio_interes` → nombre del servicio, y `solicitudes.microrelato_origen` → slug: por FK en Postgres.

## Datos a importar
- 6 microrelatos, 12 FAQs y 4 servicios, con los valores del CSV sin inventar ni resumir.
- Microrelatos y FAQs: `estado = 'publicado'` (autorización para la demostración) y `origen = 'base44_prueba'`.
- La importación debe ser repetible sin duplicados y comprobar que no se pierde ninguna relación.
- No se importan eventos, `created_by_id`, `is_sample` ni IDs de Base44.

**Advertencia:** el contenido es de prueba generado por Base44. Antes del lanzamiento definitivo hay que revisar cada microrelato y FAQ (verdad de los contenidos, tono, datos legales) y sustituirlo o aprobarlo. El estado `publicado` no implica aprobación editorial.
