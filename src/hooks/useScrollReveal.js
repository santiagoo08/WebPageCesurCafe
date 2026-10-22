import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Curva y duración compartidas para que todas las vistas se muevan igual. */
export const REVEAL_EASE = 'power3.out';
export const REVEAL_DURATION = 0.9;
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

/**
 * Variantes disponibles mediante el atributo `data-reveal`:
 *  - "up" (por defecto): aparece subiendo suavemente.
 *  - "left" / "right": entra desde el lado indicado.
 *  - "clip": se descubre de abajo hacia arriba (efecto cortina).
 */
const VARIANTS = {
  up: {
    from: { autoAlpha: 0, y: 32 },
    to: { autoAlpha: 1, y: 0 },
    clear: 'opacity,visibility,transform',
  },
  left: {
    from: { autoAlpha: 0, x: -48 },
    to: { autoAlpha: 1, x: 0 },
    clear: 'opacity,visibility,transform',
  },
  right: {
    from: { autoAlpha: 0, x: 48 },
    to: { autoAlpha: 1, x: 0 },
    clear: 'opacity,visibility,transform',
  },
  clip: {
    from: { clipPath: 'inset(100% 0% 0% 0%)' },
    to: { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.out' },
    clear: 'clipPath',
  },
};

/**
 * Revela los elementos `[data-reveal]` dentro de `scopeRef` cuando entran al viewport.
 * Los que entran juntos se escalonan (ScrollTrigger.batch) y la animación ocurre una sola vez.
 * Al terminar se limpian los estilos en línea para no interferir con los :hover del CSS.
 * Con "reducir movimiento" activo no se anima nada.
 */
export default function useScrollReveal(scopeRef) {
  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const items = gsap.utils.toArray('[data-reveal]', scope);
      if (!items.length) return;

      const variantOf = (el) => VARIANTS[el.dataset.reveal] ?? VARIANTS.up;

      items.forEach((el) => gsap.set(el, variantOf(el).from));

      ScrollTrigger.batch(items, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          batch.forEach((el, i) => {
            const { to, clear } = variantOf(el);
            gsap.to(el, {
              duration: REVEAL_DURATION,
              ease: REVEAL_EASE,
              ...to,
              delay: i * 0.08,
              overwrite: 'auto',
              clearProps: clear,
            });
          }),
      });
    });

    // Recalcula posiciones cuando terminan de cargar las fuentes.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => mm.revert();
  }, [scopeRef]);
}
