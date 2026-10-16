import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SERVICES } from '../../data/institutional';
import MediaVisual from '../common/MediaVisual';

gsap.registerPlugin(ScrollTrigger);

/** Separación vertical entre tarjetas apiladas (px). */
const STACK_STEP = 24;

/**
 * Tarjetas de servicios con efecto de apilamiento (GSAP ScrollTrigger, pin: true).
 * En pantallas pequeñas o con "reducir movimiento" se muestran en flujo normal.
 */
export default function StackedServices() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 64em) and (prefers-reduced-motion: no-preference)', () => {
      const cards = gsap.utils.toArray<HTMLElement>('.stack-card', container);
      const last = cards[cards.length - 1];
      const navOffset = () =>
        (document.querySelector('.site-navbar')?.getBoundingClientRect().height ?? 76) + 24;
      const endPosition = () => `top ${navOffset() + (cards.length - 1) * STACK_STEP}px`;

      cards.forEach((card, i) => {
        // Fija cada tarjeta hasta que llega la última.
        ScrollTrigger.create({
          trigger: card,
          start: () => `top ${navOffset() + i * STACK_STEP}px`,
          endTrigger: last,
          end: endPosition,
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });

        // Las tarjetas que quedan debajo se reducen y oscurecen.
        if (i < cards.length - 1) {
          gsap.to(card.querySelector('.stack-card__inner'), {
            scale: 1 - (cards.length - 1 - i) * 0.05,
            filter: 'brightness(0.65)',
            ease: 'none',
            scrollTrigger: {
              trigger: cards[i + 1],
              start: 'top bottom',
              endTrigger: last,
              end: endPosition,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }
      });
    });

    // Recalcula posiciones cuando terminan de cargar las fuentes.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => mm.revert();
  }, []);

  return (
    <section className="stack-section">
      <div className="grid-container">
        <div className="stack" ref={containerRef}>
          {SERVICES.map((service, i) => (
            <article className="stack-card" key={service.id}>
              <div className="stack-card__inner grid-x">
                <div className="cell medium-6 stack-card__text">
                  <div className="stack-card__top">
                    <span className="pill pill--caramel">{service.tag}</span>
                    <span className="stack-card__num">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h2 className="stack-card__title">{service.title}</h2>
                  <p className="stack-card__desc">{service.description}</p>
                  <ul className="stack-card__list">
                    {service.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  <Link to="/contacto" className="cc-btn cc-btn--primary">
                    Solicitar información
                  </Link>
                </div>
                <div className="cell medium-6 stack-card__visual">
                  <MediaVisual
                    tone={service.tone}
                    image={service.image}
                    video={service.video}
                    label="Video / imagen del servicio"
                    className="stack-card__media"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
