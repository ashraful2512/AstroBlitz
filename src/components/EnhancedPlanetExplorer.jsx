import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Globe, Thermometer, Clock, Satellite, Info, RotateCw, BarChart3, Wind, Mountain } from 'lucide-react'
import planetsData from '../data/planets.json'

const EnhancedPlanetExplorer = () => {
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const [comparisonPlanets, setComparisonPlanets] = useState([])
  const [rotationSpeed, setRotationSpeed] = useState(1)
  const [showOrbits, setShowOrbits] = useState(true)
  const [animationTime, setAnimationTime] = useState(0)
  const canvasRef = useRef(null)
  const planets = planetsData.planets

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime(prev => prev + 0.01)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const enhancedPlanets = planets.map(planet => ({
    ...planet,
    gravity: calculateGravity(planet),
    atmosphere: getAtmosphereInfo(planet),
    temperature: getTemperatureRange(planet),
    orbitalRadius: getOrbitalRadius(planet),
    rotationPeriod: getRotationPeriod(planet)
  }))

  function calculateGravity(planet) {
    const gravityMap = {
      'Mercury': '3.7 m/s²',
      'Venus': '8.87 m/s²',
      'Earth': '9.8 m/s²',
      'Mars': '3.71 m/s²',
      'Jupiter': '24.79 m/s²',
      'Saturn': '10.44 m/s²',
      'Uranus': '8.87 m/s²',
      'Neptune': '11.15 m/s²'
    }
    return gravityMap[planet.name] || 'Unknown'
  }

  function getAtmosphereInfo(planet) {
    const atmosphereMap = {
      'Mercury': 'Minimal - mostly oxygen, sodium, hydrogen',
      'Venus': 'Dense CO₂ (96.5%), nitrogen, sulfuric acid clouds',
      'Earth': 'Nitrogen (78%), oxygen (21%), argon, CO₂',
      'Mars': 'Thin CO₂ (95%), nitrogen, argon',
      'Jupiter': 'Hydrogen (90%), helium (10%), methane, ammonia',
      'Saturn': 'Hydrogen (96%), helium (3%), methane, ammonia',
      'Uranus': 'Hydrogen (83%), helium (15%), methane (2%)',
      'Neptune': 'Hydrogen (80%), helium (19%), methane (1%)'
    }
    return atmosphereMap[planet.name] || 'Unknown'
  }

  function getTemperatureRange(planet) {
    const tempMap = {
      'Mercury': '-173°C to 427°C',
      'Venus': '462°C average',
      'Earth': '-88°C to 58°C',
      'Mars': '-87°C to -5°C',
      'Jupiter': '-108°C average',
      'Saturn': '-139°C average',
      'Uranus': '-197°C average',
      'Neptune': '-201°C average'
    }
    return tempMap[planet.name] || planet.temperature
  }

  function getOrbitalRadius(planet) {
    const radiusMap = {
      'Mercury': '57.9 million km',
      'Venus': '108.2 million km',
      'Earth': '149.6 million km',
      'Mars': '227.9 million km',
      'Jupiter': '778.5 million km',
      'Saturn': '1.432 billion km',
      'Uranus': '2.867 billion km',
      'Neptune': '4.515 billion km'
    }
    return radiusMap[planet.name] || planet.distanceFromSun
  }

  function getRotationPeriod(planet) {
    const rotationMap = {
      'Mercury': '59 Earth days',
      'Venus': '243 Earth days (retrograde)',
      'Earth': '24 hours',
      'Mars': '24.6 hours',
      'Jupiter': '9.9 hours',
      'Saturn': '10.7 hours',
      'Uranus': '17.2 hours',
      'Neptune': '16.1 hours'
    }
    return rotationMap[planet.name] || planet.dayLength
  }

  const addToComparison = (planet) => {
    if (!comparisonPlanets.find(p => p.id === planet.id) && comparisonPlanets.length < 3) {
      setComparisonPlanets([...comparisonPlanets, planet])
    }
  }

  const removeFromComparison = (planetId) => {
    setComparisonPlanets(comparisonPlanets.filter(p => p.id !== planetId))
  }

  const PlanetCard = ({ planet, isComparison = false }) => (
    <motion.div
      className={`control-panel cursor-pointer relative overflow-hidden group ${isComparison ? 'p-3' : 'p-4'}`}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => !isComparison && setSelectedPlanet(planet)}
    >
      {/* Animated Planet Visual */}
      <div className="absolute top-2 right-2">
        <motion.div
          className="w-12 h-12 rounded-full"
          style={{ 
            backgroundColor: planet.color,
            boxShadow: `0 0 20px ${planet.color}80, 0 0 40px ${planet.color}40`
          }}
          animate={{ rotate: animationTime * 360 * rotationSpeed }}
          transition={{ type: "tween", ease: "linear" }}
        >
          {/* Planet surface features */}
          <div className="absolute inset-0 rounded-full opacity-30"
               style={{ background: `radial-gradient(circle at 30% 30%, transparent 40%, ${planet.color} 100%)` }} />
        </motion.div>
      </div>

      <div className="relative z-10">
        <h3 className="font-bold text-lg mb-1" style={{ color: planet.color }}>
          {planet.name}
        </h3>
        <p className="text-xs text-gray-400 mb-2">{planet.type}</p>
        
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <Globe className="w-3 h-3 text-cosmic-galaxy-blue" />
            <span className="text-gray-300">{planet.diameter}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3 text-cosmic-star-yellow" />
            <span className="text-gray-300">{planet.orbitalPeriod}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Satellite className="w-3 h-3 text-cosmic-nebula-purple" />
            <span className="text-gray-300">{planet.moons} moons</span>
          </div>
          {!isComparison && (
            <div className="flex items-center space-x-2">
              <Wind className="w-3 h-3 text-cosmic-aurora-green" />
              <span className="text-gray-300">{planet.gravity}</span>
            </div>
          )}
        </div>

        {!isComparison && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              addToComparison(planet)
            }}
            className="mt-2 px-2 py-1 bg-cosmic-nebula-purple/30 border border-cosmic-nebula-purple/50 rounded text-xs hover:bg-cosmic-nebula-purple/50 transition-colors"
            disabled={comparisonPlanets.length >= 3}
          >
            {comparisonPlanets.find(p => p.id === planet.id) ? 'Added' : 'Compare'}
          </button>
        )}
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="control-panel">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <RotateCw className="w-4 h-4 text-cosmic-star-yellow" />
              <label className="text-xs text-gray-400">Rotation:</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={rotationSpeed}
                onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                className="w-20"
              />
              <span className="text-xs text-cosmic-star-yellow font-mono">{rotationSpeed.toFixed(1)}x</span>
            </div>
            
            <button
              onClick={() => setShowOrbits(!showOrbits)}
              className={`px-3 py-1 border rounded text-xs transition-colors ${
                showOrbits 
                  ? 'bg-cosmic-galaxy-blue/30 border-cosmic-galaxy-blue/50' 
                  : 'bg-space-dark/50 border-gray-500/50'
              }`}
            >
              {showOrbits ? 'Hide Orbits' : 'Show Orbits'}
            </button>
          </div>

          {comparisonPlanets.length > 0 && (
            <button
              onClick={() => setComparisonPlanets([])}
              className="px-3 py-1 bg-cosmic-mars-red/30 border border-cosmic-mars-red/50 rounded text-xs hover:bg-cosmic-mars-red/50 transition-colors"
            >
              Clear Comparison ({comparisonPlanets.length})
            </button>
          )}
        </div>
      </div>

      {/* Planet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {enhancedPlanets.map((planet) => (
          <PlanetCard key={planet.id} planet={planet} />
        ))}
      </div>

      {/* Comparison Panel */}
      {comparisonPlanets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-card"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-cosmic-nebula-purple" />
            Planet Comparison
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comparisonPlanets.map((planet) => (
              <div key={planet.id} className="relative">
                <PlanetCard planet={planet} isComparison />
                <button
                  onClick={() => removeFromComparison(planet.id)}
                  className="absolute top-1 right-1 w-6 h-6 bg-cosmic-mars-red/80 rounded-full text-xs text-white hover:bg-cosmic-mars-red transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Comparison Data */}
          <div className="mt-4 pt-4 border-t border-cosmic-nebula-purple/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-gray-400">Largest:</span>
                <span className="ml-2 text-cosmic-galaxy-blue font-bold">
                  {comparisonPlanets.reduce((max, p) => 
                    parseInt(p.diameter) > parseInt(max.diameter) ? p : max
                  ).name}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Most Moons:</span>
                <span className="ml-2 text-cosmic-nebula-purple font-bold">
                  {comparisonPlanets.reduce((max, p) => 
                    p.moons > max.moons ? p : max
                  ).name}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Fastest Orbit:</span>
                <span className="ml-2 text-cosmic-star-yellow font-bold">
                  {comparisonPlanets.reduce((min, p) => 
                    parseInt(p.orbitalPeriod) < parseInt(min.orbitalPeriod) ? p : min
                  ).name}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Strongest Gravity:</span>
                <span className="ml-2 text-cosmic-aurora-green font-bold">
                  {comparisonPlanets.reduce((max, p) => 
                    parseFloat(p.gravity) > parseFloat(max.gravity) ? p : max
                  ).name}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Enhanced Planet Detail Modal */}
      {selectedPlanet && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => setSelectedPlanet(null)}
        >
          <motion.div
            className="space-card max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2" style={{ color: selectedPlanet.color }}>
                  {selectedPlanet.name}
                </h2>
                <p className="text-sm text-gray-400">{selectedPlanet.type} • {selectedPlanet.orbitalRadius} from Sun</p>
              </div>
              <button
                onClick={() => setSelectedPlanet(null)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Enhanced Planet Visual */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <motion.div
                  className="w-40 h-40 rounded-full animate-float"
                  style={{ 
                    backgroundColor: selectedPlanet.color,
                    boxShadow: `0 0 40px ${selectedPlanet.color}80, 0 0 80px ${selectedPlanet.color}40`
                  }}
                  animate={{ rotate: animationTime * 360 * rotationSpeed }}
                  transition={{ type: "tween", ease: "linear" }}
                >
                  {/* Surface features */}
                  <div className="absolute inset-0 rounded-full opacity-30"
                       style={{ background: `radial-gradient(circle at 30% 30%, transparent 40%, ${selectedPlanet.color} 100%)` }} />
                  <div className="absolute inset-0 rounded-full opacity-20"
                       style={{ background: `radial-gradient(circle at 70% 60%, transparent 30%, ${selectedPlanet.color} 100%)` }} />
                </motion.div>
                
                {/* Orbit Ring */}
                {showOrbits && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-cosmic-nebula-purple/30"
                    animate={{ rotate: animationTime * 20 }}
                    transition={{ type: "tween", ease: "linear" }}
                  />
                )}
              </div>
            </div>

            {/* Comprehensive Planet Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="control-panel">
                <h3 className="font-bold text-cosmic-galaxy-blue mb-3 flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Physical Properties
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Diameter:</span>
                    <span className="text-white">{selectedPlanet.diameter}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gravity:</span>
                    <span className="text-white">{selectedPlanet.gravity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Moons:</span>
                    <span className="text-white">{selectedPlanet.moons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white">{selectedPlanet.type}</span>
                  </div>
                </div>
              </div>

              <div className="control-panel">
                <h3 className="font-bold text-cosmic-star-yellow mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Time & Orbit
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Orbital Period:</span>
                    <span className="text-white">{selectedPlanet.orbitalPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Day Length:</span>
                    <span className="text-white">{selectedPlanet.rotationPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Distance from Sun:</span>
                    <span className="text-white">{selectedPlanet.orbitalRadius}</span>
                  </div>
                </div>
              </div>

              <div className="control-panel">
                <h3 className="font-bold text-cosmic-mars-red mb-3 flex items-center">
                  <Thermometer className="w-4 h-4 mr-2" />
                  Climate & Atmosphere
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Temperature:</span>
                    <span className="text-white">{selectedPlanet.temperature}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Atmosphere:</span>
                    <span className="text-white text-xs text-right max-w-[120px]">
                      {selectedPlanet.atmosphere.substring(0, 30)}...
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Extended Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="control-panel">
                <h3 className="font-bold text-cosmic-nebula-purple mb-2 flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  About {selectedPlanet.name}
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  {selectedPlanet.description}
                </p>
                <div className="bg-cosmic-nebula-purple/10 border border-cosmic-nebula-purple/30 rounded-lg p-3">
                  <p className="text-xs text-cosmic-nebula-purple font-bold mb-1">
                    🚀 Fun Fact:
                  </p>
                  <p className="text-xs text-gray-300">
                    {selectedPlanet.funFact}
                  </p>
                </div>
              </div>

              <div className="control-panel">
                <h3 className="font-bold text-cosmic-aurora-green mb-2 flex items-center">
                  <Mountain className="w-4 h-4 mr-2" />
                  Surface Features
                </h3>
                <div className="space-y-2 text-xs text-gray-300">
                  <p>• {selectedPlanet.name} has unique surface characteristics shaped by its atmospheric conditions and geological history.</p>
                  <p>• The planet's composition and distance from the Sun create distinctive weather patterns and surface phenomena.</p>
                  <p>• Exploration missions have revealed fascinating details about {selectedPlanet.name}'s terrain and potential for future research.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default EnhancedPlanetExplorer
