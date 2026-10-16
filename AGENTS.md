# Contexto del Proyecto: Portal Web CESURCAFÉ + CaféBot

## 1. Descripción General

Este proyecto consiste en el desarrollo de una aplicación web interactiva para **CESURCAFÉ** (Centro Surcolombiano de Investigación en Café / Semillero de investigación de la Universidad Surcolombiana - USCO, ubicada en Neiva, Huila, Colombia).

**Regla de oro para Agy (Asistente de IA):** El proyecto debe construirse **estrictamente por bloques modulares**. No generes ni avances al siguiente bloque de código hasta que el desarrollador valide el bloque actual y lo solicite explícitamente.

## 2. Stack Tecnológico y Restricciones Estrictas

* **Frontend:** React.js (Componentes funcionales, Hooks, estado local).
* **Framework CSS:** **ZURB Foundation Framework** (uso obligatorio de su sistema `XY Grid`, contenedores y utilidades responsivas) + Variables CSS personalizadas.
* **Animaciones y Scroll:** **GSAP (GreenSock)** con el plugin **ScrollTrigger** para:
  1. Animaciones de entrada de secciones y reproducción/control de videos al hacer scroll.
  2. Efecto de apilamiento de tarjetas (*Card Stacking*) en la sección de Servicios.
  3. **Animación especial de Línea del Tiempo (bajo solicitud):** Transformación progresiva de una cereza de café hasta una taza de café.
* **Base de Datos:** **PROHIBIDO usar base de datos.** Toda la información (proyectos, investigadores, servicios y publicaciones del repositorio) debe consumirse desde archivos estáticos locales (`src/data/*.json` o `*.js`).
* **Inteligencia Artificial (Chatbot):** Integración directa en el cliente con la API de **Google Gemini (`@google/generative-ai`)** configurada con un *System Prompt* cerrado al contexto de CESURCAFÉ.

## 3. Paleta de Colores Oficial: "Tostión Editorial & Cereza"

Todo el diseño debe implementar estrictamente esta paleta de colores inspirada en el café de especialidad, utilizando las siguientes variables CSS en `:root`:

```css
:root {
  /* Fondos Principales */
  --bg-primary: #F6F4F0;       /* Fondo Pergamino - Canvas general de la página */
  --bg-card: #FFFFFF;          /* Blanco Puro - Tarjetas claras y contenedores */
  
  /* Fondos Oscuros (Alto Contraste) */
  --bg-dark: #1C1613;          /* Espresso Profundo - Contenedores oscuros (Misión, Servicios, Experiencias) */
  --bg-dark-card: #2A221E;     /* Tostión Oscura - Tarjetas internas sobre fondo oscuro */
  
  /* Colores de Acento */
  --accent-primary: #B8332A;   /* Rojo Cereza - Botones principales, widget CaféBot, estados activos e hitos */
  --accent-secondary: #C88A4B; /* Caramelo - Etiquetas (tags), bordes activos, línea del tiempo y detalles */
  
  /* Tipografía */
  --text-primary: #1C1613;     /* Espresso Profundo - Títulos y texto principal sobre fondos claros */
  --text-secondary: #6E655F;   /* Ceniza de Café - Subtítulos, descripciones y metadatos */
  --text-on-dark: #F6F4F0;     /* Texto claro sobre bloques oscuros */
}
```

## 4. Estructura Global (Navbar, Footer y CaféBot Flotante)

### 4.1. Navbar (Barra de Navegación Superior)

* Posición fija superior (*sticky*), fondo claro (`--bg-card`), diseño limpio.
* **Izquierda:** Logotipo e identidad de `CESURCAFÉ`.
* **Derecha (5 secciones estrictas):**
  1. `Inicio`
  2. `Nosotros`
  3. `Servicios`
  4. `Repositorio`
  5. `Contacto`
* Incluye indicador inferior (línea subrayada en `--accent-primary` o `--text-primary`) en la sección activa.

### 4.2. Botón Flotante de CaféBot (Global)

* Ubicado en la **esquina inferior derecha (`position: fixed`)**, acompañando al usuario durante todo el scroll de la página.
* Estilizado con los tonos de la paleta (`--bg-dark` y `--accent-primary`).
* Al hacer clic, despliega una ventana flotante (popover/modal) con la interfaz de conversación de **CaféBot** (con avatar de grano de café animado) conectada a la API de Google Gemini.

### 4.3. Footer (Pie de Página Global)

* **Izquierda:** Recuadro oscuro (`--bg-dark`) para el logo institucional de CESURCAFÉ / USCO.
* **Derecha:** Bloque `SÍGUENOS` con enlaces a `Instagram`, `Facebook` y `LinkedIn`.

## 5. Especificación Detallada de las 5 Vistas / Secciones

### SECCIÓN 1: `Inicio`

Compuesta por 5 sub-bloques verticales:

1. **Carrusel de Proyectos Destacados (Hero):**
   * Contenedor claro con apoyo de video/animación de fondo.
   * Estructura: Etiqueta (`PROYECTO 01`), Título (`SISTEMA DE MONITOREO AGRÍCOLA`), Descripción (`Sensores de campo aplicados al seguimiento de cultivos en la región.`).
   * Controles inferiores: Botón flecha izquierda (`←`), indicador de diapositiva activa (`[ - — - ]`) y botón flecha derecha (`→`).

2. **Bloque Propósito Institucional (Fondo Oscuro `--bg-dark`):**
   * Grilla de 3 tarjetas oscuras (`--bg-dark-card`) usando `XY Grid` de Foundation:
     * **Tarjeta 1:** `NUESTRO PROPÓSITO` | **Misión:** *"Impulsar el desarrollo tecnológico y la innovación agroindustrial en la cadena productiva del café."*
     * **Tarjeta 2:** `FUTURO` | **Visión:** *"Ser el centro de referencia científica y tecnológica en café de alta calidad a nivel internacional."*
     * **Tarjeta 3:** `LOGROS` | **Reconocimientos:** *"Certificaciones de calidad y premios por transferencia de tecnología regional."*

3. **Banner "Conoce más sobre nosotros":**
   * Tarjeta horizontal blanca (`--bg-card`).
   * Izquierda: Etiqueta `CONOCE MÁS SOBRE NOSOTROS`, Título `Personas, investigación y territorio`, Descripción `"Conoce al equipo de investigadores, nuestra historia y los proyectos que impulsan CESURCAFÉ."`, enlace de acción `Visitar Nosotros →` (navega a la sección Nosotros).
   * Derecha: Insignia circular con borde fino y el número `01`.

4. **Resumen de Producción Científica ("Repositorio de investigaciones"):**
   * Cabecera: `PRODUCCIÓN CIENTÍFICA` | Título: `Repositorio de investigaciones`.
   * Barra de pestañas (Tabs redondeados): `Recientes` (activo en `--bg-dark`), `Artículos`, `Libros`, `Cartillas Rurales`.
   * Grilla de 3 tarjetas de vista previa:
     * Cada tarjeta tiene en la parte superior una portada con 2 etiquetas tipo píldora en las esquinas superiores (Ej: `MICROBIOLOGÍA` a la izquierda y `Artículos` a la derecha; `FITOSANIDAD` / `Artículos`; `SUELOS` / `Libros`).
     * Cuerpo de tarjeta: Título (`Caracterización de suelos cafeteros`, `Procesos de fermentación controlada`, `Análisis de suelos y fitosanidad`), breve resumen y pie de tarjeta (`2026 • Equipo de Microbiología`).
   * Botón inferior centrado: `Ver más` (redirige a la sección `Repositorio`).

5. **Resumen de Servicios (Componente Maestro-Detalle):**
   * Título: `Resumen de servicios`.
   * **Columna Izquierda (`LISTA DE SERVICIOS`):** Menú vertical interactivo numerado:
     1. `Laboratorio de calidad` (estado activo resaltado en tarjeta blanca).
     2. `Procesos de fermentación`.
     3. `Formación cafetera`.
   * **Columna Derecha (Detalle):** Tarjeta amplia con un círculo oscuro superpuesto en el borde superior (`Imagen` / Ícono del servicio), título `Información del servicio seleccionado` y párrafo descriptivo dinámico según el ítem seleccionado.

### SECCIÓN 2: `Nosotros`

Compuesta por 3 sub-bloques verticales:

1. **Cabecera y Galería Acordeón (`¿Quiénes somos?`):**
   * Etiqueta: `CENTRO DE INVESTIGACIÓN` | Título: `¿Quiénes somos?`
   * Descripción: *"Somos el Centro Surcolombiano de Investigación en Café (CESURCAFÉ) de la Universidad Surcolombiana, orientados al desarrollo tecnológico y agroindustrial de la región."*
   * **Componente Visual:** Panel horizontal alto dividido en 4 franjas verticales (acordeón interactivo de imágenes/videos que se expanden suavemente al pasar el cursor o hacer scroll).

2. **Línea del Tiempo (`Nuestra historia`):**
   * Cabecera centrada: Título `Nuestra historia` y subtítulo `Nuestra trayectoria...`.
   * **Estructura vacía de contenido:** Eje central vertical con 4 nodos circulares y 4 tarjetas alternadas (izquierda y derecha). **Dejar los textos de las tarjetas vacíos**, ya que el foco exclusivo de esta sección es la animación GSAP.
   * **Animación GSAP ScrollTrigger (Implementar solo cuando el usuario lo pida):** A medida que el usuario hace scroll por el eje central de la línea del tiempo, el elemento central animado debe transformarse desde una **cereza de café** (`--accent-primary`) pasando por el despulpado/pergamino y tostión (`--accent-secondary` / `--bg-dark-card`) hasta terminar en una **taza de café servida** (final de la línea).

3. **Carrusel de Equipo (`Investigadores del centro`):**
   * Título centrado: `Investigadores del centro`.
   * Carrusel de 3 tarjetas verticales oscuras (`--bg-dark-card`) con controles laterales (`◀` y `▶`):
     * Tarjeta 1: `INVESTIGADOR` | **Dra. Laura Sofía** | *Líder de Sostenibilidad*.
     * Tarjeta 2: `INVESTIGADOR` | **MSc. Juan David** | *Investigador de Poscosecha*.
     * Tarjeta 3: `INVESTIGADOR` | **Biól. Valentina Ruiz** | *Analista de Microbiología*.

### SECCIÓN 3: `Servicios`

Compuesta por 3 sub-bloques verticales:

1. **Cabecera de Servicios:**
   * Bloque blanco centrado: Etiqueta `LO QUE HACEMOS`, Título `Servicios`, Descripción *"Capacidades de investigación aplicada para el territorio y sus comunidades."*

2. **Tarjetas de Servicios con Efecto Apilado (GSAP ScrollTrigger Card Stacking):**
   * 3 tarjetas horizontales de gran formato divididas en 2 columnas (50% izquierda fondo oscuro `--bg-dark` con texto / 50% derecha fondo claro para video o imagen del servicio).
   * Al hacer scroll hacia abajo, las tarjetas se van apilando una sobre otra mediante `ScrollTrigger` (`pin: true`):
     * **Servicio 1:** `ANÁLISIS CAFETERO` — **Laboratorio de Calidad y Sensorial**.
     * **Servicio 2:** `INNOVACIÓN POSCOSECHA` — **Optimización de Procesos de Fermentación**.
     * **Servicio 3:** `TRANSFERENCIA TECNOLÓGICA` — **Capacitación y Extensión Cafetera**.

3. **Sección Experiencias (`Voces de la comunidad cafetera`):**
   * Contenedor de fondo oscuro (`--bg-dark`). Cabecera centrada: `EXPERIENCIAS` | `Voces de la comunidad cafetera`.
   * Carrusel horizontal de tarjetas de testimonios:
     * **Parte superior de la tarjeta (Clara):** Categoría (`PERFIL DE TAZA` / `FERMENTACIÓN`), botón superior derecho `+ Ver proyecto` e insignia circular numerada (`01`).
     * **Parte inferior de la tarjeta (`--bg-dark-card`):** Ícono de comillas `“`, cita en cursiva (*"Gracias a las pruebas de perfil de taza pudimos identificar las notas florales de nuestro café y exportar a Europa con un precio diferenciado."*), nombre del autor (**María Consuelo Polanía** - *Caficultora de San Agustín* / **Ing. Jorge Trujillo** - *Asociación de Cafés Especiales*).

### SECCIÓN 4: `Repositorio`

Compuesta por 2 sub-bloques verticales:

1. **Cabecera de Repositorio:**
   * Bloque blanco centrado: Etiqueta `PRODUCCIÓN CIENTÍFICA`, Título `Repositorio`, Descripción *"Investigaciones, artículos, libros y cartillas rurales producidos por el centro, en un solo lugar."*

2. **Explorador y Catálogo Filtrable (JSON Estático):**
   * **Barra superior:** A la izquierda el título `Repositorio de investigaciones`; a la derecha un campo de búsqueda en tiempo real (`Buscar por título o autor...`).
   * **Pestañas de filtro:** `Todos`, `Artículos`, `Libros`, `Cartillas Rurales`, `Investigaciones`.
   * **Grilla de Tarjetas (3 columnas en escritorio):**
     * Portada superior con 2 etiquetas flotantes: Área temática (`MICROBIOLOGÍA`, `FITOSANIDAD`, `SUELOS`, `AGRICULTURA`, `EDUCACIÓN RURAL`) y Tipo (`Artículos`, `Libros`, `Investigación`).
     * Cuerpo: Estado del proyecto (`Finalizado` o `Activo`), Título en negrita (`Sistema de monitoreo agrícola`, `Cartillas rurales digitales`, etc.), resumen corto y metadatos inferiores (`2026 • Nombre del Autor / Líder del proyecto`).
   * **Paginación cliente:** Botón inferior centrado `Cargar más`.

### SECCIÓN 5: `Contacto` (Módulo Integrado de CaféBot + Datos Institucionales)

Diseño en contenedor principal dividido en 2 columnas (Sidebar Izquierdo + Chat Principal Derecho):

1. **Columna Izquierda (Barra Lateral):**
   * **Panel Superior (`SUGERENCIAS RÁPIDAS`):** Lista de 4 botones de consulta rápida que, al hacer clic, envían automáticamente la pregunta al chat:
     * `Líneas de investigación`
     * `Proyectos de café`
     * `Ubicación USCO`
     * `Publicaciones`
   * **Panel Inferior (`CONTACTO INSTITUCIONAL`):** Recuadro informativo con:
     * **Email:** `cesurcafe@usco.edu.co`
     * **Ubicación:** `Neiva, Huila` (Universidad Surcolombiana).

2. **Columna Derecha (Interfaz Completa de CaféBot):**
   * **Cabecera del Chat:** Avatar circular con punto verde de estado activo, título **CaféBot** y subtítulo `Asistente virtual CESURCAFÉ • En línea`.
   * **Área de Mensajes:** Separador de fecha (`Hoy`), burbujas del bot a la izquierda (fondo claro `--bg-primary`) con avatar y hora (`09:30 a. m.`), y burbujas del usuario a la derecha (fondo oscuro `--bg-dark` o `--accent-primary`) con hora.
   * **Barra de Entrada Inferior:** Contenedor redondeado con input de texto (`Escribe tu mensaje...`) y botón `Enviar`.
   * **Sincronización:** El estado de la conversación debe compartirse entre este módulo de la sección `Contacto` y el **Botón Flotante (Widget)** de la esquina inferior derecha.

## 6. Orden de Ejecución por Bloques para Agy

1. **Bloque 1:** Configuración inicial del proyecto React + Foundation CSS + Variables CSS de la paleta "Tostión Editorial & Cereza" + `Navbar` (5 enlaces) + `Footer`.
2. **Bloque 2:** Construcción completa de la vista **Inicio** (Carrusel Hero, Tarjetas de Misión/Visión/Logros, Banner 01, Vista previa de Repositorio y Maestro-Detalle de Servicios).
3. **Bloque 3:** Construcción de la vista **Nosotros** (Acordeón "¿Quiénes somos?", estructura vacía de la Línea del Tiempo y Carrusel de Investigadores).
4. **Bloque 4 (Bajo solicitud):** Animación GSAP ScrollTrigger de la Línea del Tiempo (Transformación de la cereza de café a la taza de café) + Animaciones de videos por scroll.
5. **Bloque 5:** Construcción de la vista **Servicios** (Tarjetas apilables con GSAP ScrollTrigger + Carrusel de Testimonios "Voces de la comunidad").
6. **Bloque 6:** Construcción de la vista **Repositorio** (Buscador en tiempo real, filtros por categoría y carga desde JSON local).
7. **Bloque 7:** Construcción de la vista **Contacto** + **Widget Flotante de CaféBot** + Integración con la API de Google Gemini y configuración del *System Prompt*.