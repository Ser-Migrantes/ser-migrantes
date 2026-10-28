<!-- opcional, solo para la fase en curso -->

# TASKS — Fase en curso

**Fase actual:** 0 — Preparación y scaffolding
**Objetivo:** app Next.js + TS + Tailwind funcionando en local y subida a GitHub, con Base44 (código, tablas y CSV) y el logo guardados como referencia.

## Antes de empezar (lo hago yo)
- [ ] Copiar el código React de Base44 a `reference/base44/` (sin `node_modules`, `.env*`, `.git`)
- [ ] Copiar los 4 CSV a `reference/base44/` (Microrelato, Pregunta, Servicio, Evento)
- [ ] Guardar `reference/base44/tablas.md`
- [ ] Renombrar `CLAUDE.md`, `AGENTS.md` y `README.md` de Base44 a `.txt`
- [ ] Guardar el logo PNG en `reference/brand/logo.png`
- [ ] Guardar el texto de la política de privacidad de Base44 (si existe) en `reference/base44/privacidad.md`

## Tareas para Claude
1. [ ] En modo plan, proponer cómo crear la app Next.js en la raíz del repo (sin subcarpeta extra) y esperar mi aprobación.
2. [ ] Crear la app con TypeScript, Tailwind, ESLint, App Router y alias `@/*`.
3. [ ] Añadir script `typecheck` (`tsc --noEmit`) y revisar `lint`.
4. [ ] Verificar `.gitignore` (`.env*`, `node_modules`, `.next`) y crear `.env.example` sin valores.
5. [ ] Crear la estructura de carpetas de `CLAUDE.md` con archivos mínimos y copiar el logo a `public/`.
6. [ ] Página inicial provisional con el texto "Ser Migrantes".
7. [ ] Ejecutar `dev`, `build`, `lint` y `typecheck` y mostrarme el resultado.
8. [ ] Proponer mensaje de commit; commit y push solo si lo apruebo.

## Al terminar
- [ ] Marcar la Fase 0 en `docs/PLAN.md`
- [ ] Reescribir este archivo con las tareas de la Fase 1
