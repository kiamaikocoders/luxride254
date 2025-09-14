import { useRef } from "react";

export function useRateLimit(maxSubmissions: number, windowMs: number) {
  const historyRef = useRef<number[]>([]);

  function canSubmit(): boolean {
    const now = Date.now();
    historyRef.current = historyRef.current.filter(ts => now - ts < windowMs);
    return historyRef.current.length < maxSubmissions;
  }

  function record() {
    historyRef.current.push(Date.now());
  }

  return { canSubmit, record };
}


