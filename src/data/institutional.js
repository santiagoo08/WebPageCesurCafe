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
  {
    title: 'Laboratorio de Análisis Sensorial',
    caption: 'Evaluación de las características sensoriales y calidad del café.',
    image: '/images/lab-analisis-sensorial.jpg',
  },
  {
    title: 'Laboratorio de Microbiología de Alimentos',
    caption: 'Espacio dedicado al estudio y análisis microbiológico de alimentos.',
    tone: 'tone-microbiologia',
    image: '/images/lab-microbiologia-alimentos.png',
  },
  {
    title: 'Planta Piloto',
    caption: 'Espacio para el desarrollo y evaluación de procesos tecnológicos.',
    tone: 'tone-poscosecha',
    image: '/images/planta-piloto.png',
  },
  {
    title: 'Laboratorio de Análisis de Alimentos',
    caption: 'Análisis y evaluación de las propiedades de los alimentos.',
    image: '/images/lab-analisis-alimentos.png',
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

export const RESEARCHERS = [
  {
    id: 'juan-soto',
    name: 'Juan Eduardo Soto Mora',
    profession: 'Ingeniero Agrícola',
    academicDegree: 'Posgradop', // Especialización, maestría o doctorado
    role: 'Investigador del centro',
    researchArea: 'Ciencia de los alimentos', // Línea de investigación
    image: '/images/juan-soto.jpg',
    initials: 'JS',
  },
  {
    id: 'Pilar-cortez',
    name: 'Maria del Pilar Cortez Gaona',
    profession: 'Ingeniera Agrícola',
    academicDegree: 'Posgrado', // Especialización, maestría o doctorado
    role: 'coordinadora del centro',
    researchArea: 'Procesamiento de alimentos', // Línea de investigación
    image: '/images/pilar-Cortez.jpg',
    initials: 'PC',
  },
  {
    id: 'nelson-gutierrez',
    name: 'Nelson Gutiérrez Guzman',
    profession: 'Ingeniero Agrícola',
    academicDegree: 'Doctorado', // Especialización, maestría o doctorado
    role: 'Director del centro',
    researchArea: 'alternativas sostenibles', // Línea de investigación
    image: '/images/nelson-guitierrez.jpg',
    initials: 'NG',
  },
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
