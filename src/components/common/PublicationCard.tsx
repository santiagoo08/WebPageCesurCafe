import type { Publication } from '../../data/publications';
import { slugify, typeLabel } from '../../data/publications';
import './PublicationCard.css';

interface PublicationCardProps {
  publication: Publication;
  /** Muestra el estado (Finalizado / Activo) — usado en la vista Repositorio. */
  showStatus?: boolean;
}

export default function PublicationCard({ publication, showStatus = false }: PublicationCardProps) {
  const { title, summary, area, type, status, year, author } = publication;

  return (
    <article className="pub-card">
      <div className={`pub-card__cover tone-${slugify(area)}`}>
        <span className="pill pill--light">{area}</span>
        <span className="pill pill--caramel">{typeLabel(type)}</span>
      </div>
      <div className="pub-card__body">
        {showStatus && (
          <span className={`pub-card__status pub-card__status--${slugify(status)}`}>
            {status}
          </span>
        )}
        <h3 className="pub-card__title">{title}</h3>
        <p className="pub-card__summary">{summary}</p>
        <p className="pub-card__meta">
          {year} • {author}
        </p>
      </div>
    </article>
  );
}
