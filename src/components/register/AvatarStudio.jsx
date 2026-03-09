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

// Known skin tones used in the SVG files
const SKIN_HEX_VARIANTS = [
  "FDDBB4", "F5C5A3", "EAB88C", "E8B48A", "F2C18C", "EDBD9A",
  "D4956A", "C8885F", "C68642", "A0693A", "8D5524", "4A2912",
  // common SVG skin palette
  "FFD5B0", "FFCBA4", "F7C59F", "F0B27A", "E59866", "CA9B6E",
  "BA8D6A", "A97C50", "8B6143", "6F4E37",
];

// Known hair colors used in SVG files
const HAIR_HEX_VARIANTS = [
  "3D2314", "4A2E1A", "5C3317", "6B3A2A", "7B4F3A",
  "8B4513", "704214", "5D3010", "2C1810", "1A0F0A",
  "3B2314", "6B4226", "8B6348",
];

function url(filename) {
  return BASE_URL + encodeURIComponent(filename);
}

function replaceSvgColors(text, skinColor, hairColor) {
  let result = text;
  const skinHex = skinColor.replace("#", "").toUpperCase();
  const hairHex = hairColor ? hairColor.replace("#", "").toUpperCase() : null;

  // Replace skin tones
  for (const variant of SKIN_HEX_VARIANTS) {
    const upper = variant.toUpperCase();
    result = result.replace(new RegExp(`#${upper}`, "gi"), skinColor);
    result = result.replace(new RegExp(`${upper}(?=[^a-fA-F0-9]|$)`, "g"), skinHex);
  }

  // Replace hair colors
  if (hairHex) {
    for (const variant of HAIR_HEX_VARIANTS) {
      const upper = variant.toUpperCase();
      result = result.replace(new RegExp(`#${upper}`, "gi"), hairColor);
      result = result.replace(new RegExp(`${upper}(?=[^a-fA-F0-9]|$)`, "g"), hairHex);
    }
  }

  return result;
}

function useSvgWithColors(svgUrl, skinColor, hairColor) {
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    if (!svgUrl) { setSvgContent(""); return; }
    fetch(svgUrl)
      .then(r => r.text())
      .then(text => setSvgContent(replaceSvgColors(text, skinColor, hairColor)))
      .catch(() => setSvgContent(""));
  }, [svgUrl, skinColor, hairColor]);

  return svgContent;
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

  const faceSvg = useSvgWithColors(faceFilename ? url(faceFilename) : null, skinColor, hairColor);
  const hairSvg = useSvgWithColors(hairFilename ? url(hairFilename) : null, skinColor, hairColor);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-40 h-40 flex items-center justify-center bg-white/5 rounded-2xl overflow-hidden">
        {/* Face layer */}
        {faceSvg && (
          <div
            className="absolute inset-0 w-full h-full"
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
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
    </div>
  );
}