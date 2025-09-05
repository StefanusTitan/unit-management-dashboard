import { formatLastUpdated, capitalizeType } from "@/utils/general";

interface Unit {
  id: number;
  name: string;
  type: string;
  lastUpdated: string;
}

export default function UnitList({ units }: { units: Unit[] }) {
  return (
    <ul>
      {units.map((unit) => (
        <li key={unit.id}>
          <h3>{unit.name}</h3>
          <p>Type: {capitalizeType(unit.type)}</p>
          <p>Last Updated: {formatLastUpdated(unit.lastUpdated)}</p>
        </li>
      ))}
    </ul>
  );
}
