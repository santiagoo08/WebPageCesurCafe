/**
 * Cliente de la API Open-Meteo (https://open-meteo.com).
 * - Gratuita para uso no comercial, sin clave ni registro.
 * - Se consulta en vivo desde el navegador (la API permite CORS).
 * - Licencia de datos CC BY 4.0: el sitio debe mostrar la atribución.
 */

const API_URL = 'https://api.open-meteo.com/v1/forecast';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutos: evita llamadas repetidas al cambiar de pestaña
const cache = new Map();

/** Municipios cafeteros del Huila (coordenadas aproximadas de la cabecera municipal). */
export const HUILA_LOCATIONS = [
  { id: 'neiva', name: 'Neiva', latitude: 2.9273, longitude: -75.2819 },
  { id: 'pitalito', name: 'Pitalito', latitude: 1.8537, longitude: -76.0507 },
  { id: 'garzon', name: 'Garzón', latitude: 2.1959, longitude: -75.6278 },
  { id: 'la-plata', name: 'La Plata', latitude: 2.3897, longitude: -75.8916 },
];

/** Códigos WMO de Open-Meteo traducidos al español. */
const WEATHER_CODES = {
  0: 'Despejado',
  1: 'Mayormente despejado',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Niebla',
  48: 'Niebla con escarcha',
  51: 'Llovizna ligera',
  53: 'Llovizna',
  55: 'Llovizna intensa',
  61: 'Lluvia ligera',
  63: 'Lluvia',
  65: 'Lluvia fuerte',
  80: 'Chubascos ligeros',
  81: 'Chubascos',
  82: 'Chubascos fuertes',
  95: 'Tormenta',
  96: 'Tormenta con granizo',
  99: 'Tormenta fuerte con granizo',
};

export function describeWeather(code) {
  return WEATHER_CODES[code] ?? 'Condición variable';
}

/**
 * Recomendación orientativa para el secado del café al sol según la lluvia pronosticada.
 * No reemplaza la observación en finca.
 */
export function dryingAdvice(precipProbability, precipSum) {
  if (precipProbability >= 60 || precipSum >= 5) {
    return { level: 'bad', label: 'Desfavorable para secado' };
  }
  if (precipProbability >= 30 || precipSum >= 1) {
    return { level: 'warn', label: 'Secado con precaución' };
  }
  return { level: 'good', label: 'Favorable para secado' };
}

function buildUrl({ latitude, longitude }) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code',
    hourly: 'soil_moisture_3_to_9cm',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,et0_fao_evapotranspiration',
    timezone: 'America/Bogota',
    forecast_days: '7',
  });
  return `${API_URL}?${params}`;
}

/** Convierte la respuesta cruda de Open-Meteo en el formato que usa el panel. */
export function parseForecast(data) {
  const { current = {}, daily = {}, hourly = {} } = data ?? {};

  // Humedad del suelo de la hora actual (la API la entrega por horas en m³/m³)
  let soilMoisture = null;
  if (Array.isArray(hourly.time) && current.time) {
    const idx = hourly.time.indexOf(current.time.slice(0, 13) + ':00');
    const value = hourly.soil_moisture_3_to_9cm?.[idx >= 0 ? idx : 0];
    soilMoisture = typeof value === 'number' ? value : null;
  }

  const days = (daily.time ?? []).map((date, i) => ({
    date,
    weatherCode: daily.weather_code?.[i],
    max: daily.temperature_2m_max?.[i],
    min: daily.temperature_2m_min?.[i],
    precipSum: daily.precipitation_sum?.[i] ?? 0,
    precipProbability: daily.precipitation_probability_max?.[i] ?? 0,
    et0: daily.et0_fao_evapotranspiration?.[i] ?? null,
  }));

  return {
    updatedAt: current.time ?? null,
    current: {
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      precipitation: current.precipitation,
      wind: current.wind_speed_10m,
      weatherCode: current.weather_code,
      soilMoisture,
    },
    days,
  };
}

/** Obtiene el pronóstico agroclimático de una ubicación (con caché en memoria). */
export async function fetchAgroClimate(location, { signal } = {}) {
  const cached = cache.get(location.id);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.value;

  const res = await fetch(buildUrl(location), { signal });
  if (!res.ok) {
    throw new Error(`Open-Meteo respondió con el estado ${res.status}`);
  }
  const value = parseForecast(await res.json());
  cache.set(location.id, { at: Date.now(), value });
  return value;
}
