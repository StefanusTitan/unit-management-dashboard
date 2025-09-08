import { capitalizeType } from "@/utils/general";
import { STATUS_OPTIONS, UNIT_TYPES } from "../constants";
import Dropdown from "../ui/Dropdown";
import { Plus } from "lucide-react";

interface FiltersRowProps {
  search: string;
  setSearch: (value: string) => void;
  type: string;
  setType: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  onOpenCreateUnit: () => void;
}

export default function FiltersRow({ search, setSearch, type, setType, status, setStatus, onOpenCreateUnit }: FiltersRowProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
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
        <Dropdown
          value={type}
          onChange={setType}
          options={UNIT_TYPES}
          placeholder="Type"
          minWidth="100px"
          formatOption={capitalizeType}
        />
        <Dropdown
          value={status}
          onChange={setStatus}
          options={STATUS_OPTIONS}
          placeholder="Status"
          minWidth="120px"
        />
        <button
          className="bg-cyan-600 border border-gray-600 text-white rounded-lg px-4 py-2 hover:bg-cyan-700 transition-all duration-300 cursor-pointer"
          onClick={onOpenCreateUnit}
          title="Create New Unit"
        >
          <Plus size={24} color="white" />
        </button>
      </div>
    </div>
  );
}
