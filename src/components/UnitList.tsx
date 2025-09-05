"use client";

import { formatLastUpdated, capitalizeType } from "@/utils/general";
import { STATUS_OPTIONS, UNIT_TYPES } from "./constants";
import { useState, useRef, useEffect } from 'react';

interface Unit {
  id: number;
  name: string;
  type: string;
  lastUpdated: string;
}

function FiltersRow() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [typeOpen, setTypeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  
  const typeRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setTypeOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setStatusOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTypeChange = (value: string) => {
    setType(value);
    setTypeOpen(false);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setStatusOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4 animate-fade-in">
      <div className="relative">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-500"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="relative" ref={typeRef}>
          <button
            onClick={() => setTypeOpen(!typeOpen)}
            className="flex justify-between items-center cursor-pointer px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 min-w-[100px] text-left"
          >
            {type || "Type"}
            <svg className={`w-4 h-4 inline transition-transform duration-200 ${typeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {typeOpen && (
            <div className="absolute top-full mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 animate-slide-down">
              <div
                onClick={() => handleTypeChange("")}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors duration-200 first:rounded-t-lg"
              >
                All
              </div>
              {UNIT_TYPES.map((typeOption) => (
                <div
                  key={typeOption}
                  onClick={() => handleTypeChange(typeOption)}
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                >
                  {capitalizeType(typeOption)}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative" ref={statusRef}>
          <button
            onClick={() => setStatusOpen(!statusOpen)}
            className="flex justify-between items-center cursor-pointer px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 min-w-[120px] text-left"
          >
            {status || "Status"}
            <svg className={`w-4 h-4 inline transition-transform duration-200 ${statusOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {statusOpen && (
            <div className="absolute top-full mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 animate-slide-down">
              <div
                onClick={() => handleStatusChange("")}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors duration-200 first:rounded-t-lg"
              >
                All
              </div>
              {STATUS_OPTIONS.map((statusOption) => (
                <div
                  key={statusOption}
                  onClick={() => handleStatusChange(statusOption)}
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                >
                  {statusOption}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UnitList({ units }: { units: Unit[] }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <FiltersRow />
      <ul className="space-y-4">
        {units.map((unit, index) => (
          <li
            key={unit.id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 hover:border-gray-600 transition-all duration-300 transform hover:scale-[1.02] animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <h3 className="text-xl font-semibold text-white mb-2 hover:text-blue-400 transition-colors duration-200">
              {unit.name}
            </h3>
            <p className="text-gray-300 mb-1">
              <span className="font-medium">Type:</span> {capitalizeType(unit.type)}
            </p>
            <p className="text-gray-400 text-sm">
              <span className="font-medium">Last Updated:</span> {formatLastUpdated(unit.lastUpdated)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
