"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLang } from "./i18n";

/* ── Textos locales ── */
const TXT = {
  es: {
    eyebrow: "Mesa de regalos",
    title: "Lluvia de Sobres",
    abrir: "Toca para abrir",
    cerrar: "Toca para cerrar",
    regalo: "Tu presencia es nuestro regalo",
    buzon: "Si deseas tener un detalle conmigo, el día del evento habrá un buzón para recibir tu sobre.",
    aria: "Sobre de regalo",
  },
  en: {
    eyebrow: "Gift registry",
    title: "Envelope Shower",
    abrir: "Tap to open",
    cerrar: "Tap to close",
    regalo: "Your presence is our gift",
    buzon: "If you'd like to give me a gift, there will be a mailbox at the event to receive your envelope.",
    aria: "Gift envelope",
  },
} as const;

/* 3 profundidades de la lluvia: lejos (chico, tenue, lento) → cerca */
const DEPTHS = [
  { min: 14, max: 19, op: 0.38, dur: [10, 12.5] },
  { min: 20, max: 28, op: 0.6, dur: [7.5, 9.5] },
  { min: 30, max: 38, op: 0.85, dur: [5.5, 7] },
] as const;
const MAX_ALIVE = 22;
const SPAWN_EVERY = 0.55; // s

const RAIN_SVG =
  '<rect x="1" y="1" width="32" height="22" rx="2.4" fill="url(#ls-rain-paper)" stroke="url(#ls-rg-line)" stroke-width="1.3"/>' +
  '<path d="M1.6 1.6 L17 13 L32.4 1.6 Z" fill="url(#ls-rg-flap)" stroke="url(#ls-rg-line)" stroke-width="1.1" stroke-linejoin="round"/>' +
  '<circle cx="17" cy="13" r="3.1" fill="#6E3540" stroke="#E9C9CD" stroke-width=".7"/>';

export default function MesaRegalos() {
  const lang = useLang();
  const t = TXT[lang] ?? TXT.es;

  const secRef = useRef<HTMLElement>(null);
  const rainRef = useRef<HTMLDivElement>(null);
  const envRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLSpanElement>(null);

  const [open, setOpen] = useState(false);
  const [landed, setLanded] = useState(false);

  const landedRef = useRef(false);
  const landingRef = useRef(false);
  const openAfterLand = useRef(false);
  const landFn = useRef<() => void>(() => {});

  /* ── aterrizaje + lluvia ── */
  useEffect(() => {
    const sec = secRef.current;
    const rain = rainRef.current;
    const env = envRef.current;
    if (!sec || !rain || !env) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let alive = 0;
    let raining = false;
    let spawnCall: gsap.core.Tween | null = null;
    let disposed = false;

    const finishLanding = () => {
      if (disposed) return;
      landingRef.current = false;
      landedRef.current = true;
      gsap.set(env, { clearProps: "transform,opacity" });
      setLanded(true);
      // destello que cruza el sobre
      const sh = sheenRef.current;
      if (sh && !reduce) {
        sh.classList.remove("ls-sheen-go");
        void sh.offsetWidth;
        sh.classList.add("ls-sheen-go");
      }
      if (openAfterLand.current) {
        openAfterLand.current = false;
        setOpen(true);
      }
    };

    const land = (instant = false) => {
      if (landedRef.current || landingRef.current) return;
      landingRef.current = true;
      if (instant) {
        finishLanding();
        return;
      }
      if (reduce) {
        gsap.fromTo(env, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power1.out", onComplete: finishLanding });
        return;
      }
      gsap.fromTo(
        env,
        { opacity: 0, y: -150, rotation: -12, scale: 0.82 },
        { opacity: 1, y: 0, rotation: 0, scale: 1, duration: 1.15, ease: "back.out(1.5)", onComplete: finishLanding },
      );
    };
    landFn.current = () => land(false);

    /* Estado inicial: solo se esconde si la sección todavía está abajo de la pantalla.
       Si ya se ve o ya pasó, se queda visible (reposo visible siempre). */
    const r0 = sec.getBoundingClientRect();
    const vh0 = window.innerHeight || 800;
    if (r0.top + r0.height / 2 < vh0 * 0.6) {
      land(true);
    } else if (!reduce) {
      gsap.set(env, { opacity: 0, y: -150, rotation: -12, scale: 0.82 });
    } else {
      gsap.set(env, { opacity: 0 });
    }

    /* Respaldo por scroll (por si el IntersectionObserver no dispara) */
    const checkCenter = () => {
      if (landedRef.current || landingRef.current) return;
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      if (r.top + r.height / 2 < vh * 0.6) land(false);
    };
    window.addEventListener("scroll", checkCenter, { passive: true });
    window.addEventListener("resize", checkCenter, { passive: true });

    const centerIO = new IntersectionObserver(
      (ents) => ents.forEach((e) => e.isIntersecting && land(false)),
      { rootMargin: "-38% 0px -38% 0px", threshold: 0 },
    );
    centerIO.observe(sec);

    /* ── lluvia continua, solo con la sección en pantalla ── */
    const makeEnvelope = () => {
      if (alive >= MAX_ALIVE || disposed) return;
      alive++;
      const d = DEPTHS[Math.random() < 0.4 ? 0 : Math.random() < 0.6 ? 1 : 2];
      const w = d.min + Math.random() * (d.max - d.min);
      const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      el.setAttribute("viewBox", "0 0 34 24");
      el.setAttribute("class", "ls-rain-item");
      el.setAttribute("width", String(w.toFixed(1)));
      el.setAttribute("height", String(((w * 24) / 34).toFixed(1)));
      el.style.left = `${(Math.random() * 96).toFixed(2)}%`;
      el.innerHTML = RAIN_SVG;
      rain.appendChild(el);
      const H = sec.offsetHeight + 80;
      const dur = d.dur[0] + Math.random() * (d.dur[1] - d.dur[0]);
      const kill = () => {
        if (el.parentNode) {
          el.remove();
          alive--;
        }
      };
      gsap
        .timeline({ onComplete: kill })
        .fromTo(
          el,
          { y: -46, x: 0, rotation: (Math.random() - 0.5) * 50 },
          { y: H, x: (Math.random() - 0.5) * 70, rotation: (Math.random() - 0.5) * 160, duration: dur, ease: "none" },
          0,
        )
        .fromTo(el, { opacity: 0 }, { opacity: d.op, duration: dur * 0.15, ease: "power1.out" }, 0)
        .to(el, { opacity: 0, duration: dur * 0.2, ease: "power1.in" }, dur * 0.8);
    };
    const scheduleSpawn = () => {
      spawnCall = gsap.delayedCall(SPAWN_EVERY, () => {
        if (!raining) return;
        makeEnvelope();
        scheduleSpawn();
      });
    };
    const startRain = () => {
      if (raining || reduce) return;
      raining = true;
      const burst = Math.max(0, Math.min(7, MAX_ALIVE - alive));
      for (let i = 0; i < burst; i++) gsap.delayedCall(i * 0.24, () => raining && makeEnvelope());
      scheduleSpawn();
    };
    const stopRain = () => {
      raining = false;
      spawnCall?.kill();
      spawnCall = null;
    };

    const viewIO = new IntersectionObserver(
      (ents) => ents.forEach((e) => (e.isIntersecting ? startRain() : stopRain())),
      { rootMargin: "60px 0px 60px 0px", threshold: 0 },
    );
    if (!reduce) viewIO.observe(sec);

    return () => {
      disposed = true;
      stopRain();
      centerIO.disconnect();
      viewIO.disconnect();
      window.removeEventListener("scroll", checkCenter);
      window.removeEventListener("resize", checkCenter);
      gsap.killTweensOf(env);
      rain.querySelectorAll(".ls-rain-item").forEach((n) => {
        gsap.killTweensOf(n);
        n.remove();
      });
      alive = 0;
    };
  }, []);

  /* ── toque: siempre funciona; si no ha aterrizado, aterriza y abre ── */
  const toggle = useCallback(() => {
    if (!landedRef.current) {
      openAfterLand.current = true;
      landFn.current();
      return;
    }
    setOpen((o) => !o);
  }, []);

  const breathe = landed && !open;

  return (
    <section ref={secRef} className="ls-sec" aria-label={t.title}>
      <style>{`
.ls-sec{position:relative;background:transparent;padding:68px 20px 64px;text-align:center;overflow:hidden}
.ls-rain{position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.ls-rain-item{position:absolute;top:-46px;left:0;opacity:0;display:block}
.ls-stage{position:relative;z-index:1}
.ls-eyebrow{font-family:var(--font-cormorant),serif;font-variant-numeric:lining-nums;font-weight:600;font-size:16px;letter-spacing:.32em;text-transform:uppercase;color:var(--accent-deep,#6E3540);margin:0 0 6px}
.ls-title{display:inline-block;font-family:var(--font-great-vibes),cursive;font-weight:400;font-size:clamp(46px,13vw,56px);
  padding:.22em .45em;margin:-.22em -.45em 0;line-height:1.25;box-decoration-break:clone;-webkit-box-decoration-break:clone;color:var(--accent-deep,#6E3540)}
.ls-rule{display:flex;align-items:center;justify-content:center;gap:10px;margin:4px auto 0;max-width:220px}
.ls-rule i{flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--gold-soft,#D9A3AA),transparent)}
.ls-rule b{width:7px;height:7px;transform:rotate(45deg);background:linear-gradient(135deg,var(--gold-deep,#8C4F59),var(--accent,#B76E79) 55%,var(--accent-soft,#E9C9CD))}

.ls-env{display:flex;flex-direction:column;align-items:center;margin:34px auto 0;padding:0;border:0;background:none;cursor:pointer;
  touch-action:manipulation;-webkit-tap-highlight-color:transparent;color:inherit;font:inherit;min-width:44px;min-height:44px}
.ls-env:focus-visible{outline:2px solid var(--accent,#B76E79);outline-offset:6px;border-radius:8px}
.ls-body{position:relative;width:min(258px,72vw);aspect-ratio:260/200;perspective:700px}
.ls-body.ls-breathe{animation:ls-breathe 3.6s ease-in-out infinite}
@keyframes ls-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.025)}}
.ls-body svg.ls-svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.ls-flap{position:absolute;top:23%;left:6.9%;width:86.2%;height:43%;transform-origin:50% 0;transform-style:preserve-3d;
  transition:transform .7s cubic-bezier(.4,0,.2,1);pointer-events:none;z-index:2}
.ls-env.is-open .ls-flap{transform:rotateX(-175deg)}
.ls-flap svg{position:absolute;inset:0;width:100%;height:100%;display:block;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.ls-flap .ls-flap-back{transform:rotateX(180deg)}
.ls-seal{position:absolute;top:52%;left:50%;width:24%;aspect-ratio:1;transform:translate(-50%,-50%);z-index:3;pointer-events:none;
  transition:opacity .35s ease,transform .5s cubic-bezier(.4,0,.2,1)}
.ls-env.is-open .ls-seal{opacity:0;transform:translate(-50%,-50%) scale(.7)}
.ls-sheenclip{position:absolute;top:26%;left:6.9%;width:86.2%;height:66%;border-radius:8px;overflow:hidden;z-index:4;pointer-events:none}
.ls-sheen{position:absolute;top:-30%;left:0;width:38%;height:160%;opacity:0;transform:translateX(-140%) skewX(-18deg);
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.75) 50%,transparent)}
.ls-sheen.ls-sheen-go{animation:ls-sheen 1.5s cubic-bezier(.4,0,.2,1) .1s 1 both}
@keyframes ls-sheen{0%{opacity:0;transform:translateX(-140%) skewX(-18deg)}15%{opacity:1}85%{opacity:1}100%{opacity:0;transform:translateX(330%) skewX(-18deg)}}

.ls-content{overflow:hidden;max-height:0;opacity:0;transition:max-height .55s .25s ease,opacity .45s .35s ease;
  display:flex;flex-direction:column;align-items:center;gap:8px;padding:0 10px;text-align:center}
.ls-env.is-open .ls-content{max-height:340px;opacity:1}
.ls-mailbox{width:42px;height:42px;color:var(--accent,#B76E79);margin-top:22px}
.ls-gift{display:inline-block;font-family:var(--font-great-vibes),cursive;font-weight:400;font-size:clamp(30px,8.6vw,36px);
  padding:.22em .45em;margin:-.22em -.45em;line-height:1.25;box-decoration-break:clone;-webkit-box-decoration-break:clone;color:var(--accent-deep,#6E3540)}
.ls-desc{margin:0;max-width:310px;font-family:var(--font-cormorant),serif;font-variant-numeric:lining-nums;font-style:italic;font-weight:500;font-size:19px;line-height:1.6;color:var(--ink,#3D2A2D)}

.ls-hint{position:relative;z-index:1;display:inline-flex;align-items:center;justify-content:center;min-height:44px;min-width:44px;margin-top:10px;padding:8px 18px;
  border:0;background:none;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent;
  font-family:var(--font-cormorant),serif;font-weight:600;font-size:16px;letter-spacing:.26em;text-transform:uppercase;color:var(--accent-deep,#6E3540)}
.ls-hint span{animation:ls-hint 2.4s ease-in-out infinite}
@keyframes ls-hint{0%,100%{opacity:.62}50%{opacity:1}}
.ls-hint:focus-visible{outline:2px solid var(--accent,#B76E79);outline-offset:2px;border-radius:6px}

@media (prefers-reduced-motion:reduce){
  .ls-rain{display:none}
  .ls-body.ls-breathe,.ls-hint span{animation:none}
  .ls-flap{transition:none}
  .ls-sheen{display:none}
}
      `}</style>

      {/* degradados compartidos para los sobres de la lluvia */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="ls-rain-paper" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#FBF1EC" />
            <stop offset="100%" stopColor="#FFF9F6" />
          </linearGradient>
          <linearGradient id="ls-rg-flap" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8C4F59" />
            <stop offset="38%" stopColor="#B76E79" />
            <stop offset="58%" stopColor="#E9C9CD" />
            <stop offset="78%" stopColor="#B76E79" />
            <stop offset="100%" stopColor="#8C4F59" />
          </linearGradient>
          <linearGradient id="ls-rg-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8C4F59" />
            <stop offset="50%" stopColor="#B76E79" />
            <stop offset="100%" stopColor="#8C4F59" />
          </linearGradient>
        </defs>
      </svg>

      <div ref={rainRef} className="ls-rain" aria-hidden="true" />

      <div className="ls-stage">
        <p className="ls-eyebrow">{t.eyebrow}</p>
        <h2 className="ls-title foil-text">{t.title}</h2>
        <div className="ls-rule" aria-hidden="true"><i /><b /><i /></div>

        <button
          ref={envRef}
          type="button"
          className={`ls-env${open ? " is-open" : ""}`}
          aria-label={`${t.aria} — ${open ? t.cerrar : t.abrir}`}
          aria-expanded={open}
          aria-controls="ls-content"
          onClick={toggle}
        >
          <div ref={bodyRef} className={`ls-body${breathe ? " ls-breathe" : ""}`}>
            <svg className="ls-svg" viewBox="0 0 260 200" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="ls-paper" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F8ECE7" />
                  <stop offset="55%" stopColor="#FFF9F8" />
                  <stop offset="100%" stopColor="#FBF1EE" />
                </linearGradient>
                <linearGradient id="ls-edge" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8C4F59" />
                  <stop offset="30%" stopColor="#B76E79" />
                  <stop offset="52%" stopColor="#E9C9CD" />
                  <stop offset="74%" stopColor="#B76E79" />
                  <stop offset="100%" stopColor="#8C4F59" />
                </linearGradient>
              </defs>
              {/* sombra suave sin filtros */}
              <ellipse cx="130" cy="192" rx="104" ry="6" fill="rgba(110,53,64,.10)" />
              <rect x="18" y="52" width="224" height="132" rx="8" fill="url(#ls-paper)" stroke="url(#ls-edge)" strokeWidth="1.8" />
              <rect x="24" y="58" width="212" height="120" rx="5" fill="none" stroke="rgba(183,110,121,.28)" strokeWidth=".8" />
              <path d="M18 184 L130 110 L242 184" stroke="rgba(140,79,89,.32)" strokeWidth="1.1" fill="none" />
            </svg>

            <div className="ls-flap" aria-hidden="true">
              {/* cara exterior: rose gold metálico */}
              <svg viewBox="0 0 224 86" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="ls-flap-front" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8C4F59" />
                    <stop offset="22%" stopColor="#B76E79" />
                    <stop offset="44%" stopColor="#E9C9CD" />
                    <stop offset="58%" stopColor="#C98A93" />
                    <stop offset="80%" stopColor="#B76E79" />
                    <stop offset="100%" stopColor="#8C4F59" />
                  </linearGradient>
                </defs>
                <path d="M0 0 L112 86 L224 0 Z" fill="url(#ls-flap-front)" stroke="#8C4F59" strokeWidth="1.2" strokeLinejoin="round" />
                <path d="M10 3 L112 81 L214 3" fill="none" stroke="rgba(255,240,240,.45)" strokeWidth=".8" />
              </svg>
              {/* cara interior: forro de papel */}
              <svg className="ls-flap-back" viewBox="0 0 224 86" preserveAspectRatio="none">
                <path d="M0 0 L112 86 L224 0 Z" fill="#F6E4E2" stroke="url(#ls-edge)" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            </div>

            <svg className="ls-seal" viewBox="0 0 60 60" aria-hidden="true">
              <defs>
                <radialGradient id="ls-wax" cx="38%" cy="32%" r="70%">
                  <stop offset="0%" stopColor="#9A4B58" />
                  <stop offset="55%" stopColor="#6E3540" />
                  <stop offset="100%" stopColor="#4E222B" />
                </radialGradient>
              </defs>
              <circle cx="30" cy="30" r="28" fill="url(#ls-wax)" />
              <circle cx="30" cy="30" r="27.2" fill="none" stroke="url(#ls-edge)" strokeWidth="1.6" />
              <circle cx="30" cy="30" r="21.5" fill="none" stroke="#E9C9CD" strokeWidth=".9" opacity=".85" />
              <text
                x="30" y="36.5" textAnchor="middle"
                fontFamily="var(--font-cormorant), Georgia, serif" fontWeight="600" fontSize="18" letterSpacing="1"
                fill="#F3DADD"
              >
                MB
              </text>
            </svg>

            <span className="ls-sheenclip" aria-hidden="true">
              <span ref={sheenRef} className="ls-sheen" />
            </span>
          </div>

          <div id="ls-content" className="ls-content" aria-live="polite">
            <svg className="ls-mailbox" viewBox="0 0 52 52" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="8" y="22" width="36" height="24" rx="5" />
              <path d="M8 30 Q26 38 44 30" />
              <rect x="18" y="8" width="16" height="16" rx="2" />
              <path d="M18 8 Q26 3 34 8" />
              <rect x="20" y="28" width="12" height="2.5" rx="1.25" fill="currentColor" stroke="none" opacity=".4" />
            </svg>
            <p className="ls-gift foil-text">{t.regalo}</p>
            <p className="ls-desc">{t.buzon}</p>
          </div>
        </button>

        <button type="button" className="ls-hint" onClick={toggle} aria-controls="ls-content" aria-expanded={open}>
          <span>{open ? t.cerrar : t.abrir}</span>
        </button>
      </div>
    </section>
  );
}
