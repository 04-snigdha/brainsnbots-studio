import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const b64 = {
  enc: (obj) => {
    try { return btoa(unescape(encodeURIComponent(JSON.stringify(obj)))); }
    catch { return ""; }
  },
  dec: (str) => {
    try { return JSON.parse(decodeURIComponent(escape(atob(str)))); }
    catch { return null; }
  }
};

const defaultState = {
  scene: 1,
  accent: "#5AC8FA",
  base: "#0B0C10",
  intensity: 65,
  showUI: true,
  showLogo: true,
  showGuides: false,
  showLowerThird: true,
  lowerThird: { title: "Brains n Bots", subtitle: "Solo Podcast with You" },
  showTicker: false,
  tickerText: "Welcome to Brains n Bots — AI, research, and craft. New episodes weekly.",
  tickerSpeed: 40,
  showTeleprompter: false,
  teleprompterText: "Today on Brains n Bots: 1) Cold open. 2) Headline. 3) Deep dive. 4) Takeaways. 5) Call to action.",
  teleprompterSpeed: 40,
  resolution: { w: 1920, h: 1080 },
};

const useLocalState = (key, initial) => {
  const [state, setState] = useState(() => {
    const fromHash = b64.dec(window.location.hash.replace(/^#/, ""));
    if (fromHash) return { ...initial, ...fromHash };
    const raw = localStorage.getItem(key);
    return raw ? { ...initial, ...JSON.parse(raw) } : initial;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
};

const Logo = ({ accent = "#5AC8FA" }) => (
  <div className="flex items-center gap-2 select-none">
    <svg width="28" height="28" viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <radialGradient id="orb" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="1" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.15" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#orb)" />
      <circle cx="18" cy="20" r="4" fill="#fff" fillOpacity="0.9" />
      <rect x="25" y="28" width="10" height="4" rx="2" fill="#fff" fillOpacity="0.9" />
    </svg>
    <span className="font-semibold tracking-tight text-white/95 text-lg">Brains n Bots</span>
  </div>
);

const SceneBase = ({ children, base, intensity }) => {
  const gradient = `radial-gradient(1200px 800px at 70% 20%, rgba(255,255,255,${intensity/400}), transparent 60%), radial-gradient(800px 600px at 20% 80%, rgba(255,255,255,${intensity/650}), transparent 60%), ${base}`;
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: gradient, backgroundBlendMode: "screen, screen, normal" }}>
      {children}
    </div>
  );
};

const SceneMinimalSpotlight = ({ accent, base, intensity }) => (
  <SceneBase base={`linear-gradient(180deg, ${shade(base, 6)} 0%, ${base} 100%)`} intensity={intensity}>
    <motion.div
      className="absolute -inset-1 blur-3xl opacity-30"
      style={{ background: `radial-gradient(600px 400px at 50% 40%, ${accent}, transparent 60%)` }}
      animate={{ y: [0, -10, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
  </SceneBase>
);

const SceneHorizonGrid = ({ accent, base, intensity }) => (
  <div className="absolute inset-0">
    <div className="absolute inset-0" style={{ background: `linear-gradient(${tint(base, 8)}, ${base})` }} />
    <div className="absolute inset-x-0 bottom-1/2 h-64" style={{ background: `radial-gradient(60% 60% at 50% 100%, ${hexA(accent,0.5)} 0%, transparent 70%)` }} />
    <div className="absolute inset-x-0 bottom-0 h-1/2 [perspective:1000px] [transform-style:preserve-3d]">
      <div className="absolute inset-0 [transform:rotateX(60deg)] opacity-40">
        <div className="w-full h-full" style={{
          backgroundImage: `linear-gradient(to right, ${hexA('#ffffff',0.09)} 1px, transparent 1px), linear-gradient(to top, ${hexA('#ffffff',0.09)} 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
    </div>
    <motion.div className="absolute inset-0" style={{ background: `radial-gradient(40% 40% at 80% 20%, ${hexA(accent,0.25)}, transparent 70%)` }}
      animate={{ opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
  </div>
);

const SceneNeonNoir = ({ accent, base, intensity }) => (
  <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${shade(base, 4)}, ${base})` }}>
    {[...Array(5)].map((_, i) => (
      <motion.div key={i} className="absolute -inset-x-20 h-1/6 blur-2xl opacity-35" style={{ top: `${10 + i*16}%`, background: `linear-gradient(90deg, ${hexA(accent,0)}, ${hexA(accent,0.8)}, ${hexA(accent,0)})` }}
        animate={{ x: ["-10%", "10%", "-10%"] }} transition={{ duration: 12 + i*1.5, repeat: Infinity, ease: "easeInOut" }} />
    ))}
    <motion.div className="absolute inset-0" style={{ background: `radial-gradient(50% 50% at 20% 80%, ${hexA('#ff2d55',0.25)}, transparent 70%)` }}
      animate={{ opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 9, repeat: Infinity }} />
  </div>
);

const SceneSoftOrbs = ({ accent, base, intensity }) => (
  <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${tint(base, 4)}, ${base})` }}>
    {[...Array(6)].map((_, i) => (
      <motion.div key={i} className="absolute rounded-full blur-3xl opacity-40"
        style={{ width: 260, height: 260, left: `${10 + i*14}%`, top: `${i%2===0? 20: 55}%`, background: `radial-gradient(70% 70% at 35% 35%, ${hexA('#ffffff',0.9)}, ${hexA(accent,0.7)} 40%, ${hexA(accent,0.15)} 70%, transparent)` }}
        animate={{ y: [0, i%2===0? -18: 18, 0] }} transition={{ duration: 10 + i, repeat: Infinity, ease: "easeInOut" }} />
    ))}
  </div>
);

const PresenterGuides = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute inset-12 border border-white/25 rounded-2xl" style={{ borderStyle: 'dashed' }} />
    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/15" />
    <div className="absolute top-1/2 left-0 right-0 h-px bg-white/15" />
  </div>
);

const LowerThird = ({ title, subtitle, accent }) => (
  <div className="absolute left-10 bottom-10 text-white/95">
    <div className="backdrop-blur-md bg-white/10 border border-white/15 rounded-2xl px-5 py-3 shadow-xl">
      <div className="text-lg font-semibold tracking-tight">{title}</div>
      {subtitle && <div className="text-sm text-white/80">{subtitle}</div>}
      <div className="h-0.5 mt-3" style={{ background: accent }} />
    </div>
  </div>
);

const Ticker = ({ text, speed = 40 }) => {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => { setW(ref.current?.scrollWidth || 0); }, [text]);
  const duration = Math.max(8, (w + 800) / speed);
  return (
    <div className="absolute left-0 right-0 bottom-0 overflow-hidden h-10 bg-black/40 backdrop-blur-sm border-t border-white/10">
      <motion.div ref={ref} className="whitespace-nowrap text-white/90 text-sm leading-10 px-6"
        animate={{ x: [0, -w - 40] }} transition={{ duration, ease: "linear", repeat: Infinity }}>
        {text}
      </motion.div>
    </div>
  );
};

const Teleprompter = ({ text, speed = 40, onClose }) => {
  const wrapRef = useRef(null);
  const [h, setH] = useState(0);
  useEffect(() => { setH(wrapRef.current?.scrollHeight || 0); }, [text]);
  const duration = Math.max(10, (h + 800) / speed);
  return (
    <div className="absolute inset-0 bg-black/70 text-white z-40">
      <div className="absolute top-4 right-4">
        <button className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15" onClick={onClose}>Close (T)</button>
      </div>
      <div className="absolute inset-0 grid place-items-center">
        <motion.div className="max-w-3xl text-2xl/relaxed tracking-tight px-8" ref={wrapRef}
          animate={{ y: [200, -h] }} transition={{ duration, ease: "linear", repeat: Infinity }}>
          {text.split("\\n").map((ln, i) => (
            <p key={i} className="mb-6 opacity-95">{ln}</p>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default function App() {
  const [s, setS] = useLocalState("bnb-studio", defaultState);

  const updateHash = () => {
    const copy = { ...s };
    delete copy.resolution;
    const encoded = b64.enc(copy);
    if (encoded) window.location.hash = encoded;
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'h' || e.key === 'H') setS(p => ({ ...p, showUI: !p.showUI }));
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
      if (e.key === 'g' || e.key === 'G') setS(p => ({ ...p, showGuides: !p.showGuides }));
      if (e.key === 'l' || e.key === 'L') setS(p => ({ ...p, showLogo: !p.showLogo }));
      if (e.key === 't' || e.key === 'T') setS(p => ({ ...p, showTeleprompter: !p.showTeleprompter }));
      if (e.key === '[') setS(p => ({ ...p, tickerSpeed: clamp(p.tickerSpeed - 5, 10, 200) }));
      if (e.key === ']') setS(p => ({ ...p, tickerSpeed: clamp(p.tickerSpeed + 5, 10, 200) }));
      if (['1','2','3','4'].includes(e.key)) setS(p => ({ ...p, scene: Number(e.key) }));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen().catch(()=>{});
    } else {
      await document.exitFullscreen().catch(()=>{});
    }
  };

  const Scene = useMemo(() => {
    switch (s.scene) {
      case 1: return SceneMinimalSpotlight;
      case 2: return SceneHorizonGrid;
      case 3: return SceneNeonNoir;
      case 4: return SceneSoftOrbs;
      default: return SceneMinimalSpotlight;
    }
  }, [s.scene]);

  return (
    <div className="w-screen h-screen bg-black text-white font-[ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif]">
      <div className="relative w-full h-full overflow-hidden">
        <Scene accent={s.accent} base={s.base} intensity={s.intensity} />

        {s.showLogo && (
          <div className="absolute top-6 left-6">
            <Logo accent={s.accent} />
          </div>
        )}

        {s.showGuides && <PresenterGuides />}

        {s.showLowerThird && (
          <LowerThird title={s.lowerThird.title} subtitle={s.lowerThird.subtitle} accent={s.accent} />
        )}

        {s.showTicker && <Ticker text={s.tickerText} speed={s.tickerSpeed} />}

        <AnimatePresence>
          {s.showTeleprompter && (
            <Teleprompter text={s.teleprompterText} speed={s.teleprompterSpeed} onClose={() => setS(p => ({ ...p, showTeleprompter: false }))} />
          )}
        </AnimatePresence>

        {s.showUI && (
          <div className="absolute inset-x-0 top-0 p-4 md:p-6 flex items-start justify-between gap-3 z-30">
            <div className="backdrop-blur-xl bg-black/30 border border-white/10 rounded-2xl px-4 py-3 shadow-2xl">
              <div className="flex items-center gap-3 mb-2">
                <Logo accent={s.accent} />
                <kbd className="text-xs text-white/70">v1.0</kbd>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[1,2,3,4].map(n => (
                  <button key={n}
                    onClick={() => setS(p=>({ ...p, scene: n }))}
                    className={`px-3 py-2 rounded-xl border text-sm transition ${s.scene===n? 'bg-white/15 border-white/30': 'bg-white/5 hover:bg-white/10 border-white/10'}`}>
                    Scene {n}
                  </button>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Toggle label="Logo" value={s.showLogo} onChange={v=>setS(p=>({ ...p, showLogo:v }))} />
                <Toggle label="Guides" value={s.showGuides} onChange={v=>setS(p=>({ ...p, showGuides:v }))} />
                <Toggle label="Lower Third" value={s.showLowerThird} onChange={v=>setS(p=>({ ...p, showLowerThird:v }))} />
                <Toggle label="Ticker" value={s.showTicker} onChange={v=>setS(p=>({ ...p, showTicker:v }))} />
              </div>
            </div>

            <div className="backdrop-blur-xl bg-black/30 border border-white/10 rounded-2xl p-4 shadow-2xl w-[min(520px,90vw)]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Accent</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <input type="color" className="w-10 h-10 rounded-lg bg-transparent border border-white/20" value={s.accent}
                      onChange={e=>setS(p=>({ ...p, accent: e.target.value }))} />
                    <Swatch hex="#5AC8FA" onPick={hex=>setS(p=>({ ...p, accent: hex }))} />
                    <Swatch hex="#64D2FF" onPick={hex=>setS(p=>({ ...p, accent: hex }))} />
                    <Swatch hex="#0A84FF" onPick={hex=>setS(p=>({ ...p, accent: hex }))} />
                    <Swatch hex="#FF2D55" onPick={hex=>setS(p=>({ ...p, accent: hex }))} />
                  </div>
                </div>
                <div>
                  <Label>Base</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <input type="color" className="w-10 h-10 rounded-lg bg-transparent border border-white/20" value={s.base}
                      onChange={e=>setS(p=>({ ...p, base: e.target.value }))} />
                    <Swatch hex="#0B0C10" onPick={hex=>setS(p=>({ ...p, base: hex }))} />
                    <Swatch hex="#0E1116" onPick={hex=>setS(p=>({ ...p, base: hex }))} />
                    <Swatch hex="#101216" onPick={hex=>setS(p=>({ ...p, base: hex }))} />
                    <Swatch hex="#111318" onPick={hex=>setS(p=>({ ...p, base: hex }))} />
                  </div>
                </div>
                <div className="col-span-2">
                  <Label>Intensity</Label>
                  <Range value={s.intensity} min={0} max={100} step={1} onChange={v=>setS(p=>({ ...p, intensity: v }))} />
                </div>
                <div>
                  <Label>Lower‑third Title</Label>
                  <input className="mt-2 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none"
                    value={s.lowerThird.title}
                    onChange={e=>setS(p=>({ ...p, lowerThird: { ...p.lowerThird, title: e.target.value } }))} />
                </div>
                <div>
                  <Label>Lower‑third Subtitle</Label>
                  <input className="mt-2 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none"
                    value={s.lowerThird.subtitle}
                    onChange={e=>setS(p=>({ ...p, lowerThird: { ...p.lowerThird, subtitle: e.target.value } }))} />
                </div>
                <div className="col-span-2">
                  <Label>Ticker Text</Label>
                  <input className="mt-2 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none"
                    value={s.tickerText}
                    onChange={e=>setS(p=>({ ...p, tickerText: e.target.value }))} />
                </div>
                <div>
                  <Label>Ticker Speed</Label>
                  <Range value={s.tickerSpeed} min={10} max={200} step={5} onChange={v=>setS(p=>({ ...p, tickerSpeed: v }))} />
                </div>
                <div className="col-span-2">
                  <Label>Teleprompter</Label>
                  <textarea className="mt-2 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 outline-none h-24"
                    value={s.teleprompterText}
                    onChange={e=>setS(p=>({ ...p, teleprompterText: e.target.value }))} />
                  <div className="mt-2 flex items-center gap-3">
                    <button className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15" onClick={()=>setS(p=>({ ...p, showTeleprompter: true }))}>Open (T)</button>
                    <div className="flex items-center gap-2">
                      <Label small>Speed</Label>
                      <Range value={s.teleprompterSpeed} min={10} max={200} step={5} onChange={v=>setS(p=>({ ...p, teleprompterSpeed: v }))} />
                    </div>
                  </div>
                </div>
                <div className="col-span-2 flex flex-wrap items-center gap-2 pt-1">
                  <button className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15" onClick={()=>setS(p=>({ ...p, showUI: false }))}>Clean Output (H)</button>
                  <button className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15" onClick={()=>document.documentElement.requestFullscreen().catch(()=>{})}>Fullscreen (F)</button>
                  <button className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15" onClick={updateHash}>Share Scene URL</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      {s.showUI && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white/60 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
          Hotkeys: 1–4 scenes • H UI • F fullscreen • G guides • L logo • T teleprompter • [ ] ticker speed
        </div>
      )}
    </div>
  );
}

function Label({ children, small }) {
  return <div className={`text-white/${small? '70':'90'} text-${small? 'xs':'sm'} tracking-tight`}>{children}</div>;
}

function Toggle({ label, value, onChange }) {
  return (
    <button onClick={()=>onChange(!value)} className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl border transition ${value? 'bg-white/15 border-white/30':'bg-white/5 hover:bg-white/10 border-white/10'}`}>
      <span className="text-sm text-white/90">{label}</span>
      <span className={`inline-block w-9 h-5 rounded-full ${value? 'bg-white/80':'bg-white/25'} relative`}>
        <span className={`absolute top-0.5 ${value? 'left-5':'left-0.5'} w-4 h-4 bg-black/80 rounded-full transition`} />
      </span>
    </button>
  );
}

function Range({ value, min=0, max=100, step=1, onChange }) {
  return (
    <div className="flex items-center gap-3 mt-2">
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e=>onChange(Number(e.target.value))}
        className="w-full accent-white" />
      <span className="text-xs text-white/70 w-10 text-right">{value}</span>
    </div>
  );
}

function Swatch({ hex, onPick }) {
  return (
    <button onClick={()=>onPick(hex)} className="w-8 h-8 rounded-lg border border-white/20" style={{ background: hex }} title={hex} />
  );
}

function hexToRgb(hex) {
  const res = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
  return res ? { r: parseInt(res[1], 16), g: parseInt(res[2], 16), b: parseInt(res[3], 16) } : { r:0,g:0,b:0 };
}
function rgbToHex({ r, g, b }) {
  const toHex = (n)=> n.toString(16).padStart(2,'0');
  return `#${toHex(clamp(Math.round(r),0,255))}${toHex(clamp(Math.round(g),0,255))}${toHex(clamp(Math.round(b),0,255))}`;
}
function mix(hex1, hex2, p) {
  const a = hexToRgb(hex1), b = hexToRgb(hex2);
  return rgbToHex({ r: a.r + (b.r-a.r)*p, g: a.g + (b.g-a.g)*p, b: a.b + (b.b-a.b)*p });
}
function tint(hex, amt=10){ return mix(hex, '#ffffff', amt/100); }
function shade(hex, amt=10){ return mix(hex, '#000000', amt/100); }
function hexA(hex, a){ const {r,g,b} = hexToRgb(hex); return `rgba(${r},${g},${b},${a})`; }
