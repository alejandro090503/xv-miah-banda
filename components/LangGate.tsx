"use client";
import { useEffect, useRef } from "react";
import type { Lang } from "./i18n";

/* Pantalla de idioma — aparece justo después de que se abre el sobre */
export default function LangGate({ onPick }: { onPick: (l: Lang) => void }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    requestAnimationFrame(() => { el.style.opacity = "1"; });
  }, []);

  const pick = (l: Lang) => {
    const el = rootRef.current;
    if (el) {
      el.style.transition = "opacity 0.6s ease";
      el.style.opacity = "0";
    }
    setTimeout(() => onPick(l), 480);
  };

  return (
    <div
      ref={rootRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        padding: "40px 26px",
        background: "radial-gradient(circle at 50% 34%, rgba(233,201,205,0.30) 0%, transparent 58%), linear-gradient(165deg, #FBF4F3 0%, #FFF9F8 52%, #FBF4F3 100%)",
        opacity: 0,
        transition: "opacity 0.7s ease",
      }}
    >
      {/* monograma — line-height y padding holgados para que no se corten los trazos altos */}
      <div style={{
        fontFamily: "var(--font-great-vibes), cursive",
        fontSize: 72,
        lineHeight: 1.6,
        padding: "14px 22px 0",
        overflow: "visible",
        background: "var(--foil)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        filter: "drop-shadow(0 3px 14px rgba(110,53,64,0.25))",
      }}>
        MB
      </div>

      <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: 10, marginTop: -8 }}>
        <div style={{ width: 44, height: 0.5, background: "linear-gradient(to right, transparent, rgba(217,163,170,0.8))" }} />
        <svg width="6" height="6" viewBox="0 0 5 5">
          <rect width="5" height="5" fill="#D9A3AA" transform="rotate(45 2.5 2.5)" opacity="0.95" />
        </svg>
        <div style={{ width: 44, height: 0.5, background: "linear-gradient(to left, transparent, rgba(183,110,121,0.8))" }} />
      </div>

      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: 19,
        lineHeight: 1.5,
        letterSpacing: 1,
        color: "#3D2A2D",
        textAlign: "center",
        margin: "2px 0 10px",
      }}>
        Elige tu idioma
        <span style={{ display: "block", fontSize: 17, color: "#8C4F59" }}>Choose your language</span>
      </p>

      {/* mismos botones "gota de agua" del sobre */}
      <button type="button" className="drop-btn drop-btn--wide drop-btn--oro" onClick={() => pick("es")} lang="es">
        <span className="drop-spec" aria-hidden="true" />
        <span className="drop-glint" aria-hidden="true" />
        <span className="drop-sweep" aria-hidden="true" />
        <span className="drop-label">Español</span>
      </button>
      <button type="button" className="drop-btn drop-btn--wide drop-btn--lila" onClick={() => pick("en")} lang="en">
        <span className="drop-spec" aria-hidden="true" />
        <span className="drop-glint" aria-hidden="true" />
        <span className="drop-sweep drop-sweep--delay" aria-hidden="true" />
        <span className="drop-label">English</span>
      </button>
    </div>
  );
}
