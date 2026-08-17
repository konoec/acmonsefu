# AGENTS.md

Guía para agentes de IA y desarrolladores que trabajen en este repositorio.

## Proyecto

**Festival Golpe Tierra 2026** — plataforma web para inscripciones y difusión cultural de danzas tradicionales.

- **Repo**: `konoec/acmonsefu` (privado)
- **Sitio**: https://acmonsefu.com
- **Stack**: React 19 + Vite 7 + Tailwind CSS 3 + Supabase (auth + base de datos) + React Router DOM v7
- **Lenguaje**: JavaScript (JSX, ESM, `"type": "module"`)

## Comandos

| Comando | Descripción |
| --- | --- |
| `npm install` | Instalar dependencias |
| `npm run dev` | Servidor de desarrollo Vite |
| `npm run build` | Build de producción (salida en `dist/`) |
| `npm run preview` | Previsualizar el build local |
| `npm run lint` | ESLint del proyecto |

## Flujo de trabajo / CI/CD (automatizado)

- **Rama única activa: `main`**. La rama `gh-pages` se eliminó a propósito: NO volver a crearla ni configurar Pages "desde una rama".
- **GitHub Pages está configurado con `build_type: workflow`** (build desde GitHub Actions).
- Cada `push` a `main` dispara `.github/workflows/deploy.yml` automáticamente:
  1. `actions/checkout` → `setup-node` (Node 22) → crea `.env` desde **GitHub Secrets** → `npm install` → `npm run build` → `configure-pages` → `upload-pages-artifact` → `deploy-pages`.
- El sitio se despliega solo a https://acmonsefu.com. No hay pasos manuales.
- **Variables de entorno**: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` se leen de los **GitHub Secrets** del repo durante CI. Nunca se commitea `.env`.

### DNS (ya resuelto, no tocar)

- `acmonsefu.com` → registros A → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- `www.acmonsefu.com` → CNAME → `konoec.github.io`
- TXT `_github-pages-challenge-konoec` → mantener activo (verificación de dominio).

## Convenciones de commits (Conventional Commits)

Formato: `type(scope): subject` — sujeto en minúsculas, imperativo, sin punto final.

Tipos:

| Tipo | Uso |
| --- | --- |
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `refactor` | Cambio de estructura sin cambiar comportamiento |
| `perf` | Optimización de rendimiento |
| `style` | Formato/estilos visuales sin cambio de lógica |
| `test` | Pruebas |
| `docs` | Documentación |
| `chore` | Tareas de mantenimiento |
| `build` | Cambios en el build (Vite, deps) |
| `ci` | Cambios en CI/CD o workflows |

Scopes por funcionalidad:

- `inscripcion` — flujo público de inscripción (`src/pages/public/Inscripcion/*`)
- `admin` — panel administrativo (`src/pages/admin/*`, `src/layouts/AdminLayout.jsx`)
- `auth` — login, rutas protegidas, Supabase auth
- `api` — `src/supabaseClient.js` y consultas a Supabase
- `ui` — componentes reutilizables (`src/components/*`) y layout público
- `styles` — Tailwind, CSS global, tema
- `pages` — páginas públicas (Home, Modalidades, Bases, ConsultaInscripcion)
- `pdf` — generación de PDF (`src/utils/pdfGenerator.js`)
- `router` — `src/router/*`
- `assets` — imágenes y constantes (`src/assets`, `src/constants`)
- `ci` — workflows y despliegue
- `env` — variables de entorno / secrets

Ejemplos:

```
feat(inscripcion): add participant photo upload
fix(admin): handle null birthdate in table
refactor(api): extract supabase queries to hooks
style(ui): unify button variants with tailwind
ci: set up auto deploy to github pages
```

Reglas:
- Un commit = una funcionalidad/cambio lógico.
- Mensajes claros y cortos (sujeto < ~70 caracteres).
- Usar cuerpo del commit para explicar el "porqué" cuando haga falta.
- No commitear secretos ni `.env`.

## Estructura del código

```
src/
├── components/       # Componentes reutilizables (Navbar, Footer, Toast, Preloader...)
├── constants/        # Constantes (imágenes, datos estáticos)
├── layouts/          # PublicLayout y AdminLayout
├── pages/
│   ├── public/       # Home, Modalidades, Bases, Inscripcion, ConsultaInscripcion, Login
│   └── admin/        # Inscripciones (tabla, filtros, modales, paginación)
├── router/           # AppRouter y ProtectedRoute
├── supabaseClient.js # Cliente de Supabase
└── utils/            # Utilidades (pdfGenerator)
```

Convenciones:
- Componentes funcionales de React con hooks; JSX en `.jsx`.
- Estilos con clases de Tailwind; tema en `tailwind.config.js` y `src/index.css`.
- Seguir los patrones de los archivos vecinos; no añadir comentarios innecesarios.
- No hardcodear credenciales; usar siempre `import.meta.env.VITE_*` vía `src/supabaseClient.js`.
- No dejar logs de datos sensibles.

## Seguridad

- `.env` está en `.gitignore` y NO debe commitearse.
- Las credenciales de Supabase viven en GitHub Secrets (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Si faltan, el build de CI falla a propósito (fail fast).
- Para desarrollo local, crear un `.env` local copiando la estructura y pidiendo los valores al dueño del proyecto.

## Recomendado para refactors

- Trabajar en ramas `feature/<nombre>` y fusionar a `main` vía PR cuando el refactor es grande.
- Cada merge a `main` despliega automáticamente; verificar el sitio tras cada merge.
- Usar `npm run lint` antes de commitear.