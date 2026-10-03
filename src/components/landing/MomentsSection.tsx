"use client";
import { useState } from "react";

const moments = [
  {
    title: "Date Night",
    font: "'Dancing Script', cursive",
    text: "that night under the lights",
    gradient: "linear-gradient(135deg,#d4a574,#c08060)",
    rotate: -3,
  },
  {
    title: "Best Friend",
    font: "'DM Mono', monospace",
    text: "HAPPY B-DAY BESTIE",
    gradient: "linear-gradient(135deg,#b4a0d4,#8888cc)",
    rotate: 2,
  },
  {
    title: "Anniversary",
    font: "'Caveat', cursive",
    text: "3 years of us",
    gradient: "linear-gradient(135deg,#d4b8a0,#c09878)",
    rotate: -1.5,
  },
  {
    title: "Graduation",
    font: "'DM Mono', monospace",
    text: "CLASS OF '25",
    gradient: "linear-gradient(135deg,#a8c4b4,#78a088)",
    rotate: 2.5,
  },
  {
    title: "Just Because",
    font: "'Dancing Script', cursive",
    text: "just because",
    gradient: "linear-gradient(135deg,#e0c8b0,#c4a882)",
    rotate: -2,
  },
  {
    title: "Long Distance",
    font: "'Caveat', cursive",
    text: "wish you were here",
    gradient: "linear-gradient(135deg,#a0b8d4,#7890b0)",
    rotate: 1.5,
  },
];

export default function MomentsSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="moments"
      style={{
        background: "var(--cream-deep)",
        borderTop: ".5px solid var(--border)",
        borderBottom: ".5px solid var(--border)",
        padding: "100px 48px 110px",
      }}
    >
      {/* Header */}
      <div className="reveal" style={{ textAlign: "center", marginBottom: 60 }}>
        {/* Eyebrow */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          padding: "5px 13px", borderRadius: 100,
          background: "rgba(255,255,255,0.5)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "0.5px solid rgba(139,99,71,0.16)",
          fontFamily: "'DM Mono', monospace",
          fontSize: 10, letterSpacing: ".16em",
          color: "#8B6347", textTransform: "uppercase" as const,
          marginBottom: 20,
        }}>
          <span style={{ fontSize: 8 }}>✦</span> occasions
        </div>

        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 46, fontWeight: 300, fontStyle: "italic",
          lineHeight: 1.1, letterSpacing: "-.01em",
          color: "var(--text)",
          marginBottom: 0,
        }}>
          Made for moments<br />like these.
        </h2>
      </div>

      {/* 2-col polaroid grid */}
      <div
        className="reveal-stagger moments-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px 24px",
          maxWidth: 560,
          margin: "0 auto",
        }}
      >
        {moments.map((m, i) => {
          const isHovered = hovered === i;
          return (
            <div
              key={m.title}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
              }}
            >
              {/* Polaroid */}
              <div style={{
                width: "100%",
                maxWidth: 180,
                background: "#fff",
                borderRadius: 3,
                boxShadow: isHovered
                  ? "0 12px 40px rgba(26,23,20,0.18), 0 2px 8px rgba(26,23,20,0.06)"
                  : "0 4px 16px rgba(26,23,20,0.10), 0 1px 3px rgba(26,23,20,0.05)",
                transform: isHovered
                  ? "rotate(0deg) translateY(-6px) scale(1.03)"
                  : `rotate(${m.rotate}deg)`,
                transition: "transform 0.35s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.35s ease",
                aspectRatio: "1 / 1.18",
                display: "flex",
                flexDirection: "column",
              }}>
                <div style={{
                  flex: 1,
                  margin: "9px 9px 0",
                  background: m.gradient,
                  borderRadius: 1,
                }} />
                <div style={{
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 6px",
                }}>
                  <span style={{
                    fontFamily: m.font,
                    fontSize: 8.5,
                    color: "#7a6e65",
                    textAlign: "center",
                    lineHeight: 1.3,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const,
                    overflow: "hidden",
                  }}>
                    {m.text}
                  </span>
                </div>
              </div>

              {/* Label */}
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 16,
                fontWeight: 400,
                fontStyle: "italic",
                color: isHovered ? "var(--brown)" : "var(--text-2)",
                transition: "color 0.2s ease",
                textAlign: "center",
                lineHeight: 1.2,
              }}>
                {m.title}
              </span>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          section { padding: 72px 24px 80px !important; }
          .moments-grid { gap: 32px 16px !important; }
        }
      `}</style>
    </section>
  );
}
