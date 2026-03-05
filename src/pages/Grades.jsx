import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ChevronRight, TrendingUp, TrendingDown, Minus, Award } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const GRADES_DATA = [
  { subject: "מתמטיקה", grade: 82, avg: 74, trend: "up", history: [70, 75, 78, 82] },
  { subject: "אנגלית", grade: 75, avg: 80, trend: "down", history: [85, 82, 78, 75] },
  { subject: "היסטוריה", grade: 91, avg: 78, trend: "up", history: [80, 84, 88, 91] },
  { subject: "פיזיקה", grade: 68, avg: 72, trend: "stable", history: [65, 70, 69, 68] },
  { subject: "ספרות", grade: 88, avg: 82, trend: "up", history: [78, 82, 85, 88] },
];

const chartData = GRADES_DATA.map(g => ({ name: g.subject.slice(0, 4), ציון: g.grade, ממוצע: g.avg }));

export default function Grades() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" dir="rtl">
      <div className="bg-gradient-to-r from-green-700 to-green-900 px-4 pt-4 pb-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(createPageUrl("Dashboard"))} className="p-2 rounded-xl bg-white/20 text-white">
            <ChevronRight className="w-5 h-5" />
          </button>
          <h1 className="text-white font-black text-lg">ציונים וביצועים</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Overview Chart */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
          <h3 className="text-white font-bold mb-3">ציון מול ממוצע כיתה</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }} domain={[50, 100]} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "12px" }} labelStyle={{ color: "white" }} />
              <Bar dataKey="ציון" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ממוצע" fill="rgba(255,255,255,0.2)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Grade Cards */}
        {GRADES_DATA.map((g, i) => (
          <motion.div key={g.subject} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white/10 border border-white/20 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {g.trend === "up" ? <TrendingUp className="w-5 h-5 text-green-400" /> : g.trend === "down" ? <TrendingDown className="w-5 h-5 text-red-400" /> : <Minus className="w-5 h-5 text-yellow-400" />}
              <div>
                <p className="text-white font-bold">{g.subject}</p>
                <p className="text-white/50 text-xs">ממוצע כיתה: {g.avg}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-black ${g.grade >= 80 ? "text-green-400" : g.grade >= 65 ? "text-yellow-400" : "text-red-400"}`}>{g.grade}</div>
              <div className="text-white/40 text-xs">{g.grade > g.avg ? `+${g.grade - g.avg} מהממוצע` : `${g.grade - g.avg} מהממוצע`}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}