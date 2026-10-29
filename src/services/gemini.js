import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  CONTACT_INFO,
  FEATURED_PROJECTS,
  PUBLICATIONS,
  PURPOSE_CARDS,
  RESEARCHERS,
  RESEARCH_LINES,
  SERVICES,
  SOCIAL_LINKS,
  TESTIMONIALS,
  WHO_WE_ARE_PANELS,
  normalizeText,
} from '../data/institutional';

const MENU_IDS = {
  MAIN: 'main',
  SERVICIOS: 'servicios',
  LINEAS: 'lineas',
  PROYECTOS: 'proyectos',
  REPOSITORIO: 'repositorio',
  NOSOTROS: 'nosotros',
  CONTACTO: 'contacto',
};

let activeMenu = MENU_IDS.MAIN;
let apiKeyDisabledForSession = false;
let apiCooldownUntil = 0;

export const MAIN_MENU_OPTIONS =
  `1. 🔬 **Servicios:** Laboratorio sensorial, fermentación controlada y formación.\n` +
  `2. 🌾 **Líneas de investigación:** Suelos, microbiología, fitosanidad y sensores.\n` +
  `3. 🚀 **Proyectos destacados:** Iniciativas tecnológicas y rurales en el Huila.\n` +
  `4. 📚 **Repositorio:** Artículos, libros, investigaciones y cartillas rurales.\n` +
  `5. 🏛️ **Nosotros y equipo:** Historia, misión, visión e investigadores.\n` +
  `6. 📍 **Contacto y ubicación:** Sede USCO en Neiva, Huila y canales oficiales.`;

export const WELCOME_MESSAGE =
  `¡Hola! Soy **CaféBot**, el asistente virtual de **CESURCAFÉ** en la Universidad Surcolombiana (USCO).\n\n` +
  `Selecciona un tema escribiendo su **número (1–6)** o redacta tu consulta:\n\n` +
  `${MAIN_MENU_OPTIONS}`;

/**
 * System Prompt cerrado al contexto estricto de CESURCAFÉ con regla de retorno al Menú Principal.
 */
const SYSTEM_INSTRUCTION = `
Eres CaféBot, el asistente virtual oficial de CESURCAFÉ (Centro Surcolombiano de Investigación en Café de la Universidad Surcolombiana - USCO, ubicado en Neiva, Huila, Colombia).

Tu propósito es orientar a caficultores, investigadores, estudiantes y público en general sobre las actividades, servicios, investigaciones y proyectos de CESURCAFÉ.

Información institucional clave:
- Institución: ${CONTACT_INFO.institution} (USCO), Neiva, Huila, Colombia.
- Correo electrónico: ${CONTACT_INFO.email}
- Propósito: ${PURPOSE_CARDS.map((p) => `${p.title}: ${p.text}`).join(' ')}
- Líneas de investigación:
${RESEARCH_LINES.map((line) => `  * ${line}`).join('\n')}
- Servicios disponibles:
${SERVICES.map((s) => `  * ${s.title}: ${s.description}`).join('\n')}
- Proyectos destacados:
${FEATURED_PROJECTS.map((p) => `  * ${p.title}: ${p.description}`).join('\n')}
- Publicaciones destacadas en repositorio:
${PUBLICATIONS.slice(0, 6).map((pub) => `  * "${pub.title}" (${pub.type}, ${pub.year}) - ${pub.author}`).join('\n')}

REGLA FUNDAMENTAL DE ALCANCE Y RETORNO AL MENÚ PRINCIPAL:
1. Tu conocimiento y campo de acción se limitan EXCLUSIVAMENTE a CESURCAFÉ, la caficultura, la investigación agronómica, la fermentación, calidad de taza y proyectos del centro.
2. Si el usuario te pregunta sobre CUALQUIER tema ajeno a este ámbito (por ejemplo: política, deportes, fútbol, recetas ajenas al café, matemáticas generales, tareas escolares de otras materias, programación externa, celebridades, chistes o temas no relacionados):
   - NO respondas la pregunta externa.
   - Indica amablemente que como asistente oficial de CESURCAFÉ tu función se enfoca únicamente en el café y la investigación del centro.
   - Devuelve SIEMPRE al usuario al **Menú Principal**, presentándolo con estas 6 opciones:

   "Como asistente virtual de **CESURCAFÉ**, únicamente puedo orientarte sobre temas de nuestro centro de investigación, café y proyectos agroindustriales del Huila.

   Te invito a consultar nuestro **Menú Principal**:
   1. 🔬 **Servicios:** Laboratorio sensorial, fermentación controlada y formación.
   2. 🌾 **Líneas de investigación:** Suelos, microbiología, fitosanidad y sensores.
   3. 🚀 **Proyectos destacados:** Iniciativas tecnológicas y rurales en el Huila.
   4. 📚 **Repositorio:** Artículos, libros, investigaciones y cartillas rurales.
   5. 🏛️ **Nosotros y equipo:** Historia, misión, visión e investigadores.
   6. 📍 **Contacto y ubicación:** Sede USCO en Neiva, Huila y canales oficiales.

   Escribe el número (1–6) del tema que deseas consultar."
3. Respuestas en español, claras, rigurosas y amables.
`.trim();

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function renderMainMenu(prefix = '📋 **Menú Principal de CESURCAFÉ**') {
  return `${prefix}\n\nEscribe el **número (1–6)** del tema que deseas consultar:\n\n${MAIN_MENU_OPTIONS}`;
}

function renderServiciosMenu() {
  const list = SERVICES.map((s, idx) => `${idx + 1}. **${s.title}** (${s.tag})`).join('\n');
  return (
    `🔬 **Menú 1 · Servicios de CESURCAFÉ**\n` +
    `Escribe el número del servicio para ver su ficha detallada:\n\n` +
    `${list}\n` +
    `0. ↩️ **Volver al Menú Principal**`
  );
}

function renderServicioDetail(index) {
  const service = SERVICES[index];
  const highlights = service.highlights.map((h) => `• ${h}`).join('\n');
  return (
    `🔬 **${service.title}** (${service.tag})\n\n` +
    `${service.description}\n\n` +
    `**Incluye:**\n${highlights}\n\n` +
    `📩 Solicitudes e información: **${CONTACT_INFO.email}**\n\n` +
    `Escribe **1–3** para ver otro servicio o **0** para volver al **Menú Principal**.`
  );
}

const LINEAS_DETAILS = [
  {
    summary:
      'Evaluación física del grano verde/pergamino, granulometría, humedad y catación bajo protocolos internacionales SCA para identificar y valorizar perfiles diferenciados del Huila.',
    pubIds: ['pub-09', 'pub-02'],
  },
  {
    summary:
      'Aislamiento de levaduras nativas, estudio de microbiota y diseño de protocolos de fermentación controlada monitoreando pH, temperatura y grados Brix.',
    pubIds: ['pub-01', 'pub-06', 'pub-13'],
  },
  {
    summary:
      'Diagnóstico fisicoquímico de fertilidad en suelos cafeteros de ladera y manejo integrado de limitantes fitosanitarias como la broca y la roya del cafeto.',
    pubIds: ['pub-03', 'pub-07', 'pub-08', 'pub-12'],
  },
  {
    summary:
      'Implementación de redes de sensores agroclimáticos en campo y optimización tecnológica de infraestructura poscosecha y secado solar.',
    pubIds: ['pub-04', 'pub-11'],
  },
  {
    summary:
      'Programas de extensión rural, talleres prácticos, relevo generacional con jóvenes caficultores y cartillas digitales de acceso abierto.',
    pubIds: ['pub-05', 'pub-10'],
  },
];

function renderLineasMenu() {
  const list = RESEARCH_LINES.map((line, idx) => `${idx + 1}. **${line}**`).join('\n');
  return (
    `🌾 **Menú 2 · Líneas de Investigación**\n` +
    `Escribe el número de una línea para conocer su enfoque y estudios asociados:\n\n` +
    `${list}\n` +
    `0. ↩️ **Volver al Menú Principal**`
  );
}

function renderLineaDetail(index) {
  const title = RESEARCH_LINES[index];
  const detail = LINEAS_DETAILS[index];
  const relatedPubs = PUBLICATIONS.filter((p) => detail.pubIds.includes(p.id))
    .map((p) => `• **${p.title}** (${p.type}, ${p.year}) — ${p.author}`)
    .join('\n');

  return (
    `🌾 **${title}**\n\n` +
    `${detail.summary}\n\n` +
    `**Publicaciones relacionadas en el repositorio:**\n${relatedPubs}\n\n` +
    `Escribe **1–5** para consultar otra línea o **0** para volver al **Menú Principal**.`
  );
}

const PROJECT_MATCHES = [
  { pubId: 'pub-04', testimonialIndex: 3 },
  { pubId: 'pub-02', testimonialIndex: 1 },
  { pubId: 'pub-05', testimonialIndex: 2 },
];

function renderProyectosMenu() {
  const list = FEATURED_PROJECTS.map((p, idx) => `${idx + 1}. **${p.title}**`).join('\n');
  return (
    `🚀 **Menú 3 · Proyectos Destacados**\n` +
    `Escribe el número del proyecto para conocer sus alcances e impacto regional:\n\n` +
    `${list}\n` +
    `0. ↩️ **Volver al Menú Principal**`
  );
}

function renderProyectoDetail(index) {
  const project = FEATURED_PROJECTS[index];
  const match = PROJECT_MATCHES[index];
  const pub = PUBLICATIONS.find((p) => p.id === match.pubId);
  const testimonial = TESTIMONIALS[match.testimonialIndex];

  const metaLine = pub
    ? `• **Estado:** ${pub.status} (${pub.year}) · **Responsable:** ${pub.author}\n` +
      `• **Enfoque técnico:** ${pub.summary}\n\n`
    : '';
  const quoteBlock = testimonial
    ? `**Impacto en la comunidad:**\n“${testimonial.quote}” — **${testimonial.author}** (${testimonial.role})\n\n`
    : '';

  return (
    `🚀 **${project.title}**\n\n` +
    `${project.description}\n\n` +
    `${metaLine}` +
    `${quoteBlock}` +
    `Escribe **1–3** para ver otro proyecto o **0** para volver al **Menú Principal**.`
  );
}

const REPO_CATEGORIES = [
  { label: 'Artículos científicos', filter: (p) => p.type === 'Artículos' },
  { label: 'Libros', filter: (p) => p.type === 'Libros' },
  { label: 'Cartillas Rurales', filter: (p) => p.type === 'Cartillas Rurales' },
  { label: 'Investigaciones', filter: (p) => p.type === 'Investigaciones' },
  { label: 'Publicaciones recientes (2026)', filter: (p) => p.year === 2026 },
];

function renderRepositorioMenu() {
  const list = REPO_CATEGORIES.map((cat, idx) => {
    const count = PUBLICATIONS.filter(cat.filter).length;
    return `${idx + 1}. **${cat.label}** (${count})`;
  }).join('\n');

  return (
    `📚 **Menú 4 · Repositorio Científico (${PUBLICATIONS.length} publicaciones)**\n` +
    `Escribe el número de la categoría que deseas explorar:\n\n` +
    `${list}\n` +
    `0. ↩️ **Volver al Menú Principal**`
  );
}

function renderRepositorioDetail(index) {
  const category = REPO_CATEGORIES[index];
  const items = PUBLICATIONS.filter(category.filter)
    .map((p) => `• **${p.title}** (${p.year}, ${p.status}) — ${p.author}\n  ${p.summary}`)
    .join('\n\n');

  return (
    `📚 **${category.label}**\n\n` +
    `${items}\n\n` +
    `Puedes explorar el catálogo completo en la sección **Repositorio**.\n` +
    `Escribe **1–5** para consultar otra categoría o **0** para volver al **Menú Principal**.`
  );
}

function renderNosotrosMenu() {
  return (
    `🏛️ **Menú 5 · Nosotros y Equipo Científico**\n` +
    `Selecciona un apartado escribiendo su número:\n\n` +
    `1. **¿Quiénes somos? y pilares del centro**\n` +
    `2. **Misión, Visión y Reconocimientos**\n` +
    `3. **Equipo de investigadores**\n` +
    `0. ↩️ **Volver al Menú Principal**`
  );
}

function renderNosotrosDetail(index) {
  if (index === 0) {
    const pillars = WHO_WE_ARE_PANELS.map((p) => `• **${p.title}:** ${p.caption}`).join('\n');
    return (
      `🏛️ **¿Quiénes somos?**\n\n` +
      `Somos el **Centro Surcolombiano de Investigación en Café (CESURCAFÉ)** de la **${CONTACT_INFO.institution} (USCO)** en ${CONTACT_INFO.location}, orientados al desarrollo tecnológico, científico y agroindustrial de la región cafetera.\n\n` +
      `**Nuestros 4 ejes de acción:**\n${pillars}\n\n` +
      `Escribe **1–3** para ver otro apartado de Nosotros o **0** para volver al **Menú Principal**.`
    );
  }

  if (index === 1) {
    const cards = PURPOSE_CARDS.map((c) => `• **${c.title}:** ${c.text}\n  ${c.detail}`).join('\n\n');
    return (
      `🏛️ **Propósito Institucional de CESURCAFÉ**\n\n` +
      `${cards}\n\n` +
      `Escribe **1–3** para ver otro apartado de Nosotros o **0** para volver al **Menú Principal**.`
    );
  }

  const team = RESEARCHERS.map((r) => {
    const pubs = PUBLICATIONS.filter((p) => p.author === r.name)
      .map((p) => `"${p.title}" (${p.year})`)
      .join(', ');
    const pubText = pubs ? ` — Publicaciones: ${pubs}` : '';
    return `• **${r.name}** — ${r.role}${pubText}`;
  }).join('\n');

  return (
    `🏛️ **Investigadores del Centro**\n\n` +
    `${team}\n\n` +
    `Escribe **1–3** para ver otro apartado de Nosotros o **0** para volver al **Menú Principal**.`
  );
}

function renderContactoMenu() {
  return (
    `📍 **Menú 6 · Contacto y Ubicación**\n` +
    `Escribe el número de la opción que deseas consultar:\n\n` +
    `1. **Ubicación y sede universitaria (USCO)**\n` +
    `2. **Correo institucional y solicitud de servicios**\n` +
    `3. **Redes sociales oficiales**\n` +
    `0. ↩️ **Volver al Menú Principal**`
  );
}

function renderContactoDetail(index) {
  if (index === 0) {
    return (
      `📍 **Ubicación Institucional**\n\n` +
      `**CESURCAFÉ** se encuentra en la sede de la **${CONTACT_INFO.institution} (USCO)** en **${CONTACT_INFO.location}**, Colombia.\n\n` +
      `Atendemos a caficultores, asociaciones, investigadores y estudiantes de toda la región Surcolombiana.\n\n` +
      `Escribe **1–3** para ver otro canal de contacto o **0** para volver al **Menú Principal**.`
    );
  }

  if (index === 1) {
    return (
      `📩 **Correo Institucional y Solicitudes**\n\n` +
      `• **Correo oficial:** **${CONTACT_INFO.email}**\n\n` +
      `A través de este correo puedes solicitar análisis de laboratorio sensorial y físico, asesoría en procesos de fermentación controlada, capacitaciones o vinculación a proyectos.\n\n` +
      `Escribe **1–3** para ver otro canal de contacto o **0** para volver al **Menú Principal**.`
    );
  }

  const socials = SOCIAL_LINKS.map((s) => `• **${s.label}:** ${s.href}`).join('\n');
  return (
    `🌐 **Redes Sociales Oficiales de CESURCAFÉ**\n\n` +
    `${socials}\n\n` +
    `Escribe **1–3** para ver otro canal de contacto o **0** para volver al **Menú Principal**.`
  );
}

/**
 * Detecta si la entrada del usuario es un comando de retorno al menú o una selección numérica.
 */
function parseMenuInput(rawPrompt) {
  const q = normalizeText(String(rawPrompt ?? '')).trim();
  if (!q) return null;

  if (/^(0|0[.):-]|menu|menu principal|inicio|volver|regresar|atras|salir)$/i.test(q)) {
    return { type: 'reset' };
  }

  const numMatch = q.match(/^(?:opcion|menu|numero|num|nro|#|-)?\s*(\d+)\s*[.):-]?$/i);
  if (numMatch) {
    const value = Number(numMatch[1]);
    if (value === 0) return { type: 'reset' };
    return { type: 'number', value };
  }

  return null;
}

/**
 * Navega por el Menú Principal (1–6) o por las opciones del submenú activo (1–N y 0).
 */
function resolveMenuNavigation(cmd) {
  if (cmd.type === 'reset') {
    activeMenu = MENU_IDS.MAIN;
    return renderMainMenu();
  }

  const n = cmd.value;

  if (activeMenu === MENU_IDS.MAIN) {
    switch (n) {
      case 1:
        activeMenu = MENU_IDS.SERVICIOS;
        return renderServiciosMenu();
      case 2:
        activeMenu = MENU_IDS.LINEAS;
        return renderLineasMenu();
      case 3:
        activeMenu = MENU_IDS.PROYECTOS;
        return renderProyectosMenu();
      case 4:
        activeMenu = MENU_IDS.REPOSITORIO;
        return renderRepositorioMenu();
      case 5:
        activeMenu = MENU_IDS.NOSOTROS;
        return renderNosotrosMenu();
      case 6:
        activeMenu = MENU_IDS.CONTACTO;
        return renderContactoMenu();
      default:
        return renderMainMenu(
          `⚠️ La opción **${n}** no existe en el Menú Principal. Elige un número del **1 al 6**:`,
        );
    }
  }

  if (activeMenu === MENU_IDS.SERVICIOS) {
    if (n >= 1 && n <= SERVICES.length) return renderServicioDetail(n - 1);
    return (
      `⚠️ La opción **${n}** no es válida en **Servicios** (opciones **1–3**, o **0** para volver).\n\n` +
      renderServiciosMenu()
    );
  }

  if (activeMenu === MENU_IDS.LINEAS) {
    if (n >= 1 && n <= RESEARCH_LINES.length) return renderLineaDetail(n - 1);
    return (
      `⚠️ La opción **${n}** no es válida en **Líneas de Investigación** (opciones **1–5**, o **0** para volver).\n\n` +
      renderLineasMenu()
    );
  }

  if (activeMenu === MENU_IDS.PROYECTOS) {
    if (n >= 1 && n <= FEATURED_PROJECTS.length) return renderProyectoDetail(n - 1);
    return (
      `⚠️ La opción **${n}** no es válida en **Proyectos Destacados** (opciones **1–3**, o **0** para volver).\n\n` +
      renderProyectosMenu()
    );
  }

  if (activeMenu === MENU_IDS.REPOSITORIO) {
    if (n >= 1 && n <= REPO_CATEGORIES.length) return renderRepositorioDetail(n - 1);
    return (
      `⚠️ La opción **${n}** no es válida en **Repositorio** (opciones **1–5**, o **0** para volver).\n\n` +
      renderRepositorioMenu()
    );
  }

  if (activeMenu === MENU_IDS.NOSOTROS) {
    if (n >= 1 && n <= 3) return renderNosotrosDetail(n - 1);
    return (
      `⚠️ La opción **${n}** no es válida en **Nosotros y Equipo** (opciones **1–3**, o **0** para volver).\n\n` +
      renderNosotrosMenu()
    );
  }

  if (activeMenu === MENU_IDS.CONTACTO) {
    if (n >= 1 && n <= 3) return renderContactoDetail(n - 1);
    return (
      `⚠️ La opción **${n}** no es válida en **Contacto y Ubicación** (opciones **1–3**, o **0** para volver).\n\n` +
      renderContactoMenu()
    );
  }

  activeMenu = MENU_IDS.MAIN;
  return renderMainMenu();
}

/**
 * Respuestas contextuales de respaldo para texto libre cuando la API externa no está disponible,
 * sincronizando el submenú activo para continuar navegando con números.
 */
function getFallbackResponse(prompt) {
  const q = normalizeText(String(prompt ?? '')).trim();

  // Saludos y bienvenida
  if (
    /^(hola|buenas|buenos dias|buenas tardes|buenas noches|hey|saludos|que tal|ayuda)$/i.test(q)
  ) {
    activeMenu = MENU_IDS.MAIN;
    return WELCOME_MESSAGE;
  }

  // Proyectos destacados (incluye sugerencia rápida "Proyectos de café")
  if (q.includes('proyecto') || q.includes('monitoreo') || q.includes('sensor')) {
    activeMenu = MENU_IDS.PROYECTOS;
    return renderProyectosMenu();
  }

  // Servicios
  if (
    q.includes('servicio') ||
    q.includes('laboratorio') ||
    q.includes('catacion') ||
    q.includes('perfil de taza') ||
    q.includes('analisis') ||
    q.includes('capacitacion') ||
    q.includes('formacion')
  ) {
    activeMenu = MENU_IDS.SERVICIOS;
    return renderServiciosMenu();
  }

  // Repositorio y Publicaciones (incluye sugerencia rápida "Publicaciones")
  if (
    q.includes('repositorio') ||
    q.includes('publicac') ||
    q.includes('articulo') ||
    q.includes('libro') ||
    q.includes('cartilla') ||
    q.includes('documento')
  ) {
    activeMenu = MENU_IDS.REPOSITORIO;
    return renderRepositorioMenu();
  }

  // Líneas de Investigación (incluye sugerencia rápida "Líneas de investigación")
  if (
    q.includes('linea') ||
    q.includes('investigacion') ||
    q.includes('suelo') ||
    q.includes('fermentac') ||
    q.includes('microbiolog') ||
    q.includes('fitosanidad') ||
    q.includes('broca') ||
    q.includes('roya')
  ) {
    activeMenu = MENU_IDS.LINEAS;
    return renderLineasMenu();
  }

  // Quiénes somos / Misión / Visión / Equipo
  if (
    q.includes('quienes son') ||
    q.includes('quienes somos') ||
    q.includes('que es cesurcafe') ||
    q.includes('mision') ||
    q.includes('vision') ||
    q.includes('nosotros') ||
    q.includes('investigador') ||
    q.includes('equipo')
  ) {
    activeMenu = MENU_IDS.NOSOTROS;
    return renderNosotrosMenu();
  }

  // Contacto / Ubicación (incluye sugerencia rápida "Ubicación USCO")
  if (
    q.includes('ubicacion') ||
    q.includes('donde') ||
    q.includes('sede') ||
    q.includes('usco') ||
    q.includes('contacto') ||
    q.includes('correo') ||
    q.includes('email') ||
    q.includes('neiva') ||
    q.includes('huila') ||
    q.includes('redes')
  ) {
    activeMenu = MENU_IDS.CONTACTO;
    return (
      `📍 **CESURCAFÉ — ${CONTACT_INFO.institution} (USCO)**\n` +
      `• **Ubicación:** ${CONTACT_INFO.location}, Colombia\n` +
      `• **Correo institucional:** ${CONTACT_INFO.email}\n\n` +
      renderContactoMenu()
    );
  }

  // Fuera del alcance o no identificado: presenta el Menú Principal de 6 opciones
  activeMenu = MENU_IDS.MAIN;
  return (
    `Como asistente virtual de **CESURCAFÉ**, únicamente puedo orientarte sobre temas de nuestro centro de investigación, café y proyectos agroindustriales del Huila.\n\n` +
    renderMainMenu('Te invito a consultar nuestro **Menú Principal**:')
  );
}

function isUsableApiKey(apiKey) {
  if (!apiKey || apiKey.length < 20) return false;
  const lower = apiKey.toLowerCase();
  if (
    lower.includes('tu_api_key') ||
    lower.includes('your_api_key') ||
    lower.includes('api_key_aqui') ||
    lower.includes('reemplaza') ||
    lower.startsWith('<')
  ) {
    return false;
  }
  return true;
}

function isAuthOrKeyError(err) {
  const status = err?.status ?? err?.httpStatusCode;
  if (status === 400 || status === 401 || status === 403) return true;
  const msg = String(err?.message ?? err ?? '').toLowerCase();
  return (
    msg.includes('api_key_invalid') ||
    msg.includes('api key not valid') ||
    msg.includes('invalid api key') ||
    msg.includes('api key expired') ||
    msg.includes('permission_denied') ||
    msg.includes('unauthenticated')
  );
}

/**
 * Consulta los menús predeterminados por número o la API de Google Gemini con respaldo inmediato.
 */
export async function askGemini(prompt, history = []) {
  // Si es el primer turno del usuario en la conversación, asegura iniciar desde el Menú Principal
  if (!history.some((m) => m.role === 'user')) {
    activeMenu = MENU_IDS.MAIN;
  }

  // 1. Navegación directa por números (0 y 1–6 + submenús) sin depender de la API Key
  const menuCmd = parseMenuInput(prompt);
  if (menuCmd !== null) {
    await delay(220);
    return resolveMenuNavigation(menuCmd);
  }

  // 2. Si no hay API Key válida o falló previamente, responde al instante con el menú de respaldo
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY ?? '').trim();
  if (!isUsableApiKey(apiKey) || apiKeyDisabledForSession || Date.now() < apiCooldownUntil) {
    await delay(300);
    return getFallbackResponse(prompt);
  }

  // Garantiza que el historial comience con 'user' y alterne roles ('user' / 'model')
  const formattedHistory = [];
  for (const msg of history) {
    const role = msg.role === 'user' ? 'user' : 'model';
    if (formattedHistory.length === 0 && role !== 'user') continue;
    const prev = formattedHistory[formattedHistory.length - 1];
    if (prev && prev.role === role) {
      prev.parts[0].text += `\n${msg.text}`;
    } else {
      formattedHistory.push({ role, parts: [{ text: msg.text }] });
    }
  }

  const modelsToTry = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-3-flash-preview',
    'gemini-3.1-flash-lite-preview',
  ];

  for (const modelName of modelsToTry) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      const chat = model.startChat({
        history: formattedHistory,
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();
      if (text && text.trim().length > 0) {
        activeMenu = MENU_IDS.MAIN;
        return text;
      }
    } catch (err) {
      console.warn(`Intento con modelo ${modelName} falló:`, err);
      if (isAuthOrKeyError(err)) {
        apiKeyDisabledForSession = true;
        break;
      }
    }
  }

  if (!apiKeyDisabledForSession) {
    apiCooldownUntil = Date.now() + 60_000;
  }

  return getFallbackResponse(prompt);
}