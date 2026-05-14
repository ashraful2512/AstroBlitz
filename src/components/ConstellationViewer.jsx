import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Telescope,
  Star,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Heart,
  Sparkles,
  Search,
  X
} from 'lucide-react'

const ConstellationViewer = () => {
  const [selectedConstellation, setSelectedConstellation] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [showGrid, setShowGrid] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const starMapRef = useRef(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Add custom scrollbar styles
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .constellation-scrollbar::-webkit-scrollbar {
        width: 10px;
      }
      .constellation-scrollbar::-webkit-scrollbar-track {
        background: #1e1b4b;
        border-radius: 5px;
      }
      .constellation-scrollbar::-webkit-scrollbar-thumb {
        background: #7c3aed;
        border-radius: 5px;
      }
      .constellation-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #8b5cf6;
      }
      .constellation-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: #7c3aed #1e1b4b;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  const [isAnimating, setIsAnimating] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [shootingStars, setShootingStars] = useState([])
  
  // Individual constellation movement states
  const [constellationMovements, setConstellationMovements] = useState({})

  const canvasRef = useRef(null)
  const animationRef = useRef()

  const constellations = [
    {
      id: 'orion',
      name: 'Orion',
      type: 'Zodiac',
      season: 'Winter',
      description:
        'The Hunter constellation, one of the most recognizable patterns in the night sky.',
      mythology:
        'Named after a hunter in Greek mythology, Orion is visible worldwide and contains famous stars like Betelgeuse and Rigel.',
      stars: [
        {
          id: 'betelgeuse',
          x: 0.25,
          y: 0.25,
          magnitude: 0.5,
          name: 'Betelgeuse',
          type: 'Red Supergiant'
        },
        {
          id: 'rigel',
          x: 0.75,
          y: 0.75,
          magnitude: 0.2,
          name: 'Rigel',
          type: 'Blue Supergiant'
        },
        {
          id: 'bellatrix',
          x: 0.3,
          y: 0.3,
          magnitude: 1.6,
          name: 'Bellatrix',
          type: 'Blue Giant'
        },
        {
          id: 'mintaka',
          x: 0.5,
          y: 0.5,
          magnitude: 2.2,
          name: 'Mintaka',
          type: 'Blue Supergiant'
        },
        {
          id: 'alnilam',
          x: 0.5,
          y: 0.45,
          magnitude: 1.7,
          name: 'Alnilam',
          type: 'Blue Supergiant'
        },
        {
          id: 'alnitak',
          x: 0.5,
          y: 0.55,
          magnitude: 1.8,
          name: 'Alnitak',
          type: 'Blue Supergiant'
        },
        {
          id: 'saiph',
          x: 0.7,
          y: 0.7,
          magnitude: 2.1,
          name: 'Saiph',
          type: 'Blue Supergiant'
        }
      ],
      connections: [
        ['betelgeuse', 'bellatrix'],
        ['bellatrix', 'mintaka'],
        ['mintaka', 'alnilam'],
        ['alnilam', 'alnitak'],
        ['alnitak', 'saiph'],
        ['saiph', 'rigel'],
        ['rigel', 'mintaka'],
        ['betelgeuse', 'mintaka']
      ]
    },
    {
      id: 'ursa-major',
      name: 'Ursa Major',
      type: 'Circumpolar',
      season: 'Spring',
      description: 'The Great Bear, contains the famous Big Dipper asterism.',
      mythology: 'In Greek mythology, represents Callisto, turned into a bear by Zeus. The Big Dipper has been used for navigation for centuries.',
      stars: [
        {
          id: 'dubhe',
          x: 0.15,
          y: 0.35,
          magnitude: 1.8,
          name: 'Dubhe',
          type: 'Orange Giant'
        },
        {
          id: 'merak',
          x: 0.25,
          y: 0.45,
          magnitude: 2.3,
          name: 'Merak',
          type: 'Main Sequence'
        },
        {
          id: 'phecda',
          x: 0.35,
          y: 0.55,
          magnitude: 2.4,
          name: 'Phecda',
          type: 'Main Sequence'
        },
        {
          id: 'megrez',
          x: 0.45,
          y: 0.5,
          magnitude: 3.3,
          name: 'Megrez',
          type: 'Main Sequence'
        },
        {
          id: 'alioth',
          x: 0.55,
          y: 0.45,
          magnitude: 1.8,
          name: 'Alioth',
          type: 'Main Sequence'
        },
        {
          id: 'mizar',
          x: 0.65,
          y: 0.4,
          magnitude: 2.0,
          name: 'Mizar',
          type: 'Main Sequence'
        },
        {
          id: 'alkaid',
          x: 0.75,
          y: 0.35,
          magnitude: 1.9,
          name: 'Alkaid',
          type: 'Blue Main Sequence'
        }
      ],
      connections: [
        ['dubhe', 'merak'],
        ['merak', 'phecda'],
        ['phecda', 'megrez'],
        ['megrez', 'alioth'],
        ['alioth', 'mizar'],
        ['mizar', 'alkaid'],
        ['megrez', 'dubhe']
      ]
    },
    {
      id: 'gemini',
      name: 'Gemini',
      type: 'Zodiac',
      season: 'Winter',
      description: 'The Twins constellation, representing Castor and Pollux from Greek mythology.',
      mythology: 'Gemini represents the twin brothers Castor and Pollux. Pollux was immortal while Castor was mortal, and when Castor died, Pollux shared his immortality with him.',
      stars: [
        {
          id: 'pollux',
          x: 0.65,
          y: 0.4,
          magnitude: 1.1,
          name: 'Pollux',
          type: 'Orange Giant'
        },
        {
          id: 'castor',
          x: 0.55,
          y: 0.35,
          magnitude: 1.9,
          name: 'Castor',
          type: 'Multiple Star System'
        },
        {
          id: 'alhena',
          x: 0.7,
          y: 0.5,
          magnitude: 1.9,
          name: 'Alhena',
          type: 'Main Sequence'
        },
        {
          id: 'mebsuta',
          x: 0.6,
          y: 0.25,
          magnitude: 3.1,
          name: 'Mebsuta',
          type: 'Binary Star'
        }
      ],
      connections: [
        ['castor', 'pollux'],
        ['pollux', 'alhena'],
        ['castor', 'mebsuta']
      ]
    },
    {
      id: 'taurus',
      name: 'Taurus',
      type: 'Zodiac',
      season: 'Winter',
      description: 'The Bull constellation, contains the bright star Aldebaran and the Pleiades cluster.',
      mythology: 'Taurus represents Zeus in the form of a white bull, who abducted Europa and carried her across the sea to Crete.',
      stars: [
        {
          id: 'aldebaran',
          x: 0.4,
          y: 0.5,
          magnitude: 0.9,
          name: 'Aldebaran',
          type: 'Orange Giant'
        },
        {
          id: 'elnath',
          x: 0.6,
          y: 0.3,
          magnitude: 1.7,
          name: 'Elnath',
          type: 'Blue Giant'
        },
        {
          id: 'alcyone',
          x: 0.3,
          y: 0.6,
          magnitude: 2.9,
          name: 'Alcyone',
          type: 'Blue Giant'
        },
        {
          id: 'zetatau',
          x: 0.5,
          y: 0.4,
          magnitude: 3.0,
          name: 'Zeta Tauri',
          type: 'Binary Star'
        }
      ],
      connections: [
        ['aldebaran', 'zetatau'],
        ['zetatau', 'elnath'],
        ['aldebaran', 'alcyone']
      ]
    },
    {
      id: 'leo',
      name: 'Leo',
      type: 'Zodiac',
      season: 'Spring',
      description: 'The Lion constellation, representing the Nemean Lion killed by Hercules.',
      mythology: 'Leo represents the Nemean Lion that Hercules killed as part of his twelve labors. Its brightest star is Regulus, the "Little King".',
      stars: [
        {
          id: 'regulus',
          x: 0.7,
          y: 0.6,
          magnitude: 1.4,
          name: 'Regulus',
          type: 'Main Sequence'
        },
        {
          id: 'denebola',
          x: 0.2,
          y: 0.4,
          magnitude: 2.1,
          name: 'Denebola',
          type: 'Main Sequence'
        },
        {
          id: 'algieba',
          x: 0.45,
          y: 0.3,
          magnitude: 2.6,
          name: 'Algieba',
          type: 'Binary Star'
        },
        {
          id: 'zosma',
          x: 0.35,
          y: 0.5,
          magnitude: 2.6,
          name: 'Zosma',
          type: 'Main Sequence'
        },
        {
          id: 'rasalas',
          x: 0.55,
          y: 0.25,
          magnitude: 3.0,
          name: 'Rasalas',
          type: 'Orange Giant'
        },
        {
          id: 'adhafera',
          x: 0.5,
          y: 0.35,
          magnitude: 3.4,
          name: 'Adhafera',
          type: 'Giant'
        }
      ],
      connections: [
        ['regulus', 'zosma'],
        ['zosma', 'denebola'],
        ['denebola', 'adhafera'],
        ['adhafera', 'algieba'],
        ['algieba', 'rasalas'],
        ['rasalas', 'regulus']
      ]
    },
    {
      id: 'scorpius',
      name: 'Scorpius',
      type: 'Zodiac',
      season: 'Summer',
      description: 'The Scorpion, contains the red supergiant Antares.',
      mythology: 'Represents the scorpion that killed Orion in Greek mythology. Antares, its brightest star, is a massive red supergiant.',
      stars: [
        {
          id: 'antares',
          x: 0.5,
          y: 0.5,
          magnitude: 1.0,
          name: 'Antares',
          type: 'Red Supergiant'
        },
        {
          id: 'shaula',
          x: 0.8,
          y: 0.7,
          magnitude: 1.6,
          name: 'Shaula',
          type: 'Binary Star'
        },
        {
          id: 'sargas',
          x: 0.75,
          y: 0.3,
          magnitude: 1.9,
          name: 'Sargas',
          type: 'Yellow Giant'
        },
        {
          id: 'dschubba',
          x: 0.3,
          y: 0.4,
          magnitude: 2.3,
          name: 'Dschubba',
          type: 'Binary Star'
        },
        {
          id: 'graffias',
          x: 0.25,
          y: 0.35,
          magnitude: 2.6,
          name: 'Graffias',
          type: 'Binary Star'
        }
      ],
      connections: [
        ['graffias', 'dschubba'],
        ['dschubba', 'antares'],
        ['antares', 'sargas'],
        ['sargas', 'shaula'],
        ['antares', 'shaula']
      ]
    },
    {
      id: 'cygnus',
      name: 'Cygnus',
      type: 'Summer',
      season: 'Summer',
      description: 'The Swan constellation, also known as the Northern Cross.',
      mythology: 'Cygnus represents several swans in Greek mythology, most commonly Zeus in disguise seducing Leda or Orpheus transformed into a swan after his death.',
      stars: [
        {
          id: 'deneb',
          x: 0.5,
          y: 0.2,
          magnitude: 1.3,
          name: 'Deneb',
          type: 'Blue Supergiant'
        },
        {
          id: 'albireo',
          x: 0.5,
          y: 0.8,
          magnitude: 3.1,
          name: 'Albireo',
          type: 'Binary Star'
        },
        {
          id: 'sadr',
          x: 0.5,
          y: 0.5,
          magnitude: 2.2,
          name: 'Sadr',
          type: 'Yellow Supergiant'
        },
        {
          id: 'gienah',
          x: 0.35,
          y: 0.4,
          magnitude: 2.5,
          name: 'Gienah',
          type: 'Main Sequence'
        },
        {
          id: 'delta-cyg',
          x: 0.65,
          y: 0.6,
          magnitude: 2.9,
          name: 'Delta Cyg',
          type: 'Blue Giant'
        }
      ],
      connections: [
        ['deneb', 'sadr'],
        ['sadr', 'albireo'],
        ['gienah', 'sadr'],
        ['sadr', 'delta-cyg']
      ]
    },
    {
      id: 'cassiopeia',
      name: 'Cassiopeia',
      type: 'Circumpolar',
      season: 'Autumn',
      description: 'The Queen constellation, shaped like a W or M.',
      mythology: 'Named after the vain queen Cassiopeia in Greek mythology, who was placed among the stars as punishment for her vanity.',
      stars: [
        {
          id: 'schedar',
          x: 0.2,
          y: 0.5,
          magnitude: 2.2,
          name: 'Schedar',
          type: 'Orange Giant'
        },
        {
          id: 'caph',
          x: 0.3,
          y: 0.3,
          magnitude: 2.3,
          name: 'Caph',
          type: 'White Giant'
        },
        {
          id: 'gamma-cas',
          x: 0.5,
          y: 0.4,
          magnitude: 2.5,
          name: 'Gamma Cas',
          type: 'Blue Subgiant'
        },
        {
          id: 'ruchbah',
          x: 0.7,
          y: 0.3,
          magnitude: 2.7,
          name: 'Ruchbah',
          type: 'Main Sequence'
        },
        {
          id: 'segin',
          x: 0.8,
          y: 0.5,
          magnitude: 3.4,
          name: 'Segin',
          type: 'Blue Main Sequence'
        }
      ],
      connections: [
        ['schedar', 'caph'],
        ['caph', 'gamma-cas'],
        ['gamma-cas', 'ruchbah'],
        ['ruchbah', 'segin']
      ]
    },
    {
      id: 'perseus',
      name: 'Perseus',
      type: 'Autumn',
      season: 'Autumn',
      description: 'The Hero constellation, representing the Greek hero Perseus.',
      mythology: 'Perseus was the Greek hero who beheaded Medusa and rescued Andromeda. He was the son of Zeus and Danaë.',
      stars: [
        {
          id: 'mirfak',
          x: 0.5,
          y: 0.3,
          magnitude: 1.8,
          name: 'Mirfak',
          type: 'Yellow Supergiant'
        },
        {
          id: 'algol',
          x: 0.6,
          y: 0.5,
          magnitude: 2.1,
          name: 'Algol',
          type: 'Binary Star'
        },
        {
          id: 'atik',
          x: 0.4,
          y: 0.4,
          magnitude: 2.8,
          name: 'Atik',
          type: 'Main Sequence'
        },
        {
          id: 'menkib',
          x: 0.35,
          y: 0.2,
          magnitude: 3.0,
          name: 'Menkib',
          type: 'Blue Giant'
        }
      ],
      connections: [
        ['mirfak', 'atik'],
        ['atik', 'algol'],
        ['mirfak', 'menkib']
      ]
    },
    {
      id: 'aquarius',
      name: 'Aquarius',
      type: 'Zodiac',
      season: 'Autumn',
      description: 'The Water Bearer constellation, representing Ganymede cupbearer to the gods.',
      mythology: 'Aquarius represents Ganymede, the most beautiful mortal who was abducted by Zeus to serve as cupbearer to the gods on Mount Olympus.',
      stars: [
        {
          id: 'sadalsuud',
          x: 0.3,
          y: 0.4,
          magnitude: 2.9,
          name: 'Sadalsuud',
          type: 'Yellow Supergiant'
        },
        {
          id: 'sadalmelik',
          x: 0.4,
          y: 0.3,
          magnitude: 2.9,
          name: 'Sadalmelik',
          type: 'Yellow Supergiant'
        },
        {
          id: 'skat',
          x: 0.5,
          y: 0.5,
          magnitude: 3.3,
          name: 'Skat',
          type: 'Main Sequence'
        },
        {
          id: 'albali',
          x: 0.6,
          y: 0.4,
          magnitude: 3.8,
          name: 'Albali',
          type: 'Subgiant'
        }
      ],
      connections: [
        ['sadalmelik', 'sadalsuud'],
        ['sadalsuud', 'skat'],
        ['skat', 'albali']
      ]
    },
    {
      id: 'pisces',
      name: 'Pisces',
      type: 'Zodiac',
      season: 'Autumn',
      description: 'The Fish constellation, representing two fish tied together.',
      mythology: 'Pisces represents Aphrodite and Eros who transformed into fish to escape the monster Typhon, tied together with a rope to avoid losing each other.',
      stars: [
        {
          id: 'alrescha',
          x: 0.5,
          y: 0.5,
          magnitude: 3.8,
          name: 'Alrescha',
          type: 'Binary Star'
        },
        {
          id: 'eta-pis',
          x: 0.3,
          y: 0.4,
          magnitude: 3.6,
          name: 'Eta Psc',
          type: 'Main Sequence'
        },
        {
          id: 'gamma-pis',
          x: 0.7,
          y: 0.6,
          magnitude: 3.7,
          name: 'Gamma Psc',
          type: 'Main Sequence'
        },
        {
          id: 'omicron-pis',
          x: 0.6,
          y: 0.3,
          magnitude: 4.3,
          name: 'Omicron Psc',
          type: 'Main Sequence'
        }
      ],
      connections: [
        ['eta-pis', 'alrescha'],
        ['alrescha', 'gamma-pis'],
        ['gamma-pis', 'omicron-pis']
      ]
    },
    {
      id: 'aries',
      name: 'Aries',
      type: 'Zodiac',
      season: 'Winter',
      description: 'The Ram constellation, representing the golden ram of Greek mythology.',
      mythology: 'Aries represents the golden ram with the Golden Fleece that Phrixus rode to escape his stepmother. The ram was later sacrificed to Zeus.',
      stars: [
        {
          id: 'hamal',
          x: 0.4,
          y: 0.4,
          magnitude: 2.0,
          name: 'Hamal',
          type: 'Orange Giant'
        },
        {
          id: 'sharatan',
          x: 0.5,
          y: 0.3,
          magnitude: 2.6,
          name: 'Sharatan',
          type: 'Main Sequence'
        },
        {
          id: 'mesartim',
          x: 0.3,
          y: 0.5,
          magnitude: 3.9,
          name: 'Mesartim',
          type: 'Binary Star'
        }
      ],
      connections: [
        ['hamal', 'sharatan'],
        ['hamal', 'mesartim']
      ]
    },
    {
      id: 'sagittarius',
      name: 'Sagittarius',
      type: 'Zodiac',
      season: 'Summer',
      description: 'The Archer constellation, representing a centaur archer.',
      mythology: 'Sagittarius represents Chiron, the wise centaur who was a great teacher and healer. He was accidentally wounded by a poisoned arrow and granted immortality by Zeus.',
      stars: [
        {
          id: 'kaus-australis',
          x: 0.6,
          y: 0.6,
          magnitude: 1.8,
          name: 'Kaus Australis',
          type: 'Orange Giant'
        },
        {
          id: 'nunki',
          x: 0.7,
          y: 0.4,
          magnitude: 2.0,
          name: 'Nunki',
          type: 'Main Sequence'
        },
        {
          id: 'ascella',
          x: 0.4,
          y: 0.5,
          magnitude: 2.6,
          name: 'Ascella',
          type: 'Giant'
        },
        {
          id: 'kaus-media',
          x: 0.5,
          y: 0.3,
          magnitude: 2.7,
          name: 'Kaus Media',
          type: 'Giant'
        }
      ],
      connections: [
        ['kaus-media', 'nunki'],
        ['nunki', 'kaus-australis'],
        ['kaus-australis', 'ascella'],
        ['ascella', 'kaus-media']
      ]
    },
    {
      id: 'capricornus',
      name: 'Capricornus',
      type: 'Zodiac',
      season: 'Autumn',
      description: 'The Sea Goat constellation, representing a mythological creature.',
      mythology: 'Capricornus represents Pan, the goat-legged god who jumped into the Nile River to escape the monster Typhon, with his lower half becoming a fish.',
      stars: [
        {
          id: 'deneb-algedi',
          x: 0.5,
          y: 0.4,
          magnitude: 2.9,
          name: 'Deneb Algedi',
          type: 'Binary Star'
        },
        {
          id: 'dabih',
          x: 0.6,
          y: 0.3,
          magnitude: 3.1,
          name: 'Dabih',
          type: 'Binary Star'
        },
        {
          id: 'nashira',
          x: 0.4,
          y: 0.5,
          magnitude: 3.7,
          name: 'Nashira',
          type: 'Main Sequence'
        }
      ],
      connections: [
        ['dabih', 'deneb-algedi'],
        ['deneb-algedi', 'nashira']
      ]
    },
    {
      id: 'virgo',
      name: 'Virgo',
      type: 'Zodiac',
      season: 'Spring',
      description: 'The Maiden constellation, representing the goddess of justice and agriculture.',
      mythology: 'Virgo represents Astraea, the virgin goddess of justice who was the last immortal to live on Earth during the Golden Age. She ascended to heaven when humanity became wicked.',
      stars: [
        {
          id: 'spica',
          x: 0.5,
          y: 0.5,
          magnitude: 1.0,
          name: 'Spica',
          type: 'Binary Star'
        },
        {
          id: 'porrima',
          x: 0.3,
          y: 0.4,
          magnitude: 2.7,
          name: 'Porrima',
          type: 'Binary Star'
        },
        {
          id: 'vindemiatrix',
          x: 0.7,
          y: 0.3,
          magnitude: 2.8,
          name: 'Vindemiatrix',
          type: 'Giant'
        },
        {
          id: 'auva',
          x: 0.4,
          y: 0.6,
          magnitude: 3.4,
          name: 'Auva',
          type: 'Red Giant'
        }
      ],
      connections: [
        ['porrima', 'spica'],
        ['spica', 'vindemiatrix'],
        ['spica', 'auva']
      ]
    },
    {
      id: 'libra',
      name: 'Libra',
      type: 'Zodiac',
      season: 'Autumn',
      description: 'The Scales constellation, representing balance and justice.',
      mythology: 'Libra represents the scales of justice held by Astraea (Virgo). It symbolizes the balance between day and night, and the weighing of souls in the afterlife.',
      stars: [
        {
          id: 'zubeneschamali',
          x: 0.3,
          y: 0.4,
          magnitude: 2.6,
          name: 'Zubeneschamali',
          type: 'Main Sequence'
        },
        {
          id: 'zubenelgenubi',
          x: 0.5,
          y: 0.5,
          magnitude: 2.8,
          name: 'Zubenelgenubi',
          type: 'Binary Star'
        },
        {
          id: 'brachium',
          x: 0.7,
          y: 0.3,
          magnitude: 3.3,
          name: 'Brachium',
          type: 'Red Giant'
        }
      ],
      connections: [
        ['zubeneschamali', 'zubenelgenubi'],
        ['zubenelgenubi', 'brachium']
      ]
    },
    {
      id: 'andromeda',
      name: 'Andromeda',
      type: 'Autumn',
      season: 'Autumn',
      description: 'The Princess constellation, contains the Andromeda Galaxy.',
      mythology: 'Andromeda was the daughter of Queen Cassiopeia and King Cepheus. She was chained to a rock as a sacrifice to a sea monster but was rescued by Perseus.',
      stars: [
        {
          id: 'alpheratz',
          x: 0.4,
          y: 0.3,
          magnitude: 2.1,
          name: 'Alpheratz',
          type: 'Binary Star'
        },
        {
          id: 'mirach',
          x: 0.5,
          y: 0.5,
          magnitude: 2.1,
          name: 'Mirach',
          type: 'Red Giant'
        },
        {
          id: 'almaak',
          x: 0.6,
          y: 0.7,
          magnitude: 2.3,
          name: 'Almaak',
          type: 'Binary Star'
        },
        {
          id: 'delta-and',
          x: 0.3,
          y: 0.6,
          magnitude: 3.3,
          name: 'Delta And',
          type: 'Orange Giant'
        }
      ],
      connections: [
        ['alpheratz', 'mirach'],
        ['mirach', 'almaak'],
        ['mirach', 'delta-and']
      ]
    },
    {
      id: 'pegasus',
      name: 'Pegasus',
      type: 'Autumn',
      season: 'Autumn',
      description: 'The Winged Horse constellation, contains the Great Square asterism.',
      mythology: 'Pegasus was the winged horse born from the blood of Medusa. He was tamed by Bellerophon and carried heroes on adventures.',
      stars: [
        {
          id: 'markab',
          x: 0.3,
          y: 0.4,
          magnitude: 2.5,
          name: 'Markab',
          type: 'Blue Giant'
        },
        {
          id: 'scheat',
          x: 0.5,
          y: 0.3,
          magnitude: 2.4,
          name: 'Scheat',
          type: 'Red Giant'
        },
        {
          id: 'algenib',
          x: 0.7,
          y: 0.4,
          magnitude: 2.8,
          name: 'Algenib',
          type: 'Blue Subgiant'
        },
        {
          id: 'enif',
          x: 0.8,
          y: 0.6,
          magnitude: 2.4,
          name: 'Enif',
          type: 'Orange Supergiant'
        }
      ],
      connections: [
        ['markab', 'scheat'],
        ['scheat', 'algenib'],
        ['algenib', 'enif'],
        ['enif', 'markab']
      ]
    },
    {
      id: 'draco',
      name: 'Draco',
      type: 'Circumpolar',
      season: 'Summer',
      description: 'The Dragon constellation, winds around the North Star.',
      mythology: 'Draco represents the dragon that guarded the golden apples in the Garden of Hesperides. Hercules killed the dragon as one of his twelve labors.',
      stars: [
        {
          id: 'etamin',
          x: 0.5,
          y: 0.2,
          magnitude: 2.2,
          name: 'Etamin',
          type: 'Orange Giant'
        },
        {
          id: 'rastaban',
          x: 0.4,
          y: 0.3,
          magnitude: 2.8,
          name: 'Rastaban',
          type: 'Yellow Giant'
        },
        {
          id: 'altais',
          x: 0.6,
          y: 0.4,
          magnitude: 3.1,
          name: 'Altais',
          type: 'Main Sequence'
        },
        {
          id: 'aldhibah',
          x: 0.7,
          y: 0.5,
          magnitude: 3.2,
          name: 'Aldhibah',
          type: 'Blue Giant'
        }
      ],
      connections: [
        ['etamin', 'rastaban'],
        ['rastaban', 'altais'],
        ['altais', 'aldhibah']
      ]
    },
    {
      id: 'canis-major',
      name: 'Canis Major',
      type: 'Winter',
      season: 'Winter',
      description: 'The Great Dog constellation, contains Sirius, the brightest star.',
      mythology: 'Canis Major represents one of Orion\'s hunting dogs, following the hunter across the sky. It was placed in the sky by Zeus to help Orion hunt.',
      stars: [
        {
          id: 'sirius',
          x: 0.5,
          y: 0.5,
          magnitude: -1.5,
          name: 'Sirius',
          type: 'Binary Star'
        },
        {
          id: 'adara',
          x: 0.6,
          y: 0.3,
          magnitude: 1.5,
          name: 'Adara',
          type: 'Blue Supergiant'
        },
        {
          id: 'wezen',
          x: 0.4,
          y: 0.6,
          magnitude: 1.8,
          name: 'Wezen',
          type: 'Yellow Supergiant'
        },
        {
          id: 'murzim',
          x: 0.3,
          y: 0.4,
          magnitude: 2.0,
          name: 'Murzim',
          type: 'Binary Star'
        }
      ],
      connections: [
        ['sirius', 'adara'],
        ['sirius', 'wezen'],
        ['sirius', 'murzim']
      ]
    },
    {
      id: 'lyra',
      name: 'Lyra',
      type: 'Summer',
      season: 'Summer',
      description: 'The Lyre constellation, contains Vega, one of the brightest stars.',
      mythology: 'Lyra represents the lyre of Orpheus, the legendary musician. After his death, Zeus placed his lyre in the sky as a constellation.',
      stars: [
        {
          id: 'vega',
          x: 0.5,
          y: 0.3,
          magnitude: 0.0,
          name: 'Vega',
          type: 'Main Sequence'
        },
        {
          id: 'sheliak',
          x: 0.4,
          y: 0.5,
          magnitude: 3.3,
          name: 'Sheliak',
          type: 'Binary Star'
        },
        {
          id: 'sulafat',
          x: 0.6,
          y: 0.5,
          magnitude: 3.2,
          name: 'Sulafat',
          type: 'Giant'
        },
        {
          id: 'delta-lyr',
          x: 0.5,
          y: 0.6,
          magnitude: 4.4,
          name: 'Delta Lyr',
          type: 'Binary Star'
        }
      ],
      connections: [
        ['vega', 'sheliak'],
        ['vega', 'sulafat'],
        ['sheliak', 'delta-lyr'],
        ['sulafat', 'delta-lyr']
      ]
    },
    {
      id: 'aquila',
      name: 'Aquila',
      type: 'Summer',
      season: 'Summer',
      description: 'The Eagle constellation, contains Altair.',
      mythology: 'Aquila represents the eagle that carried Zeus\'s thunderbolts. It was also the eagle that kidnapped Ganymede to become cupbearer to the gods.',
      stars: [
        {
          id: 'altair',
          x: 0.5,
          y: 0.5,
          magnitude: 0.8,
          name: 'Altair',
          type: 'Main Sequence'
        },
        {
          id: 'alshain',
          x: 0.3,
          y: 0.4,
          magnitude: 3.7,
          name: 'Alshain',
          type: 'Subgiant'
        },
        {
          id: 'tarazed',
          x: 0.7,
          y: 0.6,
          magnitude: 2.7,
          name: 'Tarazed',
          type: 'Orange Giant'
        },
        {
          id: 'delta-aql',
          x: 0.4,
          y: 0.6,
          magnitude: 3.4,
          name: 'Delta Aql',
          type: 'Binary Star'
        }
      ],
      connections: [
        ['altair', 'alshain'],
        ['altair', 'tarazed'],
        ['alshain', 'delta-aql'],
        ['tarazed', 'delta-aql']
      ]
    },
    {
      id: 'bootes',
      name: 'Boötes',
      type: 'Spring',
      season: 'Spring',
      description: 'The Herdsman constellation, contains Arcturus, the 4th brightest star.',
      mythology: 'Boötes represents the herdsman who invented the plow. He was placed in the sky by Zeus for his agricultural contributions to humanity.',
      stars: [
        {
          id: 'arcturus',
          x: 0.5,
          y: 0.4,
          magnitude: -0.1,
          name: 'Arcturus',
          type: 'Orange Giant'
        },
        {
          id: 'nekkar',
          x: 0.3,
          y: 0.3,
          magnitude: 3.5,
          name: 'Nekkar',
          type: 'Giant'
        },
        {
          id: 'mu Boo',
          x: 0.7,
          y: 0.5,
          magnitude: 4.3,
          name: 'Mu Boo',
          type: 'Binary Star'
        },
        {
          id: 'epsilon-boo',
          x: 0.6,
          y: 0.3,
          magnitude: 2.4,
          name: 'Epsilon Boo',
          type: 'Yellow Giant'
        }
      ],
      connections: [
        ['arcturus', 'nekkar'],
        ['arcturus', 'epsilon-boo'],
        ['arcturus', 'mu-boo']
      ]
    },
    {
      id: 'delphinus',
      name: 'Delphinus',
      type: 'Summer',
      season: 'Summer',
      description: 'The Dolphin constellation, a small but distinctive pattern.',
      mythology: 'Delphinus represents the dolphin that helped the poet Arion escape from pirates. The dolphin was rewarded by Poseidon with a place in the sky.',
      stars: [
        {
          id: 'sualocin',
          x: 0.4,
          y: 0.4,
          magnitude: 3.8,
          name: 'Sualocin',
          type: 'Binary Star'
        },
        {
          id: 'rotanev',
          x: 0.6,
          y: 0.4,
          magnitude: 3.6,
          name: 'Rotanev',
          type: 'Binary Star'
        },
        {
          id: 'delta-del',
          x: 0.5,
          y: 0.5,
          magnitude: 4.4,
          name: 'Delta Del',
          type: 'Subgiant'
        },
        {
          id: 'epsilon-del',
          x: 0.5,
          y: 0.3,
          magnitude: 4.0,
          name: 'Epsilon Del',
          type: 'Binary Star'
        }
      ],
      connections: [
        ['sualocin', 'delta-del'],
        ['delta-del', 'rotanev'],
        ['sualocin', 'epsilon-del'],
        ['epsilon-del', 'rotanev']
      ]
    },
    {
      id: 'ophiuchus',
      name: 'Ophiuchus',
      type: 'Zodiac',
      season: 'Summer',
      description: 'The Serpent Bearer constellation, the 13th zodiac sign.',
      mythology: 'Ophiuchus represents Asclepius, the god of medicine. He learned healing from snakes and could bring people back from the dead, which angered Zeus.',
      stars: [
        {
          id: 'rasalhague',
          x: 0.5,
          y: 0.3,
          magnitude: 2.1,
          name: 'Rasalhague',
          type: 'Binary Star'
        },
        {
          id: 'sabik',
          x: 0.3,
          y: 0.5,
          magnitude: 2.4,
          name: 'Sabik',
          type: 'Binary Star'
        },
        {
          id: 'cebalrai',
          x: 0.7,
          y: 0.4,
          magnitude: 2.8,
          name: 'Cebalrai',
          type: 'Orange Giant'
        },
        {
          id: 'han',
          x: 0.4,
          y: 0.6,
          magnitude: 2.4,
          name: 'Han',
          type: 'Binary Star'
        }
      ],
      connections: [
        ['rasalhague', 'sabik'],
        ['rasalhague', 'cebalrai'],
        ['sabik', 'han'],
        ['han', 'cebalrai']
      ]
    },
    {
      id: 'cancer',
      name: 'Cancer',
      type: 'Zodiac',
      season: 'Spring',
      description: 'The Crab constellation, representing the crab sent by Hera to fight Hercules.',
      mythology: 'Cancer represents the crab that Hera sent to distract Hercules during his battle with the Hydra. Though the crab was crushed, Hera placed it in the sky as a reward for its service.',
      stars: [
        {
          id: 'taucan',
          x: 0.3,
          y: 0.4,
          magnitude: 3.5,
          name: 'Tarf',
          type: 'Orange Giant'
        },
        {
          id: 'asellus-australis',
          x: 0.5,
          y: 0.5,
          magnitude: 4.7,
          name: 'Asellus Australis',
          type: 'Orange Giant'
        },
        {
          id: 'asellus-borealis',
          x: 0.4,
          y: 0.6,
          magnitude: 4.7,
          name: 'Asellus Borealis',
          type: 'Main Sequence'
        },
        {
          id: 'iota-can',
          x: 0.6,
          y: 0.3,
          magnitude: 4.0,
          name: 'Iota Cnc',
          type: 'White Main Sequence'
        }
      ],
      connections: [
        ['taucan', 'asellus-australis'],
        ['asellus-australis', 'asellus-borealis'],
        ['asellus-australis', 'iota-can']
      ]
    },
    {
      id: 'ursa-minor',
      name: 'Ursa Minor',
      type: 'Circumpolar',
      season: 'Spring',
      description: 'The Little Bear constellation, contains Polaris the North Star.',
      mythology: 'Ursa Minor represents either Arcas, son of Callisto, or the bear that Zeus placed in the sky to guide sailors. Polaris, the North Star, has been used for navigation for millennia.',
      stars: [
        {
          id: 'polaris',
          x: 0.7,
          y: 0.2,
          magnitude: 2.0,
          name: 'Polaris',
          type: 'Yellow Supergiant'
        },
        {
          id: 'kochab',
          x: 0.5,
          y: 0.4,
          magnitude: 2.1,
          name: 'Kochab',
          type: 'Orange Giant'
        },
        {
          id: 'pherkad',
          x: 0.3,
          y: 0.5,
          magnitude: 3.0,
          name: 'Pherkad',
          type: 'White Main Sequence'
        },
        {
          id: 'alkaid',
          x: 0.4,
          y: 0.3,
          magnitude: 4.4,
          name: 'Alkaid',
          type: 'Main Sequence'
        }
      ],
      connections: [
        ['polaris', 'alkaid'],
        ['alkaid', 'kochab'],
        ['kochab', 'pherkad'],
        ['pherkad', 'alkaid']
      ]
    },
    {
      id: 'cepheus',
      name: 'Cepheus',
      type: 'Circumpolar',
      season: 'Autumn',
      description: 'The King constellation, husband of Cassiopeia and father of Andromeda.',
      mythology: 'Cepheus was the king of Ethiopia, husband to the vain queen Cassiopeia and father to Andromeda. He was placed in the sky along with his family.',
      stars: [
        {
          id: 'alfirk',
          x: 0.4,
          y: 0.3,
          magnitude: 3.2,
          name: 'Alfirk',
          type: 'Blue Giant'
        },
        {
          id: 'errai',
          x: 0.5,
          y: 0.5,
          magnitude: 3.4,
          name: 'Errai',
          type: 'Orange Giant'
        },
        {
          id: 'alderamin',
          x: 0.6,
          y: 0.4,
          magnitude: 2.5,
          name: 'Alderamin',
          type: 'White Subgiant'
        },
        {
          id: 'zeta-cep',
          x: 0.3,
          y: 0.6,
          magnitude: 3.4,
          name: 'Zeta Cep',
          type: 'Orange Supergiant'
        }
      ],
      connections: [
        ['alfirk', 'errai'],
        ['errai', 'alderamin'],
        ['errai', 'zeta-cep'],
        ['zeta-cep', 'alfirk']
      ]
    },
    {
      id: 'centaurus',
      name: 'Centaurus',
      type: 'Southern',
      season: 'Spring',
      description: 'The Centaur constellation, contains Alpha Centauri, the closest star system to Earth.',
      mythology: 'Centaurus represents Chiron, the wise centaur who was a great teacher. Unlike other centaurs who were wild and unruly, Chiron was civilized and knowledgeable.',
      stars: [
        {
          id: 'rigil-kentaurus',
          x: 0.4,
          y: 0.5,
          magnitude: -0.3,
          name: 'Rigil Kentaurus',
          type: 'Yellow Main Sequence'
        },
        {
          id: 'hadar',
          x: 0.6,
          y: 0.4,
          magnitude: 0.6,
          name: 'Hadar',
          type: 'Blue Giant'
        },
        {
          id: 'menkent',
          x: 0.3,
          y: 0.6,
          magnitude: 2.1,
          name: 'Menkent',
          type: 'Orange Giant'
        },
        {
          id: 'epsilon-cen',
          x: 0.5,
          y: 0.3,
          magnitude: 2.3,
          name: 'Epsilon Cen',
          type: 'Blue Subgiant'
        }
      ],
      connections: [
        ['rigil-kentaurus', 'hadar'],
        ['rigil-kentaurus', 'menkent'],
        ['hadar', 'epsilon-cen'],
        ['epsilon-cen', 'menkent']
      ]
    },
    {
      id: 'crux',
      name: 'Crux',
      type: 'Southern',
      season: 'Spring',
      description: 'The Southern Cross, the smallest but most famous southern constellation.',
      mythology: 'Crux was originally part of Centaurus but was separated by European explorers. It has been used for navigation in the southern hemisphere for centuries.',
      stars: [
        {
          id: 'acrux',
          x: 0.4,
          y: 0.2,
          magnitude: 1.3,
          name: 'Acrux',
          type: 'Blue Subgiant'
        },
        {
          id: 'gacrux',
          x: 0.4,
          y: 0.8,
          magnitude: 1.6,
          name: 'Gacrux',
          type: 'Red Giant'
        },
        {
          id: 'becrux',
          x: 0.2,
          y: 0.5,
          magnitude: 1.3,
          name: 'Becrux',
          type: 'Blue Subgiant'
        },
        {
          id: 'delta-cru',
          x: 0.6,
          y: 0.5,
          magnitude: 2.8,
          name: 'Delta Cru',
          type: 'Blue Subgiant'
        }
      ],
      connections: [
        ['acrux', 'becrux'],
        ['becrux', 'gacrux'],
        ['gacrux', 'delta-cru'],
        ['delta-cru', 'acrux']
      ]
    },
    {
      id: 'hercules',
      name: 'Hercules',
      type: 'Summer',
      season: 'Summer',
      description: 'The Hero constellation, representing the legendary Greek hero Hercules.',
      mythology: 'Hercules represents the greatest hero in Greek mythology, known for his twelve labors. He was placed among the stars after his death.',
      stars: [
        {
          id: 'rasalgethi',
          x: 0.3,
          y: 0.3,
          magnitude: 2.8,
          name: 'Rasalgethi',
          type: 'Red Supergiant'
        },
        {
          id: 'sarag',
          x: 0.5,
          y: 0.5,
          magnitude: 2.8,
          name: 'Sarag',
          type: 'Yellow Giant'
        },
        {
          id: 'kornephoros',
          x: 0.7,
          y: 0.4,
          magnitude: 2.8,
          name: 'Kornephoros',
          type: 'Yellow Giant'
        },
        {
          id: 'pi-her',
          x: 0.4,
          y: 0.6,
          magnitude: 3.2,
          name: 'Pi Her',
          type: 'Main Sequence'
        }
      ],
      connections: [
        ['rasalgethi', 'sarag'],
        ['sarag', 'kornephoros'],
        ['sarag', 'pi-her'],
        ['pi-her', 'rasalgethi']
      ]
    },
    {
      id: 'serpens',
      name: 'Serpens',
      type: 'Summer',
      season: 'Summer',
      description: 'The Serpent constellation, unique as it is split into two parts.',
      mythology: 'Serpens represents the serpent held by Ophiuchus (the Serpent Bearer). It is the only constellation divided into two parts: Serpens Caput (Head) and Serpens Cauda (Tail).',
      stars: [
        {
          id: 'unukalhai',
          x: 0.3,
          y: 0.4,
          magnitude: 2.6,
          name: 'Unukalhai',
          type: 'Orange Giant'
        },
        {
          id: 'eta-ser',
          x: 0.5,
          y: 0.5,
          magnitude: 3.3,
          name: 'Eta Ser',
          type: 'Subgiant'
        },
        {
          id: 'mu-ser',
          x: 0.6,
          y: 0.3,
          magnitude: 3.5,
          name: 'Mu Ser',
          type: 'Main Sequence'
        },
        {
          id: 'xi-ser',
          x: 0.4,
          y: 0.6,
          magnitude: 3.5,
          name: 'Xi Ser',
          type: 'Main Sequence'
        }
      ],
      connections: [
        ['unukalhai', 'eta-ser'],
        ['eta-ser', 'mu-ser'],
        ['eta-ser', 'xi-ser'],
        ['xi-ser', 'unukalhai']
      ]
    },
    {
      id: 'corvus',
      name: 'Corvus',
      type: 'Spring',
      season: 'Spring',
      description: 'The Crow constellation, representing Apollo\'s sacred bird.',
      mythology: 'Corvus represents the crow that Apollo sent to fetch water. The crow was late and lied, so Apollo punished it by placing it in the sky near Crater (the cup).',
      stars: [
        {
          id: 'gienah-crv',
          x: 0.3,
          y: 0.4,
          magnitude: 2.6,
          name: 'Gienah Corvus',
          type: 'Blue Giant'
        },
        {
          id: 'kraz',
          x: 0.5,
          y: 0.3,
          magnitude: 2.7,
          name: 'Kraz',
          type: 'Yellow Giant'
        },
        {
          id: 'algorab',
          x: 0.6,
          y: 0.5,
          magnitude: 2.9,
          name: 'Algorab',
          type: 'White Main Sequence'
        },
        {
          id: 'minkar',
          x: 0.4,
          y: 0.6,
          magnitude: 3.0,
          name: 'Minkar',
          type: 'Yellow Giant'
        }
      ],
      connections: [
        ['gienah-crv', 'kraz'],
        ['kraz', 'algorab'],
        ['algorab', 'minkar'],
        ['minkar', 'gienah-crv']
      ]
    },
    {
      id: 'crater',
      name: 'Crater',
      type: 'Spring',
      season: 'Spring',
      description: 'The Cup constellation, representing the cup of Apollo.',
      mythology: 'Crater represents the cup that Apollo gave to the crow (Corvus) to fetch water. When the crow failed in its task, both the bird and cup were placed in the sky.',
      stars: [
        {
          id: 'labrum',
          x: 0.4,
          y: 0.4,
          magnitude: 3.6,
          name: 'Labrum',
          type: 'Orange Giant'
        },
        {
          id: 'delta-crt',
          x: 0.5,
          y: 0.3,
          magnitude: 3.6,
          name: 'Delta Crt',
          type: 'Subgiant'
        },
        {
          id: 'alpha-crt',
          x: 0.6,
          y: 0.5,
          magnitude: 4.1,
          name: 'Alpha Crt',
          type: 'White Main Sequence'
        },
        {
          id: 'gamma-crt',
          x: 0.3,
          y: 0.6,
          magnitude: 4.1,
          name: 'Gamma Crt',
          type: 'Yellow Giant'
        }
      ],
      connections: [
        ['labrum', 'delta-crt'],
        ['delta-crt', 'alpha-crt'],
        ['alpha-crt', 'gamma-crt'],
        ['gamma-crt', 'labrum']
      ]
    },
    {
      id: 'lepus',
      name: 'Lepus',
      type: 'Winter',
      season: 'Winter',
      description: 'The Hare constellation, positioned below Orion.',
      mythology: 'Lepus represents the hare that Orion is hunting. It was placed in the sky beneath Orion as his eternal prey.',
      stars: [
        {
          id: 'arneb',
          x: 0.4,
          y: 0.4,
          magnitude: 2.6,
          name: 'Arneb',
          type: 'White Supergiant'
        },
        {
          id: 'nihal',
          x: 0.5,
          y: 0.3,
          magnitude: 2.8,
          name: 'Nihal',
          type: 'Yellow Giant'
        },
        {
          id: 'epsilon-lep',
          x: 0.6,
          y: 0.5,
          magnitude: 3.2,
          name: 'Epsilon Lep',
          type: 'Orange Giant'
        },
        {
          id: 'mu-lep',
          x: 0.3,
          y: 0.6,
          magnitude: 3.3,
          name: 'Mu Lep',
          type: 'Blue Main Sequence'
        }
      ],
      connections: [
        ['arneb', 'nihal'],
        ['nihal', 'epsilon-lep'],
        ['epsilon-lep', 'mu-lep'],
        ['mu-lep', 'arneb']
      ]
    },
    {
      id: 'monoceros',
      name: 'Monoceros',
      type: 'Winter',
      season: 'Winter',
      description: 'The Unicorn constellation, located between Orion and Canis Major.',
      mythology: 'Monoceros represents the unicorn, a mythical creature. Though relatively faint, it contains beautiful nebulae and star clusters.',
      stars: [
        {
          id: 'alpha-mon',
          x: 0.4,
          y: 0.4,
          magnitude: 3.9,
          name: 'Alpha Mon',
          type: 'Orange Giant'
        },
        {
          id: 'beta-mon',
          x: 0.5,
          y: 0.3,
          magnitude: 3.7,
          name: 'Beta Mon',
          type: 'Blue Giant'
        },
        {
          id: 'gamma-mon',
          x: 0.6,
          y: 0.5,
          magnitude: 4.0,
          name: 'Gamma Mon',
          type: 'Blue Main Sequence'
        },
        {
          id: 'delta-mon',
          x: 0.3,
          y: 0.6,
          magnitude: 4.2,
          name: 'Delta Mon',
          type: 'Blue Main Sequence'
        }
      ],
      connections: [
        ['alpha-mon', 'beta-mon'],
        ['beta-mon', 'gamma-mon'],
        ['gamma-mon', 'delta-mon'],
        ['delta-mon', 'alpha-mon']
      ]
    },
    {
      id: 'canis-minor',
      name: 'Canis Minor',
      type: 'Winter',
      season: 'Winter',
      description: 'The Little Dog constellation, representing one of Orion\'s hunting dogs.',
      mythology: 'Canis Minor represents the smaller of Orion\'s two hunting dogs, often identified as Maera, the dog of Icarius.',
      stars: [
        {
          id: 'procyon',
          x: 0.4,
          y: 0.5,
          magnitude: 0.4,
          name: 'Procyon',
          type: 'Yellow White Main Sequence'
        },
        {
          id: 'gomeisa',
          x: 0.6,
          y: 0.3,
          magnitude: 2.9,
          name: 'Gomeisa',
          type: 'Blue Main Sequence'
        },
        {
          id: 'epsilon-cmi',
          x: 0.3,
          y: 0.4,
          magnitude: 4.9,
          name: 'Epsilon Cmi',
          type: 'Yellow Giant'
        },
        {
          id: 'beta-cmi',
          x: 0.5,
          y: 0.6,
          magnitude: 3.0,
          name: 'Beta Cmi',
          type: 'Blue Main Sequence'
        }
      ],
      connections: [
        ['procyon', 'gomeisa'],
        ['procyon', 'epsilon-cmi'],
        ['procyon', 'beta-cmi'],
        ['gomeisa', 'beta-cmi']
      ]
    },
    {
      id: 'lacerta',
      name: 'Lacerta',
      type: 'Northern',
      season: 'Autumn',
      description: 'The Lizard constellation, a small northern constellation between Cygnus and Andromeda.',
      mythology: 'Lacerta is a modern constellation created by Johannes Hevelius in 1687, representing a lizard. It contains no bright stars but has several deep-sky objects.',
      stars: [
        {
          id: 'alpha-lac',
          x: 0.3,
          y: 0.4,
          magnitude: 3.8,
          name: 'Alpha Lac',
          type: 'Orange Giant'
        },
        {
          id: 'beta-lac',
          x: 0.5,
          y: 0.5,
          magnitude: 4.4,
          name: 'Beta Lac',
          type: 'Main Sequence'
        },
        {
          id: '1-lac',
          x: 0.6,
          y: 0.3,
          magnitude: 4.1,
          name: '1 Lac',
          type: 'Blue Main Sequence'
        },
        {
          id: '2-lac',
          x: 0.4,
          y: 0.6,
          magnitude: 4.6,
          name: '2 Lac',
          type: 'Main Sequence'
        }
      ],
      connections: [
        ['alpha-lac', 'beta-lac'],
        ['beta-lac', '1-lac'],
        ['beta-lac', '2-lac'],
        ['1-lac', '2-lac']
      ]
    },
    {
      id: 'lynx',
      name: 'Lynx',
      type: 'Northern',
      season: 'Spring',
      description: 'The Lynx constellation, named for its faint stars requiring lynx-eyed vision to see.',
      mythology: 'Lynx was created by Johannes Hevelius in 1687. The constellation was named because its stars are so faint that only a lynx could see them.',
      stars: [
        {
          id: 'alpha-lyn',
          x: 0.3,
          y: 0.4,
          magnitude: 3.1,
          name: 'Alpha Lyn',
          type: 'Orange Giant'
        },
        {
          id: '38-lyn',
          x: 0.5,
          y: 0.5,
          magnitude: 3.8,
          name: '38 Lyn',
          type: 'Blue Main Sequence'
        },
        {
          id: '31-lyn',
          x: 0.6,
          y: 0.3,
          magnitude: 4.3,
          name: '31 Lyn',
          type: 'Main Sequence'
        },
        {
          id: '10-uma',
          x: 0.4,
          y: 0.6,
          magnitude: 4.0,
          name: '10 UMa',
          type: 'Main Sequence'
        }
      ],
      connections: [
        ['alpha-lyn', '38-lyn'],
        ['38-lyn', '31-lyn'],
        ['38-lyn', '10-uma'],
        ['31-lyn', '10-uma']
      ]
    },
    {
      id: 'triangulum',
      name: 'Triangulum',
      type: 'Northern',
      season: 'Autumn',
      description: 'The Triangle constellation, contains the Triangulum Galaxy.',
      mythology: 'Triangulum represents the Nile Delta triangle or the island of Sicily. It contains the Triangulum Galaxy, the third-largest galaxy in our Local Group.',
      stars: [
        {
          id: 'beta-tri',
          x: 0.3,
          y: 0.4,
          magnitude: 3.0,
          name: 'Beta Tri',
          type: 'Yellow Giant'
        },
        {
          id: 'alpha-tri',
          x: 0.5,
          y: 0.5,
          magnitude: 3.4,
          name: 'Alpha Tri',
          type: 'White Subgiant'
        },
        {
          id: 'gamma-tri',
          x: 0.6,
          y: 0.3,
          magnitude: 4.0,
          name: 'Gamma Tri',
          type: 'Main Sequence'
        },
        {
          id: 'iota-tri',
          x: 0.4,
          y: 0.6,
          magnitude: 4.9,
          name: 'Iota Tri',
          type: 'Yellow Giant'
        }
      ],
      connections: [
        ['beta-tri', 'alpha-tri'],
        ['alpha-tri', 'gamma-tri'],
        ['gamma-tri', 'beta-tri'],
        ['alpha-tri', 'iota-tri']
      ]
    },
    {
      id: 'carina',
      name: 'Carina',
      type: 'Southern',
      season: 'Winter',
      description: 'The Keel constellation, contains Canopus, the second brightest star in the night sky.',
      mythology: 'Carina represents the keel of the ship Argo Navis. It was separated from the larger Argo Navis constellation by Lacaille in 1752.',
      stars: [
        {
          id: 'canopus',
          x: 0.4,
          y: 0.5,
          magnitude: -0.7,
          name: 'Canopus',
          type: 'Yellow White Giant'
        },
        {
          id: 'miaplacidus',
          x: 0.6,
          y: 0.4,
          magnitude: 1.7,
          name: 'Miaplacidus',
          type: 'Blue Subgiant'
        },
        {
          id: 'avior',
          x: 0.3,
          y: 0.6,
          magnitude: 1.9,
          name: 'Avior',
          type: 'Yellow Giant'
        },
        {
          id: 'aspidiske',
          x: 0.5,
          y: 0.3,
          magnitude: 2.2,
          name: 'Aspidiske',
          type: 'White Supergiant'
        }
      ],
      connections: [
        ['canopus', 'miaplacidus'],
        ['canopus', 'avior'],
        ['miaplacidus', 'aspidiske'],
        ['avior', 'aspidiske']
      ]
    },
    {
      id: 'vela',
      name: 'Vela',
      type: 'Southern',
      season: 'Spring',
      description: 'The Sails constellation, part of the former Argo Navis ship.',
      mythology: 'Vela represents the sails of the ship Argo Navis. It was separated from the larger constellation along with Carina and Puppis.',
      stars: [
        {
          id: 'gamma-vel',
          x: 0.4,
          y: 0.5,
          magnitude: 1.8,
          name: 'Gamma Vel',
          type: 'Wolf-Rayet Star'
        },
        {
          id: 'delta-vel',
          x: 0.6,
          y: 0.4,
          magnitude: 2.0,
          name: 'Delta Vel',
          type: 'Blue Giant'
        },
        {
          id: 'lambda-vel',
          x: 0.3,
          y: 0.6,
          magnitude: 2.2,
          name: 'Lambda Vel',
          type: 'Orange Giant'
        },
        {
          id: 'kappa-vel',
          x: 0.5,
          y: 0.3,
          magnitude: 2.5,
          name: 'Kappa Vel',
          type: 'Blue Subgiant'
        }
      ],
      connections: [
        ['gamma-vel', 'delta-vel'],
        ['gamma-vel', 'lambda-vel'],
        ['delta-vel', 'kappa-vel'],
        ['lambda-vel', 'kappa-vel']
      ]
    },
    {
      id: 'puppis',
      name: 'Puppis',
      type: 'Southern',
      season: 'Winter',
      description: 'The Poop Deck constellation, part of the former Argo Navis ship.',
      mythology: 'Puppis represents the poop deck of the ship Argo Navis. Like Carina and Vela, it was separated from the larger constellation in 1752.',
      stars: [
        {
          id: 'zeta-pup',
          x: 0.4,
          y: 0.5,
          magnitude: 2.3,
          name: 'Zeta Pup',
          type: 'Blue Supergiant'
        },
        {
          id: 'pi-pup',
          x: 0.6,
          y: 0.4,
          magnitude: 2.7,
          name: 'Pi Pup',
          type: 'Yellow Supergiant'
        },
        {
          id: 'rho-pup',
          x: 0.3,
          y: 0.6,
          magnitude: 2.8,
          name: 'Rho Pup',
          type: 'Orange Giant'
        },
        {
          id: 'tau-pup',
          x: 0.5,
          y: 0.3,
          magnitude: 2.9,
          name: 'Tau Pup',
          type: 'Blue Subgiant'
        }
      ],
      connections: [
        ['zeta-pup', 'pi-pup'],
        ['zeta-pup', 'rho-pup'],
        ['pi-pup', 'tau-pup'],
        ['rho-pup', 'tau-pup']
      ]
    },
    {
      id: 'sextans',
      name: 'Sextans',
      type: 'Equatorial',
      season: 'Spring',
      description: 'The Sextant constellation, representing the astronomical instrument.',
      mythology: 'Sextans was introduced by Johannes Hevelius in 1687 to represent the sextant he used for astronomical observations.',
      stars: [
        {
          id: 'alpha-sex',
          x: 0.4,
          y: 0.5,
          magnitude: 4.5,
          name: 'Alpha Sex',
          type: 'Yellow Giant'
        },
        {
          id: 'beta-sex',
          x: 0.6,
          y: 0.4,
          magnitude: 5.1,
          name: 'Beta Sex',
          type: 'Blue Main Sequence'
        },
        {
          id: 'gamma-sex',
          x: 0.3,
          y: 0.6,
          magnitude: 4.6,
          name: 'Gamma Sex',
          type: 'Yellow Giant'
        },
        {
          id: 'delta-sex',
          x: 0.5,
          y: 0.3,
          magnitude: 5.2,
          name: 'Delta Sex',
          type: 'Blue Main Sequence'
        }
      ],
      connections: [
        ['alpha-sex', 'beta-sex'],
        ['alpha-sex', 'gamma-sex'],
        ['beta-sex', 'delta-sex'],
        ['gamma-sex', 'delta-sex']
      ]
    },
    {
      id: 'sagitta',
      name: 'Sagitta',
      type: 'Northern',
      season: 'Summer',
      description: 'The Arrow constellation, the third smallest constellation.',
      mythology: 'Sagitta represents various arrows in mythology, including Cupid\'s arrow or the arrow that killed Achilles.',
      stars: [
        {
          id: 'gamma-sge',
          x: 0.4,
          y: 0.5,
          magnitude: 3.5,
          name: 'Gamma Sge',
          type: 'Yellow Giant'
        },
        {
          id: 'delta-sge',
          x: 0.6,
          y: 0.4,
          magnitude: 3.7,
          name: 'Delta Sge',
          type: 'Orange Giant'
        },
        {
          id: 'alpha-sge',
          x: 0.3,
          y: 0.6,
          magnitude: 4.4,
          name: 'Alpha Sge',
          type: 'Yellow Giant'
        },
        {
          id: 'beta-sge',
          x: 0.5,
          y: 0.3,
          magnitude: 4.4,
          name: 'Beta Sge',
          type: 'Blue Giant'
        }
      ],
      connections: [
        ['gamma-sge', 'delta-sge'],
        ['gamma-sge', 'alpha-sge'],
        ['delta-sge', 'beta-sge'],
        ['alpha-sge', 'beta-sge']
      ]
    },
    {
      id: 'vulpecula',
      name: 'Vulpecula',
      type: 'Northern',
      season: 'Summer',
      description: 'The Fox constellation, contains the Dumbbell Nebula.',
      mythology: 'Vulpecula was created by Johannes Hevelius as "Vulpecula cum Anser" (Fox with Goose), though the goose is no longer recognized.',
      stars: [
        {
          id: 'alpha-vul',
          x: 0.4,
          y: 0.5,
          magnitude: 4.4,
          name: 'Alpha Vul',
          type: 'Red Giant'
        },
        {
          id: 'beta-vul',
          x: 0.6,
          y: 0.4,
          magnitude: 4.6,
          name: 'Beta Vul',
          type: 'Yellow Giant'
        },
        {
          id: 'gamma-vul',
          x: 0.3,
          y: 0.6,
          magnitude: 5.4,
          name: 'Gamma Vul',
          type: 'Blue Main Sequence'
        },
        {
          id: '23-vul',
          x: 0.5,
          y: 0.3,
          magnitude: 4.5,
          name: '23 Vul',
          type: 'Blue Giant'
        }
      ],
      connections: [
        ['alpha-vul', 'beta-vul'],
        ['alpha-vul', 'gamma-vul'],
        ['beta-vul', '23-vul'],
        ['gamma-vul', '23-vul']
      ]
    },
    {
      id: 'equuleus',
      name: 'Equuleus',
      type: 'Northern',
      season: 'Autumn',
      description: 'The Little Horse constellation, the second smallest constellation.',
      mythology: 'Equuleus represents either Celeris, the brother of Pegasus, or the horse that Mercury gave Castor.',
      stars: [
        {
          id: 'alpha-equ',
          x: 0.4,
          y: 0.5,
          magnitude: 3.9,
          name: 'Alpha Equ',
          type: 'Yellow Giant'
        },
        {
          id: 'delta-equ',
          x: 0.6,
          y: 0.4,
          magnitude: 4.5,
          name: 'Delta Equ',
          type: 'Blue Main Sequence'
        },
        {
          id: 'gamma-equ',
          x: 0.3,
          y: 0.6,
          magnitude: 4.7,
          name: 'Gamma Equ',
          type: 'Blue Subgiant'
        },
        {
          id: 'beta-equ',
          x: 0.5,
          y: 0.3,
          magnitude: 5.2,
          name: 'Beta Equ',
          type: 'Blue Main Sequence'
        }
      ],
      connections: [
        ['alpha-equ', 'delta-equ'],
        ['alpha-equ', 'gamma-equ'],
        ['delta-equ', 'beta-equ'],
        ['gamma-equ', 'beta-equ']
      ]
    },
    {
      id: 'triangulum-australe',
      name: 'Triangulum Australe',
      type: 'Southern',
      season: 'Summer',
      description: 'The Southern Triangle constellation, contains bright stars forming a triangle.',
      mythology: 'Triangulum Australe was introduced in the 16th century and represents the southern triangle, distinct from the northern Triangulum.',
      stars: [
        {
          id: 'alpha-tra',
          x: 0.4,
          y: 0.5,
          magnitude: 1.9,
          name: 'Alpha TrA',
          type: 'Blue Giant'
        },
        {
          id: 'beta-tra',
          x: 0.6,
          y: 0.4,
          magnitude: 2.8,
          name: 'Beta TrA',
          type: 'Yellow Giant'
        },
        {
          id: 'gamma-tra',
          x: 0.3,
          y: 0.6,
          magnitude: 2.9,
          name: 'Gamma TrA',
          type: 'Blue Giant'
        },
        {
          id: 'delta-tra',
          x: 0.5,
          y: 0.3,
          magnitude: 3.9,
          name: 'Delta TrA',
          type: 'Blue Main Sequence'
        }
      ],
      connections: [
        ['alpha-tra', 'beta-tra'],
        ['alpha-tra', 'gamma-tra'],
        ['beta-tra', 'gamma-tra'],
        ['alpha-tra', 'delta-tra']
      ]
    },
    {
      id: 'grus',
      name: 'Grus',
      type: 'Southern',
      season: 'Autumn',
      description: 'The Crane constellation, contains two bright stars.',
      mythology: 'Grus represents the crane, a bird sacred to Hermes. It was one of the 12 southern constellations created by Petrus Plancius.',
      stars: [
        {
          id: 'alpha-gru',
          x: 0.4,
          y: 0.5,
          magnitude: 1.7,
          name: 'Al Nair',
          type: 'Blue Subgiant'
        },
        {
          id: 'beta-gru',
          x: 0.6,
          y: 0.4,
          magnitude: 2.1,
          name: 'Al Dhanab',
          type: 'Red Giant'
        },
        {
          id: 'gamma-gru',
          x: 0.3,
          y: 0.6,
          magnitude: 3.0,
          name: 'Gamma Gru',
          type: 'Blue Giant'
        },
        {
          id: 'delta-gru',
          x: 0.5,
          y: 0.3,
          magnitude: 4.0,
          name: 'Delta Gru',
          type: 'Blue Main Sequence'
        }
      ],
      connections: [
        ['alpha-gru', 'beta-gru'],
        ['alpha-gru', 'gamma-gru'],
        ['beta-gru', 'delta-gru'],
        ['gamma-gru', 'delta-gru']
      ]
    },
    {
      id: 'phoenix',
      name: 'Phoenix',
      type: 'Southern',
      season: 'Autumn',
      description: 'The Phoenix constellation, representing the mythical bird that rises from ashes.',
      mythology: 'Phoenix represents the mythical bird that is reborn from fire. It was one of the 12 southern constellations created by Johann Bayer.',
      stars: [
        {
          id: 'alpha-phe',
          x: 0.4,
          y: 0.5,
          magnitude: 2.4,
          name: 'Ankaa',
          type: 'Orange Giant'
        },
        {
          id: 'beta-phe',
          x: 0.6,
          y: 0.4,
          magnitude: 3.3,
          name: 'Beta Phe',
          type: 'Blue Giant'
        },
        {
          id: 'gamma-phe',
          x: 0.3,
          y: 0.6,
          magnitude: 3.4,
          name: 'Gamma Phe',
          type: 'Blue Subgiant'
        },
        {
          id: 'delta-phe',
          x: 0.5,
          y: 0.3,
          magnitude: 3.9,
          name: 'Delta Phe',
          type: 'Blue Main Sequence'
        }
      ],
      connections: [
        ['alpha-phe', 'beta-phe'],
        ['alpha-phe', 'gamma-phe'],
        ['beta-phe', 'delta-phe'],
        ['gamma-phe', 'delta-phe']
      ]
    }
  ]

  const backgroundStars = [...Array(220)].map(() => ({
    x: Math.random(),
    y: Math.random(),
    size: Math.random() * 2,
    brightness: Math.random()
  }))

  // Filter constellations based on search query
  const filteredConstellations = constellations.filter(constellation =>
    constellation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    constellation.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    constellation.season.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Initialize constellation movements
  useEffect(() => {
    const movements = {}
    constellations.forEach(constellation => {
      movements[constellation.id] = {
        x: Math.random() * 0.8 + 0.1,  // Random position between 10% and 90%
        y: Math.random() * 0.8 + 0.1,
        vx: (Math.random() - 0.5) * 0.00001,  // Extremely slow velocity like stars in sky
        vy: (Math.random() - 0.5) * 0.00001,
        rotation: Math.random() * Math.PI * 2,  // Random initial rotation
        rotationSpeed: (Math.random() - 0.5) * 0.00005,  // Barely perceptible rotation
        scale: 0.8 + Math.random() * 0.4,  // Random scale between 0.8 and 1.2
        pulsePhase: Math.random() * Math.PI * 2  // Random pulse phase
      }
    })
    setConstellationMovements(movements)
  }, [])

  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        // Only update shooting stars, keep constellations static
        if (Math.random() < 0.01) {
          setShootingStars((prev) => [
            ...prev,
            {
              id: Date.now(),
              x: Math.random(),
              y: Math.random(),
              vx: (Math.random() - 0.5) * 0.02,
              vy: Math.random() * 0.02,
              life: 1
            }
          ])
        }

        setShootingStars((prev) =>
          prev
            .map((star) => ({
              ...star,
              x: star.x + star.vx,
              y: star.y + star.vy,
              life: star.life - 0.02
            }))
            .filter((star) => star.life > 0)
        )

        animationRef.current =
          requestAnimationFrame(animate)
      }

      animationRef.current =
        requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating])

  const drawStarMap = () => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext('2d')

    const width = canvas.width
    const height = canvas.height

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)

    // Background stars (static)
    backgroundStars.forEach((star) => {
      ctx.fillStyle = `rgba(251,191,36,${
        star.brightness * 0.8
      })`

      ctx.fillRect(
        star.x * width,
        star.y * height,
        star.size,
        star.size
      )
    })

    // Grid (static)
    if (showGrid) {
      ctx.strokeStyle = 'rgba(168,85,247,0.3)'
      ctx.lineWidth = 1

      for (let i = 0; i <= 10; i++) {
        const x = (width / 10) * i
        const y = (height / 10) * i

        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
    }

    // Static constellations
    constellations.forEach((constellation) => {
      const isActive =
        selectedConstellation?.id ===
        constellation.id

      // Use static positions for stars
      const transformedStars = constellation.stars.map(star => {
        const x = star.x * width
        const y = star.y * height
        const baseSize = isActive ? (4 - star.magnitude) * 3 : (4 - star.magnitude) * 2
        
        return {
          ...star,
          transformedX: x,
          transformedY: y,
          scale: 1,
          z: 0,
          depth: 0,
          baseSize: baseSize
        }
      })

      // Draw connections
      ctx.strokeStyle = isActive
        ? 'rgba(168,85,247,0.8)'
        : 'rgba(168,85,247,0.3)'
      ctx.lineWidth = isActive ? 3 : 1

      constellation.connections.forEach(
        ([start, end]) => {
          const startStar = transformedStars.find(s => s.id === start)
          const endStar = transformedStars.find(s => s.id === end)

          if (startStar && endStar) {
            ctx.beginPath()
            ctx.moveTo(startStar.transformedX, startStar.transformedY)
            ctx.lineTo(endStar.transformedX, endStar.transformedY)
            ctx.stroke()
          }
        }
      )

      // Draw stars
      transformedStars.forEach((star) => {
        const isHovered = hoveredStar?.id === star.id
        const baseSize = star.baseSize || 1
        const size = Math.max(1, isHovered ? baseSize * 1.5 : baseSize)
        
        // Enhanced star glow with pulsing effect
        const baseGlowSize = size * 3
        const hoverGlowSize = size * 8
        const activeGlowSize = size * 6
        const glowSize = Math.max(1, isHovered ? hoverGlowSize : (isActive ? activeGlowSize : baseGlowSize))
        
        // Validate star position before creating gradient
        const starX = Math.max(0, star.transformedX || 0)
        const starY = Math.max(0, star.transformedY || 0)
        
        // Multi-layer glow effect
        if (isHovered || isActive) {
          // Outer glow layer
          const outerGlow = ctx.createRadialGradient(
            starX, starY, 0, 
            starX, starY, glowSize * 1.5
          )
          outerGlow.addColorStop(0, `rgba(147, 51, 234, ${isHovered ? 0.3 : 0.2})`)
          outerGlow.addColorStop(0.5, `rgba(147, 51, 234, ${isHovered ? 0.2 : 0.1})`)
          outerGlow.addColorStop(1, 'rgba(147, 51, 234, 0)')
          ctx.fillStyle = outerGlow
          ctx.fillRect(
            starX - glowSize * 1.5, 
            starY - glowSize * 1.5, 
            glowSize * 3, 
            glowSize * 3
          )
        }
        
        // Main glow layer
        const gradient = ctx.createRadialGradient(
          starX, starY, 0, 
          starX, starY, glowSize
        )
        if (isHovered) {
          gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
          gradient.addColorStop(0.2, 'rgba(251, 191, 36, 0.9)')
          gradient.addColorStop(0.5, 'rgba(251, 191, 36, 0.6)')
          gradient.addColorStop(1, 'rgba(251, 191, 36, 0)')
        } else if (isActive) {
          gradient.addColorStop(0, 'rgba(147, 51, 234, 1)')
          gradient.addColorStop(0.3, 'rgba(147, 51, 234, 0.7)')
          gradient.addColorStop(0.6, 'rgba(251, 191, 36, 0.4)')
          gradient.addColorStop(1, 'rgba(251, 191, 36, 0)')
        } else {
          gradient.addColorStop(0, `rgba(251, 191, 36, 0.6)`)
          gradient.addColorStop(0.3, `rgba(251, 191, 36, 0.3)`)
          gradient.addColorStop(1, 'rgba(251, 191, 36, 0)')
        }
        ctx.fillStyle = gradient
        ctx.fillRect(
          starX - glowSize, 
          starY - glowSize, 
          glowSize * 2, 
          glowSize * 2
        )

        // Star core with enhanced brightness
        ctx.fillStyle = isHovered 
          ? '#ffffff' 
          : (isActive ? '#e9d5ff' : '#f59e0b')
        ctx.beginPath()
        ctx.arc(starX, starY, size * (isHovered ? 1.2 : 1), 0, Math.PI * 2)
        ctx.fill()

        // Enhanced hover ring with animation effect
        if (isHovered) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.arc(starX, starY, size + 8, 0, Math.PI * 2)
          ctx.stroke()
          
          // Inner ring
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(starX, starY, size + 4, 0, Math.PI * 2)
          ctx.stroke()
        } else if (isActive) {
          // Active constellation ring
          ctx.strokeStyle = 'rgba(147, 51, 234, 0.6)'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(starX, starY, size + 6, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Star labels
        if (showLabels && (isActive || isHovered)) {
          ctx.fillStyle = isHovered ? '#ffffff' : '#fbbf24'
          ctx.font = isHovered ? 'bold 11px monospace' : '10px monospace'
          ctx.fillText(star.name, starX + 10, starY - 5)
        }
      })
    })

  // Grid (static)
  if (showGrid) {
    ctx.strokeStyle = 'rgba(168,85,247,0.3)'
    ctx.lineWidth = 1

    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i
      const y = (height / 10) * i

      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
  }

    // Shooting stars (static)
    shootingStars.forEach((star) => {
      const x = star.x * width
      const y = star.y * height

      ctx.strokeStyle = `rgba(251,191,36,${star.life})`
      ctx.lineWidth = 2

      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(
        x - star.vx * 100,
        y - star.vy * 100
      )

      ctx.stroke()
    })
  }

  // Mouse interaction handlers for static constellations
  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvas.width / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / rect.height)
    
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })

    // Check if hovering over any star with static positions
    let foundStar = null

    constellations.forEach(constellation => {
      constellation.stars.forEach(star => {
        const starX = star.x * canvas.width
        const starY = star.y * canvas.height
        
        const distance = Math.sqrt((x - starX) ** 2 + (y - starY) ** 2)
        
        if (distance < 15) {
          foundStar = star
        }
      })
    })
    
    setHoveredStar(foundStar)
  }

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvas.width / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / rect.height)

    constellations.forEach(constellation => {
      constellation.stars.forEach(star => {
        const starX = star.x * canvas.width
        const starY = star.y * canvas.height
        const distance = Math.sqrt((x - starX) ** 2 + (y - starY) ** 2)
        
        if (distance < 15) {
          setSelectedConstellation(constellation)
        }
      })
    })
  }

  useEffect(() => {
    drawStarMap()
  }, [
    selectedConstellation,
    zoom,
    rotation,
    showGrid,
    showLabels,
    shootingStars,
    hoveredStar,
    constellationMovements
  ])

  return (
    <div className="space-y-6 w-full max-w-[1850px] mx-auto px-4">
      {/* CONTROLS */}
      <div className="control-panel p-4 rounded-2xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() =>
                setShowGrid(!showGrid)
              }
              className="px-4 py-2 rounded-lg border border-cosmic-galaxy-blue/40 bg-cosmic-galaxy-blue/20"
            >
              Grid
            </button>

            <button
              onClick={() =>
                setShowLabels(!showLabels)
              }
              className="px-4 py-2 rounded-lg border border-cosmic-nebula-purple/40 bg-cosmic-nebula-purple/20"
            >
              Labels
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setZoom(Math.max(0.5, zoom - 0.1))
              }
              className="p-2 rounded bg-cosmic-galaxy-blue/20 border border-cosmic-galaxy-blue/40"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="text-sm text-gray-400">
              {(zoom * 100).toFixed(0)}%
            </span>

            <button
              onClick={() =>
                setZoom(Math.min(2, zoom + 0.1))
              }
              className="p-2 rounded bg-cosmic-galaxy-blue/20 border border-cosmic-galaxy-blue/40"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={() => setRotation(0)}
              className="px-4 py-2 rounded-lg border border-cosmic-star-yellow/40 bg-cosmic-star-yellow/20 flex items-center gap-2"
            >
              <RotateCw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 items-start">
        {/* STAR MAP CONTAINER */}
        <div ref={starMapRef} className="w-full">
          <div className="space-card p-5 rounded-2xl">
            <h3 className="text-3xl font-bold mb-5 flex items-center">
              <Telescope className="w-7 h-7 mr-3 text-cosmic-nebula-purple" />
              Interactive Star Map
            </h3>

            <div className="relative w-full overflow-hidden rounded-2xl">
              <canvas
                ref={canvasRef}
                width={1600}
                height={950}
                className="w-full h-[700px] border border-cosmic-nebula-purple/30 rounded-2xl bg-black cursor-crosshair"
                style={{
                  transform: `scale(${zoom})`,
                  transition:
                    'transform 0.3s ease'
                }}
                onMouseMove={handleCanvasMouseMove}
                onMouseLeave={() => setHoveredStar(null)}
                onClick={handleCanvasClick}
              />

              {hoveredStar && (
                <div
                  className="absolute bg-space-dark/95 border border-cosmic-nebula-purple/40 rounded-xl p-3 text-sm z-20"
                  style={{
                    left: mousePos.x + 15,
                    top: mousePos.y - 60
                  }}
                >
                  <h4 className="font-bold text-cosmic-star-yellow">
                    {hoveredStar.name}
                  </h4>

                  <p className="text-gray-300">
                    {hoveredStar.type}
                  </p>
                </div>
              )}
            </div>

            {/* LEGEND */}
            <div className="mt-5 flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-cosmic-star-yellow" />
                <span className="text-gray-400">
                  Major Stars
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 border-t border-cosmic-nebula-purple" />
                <span className="text-gray-400">
                  Constellation Lines
                </span>
              </div>
            </div>

            {/* CONSTELLATION INFORMATION PANEL */}
            {selectedConstellation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-bold text-purple-300 flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    {selectedConstellation.name}
                  </h4>
                  <button
                    onClick={() => setSelectedConstellation(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <span className={`ml-2 font-semibold ${
                      selectedConstellation.type === 'Zodiac' ? 'text-green-400' : 'text-blue-400'
                    }`}>
                      {selectedConstellation.type}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Season:</span>
                    <span className="ml-2 font-semibold text-yellow-400">
                      {selectedConstellation.season}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Stars:</span>
                    <span className="ml-2 font-semibold text-purple-400">
                      {selectedConstellation.stars.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Brightest Star:</span>
                    <span className="ml-2 font-semibold text-orange-400">
                      {selectedConstellation.stars.reduce((brightest, star) => 
                        star.magnitude < brightest.magnitude ? star : brightest
                      ).name}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-purple-500/20">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {selectedConstellation.description}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE - CONSTELLATION LIST */}
        <div className="space-y-5 w-full">
          <div className="space-card p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold flex items-center">
                <Star className="w-6 h-6 mr-3 text-cosmic-star-yellow" />
                Constellations
              </h3>
              <span className="text-sm text-gray-400 bg-cosmic-nebula-purple/10 px-3 py-1 rounded-full">
                {filteredConstellations.length} of {constellations.length}
              </span>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Constellations
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-gray-700"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="text-xs text-gray-400 mt-1">
                  Found {filteredConstellations.length} result{filteredConstellations.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="space-y-3 h-[400px] overflow-y-auto pr-3 constellation-scrollbar border border-purple-500/30 rounded-lg bg-purple-900/10 p-2">
              {filteredConstellations.map(
                (constellation) => (
                  <motion.div
                    key={constellation.id}
                    whileHover={{
                      scale: 1.03,
                      y: -4,
                      boxShadow: "0 10px 25px rgba(147, 51, 234, 0.3)"
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSelectedConstellation(constellation)
                      // Scroll to star map
                      if (starMapRef.current) {
                        starMapRef.current.scrollIntoView({ 
                          behavior: 'smooth', 
                          block: 'center' 
                        })
                      }
                    }}
                    className={`control-panel p-4 rounded-xl cursor-pointer transition-all border relative overflow-hidden ${
                      selectedConstellation?.id ===
                      constellation.id
                        ? 'border-cosmic-nebula-purple bg-cosmic-nebula-purple/20 shadow-lg shadow-cosmic-nebula-purple/30'
                        : 'border-transparent hover:border-cosmic-nebula-purple/50 hover:bg-cosmic-nebula-purple/5'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1">
                          {constellation.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={`px-2 py-1 rounded-full ${
                            constellation.type === 'Zodiac' 
                              ? 'bg-cosmic-aurora-green/20 text-cosmic-aurora-green'
                              : 'bg-cosmic-galaxy-blue/20 text-cosmic-galaxy-blue'
                          }`}>
                            {constellation.type}
                          </span>
                          <span className="text-gray-400">
                            {constellation.season}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">
                          {constellation.stars.length} stars
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-300 line-clamp-2">
                      {constellation.description}
                    </p>
                  </motion.div>
                )
              )}
            </div>
          </div>

          </div>

          </div>
  </div>
  )
}

export default ConstellationViewer
