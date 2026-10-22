import { TIMELINE_MILESTONES } from '../../data/institutional';
import CoffeeMorph from './CoffeeMorph';

/**
 * Línea del tiempo "Nuestra historia".
 * Estructura vacía de contenido con animación GSAP ScrollTrigger
 * de transformación: Cereza -> Pergamino -> Tostión -> Taza de café.
 */
export default function Timeline() {
  return (
    <section className="timeline-section section-padding">
      <div className="grid-container">
        <header className="section-header section-header--center">
          <h2>Nuestra historia</h2>
          <p>Nuestra trayectoria...</p>
        </header>

        <div className="timeline" data-timeline>
          <div className="timeline__axis" aria-hidden="true">
            <span className="timeline__axis-progress" />
            <CoffeeMorph />
          </div>

          <ol className="timeline__list">
            {TIMELINE_MILESTONES.map((m, i) => (
              <li
                key={m.id}
                className={`timeline__item timeline__item--${i % 2 === 0 ? 'left' : 'right'}`}
              >
                <span className="timeline__node" aria-hidden="true">
                  {String(m.id).padStart(2, '0')}
                </span>
                <article className="timeline__card">
                  <span className="timeline__year">{m.year}</span>
                  <h3 className="timeline__card-title">{m.title}</h3>
                  <p className="timeline__card-text">{m.text}</p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
