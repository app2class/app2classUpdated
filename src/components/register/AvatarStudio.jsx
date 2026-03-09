import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const BASE_URL = "https://raw.githubusercontent.com/app2class/app2classUpdated/main/";

// Eye color options → base body SVG
const EYE_COLORS = [
  { label: "חום",       key: "brown",      hex: "#8B4513", file: "basic body brown eyes.svg" },
  { label: "חום כהה",   key: "brown_dark", hex: "#3B1A00", file: "basic body brown dark eyes.svg" },
  { label: "כחול",      key: "blue",       hex: "#4A90D9", file: "basic body blue eyes.svg" },
  { label: "כחול כהה",  key: "blue_dark",  hex: "#1A3A6B", file: "basic body blue dark eyes.svg" },
  { label: "ירוק",      key: "green",      hex: "#4CAF50", file: "basic body green eyes.svg" },
  { label: "ירוק כהה",  key: "green_dark", hex: "#1A4A1A", file: "basic body green dark eyes.svg" },
];

// Hair styles for "basic" body
const HAIR_STYLES = [
  { key: "boy",          label: "ילד קצר",       file: "base boy hair.svg" },
  { key: "curly",        label: "מתולתל קצר",    file: "base face curly short hair.svg" },
  { key: "mullet",       label: "מאלט",           file: "base mullet boy hair.svg" },
  { key: "girl_long",    label: "ארוך בנות",      file: "girl base long hair.svg" },
  { key: "bun",          label: "שיער קשור",      file: "basic body girl bun hair.svg" },
  { key: "curly_long",   label: "מתולתל ארוך",   file: "basic body girl curly long hair.svg" },
  { key: "ponytail",     label: "קוקו",           file: "basic girl ponytail hair.svg" },
  { key: "none",         label: "ללא שיער",       file: null },
];

const SKIN_COLORS = [
  { label: "לבן שנהב",  hex: "#FEECD2" },
  { label: "בהיר מאוד", hex: "#FDDBB4" },
  { label: "בהיר",      hex: "#F5C5A3" },
  { label: "אפרסק",     hex: "#EEB98A" },
  { label: "חיטה",      hex: "#E0AC69" },
  { label: "זהוב",      hex: "#D4915A" },
  { label: "חום בינוני",hex: "#C68642" },
  { label: "חום",       hex: "#A0622A" },
  { label: "כהה",       hex: "#8D5524" },
  { label: "כהה מאוד",  hex: "#6B3A1F" },
  { label: "שחום",      hex: "#4A2912" },
  { label: "שחור עור",  hex: "#2D1A0E" },
];

const SKIN_CSS_FILTER = {
  "#FEECD2": "brightness(1.15) saturate(0.6)",
  "#FDDBB4": "brightness(1.08) saturate(0.8)",
  "#F5C5A3": "brightness(1.0) saturate(1.0)",
  "#EEB98A": "sepia(0.2) saturate(1.2) brightness(0.95)",
  "#E0AC69": "sepia(0.3) saturate(1.4) brightness(0.9)",
  "#D4915A": "sepia(0.4) saturate(1.6) brightness(0.84)",
  "#C68642": "sepia(0.55) saturate(2) brightness(0.78)",
  "#A0622A": "sepia(0.65) saturate(2.1) brightness(0.66)",
  "#8D5524": "sepia(0.75) saturate(2.2) brightness(0.55)",
  "#6B3A1F": "sepia(0.85) saturate(2.1) brightness(0.44)",
  "#4A2912": "sepia(0.9) saturate(2) brightness(0.32)",
  "#2D1A0E": "sepia(1) saturate(1.8) brightness(0.2)",
};

const HAIR_COLORS = [
  { label: "שחור",        hex: "#0D0D0D" },
  { label: "חום כהה",     hex: "#2C1A0E" },
  { label: "חום",         hex: "#5C3317" },
  { label: "חום בינוני",  hex: "#8B4513" },
  { label: "חום אדמדם",   hex: "#A0522D" },
  { label: "ג'ינג'י כהה", hex: "#8B2500" },
  { label: "ג'ינג'י",     hex: "#C0392B" },
  { label: "ג'ינג'י בהיר",hex: "#E8603C" },
  { label: "בלונד כהה",   hex: "#B8860B" },
  { label: "בלונד",       hex: "#D4A017" },
  { label: "בלונד בהיר",  hex: "#F0C040" },
  { label: "אפור",        hex: "#808080" },
  { label: "אפור בהיר",   hex: "#B0B0B0" },
  { label: "לבן",         hex: "#E8E8E8" },
];

function url(filename) {
  return BASE_URL + encodeURIComponent(filename);
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return { r: parseInt(h.substr(0,2),16), g: parseInt(h.substr(2,2),16), b: parseInt(h.substr(4,2),16) };
}

function replaceHairColors(text, hairColor) {
  // Replace ALL non-white, non-skin colors with the chosen hair color
  // White/near-white (background fills) are kept, everything else becomes hair color
  const hexRegex = /#([0-9A-Fa-f]{6})\b/g;
  const found = new Set();
  let m;
  while ((m = hexRegex.exec(text)) !== null) found.add(m[1].toUpperCase());
  let result = text;
  for (const hex of found) {
    const { r, g, b } = hexToRgb(hex);
    const isWhiteOrNearWhite = r > 240 && g > 240 && b > 240;
    const isSkinLike = r > 200 && g > 160 && b > 120 && r > g && g > b;
    if (!isWhiteOrNearWhite && !isSkinLike) {
      result = result.replace(new RegExp(`#${hex}`, "gi"), hairColor);
    }
  }
  return result;
}

function useSvg(svgUrl) {
  const [content, setContent] = useState("");
  useEffect(() => {
    if (!svgUrl) { setContent(""); return; }
    fetch(svgUrl).then(r => r.text()).then(setContent).catch(() => setContent(""));
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

function inlineSvg(raw) {
  return raw.replace(/<svg/, '<svg style="width:100%;height:100%;object-fit:contain"');
}

function AvatarPreview({ avatar }) {
  const eyeColorKey = avatar.eye_color || "brown";
  const hairStyleKey = avatar.hair_style || "boy";
  const skinColor = avatar.skin || "#FDDBB4";
  const hairColor = avatar.hair_color || "#2C1A0E";

  const eyeEntry = EYE_COLORS.find(e => e.key === eyeColorKey) || EYE_COLORS[0];
  const hairEntry = HAIR_STYLES.find(h => h.key === hairStyleKey) || HAIR_STYLES[0];

  const bodyUrl = url(eyeEntry.file);
  const hairUrl = hairEntry.file ? url(hairEntry.file) : null;

  const bodySvg = useSvg(bodyUrl);
  const hairSvg = useHairSvg(hairUrl, hairColor);
  const skinFilter = SKIN_CSS_FILTER[skinColor] || SKIN_CSS_FILTER["#F5C5A3"];

  return (
    <div className="flex flex-col items-center gap-2">
      {/* White background so mix-blend-mode:multiply works correctly */}
      <div className="relative w-44 h-44 flex items-center justify-center bg-white rounded-2xl overflow-hidden shadow-md">
        {bodySvg ? (
          <div
            className="absolute inset-0 w-full h-full flex items-center justify-center"
            style={{ filter: skinFilter }}
            dangerouslySetInnerHTML={{ __html: inlineSvg(bodySvg) }}
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-100 animate-pulse" />
        )}
        {hairSvg && (
          <div
            className="absolute inset-0 w-full h-full flex items-center justify-center"
            style={{ mixBlendMode: "multiply" }}
            dangerouslySetInnerHTML={{ __html: inlineSvg(hairSvg) }}
          />
        )}
      </div>
      <p className="text-white/60 text-xs">תצוגה מקדימה</p>
    </div>
  );
}

export default function AvatarStudio({ avatar, onChange }) {
  const update = (key, val) => onChange({ ...avatar, [key]: val });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe({ avatar });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex justify-center">
        <AvatarPreview avatar={avatar} />
      </div>

      {/* Eye Color */}
      <div>
        <label className="text-white/80 text-sm font-medium mb-2 block">צבע עיניים</label>
        <div className="flex gap-2 flex-wrap">
          {EYE_COLORS.map(({ key, hex, label }) => (
            <button
              key={key}
              title={label}
              onClick={() => update("eye_color", key)}
              className="w-9 h-9 rounded-full transition-all hover:scale-110"
              style={{
                backgroundColor: hex,
                border: avatar.eye_color === key ? "3px solid #FBBF24" : "2px solid rgba(255,255,255,0.3)",
                transform: avatar.eye_color === key ? "scale(1.15)" : undefined,
                boxShadow: avatar.eye_color === key ? "0 0 8px #FBBF2488" : undefined,
              }}
            />
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
        <div className="grid grid-cols-4 gap-2">
          {HAIR_STYLES.map(({ key, label }) => (
            <button key={key} onClick={() => update("hair_style", key)}
              className={`py-1.5 px-1 rounded-lg border text-xs transition-all ${avatar.hair_style === key ? "border-yellow-400 bg-yellow-400/20 text-yellow-400" : "border-white/20 text-white/60 hover:border-white/40"}`}>
              {label}
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

      {/* Save Button */}
      <div className="pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
            saved ? "bg-green-500 text-white" : "bg-yellow-400 hover:bg-yellow-300 text-slate-900"
          } disabled:opacity-60`}
        >
          {saving ? "שומר..." : saved ? "✓ האווטאר עודכן בהצלחה!" : "שמור אווטאר"}
        </button>
      </div>
    </div>
  );
}