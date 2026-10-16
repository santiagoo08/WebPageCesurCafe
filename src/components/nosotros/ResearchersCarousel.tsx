import { useState } from 'react';
import { RESEARCHERS } from '../../data/institutional';

/** Carrusel rotativo de investigadores: la tarjeta activa queda al centro. */
export default function ResearchersCarousel() {
  const [active, setActive] = useState(0);
  const total = RESEARCHERS.length;
  const at = (offset: number) => (active + offset + total) % total;

  // Orden visual: anterior · activa · siguiente
  const visible = [at(-1), at(0), at(1)];

  return (
    <section className="researchers section-padding">
      <div className="grid-container">
        <header className="section-header section-header--center">
          <h2>Investigadores del centro</h2>
        </header>

        <div className="researchers__carousel">
          <button
            type="button"
            className="carousel-btn"
            onClick={() => setActive(at(-1))}
            aria-label="Investigador anterior"
          >
            ◀
          </button>

          <div className="researchers__track" aria-live="polite">
            {visible.map((idx, pos) => {
              const r = RESEARCHERS[idx];
              const isCenter = pos === 1;
              return (
                <article
                  key={r.id}
                  className={`researcher-card${isCenter ? ' is-active' : ''}`}
                  aria-hidden={!isCenter}
                  onClick={() => setActive(idx)}
                >
                  <div className="researcher-card__photo">
                    {r.photo ? (
                      <img src={r.photo} alt={r.name} loading="lazy" />
                    ) : (
                      <span className="researcher-card__initials">{r.initials}</span>
                    )}
                  </div>
                  <div className="researcher-card__body">
                    <span className="eyebrow">Investigador</span>
                    <h3 className="researcher-card__name">{r.name}</h3>
                    <p className="researcher-card__role">{r.role}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <button
            type="button"
            className="carousel-btn"
            onClick={() => setActive(at(1))}
            aria-label="Investigador siguiente"
          >
            ▶
          </button>
        </div>
      </div>
    </section>
  );
}
