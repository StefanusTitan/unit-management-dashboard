"use client";

import { useState, useEffect } from "react";
import { UNIT_TYPES } from "../constants";
import { BedDoubleIcon } from "lucide-react";

interface CreateUnitDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateUnitDialog({ isOpen, onClose }: CreateUnitDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState(UNIT_TYPES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

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

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // TODO: Add API call to create a new unit
      // Handle successful submission
      handleClose(); // Close the dialog after submission
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
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
                <label className="block text-sm font-medium">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)} 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  {UNIT_TYPES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="bg-gray-300 text-gray-500 rounded-md px-4 py-2 cursor-pointer hover:bg-gray-400 transition-all duration-300"
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
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}