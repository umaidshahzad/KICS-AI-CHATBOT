"use client";

import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { ChatService } from '../../../services/chat.service';
import { setSessions, setActiveSession, addMessage, Message } from '../../../store/slices/chatSlice';
import { useSession } from 'next-auth/react';

export default function ChatPage() {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const { sessions, activeSessionId, status } = useSelector((state: RootState) => state.chat);
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    async function loadChats() {
      try {
        const data = await ChatService.fetchChats();
        dispatch(setSessions(data));
        if (data.length > 0 && !activeSessionId) {
          dispatch(setActiveSession(data[0].id));
        }
      } catch (err) {
        console.error("Failed to load chats", err);
      }
    }
    if (status === 'idle') loadChats();
  }, [dispatch, status, activeSessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeSession) return;

    const userMessage: Message = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    dispatch(addMessage({ sessionId: activeSession.id, message: userMessage }));
    setInput('');
    setIsSending(true);

    try {
      const res = await ChatService.sendMessage(activeSession.id, userMessage);
      dispatch(addMessage({ sessionId: activeSession.id, message: res.aiResponse }));
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setIsSending(false);
    }
  };

  if (status === 'loading') return <div className="p-8">Loading chats...</div>;

  return (
    <div className="flex-1 flex flex-col h-full relative">
      {/* Chat Feed Area */}
      <div className="flex-1 overflow-y-auto pb-32 px-4 md:px-8">
        <div className="max-w-[800px] mx-auto space-y-8 flex flex-col justify-end min-h-full py-8">
          
          {!activeSession?.messages.length && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-surface-container rounded-[8px] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px] text-primary">smart_toy</span>
              </div>
              <h2 className="text-2xl font-bold text-on-background mb-2">How can I help you today?</h2>
            </div>
          )}

          {activeSession?.messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 w-full ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-[8px] bg-primary-container text-on-primary-container flex items-center justify-center mt-1">
                  <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                </div>
              )}
              
              <div className={`flex-1 ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                <span className={`text-xs font-bold text-on-surface-variant block mb-1 ${msg.role === 'user' ? 'mr-2' : ''}`}>
                  {msg.role === 'user' ? 'You' : 'AI Studio'}
                </span>
                
                <div className={`${msg.role === 'user' ? 'max-w-[80%] border border-outline-variant bg-surface-container-lowest rounded-[8px] p-4 shadow-sm' : ''} text-body-md text-on-surface leading-relaxed`}>
                  {msg.content}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-[8px] overflow-hidden mt-1 bg-primary text-white flex items-center justify-center font-bold">
                  {session?.user?.name?.[0] || 'U'}
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent pt-12 pb-6 px-4 md:px-8">
        <div className="max-w-[800px] mx-auto relative">
          <div className="relative bg-surface-container-lowest border border-outline-variant rounded-[8px] shadow-sm focus-within:ring-2 focus-within:ring-primary-container transition-shadow">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="w-full bg-transparent border-none resize-none py-4 pl-12 pr-12 text-body-md text-on-surface focus:ring-0 max-h-32 overflow-y-auto outline-none" 
              placeholder="Send a message..." 
              rows={1} 
              style={{ minHeight: '56px' }}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">attach_file</span>
            </div>
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isSending}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-on-primary rounded-[8px] flex items-center justify-center hover:bg-surface-tint transition-colors shadow-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>
          <div className="text-center mt-2">
            <span className="text-xs text-outline">AI Studio can make mistakes. Consider verifying important information.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
