import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons
const hazardIcons = {
  heat: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  flood: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
  air: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
};

function Pulse() {
  const [cwi, setCwi] = useState(65);
  const [hazards, setHazards] = useState([]);
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState("day");
  const [activeFilters, setActiveFilters] = useState(["heat", "flood", "air"]);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  useEffect(() => {
    const simulateHazards = [
      {
        id: "heat-island-1",
        type: "heat",
        severity: 0.87,
        name: "Industrial District Heat Island",
        description:
          "Urban heat island effect causing temperatures 5°C higher than surrounding areas",
        impact: "Increased energy consumption, heat-related illnesses",
        trend: "rising",
        lastUpdated: "2 hours ago",
        position: [40.715, -74.008],
        recommendations: [
          "Avoid outdoor activities during peak hours",
          "Stay hydrated",
          "Use cooling centers",
        ],
      },
      {
        id: "flood-zone-1",
        type: "flood",
        severity: 0.65,
        name: "Riverbend Flood Zone",
        description: "Increased flood risk due to changing precipitation patterns",
        impact: "Property damage, infrastructure disruption",
        trend: "stable",
        lastUpdated: "5 hours ago",
        position: [40.708, -74.0],
        recommendations: [
          "Avoid low-lying areas",
          "Prepare emergency evacuation kit",
          "Monitor local alerts",
        ],
      },
      {
        id: "air-quality-1",
        type: "air",
        severity: 0.72,
        name: "Northside Air Quality Alert",
        description: "Particulate matter levels exceeding safety thresholds",
        impact: "Respiratory issues, reduced outdoor activity",
        trend: "rising",
        lastUpdated: "1 hour ago",
        position: [40.725, -74.015],
        recommendations: [
          "Limit outdoor exertion",
          "Keep windows closed",
          "Use air purifiers if available",
        ],
      },
    ];
    setHazards(simulateHazards);

    const interval = setInterval(() => {
      setCwi((prev) => {
        const newCwi = Math.max(
          30,
          Math.min(95, prev + (Math.random() * 10 - 5))
        );
        return Math.round(newCwi);
      });
    }, 8000);

    const hour = new Date().getHours();
    setTimeOfDay(hour >= 6 && hour < 18 ? "day" : "night");

    return () => clearInterval(interval);
  }, []);

  const cwiColor =
    cwi > 75 ? "bg-green-500" : cwi > 50 ? "bg-yellow-500" : "bg-red-500";
  const cwiTextColor =
    cwi > 75 ? "text-green-500" : cwi > 50 ? "text-yellow-500" : "text-red-500";
  const cwiStatus = cwi > 75 ? "Good" : cwi > 50 ? "Moderate" : "Concerning";

  const getTrendIcon = (trend) => {
    if (trend === "rising") return "↗️";
    if (trend === "falling") return "↘️";
    return "→";
  };

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const filteredHazards = hazards.filter((h) =>
    activeFilters.includes(h.type)
  );

  return (
    <div className="h-screen w-full relative">
      {/* Map as background layer */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[40.7128, -74.006]}
          zoom={11}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url={
              timeOfDay === "day"
                ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            }
          />
          {filteredHazards.map((hazard) => (
            <Marker
              key={hazard.id}
              position={hazard.position}
              icon={hazardIcons[hazard.type]}
              eventHandlers={{
                click: () =>
                  setSelectedHazard(
                    selectedHazard === hazard.id ? null : hazard.id
                  ),
              }}
            >
              <Popup>
                <strong>{hazard.name}</strong>
                <div>Severity: {Math.round(hazard.severity * 100)}%</div>
              </Popup>
              <Circle
                center={hazard.position}
                radius={hazard.severity * 1000}
                pathOptions={{
                  color:
                    hazard.type === "heat"
                      ? "red"
                      : hazard.type === "flood"
                      ? "blue"
                      : "green",
                  fillOpacity: 0.1,
                }}
              />
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Overlay UI */}
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 p-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold flex items-center">
          🌆 City Pulse
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeOfDay("day")}
            className={`px-3 py-1 rounded ${
              timeOfDay === "day" ? "bg-yellow-300" : "bg-gray-200"
            }`}
          >
            ☀️ Day
          </button>
          <button
            onClick={() => setTimeOfDay("night")}
            className={`px-3 py-1 rounded ${
              timeOfDay === "night" ? "bg-gray-700 text-white" : "bg-gray-200"
            }`}
          >
            🌙 Night
          </button>
        </div>
      </div>

      {/* CWI Widget */}
      <div className="absolute top-20 right-6 z-10 bg-white shadow rounded-xl p-4 w-48 text-center">
        <div className="text-xs text-gray-500 mb-1">
          ❤️ City Wellbeing Index
        </div>
        <div className={`text-4xl font-bold ${cwiTextColor}`}>{cwi}</div>
        <div className="text-sm">{cwiStatus}</div>
        <div className="mt-2 h-2 bg-gray-200 rounded">
          <div
            className={`h-2 ${cwiColor}`}
            style={{ width: `${cwi}%` }}
          ></div>
        </div>
      </div>

      {/* Hazard panel */}
      <div
        className={`absolute top-20 left-6 z-10 bg-white shadow rounded-xl transition-all duration-300 ${
          isPanelCollapsed ? "w-16" : "w-80"
        }`}
      >
        <button
          className="absolute -right-3 top-4 bg-white border rounded-full px-1 shadow"
          onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
        >
          {isPanelCollapsed ? "➡️" : "⬅️"}
        </button>
        {!isPanelCollapsed && (
          <div className="p-4">
            <h2 className="font-bold mb-2">⚠️ Active Risks</h2>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => toggleFilter("heat")}
                className={`px-2 py-1 rounded text-xs ${
                  activeFilters.includes("heat")
                    ? "bg-red-100 border border-red-300"
                    : "bg-gray-100"
                }`}
              >
                Heat
              </button>
              <button
                onClick={() => toggleFilter("flood")}
                className={`px-2 py-1 rounded text-xs ${
                  activeFilters.includes("flood")
                    ? "bg-blue-100 border border-blue-300"
                    : "bg-gray-100"
                }`}
              >
                Flood
              </button>
              <button
                onClick={() => toggleFilter("air")}
                className={`px-2 py-1 rounded text-xs ${
                  activeFilters.includes("air")
                    ? "bg-green-100 border border-green-300"
                    : "bg-gray-100"
                }`}
              >
                Air
              </button>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {filteredHazards.map((h) => (
                <div
                  key={h.id}
                  className={`p-2 rounded border cursor-pointer ${
                    selectedHazard === h.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onClick={() =>
                    setSelectedHazard(selectedHazard === h.id ? null : h.id)
                  }
                >
                  <div className="font-medium">{h.name}</div>
                  <div className="text-sm">
                    Severity: {Math.round(h.severity * 100)}% {getTrendIcon(h.trend)}
                  </div>
                  {selectedHazard === h.id && (
                    <div className="text-xs text-gray-600 mt-1">
                      {h.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 text-xs rounded-full z-10">
        📡 Data from City Sensors • Real-time
      </div>
    </div>
  );
}

export default Pulse;
