# AC Monsefú 🏛️💃

Sitio oficial de la **Asociación Cultural Monsefú (AC Monsefú)**.

Incluye la página de la asociación (nosotros, servicios, novedades, contacto) y el landing informativo del
**Festival Golpe Tierra** (concurso de danzas tradicionales que la asociación organiza).

## 🚀 Tecnologías

- **Astro 7** — generación de sitios estáticos (0 JS en páginas de contenido)
- **Tailwind CSS 4** — estilos con `@tailwindcss/vite` y tema en `src/styles/global.css`
- **Content Collections** — novedades en markdown (`src/content/noticias/`)
- **Sveltia CMS** — CMS git-based en `/admin` para editar textos, datos e imágenes (auth vía Cloudflare Worker)
- **Sharp** — optimización de imágenes (`scripts/optimize-images.mjs`)
- **marked** — render de texto con formato inline desde los JSON de contenido
- **@astrojs/sitemap** — sitemap.xml automático

## 🗂️ Estructura

```
public/
├── admin/                # Sveltia CMS (index.html + config.yml)
└── uploads/              # Imágenes editables desde el CMS (home, galería, logos)
src/
├── components/          # Navbar, Footer
├── content/noticias/    # Noticias en markdown (una por archivo)
├── data/                # Datos estáticos en JSON (site, festival, proyectos, imagenes)
├── data/secciones/      # Textos de cada página (home, nosotros, proyectos, contacto…)
├── layouts/             # Layout.astro (SEO, fonts, estructura global)
├── lib/                 # Helpers (text.js: md() y t())
├── pages/               # Rutas (/, /nosotros, /proyectos, /novedades, /contacto, /golpe-tierra, 404)
└── styles/global.css    # Tema Tailwind (paleta cultural)
scripts/optimize-images.mjs  # Comprime y optimiza las imágenes en public/uploads/
supabase/schema.sql          # Esquema SQL del Festival (tablas, RPC, RLS)
```

## 📦 Instalación

```bash
npm install
npm run dev       # Desarrollo (http://localhost:4321)
npm run build     # Build de producción (salida en dist/)
npm run preview   # Previsualizar el build
npm run lint      # ESLint
```

## ✍️ Publicar una novedad

**Con el CMS (recomendado):** entra a `https://acmonsefu.com/admin/` → colección **Novedades** → *Nueva novedad*.
Al guardar, el CMS commitea a `main` y el sitio se despliega solo.

**Manual:** crea un archivo `.md` en `src/content/noticias/` con frontmatter
`title`, `date`, `excerpt`, `author` (opcional `image` con la ruta `/uploads/...`) y haz push a `main`.

## 🎛️ CMS de contenido (Sveltia CMS)

- El panel vive en `public/admin/` (`index.html` + `config.yml`) y se sirve en `/admin`.
- Todo el contenido es editable: textos de páginas (`src/data/secciones/`), datos
  (`src/data/*.json`), novedades (markdown) e imágenes (`public/uploads/`).
- Cada guardado crea un commit en `main` → GitHub Actions hace el build y deploy automático.
- La autenticación usa GitHub OAuth a través del worker `sveltia-cms-auth` en Cloudflare
  (variables `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `ALLOWED_DOMAINS`), configurado en `backend.base_url`.

## 🖼️ Optimizar imágenes

Al agregar fotos (por ejemplo la galería del festival), ejecuta:

```bash
node scripts/optimize-images.mjs
```

Esto comprime y redimensiona automáticamente las imágenes dentro de `public/uploads/`.

## 🎪 Festival Golpe Tierra

El landing informativo del festival vive en `/golpe-tierra`. Los datos (modalidades, bases, costos) están en
`src/data/festival.json` y son fáciles de editar desde el CMS.

Para la edición 2027 se reconstruirán el formulario de inscripción y el panel de administración (probablemente con
Supabase), integrados a este mismo sitio. El esquema de la base anterior fue recuperado del historial del repo y está
en `supabase/schema.sql` (tablas, función RPC `registrar_inscripcion` y políticas RLS). Cuando crees el proyecto
nuevo, ejecútalo en el SQL Editor.

> Nota: el proyecto Supabase anterior fue eliminado y no había respaldo, por lo que los datos de inscripciones 2026 se
> perdieron. La convocatoria 2027 arrancará con datos limpios.

## 📜 Créditos

© Asociación Cultural Monsefú. Desarrollado para preservar y difundir la identidad cultural de nuestros pueblos.