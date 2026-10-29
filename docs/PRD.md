<!-- qué construimos y alcance del MVP -->

# PRD — Ser Migrantes (MVP)

Versión 0.3 · Basado en "Etapa 3: Tareas 3.1–3.8 (v0.3)" + decisiones del 28/10/2026 · Idioma: español

## 1. Resumen
Ser Migrantes acompaña a personas migrantes en España en su integración social, laboral y económica. No es una web informativa tradicional ni un despacho: genera confianza y comunidad con microrelatos, resuelve dudas con FAQs y deriva a servicios.

Propuesta de valor: ayudar a las personas migrantes a sentirse acompañadas, entender sus opciones y dar el siguiente paso, conectándolas con información clara, experiencias reales adaptadas y servicios adecuados.

Mensajes de marca: "Ser migrante es llevar un mundo dentro." · "Ser migrante es mucho más que tener papeles." · "Ser migrante es volver a empezar sin empezar de cero." · "Ser migrantes es construir un lugar para todos."

## 2. Objetivos del MVP
| Objetivo | Criterio de éxito |
|---|---|
| Transmitir confianza | El usuario entiende para qué es la web en menos de 10 s |
| Generar identificación | Contenido por situación, perfil o necesidad |
| Captar tráfico orgánico | Microrelatos y FAQs indexables con estructura SEO |
| Resolver dudas iniciales | FAQs por microrelato + buscador general |
| Derivar a servicios | Servicios y CTAs visibles |
| Validar el modelo | Solicitudes de contacto recibidas y atribuidas |

## 3. Usuarios
Personas migrantes (trámites, regularización, integración) · personas que buscan vivienda, empleo o formación · estudiantes migrantes · familiares o personas de apoyo · proveedores de servicios.

## 4. Alcance del MVP
### Incluido
1. Landing con mensaje de marca y CTA.
2. Listado de microrelatos (6 de prueba de Base44 como datos de arranque).
3. Ficha `/microrelatos/[slug]` con FAQs asociadas y CTA.
4. Página de FAQs con buscador y etiquetas (12 FAQs de prueba).
5. Página de servicios (4 servicios, ver §5).
6. Formulario de contacto (ver §6) con consentimiento.
7. Página `/privacidad` (política de privacidad, texto a validar) enlazada desde el formulario y el footer.
8. SEO básico: metadatos, slugs, sitemap, robots, datos estructurados.
9. Páginas legales mínimas: aviso legal y cookies (provisionales).
10. Analítica: pendiente de decisión (ver §10 y §11).

### Excluido del MVP
Panel de administración y login (aplazado) · pasarela de pago · área privada de usuarios · gestión de expedientes · automatizaciones · CRM/ERP · app nativa · vídeos · buscador de pago por casuística (§8).

### Gestión de contenido sin panel
El contenido (microrelatos, FAQs) se crea y edita desde el Table Editor de Supabase o con SQL. Todo contenido nuevo nace con `estado = 'borrador'` y solo se publica cuando lo apruebe la persona responsable (por definir). Retirar un relato = pasar su estado a `borrador`.

### Versión de demostración (decisión del 29/10/2026)
El MVP se publica primero como **demostración**. Detalle en `docs/BASE44_ANALYSIS.md` §9.
- **Contenido de ejemplo**: los 6 microrelatos y 12 FAQs de Base44 se importan con `estado = 'publicado'` (autorización expresa, excepción a la regla anterior) y `origen = 'base44_prueba'`. `origen` no tiene valor por defecto. No están verificados, no son testimonios reales y sus afirmaciones jurídicas no están aprobadas.
- **Avisos visibles**:
  - aviso general de versión de demostración;
  - indicación de "contenido de ejemplo" en fichas de microrelatos y FAQs con `origen = 'base44_prueba'`;
  - los relatos de ejemplo no se presentan como "casos reales adaptados".
- **Formulario**: el modo demostración **no** afecta al formulario. Es funcional también en la versión pública:
  - validación de campos y consentimiento;
  - envío mediante Server Action e inserción en `solicitudes_contacto`;
  - mensaje de éxito solo tras confirmar la inserción, y mensaje de error si falla;
  - sin lectura pública de las solicitudes ni registro de sus datos en logs;
  - medidas antispam (honeypot y límite básico de envíos).
  En desarrollo y comprobaciones se usan solo datos ficticios. La identidad del responsable y la política de privacidad quedan pendientes antes de abrir el formulario a consultas reales.
- **Datos de negocio no confirmados** (teléfono, WhatsApp, forma societaria):
  - no se publican y los botones de llamada y WhatsApp quedan desactivados;
  - la marca es «Ser Migrantes»;
  - no se inventan NIF, domicilio, correo, precios, acuerdos ni credenciales.
- **Paso a lanzamiento definitivo**: revisar, sustituir o aprobar los contenidos de ejemplo; retirar los avisos solo donde corresponda; aprobar los textos legales; confirmar los datos de negocio.

## 5. Servicios del lanzamiento
Los 4 servicios se cargan por migración de inserción (desde `reference/base44/Servicio_export.csv`), también en producción. `url_destino` pendiente de aportar. En la demostración se muestran con el aviso general, sin presentar su disponibilidad ni sus acuerdos como verificados.

| Orden | Tipo | Proveedor | Nombre | Descripción |
|---|---|---|---|---|
| 1 | aliado | Red de intérpretes | Acompañamiento y traducción | Interpretación en citas, trámites, colegios y centros de salud para que no pierdas ningún detalle. |
| 2 | aliado | Gestorías colaboradoras | Gestión documental | Ordenamos tu expediente, revisamos los requisitos y te acompañamos en la presentación de documentos. |
| 3 | propio | ServiR Migrantes | Orientación laboral | Currículum, búsqueda de empleo y derechos laborales explicados con calma y sin jerga. |
| 4 | colaborador | Wellcomy | Plataforma de extranjería | Diagnóstico y trámites de extranjería: evaluación de tu caso con IA legal y conexión con abogados colegiados. |

Etiquetas visibles en la UI: "Aliado de confianza", "Servicio propio – ServiR Migrantes", "Colaborador".

**Modelo comercial (dato interno, PROVISIONAL, no confirmado).** Valores de `comision_modelo` en Base44. Se conservan, pero **no se publican ni pueden ser accesibles con la clave pública**: no basta con ocultarlos en la interfaz. El almacenamiento y los permisos se proponen en la Fase 2.

| Servicio | Proveedor | Modelo comercial (Base44) |
|---|---|---|
| Acompañamiento y traducción | Red de intérpretes | Servicio por horas a través de red aliada. |
| Gestión documental | Gestorías colaboradoras | Derivación con comisión acordada por expediente. |
| Orientación laboral | ServiR Migrantes | Servicio propio, sin comisión externa. |
| Plataforma de extranjería | Wellcomy | Servicio del mismo grupo, comisionado internamente a través de Ser Migrantes. |

## 6. Formulario de contacto
| Campo | Obligatorio | Notas |
|---|---|---|
| Nombre o alias | Sí | |
| Correo electrónico | Sí | Validar formato |
| Teléfono | No | |
| Sobre qué servicio preguntas | No | Opciones: "Todavía no lo sé" (por defecto), Acompañamiento y traducción, Gestión documental, Orientación laboral, Plataforma de extranjería |
| Cuéntanos qué necesitas | Sí | Texto libre; avisar de no incluir datos sensibles innecesarios |
| Consentimiento | Sí | "Doy mi consentimiento para que Ser Migrantes use estos datos únicamente para responderme. No se comparten con terceros." |

Botón: "Enviar mi mensaje". Texto bajo el botón: "Al enviar aceptas la política de privacidad" (enlace a `/privacidad`).
Comportamiento: validación en cliente y servidor (Server Action), honeypot antispam, mensaje de éxito y de error claros. Si el usuario llega desde un microrelato, se guarda su origen.

AVISO: el texto "No se comparten con terceros" debe ser coherente con la derivación a aliados/colaboradores (p. ej., Wellcomy). Si habrá que pasar datos a un tercero, el texto de consentimiento y la política de privacidad deben cambiar. Pendiente de validación jurídica.

## 7. Modelo de datos (detallar en Fase 2)
Tablas y columnas en español, snake_case. Detalle completo en `docs/DATA_MODEL.md` (se crea en Fase 2 a partir de `reference/base44/tablas.md` y los CSV).

**microrelatos**: id, titulo, slug (único), resumen, contenido, casuistica, perfil, etiquetas (text[]), estado ('borrador'|'publicado', por defecto 'borrador'), fecha_publicacion, cta_principal, servicio_relacionado_id (FK servicios, opcional), origen (texto, sin valor por defecto; 'base44_prueba' solo en los datos de arranque importados).

Los IDs de Base44 no se conservan: se generan claves nuevas y las relaciones se reconstruyen por slug y por nombre de servicio (con el mapeo "Wellcomy" → "Plataforma de extranjería", pendiente de confirmación).

**faqs**: id, pregunta, respuesta, casuistica, etiquetas (text[]), estado, origen. N:M con microrelatos mediante `microrelatos_faqs`.

**servicios**: id, nombre, descripcion, tipo ('aliado'|'propio'|'colaborador'), proveedor, url_destino (nullable), orden, estado ('activo'|'inactivo'). Sin columnas de comisión en la tabla pública. El modelo comercial (§5) se almacena sin acceso público, según la propuesta de la Fase 2.

**solicitudes_contacto**: id, nombre, email, telefono (nullable), servicio_interes_id (FK servicios, NULL = "todavía no lo sé"), mensaje, consentimiento (boolean, CHECK = true), microrelato_origen_id (nullable), created_at.

Seguridad: RLS siempre. Público lee solo publicado/activo. `solicitudes_contacto`: solo INSERT anónimo, sin SELECT. Las solicitudes se consultan en el panel de Supabase.

## 8. Fuera del MVP: buscador por casuística con cobro progresivo
Idea de la reunión del 26/10/2026, no decidida. Choca con "sin pasarela" y coste cero. Backlog (Fase 12). Requeriría: filtros, taxonomía, quién/qué responde, límites legales, precio, pasarela, privacidad de las consultas y contenido indexable vs. de pago.

## 9. Criterios de aceptación
- Web en español; propósito claro en menos de 10 s.
- Los 6 microrelatos y 12 FAQs de prueba cargados y visibles, con aviso de demostración y de contenido de ejemplo.
- Los 4 servicios se muestran con tipo y descripción correctos.
- El formulario guarda la solicitud en Supabase (también desde la URL pública) solo con consentimiento marcado y los campos obligatorios válidos; muestra éxito solo tras confirmar la inserción y un error claro si falla. Pruebas con datos ficticios.
- Los datos de solicitudes no son legibles desde el navegador (probado con la clave pública).
- El modelo comercial de los servicios no es legible con la clave pública.
- Solo se muestra contenido publicado.
- Desplegado en Vercel leyendo y escribiendo en Supabase; build y lint sin errores.
- Coste mensual 0 € (o mínimo justificado).

## 10. Métricas y analítica
Objetivo: visitas, microrelatos vistos, FAQs consultadas, clics a servicios, formularios enviados, conversión. Decisión provisional: probablemente Google Analytics (sin confirmar). Si se usa, cargarlo SOLO tras consentimiento y añadir banner de cookies + política de cookies. Hasta decidir, el MVP se despliega sin analítica de terceros y las solicitudes se cuentan desde Supabase.

## 11. Decisiones pendientes (no asumir; preguntar)
1. Contenido: los 6 microrelatos y 12 FAQs son de PRUEBA. ¿Quién los revisa/aprueba y cuándo se sustituyen por contenido definitivo?
2. Persona externa que aprobará contenidos públicos y proceso de retirada (por definir). Hasta entonces: tratar todo como no aprobado.
3. Notificación de solicitudes: ¿solo consultar en Supabase o también email? Sin panel admin, es la única vía de aviso.
4. Analítica: ¿Google Analytics, Vercel Analytics o ninguna al inicio?
5. URLs de destino de cada servicio.
6. Texto definitivo de política de privacidad, aviso legal y cookies; responsable del tratamiento y email de contacto/retirada.
7. Dominio: sermigrantes.es (principal), sermigrante redirige. Titular del dominio y cuándo se conecta.
8. Tipografías definitivas (la paleta se extrae del código de Base44).
9. Si se mantiene "No se comparten con terceros" dado el modelo de derivación.
10. Panel de administración (admin único/varios): aplazado.

## 12. Riesgos
- Publicar microrelatos de prueba sin revisión de privacidad, consentimiento y verdad de los contenidos.
- Mezclar información general con asesoramiento jurídico (ojo con la descripción del servicio de extranjería: "IA legal").
- Contradicción entre consentimiento ("no se comparten") y derivación a terceros.
- Sin panel ni aviso por email, las solicitudes pueden pasar desapercibidas.
- Límites del plan gratuito de Supabase (pausa por inactividad) y condiciones de uso comercial de Vercel Hobby: verificar antes del lanzamiento.
