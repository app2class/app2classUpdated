import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Shield, ChevronRight } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (form.email === "admin@il" && form.password === "123456") {
      navigate(createPageUrl("AdminApprovals"));
    } else {
      setError("פרטי כניסה שגויים");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center p-6" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-white text-2xl font-black">כניסת מנהל מערכת</h1>
          <p className="text-gray-400 text-sm mt-1">App2Class Admin Panel</p>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-white/80 text-sm mb-1 block">אימייל</label>
              <input type="text" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
                placeholder="admin@il" />
            </div>
            <div>
              <label className="text-white/80 text-sm mb-1 block">סיסמה</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
                placeholder="••••••" />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button type="submit" className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-gray-100 transition-all">
              כניסה
            </button>
          </form>
        </div>

        <button onClick={() => navigate(createPageUrl("Landing"))} className="mt-4 flex items-center gap-1 text-gray-400 hover:text-white transition-colors mx-auto">
          <ChevronRight className="w-4 h-4" />
          חזרה לדף הבית
        </button>
      </motion.div>
    </div>
  );
}