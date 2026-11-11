// Convierte resultados de la API de OpenAlex en el formato de src/data/publications.json.
// Módulo sin dependencias: lo usa scripts/sync-openalex.mjs.

/** Afiliación declarada que vincula un trabajo con el centro. */
export const CESURCAFE_AFFILIATION = /cesurcaf|centro surcolombiano de investigaci[oó]n en caf|south colombian coffee research/i;

/** Trabajos de los investigadores (vía ORCID) que se incluyen aunque no declaren a CESURCAFÉ. */
export const COFFEE_TOPIC = /coffee|coffea|caf[eé]/i;

const AREAS = [
  [/ferment|yeast|levadura|lactic|inocul|microb|candida/i, 'Fermentación'],
  [/acrylamide|hydroxymethylfurfural|contaminant|neo-?formed|exposure|safety/i, 'Inocuidad'],
  [/sorption|isotherm|drying|dried|dehydrat|moisture|storage|shelf/i, 'Poscosecha'],
  [/infrared|ftir|ft-nir|spectr|machine learning|chemometric|least squares/i, 'Espectroscopía'],
  [/sensory|sensorial|quality|consumer|roast|extraction|brew/i, 'Calidad sensorial'],
];
const DEFAULT_AREA = 'Agroindustria';

const LICENSES = {
  'cc-by': 'CC BY',
  'cc-by-sa': 'CC BY-SA',
  'cc-by-nc': 'CC BY-NC',
  'cc-by-nc-sa': 'CC BY-NC-SA',
  'cc-by-nd': 'CC BY-ND',
  'cc-by-nc-nd': 'CC BY-NC-ND',
  cc0: 'CC0',
  'public-domain': 'Dominio público',
};

const stripTags = (s) => String(s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const normalizeDoi = (d) => String(d ?? '').replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').toLowerCase() || null;
const orcidOf = (url) => (url ? String(url).replace(/^https?:\/\/orcid\.org\//i, '').toUpperCase() : null);

export function workType(w) {
  const source = w.primary_location?.source?.display_name ?? '';
  if (w.type === 'preprint' || w.type_crossref === 'posted-content') return 'Preprints';
  if (w.type_crossref === 'proceedings-article' || /symposium|congress|conference/i.test(source)) return 'Ponencias';
  if (w.type === 'book' || w.type === 'book-chapter') return 'Libros';
  if (w.type === 'dataset' || /data in brief/i.test(source)) return 'Datos';
  return 'Artículos';
}

export function workArea(title) {
  return (AREAS.find(([re]) => re.test(title)) ?? [null, DEFAULT_AREA])[1];
}

/**
 * @param {object} w            Trabajo de OpenAlex
 * @param {Map<string,string>} orcidToResearcher  ORCID → id del investigador en researchers.json
 */
export function parseOpenAlexWork(w, orcidToResearcher = new Map()) {
  const title = stripTags(w.title ?? w.display_name);
  const doi = normalizeDoi(w.doi);
  const journal = w.primary_location?.source?.display_name ?? null;
  const license = LICENSES[w.best_oa_location?.license ?? w.primary_location?.license] ?? null;
  const isOpenAccess = Boolean(w.open_access?.is_oa);
  const names = (w.authorships ?? []).map((a) => a.author?.display_name).filter(Boolean);
  const researcherIds = [
    ...new Set(
      (w.authorships ?? [])
        .map((a) => orcidToResearcher.get(orcidOf(a.author?.orcid)))
        .filter(Boolean),
    ),
  ];
  const type = workType(w);
  return {
    id: `oa-${String(w.id).split('/').pop()}`,
    title,
    area: workArea(title),
    type,
    status: isOpenAccess ? 'Acceso abierto' : 'Acceso restringido',
    year: w.publication_year ?? null,
    author: names.length > 3 ? `${names.slice(0, 3).join(', ')} et al.` : names.join(', '),
    journal,
    doi,
    // Con DOI, el enlace se arma en el sitio (https://doi.org/<doi>); sin DOI se guarda la página del editor.
    landingUrl: doi ? null : (w.primary_location?.landing_page_url ?? null),
    pdfUrl: isOpenAccess ? (w.best_oa_location?.pdf_url ?? null) : null,
    license,
    researcherIds,
    cesurcafeAffiliation: (w.authorships ?? []).some((a) =>
      (a.raw_affiliation_strings ?? []).some((s) => CESURCAFE_AFFILIATION.test(s)),
    ),
  };
}

const INSTITUTION_NAME = /universidad|university|universidade|instituto|institute|centro de investigaci/i;
const DATA_REPOSITORY = /figshare|mendeley data|zenodo|dryad/i;
const IMAGE_FILE = /\.(jpe?g|png|gif|webp)(\?.*)?$/i;
const titleKey = (t) =>
  String(t ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/**
 * Corrige problemas frecuentes de los metadatos de OpenAlex:
 * - instituciones registradas como autores,
 * - enlaces "PDF" que en realidad son imágenes,
 * - el mismo trabajo publicado como artículo y como conjunto de datos (Figshare, Mendeley Data…):
 *   se conserva el artículo y el DOI del conjunto de datos queda en `datasetDoi`.
 */
export function cleanPublications(pubs) {
  const byTitle = new Map();
  for (const original of pubs) {
    const p = { ...original, datasetDoi: original.datasetDoi ?? null };
    const etAl = / et al\.$/.test(p.author);
    const names = p.author.replace(/ et al\.$/, '').split(', ').filter((n) => n && !INSTITUTION_NAME.test(n));
    p.author = names.join(', ') + (etAl ? ' et al.' : '');
    if (p.pdfUrl && IMAGE_FILE.test(p.pdfUrl)) p.pdfUrl = null;

    const key = titleKey(p.title);
    const prev = byTitle.get(key);
    if (!prev) {
      byTitle.set(key, p);
      continue;
    }
    const pIsRepo = DATA_REPOSITORY.test(p.journal ?? '');
    const [keep, other] = pIsRepo ? [prev, p] : [p, prev];
    keep.researcherIds = [...new Set([...keep.researcherIds, ...other.researcherIds])];
    keep.cesurcafeAffiliation = keep.cesurcafeAffiliation || other.cesurcafeAffiliation;
    if (DATA_REPOSITORY.test(other.journal ?? '') && other.doi) keep.datasetDoi = other.doi;
    byTitle.set(key, keep);
  }
  return [...byTitle.values()];
}

/**
 * Une los trabajos afiliados a CESURCAFÉ con los trabajos sobre café de los investigadores.
 * Elimina duplicados por id de OpenAlex y por DOI, y ordena del más reciente al más antiguo.
 */
export function buildPublications(affiliatedWorks, researcherWorks, orcidToResearcher) {
  const seen = new Set();
  const out = [];
  const add = (w, requireCoffee) => {
    const pub = parseOpenAlexWork(w, orcidToResearcher);
    if (requireCoffee && !pub.cesurcafeAffiliation && !COFFEE_TOPIC.test(pub.title)) return;
    const keys = [pub.id, pub.doi].filter(Boolean);
    if (keys.some((k) => seen.has(k))) return;
    keys.forEach((k) => seen.add(k));
    out.push(pub);
  };
  affiliatedWorks.forEach((w) => add(w, false));
  researcherWorks.forEach((w) => add(w, true));
  return cleanPublications(out).sort(
    (a, b) => (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title, 'es'),
  );
}
