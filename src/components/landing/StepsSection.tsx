import Link from "next/link";

const steps = [
  {
    num: "01",
    title: "Upload Your Photo",
    desc: "Drop any image. We'll crop it into the perfect Polaroid ratio. No photography skills required.",
    detail: "Supports JPG, PNG, WebP",
  },
  {
    num: "02",
    title: "Write Your Caption",
    desc: "Type what you'd write on the back of a photo if you still carried one in your wallet.",
    detail: "Handwriting & typewriter fonts",
  },
  {
    num: "03",
    title: "Add a Spotify Code",
    desc: "Paste a song link — we'll generate a scannable Spotify code. Now the photo has a soundtrack.",
    detail: "Any Spotify track or playlist",
  },
  {
    num: "04",
    title: "Print or Share",
    desc: "Download as a high-res PNG. Send it digitally, or better yet — print it. Some things are meant to be held.",
    detail: "300 DPI print-ready",
  },
];

export default function StepsSection() {
  return (
    <section id="how" style={{ padding: "100px 48px", background: "var(--cream)" }}>
      <div className="reveal" style={{ textAlign: "center", marginBottom: 72 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 46, fontWeight: 300, fontStyle: "italic", marginBottom: 12 }}>
          Four steps, one keepsake.
        </h2>
        <p style={{ fontSize: 15, fontWeight: 300, color: "var(--text-2)" }}>
          No account needed. No watermark. Free forever.
        </p>
      </div>

      <div
        className="reveal"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 28,
          maxWidth: 1050,
          margin: "0 auto",
        }}
      >
        {steps.map((s) => (
          <div
            key={s.num}
            style={{
              borderTop: ".5px solid var(--border)",
              paddingTop: 28,
            }}
          >
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 12,
                color: "var(--text-3)",
                marginBottom: 14,
                letterSpacing: ".06em",
              }}
            >
              {s.num}
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 16,
                fontWeight: 600,
                color: "var(--text)",
                marginBottom: 10,
              }}
            >
              {s.title}
            </div>
            <div
              style={{
                fontSize: 13.5,
                fontWeight: 300,
                color: "var(--text-2)",
                lineHeight: 1.7,
                marginBottom: 14,
              }}
            >
              {s.desc}
            </div>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                color: "var(--text-3)",
                letterSpacing: ".06em",
              }}
            >
              {s.detail}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="reveal" style={{ textAlign: "center", marginTop: 60 }}>
        <Link
          href="/editor"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            fontWeight: 500,
            background: "var(--brown)",
            color: "#fff",
            border: "none",
            borderRadius: 100,
            padding: "14px 32px",
            cursor: "pointer",
            textDecoration: "none",
            display: "inline-block",
            transition: "all .22s ease",
          }}
        >
          Try it free — no sign up →
        </Link>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          section { padding: 80px 24px !important; }
          section > div:nth-child(2) {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 500px) {
          section > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
