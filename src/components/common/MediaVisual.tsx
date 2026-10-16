import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MediaVisualProps {
  /** Clase de tono (`tone-*`) para variar los colores del marcador. */
  tone?: string;
  image?: string;
  video?: string;
  label?: string;
  className?: string;
  alt?: string;
}

/**
 * Contenedor visual para imagen o video con control de reproducción
 * automática al hacer scroll (GSAP ScrollTrigger).
 */
export default function MediaVisual({
  tone = '',
  image,
  video,
  label,
  className = '',
  alt = '',
}: MediaVisualProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const st = ScrollTrigger.create({
      trigger: v,
      start: 'top 95%',
      end: 'bottom 5%',
      onEnter: () => v.play().catch(() => {}),
      onEnterBack: () => v.play().catch(() => {}),
      onLeave: () => v.pause(),
      onLeaveBack: () => v.pause(),
    });

    return () => st.kill();
  }, [video]);

  return (
    <div className={`media-visual ${tone} ${className}`.trim()}>
      {video ? (
        <video ref={videoRef} src={video} muted loop playsInline />
      ) : image ? (
        <img src={image} alt={alt} loading="lazy" />
      ) : null}
      {label && <span className="media-visual__label">{label}</span>}
    </div>
  );
}
