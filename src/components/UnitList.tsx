"use client";

import { formatLastUpdated, capitalizeType } from "@/utils/general";
import { useState, useEffect } from 'react';
import { getAllUnits, updateUnitStatus } from "@/apis/units";
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

export default function UnitList({ units: initialUnits = [], onOpenCreateUnit }: { units?: Unit[], onOpenCreateUnit: () => void }) {
  const [units, setUnits] = useState(initialUnits);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchFilteredUnits = async () => {
      const queryParams: Record<string, string> = {};
      if (search) queryParams.name = search;
      if (type) queryParams.type = type;
      if (status) queryParams.status = status;
      
      const data = await getAllUnits(queryParams);
      setUnits(data.units);
    };

    // Debounce the fetch call to avoid too many requests while typing
    const handler = setTimeout(() => {
      fetchFilteredUnits();
    }, 300); // 300ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [search, type, status]);

  const handleStatusChange = async (unitId: number, newStatus: string) => {
    const response = await updateUnitStatus(unitId, newStatus);
    console.log(response);
    if (response.error) {
      toast.warning(response.error);
    } else {
      setUnits(prevUnits => 
        prevUnits.map(unit => 
          unit.id === unitId 
            ? { ...unit, status: newStatus, lastUpdated: new Date().toISOString() }
            : unit
        )
      );
      toast.success('Status updated successfully');
    }
  };

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
        {units.map((unit, index) => (
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
