export const globalCSS = `@import url('https://fonts.googleapis.com/css2?family=Chivo:ital,wght@0,300;0,400;0,700;0,900&display=swap');
@keyframes spin    { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes fadeIn  { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideInLeft  { from { opacity: 0; transform: translateX(-28px); } to { opacity: 1; transform: translateX(0); } }
@keyframes slideInRight { from { opacity: 0; transform: translateX(28px);  } to { opacity: 1; transform: translateX(0); } }
@keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
[contenteditable]:empty:before { content: attr(data-placeholder); color: #201D1940; pointer-events: none; }
* { -webkit-tap-highlight-color: transparent; }
html, body { overscroll-behavior: none; }`;
