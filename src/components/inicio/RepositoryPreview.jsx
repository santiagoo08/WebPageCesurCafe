import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { PUBLICATIONS } from '../../data/publications';
import PublicationCard from '../common/PublicationCard';

const TABS = ['Recientes', 'Artículos', 'Libros', 'Cartillas Rurales'];

/** Vista previa del repositorio: 3 tarjetas filtradas por pestaña. */
export default function RepositoryPreview() {
  const [tab, setTab] = useState('Recientes');

  const items = useMemo(() => {
    // El JSON está ordenado del más reciente al más antiguo.
    const list = tab === 'Recientes' ? PUBLICATIONS : PUBLICATIONS.filter((p) => p.type === tab);
    return list.slice(0, 3);
  }, [tab]);

  return (
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
              {TABS.map((t) => (
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
          {items.map((pub) => (
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
  );
}
