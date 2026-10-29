# DECISIONS — Registro de decisiones del MVP

Trazabilidad de planes aprobados y ejecutados durante la creación de SeR MigranteS.

## Formato de entrada
### [YYYY-MM-DD] Fase X — <título corto>
- **Qué se aprobó:** ...
- **Archivos creados/modificados:** ...
- **Decisiones tomadas:** ...
- **Estado:** ejecutado / pendiente de verificar

---

## Entradas

### [2026-10-28] Fase 0 — Scaffolding Next.js + TS + Tailwind en la raíz
- **Qué se aprobó:** generar la app con `create-next-app@latest` en una carpeta temporal (la raíz no estaba vacía) y copiarla a la raíz sin subcarpeta; `npm install` de las dependencias del scaffold; script `typecheck`; excluir `reference/` de TypeScript, ESLint y Tailwind; `.gitignore` con `!.env.example`; `.env.example` sin valores; estructura de carpetas de `CLAUDE.md` con `.gitkeep`; logo en `public/logo.png`; página provisional "Ser Migrantes". Verificación de `dev` con `Invoke-WebRequest` (Windows).
- **Archivos creados/modificados:** `package.json`, `package-lock.json`, `tsconfig.json`, `eslint.config.mjs`, `next.config.ts`, `.gitignore`, `.env.example`, `AGENTS.md`, `src/app/{layout.tsx,page.tsx,globals.css,favicon.ico}`, `public/logo.png`, `.gitkeep` en `src/components/`, `src/lib/supabase/`, `src/lib/data/`, `src/types/`, `supabase/migrations/`; `docs/PLAN.md`, `docs/TASKS.md`, `docs/DECISIONS.md`.
- **Decisiones tomadas:**
  - Versiones: Next.js 16.4.3, React 19.3.0, Tailwind v4, ESLint 9, TypeScript 5 (`strict: true`). React Compiler desactivado.
  - Next 16.4 integra Tailwind con `@tailwindcss/turbopack` en `next.config.ts`, así que no hay `postcss.config.mjs` (el plan lo preveía). El scaffold activa `cacheComponents` y `partialPrefetching`; se mantienen por defecto.
  - `typecheck` es `next typegen && tsc --noEmit`: los tipos globales de rutas (`LayoutProps`) solo existen tras generarlos y `tsc` fallaba en un clon limpio.
  - Se quita la fuente Geist (tipografía pendiente, PRD §11.8) y los SVG de ejemplo de `public/`. Se conserva el `README.md` existente.
  - `AGENTS.md` lo genera `next dev` automáticamente (reglas de Next para agentes); se versiona para no dejar cambios pendientes.
  - No existe `reference/base44/privacidad.md`; no bloquea la fase.
- **Cambio de alcance descartado:** tras revisar la página provisional en el navegador, se pidió portar la portada de Base44. Después se retiró la petición: la página provisional de la Fase 0 se queda como está (logo + título). El fondo oscuro detrás del logo viene del modo oscuro por defecto del scaffold (`prefers-color-scheme: dark` en `globals.css`); se revisará al definir los tokens en la Fase 4.
- **Error corregido:** al repetir las verificaciones antes del commit, se ejecutaron por error `npm run typecheck/lint/build` con el directorio de trabajo en `reference/base44`, lo que lanzó los scripts de Base44. `typecheck` (`tsc -p jsconfig.json`) falló sin emitir archivos; `lint` y `build` no llegaron a ejecutarse porque allí no hay `node_modules`. Se comprobó que `reference/` no tenía cambios ni archivos nuevos y se repitieron las verificaciones en la raíz. Lección: fijar siempre la ruta del proyecto antes de ejecutar scripts.
- **Estado:**
  - Ejecutado: scaffolding; `typecheck`, `lint` y `build` repetidos en la raíz antes del commit, todos OK; `git status`/`git diff` revisados, solo cambios aprobados.
  - Aprobado: commit y push a `origin/main`.
  - Pendiente: push (se registra en una entrada posterior solo si termina bien).

### [2026-10-28] Fase 0 — Cierre: commit y push
- **Qué se aprobó:** commit y push a `origin/main` de la Fase 0, tras repetir las verificaciones; marcar la fase en `PLAN.md` solo si el push termina bien, y subir esa actualización en un segundo commit.
- **Archivos creados/modificados:** `docs/PLAN.md` (casilla «Commit y push» y estado actual → Fase 1), `docs/DECISIONS.md`.
- **Decisiones tomadas:** ninguna respecto al plan aprobado.
- **Estado:** ejecutado. Commit `2d6e3a5` subido a `origin/main` (`70a5baa..2d6e3a5 main -> main`). Fase 0 cerrada; fase en curso: Fase 1.

### [2026-10-29] Fase 1 — Análisis de Base44 y decisiones sobre los datos
- **Qué se aprobó:**
  - Plan de análisis de `reference/base44/` (solo lectura) y redacción de `docs/BASE44_ANALYSIS.md`.
  - Correcciones documentales:
    1. Nombres reales de los CSV en `tablas.md`, más `Solicitud_export.csv` (0 bytes, sin cabeceras).
    2. La entidad `Solicitud` existe en Base44; se documentan sus campos y su mapeo al PRD sin cambiar el PRD (`necesidad → mensaje`, `servicio_interes` (nombre) `→ servicio_interes_id`, `microrelato_origen` (slug) `→ microrelato_origen_id`, `fecha → created_at`).
    3. La ausencia de `Servicio.jsonc` es una limitación de la exportación, no un bloqueo; las reglas de acceso originales son desconocidas.
    4. Se conservan el relato y su asociación con Wellcomy. Mapeo propuesto "Wellcomy" → "Plataforma de extranjería", **pendiente de confirmación antes de importar**; sin quinto servicio ni cambios en el relato.
    5. Las propuestas de `tablas.md` son un punto de partida; se distinguen las restricciones de Base44 de las propuestas y se avisa de las que puedan impedir la importación.
    6. Se conservan los 6 perfiles del esquema, distinguiéndolos de los 4 presentes en los datos.
    7. `comision_modelo` se conserva como dato comercial interno provisional, sin acceso público; almacenamiento y permisos en la Fase 2.
    8. Datos de negocio (teléfono, WhatsApp, "SeR MigranteS S.L.") documentados con su ubicación; provisionales.
    9. Textos legales de `Legal.jsx` conservados como borradores, con sus huecos; no se crea `privacidad.md`.
    10. Inventario de imágenes; las sustitutas quedan para la Fase 4, sin costes ni imágenes que aparenten ser protagonistas reales.
  - Decisiones de demostración:
    - **IDs de Base44**: no se conservan; claves nuevas y relaciones por slug y por el mapa de servicios.
    - **Importación**: repetible sin duplicados y con comprobación de relaciones.
    - **Contenido publicado**: se importan y publican 6 microrelatos, 12 FAQs y 4 servicios. Microrelatos y FAQs como `publicado`, por autorización expresa que sustituye la obligación anterior de mantenerlos en borrador.
    - **Origen**: `origen = 'base44_prueba'` sin valor por defecto.
    - **Avisos**: aviso general de demostración e indicación de contenido de ejemplo; no presentarlos como casos reales.
    - **Eventos**: se separan historial, registro propio y analítica externa; ninguno se implementa sin una decisión adicional y no bloquean la demo; procedencia no verificada.
    - **Datos de negocio**: no se publican los no confirmados; marca «Ser Migrantes».
- **Decisión sustituida (se conserva el historial):** el 29/10/2026 se aprobó primero que el formulario público funcionara en "modo demostración", con envío simulado que no guardaba datos y el mensaje «Envío de demostración: no se ha enviado ninguna solicitud». **Esa decisión queda sustituida** por la corrección del mismo día: el modo demostración solo afecta al contenido de ejemplo. El formulario es funcional también en la versión pública:
  - validación de campos y consentimiento;
  - Server Action e inserción en `solicitudes_contacto`;
  - éxito solo tras confirmar la inserción, y error si falla;
  - sin lectura pública ni logs con datos;
  - antispam.

  Pruebas solo con datos ficticios. Los datos del responsable y la política de privacidad quedan pendientes antes de abrir el formulario a consultas reales. Las instrucciones de envío simulado se eliminaron de `CLAUDE.md`, `PRD.md` y `BASE44_ANALYSIS.md` antes de cualquier commit. `PLAN.md` nunca llegó a incluirlas: se rechazó esa edición.
- **Archivos creados/modificados:** `docs/BASE44_ANALYSIS.md` (nuevo), `reference/base44/tablas.md` (correcciones autorizadas), `docs/PRD.md` (§4 versión de demostración, §5 nombre del CSV y modelo comercial provisional, §7, §9), `docs/PLAN.md` (Fase 10: pruebas del formulario real), `CLAUDE.md` (reglas sobre datos de Base44, demostración y formulario), `docs/TASKS.md`, `docs/DECISIONS.md`.
- **Decisiones tomadas (por Claude, para tu revisión):**
  - No se ha encontrado ninguna dependencia real de los IDs de Base44.
  - Como criterio de deduplicación se proponen `slug` (microrelatos) y `nombre` (servicios); la clave de las FAQs queda pendiente.
  - Las filas de eventos no se han leído. De `Servicio_export.csv` se leyeron `nombre`, `proveedor`, `tipo`, `estado`, `url_destino` y `comision_modelo`; este último, para pasarlo al PRD. De microrelatos y FAQs solo se leyeron las columnas necesarias para verificar relaciones y valores (`slug`, `casuistica`, `perfil`, `estado`, `fecha_publicacion`, `servicio_relacionado`, `cta_principal`, `microrelatos_asociados`, `is_sample`), no el contenido.
- **Estado:**
  - Ejecutado: análisis y ajustes documentales; sin código, migraciones, commit ni push.
  - Pendiente: tu aprobación de `BASE44_ANALYSIS.md` (fin de la Fase 1), la confirmación del mapeo de Wellcomy y el commit.

### [2026-10-29] Fase 1 — Aprobación del análisis y preparación de la Fase 2
- **Qué se aprobó:**
  - `docs/BASE44_ANALYSIS.md`, como análisis. Las propuestas técnicas de Postgres siguen pendientes de aprobación en `DATA_MODEL.md`: aprobar el análisis **no** autoriza migraciones ni cambios en Supabase.
  - Preparar `TASKS.md` para la Fase 2 en tres bloques: A) propuesta y aprobación de `DATA_MODEL.md`; B) generación y revisión de migraciones; C) aplicación en Supabase y verificación.
  - Mantener el repositorio privado y **no reescribir el historial ahora**.
  - Añadir a `PLAN.md` una tarea obligatoria previa al despliegue o a cualquier publicación: auditar el historial de Git y eliminar o reescribir los commits con CSV que contengan `comision_modelo`, eventos u otros datos sensibles; verificar ramas, tags, releases y árbol actual; asegurar `.gitignore`.
- **Archivos creados/modificados:**
  - `docs/BASE44_ANALYSIS.md`: estado → aprobado.
  - `docs/PLAN.md`: estado actual → Fase 2 (no iniciada); tarea de auditoría del historial en la Fase 10; en la Fase 2, `origen` solo para microrelatos y FAQs e importación repetible sin duplicados.
  - `docs/TASKS.md`: Fase 2 en tres bloques.
  - `docs/DECISIONS.md`.
- **Decisiones tomadas (por Claude):**
  - Se comprobó sin autenticación que el repositorio de GitHub devuelve 404 (privado). Los CSV con `comision_modelo` y eventos están en el historial desde el commit `0220cb7`.
  - Se corrigió en `PLAN.md` la línea que asignaba `origen = 'base44_prueba'` también a los servicios. Contradecía el PRD §7, donde `servicios` no tiene `origen`.
  - En la tarea de auditoría se mencionan expresamente la tabla de modelo comercial del PRD §5 y las futuras migraciones, porque también contendrían datos comerciales.
- **Decisiones posteriores tuyas (29/10/2026), aplicadas:**
  1. Se marcan las casillas de la Fase 1 en `PLAN.md`. El rechazo anterior solo servía para indicar la tarea del historial.
  2. `CLAUDE.md`: «Los microrelatos son casos reales ADAPTADOS» se sustituye por «Los microrelatos son ejemplos de casos para prueba». No son reales; se usan en este MVP; los reales se subirán más adelante y se eliminarán los de prueba (fuera de las fases actuales).
  3. `comision_modelo`: en `TASKS.md` (Fase 2, tarea 4) se plantea que, si se carga por migración, sus valores quedarían en el repositorio. Con los datos de prueba no importa; con datos comerciales reales no deben exponerse.
  4. La auditoría previa al despliegue incluye también el teléfono y el WhatsApp de `BASE44_ANALYSIS.md` §8.1.
  5. Confirmados el resto del resumen, el commit y el push.
- **Estado:**
  - Ejecutado: ajustes documentales. Commit `0f3f363` subido a `origin/main` (`2551743..0f3f363 main -> main`). Fase 1 cerrada; la Fase 2 no se ha iniciado.

### [2026-10-29] Fase 1 — Nuevas fuentes y decisiones previas a la Fase 2
- **Qué se aprobó:**
  - **Fuentes aportadas por ti**: `Servicio.jsonc`; cabeceras originales en `Solicitud_export.csv`; imágenes AVIF de Hero y Cierre de contacto en `reference/images/`.
  - **Imágenes**: copiarlas al proyecto. La decisión pendiente pasa a «integrar las `.avif` existentes y verificar visualización, peso y compatibilidad». El favicon será el logo. La imagen de reserva de Base44 se ignora.
  - **Rutas**: `/historias`, `/historias/[slug]` y `/preguntas-frecuentes`, sin redirecciones (la web de Base44 nunca fue pública).
  - **Implementación futura, solo con tu confirmación expresa**: admin, login, registro, OAuth, `AuthContext` y entidad User; registro de eventos (opción probable: 7.3, analítica externa); modo oscuro.
  - **Otras decisiones**:
    - `integrations.*` se ignora;
    - tipografías Fraunces e Inter hasta nuevo aviso;
    - `logo.png` en lugar de `BrandMark`.
  - **Esquema**:
    - estructura de `microrelatos` y `faqs` **aprobada**, con sus restricciones más estrictas que Base44;
    - mapeo de `solicitudes_contacto` **aprobado**;
    - `origen` en `microrelatos`, `faqs` y `solicitudes_contacto` (NULL en contenido propio o definitivo);
    - `servicios` analizado con `Servicio.jsonc`, **pendiente de tu aprobación**.
  - **Wellcomy**:
    - primero pediste no aplicar el mapeo y mantener "Wellcomy" tal cual;
    - al señalarte que la clave foránea aprobada no puede guardar un nombre que no es de un servicio, **decidiste mantener el mapeo** "Wellcomy" → "Plataforma de extranjería";
    - se aplicará en la importación.
  - **Datos de negocio**:
    - teléfono, WhatsApp, aviso flotante y «© SeR MigranteS S.L.» **se muestran como datos de prueba** hasta confirmar los oficiales;
    - esto sustituye la decisión anterior de omitirlos y de no mostrar la forma societaria. Respondiste «Con S.L. como prueba».
  - **Dominio**: se conectará en breve.
  - **Marca**: «SeR MigranteS» en textos, metadatos y documentación.
  - Se mantiene que `comision_modelo` no se publica y que no se inventan NIF, domicilio, correo, precios, acuerdos ni credenciales.
  - **Textos legales**: las páginas se crean con los textos tal como estaban, pero **no son accesibles** (provisional). El formulario muestra el texto de privacidad **sin enlace**, con nota de política pendiente (respondiste «Texto sin enlace»).
  - **Textos de interfaz**: «de 0» → «de cero».
- **Archivos creados/modificados:**
  - `public/images/3271a1ce3_generated_image.avif` y `public/images/42995b94b_generated_image.avif` (copias de `reference/images/`);
  - `src/app/layout.tsx` (título) y `src/app/page.tsx` (`alt` y `h1`): marca «SeR MigranteS»;
  - `docs/BASE44_ANALYSIS.md` (reescrito con las nuevas fuentes y decisiones), `reference/base44/tablas.md`, `docs/PRD.md`, `docs/PLAN.md`, `docs/TASKS.md`, `CLAUDE.md` y `docs/DECISIONS.md`.
  - Tus aportaciones (`Servicio.jsonc`, `Solicitud_export.csv`, `reference/images/*.avif`) no se han modificado.
- **Decisiones tomadas (por Claude, para tu revisión):**
  - **Hallazgo**: en Base44, `comision_modelo` era legible públicamente en los servicios activos, porque la regla de lectura se aplicaba a la fila entera.
  - **Propuesta de `servicios`**: `nombre` único (clave natural de la importación); `tipo` y `proveedor` obligatorios (más estrictos que Base44; los 4 registros cumplen); `orden`; sin `origen`.
  - **Discrepancias de `Solicitud_export.csv`**: BOM, etiquetas de sistema en español y líneas finales sobrantes (una con solo `,`). Solo se documentan; no se importa nada.
  - **`CLAUDE.md`**: la línea 5 decía «microrelatos (casos reales adaptados)» y contradecía la regla de los datos de prueba. Se corrige a «ejemplos de casos para prueba en el MVP».
  - **PRD §5**: el valor de `comision_modelo` de Wellcomy («…a través de Ser Migrantes») se deja literal, porque es un dato del CSV.
  - **El historial de este archivo** conserva la grafía «Ser Migrantes» de entradas anteriores.
  - **Pendientes nuevos**: logo para el fondo oscuro del pie (solo existe la versión *light*); `og:image` en PNG o JPG (muchas redes no admiten AVIF); cómo marcar `origen` en solicitudes de prueba frente a reales; riesgo de que el formulario guarde datos sin política de privacidad accesible.
- **Estado:**
  - Ejecutado: cambios documentales, copia de imágenes y cambio de marca en `layout.tsx` y `page.tsx`. `typecheck`, `lint` y `build` OK en la raíz.
  - Pendiente: tu revisión; commit y push no realizados.

### [2026-10-29] Fase 1 — Esquema de servicios, comisiones privadas, imágenes PNG y riesgo legal
- **Qué se aprobó:**
  1. Estructura de `servicios` (`BASE44_ANALYSIS.md` §5.3).
  2. Para el bloque A de la Fase 2:
     - `pregunta` como clave única de `faqs`, para evitar preguntas duplicadas;
     - `comision_modelo` en una tabla separada y privada, `servicios_comisiones` (`servicio_id`, `comision_modelo`, `updated_at`), accesible solo desde Supabase; `servicios` es pública;
     - **cambio**: `origen` solo marca el contenido de ejemplo importado de Base44 y **no** se usa para clasificar las solicitudes del formulario. Se quita de `solicitudes_contacto`, lo que sustituye la decisión anterior de añadirlo allí.
  3. Para la Fase 4:
     - en el pie se mantiene el icono de Base44 (`BrandMark`), porque el logo actual no tiene contraste sobre fondo oscuro; queda pendiente que aportes un logo para fondos oscuros;
     - se usan las imágenes **PNG** que aportaste en lugar de las AVIF, y se eliminan las AVIF de `reference/images/`.
  4. El riesgo de que el formulario guarde datos sin política de privacidad accesible se documenta junto a la decisión provisional de no hacer accesibles las páginas legales. No pueden activarse aún: faltan los datos y están llenas de marcadores y avisos de borrador.
- **Archivos creados/modificados:**
  - eliminados `reference/images/*.avif` (por tu indicación) y `public/images/*.avif` (copias mías, sin commitear);
  - copiados `reference/images/*.png` a `public/images/`;
  - `docs/BASE44_ANALYSIS.md`, `docs/PRD.md`, `docs/PLAN.md`, `docs/TASKS.md`, `CLAUDE.md`, `reference/base44/tablas.md` y `docs/DECISIONS.md`.
- **Decisiones tomadas (por Claude, para tu revisión):**
  - **Nombre de la tabla**: tu mensaje usa `servicios_comisiones` y `servicio_comisiones`; se documenta `servicios_comisiones` (la primera grafía, en plural como `servicios`).
  - **Clave primaria**: la de `servicios_comisiones` (p. ej. `servicio_id`, relación 1:1) y cómo cargar los valores sin dejarlos en el repositorio se concretan en `DATA_MODEL.md`.
  - **Peso de los PNG**: 1,1 y 1,8 MB (frente a 79 y 224 KB en AVIF). Se propone servirlos con `next/image`, que genera versiones optimizadas, y verificarlo en la Fase 4 junto con los límites del plan gratuito de Vercel. El PNG de Hero sirve para `og:image`, así que ese pendiente queda resuelto.
  - **Importación**: habrá que comprobar que las 12 preguntas del CSV son distintas antes de aplicar `unique`.
- **Estado:**
  - Ejecutado: cambios documentales y sustitución de imágenes.
  - Pendiente: tu revisión; commit y push no realizados.

### [2026-10-29] Fase 1 — `next/image` y commit de las decisiones previas a la Fase 2
- **Qué se aprobó:**
  - Servir las imágenes PNG con `next/image`; se implementa en la Fase 4.
  - Commit y push a `origin/main` de los cambios de las tres entradas anteriores del 29/10/2026, si las verificaciones siguen pasando.
- **Archivos creados/modificados:**
  - `docs/BASE44_ANALYSIS.md` (§8.4 y §10);
  - `docs/PLAN.md` (Fase 4);
  - `docs/DECISIONS.md`.
- **Decisiones tomadas:**
  - No se ha cambiado código: `next/image` queda documentado para la Fase 4, que es donde se integran las imágenes.
  - Sin respuesta sobre el nombre de la tabla, se mantiene `servicios_comisiones`.
- **Estado:**
  - Ejecutado: cambios documentales; `typecheck`, `lint` y `build` OK en la raíz.
  - Commit `69389f7` subido a `origin/main` (`4113bec..69389f7 main -> main`).
  - Las entradas anteriores del 29/10/2026 marcadas como «commit y push no realizados» quedan incluidas en este commit.
  - La Fase 2 no se ha iniciado.
### [2026-10-29] Fase 1 — Carga de `servicios_comisiones` desde un archivo local ignorado por Git
- **Qué se aprobó:**
  - Los valores de `comision_modelo` (tabla privada `servicios_comisiones`) se cargan desde un **archivo local ignorado por Git**, que nunca se sube a GitHub.
  - Los valores actuales son de prueba y no son sensibles, pero la regla se aplica ya para cuando haya datos reales.
  - Condiciones:
    1. primero, `/supabase/private/` en `.gitignore`, verificado con `git check-ignore -v`;
    2. después, crear `supabase/private/servicios_comisiones.sql`;
    3. quitar del PRD la tabla con los valores y dejar una nota (archivo local privado; fuente actual, `Servicio_export.csv`);
    4. actualizar `BASE44_ANALYSIS.md`, `PLAN.md`, `TASKS.md`, `CLAUDE.md` y `DECISIONS.md`;
    5. en la auditoría previa al despliegue, verificar que `supabase/private/` no está ni en el árbol ni en el historial de Git.
- **Archivos creados/modificados:**
  - `.gitignore`: regla `/supabase/private/`.
  - `supabase/private/servicios_comisiones.sql`: **local e ignorado, no se versiona**. Contiene un `insert … on conflict (servicio_id)` con los 4 valores leídos literalmente del CSV mediante script, buscando `servicio_id` por `nombre`.
  - `docs/PRD.md`: §5, tabla de valores sustituida por la nota; §7, método de carga.
  - `docs/BASE44_ANALYSIS.md`: §5.3, §6 y §10 (pendiente resuelto; tabla renumerada).
  - `docs/PLAN.md`: Fase 2, carga a mano tras las migraciones; Fase 10, verificación de `supabase/private/` en árbol e historial.
  - `docs/TASKS.md`: tareas 4, 10 y 13.
  - `CLAUDE.md`: estructura de carpetas y regla de `comision_modelo`.
  - `docs/DECISIONS.md`.
- **Decisiones tomadas (por Claude):**
  - Orden respetado: el archivo se creó solo después de verificar con `git check-ignore -v` (`.gitignore:45:/supabase/private/`) que la ruta quedaba ignorada.
  - El archivo se creó ahora y no en la Fase 2. Depende de las tablas de la Fase 2 y de que `servicio_id` sea clave primaria o única en `servicios_comisiones`; se confirmará en `DATA_MODEL.md`.
  - Corregido un resto en `TASKS.md` (tarea 4): al editarla la vez anterior quedó pegado el texto antiguo sobre cómo cargar las comisiones.
  - Los valores de prueba siguen en `reference/base44/Servicio_export.csv` y en commits anteriores (incluida la tabla que estuvo en el PRD). Lo cubre la auditoría del historial de la Fase 10.
- **Estado:**
  - Ejecutado: cambios y verificaciones.
  - Commit `49d8986` subido a `origin/main` (`1e423f2..49d8986 main -> main`). `supabase/private/` quedó fuera del commit, comprobado en el staging.
  - La Fase 2 no se ha iniciado.
