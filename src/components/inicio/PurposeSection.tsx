import { PURPOSE_CARDS } from '../../data/institutional';
import Icon from '../common/Icon';

/** Bloque oscuro con Misión, Visión y Logros (XY Grid de Foundation). */
export default function PurposeSection() {
  return (
    <section className="purpose on-dark section-padding">
      <div className="grid-container">
        <div className="grid-x grid-margin-x grid-margin-y small-up-1 medium-up-3">
          {PURPOSE_CARDS.map((card) => (
            <div className="cell" key={card.title}>
              <article className="purpose__card">
                <span className="purpose__icon">
                  <Icon name={card.icon} size={26} />
                </span>
                <span className="eyebrow">{card.eyebrow}</span>
                <h2 className="purpose__title">{card.title}</h2>
                <p className="purpose__text">“{card.text}”</p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
