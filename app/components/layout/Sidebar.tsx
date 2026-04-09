import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import {
  HomeIcon,
  ListIcon,
  SettingsIcon,
  LogoutIcon,
  MenuIcon,
  XIcon,
  UserIcon,
} from '../icons';

interface SidebarProps {
  onLogout: () => void;
  userName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout, userName = 'User' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { icon: HomeIcon, label: 'Dashboard', href: '/app/dashboard' },
    { icon: ListIcon, label: 'My Tasks', href: '/app/tasks' },
    { icon: SettingsIcon, label: 'Settings', href: '/app/settings' },
  ];

  const renderNavItem = (
    href: string,
    label: string,
    Icon: React.FC<{ size?: number; className?: string }>,
    isDesktopRail = false
  ) => {
    const active = location.pathname === href;

    return (
      <Link
        key={href}
        to={href}
        onClick={() => setIsOpen(false)}
        aria-label={label}
        className={`group flex items-center gap-3 rounded-[22px] transition-all duration-200 ${isDesktopRail
          ? `w-full px-4 py-3 justify-start ${active ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/15' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`
          : `px-4 py-3 ${active ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/15' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`
          }`}
      >
        <Icon size={20} className="shrink-0" />
        <span className={`${isDesktopRail ? 'text-sm font-medium' : 'text-sm font-medium'}`}>{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed left-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-900/10"
        aria-label="Toggle navigation"
      >
        {isOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
      </button>

      {/* Desktop rail */}
      <aside className="app-rail sticky top- hidden h-[calc(100vh-3rem)] w-65 shrink-0 flex-col rounded-[28px] px-4 py-4 md:flex">
        <div className="flex items-center gap-3 rounded-3xl border border-slate-200/70 bg-slate-50/80 px-4 py-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-sm font-semibold text-white shadow-lg shadow-slate-900/20">
            S
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">TaskHub</p>
            <p className="text-xs text-slate-500">Task Management</p>
          </div>
        </div>

        <div className="mt-4 rounded-[22px] border border-slate-200/70 bg-gradient-to-br from-[#f8f3ff] to-[#eef4ff] p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-900 shadow-sm">
              <UserIcon size={18} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{userName}</p>
              <p className="text-xs text-slate-500">Product lead</p>
            </div>
          </div>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-3">
          {navItems.map(({ icon: Icon, label, href }) => renderNavItem(href, label, Icon, true))}
        </nav>

        <div className="mt-4 border-t border-slate-200/70 pt-4">
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-[22px] px-4 py-3 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
            aria-label="Logout"
          >
            <LogoutIcon size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile sheet */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-[290px] border-r border-slate-200/70 bg-white/95 text-slate-900 shadow-2xl shadow-slate-900/10 transition-transform duration-300 md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex h-full flex-col p-4">
          <div className="flex items-center gap-3 rounded-[24px] border border-slate-200/70 bg-slate-50/80 px-4 py-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-sm font-semibold text-white shadow-lg shadow-slate-900/20">
              S
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">TaskHub</p>
              <p className="text-xs text-slate-500">Task Management</p>
            </div>
          </div>

          <div className="mt-4 rounded-[24px] border border-slate-200/70 bg-gradient-to-br from-[#f8f3ff] to-[#eef4ff] p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-900 shadow-sm">
                <UserIcon size={18} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{userName}</p>
                <p className="text-xs text-slate-500">Product lead</p>
              </div>
            </div>
          </div>

          <nav className="mt-6 flex flex-1 flex-col gap-3">
            {navItems.map(({ icon: Icon, label, href }) => renderNavItem(href, label, Icon))}
          </nav>

          <div className="border-t border-slate-200/70 pt-4">
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-[22px] px-4 py-3 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              <LogoutIcon size={20} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/30 backdrop-blur-[2px] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
