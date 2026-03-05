import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { ChevronRight, LogOut, Edit3 } from "lucide-react";
import AvatarStudio from "../components/register/AvatarStudio";

const DEFAULT_AVATAR = { face_type: "young", skin: "#F1C27D", hair_style: "short_straight", hair_color: "#1a1a1a", expression: "happy", accessory: "none" };

const ROLE_LABELS = {
  student: "תלמיד", parent: "הורה", homeroom_teacher: "מחנך",
  subject_teacher: "מורה מקצועי", subject_coordinator: "רכז מקצוע",
  grade_coordinator: "רכז שכבה", counselor: "יועץ",
  management: "הנהלה", admin: "מנהל מערכת"
};

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editAvatar, setEditAvatar] = useState(false);
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      if (u?.avatar) setAvatar(u.avatar);
    }).catch(() => base44.auth.redirectToLogin());
  }, []);

  const saveAvatar = async () => {
    await base44.auth.updateMe({ avatar });
    setEditAvatar(false);
  };

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
      <p className="text-white/60">טוען...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" dir="rtl">
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-4 pt-4 pb-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(createPageUrl("Dashboard"))} className="p-2 rounded-xl bg-white/20 text-white"><ChevronRight className="w-5 h-5" /></button>
            <h1 className="text-white font-black text-lg">הפרופיל שלי</h1>
          </div>
          <button onClick={() => base44.auth.logout(createPageUrl("Landing"))} className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-all">
            <LogOut className="w-4 h-4" /> יציאה
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* User Info */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-5 text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">
            {user.full_name?.[0] || "?"}
          </div>
          <h2 className="text-white text-xl font-black">{user.full_name}</h2>
          <p className="text-white/60 text-sm">{user.email}</p>
          <span className="mt-2 inline-block px-3 py-1 bg-blue-500/30 text-blue-300 rounded-full text-xs font-bold">
            {ROLE_LABELS[user.role] || user.role}
          </span>
          {user.status === "pending" && (
            <div className="mt-3 bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-2">
              <p className="text-yellow-400 text-xs">⏳ חשבון ממתין לאישור</p>
            </div>
          )}
        </div>

        {/* Avatar Studio */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-bold">האווטאר שלי</h3>
            <button onClick={() => setEditAvatar(!editAvatar)} className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/30 text-blue-300 rounded-xl text-sm hover:bg-blue-500/40 transition-all">
              <Edit3 className="w-3 h-3" /> ערוך
            </button>
          </div>
          {editAvatar ? (
            <>
              <AvatarStudio avatar={avatar} onChange={setAvatar} />
              <button onClick={saveAvatar} className="mt-4 w-full py-3 bg-yellow-400 text-slate-900 font-bold rounded-xl hover:bg-yellow-300 transition-all">
                שמור שינויים
              </button>
            </>
          ) : (
            <p className="text-white/50 text-sm text-center py-4">לחץ על "ערוך" לשינוי האווטאר שלך</p>
          )}
        </div>
      </div>
    </div>
  );
}