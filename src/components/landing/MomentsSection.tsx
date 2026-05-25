const moments = [
  {
    title: "Date Night Memory",
    desc: "A Polaroid from the night you want to never end.",
    font: "'Dancing Script', cursive",
    text: "that night under the lights",
    gradient: "linear-gradient(135deg,#d4a574,#c08060)",
  },
  {
    title: "Best Friend's Birthday",
    desc: "Inside jokes and the song that always makes you both scream-sing.",
    font: "'DM Mono', monospace",
    text: "HAPPY B-DAY BESTIE",
    gradient: "linear-gradient(135deg,#b4a0d4,#8888cc)",
  },
  {
    title: "Anniversary",
    desc: "The Polaroid that captures not just the photo, but the years behind it.",
    font: "'Caveat', cursive",
    text: "3 years of us",
    gradient: "linear-gradient(135deg,#d4b8a0,#c09878)",
  },
  {
    title: "Graduation Gift",
    desc: "From dorm rooms to real life — a Polaroid they'll pin to their first apartment wall.",
    font: "'DM Mono', monospace",
    text: "CLASS OF '25",
    gradient: "linear-gradient(135deg,#a8c4b4,#78a088)",
  },
  {
    title: "Just Because",
    desc: "No event. No excuse. Just 'I saw this and thought of you.'",
    font: "'Dancing Script', cursive",
    text: "just because",
    gradient: "linear-gradient(135deg,#e0c8b0,#c4a882)",
  },
  {
    title: "Long Distance",
    desc: "A Polaroid that crosses the miles. Same song, different cities.",
    font: "'Caveat', cursive",
    text: "wish you were here",
    gradient: "linear-gradient(135deg,#a0b8d4,#7890b0)",
  },
];

export default function MomentsSection() {
  return (
    <section
      id="moments"
      style={{
        background: "var(--cream-deep)",
        borderTop: ".5px solid var(--border)",
        borderBottom: ".5px solid var(--border)",
        padding: "100px 48px",
      }}
    >
      <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 46, fontWeight: 300, fontStyle: "italic", marginBottom: 12 }}>
          Made for moments like these.
        </h2>
        <p style={{ fontSize: 15, fontWeight: 300, color: "var(--text-2)" }}>
          Whatever the occasion, there&apos;s a Polaroid waiting to be made.
        </p>
      </div>

      <div
        className="reveal"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        {moments.map((m) => (
          <div
            key={m.title}
            style={{
              background: "rgba(255,255,255,.5)",
              border: ".5px solid rgba(26,23,20,.06)",
              borderRadius: 16,
              padding: 24,
              display: "flex",
              gap: 18,
              alignItems: "flex-start",
              transition: "transform .2s ease, box-shadow .2s ease",
              cursor: "pointer",
            }}
          >
            {/* Mini polaroid */}
            <div
              style={{
                flexShrink: 0,
                width: 65,
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,.1)",
                borderRadius: 2,
              }}
            >
              <div style={{ height: 56, margin: "5px 5px 0", background: m.gradient }} />
              <div
                style={{
                  height: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontFamily: m.font, fontSize: 7, color: "#7a6e65" }}>
                  {m.text}
                </span>
              </div>
            </div>
            {/* Text */}
            <div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "var(--text)",
                  marginBottom: 6,
                }}
              >
                {m.title}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 300,
                  color: "var(--text-2)",
                  lineHeight: 1.5,
                }}
              >
                {m.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          section { padding: 80px 24px !important; }
        }
      `}</style>
    </section>
  );
}
