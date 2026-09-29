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
        paddingTop: 80,
      }}
    >
      <div
        className="hero-grid grid grid-cols-1 lg:grid-cols-2"
        style={{
          gap: 48,
          alignItems: "center",
          maxWidth: 1440,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* Text + CTA */}
        <div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              letterSpacing: ".14em",
              color: "var(--text-3)",
              textTransform: "uppercase",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            ✦ design it yourself
          </div>
          <h1
            className="hero-title"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              lineHeight: 1.08,
              letterSpacing: "-.01em",
              marginBottom: 24,
              opacity: 0,
              animation: "fadeUp .8s ease forwards .1s",
            }}
          >
            Some gifts
            <br />
            are bought.
            <br />
            This one is{" "}
            <em style={{ fontStyle: "italic", color: "var(--brown)" }}>made.</em>
          </h1>
          <p
            className="hero-desc"
            style={{
              fontWeight: 300,
              color: "var(--text-2)",
              lineHeight: 1.75,
              maxWidth: 480,
              marginBottom: 36,
              opacity: 0,
              animation: "fadeUp .8s ease forwards .3s",
            }}
          >
            Design your own Polaroid. Add a caption only you would write, a song
            only you two know. Then hold it in your hands — or send it to theirs.
          </p>

          {/* Buttons */}
          <div
            className="hero-buttons"
            style={{ opacity: 0, animation: "fadeUp .8s ease forwards .45s" }}
          >
            <Link
              href="/editor"
              className="hero-cta"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                background: "var(--brown)",
                color: "#fff",
                border: "none",
                borderRadius: 100,
                padding: "14px 32px",
                cursor: "pointer",
                transition: "all .22s ease",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
              }}
            >
              Make Your First Polaroid →
            </Link>
            <button
              className="hero-secondary"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                color: "var(--text-2)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: 3,
                padding: 0,
              }}
              onClick={() =>
                document
                  .getElementById("templates")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              See templates
            </button>
          </div>
        </div>

        {/* Floating polaroids */}
        <div
          className="hero-visual"
          style={{
            position: "relative",
            opacity: 0,
            animation: "fadeIn .9s ease forwards .5s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative", width: "100%", maxWidth: 620, height: "100%" }}>
            {/* P1 */}
            <div
              style={{
                position: "absolute",
                background: "#fff",
                boxShadow: "0 12px 40px rgba(0,0,0,.12)",
                borderRadius: 3,
                width: 195,
                top: 10,
                left: "2%",
                transform: "rotate(-4deg)",
                animation: "float1 6s ease-in-out infinite",
              }}
            >
              <div style={{ height: 168, margin: "11px 11px 0", background: "linear-gradient(135deg, #e8d5c0, #c4a882)" }} />
              <div style={{ height: 42, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: 15, color: "#5a4a3a" }}>always you</span>
              </div>
            </div>

            {/* P2 */}
            <div
              style={{
                position: "absolute",
                background: "#fff",
                boxShadow: "0 12px 40px rgba(0,0,0,.12)",
                borderRadius: 3,
                width: 185,
                top: 50,
                left: "32%",
                transform: "rotate(3deg)",
                animation: "float2 7s ease-in-out infinite .8s",
              }}
            >
              <div style={{ height: 160, margin: "10px 10px 0", background: "linear-gradient(135deg, #d4c5b0, #a89080)" }} />
              <div style={{ height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#7a6e65", letterSpacing: ".08em" }}>26 · 04 · 2025</span>
              </div>
            </div>

            {/* P3 — Spotify */}
            <div
              style={{
                position: "absolute",
                background: "#fff",
                boxShadow: "0 12px 40px rgba(0,0,0,.12)",
                borderRadius: 3,
                width: 210,
                top: 250,
                left: "5%",
                transform: "rotate(-2deg)",
                animation: "float3 5.5s ease-in-out infinite 1.2s",
              }}
            >
              <div style={{ height: 182, margin: "11px 11px 0", background: "linear-gradient(160deg, #c8b8a0, #8b7060)" }} />
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
            <div
              style={{
                position: "absolute",
                background: "#fff",
                boxShadow: "0 12px 40px rgba(0,0,0,.12)",
                borderRadius: 3,
                width: 180,
                top: 20,
                left: "60%",
                transform: "rotate(5deg)",
                animation: "float4 8s ease-in-out infinite .4s",
              }}
            >
              <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%) rotate(-2deg)", width: 55, height: 16, background: "rgba(255,210,100,.55)", borderRadius: 2, zIndex: 2 }} />
              <div style={{ height: 152, margin: "10px 10px 0", background: "linear-gradient(135deg, #e0ceb8, #b89878)" }} />
              <div style={{ height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: 13, color: "#7a6e65" }}>besties forever</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ── Mobile ── */
        .hero-section {
          padding: 80px 20px 48px;
        }
        .hero-grid {
          gap: 40px;
        }
        .hero-title {
          font-size: 42px;
        }
        .hero-desc {
          font-size: 15px;
        }
        .hero-visual {
          height: 280px;
          overflow: visible;
        }
        .hero-buttons {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 14px;
        }
        .hero-cta {
          font-size: 15px;
          padding: 15px 28px;
          width: 100%;
          text-align: center;
          justify-content: center;
        }
        .hero-secondary {
          font-size: 14px;
          padding-left: 4px;
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
            font-size: 18px;
          }
          .hero-visual {
            height: 580px;
          }
          .hero-buttons {
            flex-direction: row;
            align-items: center;
            gap: 12px;
          }
          .hero-cta {
            font-size: 15px;
            padding: 14px 32px;
            width: auto;
          }
        }
      `}</style>
    </section>
  );
}
