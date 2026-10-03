export default function DarkSection() {
  const tags = ["✦ made by you", "✦ felt by them", "✦ kept forever"];

  return (
    <section
      className="reveal dark-sec"
      style={{
        background: "var(--dark)",
        textAlign: "center",
        position: "relative",
        zIndex: 1,
        padding: "100px 28px 88px",
      }}
    >
      {/* Eyebrow */}
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10.5,
        letterSpacing: ".15em",
        color: "rgba(242,237,228,.32)",
        textTransform: "uppercase" as const,
        marginBottom: 28,
      }}>
        the difference
      </div>

      {/* Quote */}
      <div className="dark-quote" style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 300,
        lineHeight: 1.22,
        color: "var(--cream)",
        maxWidth: 640,
        margin: "0 auto 48px",
      }}>
        &ldquo;A polaroid they bought takes two seconds to forget.
        <br /><br />
        A polaroid{" "}
        <em style={{ fontStyle: "italic", color: "var(--brown-light)" }}>they made for you</em>
        <br />
        stays on the wall for years.&rdquo;
      </div>

      {/* Tags — single row, text never wraps */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 10,
      }}>
        {tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10.5,
              letterSpacing: ".09em",
              whiteSpace: "nowrap",
              color: "rgba(242,237,228,.42)",
              border: ".5px solid rgba(242,237,228,.14)",
              borderRadius: 100,
              padding: "7px 18px",
              display: "inline-block",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <style jsx>{`
        .dark-quote { font-size: 44px; }
        @media (max-width: 768px) {
          .dark-quote { font-size: 28px !important; }
        }
      `}</style>
    </section>
  );
}
