import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Portada inmersiva de Inicio (cafe.md).
 * El video `cafe.mp4` ya no vive aquí: actúa como fondo global fijo de toda la vista
 * (ver `VideoBackground`). Esta sección solo aporta el titular de bienvenida, que se
 * desvanece con el scroll (GSAP ScrollTrigger, scrub) dejando ver el video detrás.
 */
export default function VideoHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    // Fade / desplazamiento del titular solo si el usuario no pidió reducir el movimiento.
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
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
  );
}
