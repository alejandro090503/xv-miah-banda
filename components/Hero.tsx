"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PHOTOS } from "./photos";
import { useT } from "./i18n";

export default function Hero() {
  const t = useT();
  const root = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const txt = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      gsap.fromTo(txt.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.1, delay: 0.3, ease: "power2.out" });
      if (reduce) return;
      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.fromTo(txt.current, { y: 0, opacity: 1, filter: "blur(0px)" }, { y: -110, opacity: 0, filter: "blur(10px)", ease: "none", scrollTrigger: { ...st, end: "60% top" }, immediateRender: false });
      gsap.fromTo(bg.current, { y: 0 }, { y: -70, ease: "none", scrollTrigger: st, immediateRender: false });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="hero" className="sec" data-bot="#FFFFFF" data-fh="90px"
      style={{ position: "relative", minHeight: "100dvh", display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden", background: "#2a1a1d" }}>
      <div ref={bg} className="hero-bg" style={{ zIndex: -3 }}>
        <i className="hero-drift" style={{ backgroundImage: `url("${PHOTOS.hero}")` }} />
        <div className="hero-glow"><span style={{ position: "absolute", inset: 0 }} /></div>
      </div>
      {/* velo solo en la franja baja */}
      <div aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "58%", zIndex: -2, background: "linear-gradient(to top, rgba(61,32,40,.88) 0%, rgba(61,32,40,.62) 45%, transparent 100%)", pointerEvents: "none" }} />
      <div ref={txt} style={{ position: "relative", width: "100%", textAlign: "center", padding: "0 20px 110px", color: "#fff" }}>
        <div style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontWeight: 600, fontSize: 20, letterSpacing: 8, textTransform: "uppercase", textIndent: 8, color: "#F1D5D8", textShadow: "0 2px 10px rgba(0,0,0,.5)" }}>
          {t.xvAnios}
        </div>
        <div className="foil-text foil-dark" style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 700, fontSize: "clamp(78px, 24vw, 104px)", lineHeight: 1, letterSpacing: 6, display: "inline-block" }}>
          16
        </div>
        <h1 className="foil-text foil-dark foil-d2" style={{ fontFamily: "var(--font-great-vibes), cursive", fontSize: "min(19vw, 92px)", fontWeight: 400, display: "block", whiteSpace: "nowrap", filter: "drop-shadow(0 3px 14px rgba(0,0,0,.45))" }}>
          Miah Alana
        </h1>
        <div style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 700, fontSize: 22, letterSpacing: 6, textTransform: "uppercase", textIndent: 6, marginTop: 6, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,.6)" }}>
          {t.fecha}
        </div>
        <div style={{ fontFamily: "var(--font-lato), sans-serif", fontWeight: 600, fontSize: 16, letterSpacing: 4, textTransform: "uppercase", marginTop: 8, color: "#F1D5D8", textShadow: "0 2px 10px rgba(0,0,0,.6)" }}>
          La Puente, CA
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)", animation: "hintFloat 3s ease-in-out infinite" }}>
        <div style={{ width: 1, height: 28, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,.85))" }} />
      </div>
    </section>
  );
}
