import { useState, type ReactNode } from 'react';
import { askGemini } from '../services/gemini';
import { ChatContext, type ChatMessage } from './chatContextDef';

function formatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    sender: 'bot',
    text: '¡Hola! Soy CaféBot, el asistente virtual de CESURCAFÉ en la Universidad Surcolombiana. ¿En qué puedo orientarte hoy sobre nuestras investigaciones, proyectos o servicios?',
    time: '09:30 a. m.',
  },
];

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      time: formatTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        text: m.text,
      }));

      const reply = await askGemini(trimmed, history);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply,
        time: formatTime(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Error enviando mensaje a CaféBot:', err);
      const errorMsg: ChatMessage = {
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
