import { CREAM, DARK, BLUE, SURFACE } from '../../theme';
import { VNYLLogo } from '../shared/VNYLLogo';
import { VinylDisc } from '../shared/VinylDisc';

const sideNavItems = [
  { label: "home",    idx: 0,  icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" },
  { label: "charts",  idx: 1,  icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m8 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6m4 0v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4" },
  { label: "social",  idx: 2,  icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { label: "profile", idx: 3,  icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
];

function NavIcon({ d, size = 20, color, opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      style={{ opacity }}>
      <path d={d} />
    </svg>
  );
}

export function SideNav({ active, setActive, spinning, setSpinning, onDiscTap, onSearchClick }) {
  return (
    <div style={{
      width: "220px", minWidth: "220px",
      height: "100%",
      boxSizing: "border-box",
      backgroundColor: CREAM,
      borderRight: `1.5px solid ${DARK}15`,
      display: "flex", flexDirection: "column",
      padding: "28px 0",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "0 28px 32px", display: "flex", alignItems: "center" }}>
        <VNYLLogo height={22} color={DARK} />
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px", padding: "0 12px" }}>
        {sideNavItems.map(item => {
          const isActive = active === item.idx;
          return (
            <button key={item.label}
              onClick={() => { setActive(item.idx); setSpinning(false); }}
              style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "12px 16px", border: "none", cursor: "pointer",
                borderRadius: "10px",
                backgroundColor: isActive ? `${DARK}08` : "transparent",
                transition: "all 0.15s",
              }}>
              <NavIcon d={item.icon} color={isActive ? BLUE : DARK} opacity={isActive ? 1 : 0.35} />
              <span style={{
                fontFamily: "'Chivo', sans-serif",
                fontSize: "13px",
                fontWeight: isActive ? 900 : 400,
                color: isActive ? DARK : DARK,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                opacity: isActive ? 1 : 0.4,
                transition: "all 0.15s",
              }}>{item.label}</span>
            </button>
          );
        })}

        {/* Search button */}
        <button onClick={onSearchClick}
          style={{
            display: "flex", alignItems: "center", gap: "14px",
            padding: "12px 16px", border: "none", cursor: "pointer",
            borderRadius: "10px", backgroundColor: "transparent",
            marginTop: "4px",
          }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            style={{ opacity: 0.35 }}>
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="22" y2="22" />
          </svg>
          <span style={{
            fontFamily: "'Chivo', sans-serif", fontSize: "13px", fontWeight: 400,
            color: DARK, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.4,
          }}>search</span>
        </button>
      </div>

      {/* Rate disc button at bottom */}
      <div style={{ padding: "0 12px" }}>
        <button onClick={onDiscTap}
          style={{
            display: "flex", alignItems: "center", gap: "14px",
            padding: "12px 16px", border: "none", cursor: "pointer",
            borderRadius: "12px",
            backgroundColor: DARK,
            width: "100%",
            transition: "all 0.15s",
          }}>
          <VinylDisc size={32} spinning={spinning} active />
          <span style={{
            fontFamily: "'Chivo', sans-serif", fontSize: "12px", fontWeight: 900,
            color: CREAM, textTransform: "uppercase", letterSpacing: "0.08em",
          }}>new review</span>
        </button>
      </div>
    </div>
  );
}
