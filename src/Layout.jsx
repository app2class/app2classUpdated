import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";

const NO_LAYOUT_PAGES = ["Landing", "Login", "Register", "AdminLogin", "AdminApprovals"];

export default function Layout({ children, currentPageName }) {
  const showLayout = !NO_LAYOUT_PAGES.some(p => currentPageName?.startsWith(p));

  return (
    <div className="min-h-screen" style={{ direction: "rtl", fontFamily: "'Assistant', 'Rubik', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700;800;900&family=Rubik:wght@400;500;700;900&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background: #0f172a; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 99px; }
      `}</style>
      {children}
    </div>
  );
}