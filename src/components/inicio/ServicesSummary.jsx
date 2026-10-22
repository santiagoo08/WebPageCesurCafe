import { useState } from 'react';
import { Link } from 'react-router';
import { SERVICES } from '../../data/institutional';
import Icon from '../common/Icon';

/** Componente Maestro-Detalle de servicios. */
export default function ServicesSummary() {
  const [activeId, setActiveId] = useState(SERVICES[0].id);
  const active = SERVICES.find((s) => s.id === activeId) ?? SERVICES[0];

  return (
    <section className="services-summary section-padding">
      <div className="grid-container">
        <header className="section-header">
          <span className="eyebrow">Lo que hacemos</span>
          <h2>Resumen de servicios</h2>
        </header>

        <div className="grid-x grid-margin-x grid-margin-y">
          {/* Maestro */}
          <div className="cell large-5">
            <span className="services-summary__list-label">Lista de servicios</span>
            <ol className="services-summary__list" role="tablist" aria-orientation="vertical">
              {SERVICES.map((service, i) => {
                const isActive = service.id === activeId;
                return (
                  <li key={service.id}>
                    <button
                      type="button"
                      role="tab"
                      id={`svc-tab-${service.id}`}
                      aria-selected={isActive}
                      aria-controls="svc-detail"
                      className={`services-summary__item${isActive ? ' is-active' : ''}`}
                      onClick={() => setActiveId(service.id)}
                    >
                      <span className="services-summary__num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="services-summary__name">{service.shortName}</span>
                      <span className="services-summary__arrow" aria-hidden="true">→</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Detalle */}
          <div className="cell large-7">
            <article
              id="svc-detail"
              role="tabpanel"
              aria-labelledby={`svc-tab-${active.id}`}
              className="services-summary__detail"
            >
              <span className="services-summary__icon" aria-hidden="true">
                <Icon name={active.icon} size={34} />
              </span>
              <div key={active.id} className="services-summary__detail-body">
                <span className="eyebrow">Información del servicio seleccionado</span>
                <h3>{active.title}</h3>
                <p>{active.description}</p>
                <ul className="services-summary__highlights">
                  {active.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <Link to="/servicios" className="text-link">
                  Ver servicios <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
