import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ChevronRight, Send, MessageSquare, BarChart2, CheckCircle2 } from "lucide-react";

const STUDENTS = [
  { id: 1, name: "נועם כ.", present: true, focus: 4, avatar: "🧑" },
  { id: 2, name: "מאיה ל.", present: true, focus: 5, avatar: "👧" },
  { id: 3, name: "יוסי מ.", present: false, focus: 0, avatar: "👦" },
  { id: 4, name: "שירה ד.", present: true, focus: 3, avatar: "👩" },
  { id: 5, name: "אדם כ.", present: true, focus: 2, avatar: "🧒" },
  { id: 6, name: "לי ב.", present: true, focus: 4, avatar: "👧" },
];

const QUESTIONS = [
  { id: 1, text: "לא הבנתי את שלב 3 בפתרון", anon: true, answered: false },
  { id: 2, text: "האם זה יצא במבחן?", anon: false, name: "מאיה", answered: true },
];

export default function LiveLesson() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("attendance");
  const [students, setStudents] = useState(STUDENTS);
  const [questions] = useState(QUESTIONS);
  const [poll, setPoll] = useState(null);
  const [pollResults, setPollResults] = useState(null);

  const avgFocus = students.filter(s => s.present).reduce((acc, s) => acc + s.focus, 0) / students.filter(s => s.present).length;

  const markStatus = (id, status) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const launchPoll = () => {
    setPoll({ question: "כמה הבנתם את החומר?", options: ["הבנתי הכל", "הבנתי חלקית", "לא הבנתי"] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" dir="rtl">
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 px-4 pt-4 pb-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(createPageUrl("Dashboard"))} className="p-2 rounded-xl bg-white/20 text-white"><ChevronRight className="w-5 h-5" /></button>
            <div>
              <h1 className="text-white font-black">שיעור חי - מתמטיקה י'2</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-indigo-200 text-xs">שיעור פעיל</span>
              </div>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-xl text-sm font-bold ${avgFocus >= 4 ? "bg-green-500/30 text-green-300" : avgFocus >= 3 ? "bg-yellow-500/30 text-yellow-300" : "bg-red-500/30 text-red-300"}`}>
            דופק: {avgFocus.toFixed(1)}/5
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-4 py-3 flex gap-2">
        {["attendance", "questions", "poll"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t ? "bg-indigo-500 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}>
            {t === "attendance" ? "📋 נוכחות" : t === "questions" ? "❓ שאלות" : "📊 סקר"}
          </button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-4">
        {tab === "attendance" && (
          <div className="grid grid-cols-2 gap-3">
            {students.map(s => (
              <div key={s.id} className="bg-white/10 border border-white/20 rounded-2xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{s.avatar}</span>
                  <span className="text-white font-medium text-sm">{s.name}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => markStatus(s.id, "present")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${s.status === "present" || (s.present && !s.status) ? "bg-green-500 text-white" : "bg-white/10 text-white/50 hover:bg-green-500/30"}`}>
                    נוכח
                  </button>
                  <button onClick={() => markStatus(s.id, "absent")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${s.status === "absent" ? "bg-red-500 text-white" : "bg-white/10 text-white/50 hover:bg-red-500/30"}`}>
                    חיסור
                  </button>
                  <button onClick={() => markStatus(s.id, "late")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${s.status === "late" ? "bg-orange-500 text-white" : "bg-white/10 text-white/50 hover:bg-orange-500/30"}`}>
                    איחור
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "questions" && (
          <div className="space-y-3">
            {questions.map(q => (
              <div key={q.id} className={`bg-white/10 border border-white/20 rounded-2xl p-4 ${q.answered ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-white text-sm">{q.text}</p>
                  {q.answered && <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />}
                </div>
                <p className="text-white/40 text-xs mt-1">{q.anon ? "אנונימי" : q.name}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "poll" && (
          <div className="space-y-3">
            {!poll ? (
              <button onClick={launchPoll} className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl transition-all">
                📊 שגר סקר לכיתה
              </button>
            ) : (
              <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
                <h3 className="text-white font-bold mb-3">{poll.question}</h3>
                {poll.options.map((opt, i) => (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between text-sm text-white/80 mb-1">
                      <span>{opt}</span>
                      <span>{[60, 30, 10][i]}%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${[60, 30, 10][i]}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}