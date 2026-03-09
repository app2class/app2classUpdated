import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, Send, Lock, Clock, Bell, BellOff,
  Users, BookOpen, MessageSquare, Shield, EyeOff,
  BarChart2, AlertTriangle, Calendar, Smile
} from "lucide-react";

// ─── Mock data ────────────────────────────────────────────────
const CHAT_TABS = [
  { id: "class",   label: "כיתתי",   icon: Users,        color: "bg-purple-500" },
  { id: "subject", label: "מקצועי",  icon: BookOpen,     color: "bg-blue-500" },
  { id: "private", label: "אישי",    icon: MessageSquare,color: "bg-teal-500" },
  { id: "staff",   label: "סגל",     icon: Shield,       color: "bg-orange-500" },
];

const CHATS = {
  class: [
    { id: 1, name: "כיתה י'2 — כללי",   lastMsg: "מחר אין כיתה שישית", time: "09:30", unread: 3, avatar: "כ", color: "bg-purple-500" },
    { id: 2, name: "כיתה י'2 — הורים", lastMsg: "בקשר לטיול...",        time: "אתמול", unread: 0, avatar: "ה", color: "bg-purple-700" },
  ],
  subject: [
    { id: 3, name: "פיזיקה י'2",     lastMsg: "חומר לבגרות עלה לתיקייה", time: "11:00", unread: 1, avatar: "פ", color: "bg-blue-500" },
    { id: 4, name: "מתמטיקה י'2",   lastMsg: "מחר יש מבחן!",            time: "08:00", unread: 2, avatar: "מ", color: "bg-indigo-500" },
    { id: 5, name: "אנגלית י'2",    lastMsg: "שלחו את ה-essay עד מחר",  time: "שלשום", unread: 0, avatar: "א", color: "bg-cyan-500" },
  ],
  private: [
    { id: 6, name: "גב' לוי — מתמטיקה",  lastMsg: "ראיתי את המבחן שלך...",  time: "09:05", unread: 1, avatar: "ל", color: "bg-teal-500" },
    { id: 7, name: "מר כהן — מחנך",       lastMsg: "אשמח לדבר היום",         time: "אתמול", unread: 0, avatar: "כ", color: "bg-green-600" },
  ],
  staff: [
    { id: 8, name: "צוות חינוך י'",      lastMsg: "פגישה יום ד' 14:00",  time: "07:55", unread: 4, avatar: "צ", color: "bg-orange-500" },
    { id: 9, name: "רכזי שכבה — כללי",  lastMsg: "פרוטוקול מסומן",       time: "שלשום", unread: 0, avatar: "ר", color: "bg-red-600" },
  ],
};

const INITIAL_MSGS = {
  1: [
    { id: 1, from: "teacher", name: "מר כהן", text: "שלום לכולם! מחר אין כיתה שישית, יש אסיפת מורים.", time: "09:20", read: true },
    { id: 2, from: "me",      name: "אני",   text: "תודה על העדכון!", time: "09:22", read: true },
    { id: 3, from: "other",   name: "יובל",  text: "אוקי 👍", time: "09:25", read: false },
  ],
  3: [
    { id: 1, from: "teacher", name: "גב' רוזן", text: "עליתי חומרי לימוד לפרק 7 בתיקייה החכמה. בהצלחה! 📚", time: "10:55", read: true },
    { id: 2, from: "me",      name: "אני",     text: "תודה! שאלה — האם המרכז האינרציה יהיה בבגרות?", time: "11:01", read: true },
    { id: 3, from: "teacher", name: "גב' רוזן", text: "כן, זה פרק חשוב! נעבור על זה שוב בשיעור ראשון.", time: "11:10", read: false },
  ],
  6: [
    { id: 1, from: "teacher", name: "גב' לוי", text: "שלום, ראיתי שבמבחן האחרון היו לך קשיים בגזירות. האם תרצה לתגבור?", time: "09:00", read: true },
    { id: 2, from: "me",      name: "אני",    text: "כן, אשמח מאוד. מתי אפשר?", time: "09:05", read: true },
  ],
};

const POLL = {
  question: "מה הקצב הנוח ביותר להתקדמות בחומר?",
  options: [
    { label: "מהר יותר — אני מוכן", votes: 8 },
    { label: "הקצב הנוכחי טוב", votes: 12 },
    { label: "צריך יותר זמן על כל נושא", votes: 5 },
  ],
  total: 25,
};

// ─── Quiet Hours helper ───────────────────────────────────────
function isQuietHour() {
  const h = new Date().getHours();
  return h >= 20 || h < 7;
}

// ─── AI content filter (mock) ─────────────────────────────────
const BAD_WORDS = ["טמבל", "אידיוט", "שמאלי", "ימני", "נוב"];
function filterMsg(text) {
  return BAD_WORDS.some(w => text.toLowerCase().includes(w));
}

// ─── Poll component ───────────────────────────────────────────
function PollCard() {
  const [voted, setVoted] = useState(null);
  return (
    <div className="bg-blue-500/20 border border-blue-400/40 rounded-2xl p-4 mb-3">
      <div className="flex items-center gap-2 mb-3">
        <BarChart2 className="w-4 h-4 text-blue-400" />
        <span className="text-blue-300 text-xs font-bold">סקר פעיל</span>
      </div>
      <p className="text-white text-sm font-medium mb-3">{POLL.question}</p>
      <div className="space-y-2">
        {POLL.options.map((opt, i) => {
          const pct = Math.round((opt.votes / POLL.total) * 100);
          return (
            <button key={i} onClick={() => setVoted(i)}
              className={`w-full text-right rounded-xl overflow-hidden transition-all border ${voted === i ? "border-blue-400" : "border-white/10"}`}>
              <div className="relative px-3 py-2">
                <div className="absolute inset-0 bg-blue-500/30 transition-all" style={{ width: voted !== null ? `${pct}%` : "0%" }} />
                <div className="relative flex justify-between items-center">
                  <span className="text-white text-xs">{opt.label}</span>
                  {voted !== null && <span className="text-blue-300 text-xs font-bold">{pct}%</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {voted === null && <p className="text-white/40 text-xs mt-2 text-center">הצבע כדי לראות תוצאות</p>}
    </div>
  );
}

// ─── Anonymous Question Banner ────────────────────────────────
function AnonQuestion({ onSend }) {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const submit = () => {
    if (!text.trim()) return;
    onSend(text);
    setSent(true);
    setText("");
    setTimeout(() => setSent(false), 3000);
  };
  return (
    <div className="bg-purple-500/10 border border-purple-400/30 rounded-2xl p-3 mb-3">
      <div className="flex items-center gap-2 mb-2">
        <EyeOff className="w-4 h-4 text-purple-400" />
        <span className="text-purple-300 text-xs font-bold">שאלה אנונימית למורה</span>
      </div>
      {sent ? (
        <p className="text-green-400 text-xs text-center py-1">✓ השאלה נשלחה!</p>
      ) : (
        <div className="flex gap-2">
          <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-white text-xs placeholder-white/40 focus:outline-none"
            placeholder="שאל/י בעילום שם..." />
          <button onClick={submit} className="px-3 py-1.5 bg-purple-500 hover:bg-purple-400 rounded-xl text-white text-xs transition-all">שלח</button>
        </div>
      )}
    </div>
  );
}

// ─── Scheduled Message Picker ─────────────────────────────────
function SchedulePicker({ onSchedule, onClose }) {
  const times = ["07:00", "08:00", "09:00", "10:00", "12:00", "16:00", "18:00"];
  return (
    <div className="bg-slate-800 border border-white/20 rounded-2xl p-4">
      <p className="text-white text-sm font-bold mb-3 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-yellow-400" /> תזמן הודעה
      </p>
      <p className="text-white/60 text-xs mb-3">ההודעה תשלח מחר בשעה:</p>
      <div className="flex flex-wrap gap-2">
        {times.map(t => (
          <button key={t} onClick={() => onSchedule(t)}
            className="px-3 py-1.5 rounded-xl bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 text-xs hover:bg-yellow-400/30 transition-all">
            {t}
          </button>
        ))}
      </div>
      <button onClick={onClose} className="w-full mt-3 py-2 text-white/50 text-xs hover:text-white/70">ביטול</button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function Messages() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("class");
  const [active, setActive] = useState(null);
  const [msg, setMsg] = useState("");
  const [allMsgs, setAllMsgs] = useState(INITIAL_MSGS);
  const [quietMode, setQuietMode] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [blockedAlert, setBlockedAlert] = useState(false);
  const [scheduledMsg, setScheduledMsg] = useState(null);
  const [showAnonQ, setShowAnonQ] = useState(false);
  const [showPoll, setShowPoll] = useState(false);

  const quiet = isQuietHour() || quietMode;
  const activeChat = active ? [...Object.values(CHATS)].flat().find(c => c.id === active) : null;
  const msgs = allMsgs[active] || [];

  const send = (text = msg, isAnon = false) => {
    if (!text.trim()) return;
    if (filterMsg(text)) {
      setBlockedAlert(true);
      setTimeout(() => setBlockedAlert(false), 4000);
      setMsg("");
      return;
    }
    setAllMsgs(prev => ({
      ...prev,
      [active]: [...(prev[active] || []), {
        id: Date.now(), from: "me", name: isAnon ? "אנונימי" : "אני", text, time: "עכשיו", read: false
      }]
    }));
    setMsg("");
  };

  const handleSchedule = (time) => {
    setScheduledMsg({ text: msg, time });
    setMsg("");
    setShowSchedule(false);
  };

  const handleAnonQ = (text) => send(`🔒 שאלה אנונימית: ${text}`, true);

  // ── Chat View ──────────────────────────────────────────────
  if (active && activeChat) {
    const isSubject = tab === "subject";
    const isClass = tab === "class";
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col" dir="rtl">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-slate-800 px-4 pt-4 pb-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setActive(null)} className="p-2 rounded-xl bg-white/20 text-white">
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className={`w-9 h-9 rounded-xl ${activeChat.color} flex items-center justify-center font-bold text-white`}>
                {activeChat.avatar}
              </div>
              <div>
                <h1 className="text-white font-bold text-sm">{activeChat.name}</h1>
                {quiet && <p className="text-yellow-400 text-xs flex items-center gap-1"><BellOff className="w-3 h-3" /> שעות שקטות</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setQuietMode(q => !q)}
                className={`p-2 rounded-xl transition-all ${quietMode ? "bg-yellow-400/30 text-yellow-400" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
                title="שעות שקטות">
                {quietMode ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 max-w-2xl mx-auto w-full p-4 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-3 mb-3">

            {/* Interactive tools */}
            {isSubject && showPoll && <PollCard />}
            {isClass && showAnonQ && <AnonQuestion onSend={handleAnonQ} />}
            {scheduledMsg && (
              <div className="flex justify-start">
                <div className="bg-yellow-400/20 border border-yellow-400/40 rounded-2xl px-4 py-2.5 max-w-[80%]">
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400 text-xs">מתוזמן ל-{scheduledMsg.time}</span>
                  </div>
                  <p className="text-white/70 text-sm">{scheduledMsg.text}</p>
                </div>
              </div>
            )}

            {msgs.map(m => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.from === "me" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${m.from === "me" ? "bg-blue-500" : "bg-white/15"}`}>
                  {m.from !== "me" && <p className="text-yellow-300 text-xs font-bold mb-1">{m.name}</p>}
                  <p className="text-white text-sm">{m.text}</p>
                  <div className="flex items-center justify-between gap-3 mt-1">
                    <span className="text-xs opacity-50">{m.time}</span>
                    {m.from === "me" && (
                      <span className="text-xs opacity-50">{m.read ? "✓✓" : "✓"}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* AI Block Alert */}
          <AnimatePresence>
            {blockedAlert && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-red-500/20 border border-red-400/50 rounded-xl px-4 py-2 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-red-300 text-xs">🤖 ה-AI זיהה תוכן פוגעני. ההודעה נחסמה לפני שליחתה.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Schedule picker */}
          <AnimatePresence>
            {showSchedule && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-2">
                <SchedulePicker onSchedule={handleSchedule} onClose={() => setShowSchedule(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick action bar */}
          <div className="flex gap-2 mb-2">
            {isClass && (
              <button onClick={() => setShowAnonQ(a => !a)}
                className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-1 transition-all ${showAnonQ ? "border-purple-400 bg-purple-400/20 text-purple-400" : "border-white/20 text-white/50 hover:border-white/40"}`}>
                <EyeOff className="w-3 h-3" /> אנונימי
              </button>
            )}
            {isSubject && (
              <button onClick={() => setShowPoll(p => !p)}
                className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-1 transition-all ${showPoll ? "border-blue-400 bg-blue-400/20 text-blue-400" : "border-white/20 text-white/50 hover:border-white/40"}`}>
                <BarChart2 className="w-3 h-3" /> סקר
              </button>
            )}
            <button onClick={() => setShowSchedule(s => !s)}
              className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-1 transition-all ${showSchedule ? "border-yellow-400 bg-yellow-400/20 text-yellow-400" : "border-white/20 text-white/50 hover:border-white/40"}`}>
              <Clock className="w-3 h-3" /> תזמן
            </button>
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 text-sm"
              placeholder={quiet ? "🔕 שעות שקטות פעילות..." : "כתוב הודעה..."} />
            <button onClick={() => send()}
              className="p-3 bg-blue-500 hover:bg-blue-400 rounded-xl text-white transition-all">
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-1 mt-2 justify-center">
            <Lock className="w-3 h-3 text-white/30" />
            <p className="text-white/30 text-xs">שיחה מוגנת • ניטור AI פעיל • שעות שקטות 20:00-07:30</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Conversations List ─────────────────────────────────────
  const tabChats = CHATS[tab] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-800 px-4 pt-4 pb-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(createPageUrl("Dashboard"))} className="p-2 rounded-xl bg-white/20 text-white">
              <ChevronRight className="w-5 h-5" />
            </button>
            <h1 className="text-white font-black text-lg">הודעות</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setQuietMode(q => !q)}
              className={`p-2 rounded-xl transition-all ${quietMode ? "bg-yellow-400/30 text-yellow-400" : "bg-white/10 text-white/60"}`}
              title="שעות שקטות">
              {quietMode ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Quiet Hours Banner */}
        {quiet && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto mb-3 bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-4 py-2 flex items-center gap-2">
            <BellOff className="w-4 h-4 text-yellow-400" />
            <p className="text-yellow-300 text-xs">שעות שקטות פעילות — התראות מושתקות עד 07:30</p>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="max-w-2xl mx-auto flex gap-2">
          {CHAT_TABS.map(t => {
            const Icon = t.icon;
            const count = (CHATS[t.id] || []).reduce((s, c) => s + c.unread, 0);
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border transition-all text-xs ${tab === t.id ? "border-white/40 bg-white/15 text-white" : "border-transparent text-white/50 hover:text-white/70"}`}>
                <div className="relative">
                  <Icon className="w-4 h-4" />
                  {count > 0 && <span className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] flex items-center justify-center font-bold">{count}</span>}
                </div>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat List */}
      <div className="max-w-2xl mx-auto p-4 space-y-2">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-2">
            {tabChats.map((c, i) => (
              <motion.button key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                onClick={() => setActive(c.id)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 flex items-center gap-3 hover:bg-white/15 transition-all text-right">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold text-white ${c.color}`}>
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="text-white font-bold text-sm truncate">{c.name}</span>
                    <span className="text-white/40 text-xs shrink-0 mr-2">{c.time}</span>
                  </div>
                  <p className="text-white/50 text-xs truncate mt-0.5">{c.lastMsg}</p>
                </div>
                {c.unread > 0 && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {c.unread}
                  </div>
                )}
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* AI Safety Banner */}
        <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-green-400 text-xs font-bold">ניטור AI פעיל</p>
            <p className="text-white/40 text-xs mt-0.5">כל השיחות מוגנות מפני תוכן פוגעני. התראות נשלחות למחנך/יועץ במקרה הצורך.</p>
          </div>
        </div>
      </div>
    </div>
  );
}