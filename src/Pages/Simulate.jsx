import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { motion as Motion } from "framer-motion";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Default marker icon fix for Leaflet in Vite/React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Mock hazard/community data (replace later with live feeds)
const initialNodes = [
  { id: "haz1", type: "heat", lat: 40.7128, lon: -74.006, severity: 0.8, label: "Heat Island" },
  { id: "haz2", type: "flood", lat: 40.7228, lon: -74.016, severity: 0.6, label: "Flood Zone" },
  { id: "comm1", type: "community", lat: 40.715, lon: -74.01, vulnerability: 0.9, label: "Elderly Housing" },
  { id: "comm2", type: "community", lat: 40.725, lon: -74.02, vulnerability: 0.5, label: "School Cluster" },
];

const Simulate = () => {
  const [nodes] = useState(initialNodes);
  const [cwi, setCwi] = useState(45); // City Wellbeing Index 0-100
  const [hoveredNode, setHoveredNode] = useState(null);

  // Dynamic pulse update (simulate data feed)
  useEffect(() => {
    const interval = setInterval(() => {
      setCwi((prev) => {
        let next = prev + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 5;
        return Math.min(100, Math.max(0, next));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Pulse speed & brightness from CWI
  const pulseSpeed = 2 - cwi / 100; // lower CWI = slower
  const pulseBrightness = cwi / 100; // higher CWI = brighter

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* Base Map */}
      <MapContainer
        center={[40.7128, -74.006]}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Nodes */}
        {nodes.map((node) => (
          <Marker
            key={node.id}
            position={[node.lat, node.lon]}
            eventHandlers={{
              mouseover: () => setHoveredNode(node),
              mouseout: () => setHoveredNode(null),
            }}
          >
            <Popup>
              <strong>{node.label}</strong>
              {node.type !== "community" ? (
                <div>
                  <p>Type: {node.type}</p>
                  <p>Severity: {(node.severity * 100).toFixed(0)}%</p>
                  <p>Last Update: {new Date().toLocaleTimeString()}</p>
                </div>
              ) : (
                <div>
                  <p>Vulnerability: {(node.vulnerability * 100).toFixed(0)}%</p>
                  <p>Population: {Math.floor(1000 * node.vulnerability)}</p>
                </div>
              )}
            </Popup>

            {/* Animated circle around hazards */}
            {node.type !== "community" && (
              <Circle
                center={[node.lat, node.lon]}
                radius={300 * node.severity}
                pathOptions={{
                  color: node.type === "heat" ? "red" : "blue",
                  fillOpacity: 0.3,
                }}
              />
            )}
          </Marker>
        ))}
      </MapContainer>

      {/* City Pulse Overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <Motion.div
          className="w-64 h-64 rounded-full bg-pink-500 opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, pulseBrightness, 0.2],
          }}
          transition={{ duration: pulseSpeed, repeat: Infinity }}
        />
      </div>

      {/* Hover Stats Card (optional outside map hover) */}
      {hoveredNode && (
        <div className="absolute bottom-4 right-4 bg-gray-900 p-4 rounded-xl shadow-xl w-64">
          <h3 className="font-bold text-lg mb-2">{hoveredNode.label}</h3>
          {hoveredNode.type !== "community" ? (
            <>
              <p>Type: {hoveredNode.type}</p>
              <p>Severity: {(hoveredNode.severity * 100).toFixed(0)}%</p>
              <p>Last Update: {new Date().toLocaleTimeString()}</p>
            </>
          ) : (
            <>
              <p>Community Vulnerability: {(hoveredNode.vulnerability * 100).toFixed(0)}%</p>
              <p>Population Affected: {Math.floor(1000 * hoveredNode.vulnerability)}</p>
            </>
          )}
        </div>
      )}

      {/* CWI Display */}
      <div className="absolute top-4 left-4 bg-gray-800 px-4 py-2 rounded-xl shadow-xl">
        <h2 className="font-bold text-xl">City Wellbeing Index</h2>
        <p className="text-3xl font-mono">{cwi.toFixed(0)}</p>
      </div>
    </div>
  );
};

export default Simulate;
