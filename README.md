# AC Monsefú 🏛️💃

Sitio oficial de la **Asociación Cultural Monsefú (AC Monsefú)**.

Incluye la página de la asociación (nosotros, servicios, novedades, contacto) y el landing informativo del
**Festival Golpe Tierra** (concurso de danzas tradicionales que la asociación organiza).

## 🚀 Tecnologías

- **Astro 7** — generación de sitios estáticos (0 JS en páginas de contenido)
- **Tailwind CSS 4** — estilos con `@tailwindcss/vite` y tema en `src/styles/global.css`
- **Content Collections** — novedades en markdown (`src/content/noticias/`)
- **Sharp** — optimización de imágenes (Astro `astro:assets`)
- **@astrojs/sitemap** — sitemap.xml automático

## 🗂️ Estructura

```
src/
├── assets/images/       # Imágenes optimizadas (home, galería, logos)
├── components/          # Navbar, Footer
├── content/noticias/    # Noticias en markdown (una por archivo)
├── data/                # Datos estáticos (site.js, festival.js)
├── layouts/             # Layout.astro (SEO, fonts, estructura global)
├── pages/               # Rutas (/, /nosotros, /servicios, /novedades, /contacto, /golpe-tierra, 404)
└── styles/global.css    # Tema Tailwind (paleta cultural)
scripts/optimize-images.mjs  # Comprime y optimiza las imágenes del repo
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

1. Crea un archivo `.md` en `src/content/noticias/`.
2. Escribe el frontmatter: `title`, `date`, `excerpt`, `author`.
3. Escribe el contenido en markdown.
4. Haz commit y push a `main` — se despliega solo a https://acmonsefu.com.

## 🖼️ Optimizar imágenes

Al agregar fotos (por ejemplo la galería del festival), ejecuta:

```bash
node scripts/optimize-images.mjs
```

Esto comprime y redimensiona automáticamente las imágenes dentro de `src/assets/images/`.

## 🎪 Festival Golpe Tierra

El landing informativo del festival vive en `/golpe-tierra`. Los datos (modalidades, bases, costos) están en
`src/data/festival.js` y son fáciles de editar.

Para la edición 2027 se reconstruirán el formulario de inscripción y el panel de administración (probablemente con
Supabase), integrados a este mismo sitio.

## 📜 Créditos

© Asociación Cultural Monsefú. Desarrollado para preservar y difundir la identidad cultural de nuestros pueblos.