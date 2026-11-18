"use client";
import { useEffect, useState } from "react";
import { useT } from "./i18n";

const QR = "/qr-album.png";
const ALBUM_URL = "/album";
/* Se habilita a las 00:00 del día del evento (30 ene 2027) */
const ABRE = new Date(2027, 0, 30, 0, 0, 0);

/* Álbum de fotos — QR al formulario y botón directo */
export default function AlbumQR() {
  const t = useT();
  const [bloqueado, setBloqueado] = useState(true);
  useEffect(() => {
    setBloqueado(Date.now() < ABRE.getTime());
  }, []);

  return (
    <section style={{ padding: "64px 26px", textAlign: "center" }}>
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: 14,
        letterSpacing: 5,
        textTransform: "uppercase",
        color: "#8C4F59",
        marginBottom: 8,
        opacity: 0.95,
      }}>
        {t.albumEyebrow}
      </p>
      <h2 style={{
        fontFamily: "var(--font-great-vibes), cursive",
        fontSize: 48,
        lineHeight: 1.25,
        marginBottom: 14,
        padding: "4px 20px 8px",
        background: "var(--foil)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "inline-block",
      }}>
        {t.albumTitulo}
      </h2>

      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic",
        fontWeight: 600,
        fontSize: 18,
        color: "var(--text-soft)",
        lineHeight: 1.65,
        letterSpacing: 0.4,
        maxWidth: 360,
        margin: "0 auto 30px",
      }}>
        {t.albumTexto}
      </p>

      {/* QR sobre lámina clara — el lector necesita el contraste */}
      <a
        href={ALBUM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.albumBtn}
        aria-disabled={bloqueado || undefined}
        onClick={(e) => { if (bloqueado) e.preventDefault(); }}
        style={{
          display: "inline-block",
          pointerEvents: bloqueado ? "none" : undefined,
          padding: 14,
          background: "#f7f2e8",
          border: "1px solid rgba(183,110,121,0.6)",
          borderRadius: 8,
          boxShadow: "0 14px 34px rgba(110,53,64,0.19)",
          lineHeight: 0,
        }}
      >
        <img
          src={QR}
          alt={t.albumTitulo}
          width={210}
          height={210}
          loading="lazy"
          style={{
            display: "block",
            width: 210,
            height: 210,
            filter: bloqueado ? "blur(7px)" : undefined,
            opacity: bloqueado ? 0.75 : 1,
          }}
        />
      </a>

      <div style={{ marginTop: 22 }}>
        <a
          href={ALBUM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={bloqueado || undefined}
          onClick={(e) => { if (bloqueado) e.preventDefault(); }}
          style={{
            display: "inline-block",
            pointerEvents: bloqueado ? "none" : undefined,
            opacity: bloqueado ? 0.45 : 1,
            padding: "14px 32px",
            background: "linear-gradient(135deg,#B76E79,#8C4F59)",
            color: "#fff",
            borderRadius: 30,
            fontFamily: "var(--font-lato), sans-serif",
            fontSize: 14,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: 3,
            textDecoration: "none",
            boxShadow: "0 4px 16px rgba(110,53,64,0.15)",
          }}
        >
          {t.albumBtn}
        </a>
      </div>

      {bloqueado && (
        <p style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: 17,
          lineHeight: 1.55,
          color: "#6E3540",
          maxWidth: 340,
          margin: "20px auto 0",
        }}>
          {t.albumAviso}
        </p>
      )}
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontWeight: 600,
        fontSize: 15,
        color: "var(--text-soft)",
        margin: "10px auto 0",
      }}>
        {t.albumHint}
      </p>
    </section>
  );
}
