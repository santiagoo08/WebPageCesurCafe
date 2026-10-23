import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FEATURED_PROJECTS,
  PUBLICATIONS,
  SERVICES,
} from '../data/institutional';
import PublicationCard from '../components/PublicationCard';
import Icon from '../components/Icon';
import { MOTION_OK } from '../hooks/useScrollReveal';
import './Inicio.css';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = '/videos/cafe.mp4';
const BODY_CLASS = 'has-video-bg';
const AUTOPLAY_MS = 7000;
const REPO_TABS = ['Recientes', 'Artículos', 'Libros', 'Cartillas Rurales'];

/** Fondo de video fijo + titular de bienvenida que se desvanece con el scroll. */
function VideoHero() {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    document.body.classList.add(BODY_CLASS);
    if (!video) return () => document.body.classList.remove(BODY_CLASS);

    video.muted = true;
    const play = () => video.play().catch(() => {});
    const onVisibilityChange = () => (document.hidden ? video.pause() : play());

    play();
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.body.classList.remove(BODY_CLASS);
    };
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        content,
        { opacity: 1, y: 0 },
        {
          opacity: 0,
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      <div className="page-video-bg" aria-hidden="true">
        <video
          ref={videoRef}
          className="page-video-bg__video"
          src={VIDEO_SRC}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        <div className="page-video-bg__overlay" />
      </div>

      <section ref={sectionRef} className="hero-video-section" aria-label="Presentación CESURCAFÉ">
        <div className="hero-video-content grid-container">
          <div className="grid-x align-center">
            <div ref={contentRef} className="cell small-12 medium-10 large-8 text-center">
              <span className="eyebrow">Universidad Surcolombiana · Neiva, Huila</span>
              <h1 className="hero-video__title">Del grano a la taza, con ciencia</h1>
              <p className="hero-video__desc">
                Centro Surcolombiano de Investigación en Café. Investigación aplicada, innovación
                poscosecha y transferencia tecnológica para la caficultura de la región.
              </p>
              <div className="hero-video__actions">
                <Link to="/servicios" className="cc-btn cc-btn--primary">
                  Explorar servicios <span aria-hidden="true">→</span>
                </Link>
                <Link to="/nosotros" className="cc-btn hero-video__btn-ghost">
                  Conoce CESURCAFÉ
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-video__scroll" aria-hidden="true">
          <span>Desliza</span>
          <span className="hero-video__scroll-line" />
        </div>
      </section>
    </>
  );
}

/** Carrusel de proyectos destacados con fondo animado. */
function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = FEATURED_PROJECTS.length;
  const project = FEATURED_PROJECTS[index];

  const go = (next) => setIndex((next + total) % total);

  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % total), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, total]);

  return (
    <section
      className="hero section-padding"
      aria-roledescription="carrusel"
      aria-label="Proyectos destacados"
    >
      <div className="grid-container">
        <div
          className="hero__box"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="hero__bg" aria-hidden="true">
            <span className="hero__blob hero__blob--a" />
            <span className="hero__blob hero__blob--b" />
            <span className="hero__blob hero__blob--c" />
            <span className="hero__rings" />
          </div>

          <div className="hero__content" key={project.id} aria-live="polite">
            <span className="eyebrow">Proyecto {String(index + 1).padStart(2, '0')}</span>
            <h2 className="hero__title">{project.title}</h2>
            <p className="hero__desc">{project.description}</p>
          </div>

          <div className="hero__controls">
            <button
              type="button"
              className="carousel-btn"
              onClick={() => go(index - 1)}
              aria-label="Proyecto anterior"
            >
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
            <button
              type="button"
              className="carousel-btn"
              onClick={() => go(index + 1)}
              aria-label="Proyecto siguiente"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Componente Maestro-Detalle de servicios. */
function ServicesSummary() {
  const [activeId, setActiveId] = useState(SERVICES[0].id);
  const active = SERVICES.find((s) => s.id === activeId) ?? SERVICES[0];

  return (
    <section className="services-summary section-padding">
      <div className="grid-container">
        <header className="section-header">
          <span className="eyebrow">Lo que hacemos</span>
          <h2>Resumen de servicios</h2>
        </header>

        <div className="grid-x grid-margin-x grid-margin-y">
          <div className="cell large-5">
            <span className="services-summary__list-label">Lista de servicios</span>
            <ol className="services-summary__list" role="tablist" aria-orientation="vertical">
              {SERVICES.map((service, i) => {
                const isActive = service.id === activeId;
                return (
                  <li key={service.id}>
                    <button
                      type="button"
                      role="tab"
                      id={`svc-tab-${service.id}`}
                      aria-selected={isActive}
                      aria-controls="svc-detail"
                      className={`services-summary__item${isActive ? ' is-active' : ''}`}
                      onClick={() => setActiveId(service.id)}
                    >
                      <span className="services-summary__num">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="services-summary__name">{service.shortName}</span>
                      <span className="services-summary__arrow" aria-hidden="true">
                        →
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="cell large-7">
            <article
              id="svc-detail"
              role="tabpanel"
              aria-labelledby={`svc-tab-${active.id}`}
              className="services-summary__detail"
            >
              <span className="services-summary__icon" aria-hidden="true">
                <Icon name={active.icon} size={34} />
              </span>
              <div key={active.id} className="services-summary__detail-body">
                <span className="eyebrow">Información del servicio seleccionado</span>
                <h3>{active.title}</h3>
                <p>{active.description}</p>
                <ul className="services-summary__highlights">
                  {active.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <Link to="/servicios" className="text-link">
                  Ver servicios <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Inicio() {
  const [tab, setTab] = useState('Recientes');

  const previewItems = useMemo(() => {
    const list = tab === 'Recientes' ? PUBLICATIONS : PUBLICATIONS.filter((p) => p.type === tab);
    return list.slice(0, 3);
  }, [tab]);

  return (
    <div className="inicio-page">
      <VideoHero />
      <HeroCarousel />

      {/* Banner "Conoce más sobre nosotros" */}
      <section className="about-banner section-padding">
        <div className="grid-container">
          <div className="about-banner__card grid-x align-middle">
            <div className="cell auto">
              <span className="eyebrow">Conoce más sobre nosotros</span>
              <h2 className="about-banner__title">Personas, investigación y territorio</h2>
              <p className="about-banner__text">
                "Conoce al equipo de investigadores, nuestra historia y los proyectos que impulsan
                CESURCAFÉ."
              </p>
              <Link to="/nosotros" className="text-link">
                Visitar Nosotros <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="cell shrink show-for-medium">
              <span className="about-banner__badge" aria-hidden="true">
                01
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Resumen de Producción Científica */}
      <section className="repo-preview section-padding">
        <div className="grid-container">
          <div className="repo-preview__head grid-x grid-margin-x align-bottom">
            <div className="cell large-auto">
              <header className="section-header">
                <span className="eyebrow">Producción científica</span>
                <h2>Repositorio de investigaciones</h2>
              </header>
            </div>
            <div className="cell large-shrink">
              <div className="pill-tabs" role="tablist" aria-label="Filtrar publicaciones">
                {REPO_TABS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={tab === t}
                    className={`pill-tabs__btn${tab === t ? ' is-active' : ''}`}
                    onClick={() => setTab(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid-x grid-margin-x grid-margin-y small-up-1 medium-up-2 large-up-3">
            {previewItems.map((pub) => (
              <div className="cell" key={pub.id}>
                <PublicationCard publication={pub} />
              </div>
            ))}
          </div>

          <div className="repo-preview__more">
            <Link to="/repositorio" className="cc-btn cc-btn--dark">
              Ver más
            </Link>
          </div>
        </div>
      </section>

      <ServicesSummary />
    </div>
  );
}
