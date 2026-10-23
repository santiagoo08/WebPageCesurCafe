import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SERVICES, TESTIMONIALS } from '../data/institutional';
import Icon from '../components/Icon';
import MediaVisual from '../components/MediaVisual';
import useScrollReveal, { MOTION_OK, REVEAL_EASE } from '../hooks/useScrollReveal';
import './Servicios.css';

gsap.registerPlugin(ScrollTrigger);

const STACK_STEP = 24;

/** Tarjetas de servicios con efecto de apilamiento (GSAP ScrollTrigger, pin: true). */
function StackedServices() {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 64em) and (prefers-reduced-motion: no-preference)', () => {
      const cards = gsap.utils.toArray('.stack-card', container);
      const last = cards[cards.length - 1];
      const navOffset = () =>
        (document.querySelector('.site-navbar')?.getBoundingClientRect().height ?? 76) + 24;
      const endPosition = () => `top ${navOffset() + (cards.length - 1) * STACK_STEP}px`;

      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: () => `top ${navOffset() + i * STACK_STEP}px`,
          endTrigger: last,
          end: endPosition,
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });

        if (i < cards.length - 1) {
          gsap.to(card.querySelector('.stack-card__inner'), {
            scale: 1 - (cards.length - 1 - i) * 0.035,
            ease: 'none',
            scrollTrigger: {
              trigger: cards[i + 1],
              start: 'top bottom',
              endTrigger: last,
              end: endPosition,
              scrub: 1.6,
              invalidateOnRefresh: true,
            },
          });
        }
      });
    });

    mm.add(MOTION_OK, () => {
      gsap.utils.toArray('.stack-card', container).forEach((card) => {
        const tl = gsap.timeline({
          defaults: { ease: REVEAL_EASE, duration: 1.35 },
          scrollTrigger: { trigger: card, start: 'top 82%', once: true },
        });

        tl.from(card.querySelector('.stack-card__media'), {
          clipPath: 'inset(100% 0% 0% 0%)',
          duration: 1.75,
          ease: 'power3.out',
          clearProps: 'clipPath',
        })
          .from(
            card.querySelectorAll(
              '.stack-card__top, .stack-card__title, .stack-card__desc, .stack-card__list li',
            ),
            { autoAlpha: 0, y: 28, stagger: 0.14, clearProps: 'opacity,visibility,transform' },
            0.25,
          )
          .from(
            card.querySelector('.cc-btn'),
            { autoAlpha: 0, duration: 1.1, clearProps: 'opacity,visibility' },
            '-=0.5',
          );
      });
    });

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

/** Carrusel horizontal "Voces de la comunidad cafetera". */
function Testimonials() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useScrollReveal(sectionRef);

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => updateEdges());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('.testimonial');
    const amount = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  return (
    <section className="testimonials on-dark section-padding" ref={sectionRef}>
      <div className="grid-container">
        <div className="testimonials__head" data-reveal>
          <header className="section-header section-header--center">
            <span className="eyebrow">Experiencias</span>
            <h2>Voces de la comunidad cafetera</h2>
          </header>
        </div>

        <div className="testimonials__track" ref={trackRef} onScroll={updateEdges}>
          {TESTIMONIALS.map((t, i) => (
            <article className="testimonial" key={t.id} data-reveal>
              <div className="testimonial__top">
                <div className="testimonial__top-row">
                  <span className="eyebrow testimonial__category">{t.category}</span>
                  <Link to="/repositorio" className="testimonial__link">
                    + Ver proyecto
                  </Link>
                </div>
                <span className="num-badge">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="testimonial__bottom">
                <Icon name="quote" size={34} className="testimonial__quote-icon" />
                <blockquote className="testimonial__quote">“{t.quote}”</blockquote>
                <footer className="testimonial__author">
                  <strong>{t.author}</strong>
                  <span>{t.role}</span>
                </footer>
              </div>
            </article>
          ))}
        </div>

        <div className="testimonials__controls" data-reveal>
          <button
            type="button"
            className="carousel-btn carousel-btn--on-dark"
            onClick={() => scroll(-1)}
            disabled={edges.start}
            aria-label="Testimonio anterior"
          >
            ←
          </button>
          <button
            type="button"
            className="carousel-btn carousel-btn--on-dark"
            onClick={() => scroll(1)}
            disabled={edges.end}
            aria-label="Testimonio siguiente"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}

export default function Servicios() {
  return (
    <>
      <section className="page-hero page-hero--servicios">
        <div className="page-hero__media" aria-hidden="true" />
        <div className="grid-container page-hero__content">
          <span className="eyebrow">Lo que hacemos</span>
          <h1>Servicios</h1>
          <p>Capacidades de investigación aplicada para el territorio y sus comunidades.</p>
        </div>
      </section>
      <StackedServices />
      <Testimonials />
    </>
  );
}
