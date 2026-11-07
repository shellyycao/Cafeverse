import type { AnalyzeRequest, CafeAnalysis } from "./schema";

export type AnalysisResult = { mode: "live" | "demo"; provider: string; analysis: CafeAnalysis; note?: string };

/** Anything that can turn permitted source text into a validated CafeAnalysis. Swap providers here. */
export interface InferenceProvider {
  readonly name: string;
  analyze(input: AnalyzeRequest): Promise<AnalysisResult>;
}
