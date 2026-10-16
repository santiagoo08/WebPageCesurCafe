// Tipado y utilidades sobre el catálogo estático `publications.json`.
import rawPublications from './publications.json';

export type PublicationType = 'Artículos' | 'Libros' | 'Cartillas Rurales' | 'Investigaciones';
export type PublicationArea =
  | 'MICROBIOLOGÍA'
  | 'FITOSANIDAD'
  | 'SUELOS'
  | 'AGRICULTURA'
  | 'EDUCACIÓN RURAL';

export interface Publication {
  id: string;
  title: string;
  summary: string;
  area: PublicationArea;
  type: PublicationType;
  status: 'Finalizado' | 'Activo';
  year: number;
  author: string;
}

export const PUBLICATIONS = rawPublications as Publication[];

/** Etiqueta visible del tipo (en la portada se usa el singular "Investigación"). */
export function typeLabel(type: PublicationType): string {
  return type === 'Investigaciones' ? 'Investigación' : type;
}

/** "EDUCACIÓN RURAL" → "educacion-rural" (para clases CSS de tono). */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');
}

/** Normaliza texto para búsquedas sin tildes ni mayúsculas. */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
