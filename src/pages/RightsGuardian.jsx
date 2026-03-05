import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ChevronRight, CheckCircle2, XCircle, AlertCircle, Send } from "lucide-react";

const RIGHTS = [
  { id: 1, title: "חומר למבחן הועלה לפחות שבוע מראש", subject: "מתמטיקה", status: "ok" },
  { id: 2, title: "לא יותר מ-3 מבחנים בשבוע", subject: "השבוע", status: "ok" },
  { id: 3, title: "ציון על מטלה הוחזר תוך 14 יום", subject: "אנגלית - מבחן אמצע", status: "violation" },
  { id: 4, title: "ציון על מטלה הוחזר תוך 14 יום", subject: "פיזיקה - ניסוי", status: "warning" },
  { id: 5, title: "מבחן לא נקבע בתקופת מבחנים", subject: "כימיה", status: "ok" },
];

export default function RightsGuardian() {
  const navigate = useNavigate();
  const [escalating, setEscalating] = useState(null);
  const [sent, setSent] = useState(false);

  const violations = RIGHTS.filter(r => r.status === "violation");

  const handleEscalate = (right) => {
    setSent(true);
    setTimeout(() => { setSent(false); setEscalating(null); }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" dir="rtl">
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 px-4 pt-4 pb-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(createPageUrl("Dashboard"))} className="p-2 rounded-xl bg-white/20 text-white"><ChevronRight className="w-5 h-5" /></button>
          <div>
            <h1 className="text-white font-black text-lg">מגן זכויות התלמיד</h1>
            {violations.length > 0 && <p className="text-yellow-200 text-xs">{violations.length} חריגות זוהו</p>}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-3">
        {RIGHTS.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`rounded-2xl p-4 border ${r.status === "ok" ? "bg-green-500/10 border-green-500/30" : r.status === "warning" ? "bg-yellow-500/10 border-yellow-500/30" : "bg-red-500/10 border-red-500/30"}`}>
            <div className="flex items-start gap-3">
              {r.status === "ok" ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                : r.status === "warning" ? <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                : <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
              <div className="flex-1">
                <p className="text-white font-medium text-sm">{r.title}</p>
                <p className="text-white/50 text-xs mt-0.5">{r.subject}</p>
                {r.status === "violation" && (
                  <button onClick={() => setEscalating(r)}
                    className="mt-2 px-3 py-1.5 bg-red-500 hover:bg-red-400 text-white text-xs font-bold rounded-xl transition-all">
                    הגש פנייה
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {escalating && (
          <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50 p-4" dir="rtl">
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="w-full max-w-md bg-slate-800 border border-white/20 rounded-2xl p-5">
              {sent ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-white font-bold">הפנייה נשלחה!</p>
                  <p className="text-white/60 text-sm mt-1">ה-AI ניסח את הפנייה ושלח לגורם הרלוונטי</p>
                </div>
              ) : (
                <>
                  <h3 className="text-white font-bold mb-2">פנייה: {escalating.title}</h3>
                  <p className="text-white/60 text-sm mb-4">ה-AI ינסח עבורך פנייה מקצועית ומכובדת ויישלח לרכז/מנהל.</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleEscalate(escalating)} className="flex-1 flex items-center justify-center gap-1 py-2.5 bg-yellow-500 text-slate-900 font-bold rounded-xl text-sm">
                      <Send className="w-4 h-4" /> שלח פנייה
                    </button>
                    <button onClick={() => setEscalating(null)} className="px-4 py-2.5 bg-white/10 text-white rounded-xl text-sm">ביטול</button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}