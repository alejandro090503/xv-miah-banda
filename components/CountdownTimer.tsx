"use client";
import { useEffect, useRef, useState } from "react";
import { useT } from "./i18n";

const TARGET = new Date("2027-01-31T18:00:00-08:00");

function getRemainingTime() {
  const now = new Date();
  const diff = TARGET.getTime() - now.getTime();
  if (diff <= 0) return { days: "000", hours: "00", minutes: "00", seconds: "00" };
  return {
    days: String(Math.floor(diff / 86400000)).padStart(3, "0"),
    hours: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0"),
    minutes: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
    seconds: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
  };
}

/* Tarjeta tipo calendario con flip (la hoja cae hacia atrás al cambiar) */
function FlipUnit({ value, label }: { value: string; label: string }) {
  const [display, setDisplay] = useState(value);
  const [style, setStyle] = useState<React.CSSProperties>({ transform: "rotateX(0deg)" });
  const prev = useRef(value);
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (value === prev.current) return;
    prev.current = value;
    // Fase 1: la hoja vieja gira hacia atrás (0 → -90)
    setStyle({ transform: "rotateX(-90deg)", transition: "transform .26s cubic-bezier(.45,0,.9,.6)" });
    const t1 = setTimeout(() => {
      setDisplay(value);
      // Fase 2: la hoja nueva entra desde +90 → 0
      setStyle({ transform: "rotateX(90deg)", transition: "none" });
      raf.current = requestAnimationFrame(() => {
        raf.current = requestAnimationFrame(() => {
          setStyle({ transform: "rotateX(0deg)", transition: "transform .38s cubic-bezier(.1,.55,.2,1)" });
        });
      });
    }, 260);
    return () => { clearTimeout(t1); if (raf.current) cancelAnimationFrame(raf.current); };
  }, [value]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, minWidth: 0 }}>
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "0.86",
        borderRadius: 12,
        background: "linear-gradient(180deg, rgba(233,201,205,0.30) 0%, rgba(255,249,248,0.94) 49.6%, rgba(233,201,205,0.9) 50.4%, rgba(255,249,248,0.96) 100%)",
        border: "1px solid rgba(217,163,170,0.42)",
        boxShadow: "0 10px 30px rgba(110,53,64,0.17), inset 0 1px 0 rgba(183,110,121,0.12)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: 360,
      }}>
        {/* Línea de pliegue central */}
        <div style={{
          position: "absolute", top: "50%", left: 0, right: 0,
          height: 1, transform: "translateY(-0.5px)",
          background: "linear-gradient(90deg, transparent, rgba(217,163,170,0.5) 30%, rgba(183,110,121,0.75) 50%, rgba(217,163,170,0.5) 70%, transparent)",
          zIndex: 2,
        }} />
        {/* Brillo superior */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 0%, rgba(183,110,121,0.16), transparent 65%)",
          pointerEvents: "none",
        }} />
        {/* Número con flip */}
        <span style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: "clamp(30px, 9vw, 46px)",
          lineHeight: 1,
          letterSpacing: "-1px",
          fontVariantNumeric: "tabular-nums",
          background: "linear-gradient(160deg,#6E3540 0%,#8C4F59 50%,#6E3540 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          transformOrigin: "center center",
          backfaceVisibility: "hidden",
          willChange: "transform",
          ...style,
        }}>
          {display}
        </span>
      </div>
      <span style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic",
        fontSize: 13,
        letterSpacing: "2.5px",
        textTransform: "uppercase",
        color: "#8C4F59",
        marginTop: 12,
        opacity: 0.95,
      }}>
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer() {
  const t = useT();
  const [time, setTime] = useState(getRemainingTime());

  useEffect(() => {
    const id = setInterval(() => setTime(getRemainingTime()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{ padding: "64px 26px" }}>
      <h2 style={{
        fontFamily: "var(--font-great-vibes), cursive",
        fontSize: 50, textAlign: "center", lineHeight: 1.1, marginBottom: 8,
        background: "var(--foil)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
      }}>
        {t.cdTitle}
      </h2>
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic", fontSize: 16, color: "var(--text-soft)",
        textAlign: "center", letterSpacing: 1, marginBottom: 34, fontWeight: 600,
      }}>
        {t.cdSub}
      </p>

      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "clamp(8px, 2.5vw, 16px)",
        maxWidth: 380,
        margin: "0 auto",
      }}>
        <FlipUnit value={time.days} label={t.cdDias} />
        <FlipUnit value={time.hours} label={t.cdHoras} />
        <FlipUnit value={time.minutes} label={t.cdMin} />
        <FlipUnit value={time.seconds} label={t.cdSeg} />
      </div>

      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic", fontSize: 16, color: "var(--text-soft)",
        textAlign: "center", letterSpacing: 1, lineHeight: 1.6,
        marginTop: 34, fontWeight: 500, opacity: 0.85,
      }}>
        {t.cdFoot}
      </p>
    </section>
  );
}
