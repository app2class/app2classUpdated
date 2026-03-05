import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ChevronRight, Send, Lock } from "lucide-react";

const CONVERSATIONS = [
  { id: 1, name: "גב' לוי - מתמטיקה", lastMsg: "מחר יש מבחן, שלחתי חומרי לימוד", time: "09:30", unread: 2, type: "teacher" },
  { id: 2, name: "מחנך - מר כהן", lastMsg: "אשמח שתגיע לשיחה היום", time: "אתמול", unread: 1, type: "homeroom" },
  { id: 3, name: "כיתה י'2 - קבוצה", lastMsg: "מישהו יכול לשלוח את השיעורי בית?", time: "11:00", unread: 5, type: "class" },
  { id: 4, name: "גב' רוזן - היסטוריה", lastMsg: "הגשת ✓", time: "שלשום", unread: 0, type: "teacher" },
];

const MSGS = [
  { id: 1, from: "teacher", text: "שלום! רציתי לעדכן שמחר יש מבחן על פרק ג'.", time: "09:00" },
  { id: 2, from: "me", text: "תודה! הכנתי", time: "09:05" },
  { id: 3, from: "teacher", text: "מצוין 👍 שלחתי חומרי לימוד לתיקייה", time: "09:30" },
];

export default function Messages() {
  const navigate = useNavigate();
  const [active, setActive] = useState(null);
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState(MSGS);

  const send = () => {
    if (!msg.trim()) return;
    setMsgs(prev => [...prev, { id: Date.now(), from: "me", text: msg, time: "עכשיו" }]);
    setMsg("");
  };

  if (active) {
    const conv = CONVERSATIONS.find(c => c.id === active);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col" dir="rtl">
        <div className="bg-gradient-to-r from-teal-700 to-teal-900 px-4 pt-4 pb-4">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <button onClick={() => setActive(null)} className="p-2 rounded-xl bg-white/20 text-white"><ChevronRight className="w-5 h-5" /></button>
            <h1 className="text-white font-bold">{conv?.name}</h1>
          </div>
        </div>
        <div className="flex-1 max-w-2xl mx-auto w-full p-4 flex flex-col">
          <div className="flex-1 space-y-3 mb-4">
            {msgs.map(m => (
              <div key={m.id} className={`flex ${m.from === "me" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${m.from === "me" ? "bg-blue-500 text-white" : "bg-white/15 text-white"}`}>
                  <p className="text-sm">{m.text}</p>
                  <p className="text-xs opacity-60 mt-1">{m.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 text-sm"
              placeholder="כתוב הודעה..." />
            <button onClick={send} className="p-3 bg-blue-500 hover:bg-blue-400 rounded-xl text-white transition-all"><Send className="w-5 h-5" /></button>
          </div>
          <div className="flex items-center gap-1 mt-2 text-center justify-center">
            <Lock className="w-3 h-3 text-white/30" />
            <p className="text-white/30 text-xs">שיחה מוגנת • שעות שקטות 23:00-07:30</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" dir="rtl">
      <div className="bg-gradient-to-r from-teal-700 to-teal-900 px-4 pt-4 pb-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate(createPageUrl("Dashboard"))} className="p-2 rounded-xl bg-white/20 text-white"><ChevronRight className="w-5 h-5" /></button>
          <h1 className="text-white font-black text-lg">הודעות</h1>
        </div>
      </div>
      <div className="max-w-2xl mx-auto p-4 space-y-2">
        {CONVERSATIONS.map((c, i) => (
          <motion.button key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => setActive(c.id)}
            className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 flex items-center gap-3 hover:bg-white/15 transition-all text-right">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold ${c.type === "class" ? "bg-blue-500" : c.type === "homeroom" ? "bg-purple-500" : "bg-teal-500"}`}>
              {c.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <span className="text-white font-bold text-sm truncate">{c.name}</span>
                <span className="text-white/40 text-xs shrink-0 mr-2">{c.time}</span>
              </div>
              <p className="text-white/50 text-xs truncate mt-0.5">{c.lastMsg}</p>
            </div>
            {c.unread > 0 && <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">{c.unread}</div>}
          </motion.button>
        ))}
      </div>
    </div>
  );
}