import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ChevronRight, AlertTriangle, CheckCircle2, Clock, Upload, X } from "lucide-react";

const ABSENCES = [
  { id: 1, date: "2026-02-28", subject: "מתמטיקה", type: "חיסור", status: "unjustified" },
  { id: 2, date: "2026-02-25", subject: "אנגלית", type: "איחור", status: "justified" },
  { id: 3, date: "2026-02-20", subject: "היסטוריה", type: "חיסור", status: "justified" },
  { id: 4, date: "2026-02-18", subject: "ספרות", type: "חיסור", status: "unjustified" },
  { id: 5, date: "2026-02-10", subject: "פיזיקה", type: "חיסור", status: "pending" },
];

const REASONS = ["מחלה", "אירוע משפחתי", "צו ראשון", "פעילות תנועת נוער", "ביקור רופא", "אחר"];

export default function Attendance() {
  const navigate = useNavigate();
  const [justifyId, setJustifyId] = useState(null);
  const [reason, setReason] = useState("");
  const [absences, setAbsences] = useState(ABSENCES);

  const unjustified = absences.filter(a => a.status === "unjustified").length;
  const total = absences.length;
  const pct = Math.round((unjustified / 30) * 100); // out of ~30 school days

  const handleJustify = (id) => {
    setAbsences(prev => prev.map(a => a.id === id ? { ...a, status: "pending" } : a));
    setJustifyId(null);
    setReason("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" dir="rtl">
      <div className="bg-gradient-to-r from-red-700 to-red-900 px-4 pt-4 pb-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(createPageUrl("Dashboard"))} className="p-2 rounded-xl bg-white/20 text-white">
            <ChevronRight className="w-5 h-5" />
          </button>
          <h1 className="text-white font-black text-lg">נוכחות וחיסורים</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-red-400">{unjustified}</div>
            <div className="text-xs text-white/60">לא מוצדקים</div>
          </div>
          <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-yellow-400">{total}</div>
            <div className="text-xs text-white/60">סה"כ חיסורים</div>
          </div>
          <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-3 text-center">
            <div className={`text-2xl font-black ${pct >= 15 ? "text-red-400" : pct >= 10 ? "text-yellow-400" : "text-green-400"}`}>{pct}%</div>
            <div className="text-xs text-white/60">אחוז חיסורים</div>
          </div>
        </div>

        {pct >= 10 && (
          <div className="border border-yellow-400/40 bg-yellow-400/10 rounded-xl p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-yellow-300 text-sm">אחוז החיסורים שלך מתקרב ל-15%. מעבר לסף זה עלול להשפיע על הציון הסופי.</p>
          </div>
        )}

        <h3 className="text-white font-bold">רשימת חיסורים</h3>

        {absences.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white/10 border border-white/20 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${a.type === "חיסור" ? "bg-red-500/30 text-red-300" : "bg-orange-500/30 text-orange-300"}`}>{a.type}</span>
                  <span className="text-white font-medium text-sm">{a.subject}</span>
                </div>
                <p className="text-white/50 text-xs mt-1">{new Date(a.date).toLocaleDateString("he-IL", { weekday: "short", day: "numeric", month: "long" })}</p>
              </div>
              <div className="flex items-center gap-2">
                {a.status === "justified" && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                {a.status === "pending" && <Clock className="w-5 h-5 text-yellow-400" />}
                {a.status === "unjustified" && (
                  <button onClick={() => setJustifyId(a.id)} className="px-3 py-1.5 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold rounded-xl transition-all">
                    הצדק
                  </button>
                )}
              </div>
            </div>

            {justifyId === a.id && (
              <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                <div className="grid grid-cols-2 gap-2">
                  {REASONS.map(r => (
                    <button key={r} onClick={() => setReason(r)}
                      className={`py-1.5 px-3 rounded-xl border text-sm transition-all ${reason === r ? "border-yellow-400 bg-yellow-400/20 text-yellow-400" : "border-white/20 text-white/60 hover:border-white/40"}`}>
                      {r}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleJustify(a.id)} disabled={!reason}
                    className="flex-1 py-2 bg-green-500 text-white text-sm font-bold rounded-xl disabled:opacity-40 hover:bg-green-400 transition-all">
                    שלח לאישור
                  </button>
                  <button onClick={() => setJustifyId(null)} className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}