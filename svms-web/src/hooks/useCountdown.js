import { useEffect, useState } from 'react';
export function useCountdown(end) {
  const [left, setLeft] = useState(() => Math.max(0, new Date(end).getTime() - Date.now()));
  useEffect(() => {
    const calculate = () => Math.max(0, new Date(end).getTime() - Date.now());
    setLeft(calculate());
    const i = setInterval(() => setLeft(calculate()), 1000);
    return () => clearInterval(i);
  }, [end]);
  return {
    milliseconds: left,
    text: `${String(Math.floor(left / 60000)).padStart(2, '0')}:${String(Math.floor(left / 1000) % 60).padStart(2, '0')}`,
    expired: left === 0,
  };
}
