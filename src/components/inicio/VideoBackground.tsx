import { useEffect, useRef } from 'react';

/** Ruta pública del video de fondo (ver cafe.md §1). */
const VIDEO_SRC = '/videos/cafe.mp4';

/** Clase que se añade a <body> mientras el fondo de video está activo (la usa el Navbar). */
const BODY_CLASS = 'has-video-bg';

/**
 * Fondo de video global de la vista Inicio (cafe.md §1).
 * - Video `cafe.mp4` fijo a pantalla completa (`position: fixed`, `z-index: -1`).
 * - Overlay fijo Espresso Profundo (rgba(28, 22, 19, 0.65)) para la legibilidad de todos los bloques.
 * - Marca <body> con `has-video-bg` para que el Navbar pase a su variante transparente.
 * - Pausa el video cuando la pestaña no está visible (ahorro de recursos).
 */
export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    document.body.classList.add(BODY_CLASS);
    if (!video) return () => document.body.classList.remove(BODY_CLASS);

    // Garantiza el autoplay en todos los navegadores (React no siempre refleja `muted` como atributo).
    video.muted = true;

    const play = () => {
      video.play().catch(() => {
        /* El navegador bloqueó la reproducción automática: se ignora en silencio. */
      });
    };

    const onVisibilityChange = () => {
      if (document.hidden) video.pause();
      else play();
    };

    play();
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.body.classList.remove(BODY_CLASS);
    };
  }, []);

  return (
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
  );
}
