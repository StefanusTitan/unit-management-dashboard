export const getBorderColor = (status: string) => {
  switch (status) {
    case "Available":
      return "border-emerald-700 text-emerald-500";
    case "Occupied":
      return "border-red-700 text-red-500";
    case "Cleaning In Progress":
      return "border-sky-700 text-sky-500";
    case "Maintenance Needed":
      return "border-yellow-700 text-yellow-500";
    default:
      return "border-gray-700 text-white";
  }
};

export const getTypeColor = (type: string) => {
  switch (type) {
    case "capsule":
      return "bg-purple-400 text-purple-100";
    case "cabin":
      return "bg-indigo-400 text-indigo-100";
    default:
      return "bg-gray-600 text-gray-200";
  }
};
