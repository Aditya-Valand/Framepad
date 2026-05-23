import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--dark)",
        color: "var(--cream)",
        padding: "60px 48px 40px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 48,
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24,
              fontWeight: 300,
              fontStyle: "italic",
              marginBottom: 16,
            }}
          >
            Polamuse
          </div>
          <p
            style={{
              fontSize: 13,
              fontWeight: 300,
              color: "rgba(242,237,228,.5)",
              lineHeight: 1.7,
              maxWidth: 260,
            }}
          >
            Design Polaroids with your own photos, captions, and Spotify codes.
            Made with love for people who give gifts that actually mean something.
          </p>
        </div>

        {/* Product */}
        <div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: ".15em",
              color: "rgba(242,237,228,.4)",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            Product
          </div>
          {["Editor", "Templates", "Pricing"].map((l) => (
            <a
              key={l}
              href={l === "Editor" ? "/editor" : `#${l.toLowerCase()}`}
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 300,
                color: "rgba(242,237,228,.6)",
                textDecoration: "none",
                padding: "6px 0",
                transition: "color .15s ease",
              }}
            >
              {l}
            </a>
          ))}
        </div>

        {/* Company */}
        <div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: ".15em",
              color: "rgba(242,237,228,.4)",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            Company
          </div>
          {[
            { label: "About", href: "#" },
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "#" },
          ].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 300,
                color: "rgba(242,237,228,.6)",
                textDecoration: "none",
                padding: "6px 0",
                transition: "color .15s ease",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Connect */}
        <div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: ".15em",
              color: "rgba(242,237,228,.4)",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            Connect
          </div>
          {["Instagram", "Twitter", "Email"].map((l) => (
            <a
              key={l}
              href="#"
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 300,
                color: "rgba(242,237,228,.6)",
                textDecoration: "none",
                padding: "6px 0",
                transition: "color .15s ease",
              }}
            >
              {l}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div
        style={{
          borderTop: ".5px solid rgba(242,237,228,.1)",
          marginTop: 48,
          paddingTop: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1100,
          margin: "48px auto 0",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 300, color: "rgba(242,237,228,.4)" }}>
          © 2025 Polamuse. Made with ♥ for people who give real gifts.
        </div>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: "rgba(242,237,228,.3)",
            letterSpacing: ".08em",
          }}
        >
          v1.0
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          footer { padding: 48px 24px 32px !important; }
          footer > div:first-child {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 500px) {
          footer > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
