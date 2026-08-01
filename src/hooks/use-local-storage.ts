'use client';

import { useCallback, useEffect, useState } from 'react';

function resolveInitialValue<T>(initialValue: T | (() => T)): T {
  return typeof initialValue === 'function'
    ? (initialValue as () => T)()
    : initialValue;
}

function readValue<T>(key: string, initialValue: T | (() => T), parse?: (value: unknown) => T): T {
  const fallback = resolveInitialValue(initialValue);

  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) {
      return fallback;
    }

    const parsed: unknown = JSON.parse(stored);
    return parse ? parse(parsed) : (parsed as T);
  } catch {
    return fallback;
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  parse?: (value: unknown) => T
): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const [storedValue, setStoredValue] = useState<T>(() => resolveInitialValue(initialValue));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setStoredValue(readValue(key, initialValue, parse));
    setReady(true);
  }, [key, parse]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // The in-memory session still works when storage is unavailable.
    }
  }, [key, ready, storedValue]);

  const handleStorage = useCallback(
    (event: StorageEvent) => {
      if (event.key === key) {
        setStoredValue(readValue(key, initialValue, parse));
      }
    },
    [initialValue, key, parse]
  );

  useEffect(() => {
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [handleStorage]);

  return [storedValue, setStoredValue, ready];
}
