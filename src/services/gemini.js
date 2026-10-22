import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  CONTACT_INFO,
  PUBLICATIONS,
  PURPOSE_CARDS,
  RESEARCH_LINES,
  SERVICES,
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
 * Respuestas precalculadas de respaldo si la API externa no está disponible o falla temporalmente.
 */
function getFallbackResponse(prompt) {
  const query = prompt.toLowerCase().trim();

  // Opción 1 o Servicios
  if (
    query === '1' ||
    query.includes('servicio') ||
    query.includes('servicios') ||
    query.includes('laboratorio') ||
    query.includes('catación') ||
    query.includes('catacion') ||
    query.includes('análisis') ||
    query.includes('analisis')
  ) {
    return (
      `En **CESURCAFÉ** brindamos tres servicios principales de investigación y transferencia para el sector cafetero:\n\n` +
      `1. **${SERVICES[0].title}:** Evaluamos la calidad física y sensorial del café bajo protocolos SCA (granulometría, humedad, defectos y perfil de taza).\n\n` +
      `2. **${SERVICES[1].title}:** Protocolos de fermentación controlada monitoreando pH, temperatura y grados Brix para resaltar notas diferenciadoras.\n\n` +
      `3. **${SERVICES[2].title}:** Talleres de buenas prácticas, cartillas rurales y extensión para caficultores y asociaciones del Huila.\n\n` +
      `¿Deseas solicitar información sobre alguno de estos servicios? Puedes visitar nuestra pestaña **Servicios** o escribirnos a **${CONTACT_INFO.email}**.`
    );
  }

  // Opción 2 o Líneas de Investigación
  if (
    query === '2' ||
    query.includes('línea') ||
    query.includes('linea') ||
    query.includes('investigación') ||
    query.includes('investigacion') ||
    query.includes('suelo') ||
    query.includes('fermentaci') ||
    query.includes('microbiolog')
  ) {
    return (
      `En **CESURCAFÉ** desarrollamos investigación aplicada en las siguientes líneas principales:\n\n` +
      RESEARCH_LINES.map((line, idx) => `${idx + 1}. **${line}**`).join('\n') +
      `\n\n¿Deseas conocer más detalles sobre alguna de ellas?`
    );
  }

  // Opción 3 o Repositorio / Publicaciones
  if (
    query === '3' ||
    query.includes('repositorio') ||
    query.includes('publicaci') ||
    query.includes('artículo') ||
    query.includes('articulo') ||
    query.includes('libro') ||
    query.includes('cartilla')
  ) {
    return (
      `Contamos con publicaciones científicas, libros y cartillas rurales en nuestro repositorio, incluyendo estudios de caracterización de suelos, manejo integrado de broca y dinámica de fermentación.\n\n` +
      `Te invitamos a visitar la pestaña **Repositorio** para consultar, buscar y filtrar todos los documentos.`
    );
  }

  // Opción 4 o Contacto / Ubicación
  if (
    query === '4' ||
    query.includes('ubicación') ||
    query.includes('ubicacion') ||
    query.includes('donde') ||
    query.includes('dónde') ||
    query.includes('sede') ||
    query.includes('usco') ||
    query.includes('contacto') ||
    query.includes('correo') ||
    query.includes('email')
  ) {
    return `CESURCAFÉ está ubicado en la sede principal de la **Universidad Surcolombiana (USCO)** en **${CONTACT_INFO.location}**, Colombia. Puedes contactarnos directamente en **${CONTACT_INFO.email}**.`;
  }

  // Proyectos destacados
  if (query.includes('proyecto') || query.includes('monitoreo') || query.includes('sensor')) {
    return `Nuestros proyectos actuales abarcan el **Sistema de Monitoreo Agrícola con sensores en campo**, protocolos de **Fermentación Controlada** con levaduras nativas y la producción de **Cartillas Rurales Digitales** para familias caficultoras del Huila. Puedes ver el catálogo completo en la sección Repositorio.`;
  }

  // Si pregunta algo fuera del alcance o solicita el menú
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
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return getFallbackResponse(prompt);
  }

  // Prepara el historial cumpliendo estrictamente las reglas de Gemini:
  // 1. Debe comenzar con un turno de rol 'user' (descarta el saludo inicial del bot).
  const firstUserIdx = history.findIndex((m) => m.role === 'user');
  const validHistory = firstUserIdx >= 0 ? history.slice(firstUserIdx) : [];

  const formattedHistory = validHistory.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));

  const modelsToTry = ['gemini-flash-lite-latest', 'gemini-3.5-flash'];

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
