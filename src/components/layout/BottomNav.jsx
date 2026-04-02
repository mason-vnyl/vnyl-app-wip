import { CREAM, DARK, BLUE } from '../../theme';
import { VinylDisc } from '../shared/VinylDisc';
import { navItems } from '../../data/mockData';

export function BottomNav({ active, setActive, spinning, setSpinning, onDiscTap }) {
  return (
    <div style={{ backgroundColor: CREAM, borderTop: `1.5px solid ${DARK}`,
      display: "flex", alignItems: "center", height: "64px", padding: "0 12px", flexShrink: 0 }}>
      {navItems.map((item) => {
        const isDisc   = item.label === null;
        const isActive = active === item.idx;
        if (isDisc) return (
          <button key="disc" onClick={onDiscTap}
            style={{ flex: 1, background: "none", border: "none", cursor: "pointer",
              display: "flex", justifyContent: "center", marginTop: "-20px", padding: 0 }}>
            <VinylDisc size={64} spinning={spinning} active={active === 99} />
          </button>
        );
        return (
          <button key={item.label} onClick={() => { setActive(item.idx); setSpinning(false); }}
            style={{ flex: 1, background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: 0 }}>
            <span style={{ fontFamily: "'Chivo', sans-serif",
              fontSize: isActive ? "11px" : "10px",
              fontWeight: isActive ? 900 : 300,
              color: isActive ? BLUE : DARK,
              textTransform: "uppercase", letterSpacing: "0.06em",
              opacity: isActive ? 1 : 0.35, transition: "all 0.15s" }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
