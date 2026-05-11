import Link from "next/link";

export default function Logo({
  size = "md",
  href = "/",
}: {
  size?: "sm" | "md";
  href?: string;
}) {
  const fontSize = size === "sm" ? 22 : 24;
  const dotSize = size === "sm" ? 7 : 8;
  const dotY = size === "sm" ? -1 : -2;

  return (
    <Link
      href={href}
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize,
        fontWeight: 300,
        color: "var(--text)",
        letterSpacing: ".005em",
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "baseline",
        gap: 8,
        lineHeight: 1,
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          background: "var(--brown)",
          transform: `translateY(${dotY}px)`,
        }}
      />
      Pola<em style={{ fontStyle: "italic", fontWeight: 300 }}>muse</em>
    </Link>
  );
}
