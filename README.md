#  Portal Web CESURCAFÉ + CaféBot

Portal web interactivo del **Centro Surcolombiano de Investigación en Café (CESURCAFÉ)** de la **Universidad Surcolombiana (USCO)**, en Neiva, Huila, Colombia. Incluye **CaféBot**, un asistente virtual con IA basado en Google Gemini.

> Proyecto desarrollado en el marco del **Semillero de Investigación CESURCAFÉ – USCO**.


---

##  Tabla de contenido

1. [¿Qué es este proyecto?](#-qué-es-este-proyecto)
2. [Funcionalidades principales](#-funcionalidades-principales)
3. [Tecnologías utilizadas](#-tecnologías-utilizadas)
4. [Requisitos previos](#-requisitos-previos)
5. [Instalación y ejecución](#-instalación-y-ejecución)
6. [Configuración de CaféBot (Gemini)](#-configuración-de-cafébot-google-gemini)
7. [Scripts disponibles](#-scripts-disponibles)
8. [Estructura del proyecto](#-estructura-del-proyecto)
9. [Cómo editar el contenido](#-cómo-editar-el-contenido)
10. [Paleta de colores](#-paleta-de-colores)
11. [Compilar para producción](#-compilar-para-producción)
12. [Solución de problemas](#-solución-de-problemas)
13. [Licencia](#-licencia)

---

##  ¿Qué es este proyecto?

Es una **aplicación web de una sola página (SPA)** que sirve como vitrina digital de CESURCAFÉ. Su objetivo es:

- **Dar a conocer** la misión, visión, historia y equipo de investigadores del centro.
- **Presentar los servicios** que ofrece a caficultores y asociaciones (laboratorio de calidad, fermentación controlada, formación cafetera).
- **Centralizar la producción científica** (artículos, libros, cartillas rurales e investigaciones) en un repositorio con búsqueda y filtros.
- **Atender consultas** mediante **CaféBot**, un chatbot con IA restringido exclusivamente al contexto de CESURCAFÉ y la caficultura.

El proyecto **no utiliza base de datos**: toda la información se carga desde archivos estáticos locales en `src/data/`, lo que lo hace fácil de mantener y de desplegar en cualquier hosting estático.

---

##  Funcionalidades principales

| Sección | Qué contiene |
|---|---|
| **Inicio** | Hero con video y carrusel de proyectos destacados, banner hacia *Nosotros*, vista previa del repositorio con pestañas y resumen de servicios tipo maestro‑detalle. |
| **Nosotros** | Portada a ancho completo, tarjetas de Misión / Visión / Reconocimientos, galería acordeón "¿Quiénes somos?", línea del tiempo animada a 60–120 fps con GSAP ScrollTrigger (cereza → pergamino → tostión → taza servida) y carrusel de investigadores. |
| **Servicios** | Portada a ancho completo, tarjetas de servicios con efecto de apilamiento (*card stacking*) al hacer scroll y carrusel de testimonios "Voces de la comunidad cafetera". |
| **Repositorio** | Portada a ancho completo y catálogo de publicaciones con buscador en tiempo real (por título o autor, sin importar tildes), filtros por tipo y botón "Cargar más". |
| **Contacto** | Interfaz completa de CaféBot con sugerencias rápidas y datos de contacto institucional. |
| **Global** | Navbar fija con indicador de sección activa, footer con redes sociales y **widget flotante de CaféBot** que comparte la misma conversación con la sección Contacto. |

###  Sobre CaféBot

- Usa la API de **Google Gemini** con un *System Prompt* cerrado al contexto de CESURCAFÉ.
- Si el usuario pregunta por temas ajenos (fútbol, política, tareas, etc.), el bot no responde y lo redirige al **Menú Principal** (Servicios, Líneas de investigación, Repositorio, Contacto).
- **Funciona incluso sin clave de API:** si no hay clave configurada o la API falla, responde con un sistema de respuestas de respaldo basado en palabras clave. Así el sitio nunca queda con un chat "roto".

---

##  Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| [React 19](https://react.dev/) | Librería de interfaz (componentes funcionales + Hooks + Context API). |
| [Vite 8](https://vite.dev/) | Servidor de desarrollo y empaquetador. |
| [React Router 8](https://reactrouter.com/) | Navegación entre las 5 vistas. |
| [ZURB Foundation 6](https://get.foundation/) | Sistema de grilla `XY Grid` y utilidades responsivas. |
| [GSAP + ScrollTrigger](https://gsap.com/) | Animaciones de entrada, línea del tiempo y apilamiento de tarjetas. |
| [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) | Conexión con Google Gemini para CaféBot. |
| [Oxlint](https://oxc.rs/) | Linter de código (revisión de errores y buenas prácticas). |

---

##  Requisitos previos

Antes de empezar, asegúrate de tener instalado:

- **[Node.js](https://nodejs.org/) versión 20.19+ o 22.12+** (recomendado: la última versión LTS). Incluye `npm`.
- **[Git](https://git-scm.com/)** para clonar el repositorio.
- *(Opcional)* Una **clave de API de Google Gemini** para activar las respuestas con IA de CaféBot.

Para verificar las versiones instaladas:

```bash
node -v
npm -v
git --version
```

---

##  Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/santiagoo08/WebPageCesurCafe.git
cd WebPageCesurCafe
```

### 2. Instalar las dependencias

```bash
npm install
```

Esto descarga todas las librerías necesarias en la carpeta `node_modules/` (solo se hace la primera vez o cuando cambien las dependencias).

### 3. *(Opcional)* Configurar la clave de Gemini

Ver la sección [Configuración de CaféBot](#-configuración-de-cafébot-google-gemini). Si te la saltas, el sitio funciona igual y CaféBot usará sus respuestas de respaldo.

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

### 5. Abrir en el navegador

La terminal mostrará algo como:

```
  VITE v8.x.x  ready in 500 ms

  ➜  Local:   http://localhost:5173/
```

Abre **http://localhost:5173/** en tu navegador. Cualquier cambio que hagas en el código se reflejará automáticamente sin recargar la página.

Para detener el servidor, presiona `Ctrl + C` en la terminal.

---

##  Configuración de CaféBot (Google Gemini)

### 1. Obtener una clave de API

1. Ingresa a **[Google AI Studio](https://aistudio.google.com/apikey)** con tu cuenta de Google.
2. Haz clic en **"Create API key"** y copia la clave generada.

### 2. Crear el archivo de variables de entorno

En la **raíz del proyecto** (al mismo nivel que `package.json`), crea un archivo llamado **`.env.local`** con el siguiente contenido:

```env
# Clave de API de Google Gemini para CaféBot
VITE_GEMINI_API_KEY=pega_aqui_tu_clave
```

### 3. Reiniciar el servidor

Vite solo lee las variables de entorno al arrancar, así que detén el servidor (`Ctrl + C`) y vuelve a ejecutar `npm run dev`.

> [!CAUTION]
> **Nunca subas tu clave al repositorio.** El archivo `.env.local` ya está incluido en `.gitignore`.
> Además, ten en cuenta que en una aplicación solo‑frontend, las variables `VITE_*` quedan **visibles en el código del navegador**. Para producción se recomienda restringir la clave desde Google Cloud Console (por dominio / referer HTTP) o mover las llamadas a un backend o función serverless.

### ¿Cómo sé si está funcionando?

- **Con clave válida:** las respuestas son generadas por Gemini, son variadas y conversacionales.
- **Sin clave o con error:** CaféBot responde con textos predefinidos según palabras clave (ej. "servicios", "ubicación", "publicaciones"). En la consola del navegador (`F12`) verás advertencias si un modelo falló.

---

##  Scripts disponibles

Ejecútalos desde la raíz del proyecto:

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con recarga en caliente en `http://localhost:5173`. |
| `npm run build` | Genera la versión optimizada para producción en la carpeta `dist/`. |
| `npm run preview` | Sirve localmente la carpeta `dist/` para probar la versión de producción (ejecuta `build` antes). |
| `npm run lint` | Revisa el código con Oxlint en busca de errores y malas prácticas. |

---

##  Estructura del proyecto

```
Proyecto-Pesurcafe/
├── public/
│   ├── favicon.svg
│   ├── images/
│   │   ├── nosotros.jpg         # Portada de la sección Nosotros
│   │   ├── repositorio.jpg      # Portada de la sección Repositorio
│   │   ├── servicios.jpg        # Portada de la sección Servicios
│   │   └── timeline-sprite.webp # Sprite de 240 cuadros (Línea del tiempo 60-120 fps)
│   └── videos/
│       └── cafe.mp4             # Video inmersivo de fondo de Inicio
├── src/
│   ├── components/             # Componentes compartidos entre vistas
│   │   ├── CafeBotWidget.jsx   # Avatar, mensajes, input y widget flotante
│   │   ├── Icon.jsx            # Íconos SVG institucionales y de redes
│   │   ├── Layout.jsx          # Navbar, Footer, Logo y estructura global
│   │   ├── MediaVisual.jsx     # Contenedor de imagen/video con ScrollTrigger
│   │   └── PublicationCard.jsx # Tarjeta reutilizable de publicaciones
│   ├── context/
│   │   └── ChatContext.jsx     # Estado global sincronizado de CaféBot
│   ├── data/                   #  TODO el contenido del sitio (sin base de datos)
│   │   ├── institutional.js    # Navegación, proyectos, servicios, equipo y contacto
│   │   └── publications.json   # Catálogo completo del repositorio
│   ├── hooks/
│   │   └── useScrollReveal.js  # Hook de animaciones de entrada GSAP ScrollTrigger
│   ├── pages/                  # Las 5 vistas autocontenidas + sus estilos
│   │   ├── Contacto.css
│   │   ├── Contacto.jsx
│   │   ├── Inicio.css
│   │   ├── Inicio.jsx
│   │   ├── Nosotros.css
│   │   ├── Nosotros.jsx
│   │   ├── Repositorio.css
│   │   ├── Repositorio.jsx
│   │   ├── Servicios.css
│   │   └── Servicios.jsx
│   ├── services/
│   │   └── gemini.js           # Conexión con Gemini, System Prompt y respuestas de respaldo
│   ├── App.jsx                 # Definición de rutas
│   ├── index.css               # Paleta de colores, variables y estilos compartidos
│   └── main.jsx                # Punto de entrada (carga Foundation + estilos)
├── .env.local                  # Clave de Gemini (NO se sube al repositorio)
├── index.html
├── package.json
└── vite.config.js
```

---

##  Cómo editar el contenido

Como no hay base de datos, **todo el contenido se modifica editando los 2 archivos de `src/data/`**. No es necesario tocar los componentes.

| Archivo | Qué contiene |
|---|---|
| `src/data/institutional.js` | Enlaces del menú y redes sociales, proyectos destacados de Inicio, misión/visión/logros, servicios, investigadores, testimonios, líneas de investigación y datos de contacto. |
| `src/data/publications.json` | Catálogo completo del repositorio de investigaciones. |

### Ejemplo: agregar una publicación al repositorio

Añade un nuevo objeto al arreglo de `src/data/publications.json`:

```json
{
  "id": "pub-14",
  "title": "Título de la nueva publicación",
  "summary": "Resumen breve de una o dos líneas.",
  "area": "SUELOS",
  "type": "Artículos",
  "status": "Finalizado",
  "year": 2026,
  "author": "Nombre del autor o equipo"
}
```

- **`id`**: debe ser único.
- **`type`**: uno de `Artículos`, `Libros`, `Cartillas Rurales` o `Investigaciones` (así funcionan los filtros).
- **`area`**: en mayúsculas, ej. `MICROBIOLOGÍA`, `FITOSANIDAD`, `SUELOS`, `AGRICULTURA`, `EDUCACIÓN RURAL`.
- **`status`**: `Finalizado` o `Activo`.

> [!NOTE]
> CaféBot también lee estos archivos para construir su contexto, por lo que al actualizar servicios, líneas de investigación o publicaciones, el bot conocerá la nueva información automáticamente.

---

##  Paleta de colores

Paleta **"Tostión Nocturna & Cereza"**, definida en `src/index.css`:

| Variable | Color | Uso |
|---|---|---|
| `--bg-primary` | `#181310` | Fondo general (Grano Tostado Oscuro) |
| `--bg-card` | `#261E1A` | Tarjetas y contenedores (Tostión Media-Oscura) |
| `--bg-chat` | `#1F1916` | Fondo de conversación de CaféBot |
| `--bg-dark` | `#1C1613` | Bloques oscuros (Espresso Profundo) |
| `--bg-dark-card` | `#2A221E` | Tarjetas internas oscuras |
| `--accent-primary` | `#B8332A` | Rojo cereza: botones, CaféBot, estados activos |
| `--accent-secondary` | `#C88A4B` | Caramelo: etiquetas, bordes, línea del tiempo |
| `--text-primary` | `#F3EDE2` | Texto principal (Crema Pergamino) |
| `--text-secondary` | `#B8ABA0` | Subtítulos y metadatos (Ceniza Cálida) |
| `--text-on-dark` | `#F3EDE2` | Texto claro sobre fondos oscuros |

---

##  Compilar para producción

```bash
npm run build
npm run preview   # opcional: probar el resultado localmente
```

El resultado queda en la carpeta **`dist/`**, que contiene solo archivos estáticos (HTML, CSS, JS y recursos). Puede subirse a cualquier hosting estático como **Vercel**, **Netlify**, **GitHub Pages** o el servidor de la universidad.

> [!IMPORTANT]
> Al ser una SPA con rutas (`/nosotros`, `/servicios`, …), el hosting debe redirigir todas las rutas a `index.html`; de lo contrario, recargar una página interna dará error 404.
> - **Netlify:** crear `public/_redirects` con la línea `/*  /index.html  200`.
> - **Vercel:** agregar un `vercel.json` con `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`.
>
> Recuerda también configurar la variable `VITE_GEMINI_API_KEY` en el panel del hosting **antes** de compilar.

---

##  Solución de problemas

<details>
<summary><b>Windows: "No se puede cargar el archivo npm.ps1 porque la ejecución de scripts está deshabilitada"</b></summary>

PowerShell bloquea los scripts por defecto. Tienes dos opciones:

- Usar **`npm.cmd`** en lugar de `npm` (ej. `npm.cmd run dev`), o usar la terminal **CMD** / **Git Bash**.
- O permitir scripts para tu usuario (solo una vez):

  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  ```
</details>

<details>
<summary><b>CaféBot solo responde con textos predefinidos</b></summary>

- Verifica que el archivo se llame exactamente `.env.local` y esté en la raíz del proyecto.
- Verifica que la variable se llame exactamente `VITE_GEMINI_API_KEY` (el prefijo `VITE_` es obligatorio).
- Reinicia el servidor de desarrollo después de crear o modificar el archivo.
- Revisa la consola del navegador (`F12`) para ver si la clave es inválida o se agotó la cuota gratuita.
</details>

<details>
<summary><b>El puerto 5173 ya está en uso</b></summary>

Vite usará automáticamente el siguiente puerto disponible (5174, 5175…); revisa la URL que aparece en la terminal. También puedes indicar uno manualmente: `npm run dev -- --port 3000`.
</details>

<details>
<summary><b>Errores extraños después de actualizar el proyecto</b></summary>

Reinstala las dependencias desde cero:

```bash
# macOS / Linux / Git Bash
rm -rf node_modules
npm install
```

```powershell
# PowerShell
Remove-Item -Recurse -Force node_modules
npm install
```
</details>

---

##  Licencia

© 2026 **CESURCAFÉ – Universidad Surcolombiana (USCO)**. Todos los derechos reservados.

Proyecto de uso académico desarrollado en el Semillero de Investigación CESURCAFÉ. No se permite su reproducción, distribución o uso comercial sin autorización expresa de la institución.
