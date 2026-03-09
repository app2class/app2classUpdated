import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function CustomSelect({ value, onChange, options, placeholder = "בחר...", className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find(o => (o.value ?? o) === value);
  const label = selected ? (selected.label ?? selected) : null;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm flex items-center justify-between transition-colors focus:outline-none hover:border-white/40"
        style={{ borderColor: open ? "#FBBF24" : undefined }}>
        <span className={label ? "text-white" : "text-white/40"}>{label || placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-white/20 rounded-xl overflow-hidden shadow-2xl">
          {options.map((opt, i) => {
            const val = opt.value ?? opt;
            const lbl = opt.label ?? opt;
            return (
              <button key={i} type="button"
                onClick={() => { onChange(val); setOpen(false); }}
                className={`w-full text-right px-4 py-2.5 text-sm transition-colors hover:bg-yellow-400/20 hover:text-yellow-400 ${val === value ? "bg-yellow-400/20 text-yellow-400" : "text-white/80"}`}>
                {lbl}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}