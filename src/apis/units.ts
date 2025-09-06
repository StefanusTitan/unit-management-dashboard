const API_URL = process.env.NEXT_PUBLIC_API_URL;

const baseUrl = '/units';

export async function getAllUnits(queryParams = {}) {
  const params = new URLSearchParams(queryParams).toString();
  const url = `${API_URL}${baseUrl}${params ? `?${params}` : ''}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export async function updateUnitStatus(id: number, status: string) {
  const url = `${API_URL}${baseUrl}/${id}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ unit: { status } }),
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}