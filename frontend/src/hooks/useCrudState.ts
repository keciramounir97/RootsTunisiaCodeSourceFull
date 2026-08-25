/**
 * useCrudState — centralized CRUD state (loading, error, empty, data)
 * Ensures consistent UX: loading states, empty states, error toasts
 */
import { useState, useCallback } from "react";

export function useCrudState<T = any>(initialData: T | null = null) {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const setLoadingState = useCallback((v: boolean) => setLoading(!!v), []);
  const setErrorState = useCallback((msg: string) => setError(msg || ""), []);
  const setSavingState = useCallback((v: boolean) => setSaving(!!v), []);

  const clearError = useCallback(() => setError(""), []);

  const isEmpty = Array.isArray(data)
    ? data.length === 0
    : data == null || (typeof data === "object" && Object.keys(data).length === 0);

  return {
    data,
    setData,
    loading,
    setLoading: setLoadingState,
    error,
    setError: setErrorState,
    saving,
    setSaving: setSavingState,
    clearError,
    isEmpty,
  };
}
