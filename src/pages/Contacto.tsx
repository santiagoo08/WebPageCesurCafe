import QuickSuggestions from '../components/contacto/QuickSuggestions';
import ContactInfo from '../components/contacto/ContactInfo';
import CafeBotAvatar from '../components/chat/CafeBotAvatar';
import ChatMessages from '../components/chat/ChatMessages';
import ChatInput from '../components/chat/ChatInput';
import './Contacto.css';

export default function Contacto() {
  return (
    <div className="contacto-page section-padding">
      <div className="grid-container">
        <header className="contacto-hero section-header">
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
            <QuickSuggestions />
            <ContactInfo />
          </aside>

          {/* Columna Derecha: Interfaz Completa de CaféBot */}
          <main className="cell medium-12 large-8 contacto-chat-col">
            <section className="contacto-chat-card" aria-label="Chat interactivo con CaféBot">
              {/* Cabecera del Chat */}
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

              {/* Área de Mensajes */}
              <div className="contacto-chat-card__messages">
                <ChatMessages />
              </div>

              {/* Barra de Entrada Inferior */}
              <footer className="contacto-chat-card__footer">
                <ChatInput />
              </footer>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
