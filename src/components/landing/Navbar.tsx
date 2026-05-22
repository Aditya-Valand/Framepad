"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/hooks/useAuth";

function ProfileDropdown({
  initials, onLogout, onClose,
}: {
  initials: string; onLogout: () => void; onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Avatar trigger */}
      <button
        onClick={onClose}
        style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg, #8B6F5C, #6B4F3A)",
          border: "2px solid rgba(255,255,255,0.6)",
          boxShadow: "0 1px 6px rgba(139,111,92,0.3)",
          color: "#fff", fontSize: 13, fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {initials}
      </button>

      {/* Dropdown */}
      <div style={{
        position: "absolute", top: "calc(100% + 10px)", right: 0,
        background: "#FFFCF8",
        borderRadius: 14,
        border: "0.5px solid rgba(26,23,20,0.1)",
        boxShadow: "0 8px 32px rgba(26,23,20,0.12), 0 2px 8px rgba(26,23,20,0.06)",
        minWidth: 180, overflow: "hidden",
        zIndex: 200,
        animation: "ddFadeIn .18s ease both",
      }}>
        <Link
          href="/account"
          onClick={onClose}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 16px",
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#1A1714",
            textDecoration: "none",
            borderBottom: "0.5px solid rgba(26,23,20,0.06)",
            transition: "background .12s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(139,111,92,0.06)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
            <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
          My Profile
        </Link>
        <Link
          href="/editor"
          onClick={onClose}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 16px",
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#1A1714",
            textDecoration: "none",
            borderBottom: "0.5px solid rgba(26,23,20,0.06)",
            transition: "background .12s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(139,111,92,0.06)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
            <rect x="3" y="3" width="18" height="18" rx="2" /><rect x="6" y="6" width="12" height="9" rx="1" />
          </svg>
          Open Editor
        </Link>
        <button
          onClick={() => { onClose(); onLogout(); }}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "12px 16px",
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#C05A3A",
            background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
            transition: "background .12s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(192,90,58,0.06)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { user, loading, logout, initials } = useAuth();

  useEffect(() => {
    const sections = ["templates", "moments", "how", "pricing"]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    function onScroll() {
      setScrolled(window.scrollY > 24);
      const y = window.scrollY + 140;
      let active = "";
      for (const s of sections) {
        if (s.offsetTop <= y) active = s.id;
      }
      setActiveSection(active);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = "";
  };

  const toggleMenu = () => {
    const next = !menuOpen;
    setMenuOpen(next);
    document.body.style.overflow = next ? "hidden" : "";
  };

  const links = [
    { href: "#templates", label: "Templates", target: "templates" },
    { href: "#moments", label: "Moments", target: "moments" },
    { href: "#how", label: "How it works", target: "how" },
    { href: "#pricing", label: "Pricing", target: "pricing" },
  ];

  return (
    <>
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: scrolled ? "10px 32px" : "14px 32px",
          display: "grid", gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center", gap: 24,
          background: scrolled ? "rgba(242,237,228,0.92)" : "rgba(242,237,228,0.72)",
          backdropFilter: "blur(14px) saturate(1.05)",
          WebkitBackdropFilter: "blur(14px) saturate(1.05)",
          borderBottom: scrolled ? ".5px solid rgba(26,23,20,0.08)" : ".5px solid transparent",
          boxShadow: scrolled ? "0 1px 0 rgba(255,255,255,.4) inset" : "none",
          transition: "padding .25s ease, background .25s ease, border-color .25s ease",
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo />
        </div>

        {/* Center nav links */}
        <div
          className="nav-links-desktop"
          style={{
            display: "flex", alignItems: "center", gap: 4,
            justifySelf: "center",
            background: "rgba(255,255,255,0.35)",
            border: ".5px solid rgba(26,23,20,0.06)",
            borderRadius: 100, padding: 5,
          }}
        >
          {links.map((l) => (
            <a
              key={l.target} href={l.href}
              style={{
                position: "relative",
                fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 400,
                color: activeSection === l.target ? "var(--text)" : "var(--text-2)",
                textDecoration: "none", padding: "8px 16px", borderRadius: 100,
                transition: "color .18s ease, background .18s ease", letterSpacing: ".005em",
                background: activeSection === l.target ? "#fff" : "transparent",
                boxShadow: activeSection === l.target ? "0 1px 2px rgba(26,23,20,.05), 0 4px 12px rgba(26,23,20,.04)" : "none",
              }}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Right — auth state */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, justifySelf: "end" }}>

          {/* Desktop auth area */}
          <div className="nav-auth-desktop" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {loading ? (
              /* Skeleton placeholder — prevents layout shift */
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(139,111,92,0.12)" }} />
            ) : user ? (
              /* Logged in: avatar + dropdown */
              dropdownOpen ? (
                <ProfileDropdown
                  initials={initials}
                  onLogout={logout}
                  onClose={() => setDropdownOpen(false)}
                />
              ) : (
                <button
                  onClick={() => setDropdownOpen(true)}
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "linear-gradient(135deg, #8B6F5C, #6B4F3A)",
                    border: "2px solid rgba(255,255,255,0.6)",
                    boxShadow: "0 1px 6px rgba(139,111,92,0.3)",
                    color: "#fff", fontSize: 13, fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {initials}
                </button>
              )
            ) : (
              /* Not logged in */
              <>
                <Link
                  href="/auth"
                  style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 400,
                    color: "var(--text-2)", textDecoration: "none", padding: "8px 4px",
                    transition: "color .18s ease",
                  }}
                >
                  Sign in
                </Link>
                <Link
                  href="/editor"
                  style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 500,
                    background: "var(--brown)", color: "#fff", border: "none",
                    borderRadius: 100, padding: "10px 20px 10px 22px",
                    cursor: "pointer", transition: "all .2s ease",
                    textDecoration: "none", display: "inline-flex", alignItems: "center",
                    gap: 8, letterSpacing: ".005em", whiteSpace: "nowrap",
                  }}
                >
                  Open Editor <span>→</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="nav-toggle-mobile"
            onClick={toggleMenu}
            aria-label="Menu"
            style={{
              display: "none", width: 38, height: 38,
              border: ".5px solid rgba(26,23,20,0.12)",
              background: "rgba(255,255,255,0.4)", borderRadius: 100,
              cursor: "pointer", alignItems: "center", justifyContent: "center", padding: 0,
            }}
          >
            <span style={{ display: "block", width: 16, height: 1.2, background: menuOpen ? "transparent" : "var(--text)", position: "relative", transition: "transform .25s ease, background .25s ease" }}>
              <span style={{ content: "''", position: "absolute", left: 0, width: 16, height: 1.2, background: "var(--text)", transition: "transform .25s ease, top .25s ease", top: menuOpen ? 0 : -5, transform: menuOpen ? "rotate(45deg)" : "none" }} />
              <span style={{ content: "''", position: "absolute", left: 0, width: 16, height: 1.2, background: "var(--text)", transition: "transform .25s ease, top .25s ease", top: menuOpen ? 0 : 5, transform: menuOpen ? "rotate(-45deg)" : "none" }} />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <aside
        style={{
          position: "fixed", top: 0, right: 0, height: "100vh",
          width: "min(86vw, 340px)",
          background: "var(--cream)", borderLeft: ".5px solid var(--border)",
          padding: "88px 28px 32px",
          display: "flex", flexDirection: "column", gap: 4,
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform .35s cubic-bezier(.6,.05,.2,1)",
          zIndex: 99, boxShadow: "-20px 0 60px rgba(26,23,20,.06)",
          overflowY: "auto",
        }}
      >
        {links.map((l) => (
          <a
            key={l.target} href={l.href} onClick={closeMenu}
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: "var(--text)", textDecoration: "none", padding: "14px 0", borderBottom: ".5px solid var(--border)" }}
          >
            {l.label}
          </a>
        ))}

        {!loading && user ? (
          <>
            <Link
              href="/account" onClick={closeMenu}
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: "var(--text)", textDecoration: "none", padding: "14px 0", borderBottom: ".5px solid var(--border)" }}
            >
              My Profile
            </Link>
            <Link
              href="/editor" onClick={closeMenu}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, background: "var(--brown)", color: "#fff", borderRadius: 100, padding: "14px 24px", textAlign: "center", textDecoration: "none", marginTop: 24, display: "flex", justifyContent: "center" }}
            >
              Open Editor →
            </Link>
            <button
              onClick={() => { closeMenu(); logout(); }}
              style={{ background: "transparent", border: ".5px solid rgba(192,90,58,0.3)", borderRadius: 100, color: "#C05A3A", padding: "12px 24px", fontFamily: "'DM Sans', sans-serif", fontSize: 14, cursor: "pointer", marginTop: 10 }}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/auth" onClick={closeMenu}
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: "var(--text)", textDecoration: "none", padding: "14px 0", borderBottom: ".5px solid var(--border)" }}
            >
              Sign in
            </Link>
            <Link
              href="/editor" onClick={closeMenu}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, background: "var(--brown)", color: "#fff", borderRadius: 100, padding: "14px 24px", textAlign: "center", textDecoration: "none", marginTop: 24, display: "flex", justifyContent: "center" }}
            >
              Open Editor →
            </Link>
          </>
        )}
      </aside>

      {menuOpen && (
        <div onClick={closeMenu} style={{ position: "fixed", inset: 0, background: "rgba(26,23,20,.3)", zIndex: 98 }} />
      )}

      <style jsx>{`
        @keyframes ddFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          .nav-links-desktop { display: none !important; }
          .nav-auth-desktop  { display: none !important; }
          .nav-toggle-mobile { display: inline-flex !important; }
        }
      `}</style>
    </>
  );
}
