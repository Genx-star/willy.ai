import { useQuery, useMutation, useQueryClient } from 'react-query';

export const usePresentation = (id: string) => {
  return useQuery(['presentation', id], 
    () => fetchPresentation(id),
    {
      staleTime: 5 * 60 * 1000, // 5 minuti
      cacheTime: 30 * 60 * 1000 // 30 minuti
    }
  );
};