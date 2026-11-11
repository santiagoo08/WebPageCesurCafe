#!/usr/bin/env node
/**
 * Sincroniza los perfiles públicos ORCID de los investigadores de CESURCAFÉ.
 *
 * Lee   src/data/researchers.json   (campo "orcid" de cada investigador)
 * Escribe src/data/orcid-profiles.json (consumido por la sección "Nosotros")
 *
 * Uso:   npm run sync:orcid
 *
 * - Usa la API pública de ORCID (https://pub.orcid.org/v3.0), que permite leer
 *   datos públicos sin credenciales. Si defines ORCID_CLIENT_ID y
 *   ORCID_CLIENT_SECRET (credenciales gratuitas de la Public API), el script
 *   pide un token /read-public y obtiene límites de uso más altos.
 * - Se ejecuta en tu equipo o en el build, NUNCA en el navegador: las
 *   credenciales no llegan al bundle y el sitio sigue siendo 100 % estático.
 * - Si un perfil falla, se conserva la versión anterior en lugar de borrarla.
 * - Pruebas sin red: ORCID_FIXTURE_DIR=carpeta lee <orcid>.json desde disco.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RESEARCHERS_FILE = path.join(ROOT, 'src/data/researchers.json');
const OUTPUT_FILE = path.join(ROOT, 'src/data/orcid-profiles.json');

const API_BASE = 'https://pub.orcid.org/v3.0';
const MAX_WORKS = 25;
const TIMEOUT_MS = 20_000;

/** Valida el dígito de control ISO 7064 11-2 de un ORCID iD. */
export function isValidOrcid(id) {
  if (!/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(id)) return false;
  const digits = id.replace(/-/g, '');
  let total = 0;
  for (let i = 0; i < 15; i += 1) total = (total + Number(digits[i])) * 2;
  const result = (12 - (total % 11)) % 11;
  const check = result === 10 ? 'X' : String(result);
  return digits[15] === check;
}

const val = (node) => (node && typeof node === 'object' && 'value' in node ? node.value : node ?? null);

function normalizeDoi(doi) {
  return String(doi || '')
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
    .replace(/^doi:\s*/i, '')
    .toLowerCase();
}

const WORK_TYPES = {
  'journal-article': 'Artículo',
  book: 'Libro',
  'book-chapter': 'Capítulo de libro',
  'conference-paper': 'Ponencia',
  'conference-abstract': 'Resumen de congreso',
  'conference-poster': 'Póster',
  dissertation: 'Tesis',
  'dissertation-thesis': 'Tesis',
  report: 'Informe',
  preprint: 'Preprint',
  'data-set': 'Conjunto de datos',
  'research-technique': 'Técnica de investigación',
  other: 'Otro',
};

function parseWork(group) {
  const summary = group?.['work-summary']?.[0];
  if (!summary) return null;
  const ids = summary['external-ids']?.['external-id'] ?? [];
  const doiEntry = ids.find((e) => e['external-id-type'] === 'doi');
  const doi = doiEntry ? normalizeDoi(doiEntry['external-id-value']) : null;
  const url =
    (doi && `https://doi.org/${doi}`) ||
    val(summary.url) ||
    val(doiEntry?.['external-id-url']) ||
    val(ids[0]?.['external-id-url']) ||
    null;
  const year = Number(val(summary['publication-date']?.year)) || null;
  return {
    putCode: summary['put-code'] ?? null,
    title: val(summary.title?.title) ?? 'Sin título',
    year,
    type: WORK_TYPES[summary.type] ?? 'Otro',
    journal: val(summary['journal-title']),
    doi,
    url,
  };
}

function parseAffiliations(groups = []) {
  return groups
    .map((g) => g?.summaries?.[0]?.['employment-summary'])
    .filter(Boolean)
    .map((e) => ({
      organization: e.organization?.name ?? null,
      department: e['department-name'] ?? null,
      role: e['role-title'] ?? null,
      startYear: Number(val(e['start-date']?.year)) || null,
      current: !e['end-date'],
    }));
}

/**
 * ORCID puede listar el mismo trabajo dos veces (p. ej. una entrada con DOI y otra sin él).
 * Se agrupa por DOI o por título normalizado y se conserva la versión más completa.
 */
export function dedupeWorks(works) {
  const key = (w) =>
    String(w.title ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  const byKey = new Map();
  const doiSeen = new Map();
  for (const w of works) {
    const k = (w.doi && doiSeen.get(w.doi)) || key(w);
    const prev = byKey.get(k);
    if (!prev || (!prev.doi && w.doi)) byKey.set(k, w);
    if (w.doi) doiSeen.set(w.doi, k);
  }
  return [...byKey.values()];
}

/** Convierte el JSON de /record de ORCID en el formato compacto que usa el sitio. */
export function parseRecord(orcid, record) {
  const person = record?.person ?? {};
  const activities = record?.['activities-summary'] ?? {};
  const given = val(person.name?.['given-names']) ?? '';
  const family = val(person.name?.['family-name']) ?? '';
  const credit = val(person.name?.['credit-name']);

  const works = (activities.works?.group ?? [])
    .map(parseWork)
    .filter(Boolean)
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  const uniqueWorks = dedupeWorks(works);

  const affiliations = parseAffiliations(activities.employments?.['affiliation-group']);
  // Solo se muestra un cargo vigente (sin fecha de fin) para no presentar afiliaciones pasadas.
  const current = affiliations.find((a) => a.current) ?? null;

  return {
    orcid,
    url: `https://orcid.org/${orcid}`,
    name: credit || `${given} ${family}`.trim() || null,
    biography: person.biography?.content ?? null,
    keywords: (person.keywords?.keyword ?? []).map((k) => k.content).filter(Boolean),
    affiliation: current,
    worksCount: uniqueWorks.length,
    works: uniqueWorks.slice(0, MAX_WORKS),
  };
}

async function getToken() {
  const { ORCID_CLIENT_ID: id, ORCID_CLIENT_SECRET: secret } = process.env;
  if (!id || !secret) return null;
  const res = await fetch('https://orcid.org/oauth/token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: id,
      client_secret: secret,
      grant_type: 'client_credentials',
      scope: '/read-public',
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`No se pudo obtener el token ORCID (HTTP ${res.status})`);
  return (await res.json()).access_token;
}

async function fetchRecord(orcid, token) {
  const fixtureDir = process.env.ORCID_FIXTURE_DIR;
  if (fixtureDir) {
    return JSON.parse(await readFile(path.join(fixtureDir, `${orcid}.json`), 'utf8'));
  }
  const headers = { Accept: 'application/json', 'User-Agent': 'CESURCAFE-web/1.0 (cesurcafe@usco.edu.co)' };
  if (token) headers.Authorization = `Bearer ${token}`;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const res = await fetch(`${API_BASE}/${orcid}/record`, {
      headers,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.ok) return res.json();
    if (res.status === 404) throw new Error('ORCID iD no encontrado');
    if (res.status !== 429 && res.status < 500) throw new Error(`HTTP ${res.status}`);
    await new Promise((r) => setTimeout(r, 1500 * attempt));
  }
  throw new Error('ORCID no respondió tras 3 intentos');
}

async function main() {
  const researchers = JSON.parse(await readFile(RESEARCHERS_FILE, 'utf8'));
  let previous = { profiles: {} };
  try {
    previous = JSON.parse(await readFile(OUTPUT_FILE, 'utf8'));
  } catch {
    /* primera ejecución */
  }

  const token = await getToken().catch((err) => {
    console.warn(`⚠️  ${err.message}. Continuando sin token.`);
    return null;
  });

  const profiles = {};
  let ok = 0;
  let failed = 0;

  for (const r of researchers) {
    const orcid = String(r.orcid || '').trim().toUpperCase();
    if (!orcid) {
      console.log(`·  ${r.name}: sin ORCID iD (se omite)`);
      continue;
    }
    if (!isValidOrcid(orcid)) {
      console.error(`✖  ${r.name}: "${orcid}" no es un ORCID iD válido (formato 0000-0000-0000-0000)`);
      failed += 1;
      continue;
    }
    try {
      const profile = parseRecord(orcid, await fetchRecord(orcid, token));
      profiles[orcid] = profile;
      ok += 1;
      console.log(`✔  ${r.name} → ${profile.name ?? orcid} · ${profile.worksCount} trabajos`);
    } catch (err) {
      failed += 1;
      if (previous.profiles?.[orcid]) {
        profiles[orcid] = previous.profiles[orcid];
        console.warn(`⚠️  ${r.name}: ${err.message}. Se conserva el perfil anterior.`);
      } else {
        console.error(`✖  ${r.name}: ${err.message}`);
      }
    }
  }

  const output = { generatedAt: new Date().toISOString(), profiles };
  await writeFile(OUTPUT_FILE, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(`\nPerfiles actualizados: ${ok} · con errores: ${failed} → ${path.relative(ROOT, OUTPUT_FILE)}`);
  if (failed && !ok) process.exitCode = 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
