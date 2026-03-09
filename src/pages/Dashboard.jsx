import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import {
  BookOpen, Calendar, MessageSquare, Bell, User,
  ClipboardList, BarChart2, Users, Shield, Settings,
  GraduationCap, Heart, AlertCircle, CheckCircle2
} from "lucide-react";

const ROLE_DASHBOARDS = {
  student: {
    label: "תלמיד",
    color: "from-blue-600 to-blue-800",
    cards: [
      { icon: Calendar, label: "לוח זמנים שבועי", page: "StudentRoadmap", color: "bg-blue-500" },
      { icon: BookOpen, label: "תיקיות מקצועות", page: "SubjectHubs", color: "bg-purple-500" },
      { icon: ClipboardList, label: "משימות ומטלות", page: "Assignments", color: "bg-orange-500" },
      { icon: BarChart2, label: "ציונים וביצועים", page: "Grades", color: "bg-green-500" },
      { icon: MessageSquare, label: "הודעות", page: "Messages", color: "bg-teal-500" },
      { icon: Bell, label: "נוכחות", page: "Attendance", color: "bg-red-500" },
      { icon: Shield, label: "מגן הזכויות", page: "RightsGuardian", color: "bg-yellow-500" },
      { icon: Heart, label: "רווחה ובריאות", page: "Wellness", color: "bg-pink-500" },
    ]
  },
  parent: {
    label: "הורה",
    color: "from-green-600 to-green-800",
    cards: [
      { icon: BarChart2, label: "תובנות לימודיות", page: "ParentDashboard", color: "bg-green-500" },
      { icon: Bell, label: "נוכחות וחיסורים", page: "ParentAttendance", color: "bg-red-500" },
      { icon: Calendar, label: "לוח שנה ואירועים", page: "ParentCalendar", color: "bg-blue-500" },
      { icon: MessageSquare, label: "תקשורת", page: "ParentMessages", color: "bg-teal-500" },
      { icon: Shield, label: "זכויות ושקיפות", page: "ParentRights", color: "bg-yellow-500" },
      { icon: ClipboardList, label: "תשלומים", page: "Payments", color: "bg-purple-500" },
    ]
  },
  homeroom_teacher: {
    label: "מחנך",
    color: "from-purple-600 to-purple-800",
    cards: [
      { icon: Users, label: "כיתה שלי", page: "ClassOverview", color: "bg-purple-500" },
      { icon: ClipboardList, label: "נוכחות ואישורים", page: "AttendanceManagement", color: "bg-red-500" },
      { icon: BarChart2, label: "ניתוח פדגוגי", page: "PedagogicalAnalytics", color: "bg-blue-500" },
      { icon: MessageSquare, label: "תקשורת עם הורים", page: "ParentTeacherComm", color: "bg-teal-500" },
      { icon: Calendar, label: "לוח מבחנים", page: "ExamCalendar", color: "bg-orange-500" },
      { icon: Heart, label: "רווחה ויועצת", page: "WellnessSync", color: "bg-pink-500" },
    ]
  },
  subject_teacher: {
    label: "מורה מקצועי",
    color: "from-indigo-600 to-indigo-800",
    cards: [
      { icon: BookOpen, label: "ניהול שיעור", page: "LiveLesson", color: "bg-indigo-500" },
      { icon: ClipboardList, label: "מרכז בדיקה", page: "GradingHub", color: "bg-orange-500" },
      { icon: BarChart2, label: "אנליטיקה", page: "TeacherAnalytics", color: "bg-blue-500" },
      { icon: Users, label: "הגשות תלמידים", page: "Submissions", color: "bg-green-500" },
      { icon: Calendar, label: "סילבוס שנתי", page: "SyllabusTracker", color: "bg-purple-500" },
      { icon: MessageSquare, label: "צ'אט מקצועי", page: "SubjectChat", color: "bg-teal-500" },
    ]
  },
  counselor: {
    label: "יועץ/ת",
    color: "from-pink-600 to-pink-800",
    cards: [
      { icon: Heart, label: "דאשבורד רווחה", page: "CounselorDashboard", color: "bg-pink-500" },
      { icon: Users, label: "תיקים מאובטחים", page: "CaseManagement", color: "bg-purple-500" },
      { icon: AlertCircle, label: "תלמידים בסיכון", page: "RiskFlags", color: "bg-red-500" },
      { icon: MessageSquare, label: "תקשורת רגישה", page: "CounselorComm", color: "bg-teal-500" },
    ]
  },
  grade_coordinator: {
    label: "רכז שכבה",
    color: "from-cyan-600 to-cyan-800",
    cards: [
      { icon: BarChart2, label: "דופק שכבתי", page: "GradePulse", color: "bg-cyan-500" },
      { icon: Calendar, label: "לוח מבחנים שכבתי", page: "GradeExams", color: "bg-orange-500" },
      { icon: Users, label: "ניהול מחנכים", page: "HomeroomManagement", color: "bg-purple-500" },
      { icon: BookOpen, label: "תגבורים", page: "Tutoring", color: "bg-green-500" },
    ]
  },
  subject_coordinator: {
    label: "רכז מקצוע",
    color: "from-teal-600 to-teal-800",
    cards: [
      { icon: BarChart2, label: "מעקב הספק", page: "ProgressOversight", color: "bg-teal-500" },
      { icon: Calendar, label: "הצעת מבחנים", page: "ExamProposal", color: "bg-orange-500" },
      { icon: BookOpen, label: "חומרי בגרות", page: "ExamVault", color: "bg-blue-500" },
      { icon: Users, label: "ניהול צוות", page: "StaffManagement", color: "bg-purple-500" },
    ]
  },
  management: {
    label: "הנהלה",
    color: "from-slate-600 to-slate-800",
    cards: [
      { icon: BarChart2, label: "מבט על אסטרטגי", page: "ManagementDashboard", color: "bg-slate-500" },
      { icon: Users, label: "כוח אדם", page: "StaffCommand", color: "bg-blue-500" },
      { icon: Calendar, label: "אישור לוחות", page: "ScheduleApproval", color: "bg-orange-500" },
      { icon: Shield, label: "בקרה ורגולציה", page: "Compliance", color: "bg-red-500" },
      { icon: CheckCircle2, label: "אישורי צוות", page: "Approvals", color: "bg-purple-500" },
    ]
  },
  admin: {
    label: "מנהל מערכת",
    color: "from-gray-700 to-gray-900",
    cards: [
      { icon: Users, label: "ניהול משתמשים", page: "AdminUsers", color: "bg-gray-500" },
      { icon: Settings, label: "תשתית בתי ספר", page: "AdminSchools", color: "bg-blue-500" },
      { icon: Shield, label: "אבטחה ופרטיות", page: "AdminSecurity", color: "bg-red-500" },
      { icon: BarChart2, label: "ניטור מערכת", page: "AdminMonitor", color: "bg-green-500" },
      { icon: Bell, label: "הודעות מערכת", page: "AdminComms", color: "bg-yellow-500" },
      { icon: CheckCircle2, label: "אישורים ממתינים", page: "AdminApprovals", color: "bg-purple-500" },
    ]
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setLoading(false);
    }).catch(() => {
      base44.auth.redirectToLogin(createPageUrl("Dashboard"));
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-400/20 border-2 border-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl font-black text-yellow-400">A</span>
          </div>
          <p className="text-blue-300">טוען...</p>
        </div>
      </div>
    );
  }

  const userRole = user?.role || "student";
  const roleConfig = ROLE_DASHBOARDS[userRole] || ROLE_DASHBOARDS.student;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" dir="rtl">
      {/* Header */}
      <div className={`bg-gradient-to-r ${roleConfig.color} px-4 pt-safe pb-4`}>
        <div className="max-w-2xl mx-auto flex justify-between items-center pt-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
              <span className="text-lg font-black text-slate-900">A</span>
            </div>
            <div>
              <h1 className="text-white font-black text-lg">App<span className="text-yellow-400">2</span>Class</h1>
              <p className="text-white/60 text-xs">{roleConfig.label}</p>
            </div>
          </div>
          <button onClick={() => navigate(createPageUrl("Profile"))} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>
        <div className="max-w-2xl mx-auto pb-2">
          <p className="text-white/80 text-sm">שלום, <span className="font-bold text-white">{user?.full_name || "משתמש"}</span> 👋</p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-2xl mx-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {roleConfig.cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={card.page}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(createPageUrl(card.page))}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-right hover:bg-white/15 transition-all"
              >
                <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-white font-semibold text-sm">{card.label}</p>
              </motion.button>
            );
          })}
        </div>

        {/* Pending Status */}
        {user?.status === "pending" && (
          <div className="mt-4 border border-yellow-400/40 bg-yellow-400/10 rounded-xl p-4">
            <p className="text-yellow-400 text-sm font-bold">⏳ חשבונך ממתין לאישור</p>
            <p className="text-yellow-300/70 text-xs mt-1">הגישה לתכנים תתאפשר לאחר האישור</p>
          </div>
        )}
      </div>
    </div>
  );
}