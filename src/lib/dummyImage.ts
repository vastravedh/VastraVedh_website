/**
 * Generates attractive branded dummy images as inline SVG data URIs.
 *
 * These are used until real photos are uploaded. Because they're data URIs
 * (not files), they never 404 and never hit Next.js image optimization, so
 * there are no "received null" errors.
 *
 * The artwork is the brand "VV" monogram: the first V has decorative
 * saree/vine styling and the second V is paired with a woman-in-saree
 * silhouette. Only the BACKGROUND colour changes between variants, so a
 * category can show several cards that share the same mark but differ by
 * colour.
 */

export interface Swatch {
  name: string;
  bg: string; // panel background
  bgTo: string; // gradient end
  figure: string; // saree/figure colour
  accent: string; // gold-ish accent
}

// Brand-aligned colour swatches. Maroon + gold stay central; a few
// complementary festive tones give variety across cards.
export const SWATCHES: Record<string, Swatch> = {
  maroon: { name: "Maroon", bg: "#7B0F2B", bgTo: "#5C0A20", figure: "#F7F2E7", accent: "#D4AF37" },
  gold: { name: "Gold", bg: "#C9A227", bgTo: "#A6851C", figure: "#5C0A20", accent: "#F7F2E7" },
  emerald: { name: "Emerald", bg: "#1E5B4F", bgTo: "#123E36", figure: "#F7F2E7", accent: "#D4AF37" },
  royal: { name: "Royal Blue", bg: "#1E3A5F", bgTo: "#122740", figure: "#F7F2E7", accent: "#D4AF37" },
  rani: { name: "Rani Pink", bg: "#A6194C", bgTo: "#7A1138", figure: "#F7F2E7", accent: "#D4AF37" },
  teal: { name: "Teal", bg: "#0F6E6E", bgTo: "#0A4E4E", figure: "#F7F2E7", accent: "#D4AF37" },
  mustard: { name: "Mustard", bg: "#B8860B", bgTo: "#8B6508", figure: "#5C0A20", accent: "#F7F2E7" },
  plum: { name: "Plum", bg: "#5D2A5A", bgTo: "#411D3F", figure: "#F7F2E7", accent: "#D4AF37" },
  cream: { name: "Cream", bg: "#EFE7D2", bgTo: "#E3D7B8", figure: "#7B0F2B", accent: "#C9A227" },
};

export function swatchFor(colorName: string): Swatch {
  const key = colorName.trim().toLowerCase();
  const map: Record<string, keyof typeof SWATCHES> = {
    maroon: "maroon",
    wine: "maroon",
    gold: "gold",
    golden: "gold",
    green: "emerald",
    emerald: "emerald",
    blue: "royal",
    "royal blue": "royal",
    navy: "royal",
    pink: "rani",
    "rani pink": "rani",
    teal: "teal",
    mustard: "mustard",
    yellow: "mustard",
    plum: "plum",
    purple: "plum",
    cream: "cream",
    ivory: "cream",
    white: "cream",
    pastel: "cream",
    black: "plum",
    multi: "maroon",
  };
  return SWATCHES[map[key] ?? "maroon"];
}

/**
 * Build a portrait SVG (3:4) with a saree figure, VV mark and a label.
 * Returned as a data URI usable directly in <Image> / <img> src.
 */
export function dummyImage(opts: {
  swatch: Swatch;
  label?: string;
  sublabel?: string;
}): string {
  const { swatch, label = "VastraVedh", sublabel } = opts;
  const s = swatch;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${s.bg}"/>
      <stop offset="100%" stop-color="${s.bgTo}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="800" fill="url(#bg)"/>
  <!-- decorative frame -->
  <rect x="24" y="24" width="552" height="752" fill="none" stroke="${s.accent}" stroke-width="3" opacity="0.7" rx="10"/>
  <!-- subtle motif dots -->
  <g fill="${s.accent}" opacity="0.14">
    ${Array.from({ length: 6 })
      .map((_, r) =>
        Array.from({ length: 4 })
          .map((_, c) => `<circle cx="${90 + c * 140}" cy="${120 + r * 110}" r="5"/>`)
          .join("")
      )
      .join("")}
  </g>

  <!-- ===== VV monogram (matches the brand logo) ===== -->
  <!-- Two distinct V's, centred. V1 = gold decorative/vine V.
       V2 = maroon figure V whose RIGHT stroke is a woman-in-saree. -->
  <g transform="translate(300 300)">
    <!-- ---- V #1: decorative gold V with vine motif ---- -->
    <!-- left stroke -->
    <path d="M-215 -150 L-170 -150 L-108 130 L-140 130 Z" fill="${s.accent}"/>
    <!-- right stroke (thinner) -->
    <path d="M-70 -150 L-40 -150 L-118 150 L-140 130 Z" fill="${s.accent}"/>
    <!-- vine detailing on the left stroke -->
    <g stroke="${s.bg}" stroke-width="4" fill="none" opacity="0.55" stroke-linecap="round">
      <path d="M-196 -110 C -176 -94, -176 -66, -196 -50 C -176 -34, -176 -6, -196 10"/>
    </g>
    <g fill="${s.bg}" opacity="0.5">
      <circle cx="-188" cy="-102" r="5"/>
      <circle cx="-182" cy="-60" r="5"/>
      <circle cx="-176" cy="-18" r="4"/>
    </g>

    <!-- ---- V #2: figure-colour V ---- -->
    <!-- left stroke (solid) -->
    <path d="M0 -150 L45 -150 L108 130 L76 130 Z" fill="${s.figure}"/>

    <!-- right stroke of V#2 = woman-in-saree silhouette -->
    <g transform="translate(150 0)">
      <!-- head -->
      <circle cx="0" cy="-150" r="28" fill="${s.figure}"/>
      <!-- hair bun / flower accent -->
      <circle cx="-20" cy="-166" r="9" fill="${s.accent}"/>
      <!-- body + saree tapering down to the V point (figure colour) -->
      <path d="M-22 -120 C -40 -70, -50 -10, -60 60 C -68 110, -72 135, -80 150
               L -46 150 C -40 120, -30 60, -16 -8 C -4 -66, 8 -104, 18 -122 Z"
            fill="${s.figure}"/>
      <!-- gold pallu drape falling along the saree -->
      <path d="M14 -118 C 6 -70, -6 -6, -20 60 C -30 108, -40 134, -50 150
               L -74 150 C -66 128, -54 70, -40 4 C -28 -58, -12 -100, 0 -120 Z"
            fill="${s.accent}" opacity="0.95"/>
    </g>
  </g>

  <!-- VV wordmark -->
  <text x="300" y="680" text-anchor="middle" font-family="Georgia, serif"
        font-size="52" font-weight="700" fill="${s.figure}">${escapeXml(label)}</text>
  ${
    sublabel
      ? `<text x="300" y="722" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="${s.accent}">${escapeXml(sublabel)}</text>`
      : ""
  }
</svg>`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
