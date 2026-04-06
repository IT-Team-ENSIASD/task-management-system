import type React from 'react';

export interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export const SearchIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <circle cx="9" cy="9" r="7" />
    <path d="M13.5 13.5L18 18" />
  </svg>
);

export const BellIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <path d="M10 2c0 0-3 0-4 3v3c0 2-1 3-1 3h10s-1-1-1-3V5c-1-3-4-3-4-3z" />
    <path d="M8 17h4" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <path d="M7 10a3 3 0 1 0 6 0 3 3 0 0 0-6 0z" />
    <path d="M2.458 12C1.732 10.684 1 8.965 1 7a6 6 0 1 1 12 0c0 1.965-.732 3.684-1.458 5" />
  </svg>
);

export const LogoutIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <path d="M13 6l4 4m0 0l-4 4m4-4H7" />
    <path d="M13 6V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1" />
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <circle cx="10" cy="10" r="1.5" />
    <path d="M10 4.5V3M10 17v-1.5M15.5 10h1.5M4.5 10H3M13.36 13.36l1.06 1.06M5.58 5.58L4.52 4.52M13.36 6.64l1.06-1.06M5.58 14.42l-1.06 1.06" />
  </svg>
);

export const MenuIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export const XIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <polyline points="17 6 9 14 3 8" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <polyline points="6 8 10 12 14 8" />
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <polyline points="8 6 12 10 8 14" />
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <rect x="2" y="3" width="16" height="16" rx="2" />
    <path d="M6 1v4M14 1v4" />
    <line x1="2" y1="8" x2="18" y2="8" />
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <circle cx="10" cy="10" r="8" />
    <polyline points="10 6 10 10 14 14" />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <line x1="10" y1="5" x2="10" y2="15" />
    <line x1="5" y1="10" x2="15" y2="10" />
  </svg>
);

export const EditIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <path d="M3 17.25V21h3.75L17.81 9.94m-4.87-4.87L15.73 2.1a2 2 0 0 1 2.83 2.83l-9.88 9.88" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <polyline points="3 6 5 6 17 6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M8 6l1 12a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2l1-12" />
  </svg>
);

export const FilterIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <polygon points="2 5 18 5 14 15 6 15 2 5" />
  </svg>
);

export const HomeIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <path d="M3 10l7-7 7 7v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8z" />
    <polyline points="9 15 9 19 11 19 11 15" />
  </svg>
);

export const ListIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <line x1="8" y1="5" x2="17" y2="5" />
    <line x1="8" y1="10" x2="17" y2="10" />
    <line x1="8" y1="15" x2="17" y2="15" />
    <line x1="3" y1="5" x2="3" y2="5.01" />
    <line x1="3" y1="10" x2="3" y2="10.01" />
    <line x1="3" y1="15" x2="3" y2="15.01" />
  </svg>
);

export const EyeIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <circle cx="10" cy="10" r="3" />
    <path d="M1 10c1.5-3 4-5 9-5s7.5 2 9 5-4 5-9 5-7.5-2-9-5z" />
  </svg>
);

export const EyeOffIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <path d="M3 2l14 16M10 10c.83.83 2.17.83 3 0M7 7c-1.66 1.66-1.66 4.34 0 6M13 13c1.66-1.66 1.66-4.34 0-6" />
  </svg>
);

export const ShareIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <path d="M6 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM14 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM14 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    <path d="M8.6 7.9l3.2-1.8M8.6 8.1l3.2 1.8" />
  </svg>
);

export const ExpandIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <path d="M4 8V4h4M12 4h4v4M16 12v4h-4M8 16H4v-4" />
    <path d="M7 5L4 4m0 0l1 3M13 5l3-1m0 0l-1 3M13 15l3 1m0 0l-1-3M7 15l-3 1m0 0l1-3" />
  </svg>
);

export const MoreHorizontalIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <circle cx="4" cy="10" r="1.5" />
    <circle cx="10" cy="10" r="1.5" />
    <circle cx="16" cy="10" r="1.5" />
  </svg>
);

export const ArrowUpRightIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <path d="M5 15L15 5M8 5h7v7" />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <path d="M10 2l1.2 3.4L14.6 6.6 11.2 7.8 10 11.2 8.8 7.8 5.4 6.6 8.8 5.4 10 2z" />
    <path d="M15 11l.8 2.2L18 14l-2.2.8L15 17l-.8-2.2L12 14l2.2-.8L15 11zM5 11l.8 2.2L8 14l-2.2.8L5 17l-.8-2.2L2 14l2.2-.8L5 11z" />
  </svg>
);

export const MessageIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <path d="M4 4h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
  </svg>
);

export const PaperclipIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <path d="M7.5 10.5l5.8-5.8a3 3 0 1 1 4.2 4.2l-7.3 7.3a5 5 0 1 1-7.1-7.1l7.3-7.3" />
  </svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <path d="M10 3v8m0 0l3-3m-3 3l-3-3" />
    <path d="M4 13v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2" />
  </svg>
);

export const ShieldIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <path d="M10 2l6 2v5c0 4.4-2.8 7.8-6 9-3.2-1.2-6-4.6-6-9V4l6-2z" />
    <path d="M7.5 10l1.8 1.8 3.2-3.6" />
  </svg>
);
