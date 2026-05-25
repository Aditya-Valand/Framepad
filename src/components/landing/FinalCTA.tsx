import Link from "next/link";

export default function FinalCTA() {
  return (
    <section
      className="reveal"
      style={{
        padding: "100px 48px 80px",
        textAlign: "center",
        background: "var(--cream)",
      }}
    >
      <h2
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 52,
          fontWeight: 300,
          fontStyle: "italic",
          lineHeight: 1.15,
          marginBottom: 20,
          maxWidth: 600,
          margin: "0 auto 20px",
        }}
      >
        The best gifts aren&apos;t bought.
        <br />
        They&apos;re{" "}
        <span style={{ color: "var(--brown)" }}>made</span>.
      </h2>
      <p
        style={{
          fontSize: 16,
          fontWeight: 300,
          color: "var(--text-2)",
          marginBottom: 36,
          maxWidth: 440,
          margin: "0 auto 36px",
        }}
      >
        It takes three minutes. It lasts forever.
      </p>
      <Link
        href="/editor"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 16,
          fontWeight: 500,
          background: "var(--brown)",
          color: "#fff",
          border: "none",
          borderRadius: 100,
          padding: "16px 40px",
          cursor: "pointer",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          transition: "all .22s ease",
        }}
      >
        Make Your Polaroid{" "}
        <span style={{ fontSize: 20, transition: "transform .25s ease" }}>→</span>
      </Link>
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: "var(--text-3)",
          marginTop: 20,
          letterSpacing: ".06em",
        }}
      >
        free · no sign up · no watermark
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          section { padding: 80px 24px 60px !important; }
          h2 { font-size: 38px !important; }
        }
      `}</style>
    </section>
  );
}
