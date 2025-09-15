// src/components/Atlas.jsx
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom Marker Icon
const createIcon = (color) =>
  new L.Icon({
    iconUrl: `https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=pin|${color}`,
    iconSize: [30, 50],
    iconAnchor: [15, 45],
    popupAnchor: [0, -40],
  });

// Map Controls (Zoom + Recenter)
const MapControls = ({ center }) => {
  const map = useMap();
  return (
    <div className="absolute bottom-6 right-6 z-[1000] flex flex-col space-y-2 bg-white p-2 rounded-xl shadow-lg">
      <button
        onClick={() => map.zoomIn()}
        className="btn btn-sm btn-circle btn-outline"
      >
        ➕
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="btn btn-sm btn-circle btn-outline"
      >
        ➖
      </button>
      <button
        onClick={() => map.setView(center, 11)}
        className="btn btn-sm btn-circle btn-outline"
      >
        📍
      </button>
    </div>
  );
};

const Atlas = () => {
  const [cwi, setCwi] = useState(65);
  const [hazardData, setHazardData] = useState(null);
  const [connectionData, setConnectionData] = useState(null);
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [activeFilters, setActiveFilters] = useState(["heat", "flood", "air"]);
  const center = [40.7128, -74.006];

  useEffect(() => {
    // Simulated Hazard Data
    const hazards = [
      {
        id: "heat-1",
        type: "heat",
        name: "Industrial District Heat Island",
        severity: 0.87,
        description:
          "Urban heat island effect causing temperatures 5°C higher than surrounding areas",
        impact: "Increased energy consumption, heat-related illnesses",
        coords: [40.715, -74.008],
        trend: "rising",
        lastUpdated: "2h ago",
      },
      {
        id: "flood-1",
        type: "flood",
        name: "Riverbend Flood Zone",
        severity: 0.65,
        description: "Increased flood risk due to changing precipitation",
        impact: "Property damage, disruption",
        coords: [40.708, -74.0],
        trend: "stable",
        lastUpdated: "5h ago",
      },
      {
        id: "air-1",
        type: "air",
        name: "Northside Air Quality Alert",
        severity: 0.72,
        description: "PM2.5 levels exceeding safety thresholds",
        impact: "Respiratory issues",
        coords: [40.725, -74.015],
        trend: "rising",
        lastUpdated: "1h ago",
      },
    ];
    setHazardData(hazards);

    // Simulated Connections
    const connections = [
      {
        from: [40.715, -74.008],
        to: [40.7185, -74.003],
        severity: 0.87,
      },
      { from: [40.708, -74.0], to: [40.709, -73.998], severity: 0.65 },
      { from: [40.725, -74.015], to: [40.722, -74.012], severity: 0.72 },
    ];
    setConnectionData(connections);

    // CWI random update
    const interval = setInterval(() => {
      setCwi((prev) =>
        Math.max(30, Math.min(95, Math.round(prev + (Math.random() * 10 - 5))))
      );
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const toggleFilter = (filter) =>
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );

  const cwiColor =
    cwi > 75 ? "bg-green-500" : cwi > 50 ? "bg-yellow-500" : "bg-red-500";
  const cwiText =
    cwi > 75 ? "Good" : cwi > 50 ? "Moderate" : "Concerning";

  return (
    <div className="relative h-screen w-full">
      {/* Map */}
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Hazards */}
        {hazardData &&
          hazardData
            .filter((h) => activeFilters.includes(h.type))
            .map((hazard) => (
              <Marker
                key={hazard.id}
                position={hazard.coords}
                icon={createIcon(
                  hazard.type === "heat"
                    ? "red"
                    : hazard.type === "flood"
                    ? "blue"
                    : "green"
                )}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold">{hazard.name}</h3>
                    <p className="text-sm">{hazard.description}</p>
                    <p className="text-xs mt-1 text-gray-500">
                      Impact: {hazard.impact}
                    </p>
                    <p className="text-xs text-gray-400">
                      Last Updated: {hazard.lastUpdated}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}

        {/* Connections */}
        {connectionData &&
          connectionData.map((c, idx) => (
            <Polyline
              key={idx}
              positions={[c.from, c.to]}
              color={c.severity > 0.7 ? "red" : "orange"}
              weight={c.severity * 5}
              opacity={0.7}
            />
          ))}

        <MapControls center={center} />
      </MapContainer>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 bg-white/90 shadow p-4 flex justify-between z-[1000]">
        <h1 className="font-bold text-xl">🌆 City Pulse</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => toggleFilter("heat")}
            className={`btn btn-sm ${
              activeFilters.includes("heat") ? "btn-error" : "btn-outline"
            }`}
          >
            🌡 Heat
          </button>
          <button
            onClick={() => toggleFilter("flood")}
            className={`btn btn-sm ${
              activeFilters.includes("flood") ? "btn-info" : "btn-outline"
            }`}
          >
            💧 Flood
          </button>
          <button
            onClick={() => toggleFilter("air")}
            className={`btn btn-sm ${
              activeFilters.includes("air") ? "btn-success" : "btn-outline"
            }`}
          >
            💨 Air
          </button>
        </div>
      </div>

      {/* CWI Pulse */}
      <div className="absolute top-20 right-6 z-[1000]">
        <div className="card w-44 bg-white shadow-xl border">
          <div className="card-body p-4 text-center">
            <h2 className="text-xs uppercase text-gray-500">City Wellbeing</h2>
            <div className={`text-4xl font-bold ${cwiColor} text-white rounded-lg p-2`}>
              {cwi}
            </div>
            <p className="text-sm font-medium text-gray-700">{cwiText}</p>
            <progress
              className="progress progress-accent w-full mt-2"
              value={cwi}
              max="100"
            ></progress>
          </div>
        </div>
      </div>

      {/* Active Risks Panel */}
      <div className="absolute top-20 left-6 z-[1000] card w-80 bg-white shadow-xl border">
        <div className="card-body p-4">
          <h2 className="font-bold text-lg">Active Risks</h2>
          <div className="divider my-2"></div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {hazardData &&
              hazardData.map((h) => (
                <div
                  key={h.id}
                  className="p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    setSelectedHazard(selectedHazard === h.id ? null : h.id)
                  }
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{h.name}</span>
                    <span className="text-xs text-gray-400">
                      {h.lastUpdated}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Severity: {Math.round(h.severity * 100)}%
                  </p>
                  {selectedHazard === h.id && (
                    <p className="text-xs mt-1 text-gray-500">{h.description}</p>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-4 py-1 rounded-full">
        Data sourced from City Sensors • Updated in real-time
      </div>
    </div>
  );
};

export default Atlas;
