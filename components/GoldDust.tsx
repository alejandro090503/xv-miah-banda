"use client";
import { useEffect, useState } from "react";

/* Polvo flotante — overlay fijo sobre toda la invitación.
   Alterna los tres tonos del cliente con el dorado. Aparece al pasar el hero. */

const TONOS = [
  { core: "#f6e7b8", mid: "#B76E79", halo: "rgba(183,110,121,0.45)" },  // dorado
  { core: "#ffffff", mid: "#D9A3AA", halo: "rgba(217,163,170,0.55)" }, // lila
  { core: "#f2fbe9", mid: "#8C4F59", halo: "rgba(183,110,121,0.5)" },  // verde pastel
  { core: "#dff3cd", mid: "#B76E79", halo: "rgba(233,201,205,0.45)" },  // verde hoja
];

const DUST = [
  { l: "6%",  t: "8%",  s: 3, d: 0,   dur: 4.5 },
  { l: "18%", t: "16%", s: 2, d: 1.2, dur: 5.5 },
  { l: "31%", t: "6%",  s: 4, d: 0.6, dur: 4.0 },
  { l: "44%", t: "19%", s: 2, d: 2.0, dur: 6.0 },
  { l: "58%", t: "9%",  s: 3, d: 0.3, dur: 5.0 },
  { l: "71%", t: "14%", s: 2, d: 1.6, dur: 4.8 },
  { l: "85%", t: "7%",  s: 4, d: 0.9, dur: 5.2 },
  { l: "93%", t: "17%", s: 2, d: 2.4, dur: 4.3 },
  { l: "10%", t: "30%", s: 2, d: 1.0, dur: 5.8 },
  { l: "24%", t: "37%", s: 3, d: 0.4, dur: 4.6 },
  { l: "38%", t: "31%", s: 2, d: 2.2, dur: 6.2 },
  { l: "52%", t: "39%", s: 4, d: 0.7, dur: 4.1 },
  { l: "66%", t: "33%", s: 2, d: 1.5, dur: 5.4 },
  { l: "79%", t: "40%", s: 3, d: 0.2, dur: 4.9 },
  { l: "90%", t: "34%", s: 2, d: 1.9, dur: 5.6 },
  { l: "5%",  t: "52%", s: 3, d: 0.8, dur: 4.7 },
  { l: "20%", t: "59%", s: 2, d: 1.3, dur: 6.1 },
  { l: "35%", t: "54%", s: 4, d: 0.5, dur: 4.2 },
  { l: "49%", t: "61%", s: 2, d: 2.1, dur: 5.3 },
  { l: "63%", t: "55%", s: 3, d: 0.9, dur: 4.5 },
  { l: "77%", t: "62%", s: 2, d: 1.7, dur: 5.9 },
  { l: "88%", t: "56%", s: 3, d: 0.3, dur: 4.4 },
  { l: "12%", t: "72%", s: 2, d: 1.1, dur: 5.7 },
  { l: "27%", t: "79%", s: 4, d: 0.6, dur: 4.0 },
  { l: "42%", t: "74%", s: 2, d: 2.3, dur: 6.0 },
  { l: "56%", t: "81%", s: 3, d: 0.4, dur: 4.8 },
  { l: "70%", t: "76%", s: 2, d: 1.4, dur: 5.1 },
  { l: "83%", t: "82%", s: 4, d: 0.8, dur: 4.3 },
  { l: "94%", t: "77%", s: 2, d: 2.0, dur: 5.5 },
  { l: "8%",  t: "90%", s: 3, d: 0.5, dur: 4.6 },
  { l: "30%", t: "94%", s: 2, d: 1.8, dur: 6.2 },
  { l: "52%", t: "91%", s: 3, d: 0.7, dur: 4.9 },
  { l: "74%", t: "95%", s: 2, d: 1.2, dur: 5.4 },
  { l: "89%", t: "92%", s: 4, d: 0.3, dur: 4.1 },
];

export default function GoldDust() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // aparece tras pasar el header (hero ~ 100vh)
      setVisible(window.scrollY > window.innerHeight * 0.7);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 5,
        opacity: visible ? 1 : 0,
        transition: "opacity 1s ease",
      }}
    >
      {DUST.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: p.l,
            top: p.t,
            width: p.s,
            height: p.s,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${TONOS[i % TONOS.length].core} 0%, ${TONOS[i % TONOS.length].mid} 45%, transparent 75%)`,
            boxShadow: `0 0 6px 1px ${TONOS[i % TONOS.length].halo}`,
            animation: `dustTwinkle ${p.dur}s ${p.d}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}
