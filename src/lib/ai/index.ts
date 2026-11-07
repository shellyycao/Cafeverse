import type { InferenceProvider } from "./provider";
import { TinkerProvider, TINKER_DEFAULT_BASE_URL } from "./tinker";
import { DemoProvider } from "./demo";

/** Pick the provider from server-side env. Missing config => clearly-labelled demo mode. */
export function getProvider(): InferenceProvider {
  const key = process.env.TINKER_API_KEY;
  const model = process.env.TINKER_MODEL;
  if (key && model) return new TinkerProvider(key, model, process.env.TINKER_BASE_URL || TINKER_DEFAULT_BASE_URL);
  return new DemoProvider();
}
export const isLive = () => Boolean(process.env.TINKER_API_KEY && process.env.TINKER_MODEL);
