import { useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { CONTACT_INFO } from '../data/institutional';
import { CafeBotAvatar, ChatInput, ChatMessages } from '../components/CafeBotWidget';
import Icon from '../components/Icon';
import useScrollReveal from '../hooks/useScrollReveal';
import './Contacto.css';

const SUGGESTIONS = [
  'Líneas de investigación',
  'Proyectos de café',
  'Ubicación USCO',
  'Publicaciones',
];

export default function Contacto() {
  const { sendMessage, isLoading } = useChat();
  const pageRef = useRef(null);

  useScrollReveal(pageRef);

  return (
    <div className="contacto-page section-padding" ref={pageRef}>
      <div className="grid-container">
        <header className="contacto-hero section-header" data-reveal>
          <span className="eyebrow">Atención & Consultas</span>
          <h1>Contacto & CaféBot</h1>
          <p>
            Comunícate con nuestro equipo científico o resuelve tus dudas al instante con CaféBot,
            el asistente virtual de CESURCAFÉ impulsado por IA.
          </p>
        </header>

        <div className="contacto-layout grid-x grid-margin-x grid-margin-y">
          {/* Columna Izquierda: Sidebar con Sugerencias y Datos Institucionales */}
          <aside className="cell medium-12 large-4 contacto-sidebar">
            <div className="quick-suggestions-panel" data-reveal>
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

            <div className="contact-info-panel" data-reveal>
              <span className="eyebrow">Contacto institucional</span>
              <h3 className="contact-info-panel__title">Información de sede</h3>
              <div className="contact-info-list">
                <div className="contact-info-item">
                  <span className="contact-info-item__icon">
                    <Icon name="mail" size={20} />
                  </span>
                  <div className="contact-info-item__text">
                    <span className="contact-info-item__label">Correo institucional</span>
                    <a href={`mailto:${CONTACT_INFO.email}`} className="contact-info-item__val">
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="contact-info-item">
                  <span className="contact-info-item__icon">
                    <Icon name="pin" size={20} />
                  </span>
                  <div className="contact-info-item__text">
                    <span className="contact-info-item__label">Ubicación</span>
                    <span className="contact-info-item__val">
                      {CONTACT_INFO.location} ({CONTACT_INFO.institution})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Columna Derecha: Interfaz Completa de CaféBot */}
          <div className="cell medium-12 large-8 contacto-chat-col" data-reveal>
            <section className="contacto-chat-card" aria-label="Chat interactivo con CaféBot">
              <header className="contacto-chat-card__header">
                <div className="contacto-chat-card__header-info">
                  <CafeBotAvatar size={48} />
                  <div>
                    <h2 className="contacto-chat-card__title">CaféBot</h2>
                    <span className="contacto-chat-card__subtitle">
                      Asistente virtual CESURCAFÉ • En línea
                    </span>
                  </div>
                </div>
              </header>

              <div className="contacto-chat-card__messages">
                <ChatMessages />
              </div>

              <footer className="contacto-chat-card__footer">
                <ChatInput />
              </footer>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
