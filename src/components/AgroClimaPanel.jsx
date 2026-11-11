import { useCallback, useEffect, useState } from 'react';
import {
  HUILA_LOCATIONS,
  describeWeather,
  dryingAdvice,
  fetchAgroClimate,
} from '../services/openMeteo';
import './AgroClimaPanel.css';

const fmt = (n, digits = 0) =>
  typeof n === 'number' && Number.isFinite(n)
    ? n.toLocaleString('es-CO', { maximumFractionDigits: digits })
    : '—';

function dayLabel(isoDate, index) {
  if (index === 0) return 'Hoy';
  const d = new Date(`${isoDate}T12:00:00`);
  return d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' });
}

/**
 * Panel agroclimático en vivo para municipios cafeteros del Huila.
 * Consume la API pública de Open-Meteo directamente desde el navegador.
 */
export default function AgroClimaPanel() {
  const [locationId, setLocationId] = useState(HUILA_LOCATIONS[0].id);
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  const [reloadKey, setReloadKey] = useState(0);

  const location = HUILA_LOCATIONS.find((l) => l.id === locationId) ?? HUILA_LOCATIONS[0];

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, status: 'loading', error: null }));
    fetchAgroClimate(location, { signal: controller.signal })
      .then((data) => setState({ status: 'ready', data, error: null }))
      .catch((error) => {
        if (error.name === 'AbortError') return;
        console.error('Error consultando Open-Meteo:', error);
        setState({ status: 'error', data: null, error });
      });
    return () => controller.abort();
  }, [location, reloadKey]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);
  const { status, data } = state;
  const today = data?.days?.[0];
  const todayAdvice = today ? dryingAdvice(today.precipProbability, today.precipSum) : null;

  return (
    <section className="agroclima section-padding" aria-labelledby="agroclima-title">
      <div className="grid-container">
        <div className="agroclima__head">
          <header className="section-header">
            <span className="eyebrow">
              <span className="agroclima__live" aria-hidden="true" /> Datos en vivo · API Open-Meteo
            </span>
            <h2 id="agroclima-title">Monitoreo agroclimático del Huila</h2>
            <p className="agroclima__intro">
              Condiciones actuales y pronóstico de 7 días para municipios cafeteros, con una
              recomendación orientativa para el secado del grano.
            </p>
          </header>

          <div className="pill-tabs" role="tablist" aria-label="Seleccionar municipio">
            {HUILA_LOCATIONS.map((l) => (
              <button
                key={l.id}
                type="button"
                role="tab"
                aria-selected={l.id === locationId}
                className={`pill-tabs__btn${l.id === locationId ? ' is-active' : ''}`}
                onClick={() => setLocationId(l.id)}
              >
                {l.name}
              </button>
            ))}
          </div>
        </div>

        {status === 'error' ? (
          <div className="agroclima__error" role="alert">
            <p>No pudimos consultar el clima en este momento. Revisa tu conexión e intenta de nuevo.</p>
            <button type="button" className="cc-btn cc-btn--outline" onClick={retry}>
              Reintentar
            </button>
          </div>
        ) : (
          <div className={`agroclima__body${status === 'loading' ? ' is-loading' : ''}`} aria-busy={status === 'loading'}>
            <div className="agroclima__now">
              <div className="agroclima__now-main">
                <span className="agroclima__place">{location.name}, Huila</span>
                <strong className="agroclima__temp">{fmt(data?.current.temperature, 1)}°C</strong>
                <span className="agroclima__condition">
                  {data ? describeWeather(data.current.weatherCode) : 'Cargando…'}
                </span>
                {todayAdvice && (
                  <span className={`agroclima__advice agroclima__advice--${todayAdvice.level}`}>
                    Hoy: {todayAdvice.label}
                  </span>
                )}
              </div>

              <dl className="agroclima__metrics">
                <div>
                  <dt>Humedad relativa</dt>
                  <dd>{fmt(data?.current.humidity)} %</dd>
                </div>
                <div>
                  <dt>Lluvia actual</dt>
                  <dd>{fmt(data?.current.precipitation, 1)} mm</dd>
                </div>
                <div>
                  <dt>Viento</dt>
                  <dd>{fmt(data?.current.wind)} km/h</dd>
                </div>
                <div>
                  <dt>Humedad del suelo (3–9 cm)</dt>
                  <dd>
                    {data?.current.soilMoisture != null
                      ? `${fmt(data.current.soilMoisture * 100)} %`
                      : '—'}
                  </dd>
                </div>
                <div>
                  <dt>Evapotranspiración hoy</dt>
                  <dd>{fmt(today?.et0, 1)} mm</dd>
                </div>
              </dl>
            </div>

            <ol className="agroclima__days" aria-label="Pronóstico de 7 días">
              {(data?.days ?? Array.from({ length: 7 }, (_, i) => ({ date: String(i) }))).map(
                (d, i) => {
                  const advice = data ? dryingAdvice(d.precipProbability, d.precipSum) : null;
                  return (
                    <li key={d.date} className="agroclima__day">
                      <span className="agroclima__day-name">{data ? dayLabel(d.date, i) : '…'}</span>
                      <span className="agroclima__day-temp">
                        {fmt(d.max)}° <small>/ {fmt(d.min)}°</small>
                      </span>
                      <span className="agroclima__day-rain">
                        {fmt(d.precipProbability)} % · {fmt(d.precipSum, 1)} mm
                      </span>
                      {advice && (
                        <span
                          className={`agroclima__dot agroclima__dot--${advice.level}`}
                          title={advice.label}
                          aria-label={advice.label}
                        />
                      )}
                    </li>
                  );
                },
              )}
            </ol>
          </div>
        )}

        <p className="agroclima__credit">
          Datos meteorológicos de{' '}
          <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">
            Open-Meteo.com
          </a>{' '}
          (licencia CC BY 4.0). La recomendación de secado es orientativa y no reemplaza la
          observación en finca.
          {data?.updatedAt && <> Actualizado: {data.updatedAt.replace('T', ' ')} (hora local).</>}
        </p>
      </div>
    </section>
  );
}
