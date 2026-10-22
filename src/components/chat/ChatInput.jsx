import { useState } from 'react';
import { useChat } from '../../context/useChat';
import Icon from '../common/Icon';

export default function ChatInput() {
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
