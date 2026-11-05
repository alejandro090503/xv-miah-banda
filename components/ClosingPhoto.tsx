"use client";
import { PHOTOS } from "./photos";
import { useT } from "./i18n";

/* Foto 3 — cierre, bosque encantado, con frase y monograma */
export default function ClosingPhoto() {
  const t = useT();
  const hasPhoto = !!PHOTOS.closing;

  return (
    <section style={{
      position: "relative",
      width: "100%",
      minHeight: "78vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-end",
      overflow: "hidden",
      background: hasPhoto ? "#FBF4F3" : "linear-gradient(180deg, #FFF9F8 0%, #FBF4F3 100%)",
      padding: "80px 28px 64px",
    }}>
      {hasPhoto && (
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url("${PHOTOS.closing}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          pointerEvents: "none",
        }} />
      )}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(255,249,248,0.45) 0%, rgba(255,249,248,0.25) 40%, rgba(255,249,248,0.85) 100%)",
        pointerEvents: "none",
      }} />

      <p style={{
        position: "relative",
        maxWidth: 360,
        textAlign: "center",
        fontFamily: "var(--font-great-vibes), cursive",
        fontSize: "clamp(26px, 8vw, 36px)",
        lineHeight: 1.5,
        color: "#3D2A2D",
        textShadow: "0 2px 12px rgba(0,0,0,0.6)",
        marginBottom: 30,
      }}>
        {t.closeMsg}
      </p>

      <div style={{
        position: "relative",
        fontFamily: "var(--font-great-vibes), cursive",
        fontSize: 72,
        lineHeight: 1.25,
        padding: "0 30px",
        overflow: "visible",
        background: "var(--foil)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        filter: "drop-shadow(0 3px 14px rgba(0,0,0,0.5))",
      }}>
        MB
      </div>
      <div style={{
        position: "relative",
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: 15,
        letterSpacing: 6,
        textTransform: "uppercase",
        color: "#8C4F59",
        marginTop: 6,
        textShadow: "0 1px 8px rgba(0,0,0,0.5)",
      }}>
        Miah Alana
      </div>
    </section>
  );
}
