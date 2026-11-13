"use client";
import { createContext, useContext } from "react";

export type Lang = "es" | "en";

/* Todos los textos de la invitación en los dos idiomas del cliente */
export const TEXTS = {
  es: {
    // Sobre
    navMenu: "Menú",
    navSecs: ["Portada","Galería","Familia","Contador","Lugar","Itinerario","Vestimenta","Regalos","Confirmar","Álbum"],
    splashSub: "Mi Sweet 16",
    splashBtn: "Toca para abrir",
    // Selector de idioma
    langTitle: "Elige tu idioma",
    langEs: "Español",
    langEn: "English",
    // Hero
    introLineas: [
      "Hay momentos que imaginamos, soñamos y esperamos…",
      "Uno de ellos ha llegado y deseo compartirlo con mis personas especiales.",
      "Tú eres una de ellas.",
    ],
    xvAnios: "Sweet",
    fecha: "30 · Enero · 2027",
    // Carrusel
    carTitle: "Miah Alana",
    carHint: "Arrastra para girar",
    // Familia
    famEyebrow: "Con la bendición de",
    famTitle: "Mi Familia",
    famPadres: "Mis Padres",
    porConfirmar: "Por confirmar",
    // Countdown
    cdTitle: "Faltan",
    cdSub: "Para este día tan especial",
    cdFoot: "Cada segundo más cerca de celebrar juntos",
    cdDias: "Días",
    cdHoras: "Horas",
    cdMin: "Min",
    cdSeg: "Seg",
    // Ubicación
    ubiEyebrow: "Te esperamos en",
    ubiTitle: "El Lugar",
    ubiTipo: "Recepción",
    ubiBtn: "Cómo Llegar",
    // Itinerario
    itinEyebrow: "El orden de la noche",
    itinTitle: "Itinerario",
    itinEventos: [
      { time: "5:00 – 6:00 PM", name: "Hora de cóctel", desc: "" },
      { time: "6:00 – 8:00 PM", name: "Cena", desc: "" },
      { time: "8:00 PM", name: "Bailes sorpresa", desc: "" },
      { time: "8:30 PM", name: "Corte de pastel", desc: "" },
      { time: "9:00 PM – 12:00 AM", name: "Fiesta", desc: "" },
    ],
    // Calendario
    calEyebrow: "No lo olvides",
    calTitle: "Guárdalo",
    calSub: "Agrega el evento a tu calendario",
    calBtn: "Añadir a Google Calendar",
    // Dress code
    dcEyebrow: "Código de Vestimenta",
    dcTitle: "Dress Code",
    dcFormal: "Formal",
    dcCaballeros: "Caballeros",
    dcCaballerosSub: "traje formal",
    dcDamas: "Damas",
    dcDamasSub: "vestido largo",
    dcEvitar: "Estos colores están restringidos",
    dcColores: [
      { hex: "#a67b01", nombre: "Dorado" },
      { hex: "#b1dd8b", nombre: "Verde claro" },
      { hex: "#efcaff", nombre: "Lila" },
      { hex: "#263e0f", nombre: "Verde oscuro" },
    ],
    // Mesa de regalos
    mrEyebrow: "Obsequios",
    mrTitle: "Mesa de Regalos",
    mrTexto: "Tu presencia es mi mejor regalo.",
    mrLluvia: "Lluvia de Sobres",
    mrLluviaSub: "Un sobre con tu bendición llenará mi corazón de alegría.",
    mrToca: "Toca el sobre",
    // Álbum de fotos
    albumEyebrow: "Comparte la noche",
    albumTitulo: "Álbum de Fotos",
    albumTexto: "Escanea el código y comparte conmigo las fotos que tomes esa noche.",
    albumBtn: "Ir al álbum",
    // Solo adultos
    adultosTitulo: "Sin niños menores de 8 años",
    adultosTexto: "Con todo cariño, te pedimos no llevar niños menores de 8 años a esta celebración.",
    // RSVP
    rsvpEyebrow: "Confirmación de Asistencia",
    rsvpTitle1: "Tu presencia ",
    rsvpTitle2: "lo es",
    rsvpTitle3: " todo",
    rsvpTextoA: "Por favor confirma tu asistencia antes del ",
    rsvpFechaLimite: "15 de enero de 2027",
    rsvpTextoB: ". Me encantará saber que estarás conmigo en esta noche tan especial.",
    rsvpPara: "Esta invitación es para",
    rsvpPases: "Pases",
    rsvpSi: "Asistiré",
    rsvpNo: "No podré asistir",
    rsvpNombre1: "Tu nombre completo",
    rsvpNombreN: "Invitado",
    rsvpConfirmar: "Confirmar",
    rsvpActualizar: "Actualizar respuesta",
    rsvpEnviando: "Enviando…",
    rsvpCerrado: "Fecha límite alcanzada",
    rsvpSoloAdultosA: "Con todo cariño, te pedimos ",
    rsvpSoloAdultosB: "no llevar niños menores de 8 años",
    rsvpLimite: "Fecha límite · 15 de enero 2027",
    rsvpErrElige: "Por favor selecciona si asistirás o no.",
    rsvpErrNombre: "Por favor escribe al menos un nombre.",
    rsvpErrRed: "Error de conexión. Intenta de nuevo.",
    rsvpOkSi: "¡Tu asistencia ha sido confirmada! Nos vemos pronto.",
    rsvpOkNo: "Hemos registrado que no podrás asistir. ¡Gracias por avisarnos!",
    rsvpYaSi: "¡Ya tienes confirmada tu asistencia! Puedes actualizar tu respuesta.",
    rsvpYaNo: "Ya tienes registrado que no podrás asistir. Puedes cambiar tu respuesta.",
    // Cierre
    closeMsg: "Este día ha vivido en mis sueños, y su verdadera magia será estar rodeada de quienes han caminado conmigo.",
    // Footer
    footFecha: "30 · Enero · 2027",
    footCredito: "Con mucho cariño por",
  },
  en: {
    navMenu: "Menu",
    navSecs: ["Cover","Gallery","Family","Countdown","Venue","Itinerary","Dress code","Gifts","RSVP","Album"],
    splashSub: "My Sweet 16",
    splashBtn: "Tap to open",
    langTitle: "Choose your language",
    langEs: "Español",
    langEn: "English",
    introLineas: [
      "There are moments we imagine, dream of and wait for…",
      "One of them is finally here, and I wish to share it with my dearest people.",
      "You are one of them.",
    ],
    xvAnios: "Sweet",
    fecha: "January · 30 · 2027",
    carTitle: "Miah Alana",
    carHint: "Drag to spin",
    famEyebrow: "With the blessing of",
    famTitle: "My Family",
    famPadres: "My Parents",
    porConfirmar: "To be confirmed",
    cdTitle: "Counting down",
    cdSub: "To this very special day",
    cdFoot: "Every second closer to celebrating together",
    cdDias: "Days",
    cdHoras: "Hours",
    cdMin: "Min",
    cdSeg: "Sec",
    ubiEyebrow: "We'll be waiting at",
    ubiTitle: "The Venue",
    ubiTipo: "Reception",
    ubiBtn: "Get Directions",
    itinEyebrow: "How the night unfolds",
    itinTitle: "Itinerary",
    itinEventos: [
      { time: "5:00 – 6:00 PM", name: "Cocktail Hour", desc: "" },
      { time: "6:00 – 8:00 PM", name: "Dinner", desc: "" },
      { time: "8:00 PM", name: "Surprise Dances", desc: "" },
      { time: "8:30 PM", name: "Cake Cutting", desc: "" },
      { time: "9:00 PM – 12:00 AM", name: "Party", desc: "" },
    ],
    calEyebrow: "Don't forget",
    calTitle: "Save the Date",
    calSub: "Add the event to your calendar",
    calBtn: "Add to Google Calendar",
    dcEyebrow: "Dress Code",
    dcTitle: "Dress Code",
    dcFormal: "Formal",
    dcCaballeros: "Gentlemen",
    dcCaballerosSub: "formal suit",
    dcDamas: "Ladies",
    dcDamasSub: "long dress",
    dcEvitar: "These colors are restricted",
    dcColores: [
      { hex: "#a67b01", nombre: "Gold" },
      { hex: "#b1dd8b", nombre: "Light green" },
      { hex: "#efcaff", nombre: "Lilac" },
      { hex: "#263e0f", nombre: "Dark green" },
    ],
    mrEyebrow: "Gifts",
    mrTitle: "Gift Registry",
    mrTexto: "Your love and presence are the greatest gift I could receive. If you wish to give me something, it will be warmly appreciated.",
    mrLluvia: "Shower of Envelopes",
    mrLluviaSub: "An envelope with your blessing will fill my heart with joy.",
    mrToca: "Tap the envelope",
    albumEyebrow: "Share the night",
    albumTitulo: "Photo Album",
    albumTexto: "Scan the code and share with me the photos you take that night.",
    albumBtn: "Go to the album",
    adultosTitulo: "No children under 8",
    adultosTexto: "With all our love, we kindly ask that children under 8 not attend this celebration.",
    rsvpEyebrow: "Please Reply",
    rsvpTitle1: "Your presence ",
    rsvpTitle2: "is",
    rsvpTitle3: " everything",
    rsvpTextoA: "Please confirm your attendance before ",
    rsvpFechaLimite: "January 15, 2027",
    rsvpTextoB: ". It would mean the world to know you'll be with me on this special night.",
    rsvpPara: "This invitation is for",
    rsvpPases: "Passes",
    rsvpSi: "I'll be there",
    rsvpNo: "I can't make it",
    rsvpNombre1: "Your full name",
    rsvpNombreN: "Guest",
    rsvpConfirmar: "Confirm",
    rsvpActualizar: "Update reply",
    rsvpEnviando: "Sending…",
    rsvpCerrado: "Deadline reached",
    rsvpSoloAdultosA: "With all our love, we ask ",
    rsvpSoloAdultosB: "no children under 8",
    rsvpLimite: "Deadline · January 15, 2027",
    rsvpErrElige: "Please select whether you'll attend.",
    rsvpErrNombre: "Please enter at least one name.",
    rsvpErrRed: "Connection error. Please try again.",
    rsvpOkSi: "Your attendance is confirmed! See you soon.",
    rsvpOkNo: "We've noted that you can't make it. Thank you for letting us know!",
    rsvpYaSi: "You already confirmed your attendance! You can update your reply.",
    rsvpYaNo: "We have you down as unable to attend. You can change your reply.",
    closeMsg: "This day has lived in my dreams, and its true magic will be having beside me those who walked this path with me.",
    footFecha: "January · 30 · 2027",
    footCredito: "Made with love by",
  },
};

export type Dict = (typeof TEXTS)["es"];

const LangContext = createContext<Lang>("es");

export const LangProvider = LangContext.Provider;

/** Textos del idioma activo. */
export function useT(): Dict {
  const lang = useContext(LangContext);
  return TEXTS[lang];
}

/** Idioma activo ("es" | "en"). */
export function useLang(): Lang {
  return useContext(LangContext);
}
