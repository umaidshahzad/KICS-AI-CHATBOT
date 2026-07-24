import { ChatSession, Message } from '../store/slices/chatSlice';

const BASE_URL = '/api/mock/chats';

export const ChatService = {
  fetchChats: async (): Promise<ChatSession[]> => {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error('Failed to fetch chats');
    return response.json();
  },

  sendMessage: async (sessionId: string, message: Message): Promise<{ success: boolean; aiResponse: Message }> => {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, message }),
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  }
};
