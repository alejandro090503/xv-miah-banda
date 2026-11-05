"use client";
import type { CSSProperties } from "react";
import { useLang } from "./i18n";

/* ── Textos locales (no viven en i18n.tsx) ── */
const TXT = {
  es: {
    eyebrow: "Código de vestimenta",
    title: "Dress Code",
    caballeros: "Caballeros",
    damas: "Damas",
    altCab: "Caballero con traje formal",
    altDam: "Dama con vestido largo formal",
    codigo: "Formal",
    nota: "Te pedimos vestir de etiqueta formal.",
    sugeridos: "Colores sugeridos",
    evitar: "Colores a evitar",
  },
  en: {
    eyebrow: "Dress code",
    title: "Dress Code",
    caballeros: "Gentlemen",
    damas: "Ladies",
    altCab: "Gentleman in a formal suit",
    altDam: "Lady in a formal long gown",
    codigo: "Formal",
    nota: "We kindly ask for formal attire.",
    sugeridos: "Suggested colors",
    evitar: "Colors to avoid",
  },
} as const;

type Color = { hex: string; es: string; en: string };

/* El cliente NO dio colores sugeridos ni a evitar → arrays vacíos.
   Si algún día los manda, basta con llenarlos: la fila aparece sola. */
const SUGERIDOS: Color[] = [];
const EVITAR: Color[] = [];

const HOLD = 2.5; // s por color
const FADE = 1.2; // s de fundido

/* Una bolita que va pasando de color con fundido (capas apiladas, solo opacity) */
function ColorOrb({ colors, lang, label }: { colors: Color[]; lang: "es" | "en"; label: string }) {
  const n = colors.length;
  const total = n * HOLD;
  const kf = `dc-cycle-${n}`;
  const f = ((FADE / total) * 100).toFixed(3);
  const h = ((HOLD / total) * 100).toFixed(3);
  const hf = (((HOLD + FADE) / total) * 100).toFixed(3);
  const layer = (i: number): CSSProperties =>
    n > 1
      ? {
          opacity: i === 0 ? 1 : 0,
          animation: `${kf} ${total}s ease-in-out ${i * HOLD - FADE}s infinite`,
        }
      : { opacity: 1 };

  return (
    <div className="dc-colgroup">
      <p className="dc-collabel">{label}</p>
      {n > 1 && (
        <style>{`@keyframes ${kf}{0%{opacity:0}${f}%{opacity:1}${h}%{opacity:1}${hf}%{opacity:0}100%{opacity:0}}`}</style>
      )}

      {/* animada */}
      <div className="dc-orbwrap dc-anim">
        <div className="dc-orb" role="img" aria-label={`${label}: ${colors.map((c) => c[lang]).join(", ")}`}>
          <span className="dc-orb-glow" aria-hidden="true" />
          {colors.map((c, i) => (
            <span
              key={c.hex + i}
              className="dc-orb-layer"
              aria-hidden="true"
              style={{
                ...layer(i),
                background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,.55) 0%, ${c.hex} 34%, ${c.hex} 62%, rgba(61,42,45,.42) 100%)`,
              }}
            />
          ))}
          <span className="dc-orb-sweep" aria-hidden="true" />
        </div>
        <div className="dc-orb-names" aria-hidden="true">
          {colors.map((c, i) => (
            <span key={c.hex + i} className="dc-orb-name" style={layer(i)}>
              {c[lang]}
            </span>
          ))}
        </div>
      </div>

      {/* prefers-reduced-motion: fila de bolitas pequeñas con nombre */}
      <ul className="dc-dots dc-static">
        {colors.map((c, i) => (
          <li key={c.hex + i}>
            <span className="dc-dot" style={{ background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,.5) 0%, ${c.hex} 40%, ${c.hex} 70%, rgba(61,42,45,.4) 100%)` }} />
            <span className="dc-dot-name">{c[lang]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DressCode() {
  const lang = useLang();
  const t = TXT[lang] ?? TXT.es;

  return (
    <section className="dc-sec" aria-label={t.eyebrow}>
      <style>{`
.dc-sec{position:relative;background:transparent;padding:68px 22px 64px;text-align:center}
.dc-eyebrow{font-family:var(--font-cormorant),serif;font-variant-numeric:lining-nums;font-weight:600;font-size:16px;letter-spacing:.32em;text-transform:uppercase;color:var(--accent-deep,#6E3540);margin:0 0 6px}
.dc-title{display:inline-block;font-family:var(--font-great-vibes),cursive;font-weight:400;font-size:clamp(48px,14vw,58px);margin:0 0 6px;
  padding:.22em .45em;margin-left:-.45em;margin-right:-.45em;margin-top:-.22em;line-height:1.25;box-decoration-break:clone;-webkit-box-decoration-break:clone;
  color:var(--accent-deep,#6E3540)}
.dc-rule{display:flex;align-items:center;justify-content:center;gap:10px;margin:2px auto 26px;max-width:220px}
.dc-rule i{flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--gold-soft,#D9A3AA),transparent)}
.dc-rule b{width:7px;height:7px;transform:rotate(45deg);background:linear-gradient(135deg,var(--gold-deep,#8C4F59),var(--accent,#B76E79) 55%,var(--accent-soft,#E9C9CD));}

.dc-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;max-width:360px;margin:0 auto;align-items:end}
.dc-fig{display:flex;flex-direction:column;align-items:center;margin:0}
.dc-figstage{position:relative;height:250px;width:100%;display:flex;align-items:flex-end;justify-content:center}
.dc-figstage img{position:relative;z-index:1;height:236px;width:auto;max-width:100%;object-fit:contain;display:block;
  transform-origin:50% 100%;animation:dc-levitate 6.5s ease-in-out infinite}
.dc-fig--cab img{animation-delay:-2.2s}
.dc-fig--dam img{animation-delay:-4.1s}
.dc-shadow{position:absolute;left:50%;bottom:-4px;width:62%;height:12px;transform:translateX(-50%);border-radius:50%;
  background:radial-gradient(ellipse at center,rgba(110,53,64,.20) 0%,rgba(110,53,64,.08) 45%,transparent 72%)}
@keyframes dc-levitate{
  0%,100%{transform:translateY(0) rotate(0deg)}
  25%{transform:translateY(-5px) rotate(.6deg)}
  50%{transform:translateY(-9px) rotate(0deg)}
  75%{transform:translateY(-5px) rotate(-.6deg)}
}
.dc-figlabel{margin-top:16px;font-family:var(--font-cormorant),serif;font-style:italic;font-weight:600;font-size:21px;letter-spacing:.04em;color:var(--ink,#3D2A2D)}

.dc-code{margin:30px 0 0;font-family:var(--font-cormorant),serif;font-variant-numeric:lining-nums;font-weight:700;font-size:26px;letter-spacing:.42em;text-indent:.42em;text-transform:uppercase;
  background:linear-gradient(100deg,var(--accent-deep,#6E3540) 0%,var(--gold-deep,#8C4F59) 42%,#A5616C 52%,var(--gold-deep,#8C4F59) 62%,var(--accent-deep,#6E3540) 100%);
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:var(--accent-deep,#6E3540)}
.dc-note{margin:10px auto 0;max-width:300px;font-family:var(--font-cormorant),serif;font-style:italic;font-weight:500;font-size:19px;line-height:1.55;color:var(--ink-soft,#6B5357)}

/* ── bolitas de color (solo si hay colores) ── */
.dc-colors{display:flex;justify-content:center;gap:34px;flex-wrap:wrap;margin:34px auto 0;max-width:360px}
.dc-colgroup{display:flex;flex-direction:column;align-items:center;min-width:120px}
.dc-collabel{margin:0 0 14px;font-family:var(--font-cormorant),serif;font-weight:600;font-size:16px;letter-spacing:.2em;text-transform:uppercase;color:var(--accent-deep,#6E3540)}
.dc-orbwrap{display:flex;flex-direction:column;align-items:center}
.dc-orb{position:relative;width:64px;height:64px;border-radius:50%;
  box-shadow:0 0 0 1.5px var(--gold-soft,#D9A3AA),0 0 0 4px rgba(255,255,255,.9),0 0 0 5px var(--hair,rgba(183,110,121,.35)),0 6px 16px rgba(110,53,64,.18)}
.dc-orb-layer{position:absolute;inset:0;border-radius:50%}
.dc-orb-glow{position:absolute;inset:-10px;border-radius:50%;background:radial-gradient(circle,rgba(183,110,121,.38) 0%,rgba(183,110,121,.12) 50%,transparent 70%);animation:dc-glow 3.2s ease-in-out infinite}
@keyframes dc-glow{0%,100%{opacity:.35;transform:scale(.94)}50%{opacity:1;transform:scale(1.04)}}
.dc-orb-sweep{position:absolute;inset:0;border-radius:50%;overflow:hidden}
.dc-orb-sweep::after{content:"";position:absolute;top:-20%;left:-60%;width:45%;height:140%;transform:translateX(0) rotate(25deg);
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);animation:dc-sweep 4.2s ease-in-out infinite}
@keyframes dc-sweep{0%,55%{transform:translateX(0) rotate(25deg)}85%,100%{transform:translateX(330%) rotate(25deg)}}
.dc-orb-names{position:relative;height:28px;width:150px;margin-top:12px}
.dc-orb-name{position:absolute;inset:0;font-family:var(--font-cormorant),serif;font-style:italic;font-weight:600;font-size:18px;color:var(--ink,#3D2A2D)}
.dc-dots{display:none;list-style:none;margin:0;padding:0;flex-wrap:wrap;justify-content:center;gap:12px 16px}
.dc-dots li{display:flex;flex-direction:column;align-items:center;gap:6px}
.dc-dot{width:28px;height:28px;border-radius:50%;box-shadow:0 0 0 1px var(--gold-soft,#D9A3AA),0 2px 6px rgba(110,53,64,.15)}
.dc-dot-name{font-family:var(--font-cormorant),serif;font-weight:600;font-size:16px;color:var(--ink,#3D2A2D)}

@media (prefers-reduced-motion:reduce){
  .dc-figstage img{animation:none}
  .dc-anim{display:none}
  .dc-dots{display:flex}
}
      `}</style>

      <p className="dc-eyebrow">{t.eyebrow}</p>
      <h2 className="dc-title foil-text">{t.title}</h2>
      <div className="dc-rule" aria-hidden="true"><i /><b /><i /></div>

      <div className="dc-grid">
        <figure className="dc-fig dc-fig--cab">
          <div className="dc-figstage">
            <span className="dc-shadow" aria-hidden="true" />
            <img src="/caballero.png" alt={t.altCab} width={300} height={610} loading="lazy" decoding="async" />
          </div>
          <figcaption className="dc-figlabel">{t.caballeros}</figcaption>
        </figure>
        <figure className="dc-fig dc-fig--dam">
          <div className="dc-figstage">
            <span className="dc-shadow" aria-hidden="true" />
            <img src="/dama.png" alt={t.altDam} width={248} height={604} loading="lazy" decoding="async" />
          </div>
          <figcaption className="dc-figlabel">{t.damas}</figcaption>
        </figure>
      </div>

      <p className="dc-code">{t.codigo}</p>
      <p className="dc-note">{t.nota}</p>

      {(SUGERIDOS.length > 0 || EVITAR.length > 0) && (
        <div className="dc-colors">
          {SUGERIDOS.length > 0 && <ColorOrb colors={SUGERIDOS} lang={lang} label={t.sugeridos} />}
          {EVITAR.length > 0 && <ColorOrb colors={EVITAR} lang={lang} label={t.evitar} />}
        </div>
      )}
    </section>
  );
}
