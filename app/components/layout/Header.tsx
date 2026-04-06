import React from 'react';
import { SearchIcon, BellIcon, UserIcon, ShareIcon, ExpandIcon, MoreHorizontalIcon } from '../icons';

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
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
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
              <button className="inline-flex h-12 items-center gap-2 rounded-[18px] border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                <ShareIcon size={16} />
                Share
              </button>
              <button className="inline-flex h-12 items-center gap-2 rounded-[18px] border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                <ExpandIcon size={16} />
                Expand
              </button>
              <button className="grid h-12 w-12 place-items-center rounded-[18px] border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50">
                <MoreHorizontalIcon size={18} />
              </button>
              <button className="relative grid h-12 w-12 place-items-center rounded-[18px] border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50">
                <BellIcon size={18} />
                <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>
              <button className="grid h-12 w-12 place-items-center rounded-[18px] border border-slate-200 bg-slate-900 text-white shadow-lg shadow-slate-900/10">
                <UserIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
