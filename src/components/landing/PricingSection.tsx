import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Everything you need to make your first Polaroid.",
    features: [
      "Unlimited designs",
      "All 9 templates",
      "Custom captions",
      "Spotify code integration",
      "High-res PNG download",
      "No watermark",
    ],
    cta: "Start Creating",
    ctaLink: "/editor",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$4.99",
    period: "one-time",
    desc: "For the person who makes Polaroids for everyone.",
    features: [
      "Everything in Free",
      "Print-ready 300 DPI export",
      "Custom QR codes",
      "Priority templates",
      "Batch export (up to 5)",
      "Early access to new features",
    ],
    cta: "Get Pro — $4.99",
    ctaLink: "/order",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Gift Pack",
    price: "$9.99",
    period: "one-time",
    desc: "Send a printed Polaroid. We print, we ship, they smile.",
    features: [
      "Everything in Pro",
      "1× printed Polaroid (glossy)",
      "Premium cardstock",
      "Gift-ready envelope",
      "Handwritten note option",
      "Shipped within 3 days",
    ],
    cta: "Order Gift Pack",
    ctaLink: "/order",
    highlight: false,
    icon: "🎁",
  },
];

export default function PricingSection() {
  return (
    <section
      id="pricing"
      style={{
        background: "var(--cream-deep)",
        borderTop: ".5px solid var(--border)",
        padding: "100px 48px",
      }}
    >
      <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 46,
            fontWeight: 300,
            fontStyle: "italic",
            marginBottom: 12,
          }}
        >
          Simple, honest pricing.
        </h2>
        <p style={{ fontSize: 15, fontWeight: 300, color: "var(--text-2)" }}>
          No subscriptions. No hidden fees. Pay once, keep forever.
        </p>
      </div>

      <div
        className="reveal"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          maxWidth: 960,
          margin: "0 auto",
          alignItems: "start",
        }}
      >
        {plans.map((p) => (
          <div
            key={p.name}
            style={{
              background: p.highlight ? "var(--dark)" : "rgba(255,255,255,.5)",
              border: p.highlight ? "none" : ".5px solid rgba(26,23,20,.06)",
              borderRadius: 20,
              padding: 32,
              position: "relative",
              color: p.highlight ? "var(--cream)" : "var(--text)",
              transition: "transform .2s ease, box-shadow .2s ease",
            }}
          >
            {p.badge && (
              <div
                style={{
                  position: "absolute",
                  top: -12,
                  right: 20,
                  background: "var(--brown)",
                  color: "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 500,
                  padding: "5px 14px",
                  borderRadius: 100,
                  letterSpacing: ".02em",
                }}
              >
                {p.badge}
              </div>
            )}
            {p.icon && (
              <div style={{ fontSize: 28, marginBottom: 8 }}>{p.icon}</div>
            )}
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                letterSpacing: ".12em",
                color: p.highlight ? "rgba(242,237,228,.5)" : "var(--text-3)",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              {p.name}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 42,
                  fontWeight: 300,
                }}
              >
                {p.price}
              </span>
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                  color: p.highlight ? "rgba(242,237,228,.5)" : "var(--text-3)",
                }}
              >
                {p.period}
              </span>
            </div>
            <p
              style={{
                fontSize: 13.5,
                fontWeight: 300,
                color: p.highlight ? "rgba(242,237,228,.7)" : "var(--text-2)",
                marginBottom: 24,
                lineHeight: 1.5,
              }}
            >
              {p.desc}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px" }}>
              {p.features.map((f) => (
                <li
                  key={f}
                  style={{
                    fontSize: 13,
                    fontWeight: 300,
                    color: p.highlight ? "rgba(242,237,228,.8)" : "var(--text-2)",
                    padding: "7px 0",
                    borderBottom: p.highlight
                      ? ".5px solid rgba(242,237,228,.1)"
                      : ".5px solid rgba(26,23,20,.06)",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: p.highlight
                        ? "rgba(242,237,228,.1)"
                        : "rgba(26,23,20,.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={p.ctaLink}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13.5,
                fontWeight: 500,
                display: "block",
                textAlign: "center",
                padding: "12px 24px",
                borderRadius: 100,
                textDecoration: "none",
                transition: "all .2s ease",
                ...(p.highlight
                  ? {
                      background: "#fff",
                      color: "var(--dark)",
                      border: "none",
                    }
                  : {
                      background: "transparent",
                      color: "var(--text)",
                      border: ".5px solid rgba(26,23,20,.15)",
                    }),
              }}
            >
              {p.cta}
            </Link>
          </div>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          section { padding: 80px 24px !important; }
          section > div:nth-child(2) {
            grid-template-columns: 1fr !important;
            max-width: 400px !important;
          }
        }
      `}</style>
    </section>
  );
}
