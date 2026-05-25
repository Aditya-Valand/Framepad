import Link from "next/link";

const prints = [
  {
    name: "One Moment",
    qty: "1 print",
    price: "₹149",
    tagline: "Because one memory is enough to change someone's day.",
    note: "Perfect for that one photo sitting in your camera roll — the one you keep coming back to.",
    finish: ["Glossy or Matte"],
    size: "Standard Polaroid (3.5\" × 4.25\")",
    delivery: "5–7 days",
    cta: "Print this one",
    ctaLink: "/editor",
    highlight: false,
    save: null,
    badge: null,
  },
  {
    name: "A Small Story",
    qty: "5 prints",
    price: "₹599",
    tagline: "Some stories take more than one frame to tell.",
    note: "A birthday. A trip. A friendship. Five prints, one feeling.",
    finish: ["Glossy or Matte"],
    size: "Standard Polaroid (3.5\" × 4.25\")",
    delivery: "5–7 days",
    cta: "Tell your story",
    ctaLink: "/editor",
    highlight: true,
    save: "Save ₹146",
    badge: "Most loved",
  },
  {
    name: "The Full Roll",
    qty: "12 prints",
    price: "₹1,199",
    tagline: "A whole roll of film. Every shot worth keeping.",
    note: "For the person who loves deeply and photographs everything.",
    finish: ["Glossy or Matte", "Mixed finish allowed"],
    size: "Standard Polaroid (3.5\" × 4.25\")",
    delivery: "5–7 days",
    cta: "Fill the roll",
    ctaLink: "/editor",
    highlight: false,
    save: "Save ₹589",
    badge: null,
  },
];

const perks = [
  { icon: "✦", text: "Free editing — always" },
  { icon: "✦", text: "No subscription, ever" },
  { icon: "✦", text: "You pay only when you print" },
  { icon: "✦", text: "100% satisfaction or we reprint" },
];

export default function PricingSection() {
  return (
    <section
      id="pricing"
      style={{
        background: "var(--cream-deep)",
        borderTop: ".5px solid var(--border)",
        padding: "clamp(64px, 8vw, 100px) clamp(18px, 5vw, 48px) clamp(48px, 6vw, 80px)",
      }}
    >
      {/* Heading */}
      <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: "var(--text-3)",
          marginBottom: 16,
        }}>
          Pricing
        </p>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(36px, 5vw, 52px)",
            fontWeight: 300,
            fontStyle: "italic",
            lineHeight: 1.15,
            marginBottom: 16,
            letterSpacing: "-.01em",
          }}
        >
          You design for free.<br />
          Pay only when it&rsquo;s real.
        </h2>
        <p style={{ fontSize: 15, fontWeight: 300, color: "var(--text-2)", maxWidth: 420, margin: "0 auto" }}>
          No subscriptions. No monthly fees. Create as many designs as you want —
          only pay when you&rsquo;re ready to hold it in your hands.
        </p>
      </div>

      {/* Cards */}
      <div
        className="reveal pricing-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          maxWidth: 980,
          margin: "0 auto 56px",
          alignItems: "start",
        }}
      >
        {prints.map((p) => (
          <div
            key={p.name}
            style={{
              background: p.highlight ? "var(--dark)" : "rgba(255,255,255,0.55)",
              border: p.highlight ? "none" : ".5px solid rgba(26,23,20,.07)",
              borderRadius: 20,
              padding: "32px 28px",
              position: "relative",
              color: p.highlight ? "var(--cream)" : "var(--text)",
              boxShadow: p.highlight ? "0 24px 60px rgba(26,23,20,.18)" : "none",
            }}
          >
            {p.badge && (
              <div style={{
                position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                background: "#8B6347", color: "#fff",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11, fontWeight: 500,
                padding: "5px 16px", borderRadius: 100,
                letterSpacing: ".04em", whiteSpace: "nowrap",
              }}>
                {p.badge}
              </div>
            )}

            {/* Qty pill */}
            <div style={{
              display: "inline-flex", alignItems: "center",
              background: p.highlight ? "rgba(255,255,255,.08)" : "rgba(26,23,20,.05)",
              borderRadius: 100, padding: "4px 12px",
              fontFamily: "'DM Mono', monospace",
              fontSize: 10.5, letterSpacing: ".1em", textTransform: "uppercase",
              color: p.highlight ? "rgba(242,237,228,.6)" : "var(--text-3)",
              marginBottom: 20,
            }}>
              {p.qty}
            </div>

            {/* Plan name */}
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 26, fontWeight: 300, fontStyle: "italic",
              marginBottom: 4, lineHeight: 1.2,
            }}>
              {p.name}
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 44, fontWeight: 300, lineHeight: 1,
              }}>
                {p.price}
              </span>
              {p.save && (
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11, fontWeight: 500,
                  background: p.highlight ? "rgba(139,99,71,.5)" : "rgba(139,99,71,.12)",
                  color: p.highlight ? "#F2C899" : "#8B6347",
                  borderRadius: 100, padding: "2px 10px",
                }}>
                  {p.save}
                </span>
              )}
            </div>

            {/* Tagline */}
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 15, fontStyle: "italic",
              color: p.highlight ? "rgba(242,237,228,.65)" : "var(--text-2)",
              marginBottom: 10, lineHeight: 1.5,
            }}>
              &ldquo;{p.tagline}&rdquo;
            </p>

            {/* Note */}
            <p style={{
              fontSize: 12.5, fontWeight: 300,
              color: p.highlight ? "rgba(242,237,228,.5)" : "var(--text-3)",
              marginBottom: 24, lineHeight: 1.65,
            }}>
              {p.note}
            </p>

            {/* Details */}
            <div style={{
              borderTop: p.highlight ? ".5px solid rgba(255,255,255,.1)" : ".5px solid rgba(26,23,20,.07)",
              paddingTop: 20, marginBottom: 24,
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              {[
                { label: "Size", val: p.size },
                { label: "Finish", val: p.finish.join(" · ") },
                { label: "Delivery", val: p.delivery },
              ].map(({ label, val }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: p.highlight ? "rgba(242,237,228,.4)" : "var(--text-3)",
                    flexShrink: 0,
                  }}>{label}</span>
                  <span style={{
                    fontSize: 12, fontWeight: 400, textAlign: "right",
                    color: p.highlight ? "rgba(242,237,228,.75)" : "var(--text-2)",
                  }}>{val}</span>
                </div>
              ))}
            </div>

            <Link
              href={p.ctaLink}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13.5, fontWeight: 500,
                display: "block", textAlign: "center",
                padding: "13px 24px", borderRadius: 100,
                textDecoration: "none", transition: "all .2s ease",
                ...(p.highlight
                  ? { background: "#fff", color: "#1A1714" }
                  : { background: "transparent", color: "var(--text)", border: ".5px solid rgba(26,23,20,.15)" }),
              }}
            >
              {p.cta} →
            </Link>
          </div>
        ))}
      </div>

      {/* Perks strip */}
      <div className="reveal" style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px 32px",
        maxWidth: 760, margin: "0 auto",
      }}>
        {perks.map(({ icon, text }) => (
          <div key={text} style={{
            display: "flex", alignItems: "center", gap: 8,
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            color: "var(--text-2)", fontWeight: 300,
          }}>
            <span style={{ color: "#8B6347", fontSize: 10 }}>{icon}</span>
            {text}
          </div>
        ))}
      </div>

      {/* Bottom note */}
      <p className="reveal" style={{
        textAlign: "center", marginTop: 28,
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 17, fontStyle: "italic", fontWeight: 300,
        color: "var(--text-3)",
      }}>
        The editor is free, forever. Print when you&rsquo;re ready.
      </p>

      <style jsx>{`
        .pricing-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 900px) {
          section { padding: 80px 28px 60px !important; }
          .pricing-grid {
            grid-template-columns: 1fr !important;
            max-width: 480px !important;
          }
        }
        @media (max-width: 540px) {
          section { padding: 64px 18px 48px !important; }
          .pricing-grid {
            max-width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
