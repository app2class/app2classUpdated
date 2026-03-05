import { useState } from "react";

const SKIN_COLORS = ["#FDDBB4", "#F1C27D", "#E0AC69", "#C68642", "#8D5524", "#4A2912"];
const HAIR_COLORS = ["#1a1a1a", "#4a3728", "#8B4513", "#D4A017", "#F5CBA7", "#C0C0C0", "#FFFFFF", "#4169E1", "#FF69B4"];
const HAIR_STYLES = ["short_straight", "short_curly", "medium_wavy", "long_straight", "long_curly", "bun", "ponytail", "bald", "afro"];
const HAIR_STYLE_LABELS = ["קצר ישר", "קצר מתולתל", "בינוני גלי", "ארוך ישר", "ארוך מתולתל", "קוקו גבוה", "זנב סוס", "קרח", "אפרו"];
const EXPRESSIONS = ["happy", "curious", "serious", "energetic", "friendly"];
const EXPRESSION_LABELS = ["חיוכי", "סקרן", "רציני", "אנרגטי", "ידידותי"];
const EXPRESSION_EMOJIS = ["😊", "🤔", "😐", "⚡", "🙂"];
const FACE_TYPES = ["young", "adult"];
const ACCESSORIES = ["none", "glasses_round", "glasses_square", "kippa", "hijab", "turban"];
const ACCESSORIES_LABELS = ["ללא", "משקפיים עגולות", "משקפיים מרובעות", "כיפה", "חיג'אב", "מטפחת"];

function AvatarPreview({ avatar }) {
  const skin = avatar.skin || "#F1C27D";
  const hairColor = avatar.hair_color || "#1a1a1a";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="120" height="140" viewBox="0 0 120 140">
          {/* Hair back */}
          {avatar.hair_style !== "bald" && (
            <ellipse cx="60" cy="42" rx="38" ry="36" fill={hairColor} />
          )}
          {/* Face */}
          <ellipse cx="60" cy="55" rx={avatar.face_type === "young" ? 32 : 30} ry={avatar.face_type === "young" ? 36 : 34} fill={skin} />
          {/* Eyes */}
          <ellipse cx="48" cy="50" rx="4" ry="4.5" fill="#333" />
          <ellipse cx="72" cy="50" rx="4" ry="4.5" fill="#333" />
          <ellipse cx="48" cy="48.5" rx="1.5" ry="1.5" fill="white" />
          <ellipse cx="72" cy="48.5" rx="1.5" ry="1.5" fill="white" />
          {/* Expression */}
          {avatar.expression === "happy" && <path d="M50 64 Q60 72 70 64" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />}
          {avatar.expression === "serious" && <line x1="50" y1="66" x2="70" y2="66" stroke="#333" strokeWidth="2" strokeLinecap="round" />}
          {(avatar.expression === "curious" || avatar.expression === "energetic" || avatar.expression === "friendly") && <path d="M50 64 Q60 70 70 64" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />}
          {/* Nose */}
          <ellipse cx="60" cy="58" rx="3" ry="2" fill={skin} stroke="#d4956a" strokeWidth="1" />
          {/* Accessories */}
          {avatar.accessory === "glasses_round" && (
            <g stroke="#555" strokeWidth="1.5" fill="none">
              <circle cx="48" cy="50" r="8" />
              <circle cx="72" cy="50" r="8" />
              <line x1="56" y1="50" x2="64" y2="50" />
            </g>
          )}
          {avatar.accessory === "glasses_square" && (
            <g stroke="#555" strokeWidth="1.5" fill="none">
              <rect x="40" y="43" width="16" height="14" rx="2" />
              <rect x="64" y="43" width="16" height="14" rx="2" />
              <line x1="56" y1="50" x2="64" y2="50" />
            </g>
          )}
          {avatar.accessory === "kippa" && <ellipse cx="60" cy="26" rx="20" ry="12" fill={hairColor} />}
          {avatar.accessory === "hijab" && <ellipse cx="60" cy="38" rx="42" ry="32" fill={hairColor} opacity="0.85" />}
          {avatar.accessory === "turban" && <rect x="22" y="20" width="76" height="30" rx="15" fill={hairColor} />}
          {/* Neck */}
          <rect x="52" y="88" width="16" height="14" fill={skin} />
          {/* Body */}
          <rect x="28" y="100" width="64" height="40" rx="10" fill="#4169E1" />
          {/* Hair front details */}
          {avatar.hair_style === "ponytail" && <ellipse cx="60" cy="22" rx="8" ry="20" fill={hairColor} />}
          {avatar.hair_style === "bun" && <ellipse cx="60" cy="20" rx="12" ry="10" fill={hairColor} />}
        </svg>
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
        <div className="flex gap-3">
          {FACE_TYPES.map((ft, i) => (
            <button key={ft} onClick={() => update("face_type", ft)}
              className={`flex-1 py-2 rounded-xl border-2 text-sm font-medium transition-all ${avatar.face_type === ft ? "border-yellow-400 bg-yellow-400/20 text-yellow-400" : "border-white/20 text-white/60 hover:border-white/40"}`}>
              {i === 0 ? "צעיר" : "בוגר"}
            </button>
          ))}
        </div>
      </div>

      {/* Skin */}
      <div>
        <label className="text-white/80 text-sm font-medium mb-2 block">גוון עור</label>
        <div className="flex gap-2 flex-wrap">
          {SKIN_COLORS.map(c => (
            <button key={c} onClick={() => update("skin", c)}
              className={`w-9 h-9 rounded-full border-3 transition-all ${avatar.skin === c ? "border-yellow-400 scale-110 shadow-lg" : "border-white/30 hover:scale-105"}`}
              style={{ backgroundColor: c, borderWidth: avatar.skin === c ? 3 : 2 }} />
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
          {HAIR_COLORS.map(c => (
            <button key={c} onClick={() => update("hair_color", c)}
              className={`w-8 h-8 rounded-full transition-all ${avatar.hair_color === c ? "scale-110 shadow-lg" : "hover:scale-105"}`}
              style={{ backgroundColor: c, border: avatar.hair_color === c ? "3px solid #FBBF24" : "2px solid rgba(255,255,255,0.3)" }} />
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