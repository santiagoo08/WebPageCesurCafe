import { useEffect, useRef, useState } from 'react';
import './ImageCarousel.css';

const AUTOPLAY_MS = 5500;
const SWIPE_PX = 40;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Carrusel de imágenes con fundido, flechas, puntos, teclado, deslizamiento táctil
 * y avance automático (se pausa al pasar el mouse, al enfocar y con "movimiento reducido").
 * Sin imágenes muestra un recuadro de marcador de posición.
 */
export default function ImageCarousel({
  images = [],
  label = 'Galería de imágenes',
  emptyLabel = 'Próximamente fotos',
  emptyHint,
  tone = '',
  className = '',
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointerX = useRef(null);
  const total = images.length;
  const current = Math.min(index, Math.max(total - 1, 0));

  const go = (next) => setIndex(((next % total) + total) % total);

  useEffect(() => {
    if (total < 2 || paused || prefersReducedMotion()) return undefined;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % total), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [current, paused, total]);

  if (total === 0) {
    return (
      <div className={`media-visual img-carousel img-carousel--empty ${tone} ${className}`.trim()}>
        <span className="media-visual__label">{emptyLabel}</span>
        {emptyHint && <code className="img-carousel__hint">{emptyHint}</code>}
      </div>
    );
  }

  const onKeyDown = (e) => {
    if (total < 2) return;
    if (e.key === 'ArrowRight') go(current + 1);
    if (e.key === 'ArrowLeft') go(current - 1);
  };
  const onPointerDown = (e) => {
    pointerX.current = e.clientX;
  };
  const onPointerUp = (e) => {
    if (pointerX.current == null || total < 2) return;
    const dx = e.clientX - pointerX.current;
    pointerX.current = null;
    if (Math.abs(dx) > SWIPE_PX) go(current + (dx < 0 ? 1 : -1));
  };

  return (
    <div
      className={`img-carousel ${tone} ${className}`.trim()}
      role="region"
      aria-roledescription="carrusel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {images.map((img, i) => (
        <figure
          key={img.src}
          className={`img-carousel__slide${i === current ? ' is-active' : ''}`}
          aria-hidden={i !== current}
          aria-roledescription="diapositiva"
          aria-label={`${i + 1} de ${total}`}
        >
          <img src={img.src} alt={img.alt ?? ''} loading={i === 0 ? 'eager' : 'lazy'} draggable="false" />
          {img.caption && <figcaption>{img.caption}</figcaption>}
        </figure>
      ))}

      {total > 1 && (
        <div className="img-carousel__controls">
          <button
            type="button"
            className="carousel-btn carousel-btn--on-dark img-carousel__btn"
            onClick={() => go(current - 1)}
            aria-label="Imagen anterior"
          >
            ←
          </button>
          <div className="carousel-dots" role="tablist" aria-label="Seleccionar imagen">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={`Imagen ${i + 1}`}
                className={`carousel-dots__dot${i === current ? ' is-active' : ''}`}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <button
            type="button"
            className="carousel-btn carousel-btn--on-dark img-carousel__btn"
            onClick={() => go(current + 1)}
            aria-label="Imagen siguiente"
          >
            →
          </button>
          <span className="img-carousel__count" aria-live="polite">
            {current + 1} / {total}
          </span>
        </div>
      )}
    </div>
  );
}
