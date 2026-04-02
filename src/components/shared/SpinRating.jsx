import { useState, useRef, useCallback, useEffect } from "react";
import { DARK, CREAM, BLUE } from '../../theme';

export function SpinRating({ rating, setRating, onSpinEnd, large }) {
  const discRef = useRef(null);
  const lastAngle = useRef(null);
  const totalRotation = useRef(0);
  const isDragging = useRef(false);
  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);

  // Sync rotation to rating on mount / rating reset
  useEffect(() => {
    const target = rating * 36; // 36° per 0.5 step = 360° for full 5.0
    totalRotation.current = target;
    setRotation(target);
  }, [rating === 0]); // only reset on clear

  const getAngle = useCallback((x, y) => {
    const rect = discRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(y - cy, x - cx) * (180 / Math.PI);
  }, []);

  const handleStart = useCallback((clientX, clientY) => {
    isDragging.current = true;
    setDragging(true);
    lastAngle.current = getAngle(clientX, clientY);
  }, [getAngle]);

  const handleMove = useCallback((clientX, clientY) => {
    if (!isDragging.current) return;
    const angle = getAngle(clientX, clientY);
    let delta = angle - lastAngle.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    lastAngle.current = angle;

    // Hard clamp: 0° to 360° — disc cannot spin past 5 or below 0
    const newTotal = Math.max(0, Math.min(360, totalRotation.current + delta));
    totalRotation.current = newTotal;

    // Snap rating to nearest 0.5 (each 0.5 = 36°)
    const snapped = Math.round(newTotal / 36) * 0.5;
    const clampedRating = Math.max(0, Math.min(5, snapped));

    setRotation(newTotal);
    setRating(clampedRating);
  }, [getAngle, setRating]);

  const handleEnd = useCallback(() => {
    isDragging.current = false;
    setDragging(false);
    // Snap to nearest 36°
    const snapped = Math.round(totalRotation.current / 36) * 36;
    const clamped = Math.max(0, Math.min(360, snapped));
    totalRotation.current = clamped;
    setRotation(clamped);
    if (onSpinEnd) onSpinEnd();
  }, [onSpinEnd]);

  // Mouse events
  useEffect(() => {
    const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const onMouseUp = () => handleEnd();
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, handleMove, handleEnd]);

  const size = large ? 180 : 120;
  const progress = rating / 5;
  const scaleR = size / 2 + (large ? 17 : 11); // radius for the scale ring (matches arc)
  // Tick marks — whole and half steps from 0 to 5
  const ticks = [];
  for (let i = 0; i <= 10; i++) {
    const angle = (i / 10) * 360 - 90;
    const rad = angle * Math.PI / 180;
    const isWhole = i % 2 === 0;
    const half = isWhole ? 5 : 3;
    const outerR = scaleR + half;
    const innerR = scaleR - half;
    ticks.push({ x1: Math.cos(rad)*innerR, y1: Math.sin(rad)*innerR,
                 x2: Math.cos(rad)*outerR, y2: Math.sin(rad)*outerR,
                 isWhole, val: i * 0.5, angle, rad });
  }
  const svgPad = large ? 28 : 20;
  const svgSize = size + svgPad * 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
      padding: "12px 20px 8px", touchAction: "none" }}>

      {/* Rating number */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "2px" }}>
        <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: large ? "38px" : "32px", fontWeight: 900,
          color: rating > 0 ? BLUE : DARK, opacity: rating > 0 ? 1 : 0.12,
          transition: "all 0.15s", lineHeight: 1 }}>
          {rating > 0 ? (rating % 1 === 0 ? rating + ".0" : rating.toFixed(1)) : "0.0"}
        </span>
        <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "11px", fontWeight: 300,
          color: DARK, opacity: 0.3, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          / 5.0
        </span>
      </div>

      {/* Disc + scale */}
      <div style={{ position: "relative", width: svgSize, height: svgSize,
        display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* Scale ring: ticks, arc, labels */}
        <svg style={{ position: "absolute", width: "100%", height: "100%" }}
          viewBox={`${-svgSize/2} ${-svgSize/2} ${svgSize} ${svgSize}`}>
          {/* Tick marks */}
          {ticks.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke={t.val <= rating ? BLUE : DARK}
              strokeWidth={t.isWhole ? 2.5 : 1}
              opacity={t.val <= rating ? 0.9 : 0.15}
              strokeLinecap="round" />
          ))}
          {/* Progress arc */}
          {rating > 0 && (() => {
            const r = scaleR - 1;
            const startAngle = -90 * Math.PI / 180;
            if (rating >= 5) {
              // Full circle
              return <circle cx={0} cy={0} r={r} fill="none" stroke={BLUE}
                strokeWidth="2" opacity="0.35" />;
            }
            const endAngle = (progress * 360 - 90) * Math.PI / 180;
            const x1 = Math.cos(startAngle) * r;
            const y1 = Math.sin(startAngle) * r;
            const x2 = Math.cos(endAngle) * r;
            const y2 = Math.sin(endAngle) * r;
            const largeArc = progress > 0.5 ? 1 : 0;
            return <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
              fill="none" stroke={BLUE} strokeWidth="2" opacity="0.35" strokeLinecap="round" />;
          })()}
        </svg>

        {/* The 45 RPM disc */}
        <div ref={discRef}
          onMouseDown={e => handleStart(e.clientX, e.clientY)}
          onTouchStart={e => { e.preventDefault(); handleStart(e.touches[0].clientX, e.touches[0].clientY); }}
          onTouchMove={e => { e.preventDefault(); handleMove(e.touches[0].clientX, e.touches[0].clientY); }}
          onTouchEnd={e => { e.preventDefault(); handleEnd(); }}
          style={{
            width: size, height: size, borderRadius: "50%", backgroundColor: DARK,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", cursor: "grab", userSelect: "none", overflow: "hidden",
            transform: `rotate(${rotation}deg)`,
            transition: dragging ? "none" : "transform 0.2s cubic-bezier(0.32,0.72,0,1)",
          }}>
          {/* Groove rings */}
          {[0.88, 0.76, 0.64, 0.52].map((r, i) => (
            <div key={i} style={{ position: "absolute", width: size*r, height: size*r,
              borderRadius: "50%", border: `1px solid ${CREAM}`,
              opacity: 0.14 }} />
          ))}
          {/* Glare / light-catch — a diagonal highlight that stays fixed while disc spins */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: dragging
              ? `linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.06) 55%, transparent 70%)`
              : `linear-gradient(135deg, transparent 35%, rgba(255,255,255,0.04) 48%, transparent 62%)`,
            transition: "background 0.2s",
            pointerEvents: "none",
          }} />
          {/* Large 45 center hole */}
          <div style={{ width: size * 0.28, height: size * 0.28, borderRadius: "50%",
            backgroundColor: rating > 0 ? BLUE : CREAM, zIndex: 1,
            transition: "background-color 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: size * 0.08, height: size * 0.08, borderRadius: "50%",
              backgroundColor: DARK }} />
          </div>
          {/* Orientation notch */}
          <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
            width: 3, height: 8, borderRadius: "2px", backgroundColor: CREAM, opacity: 0.3 }} />
        </div>
      </div>

      {/* Hint */}
      <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "9px", fontWeight: 300,
        color: DARK, opacity: dragging ? 0.6 : 0.25, textTransform: "uppercase",
        letterSpacing: "0.1em", transition: "opacity 0.2s" }}>
        {dragging ? "release to set" : "spin to rate"}
      </span>
    </div>
  );
}
