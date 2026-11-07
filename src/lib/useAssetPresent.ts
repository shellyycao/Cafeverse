"use client";

import { useEffect, useState } from "react";

/** true once `url` has loaded as an image; false if it 404s. null while checking. */
export function useAssetPresent(url: string): boolean | null {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    const img = new window.Image();
    img.onload = () => alive && setOk(true);
    img.onerror = () => alive && setOk(false);
    img.src = `${url}?v=${Date.now() % 100000}`;
    return () => {
      alive = false;
    };
  }, [url]);
  return ok;
}
