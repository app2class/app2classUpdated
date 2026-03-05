import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-white text-2xl font-black mb-2">עמוד לא נמצא</h1>
        <p className="text-blue-300 mb-6">העמוד שחיפשת אינו קיים</p>
        <button onClick={() => navigate(createPageUrl("Landing"))}
          className="px-6 py-3 bg-yellow-400 text-slate-900 font-bold rounded-xl hover:bg-yellow-300 transition-all">
          חזרה לדף הבית
        </button>
      </div>
    </div>
  );
}