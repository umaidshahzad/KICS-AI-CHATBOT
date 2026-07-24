"use client";

import { useState } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Access Request', message: 'Jane Smith has requested access to the platform.', time: '2 mins ago', read: false },
    { id: 2, title: 'API Limit Reached', message: 'User John Doe has reached 90% of their API limit.', time: '1 hour ago', read: false },
    { id: 3, title: 'System Update', message: 'The platform will be undergoing scheduled maintenance at 2:00 AM UTC.', time: '1 day ago', read: true },
    { id: 4, title: 'New Model Available', message: 'GPT-4 Turbo is now available for all enterprise users.', time: '2 days ago', read: true },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="max-w-container-max mx-auto pb-8">
      {/* Header Area */}
      <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="font-headline-xl text-headline-xl font-bold text-primary mb-2 tracking-tight">Notifications</h2>
          <p className="text-on-surface-variant font-body-lg text-body-lg">Stay updated with the latest system alerts and user activities.</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="px-6 py-2.5 border border-outline-variant text-on-surface rounded-[8px] font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">done_all</span> Mark All as Read
        </button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="divide-y divide-outline-variant/50">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant font-body-md">
              You have no notifications.
            </div>
          ) : (
            notifications.map(notification => (
              <div key={notification.id} className={`p-6 flex items-start gap-4 transition-colors ${notification.read ? 'bg-transparent' : 'bg-primary/5'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.read ? 'bg-surface-variant text-on-surface-variant' : 'bg-primary-container text-primary'}`}>
                  <span className="material-symbols-outlined text-[20px]">
                    {notification.title.includes('Request') ? 'how_to_reg' : notification.title.includes('Limit') ? 'warning' : 'info'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-headline-sm text-headline-sm ${notification.read ? 'text-on-surface' : 'text-primary font-bold'}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-on-surface-variant whitespace-nowrap ml-4">{notification.time}</span>
                  </div>
                  <p className="text-on-surface-variant font-body-sm text-body-sm mb-3">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-3">
                    {!notification.read && (
                      <button 
                        onClick={() => setNotifications(notifications.map(n => n.id === notification.id ? { ...n, read: true } : n))}
                        className="text-primary text-xs font-bold uppercase tracking-wider hover:underline cursor-pointer"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(notification.id)}
                      className="text-error text-xs font-bold uppercase tracking-wider hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
