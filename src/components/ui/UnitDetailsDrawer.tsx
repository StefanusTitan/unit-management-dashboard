"use client";

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useUnit } from '@/apis/units';
import { formatLastUpdated, capitalizeType } from '@/utils/general';
import { getTypeColor } from '../utils/colors';

interface UnitDetailsDrawerProps {
  open: boolean;
  unitId: number | null;
  onClose: () => void;
}

interface UnitDetail {
  id: number;
  name: string;
  type: string;
  status: string;
  lastUpdated?: string;
  // Add any optional future fields here
  [key: string]: any; // fallback for unknown fields
}

// Expect API shape: { unit: { id, name, type, status, lastUpdated, ... } }
export default function UnitDetailsDrawer({ open, unitId, onClose }: UnitDetailsDrawerProps) {
  const { data, isLoading, error } = useUnit(unitId);
  const unit: UnitDetail | undefined = data?.unit;

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Prevent body scroll when drawer open
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = original; };
    }
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-full sm:w-[380px] bg-neutral-900 z-50 shadow-2xl border-r border-neutral-800 transform transition-transform duration-300 ease-out ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <h2 className="text-xl font-semibold">Unit Details</h2>
          <button onClick={onClose} className="p-2 rounded hover:bg-neutral-800 transition-colors cursor-pointer"><X size={20} /></button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-56px)]">
          {!unitId && <p className="text-gray-400">No unit selected.</p>}
          {unitId && isLoading && <p className="text-gray-400">Loading...</p>}
          {unitId && error && (
            <p className="text-red-400 text-sm">Error: {error instanceof Error ? error.message : 'Failed to load unit'}</p>
          )}
          {unit && !isLoading && !error && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-2xl font-bold mb-1">{unit.name}</h3>
                <p className={`w-fit px-2 py-0.5 rounded-full text-sm ${getTypeColor(unit.type)}`}>{capitalizeType(unit.type)}</p>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Status:</span>{' '}
                <span className="font-medium">{unit.status}</span>
              </div>
              <div className="text-sm text-gray-300 space-y-1">
                <p><span className="text-gray-400">ID:</span> {unit.id}</p>
                {unit.lastUpdated && (
                  <p><span className="text-gray-400">Last Updated:</span> {formatLastUpdated(unit.lastUpdated)}</p>
                )}
              </div>
              {/* Additional details placeholder if API returns more fields */}
              <div className="pt-2 border-t border-neutral-800">
                <p className="text-xs text-gray-500">More attributes can be displayed here.</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
