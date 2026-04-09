import React, { useEffect, useState, useRef } from 'react';
import { SearchIcon, BellIcon, UserIcon, TrashIcon, CheckCircle2Icon, ClockIcon } from '../icons';
import { notifApi, type ApiNotification, type ApiUser } from '../../api';
import { getUser } from '../../auth';
import { Toast, ToastContainer } from '../common';

// Simple relative time helper
function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Dashboard',
  subtitle,
  showSearch = true,
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState<ApiNotification[]>([]);
  const [user, setUser] = useState<ApiUser | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastNotifId = useRef<number | null>(null);

  const fetchNotifs = async (isFirstLoad = false) => {
    const currentUser = getUser();
    if (!currentUser) return;
    
    try {
      const { notifications: list } = await notifApi.getAll(currentUser.id, { limit: 10 });
      const { count } = await notifApi.getUnreadCount(currentUser.id);
      
      if (!isFirstLoad && list.length > 0) {
        const newNotifs = list.filter(n => lastNotifId.current !== null && n.id > lastNotifId.current);
        if (newNotifs.length > 0) setToasts(prev => [...prev, ...newNotifs]);
      }
      
      if (list.length > 0) lastNotifId.current = Math.max(...list.map(n => n.id));
      setNotifications(list);
      setUnreadCount(count);
    } catch (err) {
      console.error('[Header] Fetch notifs failed:', err);
    }
  };

  useEffect(() => {
    setUser(getUser());
    fetchNotifs(true);
    const interval = setInterval(() => fetchNotifs(false), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const markAsRead = async (id: number) => {
    try {
      await notifApi.markAsRead(id);
      fetchNotifs(true);
    } catch (err) {
      console.error('Mark as read failed:', err);
    }
  };

  const markAllRead = async () => {
    const currentUser = getUser();
    if (currentUser) {
      try {
        await notifApi.markAllAsRead(currentUser.id);
        fetchNotifs(true);
      } catch (err) {
        console.error('Mark all read failed:', err);
      }
    }
  };

  const deleteNotif = async (id: number) => {
    try {
      await notifApi.delete(id);
      fetchNotifs(true);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => String(t.id) !== id));
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
        <div className="flex flex-col gap-4 px-5 py-5 lg:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />{' '}
                Distributed Task Management
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{title}</h1>
                {subtitle && <p className="mt-1 max-w-2xl text-sm text-slate-500 md:text-base">{subtitle}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {showSearch && (
                <div className="flex min-w-0 items-center gap-3 rounded-[20px] border border-slate-200 bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:w-[340px]">
                  <SearchIcon size={18} className="text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tasks, people, or tags"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`relative grid h-12 w-12 place-items-center rounded-[18px] border transition-all ${
                      isDropdownOpen ? 'border-slate-900 bg-slate-50' : 'border-slate-200 bg-white hover:bg-slate-50'
                    } text-slate-700`}
                  >
                    <BellIcon size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                    )}
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-[360px] origin-top-right rounded-[24px] border border-slate-200 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.15)] ring-1 ring-slate-900/5">
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">Notifications</h3>
                          {unreadCount > 0 && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                        </div>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-xs font-medium text-blue-600 hover:text-blue-700">
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="scrollbar-thin max-h-[400px] overflow-y-auto px-1 space-y-1">
                        {notifications.length === 0 ? (
                          <div className="flex h-32 flex-col items-center justify-center text-center opacity-50">
                            <BellIcon size={24} className="mb-2" />
                            <p className="text-sm">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n.id} 
                              className={`group relative flex gap-3 rounded-[18px] p-3 transition-colors ${
                                n.is_read ? 'hover:bg-slate-50' : 'bg-slate-50/70 hover:bg-slate-50'
                              }`}
                            >
                              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                                n.type === 'completion' ? 'bg-emerald-100 text-emerald-700' : 
                                n.type === 'reminder' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {n.type === 'completion' ? <CheckCircle2Icon size={16} /> : <BellIcon size={16} />}
                              </div>
                              <div className="flex-1 min-w-0 pr-6">
                                <p className={`text-sm ${n.is_read ? 'text-slate-600' : 'font-semibold text-slate-900'}`}>{n.title}</p>
                                <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">{n.message}</p>
                                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-slate-400">
                                  <ClockIcon size={10} />
                                  <span>{timeAgo(new Date(n.created_at))}</span>
                                </div>
                              </div>
                              
                              <div className="absolute right-3 top-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!n.is_read && (
                                  <button onClick={() => markAsRead(n.id)} className="grid h-6 w-6 place-items-center rounded-full bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200">
                                    <CheckCircle2Icon size={12} />
                                  </button>
                                )}
                                <button onClick={() => deleteNotif(n.id)} className="grid h-6 w-6 place-items-center rounded-full bg-white text-rose-600 shadow-sm ring-1 ring-slate-200">
                                  <TrashIcon size={12} />
                                </button>
                              </div>

                              {!n.is_read && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-blue-500 group-hover:hidden" />
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      <div className="mt-2 border-t border-slate-100 p-2">
                         <p className="text-center text-[10px] text-slate-400 italic">Cloud B real-time notifications</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 ml-2">
                  <div className="grid h-12 w-12 place-items-center rounded-[18px] border border-slate-200 bg-slate-900 text-white shadow-lg shadow-slate-900/10">
                    <UserIcon size={18} />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-slate-900 truncate max-w-[100px]">{user?.username ?? 'Account'}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Logged in</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <ToastContainer>
        {toasts.map(t => (
          <Toast 
            key={t.id}
            id={String(t.id)}
            title={t.title}
            message={t.message}
            type={t.type}
            onClose={removeToast}
          />
        ))}
      </ToastContainer>
    </>
  );
};
