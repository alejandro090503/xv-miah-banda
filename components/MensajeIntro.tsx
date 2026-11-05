"use client";
import { useEffect, useRef, useState } from "react";
import { useT } from "./i18n";

/* Transición entre el idioma y la invitación: el mensaje de Miah a pantalla completa.
   Las líneas entran una a una y al final todo se funde hacia el hero. */
export default function MensajeIntro({ onDone }: { onDone: () => void }) {
  const t = useT();
  const rootRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);
  const doneRef = useRef(false);

  const lineas = t.introLineas;
  const PASO = 1500;          // separación entre líneas
  const ESPERA_FINAL = 2600;  // tiempo de lectura de la última línea

  const salir = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    const el = rootRef.current;
    if (el) {
      el.style.transition = "opacity 1.1s ease";
      el.style.opacity = "0";
    }
    setTimeout(onDone, 1000);
  };

  useEffect(() => {
    const el = rootRef.current;
    if (el) requestAnimationFrame(() => { el.style.opacity = "1"; });

    const timers = lineas.map((_, i) =>
      setTimeout(() => setShown((n) => Math.max(n, i + 1)), 700 + i * PASO)
    );
    const fin = setTimeout(salir, 700 + lineas.length * PASO + ESPERA_FINAL);
    return () => { timers.forEach(clearTimeout); clearTimeout(fin); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={rootRef}
      onClick={salir}
      role="button"
      tabIndex={0}
      aria-label="Continuar"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 26,
        padding: "56px 30px",
        cursor: "pointer",
        background:
          "radial-gradient(ellipse 90% 55% at 50% 22%, rgba(217,163,170,0.16) 0%, transparent 62%)," +
          "radial-gradient(ellipse 80% 50% at 50% 88%, rgba(183,110,121,0.14) 0%, transparent 64%)," +
          "linear-gradient(168deg, #FBF4F3 0%, #FFF9F8 48%, #FBF4F3 100%)",
        opacity: 0,
        transition: "opacity 1.2s ease",
      }}
    >
      {/* ornamento superior */}
      <div aria-hidden="true" style={{
        display: "flex", alignItems: "center", gap: 12,
        opacity: shown > 0 ? 1 : 0,
        transition: "opacity 1.2s ease",
      }}>
        <div style={{ width: 52, height: 0.5, background: "linear-gradient(to right, transparent, rgba(217,163,170,0.75))" }} />
        <svg width="7" height="7" viewBox="0 0 5 5">
          <rect width="5" height="5" fill="#B76E79" transform="rotate(45 2.5 2.5)" opacity="0.9" />
        </svg>
        <div style={{ width: 52, height: 0.5, background: "linear-gradient(to left, transparent, rgba(183,110,121,0.75))" }} />
      </div>

      <div style={{ maxWidth: 460, textAlign: "center", display: "flex", flexDirection: "column", gap: 22 }}>
        {lineas.map((linea, i) => (
          <p
            key={i}
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: i === lineas.length - 1 ? "clamp(23px, 6.6vw, 30px)" : "clamp(19px, 5.4vw, 25px)",
              lineHeight: 1.62,
              letterSpacing: 0.4,
              color: i === lineas.length - 1 ? "#D9A3AA" : "#3D2A2D",
              textShadow: "0 2px 16px rgba(110,53,64,0.25)",
              margin: 0,
              opacity: shown > i ? 1 : 0,
              transform: shown > i ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 1.35s ease, transform 1.35s cubic-bezier(.2,.7,.2,1)",
            }}
          >
            {linea}
          </p>
        ))}
      </div>

      {/* firma — aparece con la última línea */}
      <div aria-hidden="true" style={{
        fontFamily: "var(--font-great-vibes), cursive",
        fontSize: 46,
        lineHeight: 1.6,
        padding: "6px 18px 0",
        background: "var(--foil)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        opacity: shown >= lineas.length ? 1 : 0,
        transform: shown >= lineas.length ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 1.4s ease .3s, transform 1.4s ease .3s",
      }}>
        Miah
      </div>
    </div>
  );
}
