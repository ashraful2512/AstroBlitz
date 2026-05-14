import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  Stars,
  Globe,
  Calendar,
  Zap,
  BookOpen,
  Satellite,
  Compass,
  Telescope,
  Activity,
  Moon,
} from "lucide-react";
import EnhancedPlanetExplorer from "./components/EnhancedPlanetExplorer";
import ISSTracker from "./components/ISSTracker";
import ConstellationViewer from "./components/ConstellationViewer";
import MeteorShowerTracker from "./components/MeteorShowerTracker";
import SolarSystemSimulator from "./components/SolarSystemSimulator";
import GalaxyExplorer from "./components/GalaxyExplorer";
import AstronomyLearningCenter from "./components/AstronomyLearningCenter";
import SpaceAnalyticsDashboard from "./components/SpaceAnalyticsDashboard";
import MoonPhaseTracker from "./components/MoonPhaseTracker";
import EnhancedAnimations from "./components/EnhancedAnimations";
import BackgroundEffects from "./components/BackgroundEffects";
import CelestialEvents from "./components/CelestialEvents";
import SpaceMissionPage from "./components/SpaceMissionPage";
import "./App.css";

function App() {
  const [activeSection, setActiveSection] = useState("planets");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navigationItems = [
    { id: "planets", label: "Planets", icon: Globe },
    { id: "iss", label: "ISS", icon: Satellite },
    { id: "constellations", label: "Stars", icon: Telescope },
    { id: "meteors", label: "Meteors", icon: Activity },
    { id: "orbits", label: "Orbits", icon: Stars },
    { id: "space-mission", label: "Space Mission", icon: Rocket },
    { id: "galaxy", label: "Galaxy", icon: Compass },
    { id: "education", label: "Learn", icon: BookOpen },
    { id: "analytics", label: "Analytics", icon: Activity },
    { id: "moon", label: "Moon", icon: Moon },
  ];

  return (
    <div className="min-h-screen bg-space-black text-gray-100 relative overflow-hidden">
      {/* Animated Starfield Background */}
      <div className="fixed inset-0 z-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main Dashboard Container */}
      <div className="relative z-10">
        {/* Header Control Panel */}
        <header className="control-panel m-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Rocket className="w-8 h-8 text-cosmic-nebula-purple" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold neon-text font-orbitron">
                  ASTRONOMY DASHBOARD
                </h1>
                <p className="text-xs text-gray-400 font-mono">
                  Mission Control v2.0.1
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-sm">
              <div className="text-cosmic-star-yellow">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-gray-400">
                {currentTime.toLocaleDateString()}
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Menu */}
        <nav className="control-panel mx-4 mb-6 astro-nav">
          <div className="flex flex-wrap gap-2 justify-center">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`astro-nav-button px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                    activeSection === item.id
                      ? "astro-nav-button-active bg-cosmic-nebula-purple/30 border-cosmic-nebula-purple text-cosmic-nebula-purple"
                      : "astro-nav-button-idle bg-space-dark/50 border-cosmic-galaxy-blue/20 text-gray-200 hover:text-cosmic-galaxy-blue"
                  } border`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-mono text-sm">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="px-4 pb-8">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            {activeSection === "planets" && (
              <div className="space-card">
                <h2 className="text-xl font-bold mb-4 neon-text">
                  Enhanced Planet Explorer
                </h2>
                <EnhancedPlanetExplorer />
              </div>
            )}

            {activeSection === "iss" && (
              <div className="space-card">
                <h2 className="text-xl font-bold mb-4 neon-text">
                  ISS Live Tracker
                </h2>
                <ISSTracker />
              </div>
            )}

            {activeSection === "constellations" && (
              <div className="space-card">
                <h2 className="text-xl font-bold mb-4 neon-text">
                  Constellation Viewer
                </h2>
                <ConstellationViewer />
              </div>
            )}

            {activeSection === "meteors" && (
              <div className="space-card">
                <h2 className="text-xl font-bold mb-4 neon-text">
                  Meteor Shower Tracker
                </h2>
                <MeteorShowerTracker />
              </div>
            )}

            {activeSection === "galaxy" && (
              <div className="space-card">
                <h2 className="text-xl font-bold mb-4 neon-text">
                  Galaxy Explorer
                </h2>
                <GalaxyExplorer />
              </div>
            )}

            {activeSection === "analytics" && (
              <div className="space-card">
                <h2 className="text-xl font-bold mb-4 neon-text">
                  Space Analytics Dashboard
                </h2>
                <SpaceAnalyticsDashboard />
              </div>
            )}

            {activeSection === "moon" && (
              <div className="space-card">
                <h2 className="text-xl font-bold mb-4 neon-text">
                  Moon Phase Tracker
                </h2>
                <MoonPhaseTracker />
              </div>
            )}

            {activeSection === "events" && (
              <div className="space-card">
                <h2 className="text-xl font-bold mb-4 neon-text">
                  Celestial Events
                </h2>
                <CelestialEvents />
              </div>
            )}

            {activeSection === "orbits" && (
              <div className="space-card">
                <h2 className="text-xl font-bold mb-4 neon-text">
                  Solar System Simulator
                </h2>
                <SolarSystemSimulator />
              </div>
            )}

            {activeSection === "education" && (
              <div className="space-card">
                <h2 className="text-xl font-bold mb-4 neon-text">
                  Astronomy Learning Center
                </h2>
                <AstronomyLearningCenter />
              </div>
            )}

            {activeSection === "tracking" && (
              <div className="space-card">
                <h2 className="text-xl font-bold mb-4 neon-text">
                  Enhanced Animations
                </h2>
                <EnhancedAnimations />
              </div>
            )}

            {activeSection === "background" && (
              <div className="space-card">
                <h2 className="text-xl font-bold mb-4 neon-text">
                  Background Effects
                </h2>
                <BackgroundEffects />
              </div>
            )}

            {activeSection === "space-mission" && (
              <div className="space-card">
                <SpaceMissionPage />
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default App;
