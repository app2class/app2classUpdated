import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ChevronRight, Clock, CheckCircle2, AlertCircle, Upload, FileText } from "lucide-react";

const ASSIGNMENTS = [
  { id: 1, subject: "היסטוריה", title: "עבודת חקר - מלחמת העולם ה-2", due: "2026-03-09", weight: 20, status: "pending" },
  { id: 2, subject: "אנגלית", title: "Grammar Worksheet Unit 5", due: "2026-03-12", weight: 10, status: "pending" },
  { id: 3, subject: "מתמטיקה", title: "תרגילי אלגברה - דפי עבודה", due: "2026-03-06", weight: 15, status: "submitted" },
  { id: 4, subject: "ספרות", title: "ניתוח שיר - נתן זך", due: "2026-02-28", weight: 25, status: "graded", grade: 88 },
  { id: 5, subject: "פיזיקה", title: "דוח ניסוי - תנועה", due: "2026-03-15", weight: 20, status: "revision", comment: "יש לפרט יותר את סעיף ג'" },
];

const STATUS_MAP = {
  pending: { label: "לא הוגש", color: "bg-red-500/20 text-red-300 border-red-500/30", icon: <Clock className="w-3 h-3" /> },
  submitted: { label: "הוגש - בבדיקה", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", icon: <CheckCircle2 className="w-3 h-3" /> },
  graded: { label: "קיבל ציון", color: "bg-green-500/20 text-green-300 border-green-500/30", icon: <CheckCircle2 className="w-3 h-3" /> },
  revision: { label: "דרוש תיקון", color: "bg-orange-500/20 text-orange-300 border-orange-500/30", icon: <AlertCircle className="w-3 h-3" /> },
};

const TABS = ["הכל", "לא הוגשו", "בבדיקה", "קיבלו ציון", "לתיקון"];

export default function Assignments() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("הכל");
  const [assignments, setAssignments] = useState(ASSIGNMENTS);

  const filtered = assignments.filter(a => {
    if (activeTab === "הכל") return true;
    if (activeTab === "לא הוגשו") return a.status === "pending";
    if (activeTab === "בבדיקה") return a.status === "submitted";
    if (activeTab === "קיבלו ציון") return a.status === "graded";
    if (activeTab === "לתיקון") return a.status === "revision";
    return true;
  });

  const handleSubmit = (id) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: "submitted" } : a));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" dir="rtl">
      <div className="bg-gradient-to-r from-orange-700 to-orange-900 px-4 pt-4 pb-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(createPageUrl("Dashboard"))} className="p-2 rounded-xl bg-white/20 text-white">
            <ChevronRight className="w-5 h-5" />
          </button>
          <h1 className="text-white font-black text-lg">משימות ומטלות</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === t ? "bg-orange-500 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}>
              {t}
            </button>
          ))}
        </div>

        {filtered.map((a, i) => {
          const s = STATUS_MAP[a.status];
          const daysLeft = Math.ceil((new Date(a.due) - new Date()) / (1000 * 60 * 60 * 24));
          return (
            <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={`bg-white/10 border border-white/20 rounded-2xl p-4 ${a.status === "revision" ? "border-orange-500/50" : ""}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-white/60 text-xs">{a.subject}</span>
                  <h3 className="text-white font-bold text-sm mt-0.5">{a.title}</h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border flex items-center gap-1 ${s.color}`}>{s.icon}{s.label}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-white/50">
                <span>⚖️ {a.weight}% מהציון</span>
                <span className={daysLeft < 3 ? "text-red-400 font-bold" : daysLeft < 7 ? "text-orange-400" : "text-green-400"}>
                  {daysLeft > 0 ? `${daysLeft} ימים` : daysLeft === 0 ? "היום!" : "עבר מועד"}
                </span>
              </div>

              {a.status === "graded" && (
                <div className="mt-2 text-2xl font-black text-green-400">ציון: {a.grade}</div>
              )}

              {a.comment && (
                <div className="mt-2 bg-orange-500/10 border border-orange-500/30 rounded-xl p-2 text-orange-300 text-xs">
                  💬 {a.comment}
                </div>
              )}

              {a.status === "pending" && (
                <button onClick={() => handleSubmit(a.id)}
                  className="mt-3 w-full py-2 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold rounded-xl transition-all">
                  <Upload className="w-4 h-4" /> הגש עבודה
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}