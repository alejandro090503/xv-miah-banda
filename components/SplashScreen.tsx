"use client";
import { useRef, useState } from "react";

interface Props { onStart?: () => void; onOpen: () => void }

const B = "https://bsjoelxktbvlavfoozhk.supabase.co/storage/v1/object/public/fotos-clientes";
const POSTER = `${B}/img/xv-miah-banda/sobre.jpg?v=1`;
const VIDEO = `${B}/video/xv-miah-banda/sobre.mp4?v=1`;

/* Sobre del cliente (sello MB): al tocar, se reproduce el video de la solapa */
export default function SplashScreen({ onStart, onOpen }: Props) {
  const [opening, setOpening] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const vRef = useRef<HTMLVideoElement>(null);
  const done = useRef(false);

  const reveal = () => {
    if (done.current) return;
    done.current = true;
    if (rootRef.current) { rootRef.current.style.transition = "opacity .8s ease"; rootRef.current.style.opacity = "0"; }
    onOpen();
  };

  const tap = () => {
    if (opening) return;
    setOpening(true);
    onStart?.();
    const v = vRef.current;
    if (!v) { setTimeout(reveal, 300); return; }
    v.play().then(() => {
      const ms = (isFinite(v.duration) && v.duration > 0 ? v.duration : 8) * 1000 + 400;
      setTimeout(reveal, ms);
    }).catch(() => setTimeout(reveal, 300));
  };

  return (
    <div ref={rootRef} onClick={tap} role="button" aria-label="Toca para abrir / Tap to open"
      style={{ position: "fixed", inset: 0, zIndex: 10000, overflow: "hidden", background: "#F4EEE9", cursor: opening ? "default" : "pointer" }}>
      <video ref={vRef} src={VIDEO} poster={POSTER} muted playsInline preload="auto" onEnded={reveal}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "34%", background: "linear-gradient(to top, rgba(255,249,248,.92) 0%, rgba(255,249,248,.55) 55%, transparent 100%)", opacity: opening ? 0 : 1, transition: "opacity .5s", pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: "7%", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: opening ? 0 : 1, transition: "opacity .5s", pointerEvents: opening ? "none" : "auto" }}>
        <div style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 700, fontSize: 15, letterSpacing: 5, textTransform: "uppercase", color: "#6E3540" }}>Sweet 16 · Miah Alana</div>
        <button className="drop-btn" type="button">
          <span className="drop-label" style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1.3 }}>
            Toca para abrir
            <span style={{ fontSize: 12, letterSpacing: 4, opacity: .85 }}>Tap to open</span>
          </span>
        </button>
      </div>
    </div>
  );
}
