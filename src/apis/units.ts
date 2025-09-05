const API_URL = process.env.API_URL;

const baseUrl = '/units';

export async function getAllUnits() {
  const res = await fetch(`${API_URL}${baseUrl}`);
  const data = await res.json();
  return data;
}
