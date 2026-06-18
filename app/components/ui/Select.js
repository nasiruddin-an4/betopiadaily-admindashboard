'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export function Select({ options, value, onChange, placeholder = "Select an option", className = "", name = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => String(opt.value) === String(value));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    if (name) {
      // Mock an event object if name is provided, so it works seamlessly with standard handleInputChange
      onChange({ target: { name, value: val } });
    } else {
      onChange(val);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 bg-gray-50 border-none rounded-xl text-sm transition-all outline-none focus:ring-2 focus:ring-brand-bright-orange focus:bg-white ${
          isOpen ? 'ring-2 ring-brand-bright-orange bg-white' : ''
        } ${selectedOption ? 'text-gray-800' : 'text-gray-400'}`}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl py-1 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors hover:bg-gray-50 ${
                String(value) === String(option.value) ? 'bg-brand-bright-orange/5 text-brand-bright-orange font-medium' : 'text-gray-700'
              }`}
            >
              <span className="truncate">{option.label}</span>
              {String(value) === String(option.value) && <Check size={14} className="text-brand-bright-orange" />}
            </button>
          ))}
          {(!options || options.length === 0) && (
            <div className="px-4 py-3 text-sm text-gray-400 text-center">No options available</div>
          )}
        </div>
      )}
    </div>
  );
}
