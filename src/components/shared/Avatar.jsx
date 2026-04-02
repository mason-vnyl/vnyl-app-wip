export function Avatar({ colors, size = 32, shape = "circle" }) {
  return (
    <div style={{ width: size, height: size, borderRadius: shape === "circle" ? "50%" : "7px",
      flexShrink: 0, background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }} />
  );
}
