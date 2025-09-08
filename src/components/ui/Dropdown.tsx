"use client";

import { useEffect, useRef, useState } from "react";

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder: string;
  minWidth?: string;
  formatOption?: (option: string) => string;
}

export default function Dropdown({
  value,
  onChange,
  options,
  placeholder,
  minWidth = "100px",
  formatOption,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionChange = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center cursor-pointer px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-left"
        style={{ minWidth }}
      >
        {value ? (formatOption ? formatOption(value) : value) : placeholder}
        <svg
          className={`w-4 h-4 inline transition-transform duration-200 ml-2 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <title>Dropdown arrow</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 animate-slide-down z-1000">
          <div
            role="button"
            tabIndex={0}
            onClick={() => handleOptionChange("")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleOptionChange("");
            }}
            className="px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors duration-200 first:rounded-t-lg"
          >
            All
          </div>
          {options.map((option) => (
            <div
              role="button"
              tabIndex={0}
              key={option}
              onClick={() => handleOptionChange(option)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  handleOptionChange(option);
              }}
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors duration-200"
            >
              {formatOption ? formatOption(option) : option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
