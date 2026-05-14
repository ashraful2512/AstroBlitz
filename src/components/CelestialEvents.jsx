import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Eye, AlertCircle, Star, Moon, Sun } from 'lucide-react'
import eventsData from '../data/celestial-events.json'

const CelestialEvents = () => {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const events = eventsData.events

  const getEventIcon = (type) => {
    switch (type) {
      case 'Meteor Shower':
        return <Star className="w-5 h-5 text-cosmic-star-yellow" />
      case 'Solar Eclipse':
        return <Sun className="w-5 h-5 text-cosmic-star-yellow" />
      case 'Lunar Eclipse':
        return <Moon className="w-5 h-5 text-cosmic-nebula-purple" />
      case 'Planetary Event':
        return <Globe className="w-5 h-5 text-cosmic-galaxy-blue" />
      case 'Lunar Event':
        return <Moon className="w-5 h-5 text-cosmic-aurora-green" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-cosmic-aurora-green'
      case 'Moderate':
        return 'text-cosmic-star-yellow'
      case 'Difficult':
        return 'text-cosmic-mars-red'
      default:
        return 'text-gray-400'
    }
  }

  const getDaysUntil = (dateString) => {
    const eventDate = new Date(dateString)
    const today = new Date()
    const diffTime = Math.abs(eventDate - today)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      {/* Upcoming Events Timeline */}
      <div className="space-card">
        <h3 className="text-lg font-bold mb-4 neon-text">Upcoming Celestial Events</h3>
        <div className="space-y-3">
          {events.slice(0, 4).map((event, index) => (
            <motion.div
              key={event.id}
              className="control-panel cursor-pointer"
              whileHover={{ scale: 1.02, x: 5 }}
              onClick={() => setSelectedEvent(event)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white mb-1">{event.name}</h4>
                      <p className="text-xs text-gray-400 mb-2">{event.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-cosmic-star-yellow font-mono">
                        {getDaysUntil(event.nextOccurrence)} days
                      </div>
                      <div className="text-xs text-gray-500">
                        {event.peakDate}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3 text-gray-400" />
                      <span className={getDifficultyColor(event.difficulty)}>
                        {event.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-400">{event.visibility}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Event Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="control-panel text-center">
          <Star className="w-8 h-8 mx-auto mb-2 text-cosmic-star-yellow" />
          <h3 className="font-bold mb-1">Meteor Showers</h3>
          <p className="text-xs text-gray-400">
            {events.filter(e => e.type === 'Meteor Shower').length} events this year
          </p>
        </div>
        <div className="control-panel text-center">
          <div className="flex justify-center space-x-2 mb-2">
            <Sun className="w-4 h-4 text-cosmic-star-yellow" />
            <Moon className="w-4 h-4 text-cosmic-nebula-purple" />
          </div>
          <h3 className="font-bold mb-1">Eclipses</h3>
          <p className="text-xs text-gray-400">
            {events.filter(e => e.type.includes('Eclipse')).length} events
          </p>
        </div>
        <div className="control-panel text-center">
          <Globe className="w-8 h-8 mx-auto mb-2 text-cosmic-galaxy-blue" />
          <h3 className="font-bold mb-1">Planetary</h3>
          <p className="text-xs text-gray-400">
            {events.filter(e => e.type === 'Planetary Event').length} oppositions
          </p>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => setSelectedEvent(null)}
        >
          <motion.div
            className="space-card max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {getEventIcon(selectedEvent.type)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedEvent.name}</h2>
                  <p className="text-sm text-gray-400">{selectedEvent.type}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="control-panel">
                <h3 className="font-bold text-cosmic-star-yellow mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Event Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Peak Date:</span>
                    <span className="text-white">{selectedEvent.peakDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Next Occurrence:</span>
                    <span className="text-white">{selectedEvent.nextOccurrence}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Days Until:</span>
                    <span className="text-cosmic-star-yellow font-bold">
                      {getDaysUntil(selectedEvent.nextOccurrence)} days
                    </span>
                  </div>
                </div>
              </div>

              <div className="control-panel">
                <h3 className="font-bold text-cosmic-galaxy-blue mb-2 flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Viewing Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Best Viewing:</span>
                    <p className="text-white mt-1">{selectedEvent.bestViewing}</p>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Visibility:</span>
                    <span className="text-white">{selectedEvent.visibility}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Difficulty:</span>
                    <span className={getDifficultyColor(selectedEvent.difficulty)}>
                      {selectedEvent.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <div className="control-panel">
                <h3 className="font-bold text-cosmic-nebula-purple mb-2">About This Event</h3>
                <p className="text-sm text-gray-300 mb-2">
                  {selectedEvent.description}
                </p>
                {selectedEvent.parentBody && (
                  <p className="text-xs text-gray-400">
                    <span className="text-gray-500">Parent Body:</span> {selectedEvent.parentBody}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default CelestialEvents
