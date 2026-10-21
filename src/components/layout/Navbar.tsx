import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { NAV_ITEMS } from '../../data/navigation';
import Logo from './Logo';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Cierra el menú móvil al navegar.
  const closeMenu = () => setIsOpen(false);

  // Sombra sutil cuando el usuario hace scroll.
  // Sobre el video de Inicio (body.has-video-bg) activa además el desenfoque translúcido.
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
          {/* Izquierda: identidad */}
          <div className="cell shrink">
            <Link
              to="/"
              className="site-navbar__brand"
              aria-label="CESURCAFÉ — Inicio"
              onClick={closeMenu}
            >
              <Logo />
            </Link>
          </div>

          {/* Botón hamburguesa (solo móvil) */}
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

          {/* Derecha: 5 secciones */}
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
