import { useState } from 'react';
import { WHO_WE_ARE_PANELS } from '../../data/institutional';
import MediaVisual from '../common/MediaVisual';

/** Cabecera "¿Quiénes somos?" + galería acordeón de 4 franjas. */
export default function WhoWeAre() {
  const [active, setActive] = useState(0);

  return (
    <section className="who section-padding">
      <div className="grid-container">
        <div className="grid-x grid-margin-x align-bottom who__head">
          <div className="cell large-6">
            <span className="eyebrow">Centro de investigación</span>
            <h1 className="who__title">¿Quiénes somos?</h1>
          </div>
          <div className="cell large-6">
            <p className="who__desc">
              “Somos el Centro Surcolombiano de Investigación en Café (CESURCAFÉ) de la Universidad
              Surcolombiana, orientados al desarrollo tecnológico y agroindustrial de la región.”
            </p>
          </div>
        </div>

        <div className="who__accordion" role="list">
          {WHO_WE_ARE_PANELS.map((panel, i) => {
            const isActive = i === active;
            return (
              <button
                key={panel.title}
                type="button"
                role="listitem"
                aria-current={isActive}
                className={`who__panel${isActive ? ' is-active' : ''}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <MediaVisual
                  tone={panel.tone}
                  image={panel.image}
                  video={panel.video}
                  className="who__media"
                />
                <span className="who__panel-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="who__panel-text">
                  <span className="who__panel-title">{panel.title}</span>
                  <span className="who__panel-caption">{panel.caption}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
