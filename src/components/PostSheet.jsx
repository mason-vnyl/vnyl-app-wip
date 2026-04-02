import { useState, useRef, useCallback } from "react";
import { CREAM, DARK, BLUE, SURFACE, SECONDARY } from '../theme';
import { SpinRating } from './shared/SpinRating';
import { searchData } from '../data/mockData';

export function PostSheet({ open, onClose, isDesktopModal = false }) {
  const [view,         setView]         = useState("compose"); // "compose" | "drafts"
  const [type,         setType]         = useState("song");
  const [query,        setQuery]        = useState("");
  const [selected,     setSelected]     = useState(null);
  const [rating,       setRating]       = useState(0);
  const [phase,        setPhase]        = useState("rate"); // "rate" | "review"
  const [exitConfirm,  setExitConfirm]  = useState(false);
  const [drafts,       setDrafts]       = useState([]);
  const [hasText,      setHasText]      = useState(false);
  const editorRef = useRef(null);
  const hasSetRating = useRef(false);
  const ratingRef = useRef(0);

  const handleRatingSet = useCallback((newRating) => {
    setRating(newRating);
    ratingRef.current = newRating;
    if (newRating > 0) hasSetRating.current = true;
  }, []);

  const handleSpinEnd = useCallback(() => {
    if (hasSetRating.current && ratingRef.current > 0) {
      setTimeout(() => setPhase("review"), 400);
    }
  }, []);

  const resetSheet = () => {
    setView("compose"); setType("song"); setQuery("");
    setSelected(null); setRating(0); setPhase("rate"); setHasText(false); setExitConfirm(false);
    hasSetRating.current = false;
    if (editorRef.current) editorRef.current.innerHTML = "";
  };

  const handleClose = () => {
    const text = editorRef.current?.innerText?.trim() || "";
    if (text.length > 0 || rating > 0) { setExitConfirm(true); return; }
    resetSheet(); onClose();
  };

  const handleDiscard = () => { resetSheet(); onClose(); };

  const handleSaveDraft = () => {
    const html = editorRef.current?.innerHTML || "";
    const name = selected
      ? (type === "artist" ? selected.name : selected.title)
      : "Untitled";
    setDrafts(d => [...d, { id: Date.now(), type, selected, rating, html, name,
      savedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    resetSheet(); onClose();
  };

  const handleLoadDraft = (draft) => {
    setType(draft.type); setSelected(draft.selected); setRating(draft.rating);
    setView("compose"); setQuery(""); setPhase(draft.rating > 0 ? "review" : "rate");
    hasSetRating.current = draft.rating > 0;
    setTimeout(() => { if (editorRef.current) editorRef.current.innerHTML = draft.html; setHasText(true); }, 50);
  };

  const execFmt = (cmd) => { document.execCommand(cmd, false, null); editorRef.current?.focus(); };

  const results = query.trim()
    ? searchData[type].filter(item => {
        const name = type === "artist" ? item.name : item.title;
        return name.toLowerCase().includes(query.toLowerCase());
      })
    : searchData[type];

  const eligible = selected
    ? (type === "song" ? true : selected.tracksRated === selected.totalTracks)
    : false;

  const canPost = eligible && rating > 0 && hasText;

  if (!open) return null;

  // ── Shared inner content ──
  const inner = (
    <>
      {/* Drag handle (mobile only) */}
      {!isDesktopModal && (
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div style={{ width: "36px", height: "3px", borderRadius: "2px", backgroundColor: DARK, opacity: 0.15 }} />
        </div>
      )}

      {/* Header row */}
      <div style={{ position: "relative", display: "flex", alignItems: "center",
        justifyContent: "center", padding: isDesktopModal ? "16px 16px 12px" : "4px 16px 12px",
        borderBottom: `1.5px solid ${DARK}` }}>
        <div style={{ position: "absolute", left: "16px" }}>
          {view === "drafts" ? (
            <button onClick={() => setView("compose")}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
              <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "9px", fontWeight: 700,
                color: DARK, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5 }}>
                ← BACK
              </span>
            </button>
          ) : (
            <button onClick={() => setView("drafts")}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
              <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "9px", fontWeight: 300,
                color: DARK, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.4 }}>
                DRAFTS {drafts.length > 0 && `(${drafts.length})`}
              </span>
            </button>
          )}
        </div>
        <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "11px", fontWeight: 900,
          color: DARK, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          {view === "drafts" ? "DRAFTS" : "NEW REVIEW"}
        </span>
        <button onClick={handleClose}
          style={{ position: "absolute", right: "16px", background: "none", border: "none",
            cursor: "pointer", fontFamily: "'Chivo', sans-serif", fontSize: "16px",
            color: DARK, opacity: 0.35, lineHeight: 1, padding: "4px 0" }}>
          ✕
        </button>
      </div>

      {/* ── DRAFTS VIEW ── */}
      {view === "drafts" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {drafts.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <p style={{ fontFamily: "'Chivo', sans-serif", fontSize: "11px", fontWeight: 300,
                color: DARK, opacity: 0.3, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                No saved drafts
              </p>
            </div>
          ) : drafts.map(draft => (
            <button key={draft.id} onClick={() => handleLoadDraft(draft)}
              style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%",
                padding: "12px 20px", background: "none", border: "none", cursor: "pointer",
                borderBottom: `1px solid ${DARK}08`, textAlign: "left" }}>
              {draft.selected && (
                <div style={{ width: "40px", height: "40px", flexShrink: 0,
                  borderRadius: draft.type === "artist" ? "50%" : "6px",
                  background: `linear-gradient(135deg, ${draft.selected.colors[0]}, ${draft.selected.colors[1]})` }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "'Chivo', sans-serif", fontSize: "11px", fontWeight: 700,
                  color: DARK, margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {draft.name}
                </p>
                <p style={{ fontFamily: "'Chivo', sans-serif", fontSize: "9px", fontWeight: 300,
                  color: SECONDARY, margin: 0, opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {draft.type} · saved {draft.savedAt}
                </p>
              </div>
              <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "9px", color: BLUE, fontWeight: 700 }}>
                RESUME →
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ── COMPOSE VIEW ── */}
      {view === "compose" && (
        <>
          {/* Type selector */}
          <div style={{ display: "flex", padding: "12px 20px 0", gap: "4px" }}>
            {["artist", "album", "song"].map(t => (
              <button key={t} onClick={() => { setType(t); setSelected(null); setQuery(""); setPhase("rate"); setRating(0); hasSetRating.current = false; }}
                style={{ flex: 1, padding: "8px 4px", border: "none", cursor: "pointer", borderRadius: "6px",
                  backgroundColor: type === t ? DARK : SURFACE, transition: "all 0.15s" }}>
                <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "10px",
                  fontWeight: type === t ? 900 : 300, color: type === t ? CREAM : DARK,
                  textTransform: "uppercase", letterSpacing: "0.08em" }}>{t}</span>
              </button>
            ))}
          </div>

          {/* Search bar */}
          {!selected && (
            <div style={{ padding: "10px 20px 4px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px",
                backgroundColor: SURFACE, borderRadius: "8px", padding: "8px 12px" }}>
                <span style={{ color: DARK, opacity: 0.3, fontSize: "12px" }}>⌕</span>
                <input value={query} onChange={e => setQuery(e.target.value)}
                  placeholder={`Search ${type}s...`}
                  style={{ flex: 1, background: "none", border: "none", outline: "none",
                    fontFamily: "'Chivo', sans-serif", fontSize: "12px", color: DARK,
                    fontWeight: 300 }} />
                {query && <button onClick={() => setQuery("")}
                  style={{ background: "none", border: "none", cursor: "pointer",
                    color: DARK, opacity: 0.3, fontSize: "12px", padding: 0 }}>✕</button>}
              </div>
            </div>
          )}

          {/* Search results */}
          {!selected && (
            <div style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
              {results.map((item, i) => {
                const name    = type === "artist" ? item.name : item.title;
                const sub     = type === "song"   ? item.artist : type === "album" ? item.artist : null;
                const isElig  = type === "song"   ? true : item.tracksRated === item.totalTracks;
                return (
                  <button key={item.id} onClick={() => isElig && setSelected(item)}
                    style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%",
                      padding: "10px 20px", background: "none", border: "none",
                      cursor: isElig ? "pointer" : "not-allowed",
                      borderBottom: `1px solid ${DARK}08`, opacity: isElig ? 1 : 0.5,
                      animation: `fadeIn 0.15s ease ${i * 0.03}s both` }}>
                    <div style={{ width: "42px", height: "42px", flexShrink: 0,
                      borderRadius: type === "artist" ? "50%" : "6px",
                      background: `linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})` }} />
                    <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                      <p style={{ fontFamily: "'Chivo', sans-serif", fontSize: "12px", fontWeight: 700,
                        color: DARK, margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</p>
                      {sub && <p style={{ fontFamily: "'Chivo', sans-serif", fontSize: "10px", fontWeight: 300,
                        color: SECONDARY, margin: 0, opacity: 0.6 }}>{sub}</p>}
                      {type !== "song" && (
                        <p style={{ fontFamily: "'Chivo', sans-serif", fontSize: "9px", fontWeight: 300,
                          color: isElig ? BLUE : DARK, margin: "3px 0 0",
                          opacity: isElig ? 0.8 : 0.35, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {isElig ? `✓ all ${item.totalTracks} tracks rated` : `${item.tracksRated}/${item.totalTracks} tracks rated — rate all to unlock`}
                        </p>
                      )}
                    </div>
                    {isElig && <span style={{ color: DARK, opacity: 0.2, fontSize: "14px" }}>›</span>}
                  </button>
                );
              })}
            </div>
          )}

          {/* Selected item — RATE PHASE */}
          {selected && phase === "rate" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", overflow: "hidden", gap: "16px", padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
                <div style={{ width: "44px", height: "44px", flexShrink: 0,
                  borderRadius: type === "artist" ? "50%" : "6px",
                  background: `linear-gradient(135deg, ${selected.colors[0]}, ${selected.colors[1]})` }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'Chivo', sans-serif", fontSize: "12px", fontWeight: 700,
                    color: DARK, margin: 0 }}>{type === "artist" ? selected.name : selected.title}</p>
                  {type !== "artist" && <p style={{ fontFamily: "'Chivo', sans-serif", fontSize: "10px",
                    color: SECONDARY, margin: "1px 0 0", opacity: 0.6 }}>{selected.artist}</p>}
                </div>
                <button onClick={() => { setSelected(null); setRating(0); hasSetRating.current = false; }}
                  style={{ background: "none", border: "none", cursor: "pointer",
                    fontFamily: "'Chivo', sans-serif", fontSize: "9px", fontWeight: 300,
                    color: DARK, opacity: 0.35, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  change
                </button>
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <SpinRating rating={rating} setRating={handleRatingSet} onSpinEnd={handleSpinEnd} large />
              </div>
            </div>
          )}

          {/* Selected item — REVIEW PHASE */}
          {selected && phase === "review" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden",
              animation: "fadeIn 0.35s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px",
                padding: "10px 20px", borderBottom: `1px solid ${DARK}10` }}>
                <div style={{ width: "38px", height: "38px", flexShrink: 0,
                  borderRadius: type === "artist" ? "50%" : "6px",
                  background: `linear-gradient(135deg, ${selected.colors[0]}, ${selected.colors[1]})` }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'Chivo', sans-serif", fontSize: "12px", fontWeight: 700,
                    color: DARK, margin: 0 }}>{type === "artist" ? selected.name : selected.title}</p>
                  {type !== "artist" && <p style={{ fontFamily: "'Chivo', sans-serif", fontSize: "10px",
                    color: SECONDARY, margin: "1px 0 0", opacity: 0.6 }}>{selected.artist}</p>}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
                  <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "20px", fontWeight: 900,
                    color: BLUE, lineHeight: 1 }}>
                    {rating % 1 === 0 ? rating + ".0" : rating.toFixed(1)}
                  </span>
                  <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "9px", fontWeight: 300,
                    color: DARK, opacity: 0.3 }}>/ 5</span>
                </div>
                <button onClick={() => { setPhase("rate"); }}
                  style={{ background: "none", border: "none", cursor: "pointer",
                    fontFamily: "'Chivo', sans-serif", fontSize: "9px", fontWeight: 300,
                    color: BLUE, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.06em",
                    marginLeft: "4px" }}>
                  re-spin
                </button>
              </div>

              <div style={{ display: "flex", gap: "2px", padding: "8px 20px 4px",
                borderBottom: `1px solid ${DARK}08` }}>
                {[["B", "bold"], ["I", "italic"], ["U", "underline"]].map(([label, cmd]) => (
                  <button key={cmd} onMouseDown={e => { e.preventDefault(); execFmt(cmd); }}
                    style={{ background: "none", border: `1px solid ${DARK}15`, borderRadius: "4px",
                      width: "28px", height: "26px", cursor: "pointer", fontFamily: "'Chivo', sans-serif",
                      fontSize: "11px", fontWeight: 700, color: DARK,
                      fontStyle: cmd === "italic" ? "italic" : "normal",
                      textDecoration: cmd === "underline" ? "underline" : "none" }}>
                    {label}
                  </button>
                ))}
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "10px 20px" }}>
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={() => setHasText(editorRef.current?.innerText?.trim().length > 0)}
                  data-placeholder="Write your review..."
                  style={{ minHeight: "80px", outline: "none",
                    fontFamily: "'Chivo', sans-serif", fontSize: "13px", fontWeight: 300,
                    color: DARK, lineHeight: 1.7 }}
                />
              </div>

              <div style={{ padding: "10px 20px 16px", borderTop: `1px solid ${DARK}08` }}>
                <button disabled={!canPost}
                  style={{ width: "100%", padding: "12px", border: "none", borderRadius: "10px",
                    backgroundColor: DARK, cursor: canPost ? "pointer" : "not-allowed",
                    opacity: canPost ? 1 : 0.2, transition: "opacity 0.2s" }}>
                  <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "11px",
                    fontWeight: 900, color: CREAM, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    POST REVIEW
                  </span>
                </button>
                {!canPost && !hasText && (
                  <p style={{ textAlign: "center", fontFamily: "'Chivo', sans-serif", fontSize: "9px",
                    fontWeight: 300, color: DARK, opacity: 0.3, margin: "6px 0 0",
                    textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    write a review to post
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Exit confirm modal */}
      {exitConfirm && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 60, padding: "20px" }}>
          <div style={{ backgroundColor: CREAM, borderRadius: "16px", padding: "24px 20px",
            width: "100%", maxWidth: "360px", boxShadow: "0 16px 48px rgba(0,0,0,0.3)", textAlign: "center" }}>
            <p style={{ fontFamily: "'Chivo', sans-serif", fontSize: "13px", fontWeight: 900,
              color: DARK, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>
              Discard review?
            </p>
            <p style={{ fontFamily: "'Chivo', sans-serif", fontSize: "11px", fontWeight: 300,
              color: SECONDARY, margin: "0 0 20px", lineHeight: 1.5, opacity: 0.7 }}>
              You have unsaved changes.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setExitConfirm(false)}
                style={{ flex: 1, padding: "11px", border: `1.5px solid ${DARK}`, borderRadius: "9px",
                  background: "none", cursor: "pointer" }}>
                <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "10px", fontWeight: 700,
                  color: DARK, textTransform: "uppercase", letterSpacing: "0.08em" }}>Keep editing</span>
              </button>
              <button onClick={handleSaveDraft}
                style={{ flex: 1, padding: "11px", border: "none", borderRadius: "9px",
                  backgroundColor: SURFACE, cursor: "pointer" }}>
                <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "10px", fontWeight: 700,
                  color: DARK, textTransform: "uppercase", letterSpacing: "0.08em" }}>Save Draft</span>
              </button>
              <button onClick={handleDiscard}
                style={{ flex: 1, padding: "11px", border: "none", borderRadius: "9px",
                  backgroundColor: DARK, cursor: "pointer" }}>
                <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "10px", fontWeight: 700,
                  color: CREAM, textTransform: "uppercase", letterSpacing: "0.08em" }}>Discard</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // ── Desktop modal: content fills parent container ──
  if (isDesktopModal) {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1,
        overflow: "hidden", position: "relative" }}>
        {inner}
      </div>
    );
  }

  // ── Mobile: bottom sheet with backdrop ──
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={handleClose}
        style={{ position: "absolute", inset: 0, backgroundColor: `${DARK}99`, backdropFilter: "blur(2px)" }} />
      <div style={{ position: "relative", backgroundColor: CREAM, borderRadius: "20px 20px 0 0",
        height: "67%", display: "flex", flexDirection: "column",
        animation: "sheetUp 0.3s cubic-bezier(0.32,0.72,0,1)", boxShadow: "0 -8px 40px rgba(0,0,0,0.3)" }}>
        {inner}
      </div>
    </div>
  );
}
