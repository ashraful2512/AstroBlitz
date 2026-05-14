import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Moon,
  Sun,
  Activity,
  Settings,
  Play,
  Pause,
  RotateCw
} from "lucide-react";

const EnhancedAnimations = () => {
  const [isPlaying, setIsPlaying] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [selectedAnimation, setSelectedAnimation] = useState('floating')
  const [showTrails, setShowTrails] = useState(true)
  const [glowIntensity, setGlowIntensity] = useState(0.8)

  // Animation presets
  const animations = [
    {
      id: 'floating',
      name: 'Floating Planets',
      description: 'Smooth floating motion with gentle bobbing',
      icon: <Globe className="w-6 h-6" />,
      variants: {
        initial: { y: 0 },
        animate: { 
          y: [-20, 20, -20],
          rotate: [-5, 5, -5]
        },
        transition: { 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    {
      id: 'pulsing',
      name: 'Pulsing Stars',
      description: 'Rhythmic pulsing with glow effects',
      icon: <Star className="w-6 h-6" />,
      variants: {
        initial: { scale: 1, opacity: 0.8 },
        animate: { 
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8]
        },
        transition: { 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    {
      id: 'orbiting',
      name: 'Orbiting Motion',
      description: 'Circular orbital paths with rotation',
      icon: <Rocket className="w-6 h-6" />,
      variants: {
        initial: { rotate: 0 },
        animate: { 
          rotate: 360
        },
        transition: { 
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }
      }
    },
    {
      id: 'glowing',
      name: 'Glowing Effects',
      description: 'Dynamic glow and shadow animations',
      icon: <Sparkles className="w-6 h-6" />,
      variants: {
        initial: { 
          boxShadow: "0 0 10px rgba(168, 85, 247, 0.3)",
          filter: "brightness(1)"
        },
        animate: { 
          boxShadow: [
            "0 0 10px rgba(168, 85, 247, 0.3)",
            "0 0 30px rgba(168, 85, 247, 0.8)",
            "0 0 10px rgba(168, 85, 247, 0.3)"
          ],
          filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"]
        },
        transition: { 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    {
      id: 'morphing',
      name: 'Shape Morphing',
      description: 'Smooth shape transformations',
      icon: <Zap className="w-6 h-6" />,
      variants: {
        initial: { 
          borderRadius: "20%",
          scale: 1,
          rotate: 0
        },
        animate: { 
          borderRadius: ["20%", "50%", "20%"],
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360]
        },
        transition: { 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    {
      id: 'particle',
      name: 'Particle Effects',
      description: 'Floating particle animations',
      icon: <Activity className="w-6 h-6" />,
      variants: {
        initial: { 
          x: 0,
          y: 0,
          opacity: 0
        },
        animate: { 
          x: [0, 100, -100, 0],
          y: [0, -50, 50, 0],
          opacity: [0, 1, 0.5, 1, 0]
        },
        transition: { 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    }
  ]

  // Demo elements for animations
  const demoElements = [
    { id: 1, type: 'planet', color: '#4169E1', size: 60, name: 'Earth' },
    { id: 2, type: 'star', color: '#fbbf24', size: 40, name: 'Star' },
    { id: 3, type: 'moon', color: '#e5e7eb', size: 30, name: 'Moon' },
    { id: 4, type: 'sun', color: '#f59e0b', size: 80, name: 'Sun' },
    { id: 5, type: 'rocket', color: '#ef4444', size: 50, name: 'Rocket' },
    { id: 6, type: 'satellite', color: '#8b5cf6', size: 35, name: 'Satellite' }
  ]

  const currentAnimation = animations.find(a => a.id === selectedAnimation)

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
              onClick={() => setSelectedAnimation((prev) => {
                const currentIndex = animations.findIndex(a => a.id === prev)
                return animations[(currentIndex + 1) % animations.length].id
              })}
              className="px-3 py-2 bg-cosmic-galaxy-blue/30 border border-cosmic-galaxy-blue/50 rounded flex items-center space-x-2 hover:bg-cosmic-galaxy-blue/50 transition-colors"
            >
              <RotateCw className="w-4 h-4" />
              <span>Next</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Speed:</span>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-white">{animationSpeed}x</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Glow:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={glowIntensity}
                onChange={(e) => setGlowIntensity(Number(e.target.value))}
                className="w-20"
              />
            </div>
            
            <button
              onClick={() => setShowTrails(!showTrails)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                showTrails 
                  ? 'bg-cosmic-aurora-green/30 border-cosmic-aurora-green/50' 
                  : 'bg-space-dark/50 border-gray-500/50'
              }`}
            >
              Trails
            </button>
          </div>
        </div>
      </div>

      {/* Animation Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {animations.map((animation) => (
          <motion.div
            key={animation.id}
            className={`control-panel cursor-pointer ${
              selectedAnimation === animation.id ? 'border-cosmic-nebula-purple/50' : ''
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedAnimation(animation.id)}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="text-cosmic-star-yellow">
                {animation.icon}
              </div>
              <h3 className="font-bold">{animation.name}</h3>
            </div>
            <p className="text-sm text-gray-400">{animation.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Animation Demo Area */}
      <div className="space-card">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-cosmic-star-yellow" />
          Animation Demo: {currentAnimation.name}
        </h3>
        
        <div className="relative h-96 bg-space-dark/50 rounded-lg overflow-hidden">
          {/* Background stars */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

          {/* Animated elements */}
          <div className="relative h-full flex items-center justify-center">
            {demoElements.map((element, index) => (
              <motion.div
                key={element.id}
                className="absolute"
                style={{
                  width: element.size,
                  height: element.size,
                  backgroundColor: element.color,
                  borderRadius: element.type === 'star' ? '50%' : element.type === 'planet' ? '50%' : '20%',
                  boxShadow: showTrails ? `0 0 ${20 * glowIntensity}px ${element.color}` : 'none',
                  filter: `brightness(${1 + glowIntensity * 0.5})`,
                  left: `${20 + (index * 15)}%`,
                  top: `${30 + (index * 10)}%`
                }}
                variants={currentAnimation.variants}
                initial="initial"
                animate={isPlaying ? "animate" : "initial"}
                transition={{
                  ...currentAnimation.variants.transition,
                  duration: currentAnimation.variants.transition.duration / animationSpeed
                }}
              >
                <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                  {element.name}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trail effects */}
          {showTrails && (
            <div className="absolute inset-0 pointer-events-none">
              {demoElements.map((element, index) => (
                <motion.div
                  key={`trail-${element.id}`}
                  className="absolute"
                  style={{
                    width: element.size * 0.8,
                    height: element.size * 0.8,
                    backgroundColor: element.color,
                    borderRadius: element.type === 'star' ? '50%' : element.type === 'planet' ? '50%' : '20%',
                    opacity: 0.3,
                    left: `${20 + (index * 15)}%`,
                    top: `${30 + (index * 10)}%`
                  }}
                  animate={{
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                    opacity: [0.3, 0.1, 0.3]
                  }}
                  transition={{
                    duration: 2 / animationSpeed,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Animation Properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-card">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-cosmic-nebula-purple" />
            Animation Properties
          </h3>
          
          <div className="space-y-3">
            <div className="control-panel p-3">
              <h4 className="font-bold text-cosmic-star-yellow mb-2">Duration</h4>
              <p className="text-sm text-gray-300">
                {currentAnimation.variants.transition.duration / animationSpeed} seconds
              </p>
            </div>
            
            <div className="control-panel p-3">
              <h4 className="font-bold text-cosmic-nebula-purple mb-2">Easing</h4>
              <p className="text-sm text-gray-300">
                {currentAnimation.variants.transition.ease}
              </p>
            </div>
            
            <div className="control-panel p-3">
              <h4 className="font-bold text-cosmic-aurora-green mb-2">Repeat</h4>
              <p className="text-sm text-gray-300">
                Infinite loop
              </p>
            </div>
            
            <div className="control-panel p-3">
              <h4 className="font-bold text-cosmic-galaxy-blue mb-2">Status</h4>
              <p className="text-sm text-gray-300">
                {isPlaying ? 'Playing' : 'Paused'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-card">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-cosmic-galaxy-blue" />
            Performance Tips
          </h3>
          
          <div className="space-y-3">
            <div className="control-panel p-3">
              <h4 className="font-bold text-cosmic-star-yellow mb-2">Optimization</h4>
              <p className="text-sm text-gray-300">
                Use transform and opacity for better performance
              </p>
            </div>
            
            <div className="control-panel p-3">
              <h4 className="font-bold text-cosmic-nebula-purple mb-2">GPU Acceleration</h4>
              <p className="text-sm text-gray-300">
                Enable will-change for complex animations
              </p>
            </div>
            
            <div className="control-panel p-3">
              <h4 className="font-bold text-cosmic-aurora-green mb-2">Reduced Motion</h4>
              <p className="text-sm text-gray-300">
                Respect user preferences for accessibility
              </p>
            </div>
            
            <div className="control-panel p-3">
              <h4 className="font-bold text-cosmic-galaxy-blue mb-2">Frame Rate</h4>
              <p className="text-sm text-gray-300">
                Target 60fps for smooth animations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="space-card">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-cosmic-mars-red" />
          Implementation Examples
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="control-panel p-4">
            <h4 className="font-bold text-cosmic-star-yellow mb-2">Basic Motion</h4>
            <pre className="text-xs bg-space-dark/50 p-2 rounded overflow-x-auto">
{`<motion.div
  animate={{ y: [0, -20, 0] }}
  transition={{ duration: 2 }}
>
  Content
</motion.div>`}
            </pre>
          </div>
          
          <div className="control-panel p-4">
            <h4 className="font-bold text-cosmic-nebula-purple mb-2">Glow Effect</h4>
            <pre className="text-xs bg-space-dark/50 p-2 rounded overflow-x-auto">
{`<motion.div
  animate={{
    boxShadow: [
      "0 0 10px rgba(168, 85, 247, 0.3)",
      "0 0 30px rgba(168, 85, 247, 0.8)"
    ]
  }}
>
  Content
</motion.div>`}
            </pre>
          </div>
          
          <div className="control-panel p-4">
            <h4 className="font-bold text-cosmic-aurora-green mb-2">Orbit Animation</h4>
            <pre className="text-xs bg-space-dark/50 p-2 rounded overflow-x-auto">
{`<motion.div
  animate={{ rotate: 360 }}
  transition={{ 
    duration: 8,
    repeat: Infinity,
    ease: "linear"
  }}
>
  Content
</motion.div>`}
            </pre>
          </div>
          
          <div className="control-panel p-4">
            <h4 className="font-bold text-cosmic-galaxy-blue mb-2">Pulse Effect</h4>
            <pre className="text-xs bg-space-dark/50 p-2 rounded overflow-x-auto">
{`<motion.div
  animate={{
    scale: [1, 1.2, 1],
    opacity: [0.8, 1, 0.8]
  }}
  transition={{ duration: 2 }}
>
  Content
</motion.div>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedAnimations
