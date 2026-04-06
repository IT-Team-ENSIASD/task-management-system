import type React from 'react';
import { forwardRef } from 'react';
import { CheckIcon } from '../icons';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="checkbox"
            className={`w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer appearance-none border transition-colors duration-200 checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500 ${className}`}
            {...props}
          />
        </div>
        {label && (
          <label className="ml-3 text-sm text-gray-700 cursor-pointer">
            {label}
          </label>
        )}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
