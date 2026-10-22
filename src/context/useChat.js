import { useContext } from 'react';
import { ChatContext } from './chatContextDef';

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChat debe ser usado dentro de un ChatProvider');
  }
  return ctx;
}
