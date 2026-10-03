"use client";
import Link from "next/link";
import { useRef, useState } from "react";

const steps = [
  {
    num: "01",
    title: "Upload Your Photo",
    desc: "Drop any JPG, PNG or WebP — we crop it to the perfect Polaroid ratio.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
  },
  {
    num: "02",
    title: "Write Your Caption",
    desc: "Type what you'd write on the back of a photo you still carried.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    num: "03",
    title: "Add a Spotify Code",
    desc: "Paste a song link — the photo gets a scannable soundtrack.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M8 12.5c2-1 5-1 7 .5M7 9.5c2.5-1.5 7.5-1.5 10 .5M9 15.5c1.5-.8 3.5-.8 5 0"/>
      </svg>
    ),
  },
  {
    num: "04",
    title: "Print or Share",
    desc: "Download at 300 DPI, or send it straight to their phone.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"/>
      </svg>
    ),
  },
];

export default function StepsSection() {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft } = scrollRef.current;
    const cardWidth = scrollRef.current.firstElementChild
      ? (scrollRef.current.firstElementChild as HTMLElement).offsetWidth + 12
      : 280;
    const idx = Math.round(scrollLeft / cardWidth);
    setActive(Math.min(Math.max(idx, 0), steps.length - 1));
  };

  const scrollTo = (i: number) => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.children[i] as HTMLElement;
    card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    setActive(i);
  };

  return (
    <section id="how" style={{ padding: "100px 0", background: "var(--cream)", overflow: "hidden" }}>

      {/* Header */}
      <div className="reveal" style={{ textAlign: "center", marginBottom: 52, padding: "0 24px" }}>
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
          marginBottom: 18,
        }}>
          <span style={{ fontSize: 8 }}>✦</span> how it works
        </div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 44, fontWeight: 300, fontStyle: "italic",
          lineHeight: 1.1, letterSpacing: "-.01em",
          color: "var(--text)", marginBottom: 10,
        }}>
          Four steps,<br />one keepsake.
        </h2>
        <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text-3)", letterSpacing: ".01em" }}>
          No sign-up. No watermark. Free forever.
        </p>
      </div>

      {/* Slider — mobile horizontal scroll */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="steps-scroll reveal-stagger"
        style={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch" as never,
          gap: 12,
          paddingLeft: 24,
          paddingRight: 24,
          paddingBottom: 4,
          scrollbarWidth: "none" as const,
          msOverflowStyle: "none" as const,
        }}
      >
        {steps.map((s, i) => (
          <div
            key={s.num}
            className="step-card"
            style={{
              scrollSnapAlign: "start",
              flexShrink: 0,
              width: "76vw",
              maxWidth: 280,
              background: "rgba(255,255,255,0.68)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "0.5px solid rgba(255,255,255,0.9)",
              borderRadius: 20,
              padding: "28px 24px 26px",
              boxShadow: "0 2px 8px rgba(26,23,20,0.05), 0 8px 32px rgba(26,23,20,0.07)",
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            {/* Icon */}
            <div style={{
              width: 40, height: 40,
              borderRadius: 10,
              background: "rgba(139,99,71,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#8B6347",
              marginBottom: 20,
            }}>
              {s.icon}
            </div>

            {/* Number */}
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10.5,
              letterSpacing: ".12em",
              color: "#C4A882",
              marginBottom: 8,
            }}>
              {s.num}
            </div>

            {/* Title */}
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 17,
              fontWeight: 600,
              color: "var(--text)",
              letterSpacing: "-.01em",
              lineHeight: 1.2,
              marginBottom: 10,
            }}>
              {s.title}
            </div>

            {/* Desc */}
            <div style={{
              fontSize: 13.5,
              fontWeight: 300,
              color: "var(--text-2)",
              lineHeight: 1.65,
            }}>
              {s.desc}
            </div>
          </div>
        ))}
        {/* Right padding ghost */}
        <div style={{ flexShrink: 0, width: 8 }} />
      </div>

      {/* Step dots */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 22 }}>
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            style={{
              width: active === i ? 22 : 6,
              height: 6,
              borderRadius: 3,
              background: active === i ? "#8B6347" : "rgba(26,23,20,0.14)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "width 0.3s cubic-bezier(0.34,1.2,0.64,1), background 0.2s ease",
            }}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="reveal" style={{ textAlign: "center", marginTop: 52, padding: "0 24px" }}>
        <Link
          href="/editor"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14.5, fontWeight: 500,
            background: "#6B4F3A", color: "#fff",
            border: "none", borderRadius: 12,
            padding: "13px 28px",
            cursor: "pointer",
            textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 6,
            boxShadow: "0 1px 3px rgba(107,79,58,0.2), 0 4px 14px rgba(107,79,58,0.24)",
            transition: "opacity .15s ease",
            letterSpacing: ".005em",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          Try it free — no sign up
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>

      <style jsx>{`
        .steps-scroll::-webkit-scrollbar { display: none; }

        /* Desktop — static 4-col grid */
        @media (min-width: 900px) {
          section { padding: 100px 48px !important; }
          .steps-scroll {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            overflow: visible !important;
            scroll-snap-type: none !important;
            padding: 0 !important;
            gap: 16px !important;
            max-width: 1060px;
            margin: 0 auto;
          }
          .step-card {
            width: auto !important;
            max-width: none !important;
          }
        }
      `}</style>
    </section>
  );
}
