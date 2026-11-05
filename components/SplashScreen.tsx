"use client";
import { useRef, useState } from "react";

interface Props { onStart?: () => void; onOpen: () => void }

/* Sobre blush con sello MB: la solapa se abre y se revela la invitación */
export default function SplashScreen({ onStart, onOpen }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  const tap = () => {
    if (open) return;
    setOpen(true);
    onStart?.();
    setTimeout(() => {
      if (done.current) return;
      done.current = true;
      if (rootRef.current) { rootRef.current.style.transition = "opacity .8s ease"; rootRef.current.style.opacity = "0"; }
      onOpen();
    }, 2300);
  };

  return (
    <div ref={rootRef} onClick={tap} role="button" aria-label="Toca para abrir / Tap to open"
      style={{ position: "fixed", inset: 0, zIndex: 10000, background: "radial-gradient(circle at 50% 40%, #FFF9F8 0%, #F4E1E3 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 34, cursor: "pointer" }}>
      <style>{`
        .sp-env{position:relative;width:min(78vw,320px);aspect-ratio:1.45;perspective:900px;animation:envBreathe 4s ease-in-out infinite}
        .sp-body{position:absolute;inset:0;border-radius:6px;background:linear-gradient(160deg,#FFF9F8,#F1D5D8);border:1px solid #D9A3AA;box-shadow:0 18px 40px rgba(110,53,64,.28)}
        .sp-front{position:absolute;inset:0;border-radius:6px;background:linear-gradient(135deg,transparent 49.6%,rgba(183,110,121,.4) 50%,transparent 50.4%),linear-gradient(225deg,transparent 49.6%,rgba(183,110,121,.4) 50%,transparent 50.4%);}
        .sp-flap{position:absolute;left:0;right:0;top:0;height:56%;transform-origin:top center;transition:transform .9s cubic-bezier(.6,0,.3,1);z-index:3;clip-path:polygon(0 0,100% 0,50% 100%);background:linear-gradient(180deg,#F1D5D8,#E9C9CD);filter:drop-shadow(0 2px 2px rgba(110,53,64,.25))}
        .sp-open .sp-flap{transform:rotateX(-175deg)}
        .sp-seal{position:absolute;left:50%;top:50%;width:74px;height:74px;margin:-37px 0 0 -37px;z-index:4;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 35% 30%,#E8B9C0,#B76E79 55%,#8C4F59);box-shadow:0 4px 12px rgba(110,53,64,.45),inset 0 0 0 3px rgba(255,255,255,.28);font-family:var(--font-cormorant),serif;font-weight:700;font-size:28px;color:#FFF9F8;letter-spacing:1px;transition:opacity .5s ease,transform .5s ease}
        .sp-open .sp-seal{opacity:0;transform:scale(.6)}
        .sp-card{position:absolute;left:8%;right:8%;top:10%;bottom:10%;background:#fff;border-radius:3px;transition:transform 1s ease .5s;box-shadow:0 2px 8px rgba(0,0,0,.12)}
        .sp-open .sp-card{transform:translateY(-52%)}
      `}</style>
      <div style={{ fontFamily: "var(--font-great-vibes), cursive", fontSize: "clamp(44px,14vw,64px)", lineHeight: 1.3, padding: "0 .45em" }} className="foil-text">Miah Alana</div>
      <div className={`sp-env${open ? " sp-open" : ""}`} style={open ? { animation: "none" } : undefined}>
        <div className="sp-body" /><div className="sp-card" /><div className="sp-front" />
        <div className="sp-flap" /><div className="sp-seal">MB</div>
      </div>
      <div style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 700, fontSize: 16, letterSpacing: 5, textTransform: "uppercase", color: "#6E3540", textAlign: "center", lineHeight: 1.7, opacity: open ? 0 : 1, transition: "opacity .4s" }}>
        Toca para abrir<br /><span style={{ fontSize: 14, letterSpacing: 4, opacity: .85 }}>Tap to open</span>
      </div>
    </div>
  );
}
