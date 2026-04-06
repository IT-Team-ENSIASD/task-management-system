import type React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  clickable?: boolean;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  clickable = false,
  hoverable = true,
}) => {
  const baseClasses = 'card';
  const interactiveClasses = clickable
    ? 'cursor-pointer active:scale-95'
    : hoverable
      ? 'hover:shadow-md'
      : '';

  return (
    <div className={`${baseClasses} ${interactiveClasses} ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`border-b border-slate-200/70 px-6 py-4 ${className}`}>
    {children}
  </div>
);

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between rounded-b-[24px] border-t border-slate-200/70 bg-slate-50/80 px-6 py-4 ${className}`}>
    {children}
  </div>
);
