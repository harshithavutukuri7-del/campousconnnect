import type { Message } from './types';

const KEY = 'campusconnect-messages';

export const getMessagesForConversation = (conversationId: string) => {
  const saved = JSON.parse(localStorage.getItem(KEY) || '[]') as Message[];
  return saved.filter((message) => message.conversationId === conversationId);
};

export const sendMessage = (payload: Message) => {
  const saved = JSON.parse(localStorage.getItem(KEY) || '[]') as Message[];
  const updated = [...saved, payload];
  localStorage.setItem(KEY, JSON.stringify(updated));
  return payload;
};
