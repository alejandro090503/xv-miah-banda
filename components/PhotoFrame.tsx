"use client";
import { PHOTOS } from "./photos";

interface Props {
  /** Cuál foto mostrar — "framed" (default, arco) o "framed2" (jardín) */
  variant?: "framed" | "framed2";
  /** Seed del ruido del borde rasgado — distinto por variante para que no se vean idénticos */
  seed?: number;
}

/* Foto enmarcada con bordes de papel rasgado (deckle).
   El filtro SVG SOLO afecta a la capa de papel beige, no a la imagen. */
export default function PhotoFrame({ variant = "framed", seed = 7 }: Props) {
  const photo = PHOTOS[variant];
  const hasPhoto = !!photo;
  const filterId = `paper-edge-${variant}`;

  return (
    <section style={{ padding: "56px 26px 40px", display: "flex", justifyContent: "center" }}>
      {/* Filtro SVG aplicado SOLO al papel — no toca la imagen */}
      

      <div className={variant === "framed2" ? "lev" : "lev2"} style={{
        position: "relative",
        width: "min(300px, 80vw)",
        filter: "drop-shadow(0 14px 28px rgba(110,53,64,0.22))",
      }}>
        {/* Marco rasgado de fondo — solo color, con el filtro de bordes irregulares */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg,#FFF9F8,#F4E1E3)",
            boxShadow: "0 0 0 1px rgba(183,110,121,.35)",
          }}
        />

        {/* Imagen encima del papel — SIN filtro, bordes rectos limpios */}
        <div style={{
          position: "relative",
          margin: 14,
          aspectRatio: "9 / 14",
          overflow: "hidden",
          background: hasPhoto
            ? "transparent"
            : "linear-gradient(160deg, #FFF9F8 0%, #E9C9CD 45%, #FBF4F3 100%)",
          backgroundImage: hasPhoto ? `url("${photo}")` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {!hasPhoto && (
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="rgba(183,110,121,0.55)" strokeWidth="0.8" aria-hidden="true">
              <path d="M12 3 C12 8, 8 10, 6 12 C8 14, 12 16, 12 21 C12 16, 16 14, 18 12 C16 10, 12 8, 12 3 Z" />
              <circle cx="12" cy="12" r="1.6" fill="rgba(183,110,121,0.55)" stroke="none" />
            </svg>
          )}
        </div>
      </div>
    </section>
  );
}
