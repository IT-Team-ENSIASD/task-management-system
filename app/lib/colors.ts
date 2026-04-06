// Color palette constants
export const COLORS = {
  // Primary - Blue
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  // Secondary - Indigo
  secondary: {
    50: '#F0F4FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
  },
  // Success - Green
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
  },
  // Warning - Amber
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
  },
  // Error - Red
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },
  // Neutral - Gray
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D8',
    400: '#A1A1AA',
    500: '#71717A',
    600: '#52525B',
    700: '#3F3F46',
    900: '#18181B',
  },
};

// Status badge colors
export const STATUS_COLORS: Record<string, { bg: string; text: string; variant: 'primary' | 'success' | 'warning' | 'error' | 'neutral' }> = {
  'not_started': {
    bg: 'bg-neutral-100',
    text: 'text-neutral-700',
    variant: 'neutral',
  },
  'in_progress': {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    variant: 'primary',
  },
  'completed': {
    bg: 'bg-green-100',
    text: 'text-green-700',
    variant: 'success',
  },
  'archived': {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    variant: 'neutral',
  },
};

// Priority colors
export const PRIORITY_COLORS: Record<string, { bg: string; text: string; variant: 'primary' | 'success' | 'warning' | 'error' | 'neutral' }> = {
  'low': {
    bg: 'bg-green-100',
    text: 'text-green-700',
    variant: 'success',
  },
  'medium': {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    variant: 'primary',
  },
  'high': {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    variant: 'warning',
  },
  'urgent': {
    bg: 'bg-red-100',
    text: 'text-red-700',
    variant: 'error',
  },
};
