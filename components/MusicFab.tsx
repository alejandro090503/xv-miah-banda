"use client";
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";

const AUDIO_URL = "https://bsjoelxktbvlavfoozhk.supabase.co/storage/v1/object/public/fotos-clientes/audio/xv-miah-banda/cancion.mp3";

export interface MusicFabHandle {
  play: () => void;
}

/* Botón de música — nota de oro */
const MusicFab = forwardRef<MusicFabHandle>((_, ref) => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const a = new Audio(AUDIO_URL);
    a.loop = true;
    a.volume = 0.5;
    a.preload = "none";
    audioRef.current = a;
    return () => { a.pause(); };
  }, []);

  useImperativeHandle(ref, () => ({
    play() {
      if (!audioRef.current || playing) return;
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    },
  }));

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  return (
    <>
      <style>{`
        .music-btn{
          position:fixed;bottom:12px;left:12px;z-index:998;
          width:44px;height:44px;padding:0;border:0;background:transparent;
          cursor:pointer;display:grid;place-items:center;
          -webkit-tap-highlight-color:transparent;
          transition:transform .4s cubic-bezier(.2,.7,.2,1);
        }
        .music-btn:hover,.music-btn:focus-visible{transform:scale(1.09)}
        .music-btn:active{transform:scale(.97)}

        /* Halo que respira detrás de la nota */
        .note-halo{
          position:absolute;width:58px;height:58px;border-radius:50%;pointer-events:none;
          background:radial-gradient(circle, rgba(183,110,121,.30) 0%, rgba(5,79,0,.20) 42%, transparent 68%);
          animation:haloPulse 6s ease-in-out infinite;
        }
        .music-btn:hover .note-halo{background:radial-gradient(circle, rgba(240,214,147,.44) 0%, rgba(5,79,0,.24) 44%, transparent 70%)}
        @keyframes haloPulse{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.12);opacity:1}}

        .music-note{
          position:relative;width:26px;height:30px;overflow:visible;
          filter:drop-shadow(0 3px 9px rgba(0,0,0,.62)) drop-shadow(0 0 11px rgba(212,169,79,.42));
          transition:filter .5s ease, opacity .45s ease;
          animation:lev 7s ease-in-out infinite;
        }
        @keyframes lev{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        .music-btn.is-playing .music-note{
          filter:drop-shadow(0 3px 9px rgba(0,0,0,.62)) drop-shadow(0 0 18px rgba(183,110,121,.62));
        }
        /* Silenciada: oro apagado */
        .music-btn:not(.is-playing) .music-note{opacity:.62;filter:drop-shadow(0 3px 8px rgba(0,0,0,.6)) saturate(.55)}

        /* Brillo que recorre la nota */
        .note-sheen{animation:noteSheen 4.6s ease-in-out infinite;opacity:0}
        .music-btn.is-playing .note-sheen{opacity:1}
        @keyframes noteSheen{0%,62%{transform:translateX(-46px)}100%{transform:translateX(46px)}}

        /* Ondas de sonido: solo cuando suena */
        .note-wave{opacity:0;transform-origin:6px 26px}
        .music-btn.is-playing .note-wave{animation:noteWave 2.1s ease-out infinite}
        .music-btn.is-playing .note-wave--2{animation-delay:.42s}
        .music-btn.is-playing .note-wave--3{animation-delay:.84s}
        @keyframes noteWave{0%{opacity:0;transform:scale(.6)}35%{opacity:.85}100%{opacity:0;transform:scale(1.35)}}

        /* Barra de silencio */
        .note-mute{opacity:1;transition:opacity .3s ease}
        .music-btn.is-playing .note-mute{opacity:0}

        @media(prefers-reduced-motion:reduce){
          .note-halo,.music-note,.note-sheen,.note-wave{animation:none!important}
        }
      `}</style>

      <button
        className={`music-btn${playing ? " is-playing" : ""}`}
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pausar música" : "Reproducir música"}
        aria-pressed={playing}
      >
        <span className="note-halo" aria-hidden="true" />
        <svg className="music-note" viewBox="0 0 50 52" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="mnGold" x1="4" y1="2" x2="38" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FFF6DF" />
              <stop offset=".28" stopColor="#F0D693" />
              <stop offset=".55" stopColor="#B76E79" />
              <stop offset=".78" stopColor="#8C4F59" />
              <stop offset="1" stopColor="#E0B966" />
            </linearGradient>
            <linearGradient id="mnSheen" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset=".5" stopColor="#fff" stopOpacity=".62" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <clipPath id="mnClip">
              <path d="M20.6 3.2 C27.8 7.2 33.4 12 33.4 19.4 C33.4 22.4 32.6 24.6 31.2 26.6 C31.6 22 29.2 18.4 20.6 13.6 L20.6 37.4 C20.6 42.6 16 46.8 10.4 46.8 C5.8 46.8 2.6 44.2 2.6 40.6 C2.6 36 7 32.2 12.4 32.2 C14.2 32.2 15.8 32.6 17 33.4 L17 3.2 Z" />
            </clipPath>
          </defs>

          {/* ondas de sonido */}
          <g stroke="#F0D693" strokeWidth="1.5" strokeLinecap="round" fill="none">
            <path className="note-wave" d="M35.6 18.6 C38.4 21.6 38.4 27.4 35.6 30.4" />
            <path className="note-wave note-wave--2" d="M38.8 14.6 C43.2 19.4 43.2 29.6 38.8 34.4" />
            <path className="note-wave note-wave--3" d="M41.6 11 C47.4 17.4 47.4 31.6 41.6 38" />
          </g>

          {/* corchea */}
          <path
            d="M20.6 3.2 C27.8 7.2 33.4 12 33.4 19.4 C33.4 22.4 32.6 24.6 31.2 26.6 C31.6 22 29.2 18.4 20.6 13.6 L20.6 37.4 C20.6 42.6 16 46.8 10.4 46.8 C5.8 46.8 2.6 44.2 2.6 40.6 C2.6 36 7 32.2 12.4 32.2 C14.2 32.2 15.8 32.6 17 33.4 L17 3.2 Z"
            fill="url(#mnGold)"
          />
          <path d="M17 3.2 L20.6 3.2 L20.6 13.6 C19.4 12.9 18.2 12.2 17 11.6 Z" fill="#FFF6DF" opacity=".55" />

          {/* brillo que recorre */}
          <g clipPath="url(#mnClip)">
            <rect className="note-sheen" x="-14" y="-4" width="12" height="60" fill="url(#mnSheen)" transform="rotate(14)" />
          </g>

          {/* barra de silencio */}
          <path className="note-mute" d="M6 45 L38 9" stroke="#FFE9B8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </>
  );
});

MusicFab.displayName = "MusicFab";
export default MusicFab;
