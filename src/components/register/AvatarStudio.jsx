import { useState } from "react";

const BASE_URL = "https://raw.githubusercontent.com/app2class/app2classUpdated/main/";

const FACE_TYPES = ["base", "tall", "wide", "wider", "thiner_taller"];
const FACE_TYPE_LABELS = ["בסיסי", "גבוה", "רחב", "רחב יותר", "דק וגבוה"];

const HAIR_STYLES = ["boy", "curly_short", "mullet", "girl_long", "none"];
const HAIR_STYLE_LABELS = ["ילד קצר", "מתולתל קצר", "מאלט", "ארוך בנות", "ללא שיער"];

// Mapping face_type + hair_style → SVG filename
const SVG_MAP = {
  "base_boy":          "base boy hair.svg",
  "base_curly_short":  "base face curly short hair.svg",
  "base_mullet":       "base mullet boy hair.svg",
  "base_girl_long":    "girl base long hair.svg",
  "base_none":         "base face.svg",
  "tall_boy":          "tall face base boy hair.svg",
  "tall_mullet":       "tall boy mullet hair.svg",
  "tall_girl_long":    "tall face girl long hair.svg",
  "tall_curly_short":  "tall face short curly hair.svg",
  "tall_none":         "thiner taller face.svg",
  "wide_mullet":       "wide boy ullet hair.svg",
  "wide_curly_short":  "wide face short curly hair.svg",
  "wide_girl_long":    "widw face girl long hair.svg",
  "wide_boy":          "wider face boy hair.svg",
  "wide_none":         "wider face.svg",
  "wider_boy":         "wider face boy hair.svg",
  "wider_none":        "wider face.svg",
  "thiner_taller_none":"thiner taller face.svg",
};

function getSvgUrl(face_type, hair_style) {
  const key = `${face_type}_${hair_style}`;
  const filename = SVG_MAP[key] || SVG_MAP[`${face_type}_none`] || SVG_MAP["base_none"];
  return BASE_URL + encodeURIComponent(filename);
}

const EXPRESSIONS = ["happy", "curious", "serious", "energetic", "friendly"];
const EXPRESSION_LABELS = ["חיוכי", "סקרן", "רציני", "אנרגטי", "ידידותי"];
const EXPRESSION_EMOJIS = ["😊", "🤔", "😐", "⚡", "🙂"];
const ACCESSORIES = ["none", "glasses_round", "glasses_square", "kippa", "hijab", "turban"];
const ACCESSORIES_LABELS = ["ללא", "משקפיים עגולות", "משקפיים מרובעות", "כיפה", "חיג'אב", "מטפחת"];

function AvatarPreview({ avatar }) {
  const svgUrl = getSvgUrl(avatar.face_type || "base", avatar.hair_style || "boy");

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36 flex items-center justify-center bg-white/5 rounded-2xl overflow-hidden">
        <img
          src={svgUrl}
          alt="avatar"
          className="w-full h-full object-contain"
        />
      </div>
      <p className="text-white/60 text-xs">תצוגה מקדימה</p>
    </div>
  );
}

export default function AvatarStudio({ avatar, onChange }) {
  const update = (key, val) => onChange({ ...avatar, [key]: val });

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

      {/* Expression */}
      <div>
        <label className="text-white/80 text-sm font-medium mb-2 block">הבעת פנים</label>
        <div className="flex gap-2 flex-wrap">
          {EXPRESSIONS.map((ex, i) => (
            <button key={ex} onClick={() => update("expression", ex)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-sm transition-all ${avatar.expression === ex ? "border-yellow-400 bg-yellow-400/20 text-yellow-400" : "border-white/20 text-white/60 hover:border-white/40"}`}>
              <span>{EXPRESSION_EMOJIS[i]}</span>
              <span>{EXPRESSION_LABELS[i]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accessories */}
      <div>
        <label className="text-white/80 text-sm font-medium mb-2 block">אקססוריז</label>
        <div className="grid grid-cols-2 gap-2">
          {ACCESSORIES.map((acc, i) => (
            <button key={acc} onClick={() => update("accessory", acc)}
              className={`py-1.5 px-3 rounded-lg border text-sm transition-all ${avatar.accessory === acc ? "border-yellow-400 bg-yellow-400/20 text-yellow-400" : "border-white/20 text-white/60 hover:border-white/40"}`}>
              {ACCESSORIES_LABELS[i]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}