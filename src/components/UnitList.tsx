"use client";

import { formatLastUpdated, capitalizeType } from "@/utils/general";
import { useState, useMemo, useEffect } from "react";
import { useUnits, useUpdateUnitStatus } from "@/apis/units";
import FiltersRow from "./filters/FiltersRow";
import StatusDropdown from "./ui/StatusDropdown";
import UnitDetailsDrawer from "./ui/UnitDetailsDrawer";
import { getTypeColor } from "./utils/colors";
import { toast } from "sonner";

interface Unit {
  id: number;
  name: string;
  type: string;
  status: string;
  lastUpdated: string;
}

export default function UnitList({
  onOpenCreateUnit,
}: {
  onOpenCreateUnit: () => void;
}) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Create query params object based on filters
  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.name = debouncedSearch;
    if (type) params.type = type;
    if (status) params.status = status;
    return params;
  }, [debouncedSearch, type, status]);

  // Use React Query to fetch units
  const { data, isLoading, error } = useUnits(queryParams);
  const updateUnitStatus = useUpdateUnitStatus();

  const units = data?.units || [];

  const handleStatusChange = async (unitId: number, newStatus: string) => {
    updateUnitStatus.mutate(
      { id: unitId, status: newStatus },
      {
        onSuccess: () => {
          toast.success("Status updated successfully");
        },
        onError: (error) => {
          toast.warning(error instanceof Error ? `${error.message}` : "");
        },
      },
    );
  };

  const openDetails = (id: number) => {
    setSelectedUnitId(id);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
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
          <p className="text-red-400">
            Error loading units:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
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
      {units.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No Units Found</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {units.map((unit: Unit, index: number) => (
            <li
              key={unit.id}
              className="flex justify-between bg-gray-800 border border-gray-700 rounded-lg p-4 transition-all duration-300 animate-fade-in-up cursor-pointer hover:border-indigo-500/70 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => openDetails(unit.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openDetails(unit.id);
                }
              }}
            >
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {unit.name}
                </h3>
                <p
                  className={`w-fit px-2 text-base mb-1 rounded-full ${getTypeColor(unit.type)}`}
                >
                  {capitalizeType(unit.type)}
                </p>
                <p className="text-gray-400 text-sm">
                  <span className="font-medium">Last Updated:</span>{" "}
                  {formatLastUpdated(unit.lastUpdated)}
                </p>
              </div>
              <div
                className="flex flex-col items-end gap-2"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <StatusDropdown
                  currentStatus={unit.status}
                  onStatusChange={(newStatus) =>
                    handleStatusChange(unit.id, newStatus)
                  }
                />
              </div>
            </li>
          ))}
        </ul>
      )}
      <UnitDetailsDrawer
        open={isDetailsOpen}
        unitId={selectedUnitId}
        onClose={closeDetails}
      />
    </div>
  );
}
