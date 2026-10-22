import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { TESTIMONIALS } from '../../data/institutional';
import Icon from '../common/Icon';

/** Carrusel horizontal "Voces de la comunidad cafetera". */
export default function Testimonials() {
  const trackRef = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  };

  // Recalcula límites al redimensionar (el callback también corre al observar).
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
    <section className="testimonials on-dark section-padding">
      <div className="grid-container">
        <div className="testimonials__head">
          <header className="section-header section-header--center">
            <span className="eyebrow">Experiencias</span>
            <h2>Voces de la comunidad cafetera</h2>
          </header>
        </div>

        <div className="testimonials__track" ref={trackRef} onScroll={updateEdges}>
          {TESTIMONIALS.map((t, i) => (
            <article className="testimonial" key={t.id}>
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

        <div className="testimonials__controls">
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
