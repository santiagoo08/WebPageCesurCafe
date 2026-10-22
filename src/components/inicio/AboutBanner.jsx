import { Link } from 'react-router';

/** Banner horizontal "Conoce más sobre nosotros". */
export default function AboutBanner() {
  return (
    <section className="about-banner section-padding">
      <div className="grid-container">
        <div className="about-banner__card grid-x align-middle">
          <div className="cell auto">
            <span className="eyebrow">Conoce más sobre nosotros</span>
            <h2 className="about-banner__title">Personas, investigación y territorio</h2>
            <p className="about-banner__text">
              “Conoce al equipo de investigadores, nuestra historia y los proyectos que impulsan
              CESURCAFÉ.”
            </p>
            <Link to="/nosotros" className="text-link">
              Visitar Nosotros <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="cell shrink show-for-medium">
            <span className="about-banner__badge" aria-hidden="true">
              01
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
