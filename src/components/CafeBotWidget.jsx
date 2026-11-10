import { useEffect, useRef, useState } from 'react';
import { useChat } from '../context/ChatContext';
import Icon from './Icon';

const CHATBOT_AVATAR_URL = '/images/chatbot.jpg?v=2';

export function CafeBotAvatar({ size = 40, showStatusDot = true, className = '' }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      className={`cafebot-avatar ${className}`.trim()}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {!imgFailed ? (
        <span className="cafebot-avatar__frame">
          <img
            src={CHATBOT_AVATAR_URL}
            alt=""
            className="cafebot-avatar__img"
            onError={() => setImgFailed(true)}
          />
        </span>
      ) : (
        <div className="cafebot-avatar__icon">
          <svg viewBox="0 0 36 36" width="70%" height="70%">
            <ellipse cx="18" cy="18" rx="14" ry="17" fill="var(--accent-secondary)" />
            <path
              d="M 18,3 C 12,12 24,24 18,33"
              fill="none"
              stroke="var(--bg-dark)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
      {showStatusDot && <span className="cafebot-avatar__status-dot" />}
    </div>
  );
}

/** Convierte fragmentos **en negrita** en elementos <strong> sin usar innerHTML. */
function formatRichText(text) {
  if (!text) return null;
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function ChatMessages() {
  const { messages, isLoading } = useChat();
  const containerRef = useRef(null);

  useEffect(() => {
    const scrollParent = containerRef.current?.parentElement;
    if (scrollParent) {
      scrollParent.scrollTo({
        top: scrollParent.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  return (
    <div className="chat-messages" ref={containerRef} role="log" aria-live="polite">
      <div className="chat-date-separator">
        <span>Hoy</span>
      </div>

      {messages.map((msg) => {
        const isBot = msg.sender === 'bot';
        return (
          <div
            key={msg.id}
            className={`chat-bubble-row chat-bubble-row--${isBot ? 'bot' : 'user'}`}
          >
            {isBot && <CafeBotAvatar size={34} showStatusDot={false} />}
            <div className="chat-bubble-container">
              <div className={`chat-bubble chat-bubble--${isBot ? 'bot' : 'user'}`}>
                <p className="chat-bubble__text">{formatRichText(msg.text)}</p>
              </div>
              <span className="chat-bubble__time">{msg.time}</span>
            </div>
          </div>
        );
      })}

      {isLoading && (
        <div className="chat-bubble-row chat-bubble-row--bot">
          <CafeBotAvatar size={34} showStatusDot={false} />
          <div className="chat-bubble-container">
            <div className="chat-bubble chat-bubble--bot chat-bubble--typing">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
            <span className="chat-bubble__time">Escribiendo...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function ChatInput() {
  const { sendMessage, isLoading } = useChat();
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    sendMessage(text);
    setText('');
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="chat-input-form__field"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe tu mensaje..."
        disabled={isLoading}
        aria-label="Mensaje para CaféBot"
      />
      <button
        type="submit"
        className="chat-input-form__btn cc-btn cc-btn--primary"
        disabled={!text.trim() || isLoading}
        aria-label="Enviar mensaje"
      >
        <span>Enviar</span>
        <Icon name="send" size={16} />
      </button>
    </form>
  );
}

export default function CafeBotWidget() {
  const { isWidgetOpen, toggleWidget, closeWidget } = useChat();

  return (
    <div className="cafebot-widget-root">
      {isWidgetOpen && (
        <div className="cafebot-widget-popover" role="dialog" aria-label="Chat con CaféBot">
          <header className="cafebot-widget-header">
            <div className="cafebot-widget-header__info">
              <CafeBotAvatar size={38} />
              <div>
                <h4 className="cafebot-widget-header__title">CaféBot</h4>
                <span className="cafebot-widget-header__status">
                  Asistente virtual CESURCAFÉ • En línea
                </span>
              </div>
            </div>
            <button
              type="button"
              className="cafebot-widget-close"
              onClick={closeWidget}
              aria-label="Cerrar chat flotante"
            >
              <Icon name="close" size={18} />
            </button>
          </header>

          <div className="cafebot-widget-body">
            <ChatMessages />
          </div>

          <footer className="cafebot-widget-footer">
            <ChatInput />
          </footer>
        </div>
      )}

      <button
        type="button"
        className={`cafebot-floating-btn ${isWidgetOpen ? 'is-active' : ''}`}
        onClick={toggleWidget}
        aria-label={isWidgetOpen ? 'Cerrar CaféBot' : 'Abrir CaféBot (Asistente Virtual)'}
        aria-expanded={isWidgetOpen}
      >
        <div className="cafebot-floating-btn__inner">
          {isWidgetOpen ? (
            <Icon name="close" size={24} />
          ) : (
            <>
              <CafeBotAvatar size={52} showStatusDot={false} className="cafebot-avatar--floating" />
              <span className="cafebot-floating-btn__badge">1</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
}
