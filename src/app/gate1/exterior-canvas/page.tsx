import Canvas from "./Canvas";

export const metadata = { title: "Exterior canvas (asset reference export)" };

/** The current mid-zoom scene drawn on the exact exterior asset canvas, for the reference export. */
export default function ExteriorCanvas() {
  return (
    <main style={{ position: "fixed", inset: 0, background: "#f5eddb", ["--z" as string]: 3, ["--zi" as string]: 40 }}>
      <style>{"nextjs-portal{display:none !important}"}</style>
      <Canvas />
    </main>
  );
}
