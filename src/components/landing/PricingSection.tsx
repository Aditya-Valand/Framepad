"use client";
import Link from "next/link";
import { useState } from "react";

const coinPacks = [
  { id: "starter", label: "Starter", coins: 50,  price: "₹29", highlight: false },
  { id: "popular", label: "Popular", coins: 120, price: "₹59", highlight: true  },
  { id: "best",    label: "Best",    coins: 300, price: "₹99", highlight: false },
];

const coinUses = [
  { label: "Remove watermark", cost: "10 coins" },
  { label: "Premium template",  cost: "15 coins" },
  { label: "Booth session",     cost: "8 coins"  },
  { label: "Shared canvas",     cost: "12 coins" },
  { label: "Cloud save",        cost: "3 coins"  },
];

const prints = [
  { id: "single",    name: "Single print", price: "₹79",  badge: null,         save: null      },
  { id: "pack5",     name: "Pack of 5",    price: "₹349", badge: null,         save: "Save ₹46" },
  { id: "giftsend",  name: "Gift send",    price: "₹149", badge: "Best product", save: null    },
  { id: "filmstrip", name: "Film strip",   price: "₹99",  badge: null,         save: null      },
];

const perks = [
  "Free editor, always",
  "20 coins on signup",
  "No subscription",
  "Reprint guarantee",
];

export default function PricingSection() {
  const [hoveredPack, setHoveredPack]   = useState<string | null>(null);
  const [hoveredPrint, setHoveredPrint] = useState<string | null>(null);

  return (
    <section
      id="pricing"
      style={{
        background: "var(--cream-deep)",
        borderTop: ".5px solid var(--border)",
        padding: "clamp(64px,8vw,100px) clamp(18px,5vw,48px) clamp(48px,6vw,80px)",
      }}
    >
      {/* Header */}
      <div className="reveal" style={{ textAlign: "center", marginBottom: 52 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          padding: "5px 13px", borderRadius: 100,
          background: "rgba(255,255,255,0.5)", backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "0.5px solid rgba(139,99,71,0.16)",
          fontFamily: "'DM Mono',monospace", fontSize: 10,
          letterSpacing: ".16em", color: "#8B6347",
          textTransform: "uppercase" as const, marginBottom: 20,
        }}>
          <span style={{ fontSize: 8 }}>✦</span> pricing
        </div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "clamp(36px,5vw,52px)", fontWeight: 300, fontStyle: "italic",
          lineHeight: 1.12, letterSpacing: "-.01em", marginBottom: 12,
        }}>
          You design for free.<br />Pay only when it&rsquo;s real.
        </h2>
        <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text-3)" }}>
          No subscriptions. No monthly fees.
        </p>
      </div>

      {/* Free coins pill */}
      <div className="reveal" style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(139,99,71,0.08)", border: "0.5px solid rgba(139,99,71,0.2)",
          borderRadius: 100, padding: "8px 18px",
        }}>
          <span style={{ fontSize: 15 }}>🪙</span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, color: "#8B6347" }}>
            20 Pola Coins free on signup
          </span>
        </div>
      </div>

      <div className="pricing-layout">

        {/* ── LEFT: Pola Coins ── */}
        <div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 300, fontStyle: "italic", color: "var(--text)", marginBottom: 4 }}>
              Pola Coins
            </div>
            <p style={{ fontSize: 13, fontWeight: 300, color: "var(--text-3)" }}>
              Top up once. Spend on anything.
            </p>
          </div>

          {/* Coin packs */}
          <div className="reveal-stagger" style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {coinPacks.map((pack) => {
              const isHov = hoveredPack === pack.id;
              return (
                <div
                  key={pack.id}
                  onMouseEnter={() => setHoveredPack(pack.id)}
                  onMouseLeave={() => setHoveredPack(null)}
                  style={{
                    flex: 1, borderRadius: 14, padding: "18px 14px",
                    cursor: "pointer", position: "relative",
                    transition: "transform 0.28s cubic-bezier(0.34,1.3,0.64,1), box-shadow 0.25s ease",
                    transform: isHov ? "translateY(-3px)" : "none",
                    ...(pack.highlight ? {
                      background: "#1A1714", border: "none",
                      boxShadow: isHov
                        ? "0 4px 8px rgba(26,23,20,0.18), 0 20px 56px rgba(26,23,20,0.28)"
                        : "0 2px 8px rgba(26,23,20,0.14), 0 12px 40px rgba(26,23,20,0.2)",
                    } : {
                      background: "rgba(255,255,255,0.62)",
                      border: "0.5px solid rgba(26,23,20,0.08)",
                      boxShadow: isHov
                        ? "0 2px 8px rgba(26,23,20,0.06), 0 12px 36px rgba(139,111,92,0.16)"
                        : "0 1px 3px rgba(26,23,20,0.04), 0 4px 16px rgba(139,111,92,0.08)",
                    }),
                  }}
                >
                  {pack.highlight && (
                    <div style={{
                      position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                      background: "#8B6347", color: "#fff",
                      fontFamily: "'DM Mono',monospace", fontSize: 9,
                      letterSpacing: ".1em", textTransform: "uppercase" as const,
                      padding: "3px 10px", borderRadius: 100, whiteSpace: "nowrap" as const,
                    }}>★ popular</div>
                  )}
                  <div style={{
                    fontFamily: "'DM Mono',monospace", fontSize: 9.5,
                    letterSpacing: ".1em", textTransform: "uppercase" as const,
                    color: pack.highlight ? "rgba(242,237,228,0.4)" : "var(--text-3)",
                    marginBottom: 8,
                  }}>
                    {pack.label}
                  </div>
                  <div style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 32, fontWeight: 300, lineHeight: 1,
                    color: pack.highlight ? "#F2EDE4" : "var(--text)",
                    marginBottom: 4,
                  }}>
                    {pack.price}
                  </div>
                  <div style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, fontWeight: 500,
                    color: pack.highlight ? "rgba(242,237,228,0.65)" : "var(--text-3)",
                  }}>
                    {pack.coins} coins
                  </div>
                </div>
              );
            })}
          </div>

          {/* What coins buy */}
          <div style={{
            background: "rgba(255,255,255,0.5)", border: "0.5px solid rgba(26,23,20,0.07)",
            borderRadius: 12, padding: "14px 16px",
          }}>
            <div style={{
              fontFamily: "'DM Mono',monospace", fontSize: 9.5,
              letterSpacing: ".1em", textTransform: "uppercase" as const,
              color: "var(--text-3)", marginBottom: 10,
            }}>
              What coins unlock
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {coinUses.map((u) => (
                <div key={u.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12.5, fontWeight: 300, color: "var(--text-2)" }}>{u.label}</span>
                  <span style={{
                    fontFamily: "'DM Mono',monospace", fontSize: 10,
                    color: "#8B6347", background: "rgba(139,99,71,0.09)",
                    padding: "2px 9px", borderRadius: 100,
                  }}>{u.cost}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Print & Send ── */}
        <div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 300, fontStyle: "italic", color: "var(--text)", marginBottom: 4 }}>
              Print & Send
            </div>
            <p style={{ fontSize: 13, fontWeight: 300, color: "var(--text-3)" }}>
              Physical prints. Shipped anywhere in India.
            </p>
          </div>

          <div className="reveal-stagger" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {prints.map((p) => {
              const isGift = p.id === "giftsend";
              const isHov  = hoveredPrint === p.id;
              return (
                <div
                  key={p.id}
                  onMouseEnter={() => setHoveredPrint(p.id)}
                  onMouseLeave={() => setHoveredPrint(null)}
                  style={{
                    borderRadius: 12, padding: "16px 18px",
                    position: "relative", cursor: "pointer",
                    transition: "transform 0.28s cubic-bezier(0.34,1.3,0.64,1), box-shadow 0.25s ease",
                    transform: isHov ? "translateY(-2px)" : "none",
                    ...(isGift ? {
                      background: "rgba(139,99,71,0.07)",
                      border: "0.5px solid rgba(139,99,71,0.22)",
                      boxShadow: isHov ? "0 4px 20px rgba(139,99,71,0.16)" : "none",
                    } : {
                      background: "rgba(255,255,255,0.55)",
                      border: "0.5px solid rgba(26,23,20,0.07)",
                      boxShadow: isHov ? "0 2px 12px rgba(139,111,92,0.12)" : "none",
                    }),
                  }}
                >
                  {p.badge && (
                    <div style={{
                      position: "absolute", top: -10, right: 14,
                      background: "#8B6347", color: "#fff",
                      fontFamily: "'DM Mono',monospace", fontSize: 9,
                      letterSpacing: ".1em", textTransform: "uppercase" as const,
                      padding: "3px 10px", borderRadius: 100,
                    }}>{p.badge}</div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>
                        {p.name}
                      </div>
                      <Link
                        href="/editor"
                        style={{
                          fontFamily: "'DM Sans',sans-serif",
                          fontSize: 12, color: isGift ? "#8B6347" : "var(--text-3)",
                          textDecoration: "none",
                          display: "inline-flex", alignItems: "center", gap: 3,
                        }}
                      >
                        Order →
                      </Link>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 300, color: "var(--text)", lineHeight: 1 }}>
                        {p.price}
                      </div>
                      {p.save && (
                        <div style={{
                          fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 500,
                          color: "#8B6347", background: "rgba(139,99,71,0.1)",
                          padding: "2px 8px", borderRadius: 100, marginTop: 3,
                          display: "inline-block",
                        }}>{p.save}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ₹9 tip — minimal */}
          <div style={{
            marginTop: 12, padding: "10px 14px",
            borderRadius: 8, display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 8, color: "#C4A882", flexShrink: 0 }}>✦</span>
            <p style={{ fontSize: 11.5, fontWeight: 300, color: "var(--text-3)", margin: 0 }}>
              ₹9 removes the watermark from any design. No login needed.
            </p>
          </div>
        </div>

      </div>

      {/* Perks */}
      <div className="reveal" style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center",
        gap: "8px 24px", maxWidth: 560, margin: "44px auto 0",
      }}>
        {perks.map((text) => (
          <div key={text} style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 12.5, fontWeight: 300, color: "var(--text-3)",
          }}>
            <span style={{ color: "#8B6347", fontSize: 8 }}>✦</span>
            {text}
          </div>
        ))}
      </div>

      <style jsx>{`
        .pricing-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          max-width: 980px;
          margin: 0 auto;
          align-items: start;
        }
        @media (max-width: 860px) {
          .pricing-layout { grid-template-columns: 1fr !important; max-width: 480px; gap: 44px; }
        }
        @media (max-width: 540px) {
          section { padding: 64px 18px 48px !important; }
        }
      `}</style>
    </section>
  );
}
