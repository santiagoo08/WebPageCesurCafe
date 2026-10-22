import { useEffect, useState } from 'react';
import { FEATURED_PROJECTS } from '../../data/projects';

const AUTOPLAY_MS = 7000;

/** Carrusel de proyectos destacados con fondo animado. */
export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = FEATURED_PROJECTS.length;
  const project = FEATURED_PROJECTS[index];

  const go = (next) => setIndex((next + total) % total);

  // Avance automático (se reinicia al cambiar de diapositiva).
  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % total), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, total]);

  return (
    <section className="hero section-padding" aria-roledescription="carrusel" aria-label="Proyectos destacados">
      <div className="grid-container">
        <div
          className="hero__box"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {/* Fondo: video si existe, si no animación CSS */}
          {project.video ? (
            <video key={project.video} className="hero__video" src={project.video} autoPlay muted loop playsInline />
          ) : (
            <div className="hero__bg" aria-hidden="true">
              <span className="hero__blob hero__blob--a" />
              <span className="hero__blob hero__blob--b" />
              <span className="hero__blob hero__blob--c" />
              <span className="hero__rings" />
            </div>
          )}

          <div className="hero__content" key={project.id} aria-live="polite">
            <span className="eyebrow">Proyecto {String(index + 1).padStart(2, '0')}</span>
            <h2 className="hero__title">{project.title}</h2>
            <p className="hero__desc">{project.description}</p>
          </div>

          <div className="hero__controls">
            <button type="button" className="carousel-btn" onClick={() => go(index - 1)} aria-label="Proyecto anterior">
              ←
            </button>
            <div className="carousel-dots" role="tablist" aria-label="Seleccionar proyecto">
              {FEATURED_PROJECTS.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Proyecto ${i + 1}`}
                  className={`carousel-dots__dot${i === index ? ' is-active' : ''}`}
                  onClick={() => go(i)}
                />
              ))}
            </div>
            <button type="button" className="carousel-btn" onClick={() => go(index + 1)} aria-label="Proyecto siguiente">
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
