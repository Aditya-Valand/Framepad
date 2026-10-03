"use client";
import React, { useRef, useEffect } from "react";

const templates: {
  name: string;
  vibe: string;
  width?: number;
  cardBg?: string;
  cardBorder?: string;
  showTape?: boolean;
  content: React.ReactNode;
}[] = [
  {
    name: "Classic Polaroid",
    vibe: "timeless",
    content: (
      <>
        <div style={{ height: 145, margin: "8px 8px 0", background: "linear-gradient(135deg,#d4c5b0,#b09080)" }} />
        <div style={{ height: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Dancing Script',cursive", fontSize: 14, color: "#5a4a3a" }}>memories</span>
        </div>
      </>
    ),
  },
  {
    name: "Instax Mini",
    vibe: "trending",
    content: (
      <>
        <div style={{ height: 155, margin: "7px 7px 0", background: "linear-gradient(135deg,#c8b0d4,#a090c4)" }} />
        <div style={{ height: 30, background: "#1a1714", margin: "0 7px 7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#e8e2d0", letterSpacing: ".12em" }}>BESTIES</span>
        </div>
      </>
    ),
  },
  {
    name: "Movie Poster",
    vibe: "cinematic",
    cardBg: "#F5F2EC",
    cardBorder: ".5px solid #ddd",
    content: (
      <>
        <div style={{ height: 120, margin: "8px 8px 0", background: "linear-gradient(135deg,#2c3e50,#4a4a4a)" }} />
        <div style={{ padding: "6px 8px 10px" }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, fontWeight: 500, color: "#1a1a1a", letterSpacing: ".04em", lineHeight: 1.1 }}>MOVIE TITLE</div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 7, color: "#999", marginTop: 3, lineHeight: 1.7 }}>directed by AUTHOR<br />starring CAST · CAST</div>
        </div>
      </>
    ),
  },
  {
    name: "Instax Square",
    vibe: "minimal",
    content: (
      <div style={{ margin: 9, height: 155, background: "linear-gradient(135deg,#f8d7a4,#e07a50)", borderRadius: 1, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 8 }}>
        <span style={{ fontFamily: "'Dancing Script',cursive", fontSize: 12, color: "rgba(255,255,255,.8)" }}>golden hour</span>
      </div>
    ),
  },
  {
    name: "Vintage Color 600",
    vibe: "nostalgic",
    cardBg: "#F0EBD8",
    cardBorder: ".5px solid #d4c9a8",
    content: (
      <>
        <div style={{ height: 138, margin: "8px 8px 0", background: "linear-gradient(135deg,#c8a878,#987058)", filter: "sepia(.3)" }} />
        <div style={{ height: 40, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "#5a4a2a" }}>summer &apos;24</span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: "#9a8a6a" }}>JUNE · 2024</span>
        </div>
      </>
    ),
  },
  {
    name: "Polaroid B&W",
    vibe: "film",
    content: (
      <>
        <div style={{ height: 148, margin: "8px 8px 0", background: "linear-gradient(135deg,#1a1a1a,#888)", filter: "grayscale(1)" }} />
        <div style={{ height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Dancing Script',cursive", fontSize: 14, color: "#1a1a1a" }}>moments</span>
        </div>
      </>
    ),
  },
  {
    name: "Instax Wide 300",
    vibe: "landscape",
    width: 240,
    content: (
      <>
        <div style={{ height: 120, margin: "7px 7px 0", background: "linear-gradient(135deg,#a8c8e8,#d4e8f8)" }} />
        <div style={{ height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Dancing Script',cursive", fontSize: 14, color: "#5a5a6a" }}>wide shot</span>
        </div>
      </>
    ),
  },
  {
    name: "Dark Minimal",
    vibe: "editorial",
    cardBg: "#1a1714",
    content: (
      <>
        <div style={{ height: 145, margin: "9px 9px 0", background: "linear-gradient(135deg,#c9d6df,#e0e8f0)" }} />
        <div style={{ height: 40, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 3 }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: "#e8e2d0", letterSpacing: ".18em" }}>MEMORY</span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 7, color: "#6a6458", letterSpacing: ".1em" }}>04 · 05 · 2026</span>
        </div>
      </>
    ),
  },
  {
    name: "Tape Border",
    vibe: "scrapbook",
    showTape: true,
    content: (
      <>
        <div style={{ height: 142, margin: "9px 9px 0", background: "linear-gradient(135deg,#f0c0d8,#a0b4e0)" }} />
        <div style={{ height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Dancing Script',cursive", fontSize: 14, color: "#5a4a6a" }}>taped up</span>
        </div>
      </>
    ),
  },
];

const looped = [...templates, ...templates, ...templates];

export default function TemplatesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const offsetRef = useRef(0);
  const isPaused = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const SPEED = 0.55;
    const cards = Array.from(track.children) as HTMLElement[];

    // Promote each card to its own GPU compositor layer — set once, not per frame
    cards.forEach((card) => {
      card.style.willChange = "transform, opacity";
      card.style.backfaceVisibility = "hidden";
    });
    track.style.willChange = "transform";

    // Cache card geometry after first layout — offsetLeft is stable because
    // transforms don't affect layout flow, so we never need to re-read this
    const cardGeo = cards.map((card) => ({
      left: card.offsetLeft,
      half: card.offsetWidth / 2,
    }));

    // Cache the container's left edge in the viewport — this is our stable anchor.
    // When track is at offset=0 its left edge coincides with the container's left edge.
    let anchorLeft = container.getBoundingClientRect().left;
    const onResize = () => { anchorLeft = container.getBoundingClientRect().left; };
    window.addEventListener("resize", onResize, { passive: true });

    const tick = () => {
      // ── Advance scroll ──────────────────────────────────────────────────
      if (!isPaused.current) {
        const loopWidth = track.scrollWidth / 3;
        offsetRef.current = (offsetRef.current + SPEED) % loopWidth;
        // Single style write — no reflow triggered here
        track.style.transform = `translateX(-${offsetRef.current}px)`;
      }

      // ── 3D cylinder — zero getBoundingClientRect calls in the hot path ──
      // trackLeft is the current left edge of the track in viewport coordinates:
      //   natural position (anchorLeft) minus how far we've scrolled (offsetRef.current)
      const trackLeft = anchorLeft - offsetRef.current;
      const vpCx = window.innerWidth * 0.5;
      const radius = window.innerWidth * 0.48; // cylinder curvature radius

      // Batch: pure math, zero DOM reads
      const len = cards.length;
      for (let i = 0; i < len; i++) {
        const cardCx = trackLeft + cardGeo[i].left + cardGeo[i].half;
        const dist = cardCx - vpCx;

        // Normalise to -1 … +1; clamp so off-screen cards stay at their extreme
        const t = dist / radius < -1 ? -1 : dist / radius > 1 ? 1 : dist / radius;
        const abs = t < 0 ? -t : t;

        // Cylinder: card rotates along a shared arc; centre card faces you
        const rotY = (t * 52).toFixed(2);
        const sc   = (1 - abs * 0.20).toFixed(4);
        const tz   = ((1 - abs) * 64).toFixed(2);
        const op   = (0.32 + (1 - abs) * 0.68).toFixed(3);

        cards[i].style.transform = `perspective(720px) rotateY(${rotY}deg) scale(${sc}) translateZ(${tz}px)`;
        cards[i].style.opacity   = op;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section style={{ padding: "100px 0 90px", background: "var(--cream)", overflow: "hidden" }} id="templates">

      {/* Header */}
      <div className="reveal" style={{ textAlign: "center", padding: "0 48px", marginBottom: 64 }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 46, fontWeight: 300, fontStyle: "italic",
          marginBottom: 12, letterSpacing: "-.01em", lineHeight: 1.08,
        }}>
          Every moment has its frame.
        </h2>
        <p style={{ fontSize: 15, fontWeight: 300, color: "var(--text-2)" }}>
          Nine templates. Infinite versions. All yours.
        </p>
      </div>

      {/* 3D strip */}
      <div
        ref={containerRef}
        style={{ overflow: "visible", padding: "20px 0 44px" }}
        onMouseEnter={() => { isPaused.current = true; }}
        onMouseLeave={() => { isPaused.current = false; }}
      >
        <div
          ref={trackRef}
          style={{ display: "flex", gap: 20, width: "max-content" }}
        >
          {looped.map((t, i) => (
            <div
              key={`${t.name}-${i}`}
              style={{ flex: "0 0 auto", width: t.width || 190 }}
            >
              <div style={{
                background: t.cardBg || "#fff",
                boxShadow: "0 2px 8px rgba(26,23,20,0.07), 0 12px 40px rgba(139,111,92,0.15)",
                borderRadius: 3,
                marginBottom: 12,
                overflow: "hidden",
                position: "relative",
                border: t.cardBorder || "none",
              }}>
                {t.showTape && (
                  <div style={{
                    position: "absolute", top: -7, left: "50%",
                    transform: "translateX(-50%) rotate(-2deg)",
                    width: 55, height: 14,
                    background: "rgba(255,210,90,.6)",
                    borderRadius: 2, zIndex: 2,
                  }} />
                )}
                {t.content}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 3 }}>{t.name}</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--text-3)", letterSpacing: ".06em" }}>{t.vibe}</div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
