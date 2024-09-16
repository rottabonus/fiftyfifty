import React from "react";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const serializer = (value: unknown) => {
    return JSON.stringify(value);
  };

  const deserializer = (value: string) => {
    if (value === "undefined") {
      return undefined as unknown as T;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(value);
    } catch (error) {
      console.error("useLocalStorage: error parsing JSON:", error);
      return defaultValue; // Return default if parsing fails
    }

    return parsed as T;
  };

  const readValue = React.useCallback((): T => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? deserializer(raw) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return defaultValue;
    }
  }, [defaultValue, key, deserializer]);

  const [storedValue, setStoredValue] = React.useState<T>(defaultValue);

  const setValue = (value: T) => {
    try {
      window.localStorage.setItem(key, serializer(value));
      setStoredValue(value);
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  React.useEffect(() => {
    setStoredValue(readValue());
  }, [key]);

  return { storedValue, setValue };
}
