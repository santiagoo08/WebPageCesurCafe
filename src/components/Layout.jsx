import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { NAV_ITEMS, SOCIAL_LINKS } from '../data/institutional';
import { ChatProvider } from '../context/ChatContext';
import CafeBotWidget from './CafeBotWidget';
import Icon from './Icon';

const CURRENT_YEAR = new Date().getFullYear();

/** Identidad CESURCAFÉ: grano de café + logotipo. */
function Logo({ variant = 'light', showSubtitle = true }) {
  return (
    <span className={`logo logo--${variant}`}>
      <svg className="logo__mark" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="var(--accent-primary)" />
        <ellipse
          cx="20"
          cy="20"
          rx="8.5"
          ry="12"
          transform="rotate(-28 20 20)"
          fill="var(--bg-dark)"
        />
        <path
          d="M23.2 9.6c-4.2 3.6-2.4 8.2-4.1 11.2-1.4 2.6-3.9 3.6-3.6 8.8"
          transform="rotate(-6 20 20)"
          fill="none"
          stroke="var(--accent-secondary)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <span className="logo__text">
        <span className="logo__name">CESURCAFÉ</span>
        {showSubtitle && <span className="logo__subtitle">Universidad Surcolombiana</span>}
      </span>
    </span>
  );
}

/** Barra de navegación superior fija. */
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`site-navbar${isScrolled ? ' is-scrolled' : ''}${isOpen ? ' is-menu-open' : ''}`}
    >
      <div className="grid-container">
        <nav
          className="grid-x align-middle align-justify site-navbar__inner"
          aria-label="Navegación principal"
        >
          <div className="cell shrink">
            <Link
              to="/"
              className="site-navbar__brand"
              aria-label="CESURCAFÉ - Inicio"
              onClick={closeMenu}
            >
              <Logo />
            </Link>
          </div>

          <div className="cell shrink hide-for-large">
            <button
              type="button"
              className={`site-navbar__toggle${isOpen ? ' is-open' : ''}`}
              aria-expanded={isOpen}
              aria-controls="site-navbar-menu"
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setIsOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>

          <div
            id="site-navbar-menu"
            className={`cell large-shrink site-navbar__menu-wrap${isOpen ? ' is-open' : ''}`}
          >
            <ul className="menu site-navbar__menu">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `site-navbar__link${isActive ? ' is-active' : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}

/** Pie de página global. */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="grid-container">
        <div className="grid-x grid-margin-x grid-margin-y align-middle">
          <div className="cell medium-6 large-5">
            <div className="site-footer__brand-box">
              <Logo variant="dark" />
              <p className="site-footer__tagline">
                Centro Surcolombiano de Investigación en Café - Universidad Surcolombiana (USCO),
                Neiva, Huila.
              </p>
            </div>
          </div>

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
                      <Icon name={social.label} size={20} />
                    </span>
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <small>© {CURRENT_YEAR} CESURCAFÉ · Universidad Surcolombiana</small>
          <small>Neiva, Huila - Colombia</small>
        </div>
      </div>
    </footer>
  );
}

/** Lleva el scroll al inicio al cambiar de vista. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

/** Estructura global: Navbar + vista activa + Footer + CaféBot flotante. */
export default function Layout() {
  return (
    <ChatProvider>
      <div className="app-shell">
        <ScrollToTop />
        <Navbar />
        <main className="app-main">
          <Outlet />
        </main>
        <Footer />
        <CafeBotWidget />
      </div>
    </ChatProvider>
  );
}
