import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const baseUrl = '/units';

export async function getAllUnits(queryParams = {}) {
  const params = new URLSearchParams(queryParams).toString();
  const url = `${API_URL}${baseUrl}${params ? `?${params}` : ''}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export function useUnits(queryParams = {}) {
  return useQuery({
    queryKey: ['units', queryParams],
    queryFn: () => getAllUnits(queryParams),
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
}

export function useUpdateUnitStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const url = `${API_URL}${baseUrl}/${id}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ unit: { status } }),
      });
      if (!res.ok) {
        // Parse the JSON error response from the API
        const errorData = await res.json();
        // Throw an error with the message from the API
        throw new Error(
          errorData.error || `Request failed: ${res.status}`
        );
      }
      return res.json();
    },
    onSuccess: () => {
      // Invalidate all units queries to refetch the data
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });
}

export function useCreateUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (unit: { name: string; type: string }) => {
      const res = await fetch(`${API_URL}${baseUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unit }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });
}