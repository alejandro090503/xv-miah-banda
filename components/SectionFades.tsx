"use client";
import { useEffect } from "react";
/* Fundido uniforme: cada frontera A→B pinta el color medio (smoothstep, 9 paradas) a ambos lados */
const rgb = (c: string): number[] => {
  const m = c.match(/[\d.]+/g)?.map(Number) || [255, 255, 255];
  return m.length >= 4 && m[3] === 0 ? [255, 255, 255] : m.slice(0, 3);
};
const hex = (h: string) => { const n = parseInt(h.replace("#", ""), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const grad = (c: number[], dir: string) => {
  const st = Array.from({ length: 9 }, (_, i) => {
    const t = i / 8; const a = 1 - t * t * (3 - 2 * t);
    return `rgba(${c.map(Math.round).join(",")},${a.toFixed(3)}) ${(t * 100).toFixed(1)}%`;
  });
  return `linear-gradient(${dir},${st.join(",")})`;
};
export default function SectionFades() {
  useEffect(() => {
    const run = () => {
      const secs = Array.from(document.querySelectorAll<HTMLElement>(".sec"));
      const edge = (el: HTMLElement, k: "top" | "bot") => { const d = el.dataset[k]; return d ? hex(d) : rgb(getComputedStyle(el).backgroundColor); };
      const mid = (a: number[], b: number[]) => a.map((v, j) => (v + b[j]) / 2);
      secs.forEach((el, i) => {
        const prev = secs[i - 1], next = secs[i + 1];
        const top = prev ? mid(edge(prev, "bot"), edge(el, "top")) : edge(el, "top");
        const bot = next ? mid(edge(el, "bot"), edge(next, "top")) : edge(el, "bot");
        el.style.setProperty("--gradT", grad(top, "to bottom"));
        el.style.setProperty("--gradB", grad(bot, "to top"));
        el.style.setProperty("--fh", el.dataset.fh || "170px");
        el.classList.add("sec-f");
      });
    };
    run(); const t = setTimeout(run, 800);
    const F: Record<string, number> = { hero: 0.06, top: -0.05, oval: 0.08, corner: -0.07, footer: 0.04 };
    let raf = 0;
    const par = () => {
      raf = 0; const vh = innerHeight;
      document.querySelectorAll<HTMLElement>(".ink-bg").forEach((w) => {
        const r = w.getBoundingClientRect(); if (r.bottom < -100 || r.top > vh + 100) return;
        const i = w.firstElementChild as HTMLElement | null;
        i?.style.setProperty("--py", ((r.top + r.height / 2 - vh / 2) * (F[w.dataset.k || ""] || 0.05)).toFixed(1) + "px");
      });
    };
    const onS = () => { if (!raf) raf = requestAnimationFrame(par); };
    addEventListener("scroll", onS, { passive: true }); par();
    return () => { clearTimeout(t); removeEventListener("scroll", onS); };
  }, []);
  return null;
}
