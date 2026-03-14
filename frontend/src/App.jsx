import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import CONFIG from "./config";

const ThemeCtx = createContext();
const useTheme = () => useContext(ThemeCtx);

const API = CONFIG.API_URL;

const api = async (path, opts = {}) => {
  const r = await fetch(API + path, opts);
  if (!r.ok) { const e = await r.json().catch(() => ({ detail: r.statusText })); throw new Error(e.detail || r.statusText); }
  return r.json();
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ic = ({ p, s = 16, c = "currentColor", sw = 1.8 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(p) ? p.map((d, i) => <path key={i} d={d} />) : <path d={p} />}
  </svg>
);
const I = {
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  compose: ["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7","M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"],
  contacts: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2","M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z","M23 21v-2a4 4 0 0 0-3-3.87","M16 3.13a4 4 0 0 1 0 7.75"],
  template: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"],
  send: ["M22 2L11 13","M22 2L15 22 8 13 2 8z"],
  history: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z","M12 6v6l4 2"],
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  sun: ["M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42","M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"],
  upload: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M17 8l-5-5-5 5","M12 3v12"],
  trash: ["M3 6h18","M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"],
  x: "M18 6L6 18M6 6l12 12",
  check: "M20 6L9 17l-5-5",
  search: ["M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5z","M16 16l4.5 4.5"],
  link: ["M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71","M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"],
  clock: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z","M12 6v6l4 2"],
  eye: ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"],
  mail: ["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","M22 6l-10 7L2 6"],
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  alert: ["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z","M12 9v4","M12 17h.01"],
  sparkle: ["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z","M5 3l.5 1.5L7 5l-1.5.5L5 7l-.5-1.5L3 5l1.5-.5z"],
  lightbulb: "M21 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2zM9 5a3 3 0 0 1 6 0v7H9V5z",
  arrowright: "M5 12h14M12 5l7 7-7 7",
  grid: ["M3 3h7v7H3z","M14 3h7v7h-7z","M14 14h7v7h-7z","M3 14h7v7H3z"],
  list: ["M8 6h13","M8 12h13","M8 18h13","M3 6h.01","M3 12h.01","M3 18h.01"],
  download: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"],
  info: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z","M12 8h.01","M12 12v4"],
  chevright: "M9 18l6-6-6-6",
  chevdown: "M6 9l6 6 6-6",
  paperclip: "M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48",
  repeat: ["M17 1l4 4-4 4","M3 11V9a4 4 0 0 1 4-4h14","M7 23l-4-4 4-4","M21 13v2a4 4 0 0 1-4 4H3"],
  whatsapp: ["M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"],
  gauge: ["M12 2a10 10 0 0 1 10 10","M12 2a10 10 0 0 0-10 10","M12 12m-1 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0","M12 12l4-4"],
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3",
  globe: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z","M2 12h20","M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"],
  plane: "M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  tag: ["M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z","M7 7h.01"],
  refresh: ["M23 4v6h-6","M1 20v-6h6","M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"],
  reply: ["M9 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3","M13 21l-4-4 4-4","M9 17h8a2 2 0 0 0 2-2v-3"],
  ban: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z","M4.93 4.93l14.14 14.14"],
};

// ─── Global Styles ────────────────────────────────────────────────────────────
function GS({ dark }) {
  return <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --fh:'Syne',sans-serif; --fb:'Instrument Sans',sans-serif;
      ${dark?`
        --bg:#0b0d13;--bg2:#111520;--bg3:#171c2a;--bg4:#1d2436;
        --border:#232a3c;--border2:#2c3550;
        --text:#e4e8f5;--text2:#8a94b0;--text3:#4c566e;
        --accent:#4f7cff;--accent2:#3a68f0;
        --accentbg:rgba(79,124,255,0.1);--accentborder:rgba(79,124,255,0.22);
        --green:#1ec99a;--greenbg:rgba(30,201,154,0.1);
        --red:#ff4f61;--redbg:rgba(255,79,97,0.1);
        --amber:#ffb340;--amberbg:rgba(255,179,64,0.1);
        --purple:#9b7dff;--purplebg:rgba(155,125,255,0.1);
        --teal:#00c8d7;--tealbg:rgba(0,200,215,0.1);
        --shadow:0 2px 20px rgba(0,0,0,.5);--shadow2:0 12px 50px rgba(0,0,0,.65);
      `:`
        --bg:#f1f3f8;--bg2:#ffffff;--bg3:#edf0f6;--bg4:#e1e6f0;
        --border:#dde1ec;--border2:#ccd2e2;
        --text:#161928;--text2:#505c78;--text3:#8b95ae;
        --accent:#3a6bef;--accent2:#2d5cde;
        --accentbg:rgba(58,107,239,0.07);--accentborder:rgba(58,107,239,0.18);
        --green:#0db88a;--greenbg:rgba(13,184,138,0.07);
        --red:#e63244;--redbg:rgba(230,50,68,0.07);
        --amber:#e08b0a;--amberbg:rgba(224,139,10,0.07);
        --purple:#7c5cf0;--purplebg:rgba(124,92,240,0.07);
        --teal:#00a8b5;--tealbg:rgba(0,168,181,0.07);
        --shadow:0 2px 14px rgba(0,0,0,.07);--shadow2:0 12px 40px rgba(0,0,0,.14);
      `}
    }
    html,body,#root{height:100%}
    body{font-family:var(--fb);background:var(--bg);color:var(--text);transition:background .3s,color .3s;-webkit-font-smoothing:antialiased}
    body.galaxy{background:rgba(7,16,42,0.08)}html.galaxy{background:rgba(7,16,42,0.08)}
    body.cowboy{background:rgba(135,206,235,0.06)}html.cowboy{background:rgba(135,206,235,0.06)}
    input,textarea,select,button{font-family:var(--fb)}
    ::-webkit-scrollbar{width:5px;height:5px}
    ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:10px}
    ::selection{background:var(--accentbg);color:var(--accent)}
    .app{display:flex;height:100vh;overflow:hidden;position:relative;background:var(--bg)}
    .app.galaxy{background:rgba(7,16,42,0.08)}
    .app.cowboy{background:rgba(135,206,235,0.06)}
    .sidebar{width:230px;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0;transition:background .3s,width .3s,border-color .3s;position:relative;z-index:10;pointer-events:auto}
    .app.galaxy .sidebar{background:rgba(8,12,22,0.55);border-right-color:rgba(80,120,255,0.15);backdrop-filter:blur(12px)}
    .app.cowboy .sidebar{background:rgba(135,206,235,0.08);border-right-color:rgba(32,178,170,0.15);backdrop-filter:blur(12px)}
    .sidebar::after{content:'';position:absolute;right:0;top:0;bottom:0;width:1px;background:linear-gradient(to bottom,var(--border),transparent)}
    .logo-wrap{padding:20px 18px 14px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border);position:relative;overflow:hidden;background:linear-gradient(135deg,rgba(0,200,215,.03),rgba(155,125,255,.02));border-radius:0 0 12px 0}
    .logo-wrap::before{content:'';position:absolute;top:-80px;left:-100px;width:400px;height:400px;pointer-events:none;animation:stars-flow-across 8s linear infinite;background-image:
      radial-gradient(1.5px 1.5px at 20% 30%,rgba(0,200,215,.95),transparent),
      radial-gradient(2px 2px at 40% 20%,rgba(155,125,255,.85),transparent),
      radial-gradient(1px 1px at 60% 45%,rgba(100,200,255,.75),transparent),
      radial-gradient(1.5px 1.5px at 50% 65%,rgba(0,180,200,.85),transparent),
      radial-gradient(1px 1px at 30% 55%,rgba(200,150,255,.7),transparent),
      radial-gradient(2px 2px at 70% 35%,rgba(0,210,220,.9),transparent),
      radial-gradient(1px 1px at 45% 80%,rgba(150,100,255,.75),transparent),
      radial-gradient(1.5px 1.5px at 80% 50%,rgba(0,190,210,.85),transparent),
      radial-gradient(1px 1px at 25% 75%,rgba(100,150,255,.65),transparent),
      radial-gradient(1.5px 1.5px at 75% 25%,rgba(0,200,215,.8),transparent);
    background-repeat:no-repeat;background-size:100% 100%;opacity:0.9}
    .logo-wrap::after{content:'';position:absolute;top:8px;right:12px;width:18px;height:18px;background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.9),rgba(200,220,255,.4) 40%,transparent 70%);border-radius:50%;box-shadow:inset -1px -1px 3px rgba(0,0,0,.3),0 0 12px rgba(0,200,215,.5);animation:gentle-float 4s ease-in-out infinite;z-index:8}
    ${!dark?`.logo-wrap::before{width:100px !important;height:60px !important;background-image:radial-gradient(ellipse 20px 11px at 3% 37%,rgba(200,220,245,.92) 0%,rgba(180,200,230,.6) 60%,transparent 95%),radial-gradient(ellipse 24px 12px at 11% 43%,rgba(210,230,250,.9) 0%,rgba(190,210,240,.55) 65%,transparent 92%),radial-gradient(ellipse 26px 13px at 24% 35%,rgba(205,225,248,.95) 0%,rgba(185,210,240,.65) 60%,transparent 88%),radial-gradient(ellipse 22px 11px at 38% 41%,rgba(215,235,255,.88) 0%,rgba(195,220,245,.6) 65%,transparent 90%) !important;background-size:100% 100% !important;opacity:0.9 !important;animation:clouds-drift 12s linear infinite !important;top:-12px !important;left:60px !important;z-index:25 !important}`:''}
    ${!dark?`.logo-wrap::after{background:radial-gradient(circle at 30% 30%,#ffd700 0%,#ffed4e 28%,rgba(255,200,0,.8) 62%,transparent 100%);box-shadow:inset -1px -1px 3px rgba(0,0,0,.1),0 0 8px rgba(255,200,0,.7),0 0 16px rgba(255,150,0,.5),0 0 24px rgba(255,100,0,.3)}`:''}
    .logo-mark{width:48px;height:48px;flex-shrink:0;transition:all .3s;animation:gentle-float 3s ease-in-out infinite;border-radius:12px;object-fit:cover;object-position:center;padding:0;transform:scale(1.2);transform-origin:center;position:relative;z-index:10;filter:drop-shadow(0 0 12px rgba(0,200,215,.5)) drop-shadow(0 0 24px rgba(155,125,255,.3))}
    .logo-mark::before{content:'';position:absolute;inset:-50px;background:radial-gradient(circle at center,rgba(0,200,215,.2) 0%,rgba(155,125,255,.1) 60%,transparent 100%);animation:nebula-pulse 5s ease-in-out infinite;pointer-events:none}
    .logo-text{font-family:var(--fh);font-weight:800;font-size:15px;color:var(--text);letter-spacing:-.5px;position:relative;z-index:5}
    .logo-text::before{content:'';position:absolute;top:calc(50% - 100px);left:calc(50% - 250px);height:2px;background:linear-gradient(-45deg, #FFD700, rgba(255,215,0,0));border-radius:999px;filter:drop-shadow(0 0 6px #FFD700);pointer-events:none;z-index:10}
    .logo-text.shooting::before{animation:tail 1.5s ease-in-out 1, falling 1.5s ease-in-out 1, shining 1.5s ease-in-out 1}
    .logo-sub{font-size:10px;color:var(--text3);font-weight:500;letter-spacing:.6px;text-transform:uppercase;position:relative}
    .star-head{position:absolute;top:-3px;right:-4px;width:8px;height:8px;border-radius:50%;background:radial-gradient(circle at 38% 36%, #ffffff 0%, #fffbe0 28%, rgba(255,215,50,.6) 62%, transparent 100%);box-shadow:0 0 4px 2px rgba(255,255,255,.95), 0 0 12px 4px rgba(255,215,50,.8), 0 0 26px 8px rgba(255,150,0,.35);pointer-events:none}
    #spaceCanvas{position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:0;opacity:1;pointer-events:none;display:none;background:rgba(7,16,42,0.1)}\n    .app.galaxy #spaceCanvas{display:block}
    .app.galaxy .sidebar{background:rgba(8,12,22,0.15);border-right-color:rgba(80,120,255,0.08)}
    .app.galaxy .logo-icon{box-shadow:0 0 14px rgba(80,180,255,0.5)}
    .app.galaxy .nav-item.active{background:rgba(20,50,100,0.3) !important}
    .app.galaxy .page-title{color:#a8d4ff;text-shadow:0 0 24px rgba(80,160,255,0.45)}
    .app.galaxy .card{background:rgba(8,14,30,0.15);border-color:rgba(50,90,180,0.1);box-shadow:0 0 20px rgba(40,80,200,0.02)}
    .app.galaxy .ni{color:rgba(150,200,255,0.85)}
    .app.galaxy .ni:hover{color:rgba(200,230,255,0.95);background:rgba(30,80,160,0.2)}
    .app.galaxy .ni.active{color:#4db8ff;background:rgba(20,50,100,0.3)}
    .app.galaxy .nav-lbl{color:rgba(100,150,255,0.75)}
    .app.galaxy .sidebar-bot{border-top-color:rgba(80,120,255,0.08)}
    .app.galaxy .auth-pill{background:rgba(20,50,100,0.12);border-color:rgba(80,120,255,0.1)}
    .app.galaxy .auth-pill:hover{background:rgba(20,50,100,0.18);border-color:rgba(80,120,255,0.15)}
    .app.cowboy #spaceCanvas{display:block}
    .app.cowboy .logo-icon{box-shadow:0 0 14px rgba(32,178,170,0.6)}
    .app.cowboy .page-title{color:#20B2AA;text-shadow:0 0 24px rgba(0,191,255,0.35)}
    .app.cowboy .card{background:rgba(135,206,235,0.08);border-color:rgba(32,178,170,0.2);box-shadow:0 0 20px rgba(0,191,255,0.05)}
    .app.cowboy .ni{color:rgba(0,150,180,0.85)}
    .app.cowboy .ni:hover{color:rgba(0,200,220,0.95);background:rgba(32,178,170,0.2)}
    .app.cowboy .ni.active{color:#20B2AA;background:rgba(32,178,170,0.15)}
    .app.cowboy .nav-lbl{color:rgba(32,178,170,0.75)}
    .app.cowboy .sidebar-bot{border-top-color:rgba(32,178,170,0.18)}
    .app.cowboy .auth-pill{background:rgba(32,178,170,0.12);border-color:rgba(32,178,170,0.2)}
    .app.cowboy .auth-pill:hover{background:rgba(32,178,170,0.18);border-color:rgba(32,178,170,0.3)}
    .flash{position:absolute;inset:0;pointer-events:none;z-index:3;opacity:0;border-radius:14px}
    .nav-sec{padding:10px 8px 2px}
    .nav-lbl{font-size:9px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1.3px;padding:0 10px 5px}
    .ni{display:flex;align-items:center;gap:9px;padding:9px 11px;border-radius:9px;cursor:pointer;color:var(--text2);font-size:13.5px;font-weight:500;transition:all .16s cubic-bezier(.34,.1,.68,1);border:none;background:none;width:100%;text-align:left;position:relative;overflow:hidden}
    .ni::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--accent);transform:scaleY(0);transition:transform .2s;transform-origin:center}
    .ni:hover{background:var(--bg3);color:var(--text);transform:translateX(4px)}
    .ni.active{background:var(--accentbg);color:var(--accent);font-weight:600}
    .ni.active::before{transform:scaleY(1)}
    .nbadge{margin-left:auto;background:var(--green);color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;animation:pulse-scale .8s ease-in-out infinite}
    .nbadge.blue{background:var(--accent)}
    .sidebar-bot{margin-top:auto;padding:12px 10px;border-top:1px solid var(--border)}
    .auth-pill{background:var(--bg3);border-radius:11px;padding:10px 12px;display:flex;align-items:center;gap:9px;transition:all .2s;cursor:pointer}
    .auth-pill:hover{background:var(--bg4);border-color:var(--border2)}
    .auth-av{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,var(--accent),var(--purple));display:flex;align-items:center;justify-content:center;font-family:var(--fh);font-weight:800;font-size:13px;color:#fff;flex-shrink:0;box-shadow:0 2px 8px rgba(79,124,255,.3)}
    .auth-email{font-size:11px;color:var(--text2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}
    .auth-dot{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 0 2px var(--greenbg);flex-shrink:0;animation:pulse-dot 2s ease-in-out infinite}
    .main{flex:1;overflow:hidden;display:flex;flex-direction:column;position:relative;z-index:10;background:var(--bg1);transition:background .6s;pointer-events:auto}
    .app.galaxy .main{background:rgba(8,12,22,0.12);backdrop-filter:blur(4px)}
    .app.cowboy .main{background:rgba(135,206,235,0.06);backdrop-filter:blur(8px)}
    .topbar{height:57px;border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 24px;gap:10px;background:var(--bg2);flex-shrink:0;backdrop-filter:blur(10px)}
    .app.galaxy .topbar{background:rgba(8,12,22,0.15);border-bottom-color:rgba(80,120,255,0.08);backdrop-filter:blur(8px)}
    .app.cowboy .topbar{background:rgba(135,206,235,0.06);border-bottom-color:rgba(32,178,170,0.12);backdrop-filter:blur(12px)}
    .tb-title{font-family:var(--fh);font-weight:700;font-size:17px;color:var(--text);flex:1;letter-spacing:-.3px}
    .app.galaxy .tb-title{color:#a8d4ff}
    .app.cowboy .tb-title{color:#20B2AA}
    .content{flex:1;overflow-y:auto;padding:24px 28px}
    .app.galaxy .content{background:rgba(8,12,22,0.02)}
    .app.cowboy .content{background:rgba(135,206,235,0.04)}
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 16px;border-radius:10px;border:none;cursor:pointer;font-size:13px;font-weight:600;transition:all .16s cubic-bezier(.34,.1,.68,1);white-space:nowrap;position:relative;overflow:hidden}
    .btn::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at var(--x,50%) var(--y,50%),rgba(255,255,255,.3),transparent);opacity:0;transition:opacity .3s}
    .btn:hover::before{opacity:1}
    .btn-p{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;box-shadow:0 4px 16px rgba(79,124,255,.32);border:1px solid rgba(79,124,255,.4)}
    .btn-p:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(79,124,255,.42)}
    .btn-g{background:var(--bg3);color:var(--text2);border:1.5px solid var(--border);position:relative}
    .btn-g:hover{background:var(--bg4);color:var(--text);border-color:var(--border2);transform:translateY(-1px)}
    .btn-d{background:var(--redbg);color:var(--red);border:1.5px solid rgba(255,79,97,.24)}
    .btn-d:hover{background:var(--red);color:#fff;box-shadow:0 4px 16px rgba(255,79,97,.32)}
    .btn-green{background:linear-gradient(135deg,var(--greenbg),rgba(30,201,154,.15));color:var(--green);border:1.5px solid rgba(30,201,154,.3)}
    .btn-green:hover{background:var(--green);color:#fff;box-shadow:0 4px 16px rgba(30,201,154,.32)}
    .btn-purple{background:linear-gradient(135deg,var(--purplebg),rgba(155,125,255,.15));color:var(--purple);border:1.5px solid rgba(155,125,255,.3)}
    .btn-purple:hover{background:var(--purple);color:#fff;box-shadow:0 4px 16px rgba(155,125,255,.32)}
    .bti{padding:8px;border-radius:9px;background:var(--bg3);border:1.5px solid var(--border);color:var(--text2);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:all .16s;position:relative}
    .bti:hover{background:var(--bg4);color:var(--text);border-color:var(--border2);transform:translateY(-1px);box-shadow:0 2px 8px rgba(0,0,0,.1)}
    .btn:disabled,.bti:disabled{opacity:.45;cursor:not-allowed;transform:none!important;box-shadow:none!important}
    .card{background:linear-gradient(135deg,var(--bg2),color-mix(in srgb,var(--bg2) 95%,var(--bg3)));border:1.5px solid var(--border);border-radius:16px;padding:20px;transition:all .24s cubic-bezier(.34,.1,.68,1);position:relative;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)}
    .card::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at top right,-20%,-20%,transparent);pointer-events:none}
    .card:hover{border-color:var(--border2);box-shadow:0 8px 28px rgba(0,0,0,.14);transform:translateY(-2px)}
    .csm{padding:13px 16px}
    .fl{font-size:10.5px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1.1px;margin-bottom:9px;display:flex;align-items:center;gap:5px}
    .inp{width:100%;background:var(--bg3);border:1.5px solid var(--border);border-radius:10px;padding:10px 14px;color:var(--text);font-size:13.5px;outline:none;transition:all .16s;box-shadow:0 1px 3px rgba(0,0,0,.04)}
    .inp:focus{border-color:var(--accent);background:var(--bg2);box-shadow:0 0 0 3px var(--accentbg),0 2px 8px rgba(79,124,255,.12)}
    .inp::placeholder{color:var(--text3)}
    .txta{width:100%;background:var(--bg3);border:1.5px solid var(--border);border-radius:10px;padding:12px 14px;color:var(--text);font-size:13.5px;outline:none;resize:vertical;min-height:120px;transition:all .16s;font-family:var(--fb);line-height:1.65;box-shadow:0 1px 3px rgba(0,0,0,.04)}
    .txta:focus{border-color:var(--accent);background:var(--bg2);box-shadow:0 0 0 3px var(--accentbg),0 2px 8px rgba(79,124,255,.12)}
    .sel{width:100%;background:var(--bg3);border:1.5px solid var(--border);border-radius:10px;padding:10px 14px;color:var(--text);font-size:13.5px;outline:none;cursor:pointer;transition:all .16s;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%238a94b0' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:36px}
    .sel:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accentbg)}
    .badge{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:99px;font-size:11.5px;font-weight:600;backdrop-filter:blur(10px);transition:all .2s}
    .b-blue{background:var(--accentbg);color:var(--accent);border:1px solid var(--accentborder)}
    .b-green{background:var(--greenbg);color:var(--green);border:1px solid rgba(30,201,154,.3)}
    .b-red{background:var(--redbg);color:var(--red);border:1px solid rgba(255,79,97,.3)}
    .b-amber{background:var(--amberbg);color:var(--amber);border:1px solid rgba(255,179,64,.2)}
    .b-gray{background:var(--bg3);color:var(--text3);border:1px solid var(--border)}
    .b-purple{background:var(--purplebg);color:var(--purple);border:1px solid rgba(155,125,255,.2)}
    .b-teal{background:var(--tealbg);color:var(--teal);border:1px solid rgba(0,200,215,.2)}
    .tbl{width:100%;border-collapse:separate;border-spacing:0;font-size:13px;background:var(--bg2)}
    .tbl thead{position:sticky;top:0;background:var(--bg2);z-index:10}
    .tbl th{text-align:left;padding:12px 14px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--text3);border-bottom:1.5px solid var(--border);white-space:nowrap;background:linear-gradient(180deg,var(--bg2),var(--bg3))}
    .tbl td{padding:12px 14px;border-bottom:1px solid var(--border);color:var(--text2);vertical-align:middle;transition:background .12s}
    .tbl tbody tr:hover td{background:var(--bg3)}
    .tbl input[type=checkbox]{accent-color:var(--accent);cursor:pointer;width:15px;height:15px;border-radius:4px}
    .stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}
    .stat-card{background:linear-gradient(135deg,var(--bg2),color-mix(in srgb,var(--bg2) 96%,var(--bg3)));border:1.5px solid var(--border);border-radius:16px;padding:20px;position:relative;overflow:hidden;transition:all .24s;box-shadow:0 2px 12px rgba(0,0,0,.08)}
    .stat-card::before{content:'';position:absolute;inset:-1px;background:linear-gradient(135deg,var(--accent),var(--purple));opacity:0;border-radius:16px;z-index:-1;transition:opacity .3s}
    .stat-card::after{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:16px 16px 0 0}
    .stat-card:hover{border-color:var(--border2);transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.16)}
    .sc-blue::after{background:linear-gradient(90deg,var(--accent),var(--accent2))}.sc-green::after{background:linear-gradient(90deg,var(--green),#20e6b5)}.sc-amber::after{background:linear-gradient(90deg,var(--amber),#ffc966)}.sc-red::after{background:linear-gradient(90deg,var(--red),#ff7a8f)}.sc-purple::after{background:linear-gradient(90deg,var(--purple),#b5a4ff)}.sc-teal::after{background:linear-gradient(90deg,var(--teal),#20e6d9)}
    .sv{font-family:var(--fh);font-size:28px;font-weight:800;color:var(--text);letter-spacing:-1.5px;margin-top:8px;background:linear-gradient(135deg,var(--text),var(--text2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .sl{font-size:12px;color:var(--text3);margin-top:3px;font-weight:500;display:flex;align-items:center;gap:4px}
    .modal-ov{position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(8px);z-index:1000;display:flex;align-items:center;justify-content:center;animation:fadeIn .24s ease}
    .modal{background:linear-gradient(135deg,var(--bg2),color-mix(in srgb,var(--bg2) 95%,var(--bg3)));border:1.5px solid var(--border);border-radius:20px;padding:28px;width:560px;max-width:94vw;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.35),0 0 0 1px var(--border);animation:slideUp .28s cubic-bezier(.34,.1,.68,1)}
    .app.galaxy .modal{background:linear-gradient(135deg,rgba(8,12,22,0.25),rgba(8,12,22,0.2));border-color:rgba(80,120,255,0.1)}
    .app.cowboy .modal{background:linear-gradient(135deg,rgba(135,206,235,0.12),rgba(135,206,235,0.08));border-color:rgba(32,178,170,0.2)}
    .modal-lg{width:720px}
    .modal-title{font-family:var(--fh);font-size:18px;font-weight:800;color:var(--text);margin-bottom:20px;letter-spacing:-.3px}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
    @keyframes gentle-float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-3px)}}
    @keyframes galaxy-swirl{0%{transform:rotate(0deg) translateX(0)}100%{transform:rotate(360deg) translateX(20px)}}
    @keyframes stars-flow-across{0%{transform:translate(0, 0)}100%{transform:translate(60px, 40px)}}
    @keyframes nebula-pulse{0%,100%{transform:scale(0.8);opacity:0.3}50%{transform:scale(1.1);opacity:0.6}}
    @keyframes pulse-scale{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
    @keyframes pulse-dot{0%,100%{opacity:1}50%{opacity:.6}}
    @keyframes tail{0%{width:0}30%{width:100px}100%{width:0}}
    @keyframes falling{0%{transform:translateX(0)}100%{transform:translateX(300px)}}
    @keyframes shining{0%{width:0}50%{width:30px}100%{width:0}}
    @keyframes clouds-drift{0%{transform:translate(0, 0)}100%{transform:translate(30px, 15px)}}
    .toast-wrap{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none}
    .toast{background:linear-gradient(135deg,var(--bg2),color-mix(in srgb,var(--bg2) 96%,var(--bg3)));border:1.5px solid var(--border);border-radius:14px;padding:12px 16px;font-size:13.5px;font-weight:500;box-shadow:0 12px 40px rgba(0,0,0,.35),0 0 0 1px var(--border);display:flex;align-items:center;gap:11px;animation:slideUp .28s cubic-bezier(.34,.1,.68,1);min-width:300px;max-width:380px;pointer-events:auto;backdrop-filter:blur(10px)}
    .toast.success{border-left:3px solid var(--green);left-accent:var(--green)}.toast.error{border-left:3px solid var(--red);left-accent:var(--red)}.toast.info{border-left:3px solid var(--accent);left-accent:var(--accent)}
    .sec-title{font-family:var(--fh);font-size:15px;font-weight:800;color:var(--text);letter-spacing:-.2px;display:flex;align-items:center;gap:8px}
    .divider{height:1px;background:linear-gradient(90deg,transparent,var(--border),transparent);margin:18px 0}
    .row{display:flex;align-items:center;gap:9px}
    .empty{text-align:center;padding:64px 28px;color:var(--text3);background:linear-gradient(135deg,var(--bg2),rgba(255,255,255,.02));border-radius:16px;border:1.5px dashed var(--border);margin:20px 0}
    .empty-icon{font-size:48px;margin-bottom:12px;opacity:.6}
    .empty-t{font-family:var(--fh);font-size:16px;font-weight:700;color:var(--text2);margin-bottom:8px;margin-top:14px}
    .empty-s{font-size:13px;line-height:1.6;color:var(--text3)}
    .empty-btn{margin-top:16px;display:inline-flex;gap:8px}
    .kbd{background:var(--bg3);border:1px solid var(--border);border-radius:6px;padding:3px 8px;font-size:11px;font-family:monospace;color:var(--text2);font-weight:500}
    .sbox{display:flex;align-items:center;gap:10px;background:var(--bg3);border:1.5px solid var(--border);border-radius:10px;padding:8px 14px;transition:all .16s;box-shadow:0 1px 3px rgba(0,0,0,.04)}
    .sbox:focus-within{border-color:var(--accent);background:var(--bg2);box-shadow:0 0 0 3px var(--accentbg),0 2px 8px rgba(79,124,255,.12)}
    .sbox input{background:none;border:none;outline:none;color:var(--text);font-size:13.5px;flex:1;min-width:0}
    .sbox input::placeholder{color:var(--text3)}
    .hint{font-size:11.5px;color:var(--text3);margin-top:6px;line-height:1.5;display:flex;align-items:flex-start;gap:5px}
    .hint-icon{flex-shrink:0;margin-top:1px}
    .g2{display:grid;grid-template-columns:1fr 1fr;gap:15px}
    .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px}
    .dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;display:inline-block;box-shadow:0 0 0 3px rgba(0,0,0,.1)}
    .dot.green{background:var(--green)}.dot.red{background:var(--red)}.dot.amber{background:var(--amber)}.dot.gray{background:var(--text3)}.dot.purple{background:var(--purple)}.dot.blue{background:var(--accent)}
    .dropzone{border:2px dashed var(--border);border-radius:16px;padding:48px 24px;text-align:center;cursor:pointer;transition:all .24s;color:var(--text3);background:linear-gradient(135deg,rgba(79,124,255,0),rgba(30,201,154,0))}
    .dropzone:hover,.dropzone.drag{border-color:var(--accent);background:linear-gradient(135deg,var(--accentbg),rgba(30,201,154,.05));color:var(--accent);transform:scale(1.02)}
    .pb{height:7px;background:var(--bg4);border-radius:99px;overflow:hidden;box-shadow:inset 0 1px 3px rgba(0,0,0,.2)}
    .pf{height:100%;border-radius:99px;transition:width .45s cubic-bezier(.34,.1,.68,1);background:linear-gradient(90deg,var(--accent),var(--accent2));box-shadow:0 0 0 1px var(--accent)}
    .pf.green{background:linear-gradient(90deg,var(--green),#1ec9a6)}
    .tag-btn{font-family:var(--fb);font-size:11px;font-weight:700;background:var(--accentbg);color:var(--accent);border:1.5px solid var(--accentborder);border-radius:6px;padding:4px 10px;cursor:pointer;transition:all .16s;white-space:nowrap}
    .tag-btn:hover{background:var(--accent);color:#fff;border-color:transparent;transform:translateY(-1px);box-shadow:0 2px 8px rgba(79,124,255,.24)}
    .toolbar{display:flex;gap:4px;padding:8px 12px;background:linear-gradient(135deg,var(--bg3),color-mix(in srgb,var(--bg3) 95%,var(--bg4)));border:1.5px solid var(--border);border-radius:10px;margin-bottom:10px;flex-wrap:wrap;align-items:center;box-shadow:0 1px 3px rgba(0,0,0,.04)}
    .tb-btn{padding:6px 10px;border-radius:7px;border:none;background:none;color:var(--text2);cursor:pointer;font-size:12px;font-weight:700;transition:all .12s;display:flex;align-items:center;gap:4px;position:relative}
    .tb-btn:hover{background:var(--bg2);color:var(--text);transform:translateY(-1px)}
    .tb-btn:hover{background:var(--bg4);color:var(--text)}
    .tb-sep{width:1px;height:18px;background:var(--border);margin:0 3px;flex-shrink:0}
    .anim{animation:slideUp .28s ease both}
    .skeleton{background:linear-gradient(90deg,var(--bg3) 0%,var(--bg4) 50%,var(--bg3) 100%);background-size:200% 100%;animation:shimmer 2s infinite;border-radius:8px}
    @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
    .loading-dots{display:inline-flex;gap:4px}
    .loading-dots span{width:6px;height:6px;border-radius:50%;background:var(--text3);animation:bounce .6s ease infinite;opacity:.6}
    .loading-dots span:nth-child(1){animation-delay:0s}
    .loading-dots span:nth-child(2){animation-delay:.15s}
    .loading-dots span:nth-child(3){animation-delay:.3s}
    @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
    .success-check{width:20px;height:20px;border:2px solid var(--green);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--green);animation:checkmark .4s ease}
    @keyframes checkmark{0%{transform:scale(0) rotate(-45deg);opacity:0}50%{transform:scale(1.1) rotate(0deg)}100%{transform:scale(1) rotate(0deg);opacity:1}}
    .feature-card{background:linear-gradient(135deg,var(--accentbg),rgba(30,201,154,.08));border:1.5px solid var(--accentborder);border-radius:14px;padding:16px;margin:14px 0;position:relative;overflow:hidden}
    .feature-card::before{content:'';position:absolute;inset:0;background:conic-gradient(from 0deg,transparent,var(--accent),transparent);opacity:0;transition:opacity .3s;pointer-events:none}
    .feature-card:hover::before{opacity:.1}
    .feature-icon{width:36px;height:36px;border-radius:10px;background:var(--accentbg);display:flex;align-items:center;justify-content:center;color:var(--accent);margin-bottom:8px;flex-shrink:0}
    .status-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:99px;font-size:12px;font-weight:600;background:var(--greenbg);color:var(--green);border:1px solid rgba(30,201,154,.3);animation:slideIn .3s ease}
    @keyframes slideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
    .highlight{background:linear-gradient(120deg,transparent 0%,var(--accentbg) 20%,var(--accentbg) 80%,transparent 100%);animation:highlight-pulse 2s ease infinite;border-radius:8px}
    @keyframes highlight-pulse{0%,100%{background:transparent}50%{background:linear-gradient(120deg,transparent 0%,var(--accentbg) 20%,var(--accentbg) 80%,transparent 100%)}}
    .card-hover-lift:hover{transform:translateY(-6px);box-shadow:0 16px 40px rgba(0,0,0,.2)}
    @keyframes spin{to{transform:rotate(360deg)}}
    .spin{animation:spin 1s linear infinite;display:inline-block}
    .send-row{display:flex;align-items:center;gap:9px;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px}
    .toggle{width:44px;height:24px;border-radius:99px;border:none;cursor:pointer;padding:2px;position:relative;transition:background .2s}
    .toggle-t{width:20px;height:20px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 4px rgba(0,0,0,.22)}
    .tab-pills{display:flex;gap:6px;padding:4px;background:var(--bg3);border-radius:10px;border:1px solid var(--border)}
    .tab-pill{padding:6px 14px;border-radius:7px;border:none;cursor:pointer;font-size:13px;font-weight:600;transition:all .14s;background:none;color:var(--text2)}
    .tab-pill.active{background:var(--bg2);color:var(--text);box-shadow:var(--shadow)}
    .campaign-card{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:16px;transition:all .15s;cursor:pointer}
    .campaign-card:hover{border-color:var(--border2);transform:translateY(-1px);box-shadow:var(--shadow)}
    .seg-chip{display:inline-flex;align-items:center;gap:5px;background:var(--bg3);border:1px solid var(--border);border-radius:99px;padding:4px 10px;font-size:12px;cursor:pointer;transition:all .14s;color:var(--text2);font-weight:500}
    .seg-chip:hover,.seg-chip.active{background:var(--accentbg);border-color:var(--accentborder);color:var(--accent)}
    .preview-pane{background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:18px;font-size:13.5px;line-height:1.7;color:var(--text2)}
    .rate-bar-wrap{background:var(--bg3);border-radius:10px;padding:14px 16px}
  `}</style>;
}

// ─── Toasts ───────────────────────────────────────────────────────────────────
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4500);
  }, []);
  const remove = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);
  return { toasts, toast: add, remove };
}
function Toasts({ toasts, remove }) {
  return <div className="toast-wrap">{toasts.map(t => (
    <div key={t.id} className={`toast ${t.type}`}>
      <Ic p={t.type==="success"?I.check:t.type==="error"?I.alert:I.info} s={14} c={t.type==="success"?"var(--green)":t.type==="error"?"var(--red)":"var(--accent)"} />
      <span style={{flex:1,color:"var(--text)"}}>{t.message}</span>
      <button className="bti" style={{padding:4}} onClick={()=>remove(t.id)}><Ic p={I.x} s={11}/></button>
    </div>
  ))}</div>;
}

// ─── Campaign type config ─────────────────────────────────────────────────────
const CAMPAIGN_TYPES = [
  { id: "general",    label: "General",       color: "var(--accent)",  icon: I.mail },
  { id: "promotion",  label: "Promotion",     color: "var(--amber)",   icon: I.star },
  { id: "itinerary",  label: "Itinerary",     color: "var(--teal)",    icon: I.plane },
  { id: "followup",   label: "Follow-up",     color: "var(--purple)",  icon: I.repeat },
  { id: "newsletter", label: "Newsletter",    color: "var(--green)",   icon: I.globe },
  { id: "whatsapp",   label: "WhatsApp",      color: "#25D366",        icon: I.whatsapp },
];
const typeColor = (t) => CAMPAIGN_TYPES.find(c=>c.id===t)?.color || "var(--accent)";
const typeLabel = (t) => CAMPAIGN_TYPES.find(c=>c.id===t)?.label || t;

// DMC Segments
const SEGMENTS = ["All", "Leisure", "Corporate", "MICE", "Wedding/Honeymoon", "Adventure", "Group Tours", "Travel Agents"];

// DMC personalization tags
const DMC_TAGS = [
  { tag: "name", hint: "Contact name" },
  { tag: "company", hint: "Agency/Company" },
  { tag: "destination", hint: "Destination" },
  { tag: "package_name", hint: "Package name" },
  { tag: "price", hint: "Package price" },
  { tag: "travel_date", hint: "Travel date" },
  { tag: "pax", hint: "No. of travellers" },
  { tag: "nights", hint: "No. of nights" },
  { tag: "segment", hint: "Client segment" },
];

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ auth, contacts, campaigns, templates, setTab, rateLimitUsed, rateLimit }) {
  const totalSent  = campaigns.reduce((s, c) => s + (c.sent||0), 0);
  const totalOpen  = campaigns.reduce((s, c) => s + (c.results||[]).filter(r=>r.opened).length, 0);
  const totalReply = campaigns.reduce((s, c) => s + (c.results||[]).filter(r=>r.replied).length, 0);
  const totalBounce= campaigns.reduce((s, c) => s + (c.results||[]).filter(r=>r.bounced).length, 0);
  const openRate   = totalSent ? Math.round((totalOpen / totalSent) * 100) : 0;
  const clickRate  = totalSent ? Math.round((totalReply / totalSent) * 100) : 0;

  const kpiData = [
    {label:"Contacts Loaded",val:contacts.length,sub:`${contacts.filter(c=>c.segment).length || 0} segmented`,icon:I.contacts,color:"var(--accent)",bgcolor:"var(--accentbg)",bc:"var(--accentborder)",trend:"+12%",benchmark:true},
    {label:"Total Sent",val:totalSent,sub:`${totalSent>0?totalSent+" from "+campaigns.length+" campaigns":"No campaigns yet"}`,icon:I.send,color:"var(--green)",bgcolor:"var(--greenbg)",bc:"rgba(30,201,154,.2)",trend:totalSent>0?Math.round((totalSent/(totalOpen+1))*100)>0?"+8%":"-2%":null},
    {label:"Open Rate",val:`${openRate}%`,sub:`${totalOpen} opened · ${totalSent} delivered`,icon:I.eye,color:"var(--teal)",bgcolor:"var(--tealbg)",bc:"rgba(0,200,215,.2)",trend:openRate>=30?"+14%":"−5%",benchmark:"Industry: 18%"},
    {label:"Engagement",val:totalReply,sub:`${clickRate}% reply rate · ${totalBounce} bounces`,icon:I.reply,color:"var(--purple)",bgcolor:"var(--purplebg)",bc:"rgba(155,125,255,.2)",trend:totalReply>0?"+6%":"-1%",benchmark:null},
  ];

  return (
    <div className="anim">
      {!auth?.authenticated && (
        <div style={{background:"var(--amberbg)",border:"1px solid rgba(255,179,64,.25)",borderRadius:12,padding:"14px 18px",marginBottom:18,display:"flex",alignItems:"center",gap:14}}>
          <Ic p={I.alert} s={18} c="var(--amber)"/>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,color:"var(--amber)",fontSize:14,marginBottom:2}}>Gmail not connected</div>
            <div style={{fontSize:13,color:"var(--text2)"}}>Connect your Gmail to start sending. Emails come from your real account — inbox delivery guaranteed.</div>
          </div>
          <button className="btn btn-g" style={{fontSize:12}} onClick={()=>setTab("settings")}>Connect →</button>
        </div>
      )}

      <div style={{marginBottom:18}}>
        <style>{`
          @keyframes slideInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
          @keyframes pulse-glow{0%,100%{box-shadow:0 0 0 0 rgba(79,124,255,.4)}50%{box-shadow:0 0 0 8px rgba(79,124,255,0)}}
          @keyframes float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-3px)}}
          .kpi-premium{animation:slideInUp .5s ease forwards}
          .kpi-premium:nth-child(2){animation-delay:.05s}
          .kpi-premium:nth-child(3){animation-delay:.1s}
          .kpi-premium:nth-child(4){animation-delay:.15s}
          .sparkline{display:inline-block;height:32px;width:60px;margin-left:auto}
          .sparkline-bar{display:inline-block;height:100%;width:4px;background-color:currentColor;opacity:.6;margin-right:2px;border-radius:1px}
          .sparkline-bar.active{opacity:1;height:100%}
        `}</style>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
          {kpiData.map((s,i)=>{
            const trend = s.trend ? parseInt(s.trend) : 0;
            const isPositive = trend >= 0;
            
            // Calculate real metrics based on card index
            const today = new Date().toISOString().split('T')[0];
            const lastWeek = new Date(Date.now() - 7*24*60*60*1000).toISOString().split('T')[0];
            
            const todayCampaigns = campaigns.filter(c => c.timestamp?.startsWith(today) || false);
            const weekCampaigns = campaigns.filter(c => !c.timestamp || c.timestamp >= lastWeek);
            
            // Generate 7-day sparkline data
            const sparkData = [];
            for (let d = 6; d >= 0; d--) {
              const date = new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
              const dayCampaigns = campaigns.filter(c => c.timestamp?.startsWith(date) || false);
              let dayValue = 0;
              if (i === 0) dayValue = dayCampaigns.reduce((sum, c) => sum + (c.recipients?.length || 0), 0);
              else if (i === 1) dayValue = dayCampaigns.reduce((sum, c) => sum + (c.sent || 0), 0);
              else if (i === 2) {
                const dayOpens = dayCampaigns.reduce((sum, c) => sum + ((c.results || []).filter(r => r.opened).length), 0);
                const daySent = dayCampaigns.reduce((sum, c) => sum + (c.sent || 0), 0);
                dayValue = daySent > 0 ? Math.round((dayOpens / daySent) * 100) : 0;
              } else if (i === 3) {
                dayValue = dayCampaigns.reduce((sum, c) => sum + ((c.results || []).filter(r => r.replied).length), 0);
              }
              sparkData.push(Math.max(dayValue, 5)); // Min 5 for visibility
            }
            
            const maxVal = Math.max(...sparkData);
            let todayValue, weekValue, industryBench;
            
            if (i === 0) { // Contacts Loaded
              todayValue = todayCampaigns.reduce((sum, c) => sum + (c.recipients?.length || 0), 0);
              weekValue = weekCampaigns.length > 0 ? Math.round(weekCampaigns.reduce((sum, c) => sum + (c.recipients?.length || 0), 0) / 7) : 0;
              industryBench = "+12%";
            } else if (i === 1) { // Total Sent
              todayValue = todayCampaigns.reduce((sum, c) => sum + (c.sent || 0), 0);
              weekValue = weekCampaigns.length > 0 ? Math.round(weekCampaigns.reduce((sum, c) => sum + (c.sent || 0), 0) / 7) : 0;
              industryBench = weekValue > 0 ? `+${Math.round((todayValue / weekValue - 1) * 100)}%` : "0%";
            } else if (i === 2) { // Open Rate
              const todayOpens = todayCampaigns.reduce((sum, c) => sum + ((c.results || []).filter(r => r.opened).length), 0);
              const todaySent = todayCampaigns.reduce((sum, c) => sum + (c.sent || 0), 0);
              todayValue = todaySent > 0 ? Math.round((todayOpens / todaySent) * 100) : 0;
              
              const weekOpens = weekCampaigns.reduce((sum, c) => sum + ((c.results || []).filter(r => r.opened).length), 0);
              const weekSent = weekCampaigns.reduce((sum, c) => sum + (c.sent || 0), 0);
              weekValue = weekSent > 0 ? Math.round((weekOpens / weekSent) * 100) : 0;
              industryBench = "18%";
            } else if (i === 3) { // Engagement
              todayValue = todayCampaigns.reduce((sum, c) => sum + ((c.results || []).filter(r => r.replied).length), 0);
              weekValue = weekCampaigns.length > 0 ? Math.round(weekCampaigns.reduce((sum, c) => sum + ((c.results || []).filter(r => r.replied).length), 0) / 7) : 0;
              industryBench = "12%";
            }
            
            return (
              <div key={s.label} className="kpi-premium" style={{
                background:`linear-gradient(135deg, ${s.bgcolor}80 0%, var(--bg2) 100%)`,
                border:`1.5px solid ${s.bc}`,
                borderRadius:"16px",
                padding:"10px",
                position:"relative",
                overflow:"hidden",
                transition:"all .28s cubic-bezier(.34,.1,.68,1)",
                cursor:"pointer",
                backdropFilter:"blur(10px)"
              }}
              onMouseEnter={e=>{
                e.currentTarget.style.transform="translateY(-6px) scale(1.02)";
                e.currentTarget.style.boxShadow=`0 20px 48px -12px ${s.color}40, var(--shadow2)`;
                e.currentTarget.style.borderColor=s.color;
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.transform="translateY(0) scale(1)";
                e.currentTarget.style.boxShadow="var(--shadow)";
                e.currentTarget.style.borderColor=s.bc;
              }}>
                
                {/* Animated gradient bar */}
                <div style={{
                  position:"absolute",top:0,left:0,right:0,height:"3px",
                  background:`linear-gradient(90deg, ${s.color}, ${s.color}40, transparent)`,
                  animation:"slideIn 1.2s ease-out"
                }}/>
                
                {/* Large background icon */}
                <div style={{
                  position:"absolute",top:-12,right:-12,opacity:.05,
                  fontSize:"120px",transform:"rotate(-15deg)",
                  pointerEvents:"none"
                }}>
                  <Ic p={s.icon} s={120} c={s.color}/>
                </div>
                
                {/* Top section with icon & label + main value */}
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:6,position:"relative",zIndex:1}}>
                  <div style={{display:"flex",gap:10,flex:1}}>
                    <div style={{
                      width:40,height:40,borderRadius:10,
                      background:s.bgcolor,border:`1.5px solid ${s.bc}`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      flexShrink:0,transition:"all .3s",
                      boxShadow:`0 4px 16px ${s.color}20`
                    }}>
                      <Ic p={s.icon} s={18} c={s.color}/>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{
                        fontSize:"10px",fontWeight:700,color:"var(--text3)",
                        textTransform:"uppercase",letterSpacing:"0.8px"
                      }}>{s.label}</div>
                      <div style={{
                        fontSize:"9px",color:isPositive?s.color:"var(--red)",
                        fontWeight:700,marginTop:2,display:"flex",alignItems:"center",gap:3
                      }}>
                        <span>{isPositive?"↗":"↘"}</span>
                        <span>{Math.abs(trend)}%</span>
                      </div>
                    </div>
                  </div>
                  {/* Main value on the right */}
                  <div style={{
                    fontSize:"32px",fontWeight:900,color:s.color,
                    fontFamily:`"Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif`,letterSpacing:"0px",
                    textShadow:`0 2px 8px ${s.color}20`,lineHeight:1,fontVariantNumeric:"tabular-nums",
                    textAlign:"right",minWidth:"50px"
                  }}>{s.val}</div>
                </div>
                
                {/* Description */}
                <div style={{
                  fontSize:"8px",color:"var(--text3)",marginBottom:5,lineHeight:1.2
                }}>{s.sub}</div>
                
                {/* Mini sparkline */}
                <div style={{
                  display:"flex",alignItems:"flex-end",gap:2,height:22,
                  marginBottom:3,paddingBottom:0,opacity:.7
                }}>
                  {sparkData.map((v,j)=>(
                    <div key={j} style={{
                      flex:1,height:`${(v/maxVal)*100}%`,
                      background:`linear-gradient(180deg, ${s.color}, ${s.color}40)`,
                      borderRadius:"2px 2px 0 0",
                      transition:"all .3s",
                      opacity:j===sparkData.length-1?1:.6
                    }}/>
                  ))}
                </div>
                
                {/* Bottom metrics row */}
                <div style={{
                  display:"flex",gap:4,paddingTop:4,borderTop:`1px solid ${s.bc}`,
                  fontSize:"8px"
                }}>
                  <div style={{flex:1}}>
                    <div style={{color:"var(--text3)",fontSize:"6px",fontWeight:700,textTransform:"uppercase",letterSpacing:".3px"}}>Today</div>
                    <div style={{color:"var(--text)",fontWeight:700,marginTop:0,fontSize:"8px"}}>{todayValue}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{color:"var(--text3)",fontSize:"6px",fontWeight:700,textTransform:"uppercase",letterSpacing:".3px"}}>Week Avg</div>
                    <div style={{color:"var(--text)",fontWeight:700,marginTop:0,fontSize:"8px"}}>{weekValue}</div>
                  </div>
                  {s.benchmark && (
                    <div style={{flex:1}}>
                      <div style={{color:"var(--text3)",fontSize:"6px",fontWeight:700,textTransform:"uppercase",letterSpacing:".3px"}}>vs Industry</div>
                      <div style={{color:s.color,fontWeight:700,marginTop:0,fontSize:"8px"}}>{industryBench}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rate limit meter */}
      <div className="card" style={{marginBottom:14}}>
        <div className="row" style={{marginBottom:10}}>
          <Ic p={I.gauge} s={15} c="var(--accent)"/>
          <span className="sec-title">Hourly Rate Limit</span>
          <span style={{marginLeft:"auto",fontSize:13,fontWeight:700,color:"var(--text2)"}}>{rateLimitUsed}/{rateLimit} used this hour</span>
        </div>
        <div className="pb">
          <div className="pf green" style={{width:`${Math.min((rateLimitUsed/rateLimit)*100,100)}%`,background:rateLimitUsed/rateLimit>0.8?"var(--red)":rateLimitUsed/rateLimit>0.6?"var(--amber)":"var(--green)"}}/>
        </div>
        <div className="hint" style={{marginTop:6}}>{rateLimit-rateLimitUsed} emails remaining this hour · Resets every 60 minutes</div>
      </div>

      {/* Premium Insights Panel */}
      {campaigns.length > 0 && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          {/* Performance Insights */}
          <div className="card" style={{background:`linear-gradient(135deg, rgba(155,125,255,.08), rgba(79,124,255,.05))`,border:"1px solid rgba(155,125,255,.15)"}}>
            <div className="row" style={{marginBottom:14}}>
              <Ic p={I.sparkle} s={16} c="var(--purple)"/>
              <span className="sec-title" style={{color:"var(--purple)"}}>Performance Insights</span>
            </div>
            {totalSent > 0 ? (
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {openRate >= 30 && (
                  <div style={{background:"var(--greenbg)",border:"1px solid rgba(30,201,154,.2)",borderRadius:10,padding:"10px 12px",display:"flex",alignItems:"flex-start",gap:9}}>
                    <div style={{color:"var(--green)",fontWeight:700,fontSize:18}}>✓</div>
                    <div style={{fontSize:12,color:"var(--text2)",flex:1}}>
                      <strong style={{color:"var(--green)"}}>Excellent open rate!</strong> Your {"{{destination}}"} tags are resonating. Continue this strategy.
                    </div>
                  </div>
                )}
                {clickRate > 10 && (
                  <div style={{background:"var(--purplebg)",border:"1px solid rgba(155,125,255,.2)",borderRadius:10,padding:"10px 12px",display:"flex",alignItems:"flex-start",gap:9}}>
                    <div style={{color:"var(--purple)",fontWeight:700,fontSize:18}}>⚡</div>
                    <div style={{fontSize:12,color:"var(--text2)",flex:1}}>
                      <strong style={{color:"var(--purple)"}}>High engagement detected.</strong> {clickRate}% replies — consider launching follow-ups.
                    </div>
                  </div>
                )}
                {totalBounce / totalSent > 0.05 && (
                  <div style={{background:"var(--redbg)",border:"1px solid rgba(255,79,97,.2)",borderRadius:10,padding:"10px 12px",display:"flex",alignItems:"flex-start",gap:9}}>
                    <div style={{color:"var(--red)",fontWeight:700,fontSize:18}}>!</div>
                    <div style={{fontSize:12,color:"var(--text2)",flex:1}}>
                      <strong style={{color:"var(--red)"}}>Bounce rate {Math.round((totalBounce/totalSent)*100)}%.</strong> Clean your contact list.
                    </div>
                  </div>
                )}
                {totalSent < 50 && (
                  <div style={{background:"var(--amberbg)",border:"1px solid rgba(255,179,64,.2)",borderRadius:10,padding:"10px 12px",display:"flex",alignItems:"flex-start",gap:9}}>
                    <div style={{color:"var(--amber)",fontWeight:700,fontSize:18}}>→</div>
                    <div style={{fontSize:12,color:"var(--text2)",flex:1}}>
                      <strong style={{color:"var(--amber)"}}>Scale up.</strong> You've sent {totalSent} emails. Use templates to send more.
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{color:"var(--text3)",fontSize:13,textAlign:"center",padding:"16px 0"}}><Ic p={I.zap} s={24} style={{opacity:.2,marginBottom:8}}/>No data yet · Send your first campaign</div>
            )}
          </div>

          {/* Optimization Tips */}
          <div className="card" style={{background:`linear-gradient(135deg, rgba(0,200,215,.08), rgba(79,124,255,.05))`,border:"1px solid rgba(0,200,215,.15)"}}>
            <div className="row" style={{marginBottom:14}}>
              <Ic p={I.lightbulb} s={16} c="var(--teal)"/>
              <span className="sec-title" style={{color:"var(--teal)"}}>DMC Best Practices</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[
                {icon:"📅",text:"Send tours Tue–Thu, 9–11 AM for +34% opens"},
                {icon:"🏝️",text:"Use {{destination}} in subject lines"},
                {icon:"👥",text:"Segment by {{segment}} for +18% engagement"},
                {icon:"📎",text:"Always attach itineraries & brochures"},
              ].map((tip,i)=>(
                <div key={i} style={{display:"flex",gap:10,padding:"9px 12px",background:"var(--bg3)",borderRadius:8,fontSize:12,color:"var(--text2)",border:"1px solid var(--border)"}}>
                  <span style={{fontSize:14,flexShrink:0}}>{tip.icon}</span>
                  <span>{tip.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="g2" style={{marginBottom:14}}>
        {/* Quick actions */}
        <div className="card">
          <div className="sec-title" style={{marginBottom:14}}>Quick Actions</div>
          {[
            {label:"New Email Campaign", tab:"compose", icon:I.compose, c:"var(--accent)"},
            {label:"Upload Contacts CSV",tab:"contacts",icon:I.upload,  c:"var(--green)"},
            {label:"Reuse a Template",   tab:"templates",icon:I.template,c:"var(--amber)"},
            {label:"View Campaign History",tab:"history",icon:I.history,c:"var(--purple)"},
          ].map(a=>(
            <button key={a.tab} onClick={()=>setTab(a.tab)} style={{display:"flex",alignItems:"center",gap:11,width:"100%",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:10,padding:"10px 13px",cursor:"pointer",marginBottom:8,transition:"all .15s",textAlign:"left"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=a.c;e.currentTarget.style.transform="translateX(2px)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.transform=""}}>
              <div style={{width:34,height:34,borderRadius:8,background:a.c+"18",border:`1px solid ${a.c}28`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Ic p={a.icon} s={14} c={a.c}/>
              </div>
              <span style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{a.label}</span>
              <Ic p={I.arrowright} s={13} c="var(--text3)" style={{marginLeft:"auto"}}/>
            </button>
          ))}
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {/* Campaign Performance */}
          <div className="card" style={{background:`linear-gradient(135deg, rgba(30,201,154,.08), rgba(0,200,215,.05))`,border:"1px solid rgba(30,201,154,.15)"}}>
            <div className="row" style={{marginBottom:12}}>
              <Ic p={I.zap} s={15} c="var(--green)"/>
              <span className="sec-title" style={{color:"var(--green)"}}>Campaign Performance</span>
            </div>
            {campaigns.length > 0 ? (
              <>
                {campaigns.slice(0,3).map(c=>{
                  const rate = c.total ? Math.round((c.sent/c.total)*100) : 0;
                  const opens = (c.results||[]).filter(r=>r.opened).length;
                  return (
                    <div key={c.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:typeColor(c.type),flexShrink:0}}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:600,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name.slice(0,24)}</div>
                        <div style={{fontSize:11,color:"var(--text3)"}}>{opens}/${c.sent} opened</div>
                      </div>
                      <span className={`badge b-${rate>=80?"green":rate>=60?"amber":"red"}`} style={{fontSize:11}}>{rate}%</span>
                    </div>
                  );
                })}
              </>
            ) : (
              <div style={{color:"var(--text3)",fontSize:13,textAlign:"center",padding:"12px 0"}}><Ic p={I.history} s={20} style={{opacity:.2,marginBottom:6}}/>No campaigns yet</div>
            )}
          </div>

          {/* Advanced Metrics */}
          <div className="card" style={{background:`linear-gradient(135deg, rgba(79,124,255,.08), rgba(155,125,255,.05))`,border:"1px solid rgba(79,124,255,.15)"}}>
            <div className="row" style={{marginBottom:12}}>
              <Ic p={I.gauge} s={15} c="var(--accent)"/>
              <span className="sec-title">Advanced Metrics</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div style={{background:"var(--bg3)",borderRadius:8,padding:"9px 11px"}}>
                <div style={{fontSize:10,color:"var(--text3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".6px"}}>Avg Open</div>
                <div style={{fontSize:16,fontWeight:800,color:"var(--accent)",marginTop:3}}>{totalSent>0?openRate:0}%</div>
              </div>
              <div style={{background:"var(--bg3)",borderRadius:8,padding:"9px 11px"}}>
                <div style={{fontSize:10,color:"var(--text3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".6px"}}>Reply Rate</div>
                <div style={{fontSize:16,fontWeight:800,color:"var(--purple)",marginTop:3}}>{totalSent>0?clickRate:0}%</div>
              </div>
              <div style={{background:"var(--bg3)",borderRadius:8,padding:"9px 11px"}}>
                <div style={{fontSize:10,color:"var(--text3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".6px"}}>Bounce Rate</div>
                <div style={{fontSize:16,fontWeight:800,color:totalBounce>0?"var(--red)":"var(--green)",marginTop:3}}>{totalSent>0?Math.round((totalBounce/totalSent)*100):0}%</div>
              </div>
              <div style={{background:"var(--bg3)",borderRadius:8,padding:"9px 11px"}}>
                <div style={{fontSize:10,color:"var(--text3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".6px"}}>Campaigns</div>
                <div style={{fontSize:16,fontWeight:800,color:"var(--teal)",marginTop:3}}>{campaigns.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Compose ──────────────────────────────────────────────────────────────────
function Compose({ auth, contacts, toast, setTab, onSendComplete, onTemplateUpdate, initialSubject="", initialBody="", initialType="general", editingTemplate=null }) {
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody]       = useState(initialBody);
  const [campaignName, setCampaignName] = useState("");
  const [campaignType, setCampaignType] = useState(initialType);
  const [segment, setSegment]  = useState(""); // eslint-disable-line no-unused-vars
  const [delay, setDelay]      = useState(2);
  const [rateLimit, setRateLimit] = useState(400);
  const [cc, setCc]            = useState("");
  const [bcc, setBcc]          = useState("");
  const [replyTo, setReplyTo]  = useState("");
  const [preview, setPreview]  = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [enableTracking, setEnableTracking] = useState(true);
  const [skipDupes, setSkipDupes]     = useState(true);
  const [sending, setSending]  = useState(false);
  const [progress, setProgress]= useState(null);
  const [saveModal, setSaveModal]= useState(false);
  const [tplName, setTplName]  = useState("");
  const [followUpModal, setFollowUpModal] = useState(false);
  const [fuSteps, setFuSteps]  = useState([{day:3,subject:"",body:"",skip_if_replied:true},{day:7,subject:"",body:"",skip_if_replied:true}]);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [activeSegmentFilter, setActiveSegmentFilter] = useState("All");
  const [whatsappModal, setWhatsappModal] = useState(false);
  const [whatsappPreviews, setWhatsappPreviews] = useState([]);
  const bodyRef = useRef();
  const attRef  = useRef();

  useEffect(() => {
    if(editingTemplate) {
      setTplName(editingTemplate.name);
      setCampaignType(editingTemplate.category || "general");
    }
  }, [editingTemplate]);

  const insertTag = (tag) => {
    const el = bodyRef.current; if(!el) return;
    const s=el.selectionStart, e=el.selectionEnd;
    setBody(body.substring(0,s)+`{{${tag}}}`+body.substring(e));
    setTimeout(()=>{el.selectionStart=el.selectionEnd=s+tag.length+4;el.focus();},0);
  };
  const wrap = (b, a=b) => {
    const el=bodyRef.current; if(!el) return;
    const s=el.selectionStart, e=el.selectionEnd;
    setBody(body.substring(0,s)+b+body.substring(s,e)+a+body.substring(e));
  };
  const personalize = (t, c) => t.replace(/\{\{(\w+)\}\}/g, (_,k)=>c[k]||`{{${k}}}`);
  const pc = contacts[0] || {name:"Priya Sharma",company:"Sunrise Travels",email:"priya@sunrise.in",destination:"Maldives",package_name:"Romantic Escape 5N",price:"₹85,000",nights:"5",pax:"2"};

  // Filter contacts by segment
  const filteredContacts = activeSegmentFilter === "All" ? contacts
    : contacts.filter(c => (c.segment||"").toLowerCase().includes(activeSegmentFilter.toLowerCase()));

  const handleAttachment = async (file) => {
    return new Promise(res => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result.split(",")[1];
        setAttachments(prev => [...prev, { filename: file.name, data, size: file.size }]);
        res();
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSend = async () => {
    if (!auth?.authenticated) return toast("Connect Gmail first → Settings", "error");
    if (!filteredContacts.length) return toast("No contacts loaded", "error");
    if (!subject.trim()) return toast("Subject is required", "error");
    if (!body.trim()) return toast("Body is required", "error");
    setSending(true);
    setProgress({ total: filteredContacts.length, done: 0, rows: [], status: "sending" });
    try {
      const res = await api("/emails/send", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject, body, contacts: filteredContacts,
          delay_seconds: delay, is_html: false,
          cc, bcc, reply_to: replyTo,
          attachments, enable_tracking: enableTracking,
          rate_limit_per_hour: rateLimit, skip_duplicates: skipDupes,
          campaign_name: campaignName || subject.slice(0,40),
          campaign_type: campaignType, segment,
        }),
      });
      setProgress({ total: res.total, done: res.total, rows: res.results, status: "done" });
      onSendComplete(res);
      toast(`Sent ${res.sent}/${res.total} · ${res.skipped_duplicates} duplicates skipped`);
    } catch(e) { toast(e.message,"error"); setProgress(null); }
    setSending(false);
  };

  const previewWhatsApp = async () => {
    if (!body.trim()) return toast("Body is required", "error");
    try {
      const res = await api("/whatsapp/preview", { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ template: body, contacts: filteredContacts }) });
      setWhatsappPreviews(res);
      setWhatsappModal(true);
    } catch(e) { toast(e.message,"error"); }
  };

  return (
    <div className="anim">
      {/* Campaign meta row */}
      <div className="card csm" style={{marginBottom:12}}>
        <div className="g3">
          <div>
            <label className="fl">Campaign Name</label>
            <input className="inp" value={campaignName} onChange={e=>setCampaignName(e.target.value)} placeholder="e.g. Maldives Summer Promo" />
          </div>
          <div>
            <label className="fl">Campaign Type</label>
            <select className="sel" value={campaignType} onChange={e=>setCampaignType(e.target.value)}>
              {CAMPAIGN_TYPES.filter(t=>t.id!=="whatsapp").map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="fl">Segment Filter</label>
            <select className="sel" value={activeSegmentFilter} onChange={e=>setActiveSegmentFilter(e.target.value)}>
              {SEGMENTS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card csm" style={{marginBottom:12}}>
        <div className="row" style={{flexWrap:"wrap",gap:6}}>
          <span style={{fontSize:10,fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:.8,flexShrink:0}}>Format:</span>
          <button className="tb-btn" onClick={()=>wrap("<b>","</b>")}><strong>B</strong></button>
          <button className="tb-btn" onClick={()=>wrap("<i>","</i>")}><em>I</em></button>
          <button className="tb-btn" onClick={()=>wrap("<u>","</u>")} style={{textDecoration:"underline"}}>U</button>
          <button className="tb-btn" onClick={()=>{const u=prompt("URL:");if(u)wrap(`<a href="${u}">`,`</a>`);}}><Ic p={I.link} s={13}/>Link</button>
          <div className="tb-sep"/>
          <span style={{fontSize:10,fontWeight:700,color:"var(--text3)",textTransform:"uppercase",letterSpacing:.8,flexShrink:0}}>DMC Tags:</span>
          {DMC_TAGS.map(t=><button key={t.tag} className="tag-btn" onClick={()=>insertTag(t.tag)} title={t.hint}>{`{{${t.tag}}}`}</button>)}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:preview?"1fr 1fr":"1fr",gap:12,marginBottom:12}}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div className="card">
            <label className="fl"><Ic p={I.mail} s={11}/>Subject Line</label>
            <input className="inp" value={subject} onChange={e=>setSubject(e.target.value)}
              placeholder="Exclusive {{destination}} package for {{company}} — {{package_name}}" />
            <div className="hint">💡 Use destination + package name in subject for travel emails — higher open rates</div>
          </div>
          <div className="card">
            <div className="row" style={{marginBottom:8}}>
              <label className="fl" style={{marginBottom:0,flex:1}}><Ic p={I.compose} s={11}/>Email Body</label>
              <span style={{fontSize:11,color:"var(--text3)"}}>{body.length} chars</span>
            </div>
            <textarea className="txta" ref={bodyRef} value={body} style={{minHeight:260}}
              onChange={e=>setBody(e.target.value)}
              placeholder={`Dear {{name}},\n\nI hope this finds you well! We are excited to present our exclusive {{destination}} package — {{package_name}}.\n\n🌴 Duration: {{nights}} nights\n👥 For: {{pax}} travellers\n💰 Starting from: {{price}} per person\n\nThis offer is specially curated for {{company}} and is available until [date].\n\nWould you like us to send the detailed itinerary?\n\nWarm regards,\n[Your name]\n[Your DMC Name]`}/>
          </div>
        </div>
        {preview && (
          <div className="card anim">
            <div className="row" style={{marginBottom:14}}>
              <label className="fl" style={{marginBottom:0,flex:1}}><Ic p={I.eye} s={11}/>Live Preview</label>
              <span className="badge b-teal">{pc.name||pc.email}</span>
            </div>
            <div style={{fontSize:11,color:"var(--text3)",marginBottom:4,fontWeight:700,textTransform:"uppercase",letterSpacing:.7}}>Subject</div>
            <div style={{background:"var(--bg3)",borderRadius:8,padding:"9px 13px",fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:14}}>
              {personalize(subject,pc)||<span style={{color:"var(--text3)"}}>Enter a subject…</span>}
            </div>
            <div style={{fontSize:11,color:"var(--text3)",marginBottom:8,fontWeight:700,textTransform:"uppercase",letterSpacing:.7}}>Body</div>
            <div className="preview-pane" style={{whiteSpace:"pre-wrap",minHeight:200}}
              dangerouslySetInnerHTML={{__html:personalize(body,pc)||'<span style="color:var(--text3)">Start typing…</span>'}}/>
            {contacts.length>1 && <div className="hint" style={{marginTop:8}}>Preview: contact 1/{contacts.length}</div>}
          </div>
        )}
      </div>

      {/* Advanced options (collapsible) */}
      <div className="card" style={{marginBottom:12}}>
        <button onClick={()=>setAdvancedOpen(o=>!o)} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer",width:"100%",textAlign:"left",padding:0}}>
          <span className="sec-title">Advanced Options</span>
          <Ic p={I.chevdown} s={14} c="var(--text3)" style={{marginLeft:"auto",transform:advancedOpen?"rotate(180deg)":"rotate(0)",transition:"transform .2s"}}/>
        </button>
        {advancedOpen && (
          <div style={{marginTop:16}}>
            <div className="g3" style={{marginBottom:14}}>
              <div>
                <label className="fl">CC</label>
                <input className="inp" value={cc} onChange={e=>setCc(e.target.value)} placeholder="manager@company.com"/>
              </div>
              <div>
                <label className="fl">BCC</label>
                <input className="inp" value={bcc} onChange={e=>setBcc(e.target.value)} placeholder="archive@company.com"/>
              </div>
              <div>
                <label className="fl">Reply-To</label>
                <input className="inp" value={replyTo} onChange={e=>setReplyTo(e.target.value)} placeholder="sales@yourdmc.com"/>
              </div>
            </div>
            <div className="g3" style={{marginBottom:14}}>
              <div>
                <label className="fl"><Ic p={I.clock} s={11}/>Send Delay</label>
                <div className="row">
                  <input type="range" min={1} max={10} step={.5} value={delay} onChange={e=>setDelay(+e.target.value)} style={{flex:1,accentColor:"var(--accent)"}}/>
                  <span style={{fontWeight:800,color:"var(--accent)",minWidth:32,fontSize:13}}>{delay}s</span>
                </div>
              </div>
              <div>
                <label className="fl"><Ic p={I.gauge} s={11}/>Rate Limit/Hour</label>
                <input type="number" className="inp" value={rateLimit} min={50} max={500} step={50} onChange={e=>setRateLimit(+e.target.value)}/>
              </div>
              <div>
                <label className="fl"><Ic p={I.clock} s={11}/>Est. Time</label>
                <div style={{fontSize:15,fontWeight:700,color:"var(--text)",marginTop:4}}>
                  {filteredContacts.length ? `~${Math.ceil((filteredContacts.length*delay)/60)} min` : "—"}
                </div>
                <div className="hint">{filteredContacts.length} × {delay}s</div>
              </div>
            </div>
            {/* Toggles */}
            <div className="g2" style={{marginBottom:14}}>
              {[
                {label:"Open Tracking",desc:"Track who opens each email (pixel)",val:enableTracking,set:setEnableTracking},
                {label:"Duplicate Filter",desc:"Skip contacts already emailed in this campaign",val:skipDupes,set:setSkipDupes},
              ].map(t=>(
                <div key={t.label} style={{display:"flex",alignItems:"center",gap:12,background:"var(--bg3)",borderRadius:10,padding:"11px 14px",border:"1px solid var(--border)"}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,color:"var(--text)",fontSize:13}}>{t.label}</div>
                    <div style={{fontSize:11.5,color:"var(--text3)",marginTop:2}}>{t.desc}</div>
                  </div>
                  <button className="toggle" onClick={()=>t.set(v=>!v)} style={{background:t.val?"var(--accent)":"var(--bg4)"}}>
                    <div className="toggle-t" style={{transform:t.val?"translateX(20px)":"translateX(0)"}}/>
                  </button>
                </div>
              ))}
            </div>
            {/* Attachments */}
            <div>
              <label className="fl"><Ic p={I.paperclip} s={11}/>Attachments</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:8}}>
                {attachments.map((a,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:7,background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,padding:"6px 10px",fontSize:12}}>
                    <Ic p={I.paperclip} s={12} c="var(--text3)"/>
                    <span style={{color:"var(--text2)"}}>{a.filename}</span>
                    <span style={{color:"var(--text3)"}}>({Math.round(a.size/1024)}KB)</span>
                    <button style={{background:"none",border:"none",cursor:"pointer",color:"var(--red)",padding:0}} onClick={()=>setAttachments(p=>p.filter((_,j)=>j!==i))}>
                      <Ic p={I.x} s={12}/>
                    </button>
                  </div>
                ))}
                <button className="btn btn-g" style={{fontSize:12}} onClick={()=>attRef.current.click()}>
                  <Ic p={I.paperclip} s={13}/>Attach File
                </button>
              </div>
              <input type="file" ref={attRef} style={{display:"none"}} multiple onChange={async e=>{
                for(const f of e.target.files) await handleAttachment(f);
                e.target.value="";
              }}/>
              <div className="hint">PDFs, brochures, itineraries — sent as attachments with every email</div>
            </div>
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="row" style={{flexWrap:"wrap",gap:8}}>
        <button className="btn btn-g" onClick={()=>setPreview(p=>!p)}><Ic p={I.eye} s={13}/>{preview?"Hide":"Preview"}</button>
        <button className="btn btn-g" onClick={()=>setSaveModal(true)}><Ic p={I.template} s={13}/>Save Template</button>
        <button className="btn btn-g" onClick={previewWhatsApp}><Ic p={I.whatsapp} s={13}/>WhatsApp</button>
        <button className="btn btn-purple" onClick={()=>setFollowUpModal(true)}><Ic p={I.repeat} s={13}/>Follow-up Steps</button>
        <div style={{flex:1}}/>
        <div className="row">
          {filteredContacts.length!==contacts.length && <span className="badge b-blue">{filteredContacts.length}/{contacts.length} contacts</span>}
          <button className="btn btn-p" onClick={handleSend} disabled={sending||!filteredContacts.length}>
            {sending?<><span className="spin">↻</span>Sending…</>:<><Ic p={I.send} s={13}/>Send to {filteredContacts.length}</>}
          </button>
        </div>
      </div>

      {/* Save template modal */}
      {saveModal && (
        <div className="modal-ov" onClick={()=>setSaveModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">{editingTemplate?"Edit Template":"Save as Template"}</div>
            <div className="g2" style={{marginBottom:14}}>
              <div>
                <label className="fl">Name</label>
                <input className="inp" value={tplName} onChange={e=>setTplName(e.target.value)} placeholder="e.g. Maldives Cold Outreach" autoFocus/>
              </div>
              <div>
                <label className="fl">Category</label>
                <select className="sel" value={campaignType} onChange={e=>setCampaignType(e.target.value)}>
                  {CAMPAIGN_TYPES.filter(t=>t.id!=="whatsapp").map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>
            </div>
            <div className="row" style={{justifyContent:"flex-end"}}>
              <button className="btn btn-g" onClick={()=>setSaveModal(false)}>Cancel</button>
              <button className="btn btn-p" onClick={async()=>{
                if(!tplName.trim()) return;
                if(editingTemplate){
                  await api(`/templates/${editingTemplate.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:tplName,subject,body,category:campaignType})});
                  if(onTemplateUpdate) onTemplateUpdate();
                  toast("Template updated ✓");
                }else{
                  await api("/templates",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:tplName,subject,body,category:campaignType})});
                  toast("Template saved ✓");
                }
                setSaveModal(false); setTplName("");
              }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Follow-up modal */}
      {followUpModal && (
        <div className="modal-ov" onClick={()=>setFollowUpModal(false)}>
          <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">⚡ Follow-up Sequence</div>
            <div style={{fontSize:13,color:"var(--text2)",marginBottom:18,lineHeight:1.6}}>
              After sending, these follow-up emails will automatically be queued. Contacts who reply will be skipped.
            </div>
            {fuSteps.map((step,i)=>(
              <div key={i} style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:11,padding:16,marginBottom:12}}>
                <div className="row" style={{marginBottom:12}}>
                  <span className="badge b-purple">Step {i+1}</span>
                  <div className="row" style={{gap:8}}>
                    <label style={{fontSize:12,color:"var(--text2)"}}>Send after</label>
                    <input type="number" className="inp" style={{width:60}} value={step.day} min={1} max={30}
                      onChange={e=>setFuSteps(s=>s.map((x,j)=>j===i?{...x,day:+e.target.value}:x))}/>
                    <label style={{fontSize:12,color:"var(--text2)"}}>days</label>
                  </div>
                  <div className="row" style={{marginLeft:"auto",gap:6}}>
                    <label style={{fontSize:12,color:"var(--text2)"}}>Skip if replied</label>
                    <button className="toggle" style={{background:step.skip_if_replied?"var(--accent)":"var(--bg4)"}}
                      onClick={()=>setFuSteps(s=>s.map((x,j)=>j===i?{...x,skip_if_replied:!x.skip_if_replied}:x))}>
                      <div className="toggle-t" style={{transform:step.skip_if_replied?"translateX(20px)":"translateX(0)"}}/>
                    </button>
                  </div>
                </div>
                <input className="inp" style={{marginBottom:8}} value={step.subject}
                  onChange={e=>setFuSteps(s=>s.map((x,j)=>j===i?{...x,subject:e.target.value}:x))}
                  placeholder={`Follow-up subject for day ${step.day}…`}/>
                <textarea className="txta" style={{minHeight:100}} value={step.body}
                  onChange={e=>setFuSteps(s=>s.map((x,j)=>j===i?{...x,body:e.target.value}:x))}
                  placeholder={`Hi {{name}},\n\nJust following up on the ${i===0?"earlier email":"previous message"}…`}/>
              </div>
            ))}
            <button className="btn btn-g" style={{marginBottom:16}} onClick={()=>setFuSteps(s=>[...s,{day:(s[s.length-1]?.day||0)+3,subject:"",body:"",skip_if_replied:true}])}>
              <Ic p={I.plus} s={13}/>Add Step
            </button>
            <div className="row" style={{justifyContent:"flex-end"}}>
              <button className="btn btn-g" onClick={()=>setFollowUpModal(false)}>Cancel</button>
              <button className="btn btn-purple" onClick={()=>{setFollowUpModal(false);toast("Follow-ups will be scheduled after sending","info");}}>
                <Ic p={I.repeat} s={13}/>Save Sequence
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send progress modal */}
      {progress && (
        <div className="modal-ov">
          <div className="modal" style={{width:500}}>
            <div className="modal-title" style={{marginBottom:10}}>
              {progress.status==="sending"?"📤 Sending Campaign…":"✅ Campaign Complete!"}
            </div>
            <div className="row" style={{marginBottom:7}}>
              <span style={{fontSize:13,color:"var(--text2)",flex:1}}>Progress</span>
              <span style={{fontWeight:800,color:"var(--accent)",fontSize:13}}>{progress.done}/{progress.total}</span>
            </div>
            <div className="pb" style={{marginBottom:16}}>
              <div className="pf green" style={{width:`${progress.total?(progress.done/progress.total)*100:0}%`}}/>
            </div>
            {progress.rows.length>0 && (
              <div style={{maxHeight:260,overflowY:"auto",marginBottom:14}}>
                {progress.rows.map((r,i)=>(
                  <div key={i} className="send-row">
                    <span className={`dot ${r.status==="sent"?"green":r.status==="failed"?"red":"gray"}`}/>
                    <span style={{flex:1}}>{r.email}</span>
                    <span className={`badge b-${r.status==="sent"?"green":r.status==="failed"?"red":"gray"}`}>{r.status}</span>
                    {r.reason && <span style={{fontSize:11,color:"var(--red)",maxWidth:130,overflow:"hidden",textOverflow:"ellipsis"}}>{r.reason}</span>}
                  </div>
                ))}
              </div>
            )}
            {progress.status==="sending"
              ? <div style={{textAlign:"center",color:"var(--text3)",fontSize:13}}><span className="spin">↻</span> Sending with {delay}s delay…</div>
              : <div className="row" style={{justifyContent:"space-between"}}>
                  <div className="row">
                    <span className="badge b-green">{progress.rows.filter(r=>r.status==="sent").length} sent</span>
                    <span className="badge b-red">{progress.rows.filter(r=>r.status==="failed").length} failed</span>
                    <span className="badge b-gray">{progress.rows.filter(r=>r.status==="skipped").length} skipped</span>
                  </div>
                  <button className="btn btn-p" onClick={()=>{setProgress(null);setTab("history");}}>View History →</button>
                </div>}
          </div>
        </div>
      )}

      {/* WhatsApp Preview Modal */}
      {whatsappModal && (
        <div className="modal-ov" onClick={()=>setWhatsappModal(false)}>
          <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">📱 WhatsApp Preview</div>
            <div style={{fontSize:13,color:"var(--text2)",marginBottom:16}}>Click any preview to open in WhatsApp Web</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,maxHeight:400,overflowY:"auto",marginBottom:16}}>
              {whatsappPreviews.map((p,i)=>(
                <div key={i} onClick={()=>{if(p.whatsapp_link)window.open(p.whatsapp_link,"_blank");}}
                  style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,padding:12,cursor:"pointer",transition:"all .3s"}}>
                  <div style={{fontWeight:600,fontSize:12,color:"var(--text)",marginBottom:4}}>{p.name}</div>
                  <div style={{fontSize:11,color:"var(--text2)",marginBottom:6}}>{p.phone}</div>
                  <div style={{fontSize:12,color:"var(--text3)",background:"var(--bg4)",padding:8,borderRadius:6,maxHeight:80,overflowY:"auto",marginBottom:6}}>{p.message}</div>
                  <div style={{fontSize:10,color:"var(--accent)",fontWeight:600}}>Click to send →</div>
                </div>
              ))}
            </div>
            <div className="row" style={{justifyContent:"flex-end"}}><button className="btn btn-p" onClick={()=>setWhatsappModal(false)}>Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Contacts (enhanced) ──────────────────────────────────────────────────────
function Contacts({ contacts, setContacts, toast }) {
  const [search, setSearch]   = useState("");
  const [selected, setSelected]= useState(new Set());
  const [view, setView]        = useState("table");
  const [drag, setDrag]        = useState(false);
  const [segFilter, setSegFilter] = useState("All");
  const fileRef = useRef();

  const handleFile = async (file) => {
    const form = new FormData(); form.append("file", file);
    try {
      const { contacts: c, count } = await api("/contacts/upload", { method:"POST", body: form });
      setContacts(c); setSelected(new Set());
      toast(`Loaded ${count} contacts ✓`);
    } catch(e) { toast(e.message, "error"); }
  };

  const segments = ["All", ...new Set(contacts.map(c=>c.segment).filter(Boolean))];
  const filtered = contacts.filter(c => {
    if (segFilter !== "All" && c.segment !== segFilter) return false;
    if (search && !Object.values(c).some(v=>v?.toLowerCase?.().includes(search.toLowerCase()))) return false;
    return true;
  });

  const toggleSel = i => { const s=new Set(selected); s.has(i)?s.delete(i):s.add(i); setSelected(s); };
  const toggleAll = () => setSelected(selected.size===filtered.length?new Set():new Set(filtered.map((_,i)=>i)));
  const removeSelected = () => { setContacts(contacts.filter((_,i)=>!selected.has(i))); setSelected(new Set()); toast(`Removed ${selected.size} contacts`); };
  const downloadCSV = () => {
    if (!contacts.length) return;
    const k=Object.keys(contacts[0]);
    const csv=[k.join(","),...contacts.map(c=>k.map(key=>`"${(c[key]||"").replace(/"/g,'""')}"`).join(","))].join("\n");
    const a=document.createElement("a");a.href="data:text/csv,"+encodeURIComponent(csv);a.download="contacts_export.csv";a.click();
  };

  if (!contacts.length) return (
    <div className="anim">
      <div className={`dropzone ${drag?"drag":""}`} onClick={()=>fileRef.current.click()}
        onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0]);}}>
        <Ic p={I.upload} s={44}/>
        <div style={{marginTop:14,fontFamily:"var(--fh)",fontSize:18,fontWeight:800}}>Drop your CSV here</div>
        <div style={{marginTop:6,fontSize:13}}>or click to browse · .csv format</div>
        <div style={{marginTop:18,display:"flex",gap:7,justifyContent:"center",flexWrap:"wrap"}}>
          {["email *","name","company","phone","segment","destination","package_name","price","language"].map(f=>(
            <span key={f} className={`badge ${f.includes("*")?"b-blue":"b-gray"}`}>{f}</span>
          ))}
        </div>
        <div style={{marginTop:10,fontSize:12}}>Every column = a personalization tag. Add <strong>segment</strong> column for filtering by client type.</div>
      </div>
      <input type="file" ref={fileRef} accept=".csv" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
    </div>
  );

  return (
    <div className="anim">
      <div className="row" style={{marginBottom:10,flexWrap:"wrap",gap:8}}>
        <div className="sbox" style={{flex:1,minWidth:180}}>
          <Ic p={I.search} s={13} c="var(--text3)"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${contacts.length} contacts…`}/>
          {search && <button style={{background:"none",border:"none",cursor:"pointer",color:"var(--text3)",padding:0}} onClick={()=>setSearch("")}><Ic p={I.x} s={11}/></button>}
        </div>
        <button className="bti" onClick={()=>setView(v=>v==="table"?"cards":"table")}><Ic p={view==="table"?I.grid:I.list} s={14}/></button>
        <button className="btn btn-g" style={{fontSize:12}} onClick={()=>fileRef.current.click()}><Ic p={I.upload} s={12}/>Replace</button>
        <button className="btn btn-g" style={{fontSize:12}} onClick={downloadCSV}><Ic p={I.download} s={12}/>Export</button>
        <button className="btn btn-d" style={{fontSize:12}} onClick={()=>{setContacts([]);setSelected(new Set());toast("Contacts cleared");}}><Ic p={I.trash} s={12}/>Clear</button>
      </div>

      {/* Segment chips */}
      {segments.length > 1 && (
        <div className="row" style={{flexWrap:"wrap",gap:6,marginBottom:10}}>
          {segments.map(s=>(
            <button key={s} className={`seg-chip ${segFilter===s?"active":""}`} onClick={()=>setSegFilter(s)}>
              {s} {s!=="All"?`(${contacts.filter(c=>c.segment===s).length})`:``}
            </button>
          ))}
        </div>
      )}

      {selected.size>0 && (
        <div style={{background:"var(--accentbg)",border:"1px solid var(--accentborder)",borderRadius:9,padding:"9px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:13,color:"var(--accent)",fontWeight:600}}>{selected.size} selected</span>
          <button className="btn btn-d" style={{fontSize:12,padding:"5px 10px"}} onClick={removeSelected}><Ic p={I.trash} s={12}/>Remove</button>
          <button className="btn btn-g" style={{fontSize:12,padding:"5px 10px"}} onClick={()=>setSelected(new Set())}>Deselect</button>
        </div>
      )}

      <div className="card" style={{padding:0,overflow:"hidden"}}>
        {view==="table"?(
          <div style={{overflowX:"auto",maxHeight:"calc(100vh - 280px)",overflowY:"auto"}}>
            <table className="tbl">
              <thead style={{position:"sticky",top:0,background:"var(--bg2)",zIndex:1}}>
                <tr>
                  <th style={{width:38}}><input type="checkbox" checked={selected.size===filtered.length&&filtered.length>0} onChange={toggleAll}/></th>
                  {Object.keys(contacts[0]).map(k=><th key={k}>{k}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c,i)=>(
                  <tr key={i} style={{background:selected.has(i)?"var(--accentbg)":undefined}}>
                    <td><input type="checkbox" checked={selected.has(i)} onChange={()=>toggleSel(i)}/></td>
                    {Object.entries(c).map(([k,v],j)=>(
                      <td key={k}>{j===0?(
                        <div className="row" style={{gap:8}}>
                          <div style={{width:26,height:26,borderRadius:7,background:"var(--accentbg)",border:"1px solid var(--accentborder)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"var(--accent)",flexShrink:0}}>
                            {(v||"?")[0].toUpperCase()}
                          </div>{v}
                        </div>
                      ):k==="segment"?<span className="badge b-teal" style={{fontSize:11}}>{v}</span>:v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12,padding:14,maxHeight:"calc(100vh - 280px)",overflowY:"auto"}}>
            {filtered.map((c,i)=>(
              <div key={i} onClick={()=>toggleSel(i)}
                style={{background:"var(--bg3)",border:`1px solid ${selected.has(i)?"var(--accent)":"var(--border)"}`,borderRadius:11,padding:"12px 14px",cursor:"pointer",transition:"all .14s"}}>
                <div className="row" style={{marginBottom:7}}>
                  <div style={{width:34,height:34,borderRadius:9,background:"var(--accentbg)",border:"1px solid var(--accentborder)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"var(--accent)",flexShrink:0}}>
                    {(c.name||c.email||"?")[0].toUpperCase()}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name||"—"}</div>
                    <div style={{fontSize:11.5,color:"var(--text3)"}}>{c.company||""}</div>
                  </div>
                </div>
                <div style={{fontSize:12,color:"var(--text3)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.email}</div>
                {c.segment && <span className="badge b-teal" style={{fontSize:10,marginTop:6}}>{c.segment}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
      <input type="file" ref={fileRef} accept=".csv" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
    </div>
  );
}

// ─── Campaign History ─────────────────────────────────────────────────────────
function History({ campaigns, setCampaigns, toast }) {
  const [selected, setSelected] = useState(null);
  const [checking, setChecking] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const checkReplies = async (cid) => {
    setChecking(true);
    try {
      const res = await api(`/campaigns/${cid}/replies`);
      toast(`Found ${res.reply_count} replies, ${res.bounce_count} bounces`);
      const updated = await api("/campaigns");
      setCampaigns(updated);
      setSelected(updated.find(c=>c.id===cid)||null);
    } catch(e) { toast(e.message,"error"); }
    setChecking(false);
  };

  const deleteCampaign = async (id) => {
    await api(`/campaigns/${id}`,{method:"DELETE"});
    setCampaigns(p=>p.filter(c=>c.id!==id));
    if(selected?.id===id) setSelected(null);
    toast("Campaign deleted");
  };

  const filtered = campaigns.filter(c => {
    if (typeFilter!=="all" && c.type!==typeFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="anim">
      <div className="row" style={{marginBottom:14,flexWrap:"wrap",gap:8}}>
        <div className="sbox" style={{flex:1,minWidth:160}}>
          <Ic p={I.search} s={13} c="var(--text3)"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search campaigns…"/>
        </div>
        <select className="sel" style={{width:"auto"}} value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          {CAMPAIGN_TYPES.filter(t=>t.id!=="whatsapp").map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </div>

      {filtered.length===0 ? (
        <div className="empty">
          <Ic p={I.history} s={48}/>
          <div className="empty-t">No campaigns yet</div>
          <div className="empty-s">Sent campaigns appear here with full analytics and reply detection.</div>
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:selected?"300px 1fr":"1fr",gap:14}}>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {filtered.map(c=>{
              const rate = c.total ? Math.round((c.sent/c.total)*100) : 0;
              const opens = (c.results||[]).filter(r=>r.opened).length;
              const replies = (c.results||[]).filter(r=>r.replied).length;
              return (
                <div key={c.id} className="campaign-card" onClick={()=>setSelected(c)}
                  style={{border:selected?.id===c.id?"1.5px solid var(--accent)":undefined}}>
                  <div className="row" style={{marginBottom:8}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:typeColor(c.type),flexShrink:0}}/>
                    <div style={{flex:1,fontWeight:600,fontSize:13,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                    <span className="badge b-gray" style={{fontSize:10}}>{typeLabel(c.type)}</span>
                  </div>
                  <div style={{fontSize:11.5,color:"var(--text3)",marginBottom:8}}>{new Date(c.sent_at).toLocaleString()}</div>
                  <div className="row" style={{gap:10}}>
                    <span className={`badge b-${rate>=90?"green":rate>=70?"amber":"red"}`} style={{fontSize:11}}>{rate}% delivery</span>
                    {opens>0 && <span className="badge b-blue" style={{fontSize:11}}>{opens} opens</span>}
                    {replies>0 && <span className="badge b-purple" style={{fontSize:11}}>{replies} replies</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {selected && (
            <div className="card anim">
              <div className="row" style={{marginBottom:14}}>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"var(--fh)",fontSize:17,fontWeight:800,color:"var(--text)"}}>{selected.name}</div>
                  <div style={{fontSize:12,color:"var(--text3)",marginTop:3}}>{new Date(selected.sent_at).toLocaleString()} · {typeLabel(selected.type)}</div>
                </div>
                <button className="btn btn-green" style={{fontSize:12}} onClick={()=>checkReplies(selected.id)} disabled={checking}>
                  <Ic p={I.refresh} s={13}/>{checking?"Checking…":"Check Replies"}
                </button>
                <button className="btn btn-d" style={{fontSize:12}} onClick={()=>deleteCampaign(selected.id)}><Ic p={I.trash} s={13}/></button>
              </div>

              {/* Stats */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
                {[
                  {label:"Sent",val:selected.sent,color:"var(--green)"},
                  {label:"Failed",val:selected.failed,color:"var(--red)"},
                  {label:"Skipped",val:selected.skipped_duplicates||0,color:"var(--amber)"},
                  {label:"Opened",val:(selected.results||[]).filter(r=>r.opened).length,color:"var(--accent)"},
                  {label:"Replied",val:(selected.results||[]).filter(r=>r.replied).length,color:"var(--purple)"},
                  {label:"Bounced",val:(selected.results||[]).filter(r=>r.bounced).length,color:"var(--red)"},
                ].map(s=>(
                  <div key={s.label} style={{background:"var(--bg3)",borderRadius:9,padding:"10px 12px",textAlign:"center"}}>
                    <div style={{fontSize:20,fontWeight:800,color:s.color,fontFamily:"var(--fh)"}}>{s.val}</div>
                    <div style={{fontSize:11,color:"var(--text3)",marginTop:2}}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Delivery bar */}
              <div style={{marginBottom:16}}>
                <div className="row" style={{marginBottom:6}}>
                  <span style={{fontSize:12,color:"var(--text2)"}}>Delivery Rate</span>
                  <span style={{marginLeft:"auto",fontWeight:700,color:"var(--green)"}}>
                    {selected.total?Math.round((selected.sent/selected.total)*100):0}%
                  </span>
                </div>
                <div className="pb"><div className="pf green" style={{width:`${selected.total?(selected.sent/selected.total)*100:0}%`}}/></div>
              </div>

              {/* Subject */}
              <div style={{background:"var(--bg3)",borderRadius:8,padding:"9px 13px",fontSize:13,color:"var(--text2)",marginBottom:14}}>
                <strong style={{color:"var(--text3)",fontSize:10,textTransform:"uppercase",letterSpacing:.7}}>Subject: </strong>
                {selected.subject}
              </div>

              {/* Results table */}
              <div style={{maxHeight:300,overflowY:"auto"}}>
                <table className="tbl">
                  <thead><tr><th>Email</th><th>Status</th><th>Opened</th><th>Replied</th><th>Bounced</th></tr></thead>
                  <tbody>
                    {(selected.results||[]).map((r,i)=>(
                      <tr key={i}>
                        <td>{r.email}</td>
                        <td><span className={`badge b-${r.status==="sent"?"green":r.status==="failed"?"red":"gray"}`} style={{fontSize:11}}>{r.status}</span></td>
                        <td>{r.opened?<span className="badge b-blue" style={{fontSize:11}}>✓</span>:<span style={{color:"var(--text3)"}}>—</span>}</td>
                        <td>{r.replied?<span className="badge b-purple" style={{fontSize:11}}>✓</span>:<span style={{color:"var(--text3)"}}>—</span>}</td>
                        <td>{r.bounced?<span className="badge b-red" style={{fontSize:11}}>⚠</span>:<span style={{color:"var(--text3)"}}>—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Templates ────────────────────────────────────────────────────────────────
function Templates({ toast, setTab, setComposeDraft, setEdit, templates, setTemplates }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const del = async (id) => {
    await api(`/templates/${id}`,{method:"DELETE"});
    setTemplates(p=>p.filter(t=>t.id!==id));
    if(selected?.id===id) setSelected(null);
    toast("Deleted");
  };
  const use = (t) => { setComposeDraft(t); setTab("compose"); toast(`Loaded "${t.name}"`); };
  const edit = (t) => { setEdit(t); setTab("compose"); toast(`Editing "${t.name}"`); };
  const filtered = templates.filter(t=>
    (catFilter==="all"||t.category===catFilter) &&
    (!search||t.name.toLowerCase().includes(search.toLowerCase())||t.subject.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="anim">
      <div className="row" style={{marginBottom:12,flexWrap:"wrap",gap:8}}>
        <div className="sbox" style={{flex:1}}>
          <Ic p={I.search} s={13} c="var(--text3)"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search templates…"/>
        </div>
        <select className="sel" style={{width:"auto"}} value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
          <option value="all">All</option>
          {CAMPAIGN_TYPES.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
        <button className="btn btn-p" style={{fontSize:12}} onClick={()=>setTab("compose")}>
          <Ic p={I.compose} s={13}/>New Template
        </button>
      </div>

      {filtered.length===0 ? (
        <div className="empty">
          <Ic p={I.template} s={48}/>
          <div className="empty-t">No templates</div>
          <div className="empty-s">Save any composed email as a reusable template.</div>
          <button className="btn btn-p" style={{marginTop:16}} onClick={()=>setTab("compose")}><Ic p={I.compose} s={13}/>Compose</button>
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:selected?"260px 1fr":"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
          {!selected && filtered.map(t=>(
            <div key={t.id} className="card csm" onClick={()=>setSelected(t)}
              style={{cursor:"pointer",borderLeft:`3px solid ${typeColor(t.category||"general")}`}}>
              <div className="row" style={{marginBottom:7}}>
                <span className="badge b-gray" style={{fontSize:10}}>{typeLabel(t.category||"general")}</span>
                <div className="row" style={{marginLeft:"auto",gap:4}}>
                  <button className="btn btn-p" style={{fontSize:11,padding:"4px 10px"}} onClick={e=>{e.stopPropagation();use(t);}}>Use</button>
                  <button className="btn" style={{fontSize:11,padding:"4px 10px",background:"var(--accentbg)",color:"var(--accent)"}} onClick={e=>{e.stopPropagation();edit(t);}}>Edit</button>
                  <button className="bti" style={{padding:5}} onClick={e=>{e.stopPropagation();del(t.id);}}><Ic p={I.trash} s={12}/></button>
                </div>
              </div>
              <div style={{fontWeight:700,fontSize:13,color:"var(--text)",marginBottom:4}}>{t.name}</div>
              <div style={{fontSize:12,color:"var(--text3)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.subject}</div>
            </div>
          ))}
          {selected && (
            <>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {filtered.map(t=>(
                  <div key={t.id} className="card csm" onClick={()=>setSelected(t)}
                    style={{cursor:"pointer",border:selected?.id===t.id?"1.5px solid var(--accent)":undefined,borderLeft:`3px solid ${typeColor(t.category||"general")}`}}>
                    <div style={{fontWeight:600,fontSize:13,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.name}</div>
                    <div style={{fontSize:11.5,color:"var(--text3)",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.subject}</div>
                  </div>
                ))}
              </div>
              <div className="card anim">
                <div className="row" style={{marginBottom:16}}>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"var(--fh)",fontSize:17,fontWeight:800,color:"var(--text)"}}>{selected.name}</div>
                    <span className="badge b-gray" style={{fontSize:10,marginTop:4}}>{typeLabel(selected.category||"general")}</span>
                  </div>
                  <button className="btn btn-d" onClick={()=>del(selected.id)}><Ic p={I.trash} s={13}/></button>
                  <button className="btn" style={{background:"var(--accentbg)",color:"var(--accent)"}} onClick={()=>edit(selected)}><Ic p={I.send} s={13}/>Edit</button>
                  <button className="btn btn-p" onClick={()=>use(selected)}><Ic p={I.send} s={13}/>Use</button>
                </div>
                <label className="fl">Subject</label>
                <div style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,padding:"9px 13px",fontSize:14,color:"var(--text)",marginBottom:14}}>{selected.subject}</div>
                <label className="fl">Body</label>
                <div className="preview-pane" style={{whiteSpace:"pre-wrap",minHeight:160}}>{selected.body}</div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function Settings({ auth, setAuth, toast }) {
  const { dark, setDark } = useTheme();
  const credsRef = useRef();
  const handleCredsUpload = async (file) => {
    try {
      const form = new FormData();
      form.append("file", file);
      await api("/auth/credentials/upload", { method: "POST", body: form });
      toast("✓ Credentials uploaded! Ready to connect Gmail", "success");
      
      // Auto-check auth status after upload
      setTimeout(async () => {
        try {
          const authStatus = await api("/auth/status");
          if (authStatus.authenticated) {
            setAuth(authStatus);
            toast(`Connected as ${authStatus.email} ✓`);
          }
        } catch (e) {
          // Auth check failed - user needs to click Connect Gmail
        }
      }, 1000);
    } catch(e) {
      toast(e.message || "Upload failed", "error");
    }
  };
  const handleLogin = async () => {
    try {
      const { auth_url } = await api("/auth/login");
      window.open(auth_url,"_blank","width=500,height=600");
      const poll = setInterval(async()=>{
        const s=await api("/auth/status");
        if(s.authenticated){setAuth(s);clearInterval(poll);toast(`Connected as ${s.email}`);}
      },2000);
      setTimeout(()=>clearInterval(poll),120000);
    } catch(e){toast(e.message,"error");}
  };
  return (
    <div className="anim">
      <div className="card" style={{marginBottom:14}}>
        <div className="sec-title" style={{marginBottom:16}}>Gmail Account</div>
        {auth?.authenticated ? (
          <div className="row" style={{gap:14}}>
            <div style={{width:42,height:42,borderRadius:11,background:"var(--accentbg)",border:"1px solid var(--accentborder)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"var(--accent)",flexShrink:0}}>
              {auth.email[0].toUpperCase()}
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,color:"var(--text)",fontSize:14}}>{auth.email}</div>
              <div className="row" style={{gap:5,marginTop:4}}>
                <span className="dot green"/><span style={{fontSize:12,color:"var(--green)",fontWeight:600}}>Connected · Gmail API Active</span>
              </div>
            </div>
            <button className="btn btn-d" onClick={()=>toast("Delete token.pickle from backend/ to disconnect","info")}>Disconnect</button>
          </div>
        ) : (
          <>
            <div style={{background:"var(--amberbg)",border:"1px solid rgba(255,179,64,.22)",borderRadius:10,padding:"14px 16px",marginBottom:16,fontSize:13,color:"var(--text2)",lineHeight:1.75}}>
              <strong style={{color:"var(--amber)"}}>One-time setup (~15 min)</strong><br/>
              1. <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" style={{color:"var(--accent)"}}>console.cloud.google.com</a> → New Project → Enable <strong>Gmail API</strong><br/>
              2. Create <strong>OAuth 2.0 Client ID</strong> (Web app) · Redirect: <code style={{background:"var(--bg4)",padding:"1px 5px",borderRadius:4,fontSize:12}}>http://localhost:8000/auth/callback</code><br/>
              3. Download JSON → See <strong>Upload Credentials</strong> below<br/>
              4. Click Connect
            </div>
            <button className="btn btn-p" onClick={handleLogin}><Ic p={I.mail} s={14}/>Connect Gmail</button>
          </>
        )}
      </div>

      <div className="card" style={{marginBottom:14}}>
        <div className="sec-title" style={{marginBottom:16}}>Upload Credentials</div>
        <div style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:10,padding:"20px 16px",textAlign:"center",cursor:"pointer"}} onClick={()=>credsRef.current?.click()}>
          <Ic p={I.upload} s={32} c="var(--accent)" style={{marginBottom:8,opacity:.8}}/>
          <div style={{fontWeight:600,color:"var(--text)",fontSize:13,marginBottom:4}}>Upload credentials.json</div>
          <div style={{fontSize:12,color:"var(--text2)"}}>Download from Google Cloud Console, any filename</div>
          <input type="file" ref={credsRef} accept=".json" style={{display:"none"}} onChange={e=>e.target.files?.[0]&&handleCredsUpload(e.target.files[0])}/>
        </div>
      </div>

      <div className="card" style={{marginBottom:14}}>
        <div className="sec-title" style={{marginBottom:16}}>Appearance</div>
        <div className="row" style={{justifyContent:"space-between"}}>
          <div>
            <div style={{fontWeight:600,color:"var(--text)",fontSize:14}}>Dark Mode</div>
            <div style={{fontSize:12,color:"var(--text3)",marginTop:2}}>Toggle between light and dark theme</div>
          </div>
          <button className="toggle" onClick={()=>setDark(d=>!d)} style={{background:dark?"var(--accent)":"var(--bg4)"}}>
            <div className="toggle-t" style={{transform:dark?"translateX(20px)":"translateX(0)"}}/>
          </button>
        </div>
      </div>

      <div className="card" style={{marginBottom:14}}>
        <div className="sec-title" style={{marginBottom:14}}>Gmail Sending Limits</div>
        <div className="g2">
          {[["Free Gmail","500 / day"],["Google Workspace","2,000 / day"],["Safe batch","≤ 200 / campaign"],["Warm-up rule","Start with 50/day"],["Delay recommended","2–3 seconds"],["Max safe daily","300–400 emails"]].map(([k,v])=>(
            <div key={k} style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:9,padding:"10px 13px"}}>
              <div style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:.6,fontWeight:700,marginBottom:3}}>{k}</div>
              <div style={{fontSize:14,fontWeight:700,color:"var(--text)"}}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="sec-title" style={{marginBottom:10}}>About MailFlow DMC</div>
        <div style={{fontSize:13,color:"var(--text2)",lineHeight:1.8}}>
          Designed specifically for <strong>Tour DMC professionals</strong>. Sends via <strong>Gmail API</strong> — real account, inbox delivery. Features: CC/BCC, open tracking, bounce detection, follow-up sequences, duplicate filtering, campaign history, segment targeting, attachment support, and WhatsApp previewer.
        </div>
      </div>
    </div>
  );
}


// ─── Beach Theme Helpers ─────────────────────────────────────────────────────
function createCowboyHelpers(canvasRef, dbRef, starRef, flashRef, cowboyDataRef, callbacks) {
  const { setCowboyOn, setAnimating } = callbacks;
  
  return {
    shootStar(onDone) {
      const star = starRef.current;
      if (!star) return;
      
      const logoR = star.parentElement.getBoundingClientRect();
      
      const startX = logoR.left + 10;
      const startY = logoR.top + 14;
      const endX = window.innerWidth * 0.52;
      const endY = window.innerHeight * 0.46;
      
      const dx = endX - startX;
      const dy = endY - startY;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      star.style.cssText = `top:${startY}px;left:${startX}px;width:0;opacity:0;transform:rotate(${angle}deg);transform-origin:right center;position:fixed;`;
      
      const DURATION = 900;
      const MAX_W = 95;
      let startTS = null;
      
      const step = (ts) => {
        if (!startTS) startTS = ts;
        const p = Math.min((ts - startTS) / DURATION, 1);
        const e = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
        
        const w = p < 0.40 ? MAX_W * (p / 0.40)
                : p < 0.78 ? MAX_W
                : MAX_W * (1 - (p - 0.78) / 0.22);
        
        star.style.width = w + 'px';
        star.style.opacity = p < 0.06 ? p / 0.06
                           : p > 0.84 ? (1 - p) / 0.16
                           : '1';
        star.style.transform = `rotate(${angle}deg) translateX(${e * dist}px)`;
        
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          star.style.opacity = '0';
          onDone(endX, endY);
        }
      };
      requestAnimationFrame(step);
    },
    
    initCowboy(ex, ey) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const W = canvas.width;
      const H = canvas.height;
      const cd = cowboyDataRef.current;
      
      cd.dustParticles = [];
      cd.tumbleweeds = [];
      cd.shootingStars = [];
      
      // Foam particles - 150 floating foam motes
      for (let i = 0; i < 150; i++) {
        cd.dustParticles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 0.5 + Math.random() * 1.5,
          o: Math.random() * 0.5,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          spd: 0.002 + Math.random() * 0.006,
          dir: Math.random() < 0.5 ? 1 : -1,
        });
      }
      
      // Waves - 8 wave ripples
      for (let i = 0; i < 8; i++) {
        cd.tumbleweeds.push({
          x: -200,
          y: H * 0.55 + Math.random() * 40,
          vx: 1.5 + Math.random() * 2.5,
          vy: (Math.random() - 0.5) * 0.2,
          r: 20 + Math.random() * 25,
          life: 1,
          delay: i * 2500,
          rotation: 0,
        });
      }
      
      // Schedule background foam bursts
      this.scheduleBackgroundEffects(W, H);
    },
    
    scheduleBackgroundEffects(W, H) {
      const cd = cowboyDataRef.current;
      const delay = 1500 + Math.random() * 2500;
      const scheduleEffectsFn = this.scheduleBackgroundEffects.bind(this);
      setTimeout(() => {
        if (!cd.cowboyOn) return;
        cd.dustClouds = cd.dustClouds || [];
        cd.dustClouds.push({
          x: Math.random() * W * 0.4 + W * 0.3,
          y: H * 0.5 + Math.random() * 60,
          vx: 0.5 + Math.random() * 1,
          life: 1,
          size: 30 + Math.random() * 50,
        });
        scheduleEffectsFn(W, H);
      }, delay);
    },
    
    drawCowboy(elapsed) {
      const canvas = canvasRef.current;
      if (!canvas || canvas.width === 0 || canvas.height === 0) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const W = canvas.width;
      const H = canvas.height;
      const cd = cowboyDataRef.current;
      
      ctx.clearRect(0, 0, W, H);
      
      // ═══ LAYER 1: Sky gradient (tropical blue)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.5);
      skyGrad.addColorStop(0, '#87CEEB');
      skyGrad.addColorStop(0.5, '#87CEEB');
      skyGrad.addColorStop(1, '#E0F6FF');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H * 0.5);
      
      // ═══ LAYER 2: Ocean gradient
      const oceanGrad = ctx.createLinearGradient(0, H * 0.5, 0, H);
      oceanGrad.addColorStop(0, '#20B2AA');
      oceanGrad.addColorStop(0.4, '#1E90FF');
      oceanGrad.addColorStop(1, '#0047AB');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, H * 0.5, W, H * 0.5);
      
      // ═══ LAYER 3: Sand at the bottom
      ctx.fillStyle = '#F4A460';
      ctx.fillRect(0, H * 0.65, W, H * 0.35);
      
      // Sand ripples
      ctx.fillStyle = 'rgba(210, 180, 140, 0.4)';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, H * (0.65 + i * 0.08));
        for (let x = 0; x <= W; x += 50) {
          const y = H * (0.65 + i * 0.08) - Math.sin(x / 80 + elapsed / 1500) * 8;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H);
        ctx.lineTo(0, H);
        ctx.fill();
      }
      
      // ═══ LAYER 4: Foam particles (floating beach foam)
      cd.dustParticles.forEach(p => {
        p.o += p.spd * p.dir;
        if (p.o >= 0.5 || p.o <= 0.1) p.dir *= -1;
        p.x += p.vx * 0.5;
        if (p.x > W) p.x = -10;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.o * 0.8})`;
        ctx.fill();
      });
      
      // ═══ LAYER 5: Ocean mist/foam clouds
      if (cd.dustClouds) {
        cd.dustClouds = cd.dustClouds.filter(dc => {
          dc.x += dc.vx;
          dc.life -= 0.012;
          if (dc.life <= 0 || dc.x > W) return false;
          
          const grad = ctx.createRadialGradient(dc.x, dc.y, 0, dc.x, dc.y, dc.size);
          grad.addColorStop(0, `rgba(255, 255, 255, ${dc.life * 0.4})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = grad;
          ctx.fillRect(dc.x - dc.size, dc.y - dc.size * 0.5, dc.size * 2, dc.size);
          
          return true;
        });
      }
      
      // ═══ LAYER 6: Ocean waves
      cd.tumbleweeds.forEach((wave, idx) => {
        if (elapsed < wave.delay) return;
        
        wave.x += wave.vx;
        wave.y += wave.vy + Math.sin(elapsed / 800 + idx * 0.5) * 1.5;
        
        // Draw wave as curved lines with foam
        ctx.save();
        ctx.globalAlpha = 0.7;
        
        // Wave line
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Wave foam top
        ctx.beginPath();
        ctx.arc(wave.x, wave.y - 8, wave.r * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
        
        ctx.restore();
        
        if (wave.x > W + 200) {
          wave.x = -200;
          wave.y = H * 0.55 + Math.random() * 40;
        }
      });
      
      // ═══ LAYER 7: Sun glow (tropical sun)
      const sunGrad = ctx.createRadialGradient(W * 0.85, H * 0.15, 0, W * 0.85, H * 0.15, 150);
      sunGrad.addColorStop(0, 'rgba(255, 200, 0, 0.12)');
      sunGrad.addColorStop(0.5, 'rgba(255, 150, 0, 0.05)');
      sunGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, W, H);
    },
    
    startCowboyLoop() {
      const cd = cowboyDataRef.current;
      const startTime = performance.now();
      
      const loop = (ts) => {
        const elapsed = ts - startTime;
        this.drawCowboy(elapsed);
        cd.rafId = requestAnimationFrame(loop);
      };
      cd.rafId = requestAnimationFrame(loop);
    },
    
    turnOn() {
      setAnimating(true);
      this.shootStar((ex, ey) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const flash = flashRef.current;
        if (flash) {
          const px = ((ex / window.innerWidth) * 100).toFixed(0);
          const py = ((ey / window.innerHeight) * 100).toFixed(0);
          
          flash.style.background = `radial-gradient(ellipse at ${px}% ${py}%, rgba(135, 206, 235, 0.5) 0%, rgba(32, 178, 170, 0.2) 22%, transparent 55%)`;
          flash.style.transition = 'opacity .05s';
          flash.style.opacity = '1';
          flash.style.zIndex = '5';
          
          setTimeout(() => {
            flash.style.transition = 'opacity .9s';
            flash.style.opacity = '0';
          }, 50);
        }
        
        const cd = cowboyDataRef.current;
        cd.cowboyOn = true;
        
        this.initCowboy(ex, ey);
        this.startCowboyLoop();
        
        const db = dbRef.current;
        if (db) db.classList.add('cowboy');
        canvas.style.transition = 'opacity .5s ease';
        requestAnimationFrame(() => {
          canvas.style.opacity = '1';
        });
        setCowboyOn(true);
        setAnimating(false);
      });
    },
    
    turnOff() {
      setCowboyOn(false);
      const canvas = canvasRef.current;
      const db = dbRef.current;
      const cd = cowboyDataRef.current;
      
      if (cd.rafId) {
        cancelAnimationFrame(cd.rafId);
        cd.rafId = null;
      }
      cd.cowboyOn = false;
      
      canvas.style.transition = 'opacity 1s ease';
      canvas.style.opacity = '0';
      db.classList.remove('cowboy');
      document.body.classList.remove('cowboy');
      document.documentElement.classList.remove('cowboy');
      
      setTimeout(() => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.transition = '';
        setAnimating(false);
      }, 1000);
    },
  };
}

// ─── Galaxy Animation Helpers ─────────────────────────────────────────────────
function createGalaxyHelpers(canvasRef, dbRef, starRef, flashRef, galaxyDataRef, callbacks) {
  const { setGalaxyOn, setAnimating } = callbacks;
  
  return {
    shootStar(onDone) {
      const star = starRef.current;
      if (!star) return;
      
      const logoR = star.parentElement.getBoundingClientRect();
      
      // Use viewport coordinates (canvas is full viewport)
      const startX = logoR.left + 10;
      const startY = logoR.top + 14;
      const endX = window.innerWidth * 0.52;
      const endY = window.innerHeight * 0.46;
      
      const dx = endX - startX;
      const dy = endY - startY;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      star.style.cssText = `top:${startY}px;left:${startX}px;width:0;opacity:0;transform:rotate(${angle}deg);transform-origin:right center;position:fixed;`;
      
      const DURATION = 900;
      const MAX_W = 95;
      let startTS = null;
      
      const step = (ts) => {
        if (!startTS) startTS = ts;
        const p = Math.min((ts - startTS) / DURATION, 1);
        const e = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
        
        const w = p < 0.40 ? MAX_W * (p / 0.40)
                : p < 0.78 ? MAX_W
                : MAX_W * (1 - (p - 0.78) / 0.22);
        
        star.style.width = w + 'px';
        star.style.opacity = p < 0.06 ? p / 0.06
                           : p > 0.84 ? (1 - p) / 0.16
                           : '1';
        star.style.transform = `rotate(${angle}deg) translateX(${e * dist}px)`;
        
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          star.style.opacity = '0';
          onDone(endX, endY);
        }
      };
      requestAnimationFrame(step);
    },
    
    initGalaxy(ex, ey) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const W = canvas.width;
      const H = canvas.height;
      const gd = galaxyDataRef.current;
      
      gd.stars = [];
      gd.staticStars = [];
      gd.warpLines = [];
      gd.sparks = [];
      gd.shootingStars = [];
      
      // Dense static star field - thousands of tiny dots
      for (let i = 0; i < 2000; i++) {
        gd.staticStars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 0.6 + 0.2,
          o: Math.random() * 0.5 + 0.5,
          hue: Math.random() < 0.2 ? 200 + Math.random() * 50 : 0,
        });
      }
      
      // Twinkling star field - 250 brighter twinkling stars
      for (let i = 0; i < 250; i++) {
        gd.stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() < 0.1 ? 1.5 + Math.random() * 0.8 : 0.4 + Math.random() * 0.7,
          o: Math.random(),
          spd: 0.005 + Math.random() * 0.015,
          dir: Math.random() < 0.5 ? 1 : -1,
          hue: Math.random() < 0.25 ? 195 + Math.random() * 50 : 0,
        });
      }
      
      // Warp lines radiating from explosion point
      for (let i = 0; i < 100; i++) {
        const a = Math.random() * Math.PI * 2;
        const d = 30 + Math.random() * Math.max(W, H) * 0.75;
        gd.warpLines.push({
          a, d,
          len: 0,
          maxLen: 5 + Math.random() * 38,
          spd: 2.5 + Math.random() * 8,
          o: 0.06 + Math.random() * 0.42,
          hue: 185 + Math.random() * 75,
          delay: Math.random() * 1600,
        });
      }
      
      // Burst sparks
      for (let i = 0; i < 70; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 1.5 + Math.random() * 5;
        gd.sparks.push({
          x: ex,
          y: ey,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          life: 1,
          dec: 0.014 + Math.random() * 0.02,
          r: 1 + Math.random() * 2.2,
          hue: 28 + Math.random() * 50,
        });
      }
      
      // Schedule background shooting stars
      this.scheduleBgStar(W, H);
    },
    
    scheduleBgStar(W, H) {
      const gd = galaxyDataRef.current;
      const delay = 1800 + Math.random() * 2500;
      const scheduleBgStarFn = this.scheduleBgStar.bind(this);  
      setTimeout(() => {
        if (!gd.galaxyOn) return;
        gd.shootingStars.push({
          x: -10,
          y: Math.random() * H * 0.6,
          vx: 4 + Math.random() * 4,
          vy: 1.5 + Math.random() * 2,
          len: 60 + Math.random() * 80,
          life: 1,
        });
        scheduleBgStarFn(W, H);
      }, delay);
    },
    
    drawGalaxy(elapsed) {
      const canvas = canvasRef.current;
      if (!canvas || canvas.width === 0 || canvas.height === 0) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const W = canvas.width;
      const H = canvas.height;
      const gd = galaxyDataRef.current;
      const ex = gd._ex;
      const ey = gd._ey;
      
      ctx.clearRect(0, 0, W, H);
      
      // ═══ LAYER 1: Deep space background
      const bg = ctx.createRadialGradient(W * 0.35, H * 0.38, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.9);
      bg.addColorStop(0, '#07102a');
      bg.addColorStop(0.4, '#040b1c');
      bg.addColorStop(1, '#020408');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      
      // ═══ LAYER 2: Galaxy core glow (purple)
      const gc = ctx.createRadialGradient(W * 0.52, H * 0.46, 0, W * 0.52, H * 0.46, W * 0.28);
      gc.addColorStop(0, 'rgba(140,80,255,.09)');
      gc.addColorStop(0.4, 'rgba(60,30,140,.05)');
      gc.addColorStop(1, 'transparent');
      ctx.fillStyle = gc;
      ctx.fillRect(0, 0, W, H);
      
      // ═══ LAYER 3: Blue nebula accent (right side)
      const nb = ctx.createRadialGradient(W * 0.78, H * 0.55, 0, W * 0.78, H * 0.55, W * 0.3);
      nb.addColorStop(0, 'rgba(0,60,150,.07)');
      nb.addColorStop(1, 'transparent');
      ctx.fillStyle = nb;
      ctx.fillRect(0, 0, W, H);
      
      // ═══ LAYER 3.5: Dense static star field (background stars)
      if (gd.staticStars && gd.staticStars.length > 0) {
        gd.staticStars.forEach(s => {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = s.hue
            ? `hsla(${s.hue},60%,80%,${s.o})`
            : `rgba(200,210,255,${s.o})`;
          ctx.fill();
        });
      }
      
      // ═══ LAYER 4: Warp lines radiating from explosion point
      if (ex !== undefined) {
        gd.warpLines.forEach(l => {
          if (elapsed < l.delay) return;
          l.len = Math.min(l.len + l.spd, l.maxLen);
          const fi = Math.min((elapsed - l.delay) / 700, 1);
          const ox = ex + Math.cos(l.a) * (l.d - l.len);
          const oy = ey + Math.sin(l.a) * (l.d - l.len);
          const lx = ex + Math.cos(l.a) * l.d;
          const ly = ey + Math.sin(l.a) * l.d;
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(lx, ly);
          ctx.strokeStyle = `hsla(${l.hue},75%,72%,${l.o * fi})`;
          ctx.lineWidth = 0.65;
          ctx.stroke();
        });
      }
      
      // ═══ LAYER 5: Twinkling star field
      gd.stars.forEach(s => {
        s.o += s.spd * s.dir;
        if (s.o >= 1 || s.o <= 0) s.dir *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.hue
          ? `hsla(${s.hue},65%,85%,${Math.max(0, s.o)})`
          : `rgba(210,225,255,${Math.max(0, s.o)})`;
        ctx.fill();
      });
      
      // ═══ LAYER 6: Burst sparks (first 2.2 seconds)
      if (elapsed < 2200) {
        gd.sparks.forEach(s => {
          s.x += s.vx;
          s.y += s.vy;
          s.vy += 0.03;
          s.life -= s.dec;
          if (s.life <= 0) return;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${s.hue},100%,72%,${s.life * 0.85})`;
          ctx.fill();
        });
      }
      
      // ═══ LAYER 7: Background shooting stars
      for (let i = gd.shootingStars.length - 1; i >= 0; i--) {
        const s = gd.shootingStars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.012;
        if (s.life <= 0 || s.x > W + 20) { gd.shootingStars.splice(i, 1); continue; }
        const ang = Math.atan2(s.vy, s.vx);
        const tx = s.x - Math.cos(ang) * s.len;
        const ty = s.y - Math.sin(ang) * s.len;
        const g = ctx.createLinearGradient(tx, ty, s.x, s.y);
        g.addColorStop(0, 'rgba(255,255,255,0)');
        g.addColorStop(1, `rgba(200,220,255,${s.life * 0.6})`);
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    },
    
    startGalaxyLoop() {
      const gd = galaxyDataRef.current;
      const startTime = performance.now();
      
      const loop = (ts) => {
        const elapsed = ts - startTime;
        this.drawGalaxy(elapsed);
        gd.rafId = requestAnimationFrame(loop);
      };
      gd.rafId = requestAnimationFrame(loop);
    },
    
    turnOn() {
      setAnimating(true);
      this.shootStar((ex, ey) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // Ensure canvas is sized for full viewport
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const flash = flashRef.current;
        if (flash) {
          const px = ((ex / window.innerWidth) * 100).toFixed(0);
          const py = ((ey / window.innerHeight) * 100).toFixed(0);
          
          flash.style.background = `radial-gradient(ellipse at ${px}% ${py}%, rgba(255,240,160,.6) 0%, rgba(255,160,0,.25) 22%, transparent 55%)`;
          flash.style.transition = 'opacity .05s';
          flash.style.opacity = '1';
          flash.style.zIndex = '5';
          
          setTimeout(() => {
            flash.style.transition = 'opacity .9s';
            flash.style.opacity = '0';
          }, 50);
        }
        
        const gd = galaxyDataRef.current;
        gd._ex = ex;
        gd._ey = ey;
        gd.galaxyOn = true;
        
        this.initGalaxy(ex, ey);
        this.startGalaxyLoop();
        
        const db = dbRef.current;
        if (db) db.classList.add('galaxy');
        canvas.style.transition = 'opacity .5s ease';
        requestAnimationFrame(() => {
          canvas.style.opacity = '1';
        });
        setGalaxyOn(true);
        setAnimating(false);
      });
    },
    
    turnOff() {
      setGalaxyOn(false);
      const canvas = canvasRef.current;
      const db = dbRef.current;
      const gd = galaxyDataRef.current;
      
      if (gd.rafId) {
        cancelAnimationFrame(gd.rafId);
        gd.rafId = null;
      }
      gd.galaxyOn = false;
      
      canvas.style.transition = 'opacity 1s ease';
      canvas.style.opacity = '0';
      db.classList.remove('galaxy');
      document.body.classList.remove('galaxy');
      document.documentElement.classList.remove('galaxy');
      
      setTimeout(() => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.transition = '';
        setAnimating(false);
      }, 1000);
    },
  };
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved !== null) return saved === "dark";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  });
  const [tab,setTab]             = useState("dashboard");
  const [auth,setAuth]           = useState(null);
  const [contacts,setContacts]   = useState([]);
  const [campaigns,setCampaigns] = useState([]);
  const [templates,setTemplates] = useState([]);
  const [composeDraft,setComposeDraft] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [rateLimitUsed,setRateLimitUsed] = useState(0);
  const [galaxyOn,setGalaxyOn]   = useState(false);
  const [cowboyOn,setCowboyOn]   = useState(false);
  const [animating,setAnimating] = useState(false);
  const canvasRef               = useRef(null);
  const dbRef                   = useRef(null);
  const starRef                 = useRef(null);
  const flashRef                = useRef(null);
  const galaxyDataRef           = useRef({
    stars: [],
    staticStars: [],
    warpLines: [],
    sparks: [],
    shootingStars: [],
    rafId: null,
    startTime: null,
  });
  const cowboyDataRef           = useRef({
    dustParticles: [],
    tumbleweeds: [],
    dustClouds: [],
    shootingStars: [],
    rafId: null,
    startTime: null,
  });
  const RATE_LIMIT = 400;
  const { toasts, toast, remove } = useToasts();

  const setEdit = (template) => {
    setEditingTemplate(template);
    setTab("compose");
  };

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(()=>{
    api("/auth/status").then(setAuth).catch(()=>setAuth({authenticated:false}));
    api("/campaigns").then(setCampaigns).catch(()=>{});
    api("/templates").then(setTemplates).catch(()=>{});
    api(`/rate-limit/status?limit=${RATE_LIMIT}`).then(r=>setRateLimitUsed(r.used||0)).catch(()=>{});
  },[]);

  // Keyboard shortcuts
  useEffect(()=>{
    const map={h:"dashboard",c:"compose",k:"contacts",t:"templates",r:"history",s:"settings"};
    let lastG=false,timer;
    const fn=(e)=>{
      if(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA") return;
      if(lastG&&map[e.key]){setTab(map[e.key]);lastG=false;clearTimeout(timer);return;}
      if(e.key==="g"){lastG=true;clearTimeout(timer);timer=setTimeout(()=>{lastG=false;},1500);}
    };
    window.addEventListener("keydown",fn);
    return()=>{window.removeEventListener("keydown",fn);clearTimeout(timer);};
  },[]);

  // Initialize canvas dimensions on mount
  useEffect(()=>{
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  },[]);

  // Galaxy and Cowboy animation setup
  useEffect(()=>{
    const galaxy = createGalaxyHelpers(canvasRef, dbRef, starRef, flashRef, galaxyDataRef, { setGalaxyOn, setAnimating });
    galaxyDataRef.current.galaxy = galaxy;
    const cowboy = createCowboyHelpers(canvasRef, dbRef, starRef, flashRef, cowboyDataRef, { setCowboyOn, setAnimating });
    cowboyDataRef.current.cowboy = cowboy;
  },[]);

  // Handle window resize for canvas
  useEffect(()=>{
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas && (galaxyOn || cowboyOn)) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [galaxyOn, cowboyOn]);

  // Auto-toggle animations when theme switches
  useEffect(()=>{
    if (animating) return;
    
    // When switching TO dark mode, turn off cowboy if it's on
    if (dark && cowboyOn) {
      const cowboy = cowboyDataRef.current.cowboy;
      if (cowboy) {
        document.body.classList.remove('cowboy');
        document.documentElement.classList.remove('cowboy');
        cowboy.turnOff();
      }
    }
    
    // When switching TO light mode, turn off galaxy if it's on
    if (!dark && galaxyOn) {
      const galaxy = galaxyDataRef.current.galaxy;
      if (galaxy) {
        document.body.classList.remove('galaxy');
        document.documentElement.classList.remove('galaxy');
        galaxy.turnOff();
      }
    }
  }, [dark, animating, cowboyOn, galaxyOn]);

  // Logo click handler for galaxy/cowboy toggle based on theme
  useEffect(()=>{
    const handleLogoClick = () => {
      if (animating) return;
      
      // Light mode = Cowboy theme, Dark mode = Galaxy theme
      if (!dark) {
        // LIGHT MODE - Cowboy theme
        const cowboy = cowboyDataRef.current.cowboy;
        if (!cowboy) return;
        if (cowboyOn) {
          document.body.classList.remove('cowboy');
          document.documentElement.classList.remove('cowboy');
          cowboy.turnOff();
        } else {
          document.body.classList.add('cowboy');
          document.documentElement.classList.add('cowboy');
          cowboy.turnOn();
        }
      } else {
        // DARK MODE - Galaxy theme
        const galaxy = galaxyDataRef.current.galaxy;
        if (!galaxy) return;
        if (galaxyOn) {
          document.body.classList.remove('galaxy');
          document.documentElement.classList.remove('galaxy');
          galaxy.turnOff();
        } else {
          document.body.classList.add('galaxy');
          document.documentElement.classList.add('galaxy');
          galaxy.turnOn();
        }
      }
    };
    const db = dbRef.current;
    if (db) {
      const logoArea = db.querySelector('.logo-wrap');
      if (logoArea) {
        logoArea.addEventListener('click', handleLogoClick);
        return () => logoArea.removeEventListener('click', handleLogoClick);
      }
    }
  }, [galaxyOn, cowboyOn, animating, dark]);

  const navItems = [
    {id:"dashboard",label:"Dashboard",  icon:I.home},
    {id:"compose",  label:"Compose",    icon:I.compose},
    {id:"contacts", label:"Contacts",   icon:I.contacts, badge:contacts.length||null, badgeClass:""},
    {id:"templates",label:"Templates",  icon:I.template, badge:templates.length||null, badgeClass:"blue"},
    {id:"history",  label:"History",    icon:I.history,  badge:campaigns.length||null, badgeClass:"blue"},
  ];
  const titles={dashboard:"Dashboard",compose:"Compose Email",contacts:"Contacts",templates:"Templates",history:"Campaign History",settings:"Settings"};

  return (
    <ThemeCtx.Provider value={{dark,setDark}}>
      <GS dark={dark}/>
      <div className="app" ref={dbRef} style={{position:'relative'}}>
        <canvas id="spaceCanvas" ref={canvasRef} style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:0,pointerEvents:'none'}}></canvas>
        <div className="flash" ref={flashRef} style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:5,pointerEvents:'none',opacity:0}}></div>
        <aside className="sidebar">
          <div className="logo-wrap">
            <img src="/logo-robot.png" alt="MailFlow" className="logo-mark" style={{cursor:'pointer'}}/>
            <div className="star-el" ref={starRef} style={{position:'fixed',width:0,height:'2px',borderRadius:'999px',background:'linear-gradient(90deg,rgba(255,215,0,0) 0%,rgba(255,215,0,.1) 18%,rgba(255,228,80,.6) 58%,rgba(255,255,200,.95) 84%,#ffffff 100%)',filter:'drop-shadow(0 0 3px #ffd700) drop-shadow(0 0 9px rgba(255,180,0,.7))',pointerEvents:'none',zIndex:50,transformOrigin:'right center',opacity:0}}>
              <div className="star-head"></div>
            </div>
            <div>
              <div className="logo-text">MailFlow</div>
              <div className="logo-sub">Tour DMC Edition</div>
            </div>
          </div>
          <div className="nav-sec">
            <div className="nav-lbl">Menu</div>
            {navItems.map(n=>(
              <button key={n.id} className={`ni ${tab===n.id?"active":""}`} onClick={()=>setTab(n.id)}>
                <Ic p={n.icon} s={15}/>{n.label}
                {n.badge?<span className={`nbadge ${n.badgeClass||""}`}>{n.badge}</span>:null}
              </button>
            ))}
          </div>
          <div className="nav-sec" style={{marginTop:6}}>
            <div className="nav-lbl">Account</div>
            <button className={`ni ${tab==="settings"?"active":""}`} onClick={()=>setTab("settings")}>
              <Ic p={I.zap} s={15}/>Settings
            </button>
          </div>
          {/* Rate limit mini bar */}
          <div style={{padding:"10px 14px",borderTop:"1px solid var(--border)",marginTop:"auto"}}>
            <div className="row" style={{marginBottom:5}}>
              <Ic p={I.gauge} s={11} c="var(--text3)"/>
              <span style={{fontSize:10,color:"var(--text3)",flex:1}}>Hourly limit</span>
              <span style={{fontSize:10,fontWeight:700,color:"var(--text2)"}}>{RATE_LIMIT-rateLimitUsed} left</span>
            </div>
            <div className="pb" style={{height:4}}>
              <div className="pf" style={{width:`${Math.min((rateLimitUsed/RATE_LIMIT)*100,100)}%`,height:4,background:rateLimitUsed/RATE_LIMIT>0.8?"var(--red)":rateLimitUsed/RATE_LIMIT>0.6?"var(--amber)":"var(--green)"}}/>
            </div>
          </div>
          <div className="sidebar-bot">
            {auth?.authenticated?(
              <div className="auth-pill">
                <div className="auth-av">{auth.email[0].toUpperCase()}</div>
                <div className="auth-email">{auth.email}</div>
                <div className="auth-dot" title="Connected"/>
              </div>
            ):(
              <button className="btn btn-g" style={{width:"100%",justifyContent:"center",fontSize:12}} onClick={()=>setTab("settings")}>
                <Ic p={I.mail} s={12}/>Connect Gmail
              </button>
            )}
          </div>
        </aside>

        <div className="main">
          <div className="topbar">
            <div className="tb-title">{titles[tab]}</div>
            <div className="row">
              {tab==="contacts"&&contacts.length>0&&<span className="badge b-green">{contacts.length} contacts</span>}
              <button className="bti" onClick={()=>setDark(d=>!d)}><Ic p={dark?I.sun:I.moon} s={15}/></button>
              {tab!=="compose"&&(
                <button className="btn btn-p" style={{fontSize:12}} onClick={()=>setTab("compose")}>
                  <Ic p={I.compose} s={13}/>New Email
                </button>
              )}
            </div>
          </div>
          <div className="content">
            {tab==="dashboard"  && <Dashboard auth={auth} contacts={contacts} campaigns={campaigns} templates={templates} setTab={setTab} rateLimitUsed={rateLimitUsed} rateLimit={RATE_LIMIT}/>}
            {tab==="compose"    && <Compose key={composeDraft?.id||"compose"} auth={auth} contacts={contacts} toast={toast} setTab={setTab}
                initialSubject={editingTemplate?.subject||composeDraft?.subject||""} initialBody={editingTemplate?.body||composeDraft?.body||""} initialType={editingTemplate?.category||composeDraft?.category||"general"} editingTemplate={editingTemplate}
                onTemplateUpdate={()=>api("/templates").then(setTemplates).catch(()=>{})}
                onSendComplete={r=>{
                  api("/campaigns").then(setCampaigns).catch(()=>{});
                  api(`/rate-limit/status?limit=${RATE_LIMIT}`).then(x=>setRateLimitUsed(x.used||0)).catch(()=>{});
                  setComposeDraft(null);
                  setEditingTemplate(null);
                }}/>}
            {tab==="contacts"   && <Contacts contacts={contacts} setContacts={setContacts} toast={toast}/>}
            {tab==="templates"  && <Templates toast={toast} setTab={setTab} setComposeDraft={setComposeDraft} setEdit={setEdit} templates={templates} setTemplates={setTemplates}/>}
            {tab==="history"    && <History campaigns={campaigns} setCampaigns={setCampaigns} toast={toast}/>}
            {tab==="settings"   && <Settings auth={auth} setAuth={setAuth} toast={toast}/>}
          </div>
        </div>
        <Toasts toasts={toasts} remove={remove}/>
      </div>
    </ThemeCtx.Provider>
  );
}