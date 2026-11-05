"use client";

/* Divisor entre secciones — la línea recorre lila → dorado → verde pastel */
export default function Ornament() {
  return (
    <div className="flex justify-center py-3 px-4">
      <svg viewBox="0 0 300 42" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 300, height: 42 }}>
        <defs>
          <linearGradient id="orn-left" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#D9A3AA" stopOpacity="0" />
            <stop offset="45%" stopColor="#D9A3AA" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8C4F59" />
          </linearGradient>
          <linearGradient id="orn-right" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8C4F59" />
            <stop offset="55%" stopColor="#8C4F59" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8C4F59" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="20" x2="96" y2="20" stroke="url(#orn-left)" strokeWidth="0.85" opacity="0.75" />
        <line x1="0" y1="23" x2="88" y2="23" stroke="url(#orn-left)" strokeWidth="0.38" opacity="0.35" />
        <path d="M96 21.5 Q104 7 116 21.5" stroke="#D9A3AA" strokeWidth="0.95" fill="none" opacity="0.6" />
        <path d="M122 21.5 L126.5 15.5 L131 21.5 L126.5 27.5 Z" fill="#D9A3AA" fillOpacity="0.5" stroke="#D9A3AA" strokeWidth="0.4" opacity="0.7" />
        <path d="M150 6 L165 21.5 L150 37 L135 21.5 Z" fill="rgba(233,201,205,0.22)" stroke="#B76E79" strokeWidth="1.05" opacity="0.7" />
        <circle cx="150" cy="21.5" r="4.5" fill="rgba(217,163,170,0.35)" stroke="#B76E79" strokeWidth="0.7" opacity="0.85" />
        <path d="M169 21.5 L173.5 15.5 L178 21.5 L173.5 27.5 Z" fill="#8C4F59" fillOpacity="0.5" stroke="#8C4F59" strokeWidth="0.4" opacity="0.7" />
        <path d="M184 21.5 Q196 7 204 21.5" stroke="#8C4F59" strokeWidth="0.95" fill="none" opacity="0.6" />
        <line x1="204" y1="20" x2="300" y2="20" stroke="url(#orn-right)" strokeWidth="0.85" opacity="0.75" />
        <line x1="212" y1="23" x2="300" y2="23" stroke="url(#orn-right)" strokeWidth="0.38" opacity="0.35" />
      </svg>
    </div>
  );
}
