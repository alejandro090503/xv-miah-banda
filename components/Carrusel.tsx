"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "./i18n";
import { GALLERY } from "./photos";

/* ══════════════════════════════════════════════════════════════
   CARRUSEL 3D — rueda de boda-veronica-y-andres, en rose gold.
   · giro automático continuo con gsap.ticker
   · arrastre con inercia que vuelve sola al giro automático
   · se pausa fuera de pantalla (IntersectionObserver)
   · tocar (sin arrastrar) abre el lightbox
   · reflejo = div volteado + velo blanco (nada de -webkit-box-reflect)
   ══════════════════════════════════════════════════════════════ */

const DICT = {
  es: {
    eyebrow: "Momentos",
    hint: "Arrastra para girar",
    open: "Ver foto",
    close: "Cerrar",
    prev: "Foto anterior",
    next: "Foto siguiente",
    alt: [
      "Miah con su ramo de rosas bajo la pérgola",
      "Miah mirando por encima del hombro",
      "Miah sentada bajo el gran árbol",
      "Miah sonriendo con su corona y su ramo",
      "Miah de perfil en el jardín de rosas",
      "Miah con su tuba en el jardín",
      "Retrato de Miah con su ramo",
      "Miah de espaldas en la escalinata",
    ],
  },
  en: {
    eyebrow: "Moments",
    hint: "Drag to spin",
    open: "View photo",
    close: "Close",
    prev: "Previous photo",
    next: "Next photo",
    alt: [
      "Miah holding her rose bouquet under the pergola",
      "Miah looking over her shoulder",
      "Miah seated beneath the great tree",
      "Miah smiling with her tiara and bouquet",
      "Miah in profile in the rose garden",
      "Miah with her tuba in the garden",
      "Portrait of Miah with her bouquet",
      "Miah from behind on the stone steps",
    ],
  },
};

/* Encuadre por foto (revisado a ojo con el recorte real de la tarjeta, 0.71:1).
   Las verticales (2:3) casi no se recortan; las horizontales (#2 y #7) solo
   enseñan ~47% del ancho, centrado en Miah. */
const POS = [
  "50% 30%", // 0 · ramo frente a la cara, pérgola
  "56% 28%", // 1 · de espaldas mirando a cámara
  "51% 55%", // 2 · horizontal, sentada bajo el árbol
  "56% 30%", // 3 · sonriendo con ramo
  "47% 58%", // 4 · de perfil, cuerpo completo
  "50% 58%", // 5 · con la tuba
  "50% 32%", // 6 · retrato con ramo
  "52% 55%", // 7 · horizontal, de espaldas en la escalinata
];

const FOTOS = GALLERY.slice(0, 8).map((src, i) => ({ src, pos: POS[i] ?? "50% 40%" }));

export default function Carrusel() {
  const lang = useLang();
  const t = DICT[lang] ?? DICT.es;

  const secRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [lb, setLb] = useState<number | null>(null);

  /* ── rueda: geometría + giro + arrastre ── */
  useEffect(() => {
    const stage = stageRef.current;
    const ring = ringRef.current;
    const sec = secRef.current;
    if (!stage || !ring || !sec) return;

    const cards = Array.from(ring.querySelectorAll<HTMLElement>(".c3-card"));
    const n = cards.length;
    if (!n) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const AUTO = reduce ? 0 : 0.11; // grados por frame a 60fps
    let radius = 250;
    let rot = 0;
    let vel = AUTO;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startRot = 0;
    let lastX = 0;
    let lastT = 0;
    let moved = 0;
    let downAt = 0;
    let downIndex = -1;
    let visible = false;
    let alive = true;
    let tickerOn = false;
    let gsapRef: typeof import("gsap").gsap | null = null;

    const layout = () => {
      const w = stage.clientWidth || 380;
      const cw = Math.round(Math.min(172, Math.max(128, w * 0.42)));
      const ch = Math.round(cw * 1.41);
      radius = Math.round(cw * 1.46);
      stage.style.setProperty("--c3-cw", `${cw}px`);
      stage.style.setProperty("--c3-ch", `${ch}px`);
      cards.forEach((c, i) => {
        c.style.transform = `rotateY(${(360 / n) * i}deg) translateZ(${radius}px)`;
      });
      apply();
    };
    const apply = () => {
      ring.style.transform = `translateZ(${-radius}px) rotateY(${rot}deg)`;
    };

    const tick = (_t: number, _dt: number, _f: number) => {
      const ratio = gsapRef ? gsapRef.ticker.deltaRatio(60) : 1;
      if (!dragging) {
        // inercia que se va fundiendo de vuelta al giro automático
        vel += (AUTO - vel) * Math.min(1, 0.045 * ratio);
        rot += vel * ratio;
        apply();
      }
    };
    const startTicker = () => {
      if (!gsapRef || tickerOn || !visible) return;
      gsapRef.ticker.add(tick);
      tickerOn = true;
    };
    const stopTicker = () => {
      if (!gsapRef || !tickerOn) return;
      gsapRef.ticker.remove(tick);
      tickerOn = false;
    };

    /* pointer events (mouse + touch + pen) */
    const onDown = (e: PointerEvent) => {
      if (e.button !== undefined && e.button > 0) return;
      dragging = true;
      startX = lastX = e.clientX;
      startY = e.clientY;
      startRot = rot;
      lastT = performance.now();
      downAt = lastT;
      moved = 0;
      vel = 0;
      const card = (e.target as HTMLElement).closest<HTMLElement>(".c3-card");
      downIndex = card ? Number(card.dataset.i) : -1;
      stage.classList.add("is-drag");
      try { stage.setPointerCapture(e.pointerId); } catch { /* noop */ }
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx), Math.abs(e.clientY - startY));
      rot = startRot + dx * 0.42;
      const dt = Math.max(1, now - lastT);
      vel = ((e.clientX - lastX) * 0.42 * 16.7) / dt; // grados por frame
      vel = Math.max(-9, Math.min(9, vel));
      lastX = e.clientX;
      lastT = now;
      apply();
    };
    const onCancel = (e: PointerEvent) => {
      downIndex = -1; // el navegador tomó el gesto (scroll): nunca es un toque
      onUp(e);
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove("is-drag");
      try { stage.releasePointerCapture(e.pointerId); } catch { /* noop */ }
      const quick = performance.now() - downAt < 450;
      if (moved < 7 && quick && downIndex >= 0) {
        vel = AUTO;
        setLb(downIndex);
      }
      if (performance.now() - lastT > 90) vel = AUTO * Math.sign(vel || 1);
    };
    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onCancel);

    /* teclado: Enter/espacio en una tarjeta abre el lightbox */
    const onKey = (e: KeyboardEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(".c3-card");
      if (!card) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setLb(Number(card.dataset.i));
      }
    };
    ring.addEventListener("keydown", onKey);

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(stage);

    /* reveal de fotos al entrar (si nunca dispara, quedan visibles) */
    let revealed = false;
    const reveal = () => {
      if (revealed || reduce || !gsapRef) return;
      revealed = true;
      const faces = cards.map((c) => c.querySelector<HTMLElement>(".c3-face")).filter(Boolean) as HTMLElement[];
      gsapRef.fromTo(
        faces,
        { clipPath: "inset(100% 0% 0% 0% round 14px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 14px)",
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.07,
          clearProps: "clipPath",
        }
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((en) => en.isIntersecting);
        if (visible) {
          startTicker();
          reveal();
        } else stopTicker();
      },
      { threshold: 0.12 }
    );
    io.observe(sec);

    import("gsap").then((mod) => {
      if (!alive) return;
      gsapRef = mod.gsap || mod.default;
      startTicker();
    });

    return () => {
      alive = false;
      stopTicker();
      io.disconnect();
      ro.disconnect();
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onCancel);
      ring.removeEventListener("keydown", onKey);
    };
  }, []);

  /* ── lightbox: teclado + bloqueo de scroll ── */
  const close = useCallback(() => setLb(null), []);
  const step = useCallback((d: number) => {
    setLb((cur) => (cur === null ? cur : (cur + d + FOTOS.length) % FOTOS.length));
  }, []);
  useEffect(() => {
    if (lb === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [lb, close, step]);

  return (
    <section ref={secRef} className="c3-sec" aria-label={t.eyebrow}>
      <style>{CSS}</style>

      <div className="c3-head">
        <p className="c3-eyebrow">{t.eyebrow}</p>
        <h2 className="c3-title">
          <span className="foil-text c3-foil">Miah Alana</span>
        </h2>
        <span className="c3-rule" aria-hidden="true">
          <i />
          <b />
          <i />
        </span>
      </div>

      <div ref={stageRef} className="c3-stage">
        <div ref={ringRef} className="c3-ring">
          {FOTOS.map((f, i) => (
            <div
              key={f.src}
              className="c3-card"
              data-i={i}
              role="button"
              tabIndex={0}
              aria-label={`${t.open}: ${t.alt[i] ?? ""}`}
            >
              <div className="c3-face">
                <img src={f.src} alt={t.alt[i] ?? ""} draggable={false} decoding="async" style={{ objectPosition: f.pos }} />
                <span className="c3-shine" aria-hidden="true" />
              </div>
              <div className="c3-refl" aria-hidden="true">
                <img src={f.src} alt="" draggable={false} decoding="async" style={{ objectPosition: f.pos }} />
                <span className="c3-veil" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="c3-hint">
        <svg width="22" height="12" viewBox="0 0 22 12" fill="none" aria-hidden="true">
          <path d="M5 1 1 6l4 5M17 1l4 5-4 5M1 6h20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t.hint}
      </p>

      {lb !== null && (
        <div className="c3-lb" role="dialog" aria-modal="true" aria-label={t.alt[lb]} onClick={close}>
          <button type="button" className="c3-lb-x" aria-label={t.close} onClick={close}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            className="c3-lb-nav c3-lb-prev"
            aria-label={t.prev}
            onClick={(e) => { e.stopPropagation(); step(-1); }}
          >
            ‹
          </button>
          <figure className="c3-lb-fig" onClick={(e) => e.stopPropagation()}>
            <img key={lb} src={FOTOS[lb].src} alt={t.alt[lb] ?? ""} />
          </figure>
          <button
            type="button"
            className="c3-lb-nav c3-lb-next"
            aria-label={t.next}
            onClick={(e) => { e.stopPropagation(); step(1); }}
          >
            ›
          </button>
          <p className="c3-lb-count">
            {lb + 1} / {FOTOS.length}
          </p>
        </div>
      )}
    </section>
  );
}

const CSS = `
.c3-sec{position:relative;background:transparent;padding:76px 0 64px;text-align:center;overflow:hidden}
.c3-head{max-width:430px;margin:0 auto;padding:0 16px}
.c3-eyebrow{font-family:var(--font-cormorant),serif;font-variant-numeric:lining-nums;font-weight:600;font-size:16px;letter-spacing:.32em;text-transform:uppercase;color:var(--gold-deep,#8C4F59);margin:0 0 6px}
.c3-title{margin:0;font-weight:400;line-height:1.25}
.c3-foil{display:inline-block;font-family:var(--font-great-vibes),cursive;font-size:clamp(46px,13vw,62px);
  padding:.22em .45em;margin:-.22em -.45em;line-height:1.25;
  box-decoration-break:clone;-webkit-box-decoration-break:clone}
.c3-rule{display:flex;align-items:center;justify-content:center;gap:10px;margin:14px auto 0}
.c3-rule i{display:block;width:64px;height:1px;background:linear-gradient(90deg,transparent,var(--gold,#B76E79),transparent)}
.c3-rule b{display:block;width:7px;height:7px;transform:rotate(45deg);background:linear-gradient(135deg,var(--gold-soft,#D9A3AA),var(--accent-deep,#6E3540))}

.c3-stage{position:relative;max-width:430px;height:calc(var(--c3-ch,242px) * 1.62);margin:26px auto 0;
  perspective:1100px;perspective-origin:50% 38%;cursor:grab;touch-action:pan-y;user-select:none;-webkit-user-select:none;
  --c3-cw:172px;--c3-ch:242px}
.c3-stage.is-drag{cursor:grabbing}
.c3-ring{position:absolute;left:50%;top:calc(var(--c3-ch) * .12);width:0;height:0;transform-style:preserve-3d;will-change:transform}
.c3-card{position:absolute;left:calc(var(--c3-cw) / -2);top:0;width:var(--c3-cw);height:var(--c3-ch);
  backface-visibility:hidden;-webkit-backface-visibility:hidden;outline:none;-webkit-tap-highlight-color:transparent}
.c3-card:focus-visible .c3-face{box-shadow:0 0 0 3px var(--paper,#FFF9F8),0 0 0 5px var(--accent,#B76E79)}
.c3-face{position:relative;width:100%;height:100%;border-radius:14px;overflow:hidden;
  background:var(--surface,#FBF4F3);
  border:1.5px solid transparent;
  background-image:linear-gradient(var(--surface,#FBF4F3),var(--surface,#FBF4F3)),
    linear-gradient(135deg,#F3D3D6 0%,#B76E79 30%,#E9C9CD 52%,#8C4F59 78%,#D9A3AA 100%);
  background-origin:border-box;background-clip:padding-box,border-box;
  box-shadow:0 14px 30px rgba(110,53,64,.20),0 2px 6px rgba(110,53,64,.12)}
.c3-face img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;border-radius:12.5px}
.c3-shine{position:absolute;inset:0;border-radius:12.5px;pointer-events:none;
  background:linear-gradient(160deg,rgba(255,255,255,.22) 0%,rgba(255,255,255,0) 38%,rgba(255,255,255,0) 70%,rgba(255,255,255,.10) 100%)}

/* reflejo: caja volteada que enseña la parte baja de la foto, con velo del fondo */
.c3-refl{position:absolute;left:0;right:0;top:calc(100% + 6px);height:38%;overflow:hidden;border-radius:14px;
  transform:scaleY(-1);pointer-events:none;opacity:.55}
.c3-refl img{position:absolute;left:0;bottom:0;width:100%;height:calc(100% / .38);object-fit:cover;display:block}
.c3-veil{position:absolute;inset:0;background:linear-gradient(to top,rgba(255,255,255,.35) 0%,var(--bg,#FFFFFF) 78%)}

.c3-hint{display:inline-flex;align-items:center;gap:10px;margin:2px auto 0;font-family:var(--font-cormorant),serif;
  font-style:italic;font-weight:600;font-size:17px;letter-spacing:.06em;color:var(--ink-soft,#6B5357)}
.c3-hint svg{color:var(--gold,#B76E79)}

.c3-lb{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;
  background:rgba(61,42,45,.88);padding:56px 16px;animation:c3-fade .28s ease both}
.c3-lb-fig{margin:0;max-width:min(430px,100%);max-height:100%;display:flex}
.c3-lb-fig img{max-width:100%;max-height:calc(100vh - 140px);max-height:calc(100dvh - 140px);object-fit:contain;border-radius:12px;
  border:1.5px solid rgba(233,201,205,.7);box-shadow:0 20px 60px rgba(0,0,0,.35);animation:c3-pop .32s ease both}
.c3-lb-x{position:absolute;top:14px;right:14px;width:46px;height:46px;border-radius:50%;display:grid;place-items:center;
  background:rgba(255,249,248,.95);color:var(--accent-deep,#6E3540);border:1px solid var(--accent-soft,#E9C9CD);cursor:pointer}
.c3-lb-nav{position:absolute;top:50%;margin-top:-23px;width:46px;height:46px;border-radius:50%;cursor:pointer;
  background:rgba(255,249,248,.9);color:var(--accent-deep,#6E3540);border:1px solid var(--accent-soft,#E9C9CD);
  font-family:var(--font-cormorant),serif;font-size:30px;line-height:1;display:grid;place-items:center;padding-bottom:4px;z-index:2}
.c3-lb-prev{left:10px}.c3-lb-next{right:10px}
.c3-lb-count{position:absolute;bottom:16px;left:0;right:0;margin:0;font-family:var(--font-cormorant),serif;
  font-variant-numeric:lining-nums;font-weight:600;font-size:16px;letter-spacing:.2em;color:#FFF9F8}
@keyframes c3-fade{from{opacity:0}to{opacity:1}}
@keyframes c3-pop{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
@media (prefers-reduced-motion:reduce){.c3-lb,.c3-lb-fig img{animation:none}}
`;
