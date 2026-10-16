import { useChat } from '../../context/useChat';

const SUGGESTIONS = [
  'Líneas de investigación',
  'Proyectos de café',
  'Ubicación USCO',
  'Publicaciones',
] as const;

export default function QuickSuggestions() {
  const { sendMessage, isLoading } = useChat();

  return (
    <div className="quick-suggestions-panel">
      <span className="eyebrow">Sugerencias rápidas</span>
      <h3 className="quick-suggestions-panel__title">Preguntas frecuentes</h3>
      <p className="quick-suggestions-panel__desc">
        Haz clic en una consulta rápida para iniciar la conversación con CaféBot:
      </p>
      <div className="quick-suggestions-list">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className="quick-suggestion-btn"
            disabled={isLoading}
            onClick={() => sendMessage(suggestion)}
          >
            <span>{suggestion}</span>
            <span className="quick-suggestion-btn__arrow" aria-hidden="true">
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
