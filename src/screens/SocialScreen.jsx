import { useState, useRef, useEffect } from "react";
import { DARK, BLUE, SURFACE, SECONDARY, CREAM } from '../theme';
import { Avatar } from '../components/shared/Avatar';
import { mockActivity, mockConvos, mockThreads } from '../data/mockData';

function ActivityItem({ item }) {
  const nameStyle = { fontFamily: "'Chivo', sans-serif", fontSize: "12px", fontWeight: 900, color: DARK };
  const textStyle = { fontFamily: "'Chivo', sans-serif", fontSize: "12px", fontWeight: 300, color: DARK };
  const timeStyle = { fontFamily: "'Chivo', sans-serif", fontSize: "9px", fontWeight: 300,
    color: DARK, opacity: 0.3, textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0 };

  return (
    <div style={{ display: "flex", gap: "11px", padding: "14px 20px",
      borderBottom: `1px solid ${DARK}08` }}>
      <Avatar colors={item.avatar} size={34} />
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* Review */}
        {item.type === "review" && (<>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
            <p style={{ margin: 0, lineHeight: 1.45 }}>
              <span style={nameStyle}>@{item.user}</span>
              <span style={textStyle}> reviewed </span>
              <span style={nameStyle}>{item.subject}</span>
            </p>
            <span style={timeStyle}>{item.time}</span>
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "8px",
            backgroundColor: SURFACE, borderRadius: "10px", padding: "10px", overflow: "hidden" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "6px", flexShrink: 0,
              background: `linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1]})` }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "4px" }}>
                <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "14px", fontWeight: 900, color: BLUE }}>
                  {item.rating.toFixed(1)}
                </span>
                <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "8px", fontWeight: 300,
                  color: DARK, opacity: 0.3 }}>/5</span>
                <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "9px", fontWeight: 300,
                  color: SECONDARY, opacity: 0.5, marginLeft: "2px" }}>{item.artist}</span>
              </div>
              <p style={{ fontFamily: "'Chivo', sans-serif", fontSize: "11px", fontWeight: 300,
                color: DARK, margin: 0, lineHeight: 1.5, opacity: 0.7,
                overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical" }}>
                "{item.snippet}"
              </p>
            </div>
          </div>
        </>)}

        {/* Follow */}
        {item.type === "follow" && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
            <p style={{ margin: 0, lineHeight: 1.45 }}>
              <span style={nameStyle}>@{item.user}</span>
              <span style={textStyle}> followed </span>
              <span style={nameStyle}>@{item.target}</span>
            </p>
            <span style={timeStyle}>{item.time}</span>
          </div>
        )}

        {/* Like */}
        {item.type === "like" && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
            <p style={{ margin: 0, lineHeight: 1.45 }}>
              <span style={nameStyle}>@{item.user}</span>
              <span style={textStyle}> liked </span>
              <span style={nameStyle}>@{item.target}</span>
              <span style={textStyle}>'s review of </span>
              <span style={nameStyle}>{item.subject}</span>
            </p>
            <span style={timeStyle}>{item.time}</span>
          </div>
        )}

        {/* Mixtape */}
        {item.type === "mixtape" && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
            <p style={{ margin: 0, lineHeight: 1.45 }}>
              <span style={nameStyle}>@{item.user}</span>
              <span style={textStyle}> made a mixtape · </span>
              <span style={nameStyle}>{item.mixtapeTitle}</span>
            </p>
            <span style={timeStyle}>{item.time}</span>
          </div>
        )}

        {/* Vinyl update */}
        {item.type === "vinyl" && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
            <p style={{ margin: 0, lineHeight: 1.45 }}>
              <span style={nameStyle}>@{item.user}</span>
              <span style={textStyle}> updated their </span>
              <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "12px", fontWeight: 900,
                color: BLUE }}>VINYL</span>
            </p>
            <span style={timeStyle}>{item.time}</span>
          </div>
        )}

      </div>
    </div>
  );
}

function DMThread({ convo, onBack }) {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState(mockThreads[convo.id] || []);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMsgs(m => [...m, { from: "me", text, time: "now" }]);
    setInput("");
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden",
      animation: "fadeIn 0.18s ease" }}>
      {/* Thread header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px",
        padding: "10px 16px 12px", borderBottom: `1px solid ${DARK}10` }}>
        <button onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 0",
            fontFamily: "'Chivo', sans-serif", fontSize: "9px", fontWeight: 700,
            color: DARK, opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          ← back
        </button>
        <Avatar colors={convo.avatar} size={28} />
        <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "12px", fontWeight: 900,
          color: DARK }}>@{convo.user}</span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex",
        flexDirection: "column", gap: "6px" }}>
        {msgs.map((msg, i) => {
          const isMe = msg.from === "me";
          return (
            <div key={i} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "75%", backgroundColor: isMe ? DARK : SURFACE,
                borderRadius: isMe ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                padding: "9px 13px" }}>
                <p style={{ fontFamily: "'Chivo', sans-serif", fontSize: "12px", fontWeight: 300,
                  color: isMe ? CREAM : DARK, margin: 0, lineHeight: 1.45 }}>{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: "8px", padding: "10px 16px 14px",
        borderTop: `1px solid ${DARK}08` }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="message..."
          style={{ flex: 1, backgroundColor: SURFACE, border: "none", outline: "none",
            borderRadius: "20px", padding: "10px 14px",
            fontFamily: "'Chivo', sans-serif", fontSize: "12px", fontWeight: 300, color: DARK }} />
        <button onClick={send}
          style={{ width: "36px", height: "36px", borderRadius: "50%", border: "none",
            backgroundColor: input.trim() ? DARK : SURFACE, cursor: "pointer",
            transition: "background-color 0.15s", display: "flex", alignItems: "center",
            justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke={input.trim() ? CREAM : DARK} strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" style={{ opacity: input.trim() ? 1 : 0.25 }}>
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function DMList({ onOpen, onBack }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden",
      animation: "fadeIn 0.18s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px",
        padding: "10px 16px 12px", borderBottom: `1px solid ${DARK}10` }}>
        <button onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 0",
            fontFamily: "'Chivo', sans-serif", fontSize: "9px", fontWeight: 700,
            color: DARK, opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          ← back
        </button>
        <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "11px", fontWeight: 900,
          color: DARK, textTransform: "uppercase", letterSpacing: "0.1em" }}>messages</span>
      </div>
      {/* Convo list */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {mockConvos.map((c, i) => (
          <button key={c.id} onClick={() => onOpen(c)}
            style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%",
              padding: "13px 20px", background: "none", border: "none", cursor: "pointer",
              borderBottom: `1px solid ${DARK}07`, textAlign: "left",
              animation: `fadeIn 0.15s ease ${i * 0.04}s both` }}>
            <div style={{ position: "relative" }}>
              <Avatar colors={c.avatar} size={40} />
              {c.unread > 0 && (
                <div style={{ position: "absolute", top: -2, right: -2, width: "16px", height: "16px",
                  borderRadius: "50%", backgroundColor: BLUE,
                  display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "8px",
                    fontWeight: 900, color: CREAM }}>{c.unread}</span>
                </div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "12px",
                  fontWeight: c.unread > 0 ? 900 : 700, color: DARK }}>@{c.user}</span>
                <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "9px", fontWeight: 300,
                  color: DARK, opacity: 0.3, flexShrink: 0 }}>{c.time}</span>
              </div>
              <p style={{ fontFamily: "'Chivo', sans-serif", fontSize: "11px", fontWeight: 300,
                color: DARK, opacity: c.unread > 0 ? 0.7 : 0.4, margin: "2px 0 0",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {c.lastMsg}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function SocialScreen() {
  const [dmView, setDmView]       = useState(null); // null | "list" | convo object
  const totalUnread = mockConvos.reduce((n, c) => n + c.unread, 0);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Social header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 20px 12px", borderBottom: `1px solid ${DARK}10`, flexShrink: 0 }}>
        <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "11px", fontWeight: 900,
          color: DARK, textTransform: "uppercase", letterSpacing: "0.1em" }}>following</span>
        {/* DM icon */}
        <button onClick={() => setDmView("list")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px",
            position: "relative", color: DARK, opacity: 0.55 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {totalUnread > 0 && (
            <div style={{ position: "absolute", top: 0, right: 0, width: "14px", height: "14px",
              borderRadius: "50%", backgroundColor: BLUE,
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "7px",
                fontWeight: 900, color: CREAM }}>{totalUnread}</span>
            </div>
          )}
        </button>
      </div>

      {/* DM overlay */}
      {dmView !== null && (
        <div style={{ position: "absolute", inset: 0, backgroundColor: CREAM, zIndex: 20,
          display: "flex", flexDirection: "column" }}>
          {/* Push past header */}
          <div style={{ height: "56px", flexShrink: 0 }} />
          {dmView === "list"
            ? <DMList onOpen={c => setDmView(c)} onBack={() => setDmView(null)} />
            : <DMThread convo={dmView} onBack={() => setDmView("list")} />
          }
        </div>
      )}

      {/* Activity feed */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {mockActivity.map(item => <ActivityItem key={item.id} item={item} />)}
        <div style={{ height: "20px" }} />
      </div>
    </div>
  );
}
