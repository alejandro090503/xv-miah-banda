"use client";
import { useEffect, useState } from "react";
import { useT, useLang } from "./i18n";

export const SECS = ["hero", "galeria", "familia", "contador", "lugar", "itinerario", "vestimenta", "regalos", "rsvp", "album"];

export default function Nav({ show, onLang }: { show: boolean; onLang: () => void }) {
  const t = useT();
  const lang = useLang();
  const [open, setOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);
  const go = (id: string) => {
    setOpen(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
  };
  return (
    <>
      <div className={`nav-wrap${show ? " on" : ""}`}>
        <button className="nav-btn" onClick={onLang} aria-label="Idioma / Language">{lang === "es" ? "ES" : "EN"}</button>
        <button className="nav-btn" onClick={() => setOpen(true)} aria-label={t.navMenu}>
          <svg width="20" height="14" viewBox="0 0 20 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M1 1.5h18M1 7h18M1 12.5h18" /></svg>
        </button>
      </div>
      <div className={`menu-ov${open ? " on" : ""}`} aria-hidden={!open}>
        <button className="menu-x" onClick={() => setOpen(false)} aria-label="Cerrar">×</button>
        <div className="menu-rule" />
        {SECS.map((id, i) => (
          <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); go(id); }}>{t.navSecs[i]}</a>
        ))}
        <div className="menu-rule" />
      </div>
    </>
  );
}
