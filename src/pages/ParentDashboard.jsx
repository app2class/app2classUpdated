import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ChevronRight, TrendingUp, TrendingDown, Award, AlertCircle } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const RADAR_DATA = [
  { subject: "מתמטיקה", value: 82, avg: 74 },
  { subject: "אנגלית", value: 75, avg: 80 },
  { subject: "היסטוריה", value: 91, avg: 78 },
  { subject: "פיזיקה", value: 68, avg: 72 },
  { subject: "ספרות", value: 88, avg: 82 },
];

const INSIGHTS = [
  { type: "positive", text: "הילד שלך נמצא בטווח ה-20% העליונים בספרות ובהיסטוריה" },
  { type: "warning", text: "ישנה ירידה עקבית בציוני בחנים באנגלית - מומלץ בדיקה" },
  { type: "positive", text: "מגמת שיפור במתמטיקה: +12 נקודות בחודש האחרון" },
];

export default function ParentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" dir="rtl">
      <div className="bg-gradient-to-r from-green-700 to-green-900 px-4 pt-4 pb-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(createPageUrl("Dashboard"))} className="p-2 rounded-xl bg-white/20 text-white"><ChevronRight className="w-5 h-5" /></button>
          <div>
            <h1 className="text-white font-black text-lg">תובנות לימודיות</h1>
            <p className="text-green-200 text-xs">נועם כהן • י'2</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* AI Insights */}
        {INSIGHTS.map((ins, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className={`flex items-start gap-3 rounded-xl p-3 border ${ins.type === "positive" ? "bg-green-500/10 border-green-500/30" : "bg-yellow-500/10 border-yellow-500/30"}`}>
            {ins.type === "positive" ? <TrendingUp className="w-4 h-4 text-green-400 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />}
            <p className={`text-sm ${ins.type === "positive" ? "text-green-300" : "text-yellow-300"}`}>{ins.text}</p>
          </motion.div>
        ))}

        {/* Bar Chart */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
          <h3 className="text-white font-bold mb-3">ציונים מול ממוצע כיתה</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={RADAR_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10 }} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10 }} domain={[50, 100]} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "12px" }} />
              <Bar dataKey="value" fill="#22C55E" radius={[4, 4, 0, 0]} name="ציון" />
              <Bar dataKey="avg" fill="rgba(255,255,255,0.2)" radius={[4, 4, 0, 0]} name="ממוצע כיתה" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Cards */}
        <div className="grid grid-cols-2 gap-3">
          {RADAR_DATA.map((s, i) => (
            <div key={s.subject} className="bg-white/10 border border-white/20 rounded-xl p-3">
              <p className="text-white/60 text-xs">{s.subject}</p>
              <div className="flex items-end gap-2 mt-1">
                <span className={`text-2xl font-black ${s.value >= 80 ? "text-green-400" : s.value >= 65 ? "text-yellow-400" : "text-red-400"}`}>{s.value}</span>
                <span className="text-white/40 text-xs mb-1">/ ממוצע {s.avg}</span>
              </div>
              {s.value > s.avg ? <TrendingUp className="w-3 h-3 text-green-400 mt-1" /> : <TrendingDown className="w-3 h-3 text-red-400 mt-1" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}