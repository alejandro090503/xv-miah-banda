"use client";
import { useT } from "./i18n";

export default function Footer() {
  const t = useT();
  return (
    <footer style={{ padding: "40px 20px 50px", textAlign: "center" }}>
      <div style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic", fontWeight: 500, fontSize: 15,
        letterSpacing: 4, textTransform: "uppercase",
        color: "#8C4F59", marginBottom: 14, opacity: 0.9,
      }}>
        {t.footFecha}
      </div>
      <div style={{ width: 48, height: 1, margin: "0 auto 16px",
        background: "linear-gradient(90deg,transparent,#D9A3AA,transparent)", opacity: 0.55 }} />
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic", fontSize: 14, color: "var(--text-soft)", letterSpacing: 1,
      }}>
        {t.footCredito}{" "}
        <a href="https://www.instagram.com/elysium.invitaciones" target="_blank" rel="noopener noreferrer"
          style={{ color: "#D9A3AA", textDecoration: "none" }}>
          @elysium.invitaciones
        </a>
      </p>
    </footer>
  );
}
