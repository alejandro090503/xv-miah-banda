"use client";
import { useT } from "./i18n";

/* Bloque de familia — tarjeta editorial con filete doble y ornamento central */
function Block({ label, names, icon }: { label: string; names: React.ReactNode; icon: React.ReactNode }) {
  return (
    <div style={{
      position: "relative",
      width: "100%",
      textAlign: "center",
      padding: "42px 30px 38px",
      background: "linear-gradient(160deg, rgba(233,201,205,0.22) 0%, rgba(255,249,248,0.74) 62%, rgba(255,249,248,0.66) 100%)",
      border: "1px solid rgba(183,110,121,0.42)",
      borderRadius: 2,
      boxShadow: "0 18px 48px rgba(110,53,64,0.16)",
    }}>
      {/* filete interior */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 7,
        border: "0.5px solid rgba(217,163,170,0.30)",
        borderRadius: 1,
        pointerEvents: "none",
      }} />

      {/* ornamento superior con el icono */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, maxWidth: 62, height: 1, background: "linear-gradient(to right, transparent, rgba(183,110,121,0.7))" }} />
        {icon}
        <div style={{ flex: 1, maxWidth: 62, height: 1, background: "linear-gradient(to left, transparent, rgba(217,163,170,0.7))" }} />
      </div>

      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic",
        fontWeight: 700,
        fontSize: 15,
        letterSpacing: 6,
        textTransform: "uppercase",
        color: "#8C4F59",
        marginBottom: 18,
        textIndent: 6,
      }}>
        {label}
      </p>

      <div style={{
        fontFamily: "var(--font-cormorant), serif",
        fontWeight: 600,
        fontSize: 22,
        color: "var(--text)",
        lineHeight: 1.75,
        letterSpacing: 0.4,
      }}>
        {names}
      </div>

      {/* rúbrica inferior */}
      <div aria-hidden="true" style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 20,
      }}>
        <div style={{ width: 26, height: 0.5, background: "rgba(183,110,121,0.6)" }} />
        <svg width="5" height="5" viewBox="0 0 5 5">
          <rect width="5" height="5" fill="#D9A3AA" transform="rotate(45 2.5 2.5)" opacity="0.9" />
        </svg>
        <div style={{ width: 26, height: 0.5, background: "rgba(183,110,121,0.6)" }} />
      </div>
    </div>
  );
}

const Amp = () => (
  <span style={{
    display: "block",
    fontFamily: "var(--font-great-vibes), cursive",
    fontStyle: "normal",
    fontSize: 34,
    color: "#D9A3AA",
    lineHeight: 1.1,
    margin: "2px 0",
  }}>&amp;</span>
);

export default function Familia() {
  const t = useT();
  return (
    <section style={{ padding: "64px 26px" }}>
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: 14,
        letterSpacing: 5,
        textTransform: "uppercase",
        color: "#B76E79",
        textAlign: "center",
        marginBottom: 8,
        opacity: 0.9,
      }}>
        {t.famEyebrow}
      </p>
      <h2 style={{
        fontFamily: "var(--font-great-vibes), cursive",
        fontSize: 50,
        textAlign: "center",
        lineHeight: 1.25,
        marginBottom: 30,
        padding: "6px 24px 10px",
        background: "var(--foil)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "block",
      }}>
        {t.famTitle}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "stretch" }}>
        <Block
          label={t.famPadres}
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#8C4F59" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
          names={<>Luiz<Amp />Leea Banda</>}
        />
      </div>
    </section>
  );
}
