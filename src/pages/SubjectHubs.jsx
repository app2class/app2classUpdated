import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ChevronRight, BookOpen, MessageSquare, FileText, BarChart2, Brain } from "lucide-react";

const SUBJECTS = [
  { name: "מתמטיקה", teacher: "גב' לוי", avg: 82, trend: "up", color: "from-blue-600 to-blue-800", emoji: "📐" },
  { name: "אנגלית", teacher: "מר כהן", avg: 75, trend: "down", color: "from-green-600 to-green-800", emoji: "🌍" },
  { name: "היסטוריה", teacher: "גב' רוזן", avg: 91, trend: "up", color: "from-orange-600 to-orange-800", emoji: "📜" },
  { name: "פיזיקה", teacher: "מר דוד", avg: 68, trend: "down", color: "from-purple-600 to-purple-800", emoji: "⚛️" },
  { name: "ספרות", teacher: "גב' מלכה", avg: 88, trend: "up", color: "from-pink-600 to-pink-800", emoji: "📚" },
  { name: "כימיה", teacher: "מר שמעוני", avg: 72, trend: "stable", color: "from-teal-600 to-teal-800", emoji: "🧪" },
];

export default function SubjectHubs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" dir="rtl">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-4 pt-4 pb-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(createPageUrl("Dashboard"))} className="p-2 rounded-xl bg-white/20 text-white">
            <ChevronRight className="w-5 h-5" />
          </button>
          <h1 className="text-white font-black text-lg">תיקיות מקצועות</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 grid grid-cols-2 gap-3">
        {SUBJECTS.map((sub, i) => (
          <motion.div key={sub.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
            className={`bg-gradient-to-br ${sub.color} rounded-2xl p-4 cursor-pointer hover:scale-[1.02] transition-all`}
            onClick={() => navigate(createPageUrl(`SubjectDetail?name=${encodeURIComponent(sub.name)}`))}>
            <div className="text-3xl mb-2">{sub.emoji}</div>
            <h3 className="text-white font-black text-base">{sub.name}</h3>
            <p className="text-white/70 text-xs">{sub.teacher}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-white/80 text-sm font-bold">{sub.avg}</span>
              <span className="text-white/60 text-lg">{sub.trend === "up" ? "📈" : sub.trend === "down" ? "📉" : "➡️"}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}