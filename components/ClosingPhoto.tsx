"use client";
import { PHOTOS } from "./photos";
import { useT } from "./i18n";

/* Cierre: foto con deriva y brillo (como el hero), halo tras el texto, sin iniciales */
export default function ClosingPhoto() {
  const t = useT();
  return (
    <section style={{ position: "relative", width: "100%", minHeight: "78vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", overflow: "hidden", padding: "80px 28px 64px", background: "transparent" }}>
      <div className="hero-bg" style={{ zIndex: -3 }} aria-hidden>
        <i className="hero-drift" style={{ backgroundImage: `url("${PHOTOS.closing}")`, backgroundPosition: "center 30%" }} />
        <div className="hero-glow"><span style={{ position: "absolute", inset: 0 }} /></div>
      </div>
      <div aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "62%", zIndex: -2, background: "linear-gradient(to top, rgba(255,249,248,.7) 0%, rgba(255,249,248,.35) 55%, transparent 100%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", maxWidth: 360, textAlign: "center" }}>
        <div aria-hidden style={{ position: "absolute", inset: "-46px -34px", background: "radial-gradient(ellipse at center, rgba(255,249,248,.92) 0%, rgba(255,249,248,.7) 38%, rgba(255,249,248,.28) 62%, transparent 78%)", pointerEvents: "none" }} />
        <p style={{ position: "relative", fontFamily: "var(--font-great-vibes), cursive", fontSize: "clamp(26px, 8vw, 36px)", lineHeight: 1.5, color: "#3D2A2D", textShadow: "none", marginBottom: 18 }}>{t.closeMsg}</p>
        <div className="foil-text" style={{ position: "relative", display: "inline-block", fontFamily: "var(--font-cormorant), serif", fontWeight: 700, fontSize: 20, letterSpacing: 8, textIndent: 8, textTransform: "uppercase" }}>Miah Alana</div>
      </div>
    </section>
  );
}
