<!-- opcional, solo para la fase en curso -->

# TASKS — Fase en curso

**Fase actual:** 2 — Supabase: modelo de datos y seguridad (no iniciada)
**Objetivo:** tablas creadas en Supabase con RLS probada con la clave pública y los datos de los CSV cargados, según un `docs/DATA_MODEL.md` aprobado.

Referencias: `docs/BASE44_ANALYSIS.md` (§5, §6, §9, §10), `reference/base44/tablas.md`, `docs/PRD.md` §4, §5 y §7, reglas de seguridad de `CLAUDE.md`.
Regla: cada bloque necesita mi aprobación antes del siguiente. Aprobar el análisis de la Fase 1 no autoriza migraciones ni cambios en Supabase.

## Antes de empezar (lo hago yo)
- [ ] Crear el proyecto Supabase Free.
- [ ] Guardar en `.env.local` (no se commitea) `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. No compartir la clave secreta en el chat.
- [x] Mapeo "Wellcomy" → "Plataforma de extranjería": decidido aplicarlo (29/10/2026).
- [x] Estructura de `servicios` aprobada (29/10/2026).

Ya aprobado (29/10/2026):
- estructura de `microrelatos`, `faqs` y `servicios`;
- mapeo de `solicitudes_contacto`;
- `pregunta` única en `faqs`;
- tabla privada `servicios_comisiones` (`servicio_id`, `comision_modelo`, `updated_at`);
- `origen` solo en `microrelatos` y `faqs`.

## Bloque A — Propuesta y aprobación de `docs/DATA_MODEL.md`
1. [ ] En modo plan, proponer `docs/DATA_MODEL.md`:
   - tablas `microrelatos`, `faqs`, `microrelatos_faqs`, `servicios` y `solicitudes_contacto`;
   - para cada una: tipos exactos, claves, FK, índices, valores por defecto y `check`;
   - `microrelatos` y `faqs` según la estructura aprobada;
   - `servicios` según tu decisión sobre §5.3.
2. [ ] Columna `origen` en `microrelatos` y `faqs` (sin valor por defecto; NULL en contenido propio o definitivo). `solicitudes_contacto` no la lleva.
3. [ ] `pregunta` única en `faqs` (clave natural de la importación); comprobar que las 12 preguntas del CSV son distintas.
4. [ ] Definir `servicios_comisiones`:
   - clave primaria (p. ej. `servicio_id`, relación 1:1), necesaria para el `on conflict (servicio_id)` del archivo local;
   - FK a `servicios`;
   - RLS activada sin políticas públicas y acceso solo desde Supabase.
   - **Método de carga decidido** (29/10/2026): archivo local `supabase/private/servicios_comisiones.sql`, ignorado por Git, ya creado; nunca en `supabase/migrations/`.
5. [ ] Proponer las políticas RLS por tabla según PRD y `CLAUDE.md`:
   - público: SELECT solo de contenido `publicado` y servicios `activo`, sin columnas internas;
   - `solicitudes_contacto`: solo INSERT, sin SELECT público.
6. [ ] Proponer el método de importación desde los CSV:
   - valores sin inventar ni resumir;
   - relaciones por slug y nombre, con el mapeo "Wellcomy" → "Plataforma de extranjería";
   - `origen = 'base44_prueba'` sin valor por defecto;
   - microrelatos y FAQs con `estado = 'publicado'`;
   - repetible sin duplicados.
7. [ ] Proponer cómo se aplicarán las migraciones: SQL Editor de Supabase o CLI de Supabase (la CLI es una dependencia nueva y requiere mi permiso).
8. [ ] **Mi aprobación de `DATA_MODEL.md`.**

## Bloque B — Generación y revisión de migraciones (sin aplicar)
9. [ ] Generar en `supabase/migrations/` las migraciones de esquema y RLS según `DATA_MODEL.md` aprobado.
10. [ ] Generar la migración de inserción leyendo directamente los CSV (4 servicios, 6 microrelatos, 12 FAQs y sus relaciones). Sin eventos, IDs de Base44, `created_by_id`, `is_sample` ni `comision_modelo`.
    - Revisar que `supabase/private/servicios_comisiones.sql` encaja con el esquema aprobado.
    - Comprobar con `git check-ignore -v` que sigue ignorado.
11. [ ] Incluir comprobaciones de la importación:
    - recuentos 4/6/12;
    - 6 microrelatos con servicio;
    - pares FAQ–relato iguales a los del CSV;
    - sin duplicados al repetirla.
12. [ ] Mostrarme el SQL completo para revisión. **Mi aprobación de las migraciones.**

## Bloque C — Aplicación en Supabase y verificación
13. [ ] Aplicar las migraciones con el método aprobado. Solo tras mi aprobación del bloque B. Después, ejecutar a mano `supabase/private/servicios_comisiones.sql` y comprobar que hay 4 filas.
14. [ ] Verificar las comprobaciones de importación y mostrar los resultados.
15. [ ] Probar RLS con la clave pública:
    - se lee solo el contenido publicado o activo;
    - `comision_modelo` no es legible;
    - `solicitudes_contacto` acepta INSERT (solo datos ficticios) y no permite SELECT.
16. [ ] Generar los tipos TypeScript en `src/types/`.
17. [ ] Ejecutar `typecheck`, `lint` y `build`; registrar en `docs/DECISIONS.md`; proponer commit. Commit y push solo si lo apruebo.

## Al terminar
- [ ] Marcar la Fase 2 en `docs/PLAN.md` (solo lo realmente verificado)
- [ ] Reescribir este archivo con las tareas de la Fase 3
