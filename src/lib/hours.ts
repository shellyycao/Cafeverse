import { CAFE } from "@/data/cafe";

export type Phase = "closed" | "opening" | "open" | "closing";

const parse = (s: string) => {
  // "7a–6p" → [420, 1080]
  const m = s.match(/(\d{1,2})(?::(\d{2}))?\s*([ap])\s*[–-]\s*(\d{1,2})(?::(\d{2}))?\s*([ap])/i);
  if (!m) return [420, 1080];
  const to = (h: string, mi: string | undefined, ap: string) => ((+h % 12) + (ap.toLowerCase() === "p" ? 12 : 0)) * 60 + (mi ? +mi : 0);
  return [to(m[1], m[2], m[3]), to(m[4], m[5], m[6])];
};

export const WEEKDAY = parse(CAFE.hours.weekdays);
export const WEEKEND = parse(CAFE.hours.weekends);
export const WARN_MIN = 30; // staff set up / tidy up this long before opening / closing

export type Clock = { minutes: number; weekend: boolean; label: string };

/** Current wall-clock time in Durham, NC (the café's time zone). */
export function durhamNow(): Clock {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  const wd = get("weekday");
  return { minutes: (+get("hour") % 24) * 60 + +get("minute"), weekend: wd === "Sat" || wd === "Sun", label: wd };
}

export function phaseAt(minutes: number, weekend: boolean): Phase {
  const [open, close] = weekend ? WEEKEND : WEEKDAY;
  if (minutes >= open && minutes < close - WARN_MIN) return "open";
  if (minutes >= close - WARN_MIN && minutes < close) return "closing";
  if (minutes >= open - WARN_MIN && minutes < open) return "opening";
  return "closed";
}

export function fmtTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

export function phaseLabel(p: Phase, minutes: number, weekend: boolean): string {
  const [open, close] = weekend ? WEEKEND : WEEKDAY;
  if (p === "open") return "Open";
  if (p === "closing") return `Closing soon · ${fmtTime(close)}`;
  if (p === "opening") return `Opening soon · ${fmtTime(open)}`;
  return minutes < open ? `Closed · opens ${fmtTime(open)}` : "Closed";
}
