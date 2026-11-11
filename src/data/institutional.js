// Catálogo estático de datos institucionales, navegación, proyectos y publicaciones.
import publicationsJson from './publications.json';
import publicationTranslations from './publication-translations.json';
import rawResearchers from './researchers.json';
import orcidData from './orcid-profiles.json';

// Publicaciones con su título traducido al español (si existe en publication-translations.json).
const rawPublications = publicationsJson.map((p) => ({
  ...p,
  titleEs: publicationTranslations.titles?.[p.id] ?? null,
}));

// ---------------------------------------------------------------------------
// Navegación y Redes Sociales
// ---------------------------------------------------------------------------
export const NAV_ITEMS = [
  { label: 'Inicio', path: '/' },
  { label: 'Nosotros', path: '/nosotros' },
  { label: 'Servicios', path: '/servicios' },
  { label: 'Repositorio', path: '/repositorio' },
  { label: 'Contacto', path: '/contacto' },
];

export const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'Facebook', href: 'https://www.facebook.com/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
];

// ---------------------------------------------------------------------------
// Inicio: Proyectos destacados y Propósito institucional
// ---------------------------------------------------------------------------
// Proyectos destacados del carrusel de Inicio: cada uno se basa en una publicación real
// del repositorio (afiliada a CESURCAFÉ). Las imágenes vienen de Wikimedia Commons con
// licencia libre; el crédito y la licencia se muestran junto a la imagen.
const PROJECT_DEFINITIONS = [
  {
    id: 'monitoreo-humedad-ftnir',
    title: 'Monitoreo de humedad del café con espectroscopía FT-NIR',
    description:
      'Espectros de infrarrojo cercano tomados al café pergamino durante el secado para calibrar modelos que predicen su humedad de forma rápida y no destructiva.',
    publicationId: 'oa-W4408039516',
    image: {
      src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/NP_colombia_coffee_drying_%285867167147%29.jpg/1280px-NP_colombia_coffee_drying_%285867167147%29.jpg',
      alt: 'Caficultor secando café al sol en el Cauca, Colombia',
      credit: 'Neil Palmer (CIAT)',
      license: 'CC BY-SA 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:NP_colombia_coffee_drying_(5867167147).jpg',
    },
  },
  {
    id: 'fermentacion-bal-levaduras',
    title: 'Fermentación con bacterias lácticas y levaduras',
    description:
      'Inoculación de bacterias ácido lácticas y levaduras durante la fermentación para evaluar su efecto en la calidad sensorial del café arábica.',
    publicationId: 'oa-W4415886225',
    image: {
      src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1c/Pulped_coffee_berries.JPG/1280px-Pulped_coffee_berries.JPG',
      alt: 'Granos de café recién despulpados, listos para fermentar',
      credit: 'Erinamukuta',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Pulped_coffee_berries.JPG',
    },
  },
  {
    id: 'valorizacion-pulpa',
    title: 'Valorización de la pulpa de café',
    description:
      'Aprovechamiento de la pulpa, un subproducto del beneficio, en bebidas de cápsulas compostables, evaluando el perfil de tostión y el grado de molienda.',
    publicationId: 'oa-W7167057776',
    image: {
      src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Coffee_Processing_%E2%80%93_Discarded_pulp.jpg/1280px-Coffee_Processing_%E2%80%93_Discarded_pulp.jpg',
      alt: 'Pulpa de café separada del grano durante el despulpado',
      credit: 'Ludger001',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Coffee_Processing_%E2%80%93_Discarded_pulp.jpg',
    },
  },
];

export const FEATURED_PROJECTS = PROJECT_DEFINITIONS.map((p) => {
  const publication = rawPublications.find((pub) => pub.id === p.publicationId) ?? null;
  const researchers = (publication?.researcherIds ?? [])
    .map((id) => rawResearchers.find((r) => r.id === id)?.name)
    .filter(Boolean);
  return { ...p, publication, researchers };
});


export const PURPOSE_CARDS = [
  {
    eyebrow: 'Nuestro propósito',
    title: 'Misión',
    text: 'Impulsar el desarrollo tecnológico y la innovación agroindustrial en la cadena productiva del café.',
    detail:
      'Articulamos investigación científica, análisis sensorial y extensión rural desde la Universidad Surcolombiana para fortalecer a las familias caficultoras del Huila.',
    pillars: ['Ciencia aplicada', 'Transferencia regional'],
    icon: 'target',
  },
  {
    eyebrow: 'Futuro',
    title: 'Visión',
    text: 'Ser el centro de referencia científica y tecnológica en café de alta calidad a nivel internacional.',
    detail:
      'Proyectamos a la región Surcolombiana como referente en cafés especiales sostenibles, integrando biotecnología, agricultura de precisión y formación de talento.',
    pillars: ['Proyección global', 'Sostenibilidad'],
    icon: 'compass',
  },
  {
    eyebrow: 'Logros',
    title: 'Reconocimientos',
    text: 'Certificaciones de calidad y premios por transferencia de tecnología regional.',
    detail:
      'Respaldados por el impacto directo en asociaciones de productores, protocolos de fermentación diferenciados y producción científica de acceso abierto.',
    pillars: ['Calidad SCA', 'Impacto comunitario'],
    icon: 'award',
  },
];

// ---------------------------------------------------------------------------
// Servicios y Testimonios
// ---------------------------------------------------------------------------
// Las fotos de cada servicio se cargan solas desde src/assets/servicios/<id>/ (ver LEEME.txt).
// Opcional: imageAlts: { '01-foto.jpg': 'Descripción exacta de la foto' }
export const SERVICES = [
  {
    id: 'laboratorio-calidad',
    shortName: 'Laboratorio de calidad',
    tag: 'Análisis cafetero',
    title: 'Laboratorio de Calidad y Sensorial',
    description:
      'Evaluamos la calidad física y sensorial del café mediante análisis de granulometría, humedad, defectos y catación bajo protocolos SCA, para que cada productor conozca y valorice el perfil de su taza.',
    highlights: [
      'Análisis físico de café verde y pergamino',
      'Catación y perfil de taza (protocolo SCA)',
      'Informes técnicos para comercialización',
    ],
    icon: 'lab',
    tone: 'tone-sensorial',
  },
  {
    id: 'procesos-fermentacion',
    shortName: 'Procesos de fermentación',
    tag: 'Innovación poscosecha',
    title: 'Optimización de Procesos de Fermentación',
    description:
      'Diseñamos y validamos protocolos de fermentación controlada -monitoreando pH, temperatura y grados Brix- que reducen defectos y resaltan notas diferenciadoras en cafés especiales.',
    highlights: [
      'Monitoreo de variables de fermentación',
      'Selección de microorganismos benéficos',
      'Acompañamiento en finca y beneficiadero',
    ],
    icon: 'fermentation',
    tone: 'tone-poscosecha',
  },
  {
    id: 'formacion-cafetera',
    shortName: 'Formación cafetera',
    tag: 'Transferencia tecnológica',
    title: 'Capacitación y Extensión Cafetera',
    description:
      'Llevamos el conocimiento científico al territorio con talleres, cartillas rurales y programas de extensión dirigidos a caficultores, asociaciones y jóvenes rurales del Huila.',
    highlights: [
      'Talleres prácticos en buenas prácticas agrícolas',
      'Cartillas rurales y material didáctico',
      'Programas para asociaciones y jóvenes',
    ],
    icon: 'training',
    tone: 'tone-educacion-rural',
  },
];

export const TESTIMONIALS = [
  {
    id: 't1',
    category: 'Perfil de taza',
    quote:
      'Gracias a las pruebas de perfil de taza pudimos identificar las notas florales de nuestro café y exportar a Europa con un precio diferenciado.',
    author: 'María Consuelo Polanía',
    role: 'Caficultora de San Agustín',
  },
  {
    id: 't2',
    category: 'Fermentación',
    quote:
      'El acompañamiento en fermentación controlada nos permitió estandarizar la calidad de todos los asociados y reducir los defectos en taza.',
    author: 'Ing. Jorge Trujillo',
    role: 'Asociación de Cafés Especiales',
  },
  {
    id: 't3',
    category: 'Formación',
    quote:
      'Las cartillas y talleres nos enseñaron a llevar registros de la finca. Hoy tomamos decisiones con datos y no solo con intuición.',
    author: 'Andrés Felipe Cuéllar',
    role: 'Joven caficultor de Pitalito',
  },
  {
    id: 't4',
    category: 'Monitoreo',
    quote:
      'Los sensores de campo nos alertaron a tiempo sobre condiciones favorables para la roya. Salvamos gran parte de la cosecha.',
    author: 'Luz Marina Perdomo',
    role: 'Productora de La Plata',
  },
];

// ---------------------------------------------------------------------------
// Nosotros
// ---------------------------------------------------------------------------

export const WHO_WE_ARE_PANELS = [
  {
    title: 'Laboratorio de Análisis Sensorial',
    caption: 'Evaluación de las características sensoriales y calidad del café.',
    image: '/images/lab-analisis-sensorial.jpg',
  },
  {
    title: 'Laboratorio de Microbiología de Alimentos',
    caption: 'Espacio dedicado al estudio y análisis microbiológico de alimentos.',
    tone: 'tone-microbiologia',
    image: '/images/lab-microbiologia-alimentos.webp',
  },
  {
    title: 'Planta Piloto',
    caption: 'Espacio para el desarrollo y evaluación de procesos tecnológicos.',
    tone: 'tone-poscosecha',
    image: '/images/planta-piloto.webp',
  },
  {
    title: 'Laboratorio de Análisis de Alimentos',
    caption: 'Análisis y evaluación de las propiedades de los alimentos.',
    image: '/images/lab-analisis-alimentos.webp',
  },
];

export const TIMELINE_MILESTONES = [
  {
    id: 1,
    year: '2010',
    title: 'Los primeros pasos',
    text: 'Inicio del proceso de consolidación institucional de CESURCAFÉ.',
  },
  {
    id: 2,
    year: '2012',
    title: 'Creación oficial de CESURCAFÉ',
    text: 'El Acuerdo 029 del 31 de julio de 2012 aprueba la creación del centro.',
  },
  {
    id: 3,
    year: '2022',
    title: 'Fortalecimiento de infraestructura científica',
    text: 'Proyecto de adecuación y equipamiento para fortalecer las actividades de ciencia, tecnología e innovación.',
  },
  {
    id: 4,
    year: '2024',
    title: 'Reconocimiento de Minciencias',
    text: 'CESURCAFÉ obtiene el reconocimiento como centro de investigación por tres años.',
  },
];

// Los datos base (nombre, cargo, foto, ORCID) viven en researchers.json; el perfil ORCID (afiliación,
// biografía y trabajos) se genera con `npm run sync:orcid` en orcid-profiles.json.
const titleKey = (t) =>
  normalizeText(String(t ?? ''))
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
const doiKey = (d) =>
  String(d ?? '')
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
    .toLowerCase();

const REPO_BY_DOI = new Map(rawPublications.filter((p) => p.doi).map((p) => [doiKey(p.doi), p]));
const REPO_BY_TITLE = new Map(rawPublications.map((p) => [titleKey(p.title), p]));

/** Enlaza un trabajo de ORCID con la publicación equivalente del repositorio (por DOI o título). */
function matchRepository(work) {
  return (work.doi && REPO_BY_DOI.get(doiKey(work.doi))) || REPO_BY_TITLE.get(titleKey(work.title)) || null;
}

export const ORCID_SYNCED_AT = orcidData.generatedAt ?? null;

export const RESEARCHERS = rawResearchers.map((r) => {
  const orcid = String(r.orcid ?? '').trim().toUpperCase();
  const profile = orcid ? (orcidData.profiles?.[orcid] ?? null) : null;
  const repoPublications = rawPublications.filter((p) => p.researcherIds?.includes(r.id));
  return {
    ...r,
    orcid: orcid || null,
    profile: profile
      ? {
          ...profile,
          works: (profile.works ?? []).map((w) => {
            const repo = matchRepository(w);
            return { ...w, repoId: repo?.id ?? null, repoTitle: repo?.title ?? null, titleEs: repo?.titleEs ?? null };
          }),
        }
      : null,
    repoPublications,
  };
});

// ---------------------------------------------------------------------------
// Contacto y Líneas de investigación
// ---------------------------------------------------------------------------
export const CONTACT_INFO = {
  email: 'cesurcafe@usco.edu.co',
  location: 'Neiva, Huila',
  institution: 'Universidad Surcolombiana',
};

export const RESEARCH_LINES = [
  'Calidad física y sensorial del café',
  'Microbiología y fermentación controlada',
  'Suelos, nutrición y fitosanidad del cultivo',
  'Agricultura de precisión y monitoreo con sensores',
  'Educación rural y transferencia tecnológica',
];

// ---------------------------------------------------------------------------
// Publicaciones y utilidades de texto
// ---------------------------------------------------------------------------
export const PUBLICATIONS = rawPublications;

/** Tipos de publicación presentes en el repositorio, en orden fijo. */
export const PUBLICATION_TYPES = ['Artículos', 'Datos', 'Libros', 'Ponencias', 'Preprints'].filter((t) =>
  rawPublications.some((p) => p.type === t),
);

/** Título para mostrar: la traducción al español si existe; si no, el original. */
export function displayTitle(p) {
  return p.titleEs ?? p.title;
}

/** Enlace principal de una publicación: su DOI o, si no tiene, la página del editor. */
export function publicationUrl(p) {
  return p.doi ? `https://doi.org/${p.doi}` : (p.landingUrl ?? null);
}

/** Línea de contexto de la tarjeta: revista y licencia. */
export function publicationSummary(p) {
  return [p.journal && `Publicado en ${p.journal}`, p.license && `Licencia ${p.license}`]
    .filter(Boolean)
    .join(' · ');
}

export function typeLabel(type) {
  return type === 'Investigaciones' ? 'Investigación' : type;
}

export function normalizeText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function slugify(value) {
  return normalizeText(value).trim().replace(/\s+/g, '-');
}
