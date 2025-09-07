"use client";

import { formatLastUpdated, capitalizeType } from "@/utils/general";
import { useState, useMemo } from 'react';
import { useUnits, useUpdateUnitStatus } from "@/apis/units";
import FiltersRow from "./filters/FiltersRow";
import StatusDropdown from "./ui/StatusDropdown";
import { getTypeColor } from "./utils/colors";
import { toast } from "sonner";

interface Unit {
  id: number;
  name: string;
  type: string;
  status: string;
  lastUpdated: string;
}

export default function UnitList({ onOpenCreateUnit }: { onOpenCreateUnit: () => void }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  // Create query params object based on filters
  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (search) params.name = search;
    if (type) params.type = type;
    if (status) params.status = status;
    return params;
  }, [search, type, status]);

  // Use React Query to fetch units
  const { data, isLoading, error } = useUnits(queryParams);
  const updateUnitStatus = useUpdateUnitStatus();

  const units = data?.units || [];

  const handleStatusChange = async (unitId: number, newStatus: string) => {
    updateUnitStatus.mutate(
      { id: unitId, status: newStatus },
      {
        onSuccess: () => {
          toast.success('Status updated successfully');
        },
        onError: (error) => {
          toast.error(
            'Failed to update status' +
              (error instanceof Error ? `: ${error.message}` : '')
          );
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <FiltersRow
          search={search}
          setSearch={setSearch}
          type={type}
          setType={setType}
          status={status}
          setStatus={setStatus}
          onOpenCreateUnit={onOpenCreateUnit}
        />
        <div className="text-center py-8">
          <p className="text-gray-400">Loading units...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <FiltersRow
          search={search}
          setSearch={setSearch}
          type={type}
          setType={setType}
          status={status}
          setStatus={setStatus}
          onOpenCreateUnit={onOpenCreateUnit}
        />
        <div className="text-center py-8">
          <p className="text-red-400">Error loading units: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <FiltersRow
        search={search}
        setSearch={setSearch}
        type={type}
        setType={setType}
        status={status}
        setStatus={setStatus}
        onOpenCreateUnit={onOpenCreateUnit}
      />
      <ul className="space-y-4">
        {units.map((unit: Unit, index: number) => (
          <li
            key={unit.id}
            className="flex justify-between bg-gray-800 border border-gray-700 rounded-lg p-4 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
              {unit.name}
              </h3>
              <p className={`w-fit px-2 text-base mb-1 rounded-full ${getTypeColor(unit.type)}`}>
                {capitalizeType(unit.type)}
              </p>
              <p className="text-gray-400 text-sm">
                <span className="font-medium">Last Updated:</span> {formatLastUpdated(unit.lastUpdated)}
              </p>
            </div>
            <div>
              <StatusDropdown
                currentStatus={unit.status}
                onStatusChange={(newStatus) => handleStatusChange(unit.id, newStatus)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
