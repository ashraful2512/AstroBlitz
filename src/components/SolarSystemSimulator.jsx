import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Play,
  Pause,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Sun,
  Settings,
  Activity,
  Globe
} from 'lucide-react'

const SolarSystemSimulator = () => {
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [showOrbits, setShowOrbits] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const [time, setTime] = useState(0)
  const [viewMode, setViewMode] = useState('top-down')

  const canvasRef = useRef(null)
  const animationRef = useRef()

  const solarSystem = {
    sun: {
      radius: 25,
      color: '#fbbf24',
      glowColor: 'rgba(251, 191, 36, 0.8)'
    },

    planets: [
      {
        name: 'Mercury',
        radius: 4,
        orbitalRadius: 80,
        orbitalPeriod: 88,
        color: '#8C7853',
        mass: '3.301 × 10^23 kg',
        temperature: '167°C',
        moons: [],
        eccentricity: 0.206
      },

      {
        name: 'Venus',
        radius: 9,
        orbitalRadius: 110,
        orbitalPeriod: 224.7,
        color: '#FFA500',
        mass: '4.867 × 10^24 kg',
        temperature: '464°C',
        moons: [],
        eccentricity: 0.007
      },

      {
        name: 'Earth',
        radius: 10,
        orbitalRadius: 150,
        orbitalPeriod: 365.25,
        color: '#4169E1',
        mass: '5.972 × 10^24 kg',
        temperature: '15°C',

        moons: [
          {
            name: 'Moon',
            radius: 2.5,
            orbitalRadius: 25,
            orbitalPeriod: 27.3,
            color: '#C0C0C0'
          }
        ],

        eccentricity: 0.017
      },

      {
        name: 'Mars',
        radius: 6,
        orbitalRadius: 200,
        orbitalPeriod: 687,
        color: '#CD5C5C',
        mass: '6.417 × 10^23 kg',
        temperature: '-63°C',

        moons: [
          {
            name: 'Phobos',
            radius: 1.5,
            orbitalRadius: 15,
            orbitalPeriod: 0.32,
            color: '#8B7D8D'
          }
        ],

        eccentricity: 0.093
      },

      {
        name: 'Jupiter',
        radius: 35,
        orbitalRadius: 280,
        orbitalPeriod: 4332.59,
        color: '#C88B0A',
        mass: '1.898 × 10^27 kg',
        temperature: '-108°C',

        moons: [
          {
            name: 'Europa',
            radius: 2.5,
            orbitalRadius: 40,
            orbitalPeriod: 3.55,
            color: '#F0E68C'
          }
        ],

        eccentricity: 0.048
      },

      {
        name: 'Saturn',
        radius: 30,
        orbitalRadius: 350,
        orbitalPeriod: 10759.22,
        color: '#F4A460',
        mass: '5.683 × 10^26 kg',
        temperature: '-139°C',

        moons: [
          {
            name: 'Titan',
            radius: 3,
            orbitalRadius: 35,
            orbitalPeriod: 15.95,
            color: '#D4A76A'
          }
        ],

        eccentricity: 0.056
      },

      {
        name: 'Uranus',
        radius: 15,
        orbitalRadius: 450,
        orbitalPeriod: 30688.5,
        color: '#4FD0E0',
        mass: '8.681 × 10^25 kg',
        temperature: '-197°C',
        moons: [],
        eccentricity: 0.046
      },

      {
        name: 'Neptune',
        radius: 14,
        orbitalRadius: 500,
        orbitalPeriod: 60182,
        color: '#4169E1',
        mass: '1.024 × 10^26 kg',
        temperature: '-201°C',
        moons: [],
        eccentricity: 0.010
      }
    ]
  }

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setTime((prev) => prev + 0.1 * speed)

        animationRef.current =
          requestAnimationFrame(animate)
      }

      animationRef.current =
        requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current
        )
      }
    }
  }, [isPlaying, speed])

  useEffect(() => {
    drawSolarSystem()
  }, [time, zoom, showOrbits, showLabels])

  const drawSolarSystem = () => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext('2d')

    const width = canvas.width
    const height = canvas.height

    const centerX = width / 2
    const centerY = height / 2

    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)

    // Background stars
    for (let i = 0; i < 250; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = Math.random() * 1.5
      const brightness = Math.random()

      ctx.fillStyle = `rgba(255,255,255,${brightness})`
      ctx.fillRect(x, y, size, size)
    }

    // Sun glow
    ctx.shadowColor =
      solarSystem.sun.glowColor

    ctx.shadowBlur = 40

    ctx.beginPath()

    ctx.arc(
      centerX,
      centerY,
      solarSystem.sun.radius,
      0,
      Math.PI * 2
    )

    ctx.fillStyle = solarSystem.sun.color
    ctx.fill()

    ctx.shadowBlur = 0

    // Planets
    solarSystem.planets.forEach((planet) => {
      const angle =
        (time / planet.orbitalPeriod) *
        Math.PI *
        2

      const x =
        centerX +
        Math.cos(angle) *
          planet.orbitalRadius *
          zoom

      const y =
        centerY +
        Math.sin(angle) *
          planet.orbitalRadius *
          zoom

      // Orbit path
      if (showOrbits) {
        ctx.beginPath()

        ctx.arc(
          centerX,
          centerY,
          planet.orbitalRadius * zoom,
          0,
          Math.PI * 2
        )

        ctx.strokeStyle =
          'rgba(255,255,255,0.3)'

        ctx.lineWidth = 2

        ctx.stroke()
      }

      // Planet glow
      ctx.shadowColor = planet.color
      ctx.shadowBlur = 20

      ctx.beginPath()

      ctx.arc(
        x,
        y,
        planet.radius * zoom,
        0,
        Math.PI * 2
      )

      ctx.fillStyle = planet.color
      ctx.fill()

      ctx.shadowBlur = 0

      // Saturn's rings (when planet is Saturn)
      if (planet.name === 'Saturn' && showOrbits) {
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)'
        ctx.lineWidth = 3
        
        // Draw multiple rings
        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          ctx.arc(
            centerX,
            centerY,
            planet.radius * zoom + (15 + i * 8),
            0,
            Math.PI * 2
          )
          ctx.stroke()
        }
      }

      // Labels
      if (showLabels) {
        ctx.fillStyle = '#ffffff'
        ctx.font = '12px Arial'

        ctx.fillText(
          planet.name,
          x - 20,
          y - 15
        )
      }

      // Moons
      planet.moons.forEach(
        (moon, index) => {
          const moonAngle =
            (time / moon.orbitalPeriod) *
              Math.PI *
              2 +
            index

          const moonX =
            x +
            Math.cos(moonAngle) *
              moon.orbitalRadius

          const moonY =
            y +
            Math.sin(moonAngle) *
              moon.orbitalRadius

          ctx.beginPath()

          ctx.arc(
            moonX,
            moonY,
            moon.radius,
            0,
            Math.PI * 2
          )

          ctx.fillStyle = moon.color
          ctx.fill()
        }
      )
    })
  }

  const PlanetInfo = ({ planet }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() =>
        setSelectedPlanet(planet)
      }
      className="control-panel p-4 rounded-xl cursor-pointer border border-cosmic-nebula-purple/30 hover:border-cosmic-nebula-purple/70 transition-all"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-5 h-5 rounded-full"
          style={{
            backgroundColor: planet.color
          }}
        />

        <div>
          <h3 className="font-bold text-white">
            {planet.name}
          </h3>

          <p className="text-xs text-gray-400">
            {planet.orbitalPeriod} days
          </p>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6 w-full max-w-[1800px] mx-auto px-4">
      {/* CONTROLS */}
      <div className="control-panel flex flex-wrap gap-4 items-center justify-between p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() =>
              setIsPlaying(!isPlaying)
            }
            className="px-4 py-2 rounded-lg bg-cosmic-nebula-purple hover:bg-cosmic-nebula-purple/80 transition-colors flex items-center gap-2 text-black border border-cosmic-nebula-purple"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}

            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <button
            onClick={() => setTime(0)}
            className="px-4 py-2 rounded-lg bg-cosmic-galaxy-blue hover:bg-cosmic-galaxy-blue/80 transition-colors flex items-center gap-2 text-black border border-cosmic-galaxy-blue"
          >
            <RotateCw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="flex items-center gap-3">
          <ZoomOut 
            className="w-4 h-4 text-white cursor-pointer hover:text-cosmic-star-yellow transition-colors" 
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
          />

          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={zoom}
            onChange={(e) =>
              setZoom(
                Number(e.target.value)
              )
            }
          />

          <ZoomIn 
            className="w-4 h-4 text-white cursor-pointer hover:text-cosmic-star-yellow transition-colors" 
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() =>
              setShowOrbits(!showOrbits)
            }
            className="px-4 py-2 rounded-lg bg-space-dark border border-cosmic-nebula-purple/40 hover:bg-cosmic-nebula-purple/20 transition-colors text-white"
          >
            {showOrbits
              ? 'Hide Orbits'
              : 'Show Orbits'}
          </button>

          <button
            onClick={() =>
              setShowLabels(!showLabels)
            }
            className="px-4 py-2 rounded-lg bg-space-dark border border-cosmic-nebula-purple/40 hover:bg-cosmic-nebula-purple/20 transition-colors text-white"
          >
            {showLabels
              ? 'Hide Labels'
              : 'Show Labels'}
          </button>

          <button
            onClick={() =>
              setViewMode(
                viewMode === 'top-down'
                  ? 'side'
                  : 'top-down'
              )
            }
            className="px-4 py-2 rounded-lg bg-space-dark border border-cosmic-nebula-purple/40 hover:bg-cosmic-nebula-purple/20 transition-colors flex items-center gap-2 text-white"
          >
            <Globe className="w-4 h-4" />
            {viewMode}
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-[72%_28%] gap-6 items-start">
        {/* LEFT */}
        <div className="space-card p-5 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
            <Sun className="w-6 h-6 text-cosmic-star-yellow" />
            Solar System Simulation
          </h2>

          <canvas
            ref={canvasRef}
            width={1600}
            height={850}
            className="w-full h-[850px] rounded-2xl bg-black border border-cosmic-nebula-purple/30"
            style={{
              boxShadow:
                '0 0 40px rgba(168, 85, 247, 0.4)'
            }}
          />

          <div className="mt-5 flex flex-wrap gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cosmic-galaxy-blue" />
              Realistic Orbits
            </div>

            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-cosmic-nebula-purple" />
              Interactive Controls
            </div>

            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cosmic-star-yellow" />
              Planet Tracking
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-card p-5 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-5">
            Planets
          </h2>

          <div className="space-y-4 max-h-[900px] overflow-y-auto pr-2">
            {solarSystem.planets.map(
              (planet) => (
                <PlanetInfo
                  key={planet.name}
                  planet={planet}
                />
              )
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedPlanet && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() =>
            setSelectedPlanet(null)
          }
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            className="space-card max-w-md w-full p-6 rounded-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <h2
              className="text-3xl font-bold mb-5"
              style={{
                color: selectedPlanet.color
              }}
            >
              {selectedPlanet.name}
            </h2>

            <div className="space-y-4 text-gray-300">
              <div className="flex justify-between">
                <span>Mass</span>

                <span className="font-bold">
                  {selectedPlanet.mass}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Temperature</span>

                <span className="font-bold">
                  {
                    selectedPlanet.temperature
                  }
                </span>
              </div>

              <div className="flex justify-between">
                <span>Orbital Period</span>

                <span className="font-bold">
                  {
                    selectedPlanet.orbitalPeriod
                  }{' '}
                  days
                </span>
              </div>

              <div className="flex justify-between">
                <span>Eccentricity</span>

                <span className="font-bold">
                  {
                    selectedPlanet.eccentricity
                  }
                </span>
              </div>

              <div className="flex justify-between">
                <span>Moons</span>

                <span className="font-bold">
                  {
                    selectedPlanet.moons
                      .length
                  }
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default SolarSystemSimulator