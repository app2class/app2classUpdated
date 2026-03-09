import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { GraduationCap, Users, BookOpen, Shield, ChevronLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";

const roles = [
  {
    id: "student",
    label: "תלמיד",
    icon: GraduationCap,
    color: "from-blue-500 to-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    description: "גישה לשיעורים, מטלות וציונים"
  },
  {
    id: "parent",
    label: "הורה",
    icon: Users,
    color: "from-green-500 to-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    description: "מעקב אחר הילד שלך"
  },
  {
    id: "staff",
    label: "צוות",
    icon: BookOpen,
    color: "from-purple-500 to-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    description: "מחנך, מורה, רכז, יועץ, הנהלה"
  },
  {
    id: "admin",
    label: "מנהל מערכת",
    icon: Shield,
    color: "from-gray-700 to-gray-900",
    bg: "bg-gray-50",
    border: "border-gray-200",
    description: "ניהול כלל המערכת"
  }
];

export default function Landing() {
  const navigate = useNavigate();

  const handleRoleSelect = (roleId) => {
    if (roleId === "admin") {
      navigate(createPageUrl("AdminLogin"));
    } else {
      navigate(createPageUrl(`Register?role=${roleId}`));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center p-6" dir="rtl">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <span className="text-2xl font-black text-slate-900">A</span>
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              App<span className="text-yellow-400">2</span>Class
            </h1>
            <p className="text-blue-300 text-sm font-medium">הפלטפורמה החינוכית החכמה</p>
          </div>
        </div>
      </motion.div>

      {/* Role Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-2xl"
      >
        <h2 className="text-white text-xl font-bold text-center mb-6">מי אתה?</h2>
        <div className="grid grid-cols-2 gap-4">
          {roles.map((role, i) => {
            const Icon = role.icon;
            return (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i + 0.3 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleRoleSelect(role.id)}
                className={`${role.bg} ${role.border} border-2 rounded-2xl p-5 text-right hover:shadow-xl transition-all duration-200 group`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-3 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="font-bold text-slate-800 text-lg">{role.label}</div>
                <div className="text-slate-500 text-xs mt-1">{role.description}</div>
              </motion.button>
            );
          })}
        </div>

        {/* Existing User Login */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-blue-300 text-sm">כבר רשום?</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <button
            onClick={() => base44.auth.redirectToLogin()}
            className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl border-2 border-yellow-400/60 text-yellow-400 font-bold hover:bg-yellow-400/10 transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
            כניסה למשתמש קיים
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}