"use client";

import { useState } from "react";

const EXAMPLES = [
  "Study for a few hours — quiet, with outlets",
  "Catch up with friends over pastries",
  "Bring my dog and relax",
  "A great coffee to go",
  "想安静地学习，要有插座",
  "带狗和朋友聊天，想吃甜点",
];

/** Boot screen: a warm hand-drawn welcome whose only job is to ask "what do you want to do at a café?" */
export default function Splash({ onSubmit, onSkip, busy, error }: { onSubmit: (prompt: string) => void; onSkip: () => void; busy: boolean; error?: string | null }) {
  const [text, setText] = useState("");
  const go = (t: string) => t.trim() && !busy && onSubmit(t.trim());
  return (
    <div className="splash" role="dialog" aria-label="Welcome to Cafeverse">
      <div className="splash-inner">
        <svg className="splash-cup" viewBox="0 0 120 120" aria-hidden>
          <path className="s-steam s1" d="M44 40 q-6 -10 0 -18 t0 -16" />
          <path className="s-steam s2" d="M60 38 q-6 -10 0 -18 t0 -16" />
          <path className="s-steam s3" d="M76 40 q-6 -10 0 -18 t0 -16" />
          <ellipse cx="60" cy="100" rx="42" ry="9" fill="#6b5a3a" opacity="0.18" />
          <path d="M28 52 h64 l-6 42 q-1 8 -10 8 h-32 q-9 0 -10 -8z" fill="#f6efe0" stroke="#8a5a3a" strokeWidth="3" strokeLinejoin="round" />
          <path d="M92 60 q20 2 16 20 q-3 12 -20 12" fill="none" stroke="#8a5a3a" strokeWidth="3" strokeLinecap="round" />
          <path d="M33 62 h54 l-3 20 h-48z" fill="#c9884e" opacity="0.85" />
          <ellipse cx="60" cy="52" rx="32" ry="6" fill="#e9d6b4" stroke="#8a5a3a" strokeWidth="3" />
          <ellipse cx="60" cy="52" rx="26" ry="4" fill="#a8683a" />
        </svg>
        <h1 className="splash-title">Cafeverse</h1>
        <p className="splash-sub">Tell me what you want to do — I&apos;ll light up the café that fits.</p>

        <form
          className="splash-box"
          onSubmit={(e) => {
            e.preventDefault();
            go(text);
          }}
        >
          <input
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What do you want to do at a café?"
            maxLength={300}
            aria-label="What do you want to do at a café?"
          />
          <button type="submit" disabled={busy || !text.trim()}>
            {busy ? "Reading…" : "Find my café →"}
          </button>
        </form>
        {error && <p className="splash-err">{error}</p>}

        <div className="splash-chips" aria-label="Examples">
          {EXAMPLES.map((e) => (
            <button key={e} type="button" disabled={busy} onClick={() => { setText(e); go(e); }}>
              {e}
            </button>
          ))}
        </div>

        <button className="splash-skip" type="button" onClick={onSkip}>
          or just explore the map
        </button>
        <p className="splash-foot">Downtown Durham, NC · Foster Street Coffee is real; the other two cafés are fictional demos.</p>
      </div>
    </div>
  );
}
