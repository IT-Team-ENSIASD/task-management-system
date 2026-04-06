import React from 'react';
import type { IconProps } from './index';

export const CheckCircleIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
    <polyline points="6 10 9 13 14 8" />
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

export const AlertCircleIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
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
    <line x1="10" y1="6" x2="10" y2="10" />
    <circle cx="10" cy="14" r="0.5" />
  </svg>
);

export const TrendingUpIcon: React.FC<IconProps> = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    <polyline points="17 3 7 13 12 18 18 12" />
    <polyline points="17 3 17 10 10 3" />
  </svg>
);
