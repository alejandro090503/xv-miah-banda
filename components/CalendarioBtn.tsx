"use client";
import { useT } from "./i18n";

const GCAL_URL = (() => {
  const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const title = encodeURIComponent("Sweet 16 de Miah Alana");
  const details = encodeURIComponent(
    "Celebración de Sweet 16 de Miah Alana González · Coral Gables, FL."
  );
  const location = encodeURIComponent("SGV Event Center - Bourbon Room, 15904 Old Valley Blvd, La Puente, CA 91744");
  const dates = "20270131T010000Z/20270131T080000Z";
  return `${base}&text=${title}&dates=${dates}&details=${details}&location=${location}`;
})();

export default function CalendarioBtn() {
  const t = useT();
  return (
    <section style={{ padding: "40px 26px 64px", textAlign: "center" }}>
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic", fontSize: 14, letterSpacing: 5,
        textTransform: "uppercase", color: "#B76E79",
        marginBottom: 8, opacity: 0.85, fontWeight: 600,
      }}>
        {t.calEyebrow}
      </p>
      <h2 style={{
        fontFamily: "var(--font-great-vibes), cursive",
        fontSize: 48, lineHeight: 1.25, marginBottom: 16, padding: "4px 20px 8px",
        background: "var(--foil)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        display: "inline-block",
      }}>
        {t.calTitle}
      </h2>
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic", fontWeight: 600, fontSize: 17,
        color: "var(--text-soft)", marginBottom: 20,
      }}>
        {t.calSub}
      </p>
      <a href={GCAL_URL} target="_blank" rel="noopener noreferrer"
        style={{
          display: "inline-block", padding: "14px 32px",
          background: "linear-gradient(135deg,#B76E79,#8C4F59)",
          color: "#fff", borderRadius: 30,
          fontFamily: "var(--font-lato), sans-serif",
          fontSize: 14, fontWeight: 800, textTransform: "uppercase",
          letterSpacing: 3, textDecoration: "none",
          boxShadow: "0 4px 16px rgba(110,53,64,0.15)",
        }}>
        {t.calBtn}
      </a>
    </section>
  );
}
