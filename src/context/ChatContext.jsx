/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import { WELCOME_MESSAGE, askGemini } from '../services/gemini';

const ChatContext = createContext(undefined);

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChat debe usarse dentro de un ChatProvider');
  }
  return ctx;
}

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
    text: WELCOME_MESSAGE,
    time: '09:30 a. m.',
  },
];

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      time: formatTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const reply = await askGemini(trimmed, history);

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply,
        time: formatTime(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Error enviando mensaje a CaféBot:', err);
      const errorMsg = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: 'Ocurrió un problema temporal al procesar tu solicitud. Por favor intenta de nuevo.',
        time: formatTime(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWidget = () => setIsWidgetOpen((open) => !open);
  const openWidget = () => setIsWidgetOpen(true);
  const closeWidget = () => setIsWidgetOpen(false);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        isWidgetOpen,
        sendMessage,
        toggleWidget,
        openWidget,
        closeWidget,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
