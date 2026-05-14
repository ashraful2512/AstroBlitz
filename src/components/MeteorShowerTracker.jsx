import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Eye,
  TrendingUp,
  Zap,
  ChevronRight,
  Info,
  Camera,
  MapPin,
  Clock,
  AlertCircle,
  Star,
  Moon,
  Cloud,
  Wind,
  Thermometer,
  Navigation,
  Settings,
  Bell,
  Download,
  Filter,
  X,
  Activity,
  BarChart3,
  Globe,
  Compass,
  Sunrise,
  Sunset,
  Play,
} from "lucide-react";

import celestialEvents from "../data/celestial-events.json";

const MeteorShowerTracker = () => {
  const [selectedShower, setSelectedShower] = useState(null);
  const [activeView, setActiveView] = useState("showers"); // showers, calendar, map, photography, stats
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(2026);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [viewingConditions, setViewingConditions] = useState({
    moonPhase: "Waxing Gibbous",
    lightPollution: "Moderate",
    weather: "Clear",
    visibility: "Good",
  });

  const canvasRef = useRef(null);
  const mapCanvasRef = useRef(null);
  const requestRef = useRef();
  const [isAnimating, setIsAnimating] = useState(true);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapRotation, setMapRotation] = useState(0);
  const [showMapGrid, setShowMapGrid] = useState(true);
  const [showMapLabels, setShowMapLabels] = useState(true);
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [meteors, setMeteors] = useState([]);
  const [stars, setStars] = useState([]);
  const mapAnimationRef = useRef();

  // Filter meteor showers from events
  const meteorShowers = celestialEvents.events.filter(
    (event) => event.type === "Meteor Shower",
  );

  // Get current month name
  const getMonthName = (monthIndex) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthIndex];
  };

  // Filter showers for selected month
  const getShowersForMonth = (monthIndex) => {
    const monthName = getMonthName(monthIndex);
    return meteorShowers.filter((shower) => {
      // Extract month from peakDate (e.g., "January 3-4" -> "January")
      const peakMonth = shower.peakDate.split(" ")[0];
      return peakMonth === monthName;
    });
  };

  // Calculate days until peak
  const getDaysUntil = (dateString) => {
    const diff = new Date(dateString) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  // Get visibility color
  const getVisibilityColor = (difficulty) => {
    const colors = {
      Easy: "text-green-400",
      Moderate: "text-yellow-400",
      Difficult: "text-red-400",
      Variable: "text-orange-400",
    };
    return colors[difficulty] || "text-gray-400";
  };

  // Get RGB color values for gradients
  const getRGBColor = (difficulty) => {
    const colors = {
      Easy: { r: 74, g: 222, b: 128 }, // green-400
      Moderate: { r: 251, g: 191, b: 36 }, // yellow-400
      Difficult: { r: 248, g: 113, b: 113 }, // red-400
      Variable: { r: 251, g: 146, b: 60 }, // orange-400
    };
    return colors[difficulty] || { r: 156, g: 163, b: 175 }; // gray-400
  };

  // Get ZHR color intensity
  const getZHRColor = (zhr) => {
    if (zhr >= 100) return "text-yellow-400 bg-yellow-400-30";
    if (zhr >= 50) return "text-green-400 bg-green-400-30";
    if (zhr >= 20) return "text-blue-400 bg-blue-400-30";
    return "text-gray-400 bg-gray-400-30";
  };

  // Professional meteor radar visualization
  useEffect(() => {
    if (!isAnimating || activeView !== "showers") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let time = 0;

    // Radar sweep variables
    let sweepAngle = 0;
    const meteors = [];
    const radarPings = [];
    const starField = [];

    // Generate realistic star field
    for (let i = 0; i < 200; i++) {
      starField.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        magnitude: Math.random() * 3,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      time += 0.016;
      sweepAngle += 0.02;

      // Dark space background
      ctx.fillStyle = "#000814";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid overlay (radar style)
      ctx.strokeStyle = "rgba(0, 255, 100, 0.1)";
      ctx.lineWidth = 0.5;
      const gridSize = 40;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw stars with realistic twinkling
      starField.forEach((star) => {
        const twinkle = Math.sin(time * 2 + star.twinklePhase) * 0.5 + 0.5;
        const brightness = star.magnitude / 3;
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness * twinkle})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.magnitude * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Radar sweep effect
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.max(canvas.width, canvas.height) / 2;

      const sweepGradient = ctx.createLinearGradient(
        centerX,
        centerY,
        centerX + Math.cos(sweepAngle) * maxRadius,
        centerY + Math.sin(sweepAngle) * maxRadius,
      );
      sweepGradient.addColorStop(0, "rgba(0, 255, 100, 0)");
      sweepGradient.addColorStop(0.8, "rgba(0, 255, 100, 0.1)");
      sweepGradient.addColorStop(1, "rgba(0, 255, 100, 0.3)");

      ctx.fillStyle = sweepGradient;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, maxRadius, sweepAngle - 0.3, sweepAngle, false);
      ctx.closePath();
      ctx.fill();

      // Generate new meteors based on active showers
      const activeShower = meteorShowers.find(
        (s) => getDaysUntil(s.nextOccurrence) <= 7,
      );
      if (Math.random() < (activeShower ? 0.08 : 0.03) && meteors.length < 8) {
        const shower =
          activeShower ||
          meteorShowers[Math.floor(Math.random() * meteorShowers.length)];
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;

        meteors.push({
          id: Date.now() + Math.random(),
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          vx: Math.cos(angle) * (Math.random() * 2 + 1),
          vy: Math.sin(angle) * (Math.random() * 2 + 1),
          trail: [],
          color: shower.meteorColor.toLowerCase().includes("blue")
            ? "#00d4ff"
            : shower.meteorColor.toLowerCase().includes("orange")
              ? "#ff6b35"
              : shower.meteorColor.toLowerCase().includes("green")
                ? "#00ff88"
                : shower.meteorColor.toLowerCase().includes("red")
                  ? "#ff4757"
                  : "#ffffff",
          magnitude: Math.random() * 3 + 1,
          shower: shower.name,
          zhr: shower.zhr,
          age: 0,
          maxAge: 3,
          isFireball: Math.random() < 0.15,
          detected: false,
        });
      }

      // Update and draw meteors
      for (let i = meteors.length - 1; i >= 0; i--) {
        const meteor = meteors[i];

        // Update position
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
        meteor.age += 0.016;

        // Detection delay simulation
        if (!meteor.detected && meteor.age > 0.1) {
          meteor.detected = true;
          radarPings.push({
            x: meteor.x,
            y: meteor.y,
            age: 0,
            maxAge: 1,
          });
        }

        // Build trail
        meteor.trail.push({ x: meteor.x, y: meteor.y, age: meteor.age });
        if (meteor.trail.length > 15) {
          meteor.trail.shift();
        }

        // Draw trail with gradient
        if (meteor.trail.length > 1 && meteor.detected) {
          for (let j = 1; j < meteor.trail.length; j++) {
            const point = meteor.trail[j];
            const prevPoint = meteor.trail[j - 1];
            const alpha =
              (j / meteor.trail.length) * (1 - meteor.age / meteor.maxAge);

            ctx.strokeStyle =
              meteor.color +
              Math.floor(alpha * 255)
                .toString(16)
                .padStart(2, "0");
            ctx.lineWidth = meteor.magnitude * (j / meteor.trail.length);
            ctx.beginPath();
            ctx.moveTo(prevPoint.x, prevPoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
          }
        }

        // Draw meteor head
        if (meteor.detected) {
          // Convert hex to RGB for gradients
          const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
              hex,
            );
            return result
              ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16),
                }
              : { r: 255, g: 255, b: 255 };
          };
          const rgb = hexToRgb(meteor.color);

          if (meteor.isFireball) {
            // Fireball with realistic glow
            const glowGradient = ctx.createRadialGradient(
              meteor.x,
              meteor.y,
              0,
              meteor.x,
              meteor.y,
              meteor.magnitude * 8,
            );

            glowGradient.addColorStop(
              0,
              `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
            );
            glowGradient.addColorStop(
              0.3,
              `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`,
            );
            glowGradient.addColorStop(
              0.6,
              `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`,
            );
            glowGradient.addColorStop(
              1,
              `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`,
            );
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(meteor.x, meteor.y, meteor.magnitude * 8, 0, Math.PI * 2);
            ctx.fill();
          }

          // Bright meteor head
          const headGradient = ctx.createRadialGradient(
            meteor.x,
            meteor.y,
            0,
            meteor.x,
            meteor.y,
            meteor.magnitude * 3,
          );
          headGradient.addColorStop(0, "#ffffff");
          headGradient.addColorStop(0.5, `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
          headGradient.addColorStop(
            1,
            `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`,
          );
          ctx.fillStyle = headGradient;
          ctx.beginPath();
          ctx.arc(meteor.x, meteor.y, meteor.magnitude * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Remove old meteors
        if (
          meteor.age > meteor.maxAge ||
          meteor.x < -100 ||
          meteor.x > canvas.width + 100 ||
          meteor.y < -100 ||
          meteor.y > canvas.height + 100
        ) {
          meteors.splice(i, 1);
        }
      }

      // Draw radar pings
      for (let i = radarPings.length - 1; i >= 0; i--) {
        const ping = radarPings[i];
        ping.age += 0.016;

        const alpha = 1 - ping.age / ping.maxAge;
        const radius = ping.age * 30;

        ctx.strokeStyle = `rgba(0, 255, 100, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ping.x, ping.y, radius, 0, Math.PI * 2);
        ctx.stroke();

        if (ping.age > ping.maxAge) {
          radarPings.splice(i, 1);
        }
      }

      // Professional HUD overlay
      ctx.fillStyle = "rgba(0, 20, 40, 0.8)";
      ctx.fillRect(8, 8, 160, 80);

      ctx.strokeStyle = "rgba(0, 255, 100, 0.8)";
      ctx.lineWidth = 1;
      ctx.strokeRect(8, 8, 160, 80);

      ctx.fillStyle = "#00ff64";
      ctx.font = "11px monospace";
      ctx.fillText("METEOR RADAR SYSTEM", 15, 25);
      ctx.fillText(`TRACKING: ${meteors.length} OBJECTS`, 15, 40);
      ctx.fillText(
        `ACTIVE: ${meteors.filter((m) => m.detected).length}`,
        15,
        55,
      );
      ctx.fillText(`TIME: ${new Date().toLocaleTimeString()}`, 15, 70);

      // Detection indicator
      if (meteors.some((m) => !m.detected)) {
        ctx.fillStyle = "#ff6b35";
        ctx.fillText("SCANNING...", 15, 85);
      }

      // Corner markers
      ctx.strokeStyle = "rgba(0, 255, 100, 0.6)";
      ctx.lineWidth = 2;
      const markerSize = 15;

      // Top-left
      ctx.beginPath();
      ctx.moveTo(10, 10 + markerSize);
      ctx.lineTo(10, 10);
      ctx.lineTo(10 + markerSize, 10);
      ctx.stroke();

      // Top-right
      ctx.beginPath();
      ctx.moveTo(canvas.width - 10 - markerSize, 10);
      ctx.lineTo(canvas.width - 10, 10);
      ctx.lineTo(canvas.width - 10, 10 + markerSize);
      ctx.stroke();

      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(10, canvas.height - 10 - markerSize);
      ctx.lineTo(10, canvas.height - 10);
      ctx.lineTo(10 + markerSize, canvas.height - 10);
      ctx.stroke();

      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(canvas.width - 10 - markerSize, canvas.height - 10);
      ctx.lineTo(canvas.width - 10, canvas.height - 10);
      ctx.lineTo(canvas.width - 10, canvas.height - 10 - markerSize);
      ctx.stroke();

      requestRef.current = requestAnimationFrame(draw);
    };

    requestRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isAnimating, activeView, meteorShowers]);

  // Interactive sky map with continuous animation
  useEffect(() => {
    if (!isAnimating || activeView !== "map") return;

    const canvas = mapCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let time = 0;

    // Generate background stars only once
    const backgroundStars = [];
    for (let i = 0; i < 300; i++) {
      backgroundStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        magnitude: Math.random() * 2,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    // Active meteors for animation
    const activeMeteors = [];

    const draw = () => {
      time += 0.016;

      // Clear canvas
      ctx.fillStyle = "#0a0a0c";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Save context for transformations
      ctx.save();

      // Apply transformations
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(mapZoom, mapZoom);
      ctx.rotate((mapRotation * Math.PI) / 180);
      ctx.translate(
        -canvas.width / 2 + mapPan.x,
        -canvas.height / 2 + mapPan.y,
      );

      // Draw grid if enabled
      if (showMapGrid) {
        ctx.strokeStyle = "rgba(100, 100, 200, 0.15)";
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 10; i++) {
          const x = (canvas.width / 10) * i;
          const y = (canvas.height / 10) * i;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

      // Draw background stars with twinkling
      backgroundStars.forEach((star) => {
        const twinkle = Math.sin(time * 3 + star.twinklePhase) * 0.5 + 0.5;
        const brightness = star.magnitude / 2;
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness * twinkle})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.magnitude * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw radiant points for active showers
      const radiantPositions = {
        Perseus: { x: 0.3, y: 0.3 },
        Gemini: { x: 0.7, y: 0.4 },
        Leo: { x: 0.5, y: 0.2 },
        Orion: { x: 0.4, y: 0.6 },
        Taurus: { x: 0.6, y: 0.5 },
        Aquarius: { x: 0.8, y: 0.7 },
        Lyra: { x: 0.2, y: 0.4 },
        Draco: { x: 0.5, y: 0.1 },
        Bootes: { x: 0.3, y: 0.2 },
        "Ursa Minor": { x: 0.5, y: 0.05 },
      };

      meteorShowers.forEach((shower) => {
        const pos = radiantPositions[shower.radiant];
        if (pos) {
          const x = pos.x * canvas.width;
          const y = pos.y * canvas.height;

          // Animated radiant point
          const pulseSize = 8 + Math.sin(time * 2) * 2;
          const rgbColor = getRGBColor(shower.difficulty);

          // Glow effect
          const gradient = ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            pulseSize * 3,
          );
          gradient.addColorStop(
            0,
            `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.8)`,
          );
          gradient.addColorStop(
            0.5,
            `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`,
          );
          gradient.addColorStop(1, "transparent");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, pulseSize * 3, 0, Math.PI * 2);
          ctx.fill();

          // Core radiant point
          ctx.fillStyle = `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;
          ctx.beginPath();
          ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
          ctx.fill();

          // Labels if enabled
          if (showMapLabels) {
            ctx.fillStyle = "white";
            ctx.font = "12px sans-serif";
            ctx.fillText(shower.radiant, x + 15, y + 4);
          }

          // Generate new meteors
          if (Math.random() < 0.02 && activeMeteors.length < 5) {
            const angle = Math.random() * Math.PI * 2;
            activeMeteors.push({
              x: x,
              y: y,
              vx: Math.cos(angle) * (Math.random() * 2 + 1),
              vy: Math.sin(angle) * (Math.random() * 2 + 1),
              trail: [],
              age: 0,
              maxAge: 2,
              color: `${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}`,
            });
          }
        }
      });

      // Update and draw meteors
      for (let i = activeMeteors.length - 1; i >= 0; i--) {
        const meteor = activeMeteors[i];

        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
        meteor.age += 0.016;

        meteor.trail.push({ x: meteor.x, y: meteor.y });
        if (meteor.trail.length > 20) {
          meteor.trail.shift();
        }

        // Draw meteor trail
        if (meteor.trail.length > 1) {
          for (let j = 1; j < meteor.trail.length; j++) {
            const point = meteor.trail[j];
            const prevPoint = meteor.trail[j - 1];
            const alpha =
              (j / meteor.trail.length) * (1 - meteor.age / meteor.maxAge);

            ctx.strokeStyle = `rgba(${meteor.color}, ${alpha})`;
            ctx.lineWidth = 2 * (j / meteor.trail.length);
            ctx.beginPath();
            ctx.moveTo(prevPoint.x, prevPoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
          }
        }

        // Remove old meteors
        if (meteor.age > meteor.maxAge) {
          activeMeteors.splice(i, 1);
        }
      }

      // Restore context
      ctx.restore();

      // Draw UI overlay (not affected by transformations)
      ctx.fillStyle = "rgba(0, 20, 40, 0.8)";
      ctx.fillRect(10, 10, 180, 60);
      ctx.strokeStyle = "rgba(0, 255, 100, 0.8)";
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, 180, 60);

      ctx.fillStyle = "#00ff64";
      ctx.font = "11px monospace";
      ctx.fillText("INTERACTIVE SKY MAP", 15, 25);
      ctx.fillText(`ZOOM: ${mapZoom.toFixed(1)}x`, 15, 40);
      ctx.fillText(`ROTATION: ${mapRotation.toFixed(0)}°`, 15, 55);

      mapAnimationRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(mapAnimationRef.current);
  }, [
    isAnimating,
    activeView,
    mapZoom,
    mapRotation,
    mapPan,
    showMapGrid,
    showMapLabels,
    meteorShowers,
  ]);

  // Mouse event handlers for interactive map
  const handleMapMouseDown = (e) => {
    setIsDragging(true);
    const rect = mapCanvasRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left - mapPan.x,
      y: e.clientY - rect.top - mapPan.y,
    });
  };

  const handleMapMouseMove = (e) => {
    if (!isDragging) return;
    const rect = mapCanvasRef.current.getBoundingClientRect();
    setMapPan({
      x: e.clientX - rect.left - dragStart.x,
      y: e.clientY - rect.top - dragStart.y,
    });
  };

  const handleMapMouseUp = () => {
    setIsDragging(false);
  };

  const resetMapView = () => {
    setMapZoom(1);
    setMapRotation(0);
    setMapPan({ x: 0, y: 0 });
  };

  // Enhanced photography tips data
  const photographyTips = [
    {
      title: "Camera Settings",
      icon: Camera,
      tips: [
        "Use manual mode (M)",
        "ISO: 800-3200 (lower for dark skies)",
        "Aperture: f/2.8 or wider",
        "Shutter speed: 15-30 seconds",
        "Focus: Manual infinity",
        "White balance: Daylight or Auto",
      ],
    },
    {
      title: "Equipment Needed",
      icon: Settings,
      tips: [
        "DSLR or mirrorless camera",
        "Wide-angle lens (14-24mm, f/2.8+)",
        "Sturdy tripod (essential for long exposures)",
        "Remote shutter or intervalometer",
        "Extra batteries (cold drains them faster)",
        "Memory cards (bring multiple, high capacity)",
        "Lens warmer (to prevent dew formation)",
      ],
    },
    {
      title: "Composition Tips",
      icon: Compass,
      tips: [
        "Include foreground elements (trees, buildings)",
        "Frame for radiant point direction",
        "Use landscape orientation for wider coverage",
        "Allow space for meteor trails",
        "Include Polaris for star trail effect",
        "Rule of thirds: place horizon on bottom third",
      ],
    },
    {
      title: "Post-Processing",
      icon: Star,
      tips: [
        "Stack multiple exposures (10-20 shots)",
        "Increase contrast and brightness slightly",
        "Reduce noise carefully (preserve details)",
        "Enhance meteor trails selectively",
        "Don't over-process (keep natural look)",
        "Use curves for precise tonal adjustments",
      ],
    },
    {
      title: "Advanced Techniques",
      icon: Zap,
      tips: [
        "Track meteors with star tracker app",
        "Use intervalometer for consistent shots",
        "Try different focal lengths (14mm vs 24mm)",
        "Experiment with exposure times (10-45 seconds)",
        "Capture fireballs with shorter exposures",
      ],
    },
  ];

  // Render main showers view
  const renderShowersView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar with visualization and conditions */}
      <div className="lg:col-span-1 space-y-6">
        {/* Enhanced Canvas */}
        <div className="relative h-64 rounded-xl overflow-hidden border border-gray-800">
          <canvas
            ref={canvasRef}
            width={400}
            height={256}
            className="w-full h-full"
          />
          <div className="absolute top-4 left-4 font-bold flex items-center gap-2">
            <Activity className="text-yellow-400 w-4 h-4" /> Live Meteors
          </div>
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="absolute top-4 right-4 p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            {isAnimating ? (
              <X className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Viewing Conditions */}
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <h3 className="text-sm font-semibold mb-4 text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Eye className="w-4 h-4" /> Viewing Conditions
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400 flex items-center gap-2">
                <Moon className="w-3 h-3" /> Moon Phase
              </span>
              <span className="text-sm">{viewingConditions.moonPhase}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400 flex items-center gap-2">
                <Cloud className="w-3 h-3" /> Weather
              </span>
              <span className="text-sm">{viewingConditions.weather}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400 flex items-center gap-2">
                <Star className="w-3 h-3" /> Light Pollution
              </span>
              <span className="text-sm">
                {viewingConditions.lightPollution}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400 flex items-center gap-2">
                <Wind className="w-3 h-3" /> Visibility
              </span>
              <span className="text-sm">{viewingConditions.visibility}</span>
            </div>
          </div>
        </div>

        {/* Upcoming Alerts */}
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <h3 className="text-sm font-semibold mb-4 text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4" /> Peak Alerts
          </h3>
          <div className="space-y-2">
            {meteorShowers
              .filter((shower) => getDaysUntil(shower.nextOccurrence) <= 30)
              .slice(0, 3)
              .map((shower) => (
                <div
                  key={shower.id}
                  className="flex items-center justify-between p-2 bg-gray-800 rounded"
                >
                  <span className="text-xs">{shower.name}</span>
                  <span className="text-xs text-yellow-400">
                    {getDaysUntil(shower.nextOccurrence)}d
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Main shower list */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Meteor Showers</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`p-2 rounded-lg ${notificationsEnabled ? "bg-yellow-600 text-yellow-400" : "bg-gray-800 text-gray-400"}`}
            >
              <Bell className="w-4 h-4" />
            </button>
            <button className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {meteorShowers.map((shower) => (
            <motion.div
              key={shower.id}
              whileHover={{ x: 4 }}
              onClick={() => setSelectedShower(shower)}
              className="bg-gray-900 border border-gray-800 p-5 rounded-xl cursor-pointer hover:border-yellow-500 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <h3 className="text-lg font-bold">{shower.name}</h3>
                  </div>
                  <p className="text-sm text-gray-400">{shower.description}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-bold uppercase ${getVisibilityColor(shower.difficulty)}`}
                  >
                    {shower.difficulty}
                  </span>
                  <div
                    className={`text-xs mt-1 px-2 py-1 rounded ${getZHRColor(shower.zhr)}`}
                  >
                    ZHR: {shower.zhr}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-gray-300 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span>Peak: {shower.peakDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-3 h-3 text-gray-500" />
                  <span>{shower.bestViewing}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation className="w-3 h-3 text-gray-500" />
                  <span>Radiant: {shower.radiant}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-gray-500" />
                  <span>{shower.meteorSpeed} km/s</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-800">
                <div className="text-sm">
                  Next in{" "}
                  <span className="text-yellow-400 font-mono font-bold">
                    {getDaysUntil(shower.nextOccurrence)} days
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render calendar view
  const renderCalendarView = () => {
    const monthShowers = getShowersForMonth(selectedMonth);

    return (
      <div className="bg-white p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {getMonthName(selectedMonth)} {new Date().getFullYear()}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSelectedMonth(Math.max(0, selectedMonth - 1))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="w-4 h-4 rotate-180 text-gray-600" />
              </button>
              <button
                onClick={() =>
                  setSelectedMonth(Math.min(11, selectedMonth + 1))
                }
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {/* Weekday headers */}
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <div
                key={i}
                className="bg-gray-50 p-2 text-center text-xs font-medium text-gray-600"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {Array.from({ length: 35 }, (_, i) => {
              const dayNum = i - getFirstDayOfMonth(selectedMonth) + 1;
              const isValidDay =
                dayNum > 0 && dayNum <= getDaysInMonth(selectedMonth);
              const isToday =
                isValidDay &&
                new Date().getMonth() === selectedMonth &&
                new Date().getDate() === dayNum;

              // Check for showers on this day
              const dayShowers = monthShowers.filter((shower) => {
                const peakDay =
                  parseInt(shower.peakDate.split("-")[0]) ||
                  parseInt(shower.peakDate.split("-")[1]);
                return peakDay === dayNum;
              });

              return (
                <div
                  key={i}
                  className={`bg-white p-2 min-h-[80px] ${
                    !isValidDay ? "bg-gray-50" : ""
                  } ${isToday ? "bg-blue-50" : ""}`}
                >
                  {isValidDay && (
                    <>
                      <div
                        className={`text-sm font-medium ${
                          isToday ? "text-blue-600" : "text-gray-900"
                        }`}
                      >
                        {dayNum}
                      </div>
                      {dayShowers.length > 0 && (
                        <div className="mt-1">
                          {dayShowers.slice(0, 1).map((shower, idx) => (
                            <div
                              key={idx}
                              className={`text-xs px-1 py-0.5 rounded ${
                                shower.zhr >= 50
                                  ? "bg-purple-600 text-white"
                                  : "bg-blue-600 text-white"
                              }`}
                            >
                              {shower.name.split(" ")[0]}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Event List */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Events</h3>

            {monthShowers.length > 0 ? (
              <div className="space-y-3">
                {monthShowers.map((shower) => (
                  <div
                    key={shower.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        shower.zhr >= 50 ? "bg-purple-600" : "bg-blue-600"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {shower.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {shower.peakDate}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{shower.zhr}/hr</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No events this month
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Helper functions for calendar
  const getFirstDayOfMonth = (monthIndex) => {
    const year = new Date().getFullYear();
    return new Date(year, monthIndex, 1).getDay();
  };

  const getDaysInMonth = (monthIndex) => {
    const year = new Date().getFullYear();
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  // Render sky map view
  const renderSkyMapView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Interactive Sky Map</h2>

      {/* Control Panel */}
      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isAnimating
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {isAnimating ? "Pause" : "Play"} Animation
        </button>

        <button
          onClick={resetMapView}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          Reset View
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setMapZoom((prev) => Math.min(3, prev + 0.2))}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Zoom In
          </button>
          <button
            onClick={() => setMapZoom((prev) => Math.max(0.5, prev - 0.2))}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Zoom Out
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setMapRotation((prev) => prev - 15)}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            ↺ Rotate Left
          </button>
          <button
            onClick={() => setMapRotation((prev) => prev + 15)}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            ↻ Rotate Right
          </button>
        </div>

        <button
          onClick={() => setShowMapGrid(!showMapGrid)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            showMapGrid
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-white"
          }`}
        >
          {showMapGrid ? "Hide" : "Show"} Grid
        </button>

        <button
          onClick={() => setShowMapLabels(!showMapLabels)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            showMapLabels
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-white"
          }`}
        >
          {showMapLabels ? "Hide" : "Show"} Labels
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[72%_28%] gap-6 items-start">
        <div className="xl:col-span-3">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <canvas
              ref={mapCanvasRef}
              width={1600}
              height={900}
              className="w-full h-[760px] rounded-xl cursor-move"
              onMouseDown={handleMapMouseDown}
              onMouseMove={handleMapMouseMove}
              onMouseUp={handleMapMouseUp}
              onMouseLeave={handleMapMouseUp}
              onWheel={(e) => {
                const delta = e.deltaY > 0 ? 0.95 : 1.05;

                setMapZoom((prevZoom) =>
                  Math.max(0.5, Math.min(3, prevZoom * delta)),
                );
              }}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            />
            <div className="mt-2 text-xs text-gray-400 text-center">
              🖱️ Drag to pan • Scroll to zoom • Use controls for precise
              navigation
            </div>
          </div>
        </div>
        <div className="space-y-4 h-full">
          <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-yellow-400" />
              Radiant Points
            </h3>
            <div className="space-y-2 text-sm">
              {meteorShowers.map((shower) => (
                <div
                  key={shower.id}
                  className="flex justify-between items-center p-2 bg-gray-800 rounded"
                >
                  <span>{shower.radiant}</span>
                  <span
                    className={`text-xs ${getVisibilityColor(shower.difficulty)}`}
                  >
                    {shower.zhr} ZHR
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Compass className="w-4 h-4 text-yellow-400" />
              Viewing Directions
            </h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• Face away from the moon</p>
              <p>• Look 45-60° above horizon</p>
              <p>• Allow 20+ minutes for dark adaptation</p>
              <p>• Scan the entire sky area</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render photography guide
  const renderPhotographyView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Meteor Photography Guide</h2>

      {/* Quick Start Guide */}
      <div
        className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 rounded-xl border border-blue-800 mb-6"
        style={{ opacity: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Zap className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Quick Start</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-800 p-3 rounded-lg" style={{ opacity: 0.3 }}>
            <p className="font-medium text-blue-300 mb-1">📸 Camera</p>
            <p className="text-gray-300">M mode, ISO 1600, f/2.8, 20s</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg" style={{ opacity: 0.3 }}>
            <p className="font-medium text-green-300 mb-1">🌙 Location</p>
            <p className="text-gray-300">Dark sky, no moon, clear weather</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg" style={{ opacity: 0.3 }}>
            <p className="font-medium text-purple-300 mb-1">⏱️ Time</p>
            <p className="text-gray-300">2am-4am, peak shower nights</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {photographyTips.map((section, index) => (
          <div
            key={index}
            className="bg-gray-900 p-6 rounded-xl border border-gray-800"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <section.icon className="w-5 h-5 text-yellow-400" />
              {section.title}
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {section.tips.map((tip, tipIndex) => (
                <li key={tipIndex} className="flex items-start gap-2">
                  <Star className="w-3 h-3 text-yellow-400 mt-1 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5 text-yellow-400" />
          Pro Tips
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm text-gray-300">
          <div>
            <h4 className="font-semibold text-white mb-2">Best Conditions</h4>
            <ul className="space-y-1">
              <li>• New moon is ideal</li>
              <li>• Dark sky location</li>
              <li>• Clear, dry weather</li>
              <li>• Away from city lights</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Timing</h4>
            <ul className="space-y-1">
              <li>• 2 hours after sunset</li>
              <li>• Until 2 hours before sunrise</li>
              <li>• Peak shower dates</li>
              <li>• Allow 30+ minutes setup</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Common Mistakes</h4>
            <ul className="space-y-1">
              <li>• Using autofocus</li>
              <li>• Too high ISO (noise)</li>
              <li>• Not using tripod</li>
              <li>• Wrong direction (moon)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // Calculate enhanced statistics
  const calculateStats = () => {
    const totalShowers = meteorShowers.length;
    const easyShowers = meteorShowers.filter(
      (s) => s.difficulty === "Easy",
    ).length;
    const moderateShowers = meteorShowers.filter(
      (s) => s.difficulty === "Moderate",
    ).length;
    const difficultShowers = meteorShowers.filter(
      (s) => s.difficulty === "Difficult",
    ).length;
    const variableShowers = meteorShowers.filter(
      (s) => s.difficulty === "Variable",
    ).length;

    const highZHR = meteorShowers.filter((s) => s.zhr >= 50).length;
    const mediumZHR = meteorShowers.filter(
      (s) => s.zhr >= 20 && s.zhr < 50,
    ).length;
    const lowZHR = meteorShowers.filter((s) => s.zhr < 20).length;

    const avgZHR = Math.round(
      meteorShowers.reduce((sum, s) => sum + s.zhr, 0) / meteorShowers.length,
    );
    const maxZHR = Math.max(...meteorShowers.map((s) => s.zhr));
    const minZHR = Math.min(...meteorShowers.map((s) => s.zhr));

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const upcomingShowers = meteorShowers.filter((s) => {
      const peakMonth = s.peakDate.split(" ")[0];
      const peakDate = new Date(
        `${peakMonth} ${s.peakDate.split(" ")[1]}, ${currentYear}`,
      );
      return (
        peakDate.getMonth() === currentMonth || getDaysUntil(peakDate) <= 30
      );
    });

    return {
      totalShowers,
      easyShowers,
      moderateShowers,
      difficultShowers,
      variableShowers,
      highZHR,
      mediumZHR,
      lowZHR,
      avgZHR,
      maxZHR,
      minZHR,
      upcomingShowers: upcomingShowers.length,
    };
  };
  const renderStatsView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Meteor Shower Statistics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Showers</p>
              <p className="text-2xl font-bold text-yellow-400">
                {meteorShowers.length}
              </p>
            </div>
            <BarChart3
              className="w-8 h-8 text-yellow-400"
              style={{ opacity: 0.5 }}
            />
          </div>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Peak ZHR</p>
              <p className="text-2xl font-bold text-green-400">
                {Math.max(...meteorShowers.map((s) => s.zhr))}
              </p>
            </div>
            <TrendingUp
              className="w-8 h-8 text-green-400"
              style={{ opacity: 0.5 }}
            />
          </div>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Next Peak</p>
              <p className="text-2xl font-bold text-blue-400">
                {Math.min(
                  ...meteorShowers.map((s) => getDaysUntil(s.nextOccurrence)),
                )}
                d
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" style={{ opacity: 0.5 }} />
          </div>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Now</p>
              <p className="text-2xl font-bold text-purple-400">
                {
                  meteorShowers.filter((s) => {
                    const days = getDaysUntil(s.nextOccurrence);
                    return days >= 0 && days <= 7;
                  }).length
                }
              </p>
            </div>
            <Activity
              className="w-8 h-8 text-purple-400"
              style={{ opacity: 0.5 }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="font-semibold mb-4">ZHR Comparison</h3>
          <div className="space-y-3">
            {meteorShowers
              .sort((a, b) => b.zhr - a.zhr)
              .slice(0, 6)
              .map((shower) => (
                <div key={shower.id} className="flex items-center gap-3">
                  <span className="text-sm w-24">{shower.name}</span>
                  <div className="flex-1 bg-gray-800 rounded-full h-4 relative">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-yellow-400 to-yellow-400 rounded-full"
                      style={{ width: `${(shower.zhr / 120) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-yellow-400 w-12 text-right">
                    {shower.zhr}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="font-semibold mb-4">Speed Distribution</h3>
          <div className="space-y-3">
            {meteorShowers
              .sort((a, b) => b.meteorSpeed - a.meteorSpeed)
              .slice(0, 6)
              .map((shower) => (
                <div key={shower.id} className="flex items-center gap-3">
                  <span className="text-sm w-24">{shower.name}</span>
                  <div className="flex-1 bg-gray-800 rounded-full h-4 relative">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-blue-400 rounded-full"
                      style={{ width: `${(shower.meteorSpeed / 71) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-blue-400 w-12 text-right">
                    {shower.meteorSpeed}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 w-full max-w-[1850px] mx-auto px-4">
      {/* CONTROLS */}
      <div className="control-panel p-4 rounded-2xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-cosmic-star-yellow" />
              <h2 className="text-lg font-bold text-white">
                Meteor Shower Tracker
              </h2>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-1 border border-cosmic-galaxy-blue rounded-lg p-1">
              {[
                { id: "showers", label: "Showers", icon: Zap },
                { id: "calendar", label: "Calendar", icon: Calendar },
                { id: "map", label: "Sky Map", icon: MapPin },
                { id: "photography", label: "Photography", icon: Camera },
                { id: "stats", label: "Statistics", icon: BarChart3 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-sm font-medium ${
                    activeView === tab.id
                      ? "bg-cosmic-nebula-purple text-black shadow-lg"
                      : "text-black hover:text-black hover:bg-gray-600"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`p-2 rounded-lg transition-all ${
                notificationsEnabled
                  ? "bg-cosmic-nebula-purple text-white"
                  : "bg-space-dark-50 border border-cosmic-galaxy-blue text-gray-300 hover:text-white"
              }`}
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Animation Control */}
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`p-2 rounded-lg transition-all ${
                isAnimating
                  ? "bg-cosmic-star-yellow text-black"
                  : "bg-space-dark-50 border border-cosmic-galaxy-blue text-gray-300 hover:text-white"
              }`}
            >
              {isAnimating ? (
                <X className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Render active view */}
        {activeView === "showers" && (
          <>
            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Enhanced Canvas */}
              <div className="control-panel p-4 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-cosmic-star-yellow uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Live Meteors
                  </h3>
                  <span className="text-xs text-gray-400">Real-time</span>
                </div>
                <div className="relative h-48 rounded-xl overflow-hidden border border-cosmic-galaxy-blue-20">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={192}
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Viewing Conditions */}
              <div className="control-panel p-4 rounded-2xl">
                <h3 className="text-sm font-semibold text-cosmic-star-yellow uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Viewing Conditions
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 flex items-center gap-2">
                      <Moon className="w-3 h-3" /> Moon Phase
                    </span>
                    <span className="text-sm text-white">
                      {viewingConditions.moonPhase}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 flex items-center gap-2">
                      <Cloud className="w-3 h-3" /> Weather
                    </span>
                    <span className="text-sm text-white">
                      {viewingConditions.weather}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 flex items-center gap-2">
                      <Star className="w-3 h-3" /> Light Pollution
                    </span>
                    <span className="text-sm text-white">
                      {viewingConditions.lightPollution}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 flex items-center gap-2">
                      <Wind className="w-3 h-3" /> Visibility
                    </span>
                    <span className="text-sm text-white">
                      {viewingConditions.visibility}
                    </span>
                  </div>
                </div>
              </div>

              {/* Upcoming Alerts */}
              <div className="control-panel p-4 rounded-2xl">
                <h3 className="text-sm font-semibold text-cosmic-star-yellow uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Bell className="w-4 h-4" /> Peak Alerts
                </h3>
                <div className="space-y-2">
                  {meteorShowers
                    .filter(
                      (shower) => getDaysUntil(shower.nextOccurrence) <= 30,
                    )
                    .slice(0, 3)
                    .map((shower) => (
                      <div
                        key={shower.id}
                        className="flex items-center justify-between p-2 bg-space-dark-50 rounded-lg border border-cosmic-galaxy-blue-20"
                      >
                        <span className="text-xs text-white">
                          {shower.name}
                        </span>
                        <span className="text-xs text-cosmic-star-yellow font-bold">
                          {getDaysUntil(shower.nextOccurrence)}d
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8">
              <div className="control-panel p-6 rounded-2xl">
                <div className="space-y-4">
                  {meteorShowers.map((shower) => (
                    <motion.div
                      key={shower.id}
                      whileHover={{ x: 4 }}
                      onClick={() => setSelectedShower(shower)}
                      className="p-5 rounded-xl cursor-pointer transition-all border border-cosmic-galaxy-blue-20 hover:border-cosmic-nebula-purple hover:bg-cosmic-nebula-purple-10"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-4 h-4 text-cosmic-star-yellow" />
                            <h3 className="text-lg font-bold text-white">
                              {shower.name}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-300">
                            {shower.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-xs font-bold uppercase ${getVisibilityColor(shower.difficulty)}`}
                          >
                            {shower.difficulty}
                          </span>
                          <div
                            className={`text-xs mt-1 px-2 py-1 rounded ${getZHRColor(shower.zhr)}`}
                          >
                            ZHR: {shower.zhr}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-gray-300 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          <span>Peak: {shower.peakDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-3 h-3 text-gray-500" />
                          <span>{shower.bestViewing}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Navigation className="w-3 h-3 text-gray-500" />
                          <span>Radiant: {shower.radiant}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="w-3 h-3 text-gray-500" />
                          <span>{shower.meteorSpeed} km/s</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-cosmic-galaxy-blue-20">
                        <div className="text-sm">
                          Next in{" "}
                          <span className="text-cosmic-star-yellow font-mono font-bold">
                            {getDaysUntil(shower.nextOccurrence)} days
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeView === "calendar" && (
          <div className="lg:col-span-12">
            <div className="control-panel p-6 rounded-2xl">
              <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white w-48">
                    Meteor Shower Schedule
                  </h2>
                  <div className="flex items-center gap-2 w-64 justify-center">
                    <button
                      onClick={() =>
                        setSelectedYear(Math.max(2026, selectedYear - 1))
                      }
                      className="p-2 hover:bg-gray-700 rounded-lg border border-gray-600 flex-shrink-0"
                    >
                      <ChevronRight
                        className="w-4 h-4 text-gray-400"
                        style={{ transform: "rotate(180deg)" }}
                      />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedMonth(Math.max(0, selectedMonth - 1))
                      }
                      className="p-2 hover:bg-gray-700 rounded-lg border border-gray-600 flex-shrink-0"
                    >
                      <ChevronRight
                        className="w-4 h-4 text-gray-400"
                        style={{ transform: "rotate(180deg)" }}
                      />
                    </button>
                    <span className="text-sm text-gray-300 px-3 min-w-[140px] text-center">
                      {getMonthName(selectedMonth)} {selectedYear}
                    </span>
                    <button
                      onClick={() =>
                        setSelectedMonth(Math.min(11, selectedMonth + 1))
                      }
                      className="p-2 hover:bg-gray-700 rounded-lg border border-gray-600 flex-shrink-0"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedYear(Math.min(2027, selectedYear + 1))
                      }
                      className="p-2 hover:bg-gray-700 rounded-lg border border-gray-600 flex-shrink-0"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Simple List */}
                <div className="space-y-3">
                  {getShowersForMonth(selectedMonth).length > 0 ? (
                    getShowersForMonth(selectedMonth).map((shower) => (
                      <div
                        key={shower.id}
                        className="flex items-center justify-between p-4 bg-space-dark-50 rounded-lg border border-cosmic-galaxy-blue-20"
                      >
                        <div>
                          <h3 className="font-medium text-white">
                            {shower.name}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">
                            {shower.peakDate}
                          </p>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-sm px-2 py-1 rounded ${
                              shower.zhr >= 50
                                ? "bg-orange-500 text-white"
                                : "bg-blue-500 text-white"
                            }`}
                          >
                            {shower.zhr}/hr
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {shower.difficulty}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      No meteor showers this month
                    </div>
                  )}
                </div>

                {/* All Showers */}
                <div className="mt-8 pt-6 border-t border-cosmic-galaxy-blue-20">
                  <h3 className="text-lg font-medium text-white mb-4">
                    All Meteor Showers
                  </h3>
                  <div className="space-y-2">
                    {meteorShowers.map((shower) => (
                      <div
                        key={shower.id}
                        className="flex items-center justify-between p-3 bg-space-dark-30 rounded-lg"
                      >
                        <span className="text-sm text-gray-300">
                          {shower.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {shower.peakDate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === "map" && (
          <div className="lg:col-span-12">
            <div className="control-panel p-6 rounded-2xl">
              {renderSkyMapView()}
            </div>
          </div>
        )}

        {activeView === "photography" && (
          <div className="lg:col-span-12">
            <div className="control-panel p-6 rounded-2xl">
              {renderPhotographyView()}
            </div>
          </div>
        )}

        {activeView === "stats" && (
          <div className="lg:col-span-12">
            <div className="control-panel p-6 rounded-2xl">
              {renderStatsView()}
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedShower && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black flex items-center justify-center p-4 z-50"
            style={{ opacity: 0.8 }}
            onClick={() => setSelectedShower(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="control-panel rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-cosmic-star-yellow">
                  {selectedShower.name}
                </h2>
                <button
                  onClick={() => setSelectedShower(null)}
                  className="p-2 bg-space-dark-50 rounded-lg hover:bg-space-dark-90"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-300">{selectedShower.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-space-dark-50 p-3 rounded-lg border border-cosmic-galaxy-blue-20">
                    <p className="text-sm text-gray-400">Peak Date</p>
                    <p className="font-semibold text-white">
                      {selectedShower.peakDate}
                    </p>
                  </div>
                  <div className="bg-space-dark-50 p-3 rounded-lg border border-cosmic-galaxy-blue-20">
                    <p className="text-sm text-gray-400">ZHR</p>
                    <p className="font-semibold text-cosmic-star-yellow">
                      {selectedShower.zhr} meteors/hour
                    </p>
                  </div>
                  <div className="bg-space-dark-50 p-3 rounded-lg border border-cosmic-galaxy-blue-20">
                    <p className="text-sm text-gray-400">Meteor Speed</p>
                    <p className="font-semibold text-white">
                      {selectedShower.meteorSpeed} km/s
                    </p>
                  </div>
                  <div className="bg-space-dark-50 p-3 rounded-lg border border-cosmic-galaxy-blue-20">
                    <p className="text-sm text-gray-400">Active Period</p>
                    <p className="font-semibold text-white">
                      {selectedShower.activePeriod}
                    </p>
                  </div>
                </div>

                <div className="bg-space-dark-50 p-3 rounded-lg border border-cosmic-galaxy-blue-20">
                  <p className="text-sm text-gray-400">Best Viewing</p>
                  <p className="font-semibold text-white">
                    {selectedShower.bestViewing}
                  </p>
                </div>

                <div className="bg-space-dark-50 p-3 rounded-lg border border-cosmic-galaxy-blue-20">
                  <p className="text-sm text-gray-400">Radiant Point</p>
                  <p className="font-semibold text-white">
                    {selectedShower.radiant}
                  </p>
                </div>

                <div className="bg-space-dark-50 p-3 rounded-lg border border-cosmic-galaxy-blue-20">
                  <p className="text-sm text-gray-400">Parent Body</p>
                  <p className="font-semibold text-white">
                    {selectedShower.parentBody}
                  </p>
                </div>

                <div className="bg-space-dark-50 p-3 rounded-lg border border-cosmic-galaxy-blue-20">
                  <p className="text-sm text-gray-400">Meteor Colors</p>
                  <p className="font-semibold text-white">
                    {selectedShower.meteorColor}
                  </p>
                </div>

                {selectedShower.historicalNotes && (
                  <div className="bg-space-dark-50 p-3 rounded-lg border border-cosmic-galaxy-blue-20">
                    <p className="text-sm text-gray-400">Historical Notes</p>
                    <p className="font-semibold text-white">
                      {selectedShower.historicalNotes}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-cosmic-galaxy-blue-20">
                  <p className="text-sm">
                    Next peak:{" "}
                    <span className="text-cosmic-star-yellow font-bold">
                      {getDaysUntil(selectedShower.nextOccurrence)} days
                    </span>
                  </p>
                  <button
                    onClick={() => setNotificationsEnabled(true)}
                    className="px-4 py-2 bg-cosmic-nebula-purple text-white rounded-lg hover:bg-cosmic-nebula-purple-50 flex items-center gap-2"
                  >
                    <Bell className="w-4 h-4" />
                    Set Alert
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MeteorShowerTracker;
