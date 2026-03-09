import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { ChevronRight, ChevronLeft, Plus, X } from "lucide-react";
import StepIndicator from "../components/register/StepIndicator";
import AvatarStudio from "../components/register/AvatarStudio";
import EmailInput from "../components/ui/EmailInput";
import CustomSelect from "../components/ui/CustomSelect";

const SCHOOLS = ["תיכון חדש תל אביב", "תיכון בן צבי קריית אונו", "בית ספר אהבת ציון", "תיכון ליד\"ה ירושלים"];
const GRADES = ["ז'", "ח'", "ט'", "י'", "י\"א", "י\"ב"];
const CLASS_NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const EMAIL_SUFFIXES = ["@gmail.com", "@outlook.com", "@taded.org.il", "@demo.il"];
const STAFF_ROLES = [
  { id: "homeroom_teacher", label: "מחנך/ת" },
  { id: "subject_teacher", label: "מורה מקצועי" },
  { id: "subject_coordinator", label: "רכז/ת מקצוע" },
  { id: "grade_coordinator", label: "רכז/ת שכבה" },
  { id: "counselor", label: "יועץ/ת" },
  { id: "management", label: "הנהלה" },
];
const SUBJECTS = ["מתמטיקה", "עברית", "אנגלית", "היסטוריה", "ביולוגיה", "כימיה", "פיזיקה", "ספרות", "אזרחות", "גיאוגרפיה", "מדעי המחשב", "תנ\"ך", "ערבית", "חינוך גופני", "אמנות", "מוזיקה"];
const DEFAULT_AVATAR = { face_type: "young", skin: "#F1C27D", hair_style: "short_straight", hair_color: "#1a1a1a", expression: "happy", accessory: "none" };

function emailSuggestions(val) {
  if (!val.includes("@")) {
    return EMAIL_SUFFIXES.map(s => val + s);
  }
  const [local, domain] = val.split("@");
  if (!domain) return EMAIL_SUFFIXES.map(s => local + s);
  return EMAIL_SUFFIXES.filter(s => s.includes(domain)).map(s => local + s);
}

export default function Register() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const roleType = urlParams.get("role") || "student"; // student | parent | staff

  const [step, setStep] = useState(1);
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [emailSuggs, setEmailSuggs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Staff: multiple roles + classes
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [classesTaught, setClassesTaught] = useState([{ grade: "", class_number: "" }]);
  const [counselorGrades, setCounselorGrades] = useState([""]);

  const [form, setForm] = useState({
    full_name: "", email: "", password: "", phone: "",
    school: "", id_number: "", grade: "", class_number: "",
    coordinator_grade: "", coordinator_subject: "",
    child_name: "", child_id: "", child_school: ""
  });

  const steps = roleType === "staff"
    ? ["פרטים אישיים", "סטודיו אווטאר", "סטטוס"]
    : ["פרטים אישיים", "סטודיו אווטאר", "סטטוס"];

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleEmailChange = (val) => {
    set("email", val);
    if (val.length > 2) setEmailSuggs(emailSuggestions(val));
    else setEmailSuggs([]);
  };

  const toggleRole = (roleId) => {
    setSelectedRoles(prev =>
      prev.includes(roleId) ? prev.filter(r => r !== roleId) : [...prev, roleId]
    );
  };

  const addClassTaught = () => setClassesTaught(prev => [...prev, { grade: "", class_number: "" }]);
  const removeClassTaught = (i) => setClassesTaught(prev => prev.filter((_, idx) => idx !== i));
  const updateClassTaught = (i, k, v) => setClassesTaught(prev => prev.map((c, idx) => idx === i ? { ...c, [k]: v } : c));

  const addCounselorGrade = () => setCounselorGrades(prev => [...prev, ""]);
  const removeCounselorGrade = (i) => setCounselorGrades(prev => prev.filter((_, idx) => idx !== i));
  const updateCounselorGrade = (i, v) => setCounselorGrades(prev => prev.map((g, idx) => idx === i ? v : g));

  const handleSubmit = async () => {
    setLoading(true);
    const registrationData = {
      user_email: form.email,
      full_name: form.full_name,
      role: roleType === "staff" ? selectedRoles[0] : roleType,
      status: "pending",
      school: form.school,
      id_number: form.id_number,
      phone: form.phone,
      avatar,
      ...(roleType === "student" && { grade: form.grade, class_number: form.class_number }),
      ...(roleType === "parent" && { child_name: form.child_name, child_id: form.child_id, child_school: form.child_school }),
      ...(roleType === "staff" && {
        additional_roles: selectedRoles,
        classes_taught: classesTaught,
        coordinator_grade: form.coordinator_grade,
        coordinator_subject: form.coordinator_subject,
        counselor_grades: counselorGrades.filter(g => g),
      }),
      // Hierarchy: management approves staff (except homeroom_teacher who needs grade_coordinator)
      // grade_coordinator approves homeroom_teacher
      // homeroom_teacher approves student + parent
      approver_role: (() => {
        if (roleType === "student" || roleType === "parent") return "homeroom_teacher";
        if (selectedRoles.includes("homeroom_teacher")) return "grade_coordinator";
        return "management";
      })(),
    };
    await base44.entities.Registration.create(registrationData);
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-6" dir="rtl">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 bg-yellow-400/20 border-2 border-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⏳</span>
          </div>
          <h2 className="text-white text-2xl font-bold mb-3">הבקשה נשלחה!</h2>
          <p className="text-blue-300 mb-6">
            חשבונך ממתין לאישור
            {roleType === "student" && " המחנך שלך"}.
            {roleType === "parent" && " המחנך של ילדך"}.
            {roleType === "staff" && " ההנהלה"}.
            <br />תקבל/י הודעה כשהחשבון יאושר.
          </p>
          <button onClick={() => navigate(createPageUrl("Landing"))} className="px-6 py-3 bg-yellow-400 text-slate-900 font-bold rounded-xl">
            חזרה לדף הבית
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col" dir="rtl">
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full p-4 pt-8">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-black text-white">App<span className="text-yellow-400">2</span>Class</h1>
          <p className="text-blue-300 text-sm mt-1">
            {roleType === "student" ? "הרשמת תלמיד" : roleType === "parent" ? "הרשמת הורה" : "הרשמת צוות"}
          </p>
        </div>

        <StepIndicator currentStep={step} totalSteps={steps.length} labels={steps} />

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">

                {/* Common fields */}
                <FormField label="שם מלא" required>
                  <input type="text" value={form.full_name} onChange={e => set("full_name", e.target.value)}
                    className={inputCls} placeholder="שם פרטי ושם משפחה" />
                </FormField>

                <FormField label="אימייל" required>
                  <EmailInput value={form.email} onChange={v => set("email", v)} className={inputCls} />
                </FormField>

                <FormField label="סיסמה" required>
                  <input type="password" value={form.password} onChange={e => set("password", e.target.value)}
                    className={inputCls} placeholder="בחר סיסמה" />
                </FormField>

                {(roleType === "parent" || roleType === "staff") && (
                  <FormField label="מספר טלפון" required>
                    <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
                      className={inputCls} placeholder="05X-XXXXXXX" />
                  </FormField>
                )}

                <FormField label="תעודת זהות" required>
                  <input type="text" value={form.id_number} onChange={e => set("id_number", e.target.value)}
                    className={inputCls} placeholder="9 ספרות" maxLength={9} />
                </FormField>

                <FormField label="בית ספר" required>
                  <CustomSelect value={form.school} onChange={v => set("school", v)} placeholder="בחר בית ספר"
                    options={SCHOOLS.map(s => ({ value: s, label: s }))} />
                </FormField>

                {/* Student specific */}
                {roleType === "student" && (
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="שכבה" required>
                      <CustomSelect value={form.grade} onChange={v => set("grade", v)} placeholder="בחר שכבה"
                        options={GRADES.map(g => ({ value: g, label: g }))} />
                    </FormField>
                    <FormField label="כיתה" required>
                      <CustomSelect value={form.class_number} onChange={v => set("class_number", v)} placeholder="בחר כיתה"
                        options={CLASS_NUMBERS.map(c => ({ value: c, label: c }))} />
                    </FormField>
                  </div>
                )}

                {/* Parent specific */}
                {roleType === "parent" && (
                  <>
                    <div className="border border-yellow-400/30 bg-yellow-400/10 rounded-xl p-3">
                      <p className="text-yellow-400 text-xs font-medium">⚠️ שים לב: הרישום דורש שהילד/ה כבר רשום/ה במערכת ואישור המחנך</p>
                    </div>
                    <FormField label="שם הילד/ה" required>
                      <input type="text" value={form.child_name} onChange={e => set("child_name", e.target.value)} className={inputCls} placeholder="שם מלא" />
                    </FormField>
                    <FormField label="תעודת זהות של הילד/ה" required>
                      <input type="text" value={form.child_id} onChange={e => set("child_id", e.target.value)} className={inputCls} placeholder="9 ספרות" maxLength={9} />
                    </FormField>
                    <FormField label="בית ספר של הילד/ה" required>
                      <CustomSelect value={form.child_school} onChange={v => set("child_school", v)} placeholder="בחר בית ספר"
                        options={SCHOOLS.map(s => ({ value: s, label: s }))} />
                    </FormField>
                  </>
                )}

                {/* Staff specific */}
                {roleType === "staff" && (
                  <>
                    <FormField label="מספר טלפון" required>
                      <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} className={inputCls} placeholder="05X-XXXXXXX" />
                    </FormField>

                    <FormField label="תפקיד/ים (ניתן לבחור מספר)" required>
                      <div className="grid grid-cols-2 gap-2">
                        {STAFF_ROLES.map(r => (
                          <button key={r.id} onClick={() => toggleRole(r.id)} type="button"
                            className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${selectedRoles.includes(r.id) ? "border-yellow-400 bg-yellow-400/20 text-yellow-400" : "border-white/20 text-white/60 hover:border-white/40"}`}>
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </FormField>

                    {/* Homeroom: class */}
                    {selectedRoles.includes("homeroom_teacher") && (
                      <div className="border border-purple-400/30 bg-purple-400/10 rounded-xl p-3 space-y-2">
                        <p className="text-purple-300 text-xs font-bold">מחנך - כיתת חינוך</p>
                        <div className="grid grid-cols-2 gap-2">
                          <CustomSelect value={form.grade} onChange={v => set("grade", v)} placeholder="שכבה"
                            options={GRADES.map(g => ({ value: g, label: g }))} />
                          <CustomSelect value={form.class_number} onChange={v => set("class_number", v)} placeholder="כיתה"
                            options={CLASS_NUMBERS.map(c => ({ value: c, label: c }))} />
                        </div>
                      </div>
                    )}

                    {/* Grade coordinator */}
                    {selectedRoles.includes("grade_coordinator") && (
                      <div className="border border-blue-400/30 bg-blue-400/10 rounded-xl p-3 space-y-2">
                        <p className="text-blue-300 text-xs font-bold">רכז שכבה</p>
                        <select value={form.coordinator_grade} onChange={e => set("coordinator_grade", e.target.value)} className={inputCls}>
                          <option value="">בחר שכבה</option>
                          {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                    )}

                    {/* Subject coordinator */}
                    {selectedRoles.includes("subject_coordinator") && (
                      <div className="border border-green-400/30 bg-green-400/10 rounded-xl p-3 space-y-2">
                        <p className="text-green-300 text-xs font-bold">רכז מקצוע</p>
                        <select value={form.coordinator_subject} onChange={e => set("coordinator_subject", e.target.value)} className={inputCls}>
                          <option value="">בחר מקצוע</option>
                          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    )}

                    {/* Subject teacher subjects */}
                    {(selectedRoles.includes("subject_teacher") || selectedRoles.includes("subject_coordinator")) && (
                      <div className="border border-orange-400/30 bg-orange-400/10 rounded-xl p-3 space-y-2">
                        <p className="text-orange-300 text-xs font-bold">מקצועות הוראה</p>
                        <select value={form.coordinator_subject} onChange={e => set("coordinator_subject", e.target.value)} className={inputCls}>
                          <option value="">בחר מקצוע</option>
                          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    )}

                    {/* Counselor grades */}
                    {selectedRoles.includes("counselor") && (
                      <div className="border border-pink-400/30 bg-pink-400/10 rounded-xl p-3 space-y-2">
                        <p className="text-pink-300 text-xs font-bold">שכבות ייעוץ</p>
                        {counselorGrades.map((g, i) => (
                          <div key={i} className="flex gap-2">
                            <select value={g} onChange={e => updateCounselorGrade(i, e.target.value)} className={`${inputCls} flex-1`}>
                              <option value="">בחר שכבה</option>
                              {GRADES.map(gr => <option key={gr} value={gr}>{gr}</option>)}
                            </select>
                            {counselorGrades.length > 1 && (
                              <button onClick={() => removeCounselorGrade(i)} className="text-red-400 hover:text-red-300 p-2"><X className="w-4 h-4" /></button>
                            )}
                          </div>
                        ))}
                        <button onClick={addCounselorGrade} className="flex items-center gap-1 text-pink-300 text-sm hover:text-pink-200">
                          <Plus className="w-4 h-4" /> הוסף שכבה
                        </button>
                      </div>
                    )}

                    {/* Classes taught (for most roles except counselor/management) */}
                    {!selectedRoles.includes("counselor") && !selectedRoles.includes("management") && selectedRoles.length > 0 && (
                      <div className="border border-white/20 bg-white/5 rounded-xl p-3 space-y-2">
                        <p className="text-white/80 text-xs font-bold">כיתות שאתה מלמד</p>
                        {classesTaught.map((ct, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <select value={ct.grade} onChange={e => updateClassTaught(i, "grade", e.target.value)} className={`${inputCls} flex-1`}>
                              <option value="">שכבה</option>
                              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                            <select value={ct.class_number} onChange={e => updateClassTaught(i, "class_number", e.target.value)} className={`${inputCls} flex-1`}>
                              <option value="">כיתה</option>
                              {CLASS_NUMBERS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {classesTaught.length > 1 && (
                              <button onClick={() => removeClassTaught(i)} className="text-red-400 hover:text-red-300 p-2"><X className="w-4 h-4" /></button>
                            )}
                          </div>
                        ))}
                        <button onClick={addClassTaught} className="flex items-center gap-1 text-white/60 text-sm hover:text-white/80">
                          <Plus className="w-4 h-4" /> הוסף כיתה
                        </button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-white font-bold text-lg mb-4 text-center">סטודיו לעיצוב דמות</h3>
                <AvatarStudio avatar={avatar} onChange={setAvatar} />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center space-y-4">
                <div className="w-16 h-16 bg-yellow-400/20 border-2 border-yellow-400 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">✅</span>
                </div>
                <h3 className="text-white text-xl font-bold">הכל מוכן לשליחה!</h3>
                <div className="text-right bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-white/60">שם:</span><span className="text-white">{form.full_name}</span></div>
                  <div className="flex justify-between"><span className="text-white/60">אימייל:</span><span className="text-white">{form.email}</span></div>
                  <div className="flex justify-between"><span className="text-white/60">בית ספר:</span><span className="text-white">{form.school}</span></div>
                  {form.grade && <div className="flex justify-between"><span className="text-white/60">כיתה:</span><span className="text-white">{form.grade} - {form.class_number}</span></div>}
                </div>
                <div className="border border-blue-400/30 bg-blue-400/10 rounded-xl p-3">
                  <p className="text-blue-300 text-sm">⏳ החשבון יישלח לאישור ולא יהיה פעיל עד לאישור הגורם המוסמך</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-4 gap-3">
          <button
            onClick={() => step > 1 ? setStep(s => s - 1) : navigate(createPageUrl("Landing"))}
            className="flex items-center gap-1 px-4 py-3 rounded-xl border border-white/20 text-white/70 hover:bg-white/10 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
            {step > 1 ? "חזור" : "ביטול"}
          </button>
          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="flex-1 flex items-center justify-center gap-1 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-bold rounded-xl hover:from-yellow-300 transition-all shadow-lg"
            >
              המשך
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-400 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? "שולח..." : "שלח בקשה"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label className="text-white/80 text-sm font-medium mb-1 block">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 transition-colors text-sm";