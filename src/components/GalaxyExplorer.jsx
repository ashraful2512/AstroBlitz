import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Compass,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Info,
  Star,
  Sparkles,
  Settings,
} from "lucide-react";

const GalaxyExplorer = () => {
  const [selectedGalaxy, setSelectedGalaxy] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoverGalaxy, setHoverGalaxy] = useState(null);
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const starFieldRef = useRef(null);

  // Galaxy data with real astronomical information
  const galaxies = [
    {
      id: "milkyway",
      name: "Milky Way",
      type: "Spiral Galaxy",
      distance: "0 (home)",
      diameter: "100,000 light years",
      stars: "200-400 billion",
      description: "Our home galaxy containing our Solar System.",
      blackHoles: [
        {
          name: "Sagittarius A*",
          mass: "4.1 million solar masses",
          type: "Supermassive",
        },
      ],
      nebulae: [
        {
          name: "Orion Nebula",
          type: "Emission",
          distance: "1,344 light years",
        },
        {
          name: "Eagle Nebula",
          type: "Emission",
          distance: "7,000 light years",
        },
        {
          name: "Crab Nebula",
          type: "Supernova remnant",
          distance: "6,500 light years",
        },
      ],
      color: "#fbbf24",
      position: { x: 0.5, y: 0.5 },
    },
    {
      id: "andromeda",
      name: "Andromeda Galaxy",
      type: "Spiral Galaxy",
      distance: "2.537 million light years",
      diameter: "220,000 light years",
      stars: "1 trillion",
      description:
        "Largest galaxy in the Local Group, approaching the Milky Way.",
      blackHoles: [
        {
          name: "Andromeda Black Hole",
          mass: "100 million solar masses",
          type: "Supermassive",
        },
      ],
      nebulae: [
        {
          name: "NGC 206",
          type: "H II region",
          distance: "2.537 million light years",
        },
        {
          name: "NGC 588",
          type: "H II region",
          distance: "2.537 million light years",
        },
      ],
      color: "#a855f7",
      position: { x: 0.3, y: 0.3 },
    },
    {
      id: "whirlpool",
      name: "Whirlpool Galaxy",
      type: "Spiral Galaxy",
      distance: "23 million light years",
      diameter: "76,900 light years",
      stars: "100 billion",
      description: "Classic spiral galaxy with prominent companion galaxy.",
      blackHoles: [
        {
          name: "M51a Black Hole",
          mass: "10 million solar masses",
          type: "Supermassive",
        },
      ],
      nebulae: [
        {
          name: "M51b",
          type: "Companion galaxy",
          distance: "23 million light years",
        },
      ],
      color: "#3b82f6",
      position: { x: 0.7, y: 0.4 },
    },
    {
      id: "sombrero",
      name: "Sombrero Galaxy",
      type: "Spiral Galaxy",
      distance: "29 million light years",
      diameter: "50,000 light years",
      stars: "100 billion",
      description: "Known for its bright nucleus and large central bulge.",
      blackHoles: [
        {
          name: "Sombrero Black Hole",
          mass: "1 billion solar masses",
          type: "Supermassive",
        },
      ],
      nebulae: [
        {
          name: "Central Bulge",
          type: "Bulge region",
          distance: "29 million light years",
        },
      ],
      color: "#f59e0b",
      position: { x: 0.2, y: 0.6 },
    },
    {
      id: "centaurus",
      name: "Centaurus A",
      type: "Elliptical Galaxy",
      distance: "11 million light years",
      diameter: "60,000 light years",
      stars: "1 trillion",
      description: "Active galaxy with powerful radio jets.",
      blackHoles: [
        {
          name: "Centaurus A Black Hole",
          mass: "55 million solar masses",
          type: "Supermassive",
        },
      ],
      nebulae: [
        {
          name: "Dust Lane",
          type: "Dust band",
          distance: "11 million light years",
        },
      ],
      color: "#10b981",
      position: { x: 0.8, y: 0.7 },
    },
    {
      id: "pinwheel",
      name: "Pinwheel Galaxy",
      type: "Spiral Galaxy",
      distance: "21 million light years",
      diameter: "170,000 light years",
      stars: "1 trillion",
      description: "Face-on spiral galaxy with prominent spiral arms.",
      blackHoles: [
        {
          name: "Pinwheel Black Hole",
          mass: "70 million solar masses",
          type: "Supermassive",
        },
      ],
      nebulae: [
        {
          name: "NGC 5474",
          type: "Companion galaxy",
          distance: "21 million light years",
        },
      ],
      color: "#ef4444",
      position: { x: 0.4, y: 0.8 },
    },
  ];

  // Black hole types and characteristics
  const blackHoleTypes = {
    stellar: {
      name: "Stellar Black Hole",
      mass: "3-20 solar masses",
      formation: "Collapse of massive stars",
      examples: "Cygnus X-1, V616 Mon",
    },
    supermassive: {
      name: "Supermassive Black Hole",
      mass: "10^6-10^9 solar masses",
      formation: "Galaxy mergers and accretion",
      examples: "Sagittarius A*, M87*",
    },
    intermediate: {
      name: "Intermediate Black Hole",
      mass: "10^2-10^5 solar masses",
      formation: "Star cluster mergers",
      examples: "HLX-1, M82 X-1",
    },
  };

  // Nebula types
  const nebulaTypes = {
    emission: {
      name: "Emission Nebula",
      description: "Glowing gas clouds ionized by hot stars",
      examples: "Orion Nebula, Eagle Nebula",
    },
    reflection: {
      name: "Reflection Nebula",
      description: "Dust clouds reflecting starlight",
      examples: "Witch Head Nebula, Pleiades",
    },
    planetary: {
      name: "Planetary Nebula",
      description: "Expanding shells from dying stars",
      examples: "Ring Nebula, Cat's Eye Nebula",
    },
    supernova: {
      name: "Supernova Remnant",
      description: "Expanding debris from stellar explosions",
      examples: "Crab Nebula, Cassiopeia A",
    },
  };

  useEffect(() => {
    const animate = () => {
      setRotation((prev) => prev + 0.012);
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const drawGalaxyMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const activeGalaxyId = hoverGalaxy?.id || selectedGalaxy?.id;

    if (!starFieldRef.current) {
      starFieldRef.current = {
        stars: Array.from({ length: 460 }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.8 + 0.35,
          alpha: Math.random() * 0.75 + 0.2,
          twinkle: Math.random() * Math.PI * 2,
          tint:
            Math.random() > 0.86
              ? "251, 191, 36"
              : Math.random() > 0.7
                ? "147, 197, 253"
                : "255, 255, 255",
        })),
        clouds: [
          {
            x: width * 0.2,
            y: height * 0.24,
            r: 210,
            color: "59, 130, 246",
            alpha: 0.18,
          },
          {
            x: width * 0.78,
            y: height * 0.35,
            r: 190,
            color: "168, 85, 247",
            alpha: 0.2,
          },
          {
            x: width * 0.43,
            y: height * 0.82,
            r: 170,
            color: "16, 185, 129",
            alpha: 0.12,
          },
        ],
      };
    }

    // Deep-space backdrop
    const background = ctx.createLinearGradient(0, 0, width, height);
    background.addColorStop(0, "#02030b");
    background.addColorStop(0.45, "#080b1f");
    background.addColorStop(1, "#14051f");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "lighter";
    starFieldRef.current.clouds.forEach((cloud) => {
      const nebula = ctx.createRadialGradient(
        cloud.x,
        cloud.y,
        0,
        cloud.x,
        cloud.y,
        cloud.r,
      );
      nebula.addColorStop(0, `rgba(${cloud.color}, ${cloud.alpha})`);
      nebula.addColorStop(0.45, `rgba(${cloud.color}, ${cloud.alpha * 0.35})`);
      nebula.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = nebula;
      ctx.fillRect(
        cloud.x - cloud.r,
        cloud.y - cloud.r,
        cloud.r * 2,
        cloud.r * 2,
      );
    });

    starFieldRef.current.stars.forEach((star) => {
      const pulse = 0.65 + Math.sin(rotation * 2 + star.twinkle) * 0.25;
      ctx.fillStyle = `rgba(${star.tint}, ${star.alpha * pulse})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalCompositeOperation = "source-over";

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-width / 2, -height / 2);

    // Draw sensor grid and range rings
    if (showGrid) {
      ctx.strokeStyle = "rgba(96, 165, 250, 0.12)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const x = (width / 10) * i;
        const y = (height / 10) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(168, 85, 247, 0.14)";
      ctx.setLineDash([5, 8]);
      for (let ring = 1; ring <= 3; ring++) {
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, ring * 70, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // Draw local group trajectory lines
    ctx.lineWidth = 1;
    galaxies.slice(1).forEach((galaxy) => {
      const fromX = galaxies[0].position.x * width;
      const fromY = galaxies[0].position.y * height;
      const toX = galaxy.position.x * width;
      const toY = galaxy.position.y * height;
      const line = ctx.createLinearGradient(fromX, fromY, toX, toY);
      line.addColorStop(0, "rgba(251, 191, 36, 0.25)");
      line.addColorStop(1, `${galaxy.color}44`);
      ctx.strokeStyle = line;
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();
    });

    const drawLabel = (galaxy, x, y, isActive) => {
      ctx.font = isActive
        ? "bold 12px Space Mono, monospace"
        : "11px Space Mono, monospace";
      ctx.textAlign = "center";
      const labelWidth = ctx.measureText(galaxy.name).width + 18;
      const labelY = y - 46;
      ctx.fillStyle = isActive
        ? "rgba(15, 23, 42, 0.9)"
        : "rgba(2, 6, 23, 0.72)";
      ctx.strokeStyle = isActive ? galaxy.color : "rgba(148, 163, 184, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x - labelWidth / 2, labelY - 15, labelWidth, 22, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = isActive ? "#ffffff" : "#cbd5e1";
      ctx.fillText(galaxy.name, x, labelY);
    };

    const drawSpiralGalaxy = (galaxy, x, y, isActive) => {
      const radius = isActive ? 62 : 48;
      const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
      glow.addColorStop(0, "#ffffff");
      glow.addColorStop(0.1, galaxy.color);
      glow.addColorStop(0.48, `${galaxy.color}66`);
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation * 0.8);
      ctx.scale(1, 0.68);
      ctx.globalCompositeOperation = "lighter";
      for (let arm = 0; arm < 3; arm++) {
        for (let i = 0; i < 125; i++) {
          const t = i / 125;
          const r = 6 + t * (isActive ? 50 : 39);
          const angle = arm * ((Math.PI * 2) / 3) + t * 4.8;
          const drift = Math.sin(i * 1.7 + arm) * 1.8;
          const px = Math.cos(angle) * r + drift;
          const py = Math.sin(angle) * r;
          const alpha = (1 - t) * (isActive ? 0.7 : 0.45);
          ctx.fillStyle =
            i % 5 === 0
              ? `rgba(255, 255, 255, ${alpha})`
              : `${galaxy.color}${isActive ? "cc" : "88"}`;
          ctx.beginPath();
          ctx.arc(px, py, isActive ? 1.25 : 0.95, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#fff7d6";
      ctx.shadowColor = galaxy.color;
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(0, 0, isActive ? 6 : 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    };

    const drawEllipticalGalaxy = (galaxy, x, y, isActive) => {
      const radius = isActive ? 58 : 45;
      const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
      glow.addColorStop(0, "#eafffb");
      glow.addColorStop(0.18, galaxy.color);
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-0.42);
      ctx.fillStyle = `${galaxy.color}55`;
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 0.7, radius * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `${galaxy.color}aa`;
      ctx.lineWidth = isActive ? 3 : 2;
      ctx.beginPath();
      ctx.moveTo(-radius * 0.95, 0);
      ctx.lineTo(radius * 0.95, 0);
      ctx.stroke();
      ctx.restore();
    };

    const drawGalaxy = (galaxy) => {
      const x = galaxy.position.x * width;
      const y = galaxy.position.y * height;
      const isActive = activeGalaxyId === galaxy.id;

      if (galaxy.type === "Elliptical Galaxy" || galaxy.id === "sombrero") {
        drawEllipticalGalaxy(galaxy, x, y, isActive);
      } else {
        drawSpiralGalaxy(galaxy, x, y, isActive);
      }

      if (isActive) {
        ctx.strokeStyle = galaxy.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.arc(x, y, 68 + Math.sin(rotation * 3) * 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.fillStyle = galaxy.color;
      ctx.beginPath();
      ctx.arc(x, y, isActive ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fill();
      drawLabel(galaxy, x, y, isActive);
    };

    galaxies.forEach((galaxy) => {
      drawGalaxy(galaxy);
    });

    ctx.restore();

    // HUD sweep line, unscaled so it feels like an instrument overlay.
    ctx.strokeStyle = "rgba(16, 185, 129, 0.28)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2, height / 2);
    ctx.lineTo(
      width / 2 + Math.cos(rotation * 1.5) * 290,
      height / 2 + Math.sin(rotation * 1.5) * 290,
    );
    ctx.stroke();
  };

  useEffect(() => {
    drawGalaxyMap();
  }, [rotation, zoom, showGrid, selectedGalaxy, hoverGalaxy]);

  const getCanvasPoint = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const canvasX = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const canvasY = ((event.clientY - rect.top) / rect.height) * canvas.height;
    return {
      x: (canvasX - canvas.width / 2) / zoom + canvas.width / 2,
      y: (canvasY - canvas.height / 2) / zoom + canvas.height / 2,
    };
  };

  const findGalaxyAtPoint = (point) => {
    if (!point || !canvasRef.current) return null;
    const { width, height } = canvasRef.current;
    return (
      galaxies.find((galaxy) => {
        const x = galaxy.position.x * width;
        const y = galaxy.position.y * height;
        const distance = Math.hypot(point.x - x, point.y - y);
        return distance < 54;
      }) || null
    );
  };

  const handleCanvasMove = (event) => {
    const galaxy = findGalaxyAtPoint(getCanvasPoint(event));
    if (galaxy?.id !== hoverGalaxy?.id) {
      setHoverGalaxy(galaxy);
    }
  };

  const handleCanvasClick = (event) => {
    const galaxy = findGalaxyAtPoint(getCanvasPoint(event));
    if (galaxy) {
      setSelectedGalaxy(galaxy);
    }
  };

  const GalaxyCard = ({ galaxy }) => (
    <motion.div
      className="control-panel cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setSelectedGalaxy(galaxy)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-lg mb-1 flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: galaxy.color }}
            />
            {galaxy.name}
          </h3>
          <p className="text-xs text-gray-400 mb-2">{galaxy.type}</p>
          <p className="text-sm text-gray-300 mb-2">{galaxy.description}</p>
        </div>
      </div>

      <div className="space-y-2 text-xs text-gray-400">
        <div className="flex justify-between">
          <span>Distance:</span>
          <span className="text-white">{galaxy.distance}</span>
        </div>
        <div className="flex justify-between">
          <span>Diameter:</span>
          <span className="text-white">{galaxy.diameter}</span>
        </div>
        <div className="flex justify-between">
          <span>Stars:</span>
          <span className="text-white">{galaxy.stars}</span>
        </div>
        <div className="flex justify-between">
          <span>Black Holes:</span>
          <span className="text-white">{galaxy.blackHoles.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Nebulae:</span>
          <span className="text-white">{galaxy.nebulae.length}</span>
        </div>
      </div>
    </motion.div>
  );

  const BlackHoleCard = ({ blackHole }) => (
    <div className="control-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-cosmic-nebula-purple">
          {blackHole.name}
        </h4>
        <span className="text-xs px-2 py-1 bg-cosmic-nebula-purple/20 rounded text-cosmic-nebula-purple">
          {blackHole.type}
        </span>
      </div>
      <div className="text-sm text-gray-300">
        <p className="mb-1">Mass: {blackHole.mass}</p>
      </div>
    </div>
  );

  const NebulaCard = ({ nebula }) => (
    <div className="control-panel p-3">
      <h4 className="font-bold text-cosmic-star-yellow mb-1">{nebula.name}</h4>
      <p className="text-xs text-gray-400 mb-1">{nebula.type}</p>
      <p className="text-xs text-gray-300">{nebula.distance}</p>
    </div>
  );

  const filteredGalaxies = galaxies.filter(
    (galaxy) =>
      galaxy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      galaxy.type.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="control-panel">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search galaxies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-space-dark/80 border border-gray-500/50 rounded text-sm text-white placeholder-gray-400 focus:border-cosmic-nebula-purple/50 focus:outline-none focus:ring-2 focus:ring-cosmic-nebula-purple/30 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`px-3 py-1 border rounded text-sm transition-colors ${
                showGrid
                  ? "bg-cosmic-nebula-purple/30 border-cosmic-nebula-purple/50"
                  : "bg-space-dark/50 border-gray-500/50"
              }`}
            >
              Grid
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="p-1 bg-cosmic-galaxy-blue/30 border border-cosmic-galaxy-blue/50 rounded hover:bg-cosmic-galaxy-blue/50 transition-colors"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <span className="text-xs text-gray-400 font-mono">
                {(zoom * 100).toFixed(0)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                className="p-1 bg-cosmic-galaxy-blue/30 border border-cosmic-galaxy-blue/50 rounded hover:bg-cosmic-galaxy-blue/50 transition-colors"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={() => setRotation(0)}
              className="px-3 py-1 bg-cosmic-star-yellow/30 border border-cosmic-star-yellow/50 rounded text-sm flex items-center space-x-1 hover:bg-cosmic-star-yellow/50 transition-colors"
              aria-label="Reset map rotation"
            >
              <RotateCw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Galaxy Map */}
        <div className="lg:col-span-2">
          <div className="space-card">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Compass className="w-5 h-5 mr-2 text-cosmic-nebula-purple" />
              Interactive Galaxy Map
            </h3>
            <div className="galaxy-map-frame">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="galaxy-map-canvas w-full border border-cosmic-nebula-purple/30 rounded-lg bg-space-dark/50 cursor-crosshair"
                onMouseMove={handleCanvasMove}
                onMouseLeave={() => setHoverGalaxy(null)}
                onClick={handleCanvasClick}
              />
              <div className="galaxy-map-hud">
                <span>LOCAL GROUP SCAN</span>
                <span>
                  {hoverGalaxy
                    ? hoverGalaxy.name
                    : selectedGalaxy
                      ? selectedGalaxy.name
                      : "Hover or click a galaxy"}
                </span>
              </div>
              <div className="galaxy-map-stats">
                <div>
                  <span>Objects</span>
                  <strong>{galaxies.length}</strong>
                </div>
                <div>
                  <span>Zoom</span>
                  <strong>{(zoom * 100).toFixed(0)}%</strong>
                </div>
                <div>
                  <span>Grid</span>
                  <strong>{showGrid ? "On" : "Off"}</strong>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-center space-x-4 text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <Star className="w-3 h-3" />
                <span>Click galaxies for details</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3 h-3" />
                <span>Animated scan overlay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Galaxy List */}
        <div className="lg:col-span-1">
          <div className="space-card">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-cosmic-star-yellow" />
              Galaxy Catalog
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredGalaxies.map((galaxy) => (
                <GalaxyCard key={galaxy.id} galaxy={galaxy} />
              ))}
              {filteredGalaxies.length === 0 && (
                <div className="control-panel text-sm text-gray-400">
                  No galaxies match your search.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Galaxy Details */}
      {selectedGalaxy && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => setSelectedGalaxy(null)}
        >
          <motion.div
            className="space-card max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2 flex items-center">
                  <div
                    className="w-6 h-6 rounded-full mr-3"
                    style={{ backgroundColor: selectedGalaxy.color }}
                  />
                  {selectedGalaxy.name}
                </h2>
                <p className="text-sm text-gray-400">{selectedGalaxy.type}</p>
              </div>
              <button
                onClick={() => setSelectedGalaxy(null)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
                aria-label="Close galaxy details"
              >
                x
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="control-panel">
                  <h3 className="font-bold text-cosmic-galaxy-blue mb-3 flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    Galaxy Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white">{selectedGalaxy.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Distance:</span>
                      <span className="text-white">
                        {selectedGalaxy.distance}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Diameter:</span>
                      <span className="text-white">
                        {selectedGalaxy.diameter}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Star Count:</span>
                      <span className="text-white">{selectedGalaxy.stars}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-cosmic-nebula-purple/30">
                    <p className="text-sm text-gray-300">
                      {selectedGalaxy.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="control-panel">
                  <h3 className="font-bold text-cosmic-nebula-purple mb-3 flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Black Holes
                  </h3>
                  <div className="space-y-2">
                    {selectedGalaxy.blackHoles.map((blackHole, index) => (
                      <BlackHoleCard key={index} blackHole={blackHole} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="control-panel">
                <h3 className="font-bold text-cosmic-star-yellow mb-3 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Nebulae & Star Forming Regions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedGalaxy.nebulae.map((nebula, index) => (
                    <NebulaCard key={index} nebula={nebula} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Educational Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-card">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-cosmic-nebula-purple" />
            Black Hole Types
          </h3>
          <div className="space-y-3">
            {Object.entries(blackHoleTypes).map(([key, type]) => (
              <div key={key} className="control-panel p-4">
                <h4 className="font-bold text-cosmic-nebula-purple mb-2">
                  {type.name}
                </h4>
                <div className="space-y-1 text-sm text-gray-300">
                  <p>
                    <span className="text-gray-400">Mass:</span> {type.mass}
                  </p>
                  <p>
                    <span className="text-gray-400">Formation:</span>{" "}
                    {type.formation}
                  </p>
                  <p>
                    <span className="text-gray-400">Examples:</span>{" "}
                    {type.examples}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-card">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-cosmic-star-yellow" />
            Nebula Types
          </h3>
          <div className="space-y-3">
            {Object.entries(nebulaTypes).map(([key, type]) => (
              <div key={key} className="control-panel p-4">
                <h4 className="font-bold text-cosmic-star-yellow mb-2">
                  {type.name}
                </h4>
                <p className="text-sm text-gray-300 mb-2">{type.description}</p>
                <p className="text-xs text-gray-400">
                  <span className="text-gray-400">Examples:</span>{" "}
                  {type.examples}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalaxyExplorer;
