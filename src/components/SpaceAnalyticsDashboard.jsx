import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  Globe,
  Star,
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
  Eye,
  Satellite,
  BookOpen,
  Users,
} from "lucide-react";

const SpaceAnalyticsDashboard = () => {
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [chartType, setChartType] = useState("bar");
  const [timeRange, setTimeRange] = useState("week");

  // Analytics data
  const analyticsData = {
    nearestPlanets: [
      {
        name: "Moon",
        distance: "384,400 km",
        type: "Natural Satellite",
        icon: "🌙",
      },
      {
        name: "Venus",
        distance: "38 million km",
        type: "Planet",
        icon: "♀️",
      },
      {
        name: "Mars",
        distance: "54.6 million km",
        type: "Planet",
        icon: "🔴",
      },
      {
        name: "Mercury",
        distance: "77 million km",
        type: "Planet",
        icon: "☿️",
      },
    ],
    hottestPlanets: [
      {
        name: "Venus",
        temperature: "464°C",
        type: "Planet",
        icon: "♀️",
      },
      {
        name: "Mercury",
        temperature: "167°C",
        type: "Planet",
        icon: "☿️",
      },
      {
        name: "Earth",
        temperature: "15°C",
        type: "Planet",
        icon: "🌍",
      },
      {
        name: "Mars",
        temperature: "-65°C",
        type: "Planet",
        icon: "🔴",
      },
    ],
    biggestStars: [
      {
        name: "UY Scuti",
        radius: "1,708 solar radii",
        type: "Red Supergiant",
        icon: "⭐",
      },
      {
        name: "VY Canis Majoris",
        radius: "1,420 solar radii",
        type: "Red Hypergiant",
        icon: "✨",
      },
      {
        name: "Betelgeuse",
        radius: "887 solar radii",
        type: "Red Supergiant",
        icon: "🌟",
      },
      {
        name: "Pistol Star",
        radius: "306 solar radii",
        type: "Blue Hypergiant",
        icon: "💫",
      },
    ],
    latestDiscoveries: [
      {
        date: "2024-03-15",
        title: "New Exoplanet System",
        description: "Three Earth-sized planets discovered in habitable zone",
        significance: "high",
        icon: "🪐",
      },
      {
        date: "2024-02-28",
        title: "Fast Radio Burst Pattern",
        description: "Repeating FRB signals detected from distant galaxy",
        significance: "medium",
        icon: "📡",
      },
      {
        date: "2024-01-10",
        title: "Black Hole Merger",
        description: "Gravitational waves from two black holes colliding",
        significance: "high",
        icon: "⚫",
      },
      {
        date: "2023-12-05",
        title: "Mars Water Ice",
        description: "Large water ice deposits found beneath Martian surface",
        significance: "high",
        icon: "🧊",
      },
    ],
    planetComparisons: {
      sizes: [
        { planet: "Mercury", size: 0.383, color: "#8C7853" },
        { planet: "Venus", size: 0.949, color: "#FFA500" },
        { planet: "Earth", size: 1.0, color: "#4169E1" },
        { planet: "Mars", size: 0.532, color: "#CD5C5C" },
        { planet: "Jupiter", size: 11.21, color: "#C88B0A" },
        { planet: "Saturn", size: 9.45, color: "#F4A460" },
        { planet: "Uranus", size: 4.01, color: "#40E0D0" },
        { planet: "Neptune", size: 3.88, color: "#1E90FF" },
      ],

      distances: [
        { planet: "Mercury", distance: 0.39, color: "#8C7853" },
        { planet: "Venus", distance: 0.72, color: "#FFA500" },
        { planet: "Earth", distance: 1.0, color: "#4169E1" },
        { planet: "Mars", distance: 1.52, color: "#CD5C5C" },
        { planet: "Jupiter", distance: 5.2, color: "#C88B0A" },
        { planet: "Saturn", distance: 9.54, color: "#F4A460" },
        { planet: "Uranus", distance: 19.2, color: "#40E0D0" },
        { planet: "Neptune", distance: 30.06, color: "#1E90FF" },
      ],

      orbitalPeriods: [
        { planet: "Mercury", period: 88, color: "#8C7853" },
        { planet: "Venus", period: 225, color: "#FFA500" },
        { planet: "Earth", period: 365.25, color: "#4169E1" },
        { planet: "Mars", period: 687, color: "#CD5C5C" },
        { planet: "Jupiter", period: 4332.59, color: "#C88B0A" },
        { planet: "Saturn", period: 10759, color: "#F4A460" },
        { planet: "Uranus", period: 30688.5, color: "#40E0D0" },
        { planet: "Neptune", period: 60182, color: "#1E90FF" },
      ],
    },
    missionStats: {
      total: 164,
      successful: 142,
      failed: 14,
      ongoing: 8,
      byType: {
        Orbital: 89,
        Lunar: 34,
        Mars: 18,
        "Deep Space": 23,
      },
    },
    observationStats: {
      telescopes: 234,
      discoveries: 1876,
      papers: 4523,
      researchers: 12890,
    },
  };

  const WidgetCard = ({ title, icon, data, color, onClick }) => (
    <motion.div
      className="control-panel cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div
            className={`w-8 h-8 bg-${color}/20 rounded-full flex items-center justify-center`}
          >
            {icon}
          </div>
          <h3 className="font-bold text-sm">{title}</h3>
        </div>
        <TrendingUp className="w-4 h-4 text-cosmic-aurora-green" />
      </div>

      <div className="space-y-2">
        {data.slice(0, 3).map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{item.icon}</span>
              <span className="text-gray-300">{item.name}</span>
            </div>
            <span className="text-cosmic-star-yellow">
              {item.distance || item.temperature || item.radius}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const getMetricValue = (item) =>
    item.value || item.size || item.distance || item.period;

  const ChartVisualization = ({ title, data }) => {
    const maxValue = Math.max(...data.map(getMetricValue));

    // Better scaling for huge differences
    const normalizeValue = (value) => {
      return (Math.log10(value + 1) / Math.log10(maxValue + 1)) * 180;
    };

    // LINE CHART
    if (chartType === "line") {
      const points = data.map((item, index) => {
        const x = 20 + (index / Math.max(data.length - 1, 1)) * 260;

        const y = 110 - normalizeValue(getMetricValue(item));

        return {
          ...item,
          x,
          y,
          value: getMetricValue(item),
        };
      });

      return (
        <div className="analytics-chart">
          <svg
            className="analytics-line-chart"
            viewBox="0 0 300 140"
            role="img"
            aria-label={`${title} line chart`}
          >
            {/* GRID */}
            {[20, 40, 60, 80, 100].map((line) => (
              <line
                key={line}
                x1="10"
                y1={line}
                x2="290"
                y2={line}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
            ))}

            {/* LINE */}
            <polyline
              points={points.map((point) => `${point.x},${point.y}`).join(" ")}
              fill="none"
              stroke="#a855f7"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* POINTS */}
            {points.map((point) => (
              <g key={point.planet}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  fill={point.color || "#3b82f6"}
                />

                <text
                  x={point.x}
                  y="132"
                  textAnchor="middle"
                  fill="#cbd5e1"
                  fontSize="9"
                >
                  {point.planet}
                </text>
              </g>
            ))}
          </svg>
        </div>
      );
    }

    // FIXED BAR CHART
    return (
      <div className="analytics-chart analytics-chart-bars">
        {data.map((item) => {
          const value = getMetricValue(item);

          // Better scaling for all planets
          const height = Math.max(normalizeValue(value), 14);

          return (
            <div key={item.planet} className="analytics-chart-bar-item">
              {/* VALUE */}
              <div className="analytics-chart-top-value">{value}</div>

              {/* BAR */}
              <div
                className="analytics-chart-bar-track"
                style={{
                  height: "220px",
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                <div
                  className="analytics-chart-bar-fill"
                  style={{
                    height: `${height}px`,
                    backgroundColor: item.color || "#3b82f6",
                    width: "100%",
                    borderRadius: "12px 12px 0 0",
                    transition: "none",
                    boxShadow: `0 0 12px ${item.color || "#3b82f6"}55`,
                  }}
                />
              </div>

              {/* LABEL */}
              <span className="analytics-chart-label">{item.planet}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const MissionPieChart = ({ data, colors }) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    let currentAngle = 0;

    return (
      <div>
        <div className="analytics-pie-wrap">
          <svg viewBox="0 0 100 100" className="analytics-pie-svg">
            {Object.entries(data).map(([key, value], index) => {
              const percentage = (value / total) * 100;
              const angle = (percentage / 100) * 360;
              const endAngle = currentAngle + angle;

              const path = describeArc(50, 50, 40, currentAngle, endAngle);
              currentAngle = endAngle;

              return (
                <path
                  key={key}
                  d={path}
                  fill={colors[index % colors.length]}
                  stroke="#000"
                  strokeWidth="0.5"
                />
              );
            })}
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{total}</div>
              <div className="text-xs text-gray-400">Total</div>
            </div>
          </div>
        </div>
        <div className="analytics-pie-legend">
          {Object.entries(data).map(([key, value], index) => (
            <div key={key} className="analytics-pie-legend-item">
              <span
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <strong>{key}</strong>
              <em>{value}</em>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "L",
      x,
      y,
    ].join(" ");
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="control-panel">
        <div className="analytics-header-row flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center">
            <Activity className="w-5 h-5 mr-2 text-cosmic-nebula-purple" />
            Space Analytics Dashboard
          </h3>

          <div className="analytics-controls flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 bg-space-dark/50 border border-gray-500/50 rounded text-sm"
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>

            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="px-3 py-2 bg-space-dark/50 border border-gray-500/50 rounded text-sm"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
            </select>
          </div>
        </div>
      </div>

      {/* Top Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <WidgetCard
          title="Nearest Planets"
          icon={<Globe className="w-4 h-4 text-cosmic-galaxy-blue" />}
          data={analyticsData.nearestPlanets}
          color="cosmic-galaxy-blue"
          onClick={() => setSelectedWidget("nearest")}
        />

        <WidgetCard
          title="Hottest Planets"
          icon={<Zap className="w-4 h-4 text-cosmic-mars-red" />}
          data={analyticsData.hottestPlanets}
          color="cosmic-mars-red"
          onClick={() => setSelectedWidget("hottest")}
        />

        <WidgetCard
          title="Biggest Stars"
          icon={<Star className="w-4 h-4 text-cosmic-star-yellow" />}
          data={analyticsData.biggestStars}
          color="cosmic-star-yellow"
          onClick={() => setSelectedWidget("biggest")}
        />

        <WidgetCard
          title="Latest Discoveries"
          icon={<Eye className="w-4 h-4 text-cosmic-nebula-purple" />}
          data={analyticsData.latestDiscoveries}
          color="cosmic-nebula-purple"
          onClick={() => setSelectedWidget("discoveries")}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-card">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-cosmic-galaxy-blue" />
            Planet Comparisons
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-cosmic-star-yellow mb-3">
                Relative Sizes (Earth = 1)
              </h4>
              <ChartVisualization
                title="Relative Sizes"
                data={analyticsData.planetComparisons.sizes}
              />
            </div>

            <div>
              <h4 className="text-sm font-bold text-cosmic-nebula-purple mb-3">
                Distance from Sun (AU)
              </h4>
              <ChartVisualization
                title="Distance from Sun"
                data={analyticsData.planetComparisons.distances}
              />
            </div>

            <div>
              <h4 className="text-sm font-bold text-cosmic-aurora-green mb-3">
                Orbital Periods (Earth Days)
              </h4>
              <ChartVisualization
                title="Orbital Periods"
                data={analyticsData.planetComparisons.orbitalPeriods}
              />
            </div>
          </div>
        </div>

        <div className="space-card">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <PieChartIcon className="w-5 h-5 mr-2 text-cosmic-nebula-purple" />
            Mission Statistics
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-cosmic-star-yellow mb-3">
                Mission Outcomes
              </h4>
              <MissionPieChart
                data={{
                  Successful: analyticsData.missionStats.successful,
                  Failed: analyticsData.missionStats.failed,
                  Ongoing: analyticsData.missionStats.ongoing,
                }}
                colors={["#10b981", "#ef4444", "#3b82f6"]}
              />
            </div>

            <div>
              <h4 className="text-sm font-bold text-cosmic-nebula-purple mb-3">
                Mission Types
              </h4>
              <MissionPieChart
                data={analyticsData.missionStats.byType}
                colors={["#8b5cf6", "#ec4899", "#f59e0b", "#06b6d4"]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Latest Discoveries Detail */}
      <div className="space-card">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-cosmic-nebula-purple" />
          Latest Discoveries
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analyticsData.latestDiscoveries.map((discovery, index) => (
            <motion.div
              key={index}
              className="control-panel p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{discovery.icon}</span>
                  <div>
                    <h4 className="font-bold text-white">{discovery.title}</h4>
                    <p className="text-xs text-gray-400">{discovery.date}</p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    discovery.significance === "high"
                      ? "bg-cosmic-mars-red/20 text-cosmic-mars-red"
                      : "bg-cosmic-galaxy-blue/20 text-cosmic-galaxy-blue"
                  }`}
                >
                  {discovery.significance}
                </span>
              </div>
              <p className="text-sm text-gray-300">{discovery.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="control-panel text-center">
          <Satellite className="w-8 h-8 mx-auto mb-2 text-cosmic-galaxy-blue" />
          <div className="text-2xl font-bold text-white">
            {analyticsData.observationStats.telescopes}
          </div>
          <div className="text-xs text-gray-400">Active Telescopes</div>
        </div>

        <div className="control-panel text-center">
          <Eye className="w-8 h-8 mx-auto mb-2 text-cosmic-nebula-purple" />
          <div className="text-2xl font-bold text-white">
            {analyticsData.observationStats.discoveries}
          </div>
          <div className="text-xs text-gray-400">Discoveries</div>
        </div>

        <div className="control-panel text-center">
          <BookOpen className="w-8 h-8 mx-auto mb-2 text-cosmic-star-yellow" />
          <div className="text-2xl font-bold text-white">
            {analyticsData.observationStats.papers}
          </div>
          <div className="text-xs text-gray-400">Research Papers</div>
        </div>

        <div className="control-panel text-center">
          <Users className="w-8 h-8 mx-auto mb-2 text-cosmic-aurora-green" />
          <div className="text-2xl font-bold text-white">
            {analyticsData.observationStats.researchers.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Researchers</div>
        </div>
      </div>

      {/* Selected Widget Modal */}
      {selectedWidget && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => setSelectedWidget(null)}
        >
          <motion.div
            className="space-card max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold capitalize">
                {selectedWidget === "nearest" && "Nearest Planets"}
                {selectedWidget === "hottest" && "Hottest Planets"}
                {selectedWidget === "biggest" && "Biggest Stars"}
                {selectedWidget === "discoveries" && "Latest Discoveries"}
              </h2>
              <button
                onClick={() => setSelectedWidget(null)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              {selectedWidget === "nearest" &&
                analyticsData.nearestPlanets.map((planet, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-space-dark/50 rounded"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{planet.icon}</span>
                      <div>
                        <h4 className="font-bold">{planet.name}</h4>
                        <p className="text-xs text-gray-400">{planet.type}</p>
                      </div>
                    </div>
                    <span className="text-cosmic-star-yellow font-mono">
                      {planet.distance}
                    </span>
                  </div>
                ))}

              {selectedWidget === "hottest" &&
                analyticsData.hottestPlanets.map((planet, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-space-dark/50 rounded"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{planet.icon}</span>
                      <div>
                        <h4 className="font-bold">{planet.name}</h4>
                        <p className="text-xs text-gray-400">{planet.type}</p>
                      </div>
                    </div>
                    <span className="text-cosmic-mars-red font-mono">
                      {planet.temperature}
                    </span>
                  </div>
                ))}

              {selectedWidget === "biggest" &&
                analyticsData.biggestStars.map((star, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-space-dark/50 rounded"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{star.icon}</span>
                      <div>
                        <h4 className="font-bold">{star.name}</h4>
                        <p className="text-xs text-gray-400">{star.type}</p>
                      </div>
                    </div>
                    <span className="text-cosmic-star-yellow font-mono">
                      {star.radius}
                    </span>
                  </div>
                ))}

              {selectedWidget === "discoveries" &&
                analyticsData.latestDiscoveries.map((discovery, index) => (
                  <div key={index} className="p-4 bg-space-dark/50 rounded">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{discovery.icon}</span>
                        <div>
                          <h4 className="font-bold">{discovery.title}</h4>
                          <p className="text-xs text-gray-400">
                            {discovery.date}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          discovery.significance === "high"
                            ? "bg-cosmic-mars-red/20 text-cosmic-mars-red"
                            : "bg-cosmic-galaxy-blue/20 text-cosmic-galaxy-blue"
                        }`}
                      >
                        {discovery.significance}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">
                      {discovery.description}
                    </p>
                  </div>
                ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SpaceAnalyticsDashboard;
