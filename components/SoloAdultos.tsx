"use client";
import { useT } from "./i18n";

/* Aviso de evento solo para adultos — entre la mesa de regalos y la foto */
export default function SoloAdultos() {
  const t = useT();

  return (
    <section style={{ padding: "18px 26px 6px", textAlign: "center" }}>
      <div style={{
        position: "relative",
        maxWidth: 360,
        margin: "0 auto",
        padding: "30px 26px 28px",
        background: "linear-gradient(160deg, rgba(233,201,205,0.22) 0%, rgba(255,249,248,0.66) 68%)",
        border: "1px solid rgba(217,163,170,0.38)",
        borderRadius: 2,
        boxShadow: "0 16px 42px rgba(110,53,64,0.15)",
      }}>
        {/* filete interior */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 6,
          border: "0.5px solid rgba(183,110,121,0.26)",
          borderRadius: 1,
          pointerEvents: "none",
        }} />

        {/* ornamento con copas */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1, maxWidth: 54, height: 1, background: "linear-gradient(to right, transparent, rgba(217,163,170,0.7))" }} />
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8C4F59" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 3h5l-1 7a2.5 2.5 0 0 1-5 0z" />
            <path d="M8.5 12.5V20" />
            <path d="M6 20h5" />
            <path d="M14 3h5l-1 7a2.5 2.5 0 0 1-5 0z" />
            <path d="M16.5 12.5V20" />
            <path d="M14 20h5" />
          </svg>
          <div style={{ flex: 1, maxWidth: 54, height: 1, background: "linear-gradient(to left, transparent, rgba(183,110,121,0.7))" }} />
        </div>

        <p style={{
          fontFamily: "var(--font-great-vibes), cursive",
          fontSize: 42,
          lineHeight: 1.35,
          padding: "0 10px 4px",
          background: "var(--foil)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: 8,
        }}>
          {t.adultosTitulo}
        </p>

        <p style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: 17,
          lineHeight: 1.65,
          letterSpacing: 0.3,
          color: "var(--text)",
        }}>
          {t.adultosTexto}
        </p>
      </div>
    </section>
  );
}
