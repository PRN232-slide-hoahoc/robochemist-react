import { useState, useCallback } from 'react';

/**
 * Custom hook for toggling boolean state
 * @param initialState - Initial boolean state
 * @returns Tuple of [state, toggle, setValue]
 */
export const useToggle = (
  initialState = false
): [boolean, () => void, (value: boolean) => void] => {
  const [state, setState] = useState(initialState);

  const toggle = useCallback(() => setState((prev) => !prev), []);
  const setValue = useCallback((value: boolean) => setState(value), []);

  return [state, toggle, setValue];
};

