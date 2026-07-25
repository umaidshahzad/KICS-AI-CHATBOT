"use client";

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '../../../store/store';
import { setActiveSession } from '../../../store/slices/chatSlice';
import { useState } from 'react';

export default function AllChatsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { sessions } = useSelector((state: RootState) => state.chat);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = sessions.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden relative">
      {/* Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant px-6 py-4 flex items-center justify-between sticky top-0 z-10 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-on-background">All Chats</h1>
          <p className="text-sm text-on-surface-variant">View and manage all your conversation history.</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-[1000px] mx-auto space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              type="text" 
              placeholder="Search all chats..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-[8px] pl-12 pr-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
            />
          </div>

          {/* Chats Grid */}
          {filteredSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSessions.map((session) => (
                <div 
                  key={session.id}
                  onClick={() => {
                    dispatch(setActiveSession(session.id));
                    router.push('/dashboard/chat');
                  }}
                  className="bg-surface-container-lowest border border-outline-variant rounded-[12px] p-5 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group flex flex-col h-[160px]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                    </div>
                    <span className="text-xs text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-[8px]">
                      {new Date(session.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-on-surface text-lg mb-1 truncate group-hover:text-primary transition-colors">
                    {session.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant line-clamp-2 mt-auto">
                    {session.messages.length > 0 
                      ? session.messages[session.messages.length - 1].content 
                      : "Empty chat session"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-surface-container rounded-[16px] border border-outline-variant/50 border-dashed">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">search_off</span>
              <h3 className="text-xl font-bold text-on-surface mb-2">No chats found</h3>
              <p className="text-on-surface-variant max-w-md mx-auto">
                We couldn't find any chats matching "{searchQuery}". Try a different keyword or start a new chat.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
