import { useState, useEffect } from "react";
import { CREAM } from '../../theme';

export function PhoneShell({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) {
    return (
      <div style={{ width: "100vw", height: "100dvh", backgroundColor: CREAM,
        display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        {children}
      </div>
    );
  }

  // Desktop: full-width app layout
  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: CREAM,
      display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      {children}
    </div>
  );
}
