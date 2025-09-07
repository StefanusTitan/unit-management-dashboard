"use client";

import { useState, useEffect, useRef } from "react";
import { UNIT_TYPES } from "../constants";
import { BedDoubleIcon, ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";
import { useCreateUnit } from "@/apis/units";
import { LoaderCircle } from "lucide-react";

interface CreateUnitDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateUnitDialog({ isOpen, onClose }: CreateUnitDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<typeof UNIT_TYPES[number]>(UNIT_TYPES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to ensure the element is rendered before animation starts
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Wait for animation to complete before removing from DOM
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      setIsDropdownOpen(false);
    }, 300);
  };

  const createUnit = useCreateUnit();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    createUnit.mutate(
      { name, type },
      {
        onSuccess: () => {
          toast.success("Unit created successfully");
          handleClose();
          setName("");
          setType(UNIT_TYPES[0]);
          setIsDropdownOpen(false);
        },
        onError: (error) => {
          toast.error(
            "Failed to create unit" +
              (error instanceof Error ? `: ${error.message}` : "")
          );
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  return (
    <>
      {shouldRender && (
        <div 
          className={`fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleClose}
        >
          <div 
            className={`bg-neutral-900 rounded-lg shadow-lg w-full max-w-md p-6 transition-all duration-300 ease-out ${
              isVisible 
                ? 'transform translate-y-0 opacity-100 scale-100' 
                : 'transform translate-y-8 opacity-0 scale-95'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BedDoubleIcon className="inline-block" size={32} />
              Create New Unit
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold">
                  Name
                  <span className="text-red-500 text-lg">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                  placeholder="Enter unit name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold">
                  Type
                  <span className="text-red-500 text-lg">*</span>
                </label>
                <div className="relative mt-1" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer"
                  >
                    <span className="capitalize">{type}</span>
                    <ChevronDownIcon 
                      className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                      strokeWidth={3}
                      color="#fff"
                    />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-neutral-900 border border-gray-300 rounded-md shadow-lg">
                      <div className="py-1">
                        {UNIT_TYPES.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setType(option);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 text-white py-2 hover:bg-neutral-600 focus:outline-none focus:bg-neutral-600 transition-colors capitalize cursor-pointer ${
                              type === option ? 'bg-neutral-800' : 'text-gray-900'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="bg-gray-300 text-gray-600 rounded-md px-4 py-2 cursor-pointer hover:bg-gray-400 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-indigo-500 text-white rounded-md px-4 py-2 cursor-pointer hover:bg-indigo-600 transition-all duration-300 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? <LoaderCircle className="h-8 w-8 animate-spin" /> : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}