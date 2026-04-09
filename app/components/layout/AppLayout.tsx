import React from 'react';
import { Sidebar } from './Sidebar';
import { Header, type HeaderProps } from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
  headerProps?: HeaderProps;
  userName?: string;
  onLogout: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  headerProps,
  userName,
  onLogout,
}) => {
  return (
    <div className="app-canvas h-screen overflow-hidden px-3 py-3 md:px-3 md:py-3">
      <div className="mx-auto flex h-full max-w-430 items-center gap-4 overflow-hidden bg-transparent">
        <Sidebar onLogout={onLogout} userName={userName} />

        <main className="app-shell flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-transparent">
          <Header {...headerProps} />

          <div className="scrollbar-thin flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
