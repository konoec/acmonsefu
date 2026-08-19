# AGENTS.md

Guía para agentes de IA y desarrolladores que trabajen en este repositorio.

## Proyecto

**AC Monsefú (Asociación Cultural Monsefú)** — sitio web de la asociación y de su proyecto principal, el **Festival Golpe Tierra** (concurso de danzas tradicionales).

- **Repo**: `konoec/acmonsefu` (privado)
- **Sitio**: https://acmonsefu.com
- **Stack**: Astro 7 (estático) + Tailwind CSS 4 + Content Collections (markdown) + Sveltia CMS (git-based, en `/admin`) + Sharp (imágenes) + marked (texto inline) + @astrojs/sitemap
- **Lenguaje**: JavaScript (ESM, `"type": "module"`), componentes `.astro`
- **CMS**: contenido 100% editable desde `/admin` (Sveltia CMS) — textos, datos, novedades e imágenes. Cada guardado commitea a `main` y despliega solo.

## Comandos

| Comando | Descripción |
| --- | --- |
| `npm install` | Instalar dependencias |
| `npm run dev` | Servidor de desarrollo Astro (http://localhost:4321) |
| `npm run build` | Build de producción (salida en `dist/`) |
| `npm run preview` | Previsualizar el build local |
| `npm run lint` | ESLint del proyecto |

## Estructura del código

```
public/
├── admin/                # Sveltia CMS (index.html + config.yml)
└── uploads/              # Imágenes editables (home, galería, logos)
src/
├── components/          # Componentes reutilizables (Navbar, Footer)
├── content/noticias/    # Novedades en markdown (Content Collections)
├── data/                # Datos estáticos en JSON (site, festival, proyectos, imagenes)
├── data/secciones/      # Textos de cada página (home, nosotros, proyectos, contacto…)
├── layouts/             # Layout.astro (SEO, fonts, estructura global)
├── lib/                 # Helpers (text.js: md() y t())
├── pages/               # Rutas del sitio
└── styles/global.css    # Tema Tailwind (paleta cultural)
scripts/optimize-images.mjs  # Optimiza imágenes en public/uploads/ con sharp
```

## Rutas

| Ruta | Contenido |
| --- | --- |
| `/` | Home ACMONSEFU |
| `/nosotros` | Historia, misión, valores |
| `/proyectos` | Proyectos de la asociación (festival, shows, talleres, eventos) |
| `/novedades` + `/novedades/[slug]` | Noticias (markdown) |
| `/contacto` | Contacto (WhatsApp, redes) |
| `/golpe-tierra` | Landing informativo del Festival Golpe Tierra |
| `/404` | Página de error |

## Flujo de trabajo / CI/CD (automatizado)

- **Rama única activa: `main`**. NO crear `gh-pages`; Pages está configurado con `build_type: workflow`.
- Cada `push` a `main` dispara `.github/workflows/deploy.yml`:
  `checkout` → `setup-node` (Node 22) → `npm install` → `npm run build` → `configure-pages` → `upload-pages-artifact` → `deploy-pages`.
- El sitio se despliega solo a https://acmonsefu.com.

### DNS (ya resuelto, no tocar)

- `acmonsefu.com` → registros A → `185.199.108.153` … `185.199.111.153`
- `www.acmonsefu.com` → CNAME → `konoec.github.io`
- TXT `_github-pages-challenge-konoec` → mantener activo.

## Convenciones

- Componentes `.astro` con frontmatter en la parte superior; estilos con clases Tailwind.
- Temas (colores, fuentes) definidos en `src/styles/global.css` con `@theme` de Tailwind 4:
  - `--font-heading` (Plus Jakarta Sans) y `--font-body` (Inter).
  - Colores: `brand-*` (terracota #BC5A45), `cream-*` (fondo crema).
- Fuentes e iconos: Google Fonts vía `<link>` en `Layout.astro` (nunca `@import` en CSS).
- Imágenes: siempre dentro de `public/uploads/`, optimizadas con `node scripts/optimize-images.mjs`.
  Se sirven tal cual con `<img>` (las rutas se referencian desde `src/data/imagenes.json` o el campo `image` de las novedades). No usar `astro:assets`.
- Novedades: un archivo markdown por noticia en `src/content/noticias/`. Frontmatter: `title`, `date`, `excerpt`, `author`, y `image` (opcional, ruta `/uploads/...`).
- Textos de páginas: en `src/data/secciones/*.json`, editables desde el CMS. Los párrafos admiten formato inline con `**negrita**` (helper `md()` en `src/lib/text.js`).
- Al cambiar `public/admin/config.yml`, validar con `npx --yes js-yaml public/admin/config.yml`. Recordar: nombres de archivo como `404` deben ir entre comillas (YAML los parsea como número).
- No añadir comentarios innecesarios.
- `npm run lint` antes de commitear.

## Seguridad

- No commitear secretos. El `.env` está en `.gitignore`.
- El sitio actual es 100% estático y NO necesita variables de entorno para compilar.
- Cuando se integren funcionalidades dinámicas (inscripciones 2027 con Supabase), las credenciales
  (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) se inyectarán vía GitHub Secrets y se reutilizará `src/supabaseClient.js` o equivalente.
- La `service_role` key de Supabase nunca va al frontend ni al build estático (quedaría expuesta): solo se usa en el SQL Editor o en un backend server-side.

## Supabase (MCP)

- El MCP de Supabase está configurado en `opencode.json` (proyecto `bmsspejbidujakbikmto`).
- El esquema de la base del festival está en `supabase/schema.sql` (tablas, RPC `registrar_inscripcion`, RLS).
- El proyecto anterior fue eliminado sin respaldo: los datos 2026 se perdieron; la convocatoria 2027 arranca limpia.

## Convenciones de commits (Conventional Commits)

Formato: `type(scope): subject` — sujeto en minúsculas, imperativo, sin punto final.

| Tipo | Uso |
| --- | --- |
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `refactor` | Cambio de estructura sin cambiar comportamiento |
| `perf` | Optimización de rendimiento |
| `style` | Formato/estilos visuales sin cambio de lógica |
| `docs` | Documentación |
| `chore` | Tareas de mantenimiento |
| `build` | Cambios en el build o dependencias |
| `ci` | Cambios en CI/CD o workflows |

Scopes: `ui`, `content`, `festival`, `assets`, `seo`, `ci`, `docs`.

Ejemplos:

```
feat(ui): add servicios page
perf(assets): compress festival gallery images
fix(seo): add canonical urls
ci: adapt deploy workflow to astro
```