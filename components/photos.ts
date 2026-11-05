// ══════════════════════════════════════════════════════════════
//  FOTOS DE LA FESTEJADA — Miah Alana Banda (Sweet 16)
//  Las 8 fotos que subió el cliente al formulario (Supabase).
// ══════════════════════════════════════════════════════════════
const B = "https://bsjoelxktbvlavfoozhk.supabase.co/storage/v1/object/public/fotos-clientes/img/xv-miah-banda";

export const ALL = [
  `${B}/m1.jpg`,
  `${B}/m2.jpg`,
  `${B}/m3.jpg`,
  `${B}/m4.jpg`,
  `${B}/m5.jpg`,
  `${B}/m6.jpg`,
  `${B}/m7.jpg`,
  `${B}/m8.jpg`,
];

export const PHOTOS = {
  hero: ALL[6],
  framed: ALL[1],
  framed2: ALL[4],
  closing: ALL[3],
};

/** Fotos de la galería 3D (sin repetir las del hero/marcos/cierre si alcanza). */
export const GALLERY = ALL;
