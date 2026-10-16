// Contenido institucional: propósito, servicios, equipo, testimonios y contacto.

export interface PurposeCard {
  eyebrow: string;
  title: string;
  text: string;
  icon: 'target' | 'compass' | 'award';
}

export const PURPOSE_CARDS: PurposeCard[] = [
  {
    eyebrow: 'Nuestro propósito',
    title: 'Misión',
    text: 'Impulsar el desarrollo tecnológico y la innovación agroindustrial en la cadena productiva del café.',
    icon: 'target',
  },
  {
    eyebrow: 'Futuro',
    title: 'Visión',
    text: 'Ser el centro de referencia científica y tecnológica en café de alta calidad a nivel internacional.',
    icon: 'compass',
  },
  {
    eyebrow: 'Logros',
    title: 'Reconocimientos',
    text: 'Certificaciones de calidad y premios por transferencia de tecnología regional.',
    icon: 'award',
  },
];

// ---------------------------------------------------------------------------
// Servicios (usados en el Maestro-Detalle de Inicio y en la vista Servicios)
// ---------------------------------------------------------------------------
export interface Service {
  id: string;
  /** Nombre corto para el menú de Inicio. */
  shortName: string;
  /** Etiqueta superior en la tarjeta apilable. */
  tag: string;
  /** Título completo en la vista Servicios. */
  title: string;
  description: string;
  highlights: string[];
  icon: 'lab' | 'fermentation' | 'training';
  tone: string;
  image?: string;
  video?: string;
}

export const SERVICES: Service[] = [
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
      'Diseñamos y validamos protocolos de fermentación controlada —monitoreando pH, temperatura y grados Brix— que reducen defectos y resaltan notas diferenciadoras en cafés especiales.',
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

// ---------------------------------------------------------------------------
// Nosotros
// ---------------------------------------------------------------------------
export interface AccordionPanel {
  title: string;
  caption: string;
  tone: string;
  image?: string;
  video?: string;
}

export const WHO_WE_ARE_PANELS: AccordionPanel[] = [
  { title: 'Investigación', caption: 'Ciencia aplicada a la cadena del café', tone: 'tone-microbiologia' },
  { title: 'Laboratorio', caption: 'Calidad física y sensorial', tone: 'tone-sensorial' },
  { title: 'Territorio', caption: 'Fincas y montañas del Huila', tone: 'tone-fitosanidad' },
  { title: 'Comunidad', caption: 'Caficultores y jóvenes rurales', tone: 'tone-educacion-rural' },
];

export interface TimelineMilestone {
  id: number;
  /** Textos vacíos intencionalmente (AGENTS.md §5 – Sección 2). */
  year: string;
  title: string;
  text: string;
}

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  { id: 1, year: '', title: '', text: '' },
  { id: 2, year: '', title: '', text: '' },
  { id: 3, year: '', title: '', text: '' },
  { id: 4, year: '', title: '', text: '' },
];

export interface Researcher {
  id: string;
  name: string;
  role: string;
  initials: string;
  photo?: string;
}

export const RESEARCHERS: Researcher[] = [
  { id: 'laura-sofia', name: 'Dra. Laura Sofía', role: 'Líder de Sostenibilidad', initials: 'LS' },
  { id: 'juan-david', name: 'MSc. Juan David', role: 'Investigador de Poscosecha', initials: 'JD' },
  { id: 'valentina-ruiz', name: 'Biól. Valentina Ruiz', role: 'Analista de Microbiología', initials: 'VR' },
];

// ---------------------------------------------------------------------------
// Servicios – Testimonios
// ---------------------------------------------------------------------------
export interface Testimonial {
  id: string;
  category: string;
  quote: string;
  author: string;
  role: string;
}

export const TESTIMONIALS: Testimonial[] = [
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
// Contacto
// ---------------------------------------------------------------------------
export const CONTACT_INFO = {
  email: 'cesurcafe@usco.edu.co',
  location: 'Neiva, Huila',
  institution: 'Universidad Surcolombiana',
} as const;

export const RESEARCH_LINES = [
  'Calidad física y sensorial del café',
  'Microbiología y fermentación controlada',
  'Suelos, nutrición y fitosanidad del cultivo',
  'Agricultura de precisión y monitoreo con sensores',
  'Educación rural y transferencia tecnológica',
];
