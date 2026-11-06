"use client";
import { useEffect, useRef } from "react";
import { useT } from "./i18n";

/* Itinerario — línea viva de 4 capas con perla shimmer que avanza con el scroll */

const EVENTOS = [
  { time: "6:30 PM", name: "Llegada", desc: "Te esperamos para recibirte con una copa en mano." },
  { time: "7:00 PM", name: "Cóctel", desc: "Brindis de bienvenida antes de la celebración." },
  { time: "8:00 PM", name: "Recepción", desc: "Comienza la noche en el salón." },
  { time: "9:00 PM", name: "Cena", desc: "Nos sentamos a la mesa." },
  { time: "10:00 PM", name: "Fiesta", desc: "La pista es de todos." },
  { time: "1:00 AM", name: "Fin de la fiesta", desc: "Cerramos con el corazón lleno." },
];

export default function Itinerario() {
  const t = useT();
  const wrapRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const fill = fillRef.current;
    if (!wrap || !fill) return;

    const events = Array.from(wrap.querySelectorAll<HTMLElement>(".itin-event"));
    let nodePositions: number[] = [];

    const measure = () => {
      const wrapRect = wrap.getBoundingClientRect();
      const h = wrap.offsetHeight || 1;
      nodePositions = events.map((ev) => {
        const marker = ev.querySelector(".itin-marker");
        if (!marker) return 0;
        const r = marker.getBoundingClientRect();
        return ((r.top - wrapRect.top) + r.height / 2) / h;
      });
    };

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      // progreso equivalente a start:'top 72%' / end:'bottom 55%'
      const start = vh * 0.72;
      const end = vh * 0.55;
      const total = rect.height + (start - end);
      const p = Math.max(0, Math.min(1, (start - rect.top) / (total || 1)));

      const scaleStr = `scaleY(${p.toFixed(4)})`;
      fill.style.transform = scaleStr;
      if (glowRef.current) glowRef.current.style.transform = scaleStr;
      if (midRef.current) midRef.current.style.transform = scaleStr;

      if (shimmerRef.current) {
        const h = wrap.offsetHeight;
        shimmerRef.current.style.top = `${p * h - 10}px`;
        shimmerRef.current.style.opacity = p > 0.015 && p < 0.985 ? "1" : "0";
      }

      events.forEach((ev, i) => {
        const threshold = nodePositions[i] || 0;
        ev.classList.toggle("is-active", p >= threshold - 0.02);
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    const onResize = () => { measure(); onScroll(); };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section style={{ padding: "64px 0" }}>
      <style>{`
        .itin-wrap{position:relative;max-width:520px;margin:0 auto;padding:20px clamp(16px,4vw,40px)}
        .itin-track{position:absolute;left:50%;top:0;bottom:0;width:0;overflow:visible;z-index:1;pointer-events:none}
        .itin-track-glow{position:absolute;left:-40px;width:80px;top:0;height:100%;transform:scaleY(0);transform-origin:top center;background:linear-gradient(to bottom,transparent 0%,rgba(183,110,121,.15) 8%,rgba(183,110,121,.4) 40%,rgba(183,110,121,.4) 60%,rgba(183,110,121,.15) 92%,transparent 100%);filter:blur(22px);opacity:.92;will-change:transform;pointer-events:none}
        .itin-track-mid{position:absolute;left:-5px;width:10px;top:0;height:100%;transform:scaleY(0);transform-origin:top center;background:linear-gradient(to bottom,transparent 0%,rgba(217,163,170,.5) 8%,rgba(217,163,170,.85) 40%,rgba(217,163,170,.85) 60%,rgba(217,163,170,.5) 92%,transparent 100%);filter:blur(5px);opacity:.92;will-change:transform;pointer-events:none}
        .itin-track-fill{position:absolute;left:-1.25px;width:2.5px;box-shadow:0 0 8px 1px rgba(217,163,170,.9);top:0;height:100%;transform:scaleY(0);transform-origin:top center;background:linear-gradient(to bottom,transparent 0%,#B76E79 5%,#D9A3AA 28%,#8C4F59 50%,#D9A3AA 72%,#B76E79 95%,transparent 100%);border-radius:1px;will-change:transform;pointer-events:none}
        .itin-track-shimmer{position:absolute;left:-10px;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle at 38% 36%,#fff 0%,#F1D5D8 38%,rgba(183,110,121,.15) 100%);box-shadow:0 0 10px 4px rgba(217,163,170,.9),0 0 22px 8px rgba(183,110,121,.55),0 0 42px 14px rgba(183,110,121,.18);opacity:0;pointer-events:none;will-change:top,opacity}
        .itin-events{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:clamp(42px,7.5vh,88px);position:relative;z-index:2}
        .itin-event{position:relative;display:flex;flex-direction:column;align-items:center}
        .itin-marker{width:14px;height:14px;border-radius:50%;background:rgba(183,110,121,.22);border:1.5px solid rgba(183,110,121,.28);position:relative;z-index:3;flex-shrink:0;margin-bottom:22px;opacity:.36;transition:opacity .55s ease,background .55s ease,box-shadow .55s ease,border-color .55s ease}
        .itin-event.is-active .itin-marker{opacity:1;background:radial-gradient(circle at 34% 30%,#F1D5D8 0%,#B76E79 52%,#6E3540 100%);border-color:rgba(183,110,121,.88);box-shadow:0 0 6px 2px rgba(240,214,147,.88),0 0 16px 6px rgba(183,110,121,.44),0 0 32px 10px rgba(183,110,121,.16)}
        .itin-event.is-active .itin-marker::before{content:"";position:absolute;inset:-7px;border-radius:50%;border:1px solid rgba(217,163,170,.45);animation:itin-halo 2.4s ease-in-out infinite}
        .itin-event.is-active .itin-marker::after{content:"";position:absolute;inset:-14px;border-radius:50%;border:1px solid rgba(183,110,121,.1)}
        @keyframes itin-halo{0%,100%{opacity:.28;transform:scale(1)}50%{opacity:.58;transform:scale(1.05)}}
        .itin-card{padding:26px 30px 30px;background:linear-gradient(150deg,rgba(255,249,248,.92) 0%,rgba(244,225,227,.78) 100%);border:1px solid rgba(183,110,121,.5);border-radius:18px;box-shadow:0 0 0 1px rgba(255,255,255,.8) inset,0 0 16px rgba(217,163,170,.55),0 0 34px rgba(183,110,121,.22),0 16px 34px -18px rgba(110,53,64,.4);text-align:center;width:100%;max-width:400px;position:relative;transition:border-color .5s ease,background .5s ease,box-shadow .5s ease}
        .itin-card::before,.itin-card::after{content:"";position:absolute;left:50%;transform:translateX(-50%);height:1px;background:linear-gradient(to right,transparent,rgba(217,163,170,.6),transparent)}
        .itin-card::before{top:10px;width:52%}
        .itin-card::after{bottom:10px;width:52%}
        .itin-time{font-family:var(--font-cormorant),serif;font-style:italic;font-weight:700;font-size:clamp(21px,5.6vw,26px);color:#B76E79;letter-spacing:.02em;margin-bottom:6px;transition:color .5s ease}
        .itin-name{font-family:var(--font-lato),sans-serif;font-size:13px;text-transform:uppercase;letter-spacing:.28em;color:#8C4F59;font-weight:700;padding-left:.28em}
        .itin-desc{margin-top:12px;font-family:var(--font-cormorant),serif;font-style:italic;font-weight:600;font-size:16px;color:var(--text-soft);line-height:1.62}
        .itin-event.is-active .itin-card{border-color:rgba(183,110,121,.85);box-shadow:0 0 0 1px rgba(255,255,255,.9) inset,0 0 22px rgba(217,163,170,.8),0 0 46px rgba(183,110,121,.38),0 18px 40px -18px rgba(110,53,64,.45)}
        .itin-event.is-active .itin-time{color:#6E3540}
        @media(max-width:680px){.itin-card{max-width:100%;padding:20px 20px 24px}.itin-time{font-size:26px}}
        @media(prefers-reduced-motion:reduce){.itin-event.is-active .itin-marker::before{animation:none!important}}
      `}</style>

      <div style={{ textAlign: "center", padding: "0 24px 8px" }}>
        <p style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic", fontWeight: 600, fontSize: 14, letterSpacing: 5,
          textTransform: "uppercase", color: "#B76E79", marginBottom: 8, opacity: 0.9,
        }}>
          {t.itinEyebrow}
        </p>
        <h2 style={{
          fontFamily: "var(--font-great-vibes), cursive",
          fontSize: 50, lineHeight: 1.2, marginBottom: 10, padding: "4px 20px 8px",
          background: "var(--foil)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          display: "inline-block",
        }}>
          {t.itinTitle}
        </h2>
      </div>

      <div className="itin-wrap" ref={wrapRef}>
        <div className="itin-track" aria-hidden="true">
          <div className="itin-track-glow" ref={glowRef} />
          <div className="itin-track-mid" ref={midRef} />
          <div className="itin-track-fill" ref={fillRef} />
          <div className="itin-track-shimmer" ref={shimmerRef} />
        </div>

        <ul className="itin-events">
          {t.itinEventos.map((e) => (
            <li className="itin-event" key={e.name}>
              <span className="itin-marker" aria-hidden="true" />
              <div className="itin-card">
                <div className="itin-time">{e.time}</div>
                <div className="itin-name">{e.name}</div>
                <div className="itin-desc">{e.desc}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
