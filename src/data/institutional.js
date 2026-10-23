// Catálogo estático de datos institucionales, navegación, proyectos y publicaciones.
import rawPublications from './publications.json';

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
export const FEATURED_PROJECTS = [
  {
    id: 'monitoreo-agricola',
    title: 'Sistema de monitoreo agrícola',
    description: 'Sensores de campo aplicados al seguimiento de cultivos en la región.',
  },
  {
    id: 'fermentacion-controlada',
    title: 'Fermentación controlada de cafés especiales',
    description: 'Protocolos de fermentación que potencian el perfil sensorial del café huilense.',
  },
  {
    id: 'cartillas-rurales',
    title: 'Cartillas rurales digitales',
    description: 'Material formativo accesible para las familias caficultoras del sur del Huila.',
  },
];

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
  { title: 'Investigación', caption: 'Ciencia aplicada a la cadena del café', tone: 'tone-microbiologia' },
  { title: 'Laboratorio', caption: 'Calidad física y sensorial', tone: 'tone-sensorial' },
  { title: 'Territorio', caption: 'Fincas y montañas del Huila', tone: 'tone-fitosanidad' },
  { title: 'Comunidad', caption: 'Caficultores y jóvenes rurales', tone: 'tone-educacion-rural' },
];

export const TIMELINE_MILESTONES = [
  { id: 1, year: '', title: '', text: '' },
  { id: 2, year: '', title: '', text: '' },
  { id: 3, year: '', title: '', text: '' },
  { id: 4, year: '', title: '', text: '' },
];

export const RESEARCHERS = [
  { id: 'laura-sofia', name: 'Dra. Laura Sofía', role: 'Líder de Sostenibilidad', initials: 'LS' },
  { id: 'juan-david', name: 'MSc. Juan David', role: 'Investigador de Poscosecha', initials: 'JD' },
  { id: 'valentina-ruiz', name: 'Biól. Valentina Ruiz', role: 'Analista de Microbiología', initials: 'VR' },
];

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
