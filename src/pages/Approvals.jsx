import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock, User, School, ChevronRight, RefreshCw } from "lucide-react";

const ROLE_LABELS = {
  student: "תלמיד",
  parent: "הורה",
  homeroom_teacher: "מחנך",
  subject_teacher: "מורה מקצועי",
  subject_coordinator: "רכז מקצוע",
  grade_coordinator: "רכז שכבה",
  counselor: "יועץ",
  management: "הנהלה",
  admin: "מנהל מערכת"
};

// Which role approves what
const APPROVER_TITLES = {
  management: "הנהלה — אישור צוות",
  grade_coordinator: "רכז שכבה — אישור מחנכים",
  homeroom_teacher: "מחנך — אישור תלמידים והורים",
};

export default function Approvals() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      loadRegistrations(u.role);
    }).catch(() => base44.auth.redirectToLogin(createPageUrl("Approvals")));
  }, []);

  const loadRegistrations = async (role) => {
    setLoading(true);
    const all = await base44.entities.Registration.list("-created_date", 200);
    const currentUser = await base44.auth.me();

    // Find the current user's own registration to get their details (grade, class, subject)
    const myReg = await base44.entities.Registration.filter({ user_email: currentUser.email });
    const myData = myReg[0] || {};

    let mine = [];
    if (role === "homeroom_teacher") {
      // Approve students/parents in their specific class
      mine = all.filter(r =>
        r.approver_role === "homeroom_teacher" &&
        r.grade === myData.grade &&
        r.class_number === myData.class_number
      );
    } else if (role === "grade_coordinator") {
      // Approve homeroom teachers in their grade
      mine = all.filter(r =>
        r.approver_role === "grade_coordinator" &&
        r.grade === myData.coordinator_grade
      );
    } else if (role === "subject_coordinator") {
      // Approve subject teachers in their subject
      mine = all.filter(r =>
        r.approver_role === "subject_coordinator" &&
        r.coordinator_subject === myData.coordinator_subject
      );
    } else if (role === "management") {
      // Approve grade_coordinators, subject_coordinators, counselors
      mine = all.filter(r => r.approver_role === "management");
    } else {
      mine = all.filter(r => r.approver_role === role);
    }

    setRegistrations(mine);
    setLoading(false);
  };

  const handleApprove = async (reg) => {
    await base44.entities.Registration.update(reg.id, { status: "approved" });
    setRegistrations(prev => prev.map(r => r.id === reg.id ? { ...r, status: "approved" } : r));
  };

  const handleReject = async (reg) => {
    await base44.entities.Registration.update(reg.id, { status: "rejected" });
    setRegistrations(prev => prev.map(r => r.id === reg.id ? { ...r, status: "rejected" } : r));
  };

  const filtered = registrations.filter(r => filter === "all" ? true : r.status === filter);
  const userRole = user?.role;
  const pageTitle = APPROVER_TITLES[userRole] || "לוח אישורים";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 to-slate-800 px-4 pt-4 pb-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
              <span className="font-black text-slate-900">A</span>
            </div>
            <div>
              <h1 className="text-white font-black text-sm">{pageTitle}</h1>
              <p className="text-white/50 text-xs">{ROLE_LABELS[userRole]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => loadRegistrations(userRole)} className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={() => navigate(createPageUrl("Dashboard"))} className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "ממתינים", count: registrations.filter(r => r.status === "pending").length, color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
            { label: "אושרו", count: registrations.filter(r => r.status === "approved").length, color: "text-green-400", bg: "bg-green-400/10 border-green-400/30" },
            { label: "נדחו", count: registrations.filter(r => r.status === "rejected").length, color: "text-red-400", bg: "bg-red-400/10 border-red-400/30" },
          ].map(s => (
            <div key={s.label} className={`${s.bg} border rounded-xl p-3 text-center`}>
              <div className={`text-2xl font-black ${s.color}`}>{s.count}</div>
              <div className="text-white/60 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-4">
          {["pending", "approved", "rejected", "all"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? "bg-yellow-400 text-slate-900" : "bg-white/10 text-white/60 hover:bg-white/20"}`}>
              {f === "pending" ? "ממתינים" : f === "approved" ? "אושרו" : f === "rejected" ? "נדחו" : "הכל"}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-12 text-white/50">טוען...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-white/50">אין בקשות</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((reg, i) => (
              <motion.div key={reg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="bg-white/10 border border-white/20 rounded-2xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-bold">{reg.full_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-blue-500/30 text-blue-300 rounded-full">
                        {ROLE_LABELS[reg.role] || reg.role}
                      </span>
                      {reg.status === "pending" && <span className="text-xs px-2 py-0.5 bg-yellow-400/20 text-yellow-400 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> ממתין</span>}
                      {reg.status === "approved" && <span className="text-xs px-2 py-0.5 bg-green-400/20 text-green-400 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> אושר</span>}
                      {reg.status === "rejected" && <span className="text-xs px-2 py-0.5 bg-red-400/20 text-red-400 rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" /> נדחה</span>}
                    </div>
                  </div>
                </div>
                <div className="text-white/60 text-xs space-y-1">
                  <div className="flex items-center gap-1"><User className="w-3 h-3" /> {reg.user_email}</div>
                  {reg.school && <div className="flex items-center gap-1"><School className="w-3 h-3" /> {reg.school}</div>}
                  {reg.phone && <div>📞 {reg.phone}</div>}
                  {reg.grade && <div>📚 שכבה {reg.grade} כיתה {reg.class_number}</div>}
                  {reg.child_name && <div>👧 ילד/ה: {reg.child_name} (ת.ז. {reg.child_id})</div>}
                  {reg.additional_roles?.length > 0 && <div>תפקידים: {reg.additional_roles.map(r => ROLE_LABELS[r] || r).join(", ")}</div>}
                  {reg.coordinator_grade && <div>שכבת רכז: {reg.coordinator_grade}</div>}
                  {reg.coordinator_subject && <div>מקצוע: {reg.coordinator_subject}</div>}
                </div>
                {reg.status === "pending" && (
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleApprove(reg)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-500 hover:bg-green-400 text-white text-sm font-bold rounded-xl transition-all">
                      <CheckCircle2 className="w-4 h-4" /> אשר
                    </button>
                    <button onClick={() => handleReject(reg)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-500 hover:bg-red-400 text-white text-sm font-bold rounded-xl transition-all">
                      <XCircle className="w-4 h-4" /> דחה
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}