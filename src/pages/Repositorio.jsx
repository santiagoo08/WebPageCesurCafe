import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { PUBLICATIONS, normalizeText } from '../data/institutional';
import PublicationCard from '../components/PublicationCard';
import Icon from '../components/Icon';
import useScrollReveal, { MOTION_OK, REVEAL_EASE } from '../hooks/useScrollReveal';
import './Repositorio.css';

gsap.registerPlugin(Flip);

const TABS = ['Todos', 'Artículos', 'Libros', 'Cartillas Rurales', 'Investigaciones'];
const PAGE_SIZE = 6;
const CELL = '.explorer__cell';

const motionOk = () => window.matchMedia(MOTION_OK).matches;

export default function Repositorio() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('Todos');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const flipStateRef = useRef(null);
  const pendingFlipRef = useRef(false);
  const flipTlRef = useRef(null);
  const introRef = useRef(null);

  useScrollReveal(sectionRef);

  const results = useMemo(() => {
    const q = normalizeText(query.trim());
    return PUBLICATIONS.filter((p) => {
      const matchesTab = tab === 'Todos' || p.type === tab;
      const matchesQuery =
        !q || normalizeText(p.title).includes(q) || normalizeText(p.author).includes(q);
      return matchesTab && matchesQuery;
    });
  }, [query, tab]);

  const shown = results.slice(0, visible);
  const hasMore = visible < results.length;

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      introRef.current = gsap.from(grid.querySelectorAll(CELL), {
        autoAlpha: 0,
        y: 32,
        duration: 0.8,
        ease: REVEAL_EASE,
        stagger: 0.08,
        clearProps: 'opacity,visibility,transform',
        scrollTrigger: { trigger: grid, start: 'top 85%', once: true },
      });
    });
    return () => mm.revert();
  }, []);

  const captureLayout = () => {
    if (!motionOk()) return;
    if (introRef.current) {
      introRef.current.scrollTrigger?.kill();
      introRef.current.progress(1);
      introRef.current = null;
    }
    const grid = gridRef.current;
    flipStateRef.current = grid ? Flip.getState(grid.querySelectorAll(CELL)) : null;
    flipTlRef.current?.progress(1).kill();
    pendingFlipRef.current = true;
  };

  useLayoutEffect(() => {
    if (!pendingFlipRef.current) return;
    pendingFlipRef.current = false;
    const grid = gridRef.current;
    if (!grid) return;

    const cells = grid.querySelectorAll(CELL);
    const enter = (els) =>
      gsap.fromTo(
        els,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          ease: REVEAL_EASE,
          stagger: 0.05,
          delay: 0.1,
          clearProps: 'opacity,visibility,transform',
        },
      );

    if (flipStateRef.current) {
      flipTlRef.current = Flip.from(flipStateRef.current, {
        targets: cells,
        duration: 0.55,
        ease: 'power3.inOut',
        onEnter: enter,
      });
    } else {
      enter(cells);
    }
  }, [tab, query, visible]);

  const changeTab = (t) => {
    captureLayout();
    setTab(t);
    setVisible(PAGE_SIZE);
  };
  const changeQuery = (value) => {
    captureLayout();
    setQuery(value);
    setVisible(PAGE_SIZE);
  };
  const loadMore = () => {
    captureLayout();
    setVisible((v) => v + PAGE_SIZE);
  };

  return (
    <>
      <section className="page-hero">
        <div className="grid-container">
          <div className="page-hero__box">
            <span className="eyebrow">Producción científica</span>
            <h1>Repositorio</h1>
            <p>
              Investigaciones, artículos, libros y cartillas rurales producidos por el centro, en un
              solo lugar.
            </p>
          </div>
        </div>
      </section>

      <section className="explorer section-padding" ref={sectionRef}>
        <div className="grid-container">
          <div className="explorer__bar" data-reveal>
            <h2 className="explorer__title">Repositorio de investigaciones</h2>
            <label className="explorer__search">
              <Icon name="search" size={20} />
              <span className="visually-hidden">Buscar publicaciones</span>
              <input
                type="search"
                value={query}
                onChange={(e) => changeQuery(e.target.value)}
                placeholder="Buscar por título o autor..."
              />
            </label>
          </div>

          <div className="explorer__tabs" data-reveal>
            <div className="pill-tabs" role="tablist" aria-label="Filtrar por tipo">
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === t}
                  className={`pill-tabs__btn${tab === t ? ' is-active' : ''}`}
                  onClick={() => changeTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <span className="explorer__count" aria-live="polite">
              {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
            </span>
          </div>

          {shown.length > 0 ? (
            <div
              className="grid-x grid-margin-x grid-margin-y small-up-1 medium-up-2 large-up-3"
              ref={gridRef}
            >
              {shown.map((pub) => (
                <div className="cell explorer__cell" key={pub.id}>
                  <PublicationCard publication={pub} showStatus />
                </div>
              ))}
            </div>
          ) : (
            <div className="explorer__empty">
              <p>
                No encontramos publicaciones que coincidan con <strong>“{query}”</strong>
                {tab !== 'Todos' && <> en <strong>{tab}</strong></>}.
              </p>
              <button
                type="button"
                className="cc-btn cc-btn--outline"
                onClick={() => {
                  changeQuery('');
                  changeTab('Todos');
                }}
              >
                Limpiar filtros
              </button>
            </div>
          )}

          {hasMore && (
            <div className="explorer__more">
              <button type="button" className="cc-btn cc-btn--dark" onClick={loadMore}>
                Cargar más
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
