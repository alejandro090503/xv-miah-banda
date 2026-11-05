"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "./i18n";

/* ══════════════════════════════════════════════════════════════
   RSVP — Sweet 16 Miah Alana Banda
   Diseño de boda-jennifer-y-marcel repintado en rose gold.
   Estándar "X pases": bandeja que se cierra al confirmar, tarjeta de
   gracias + "Modificar mi respuesta", contador de pases a usar.
   Contrato con el panel (NO cambiar):
     GET  PANEL_API?nombre=<para>&url_boda=<RSVP_URL>   (o ?id=<c>)
     POST PANEL_API { nombre, url_boda, estado, pases_confirmados,
                      nombres_confirmados[, id] }
   ══════════════════════════════════════════════════════════════ */

const PANEL_API = "https://panel-invitados.vercel.app/api/confirmar";
const RSVP_URL = "https://xv-miah-banda.vercel.app";
const DEADLINE = new Date(2027, 0, 15, 23, 59, 59, 999);

type Choice = "yes" | "no" | null;
type Estado = "confirmado" | "declino";
type Msg =
  | ""
  | "errElige"
  | "errNombre"
  | "errFaltan"
  | "errRed"
  | "errCerradas"
  | "errBorrada"
  | "errSinLink"
  | "errDesconocido"
  | "frozen";

const DICT = {
  es: {
    eyebrow: "Confirma tu asistencia",
    title: "Te espero",
    textoA: "Por favor confirma tu asistencia antes del ",
    fecha: "15 de enero de 2027",
    textoB: ".",
    para: "Esta invitación es para",
    pases: "Pases",
    pase: "Pase",
    menores: "Menores",
    menor: "Menor",
    reservado1: "Hemos reservado un lugar para ti.",
    reservadoN: (n: number) => `Hemos reservado ${n} lugares en tu honor.`,
    si: "Asistiré",
    no: "No podré asistir",
    contador: (n: number) =>
      `Tienes ${n} pases reservados. Aumenta el número de pases que vayas a ocupar.`,
    menos: "Quitar un pase",
    mas: "Agregar un pase",
    usar: (n: number) => (n === 1 ? "1 pase" : `${n} pases`),
    placeholder: (i: number) => `Nombre completo del invitado ${i}`,
    confirmar: "Confirmar asistencia",
    actualizar: "Actualizar respuesta",
    enviando: "Enviando…",
    cerrado: "Confirmaciones cerradas",
    graciasSi: "¡Gracias por confirmar!",
    graciasNo: "Gracias por avisarme",
    subSi1: (n: string) => `Te espero con mucha ilusión, ${n}.`,
    subSiN: (k: number, ns: string) => `Confirmaste ${k} lugares: ${ns}.`,
    subNo: "Lamento que no puedas acompañarme. Te voy a extrañar.",
    modificar: "Modificar mi respuesta",
    errElige: "Elige si asistirás o no.",
    errEligeCada: "Elige una respuesta para cada persona.",
    errNombre: "Escribe al menos un nombre.",
    errFaltan: (u: number, w: number) =>
      `Elegiste ${u} pases pero escribiste ${w} ${w === 1 ? "nombre" : "nombres"}. Escribe ${
        u - w === 1 ? "el nombre que falta" : `los ${u - w} nombres que faltan`
      } o baja el contador.`,
    errRed: "No pudimos registrar tu respuesta. Revisa tu conexión e intenta de nuevo.",
    errCerradas: "Las respuestas de esta invitación ya están cerradas.",
    errBorrada: "Esta invitación ya no está activa. Pide a la familia un enlace nuevo.",
    errSinLink: "Para confirmar, abre el enlace personal que te enviaron.",
    errDesconocido: "No encontramos tu invitación. Pide a la familia un enlace nuevo.",
    frozen: "La fecha límite para confirmar (15 de enero de 2027) ya pasó. Las confirmaciones están cerradas.",
    limite: "Fecha límite · 15 de enero de 2027",
    sinNinos: "Evento sin niños menores de 10 años",
  },
  en: {
    eyebrow: "RSVP",
    title: "Join me",
    textoA: "Please confirm your attendance by ",
    fecha: "January 15, 2027",
    textoB: ".",
    para: "This invitation is for",
    pases: "Passes",
    pase: "Pass",
    menores: "Children",
    menor: "Child",
    reservado1: "We have reserved a seat for you.",
    reservadoN: (n: number) => `We have reserved ${n} seats in your honor.`,
    si: "I'll be there",
    no: "I can't make it",
    contador: (n: number) =>
      `You have ${n} passes reserved. Increase the number of passes you'll be using.`,
    menos: "Remove a pass",
    mas: "Add a pass",
    usar: (n: number) => (n === 1 ? "1 pass" : `${n} passes`),
    placeholder: (i: number) => `Full name of guest ${i}`,
    confirmar: "Confirm attendance",
    actualizar: "Update my reply",
    enviando: "Sending…",
    cerrado: "RSVP closed",
    graciasSi: "Thank you for confirming!",
    graciasNo: "Thank you for letting me know",
    subSi1: (n: string) => `I can't wait to see you, ${n}.`,
    subSiN: (k: number, ns: string) => `You confirmed ${k} seats: ${ns}.`,
    subNo: "I'm sorry you can't join me. You'll be missed.",
    modificar: "Change my reply",
    errElige: "Please choose whether you'll attend.",
    errEligeCada: "Please choose an answer for each person.",
    errNombre: "Please write at least one name.",
    errFaltan: (u: number, w: number) =>
      `You chose ${u} passes but wrote ${w} ${w === 1 ? "name" : "names"}. Write the ${
        u - w === 1 ? "missing name" : `${u - w} missing names`
      } or lower the counter.`,
    errRed: "We couldn't save your reply. Check your connection and try again.",
    errCerradas: "Replies for this invitation are already closed.",
    errBorrada: "This invitation is no longer active. Please ask the family for a new link.",
    errSinLink: "To RSVP, please open the personal link you received.",
    errDesconocido: "We couldn't find your invitation. Please ask the family for a new link.",
    frozen: "The RSVP deadline (January 15, 2027) has passed. Replies are closed.",
    limite: "Deadline · January 15, 2027",
    sinNinos: "No children under 10",
  },
};

/* ?i=<token> del panel: base64url de "nombre|pases|menores" */
function decodeInvite(tok: string): { nombre: string; pases: number; menores: number } | null {
  try {
    let b = tok.replace(/-/g, "+").replace(/_/g, "/");
    while (b.length % 4) b += "=";
    const bin = atob(b);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const raw = new TextDecoder().decode(bytes);
    const parts = raw.split("|");
    if (parts.length < 2) return null;
    const menores = parseInt(parts.pop() || "0", 10);
    const pases = parseInt(parts.pop() || "1", 10);
    const nombre = parts.join("|").trim();
    if (!nombre) return null;
    return {
      nombre,
      pases: isNaN(pases) || pases < 1 || pases > 20 ? 1 : pases,
      menores: isNaN(menores) || menores < 0 || menores > 20 ? 0 : menores,
    };
  } catch {
    return null;
  }
}

const clampInt = (raw: string | null, def: number, min: number, max: number) => {
  const v = parseInt(raw || "", 10);
  return isNaN(v) || v < min || v > max ? def : v;
};

export default function RSVPSection() {
  const lang = useLang();
  const t = DICT[lang] ?? DICT.es;
  const frozen = Date.now() > DEADLINE.getTime();

  const [nombrePara, setNombrePara] = useState("");
  const [invId, setInvId] = useState<string>("");
  const [tieneLink, setTieneLink] = useState(false);
  const [pasesAsignados, setPasesAsignados] = useState(1);
  const [menoresAsignados, setMenoresAsignados] = useState(0);
  const [pasesLoaded, setPasesLoaded] = useState(false);
  const [bloqueado, setBloqueado] = useState<"" | "cerradas" | "borrada" | "desconocido">("");

  const [choice, setChoice] = useState<Choice>(null);
  const [usar, setUsar] = useState(1);
  const [nombres, setNombres] = useState<string[]>([""]);
  const [faltan, setFaltan] = useState<boolean[]>([]);

  // Modo nombres asignados (dual-mode): una tarjeta por persona
  const [nombresAsignados, setNombresAsignados] = useState<string[]>([]);
  const [asignadosChoices, setAsignadosChoices] = useState<Choice[]>([]);
  const modoAsignados = nombresAsignados.length > 0;

  const [loading, setLoading] = useState(false);
  const [yaRespondio, setYaRespondio] = useState(false);
  const [msg, setMsg] = useState<Msg>("");
  const [faltanInfo, setFaltanInfo] = useState<[number, number]>([0, 0]);
  const [gracias, setGracias] = useState<{ estado: Estado; nombres: string[] } | null>(null);

  const secRef = useRef<HTMLElement>(null);
  const graciasRef = useRef<HTMLDivElement>(null);

  const total = Math.max(1, pasesAsignados + menoresAsignados);
  const locked = frozen || !!bloqueado;

  /* ── Precarga: URL + guard silencioso al panel (autoritativo) ── */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = (params.get("c") || "").trim();
    const tok = decodeInvite((params.get("i") || "").trim());
    let para = (params.get("para") || "").trim();
    let urlP = clampInt(params.get("pases"), 1, 1, 20);
    let urlM = clampInt(params.get("menores"), 0, 0, 20);
    if (tok) {
      para = tok.nombre;
      urlP = tok.pases;
      urlM = tok.menores;
    }
    setNombrePara(para);
    setInvId(c);
    setPasesAsignados(urlP);
    setMenoresAsignados(urlM);
    setNombres(Array(urlP + urlM).fill(""));
    setTieneLink(!!(c || para));

    if (!c && !para) {
      setPasesLoaded(true);
      return;
    }

    const q = c
      ? `id=${encodeURIComponent(c)}`
      : `nombre=${encodeURIComponent(para)}`;
    fetch(`${PANEL_API}?${q}&url_boda=${encodeURIComponent(RSVP_URL)}`)
      .then((r) => r.json())
      .then((resp) => {
        const d = resp?.invitado;
        if (resp && resp.ok && !d) {
          // el panel no conoce este link (borrado o renombrado)
          setBloqueado("desconocido");
          setPasesLoaded(true);
          return;
        }
        if (!d) {
          setPasesLoaded(true);
          return;
        }
        if (typeof d.nombre === "string" && d.nombre.trim()) setNombrePara(d.nombre.trim());
        if (d.bloqueado === true) setBloqueado("cerradas");

        const asignados: string[] = Array.isArray(d.nombres_asignados)
          ? d.nombres_asignados.filter((x: string) => x && String(x).trim())
          : [];
        const confirmados: string[] = Array.isArray(d.nombres_confirmados)
          ? d.nombres_confirmados.filter((x: string) => x && String(x).trim())
          : [];

        if (asignados.length > 0) {
          setNombresAsignados(asignados);
          if (d.estado === "confirmado" || d.estado === "declino") {
            const confLower = confirmados.map((s) => String(s).toLowerCase().trim());
            const chs: Choice[] = asignados.map((nm) =>
              d.estado === "declino" ? "no" : confLower.includes(nm.toLowerCase().trim()) ? "yes" : "no"
            );
            setAsignadosChoices(chs);
            setYaRespondio(true);
            const si = asignados.filter((_, i) => chs[i] === "yes");
            setGracias({ estado: si.length ? "confirmado" : "declino", nombres: si });
          } else {
            setAsignadosChoices(asignados.map(() => null));
          }
          setPasesLoaded(true);
          return;
        }

        let pReal = urlP;
        let mReal = urlM;
        if (typeof d.pases === "number" && d.pases > 0 && d.pases <= 20) pReal = d.pases;
        if (typeof d.pases_menores === "number" && d.pases_menores >= 0 && d.pases_menores <= 20) mReal = d.pases_menores;
        setPasesAsignados(pReal);
        setMenoresAsignados(mReal);
        const tot = Math.max(1, pReal + mReal);

        if (d.estado === "confirmado" || d.estado === "declino") {
          const c2: Choice = d.estado === "confirmado" ? "yes" : "no";
          const arr = Array(tot).fill("").map((_, i) => confirmados[i] || "");
          setNombres(arr);
          setUsar(Math.min(tot, Math.max(1, confirmados.length)));
          setChoice(c2);
          setYaRespondio(true);
          setGracias({ estado: d.estado, nombres: d.estado === "confirmado" ? confirmados : [] });
        } else {
          setNombres(Array(tot).fill(""));
        }
        setPasesLoaded(true);
      })
      .catch(() => setPasesLoaded(true));
  }, []);

  /* ── Selección ── */
  function handleSelect(c: "yes" | "no") {
    if (locked) return;
    setChoice(c);
    setMsg("");
    setFaltan([]);
    if (c === "no") {
      // al declinar, los campos se ocultan y se limpian
      setNombres(Array(total).fill(""));
      setUsar(1);
    }
  }
  function setChoiceFor(i: number, c: "yes" | "no") {
    if (locked) return;
    setAsignadosChoices((prev) => {
      const copy = [...prev];
      copy[i] = c;
      return copy;
    });
    setMsg("");
  }
  function changeUsar(d: number) {
    if (locked) return;
    setUsar((u) => Math.min(total, Math.max(1, u + d)));
    setMsg("");
    setFaltan([]);
  }
  function setNombreAt(i: number, v: string) {
    setNombres((prev) => {
      const copy = prev.length >= total ? [...prev] : [...prev, ...Array(total - prev.length).fill("")];
      copy[i] = v;
      return copy;
    });
    if (faltan[i] && v.trim()) {
      setFaltan((f) => {
        const c = [...f];
        c[i] = false;
        return c;
      });
    }
  }

  /* ── Confeti en la paleta (spans + WAAPI, se limpia solo) ── */
  function confetti() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const host = document.createElement("div");
    host.className = "rv-confetti";
    host.setAttribute("aria-hidden", "true");
    document.body.appendChild(host);
    const cols = ["#B76E79", "#D9A3AA", "#E9C9CD", "#FFFFFF", "#8C4F59", "#3D2A2D", "#F3D3D6"];
    const H = window.innerHeight;
    let left = 64;
    for (let i = 0; i < 64; i++) {
      const s = document.createElement("i");
      const w = 6 + Math.random() * 6;
      s.style.left = `${Math.random() * 100}%`;
      s.style.width = `${w}px`;
      s.style.height = `${w * (Math.random() > 0.5 ? 1.6 : 0.6)}px`;
      s.style.background = cols[i % cols.length];
      if (i % 3 === 0) s.style.borderRadius = "50%";
      host.appendChild(s);
      const dx = Math.random() * 140 - 70;
      const anim = s.animate(
        [
          { transform: "translate3d(0,-20px,0) rotate(0deg)", opacity: 1 },
          { transform: `translate3d(${dx}px,${H + 40}px,0) rotate(${Math.random() * 720 - 360}deg)`, opacity: 0.85 },
        ],
        { duration: 2300 + Math.random() * 1500, delay: Math.random() * 450, easing: "cubic-bezier(.2,.6,.4,1)", fill: "both" }
      );
      anim.onfinish = () => {
        s.remove();
        left -= 1;
        if (left <= 0) host.remove();
      };
    }
    window.setTimeout(() => host.remove(), 5000);
  }

  /* ── Confirmar ── */
  async function handleConfirm() {
    if (locked || loading) return;
    if (!tieneLink) {
      setMsg("errSinLink");
      return;
    }
    let nombresFilled: string[];
    let estado: Estado;
    if (modoAsignados) {
      if (
        asignadosChoices.length !== nombresAsignados.length ||
        asignadosChoices.some((c) => c !== "yes" && c !== "no")
      ) {
        setMsg("errElige");
        return;
      }
      nombresFilled = nombresAsignados.filter((_, i) => asignadosChoices[i] === "yes");
      estado = nombresFilled.length > 0 ? "confirmado" : "declino";
    } else {
      if (!choice) {
        setMsg("errElige");
        return;
      }
      if (choice === "yes") {
        const vis = nombres.slice(0, usar).map((n) => (n || "").trim());
        nombresFilled = vis.filter(Boolean);
        if (nombresFilled.length === 0) {
          setFaltan(vis.map((v) => !v));
          setMsg("errNombre");
          return;
        }
        if (nombresFilled.length < usar) {
          setFaltan(vis.map((v) => !v));
          setFaltanInfo([usar, nombresFilled.length]);
          setMsg("errFaltan");
          return;
        }
      } else {
        nombresFilled = [];
      }
      estado = choice === "yes" ? "confirmado" : "declino";
    }

    setLoading(true);
    setMsg("");
    try {
      const body: Record<string, unknown> = {
        nombre: nombrePara || "Invitado",
        url_boda: RSVP_URL,
        estado,
        pases_confirmados: estado === "confirmado" ? nombresFilled.length : 0,
        nombres_confirmados: nombresFilled,
      };
      if (invId) body.id = invId;
      const r = await fetch(PANEL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      let d: { ok?: boolean; error?: string } | null = null;
      try {
        d = await r.json();
      } catch {
        d = null;
      }
      if (r.status === 423 || d?.error === "respuestas_cerradas") {
        setBloqueado("cerradas");
        setMsg("errCerradas");
        return;
      }
      if (r.status === 410 || d?.error === "invitacion_borrada") {
        setBloqueado("borrada");
        setMsg("errBorrada");
        return;
      }
      if (!r.ok || d?.ok === false) {
        setMsg("errRed");
        return;
      }
      setYaRespondio(true);
      setGracias({ estado, nombres: nombresFilled });
      if (estado === "confirmado") confetti();
      window.setTimeout(() => {
        graciasRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 60);
    } catch {
      setMsg("errRed");
    } finally {
      setLoading(false);
    }
  }

  function abrirBandeja() {
    if (locked) return;
    setGracias(null);
    setMsg("");
    setFaltan([]);
  }

  /* ── Textos derivados ── */
  const btnLabel = frozen
    ? t.cerrado
    : loading
      ? t.enviando
      : yaRespondio
        ? t.actualizar
        : t.confirmar;

  const bloqueoMsg =
    bloqueado === "cerradas" ? t.errCerradas
    : bloqueado === "borrada" ? t.errBorrada
    : bloqueado === "desconocido" ? t.errDesconocido
    : "";

  const feedback =
    frozen ? t.frozen
    : bloqueoMsg ? bloqueoMsg
    : msg === "" ? ""
    : msg === "errElige" ? (modoAsignados ? t.errEligeCada : t.errElige)
    : msg === "errNombre" ? t.errNombre
    : msg === "errFaltan" ? t.errFaltan(faltanInfo[0], faltanInfo[1])
    : msg === "errRed" ? t.errRed
    : msg === "errCerradas" ? t.errCerradas
    : msg === "errBorrada" ? t.errBorrada
    : msg === "errSinLink" ? t.errSinLink
    : msg === "errDesconocido" ? t.errDesconocido
    : "";

  const graciasSub = gracias
    ? gracias.estado === "declino"
      ? t.subNo
      : gracias.nombres.length === 1
        ? t.subSi1(gracias.nombres[0])
        : gracias.nombres.length > 1
          ? t.subSiN(gracias.nombres.length, gracias.nombres.join(", "))
          : ""
    : "";

  const showNombre = !!nombrePara;
  const showPases = tieneLink && !modoAsignados;

  return (
    <section ref={secRef} className="rv-sec" id="rsvp" aria-label={t.eyebrow}>
      <style>{CSS}</style>

      <div className="rv-wrap">
        <p className="rv-eyebrow">{t.eyebrow}</p>
        <h2 className="rv-title">
          <span className="foil-text rv-foil">{t.title}</span>
        </h2>
        <p className="rv-lead">
          {t.textoA}
          <strong>{t.fecha}</strong>
          {t.textoB}
        </p>

        <div className="rv-card">
          <span className="rv-inner" aria-hidden="true" />
          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />

          {/* Esta invitación es para */}
          {showNombre && (
            <div className="rv-para">
              <p className="rv-para-label">{t.para}</p>
              <p className="rv-name">
                <span className="rv-name-txt">{nombrePara}</span>
              </p>
              {!modoAsignados && (
                <p className="rv-note">{total === 1 ? t.reservado1 : t.reservadoN(total)}</p>
              )}
            </div>
          )}

          {/* Recuadros de pases (+ menores solo si el panel/URL trae menores) */}
          {showPases && (
            <div className={`rv-pases${menoresAsignados > 0 ? " two" : ""}`}>
              <div className="rv-pbox">
                <span className="rv-pnum">{pasesLoaded ? pasesAsignados : "…"}</span>
                <span className="rv-plabel">{pasesAsignados === 1 ? t.pase : t.pases}</span>
              </div>
              {menoresAsignados > 0 && (
                <div className="rv-pbox">
                  <span className="rv-pnum">{menoresAsignados}</span>
                  <span className="rv-plabel">{menoresAsignados === 1 ? t.menor : t.menores}</span>
                </div>
              )}
            </div>
          )}

          {/* BANDEJA (se cierra al confirmar) */}
          {!gracias && (
            <div className="rv-bandeja">
              {modoAsignados ? (
                <div className="rv-people">
                  {nombresAsignados.map((nm, i) => {
                    const ch = asignadosChoices[i];
                    return (
                      <div key={i} className={`rv-person${ch === "yes" ? " is-yes" : ch === "no" ? " is-no" : ""}`}>
                        <p className="rv-person-name">{nm}</p>
                        <div className="rv-toggle">
                          <button
                            type="button"
                            className={`rv-tbtn${ch === "yes" ? " on" : ""}`}
                            aria-pressed={ch === "yes"}
                            disabled={!pasesLoaded || locked}
                            onClick={() => setChoiceFor(i, "yes")}
                          >
                            {t.si}
                          </button>
                          <button
                            type="button"
                            className={`rv-tbtn${ch === "no" ? " on" : ""}`}
                            aria-pressed={ch === "no"}
                            disabled={!pasesLoaded || locked}
                            onClick={() => setChoiceFor(i, "no")}
                          >
                            {t.no}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <>
                  <div className="rv-toggle">
                    <button
                      type="button"
                      className={`rv-tbtn${choice === "yes" ? " on" : ""}`}
                      aria-pressed={choice === "yes"}
                      disabled={!pasesLoaded || locked}
                      onClick={() => handleSelect("yes")}
                    >
                      <HeartIcon />
                      {t.si}
                    </button>
                    <button
                      type="button"
                      className={`rv-tbtn${choice === "no" ? " on" : ""}`}
                      aria-pressed={choice === "no"}
                      disabled={!pasesLoaded || locked}
                      onClick={() => handleSelect("no")}
                    >
                      {t.no}
                    </button>
                  </div>

                  {choice === "yes" && (
                    <div className="rv-fields">
                      {total > 1 && (
                        <div className="rv-counter">
                          <p className="rv-counter-txt">{t.contador(total)}</p>
                          <div className="rv-stepper">
                            <button
                              type="button"
                              className="rv-step"
                              aria-label={t.menos}
                              disabled={usar <= 1 || locked}
                              onClick={() => changeUsar(-1)}
                            >
                              −
                            </button>
                            <span className="rv-step-val" aria-live="polite">
                              {t.usar(usar)}
                            </span>
                            <button
                              type="button"
                              className="rv-step"
                              aria-label={t.mas}
                              disabled={usar >= total || locked}
                              onClick={() => changeUsar(1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                      {Array.from({ length: usar }).map((_, i) => (
                        <input
                          key={i}
                          type="text"
                          className={`rv-input${faltan[i] ? " is-miss" : ""}`}
                          value={nombres[i] || ""}
                          placeholder={t.placeholder(i + 1)}
                          aria-label={t.placeholder(i + 1)}
                          aria-invalid={faltan[i] || undefined}
                          maxLength={60}
                          autoComplete={i === 0 ? "name" : "off"}
                          disabled={locked}
                          onChange={(e) => setNombreAt(i, e.target.value)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

              <button
                type="button"
                className={`rv-btn${!locked && pasesLoaded && !loading ? " breathe" : ""}`}
                onClick={handleConfirm}
                disabled={loading || locked || !pasesLoaded}
              >
                <span>{btnLabel}</span>
              </button>
            </div>
          )}

          {/* PANEL DE GRACIAS */}
          {gracias && (
            <div ref={graciasRef} className="rv-gracias" role="status">
              <svg className="rv-gracias-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="8.5 12.5 11 15 16 9.5" />
              </svg>
              <p className="rv-gracias-title">{gracias.estado === "confirmado" ? t.graciasSi : t.graciasNo}</p>
              {graciasSub && <p className="rv-gracias-sub">{graciasSub}</p>}
              <button type="button" className="rv-editar" onClick={abrirBandeja} disabled={locked}>
                {t.modificar}
              </button>
            </div>
          )}

          {feedback && (
            <p className={`rv-feedback${frozen || bloqueoMsg || msg ? " err" : ""}`} role="alert">
              {feedback}
            </p>
          )}

          <p className="rv-limite">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm.5 5v5.25l4.5 2.67-.75 1.23L11 13V7h1.5z" />
            </svg>
            {t.limite}
          </p>
          <p className="rv-ninos">{t.sinNinos}</p>
        </div>
      </div>
    </section>
  );
}

function HeartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="rv-heart">
      <path d="M12 21.6C6.4 16 1 11.3 1 7.2 1 3.4 4.1 2 6.3 2c1.3 0 4.2.5 5.7 4.5C13.6 2.5 16.5 2 17.7 2 20.3 2 23 3.6 23 7.2c0 4-5.1 8.6-11 14.4z" />
    </svg>
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  return (
    <svg className={`rv-corner rv-${pos}`} viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <path d="M3 49V9Q3 3 9 3h40" stroke="url(#rvg)" strokeWidth="1.1" />
      <path d="M9 40V15q0-6 6-6h25" stroke="url(#rvg)" strokeWidth=".7" opacity=".7" />
      <circle cx="3" cy="3" r="2.4" fill="#B76E79" />
      <defs>
        <linearGradient id="rvg" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8C4F59" />
          <stop offset=".5" stopColor="#D9A3AA" />
          <stop offset="1" stopColor="#B76E79" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const CSS = `
.rv-sec{position:relative;background:transparent;padding:76px 16px 72px;text-align:center}
.rv-wrap{max-width:430px;margin:0 auto}
.rv-eyebrow{font-family:var(--font-cormorant),serif;font-variant-numeric:lining-nums;font-weight:600;font-size:16px;
  letter-spacing:.3em;text-transform:uppercase;color:var(--gold-deep,#8C4F59);margin:0 0 6px}
.rv-title{margin:0;font-weight:400;line-height:1.25}
.rv-foil{display:inline-block;font-family:var(--font-great-vibes),cursive;font-size:clamp(48px,14vw,64px);
  padding:.22em .45em;margin:-.22em -.45em;line-height:1.25;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.rv-lead{font-family:var(--font-cormorant),serif;font-variant-numeric:lining-nums;font-weight:500;font-size:19px;line-height:1.6;
  color:var(--ink,#3D2A2D);margin:14px auto 0;max-width:340px}
.rv-lead strong{font-weight:700;color:var(--accent-deep,#6E3540)}

.rv-card{position:relative;margin:30px auto 0;padding:40px 22px 30px;border-radius:22px;
  background:linear-gradient(180deg,var(--paper,#FFF9F8),var(--surface,#FBF4F3));
  border:1px solid var(--hair,rgba(183,110,121,.35));
  box-shadow:0 22px 50px rgba(110,53,64,.12),0 2px 8px rgba(110,53,64,.06)}
.rv-inner{position:absolute;inset:9px;border:1px solid rgba(183,110,121,.22);border-radius:16px;pointer-events:none}
.rv-corner{position:absolute;width:42px;height:42px;pointer-events:none}
.rv-tl{top:5px;left:5px}.rv-tr{top:5px;right:5px;transform:scaleX(-1)}
.rv-bl{bottom:5px;left:5px;transform:scaleY(-1)}.rv-br{bottom:5px;right:5px;transform:scale(-1,-1)}

/* Esta invitación es para */
.rv-para{position:relative;margin:0 0 6px}
.rv-para-label{font-family:var(--font-cormorant),serif;font-style:italic;font-weight:600;font-size:18px;color:var(--ink-soft,#6B5357);margin:0}
.rv-name{margin:6px 0 0;line-height:1.15}
.rv-name-txt{display:inline-block;max-width:100%;font-family:var(--font-cormorant),serif;font-variant-numeric:lining-nums;
  font-weight:700;font-size:clamp(26px,8.2vw,36px);letter-spacing:.01em;
  overflow-wrap:anywhere;word-break:normal;hyphens:auto;text-wrap:balance;
  padding:.12em .3em;margin:-.12em -.3em;box-decoration-break:clone;-webkit-box-decoration-break:clone;
  background:linear-gradient(100deg,#6E3540 0%,#8C4F59 26%,#B76E79 44%,#8C4F59 58%,#6E3540 80%,#8C4F59 100%);
  -webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;
  filter:drop-shadow(0 1px 0 rgba(255,255,255,.9)) drop-shadow(0 0 14px rgba(217,163,170,.55))}
.rv-note{font-family:var(--font-cormorant),serif;font-variant-numeric:lining-nums;font-weight:500;font-size:18px;color:var(--ink-soft,#6B5357);margin:10px 0 0}

/* recuadros de pases */
.rv-pases{display:flex;justify-content:center;gap:12px;margin:18px auto 6px}
.rv-pbox{position:relative;display:flex;flex-direction:column;align-items:center;min-width:112px;padding:12px 22px 10px;border-radius:16px;
  background:#fff;border:1.5px solid transparent;
  background-image:linear-gradient(#fff,#fff),linear-gradient(135deg,#E9C9CD,#B76E79 45%,#8C4F59 70%,#D9A3AA);
  background-origin:border-box;background-clip:padding-box,border-box}
.rv-pnum{font-family:var(--font-cormorant),serif;font-variant-numeric:lining-nums;font-weight:700;font-size:50px;line-height:1;color:var(--accent-deep,#6E3540)}
.rv-plabel{margin-top:4px;font-family:var(--font-cormorant),serif;font-weight:700;font-size:16px;letter-spacing:.24em;text-transform:uppercase;color:var(--gold-deep,#8C4F59)}

/* bandeja */
.rv-bandeja{margin:22px auto 0;max-width:380px}
.rv-toggle{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.rv-tbtn{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:54px;padding:10px 8px;border-radius:14px;
  border:1.5px solid var(--hair,rgba(183,110,121,.35));background:#fff;color:var(--ink,#3D2A2D);cursor:pointer;
  font-family:var(--font-cormorant),serif;font-weight:700;font-size:18px;line-height:1.15;
  transition:background-color .25s,border-color .25s,color .25s,transform .2s}
.rv-tbtn:active{transform:scale(.98)}
.rv-tbtn .rv-heart{color:var(--accent,#B76E79);transition:color .25s}
.rv-tbtn.on{background:linear-gradient(135deg,#8C4F59,#6E3540);border-color:#6E3540;color:#FFF9F8}
.rv-tbtn.on .rv-heart{color:#F3D3D6}
.rv-tbtn:disabled{opacity:.55;cursor:not-allowed}
.rv-tbtn:focus-visible,.rv-btn:focus-visible,.rv-step:focus-visible,.rv-editar:focus-visible{outline:2px solid var(--accent-deep,#6E3540);outline-offset:3px}

.rv-people{display:grid;gap:12px}
.rv-person{padding:14px 14px 12px;border-radius:16px;background:#fff;border:1.5px solid var(--hair,rgba(183,110,121,.35));transition:border-color .25s,background-color .25s}
.rv-person.is-yes{border-color:#8C4F59;background:#FDF3F3}
.rv-person.is-no{border-color:#C9A9AD;background:#FAF6F6}
.rv-person-name{margin:0 0 10px;font-family:var(--font-cormorant),serif;font-weight:700;font-size:21px;color:var(--accent-deep,#6E3540);overflow-wrap:anywhere}
.rv-person .rv-tbtn{min-height:48px;font-size:17px}

.rv-fields{display:grid;gap:10px;margin-top:16px;animation:rv-in .35s ease both}
.rv-counter{padding:14px 14px 12px;border-radius:14px;background:#fff;border:1px dashed rgba(140,79,89,.45)}
.rv-counter-txt{margin:0 0 10px;font-family:var(--font-cormorant),serif;font-variant-numeric:lining-nums;font-weight:600;font-size:17px;line-height:1.45;color:var(--ink,#3D2A2D)}
.rv-stepper{display:flex;align-items:center;justify-content:center;gap:14px}
.rv-step{width:46px;height:46px;border-radius:50%;border:1.5px solid #B76E79;background:var(--paper,#FFF9F8);color:var(--accent-deep,#6E3540);
  font-family:var(--font-cormorant),serif;font-weight:700;font-size:26px;line-height:1;cursor:pointer;display:grid;place-items:center;padding-bottom:3px}
.rv-step:disabled{opacity:.4;cursor:not-allowed}
.rv-step-val{min-width:96px;font-family:var(--font-cormorant),serif;font-variant-numeric:lining-nums;font-weight:700;font-size:20px;color:var(--accent-deep,#6E3540)}
.rv-input{width:100%;min-height:52px;padding:12px 16px;border-radius:12px;border:1.5px solid #B76E79;background:#fff;
  font-family:var(--font-cormorant),serif;font-variant-numeric:lining-nums;font-weight:600;font-size:18px;color:var(--ink,#3D2A2D);
  outline:none;-webkit-appearance:none;appearance:none;box-sizing:border-box;transition:border-color .2s,box-shadow .2s}
.rv-input::placeholder{color:#7A6266;opacity:1;font-weight:500}
.rv-input:focus{border-color:#6E3540;box-shadow:0 0 0 3px rgba(183,110,121,.22)}
.rv-input.is-miss{border-color:#A3263A;background:#FFF4F4;box-shadow:0 0 0 3px rgba(163,38,58,.14)}

/* botón confirmar que respira */
.rv-btn{position:relative;width:100%;margin-top:18px;min-height:58px;border-radius:999px;border:none;cursor:pointer;isolation:isolate;
  background:linear-gradient(120deg,#6E3540 0%,#8C4F59 30%,#B76E79 52%,#8C4F59 74%,#6E3540 100%);
  color:#FFF9F8;font-family:var(--font-cormorant),serif;font-weight:700;font-size:19px;letter-spacing:.14em;text-transform:uppercase;
  box-shadow:0 10px 26px rgba(110,53,64,.28),inset 0 1px 0 rgba(255,255,255,.3)}
.rv-btn span{position:relative;z-index:1}
.rv-btn::after{content:"";position:absolute;inset:0;border-radius:inherit;z-index:-1;border:2px solid #D9A3AA;opacity:0;pointer-events:none}
.rv-btn.breathe{animation:rv-breathe 3.2s ease-in-out infinite}
.rv-btn.breathe::after{animation:rv-ring 3.2s ease-out infinite}
.rv-btn:disabled{opacity:.55;cursor:not-allowed}
@keyframes rv-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
@keyframes rv-ring{0%{opacity:.7;transform:scale(1)}70%,100%{opacity:0;transform:scale(1.08,1.3)}}

/* gracias */
.rv-gracias{margin:22px auto 0;max-width:380px;padding:26px 20px 22px;border-radius:18px;background:#fff;
  border:1.5px solid var(--hair,rgba(183,110,121,.35));animation:rv-in .45s ease both}
.rv-gracias-icon{display:block;margin:0 auto 10px;color:var(--accent,#B76E79)}
.rv-gracias-title{margin:0 0 8px;font-family:var(--font-cormorant),serif;font-weight:700;font-size:27px;line-height:1.25;color:var(--accent-deep,#6E3540)}
.rv-gracias-sub{margin:0 0 18px;font-family:var(--font-cormorant),serif;font-variant-numeric:lining-nums;font-weight:500;font-size:19px;line-height:1.55;color:var(--ink,#3D2A2D);overflow-wrap:anywhere}
.rv-editar{min-height:48px;padding:10px 24px;border-radius:999px;border:1.5px solid #B76E79;background:transparent;cursor:pointer;
  font-family:var(--font-cormorant),serif;font-weight:700;font-size:17px;color:var(--accent-deep,#6E3540);transition:background-color .25s}
.rv-editar:hover{background:#FBEDEE}
.rv-editar:disabled{opacity:.45;cursor:not-allowed}

.rv-feedback{display:block;margin:16px auto 0;max-width:380px;padding:10px 14px;border-radius:12px;
  font-family:var(--font-cormorant),serif;font-variant-numeric:lining-nums;font-weight:600;font-size:17px;line-height:1.45;color:var(--accent-deep,#6E3540);background:#FBEDEE}
.rv-feedback.err{color:#8A1F30;background:#FFF0F1;border:1px solid rgba(163,38,58,.25)}
.rv-limite{display:flex;align-items:center;justify-content:center;gap:8px;margin:22px 0 0;font-family:var(--font-cormorant),serif;
  font-variant-numeric:lining-nums;font-weight:700;font-size:16px;letter-spacing:.08em;color:var(--gold-deep,#8C4F59)}
.rv-ninos{margin:6px 0 0;font-family:var(--font-cormorant),serif;font-style:italic;font-weight:600;font-size:16px;color:var(--ink-soft,#6B5357)}

@keyframes rv-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

/* confeti (se monta en <body>) */
.rv-confetti{position:fixed;inset:0;pointer-events:none;z-index:9998;overflow:hidden}
.rv-confetti i{position:absolute;top:-16px;display:block;will-change:transform,opacity;box-shadow:0 0 0 .5px rgba(110,53,64,.12)}

@media (prefers-reduced-motion:reduce){
  .rv-btn.breathe,.rv-btn.breathe::after,.rv-fields,.rv-gracias{animation:none}
}
@media (max-width:360px){
  .rv-card{padding:36px 16px 26px}
  .rv-tbtn{font-size:16.5px}
}
`;
