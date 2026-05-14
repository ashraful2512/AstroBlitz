import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Brain, Clock, Trophy, Users, Star, Zap, Award, Play, RotateCw, Globe, Rocket } from 'lucide-react'

const AstronomyLearningCenter = () => {
  const [activeSection, setActiveSection] = useState('facts')
  const [currentQuiz, setCurrentQuiz] = useState(null)
  const [quizScore, setQuizScore] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState([])
  const [timelineFilter, setTimelineFilter] = useState('all')

  // Astronomy facts database
  const astronomyFacts = {
    stars: [
      { id: 1, fact: "The Sun contains 99.86% of the Solar System's mass", category: "amazing" },
      { id: 2, fact: "A neutron star can spin up to 600 times per second", category: "amazing" },
      { id: 3, fact: "There are more stars in the universe than grains of sand on Earth", category: "mind-blowing" },
      { id: 4, fact: "The light from the nearest star (Proxima Centauri) takes 4.2 years to reach us", category: "distance" },
      { id: 5, fact: "Betelgeuse is so large that if it were at the center of our Solar System, it would engulf Mars", category: "size" },
      { id: 6, fact: "Stars twinkle because of Earth's atmosphere distorting their light", category: "observation" }
    ],
    planets: [
      { id: 7, fact: "Venus rotates backwards compared to most planets", category: "weird" },
      { id: 8, fact: "Jupiter's Great Red Spot is a storm that has been raging for over 350 years", category: "weather" },
      { id: 9, fact: "Saturn's density is so low it would float in water", category: "physics" },
      { id: 10, fact: "One day on Venus equals 243 Earth days", category: "time" },
      { id: 11, fact: "Mars has the largest volcano in the Solar System - Olympus Mons", category: "geology" },
      { id: 12, fact: "Mercury has extreme temperature variations: -173°C at night to 427°C during day", category: "temperature" }
    ],
    galaxies: [
      { id: 13, fact: "The Milky Way will collide with Andromeda in about 4 billion years", category: "future" },
      { id: 14, fact: "There are an estimated 2 trillion galaxies in the observable universe", category: "numbers" },
      { id: 15, fact: "The center of our galaxy contains a supermassive black hole", category: "black-holes" },
      { id: 16, fact: "Galaxies can contain up to 100 trillion stars", category: "scale" },
      { id: 17, fact: "The Andromeda Galaxy is approaching us at 110 km per second", category: "motion" },
      { id: 18, fact: "Some galaxies are 'cannibalistic' - they merge with and consume smaller galaxies", category: "evolution" }
    ],
    space: [
      { id: 19, fact: "Space is completely silent because there's no atmosphere for sound to travel", category: "physics" },
      { id: 20, fact: "Footprints on the Moon will last for millions of years", category: "moon" },
      { id: 21, fact: "The International Space Station travels at 17,500 mph (28,000 km/h)", category: "ISS" },
      { id: 22, fact: "A day on Venus is longer than its year", category: "time" },
      { id: 23, fact: "Space suits have cooling systems because astronauts can overheat in vacuum", category: "technology" },
      { id: 24, fact: "The coldest place in the universe is on Earth: -272°C in a laboratory", category: "records" }
    ]
  }

  // Quiz questions
  const quizQuestions = [
    {
      id: 1,
      question: "What is the largest planet in our Solar System?",
      options: ["Earth", "Jupiter", "Saturn", "Neptune"],
      correct: 1,
      explanation: "Jupiter is the largest planet with a diameter of 86,881 miles."
    },
    {
      id: 2,
      question: "How long does it take light from the Sun to reach Earth?",
      options: ["8 seconds", "8 minutes", "8 hours", "8 days"],
      correct: 1,
      explanation: "Light takes approximately 8 minutes and 20 seconds to travel from the Sun to Earth."
    },
    {
      id: 3,
      question: "What causes the phases of the Moon?",
      options: ["Earth's shadow", "Moon's orbit around Earth", "Sun's rotation", "Earth's rotation"],
      correct: 1,
      explanation: "Moon phases are caused by the changing angles between the Sun, Earth, and Moon."
    },
    {
      id: 4,
      question: "Which planet has the most moons?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
      correct: 3,
      explanation: "Saturn has 83 confirmed moons, the most in our Solar System."
    },
    {
      id: 5,
      question: "What is a light-year?",
      options: ["The age of light", "The speed of light", "Distance light travels in one year", "A year on a light planet"],
      correct: 2,
      explanation: "A light-year is the distance that light travels in one year, about 6 trillion miles."
    }
  ]

  // Timeline of astronomical discoveries
  const discoveries = [
    { year: "1609", event: "Galileo discovers Jupiter's moons", scientist: "Galileo Galilei", category: "telescope" },
    { year: "1687", event: "Newton publishes laws of motion and gravity", scientist: "Isaac Newton", category: "physics" },
    { year: "1781", event: "Discovery of Uranus", scientist: "William Herschel", category: "planets" },
    { year: "1846", event: "Discovery of Neptune", scientist: "Johann Galle", category: "planets" },
    { year: "1929", event: "Hubble discovers universe expansion", scientist: "Edwin Hubble", category: "cosmology" },
    { year: "1930", event: "Discovery of Pluto", scientist: "Clyde Tombaugh", category: "planets" },
    { year: "1965", event: "Discovery of cosmic microwave background", scientist: "Arno Penzias & Robert Wilson", category: "cosmology" },
    { year: "1969", event: "First human landing on the Moon", scientist: "NASA Apollo 11", category: "space-exploration" },
    { year: "1995", event: "Discovery of first exoplanet", scientist: "Michel Mayor & Didier Queloz", category: "exoplanets" },
    { year: "2015", event: "First detection of gravitational waves", scientist: "LIGO team", category: "physics" },
    { year: "2019", event: "First image of a black hole", scientist: "Event Horizon Telescope", category: "black-holes" },
    { year: "2022", event: "James Webb Space Telescope begins observations", scientist: "NASA/ESA/CSA", category: "telescope" }
  ]

  // Famous astronomers
  const astronomers = [
    {
      id: 1,
      name: "Galileo Galilei",
      lived: "1564-1642",
      nationality: "Italian",
      achievements: ["First to use telescope for astronomy", "Discovered Jupiter's four largest moons", "Observed Venus phases", "Championed heliocentric model"],
      image: "🔭"
    },
    {
      id: 2,
      name: "Isaac Newton",
      lived: "1643-1727",
      nationality: "English",
      achievements: ["Laws of motion", "Law of universal gravitation", "Invented reflecting telescope", "Explained planetary motion"],
      image: "🍎"
    },
    {
      id: 3,
      name: "Albert Einstein",
      lived: "1879-1955",
      nationality: "German-American",
      achievements: ["Theory of relativity", "E=mc²", "Predicted gravitational waves", "Explained photoelectric effect"],
      image: "⚡"
    },
    {
      id: 4,
      name: "Edwin Hubble",
      lived: "1889-1953",
      nationality: "American",
      achievements: ["Discovered universe expansion", "Hubble's Law", "Classified galaxies", "Measured cosmic distances"],
      image: "🌌"
    },
    {
      id: 5,
      name: "Carl Sagan",
      lived: "1934-1996",
      nationality: "American",
      achievements: ["Popularized astronomy", "SETI research", "Cosmos TV series", "Voyager Golden Record"],
      image: "🚀"
    },
    {
      id: 6,
      name: "Jocelyn Bell Burnell",
      lived: "1943-present",
      nationality: "Northern Irish",
      achievements: ["Discovered pulsars", "Radio astronomy pioneer", "Women in science advocate"],
      image: "⭐"
    },
    {
      id: 7,
      name: "Henrietta Swan Leavitt",
      lived: "1868-1921",
      nationality: "American",
      achievements: ["Discovered the period-luminosity relation", "Made Cepheid variables useful for distance measurement", "Helped establish the cosmic distance ladder"],
      image: "📏"
    },
    {
      id: 8,
      name: "Annie Jump Cannon",
      lived: "1863-1941",
      nationality: "American",
      achievements: ["Created the modern stellar classification system", "Classified hundreds of thousands of stars", "Pioneered large-scale astronomical cataloging"],
      image: "🌈"
    },
    {
      id: 9,
      name: "Cecilia Payne-Gaposchkin",
      lived: "1900-1979",
      nationality: "British-American",
      achievements: ["Showed stars are mostly hydrogen and helium", "Transformed stellar astrophysics", "First woman to chair a Harvard department"],
      image: "☀️"
    },
    {
      id: 10,
      name: "Vera Rubin",
      lived: "1928-2016",
      nationality: "American",
      achievements: ["Provided key evidence for dark matter", "Measured galaxy rotation curves", "Advanced observational cosmology"],
      image: "🌑"
    },
    {
      id: 11,
      name: "Subrahmanyan Chandrasekhar",
      lived: "1910-1995",
      nationality: "Indian-American",
      achievements: ["Calculated the Chandrasekhar limit", "Explained white dwarf stability", "Nobel Prize in Physics"],
      image: "⚪"
    },
    {
      id: 12,
      name: "Caroline Herschel",
      lived: "1750-1848",
      nationality: "German-British",
      achievements: ["Discovered multiple comets", "Cataloged nebulae and star clusters", "First woman in Britain paid for scientific work"],
      image: "☄️"
    },
    {
      id: 13,
      name: "Johannes Kepler",
      lived: "1571-1630",
      nationality: "German",
      achievements: ["Formulated laws of planetary motion", "Showed planets orbit in ellipses", "Linked observation with mathematical astronomy"],
      image: "🪐"
    },
    {
      id: 14,
      name: "Tycho Brahe",
      lived: "1546-1601",
      nationality: "Danish",
      achievements: ["Made highly precise pre-telescope observations", "Recorded the 1572 supernova", "Collected data that enabled Kepler's laws"],
      image: "✨"
    },
    {
      id: 15,
      name: "Katherine Johnson",
      lived: "1918-2020",
      nationality: "American",
      achievements: ["Calculated trajectories for human spaceflight", "Supported Mercury and Apollo missions", "Advanced orbital mechanics at NASA"],
      image: "📐"
    },
    {
      id: 16,
      name: "Sara Seager",
      lived: "1971-present",
      nationality: "Canadian-American",
      achievements: ["Leads exoplanet atmosphere research", "Developed methods for biosignature detection", "Helped shape modern exoplanet science"],
      image: "🪐"
    }
  ]

  const startQuiz = () => {
    setCurrentQuiz(0)
    setQuizScore(0)
    setQuizAnswers([])
  }

  const answerQuiz = (questionIndex, answerIndex) => {
    if (quizAnswers[questionIndex] !== undefined) return

    const newAnswers = [...quizAnswers]
    newAnswers[questionIndex] = answerIndex
    setQuizAnswers(newAnswers)
    
    if (answerIndex === quizQuestions[questionIndex].correct) {
      setQuizScore(quizScore + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuiz < quizQuestions.length - 1) {
      setCurrentQuiz(currentQuiz + 1)
    } else {
      setCurrentQuiz(quizQuestions.length)
    }
  }

  const resetQuiz = () => {
    setCurrentQuiz(null)
    setQuizScore(0)
    setQuizAnswers([])
  }

  const FactCard = ({ fact, category }) => (
    <motion.div
      className="control-panel p-4 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start space-x-3">
        <div className="text-2xl">
          {category === 'amazing' && '🤯'}
          {category === 'mind-blowing' && '🌟'}
          {category === 'weird' && '🤔'}
          {category === 'physics' && '⚛️'}
          {category === 'size' && '📏'}
          {category === 'distance' && '📏'}
          {category === 'time' && '⏰'}
          {category === 'temperature' && '🌡️'}
          {category === 'weather' && '🌪️'}
          {category === 'geology' && '🏔️'}
          {category === 'observation' && '👁️'}
          {category === 'future' && '🔮'}
          {category === 'numbers' && '🔢'}
          {category === 'black-holes' && '⚫'}
          {category === 'scale' && '📊'}
          {category === 'motion' && '🏃'}
          {category === 'evolution' && '🧬'}
          {category === 'moon' && '🌙'}
          {category === 'ISS' && '🛰️'}
          {category === 'technology' && '🔧'}
          {category === 'records' && '🏆'}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-300">{fact}</p>
          <span className="text-xs text-cosmic-nebula-purple mt-1 inline-block">
            {category.replace('-', ' ')}
          </span>
        </div>
      </div>
    </motion.div>
  )

  const TimelineItem = ({ discovery, index }) => (
    <motion.div
      className="flex items-start space-x-4"
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex-shrink-0 w-12 h-12 bg-cosmic-nebula-purple/20 rounded-full flex items-center justify-center">
        <Clock className="w-6 h-6 text-cosmic-nebula-purple" />
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-bold text-cosmic-star-yellow">{discovery.year}</span>
          <span className="text-xs px-2 py-1 bg-cosmic-galaxy-blue/20 rounded text-cosmic-galaxy-blue">
            {discovery.category.replace('-', ' ')}
          </span>
        </div>
        <h4 className="font-bold text-white mb-1">{discovery.event}</h4>
        <p className="text-sm text-gray-400">by {discovery.scientist}</p>
      </div>
    </motion.div>
  )

  const AstronomerCard = ({ astronomer }) => (
    <motion.div
      className="control-panel p-4"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start space-x-4">
        <div className="astronomer-icon">{astronomer.image}</div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">{astronomer.name}</h3>
          <p className="text-sm text-gray-400 mb-2">{astronomer.lived} • {astronomer.nationality}</p>
          <div className="space-y-1">
            {astronomer.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs text-gray-300">
                <Star className="w-3 h-3 text-cosmic-star-yellow" />
                <span>{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )

  const learningSections = [
    { id: 'facts', label: 'Facts', icon: BookOpen },
    { id: 'quiz', label: 'Quiz', icon: Brain },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'astronomers', label: 'Astronomers', icon: Users }
  ]

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="control-panel">
        <div className="learn-nav">
          {learningSections.map(section => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`learn-nav-button px-3 py-2 rounded text-sm transition-colors ${
                  activeSection === section.id ? 'learn-nav-button-active' : 'learn-nav-button-idle'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{section.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Astronomy Facts */}
      {activeSection === 'facts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-card">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-cosmic-star-yellow" />
              Stellar Facts
            </h3>
            <div className="space-y-3">
              {astronomyFacts.stars.map(fact => (
                <FactCard key={fact.id} fact={fact.fact} category={fact.category} />
              ))}
            </div>
          </div>
          
          <div className="space-card">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-cosmic-galaxy-blue" />
              Planetary Facts
            </h3>
            <div className="space-y-3">
              {astronomyFacts.planets.map(fact => (
                <FactCard key={fact.id} fact={fact.fact} category={fact.category} />
              ))}
            </div>
          </div>
          
          <div className="space-card">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-cosmic-nebula-purple" />
              Galactic Facts
            </h3>
            <div className="space-y-3">
              {astronomyFacts.galaxies.map(fact => (
                <FactCard key={fact.id} fact={fact.fact} category={fact.category} />
              ))}
            </div>
          </div>
          
          <div className="space-card">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Rocket className="w-5 h-5 mr-2 text-cosmic-aurora-green" />
              Space Facts
            </h3>
            <div className="space-y-3">
              {astronomyFacts.space.map(fact => (
                <FactCard key={fact.id} fact={fact.fact} category={fact.category} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quiz Section */}
      {activeSection === 'quiz' && (
        <div className="space-card">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-cosmic-nebula-purple" />
            Astronomy Quiz
          </h3>
          
          {currentQuiz === null ? (
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-cosmic-star-yellow" />
              <h4 className="text-xl font-bold mb-2">Test Your Astronomy Knowledge!</h4>
              <p className="text-gray-400 mb-6">Answer 5 questions about space and astronomy</p>
              <button
                onClick={startQuiz}
                className="px-6 py-3 bg-cosmic-nebula-purple/30 border border-cosmic-nebula-purple/50 rounded-lg hover:bg-cosmic-nebula-purple/50 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Play className="w-4 h-4" />
                <span>Start Quiz</span>
              </button>
            </div>
          ) : currentQuiz < quizQuestions.length ? (
            <div className="max-w-2xl mx-auto">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Question {currentQuiz + 1} of {quizQuestions.length}</span>
                  <span className="text-sm text-cosmic-star-yellow">Score: {quizScore}</span>
                </div>
                <div className="w-full bg-space-dark rounded-full h-2">
                  <div 
                    className="bg-cosmic-nebula-purple h-2 rounded-full transition-all"
                    style={{ width: `${((currentQuiz + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
              
              <motion.div
                key={currentQuiz}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <h4 className="text-xl font-bold mb-4">{quizQuestions[currentQuiz].question}</h4>
                <div className="space-y-3">
                  {quizQuestions[currentQuiz].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => answerQuiz(currentQuiz, index)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        quizAnswers[currentQuiz] === index
                          ? index === quizQuestions[currentQuiz].correct
                            ? 'bg-cosmic-aurora-green/20 border-cosmic-aurora-green/50'
                            : 'bg-cosmic-mars-red/20 border-cosmic-mars-red/50'
                          : 'bg-space-dark/50 border-gray-500/50 hover:bg-cosmic-nebula-purple/20'
                      }`}
                      disabled={quizAnswers[currentQuiz] !== undefined}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {quizAnswers[currentQuiz] === index && (
                          <span className={`text-lg ${
                            index === quizQuestions[currentQuiz].correct ? 'text-cosmic-aurora-green' : 'text-cosmic-mars-red'
                          }`}>
                            {index === quizQuestions[currentQuiz].correct ? '✓' : '✗'}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                
                {quizAnswers[currentQuiz] !== undefined && (
                  <div className="mt-4 p-4 bg-cosmic-galaxy-blue/10 rounded-lg">
                    <p className="text-sm text-gray-300">
                      <span className="font-bold text-cosmic-galaxy-blue">Explanation:</span> {quizQuestions[currentQuiz].explanation}
                    </p>
                    <button
                      onClick={nextQuestion}
                      className="mt-3 px-4 py-2 bg-cosmic-nebula-purple/30 border border-cosmic-nebula-purple/50 rounded hover:bg-cosmic-nebula-purple/50 transition-colors"
                    >
                      Next Question
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="w-16 h-16 mx-auto mb-4 text-cosmic-star-yellow" />
              <h4 className="text-2xl font-bold mb-2">Quiz Complete!</h4>
              <p className="text-3xl font-bold text-cosmic-nebula-purple mb-2">
                {quizScore} / {quizQuestions.length}
              </p>
              <p className="text-gray-400 mb-6">
                {quizScore === quizQuestions.length ? 'Perfect score! You\'re an astronomy expert!' :
                 quizScore >= quizQuestions.length * 0.8 ? 'Great job! You know your space facts!' :
                 quizScore >= quizQuestions.length * 0.6 ? 'Good effort! Keep learning about astronomy!' :
                 'Keep exploring the cosmos!'}
              </p>
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-cosmic-nebula-purple/30 border border-cosmic-nebula-purple/50 rounded-lg hover:bg-cosmic-nebula-purple/50 transition-colors flex items-center space-x-2 mx-auto"
              >
                <RotateCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Timeline */}
      {activeSection === 'timeline' && (
        <div className="space-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center">
              <Clock className="w-5 h-5 mr-2 text-cosmic-nebula-purple" />
              Timeline of Astronomical Discoveries
            </h3>
            <select
              value={timelineFilter}
              onChange={(e) => setTimelineFilter(e.target.value)}
              className="px-3 py-2 bg-space-dark/50 border border-gray-500/50 rounded text-sm"
            >
              <option value="all">All Categories</option>
              <option value="telescope">Telescopes</option>
              <option value="planets">Planets</option>
              <option value="cosmology">Cosmology</option>
              <option value="space-exploration">Space Exploration</option>
              <option value="physics">Physics</option>
            </select>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {discoveries
              .filter(d => timelineFilter === 'all' || d.category === timelineFilter)
              .map((discovery, index) => (
                <TimelineItem key={index} discovery={discovery} index={index} />
              ))}
          </div>
        </div>
      )}

      {/* Famous Astronomers */}
      {activeSection === 'astronomers' && (
        <div className="space-card">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-cosmic-nebula-purple" />
            Famous Astronomers
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {astronomers.map(astronomer => (
              <AstronomerCard key={astronomer.id} astronomer={astronomer} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AstronomyLearningCenter
