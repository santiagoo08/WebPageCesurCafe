import { useEffect, useRef } from 'react';
import { useChat } from '../../context/useChat';
import CafeBotAvatar from './CafeBotAvatar';

export default function ChatMessages() {
  const { messages, isLoading } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="chat-messages" role="log" aria-live="polite">
      {/* Separador de fecha */}
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
                <p className="chat-bubble__text">{msg.text}</p>
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

      <div ref={bottomRef} />
    </div>
  );
}
