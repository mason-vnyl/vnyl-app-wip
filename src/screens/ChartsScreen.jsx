import { useState, useRef } from "react";
import { DARK, BLUE, SECONDARY } from '../theme';
import { spotifyAlbums, spotifySingles, vnylArtists, vnylAlbums, vnylSongs, countries } from '../data/mockData';
import { TextToggle } from '../components/shared/TextToggle';

function SpotifyRow({ item, index }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 20px",
      borderBottom: `1px solid ${DARK}08`,
      animation: `fadeIn 0.2s ease ${index * 0.04}s both` }}>
      <span style={{ fontFamily: "'Chivo', sans-serif", fontWeight: 900, fontSize: "16px",
        color: item.rank <= 3 ? BLUE : DARK, opacity: item.rank <= 3 ? 1 : 0.25,
        width: "22px", flexShrink: 0, textAlign: "right" }}>{item.rank}</span>
      <div style={{ width: "44px", height: "44px", borderRadius: "6px", flexShrink: 0,
        background: `linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})` }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: DARK, fontSize: "12px", fontWeight: 700, margin: 0,
          fontFamily: "'Chivo', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {item.title}
        </p>
        <p style={{ color: SECONDARY, fontSize: "10px", margin: "2px 0 0",
          fontFamily: "'Chivo', sans-serif", opacity: 0.6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {item.artist}
        </p>
      </div>
      <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "9px", fontWeight: 300,
        color: SECONDARY, opacity: 0.5, flexShrink: 0 }}>{item.streams}</span>
    </div>
  );
}

function VnylRow({ item, index, type }) {
  const name = type === "artists" ? item.name : item.title;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 20px",
      borderBottom: `1px solid ${DARK}08`,
      animation: `fadeIn 0.2s ease ${index * 0.04}s both` }}>
      <span style={{ fontFamily: "'Chivo', sans-serif", fontWeight: 900, fontSize: "16px",
        color: item.rank <= 3 ? BLUE : DARK, opacity: item.rank <= 3 ? 1 : 0.25,
        width: "22px", flexShrink: 0, textAlign: "right" }}>{item.rank}</span>
      <div style={{ width: "44px", height: type === "artists" ? "44px" : "44px",
        borderRadius: type === "artists" ? "50%" : "6px", flexShrink: 0,
        background: `linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})` }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: DARK, fontSize: "12px", fontWeight: 700, margin: 0,
          fontFamily: "'Chivo', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {name}
        </p>
        {type !== "artists" && (
          <p style={{ color: SECONDARY, fontSize: "10px", margin: "2px 0 0",
            fontFamily: "'Chivo', sans-serif", opacity: 0.6 }}>{item.artist}</p>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0, gap: "2px" }}>
        <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "13px", fontWeight: 900,
          color: BLUE }}>{item.avg.toFixed(1)}</span>
        <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "8px", fontWeight: 300,
          color: SECONDARY, opacity: 0.45 }}>{item.reviews.toLocaleString()} ratings</span>
      </div>
    </div>
  );
}

export function ChartsScreen() {
  const [source, setSource]     = useState("spotify");
  const [spType, setSpType]     = useState("albums");
  const [country, setCountry]   = useState("GLOBAL");
  const [vnylType, setVnylType] = useState("artists");
  const [countryOpen, setCountryOpen] = useState(false);
  const [vnylCountry, setVnylCountry] = useState("GLOBAL");
  const [vnylCountryOpen, setVnylCountryOpen] = useState(false);
  const [slideDir, setSlideDir] = useState(null); // "left" | "right"
  const touchStartX = useRef(null);

  const sources = ["spotify", "vnyl"];

  function switchSource(next, dir) {
    setSlideDir(dir);
    setSource(next);
    setTimeout(() => setSlideDir(null), 300);
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 40) return; // ignore tiny movements
    if (diff > 0 && source === "spotify") switchSource("vnyl", "left");
    if (diff < 0 && source === "vnyl")    switchSource("spotify", "right");
    touchStartX.current = null;
  }

  const spotifyData = spType === "albums" ? spotifyAlbums : spotifySingles;
  const vnylData    = vnylType === "artists" ? vnylArtists : vnylType === "albums" ? vnylAlbums : vnylSongs;
  const slideAnim   = slideDir === "left" ? "slideInLeft 0.25s ease" : slideDir === "right" ? "slideInRight 0.25s ease" : "none";

  return (
    <div
      style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Source toggle */}
      <div style={{ borderBottom: `1.5px solid ${DARK}`, padding: "12px 20px 0" }}>
        <div style={{ display: "flex", gap: "20px" }}>
          {["spotify", "vnyl"].map(s => (
            <button key={s} onClick={() => {
              if (s === source) return;
              switchSource(s, s === "vnyl" ? "left" : "right");
            }}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "0 0 10px",
                borderBottom: source === s ? `1.5px solid ${BLUE}` : "1.5px solid transparent" }}>
              <span style={{ fontFamily: "'Chivo', sans-serif",
                fontSize: source === s ? "11px" : "10px",
                fontWeight: source === s ? 900 : 300,
                color: source === s ? BLUE : DARK,
                textTransform: "uppercase", letterSpacing: "0.06em",
                opacity: source === s ? 1 : 0.35 }}>
                {s === "vnyl" ? "vnyl rated" : "spotify"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {source === "spotify" ? (
        <>
          {/* Spotify sub-controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 20px", borderBottom: `1px solid ${DARK}10` }}>
            {/* Albums / Singles toggle */}
            <div style={{ display: "flex", gap: "14px" }}>
              {["albums", "singles"].map(t => (
                <button key={t} onClick={() => setSpType(t)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "10px",
                    fontWeight: spType === t ? 700 : 300,
                    color: spType === t ? DARK : DARK,
                    textTransform: "uppercase", letterSpacing: "0.05em",
                    opacity: spType === t ? 1 : 0.3 }}>{t}</span>
                </button>
              ))}
            </div>

            {/* Country picker */}
            <div style={{ position: "relative" }}>
              <button onClick={() => setCountryOpen(o => !o)}
                style={{ background: "none", border: `1px solid ${DARK}30`, borderRadius: "6px",
                  padding: "4px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "10px", fontWeight: 700,
                  color: DARK, letterSpacing: "0.06em" }}>{country}</span>
                <span style={{ color: DARK, fontSize: "8px", opacity: 0.4 }}>▾</span>
              </button>
              {countryOpen && (
                <div style={{ position: "absolute", right: 0, top: "100%", marginTop: "4px",
                  backgroundColor: "#FAF8F5", border: `1px solid ${DARK}20`, borderRadius: "10px",
                  overflow: "hidden", zIndex: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", minWidth: "80px" }}>
                  {countries.map(c => (
                    <button key={c} onClick={() => { setCountry(c); setCountryOpen(false); }}
                      style={{ display: "block", width: "100%", background: c === country ? BLUE : "none",
                        border: "none", padding: "8px 14px", cursor: "pointer", textAlign: "left" }}>
                      <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "10px",
                        fontWeight: c === country ? 700 : 300, color: c === country ? "#FAF8F5" : DARK,
                        letterSpacing: "0.06em" }}>{c}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Spotify list */}
          <div style={{ flex: 1, overflowY: "auto", animation: slideAnim }}>
            {spotifyData.map((item, i) => <SpotifyRow key={item.rank} item={item} index={i} />)}
            <div style={{ height: "20px" }} />
          </div>
        </>
      ) : (
        <>
          {/* VNYL sub-controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 20px", borderBottom: `1px solid ${DARK}10` }}>
            <div style={{ display: "flex", gap: "14px" }}>
              {["artists", "albums", "songs"].map(t => (
                <button key={t} onClick={() => setVnylType(t)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "10px",
                    fontWeight: vnylType === t ? 700 : 300,
                    color: DARK, textTransform: "uppercase", letterSpacing: "0.05em",
                    opacity: vnylType === t ? 1 : 0.3 }}>{t}</span>
                </button>
              ))}
            </div>

            {/* Country picker */}
            <div style={{ position: "relative" }}>
              <button onClick={() => setVnylCountryOpen(o => !o)}
                style={{ background: "none", border: `1px solid ${DARK}30`, borderRadius: "6px",
                  padding: "4px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "10px", fontWeight: 700,
                  color: DARK, letterSpacing: "0.06em" }}>{vnylCountry}</span>
                <span style={{ color: DARK, fontSize: "8px", opacity: 0.4 }}>▾</span>
              </button>
              {vnylCountryOpen && (
                <div style={{ position: "absolute", right: 0, top: "100%", marginTop: "4px",
                  backgroundColor: "#FAF8F5", border: `1px solid ${DARK}20`, borderRadius: "10px",
                  overflow: "hidden", zIndex: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", minWidth: "80px" }}>
                  {countries.map(c => (
                    <button key={c} onClick={() => { setVnylCountry(c); setVnylCountryOpen(false); }}
                      style={{ display: "block", width: "100%", background: c === vnylCountry ? BLUE : "none",
                        border: "none", padding: "8px 14px", cursor: "pointer", textAlign: "left" }}>
                      <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "10px",
                        fontWeight: c === vnylCountry ? 700 : 300, color: c === vnylCountry ? "#FAF8F5" : DARK,
                        letterSpacing: "0.06em" }}>{c}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* VNYL rating label */}
          <div style={{ padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "8px", fontWeight: 300,
              color: SECONDARY, opacity: 0.45, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              avg. vnyl rating
            </span>
          </div>

          {/* VNYL list */}
          <div style={{ flex: 1, overflowY: "auto", marginTop: "-8px", animation: slideAnim }}>
            {vnylData.map((item, i) => <VnylRow key={item.rank} item={item} index={i} type={vnylType} />)}
            <div style={{ height: "20px" }} />
          </div>
        </>
      )}
    </div>
  );
}
