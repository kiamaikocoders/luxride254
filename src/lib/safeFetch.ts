export async function safeFetchJson<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data: T | null; error?: string }> {
  try {
    const res = await fetch(input, init);
    const text = await res.text();
    const data = text ? (JSON.parse(text) as T) : null;
    if (!res.ok) {
      return { ok: false, status: res.status, data, error: (data as any)?.error || res.statusText };
    }
    return { ok: true, status: res.status, data };
  } catch (e: any) {
    return { ok: false, status: 0, data: null, error: e?.message || String(e) };
  }
}


