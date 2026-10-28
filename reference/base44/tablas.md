# Tablas de Base44 — exportación CSV (28/10/2026)

Fuente: exportación CSV del panel de Base44. Los datos son de PRUEBA generados dinámicamente por Base44 (6 microrelatos, 12 FAQs, 4 servicios, eventos). NO son contenido aprobado. Se cargan en producción como datos de arranque según decisión de la propietaria (ver PLAN Fase 2).

Archivos CSV originales en `reference/base44/`:
- `Microrelato_export-4.csv`
- `Pregunta_export-3.csv`
- `Servicio_export-2.csv`
- `Evento_export-5.csv`

## Convenciones observadas
- IDs: texto hexadecimal (ej. `6adf88d81612eb3bc8ebc3fa`).
- Fechas: ISO 8601 (`2026-10-26T17:07:36.633000`).
- Etiquetas y relaciones: arrays JSON serializados como texto con comillas dobles escapadas.
- `is_sample`: booleano; `false` en todos los registros exportados.
- `created_by_id`: referencia a un usuario de Base44; no se migra.

## Microrelato (`microrelatos`)
| Campo Base44 | Tipo observado | Equivalente Postgres propuesto |
|---|---|---|
| id | texto | `id uuid primary key default gen_random_uuid()` |
| titulo | texto | `titulo text not null` |
| slug | texto (único, kebab-case) | `slug text not null unique` |
| resumen | texto | `resumen text not null` |
| contenido | texto largo | `contenido text not null` |
| casuistica | texto (categoría) | `casuistica text not null` |
| perfil | texto | `perfil text not null` |
| etiquetas | array JSON de texto | `etiquetas text[] not null default '{}'` |
| estado | `publicado` / `borrador` | `estado text not null default 'borrador' check (estado in ('borrador','publicado'))` |
| fecha_publicacion | fecha | `fecha_publicacion date` |
| cta_principal | texto | `cta_principal text` |
| servicio_relacionado | texto = nombre del servicio (NO id) | `servicio_relacionado_id uuid references servicios(id)` — migrar por nombre |
| created_date / updated_date | timestamp | `created_at`, `updated_at` |
| created_by_id / is_sample | — | NO migrar |

Valores observados de `casuistica`: Idioma y cultura · Vivienda · Estudios y formación · Empleo y trabajo · Salud y bienestar · Regularización y arraigo · Familia y reagrupación · Documentación y NIE.
Valores observados de `perfil`: Recién llegada/o · Familia · Estudiante · Trabajador/a.

## Pregunta frecuente (`faqs`)
| Campo Base44 | Tipo observado | Equivalente Postgres propuesto |
|---|---|---|
| id | texto | `id uuid primary key default gen_random_uuid()` |
| pregunta | texto | `pregunta text not null` |
| respuesta | texto largo | `respuesta text not null` |
| casuistica | texto | `casuistica text not null` |
| etiquetas | array JSON de texto | `etiquetas text[] not null default '{}'` |
| microrelatos_asociados | array JSON de slugs | relación N:M vía `microrelatos_faqs` (migrar por slug) |
| estado | `publicado` | `estado text not null default 'borrador' check (estado in ('borrador','publicado'))` |
| created_date / updated_date | timestamp | `created_at`, `updated_at` |
| created_by_id / is_sample | — | NO migrar |

Nota: la relación es por SLUG del microrelato, no por id. Una FAQ puede asociarse a varios microrelatos y viceversa.

## Servicio (`servicios`)
| Campo Base44 | Tipo observado | Equivalente Postgres propuesto |
|---|---|---|
| id | texto | `id uuid primary key default gen_random_uuid()` |
| nombre | texto | `nombre text not null` |
| descripcion | texto | `descripcion text not null` |
| tipo | `aliado` / `propio` / `colaborador` | `tipo text not null check (tipo in ('aliado','propio','colaborador'))` |
| proveedor | texto | `proveedor text not null` |
| url_destino | texto (VACÍO en los 4) | `url_destino text` (nullable) |
| comision_modelo | texto (comercial interno) | NO crear columna en el MVP; si se necesita, tabla/columna privada |
| estado | `activo` | `estado text not null default 'activo' check (estado in ('activo','inactivo'))` |
| created_date / updated_date | timestamp | `created_at`, `updated_at` |
| created_by_id / is_sample | — | NO migrar |

Los 4 servicios reales ya existen en el CSV. `url_destino` está vacío en todos: pendiente de aportar.

## Evento (`eventos`) — NO migrar en el MVP
Datos de prueba de analítica de Base44. El MVP no incluye esta tabla; la analítica está en Fase 9 condicional.

## Relaciones
- `microrelatos.servicio_relacionado` → `servicios` (por nombre en Base44; por FK en Postgres).
- `faqs.microrelatos_asociados` ↔ `microrelatos` N:M (por slug en Base44; tabla puente `microrelatos_faqs` en Postgres).
- `solicitudes_contacto` no existe en Base44; se diseña en Postgres según PRD §6.

## Datos de prueba a cargar
Decisión: cargar los 6 microrelatos y 12 FAQs como datos de arranque en producción (con columna `origen text default 'base44_prueba'` para identificarlos y sustituirlos después).

Advertencia: el contenido es de prueba generado por Base44. Antes de lanzar públicamente, revisar cada microrelato y FAQ (verdad de los contenidos, tono, datos legales) y sustituir o aprobar. El estado `publicado` en el CSV no implica aprobación editorial.