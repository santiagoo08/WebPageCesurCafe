import { createContext } from 'react';

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export interface ChatContextValue {
  messages: ChatMessage[];
  isLoading: boolean;
  isWidgetOpen: boolean;
  sendMessage: (text: string) => Promise<void>;
  toggleWidget: () => void;
  openWidget: () => void;
  closeWidget: () => void;
}

export const ChatContext = createContext<ChatContextValue | undefined>(undefined);
