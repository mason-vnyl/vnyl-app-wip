import { DARK, CREAM, BLUE } from '../../theme';

export function VinylDisc({ size = 64, spinning = false, active = false }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", backgroundColor: DARK,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, position: "relative",
      animation: spinning ? "spin 2.5s linear infinite" : "none" }}>
      {[0.85, 0.70, 0.55].map((r, i) => (
        <div key={i} style={{ position: "absolute", width: size * r, height: size * r,
          borderRadius: "50%", border: `1px solid ${CREAM}`,
          opacity: active ? 0.25 : 0.12, transition: "opacity 0.2s ease" }} />
      ))}
      <div style={{ width: size * 0.20, height: size * 0.20, borderRadius: "50%",
        backgroundColor: active ? BLUE : CREAM,
        transition: "background-color 0.2s ease", zIndex: 1 }} />
    </div>
  );
}
