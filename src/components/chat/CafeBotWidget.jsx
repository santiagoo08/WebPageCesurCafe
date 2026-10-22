import { useChat } from '../../context/useChat';
import CafeBotAvatar from './CafeBotAvatar';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import Icon from '../common/Icon';
import './Chat.css';

export default function CafeBotWidget() {
  const { isWidgetOpen, toggleWidget, closeWidget } = useChat();

  return (
    <div className="cafebot-widget-root">
      {/* Popover / Modal de conversación flotante */}
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

      {/* Botón flotante siempre visible en la esquina inferior derecha */}
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
              <CafeBotAvatar size={34} showStatusDot={false} />
              <span className="cafebot-floating-btn__badge">1</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
}
