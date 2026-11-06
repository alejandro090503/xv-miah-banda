"use client";
import { useState, useRef } from "react";
import Nav from "./Nav";
import SectionFades from "./SectionFades";
import SplashScreen from "./SplashScreen";
import Hero from "./Hero";
import CountdownTimer from "./CountdownTimer";
import Ubicacion from "./Ubicacion";
import Itinerario from "./Itinerario";
import CalendarioBtn from "./CalendarioBtn";
import DressCode from "./DressCode";
import Familia from "./Familia";
import MesaRegalos from "./MesaRegalos";
import SoloAdultos from "./SoloAdultos";
import AlbumQR from "./AlbumQR";
import PhotoFrame from "./PhotoFrame";
import RSVPSection from "./RSVPSection";
import Carrusel from "./Carrusel";
import ClosingPhoto from "./ClosingPhoto";
import Footer from "./Footer";
import MusicFab, { type MusicFabHandle } from "./MusicFab";
import GoldDust from "./GoldDust";
import ScrollReveal from "./ScrollReveal";
import LangGate from "./LangGate";
import MensajeIntro from "./MensajeIntro";
import { LangProvider, useT, type Lang } from "./i18n";

function Sec({ id, ink, flip, children, bot, top, fh }: { id?: string; ink?: string; flip?: boolean; children: React.ReactNode; bot?: string; top?: string; fh?: string }) {
  return (
    <div id={id} className="sec" data-top={top} data-bot={bot} data-fh={fh} style={{ background: "#fff" }}>
      {ink && <div className={`ink-bg${flip ? " flip" : ""}`} data-k={ink} aria-hidden><i style={{ backgroundImage: `url(/ink/ink-${ink}.webp)` }} /></div>}
      {children}
    </div>
  );
}

export default function InvitacionClient() {
  const [contentVisible, setContentVisible] = useState(false);
  const [splashMounted, setSplashMounted] = useState(true);
  const [lang, setLang] = useState<Lang | null>(null);
  const [askLang, setAskLang] = useState(false);
  const [intro, setIntro] = useState(false);
  const musicRef = useRef<MusicFabHandle>(null);

  // Al tocar el sobre (gesto del usuario) → arranca la música
  const handleStart = () => {
    musicRef.current?.play();
  };

  // Al terminar el video del sobre → pregunta el idioma
  const handleReveal = () => {
    setAskLang(true);
    setSplashMounted(false);
  };

  // Idioma elegido → mensaje de bienvenida a pantalla completa
  const handleLang = (l: Lang) => {
    setLang(l);
    setAskLang(false);
    setIntro(true);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Termina el mensaje → revela la invitación
  const handleIntroDone = () => {
    setIntro(false);
    setContentVisible(true);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <LangProvider value={lang ?? "es"}>
      {splashMounted && <SplashScreen onStart={handleStart} onOpen={handleReveal} />}
      {askLang && <LangGate onPick={handleLang} />}
      {intro && <MensajeIntro onDone={handleIntroDone} />}

      <div
        style={{
          opacity: contentVisible ? 1 : 0,
          transition: "opacity 0.85s ease",
          maxWidth: 430,
          margin: "0 auto",
          position: "relative",
          overflowX: "clip",
          zIndex: 1,
          background: "#fff",
        }}
      >
        <Hero />
        <Sec id="galeria" ink="top"><ScrollReveal><Carrusel /></ScrollReveal></Sec>
        <Sec id="familia" ink="corner" flip><ScrollReveal><Familia /></ScrollReveal></Sec>
        <Sec><ScrollReveal><PhotoFrame variant="framed2" /></ScrollReveal></Sec>
        <Sec id="contador" ink="footer"><ScrollReveal><CountdownTimer /></ScrollReveal></Sec>
        <Sec id="lugar" ink="oval"><ScrollReveal><Ubicacion /></ScrollReveal></Sec>
        <Sec id="itinerario" ink="hero" flip><Itinerario /><ScrollReveal><CalendarioBtn /></ScrollReveal></Sec>
        <Sec id="vestimenta" ink="top" flip><ScrollReveal><DressCode /></ScrollReveal></Sec>
        <Sec id="regalos" ink="corner"><ScrollReveal><MesaRegalos /></ScrollReveal><ScrollReveal><SoloAdultos /></ScrollReveal></Sec>
        <Sec><ScrollReveal><PhotoFrame /></ScrollReveal></Sec>
        <Sec ink="footer" flip><ScrollReveal><RSVPSection /></ScrollReveal></Sec>
        <Sec id="album" ink="oval" flip><ScrollReveal><AlbumQR /></ScrollReveal></Sec>
        <Sec fh="260px"><ClosingPhoto /></Sec>
        <Sec><Footer /></Sec>
      </div>

      {/* Polvo dorado — aparece tras el header */}
      {contentVisible && <GoldDust />}
      <SectionFades />
      <Nav show={contentVisible} onLang={() => setLang((l) => (l === "es" ? "en" : "es"))} />

      <MusicFab ref={musicRef} />
    </LangProvider>
  );
}
