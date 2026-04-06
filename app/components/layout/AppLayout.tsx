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
    <div className="app-canvas px-3 py-3 md:px-6 md:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1720px] items-start gap-4 md:min-h-[calc(100vh-3rem)]">
        <Sidebar onLogout={onLogout} userName={userName} />

        <main className="app-shell flex min-w-0 flex-1 flex-col">
          <Header {...headerProps} />

          <div className="flex-1 overflow-auto px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
