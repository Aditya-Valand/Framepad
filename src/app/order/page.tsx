"use client";

import { useState, FormEvent, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

const PRICES: Record<string, number> = { single: 79, pack5: 349, pack10: 590, pack20: 999 };
const LABELS: Record<string, string> = { single: "Classic polaroid print", pack5: "Pack of 5 polaroids", pack10: "Pack of 10 polaroids", pack20: "Pack of 20 polaroids" };

/* Floating-label field */
function Field({
  id, label, type = "text", required, value, onChange, style: s, maxLength, inputStyle,
}: {
  id: string; label: string; type?: string; required?: boolean; value: string;
  onChange: (v: string) => void; style?: React.CSSProperties; maxLength?: number;
  inputStyle?: React.CSSProperties;
}) {
  return (
    <div style={{ position: "relative", marginBottom: 20, ...s }}>
      <input
        id={id}
        type={type}
        placeholder=" "
        required={required}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          borderBottom: ".5px solid var(--text-3)",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          color: "var(--text)",
          padding: "18px 0 8px",
          outline: "none",
          transition: "border-color .25s ease",
          ...inputStyle,
        }}
        onFocus={(e) => ((e.target as HTMLInputElement).style.borderBottomColor = "var(--brown)")}
        onBlur={(e) => ((e.target as HTMLInputElement).style.borderBottomColor = "var(--text-3)")}
      />
      <label
        htmlFor={id}
        style={{
          position: "absolute",
          left: inputStyle?.paddingLeft ? Number(inputStyle.paddingLeft) || 0 : 0,
          top: value ? 0 : 18,
          fontSize: value ? 11 : 14,
          color: value ? "var(--text-2)" : "var(--text-3)",
          pointerEvents: "none",
          transition: "top .22s, font-size .22s, color .22s",
          fontFamily: value ? "'DM Mono', monospace" : "'DM Sans', sans-serif",
          letterSpacing: value ? ".06em" : "normal",
          textTransform: value ? "uppercase" : "none",
        }}
      >
        {label}
      </label>
    </div>
  );
}

export default function OrderPage() {
  /* Order state */
  const [format, setFormat] = useState("single");
  const [finish, setFinish] = useState("glossy");
  const [addMode, setAddMode] = useState<string | null>(null);
  const [bulkQty, setBulkQty] = useState(10);
  const [view, setView] = useState<"summary" | "checkout">("summary");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* Checkout fields */
  const [fName, setFName] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [showPrefix, setShowPrefix] = useState(false);
  const [fAddr, setFAddr] = useState("");
  const [fAddr2, setFAddr2] = useState("");
  const [showAddr2, setShowAddr2] = useState(false);
  const [fCity, setFCity] = useState("");
  const [fPin, setFPin] = useState("");
  const [fState, setFState] = useState("");
  const [giftOn, setGiftOn] = useState(false);
  const [giftMsg, setGiftMsg] = useState("");

  /* Calculations */
  const calcTotal = () => {
    if (addMode === "bulk") {
      let p = bulkQty * 79;
      if (bulkQty >= 10) p = Math.round(p * 0.75);
      return p;
    }
    const unit = PRICES[format];
    const qty = addMode === "duplicate" ? 2 : 1;
    return unit * qty;
  };
  const total = calcTotal();
  const lineLabel = addMode === "bulk"
    ? `${bulkQty} × Classic polaroid print`
    : addMode === "duplicate"
      ? `2 × ${LABELS[format]}`
      : `1 × ${LABELS[format]}`;
  const badgeCount = addMode === "bulk" ? bulkQty : addMode === "duplicate" ? 2 : 1;

  const PIN_STATE: Record<string, string> = { "4": "Maharashtra", "5": "Karnataka", "1": "Delhi", "7": "West Bengal", "6": "Tamil Nadu", "3": "Gujarat", "2": "Uttar Pradesh", "8": "Andhra Pradesh" };

  function handlePinChange(v: string) {
    setFPin(v);
    if (v.length === 6) {
      setFState(PIN_STATE[v[0]] || "India");
    }
  }

  function handleCheckout(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSuccess(true);
      document.body.style.overflow = "hidden";
    }, 1100);
  }

  /* Spotify bars */
  const bars = Array.from({ length: 22 }, (_, i) => (
    <i key={i} style={{ flex: 1, background: "#fff", borderRadius: 1, height: 3 + Math.abs(Math.sin(i * 0.7)) * 11 }} />
  ));

  if (success) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "var(--cream)",
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          padding: 40,
          animation: "fadeIn .4s ease",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Confetti */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          {Array.from({ length: 24 }, (_, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                color: "var(--brown-light)",
                fontSize: 10 + Math.random() * 14,
                left: `${Math.random() * 100}%`,
                animation: `fall ${3 + Math.random() * 3}s linear infinite`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: 0,
              }}
            >
              ✦
            </span>
          ))}
        </div>

        {/* Polaroid */}
        <div
          style={{
            width: 200,
            background: "#fff",
            boxShadow: "0 18px 50px rgba(26,23,20,.16), 0 2px 6px rgba(26,23,20,.06)",
            borderRadius: 3,
            animation: "drop 1s cubic-bezier(.4,1.4,.5,1) both",
          }}
        >
          <div
            style={{
              margin: "10px 10px 0",
              height: 174,
              background: "linear-gradient(135deg,#e8d5c0 0%,#c4a882 50%,#8b7060 100%)",
              borderRadius: 1,
            }}
          />
          <div
            style={{
              padding: "10px 12px 6px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: 16, color: "#3a2a1a" }}>always you</span>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 8,
                color: "#9a8878",
                letterSpacing: ".14em",
                textTransform: "uppercase",
              }}
            >
              26 · 04 · 2025
            </span>
          </div>
        </div>

        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 52,
            fontWeight: 300,
            fontStyle: "italic",
            margin: "36px 0 12px",
            letterSpacing: "-.005em",
          }}
        >
          It&apos;s on its way.
        </h2>
        <p style={{ fontSize: 15, color: "var(--text-2)", fontWeight: 300, maxWidth: 420, marginBottom: 32 }}>
          We&apos;ll send you a tracking link on WhatsApp.
        </p>
        <Link
          href="/"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            fontWeight: 500,
            background: "var(--brown)",
            color: "#fff",
            border: "none",
            borderRadius: 100,
            height: 48,
            maxWidth: 240,
            width: "100%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          <span>Back to Polamuse</span>
          <span>→</span>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--cream)", color: "var(--text)", minHeight: "100vh" }}>
      {/* TOP BAR */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(242,237,228,.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: ".5px solid var(--border)",
          padding: "14px 32px",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 24,
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "var(--text-2)",
            textDecoration: "none",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to Editor
        </Link>
        <Link href="/" style={{ justifySelf: "center", textDecoration: "none" }}>
          <Logo />
        </Link>
        <div style={{ justifySelf: "end" }}>
          <button
            style={{
              position: "relative",
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: ".5px solid var(--border)",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text)",
            }}
            aria-label="Cart"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                background: "var(--brown)",
                color: "#fff",
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                minWidth: 18,
                height: 18,
                borderRadius: 18,
                padding: "0 5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                letterSpacing: ".02em",
              }}
            >
              {badgeCount}
            </span>
          </button>
        </div>
      </header>

      <main
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "36px 32px 80px",
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: 48,
          alignItems: "start",
        }}
      >
        {/* LEFT */}
        <section>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 38,
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.1,
              marginBottom: 6,
              letterSpacing: "-.005em",
            }}
          >
            Almost yours.
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 32, fontWeight: 300 }}>
            Review your design — then choose the format that fits the moment.
          </p>

          {/* Design card */}
          <div
            style={{
              background: "#fff",
              border: ".5px solid var(--border)",
              borderRadius: 24,
              padding: 36,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0 4px 24px rgba(26,23,20,.04)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 18,
                left: 22,
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                letterSpacing: ".12em",
                color: "var(--text-3)",
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "var(--good)",
                  marginRight: 6,
                  transform: "translateY(-1px)",
                }}
              />
              Ready to print
            </div>
            <Link
              href="/"
              style={{
                position: "absolute",
                top: 14,
                right: 18,
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                letterSpacing: ".1em",
                color: "var(--text-2)",
                textDecoration: "none",
                textTransform: "uppercase",
                padding: "6px 10px",
                border: ".5px solid var(--border)",
                borderRadius: 100,
              }}
            >
              Edit ↗
            </Link>

            {/* Polaroid preview */}
            <div
              style={{
                width: 300,
                background: "#fff",
                boxShadow: "0 18px 50px rgba(26,23,20,.16), 0 2px 6px rgba(26,23,20,.06)",
                borderRadius: 3,
                transform: "rotate(-2deg)",
                transition: "transform .35s ease",
                margin: "8px 0",
              }}
            >
              <div
                style={{
                  margin: "14px 14px 0",
                  height: 264,
                  background: "linear-gradient(135deg,#e8d5c0 0%,#c4a882 50%,#8b7060 100%)",
                  borderRadius: 1,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(circle at 30% 25%,rgba(255,255,255,.2),transparent 60%)",
                  }}
                />
              </div>
              {/* Spotify */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  margin: "10px 14px 6px",
                  padding: "8px 12px",
                  background: "#1A1714",
                  borderRadius: 6,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" style={{ flexShrink: 0 }}>
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                <div style={{ display: "flex", gap: 1.5, alignItems: "center", flex: 1, height: 14 }}>{bars}</div>
              </div>
              {/* Caption */}
              <div
                style={{
                  padding: "14px 16px 8px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: 20, color: "#3a2a1a", lineHeight: 1 }}>
                  always you
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9,
                    color: "#9a8878",
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                  }}
                >
                  26 · 04 · 2025
                </div>
              </div>
            </div>

            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                color: "var(--text-3)",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                marginTop: 18,
              }}
            >
              ✦ Designed by you
            </div>
          </div>

          {/* Add more */}
          <div style={{ marginTop: 36 }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, marginBottom: 14, letterSpacing: ".005em" }}>
              Add more to your order
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {[
                { key: "another", lbl: "Another design", desc: "A second unique polaroid" },
                { key: "duplicate", lbl: "Same design ×2", desc: "Quick for gifting" },
                { key: "bulk", lbl: "Bulk order", desc: "5, 10, 20 or more" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setAddMode(addMode === t.key ? null : t.key)}
                  style={{
                    background: addMode === t.key ? "rgba(139,99,71,.04)" : "#fff",
                    border: addMode === t.key ? ".5px solid var(--brown)" : ".5px solid var(--border)",
                    borderRadius: 14,
                    padding: "16px 14px",
                    fontSize: 13,
                    color: "var(--text)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all .15s",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontStyle: "italic", color: "var(--brown)", fontWeight: 300, lineHeight: 1 }}>
                    +
                  </span>
                  <span style={{ fontWeight: 500, fontSize: 13, lineHeight: 1.2 }}>{t.lbl}</span>
                  <span style={{ fontSize: 11, color: "var(--text-2)", fontWeight: 300, lineHeight: 1.3 }}>{t.desc}</span>
                </button>
              ))}
            </div>

            {/* Bulk panel */}
            <div
              style={{
                marginTop: 18,
                background: "#fff",
                border: addMode === "bulk" ? ".5px solid var(--border)" : "0px solid var(--border)",
                borderRadius: 18,
                padding: addMode === "bulk" ? "24px 26px" : "0 26px",
                overflow: "hidden",
                maxHeight: addMode === "bulk" ? 340 : 0,
                transition: "all .35s ease",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 24,
                  fontWeight: 300,
                  fontStyle: "italic",
                  marginBottom: 14,
                }}
              >
                How many do you need?
              </h3>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, padding: "8px 0 14px" }}>
                <button
                  onClick={() => setBulkQty(Math.max(2, bulkQty - 1))}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: ".5px solid var(--border)",
                    background: "#fff",
                    fontSize: 18,
                    color: "var(--text)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  −
                </button>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 42,
                    fontWeight: 300,
                    fontStyle: "italic",
                    minWidth: 80,
                    textAlign: "center",
                    color: "var(--text)",
                  }}
                >
                  {bulkQty}
                </div>
                <button
                  onClick={() => setBulkQty(Math.min(200, bulkQty + 1))}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: ".5px solid var(--border)",
                    background: "#fff",
                    fontSize: 18,
                    color: "var(--text)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  +
                </button>
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "var(--brown)", textAlign: "center", letterSpacing: ".04em" }}>
                {bulkQty} prints · ₹{bulkQty >= 10 ? Math.round(bulkQty * 79 * 0.75) : bulkQty * 79}
              </div>
              {bulkQty >= 10 && (
                <div style={{ textAlign: "center" }}>
                  <span
                    style={{
                      display: "inline-block",
                      background: "var(--good-bg, #E1F5EE)",
                      color: "var(--good)",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      letterSpacing: ".08em",
                      padding: "4px 10px",
                      borderRadius: 100,
                      margin: "12px auto 0",
                      textTransform: "uppercase",
                    }}
                  >
                    Save 25% on orders of 10+
                  </span>
                </div>
              )}
              <div
                style={{
                  marginTop: 14,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: "var(--text-3)",
                  letterSpacing: ".1em",
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              >
                Weddings · Birthdays · Corporate · Events
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <aside style={{ position: "sticky", top: 96 }}>
          {view === "summary" ? (
            <div
              style={{
                background: "#fff",
                border: ".5px solid var(--border)",
                borderRadius: 20,
                padding: 28,
                boxShadow: "0 4px 24px rgba(26,23,20,.04)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, marginBottom: 18 }}>
                Your order
              </div>

              {/* Line items */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--text-2)", letterSpacing: ".02em" }}>
                <span>{lineLabel}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "var(--text)", letterSpacing: 0 }}>₹{total}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--text-2)", letterSpacing: ".02em" }}>
                <span>Subtotal</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "var(--text)", letterSpacing: 0 }}>₹{total}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--text-2)", letterSpacing: ".02em" }}>
                <span>Shipping</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "var(--good)", letterSpacing: 0 }}>Free</span>
              </div>
              {/* Total */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: ".5px solid var(--border)", marginTop: 6 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "var(--text)" }}>Total</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, fontStyle: "italic" }}>₹{total}</span>
              </div>

              {/* Format */}
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: ".14em", color: "var(--text-3)", textTransform: "uppercase", margin: "22px 0 10px" }}>
                Format
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {[
                  { value: "single", label: "Single print", price: "₹79" },
                  { value: "pack5", label: "Pack of 5", price: "₹349" },
                  { value: "pack10", label: "Pack of 10", price: "₹590" },
                  { value: "pack20", label: "Pack of 20", price: "₹999" },
                ].map((p) => (
                  <button
                    key={p.value}
                    onClick={() => { setFormat(p.value); if (addMode === "bulk") setAddMode(null); }}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12.5,
                      fontWeight: 400,
                      color: format === p.value ? "#fff" : "var(--text)",
                      background: format === p.value ? "var(--brown)" : "#fff",
                      border: format === p.value ? ".5px solid var(--brown)" : ".5px solid var(--border)",
                      borderRadius: 100,
                      padding: "9px 12px",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all .15s",
                      lineHeight: 1.2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <span>{p.label}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: format === p.value ? "rgba(255,255,255,.7)" : "var(--text-3)", letterSpacing: ".04em" }}>
                      {p.price}
                    </span>
                  </button>
                ))}
              </div>

              {/* Finish */}
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: ".14em", color: "var(--text-3)", textTransform: "uppercase", margin: "22px 0 10px" }}>
                Finish
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {["Glossy", "Matte"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFinish(f.toLowerCase())}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12.5,
                      fontWeight: 400,
                      color: finish === f.toLowerCase() ? "#fff" : "var(--text)",
                      background: finish === f.toLowerCase() ? "var(--brown)" : "#fff",
                      border: finish === f.toLowerCase() ? ".5px solid var(--brown)" : ".5px solid var(--border)",
                      borderRadius: 100,
                      padding: 10,
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all .15s",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* ETA */}
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--text-2)", letterSpacing: ".04em", margin: "18px 0", display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}>
                  <rect x="2" y="7" width="20" height="13" rx="1" />
                  <path d="M2 7l3-4h14l3 4M12 7v13" />
                </svg>
                Delivered in 3–5 days
              </div>

              {/* CTA */}
              <button
                onClick={() => setView("checkout")}
                style={{
                  width: "100%",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  fontWeight: 500,
                  background: "var(--brown)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 100,
                  height: 52,
                  cursor: "pointer",
                  transition: "all .2s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  letterSpacing: ".005em",
                }}
              >
                <span>Proceed to checkout</span>
                <span>→</span>
              </button>

              {/* Download */}
              <div style={{ textAlign: "center", marginTop: 14 }}>
                <a href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--text-2)", textDecoration: "underline", textUnderlineOffset: 3 }}>
                  Download PNG instead
                </a>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-3)", letterSpacing: ".06em", marginTop: 5, textTransform: "uppercase" }}>
                  Free · High-res · Instant
                </div>
              </div>

              {/* Trust */}
              <div style={{ marginTop: 22, paddingTop: 18, borderTop: ".5px solid var(--border)", display: "flex", justifyContent: "space-between", fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-3)", letterSpacing: ".04em", gap: 10 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>🔒 Secure checkout</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>✦ Premium quality</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>↩ Easy returns</span>
              </div>
            </div>
          ) : (
            /* CHECKOUT */
            <div
              style={{
                background: "#fff",
                border: ".5px solid var(--border)",
                borderRadius: 20,
                padding: 28,
                boxShadow: "0 4px 24px rgba(26,23,20,.04)",
                animation: "slideIn .35s cubic-bezier(.6,.05,.2,1) both",
              }}
            >
              <button
                onClick={() => setView("summary")}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  color: "var(--text-2)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: 0,
                  marginBottom: 14,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                Order summary
              </button>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 28,
                  fontWeight: 300,
                  fontStyle: "italic",
                  lineHeight: 1.1,
                  marginBottom: 24,
                  letterSpacing: "-.005em",
                }}
              >
                Where should we
                <br />
                send it?
              </h2>

              <form onSubmit={handleCheckout} noValidate>
                <Field id="fName" label="Full name" required value={fName} onChange={setFName} />
                <div style={{ position: "relative", marginBottom: 20 }}>
                  {showPrefix && (
                    <span style={{ position: "absolute", left: 0, top: 18, fontSize: 14, color: "var(--text)" }}>+91</span>
                  )}
                  <Field
                    id="fPhone"
                    label="Phone number"
                    type="tel"
                    required
                    value={fPhone}
                    onChange={setFPhone}
                    inputStyle={showPrefix ? { paddingLeft: 40 } : undefined}
                    style={{ marginBottom: 0 }}
                  />
                  <input type="hidden" onFocus={() => setShowPrefix(true)} />
                </div>
                <Field id="fAddr" label="Address line 1" required value={fAddr} onChange={setFAddr} />
                {!showAddr2 ? (
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setShowAddr2(true); }}
                    style={{
                      display: "inline-block",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 11,
                      color: "var(--brown)",
                      textDecoration: "none",
                      letterSpacing: ".06em",
                      cursor: "pointer",
                      marginBottom: 14,
                    }}
                  >
                    + Add apartment, floor, etc.
                  </a>
                ) : (
                  <Field id="fAddr2" label="Address line 2" value={fAddr2} onChange={setFAddr2} />
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Field id="fCity" label="City" required value={fCity} onChange={setFCity} />
                  <Field id="fPin" label="Pincode" required maxLength={6} value={fPin} onChange={handlePinChange} />
                </div>
                <Field id="fState" label="State" required value={fState} onChange={setFState} />

                {/* Gift toggle */}
                <div style={{ margin: "18px 0", padding: "14px 0", borderTop: ".5px solid var(--border)", borderBottom: ".5px solid var(--border)" }}>
                  <label
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                    onClick={() => setGiftOn(!giftOn)}
                  >
                    <span style={{ fontSize: 13, color: "var(--text)" }}>Sending this as a gift?</span>
                    <span
                      style={{
                        width: 36,
                        height: 20,
                        background: giftOn ? "var(--brown)" : "#e0d8cc",
                        borderRadius: 100,
                        position: "relative",
                        transition: "background .25s",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: 2,
                          left: giftOn ? 18 : 2,
                          width: 16,
                          height: 16,
                          background: "#fff",
                          borderRadius: "50%",
                          transition: "left .25s",
                          boxShadow: "0 1px 3px rgba(0,0,0,.15)",
                        }}
                      />
                    </span>
                  </label>
                  {giftOn && (
                    <div style={{ marginTop: 14, animation: "fadeUp .3s ease" }}>
                      <textarea
                        value={giftMsg}
                        onChange={(e) => setGiftMsg(e.target.value)}
                        placeholder="Add a handwritten-style note (printed on a small card inside the package)"
                        rows={3}
                        style={{
                          width: "100%",
                          background: "transparent",
                          border: "none",
                          borderBottom: ".5px solid var(--text-3)",
                          fontFamily: "'Dancing Script', cursive",
                          fontSize: 18,
                          lineHeight: 1.4,
                          minHeight: 90,
                          color: "#3a2a1a",
                          padding: "8px 0",
                          outline: "none",
                          resize: "none",
                        }}
                      />
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--brown)", letterSpacing: ".06em", marginTop: 6 }}>
                        ✦ We&apos;ll add a personal touch.
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment */}
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: ".14em", color: "var(--text-3)", textTransform: "uppercase", marginTop: 0 }}>
                  Payment
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "18px 0 22px" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {["UPI", "CARD", "NETBANKING"].map((m) => (
                      <span
                        key={m}
                        style={{
                          height: 24,
                          padding: "4px 10px",
                          border: ".5px solid var(--border)",
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 9,
                          color: "var(--text-2)",
                          letterSpacing: ".08em",
                          background: "#fff",
                        }}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "var(--text-3)", letterSpacing: ".08em" }}>
                    Powered by Razorpay
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                    fontWeight: 500,
                    background: "var(--brown)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 100,
                    height: 52,
                    cursor: "pointer",
                    transition: "all .2s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    letterSpacing: ".005em",
                    position: "relative",
                  }}
                >
                  {loading ? (
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        border: "1.5px solid rgba(255,255,255,.35)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin .8s linear infinite",
                      }}
                    />
                  ) : (
                    <>
                      <span>Place order · ₹{total}</span>
                      <span>→</span>
                    </>
                  )}
                </button>

                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-3)", textAlign: "center", letterSpacing: ".04em", marginTop: 14, lineHeight: 1.6 }}>
                  By placing this order you agree to our{" "}
                  <a href="#" style={{ color: "var(--text-2)", textDecoration: "underline", textUnderlineOffset: 2 }}>Terms</a> ·{" "}
                  <a href="#" style={{ color: "var(--text-2)", textDecoration: "underline", textUnderlineOffset: 2 }}>Privacy Policy</a>
                </p>
              </form>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
