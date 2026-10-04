import {useCallback, useEffect, useRef, useState} from 'react';

// Runs an async loader on mount (and whenever deps change) and exposes
// loading/error state plus a reload function.
export const useApi = <T>(loader: () => Promise<T>, deps: unknown[] = []) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await loaderRef.current());
    } catch (err) {
      setError(
        'Could not reach the server. Check that the backend is running and try again.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {data, isLoading, error, reload};
};
