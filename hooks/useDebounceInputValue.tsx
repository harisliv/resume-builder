import debounce from 'lodash.debounce';
import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Simplified debounce hook for string input values.
 * Optimized with useMemo and useRef to prevent unnecessary re-renders.
 * @param value The string value to debounce
 * @param delay The delay in milliseconds (default is 500ms)
 * @returns The debounced string value
 */
export function useDebounceInputValue(
  value: string,
  delay: number = 500
): string {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const previousValueRef = useRef<string>(value);

  // Memoize the debounced function to avoid recreating it on every render
  const debouncedSetter = useMemo(
    () => debounce(setDebouncedValue, delay),
    [delay]
  );

  useEffect(() => {
    // Only call the debounced function if the value has actually changed
    if (previousValueRef.current !== value) {
      debouncedSetter(value);
      previousValueRef.current = value;
    }

    // Cleanup: cancel pending debounced calls on unmount or value change
    return () => {
      debouncedSetter.cancel();
    };
  }, [value, debouncedSetter]);

  return debouncedValue;
}
