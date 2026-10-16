import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CoffeeMorph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const timelineContainer = document.querySelector('.timeline');
    if (!timelineContainer) return;

    const stages = [
      'Cereza de café',
      'Despulpado & pergamino',
      'Tostión artesanal',
      'Taza de café servida',
    ];

    const ctx = gsap.context(() => {
      // 1. Barra de progreso vertical
      gsap.to('.timeline__axis-progress', {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: timelineContainer,
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: 0.3,
        },
      });

      // 2. Movimiento vertical del transformador
      const axisHeight = timelineContainer.clientHeight - 60;
      gsap.to(el, {
        y: axisHeight,
        ease: 'none',
        scrollTrigger: {
          trigger: timelineContainer,
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: 0.3,
          onUpdate: (self) => {
            const p = self.progress;
            const idx = Math.min(Math.floor(p * 4), 3);
            if (stageRef.current) {
              stageRef.current.textContent = stages[idx];
            }
          },
        },
      });

      // 3. Transición de fases de café (Cereza -> Pergamino -> Tostión -> Taza)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: timelineContainer,
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: 0.3,
        },
      });

      // Fase 1 a Fase 2 (0% a 33%)
      tl.to('.morph-stage--cherry', { opacity: 0, scale: 0.5, duration: 1 })
        .to('.morph-stage--parchment', { opacity: 1, scale: 1, duration: 1 }, '<')
        // Fase 2 a Fase 3 (33% a 66%)
        .to('.morph-stage--parchment', { opacity: 0, scale: 0.5, duration: 1 })
        .to('.morph-stage--roast', { opacity: 1, scale: 1, duration: 1 }, '<')
        // Fase 3 a Fase 4 (66% a 100%)
        .to('.morph-stage--roast', { opacity: 0, scale: 0.5, duration: 1 })
        .to('.morph-stage--cup', { opacity: 1, scale: 1, duration: 1 }, '<');

      // 4. Activación de nodos al pasar el transformador
      const nodes = gsap.utils.toArray<HTMLElement>('.timeline__node');
      nodes.forEach((node) => {
        ScrollTrigger.create({
          trigger: node,
          start: 'top 52%',
          end: 'bottom 48%',
          onEnter: () => node.classList.add('is-active'),
          onLeaveBack: () => node.classList.remove('is-active'),
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div className="coffee-morph" ref={containerRef} aria-hidden="true">
      <div className="coffee-morph__badge">
        <svg viewBox="0 0 100 100" className="coffee-morph__svg">
          {/* Fase 1: Cereza de Café (--accent-primary) */}
          <g className="morph-stage morph-stage--cherry">
            {/* Tallo */}
            <path d="M50 20 Q46 8 36 6" stroke="#4A7C32" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M36 6 Q42 2 48 4" stroke="#4A7C32" strokeWidth="2" fill="none" />
            {/* Cuerpo de la cereza */}
            <circle cx="50" cy="56" r="28" fill="var(--accent-primary)" />
            {/* Brillo */}
            <ellipse cx="40" cy="46" rx="7" ry="4" transform="rotate(-30 40 46)" fill="#FFFFFF" opacity="0.35" />
            <circle cx="50" cy="80" r="3" fill="#6E1F1A" />
          </g>

          {/* Fase 2: Despulpado / Pergamino (--accent-secondary) */}
          <g className="morph-stage morph-stage--parchment">
            <ellipse cx="50" cy="52" rx="23" ry="30" fill="var(--accent-secondary)" />
            {/* Hendidura del grano */}
            <path
              d="M50 25 C45 35 55 45 50 55 C45 65 55 72 50 79"
              fill="none"
              stroke="#8C5C28"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <ellipse cx="42" cy="44" rx="4" ry="12" fill="#FFFFFF" opacity="0.25" />
          </g>

          {/* Fase 3: Grano de Tostión Oscura (--bg-dark / --bg-dark-card) */}
          <g className="morph-stage morph-stage--roast">
            <ellipse cx="50" cy="52" rx="24" ry="31" fill="#1C1613" stroke="#C88A4B" strokeWidth="1.5" />
            {/* Hendidura tostada */}
            <path
              d="M50 24 C44 36 56 46 50 56 C44 66 56 72 50 80"
              fill="none"
              stroke="#C88A4B"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Destello aceitoso de tostión */}
            <path d="M37 38 Q34 50 37 62" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.2" />
          </g>

          {/* Fase 4: Taza de Café Servida (final) */}
          <g className="morph-stage morph-stage--cup">
            {/* Plato */}
            <ellipse cx="50" cy="78" rx="34" ry="8" fill="#D9D4CC" />
            <ellipse cx="50" cy="76" rx="30" ry="6" fill="#FFFFFF" />
            {/* Asa */}
            <path
              d="M68 46 C80 46 80 62 67 66"
              fill="none"
              stroke="#E8E4DD"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Cuerpo taza */}
            <path d="M26 42 L32 72 Q50 78 68 72 L74 42 Z" fill="#FFFFFF" />
            {/* Superficie de café con crema */}
            <ellipse cx="50" cy="42" rx="24" ry="7" fill="#2A221E" />
            <ellipse cx="50" cy="42" rx="20" ry="5" fill="#C88A4B" opacity="0.85" />
            {/* Vapor aromático */}
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
