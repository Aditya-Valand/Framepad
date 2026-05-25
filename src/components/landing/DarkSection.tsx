export default function DarkSection() {
  return (
    <section
      className="reveal"
      style={{
        background: "var(--dark)",
        padding: "100px 48px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          letterSpacing: ".15em",
          color: "rgba(242,237,228,.4)",
          textTransform: "uppercase",
          marginBottom: 32,
        }}
      >
        the difference
      </div>
      <div
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 50,
          fontWeight: 300,
          lineHeight: 1.2,
          color: "var(--cream)",
          maxWidth: 760,
          margin: "0 auto 40px",
        }}
      >
        &ldquo;A polaroid they bought takes two seconds to forget.
        <br />
        <br />A polaroid{" "}
        <em style={{ fontStyle: "italic", color: "var(--brown-light)" }}>
          they made for you
        </em>
        <br />
        stays on the wall for years.&rdquo;
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        {["✦ made by you", "✦ felt by them", "✦ kept forever"].map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              letterSpacing: ".08em",
              color: "rgba(242,237,228,.5)",
              border: ".5px solid rgba(242,237,228,.2)",
              borderRadius: 100,
              padding: "6px 16px",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          section { padding: 80px 24px !important; }
          section > div:nth-child(2) { font-size: 32px !important; }
        }
      `}</style>
    </section>
  );
}
