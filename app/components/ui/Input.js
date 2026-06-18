import React, { forwardRef } from 'react';

export const Input = forwardRef(({ 
  label, 
  error, 
  type = 'text',
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`
          block w-full rounded-md border px-3 py-2 text-sm shadow-sm
          focus:outline-none focus:ring-1
          disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
          ${error 
            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
          }
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
