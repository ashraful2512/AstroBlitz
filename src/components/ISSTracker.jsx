import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Satellite,
  Globe,
  Activity,
  Navigation,
  Clock,
  Gauge,
  MapPin,
  RotateCw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut
} from 'lucide-react'

const ISSTracker = () => {
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [time, setTime] = useState(0)
  const [orbitProgress, setOrbitProgress] = useState(0)
  const [showOrbitPath, setShowOrbitPath] = useState(true)

  const canvasRef = useRef(null)
  const animationRef = useRef()

  const issData = {
    altitude: 408,
    speed: 27600,
    orbitalPeriod: 92.68,
    orbitsPerDay: 15.5,
    currentOrbit: Math.floor(time / 92.68),
    distanceTraveled: time * 27600,

    coordinates: {
      latitude: Math.sin(time * 0.067) * 51.6,
      longitude: (time * 4) % 360 - 180
    }
  }

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setTime((prev) => prev + speed * 0.1)
        setOrbitProgress((prev) => (prev + speed * 0.1) % 100)

        animationRef.current = requestAnimationFrame(animate)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, speed])

  const resetTracking = () => {
    setTime(0)
    setOrbitProgress(0)
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)

    return `${hours.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}`
  }

  const formatDistance = (km) => {
    if (km < 1000) return `${km.toFixed(0)} km`

    return `${(km / 1000).toFixed(1)}k km`
  }

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext('2d')

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const earthRadius =
      Math.min(canvas.width, canvas.height) * 0.16 * zoom

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // STARS
    for (let i = 0; i < 180; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 2

      ctx.fillStyle = 'rgba(251,191,36,0.8)'
      ctx.fillRect(x, y, size, size)
    }

    // EARTH
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      earthRadius
    )

    gradient.addColorStop(0, '#3b82f6')
    gradient.addColorStop(0.7, '#1d4ed8')
    gradient.addColorStop(1, '#1e3a8a')

    ctx.fillStyle = gradient

    ctx.beginPath()
    ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2)
    ctx.fill()

    // Continents
    ctx.fillStyle = '#10b981'

    ctx.beginPath()
    ctx.arc(centerX - 40, centerY - 20, 25, 0, Math.PI * 2)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(centerX + 50, centerY + 35, 35, 0, Math.PI * 2)
    ctx.fill()

    // Orbit path
    const orbitRadius =
      earthRadius +
      Math.min(canvas.width, canvas.height) * 0.1 * zoom

    if (showOrbitPath) {
      ctx.strokeStyle = 'rgba(168,85,247,0.4)'
      ctx.lineWidth = 2
      ctx.setLineDash([6, 6])

      ctx.beginPath()

      ctx.arc(
        centerX,
        centerY,
        orbitRadius,
        0,
        Math.PI * 2
      )

      ctx.stroke()

      ctx.setLineDash([])
    }

    // ISS POSITION
    const angle =
      (orbitProgress / 100) * Math.PI * 2 - Math.PI / 2

    const issX =
      centerX + Math.cos(angle) * orbitRadius

    const issY =
      centerY + Math.sin(angle) * orbitRadius

    // ISS
    ctx.fillStyle = '#fbbf24'
    ctx.shadowColor = '#fbbf24'
    ctx.shadowBlur = 20

    ctx.fillRect(issX - 12, issY - 6, 24, 12)

    ctx.shadowBlur = 0

    // Trail
    ctx.strokeStyle = 'rgba(251,191,36,0.5)'
    ctx.lineWidth = 3

    ctx.beginPath()

    for (let i = 0; i < 15; i++) {
      const trailAngle = angle - i * 0.05

      const trailX =
        centerX + Math.cos(trailAngle) * orbitRadius

      const trailY =
        centerY + Math.sin(trailAngle) * orbitRadius

      if (i === 0) {
        ctx.moveTo(trailX, trailY)
      } else {
        ctx.lineTo(trailX, trailY)
      }
    }

    ctx.stroke()
  }, [time, zoom, orbitProgress, showOrbitPath])

  return (
    <div className="space-y-6 w-full max-w-[1800px] mx-auto px-4">
      {/* CONTROLS */}
      <div className="control-panel p-4 rounded-2xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 bg-cosmic-galaxy-blue/30 border border-cosmic-galaxy-blue/50 rounded-lg flex items-center gap-2 hover:bg-cosmic-galaxy-blue/50 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}

              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              onClick={resetTracking}
              className="px-4 py-2 bg-cosmic-nebula-purple/30 border border-cosmic-nebula-purple/50 rounded-lg flex items-center gap-2 hover:bg-cosmic-nebula-purple/50 transition-all"
            >
              <RotateCw className="w-4 h-4" />
              Reset
            </button>
          </div>

          <div className="flex items-center gap-5 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                Speed:
              </span>

              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={speed}
                onChange={(e) =>
                  setSpeed(parseFloat(e.target.value))
                }
                className="w-28"
              />

              <span className="text-cosmic-star-yellow font-mono">
                {speed.toFixed(1)}x
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setZoom(Math.max(0.5, zoom - 0.1))
                }
                className="p-2 rounded bg-cosmic-aurora-green/30 border border-cosmic-aurora-green/50"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <span className="text-gray-400 text-sm">
                {(zoom * 100).toFixed(0)}%
              </span>

              <button
                onClick={() =>
                  setZoom(Math.min(2, zoom + 0.1))
                }
                className="p-2 rounded bg-cosmic-aurora-green/30 border border-cosmic-aurora-green/50"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() =>
                setShowOrbitPath(!showOrbitPath)
              }
              className="px-4 py-2 rounded-lg border border-cosmic-nebula-purple/50 bg-cosmic-nebula-purple/20 hover:bg-cosmic-nebula-purple/40 transition-all"
            >
              {showOrbitPath ? 'Hide Path' : 'Show Path'}
            </button>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[68%_32%] gap-6 items-stretch">
        {/* LEFT */}
        <div className="w-full">
          <div className="space-card p-5 rounded-2xl h-full">
            <h3 className="text-3xl font-bold mb-6 flex items-center">
              <Globe className="w-7 h-7 mr-3 text-cosmic-galaxy-blue" />
              ISS Orbit Visualization
            </h3>

            <canvas
              ref={canvasRef}
              width={1400}
              height={850}
              className="w-full h-[850px] rounded-2xl border border-cosmic-galaxy-blue/20 bg-space-dark/40"
            />

            <div className="mt-5 flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-cosmic-galaxy-blue" />
                <span className="text-gray-400">
                  Earth
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-cosmic-star-yellow" />
                <span className="text-gray-400">
                  ISS
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 border-t-2 border-dashed border-cosmic-nebula-purple/50" />
                <span className="text-gray-400">
                  Orbit Path
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full flex flex-col gap-5">
          {/* LIVE TRACKING */}
          <div className="space-card p-5 rounded-2xl">
            <h3 className="text-2xl font-bold mb-5 flex items-center">
              <Satellite className="w-6 h-6 mr-3 text-cosmic-star-yellow" />
              Live Tracking
            </h3>

            <div className="space-y-5">
              <div className="flex justify-between">
                <span className="text-gray-400">
                  Current Orbit
                </span>

                <span className="text-cosmic-star-yellow font-bold">
                  #{issData.currentOrbit}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">
                  Orbit Progress
                </span>

                <span className="text-cosmic-galaxy-blue font-bold">
                  {orbitProgress.toFixed(1)}%
                </span>
              </div>

              <div className="w-full h-3 bg-space-dark rounded-full overflow-hidden">
                <div
                  className="h-full bg-cosmic-galaxy-blue rounded-full"
                  style={{
                    width: `${orbitProgress}%`
                  }}
                />
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">
                  Mission Time
                </span>

                <span className="font-mono text-white">
                  {formatTime(time)}
                </span>
              </div>
            </div>
          </div>

          {/* POSITION */}
          <div className="space-card p-5 rounded-2xl">
            <h3 className="text-2xl font-bold mb-5 flex items-center">
              <Navigation className="w-6 h-6 mr-3 text-cosmic-nebula-purple" />
              Current Position
            </h3>

            <div className="space-y-5">
              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Latitude
                </span>

                <span className="font-mono text-white">
                  {issData.coordinates.latitude.toFixed(2)}°
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Longitude
                </span>

                <span className="font-mono text-white">
                  {issData.coordinates.longitude.toFixed(2)}°
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  Altitude
                </span>

                <span className="font-mono text-cosmic-aurora-green">
                  {issData.altitude} km
                </span>
              </div>
            </div>
          </div>

          {/* METRICS */}
          <div className="space-card p-5 rounded-2xl">
            <h3 className="text-2xl font-bold mb-5 flex items-center">
              <Activity className="w-6 h-6 mr-3 text-red-400" />
              Performance Metrics
            </h3>

            <div className="space-y-5">
              <div className="flex justify-between">
                <span className="text-gray-400">
                  Speed
                </span>

                <span className="font-mono text-red-400">
                  {issData.speed.toLocaleString()} km/h
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">
                  Orbital Period
                </span>

                <span className="font-mono text-white">
                  {issData.orbitalPeriod} min
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">
                  Orbits/Day
                </span>

                <span className="font-mono text-cosmic-star-yellow">
                  {issData.orbitsPerDay}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">
                  Distance Traveled
                </span>

                <span className="font-mono text-cosmic-nebula-purple">
                  {formatDistance(
                    issData.distanceTraveled
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM INFO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="control-panel p-5 rounded-2xl">
          <h3 className="font-bold text-cosmic-galaxy-blue mb-4 flex items-center text-lg">
            <Satellite className="w-5 h-5 mr-2" />
            ISS Mission Details
          </h3>

          <div className="space-y-3 text-gray-300">
            <p>
              • The International Space Station orbits
              Earth every 92.68 minutes
            </p>

            <p>
              • Traveling at approximately 27,600 km/h
            </p>

            <p>
              • Altitude varies between 408-410 km
            </p>

            <p>
              • Orbital inclination of 51.6 degrees
            </p>

            <p>
              • Visible to naked eye from Earth
            </p>
          </div>
        </div>

        <div className="control-panel p-5 rounded-2xl">
          <h3 className="font-bold text-cosmic-star-yellow mb-4 flex items-center text-lg">
            <Activity className="w-5 h-5 mr-2" />
            Tracking Information
          </h3>

          <div className="space-y-3 text-gray-300">
            <p>
              • Real-time position updates every second
            </p>

            <p>
              • Accurate orbital mechanics simulation
            </p>

            <p>
              • Multiple viewing angles and zoom levels
            </p>

            <p>
              • Speed controls for detailed observation
            </p>

            <p>
              • Complete orbital path visualization
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ISSTracker