import { useState } from "react";

const EMAIL_SUFFIXES = ["@gmail.com", "@outlook.com", "@taded.org.il", "@demo.il", "@walla.co.il", "@yahoo.com"];

function getSuggestions(val) {
  if (!val || val.length < 2) return [];
  if (!val.includes("@")) {
    return EMAIL_SUFFIXES.map(s => val + s);
  }
  const [local, domain] = val.split("@");
  if (!domain) return EMAIL_SUFFIXES.map(s => local + s);
  return EMAIL_SUFFIXES.filter(s => s.toLowerCase().includes(domain.toLowerCase())).map(s => local + s);
}

export default function EmailInput({ value, onChange, className, placeholder = "example@gmail.com" }) {
  const [suggs, setSuggs] = useState([]);

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);
    setSuggs(getSuggestions(val));
  };

  const handleSelect = (s) => {
    onChange(s);
    setSuggs([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={() => setTimeout(() => setSuggs([]), 150)}
        className={className}
        placeholder={placeholder}
        autoComplete="off"
      />
      {suggs.length > 0 && (
        <div className="absolute top-full right-0 left-0 mt-1 bg-slate-800 border border-white/20 rounded-xl overflow-hidden z-20 shadow-xl">
          {suggs.map(s => (
            <button
              key={s}
              type="button"
              onMouseDown={() => handleSelect(s)}
              className="w-full text-right px-4 py-2 text-white/80 hover:bg-white/10 text-sm transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}