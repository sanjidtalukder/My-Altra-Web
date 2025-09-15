// src/Pages/demoData.js

// Mock Hazard Data
export const hazardData = [
  {
    id: "haz1",
    type: "heat",
    lat: 40.7128,
    lon: -74.0060,
    severity: "high",
    description: "Extreme heatwave detected in NYC",
  },
  {
    id: "haz2",
    type: "flood",
    lat: 34.0522,
    lon: -118.2437,
    severity: "medium",
    description: "Possible flash flooding in Los Angeles",
  },
  {
    id: "haz3",
    type: "storm",
    lat: 51.5074,
    lon: -0.1278,
    severity: "low",
    description: "Mild storm risk in London",
  },
];

// Mock Community Data
export const communityData = [
  {
    id: "com1",
    name: "Community A",
    lat: 37.7749,
    lon: -122.4194,
    population: 5000,
  },
  {
    id: "com2",
    name: "Community B",
    lat: 48.8566,
    lon: 2.3522,
    population: 8000,
  },
  {
    id: "com3",
    name: "Community C",
    lat: 28.6139,
    lon: 77.2090,
    population: 12000,
  },
];

// Edge Data Generator
export function generateEdgeData(hazards, communities) {
  const edges = [];
  hazards.forEach((hazard) => {
    communities.forEach((community) => {
      edges.push({
        id: `${hazard.id}-${community.id}`,
        from: hazard.id,
        to: community.id,
        riskScore: Math.floor(Math.random() * 100), // random risk for demo
      });
    });
  });
  return edges;
}
