import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ChevronRight, Clock, AlertTriangle, BookOpen, Calendar } from "lucide-react";

const MOCK_TASKS = [
  { id: 1, subject: "מתמטיקה", type: "מבחן", title: "מבחן אמצע שנה - אלגברה", dueDate: "2026-03-07", urgency: "red", daysLeft: 2 },
  { id: 2, subject: "היסטוריה", type: "עבודה", title: "עבודת חקר - מלחמת העולם", dueDate: "2026-03-09", urgency: "orange", daysLeft: 4 },
  { id: 3, subject: "אנגלית", type: "שיעורי בית", title: "Grammar Worksheet Unit 5", dueDate: "2026-03-12", urgency: "green", daysLeft: 7 },
  { id: 4, subject: "פיזיקה", type: "מבחן", title: "מבחן מכניקה", dueDate: "2026-03-18", urgency: "green", daysLeft: 13 },
];

const URGENCY = {
  red: { bg: "bg-red-500/20", border: "border-red-500/50", badge: "bg-red-500", label: "דחוף - היום/מחר", dot: "bg-red-400" },
  orange: { bg: "bg-orange-500/20", border: "border-orange-500/50", badge: "bg-orange-500", label: "בקרוב", dot: "bg-orange-400" },
  green: { bg: "bg-green-500/20", border: "border-green-500/50", badge: "bg-green-500", label: "בזמן", dot: "bg-green-400" },
};

export default function StudentRoadmap() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-4 pt-4 pb-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(createPageUrl("Dashboard"))} className="p-2 rounded-xl bg-white/20 text-white">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-white font-black text-lg">ה-AI Roadmap שלי</h1>
            <p className="text-blue-200 text-xs">ציר זמן שבועי חכם</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-3">
        {/* AI Insight */}
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-500/40 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <p className="text-purple-300 text-xs font-bold mb-1">תובנת AI</p>
              <p className="text-white/90 text-sm">השבוע שלך עמוס ביום שישי! יש לך מבחן מתמטיקה בעוד יומיים. כדאי שתתחיל ללמוד עוד הלילה.</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-3 flex-wrap">
          {Object.entries(URGENCY).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${v.dot}`} />
              <span className="text-white/60 text-xs">{v.label}</span>
            </div>
          ))}
        </div>

        {/* Tasks */}
        {MOCK_TASKS.map((task, i) => {
          const u = URGENCY[task.urgency];
          return (
            <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`${u.bg} ${u.border} border rounded-2xl p-4`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 ${u.badge} text-white rounded-full font-bold`}>{task.type}</span>
                    <span className="text-white/60 text-xs">{task.subject}</span>
                  </div>
                  <h3 className="text-white font-bold text-sm">{task.title}</h3>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-white/60 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{task.daysLeft} ימים</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-white/50 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(task.dueDate).toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}