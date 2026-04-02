import { DARK, BLUE } from '../../theme';

export function TextToggle({ options, active, onChange }) {
  return (
    <div style={{ display: "flex", padding: "0 20px", gap: "20px" }}>
      {options.map((opt) => (
        <button key={opt} onClick={() => onChange(opt)} style={{ background: "none", border: "none",
          cursor: "pointer", padding: "0 0 8px",
          borderBottom: active === opt ? `1.5px solid ${BLUE}` : "1.5px solid transparent",
          transition: "all 0.15s" }}>
          <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: active === opt ? "11px" : "10px",
            fontWeight: active === opt ? 900 : 300, color: active === opt ? BLUE : DARK,
            textTransform: "uppercase", letterSpacing: "0.06em",
            opacity: active === opt ? 1 : 0.35 }}>{opt}</span>
        </button>
      ))}
    </div>
  );
}
