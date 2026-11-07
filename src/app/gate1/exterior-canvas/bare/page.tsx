import BareCanvas from "./BareCanvas";

export const metadata = { title: "Exterior canvas — map only" };

/** Real street map on the exterior canvas, nothing else (backdrop for the massing reference). */
export default function Bare() {
  return (
    <main style={{ position: "fixed", inset: 0, background: "#f5eddb" }}>
      <style>{"nextjs-portal{display:none !important}"}</style>
      <BareCanvas />
    </main>
  );
}
