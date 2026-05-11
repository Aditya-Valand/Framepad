"use client";

import { useState, useRef, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  );
}

/* Floating-label field */
function Field({
  id, label, type = "text", autoComplete, required, showEye, strengthDots, errorMsg, value, onChange, error,
}: {
  id: string; label: string; type?: string; autoComplete?: string; required?: boolean;
  showEye?: boolean; strengthDots?: number; errorMsg: string; value: string;
  onChange: (v: string) => void; error: boolean;
}) {
  const [reveal, setReveal] = useState(false);
  const inputType = showEye && reveal ? "text" : type;

  return (
    <div style={{ position: "relative", marginBottom: 22 }}>
      <input
        id={id}
        type={inputType}
        placeholder=" "
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          borderBottom: error ? ".5px solid var(--error)" : ".5px solid var(--text-3)",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          color: "var(--text)",
          padding: "18px 0 8px",
          outline: "none",
          transition: "border-color .25s ease",
        }}
        onFocus={(e) => {
          if (!error) (e.target as HTMLInputElement).style.borderBottomColor = "var(--brown)";
        }}
        onBlur={(e) => {
          if (!error) (e.target as HTMLInputElement).style.borderBottomColor = "var(--text-3)";
        }}
      />
      <label
        htmlFor={id}
        style={{
          position: "absolute",
          left: 0,
          top: value ? 0 : 18,
          fontSize: value ? 11 : 14,
          color: value ? "var(--text-2)" : "var(--text-3)",
          pointerEvents: "none",
          transition: "top .22s ease, font-size .22s ease, color .22s ease",
          letterSpacing: value ? ".06em" : ".005em",
          fontFamily: value ? "'DM Mono', monospace" : "'DM Sans', sans-serif",
          textTransform: value ? "uppercase" : "none",
        }}
      >
        {label}
      </label>

      {showEye && (
        <button
          type="button"
          onClick={() => setReveal(!reveal)}
          aria-label="Show password"
          style={{
            position: "absolute",
            right: 0,
            top: 18,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: reveal ? "var(--brown)" : "var(--text-3)",
            padding: 4,
            transition: "color .15s",
          }}
        >
          <EyeIcon />
        </button>
      )}

      {strengthDots !== undefined && (
        <div style={{ display: "flex", gap: 5, marginTop: 8 }}>
          {[0, 1, 2].map((i) => (
            <i
              key={i}
              style={{
                height: 3,
                flex: 1,
                background: i < strengthDots ? "var(--brown)" : "rgba(26,23,20,.08)",
                borderRadius: 2,
                transition: "background .25s ease",
                fontStyle: "normal",
              }}
            />
          ))}
        </div>
      )}

      {error && (
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: "var(--error)",
            marginTop: 6,
            letterSpacing: ".04em",
          }}
        >
          {errorMsg}
        </div>
      )}
    </div>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  /* Login fields */
  const [liEmail, setLiEmail] = useState("");
  const [liPwd, setLiPwd] = useState("");
  const [liErrors, setLiErrors] = useState({ email: false, pwd: false });

  /* Signup fields */
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPwd, setSuPwd] = useState("");
  const [suErrors, setSuErrors] = useState({ name: false, email: false, pwd: false });

  const pwdStrength = (() => {
    let s = 0;
    if (suPwd.length >= 6) s = 1;
    if (suPwd.length >= 8 && /[A-Z]/.test(suPwd) && /[0-9]/.test(suPwd)) s = 2;
    if (suPwd.length >= 10 && /[A-Z]/.test(suPwd) && /[0-9]/.test(suPwd) && /[^A-Za-z0-9]/.test(suPwd)) s = 3;
    return s;
  })();

  function switchMode(target: "login" | "signup") {
    if (animating || target === mode) return;
    setAnimating(true);
    if (formRef.current) {
      formRef.current.style.animation = "fadeOut .25s ease both";
    }
    setTimeout(() => {
      setMode(target);
      if (formRef.current) {
        formRef.current.style.animation = "fadeUp .35s ease both";
      }
      setAnimating(false);
    }, 240);
  }

  function handleLoginSubmit(e: FormEvent) {
    e.preventDefault();
    const errors = {
      email: !liEmail.trim() || !/^\S+@\S+\.\S+$/.test(liEmail),
      pwd: liPwd.length < 6,
    };
    setLiErrors(errors);
    if (errors.email || errors.pwd) return;
    setLoading(true);
    setTimeout(() => router.push("/order"), 900);
  }

  function handleSignupSubmit(e: FormEvent) {
    e.preventDefault();
    const errors = {
      name: !suName.trim(),
      email: !suEmail.trim() || !/^\S+@\S+\.\S+$/.test(suEmail),
      pwd: suPwd.length < 6,
    };
    setSuErrors(errors);
    if (errors.name || errors.email || errors.pwd) return;
    setLoading(true);
    setTimeout(() => router.push("/order"), 900);
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "55fr 45fr",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        background: "var(--cream)",
        color: "var(--text)",
      }}
    >
      {/* LEFT: FORM */}
      <div
        style={{
          padding: "32px 56px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <Logo />
        </Link>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 0",
          }}
        >
          <div ref={formRef} style={{ width: "100%", maxWidth: 380, animation: "fadeUp .35s ease both" }}>
            {mode === "login" ? (
              <>
                <h1
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 42,
                    fontWeight: 300,
                    fontStyle: "italic",
                    lineHeight: 1.1,
                    marginBottom: 10,
                    letterSpacing: "-.01em",
                  }}
                >
                  Welcome back.
                </h1>
                <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text-2)", marginBottom: 36, lineHeight: 1.5 }}>
                  Your polaroids are waiting.
                </p>

                <form onSubmit={handleLoginSubmit} noValidate>
                  <Field
                    id="liEmail" label="Email" type="email" autoComplete="email" required
                    value={liEmail} onChange={(v) => { setLiEmail(v); setLiErrors((p) => ({ ...p, email: false })); }}
                    error={liErrors.email} errorMsg="Enter a valid email."
                  />
                  <Field
                    id="liPwd" label="Password" type="password" autoComplete="current-password" required
                    showEye value={liPwd} onChange={(v) => { setLiPwd(v); setLiErrors((p) => ({ ...p, pwd: false })); }}
                    error={liErrors.pwd} errorMsg="At least 6 characters."
                  />

                  <div style={{ display: "flex", justifyContent: "flex-end", margin: "-12px 0 28px" }}>
                    <a
                      href="#"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 11,
                        letterSpacing: ".06em",
                        color: "var(--text-3)",
                        textDecoration: "none",
                      }}
                    >
                      Forgot password?
                    </a>
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
                      height: 48,
                      cursor: "pointer",
                      transition: "all .2s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      letterSpacing: ".005em",
                      position: "relative",
                      overflow: "hidden",
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
                        <span>Continue</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "22px 0" }}>
                  <span style={{ flex: 1, height: ".5px", background: "var(--border)" }} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--text-3)", letterSpacing: ".1em" }}>or</span>
                  <span style={{ flex: 1, height: ".5px", background: "var(--border)" }} />
                </div>

                <button
                  type="button"
                  style={{
                    width: "100%",
                    background: "#fff",
                    border: ".5px solid rgba(26,23,20,0.12)",
                    borderRadius: 100,
                    height: 48,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 400,
                    color: "var(--text)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    transition: "all .18s ease",
                  }}
                >
                  <GoogleIcon /> Continue with Google
                </button>

                <p style={{ marginTop: 28, fontSize: 13, fontWeight: 300, color: "var(--text-2)", textAlign: "center" }}>
                  Don&apos;t have an account?{" "}
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); switchMode("signup"); }}
                    style={{ color: "var(--brown)", textDecoration: "none", fontWeight: 500, marginLeft: 4 }}
                  >
                    Create one →
                  </a>
                </p>
              </>
            ) : (
              <>
                <h1
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 42,
                    fontWeight: 300,
                    fontStyle: "italic",
                    lineHeight: 1.1,
                    marginBottom: 10,
                    letterSpacing: "-.01em",
                  }}
                >
                  Make your first Polaroid.
                </h1>
                <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text-2)", marginBottom: 36, lineHeight: 1.5 }}>
                  Free to design. No credit card needed.
                </p>

                <form onSubmit={handleSignupSubmit} noValidate>
                  <Field
                    id="suName" label="Full name" autoComplete="name" required
                    value={suName} onChange={(v) => { setSuName(v); setSuErrors((p) => ({ ...p, name: false })); }}
                    error={suErrors.name} errorMsg="Tell us your name."
                  />
                  <Field
                    id="suEmail" label="Email" type="email" autoComplete="email" required
                    value={suEmail} onChange={(v) => { setSuEmail(v); setSuErrors((p) => ({ ...p, email: false })); }}
                    error={suErrors.email} errorMsg="Enter a valid email."
                  />
                  <Field
                    id="suPwd" label="Password" type="password" autoComplete="new-password" required
                    showEye strengthDots={pwdStrength}
                    value={suPwd} onChange={(v) => { setSuPwd(v); setSuErrors((p) => ({ ...p, pwd: false })); }}
                    error={suErrors.pwd} errorMsg="Use at least 6 characters."
                  />

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
                      height: 48,
                      cursor: "pointer",
                      transition: "all .2s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      letterSpacing: ".005em",
                      position: "relative",
                      overflow: "hidden",
                      marginTop: 8,
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
                        <span>Create account</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "22px 0" }}>
                  <span style={{ flex: 1, height: ".5px", background: "var(--border)" }} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--text-3)", letterSpacing: ".1em" }}>or</span>
                  <span style={{ flex: 1, height: ".5px", background: "var(--border)" }} />
                </div>

                <button
                  type="button"
                  style={{
                    width: "100%",
                    background: "#fff",
                    border: ".5px solid rgba(26,23,20,0.12)",
                    borderRadius: 100,
                    height: 48,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 400,
                    color: "var(--text)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    transition: "all .18s ease",
                  }}
                >
                  <GoogleIcon /> Continue with Google
                </button>

                <p style={{ marginTop: 28, fontSize: 13, fontWeight: 300, color: "var(--text-2)", textAlign: "center" }}>
                  Already have an account?{" "}
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); switchMode("login"); }}
                    style={{ color: "var(--brown)", textDecoration: "none", fontWeight: 500, marginLeft: 4 }}
                  >
                    Sign in →
                  </a>
                </p>
                <p style={{ marginTop: 18, fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--text-3)", textAlign: "center", letterSpacing: ".04em", lineHeight: 1.6 }}>
                  By continuing, you agree to our <a href="#" style={{ color: "var(--text-2)", textDecoration: "underline", textUnderlineOffset: 2 }}>Terms</a> &{" "}
                  <a href="#" style={{ color: "var(--text-2)", textDecoration: "underline", textUnderlineOffset: 2 }}>Privacy Policy</a>
                </p>
              </>
            )}
          </div>
        </div>

        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: "var(--text-3)",
            textAlign: "center",
            letterSpacing: ".06em",
            paddingTop: 24,
          }}
        >
          ✦ Free to use. Physical prints from ₹79.
        </p>
      </div>

      {/* RIGHT: DECORATIVE */}
      <aside
        className="auth-muse-side"
        style={{
          background: "var(--cream-deep)",
          position: "relative",
          overflow: "hidden",
          padding: 48,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,.4), transparent 60%)",
            pointerEvents: "none",
          }}
        />

        {/* Scattered polaroids */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}>
          {/* s1 */}
          <div
            style={{
              position: "absolute",
              background: "#fff",
              boxShadow: "0 14px 40px rgba(26,23,20,.14)",
              borderRadius: 3,
              width: 160,
              top: "8%",
              left: "6%",
              animation: "f1 7s ease-in-out infinite",
            }}
          >
            <div style={{ height: 138, margin: "9px 9px 0", borderRadius: 1, background: "linear-gradient(135deg,#e8d5c0,#c4a882)" }} />
            <div style={{ height: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: 15, color: "#5a4a3a" }}>always you</span>
            </div>
          </div>
          {/* s2 */}
          <div
            style={{
              position: "absolute",
              background: "#fff",
              boxShadow: "0 14px 40px rgba(26,23,20,.14)",
              borderRadius: 3,
              width: 148,
              top: "14%",
              right: "8%",
              animation: "f2 8s ease-in-out infinite .6s",
            }}
          >
            <div style={{ height: 128, margin: "9px 9px 0", borderRadius: 1, background: "linear-gradient(135deg,#d4c5b0,#a89080)" }} />
            <div style={{ height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#8a7a6a", letterSpacing: ".08em" }}>26 · 04 · 2025</span>
            </div>
          </div>
          {/* s3 */}
          <div
            style={{
              position: "absolute",
              background: "#fff",
              boxShadow: "0 14px 40px rgba(26,23,20,.14)",
              borderRadius: 3,
              width: 142,
              bottom: "14%",
              left: "10%",
              animation: "f3 6.5s ease-in-out infinite 1.2s",
            }}
          >
            <div style={{ height: 122, margin: "9px 9px 0", borderRadius: 1, background: "linear-gradient(160deg,#c8b8a0,#8b7060)", filter: "saturate(.85)" }} />
            <div style={{ height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#9a8878", letterSpacing: ".1em" }}>SUMMER · &apos;24</span>
            </div>
          </div>
          {/* s4 */}
          <div
            style={{
              position: "absolute",
              background: "#fff",
              boxShadow: "0 14px 40px rgba(26,23,20,.14)",
              borderRadius: 3,
              width: 156,
              bottom: "9%",
              right: "10%",
              animation: "f4 7.5s ease-in-out infinite .3s",
            }}
          >
            {/* Tape */}
            <div
              style={{
                position: "absolute",
                top: -7,
                left: "50%",
                transform: "translateX(-50%) rotate(-2deg)",
                width: 50,
                height: 14,
                background: "rgba(255,210,100,.6)",
                borderRadius: 2,
                zIndex: 2,
              }}
            />
            <div style={{ height: 134, margin: "9px 9px 0", borderRadius: 1, background: "linear-gradient(135deg,#e0ceb8,#b89878)" }} />
            <div style={{ height: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: 14, color: "#7a5a3a" }}>besties forever</span>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: 440, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 44,
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.18,
              color: "var(--text)",
              letterSpacing: "-.005em",
            }}
          >
            &ldquo;Every photo is waiting
            <br />
            to become a memory.&rdquo;
          </h2>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              letterSpacing: ".14em",
              color: "var(--text-2)",
              textTransform: "uppercase",
              marginTop: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <span style={{ width: 24, height: ".5px", background: "var(--text-3)" }} />
            — Polamuse
            <span style={{ width: 24, height: ".5px", background: "var(--text-3)" }} />
          </div>
        </div>
      </aside>

      <style jsx>{`
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-8px); }
        }
        @media (max-width: 880px) {
          .auth-muse-side { display: none !important; }
        }
      `}</style>
    </div>
  );
}
