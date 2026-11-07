import { Suspense } from "react";
import ActorsPreview from "./ActorsPreview";

export const metadata = { title: "Actor placement guide" };

export default function Actors() {
  return (
    <main style={{ position: "fixed", inset: 0, background: "#f2e8d3" }}>
      <Suspense fallback={null}>
        <ActorsPreview />
      </Suspense>
    </main>
  );
}
