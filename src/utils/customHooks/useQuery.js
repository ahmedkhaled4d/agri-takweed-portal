import React from 'react';
import { useLocation } from 'react-router';

function useQuery() {
  const { search } = useLocation();

  // const useQuery = () => new URLSearchParams(useLocation().search);
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export { useQuery };
