// Fotos de los servicios: se detectan automáticamente desde src/assets/servicios/<id-del-servicio>/.
// Basta con copiar las imágenes en la carpeta; Vite las optimiza y les asigna una URL al compilar.
const modules = import.meta.glob(
  '../assets/servicios/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true, import: 'default' },
);

const OPEN_SOURCE_IMAGES = {
  'laboratorio-calidad': [
    {
      src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Coffee_Cupping-1.jpg/1280px-Coffee_Cupping-1.jpg',
      alt: 'Catación de café en una mesa de evaluación sensorial',
      credit: 'Visitor7',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Coffee_Cupping-1.jpg',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    },
  ],
  'procesos-fermentacion': [
    {
      src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1c/Pulped_coffee_berries.JPG/1280px-Pulped_coffee_berries.JPG',
      alt: 'Granos de café recién despulpados, listos para fermentar',
      credit: 'Erinamukuta',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Pulped_coffee_berries.JPG',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    },
  ],
  'formacion-cafetera': [
    {
      src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/NP_colombia_coffee_drying_%285867167147%29.jpg/1280px-NP_colombia_coffee_drying_%285867167147%29.jpg',
      alt: 'Caficultor secando café al sol en el Cauca, Colombia',
      credit: 'Neil Palmer (CIAT)',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:NP_colombia_coffee_drying_(5867167147).jpg',
      license: 'CC BY-SA 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
    },
  ],
};

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
  const uploadedImages = byService[serviceId] ?? [];
  if (uploadedImages.length === 0) return OPEN_SOURCE_IMAGES[serviceId] ?? [];
  return uploadedImages.map((img) => ({ ...img, alt: alts[img.file] ?? img.alt }));
}
