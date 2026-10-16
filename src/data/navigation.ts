// Datos estáticos de navegación (sin base de datos — ver AGENTS.md §2).

export interface NavItem {
  label: string;
  path: string;
}

export interface SocialLink {
  label: 'Instagram' | 'Facebook' | 'LinkedIn';
  href: string;
}

/** Las 5 secciones estrictas del Navbar (AGENTS.md §4.1). */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', path: '/' },
  { label: 'Nosotros', path: '/nosotros' },
  { label: 'Servicios', path: '/servicios' },
  { label: 'Repositorio', path: '/repositorio' },
  { label: 'Contacto', path: '/contacto' },
];

/** Enlaces del bloque "SÍGUENOS" del Footer (AGENTS.md §4.3). */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'Facebook', href: 'https://www.facebook.com/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
];
