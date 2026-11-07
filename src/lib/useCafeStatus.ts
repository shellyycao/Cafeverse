"use client";

import { useCallback, useEffect, useState } from "react";

export type CafeStatus = { saved: boolean; visited: boolean };
const KEY = "cafeverse:status:v1";

function read(): Record<string, CafeStatus> {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, CafeStatus>) : {};
  } catch {
    return {};
  }
}

/** Saved / visited flags per café, persisted in localStorage (works without it, just not across reloads). */
export function useCafeStatus(id: string) {
  const [status, setStatus] = useState<CafeStatus>({ saved: false, visited: false });
  useEffect(() => {
    setStatus(read()[id] ?? { saved: false, visited: false });
  }, [id]);
  const toggle = useCallback(
    (k: keyof CafeStatus) => {
      setStatus((prev) => {
        const next = { ...prev, [k]: !prev[k] };
        try {
          const all = read();
          all[id] = next;
          window.localStorage.setItem(KEY, JSON.stringify(all));
        } catch {
          /* private mode etc. — keep in-memory state */
        }
        return next;
      });
    },
    [id],
  );
  return { status, toggle };
}
