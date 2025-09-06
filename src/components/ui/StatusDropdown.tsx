"use client";

import { useState, useRef, useEffect } from 'react';
import { STATUS_OPTIONS } from '../constants';
import { getBorderColor } from '../utils/colors';

interface StatusDropdownProps {
  currentStatus: string;
  onStatusChange: (newStatus: string) => void;
}

export default function StatusDropdown({ currentStatus, onStatusChange }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusSelect = (status: string) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-between p-2 border ${getBorderColor(currentStatus)} text-sm font-medium rounded-full cursor-pointer min-w-[140px] transition-all duration-300 hover:bg-gray-700`}
      >
        {currentStatus}
        <svg className={`w-3 h-3 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-full mt-1 right-0 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 animate-slide-down min-w-[140px]">
          {STATUS_OPTIONS.map((statusOption) => (
            <div
              key={statusOption}
              onClick={() => handleStatusSelect(statusOption)}
              className={`px-3 py-2 hover:bg-gray-700 cursor-pointer transition-colors duration-200 text-sm ${
                statusOption === currentStatus ? 'bg-gray-700' : ''
              } first:rounded-t-lg last:rounded-b-lg`}
            >
              <span className={`font-medium ${getBorderColor(statusOption).split(' ')[1]}`}>
                {statusOption}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
