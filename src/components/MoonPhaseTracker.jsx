import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Moon,
  Calendar,
  Eye,
  Info,
  Sun,
  Star,
  Clock,
  Target,
} from "lucide-react";

const MoonPhaseTracker = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("phases");
  const [animationSpeed, setAnimationSpeed] = useState(1);

  const moonPhases = [
    {
      id: 0,
      name: "New Moon",
      emoji: "🌑",
      description: "Moon is between Earth and Sun",
      illumination: 0,
      angle: 0,
    },
    {
      id: 1,
      name: "Waxing Crescent",
      emoji: "🌒",
      description: "First visible crescent",
      illumination: 25,
      angle: 45,
    },
    {
      id: 2,
      name: "First Quarter",
      emoji: "🌓",
      description: "Half moon illuminated",
      illumination: 50,
      angle: 90,
    },
    {
      id: 3,
      name: "Waxing Gibbous",
      emoji: "🌔",
      description: "More than half illuminated",
      illumination: 75,
      angle: 135,
    },
    {
      id: 4,
      name: "Full Moon",
      emoji: "🌕",
      description: "Fully illuminated",
      illumination: 100,
      angle: 180,
    },
    {
      id: 5,
      name: "Waning Gibbous",
      emoji: "🌖",
      description: "More than half dark",
      illumination: 75,
      angle: 225,
    },
    {
      id: 6,
      name: "Last Quarter",
      emoji: "🌗",
      description: "Half moon dark",
      illumination: 50,
      angle: 270,
    },
    {
      id: 7,
      name: "Waning Crescent",
      emoji: "🌘",
      description: "Last visible crescent",
      illumination: 25,
      angle: 315,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % 8);
    }, 2000 / animationSpeed);

    return () => clearInterval(interval);
  }, [animationSpeed]);

  const calculateMoonPhase = (date) => {
    // Prevent invalid dates
    if (!(date instanceof Date) || isNaN(date)) {
      return moonPhases[0];
    }

    // Known New Moon reference:
    // January 6, 2000 at 18:14 UTC
    const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14));

    // Exact lunar cycle length
    const lunarCycle = 29.53058867;

    // Difference in milliseconds
    const diff = date.getTime() - knownNewMoon.getTime();

    // Convert to days
    const days = diff / (1000 * 60 * 60 * 24);

    // Current moon age
    const moonAge = ((days % lunarCycle) + lunarCycle) % lunarCycle;

    let phaseIndex = 0;

    // Accurate moon phase boundaries
    if (moonAge < 1.84566) {
      phaseIndex = 0; // New Moon
    } else if (moonAge < 5.53699) {
      phaseIndex = 1; // Waxing Crescent
    } else if (moonAge < 9.22831) {
      phaseIndex = 2; // First Quarter
    } else if (moonAge < 12.91963) {
      phaseIndex = 3; // Waxing Gibbous
    } else if (moonAge < 16.61096) {
      phaseIndex = 4; // Full Moon
    } else if (moonAge < 20.30228) {
      phaseIndex = 5; // Waning Gibbous
    } else if (moonAge < 23.99361) {
      phaseIndex = 6; // Last Quarter
    } else if (moonAge < 27.68493) {
      phaseIndex = 7; // Waning Crescent
    } else {
      phaseIndex = 0; // New Moon
    }

    return moonPhases[phaseIndex];
  };
  const MoonPhaseCard = ({ phase, isActive, onClick }) => (
    <motion.div
      className={`control-panel p-4 cursor-pointer ${
        isActive ? "border-cosmic-nebula-purple/50" : ""
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className="text-center">
        <div className="text-5xl mb-3">{phase.emoji}</div>

        <h3 className="font-bold text-sm mb-2">{phase.name}</h3>

        <p className="text-xs text-gray-400 mb-2">{phase.description}</p>

        <div className="text-xs text-cosmic-star-yellow">
          {phase.illumination}% illuminated
        </div>
      </div>
    </motion.div>
  );

  const selectedPhase = calculateMoonPhase(selectedDate);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="control-panel">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h3 className="text-lg font-bold flex items-center">
            <Moon className="w-5 h-5 mr-2 text-cosmic-nebula-purple" />
            Moon Phase Tracker
          </h3>

          <div className="flex items-center gap-4 flex-wrap">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="px-3 py-2 bg-space-dark/50 border border-gray-500/50 rounded text-sm"
            >
              <option value="phases">Moon Phases</option>

              <option value="calendar">Lunar Calendar</option>
            </select>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Animation Speed:</span>

              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                className="w-20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CURRENT PHASE */}
      <div className="space-card">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-cosmic-galaxy-blue" />
          Current Moon Phase
        </h3>

        <div className="flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-8xl mb-4">
              {moonPhases[currentPhase].emoji}
            </div>

            <h2 className="text-2xl font-bold mb-2">
              {moonPhases[currentPhase].name}
            </h2>

            <p className="text-gray-400 mb-4">
              {moonPhases[currentPhase].description}
            </p>

            <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-cosmic-star-yellow" />

                <span>
                  Illumination: {moonPhases[currentPhase].illumination}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cosmic-nebula-purple" />

                <span>Angle: {moonPhases[currentPhase].angle}°</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* PHASE GRID */}
      {viewMode === "phases" && (
        <div className="space-card">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-cosmic-nebula-purple" />
            All Moon Phases
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {moonPhases.map((phase, index) => (
              <MoonPhaseCard
                key={phase.id}
                phase={phase}
                isActive={index === currentPhase}
                onClick={() => setCurrentPhase(index)}
              />
            ))}
          </div>
        </div>
      )}

      {/* FACTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-card">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2 text-cosmic-galaxy-blue" />
            Moon Facts
          </h3>

          <div className="space-y-3">
            <div className="control-panel p-3">
              <h4 className="font-bold text-cosmic-star-yellow mb-1">
                Distance from Earth
              </h4>

              <p className="text-sm text-gray-300">384,400 km average</p>
            </div>

            <div className="control-panel p-3">
              <h4 className="font-bold text-cosmic-nebula-purple mb-1">
                Orbital Period
              </h4>

              <p className="text-sm text-gray-300">27.3 days</p>
            </div>

            <div className="control-panel p-3">
              <h4 className="font-bold text-cosmic-aurora-green mb-1">
                Gravity
              </h4>

              <p className="text-sm text-gray-300">1/6th of Earth gravity</p>
            </div>
          </div>
        </div>

        <div className="space-card">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-cosmic-nebula-purple" />
            Selected Date Phase
          </h3>

          <motion.div
            key={
              selectedDate instanceof Date && !isNaN(selectedDate)
                ? selectedDate.toISOString()
                : "invalid"
            }
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="control-panel p-6 text-center"
          >
            <div className="text-7xl mb-4">{selectedPhase.emoji}</div>

            <h3 className="text-2xl font-bold mb-2">{selectedPhase.name}</h3>

            <p className="text-sm text-gray-400 mb-4">
              {selectedPhase.description}
            </p>

            <div className="flex justify-center gap-3 flex-wrap">
              <div className="bg-cosmic-star-yellow/10 text-cosmic-star-yellow px-3 py-1 rounded text-xs">
                🌕 {selectedPhase.illumination}% illuminated
              </div>

              <div className="bg-cosmic-nebula-purple/10 text-cosmic-nebula-purple px-3 py-1 rounded text-xs">
                📐 {selectedPhase.angle}°
              </div>
            </div>

            <div className="mt-4 text-xs text-cosmic-galaxy-blue">
              {selectedDate instanceof Date && !isNaN(selectedDate)
                ? selectedDate.toDateString()
                : "Invalid Date"}
            </div>
          </motion.div>
        </div>
      </div>

      {/* DATE PICKER */}
      <div className="control-panel">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-bold">Select Date:</label>

            <input
              type="date"
              value={
                selectedDate instanceof Date && !isNaN(selectedDate)
                  ? selectedDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDate(new Date(e.target.value));
                }
              }}
              className="px-3 py-2 bg-space-dark/50 border border-gray-500/50 rounded text-sm"
            />
          </div>

          <div className="text-sm text-gray-400">
            Phase: {selectedPhase.name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoonPhaseTracker;
