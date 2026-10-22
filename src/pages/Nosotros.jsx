import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RESEARCHERS, TIMELINE_MILESTONES, WHO_WE_ARE_PANELS } from '../data/institutional';
import MediaVisual from '../components/MediaVisual';
import useScrollReveal, { MOTION_OK } from '../hooks/useScrollReveal';
import './Nosotros.css';

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  'Cereza de café',
  'Despulpado & pergamino',
  'Tostión artesanal',
  'Taza de café servida',
];

/** Cabecera "¿Quiénes somos?" + galería acordeón de 4 franjas. */
function WhoWeAre() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);

  useScrollReveal(sectionRef);

  return (
    <section className="who section-padding" ref={sectionRef}>
      <div className="grid-container">
        <div className="grid-x grid-margin-x align-bottom who__head">
          <div className="cell large-6">
            <span className="eyebrow">Centro de investigación</span>
            <h1 className="who__title">¿Quiénes somos?</h1>
          </div>
          <div className="cell large-6">
            <p className="who__desc">
              “Somos el Centro Surcolombiano de Investigación en Café (CESURCAFÉ) de la Universidad
              Surcolombiana, orientados al desarrollo tecnológico y agroindustrial de la región.”
            </p>
          </div>
        </div>

        <div className="who__accordion" role="list">
          {WHO_WE_ARE_PANELS.map((panel, i) => {
            const isActive = i === active;
            return (
              <button
                key={panel.title}
                type="button"
                role="listitem"
                aria-current={isActive}
                className={`who__panel${isActive ? ' is-active' : ''}`}
                data-reveal="clip"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <MediaVisual
                  tone={panel.tone}
                  image={panel.image}
                  video={panel.video}
                  className="who__media"
                />
                <span className="who__panel-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="who__panel-text">
                  <span className="who__panel-title">{panel.title}</span>
                  <span className="who__panel-caption">{panel.caption}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Transformador SVG en el eje central (Cereza -> Pergamino -> Tostión -> Taza). */
function CoffeeMorph() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    const timelineContainer = el?.closest('.timeline');
    if (!el || !timelineContainer) return;

    let currentStage = 0;
    const setStage = (idx) => {
      if (idx === currentStage || !stageRef.current) return;
      currentStage = idx;
      stageRef.current.textContent = STAGES[idx];
      gsap.fromTo(
        stageRef.current,
        { autoAlpha: 0, y: 6 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out', overwrite: true },
      );
    };

    const ctx = gsap.context(() => {
      const badge = el.querySelector('.coffee-morph__badge');

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: timelineContainer,
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => setStage(Math.min(Math.floor(self.progress * STAGES.length), 3)),
        },
      });

      tl.to('.timeline__axis-progress', { height: '100%', duration: 1 }, 0).to(
        el,
        { y: () => timelineContainer.clientHeight - badge.offsetHeight, duration: 1 },
        0,
      );

      const swap = (from, to, at) => {
        tl.to(
          from,
          { opacity: 0, scale: 0.6, rotate: -12, transformOrigin: '50% 50%', duration: 0.08, ease: 'power2.in' },
          at - 0.04,
        ).fromTo(
          to,
          { opacity: 0, scale: 0.6, rotate: 12, transformOrigin: '50% 50%' },
          { opacity: 1, scale: 1, rotate: 0, duration: 0.08, ease: 'power2.out' },
          at,
        );
      };
      swap('.morph-stage--cherry', '.morph-stage--parchment', 0.25);
      swap('.morph-stage--parchment', '.morph-stage--roast', 0.5);
      swap('.morph-stage--roast', '.morph-stage--cup', 0.75);

      gsap.utils.toArray('.timeline__node').forEach((node) => {
        ScrollTrigger.create({
          trigger: node,
          start: 'top 52%',
          end: 'bottom 48%',
          onEnter: () => node.classList.add('is-active'),
          onLeaveBack: () => node.classList.remove('is-active'),
        });
      });
    }, timelineContainer);

    return () => ctx.revert();
  }, []);

  return (
    <div className="coffee-morph" ref={containerRef} aria-hidden="true">
      <div className="coffee-morph__badge">
        <svg viewBox="0 0 100 100" className="coffee-morph__svg">
          {/* Fase 1: Cereza de Café */}
          <g className="morph-stage morph-stage--cherry">
            <path d="M50 20 Q46 8 36 6" stroke="#4A7C32" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M36 6 Q42 2 48 4" stroke="#4A7C32" strokeWidth="2" fill="none" />
            <circle cx="50" cy="56" r="28" fill="var(--accent-primary)" />
            <ellipse cx="40" cy="46" rx="7" ry="4" transform="rotate(-30 40 46)" fill="#FFFFFF" opacity="0.35" />
            <circle cx="50" cy="80" r="3" fill="#6E1F1A" />
          </g>

          {/* Fase 2: Despulpado / Pergamino */}
          <g className="morph-stage morph-stage--parchment">
            <ellipse cx="50" cy="52" rx="23" ry="30" fill="var(--accent-secondary)" />
            <path
              d="M50 25 C45 35 55 45 50 55 C45 65 55 72 50 79"
              fill="none"
              stroke="#8C5C28"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <ellipse cx="42" cy="44" rx="4" ry="12" fill="#FFFFFF" opacity="0.25" />
          </g>

          {/* Fase 3: Grano de Tostión Oscura */}
          <g className="morph-stage morph-stage--roast">
            <ellipse cx="50" cy="52" rx="24" ry="31" fill="#1C1613" stroke="#C88A4B" strokeWidth="1.5" />
            <path
              d="M50 24 C44 36 56 46 50 56 C44 66 56 72 50 80"
              fill="none"
              stroke="#C88A4B"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path d="M37 38 Q34 50 37 62" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.2" />
          </g>

          {/* Fase 4: Taza de Café Servida */}
          <g className="morph-stage morph-stage--cup">
            <ellipse cx="50" cy="78" rx="34" ry="8" fill="#D9D4CC" />
            <ellipse cx="50" cy="76" rx="30" ry="6" fill="#FFFFFF" />
            <path
              d="M68 46 C80 46 80 62 67 66"
              fill="none"
              stroke="#E8E4DD"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path d="M26 42 L32 72 Q50 78 68 72 L74 42 Z" fill="#FFFFFF" />
            <ellipse cx="50" cy="42" rx="24" ry="7" fill="#2A221E" />
            <ellipse cx="50" cy="42" rx="20" ry="5" fill="#C88A4B" opacity="0.85" />
            <path d="M42 32 Q39 24 43 16" fill="none" stroke="#C88A4B" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
            <path d="M50 30 Q54 22 50 14" fill="none" stroke="#C88A4B" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
            <path d="M58 32 Q55 24 59 16" fill="none" stroke="#C88A4B" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          </g>
        </svg>
      </div>

      <div className="coffee-morph__stage-pill">
        <span ref={stageRef}>Cereza de café</span>
      </div>
    </div>
  );
}

/** Línea del tiempo "Nuestra historia". */
function Timeline() {
  const sectionRef = useRef(null);

  useScrollReveal(sectionRef);

  return (
    <section className="timeline-section section-padding" ref={sectionRef}>
      <div className="grid-container">
        <header className="section-header section-header--center" data-reveal>
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
                <article
                  className="timeline__card"
                  data-reveal={i % 2 === 0 ? 'left' : 'right'}
                >
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

/** Carrusel rotativo de investigadores: la tarjeta activa queda al centro. */
function ResearchersCarousel() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const directionRef = useRef(0);
  const total = RESEARCHERS.length;
  const at = (offset) => (active + offset + total) % total;

  const visible = [at(-1), at(0), at(1)];

  useScrollReveal(sectionRef);

  const go = (offset) => {
    directionRef.current = Math.sign(offset);
    setActive(at(offset));
  };

  useLayoutEffect(() => {
    const dir = directionRef.current;
    const track = trackRef.current;
    if (!dir || !track || !window.matchMedia(MOTION_OK).matches) return;
    directionRef.current = 0;

    const tween = gsap.fromTo(
      track.querySelectorAll('.researcher-card'),
      { x: dir * 80 },
      {
        x: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: { each: 0.05, from: dir > 0 ? 'start' : 'end' },
        clearProps: 'transform',
      },
    );

    return () => tween.kill();
  }, [active]);

  return (
    <section className="researchers section-padding" ref={sectionRef}>
      <div className="grid-container">
        <header className="section-header section-header--center" data-reveal>
          <h2>Investigadores del centro</h2>
        </header>

        <div className="researchers__carousel" data-reveal>
          <button
            type="button"
            className="carousel-btn"
            onClick={() => go(-1)}
            aria-label="Investigador anterior"
          >
            ◀
          </button>

          <div className="researchers__track" ref={trackRef} aria-live="polite">
            {visible.map((idx, pos) => {
              const r = RESEARCHERS[idx];
              const isCenter = pos === 1;
              return (
                <article
                  key={r.id}
                  className={`researcher-card${isCenter ? ' is-active' : ''}`}
                  aria-hidden={!isCenter}
                  onClick={() => go(pos - 1)}
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
            onClick={() => go(1)}
            aria-label="Investigador siguiente"
          >
            ▶
          </button>
        </div>
      </div>
    </section>
  );
}

export default function Nosotros() {
  return (
    <>
      <WhoWeAre />
      <Timeline />
      <ResearchersCarousel />
    </>
  );
}
