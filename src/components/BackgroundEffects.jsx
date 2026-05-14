import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Star, Zap, Activity, Settings, Play, Pause, RotateCw, Eye, Layers } from 'lucide-react'

const BackgroundEffects = () => {
  const [isPlaying, setIsPlaying] = useState(true)
  const [effectSpeed, setEffectSpeed] = useState(1)
  const [selectedEffect, setSelectedEffect] = useState('stars')
  const [particleCount, setParticleCount] = useState(100)
  const [showGrid, setShowGrid] = useState(false)
  const canvasRef = useRef(null)
  const animationRef = useRef()

  // Background effect presets
  const effects = [
    {
      id: 'stars',
      name: 'Moving Stars',
      description: 'Animated starfield with twinkling effects',
      icon: <Star className="w-6 h-6" />,
      particles: 100,
      speed: 1,
      colors: ['#ffffff', '#ffffcc', '#ccccff']
    },
    {
      id: 'parallax',
      name: 'Parallax Galaxies',
      description: 'Multi-layer parallax scrolling effect',
      icon: <Layers className="w-6 h-6" />,
      particles: 50,
      speed: 0.5,
      colors: ['#a855f7', '#3b82f6', '#10b981']
    },
    {
      id: 'meteors',
      name: 'Meteor Streaks',
      description: 'Shooting meteors with trail effects',
      icon: <Meteor className="w-6 h-6" />,
      particles: 20,
      speed: 2,
      colors: ['#fbbf24', '#f59e0b', '#ef4444']
    },
    {
      id: 'cosmic',
      name: 'Cosmic Dust',
      description: 'Floating cosmic dust particles',
      icon: <Sparkles className="w-6 h-6" />,
      particles: 150,
      speed: 0.8,
      colors: ['#8b5cf6', '#ec4899', '#06b6d4']
    },
    {
      id: 'aurora',
      name: 'Aurora Effects',
      description: 'Northern lights simulation',
      icon: <Activity className="w-6 h-6" />,
      particles: 30,
      speed: 0.3,
      colors: ['#10b981', '#3b82f6', '#8b5cf6']
    },
    {
      id: 'nebula',
      name: 'Nebula Clouds',
      description: 'Colorful nebula cloud formations',
      icon: <Zap className="w-6 h-6" />,
      particles: 40,
      speed: 0.2,
      colors: ['#f59e0b', '#ef4444', '#8b5cf6']
    }
  ]

  const currentEffect = effects.find(e => e.id === selectedEffect)

  // Particle class for canvas animations
  class Particle {
    constructor(x, y, color, size, speedX, speedY, type) {
      this.x = x
      this.y = y
      this.color = color
      this.size = size
      this.speedX = speedX
      this.speedY = speedY
      this.type = type
      this.life = 1
      this.decay = Math.random() * 0.01 + 0.005
      this.trail = []
      this.maxTrailLength = 10
    }

    update(canvas, speed) {
      // Update position
      this.x += this.speedX * speed
      this.y += this.speedY * speed

      // Add to trail
      if (this.type === 'meteor') {
        this.trail.push({ x: this.x, y: this.y })
        if (this.trail.length > this.maxTrailLength) {
          this.trail.shift()
        }
      }

      // Wrap around screen
      if (this.x < 0) this.x = canvas.width
      if (this.x > canvas.width) this.x = 0
      if (this.y < 0) this.y = canvas.height
      if (this.y > canvas.height) this.y = 0

      // Life decay for certain effects
      if (this.type === 'meteor' || this.type === 'aurora') {
        this.life -= this.decay
        if (this.life <= 0) {
          this.reset(canvas)
        }
      }
    }

    reset(canvas) {
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height
      this.life = 1
      this.trail = []
    }

    draw(ctx) {
      ctx.save()

      // Draw trail for meteors
      if (this.type === 'meteor' && this.trail.length > 0) {
        ctx.strokeStyle = this.color
        ctx.lineWidth = this.size * 0.5
        ctx.beginPath()
        ctx.moveTo(this.trail[0].x, this.trail[0].y)
        for (let i = 1; i < this.trail.length; i++) {
          ctx.lineTo(this.trail[i].x, this.trail[i].y)
        }
        ctx.stroke()
      }

      // Draw particle
      ctx.fillStyle = this.color
      ctx.globalAlpha = this.life
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()

      // Add glow effect
      if (this.type === 'star' || this.type === 'aurora') {
        ctx.shadowBlur = 10
        ctx.shadowColor = this.color
        ctx.fill()
      }

      ctx.restore()
    }
  }

  // Initialize particles
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const newParticles = []

    for (let i = 0; i < particleCount; i++) {
      const color = currentEffect.colors[Math.floor(Math.random() * currentEffect.colors.length)]
      const size = Math.random() * 3 + 1
      const speedX = (Math.random() - 0.5) * 2
      const speedY = (Math.random() - 0.5) * 2

      newParticles.push(new Particle(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        color,
        size,
        speedX,
        speedY,
        selectedEffect
      ))
    }

    setParticles(newParticles)
  }, [selectedEffect, particleCount])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    const animate = () => {
      if (!isPlaying) return

      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid if enabled
      if (showGrid) {
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.1)'
        ctx.lineWidth = 1
        for (let i = 0; i <= 20; i++) {
          const x = (canvas.width / 20) * i
          const y = (canvas.height / 20) * i
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }
      }

      // Update and draw particles
      particles.forEach(particle => {
        particle.update(canvas, effectSpeed)
        particle.draw(ctx)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    if (isPlaying) {
      animate()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, effectSpeed, particles, showGrid])

  const EffectCard = ({ effect }) => (
    <motion.div
      className={`control-panel cursor-pointer ${
        selectedEffect === effect.id ? 'border-cosmic-nebula-purple/50' : ''
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setSelectedEffect(effect.id)}
    >
      <div className="flex items-center space-x-3 mb-2">
        <div className="text-cosmic-star-yellow">
          {effect.icon}
        </div>
        <h3 className="font-bold">{effect.name}</h3>
      </div>
      <p className="text-sm text-gray-400 mb-2">{effect.description}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">Particles: {effect.particles}</span>
        <span className="text-gray-400">Speed: {effect.speed}x</span>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="control-panel">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-2 bg-cosmic-nebula-purple/30 border border-cosmic-nebula-purple/50 rounded flex items-center space-x-2 hover:bg-cosmic-nebula-purple/50 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            
            <button
              onClick={() => {
                const canvas = canvasRef.current
                const ctx = canvas.getContext('2d')
                ctx.clearRect(0, 0, canvas.width, canvas.height)
              }}
              className="px-3 py-2 bg-cosmic-galaxy-blue/30 border border-cosmic-galaxy-blue/50 rounded flex items-center space-x-2 hover:bg-cosmic-galaxy-blue/50 transition-colors"
            >
              <RotateCw className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Speed:</span>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={effectSpeed}
                onChange={(e) => setEffectSpeed(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-white">{effectSpeed}x</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Particles:</span>
              <input
                type="range"
                min="10"
                max="200"
                step="10"
                value={particleCount}
                onChange={(e) => setParticleCount(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-white">{particleCount}</span>
            </div>
            
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                showGrid 
                  ? 'bg-cosmic-aurora-green/30 border-cosmic-aurora-green/50' 
                  : 'bg-space-dark/50 border-gray-500/50'
              }`}
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* Effect Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {effects.map((effect) => (
          <EffectCard key={effect.id} effect={effect} />
        ))}
      </div>

      {/* Canvas Demo */}
      <div className="space-card">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-cosmic-star-yellow" />
          Background Effect Demo: {currentEffect.name}
        </h3>
        
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="w-full rounded-lg bg-black border border-cosmic-nebula-purple/30"
          />
          
          {/* Overlay info */}
          <div className="absolute top-4 left-4 bg-black/70 rounded p-2 text-xs">
            <div className="text-cosmic-star-yellow mb-1">Effect Info</div>
            <div>Type: {currentEffect.name}</div>
            <div>Particles: {particleCount}</div>
            <div>Speed: {effectSpeed}x</div>
            <div>Status: {isPlaying ? 'Playing' : 'Paused'}</div>
          </div>
        </div>
      </div>

      {/* Color Palette */}
      <div className="space-card">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-cosmic-nebula-purple" />
          Color Palette
        </h3>
        
        <div className="flex items-center space-x-4">
          {currentEffect.colors.map((color, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded-full border-2 border-white/20"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-400 font-mono">{color}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-card">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-cosmic-nebula-purple" />
            Performance Optimization
          </h3>
          
          <div className="space-y-3">
            <div className="control-panel p-3">
              <h4 className="font-bold text-cosmic-star-yellow mb-2">Canvas Optimization</h4>
              <p className="text-sm text-gray-300">
                Use requestAnimationFrame for smooth 60fps animations
              </p>
            </div>
            
            <div className="control-panel p-3">
              <h4 className="font-bold text-cosmic-nebula-purple mb-2">Particle Management</h4>
              <p className="text-sm text-gray-300">
                Limit particle count based on device capabilities
              </p>
            </div>
            
            <div className="control-panel p-3">
              <h4 className="font-bold text-cosmic-aurora-green mb-2">Memory Management</h4>
              <p className="text-sm text-gray-300">
                Clear canvas and reuse particles to prevent memory leaks
              </p>
            </div>
            
            <div className="control-panel p-3">
              <h4 className="font-bold text-cosmic-galaxy-blue mb-2">Responsive Design</h4>
              <p className="text-sm text-gray-300">
                Adjust particle count based on screen size
              </p>
            </div>
          </div>
        </div>

        <div className="space-card">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-cosmic-galaxy-blue" />
            Implementation Tips
          </h3>
          
          <div className="space-y-3">
            <div className="control-panel p-3">
              <h4 className="font-bold text-cosmic-star-yellow mb-2">Layer Management</h4>
              <p className="text-sm text-gray-300">
                Use multiple canvas layers for complex effects
              </p>
            </div>
            
            <div className="control-panel p-3">
              <h4 className="font-bold text-cosmic-nebula-purple mb-2">Effect Combinations</h4>
              <p className="text-sm text-gray-300">
                Blend multiple effects for unique visual experiences
              </p>
            </div>
            
            <div className="control-panel p-3">
              <h4 className="font-bold text-cosmic-aurora-green mb-2">User Preferences</h4>
              <p className="text-sm text-gray-300">
                Respect reduced motion preferences for accessibility
              </p>
            </div>
            
            <div className="control-panel p-3">
              <h4 className="font-bold text-cosmic-galaxy-blue mb-2">Mobile Optimization</h4>
              <p className="text-sm text-gray-300">
                Reduce effects on mobile devices for better performance
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BackgroundEffects
