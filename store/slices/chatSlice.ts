import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  lastUpdated: string;
  messages: Message[];
}

interface ChatState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ChatState = {
  sessions: [],
  activeSessionId: null,
  status: 'idle',
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSessions: (state, action: PayloadAction<ChatSession[]>) => {
      state.sessions = action.payload;
    },
    setActiveSession: (state, action: PayloadAction<string>) => {
      state.activeSessionId = action.payload;
    },
    addMessage: (state, action: PayloadAction<{ sessionId: string; message: Message }>) => {
      const session = state.sessions.find(s => s.id === action.payload.sessionId);
      if (session) {
        session.messages.push(action.payload.message);
        session.lastUpdated = new Date().toISOString();
      }
    },
    createNewSession: (state, action: PayloadAction<ChatSession>) => {
      state.sessions.unshift(action.payload);
      state.activeSessionId = action.payload.id;
    }
  },
});

export const { setSessions, setActiveSession, addMessage, createNewSession } = chatSlice.actions;
export default chatSlice.reducer;
