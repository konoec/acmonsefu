# AGENTS.md

Guía para agentes de IA y desarrolladores que trabajen en este repositorio.

## Proyecto

**AC Monsefú (Asociación Cultural Monsefú)** — sitio web de la asociación y de su proyecto principal, el **Festival Golpe Tierra** (concurso de danzas tradicionales).

- **Repo**: `konoec/acmonsefu` (privado)
- **Sitio**: https://acmonsefu.com
- **Stack**: Astro 7 (estático) + Tailwind CSS 4 + Content Collections (markdown) + Sharp (imágenes) + @astrojs/sitemap
- **Lenguaje**: JavaScript (ESM, `"type": "module"`), componentes `.astro`

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
src/
├── assets/images/       # Imágenes optimizadas (home, galería, logos)
├── components/          # Componentes reutilizables (Navbar, Footer)
├── content/noticias/    # Novedades en markdown (Content Collections)
├── data/                # Datos estáticos (site.js, festival.js)
├── layouts/             # Layout.astro (SEO, fonts, estructura global)
├── pages/               # Rutas del sitio
└── styles/global.css    # Tema Tailwind (paleta cultural)
scripts/optimize-images.mjs  # Optimiza imágenes con sharp
```

## Rutas

| Ruta | Contenido |
| --- | --- |
| `/` | Home ACMONSEFU |
| `/nosotros` | Historia, misión, valores |
| `/servicios` | Shows y espectáculos |
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
- Imágenes: siempre dentro de `src/assets/images/`, optimizadas con `node scripts/optimize-images.mjs`.
  Usar el componente `<Image>` de `astro:assets` para fotos de contenido.
- Novedades: un archivo markdown por noticia en `src/content/noticias/`. Frontmatter: `title`, `date`, `excerpt`, `author`.
- No añadir comentarios innecesarios.
- `npm run lint` antes de commitear.

## Seguridad

- No commitear secretos. El `.env` está en `.gitignore`.
- El sitio actual es 100% estático y NO necesita variables de entorno para compilar.
- Cuando se integren funcionalidades dinámicas (inscripciones 2027 con Supabase), las credenciales
  (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) se inyectarán vía GitHub Secrets y se reutilizará `src/supabaseClient.js` o equivalente.

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