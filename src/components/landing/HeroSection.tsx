import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="hero-section"
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="hero-grid grid grid-cols-1 lg:grid-cols-2"
        style={{
          alignItems: "center",
          maxWidth: 1440,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* Text + CTA */}
        <div style={{ position: "relative", zIndex: 1 }}>

          {/* Eyebrow — glass pill */}
          <div
            className="hero-eyebrow"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "6px 14px",
              borderRadius: 100,
              background: "rgba(255,255,255,0.52)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "0.5px solid rgba(139,99,71,0.18)",
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: ".16em",
              color: "#8B6347",
              textTransform: "uppercase" as const,
              marginBottom: 16,
              opacity: 0,
              animation: "fadeUp 0.6s ease forwards 0s",
            }}
          >
            <span style={{ fontSize: 8 }}>✦</span>
            design it yourself
          </div>

          <h1
            className="hero-title"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              lineHeight: 1.06,
              letterSpacing: "-.02em",
              marginBottom: 16,
            }}
          >
            Some gifts
            <br />
            are bought.
            <br />
            <span style={{ fontWeight: 300 }}>
              This one is{" "}
              <em style={{ fontStyle: "italic", color: "var(--brown)", fontWeight: 300 }}>made.</em>
            </span>
          </h1>

          <p
            className="hero-desc"
            style={{
              fontWeight: 300,
              color: "var(--text-2)",
              lineHeight: 1.65,
              maxWidth: 340,
              marginBottom: 28,
            }}
          >
            Your photo, your caption, your song — printed and shipped.
          </p>

          {/* Buttons */}
          <div className="hero-buttons" style={{}}>
            <Link
              href="/editor"
              className="hero-cta"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                background: "linear-gradient(135deg, #9B7B68 0%, #8B6347 50%, #7A5538 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16), 0 4px 20px rgba(139,99,71,0.32)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "14px 28px",
                cursor: "pointer",
                transition: "transform .2s ease, box-shadow .2s ease, opacity .2s ease",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
                letterSpacing: ".005em",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.16), 0 8px 28px rgba(139,99,71,0.38)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.16), 0 4px 20px rgba(139,99,71,0.32)"; }}
            >
              Make Your First Polaroid →
            </Link>
            <button
              className="hero-secondary"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: 13.5,
                color: "var(--text-3)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                letterSpacing: ".005em",
                transition: "color .18s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-3)"; }}
              onClick={() => document.getElementById("templates")?.scrollIntoView({ behavior: "smooth" })}
            >
              See templates
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Floating polaroids */}
        <div
          className="hero-visual"
          style={{
            position: "relative",
            opacity: 0,
            animation: "fadeIn .9s ease forwards .45s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative", width: "100%", maxWidth: 620, height: "100%" }}>

            {/* P1 */}
            <div style={{
              position: "absolute",
              background: "#fff",
              boxShadow: "0 4px 8px rgba(26,23,20,0.06), 0 16px 48px rgba(26,23,20,0.12)",
              borderRadius: 3,
              width: 195,
              top: 10, left: "2%",
              transform: "rotate(-4deg)",
              animation: "float1 6s ease-in-out infinite",
            }}>
              <div style={{ height: 168, margin: "11px 11px 0", background: "linear-gradient(135deg, #e8d5c0, #c4a882)", borderRadius: 1 }} />
              <div style={{ height: 42, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: 15, color: "#5a4a3a" }}>always you</span>
              </div>
            </div>

            {/* P2 */}
            <div style={{
              position: "absolute",
              background: "#fff",
              boxShadow: "0 4px 8px rgba(26,23,20,0.06), 0 16px 48px rgba(26,23,20,0.12)",
              borderRadius: 3,
              width: 185,
              top: 50, left: "32%",
              transform: "rotate(3deg)",
              animation: "float2 7s ease-in-out infinite .8s",
            }}>
              <div style={{ height: 160, margin: "10px 10px 0", background: "linear-gradient(135deg, #d4c5b0, #a89080)", borderRadius: 1 }} />
              <div style={{ height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#7a6e65", letterSpacing: ".08em" }}>26 · 04 · 2025</span>
              </div>
            </div>

            {/* P3 — Spotify */}
            <div style={{
              position: "absolute",
              background: "#fff",
              boxShadow: "0 4px 8px rgba(26,23,20,0.06), 0 16px 48px rgba(26,23,20,0.12)",
              borderRadius: 3,
              width: 210,
              top: 250, left: "5%",
              transform: "rotate(-2deg)",
              animation: "float3 5.5s ease-in-out infinite 1.2s",
            }}>
              <div style={{ height: 182, margin: "11px 11px 0", background: "linear-gradient(160deg, #c8b8a0, #8b7060)", borderRadius: 1 }} />
              <div style={{ height: 38, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <div style={{ width: 20, height: 20, background: "#1a1714", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </div>
                <div style={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                  {Array.from({ length: 18 }, (_, i) => (
                    <div key={i} style={{ width: 2.5, background: "#1a1714", borderRadius: 1, height: 6 + Math.sin(i * 0.8) * 5 }} />
                  ))}
                </div>
              </div>
            </div>

            {/* P4 — Tape */}
            <div style={{
              position: "absolute",
              background: "#fff",
              boxShadow: "0 4px 8px rgba(26,23,20,0.06), 0 16px 48px rgba(26,23,20,0.12)",
              borderRadius: 3,
              width: 180,
              top: 20, left: "60%",
              transform: "rotate(5deg)",
              animation: "float4 8s ease-in-out infinite .4s",
            }}>
              <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%) rotate(-2deg)", width: 55, height: 16, background: "rgba(255,210,100,.52)", borderRadius: 2, zIndex: 2 }} />
              <div style={{ height: 152, margin: "10px 10px 0", background: "linear-gradient(135deg, #e0ceb8, #b89878)", borderRadius: 1 }} />
              <div style={{ height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: 13, color: "#7a6e65" }}>besties forever</span>
              </div>
            </div>

            {/* Floating glass badge */}
            <div style={{
              position: "absolute",
              bottom: 20, right: "4%",
              background: "rgba(255,255,255,0.62)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "0.5px solid rgba(255,255,255,0.8)",
              borderRadius: 14,
              padding: "10px 14px",
              boxShadow: "0 4px 24px rgba(26,23,20,0.10)",
              display: "flex", alignItems: "center", gap: 9,
              zIndex: 10,
              animation: "float2 6s ease-in-out infinite 2s",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "linear-gradient(135deg, #e8d5c0, #c4a882)",
                flexShrink: 0,
              }} />
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#1A1714", lineHeight: 1.2 }}>2,400+ frames</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, color: "#A39080", lineHeight: 1.3 }}>made with love</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Paper texture */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <style jsx>{`
        /* ── Mobile ── */
        .hero-section {
          padding: 84px 24px 40px;
        }
        .hero-grid {
          gap: 32px;
        }
        .hero-title {
          font-size: 44px;
          font-weight: 700;
          opacity: 0;
          animation: fadeUp 0.75s ease forwards 0.12s;
        }
        .hero-desc {
          font-size: 15px;
          opacity: 0;
          animation: fadeUp 0.75s ease forwards 0.28s;
        }
        .hero-buttons {
          opacity: 0;
          animation: fadeUp 0.75s ease forwards 0.4s;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }
        .hero-cta {
          font-size: 14.5px;
          width: 100%;
          text-align: center;
          justify-content: center;
        }
        .hero-secondary {
          padding-left: 2px;
        }
        .hero-visual {
          height: 360px;
          overflow: visible;
        }

        /* ── Desktop (lg = 1024px) ── */
        @media (min-width: 1024px) {
          .hero-section {
            padding: 120px 48px 80px;
          }
          .hero-grid {
            gap: 64px;
          }
          .hero-title {
            font-size: 78px;
          }
          .hero-desc {
            font-size: 17px;
          }
          .hero-visual {
            height: 580px;
          }
          .hero-buttons {
            flex-direction: row;
            align-items: center;
            gap: 14px;
          }
          .hero-cta {
            font-size: 15px;
            width: auto;
          }
        }
      `}</style>
    </section>
  );
}
