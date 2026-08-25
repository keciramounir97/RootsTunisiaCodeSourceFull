import { useState, useEffect, useCallback } from "react";
import { api } from "../api/client";
import { getApiErrorMessage } from "../api/helpers";

/**
 * Reusable hook for API fetches with Loading and Error states.
 * @param {string|(() => Promise<any>)|null} urlOrFetcher - URL string, fetcher function, or null to skip
 * @param {object} options - { transform, deps, enabled }
 * @returns {{ data, loading, error, refetch }}
 */
export function useApiFetch(
  urlOrFetcher: string | (() => Promise<any>) | null,
  options: { transform?: (d: any) => any; deps?: any[]; enabled?: boolean } = {}
) {
  const { transform = (d: any) => d, deps = [], enabled = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");

  const fetcher = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError("");
    try {
      let result;
      if (typeof urlOrFetcher === "function") {
        result = await urlOrFetcher();
      } else if (typeof urlOrFetcher === "string") {
        const { data: res } = await api.get(urlOrFetcher);
        result = res?.data ?? res;
      } else {
        setLoading(false);
        return;
      }
      setData(transform(result));
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load data"));
    } finally {
      setLoading(false);
    }
  }, [enabled, urlOrFetcher, transform, ...deps]);

  useEffect(() => {
    fetcher();
  }, [fetcher]);

  return { data, loading, error, refetch: fetcher };
}
