// Utilidades sobre el catálogo estático `publications.json`.
import rawPublications from './publications.json';

export const PUBLICATIONS = rawPublications;

/** Etiqueta visible del tipo (en la portada se usa el singular "Investigación"). */
export function typeLabel(type) {
  return type === 'Investigaciones' ? 'Investigación' : type;
}

/** "EDUCACIÓN RURAL" → "educacion-rural" (para clases CSS de tono). */
export function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');
}

/** Normaliza texto para búsquedas sin tildes ni mayúsculas. */
export function normalizeText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
