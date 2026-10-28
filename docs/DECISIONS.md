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