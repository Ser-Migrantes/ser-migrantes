<!-- opcional, solo para la fase en curso -->

# TASKS — Fase en curso

**Fase actual:** 1 — Análisis de Base44
**Objetivo:** documento `docs/BASE44_ANALYSIS.md` aprobado, con todo lo necesario para migrar el diseño y los datos de Base44 a Next.js + Supabase.

## Antes de empezar (lo hago yo)
- [ ] (Opcional) Guardar el texto de la política de privacidad de Base44, si existe, en `reference/base44/privacidad.md`

## Tareas para Claude
1. [ ] En modo plan, proponer la estructura de `docs/BASE44_ANALYSIS.md` y esperar mi aprobación.
2. [ ] Inventario de pantallas y componentes de `reference/base44/src`.
3. [ ] Extraer paleta, tipografías y estilos reales (valores exactos para tokens Tailwind).
4. [ ] Listar las llamadas al SDK (`entities.*`, `auth.*`, `integrations.*`) y su equivalente en Supabase.
5. [ ] Contrastar `reference/base44/tablas.md` y los CSV con `docs/PRD.md` §7.
6. [ ] Marcar como "no confirmado" todo campo o relación que no se pueda verificar desde el código o los CSV.
7. [ ] NO generar datos de ejemplo: los CSV ya contienen los datos de arranque.
8. [ ] Registrar en `docs/DECISIONS.md` y proponer commit; commit y push solo si lo apruebo.

## Al terminar
- [ ] Marcar la Fase 1 en `docs/PLAN.md`
- [ ] Reescribir este archivo con las tareas de la Fase 2
