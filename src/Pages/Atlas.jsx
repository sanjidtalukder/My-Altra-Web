/*  src/Atlas.jsx  */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
} from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import * as turf from "@turf/turf";
import * as d3 from "d3";
import {
  FaProjectDiagram,
} from "react-icons/fa";
import "leaflet/dist/leaflet.css";

/* -------------------------------------------------
   1️⃣  Leaflet default marker fix
   ------------------------------------------------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

/* -------------------------------------------------
   2️⃣  Demo data (replace with real APIs later)
   ------------------------------------------------- */
const hazardData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "heat-1",
        type: "heat",
        severity: 0.87,
        name: "Industrial District Heat Island",
        timestamp: "2023-07-15",
      },
      geometry: { type: "Point", coordinates: [90.4125, 23.8103] },
    },
    {
      type: "Feature",
      properties: {
        id: "flood-1",
        type: "flood",
        severity: 0.65,
        name: "Riverbend Flood Zone",
        timestamp: "2023-09-01",
      },
      geometry: { type: "Point", coordinates: [90.43, 23.8] },
    },
    {
      type: "Feature",
      properties: {
        id: "air-1",
        type: "air",
        severity: 0.72,
        name: "Central Air Pollution",
        timestamp: "2023-08-20",
      },
      geometry: { type: "Point", coordinates: [90.4, 23.82] },
    },
  ],
};

const communityData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "comm-1",
        vulnerabilityIndex: 0.92,
        population: 12500,
        name: "Low‑Income Settlement Alpha",
      },
      geometry: { type: "Point", coordinates: [90.415, 23.812] },
    },
    {
      type: "Feature",
      properties: {
        id: "comm-2",
        vulnerabilityIndex: 0.78,
        population: 8500,
        name: "Riverside Community",
      },
      geometry: { type: "Point", coordinates: [90.432, 23.802] },
    },
    {
      type: "Feature",
      properties: {
        id: "comm-3",
        vulnerabilityIndex: 0.45,
        population: 22000,
        name: "Urban Center District",
      },
      geometry: { type: "Point", coordinates: [90.405, 23.815] },
    },
  ],
};

/* -------------------------------------------------
   3️⃣  Edge (connection) generation
   ------------------------------------------------- */
const generateEdgeData = () => {
  const edges = [];

  hazardData.features.forEach((hazard) => {
    communityData.features.forEach((community) => {
      const from = turf.point(hazard.geometry.coordinates);
      const to = turf.point(community.geometry.coordinates);
      const distance = turf.distance(from, to, { units: "kilometers" });

      if (distance < 5) {
        const weight = hazard.properties.severity * community.properties.vulnerabilityIndex;

        edges.push({
          type: "Feature",
          properties: {
            source: hazard.properties.id,
            target: community.properties.id,
            weight,
            hazardType: hazard.properties.type,
            hazardName: hazard.properties.name,
            communityName: community.properties.name,
          },
          geometry: {
            type: "LineString",
            coordinates: [hazard.geometry.coordinates, community.geometry.coordinates],
          },
        });
      }
    });
  });

  return {
    type: "FeatureCollection",
    features: edges,
  };
};

const edgeData = generateEdgeData();

/* -------------------------------------------------
   4️⃣  Helper – convert a GeoJSON Point to a Leaflet
       CircleMarker (so we can style radius, colour, etc.)
   ------------------------------------------------- */
const pointToLayer = (feature, latlng) => {
  // we return a plain CircleMarker – its style will be set via the
  // `style` prop of the GeoJSON component (or via onEachFeature).
  return L.circleMarker(latlng);
};

/* -------------------------------------------------
   5️⃣  Animated‑line hook + component
   ------------------------------------------------- */
const useAnimatedLines = () => {
  useEffect(() => {
    const lines = document.querySelectorAll(".animated-line");

    let animationFrames = [];

    lines.forEach((line) => {
      let offset = 0;
      const speed = 0.5 + Math.random(); // random speed for visual variety

      const animate = () => {
        offset = (offset - speed) % 10;
        line.style.strokeDashoffset = offset.toString();
        const frame = requestAnimationFrame(animate);
        animationFrames.push(frame);
      };
      animate();
    });

    return () => {
      animationFrames.forEach((frame) => cancelAnimationFrame(frame));
    };
  }, []);
};

const AnimatedLines = () => {
  useAnimatedLines();
  return null;
};

/* -------------------------------------------------
   6️⃣  Hazard layer
   ------------------------------------------------- */
const HazardLayer = ({ data }) => {
  const getHazardStyle = (feature) => {
    let color;
    switch (feature.properties.type) {
      case "heat":
        color = "#ff5c33";
        break;
      case "flood":
        color = "#3385ff";
        break;
      case "fire":
        color = "#ff3333";
        break;
      case "air":
        color = "#cccccc";
        break;
      default:
        color = "#999999";
    }

    return {
      radius: feature.properties.severity * 15 + 5,
      fillColor: color,
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8,
    };
  };

  const onEachHazard = (feature, layer) => {
    layer.bindPopup(`
      <div class="p-2">
        <h3 class="font-bold text-lg">${feature.properties.name}</h3>
        <p class="text-sm">Type: ${feature.properties.type}</p>
        <p class="text-sm">Severity: ${Math.round(
          feature.properties.severity * 100
        )}%</p>
        <p class="text-sm">Date: ${feature.properties.timestamp}</p>
      </div>
    `);
  };

  return (
    <GeoJSON
      data={data}
      pointToLayer={pointToLayer}
      style={getHazardStyle}
      onEachFeature={onEachHazard}
    />
  );
};

/* -------------------------------------------------
   7️⃣  Community layer
   ------------------------------------------------- */
const CommunityLayer = ({ data }) => {
  const getCommunityStyle = (feature) => {
    // interpolate colour from green → red based on vulnerability
    const r = Math.floor(feature.properties.vulnerabilityIndex * 255);
    const g = Math.floor((1 - feature.properties.vulnerabilityIndex) * 255);
    const color = `rgb(${r},${g},0)`;

    return {
      radius: Math.sqrt(feature.properties.population / 1000) * 3,
      fillColor: color,
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8,
    };
  };

  const onEachCommunity = (feature, layer) => {
    layer.bindPopup(`
      <div class="p-2">
        <h3 class="font-bold text-lg">${feature.properties.name}</h3>
        <p class="text-sm">Population: ${feature.properties.population.toLocaleString()}</p>
        <p class="text-sm">Vulnerability: ${Math.round(
          feature.properties.vulnerabilityIndex * 100
        )}%</p>
      </div>
    `);
  };

  return (
    <GeoJSON
      data={data}
      pointToLayer={pointToLayer}
      style={getCommunityStyle}
      onEachFeature={onEachCommunity}
    />
  );
};

/* -------------------------------------------------
   8️⃣  Edge (connection) layer
   ------------------------------------------------- */
const EdgeLayer = ({ data }) => {
  const getEdgeStyle = (feature) => {
    let color;
    switch (feature.properties.hazardType) {
      case "heat":
        color = "#ff5c33";
        break;
      case "flood":
        color = "#3385ff";
        break;
      case "fire":
        color = "#ff3333";
        break;
      case "air":
        color = "#cccccc";
        break;
      default:
        color = "#999999";
    }

    return {
      color,
      weight: feature.properties.weight * 10, // visual width = strength
      opacity: 0.7,
      dashArray: "5, 10",
      className: "animated-line",
    };
  };

  const onEachEdge = (feature, layer) => {
    layer.bindPopup(`
      <div class="p-2">
        <h3 class="font-bold text-lg">Risk Pathway</h3>
        <p class="text-sm">${feature.properties.hazardName}</p>
        <p class="text-sm">→ impacts →</p>
        <p class="text-sm">${feature.properties.communityName}</p>
        <p class="text-sm">Risk Level: ${Math.round(
          feature.properties.weight * 100
        )}%</p>
      </div>
    `);
  };

  return (
    <GeoJSON
      data={data}
      style={getEdgeStyle}
      onEachFeature={onEachEdge}
    />
  );
};

/* -------------------------------------------------
   9️⃣  D3 equity‑lens graph (overlays the map)
   ------------------------------------------------- */
const EquityLensGraph = ({
  hazards,
  communities,
  edges,
  isActive,
}) => {
  const svgRef = useRef(null);
  const map = useMap();

  useEffect(() => {
    if (!isActive) return;

    // ---- dimensions -------------------------------------------------
    const { width, height } = map.getContainer().getBoundingClientRect();

    // ---- create SVG overlay -----------------------------------------
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("position", "absolute")
      .style("top", 0)
      .style("left", 0)
      .style("pointer-events", "none");

    // wipe previous content
    svg.selectAll("*").remove();

    // ---- nodes -------------------------------------------------------
    const nodes = [
      ...hazards.features.map((f) => ({
        id: f.properties.id,
        name: f.properties.name,
        type: "hazard",
        severity: f.properties.severity,
        geometry: f.geometry,
      })),
      ...communities.features.map((f) => ({
        id: f.properties.id,
        name: f.properties.name,
        type: "community",
        vulnerability: f.properties.vulnerabilityIndex,
        population: f.properties.population,
        geometry: f.geometry,
      })),
    ];

    // ---- links -------------------------------------------------------
    const links = edges.features.map((f) => ({
      source: f.properties.source,
      target: f.properties.target,
      weight: f.properties.weight,
      hazardType: f.properties.hazardType,
    }));

    // ---- translate geographic coords → pixel coords -------------------
    nodes.forEach((node) => {
      const [lon, lat] = node.geometry.coordinates;
      const point = map.latLngToContainerPoint([lat, lon]);
      node.x = point.x;
      node.y = point.y;
    });

    // ---- D3 force simulation -----------------------------------------
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(60)
          .strength((d) => d.weight * 2)
      )
      .force("charge", d3.forceManyBody().strength(-120))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);

    // ---- draw links --------------------------------------------------
    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d) => {
        switch (d.hazardType) {
          case "heat":
            return "#ff5c33";
          case "flood":
            return "#3385ff";
          case "fire":
            return "#ff3333";
          case "air":
            return "#cccccc";
          default:
            return "#999999";
        }
      })
      .attr("stroke-width", (d) => d.weight * 5)
      .attr("stroke-dasharray", "5,5");

    // ---- draw nodes --------------------------------------------------
    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) =>
        d.type === "hazard"
          ? d.severity * 10 + 5
          : Math.sqrt(d.population / 1000) * 2
      )
      .attr(
        "fill",
        (d) =>
          d.type === "hazard"
            ? d.severity > 0.7
              ? "#ff5c33"
              : "#ff9966"
            : `rgb(${Math.floor(
                d.vulnerability * 255
              )},${Math.floor((1 - d.vulnerability) * 255)},0)`
      )
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    // ---- labels ------------------------------------------------------
    const label = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d) => d.name)
      .attr("font-size", "10px")
      .attr("dx", 12)
      .attr("dy", 4)
      .attr("fill", "#fff")
      .attr("stroke", "none");

    // ---- tick function ------------------------------------------------
    function ticked() {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      label.attr("x", (d) => d.x).attr("y", (d) => d.y);
    }

    // ---- drag helpers ------------------------------------------------
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // ---- cleanup ------------------------------------------------------
    return () => {
      simulation.stop();
    };
  }, [isActive, hazards, communities, edges, map]);

  if (!isActive) return null;

  return <svg ref={svgRef} className="equity-lens-graph" />;
};

/* -------------------------------------------------
   10️⃣  Time‑slider component
   ------------------------------------------------- */
const TimeSlider = ({ onChange }) => {
  const [value, setValue] = useState(100); // 0…100 (past → future)

  const handleChange = (e) => {
    const v = Number(e.target.value);
    setValue(v);
    onChange(v);
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-base-100/80 backdrop-blur-sm rounded-xl p-4 shadow-lg w-80">
      <div className="flex justify-between text-xs mb-1">
        <span>Past (2015)</span>
        <span>Present (2024)</span>
        <span>Future (2040)</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={handleChange}
        className="range range-xs range-primary"
      />
      <div className="text-xs text-center mt-1">
        {value < 33
          ? "Historical Data"
          : value < 66
          ? "Current Data"
          : "Projected Data"}
      </div>
    </div>
  );
};

/* -------------------------------------------------
   11️⃣  Layer‑control panel
   ------------------------------------------------- */
const LayerControls = ({ visibleLayers, onToggleLayer }) => {
  return (
    <div className="absolute top-4 right-4 z-10 bg-base-100/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
      <h3 className="font-bold mb-2">Map Layers</h3>
      <div className="space-y-2">
        {["hazards", "communities", "connections"].map((layer) => (
          <div key={layer} className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                checked={visibleLayers[layer]}
                onChange={() => onToggleLayer(layer)}
                className="checkbox checkbox-xs"
              />
              <span className="label-text capitalize">{layer}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------
   12️⃣  Map legend
   ------------------------------------------------- */
const MapLegend = () => {
  return (
    <div className="absolute bottom-4 right-4 z-10 bg-base-100/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
      <h3 className="font-bold mb-2">Legend</h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#ff5c33]"></div>
          <span>Heat Hazard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#3385ff]"></div>
          <span>Flood Hazard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#ff3333]"></div>
          <span>Fire Hazard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#00ff00]"></div>
          <span>Low Vulnerability</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#ff0000]"></div>
          <span>High Vulnerability</span>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------
   13️⃣  Main Atlas component
   ------------------------------------------------- */
const Atlas = () => {
  const [equityLens, setEquityLens] = useState(false);
  const [timeFilter, setTimeFilter] = useState(100);
  const [visibleLayers, setVisibleLayers] = useState({
    hazards: true,
    communities: true,
    connections: true,
  });

  const mapRef = useRef(null);

  /* Fit map to data bounds after the map instance is ready */
  const handleMapCreated = useCallback((mapInstance) => {
    mapRef.current = mapInstance;
    const bounds = turf.bbox(
      turf.featureCollection([...hazardData.features, ...communityData.features])
    );
    mapInstance.fitBounds(
      [
        [bounds[1], bounds[0]],
        [bounds[3], bounds[2]],
      ],
      { padding: [50, 50] }
    );
  }, []);

  const toggleEquityLens = () => setEquityLens((prev) => !prev);
  const handleTimeFilterChange = (v) => setTimeFilter(v);
  const handleToggleLayer = (layer) =>
    setVisibleLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));

  return (
    <div className="h-screen w-full relative">
      <MapContainer
        center={[23.8103, 90.4125]}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        whenCreated={handleMapCreated}
      >
        {/* Base map – becomes semi‑transparent when the equity lens is on */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          opacity={equityLens ? 0.1 : 1}
        />

        {/* Conditional layers */}
        {visibleLayers.hazards && <HazardLayer data={hazardData} />}
        {visibleLayers.communities && <CommunityLayer data={communityData} />}
        {visibleLayers.connections && <EdgeLayer data={edgeData} />}

        {/* Animation & equity‑lens overlay */}
        <AnimatedLines />
        <EquityLensGraph
          hazards={hazardData}
          communities={communityData}
          edges={edgeData}
          isActive={equityLens}
        />
      </MapContainer>

      {/* UI – Equity‑lens toggle */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={toggleEquityLens}
          className={`btn ${equityLens ? "btn-primary" : "btn-outline"}`}
        >
          <FaProjectDiagram className="mr-2" />
          Equity Lens {equityLens ? "On" : "Off"}
        </button>
      </div>

      {/* UI – other controls */}
      <TimeSlider onChange={handleTimeFilterChange} />
      <LayerControls visibleLayers={visibleLayers} onToggleLayer={handleToggleLayer} />
      <MapLegend />

      {/* Header / info panel */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-base-100/80 backdrop-blur-sm rounded-xl p-4 shadow-lg text-center">
        <h1 className="text-xl font-bold">
          ASTRA Risk &amp; Resilience Explorer
        </h1>
        <p className="text-sm">Visualizing urban risk as a synaptic network</p>
      </div>
    </div>
  );
};

export default Atlas;
