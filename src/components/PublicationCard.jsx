import { displayTitle, publicationSummary, publicationUrl, slugify, typeLabel } from '../data/institutional';

export default function PublicationCard({ publication, showStatus = false }) {
  const { title, titleEs, area, type, status, year, author, pdfUrl, datasetDoi, cesurcafeAffiliation } = publication;
  const shownTitle = displayTitle(publication);
  const url = publicationUrl(publication);
  const summary = publicationSummary(publication);

  return (
    <article className="pub-card">
      <div className={`pub-card__cover tone-${slugify(area)}`}>
        <span className="pill pill--light">{area}</span>
        <span className="pill pill--caramel">{typeLabel(type)}</span>
      </div>
      <div className="pub-card__body">
        <div className="pub-card__badges">
          {showStatus && status && (
            <span className={`pub-card__status pub-card__status--${slugify(status)}`}>{status}</span>
          )}
          {cesurcafeAffiliation && <span className="pub-card__status pub-card__status--centro">CESURCAFÉ</span>}
        </div>
        <h3 className="pub-card__title">
          {url ? (
            <a href={url} target="_blank" rel="noopener noreferrer">
              {shownTitle}
            </a>
          ) : (
            shownTitle
          )}
        </h3>
        {titleEs && <p className="pub-card__original">Título original: {title}</p>}
        {summary && <p className="pub-card__summary">{summary}</p>}
        <p className="pub-card__meta">
          {year} • {author}
        </p>
        {(url || pdfUrl || datasetDoi) && (
          <div className="pub-card__links">
            {url && (
              <a href={url} target="_blank" rel="noopener noreferrer">
                {publication.doi ? 'DOI' : 'Ver publicación'} ↗
              </a>
            )}
            {pdfUrl && (
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                PDF ↗
              </a>
            )}
            {datasetDoi && (
              <a href={`https://doi.org/${datasetDoi}`} target="_blank" rel="noopener noreferrer">
                Datos ↗
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
