import { useState, useEffect } from "react";
import { DARK, CREAM } from './theme';
import { globalCSS } from './styles/GlobalStyles';
import { PhoneShell } from './components/layout/PhoneShell';
import { BottomNav } from './components/layout/BottomNav';
import { SideNav } from './components/layout/SideNav';
import { PostSheet } from './components/PostSheet';
import { SearchScreen } from './components/SearchScreen';
import { VNYLLogo } from './components/shared/VNYLLogo';
import { HomeScreen } from './screens/HomeScreen';
import { ChartsScreen } from './screens/ChartsScreen';
import { SocialScreen } from './screens/SocialScreen';
import { navItems } from './data/mockData';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function ScreenContent({ activeNav, searching, setSearching }) {
  if (searching) return <SearchScreen onClose={() => setSearching(false)} />;
  return (
    <>
      {activeNav === 0 && <HomeScreen />}
      {activeNav === 1 && <ChartsScreen />}
      {activeNav === 2 && <SocialScreen />}
      {![0, 1, 2].includes(activeNav) && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "11px", fontWeight: 300,
            color: DARK, opacity: 0.25, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {activeNav === 99 ? "rate" : navItems.find(n => n.idx === activeNav)?.label}
          </span>
        </div>
      )}
    </>
  );
}

export default function VNYLApp() {
  const [activeNav,   setActiveNav]   = useState(0);
  const [spinning,    setSpinning]    = useState(false);
  const [sheetOpen,   setSheetOpen]   = useState(false);
  const [searching,   setSearching]   = useState(false);
  const isMobile = useIsMobile();

  const openSheet = () => { setSheetOpen(true); setSpinning(true); };
  const closeSheet = () => { setSheetOpen(false); setSpinning(false); };

  // Desktop page titles
  const pageTitles = { 0: "home", 1: "charts", 2: "social", 3: "profile" };

  return (
    <>
      <style>{globalCSS}</style>

      {isMobile ? (
        /* ─── MOBILE LAYOUT ─── */
        <PhoneShell>
          {/* Header */}
          <div style={{ position: "relative", display: "flex", alignItems: "center",
            justifyContent: "center", padding: "10px 16px 14px",
            borderBottom: `1.5px solid ${DARK}`, flexShrink: 0 }}>
            <VNYLLogo height={20} color={DARK} />
            <button onClick={() => setSearching(true)}
              style={{ position: "absolute", right: "16px", background: "none", border: "none",
                cursor: "pointer", padding: "4px", lineHeight: 1,
                color: DARK, opacity: searching ? 0 : 0.45, transition: "opacity 0.15s" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="22" y2="22" />
              </svg>
            </button>
          </div>

          <ScreenContent activeNav={activeNav} searching={searching} setSearching={setSearching} />

          <PostSheet open={sheetOpen} onClose={closeSheet} />

          <BottomNav active={activeNav} setActive={setActiveNav}
            spinning={spinning} setSpinning={setSpinning} onDiscTap={openSheet} />
        </PhoneShell>
      ) : (
        /* ─── DESKTOP LAYOUT ─── */
        <div style={{ width: "100vw", height: "100vh", backgroundColor: CREAM,
          display: "flex", overflow: "hidden", position: "relative" }}>

          {/* Sidebar */}
          <SideNav
            active={activeNav}
            setActive={(idx) => { setActiveNav(idx); setSearching(false); }}
            spinning={spinning}
            setSpinning={setSpinning}
            onDiscTap={openSheet}
            onSearchClick={() => setSearching(true)}
          />

          {/* Main content area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden",
            position: "relative" }}>

            {/* Desktop top bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 32px 18px", borderBottom: `1px solid ${DARK}10`, flexShrink: 0 }}>
              <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "22px", fontWeight: 900,
                color: DARK, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {searching ? "search" : (pageTitles[activeNav] || "")}
              </span>
              {/* Search bar in top bar */}
              {!searching && (
                <button onClick={() => setSearching(true)}
                  style={{ display: "flex", alignItems: "center", gap: "8px",
                    backgroundColor: `${DARK}06`, border: "none", borderRadius: "10px",
                    padding: "9px 16px", cursor: "pointer" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke={DARK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ opacity: 0.3 }}>
                    <circle cx="11" cy="11" r="7" />
                    <line x1="16.5" y1="16.5" x2="22" y2="22" />
                  </svg>
                  <span style={{ fontFamily: "'Chivo', sans-serif", fontSize: "12px", fontWeight: 300,
                    color: DARK, opacity: 0.3 }}>Search artists, albums, songs...</span>
                </button>
              )}
            </div>

            {/* Page content — constrained width for readability */}
            <div style={{ flex: 1, overflowY: "auto", display: "flex",
              justifyContent: "center" }}>
              <div style={{ width: "100%", maxWidth: "720px", display: "flex",
                flexDirection: "column", flex: 1 }}>
                <ScreenContent activeNav={activeNav} searching={searching} setSearching={setSearching} />
              </div>
            </div>

            {/* Post sheet — desktop modal overlay */}
            {sheetOpen && (
              <div style={{ position: "absolute", inset: 0, zIndex: 50,
                display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div onClick={closeSheet}
                  style={{ position: "absolute", inset: 0, backgroundColor: `${DARK}55`,
                    backdropFilter: "blur(4px)" }} />
                <div style={{ position: "relative", width: "420px", maxHeight: "80vh",
                  backgroundColor: CREAM, borderRadius: "20px",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
                  display: "flex", flexDirection: "column", overflow: "hidden",
                  zIndex: 51 }}>
                  <PostSheet open={true} onClose={closeSheet} isDesktopModal />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
