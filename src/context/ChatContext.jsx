import { createContext, useContext, useRef, useState } from 'react';
import { askGemini } from '../services/gemini';

const ChatContext = createContext(undefined);

function formatTime(date = new Date()) {
  return date.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

const INITIAL_MESSAGES = [
  {
    id: 'welcome-1',
    sender: 'bot',
    text: '¡Hola! Soy **CaféBot**, el asistente virtual de **CESURCAFÉ** en la Universidad Surcolombiana. ¿En qué puedo orientarte hoy sobre nuestras investigaciones, proyectos o servicios?',
    time: '09:30 a. m.',
  },
];

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const messagesRef = useRef(INITIAL_MESSAGES);

  const sendMessage = async (text) => {
    const trimmed = String(text ?? '').trim();
    if (!trimmed || isLoading) return;

    const historySnapshot = messagesRef.current.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      text: m.text,
    }));

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      time: formatTime(),
    };

    setMessages((prev) => {
      const next = [...prev, userMsg];
      messagesRef.current = next;
      return next;
    });
    setIsLoading(true);

    try {
      const reply = await askGemini(trimmed, historySnapshot);

      setMessages((prev) => {
        const next = [
          ...prev,
          { id: `bot-${Date.now()}`, sender: 'bot', text: reply, time: formatTime() },
        ];
        messagesRef.current = next;
        return next;
      });
    } catch (err) {
      console.error('Error enviando mensaje a CaféBot:', err);
      setMessages((prev) => {
        const next = [
          ...prev,
          {
            id: `bot-err-${Date.now()}`,
            sender: 'bot',
            text: 'Ocurrió un problema temporal al procesar tu solicitud. Por favor intenta de nuevo.',
            time: formatTime(),
          },
        ];
        messagesRef.current = next;
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWidget = () => setIsWidgetOpen((open) => !open);
  const closeWidget = () => setIsWidgetOpen(false);

  return (
    <ChatContext.Provider
      value={{ messages, isLoading, isWidgetOpen, sendMessage, toggleWidget, closeWidget }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChat debe ser usado dentro de un ChatProvider');
  }
  return ctx;
}
