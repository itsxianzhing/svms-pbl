import { useCallback, useEffect, useRef, useState } from 'react';
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(),
    [error, setError] = useState(),
    [isLoading, setLoading] = useState(true);
  const fetcherRef = useRef(fetcher);
  const dependencyKey = JSON.stringify(deps);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });
  const refetch = useCallback((signal) => {
    setLoading(true);
    setError();
    return fetcherRef
      .current(signal)
      .then(setData)
      .catch((e) => {
        if (e.name !== 'AbortError') setError(e);
      })
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    const c = new AbortController();
    refetch(c.signal);
    return () => c.abort();
  }, [dependencyKey, refetch]);
  return { data, error, isLoading, refetch };
}
