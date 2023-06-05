import { useEffect, useRef } from 'react';

export function useInterval<T extends CallableFunction>(
  callback: T,
  deLay: number | null,
): void {
  const savedCallback = useRef<T>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) savedCallback.current();
    }

    if (deLay !== null) {
      const id = setInterval(tick, deLay);
      return () => clearInterval(id);
    }
  }, [deLay]);
}
