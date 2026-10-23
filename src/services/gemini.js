import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  CONTACT_INFO,
  PUBLICATIONS,
  PURPOSE_CARDS,
  RESEARCHERS,
  RESEARCH_LINES,
  SERVICES,
   normalizeText,
} from '../data/institutional';

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
- Publicaciones destacadas en repositorio:
${PUBLICATIONS.slice(0, 6).map((pub) => `  * "${pub.title}" (${pub.type}, ${pub.year}) - ${pub.author}`).join('\n')}

REGLA FUNDAMENTAL DE ALCANCE Y RETORNO AL MENÚ PRINCIPAL:
1. Tu conocimiento y campo de acción se limitan EXCLUSIVAMENTE a CESURCAFÉ, la caficultura, la investigación agronómica, la fermentación, calidad de taza y proyectos del centro.
2. Si el usuario te pregunta sobre CUALQUIER tema ajeno a este ámbito (por ejemplo: política, deportes, fútbol, recetas ajenas al café, matemáticas generales, tareas escolares de otras materias, programación externa, celebridades, chistes o temas no relacionados):
   - NO respondas la pregunta externa.
   - Indica amablemente que como asistente oficial de CESURCAFÉ tu función se enfoca únicamente en el café y la investigación del centro.
   - Devuelve SIEMPRE al usuario al **Menú Principal**, presentándolo con esta estructura:

   "Como asistente virtual de **CESURCAFÉ**, únicamente puedo orientarte sobre temas de nuestro centro de investigación, café y proyectos agroindustriales del Huila.

   Te invito a consultar nuestro **Menú Principal**:
   1. 🔬 **Servicios:** Laboratorio sensorial y de calidad, Fermentación controlada y Capacitación cafetera.
   2. 🌾 **Líneas de Investigación:** Suelos, fitosanidad, microbiología y agricultura de precisión con sensores.
   3. 📚 **Repositorio:** Artículos científicos, libros y cartillas rurales digitales.
   4. 📍 **Contacto & Ubicación:** Sede USCO en Neiva, Huila y correo electrónico institucional.

   ¿Sobre cuál de estos temas deseas información?"
3. Si el usuario escribe "menú", "menu" o elige una opción por su número (1, 2, 3, 4), muéstrale con gusto el detalle correspondiente a esa opción.
4. Respuestas en español, claras, rigurosas y amables.
`.trim();

/**
 * Respuestas contextuales de respaldo si la API externa no está configurada o falla.
 */
function getFallbackResponse(prompt) {
  const q = normalizeText(String(prompt ?? '')).trim();

  // Saludos y bienvenida
  if (
    /^(hola|buenas|buenos dias|buenas tardes|buenas noches|hey|saludos|que tal|ayuda|menu|menú)$/i.test(
      q,
    )
  ) {
    return (
      `¡Hola! Bienvenido a **CESURCAFÉ** (Centro Surcolombiano de Investigación en Café – USCO).\n\n` +
      `Puedes consultarme sobre cualquiera de estos temas:\n` +
      `1. 🔬 **Servicios:** Laboratorio de calidad y sensorial, fermentación controlada y formación cafetera.\n` +
      `2. 🌾 **Líneas de investigación:** Suelos, microbiología, fitosanidad y agricultura de precisión.\n` +
      `3. 📚 **Repositorio y publicaciones:** Artículos, libros y cartillas rurales.\n` +
      `4. 📍 **Contacto, equipo y ubicación:** Sede USCO en Neiva, Huila.\n\n` +
      `Escribe el número (1–4) o tu pregunta sobre café e investigación.`
    );
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
    const team = RESEARCHERS.map((r) => `• **${r.name}** (${r.role})`).join('\n');
    return (
      `**CESURCAFÉ** es el Centro Surcolombiano de Investigación en Café de la **Universidad Surcolombiana (USCO)** en Neiva, Huila.\n\n` +
      `• **Misión:** ${PURPOSE_CARDS[0].text}\n` +
      `• **Visión:** ${PURPOSE_CARDS[1].text}\n\n` +
      `**Equipo investigador destacado:**\n${team}`
    );
  }

  // Opción 1 o Servicios
  if (
    q === '1' ||
    q.includes('servicio') ||
    q.includes('laboratorio') ||
    q.includes('catacion') ||
    q.includes('perfil de taza') ||
    q.includes('analisis') ||
    q.includes('capacitacion') ||
    q.includes('formacion')
  ) {
    return (
      `En **CESURCAFÉ** brindamos tres servicios principales de investigación y transferencia para el sector cafetero:\n\n` +
      `1. **${SERVICES[0].title}:** ${SERVICES[0].description}\n\n` +
      `2. **${SERVICES[1].title}:** ${SERVICES[1].description}\n\n` +
      `3. **${SERVICES[2].title}:** ${SERVICES[2].description}\n\n` +
      `Puedes solicitarlos desde la sección **Servicios** o escribiendo a **${CONTACT_INFO.email}**.`
    );
  }

  // Opción 2 o Líneas de Investigación / Café / Cultivo
  if (
    q === '2' ||
    q.includes('linea') ||
    q.includes('investigacion') ||
    q.includes('suelo') ||
    q.includes('fermentac') ||
    q.includes('microbiolog') ||
    q.includes('fitosanidad') ||
    q.includes('broca') ||
    q.includes('roya')
  ) {
    return (
      `En **CESURCAFÉ** desarrollamos investigación aplicada en las siguientes líneas principales:\n\n` +
      RESEARCH_LINES.map((line, idx) => `${idx + 1}. **${line}**`).join('\n') +
      `\n\n¿Deseas conocer más detalles sobre alguna de ellas o consultar las publicaciones asociadas?`
    );
  }

  // Opción 3 o Repositorio / Publicaciones
  if (
    q === '3' ||
    q.includes('repositorio') ||
    q.includes('publicac') ||
    q.includes('articulo') ||
    q.includes('libro') ||
    q.includes('cartilla') ||
    q.includes('documento')
  ) {
    const sample = PUBLICATIONS.slice(0, 3)
      .map((p) => `• **${p.title}** (${p.type}, ${p.year}) — ${p.author}`)
      .join('\n');
    return (
      `Contamos con **${PUBLICATIONS.length} publicaciones** entre artículos científicos, libros, investigaciones y cartillas rurales:\n\n` +
      `${sample}\n\n` +
      `Puedes explorar y filtrar todo el catálogo en la pestaña **Repositorio**.`
    );
  }

  // Opción 4 o Contacto / Ubicación
  if (
    q === '4' ||
    q.includes('ubicacion') ||
    q.includes('donde') ||
    q.includes('sede') ||
    q.includes('usco') ||
    q.includes('contacto') ||
    q.includes('correo') ||
    q.includes('email') ||
    q.includes('neiva') ||
    q.includes('huila')
  ) {
    return (
      `**CESURCAFÉ** está ubicado en la sede principal de la **${CONTACT_INFO.institution} (USCO)** en **${CONTACT_INFO.location}**, Colombia.\n\n` +
      `• **Correo institucional:** ${CONTACT_INFO.email}`
    );
  }

  // Proyectos destacados / Café
  if (
    q.includes('proyecto') ||
    q.includes('monitoreo') ||
    q.includes('sensor') ||
    q.includes('cafe')
  ) {
    return (
      `Nuestros proyectos destacados incluyen:\n\n` +
      `1. **Sistema de monitoreo agrícola:** Sensores de campo aplicados al seguimiento de cultivos en el Huila.\n` +
      `2. **Fermentación controlada de cafés especiales:** Protocolos con microorganismos que potencian el perfil en taza.\n` +
      `3. **Cartillas rurales digitales:** Material formativo de acceso abierto para familias caficultoras.`
    );
  }

  // Si pregunta algo fuera del alcance
  return (
    `Como asistente virtual de **CESURCAFÉ**, únicamente puedo orientarte sobre temas de nuestro centro de investigación, café y proyectos agroindustriales del Huila.\n\n` +
    `Te invito a consultar nuestro **Menú Principal**:\n` +
    `1. 🔬 **Servicios:** Laboratorio sensorial y de calidad, Fermentación controlada y Capacitación.\n` +
    `2. 🌾 **Líneas de Investigación:** Suelos, fitosanidad, microbiología y agricultura de precisión.\n` +
    `3. 📚 **Repositorio:** Artículos científicos, libros y cartillas rurales digitales.\n` +
    `4. 📍 **Contacto & Ubicación:** Sede USCO en Neiva, Huila y correo institucional.\n\n` +
    `¿Sobre cuál de estos temas deseas información? (Puedes escribir el número o el tema).`
  );
}

/**
 * Consulta la API de Google Gemini o responde con fallback contextual.
 */
export async function askGemini(prompt, history = []) {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY ?? '').trim();

  // Las claves válidas de Google AI Studio comienzan con "AIza"
  if (!apiKey || !apiKey.startsWith('AIza')) {
    await new Promise((resolve) => setTimeout(resolve, 450));
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

  const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

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
        return text;
      }
    } catch (err) {
      console.warn(`Intento con modelo ${modelName} falló:`, err);
    }
  }

  return getFallbackResponse(prompt);
}
