import { useMemo, useState } from 'react';
import { PUBLICATIONS, normalizeText } from '../../data/publications';
import PublicationCard from '../common/PublicationCard';
import Icon from '../common/Icon';

const TABS = ['Todos', 'Artículos', 'Libros', 'Cartillas Rurales', 'Investigaciones'];
const PAGE_SIZE = 6;

/** Explorador filtrable del repositorio (datos estáticos en JSON). */
export default function RepositoryExplorer() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('Todos');
  const [visible, setVisible] = useState(PAGE_SIZE);

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

  // Al cambiar el filtro o la búsqueda, se reinicia la paginación.
  const changeTab = (t) => {
    setTab(t);
    setVisible(PAGE_SIZE);
  };
  const changeQuery = (value) => {
    setQuery(value);
    setVisible(PAGE_SIZE);
  };

  return (
    <section className="explorer section-padding">
      <div className="grid-container">
        {/* Barra superior */}
        <div className="explorer__bar">
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

        {/* Pestañas */}
        <div className="explorer__tabs">
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

        {/* Grilla */}
        {shown.length > 0 ? (
          <div className="grid-x grid-margin-x grid-margin-y small-up-1 medium-up-2 large-up-3">
            {shown.map((pub) => (
              <div className="cell" key={pub.id}>
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
            <button
              type="button"
              className="cc-btn cc-btn--dark"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
            >
              Cargar más
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
