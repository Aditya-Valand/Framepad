"use client";
import Link from "next/link";

const IgIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none"/>
  </svg>
);
const XIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const FbIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer style={{
      background: "#0E0C0A",
      borderTop: ".5px solid rgba(242,237,228,.06)",
    }}>
      {/* ── Brand strip ── */}
      <div style={{
        borderBottom: ".5px solid rgba(242,237,228,.06)",
        padding: "52px 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: 1100,
        margin: "0 auto",
        flexWrap: "wrap" as const,
        gap: 28,
      }}>
        {/* Logo + tagline */}
        <div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 26, fontWeight: 300, fontStyle: "italic",
            color: "rgba(242,237,228,.88)",
            letterSpacing: "-.01em",
            marginBottom: 6,
          }}>
            Pola <em>muse</em>
          </div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 300,
            color: "rgba(242,237,228,.32)",
            margin: 0,
          }}>
            Make something they'll keep.
          </p>
        </div>

        {/* Social icons */}
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { label: "Instagram", Icon: IgIcon },
            { label: "X",         Icon: XIcon  },
            { label: "Facebook",  Icon: FbIcon  },
          ].map(({ label, Icon }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="ft-social"
              style={{
                width: 40, height: 40, borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: ".5px solid rgba(242,237,228,.1)",
                color: "rgba(242,237,228,.4)",
                textDecoration: "none",
                transition: "color .18s, background .18s, transform .18s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(242,237,228,0.07)";
                e.currentTarget.style.color = "rgba(242,237,228,.85)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(242,237,228,.4)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>

      {/* ── Links grid ── */}
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "40px 48px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "32px 40px",
        borderBottom: ".5px solid rgba(242,237,228,.06)",
      }}
        className="ft-links"
      >
        {[
          {
            label: "Product",
            links: [
              { name: "Editor",       href: "/editor"    },
              { name: "Templates",    href: "#templates" },
              { name: "Pricing",      href: "#pricing"   },
              { name: "How it works", href: "#how"       },
            ],
          },
          {
            label: "Company",
            links: [
              { name: "About",   href: "#"        },
              { name: "Privacy", href: "/privacy" },
              { name: "Terms",   href: "#"        },
            ],
          },
          {
            label: "Get started",
            links: [
              { name: "Make a Polaroid", href: "/editor"    },
              { name: "My Designs",      href: "/designs"   },
              { name: "Order prints",    href: "/order"     },
            ],
          },
        ].map((col) => (
          <div key={col.label}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9, letterSpacing: ".18em",
              textTransform: "uppercase" as const,
              color: "rgba(242,237,228,.22)",
              marginBottom: 16,
            }}>
              {col.label}
            </div>
            {col.links.map(({ name, href }) => (
              <Link
                key={name}
                href={href}
                style={{
                  display: "block",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13.5, fontWeight: 300,
                  color: "rgba(242,237,228,.5)",
                  textDecoration: "none",
                  padding: "5px 0",
                  transition: "color .14s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(242,237,228,.88)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(242,237,228,.5)"; }}
              >
                {name}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "18px 48px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap" as const,
        gap: 10,
      }}
        className="ft-bar"
      >
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10, letterSpacing: ".06em",
          color: "rgba(242,237,228,.18)",
        }}>
          © 2025 Polamuse · Made with ♥ in India
        </span>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10, letterSpacing: ".06em",
          color: "rgba(242,237,228,.14)",
        }}>
          v1.0
        </span>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .ft-links {
            grid-template-columns: 1fr 1fr !important;
            padding: 32px 24px !important;
          }
          footer > div:first-child { padding: 40px 24px !important; }
          .ft-bar { padding: 16px 24px 20px !important; }
        }
        @media (max-width: 480px) {
          .ft-links { grid-template-columns: 1fr !important; gap: 28px !important; }
        }
      `}</style>
    </footer>
  );
}
