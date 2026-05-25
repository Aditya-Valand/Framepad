import React from "react";

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

export default function TemplatesSection() {
  return (
    <section style={{ padding: "100px 0 80px", background: "var(--cream)" }} id="templates">
      <div className="reveal" style={{ textAlign: "center", padding: "0 48px", marginBottom: 48 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 46, fontWeight: 300, fontStyle: "italic", marginBottom: 12 }}>
          Every moment has its frame.
        </h2>
        <p style={{ fontSize: 15, fontWeight: 300, color: "var(--text-2)" }}>
          Nine templates. Infinite versions. All yours.
        </p>
      </div>

      <div
        className="scrollbar-hide"
        style={{
          display: "flex",
          gap: 20,
          overflowX: "auto",
          padding: "20px 48px 32px",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {templates.map((t) => (
          <div
            key={t.name}
            style={{
              flex: "0 0 auto",
              width: t.width || 190,
              scrollSnapAlign: "start",
              cursor: "pointer",
              transition: "transform .2s ease",
            }}
          >
            <div
              style={{
                background: t.cardBg || "#fff",
                boxShadow: "0 6px 24px rgba(0,0,0,.1)",
                borderRadius: 3,
                marginBottom: 12,
                overflow: "hidden",
                position: "relative",
                border: t.cardBorder || "none",
              }}
            >
              {t.showTape && (
                <div
                  style={{
                    position: "absolute",
                    top: -7,
                    left: "50%",
                    transform: "translateX(-50%) rotate(-2deg)",
                    width: 55,
                    height: 14,
                    background: "rgba(255,210,90,.6)",
                    borderRadius: 2,
                    zIndex: 2,
                  }}
                />
              )}
              {t.content}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 3 }}>
              {t.name}
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-3)", letterSpacing: ".06em" }}>
              {t.vibe}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          section > div:first-child { padding: 0 24px !important; }
          section > div:nth-child(2) { padding: 20px 24px 32px !important; }
        }
      `}</style>
    </section>
  );
}
