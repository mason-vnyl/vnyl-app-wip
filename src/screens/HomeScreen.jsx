import { DARK, SECONDARY } from '../theme';
import { homeSections } from '../data/mockData';

export function HomeScreen() {
  return (
    <div style={{ flex: 1, overflowY: "auto", paddingTop: "20px" }}>
      {homeSections.map((section) => (
        <div key={section.label} style={{ marginBottom: "24px" }}>
          <p style={{ color: DARK, fontSize: "13px", margin: "0 0 10px 20px",
            fontFamily: "'Chivo', sans-serif", fontWeight: 400 }}>{section.label}</p>
          <div style={{ display: "flex", gap: "10px", padding: "0 20px" }}>
            {section.covers.map((colors, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "5px" }}>
                <div style={{ width: "100%", aspectRatio: "1/1", borderRadius: "6px",
                  background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }} />
                <p style={{ color: DARK, fontSize: "10px", margin: 0, fontWeight: 700, fontFamily: "'Chivo', sans-serif" }}>Album Title</p>
                <p style={{ color: SECONDARY, fontSize: "9px", margin: 0, fontFamily: "'Chivo', sans-serif", opacity: 0.55 }}>Artist</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
