"use client";
import { useT } from "./i18n";

interface VenueProps {
  type: string;
  name: string;
  address: string;
  time: string;
  mapsUrl: string;
}

function VenueCard({ type, name, address, time }: VenueProps) {
  const t = useT();
  return (
    <div className="lev glow-edge" style={{
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(165deg, rgba(233,201,205,0.20) 0%, rgba(255,249,248,0.72) 60%)",
      borderRadius: 28,
      border: "1px solid rgba(183,110,121,0.25)",
      boxShadow: "0 14px 40px rgba(110,53,64,0.14)",
    }}>
      {/* Haz dorado animado que recorre el borde */}
      <div className="venue-beam" aria-hidden="true" />

      <div style={{ padding: "34px 28px 0", textAlign: "center" }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          margin: "0 auto 16px",
          background: "rgba(217,163,170,0.16)",
          border: "1.5px solid rgba(183,110,121,0.55)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#8C4F59">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>

        <div style={{
          fontFamily: "var(--font-great-vibes), cursive",
          fontSize: 42, color: "#B76E79", lineHeight: 1.15, marginBottom: 10,
        }}>
          {type}
        </div>

        <div style={{
          fontFamily: "var(--font-cormorant), serif",
          fontWeight: 700, fontSize: 22, color: "var(--text)",
          letterSpacing: 0.5, lineHeight: 1.3, marginBottom: 8,
        }}>
          {name}
        </div>

        <div style={{
          fontFamily: "var(--font-lato), sans-serif",
          fontWeight: 500, fontSize: 16, color: "var(--text-soft)",
          letterSpacing: 0.3, lineHeight: 1.55, marginBottom: 8,
        }}>
          {address}
        </div>

        <div style={{
          fontFamily: "var(--font-lato), sans-serif",
          fontWeight: 700, fontSize: 20, color: "#8C4F59",
          letterSpacing: 3, marginBottom: 4,
        }}>
          {time}
        </div>

        <div style={{ width: 48, height: 1, margin: "18px auto 22px",
          background: "linear-gradient(90deg,transparent,#D9A3AA,transparent)", opacity: 0.55 }} />
      </div>

      <div style={{ height: 8 }} />
    </div>
  );
}

export default function Ubicacion() {
  const t = useT();
  return (
    <section style={{ padding: "64px 26px" }}>
      <p style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic", fontSize: 14, letterSpacing: 5,
        textTransform: "uppercase", color: "#B76E79",
        textAlign: "center", marginBottom: 8, opacity: 0.9, fontWeight: 600,
      }}>
        {t.ubiEyebrow}
      </p>
      <h2 style={{
        fontFamily: "var(--font-great-vibes), cursive",
        fontSize: 50, textAlign: "center", lineHeight: 1.1, marginBottom: 30,
        background: "var(--foil)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
      }}>
        {t.ubiTitle}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <VenueCard
          type={t.ubiTipo}
          name={t.porConfirmar}
          address="La Puente, CA"
          time="6:00 PM"
          mapsUrl=""
        />
      </div>
    </section>
  );
}
