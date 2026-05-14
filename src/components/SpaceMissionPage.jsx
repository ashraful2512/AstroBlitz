import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Play, Pause, RotateCw, Activity, Gauge, Settings, AlertTriangle, TrendingUp } from "lucide-react";
 
// ─── Mission Data ───────────────────────────────────────────────────────────
const MISSIONS = [
  {
    id: "artemis",
    name: "Artemis III",
    subtitle: "Return to Moon",
    agency: "NASA",
    launchDate: "2026-09-15",
    destination: "Lunar South Pole",
    rocket: "SLS Block 1B",
    crew: ["Reid Wiseman", "Victor Glover", "Christina Koch", "Jeremy Hansen"],
    status: "upcoming",
    color: "#00d4ff",
    accentColor: "#0099bb",
    stages: [
      { id: "ignition",   label: "Engine Ignition",     duration: 4000,  icon: "🔥", desc: "RS-25 engines throttle up to 109% thrust, generating 8.8M lbf" },
      { id: "liftoff",    label: "Liftoff",              duration: 5000,  icon: "🚀", desc: "SLS clears the launch tower at T+0:07, heading toward orbit" },
      { id: "maxq",       label: "Max-Q",                duration: 4000,  icon: "⚡", desc: "Maximum aerodynamic pressure at T+1:22 — vehicle stress at peak" },
      { id: "staging",    label: "SRB Separation",       duration: 4000,  icon: "💥", desc: "Solid rocket boosters jettisoned at T+2:12, 45km altitude" },
      { id: "orbit",      label: "Earth Orbit",          duration: 5000,  icon: "🌍", desc: "Upper stage burns deliver Orion + ICPS to 1800 km parking orbit" },
      { id: "tli",        label: "Trans-Lunar Injection", duration: 5000,  icon: "🌑", desc: "ICPS ignites for 18 min burn — Orion slings toward Moon" },
      { id: "cruise",     label: "Lunar Transit",        duration: 4000,  icon: "✨", desc: "3-day 384,000 km journey through cislunar space" },
      { id: "landing",    label: "Lunar Landing",        duration: 5000,  icon: "🌙", desc: "Starship HLS touches down on Shackleton Crater rim" },
    ],
  },
  {
    id: "europa",
    name: "Europa Clipper",
    subtitle: "Ocean World Survey",
    agency: "NASA / JPL",
    launchDate: "2024-10-14",
    destination: "Jupiter's Europa",
    rocket: "Falcon Heavy",
    crew: [],
    status: "active",
    color: "#7c3aed",
    accentColor: "#5b21b6",
    stages: [
      { id: "ignition",   label: "Engine Ignition",      duration: 4000,  icon: "🔥", desc: "Falcon Heavy's 27 Merlin engines ignite — 5.1M lbf thrust" },
      { id: "liftoff",    label: "Liftoff",               duration: 5000,  icon: "🚀", desc: "Clipper lifts off from LC-39A into Florida morning sky" },
      { id: "maxq",       label: "Max Dynamic Pressure",  duration: 3500,  icon: "⚡", desc: "Vehicle punches through sound barrier at Mach 1.2" },
      { id: "staging",    label: "Booster Separation",    duration: 4000,  icon: "💥", desc: "Side cores separate and execute simultaneous landing burns" },
      { id: "orbit",      label: "Parking Orbit",         duration: 5000,  icon: "🌍", desc: "Second stage delivers Clipper to 185 km x 185 km orbit" },
      { id: "tli",        label: "Interplanetary Injection", duration: 5000,  icon: "☀️", desc: "Upper stage boosts Clipper to escape velocity — goodbye Earth" },
      { id: "cruise",     label: "Deep Space Transit",    duration: 4000,  icon: "✨", desc: "5.5-year, 2.6 billion km journey using Venus/Earth gravity assists" },
      { id: "landing",    label: "Jupiter Orbit Insertion", duration: 5000,  icon: "🪐", desc: "6-hour engine burn slows Clipper into Jupiter's gravitational embrace" },
    ],
  },
  {
    id: "tianwen",
    name: "Tianwen-3",
    subtitle: "Mars Sample Return",
    agency: "CNSA",
    launchDate: "2028-11-00",
    destination: "Mars",
    rocket: "Long March 5",
    crew: [],
    status: "planned",
    color: "#ef4444",
    accentColor: "#b91c1c",
    stages: [
      { id: "ignition",   label: "Engine Ignition",       duration: 4000,  icon: "🔥", desc: "YF-77 hydrogen engines ignite at T-3s, rumbling the launch pad" },
      { id: "liftoff",    label: "Liftoff",                duration: 5000,  icon: "🚀", desc: "Long March 5 rises majestically from Wenchang Space Launch Site" },
      { id: "maxq",       label: "Max-Q",                  duration: 3500,  icon: "⚡", desc: "Aerodynamic shroud protects the lander during peak pressure" },
      { id: "staging",    label: "Core Stage Separation",  duration: 4000,  icon: "💥", desc: "Liquid strap-on boosters release at 180 km altitude" },
      { id: "orbit",      label: "Earth Departure",        duration: 5000,  icon: "🌍", desc: "Upper stage burns propel spacecraft beyond Earth's influence" },
      { id: "tli",        label: "Mars Transfer Orbit",    duration: 5000,  icon: "🔴", desc: "Hohmann transfer injection — 7 month journey to Red Planet begins" },
      { id: "cruise",     label: "Interplanetary Cruise",  duration: 4000,  icon: "✨", desc: "Mid-course corrections fine-tune trajectory to Utopia Planitia" },
      { id: "landing",    label: "Mars EDL",               duration: 5000,  icon: "🔴", desc: "Entry, Descent & Landing — 7 minutes of terror at 20,000 km/h" },
    ],
  },
  {
    id: "starship",
    name: "Starship Mission 7",
    subtitle: "Orbital Test Flight",
    agency: "SpaceX",
    launchDate: "2025-01-16",
    destination: "Low Earth Orbit",
    rocket: "Starship / Super Heavy",
    crew: [],
    status: "completed",
    color: "#f59e0b",
    accentColor: "#b45309",
    stages: [
      { id: "ignition",   label: "Full Thrust Ignition",  duration: 4000,  icon: "🔥", desc: "33 Raptor engines ignite — 16.7M lbf, most powerful rocket ever" },
      { id: "liftoff",    label: "Liftoff",                duration: 5000,  icon: "🚀", desc: "Stack clears the Starbase Mechazilla tower as booster catches await" },
      { id: "maxq",       label: "Max Dynamic Pressure",   duration: 3500,  icon: "⚡", desc: "Starship punches through atmosphere — fuel slosh management active" },
      { id: "staging",    label: "Hot Staging",            duration: 4000,  icon: "💥", desc: "Ship ignites while still attached — Super Heavy begins boostback" },
      { id: "orbit",      label: "Booster Catch",          duration: 5000,  icon: "🦾", desc: "Mechazilla chopsticks catch 71m Super Heavy booster mid-air" },
      { id: "tli",        label: "Ship Engine Cut-Off",    duration: 5000,  icon: "🌍", desc: "Ship coasts to 235 km apogee — orbital insertion confirmed" },
      { id: "cruise",     label: "On-Orbit Operations",    duration: 4000,  icon: "✨", desc: "Payload bay opens, Starlink satellites deployed in rapid succession" },
      { id: "landing",    label: "Ship Splashdown",        duration: 5000,  icon: "🌊", desc: "Ship re-enters at 27,000 km/h, Pez dispenser tiles hold — splashdown!" },
    ],
  },
];
 
// ─── Particle System ─────────────────────────────────────────────────────────
function Particles({ color, stage }) {
  const particles = Array.from({ length: 28 }, (_, i) => i);
  const isExhaust = ["ignition", "liftoff", "maxq"].includes(stage);
  const isExplosion = stage === "staging";
  const isCruise = stage === "cruise";
 
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((i) => {
        const angle = (i / particles.length) * 360;
        const distance = isExplosion ? 120 + Math.random() * 80 : isExhaust ? 40 + Math.random() * 60 : 60 + Math.random() * 100;
        const size = isCruise ? 1 + Math.random() * 2 : 2 + Math.random() * 5;
        const duration = 1.2 + Math.random() * 1.5;
        const delay = Math.random() * 0.8;
        const tx = isExhaust ? (Math.random() - 0.5) * 60 : Math.cos((angle * Math.PI) / 180) * distance;
        const ty = isExhaust ? 40 + Math.random() * 100 : Math.sin((angle * Math.PI) / 180) * distance;
 
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              background: isExhaust
                ? `hsl(${30 + Math.random() * 40}, 100%, ${50 + Math.random() * 30}%)` 
                : isCruise
                ? `rgba(255,255,255,${0.3 + Math.random() * 0.7})` 
                : color,
              left: "50%",
              top: "50%",
              boxShadow: isCruise ? "none" : `0 0 ${size * 3}px ${color}`,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: tx, y: ty, opacity: 0, scale: 0 }}
            transition={{ duration, delay, ease: "easeOut", repeat: Infinity, repeatDelay: 0.3 }}
          />
        );
      })}
    </div>
  );
}
 
// ─── Stage Visualizer (Canvas-based animation) ────────────────────────────────
function StageScene({ stage, color, missionId }) {
  const scenes = {
    ignition: <IgnitionScene color={color} />,
    liftoff: <LiftoffScene color={color} />,
    maxq: <MaxQScene color={color} />,
    staging: <StagingScene color={color} />,
    orbit: <OrbitScene color={color} />,
    tli: <TLIScene color={color} />,
    cruise: <CruiseScene color={color} />,
    landing: <LandingScene color={color} missionId={missionId} />,
  };
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          {scenes[stage] || <div className="text-white text-4xl">🚀</div>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
 
// ── Individual Stage Scenes ──────────────────────────────────────────────────
function IgnitionScene({ color }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Rocket on pad */}
      <motion.div className="relative flex flex-col items-center"
        animate={{ y: [0, -3, 0] }} transition={{ duration: 0.3, repeat: Infinity }}>
        {/* Rocket body */}
        <div className="relative">
          <div className="w-10 h-32 rounded-t-full mx-auto" style={{ background: `linear-gradient(180deg, #e5e7eb 0%, #9ca3af 100%)` }} />
          <div className="w-16 h-3 rounded mx-auto" style={{ background: "#6b7280" }} />
          <div className="w-20 h-10 mx-auto" style={{ background: "#4b5563" }} />
        </div>
        {/* Exhaust flames */}
        <div className="flex gap-1 mt-0.5">
          {[...Array(5)].map((_, i) => (
            <motion.div key={i} className="rounded-b-full"
              style={{ width: 8, height: 20 + Math.random() * 20, background: `linear-gradient(180deg, ${color}, #ff6b00, #ffcc00)` }}
              animate={{ scaleY: [1, 1.4, 0.7, 1.2, 1], opacity: [1, 0.9, 1] }}
              transition={{ duration: 0.15 + i * 0.03, repeat: Infinity }} />
          ))}
        </div>
      </motion.div>
      {/* Launch pad */}
      <div className="w-40 h-3 rounded" style={{ background: "#374151" }} />
      {/* Ground steam */}
      <div className="flex gap-3 -mt-2">
        {[...Array(6)].map((_, i) => (
          <motion.div key={i} className="rounded-full"
            style={{ width: 6 + i * 2, height: 6 + i * 2, background: "rgba(255,255,255,0.15)", filter: "blur(4px)" }}
            animate={{ y: [-10, -30], opacity: [0.6, 0], scale: [1, 2] }}
            transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity }} />
        ))}
      </div>
    </div>
  );
}
 
function LiftoffScene({ color }) {
  return (
    <div className="relative flex flex-col items-center w-full h-full justify-end pb-6" style={{ minHeight: 260 }}>
      {/* Sky gradient */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e3a5f 60%, #7c3aed22 100%)" }} />
      {/* Moving clouds */}
      {[...Array(3)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ width: 60 + i * 30, height: 18, background: "rgba(255,255,255,0.06)", filter: "blur(8px)", top: 40 + i * 30, left: `${10 + i * 20}%` }}
          animate={{ x: [-20, 20, -20] }} transition={{ duration: 4 + i, repeat: Infinity }} />
      ))}
      {/* Rocket ascending */}
      <motion.div className="relative z-10 flex flex-col items-center"
        animate={{ y: [-20, -80] }} transition={{ duration: 3, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}>
        <div className="w-8 h-28 rounded-t-full" style={{ background: `linear-gradient(180deg, #e5e7eb 0%, ${color}55 100%)` }} />
        <div className="w-14 h-2 rounded" style={{ background: "#6b7280" }} />
        <div className="flex gap-0.5">
          {[...Array(4)].map((_, i) => (
            <motion.div key={i} className="rounded-b-full"
              style={{ width: 7, height: 24, background: `linear-gradient(180deg, ${color}cc, #ff6b00, #ffee00)` }}
              animate={{ scaleY: [1, 1.5, 0.8, 1] }} transition={{ duration: 0.12, repeat: Infinity, delay: i * 0.04 }} />
          ))}
        </div>
      </motion.div>
      {/* Smoke trail */}
      {[...Array(8)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ width: 16 + i * 8, height: 16 + i * 8, background: "rgba(180,180,180,0.1)", filter: "blur(6px)", bottom: 40 + i * 10, left: "48%" }}
          animate={{ opacity: [0.6, 0] }} transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity }} />
      ))}
    </div>
  );
}
 
function MaxQScene({ color }) {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full" style={{ minHeight: 260 }}>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #000 0%, #0f172a 100%)" }} />
      {/* Shockwave rings */}
      {[...Array(4)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full border"
          style={{ borderColor: `${color}55`, width: 60 + i * 50, height: 60 + i * 50 }}
          animate={{ scale: [0.8, 1.4], opacity: [0.8, 0] }}
          transition={{ duration: 1.2, delay: i * 0.3, repeat: Infinity }} />
      ))}
      {/* Rocket */}
      <motion.div className="relative z-10 flex flex-col items-center"
        animate={{ scale: [1, 1.02, 1], rotate: [0, 0.5, -0.5, 0] }} transition={{ duration: 0.2, repeat: Infinity }}>
        <div className="w-7 h-24 rounded-t-full" style={{ background: `linear-gradient(180deg, #e5e7eb 0%, ${color}77 100%)` }} />
        <div className="w-12 h-2 rounded" style={{ background: "#6b7280" }} />
        <div className="flex gap-0.5">
          {[...Array(3)].map((_, i) => (
            <motion.div key={i} className="rounded-b-full"
              style={{ width: 6, height: 20, background: `linear-gradient(180deg, ${color}, #ff4400)` }}
              animate={{ scaleY: [1, 2, 0.6, 1.3, 1] }} transition={{ duration: 0.1, repeat: Infinity }} />
          ))}
        </div>
      </motion.div>
      {/* MAX-Q label */}
      <motion.div className="absolute top-4 text-center"
        animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>
        <div className="text-xs font-mono font-bold tracking-widest" style={{ color }}>MAX-Q</div>
        <div className="text-xs text-gray-400 font-mono">PEAK STRESS</div>
      </motion.div>
    </div>
  );
}
 
function StagingScene({ color }) {
  return (
    <div className="relative flex items-center justify-center w-full h-full" style={{ minHeight: 260 }}>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #000 60%, #1a0a2e 100%)" }} />
      {/* Explosion burst */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * 360;
        const len = 30 + Math.random() * 40;
        return (
          <motion.div key={i} className="absolute h-1 rounded origin-left"
            style={{ width: len, background: `linear-gradient(90deg, #ffcc00, ${color}, transparent)`, left: "50%", top: "50%", rotate: angle }}
            animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 0.6, delay: Math.random() * 0.3, repeat: Infinity, repeatDelay: 1 }} />
        );
      })}
      {/* Upper stage continuing */}
      <motion.div className="absolute flex flex-col items-center"
        animate={{ y: [-20, -80] }} transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
        style={{ top: "10%" }}>
        <div className="w-6 h-16 rounded-t-full" style={{ background: `linear-gradient(180deg, #e5e7eb 0%, ${color}77 100%)` }} />
        <div className="flex gap-0.5">
          {[...Array(3)].map((_, i) => (
            <motion.div key={i} className="rounded-b-full"
              style={{ width: 5, height: 16, background: `linear-gradient(180deg, ${color}, #ff4400)` }}
              animate={{ scaleY: [1, 1.8, 0.7, 1] }} transition={{ duration: 0.1, repeat: Infinity }} />
          ))}
        </div>
      </motion.div>
      {/* Falling boosters */}
      {[-1, 1].map((dir) => (
        <motion.div key={dir} className="absolute flex flex-col items-center"
          animate={{ x: dir * 60, y: 80, rotate: dir * 45, opacity: [1, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
          style={{ top: "35%" }}>
          <div className="w-5 h-14 rounded-t-full" style={{ background: "#6b7280" }} />
        </motion.div>
      ))}
    </div>
  );
}
 
function OrbitScene({ color }) {
  return (
    <div className="relative flex items-center justify-center w-full h-full" style={{ minHeight: 260 }}>
      <div className="absolute inset-0" style={{ background: "#000" }} />
      {/* Stars */}
      {[...Array(30)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white"
          style={{ width: 1 + Math.random() * 2, height: 1 + Math.random() * 2, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.4 + Math.random() * 0.6 }}
          animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5 + Math.random() * 2, repeat: Infinity }} />
      ))}
      {/* Earth */}
      <motion.div className="relative" style={{ width: 80, height: 80 }}
        animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
        <div className="w-full h-full rounded-full" style={{ background: "radial-gradient(circle at 35% 35%, #1d4ed8, #065f46, #1d4ed8)" }} />
        <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 60% 40%, transparent 50%, rgba(255,255,255,0.1) 100%)" }} />
      </motion.div>
      {/* Orbit path */}
      <div className="absolute rounded-full border border-dashed"
        style={{ width: 180, height: 180, borderColor: `${color}33` }} />
      {/* Spacecraft in orbit */}
      <motion.div className="absolute"
        animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ width: 180, height: 180, top: "50%", left: "50%", marginTop: -90, marginLeft: -90 }}>
        <div className="absolute text-lg" style={{ top: 0, left: "50%", marginLeft: -10 }}>🛸</div>
      </motion.div>
    </div>
  );
}
 
function TLIScene({ color }) {
  return (
    <div className="relative flex items-center justify-center w-full h-full" style={{ minHeight: 260 }}>
      <div className="absolute inset-0" style={{ background: "#000" }} />
      {/* Star field */}
      {[...Array(40)].map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{ width: Math.random() > 0.9 ? 2 : 1, height: Math.random() > 0.9 ? 2 : 1, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.3 + Math.random() * 0.7 }} />
      ))}
      {/* Earth receding */}
      <motion.div className="absolute" animate={{ scale: [0.5, 0.3], x: [-60, -90], opacity: [1, 0.4] }} transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}>
        <div className="w-14 h-14 rounded-full" style={{ background: "radial-gradient(circle at 35% 35%, #1d4ed8, #065f46)" }} />
      </motion.div>
      {/* Spacecraft with burn */}
      <motion.div className="absolute flex flex-col items-center"
        animate={{ x: [0, 80] }} transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}>
        <div className="w-5 h-12 rounded-t-full" style={{ background: `linear-gradient(180deg, #e5e7eb 0%, ${color}77 100%)`, transform: "rotate(90deg)" }} />
        <motion.div className="w-2 h-8 rounded-b-full -mt-1"
          style={{ background: `linear-gradient(180deg, ${color}, #ff6600, transparent)` }}
          animate={{ scaleY: [1, 1.5, 0.8, 1] }} transition={{ duration: 0.15, repeat: Infinity }} />
      </motion.div>
      {/* Speed lines */}
      {[...Array(6)].map((_, i) => (
        <motion.div key={i} className="absolute h-px"
          style={{ width: 30 + Math.random() * 40, background: `linear-gradient(90deg, transparent, ${color}55, transparent)`, left: "30%", top: `${30 + i * 8}%` }}
          animate={{ x: [-50, 50], opacity: [0, 1, 0] }} transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }} />
      ))}
    </div>
  );
}
 
function CruiseScene({ color }) {
  return (
    <div className="relative flex items-center justify-center w-full h-full" style={{ minHeight: 260 }}>
      <div className="absolute inset-0" style={{ background: "#000" }} />
      {/* Deep space nebula */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 70% 30%, ${color}11 0%, transparent 60%)` }} />
      {/* Stars with parallax */}
      {[...Array(50)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white"
          style={{ width: Math.random() > 0.95 ? 3 : 1, height: Math.random() > 0.95 ? 3 : 1, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ x: [0, -3 * (Math.random() + 0.5)], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, repeatType: "reverse" }} />
      ))}
      {/* Spacecraft */}
      <motion.div className="relative z-10 text-4xl"
        animate={{ y: [0, -8, 0], rotate: [0, 1, -1, 0] }} transition={{ duration: 4, repeat: Infinity }}>
        🛸
      </motion.div>
      {/* Solar panels glow */}
      <motion.div className="absolute"
        style={{ width: 120, height: 4, background: `linear-gradient(90deg, transparent, ${color}44, transparent)` }}
        animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
      {/* Distant target */}
      <motion.div className="absolute right-6 text-2xl"
        animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }}>
        🪐
      </motion.div>
    </div>
  );
}
 
function LandingScene({ color, missionId }) {
  const isOcean = missionId === "starship";
  const isMoon = missionId === "artemis";
  const isMars = missionId === "tianwen";
 
  return (
    <div className="relative flex flex-col items-end justify-end w-full h-full overflow-hidden" style={{ minHeight: 260 }}>
      {/* Background */}
      <div className="absolute inset-0" style={{
        background: isMoon
          ? "linear-gradient(180deg, #000 0%, #1a1a2e 70%, #2d2d44 100%)"
          : isMars
          ? "linear-gradient(180deg, #1a0800 0%, #4a1500 60%, #7c2d00 100%)"
          : isOcean
          ? "linear-gradient(180deg, #0f172a 0%, #1e3a5f 60%, #1e40af 100%)"
          : "linear-gradient(180deg, #000 0%, #0f172a 60%, #1d4ed8 100%)"
      }} />
 
      {/* Surface */}
      {isMoon && <div className="absolute bottom-0 w-full h-16" style={{ background: "radial-gradient(ellipse at 50% 100%, #4b5563, #374151)" }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="absolute rounded-full border border-gray-600"
            style={{ width: 20 + i * 10, height: 8 + i * 4, bottom: i * 3, left: `${10 + i * 15}%`, background: "#374151" }} />
        ))}
      </div>}
      {isMars && <div className="absolute bottom-0 w-full h-16" style={{ background: "linear-gradient(180deg, #92400e, #78350f)" }}>
        <div className="absolute bottom-10 left-1/4 w-32 h-6 rounded-full" style={{ background: "#92400e", opacity: 0.5 }} />
      </div>}
      {isOcean && <div className="absolute bottom-0 w-full h-20 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div key={i} className="absolute w-full h-8 rounded-full"
            style={{ background: `rgba(30,64,175,${0.4 + i * 0.15})`, bottom: i * 4 }}
            animate={{ x: [0, 20, 0, -20, 0] }} transition={{ duration: 2 + i * 0.5, repeat: Infinity }} />
        ))}
      </div>}
      {!isMoon && !isMars && !isOcean && <div className="absolute bottom-0 w-full h-12" style={{ background: "#1d4ed8" }} />}
 
      {/* Descent plume */}
      <motion.div className="absolute flex flex-col items-center"
        style={{ left: "50%", marginLeft: -20, bottom: isMoon ? 64 : isMars ? 64 : isOcean ? 72 : 48 }}
        animate={{ y: [0, 60], opacity: [1, 0] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 0.5 }}>
        <div className="w-10 h-16 rounded-t-full" style={{ background: `linear-gradient(180deg, #e5e7eb 0%, ${color}55 100%)` }} />
        <div className="w-14 h-2 rounded" style={{ background: "#6b7280" }} />
        <div className="flex gap-0.5">
          {[...Array(3)].map((_, i) => (
            <motion.div key={i} className="rounded-b-full"
              style={{ width: 5, height: 12, background: `linear-gradient(180deg, ${color}, #ff4400)` }}
              animate={{ scaleY: [1, 1.6, 0.8, 1] }} transition={{ duration: 0.15, repeat: Infinity }} />
          ))}
        </div>
      </motion.div>
 
      {/* Dust/splash plume at bottom */}
      {[...Array(6)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{
            width: 20 + i * 10, height: 20 + i * 10,
            background: isMars ? "rgba(180,80,20,0.2)" : isOcean ? "rgba(30,64,175,0.25)" : "rgba(200,200,200,0.15)",
            filter: "blur(6px)",
            bottom: isMoon ? 58 : isMars ? 58 : isOcean ? 65 : 42,
            left: `${35 + i * 3}%` 
          }}
          animate={{ scale: [0, 2], opacity: [0.6, 0] }} transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity, repeatDelay: 2 }} />
      ))}
    </div>
  );
}
 
// ─── Mission Simulation Modal ─────────────────────────────────────────────────
function SimulationModal({ mission, onClose }) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);
  const stage = mission.stages[currentStageIdx];
  const totalStages = mission.stages.length;
  const progress = ((currentStageIdx) / (totalStages - 1)) * 100;
 
  useEffect(() => {
    if (!isPlaying) { clearInterval(intervalRef.current); return; }
    let t = 0;
    intervalRef.current = setInterval(() => {
      t += 100;
      setElapsed(t);
      if (t >= stage.duration) {
        clearInterval(intervalRef.current);
        setElapsed(0);
        if (currentStageIdx < totalStages - 1) {
          setCurrentStageIdx((i) => i + 1);
        } else {
          setIsPlaying(false);
        }
      }
    }, 100);
    return () => clearInterval(intervalRef.current);
  }, [currentStageIdx, isPlaying]);
 
  const stageProgress = Math.min((elapsed / stage.duration) * 100, 100);
 
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
 
      <motion.div className="relative w-full max-w-3xl rounded-2xl overflow-hidden border"
        style={{ background: "#0a0a14", borderColor: `${mission.color}44`, boxShadow: `0 0 60px ${mission.color}22, 0 0 120px ${mission.color}11` }}
        initial={{ scale: 0.85, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
 
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: `${mission.color}22` }}>
          <div>
            <div className="text-xs font-mono tracking-widest mb-1" style={{ color: mission.color }}>
              MISSION SIMULATION — {mission.agency}
            </div>
            <div className="text-lg font-bold text-white font-mono">{mission.name}</div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl transition-colors">×</button>
        </div>
 
        {/* Stage scene */}
        <div className="relative" style={{ height: 260, background: "#000" }}>
          <StageScene stage={stage.id} color={mission.color} missionId={mission.id} />
          <Particles color={mission.color} stage={stage.id} />
          {/* Stage label overlay */}
          <div className="absolute top-4 right-4 text-right">
            <motion.div className="text-3xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              {stage.icon}
            </motion.div>
          </div>
        </div>
 
        {/* Stage info */}
        <div className="px-6 py-4 border-b" style={{ borderColor: `${mission.color}22` }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{stage.icon}</div>
              <div>
                <div className="text-white font-bold font-mono text-sm">{stage.label}</div>
                <div className="text-gray-400 text-xs mt-0.5">{stage.desc}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono" style={{ color: mission.color }}>STAGE {currentStageIdx + 1}/{totalStages}</div>
            </div>
          </div>
          {/* Stage progress bar */}
          <div className="w-full h-1 rounded-full bg-gray-800 overflow-hidden mt-3">
            <motion.div className="h-full rounded-full" style={{ background: mission.color, width: `${stageProgress}%` }} transition={{ duration: 0.1 }} />
          </div>
        </div>
 
        {/* Timeline strip */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
            {mission.stages.map((s, i) => (
              <button key={s.id}
                onClick={() => { setCurrentStageIdx(i); setElapsed(0); setIsPlaying(true); }}
                className="flex-shrink-0 flex flex-col items-center gap-1 group">
                <motion.div className="w-9 h-9 rounded-lg flex items-center justify-center text-base border transition-all"
                  style={{
                    borderColor: i === currentStageIdx ? mission.color : i < currentStageIdx ? `${mission.color}55` : "#1f2937",
                    background: i === currentStageIdx ? `${mission.color}22` : i < currentStageIdx ? `${mission.color}11` : "#111",
                  }}
                  animate={i === currentStageIdx ? { boxShadow: [`0 0 0px ${mission.color}`, `0 0 12px ${mission.color}`, `0 0 0px ${mission.color}`] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}>
                  {i < currentStageIdx ? "✓" : s.icon}
                </motion.div>
                <div className="text-xs font-mono text-center leading-tight max-w-12 truncate" style={{ color: i === currentStageIdx ? mission.color : "#6b7280", fontSize: 9 }}>
                  {s.label.split(" ")[0]}
                </div>
              </button>
            ))}
          </div>
 
          {/* Overall progress */}
          <div className="mt-3">
            <div className="flex justify-between text-xs font-mono text-gray-500 mb-1">
              <span>MISSION PROGRESS</span>
              <span style={{ color: mission.color }}>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${mission.accentColor}, ${mission.color})` }}
                animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
            </div>
          </div>
 
          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button onClick={() => { if (currentStageIdx > 0) { setCurrentStageIdx(c => c - 1); setElapsed(0); setIsPlaying(true); } }}
              disabled={currentStageIdx === 0}
              className="px-4 py-1.5 rounded-lg font-mono text-xs border transition-all disabled:opacity-30"
              style={{ borderColor: `${mission.color}44`, color: mission.color }}>◀ PREV</button>
 
            <button onClick={() => setIsPlaying(p => !p)}
              className="px-6 py-1.5 rounded-lg font-mono text-xs border transition-all"
              style={{ borderColor: mission.color, background: `${mission.color}22`, color: mission.color }}>
              {isPlaying ? "⏸ PAUSE" : "▶ PLAY"}
            </button>
 
            <button onClick={() => { if (currentStageIdx < totalStages - 1) { setCurrentStageIdx(c => c + 1); setElapsed(0); setIsPlaying(true); } }}
              disabled={currentStageIdx === totalStages - 1}
              className="px-4 py-1.5 rounded-lg font-mono text-xs border transition-all disabled:opacity-30"
              style={{ borderColor: `${mission.color}44`, color: mission.color }}>NEXT ▶</button>
          </div>
 
          {currentStageIdx === totalStages - 1 && !isPlaying && (
            <motion.div className="mt-3 text-center text-xs font-mono font-bold tracking-widest"
              style={{ color: mission.color }} animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              ✦ MISSION COMPLETE ✦
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
 
// ─── Mission Card ─────────────────────────────────────────────────────────────
function MissionCard({ mission, onSimulate }) {
  const statusConfig = {
    completed: { label: "COMPLETED", bg: "rgba(16,185,129,0.12)", border: "#10b981", text: "#10b981" },
    active:    { label: "ACTIVE",    bg: "rgba(59,130,246,0.12)", border: "#3b82f6", text: "#3b82f6" },
    upcoming:  { label: "UPCOMING",  bg: "rgba(245,158,11,0.12)", border: "#f59e0b", text: "#f59e0b" },
    planned:   { label: "PLANNED",   bg: "rgba(139,92,246,0.12)", border: "#8b5cf6", text: "#8b5cf6" },
  };
  const sc = statusConfig[mission.status];
 
  return (
    <motion.div
      className="relative rounded-xl border overflow-hidden cursor-pointer group"
      style={{ background: "#0a0a14", borderColor: `${mission.color}33` }}
      whileHover={{ y: -3, boxShadow: `0 8px 40px ${mission.color}22` }}
      transition={{ duration: 0.2 }}>
 
      {/* Top accent */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${mission.color}, transparent)` }} />
 
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-xs font-mono tracking-widest mb-1" style={{ color: mission.color }}>{mission.agency}</div>
            <div className="text-white font-bold text-lg font-mono leading-tight">{mission.name}</div>
            <div className="text-gray-400 text-xs mt-0.5">{mission.subtitle}</div>
          </div>
          <div className="px-2 py-0.5 rounded text-xs font-mono font-bold" style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>
            {sc.label}
          </div>
        </div>
 
        {/* Details */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: "DESTINATION", value: mission.destination },
            { label: "ROCKET", value: mission.rocket },
            { label: "LAUNCH DATE", value: mission.launchDate },
            { label: "CREW", value: mission.crew.length > 0 ? `${mission.crew.length} astronauts` : "Uncrewed" },
          ].map((d) => (
            <div key={d.label} className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-gray-500 text-xs font-mono mb-0.5">{d.label}</div>
              <div className="text-gray-200 text-xs font-semibold truncate">{d.value}</div>
            </div>
          ))}
        </div>
 
        {/* Stage mini-timeline */}
        <div className="flex gap-1 mb-4">
          {mission.stages.map((s, i) => (
            <div key={s.id} className="flex-1 h-1 rounded-full" title={s.label}
              style={{ background: `${mission.color}${i < 3 ? "88" : i < 6 ? "44" : "22"}` }} />
          ))}
        </div>
 
        {/* Simulate button */}
        <button
          onClick={() => onSimulate(mission)}
          className="w-full py-2.5 rounded-lg font-mono text-sm font-bold tracking-widest border transition-all hover:scale-[1.02]"
          style={{
            background: `${mission.color}18`,
            borderColor: `${mission.color}66`,
            color: mission.color,
            boxShadow: `0 0 20px ${mission.color}11`,
          }}>
          ▶ LAUNCH SIMULATION
        </button>
      </div>
    </motion.div>
  );
}
 
// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function SpaceMissionPage() {
  const [simMission, setSimMission] = useState(null);
 
  return (
    <div className="relative min-h-screen text-white p-6" style={{ background: "#050510" }}>
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {[...Array(60)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full bg-white"
            style={{ width: Math.random() > 0.95 ? 3 : 1, height: Math.random() > 0.95 ? 3 : 1, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.2 + Math.random() * 0.6 }}
            animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 2 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }} />
        ))}
      </div>
 
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Page header */}
        <div className="mb-8 text-center">
          <motion.div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-4 text-xs font-mono tracking-widest"
            style={{ borderColor: "#7c3aed44", background: "#7c3aed11", color: "#a78bfa" }}
            animate={{ boxShadow: ["0 0 0px #7c3aed", "0 0 20px #7c3aed44", "0 0 0px #7c3aed"] }}
            transition={{ duration: 3, repeat: Infinity }}>
            🚀 MISSION CONTROL
          </motion.div>
          <h1 className="text-4xl font-black font-mono tracking-tight text-white mb-2">SPACE MISSIONS</h1>
          <p className="text-gray-400 text-sm font-mono">Select any mission to launch a real-time visual simulation</p>
        </div>
 
        {/* Mission grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MISSIONS.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <MissionCard mission={m} onSimulate={setSimMission} />
            </motion.div>
          ))}
        </div>
      </div>
 
      {/* Simulation modal */}
      <AnimatePresence>
        {simMission && (
          <SimulationModal mission={simMission} onClose={() => setSimMission(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
 