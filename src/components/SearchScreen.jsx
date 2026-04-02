import { useState, useRef, useEffect } from "react";
import { DARK, BLUE, SURFACE, SECONDARY } from '../theme';
import { searchData } from '../data/mockData';

const SEARCH_CATS = ["artist", "album", "song", "mixtape"];

export function SearchScreen({ onClose }) {
  const [cat,   setCat]   = useState("artist");
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  const results = query.trim()
    ? searchData[cat].filter(item => {
        const name = cat === "artist" ? item.name
                   : cat === "mixtape" ? item.title
                   : item.title;
        const sub  = cat === "artist" ? "" : cat === "mixtape" ? item.curator : item.artist;
        return name.toLowerCase().includes(query.toLowerCase())
            || sub.toLowerCase().includes(query.toLowerCase());
      })
    : searchData[cat];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden",
      animation: "fadeIn 0.18s ease" }}>

      {/* Search bar row */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px",
        padding: "10px 16px 8px", borderBottom: `1px solid ${DARK}10` }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px",
          backgroundColor: SURFACE, borderRadius: "10px", padding: "9px 12px" }}>
          <span style={{ color: DARK, opacity: 0.35, fontSize: "14px", lineHeight: 1 }}>⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`search ${cat}s...`}
            style={{ flex: 1, background: "none", border: "none", outline: "none",
              fontFamily: "'Chivo', sans-serif", fontSize: "13px", fontWeight: 300,
              color: DARK }}
          />
          {query.length > 0 && (
            <button onClick={() => setQuery("")}
              style={{ background: "none", border: "none", cursor: "pointer",
                color: DARK, opacity: 0.3, fontSize: "13px", padding: 0, lineHeight: 1 }}>✕</button>
          )}
        </div>
        <button onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px",
            fontFamily: "'Chivo', sans-serif", fontSize: "10px", fontWeight: 700,
            color: DARK, opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.06em",
            flexShrink: 0 }}>
          cancel
        </button>
      </div>

      {/* Category tabs */}
      <div style={{ display: "flex", padding: "0 16px", borderBottom: `1px solid ${DARK}10`, gap: "2px" }}>
        {SEARCH_CATS.map(c => (
          <button key={c} onClick={() => { setCat(c); setQuery(""); }}
            style={{ flex: 1, background: "none", border: "none", cursor: "pointer",
              padding: "10px 0",
              borderBottom: cat === c ? `2px solid ${BLUE}` : "2px solid transparent" }}>
            <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "9px",
              fontWeight: cat === c ? 900 : 300, color: cat === c ? BLUE : DARK,
              textTransform: "uppercase", letterSpacing: "0.07em",
              opacity: cat === c ? 1 : 0.4 }}>
              {c}
            </span>
          </button>
        ))}
      </div>

      {/* Results */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {results.length === 0 && (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <p style={{ fontFamily: "'Chivo', sans-serif", fontSize: "11px", fontWeight: 300,
              color: DARK, opacity: 0.25, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
              no results
            </p>
          </div>
        )}
        {results.map((item, i) => {
          const name    = cat === "artist"  ? item.name  : item.title;
          const line2   = cat === "artist"  ? null
                        : cat === "mixtape" ? item.curator
                        : cat === "song"    ? `${item.artist} — ${item.album}`
                        : item.artist;
          const line3   = cat === "mixtape" ? `${item.tracks} tracks` : null;
          const isCircle = cat === "artist";
          const isMix    = cat === "mixtape";
          return (
            <div key={item.id}
              style={{ display: "flex", alignItems: "center", gap: "13px",
                padding: "11px 20px", borderBottom: `1px solid ${DARK}07`,
                animation: `fadeIn 0.15s ease ${i * 0.025}s both` }}>
              {/* Art */}
              <div style={{
                width: "46px", height: "46px", flexShrink: 0,
                borderRadius: isCircle ? "50%" : "7px",
                background: `linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", overflow: "hidden",
              }}>
                {isMix && (
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%",
                    border: `2px solid #FAF8F5`, opacity: 0.35 }} />
                )}
              </div>
              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "'Chivo', sans-serif", fontSize: "12px", fontWeight: 700,
                  color: DARK, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {name}
                </p>
                {line2 && (
                  <p style={{ fontFamily: "'Chivo', sans-serif", fontSize: "10px", fontWeight: 300,
                    color: SECONDARY, margin: "2px 0 0", opacity: 0.6,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {line2}
                  </p>
                )}
                {line3 && (
                  <p style={{ fontFamily: "'Chivo', sans-serif", fontSize: "9px", fontWeight: 300,
                    color: DARK, margin: "2px 0 0", opacity: 0.35, textTransform: "uppercase",
                    letterSpacing: "0.04em" }}>
                    {line3}
                  </p>
                )}
              </div>
              <span style={{ color: DARK, opacity: 0.15, fontSize: "14px", flexShrink: 0 }}>›</span>
            </div>
          );
        })}
        <div style={{ height: "20px" }} />
      </div>
    </div>
  );
}
