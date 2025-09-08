/**
 * Formats an ISO date string to a readable timestamp
 * @param isoString - The ISO date string to format
 * @returns A readable timestamp string
 */
export function formatLastUpdated(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * Capitalizes the first letter of a string and lowercases the rest
 * @param str - The string to capitalize
 * @returns The capitalized string
 */
export function capitalizeType(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
