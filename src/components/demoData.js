// Demo data for Atlas visualization
// Simulated environmental hazards and community data for Dhaka, Bangladesh

// Hazard data - Environmental stress points
export const hazardData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "heat_001",
        type: "heat",
        name: "Dhanmondi Heat Island",
        severity: 0.85,
        timestamp: "2024-01-15T10:00:00Z"
      },
      geometry: {
        type: "Point",
        coordinates: [90.3753, 23.7465]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "heat_002",
        type: "heat",
        name: "Gulshan Commercial Zone",
        severity: 0.72,
        timestamp: "2024-01-15T10:00:00Z"
      },
      geometry: {
        type: "Point",
        coordinates: [90.4125, 23.7925]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "flood_001",
        type: "flood",
        name: "Buriganga Overflow Zone",
        severity: 0.91,
        timestamp: "2024-01-10T08:30:00Z"
      },
      geometry: {
        type: "Point",
        coordinates: [90.3685, 23.7104]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "flood_002",
        type: "flood",
        name: "Ramna Park Flooding",
        severity: 0.65,
        timestamp: "2024-01-12T14:20:00Z"
      },
      geometry: {
        type: "Point",
        coordinates: [90.3938, 23.7388]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "air_001",
        type: "air",
        name: "Tejgaon Industrial Pollution",
        severity: 0.88,
        timestamp: "2024-01-14T09:15:00Z"
      },
      geometry: {
        type: "Point",
        coordinates: [90.3938, 23.7694]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "air_002",
        type: "air",
        name: "Savar Factory District",
        severity: 0.76,
        timestamp: "2024-01-13T11:45:00Z"
      },
      geometry: {
        type: "Point",
        coordinates: [90.2592, 23.8583]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "fire_001",
        type: "fire",
        name: "Chawkbazar Fire Risk Zone",
        severity: 0.79,
        timestamp: "2024-01-16T16:30:00Z"
      },
      geometry: {
        type: "Point",
        coordinates: [90.3958, 23.7167]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "fire_002",
        type: "fire",
        name: "Keraniganj Slum Fire Risk",
        severity: 0.68,
        timestamp: "2024-01-11T12:10:00Z"
      },
      geometry: {
        type: "Point",
        coordinates: [90.3542, 23.6875]
      }
    }
  ]
};

// Community data - Vulnerable populations
export const communityData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "community_001",
        name: "Old Dhaka Ward 12",
        population: 45000,
        vulnerabilityIndex: 0.89,
        averageAge: 38,
        incomeLevel: "low"
      },
      geometry: {
        type: "Point",
        coordinates: [90.3958, 23.7167]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "community_002",
        name: "Korail Slum",
        population: 200000,
        vulnerabilityIndex: 0.95,
        averageAge: 32,
        incomeLevel: "very_low"
      },
      geometry: {
        type: "Point",
        coordinates: [90.4083, 23.7833]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "community_003",
        name: "Dhanmondi Residential",
        population: 28000,
        vulnerabilityIndex: 0.45,
        averageAge: 42,
        incomeLevel: "high"
      },
      geometry: {
        type: "Point",
        coordinates: [90.3753, 23.7465]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "community_004",
        name: "Ramna Park Area",
        population: 15000,
        vulnerabilityIndex: 0.52,
        averageAge: 45,
        incomeLevel: "medium"
      },
      geometry: {
        type: "Point",
        coordinates: [90.3938, 23.7388]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "community_005",
        name: "Tejgaon Worker Housing",
        population: 62000,
        vulnerabilityIndex: 0.78,
        averageAge: 35,
        incomeLevel: "low"
      },
      geometry: {
        type: "Point",
        coordinates: [90.3938, 23.7694]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "community_006",
        name: "Gulshan Elite District",
        population: 12000,
        vulnerabilityIndex: 0.25,
        averageAge: 48,
        incomeLevel: "very_high"
      },
      geometry: {
        type: "Point",
        coordinates: [90.4125, 23.7925]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "community_007",
        name: "Savar Industrial Workers",
        population: 85000,
        vulnerabilityIndex: 0.82,
        averageAge: 33,
        incomeLevel: "low"
      },
      geometry: {
        type: "Point",
        coordinates: [90.2592, 23.8583]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "community_008",
        name: "Keraniganj Riverbank",
        population: 38000,
        vulnerabilityIndex: 0.91,
        averageAge: 36,
        incomeLevel: "very_low"
      },
      geometry: {
        type: "Point",
        coordinates: [90.3542, 23.6875]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "community_009",
        name: "Buriganga Riverside",
        population: 72000,
        vulnerabilityIndex: 0.87,
        averageAge: 39,
        incomeLevel: "low"
      },
      geometry: {
        type: "Point",
        coordinates: [90.3685, 23.7104]
      }
    }
  ]
};

// Function to generate edge data (risk pathways)
export const generateEdgeData = (hazards, communities) => {
  const edges = {
    type: "FeatureCollection",
    features: []
  };

  // Calculate distance between two points (simplified)
  const getDistance = (coord1, coord2) => {
    const dx = coord1[0] - coord2[0];
    const dy = coord1[1] - coord2[1];
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Generate connections based on proximity and vulnerability
  hazards.features.forEach(hazard => {
    communities.features.forEach(community => {
      const distance = getDistance(
        hazard.geometry.coordinates,
        community.geometry.coordinates
      );

      // Create connection if within reasonable distance (0.02 degrees ~ 2km)
      if (distance < 0.02) {
        // Calculate risk weight based on hazard severity, community vulnerability, and distance
        const proximityFactor = Math.max(0, 1 - (distance / 0.02));
        const weight = (hazard.properties.severity * community.properties.vulnerabilityIndex * proximityFactor);

        if (weight > 0.3) { // Only include significant risk pathways
          edges.features.push({
            type: "Feature",
            properties: {
              id: `edge_${hazard.properties.id}_${community.properties.id}`,
              source: hazard.properties.id,
              target: community.properties.id,
              weight: weight,
              type: hazard.properties.type,
              hazardSeverity: hazard.properties.severity,
              communityVulnerability: community.properties.vulnerabilityIndex,
              affectedPopulation: Math.floor(community.properties.population * weight),
              riskLevel: weight > 0.7 ? 'high' : weight > 0.5 ? 'medium' : 'low'
            },
            geometry: {
              type: "LineString",
              coordinates: [
                hazard.geometry.coordinates,
                community.geometry.coordinates
              ]
            }
          });
        }
      }
    });
  });

  return edges;
};

// Additional data for enhanced visualizations
export const riskMetrics = {
  totalPopulationAtRisk: 557000,
  highRiskAreas: 6,
  mediumRiskAreas: 12,
  lowRiskAreas: 8,
  criticalPathways: 15,
  lastUpdated: "2024-01-16T18:30:00Z"
};

export const hazardTypes = {
  heat: {
    name: "Urban Heat Islands",
    color: "#ff5c33",
    icon: "thermometer",
    description: "Areas with significantly higher temperatures due to urban development"
  },
  flood: {
    name: "Flood Zones",
    color: "#3385ff", 
    icon: "droplets",
    description: "Areas prone to flooding from rivers, rainfall, or poor drainage"
  },
  air: {
    name: "Air Pollution",
    color: "#cccccc",
    icon: "cloud",
    description: "Areas with poor air quality from industrial or vehicle emissions"
  },
  fire: {
    name: "Fire Risk Zones",
    color: "#ff3333",
    icon: "flame",
    description: "Areas with high fire risk due to density, materials, or infrastructure"
  }
};