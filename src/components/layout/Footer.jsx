import { NAV_ITEMS, SOCIAL_LINKS } from '../../data/navigation';
import { Link } from 'react-router';
import Logo from './Logo';
import './Footer.css';

function SocialIcon({ name }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  };

  switch (name) {
    case 'Instagram':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'Facebook':
      return (
        <svg {...common} fill="currentColor">
          <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.6V21h3z" />
        </svg>
      );
    case 'LinkedIn':
      return (
        <svg {...common} fill="currentColor">
          <path d="M6.9 8.8H3.8V20h3.1V8.8zM5.4 3.8a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM20.2 13.6c0-3-1.6-4.9-4.2-4.9-1.5 0-2.4.8-2.9 1.5V8.8H10V20h3.1v-5.9c0-1.5.6-2.6 2-2.6s1.9 1 1.9 2.6V20h3.1v-6.4z" />
        </svg>
      );
  }
}

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  const year = CURRENT_YEAR;

  return (
    <footer className="site-footer">
      <div className="grid-container">
        <div className="grid-x grid-margin-x grid-margin-y align-middle">
          {/* Izquierda: recuadro oscuro con logo institucional */}
          <div className="cell medium-6 large-5">
            <div className="site-footer__brand-box">
              <Logo variant="dark" />
              <p className="site-footer__tagline">
                Centro Surcolombiano de Investigación en Café — Universidad
                Surcolombiana (USCO), Neiva, Huila.
              </p>
            </div>
          </div>

          {/* Centro: accesos rápidos */}
          <div className="cell medium-6 large-3 large-offset-1">
            <span className="eyebrow">Explorar</span>
            <ul className="site-footer__nav">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link to={item.path}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Derecha: SÍGUENOS */}
          <div className="cell medium-12 large-3">
            <span className="eyebrow">Síguenos</span>
            <ul className="site-footer__social">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`CESURCAFÉ en ${social.label}`}
                  >
                    <span className="site-footer__social-icon">
                      <SocialIcon name={social.label} />
                    </span>
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <small>© {year} CESURCAFÉ · Universidad Surcolombiana</small>
          <small>Neiva, Huila — Colombia</small>
        </div>
      </div>
    </footer>
  );
}
