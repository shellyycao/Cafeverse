import { Suspense } from "react";
import AssetCheckClient from "./AssetCheckClient";

export const metadata = { title: "Interior asset check" };

export default function AssetCheck() {
  return (
    <main style={{ position: "fixed", inset: 0, background: "#f2e8d3" }}>
      <Suspense fallback={null}>
        <AssetCheckClient />
      </Suspense>
    </main>
  );
}
