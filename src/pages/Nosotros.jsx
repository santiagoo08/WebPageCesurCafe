import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  PURPOSE_CARDS,
  RESEARCHERS,
  TIMELINE_MILESTONES,
  WHO_WE_ARE_PANELS,
} from '../data/institutional';
import Icon from '../components/Icon';
import MediaVisual from '../components/MediaVisual';
import useScrollReveal, { MOTION_OK } from '../hooks/useScrollReveal';
import './Nosotros.css';

gsap.registerPlugin(ScrollTrigger);

const SPRITE_SRC = '/images/timeline-sprite.webp';
const FRAME_COUNT = 240;
const SPRITE_COLS = 15;
const TILE_SIZE = 220;

/** Cabecera separada "¿Quiénes somos?" + bloque de Propósito + galería acordeón. */
function WhoWeAre() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);

  useScrollReveal(sectionRef);

  return (
    <>
      <section className="page-hero page-hero--nosotros">
        <div className="page-hero__media" aria-hidden="true" />
        <div className="grid-container page-hero__content">
          <span className="eyebrow">Centro de investigación</span>
          <h1>¿Quiénes somos?</h1>
          <p>
            “Somos el Centro Surcolombiano de Investigación en Café (CESURCAFÉ) de la Universidad
            Surcolombiana, orientados al desarrollo tecnológico y agroindustrial de la región.”
          </p>
        </div>
      </section>

      <section className="who section-padding" ref={sectionRef}>
        <div className="grid-container">
          {/* Misión, Visión y Reconocimientos (más altos y grandes, encima de las cards de ¿Quiénes somos?) */}
          <div
            className="grid-x grid-margin-x grid-margin-y small-up-1 medium-up-3 who__purpose"
            data-reveal="stagger"
          >
            {PURPOSE_CARDS.map((card, idx) => (
              <div className="cell" key={card.title}>
                <article className="purpose__card">
                  <div className="purpose__top">
                    <span className="purpose__icon">
                      <Icon name={card.icon} size={30} />
                    </span>
                    <span className="purpose__num" aria-hidden="true">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="purpose__body">
                    <span className="eyebrow">{card.eyebrow}</span>
                    <h2 className="purpose__title">{card.title}</h2>
                    <p className="purpose__text">“{card.text}”</p>
                    {card.detail && <p className="purpose__detail">{card.detail}</p>}
                  </div>

                  {card.pillars && (
                    <footer className="purpose__footer">
                      {card.pillars.map((pillar) => (
                        <span key={pillar} className="pill pill--outline">
                          {pillar}
                        </span>
                      ))}
                    </footer>
                  )}
                </article>
              </div>
            ))}
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
    </>
  );
}

/**
 * Animación hiperrealista tipo Apple a 60–120+ FPS reales:
 * Secuencia de 240 fotogramas WebP precargados en RAM y renderizados en <canvas>
 * con interpolación sub-fotograma (cross-blending entre frame A y frame B).
 */
function CoffeeMorph() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const ringRef = useRef(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    const canvas = canvasRef.current;
    const ring = ringRef.current;
    const timelineContainer = el?.closest('.timeline');
    if (!el || !canvas || !timelineContainer) return;

    const ctx2d = canvas.getContext('2d', { alpha: false });
    if (!ctx2d) return;

    const size = TILE_SIZE;
    canvas.width = size;
    canvas.height = size;

    const sprite = new Image();
    sprite.decoding = 'async';
    let isLoaded = false;
    let isDisposed = false;
    let targetProgress = 0;
    let renderedProgress = 0;

    const drawTile = (frameIdx) => {
      const col = frameIdx % SPRITE_COLS;
      const row = Math.floor(frameIdx / SPRITE_COLS);
      ctx2d.drawImage(
        sprite,
        col * TILE_SIZE,
        row * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE,
        0,
        0,
        size,
        size,
      );
    };

    const drawProgress = (progress) => {
      if (isDisposed) return;

      ctx2d.fillStyle = '#19140E';
      ctx2d.fillRect(0, 0, size, size);

      if (isLoaded) {
        const exact = progress * (FRAME_COUNT - 4);
        const idxA = Math.max(0, Math.min(FRAME_COUNT - 1, Math.floor(exact)));
        const idxB = Math.max(0, Math.min(FRAME_COUNT - 1, idxA + 1));
        const blend = exact - idxA;

        ctx2d.globalAlpha = 1;
        drawTile(idxA);

        if (idxB !== idxA && blend > 0.01) {
          ctx2d.globalAlpha = blend;
          drawTile(idxB);
          ctx2d.globalAlpha = 1;
        }
      }

      if (ring) {
        ring.style.strokeDashoffset = String(100 - progress * 100);
      }
    };

    sprite.src = SPRITE_SRC;
    sprite.onload = () => {
      if (isDisposed) return;
      isLoaded = true;
      drawProgress(renderedProgress);
    };

    const badge = el.querySelector('.coffee-morph__badge');
    const axisProgress = timelineContainer.querySelector('.timeline__axis-progress');
    const setY = gsap.quickSetter(el, 'y', 'px');

    // Ticker cinemático: amortigua y limita la velocidad máxima de transición
    // para que todas las etapas del video se aprecien lentamente a 60–120+ FPS
    const onTick = () => {
      if (isDisposed) return;
      const diff = targetProgress - renderedProgress;
      if (Math.abs(diff) > 0.0001) {
        const dt = Math.min(gsap.ticker.deltaRatio(), 2.5);
        // Velocidad máxima controlada (~6 a 7 segundos para recorrer los 240 cuadros)
        const maxStep = 0.0024 * dt;
        const dampedStep = diff * 0.032 * dt;
        const step =
          Math.abs(dampedStep) > maxStep ? Math.sign(diff) * maxStep : dampedStep;

        renderedProgress = Math.max(0, Math.min(1, renderedProgress + step));
        drawProgress(renderedProgress);

        const maxTravel = Math.max(0, timelineContainer.clientHeight - (badge?.offsetHeight || 160));
        setY(renderedProgress * maxTravel);
        if (axisProgress) {
          axisProgress.style.height = `${renderedProgress * 100}%`;
        }
      }
    };

    gsap.ticker.add(onTick);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: timelineContainer,
        start: 'top 68%',
        end: 'bottom 32%',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          targetProgress = self.progress;
        },
      });

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

    return () => {
      isDisposed = true;
      gsap.ticker.remove(onTick);
      ctx.revert();
    };
  }, []);

  return (
    <div className="coffee-morph" ref={containerRef} aria-hidden="true">
      <div className="coffee-morph__badge">
        <canvas ref={canvasRef} className="coffee-morph__canvas" />
        <svg className="coffee-morph__ring" viewBox="0 0 100 100">
          <circle
            className="coffee-morph__ring-track"
            cx="50"
            cy="50"
            r="48"
          />
          <circle
            ref={ringRef}
            className="coffee-morph__ring-progress"
            cx="50"
            cy="50"
            r="48"
            pathLength="100"
          />
        </svg>
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
            {/* HITO 01 */}
            <li className="timeline__item timeline__item--left">
              <span className="timeline__node" aria-hidden="true">
                01
              </span>
              <article className="timeline__card" data-reveal="left">
                <span className="timeline__year">2010 - 2012</span>
                <h3 className="timeline__card-title">Antecedentes e Idea de Origen</h3>
                <p className="timeline__card-text">
                  Ante el acelerado crecimiento de la producción y comercialización de cafés de alta calidad en la región surcolombiana, la Universidad Surcolombiana identificó la urgencia de contar con un organismo científico enfocado en resolver las problemáticas del gremio. Con este propósito, el Grupo de Investigación en Agroindustria formuló la propuesta técnica del centro, logrando los avales del Comité Central de Investigación en febrero de 2012 y del Consejo de Facultad de Ingeniería en marzo del mismo año.
                </p>
              </article>
            </li>

            {/* HITO 02 */}
            <li className="timeline__item timeline__item--right">
              <span className="timeline__node" aria-hidden="true">
                02
              </span>
              <article className="timeline__card" data-reveal="right">
                <span className="timeline__year">2012</span>
                <h3 className="timeline__card-title">Creación Institucional</h3>
                <p className="timeline__card-text">
                  La institución cobró vida jurídica formal el 31 de julio de 2012 mediante el Acuerdo N.º 029 del Consejo Superior Universitario. CESURCAFÉ quedó adscrito a la Facultad de Ingeniería bajo la dirección del Dr. Nelson Gutiérrez Guzmán, enfocado en estructurar líneas clave como la perfilación sensorial, la fermentación, el secado de productos biológicos y el tratamiento de aguas residuales del beneficio.
                </p>
              </article>
            </li>

            {/* HITO 03 */}
            <li className="timeline__item timeline__item--left">
              <span className="timeline__node" aria-hidden="true">
                03
              </span>
              <article className="timeline__card" data-reveal="left">
                <span className="timeline__year">Consolidación</span>
                <h3 className="timeline__card-title">Redes e Investigación</h3>
                <p className="timeline__card-text">
                  En su etapa de consolidación, el centro afianzó su portafolio de servicios tecnológicos para los caficultores e integró importantes redes internacionales de conocimiento con aliados como la Universidad de Manchester, la Universidad Federal de Lavras, la Universidad de los Andes y la Gobernación del Huila. Estas alianzas impulsaron el desarrollo investigativo y la transferencia de tecnología en toda la cadena de valor.
                </p>
              </article>
            </li>

            {/* HITO 04 */}
            <li className="timeline__item timeline__item--right">
              <span className="timeline__node" aria-hidden="true">
                04
              </span>
              <article className="timeline__card" data-reveal="right">
                <span className="timeline__year">Actualidad</span>
                <h3 className="timeline__card-title">Proyección y Escuela del Café</h3>
                <p className="timeline__card-text">
                  Hoy en día, CESURCAFÉ se posiciona como el eje científico y académico del grano en la región, sirviendo de base para la articulación de la Escuela Universitaria del Café junto a la Gobernación del Huila. Este hito fortalece la formación profesional en el sector e impulsa la innovación continua para el posicionamiento del café huilense a nivel global.
                </p>
              </article>
            </li>
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
