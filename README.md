# Sitio personal · Betzy Vargas Lara

Sitio estático (HTML + CSS + JS), sin dependencias ni paso de compilación. Listo para GitHub Pages.

## Estructura

```
index.html
css/styles.css
js/main.js
assets/
  betzy.jpg              foto principal (1125 px)
  betzy-640.jpg          versión ligera para móvil
.nojekyll
```

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `BetzyVargas`).
2. Sube **el contenido de esta carpeta** a la raíz del repositorio (`index.html` debe quedar en la raíz).
3. En el repositorio: **Settings → Pages → Build and deployment**.
4. En *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guarda.
5. En 1–2 minutos estará en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

Si el repositorio se llama `TU-USUARIO.github.io`, el sitio queda en `https://TU-USUARIO.github.io/`.

### Dominio propio (opcional)

Crea un archivo `CNAME` en la raíz con el dominio (por ejemplo `betzyvargas.com`) y configura los DNS según la guía de GitHub Pages.

## Cómo editar

- **Textos y servicios:** `index.html`.
- **Colores y tipografías:** variables al inicio de `css/styles.css` (`--navy-*`, `--gold`, `--serif`, `--sans`).
- **Foto:** reemplaza `assets/betzy.jpg` y `assets/betzy-640.jpg` conservando los nombres.
- **Formulario:** abre el correo del visitante con el mensaje redactado (no requiere servidor). Si luego quieres recibir mensajes directo, se puede conectar a Formspree o similar cambiando el `submit` en `js/main.js`.

## Pendiente recomendado

- Agregar enlace a LinkedIn u otras redes en la sección Contacto.
- Cuando existan testimonios o casos (sin datos confidenciales), añadir una sección breve.
- Para compartir en redes con vista previa, definir la URL final y cambiar `og:image` a una ruta absoluta.
