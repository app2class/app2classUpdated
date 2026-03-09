import { useState, useEffect } from "react";

const BASE_URL = "https://raw.githubusercontent.com/app2class/app2classUpdated/main/";

// 3 face types only
const FACE_TYPES = ["base", "tall", "wide"];
const FACE_TYPE_LABELS = ["בסיסי", "גבוה", "רחב"];

const FACE_SVG_MAP = {
  "base": "base face.svg",
  "tall": "thiner taller face.svg",
  "wide": "wider face.svg",
};

// Hair SVGs per face type
const HAIR_SVG_MAP = {
  "base": {
    "boy":       "base boy hair.svg",
    "curly":     "base face curly short hair.svg",
    "mullet":    "base mullet boy hair.svg",
    "girl_long": "girl base long hair.svg",
    "none":      null,
  },
  "tall": {
    "boy":       "tall face base boy hair.svg",
    "curly":     "tall face short curly hair.svg",
    "mullet":    "tall boy mullet hair.svg",
    "girl_long": "tall face girl long hair.svg",
    "none":      null,
  },
  "wide": {
    "boy":       "wider face boy hair.svg",
    "curly":     "wide face short curly hair.svg",
    "mullet":    "wide boy ullet hair.svg",
    "girl_long": "widw face girl long hair.svg",
    "none":      null,
  },
};

const HAIR_STYLES = ["boy", "curly", "mullet", "girl_long", "none"];
const HAIR_STYLE_LABELS = ["ילד קצר", "מתולתל קצר", "מאלט", "ארוך בנות", "ללא שיער"];

const SKIN_COLORS = [
  { label: "בהיר מאוד", hex: "#FDDBB4" },
  { label: "בהיר",      hex: "#F5C5A3" },
  { label: "חיטה",      hex: "#E0AC69" },
  { label: "חום בינוני",hex: "#C68642" },
  { label: "כהה",       hex: "#8D5524" },
  { label: "כהה מאוד",  hex: "#4A2912" },
];

function url(filename) {
  return BASE_URL + encodeURIComponent(filename);
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substr(0, 2), 16),
    g: parseInt(h.substr(2, 2), 16),
    b: parseInt(h.substr(4, 2), 16),
  };
}

// Face SVGs contain embedded PNG images — we use CSS filter to tint skin tone
// Base face has a light-peach skin tone baked in
const SKIN_CSS_FILTER = {
  "#FDDBB4": "brightness(1.08) saturate(0.8)",
  "#F5C5A3": "brightness(1.0) saturate(1.0)",
  "#E0AC69": "sepia(0.3) saturate(1.4) brightness(0.9)",
  "#C68642": "sepia(0.55) saturate(2) brightness(0.78)",
  "#8D5524": "sepia(0.75) saturate(2.2) brightness(0.55)",
  "#4A2912": "sepia(0.9) saturate(2) brightness(0.32)",
};

// For hair SVGs: replace ALL colored fills with hair color (keep only near-black outlines)
function replaceHairColors(text, hairColor) {
  const hexRegex = /#([0-9A-Fa-f]{6})\b/g;
  const found = new Set();
  let m;
  while ((m = hexRegex.exec(text)) !== null) found.add(m[1].toUpperCase());

  let result = text;
  for (const hex of found) {
    const { r, g, b } = hexToRgb(hex);
    const sum = r + g + b;
    const isVeryDark = sum < 80;
    const isVeryLight = r > 230 && g > 230 && b > 230;
    if (!isVeryDark && !isVeryLight) {
      result = result.replace(new RegExp(`#${hex}`, "gi"), hairColor);
    }
  }
  return result;
}

function useFaceSvg(svgUrl) {
  const [content, setContent] = useState("");
  useEffect(() => {
    if (!svgUrl) { setContent(""); return; }
    fetch(svgUrl).then(r => r.text()).then(text => setContent(text)).catch(() => setContent(""));
  }, [svgUrl]);
  return content;
}

function useHairSvg(svgUrl, hairColor) {
  const [content, setContent] = useState("");
  useEffect(() => {
    if (!svgUrl) { setContent(""); return; }
    fetch(svgUrl).then(r => r.text()).then(text => setContent(replaceHairColors(text, hairColor))).catch(() => setContent(""));
  }, [svgUrl, hairColor]);
  return content;
}

const HAIR_COLORS = [
  { label: "שחור",     hex: "#1a0f0a" },
  { label: "חום כהה",  hex: "#3D2314" },
  { label: "חום",      hex: "#8B4513" },
  { label: "ג'ינג'י",  hex: "#b5451b" },
  { label: "בלונד",    hex: "#D4A017" },
  { label: "אפור",     hex: "#7f8c8d" },
];

function AvatarPreview({ avatar }) {
  const faceType = avatar.face_type || "base";
  const hairStyle = avatar.hair_style || "boy";
  const skinColor = avatar.skin || "#FDDBB4";
  const hairColor = avatar.hair_color || "#3D2314";

  const faceFilename = FACE_SVG_MAP[faceType];
  const hairFilename = HAIR_SVG_MAP[faceType]?.[hairStyle] || null;

  const faceSvg = useFaceSvg(faceFilename ? url(faceFilename) : null);
  const hairSvg = useHairSvg(hairFilename ? url(hairFilename) : null, hairColor);
  const skinFilter = SKIN_CSS_FILTER[skinColor] || SKIN_CSS_FILTER["#F5C5A3"];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-40 h-40 flex items-center justify-center bg-white/5 rounded-2xl overflow-hidden">
        {/* Face layer */}
        {faceSvg && (
          <div
            className="absolute inset-0 w-full h-full"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", filter: skinFilter }}
            dangerouslySetInnerHTML={{ __html: faceSvg
              .replace(/<svg/, '<svg style="width:100%;height:100%;object-fit:contain"') }}
          />
        )}
        {/* Hair layer */}
        {hairSvg && (
          <div
            className="absolute inset-0 w-full h-full"
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            dangerouslySetInnerHTML={{ __html: hairSvg
              .replace(/<svg/, '<svg style="width:100%;height:100%;object-fit:contain"') }}
          />
        )}
        {!faceSvg && (
          <div className="w-16 h-16 rounded-full bg-white/10 animate-pulse" />
        )}
      </div>
      <p className="text-white/60 text-xs">תצוגה מקדימה</p>
    </div>
  );
}

export default function AvatarStudio({ avatar, onChange }) {
  const update = (key, val) => onChange({ ...avatar, [key]: val });

  const faceType = avatar.face_type || "base";

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex justify-center">
        <AvatarPreview avatar={avatar} />
      </div>

      {/* Face Type */}
      <div>
        <label className="text-white/80 text-sm font-medium mb-2 block">מבנה פנים</label>
        <div className="grid grid-cols-3 gap-2">
          {FACE_TYPES.map((ft, i) => (
            <button key={ft} onClick={() => update("face_type", ft)}
              className={`py-1.5 px-2 rounded-xl border-2 text-xs font-medium transition-all ${avatar.face_type === ft ? "border-yellow-400 bg-yellow-400/20 text-yellow-400" : "border-white/20 text-white/60 hover:border-white/40"}`}>
              {FACE_TYPE_LABELS[i]}
            </button>
          ))}
        </div>
      </div>

      {/* Skin Color */}
      <div>
        <label className="text-white/80 text-sm font-medium mb-2 block">גוון עור</label>
        <div className="flex gap-2 flex-wrap">
          {SKIN_COLORS.map(({ hex, label }) => (
            <button
              key={hex}
              title={label}
              onClick={() => update("skin", hex)}
              className="w-9 h-9 rounded-full transition-all hover:scale-110"
              style={{
                backgroundColor: hex,
                border: avatar.skin === hex ? "3px solid #FBBF24" : "2px solid rgba(255,255,255,0.3)",
                transform: avatar.skin === hex ? "scale(1.15)" : undefined,
                boxShadow: avatar.skin === hex ? "0 0 8px #FBBF2488" : undefined,
              }}
            />
          ))}
        </div>
      </div>

      {/* Hair Style */}
      <div>
        <label className="text-white/80 text-sm font-medium mb-2 block">סגנון שיער</label>
        <div className="grid grid-cols-3 gap-2">
          {HAIR_STYLES.map((s, i) => (
            <button key={s} onClick={() => update("hair_style", s)}
              className={`py-1.5 px-2 rounded-lg border text-xs transition-all ${avatar.hair_style === s ? "border-yellow-400 bg-yellow-400/20 text-yellow-400" : "border-white/20 text-white/60 hover:border-white/40"}`}>
              {HAIR_STYLE_LABELS[i]}
            </button>
          ))}
        </div>
      </div>

      {/* Hair Color */}
      <div>
        <label className="text-white/80 text-sm font-medium mb-2 block">צבע שיער</label>
        <div className="flex gap-2 flex-wrap">
          {HAIR_COLORS.map(({ hex, label }) => (
            <button
              key={hex}
              title={label}
              onClick={() => update("hair_color", hex)}
              className="w-9 h-9 rounded-full transition-all hover:scale-110"
              style={{
                backgroundColor: hex,
                border: avatar.hair_color === hex ? "3px solid #FBBF24" : "2px solid rgba(255,255,255,0.3)",
                transform: avatar.hair_color === hex ? "scale(1.15)" : undefined,
                boxShadow: avatar.hair_color === hex ? "0 0 8px #FBBF2488" : undefined,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}