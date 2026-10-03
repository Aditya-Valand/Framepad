"use client";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section
      className="reveal"
      style={{
        padding: "110px 48px 100px",
        textAlign: "center",
        background: "var(--cream)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle radial glow behind */}
      <div aria-hidden style={{
        position: "absolute",
        top: "30%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 560, height: 360,
        background: "radial-gradient(ellipse, rgba(139,99,71,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Eyebrow */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: "5px 14px", borderRadius: 100,
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "0.5px solid rgba(139,99,71,0.16)",
        fontFamily: "'DM Mono', monospace",
        fontSize: 10, letterSpacing: ".16em",
        color: "#8B6347", textTransform: "uppercase" as const,
        marginBottom: 28,
      }}>
        <span style={{ fontSize: 8 }}>✦</span> get started
      </div>

      {/* Heading */}
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 300, fontStyle: "italic",
        lineHeight: 1.12, letterSpacing: "-.01em",
        marginBottom: 18,
        maxWidth: 560,
        margin: "0 auto 18px",
        color: "var(--text)",
      }}
        className="fcta-h2"
      >
        The best gifts aren&apos;t bought.<br />
        They&apos;re{" "}
        <em style={{ color: "var(--brown)", fontStyle: "italic" }}>made</em>.
      </h2>

      {/* Subline */}
      <p style={{
        fontSize: 15, fontWeight: 300,
        color: "var(--text-3)",
        marginBottom: 40,
        letterSpacing: ".01em",
      }}>
        It takes three minutes. It lasts forever.
      </p>

      {/* CTA Button */}
      <Link
        href="/editor"
        className="fcta-btn"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15, fontWeight: 500,
          background: "linear-gradient(135deg, #9B7B68 0%, #8B6347 50%, #7A5538 100%)",
          color: "#fff",
          border: "none",
          borderRadius: 12,
          padding: "15px 36px",
          cursor: "pointer",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14), 0 4px 20px rgba(139,99,71,0.3)",
          transition: "transform .2s ease, box-shadow .2s ease",
          letterSpacing: ".01em",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.14), 0 8px 28px rgba(139,99,71,0.38)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.14), 0 4px 20px rgba(139,99,71,0.3)";
        }}
      >
        Make Your Polaroid
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </Link>

      {/* Trust line */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 10, marginTop: 22,
        fontFamily: "'DM Mono', monospace",
        fontSize: 10.5, letterSpacing: ".08em",
        color: "var(--text-3)",
      }}>
        {["free", "no sign up", "no watermark"].map((t, i) => (
          <span key={t} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {i > 0 && <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(26,23,20,0.2)", display: "inline-block" }} />}
            {t}
          </span>
        ))}
      </div>

      <style jsx>{`
        .fcta-h2 { font-size: 50px; }
        @media (max-width: 768px) {
          section { padding: 88px 28px 80px !important; }
          .fcta-h2 { font-size: 36px !important; }
        }
      `}</style>
    </section>
  );
}
