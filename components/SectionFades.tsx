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
    run(); const t = setTimeout(run, 800); return () => clearTimeout(t);
  }, []);
  return null;
}
