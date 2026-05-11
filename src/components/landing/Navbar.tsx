"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

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
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: scrolled ? "10px 32px" : "14px 32px",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 24,
          background: scrolled
            ? "rgba(242,237,228,0.92)"
            : "rgba(242,237,228,0.72)",
          backdropFilter: "blur(14px) saturate(1.05)",
          WebkitBackdropFilter: "blur(14px) saturate(1.05)",
          borderBottom: scrolled
            ? ".5px solid rgba(26,23,20,0.08)"
            : ".5px solid transparent",
          boxShadow: scrolled
            ? "0 1px 0 rgba(255,255,255,.4) inset"
            : "none",
          transition:
            "padding .25s ease, background .25s ease, border-color .25s ease, box-shadow .25s ease",
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo />
        </div>

        {/* Center links — desktop */}
        <div
          className="nav-links-desktop"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            justifySelf: "center",
            background: "rgba(255,255,255,0.35)",
            border: ".5px solid rgba(26,23,20,0.06)",
            borderRadius: 100,
            padding: 5,
          }}
        >
          {links.map((l) => (
            <a
              key={l.target}
              href={l.href}
              style={{
                position: "relative",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13.5,
                fontWeight: 400,
                color:
                  activeSection === l.target
                    ? "var(--text)"
                    : "var(--text-2)",
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: 100,
                transition: "color .18s ease, background .18s ease",
                letterSpacing: ".005em",
                background:
                  activeSection === l.target ? "#fff" : "transparent",
                boxShadow:
                  activeSection === l.target
                    ? "0 1px 2px rgba(26,23,20,.05), 0 4px 12px rgba(26,23,20,.04)"
                    : "none",
              }}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Right */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            justifySelf: "end",
          }}
        >
          <Link
            href="/auth"
            className="nav-signin-desktop"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13.5,
              fontWeight: 400,
              color: "var(--text-2)",
              textDecoration: "none",
              padding: "8px 4px",
              transition: "color .18s ease",
            }}
          >
            Sign in
          </Link>
          <Link
            href="/editor"
            className="nav-btn-desktop group"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13.5,
              fontWeight: 500,
              background: "var(--brown)",
              color: "#fff",
              border: "none",
              borderRadius: 100,
              padding: "10px 20px 10px 22px",
              cursor: "pointer",
              transition: "all .2s ease",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              letterSpacing: ".005em",
              whiteSpace: "nowrap",
            }}
          >
            Open Editor{" "}
            <span style={{ display: "inline-block", transition: "transform .25s ease" }}>→</span>
          </Link>

          {/* Mobile toggle */}
          <button
            className="nav-toggle-mobile"
            onClick={toggleMenu}
            aria-label="Menu"
            style={{
              display: "none",
              width: 38,
              height: 38,
              border: ".5px solid rgba(26,23,20,0.12)",
              background: "rgba(255,255,255,0.4)",
              borderRadius: 100,
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <span
              style={{
                display: "block",
                width: 16,
                height: 1.2,
                background: menuOpen ? "transparent" : "var(--text)",
                position: "relative",
                transition: "transform .25s ease, background .25s ease",
              }}
            >
              <span
                style={{
                  content: "''",
                  position: "absolute",
                  left: 0,
                  width: 16,
                  height: 1.2,
                  background: "var(--text)",
                  transition: "transform .25s ease, top .25s ease",
                  top: menuOpen ? 0 : -5,
                  transform: menuOpen ? "rotate(45deg)" : "none",
                }}
              />
              <span
                style={{
                  content: "''",
                  position: "absolute",
                  left: 0,
                  width: 16,
                  height: 1.2,
                  background: "var(--text)",
                  transition: "transform .25s ease, top .25s ease",
                  top: menuOpen ? 0 : 5,
                  transform: menuOpen ? "rotate(-45deg)" : "none",
                }}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "min(86vw, 340px)",
          background: "var(--cream)",
          borderLeft: ".5px solid var(--border)",
          padding: "88px 28px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform .35s cubic-bezier(.6,.05,.2,1)",
          zIndex: 99,
          boxShadow: "-20px 0 60px rgba(26,23,20,.06)",
        }}
      >
        {links.map((l) => (
          <a
            key={l.target}
            href={l.href}
            onClick={closeMenu}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28,
              fontWeight: 300,
              color: "var(--text)",
              textDecoration: "none",
              padding: "14px 0",
              borderBottom: ".5px solid var(--border)",
            }}
          >
            {l.label}
          </a>
        ))}
        <Link
          href="/auth"
          onClick={closeMenu}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 28,
            fontWeight: 300,
            color: "var(--text)",
            textDecoration: "none",
            padding: "14px 0",
            borderBottom: ".5px solid var(--border)",
          }}
        >
          Sign in
        </Link>
        <Link
          href="/editor"
          onClick={closeMenu}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            fontWeight: 500,
            background: "var(--brown)",
            color: "#fff",
            border: "none",
            borderRadius: 100,
            padding: "14px 24px",
            textAlign: "center",
            textDecoration: "none",
            marginTop: 24,
            display: "flex",
            justifyContent: "center",
          }}
        >
          Open Editor →
        </Link>
      </aside>

      {/* Backdrop */}
      {menuOpen && (
        <div
          onClick={closeMenu}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(26,23,20,.3)",
            opacity: 1,
            zIndex: 98,
            transition: "opacity .3s ease",
          }}
        />
      )}

      <style jsx>{`
        @media (max-width: 900px) {
          .nav-links-desktop { display: none !important; }
          .nav-signin-desktop { display: none !important; }
          .nav-btn-desktop { display: none !important; }
          .nav-toggle-mobile { display: inline-flex !important; }
        }
      `}</style>
    </>
  );
}
