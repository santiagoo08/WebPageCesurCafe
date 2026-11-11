#!/usr/bin/env node
/**
 * Llena el repositorio del sitio con publicaciones reales desde OpenAlex (https://openalex.org).
 *
 * Escribe src/data/publications.json con:
 *   1. Todos los trabajos donde algún autor declara afiliación a CESURCAFÉ.
 *   2. Los trabajos sobre café de los investigadores de researchers.json (por su ORCID).
 *
 * Uso:   npm run sync:openalex
 *
 * - OpenAlex es abierto (datos CC0) y gratuito. Funciona sin clave con un cupo diario pequeño,
 *   suficiente para esta sincronización. Con una clave gratuita (openalex.org/settings/api)
 *   el cupo es 10 veces mayor: define OPENALEX_API_KEY antes de ejecutar el script.
 * - Se ejecuta en tu equipo o en el build, no en el navegador.
 * - Si OpenAlex falla, el archivo anterior no se modifica.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPublications } from './openalex-parse.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RESEARCHERS_FILE = path.join(ROOT, 'src/data/researchers.json');
const OUTPUT_FILE = path.join(ROOT, 'src/data/publications.json');

const API = 'https://api.openalex.org/works';
const FIELDS = [
  'id',
  'doi',
  'title',
  'display_name',
  'publication_year',
  'type',
  'type_crossref',
  'primary_location',
  'best_oa_location',
  'open_access',
  'authorships',
].join(',');

// Paginación por número de página: a diferencia de `cursor`, no exige clave de API.
async function fetchAll(filter) {
  const results = [];
  for (let page = 1; page <= 50; page += 1) {
    const params = new URLSearchParams({ filter, select: FIELDS, per_page: '100', page: String(page) });
    if (process.env.OPENALEX_API_KEY) params.set('api_key', process.env.OPENALEX_API_KEY);
    const res = await fetch(`${API}?${params}`, {
      headers: { 'User-Agent': 'CESURCAFE-web/1.0 (cesurcafe@usco.edu.co)' },
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) throw new Error(`OpenAlex respondió HTTP ${res.status} para "${filter}"`);
    const data = await res.json();
    results.push(...data.results);
    if (results.length >= (data.meta?.count ?? 0) || data.results.length === 0) break;
  }
  return results;
}

async function main() {
  const researchers = JSON.parse(await readFile(RESEARCHERS_FILE, 'utf8'));
  const orcidToResearcher = new Map(
    researchers.filter((r) => r.orcid).map((r) => [r.orcid.toUpperCase(), r.id]),
  );

  const affiliated = await fetchAll('raw_affiliation_strings.search:cesurcafe');
  const orcids = [...orcidToResearcher.keys()].map((o) => `https://orcid.org/${o}`).join('|');
  const byResearchers = orcids ? await fetchAll(`authorships.author.orcid:${orcids}`) : [];

  const publications = buildPublications(affiliated, byResearchers, orcidToResearcher);
  await writeFile(OUTPUT_FILE, `${JSON.stringify(publications, null, 2)}\n`, 'utf8');

  const linked = publications.filter((p) => p.researcherIds.length).length;
  console.log(`✔  ${publications.length} publicaciones (${affiliated.length} con afiliación a CESURCAFÉ, ` +
    `${linked} enlazadas a investigadores del sitio) → ${path.relative(ROOT, OUTPUT_FILE)}`);
}

main().catch((err) => {
  console.error(`✖  ${err.message}. No se modificó publications.json.`);
  process.exit(1);
});
