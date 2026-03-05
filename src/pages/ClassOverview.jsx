import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ChevronRight, Users, BarChart2, AlertTriangle, Heart, UserCheck } from "lucide-react";

const CLASS_STUDENTS = [
  { id: 1, name: "נועם כהן", avg: 82, absences: 2, focus: 4.2, status: "ok", avatar: "🧑" },
  { id: 2, name: "מאיה לוי", avg: 91, absences: 0, focus: 4.8, status: "ok", avatar: "👧" },
  { id: 3, name: "יוסי מזרחי", avg: 65, absences: 8, focus: 2.1, status: "risk", avatar: "👦" },
  { id: 4, name: "שירה דוד", avg: 78, absences: 3, focus: 3.9, status: "ok", avatar: "👩" },
  { id: 5, name: "אדם כהן", avg: 55, absences: 12, focus: 1.8, status: "critical", avatar: "🧒" },
  { id: 6, name: "לי בן-דוד", avg: 88, absences: 1, focus: 4.5, status: "ok", avatar: "👧" },
];

export default function ClassOverview() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const filtered = CLASS_STUDENTS.filter(s =>
    filter === "all" ? true : filter === "risk" ? (s.status === "risk" || s.status === "critical") : s.status === filter
  );

  const stats = {
    total: CLASS_STUDENTS.length,
    atRisk: CLASS_STUDENTS.filter(s => s.status !== "ok").length,
    avgFocus: (CLASS_STUDENTS.reduce((a, s) => a + s.focus, 0) / CLASS_STUDENTS.length).toFixed(1),
    avgGrade: Math.round(CLASS_STUDENTS.reduce((a, s) => a + s.avg, 0) / CLASS_STUDENTS.length),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" dir="rtl">
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 px-4 pt-4 pb-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(createPageUrl("Dashboard"))} className="p-2 rounded-xl bg-white/20 text-white"><ChevronRight className="w-5 h-5" /></button>
          <div>
            <h1 className="text-white font-black text-lg">כיתה י'2</h1>
            <p className="text-purple-200 text-xs">{stats.total} תלמידים</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "תלמידים", val: stats.total, icon: "👥" },
            { label: "בסיכון", val: stats.atRisk, icon: "⚠️", alert: stats.atRisk > 0 },
            { label: "ממוצע", val: stats.avgGrade, icon: "📊" },
            { label: "ריכוז", val: `${stats.avgFocus}/5`, icon: "🎯" },
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-2.5 text-center border ${s.alert ? "bg-red-500/20 border-red-500/40" : "bg-white/10 border-white/20"}`}>
              <div className="text-lg">{s.icon}</div>
              <div className={`font-black text-base ${s.alert ? "text-red-400" : "text-white"}`}>{s.val}</div>
              <div className="text-white/50 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {["all", "risk", "ok"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? "bg-purple-500 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}>
              {f === "all" ? "כולם" : f === "risk" ? "⚠️ בסיכון" : "✅ תקין"}
            </button>
          ))}
        </div>

        {/* Students */}
        {filtered.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`bg-white/10 border rounded-2xl p-4 ${s.status === "critical" ? "border-red-500/50" : s.status === "risk" ? "border-yellow-500/50" : "border-white/20"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.avatar}</span>
                <div>
                  <p className="text-white font-bold">{s.name}</p>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-white/50 text-xs">ממוצע: {s.avg}</span>
                    <span className={`text-xs ${s.absences >= 10 ? "text-red-400" : s.absences >= 5 ? "text-yellow-400" : "text-white/50"}`}>
                      חיסורים: {s.absences}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/60 text-xs">ריכוז</div>
                <div className={`font-bold ${s.focus >= 4 ? "text-green-400" : s.focus >= 3 ? "text-yellow-400" : "text-red-400"}`}>{s.focus}/5</div>
              </div>
            </div>
            {s.status !== "ok" && (
              <div className={`mt-2 text-xs px-3 py-1.5 rounded-xl ${s.status === "critical" ? "bg-red-500/20 text-red-300" : "bg-yellow-500/20 text-yellow-300"}`}>
                {s.status === "critical" ? "⚠️ דרוש טיפול דחוף - יש לפנות ליועצת" : "💛 מעקב מומלץ"}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}