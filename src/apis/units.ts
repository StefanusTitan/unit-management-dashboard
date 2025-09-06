const API_URL = process.env.NEXT_PUBLIC_API_URL;

const baseUrl = '/units';

export async function getAllUnits(queryParams = {}) {
  const params = new URLSearchParams(queryParams).toString();
  const url = `${API_URL}${baseUrl}${params ? `?${params}` : ''}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}
