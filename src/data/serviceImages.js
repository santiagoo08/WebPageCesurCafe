// Fotos de los servicios: se detectan automáticamente desde src/assets/servicios/<id-del-servicio>/.
// Basta con copiar las imágenes en la carpeta; Vite las optimiza y les asigna una URL al compilar.
const modules = import.meta.glob(
  '../assets/servicios/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true, import: 'default' },
);

/** "02-catacion-de-muestras.jpg" → "Catacion de muestras" */
function altFromFile(file) {
  const text = file
    .replace(/\.[^.]+$/, '')
    .replace(/^\d+[\s._-]*/, '')
    .replace(/[-_]+/g, ' ')
    .trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
}

const byService = {};
for (const [path, src] of Object.entries(modules)) {
  const match = path.match(/servicios\/([^/]+)\/([^/]+)$/);
  if (!match) continue;
  const [, serviceId, file] = match;
  (byService[serviceId] ??= []).push({ src, file, alt: altFromFile(file) });
}
for (const list of Object.values(byService)) {
  list.sort((a, b) => a.file.localeCompare(b.file, 'es', { numeric: true }));
}

/**
 * Imágenes de un servicio, ordenadas por nombre de archivo.
 * @param {string} serviceId  id del servicio (nombre de la carpeta)
 * @param {Record<string,string>} [alts]  descripciones por nombre de archivo (opcional)
 */
export function getServiceImages(serviceId, alts = {}) {
  return (byService[serviceId] ?? []).map((img) => ({ ...img, alt: alts[img.file] ?? img.alt }));
}
