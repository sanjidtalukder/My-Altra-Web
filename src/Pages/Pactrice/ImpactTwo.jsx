// Impact.jsx
// Cinematic "Victory Screen" showing ASTRA-powered outcomes
// Dependencies: react, react-countup, react-compare-slider, leaflet, tailwindcss

import React, { useEffect, useState, useRef, useMemo } from 'react';
import CountUp from 'react-countup';
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from 'react-compare-slider';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const defaultProjects = [
  {
    name: 'Hatirjheel Shade Network',
    lat: 23.7639,
    lng: 90.4067,
    result: '0.9°C local cooling',
  },
  {
    name: 'Dhanmondi Green Corridors',
    lat: 23.7464,
    lng: 90.3742,
    result: '+7% green cover',
  },
  {
    name: 'Kawran Bazar Drain Upgrade',
    lat: 23.7486,
    lng: 90.3949,
    result: '1,800 residents out of flood risk',
  },
  {
    name: 'Uttara Cool Roofs Pilot',
    lat: 23.8747,
    lng: 90.3984,
    result: '1.2°C daytime reduction',
  },
  {
    name: 'Motijheel Low-Emission Zone',
    lat: 23.7311,
    lng: 90.4142,
    result: 'AQI improved by 9 points',
  },
];

const defaultMetrics = {
  peopleProtected: 1284000,
  avgHeatReducedC: 2.5,
  heatPctChange: 18,
  greenCoverAddedPct: 6.3,
  airQualityImprovedAQI: 7,
  floodRiskReducedPct: 22,
  area: 'Dhaka Central',
  heatReduction: 'a 2.5°C average reduction in peak surface heat',
  peopleAffected: '1.28 million',
};

const defaultImages = {
  beforeImageUrl:
    'https://plus.unsplash.com/premium_photo-1714023800301-83390690e1f0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z3JlZW4lMjBjaXRpZXN8ZW58MHx8MHx8fDA%3D',
  afterImageUrl:
    'https://images.unsplash.com/photo-1523978591478-c753949ff840?q=80&w=1200&auto=format&fit=crop',
  interventionName: 'Green Infrastructure + Cool Roofs',
};

// Simple template-based story generator.
// PRODUCTION: Connect to OpenAI API for dynamic narratives.
const generateStory = (metrics) => {
  return `In the last quarter, ${metrics.area} saw ${metrics.heatReduction} after green infrastructure and cool roofs were added, improving quality of life for ${metrics.peopleAffected} residents.`;
};

const ImpactTwo = ({
  cityName = 'Dhaka',
  projects = defaultProjects,
  metrics = defaultMetrics,
  beforeImageUrl = defaultImages.beforeImageUrl,
  afterImageUrl = defaultImages.afterImageUrl,
  interventionName = defaultImages.interventionName,
}) => {
  const [story, setStory] = useState(() => generateStory(metrics));
  const mapRef = useRef(null);
  const ripplesRef = useRef([]);
  const mapId = useMemo(() => `impact-map-${Math.random().toString(36).slice(2)}`, []);

  // Re-generate story if metrics change
  useEffect(() => {
    setStory(generateStory(metrics));
  }, [metrics]);

  // Initialize Leaflet map with pulsing ripples
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map(mapId, {
      zoomControl: false,
      attributionControl: true,
    }).setView([23.7806, 90.4074], 12);

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map);

    mapRef.current = map;

    projects.forEach((p, idx) => {
      const baseCircle = L.circle([p.lat, p.lng], {
        radius: 80,
        color: '#34d399',
        weight: 2,
        fillColor: '#10b981',
        fillOpacity: 0.3,
      })
        .addTo(map)
        .bindPopup(`<strong>${p.name}</strong><br/>${p.result}`);

      baseCircle.on('click', () => baseCircle.openPopup());

      const ripple = L.circle([p.lat, p.lng], {
        radius: 80,
        color: '#22d3ee',
        weight: 2,
        fillOpacity: 0,
      }).addTo(map);

      let radius = 80;
      let opacity = 0.8;
      const maxRadius = 800;
      const expandStep = 20;
      const fadeStep = 0.02;

      const interval = setInterval(() => {
        radius += expandStep;
        opacity -= fadeStep;

        if (radius >= maxRadius || opacity <= 0.1) {
          radius = 80;
          opacity = 0.8;
        }

        ripple.setRadius(radius);
        ripple.setStyle({ opacity });
      }, 60);

      ripplesRef.current.push({ ripple, interval });

      // Stagger start
      setTimeout(() => {}, idx * 200);
    });

    return () => {
      ripplesRef.current.forEach(({ ripple, interval }) => {
        clearInterval(interval);
        if (mapRef.current && ripple) {
          try {
            mapRef.current.removeLayer(ripple);
          } catch {}
        }
      });
      ripplesRef.current = [];
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapId, projects]);

  // Data cards
  const cards = [
    {
      title: 'Avg. Heat Reduced',
      value: `${metrics.avgHeatReducedC.toFixed(1)}°C`,
      change: `↓ ${metrics.heatPctChange}%`,
      source: 'MODIS Land Surface Temperature data.',
      accent: 'from-emerald-400 to-cyan-400',
    },
    {
      title: 'Green Cover Added',
      value: `+${metrics.greenCoverAddedPct.toFixed(1)}%`,
      change: '↑ positive',
      source: 'Landsat NDVI analysis.',
      accent: 'from-emerald-400 to-amber-300',
    },
    {
      title: 'Air Quality Improved',
      value: `${metrics.airQualityImprovedAQI} AQI`,
      change: '↑ healthier',
      source: 'Sentinel-5P NO₂ proxy.',
      accent: 'from-cyan-400 to-emerald-300',
    },
    {
      title: 'Flood Risk Reduced',
      value: `${metrics.floodRiskReducedPct}%`,
      change: '↓ exposure',
      source: 'SAR flood-depth modeling.',
      accent: 'from-amber-300 to-emerald-400',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <style>
        {`
          .hero-glow {
            text-shadow: 0 0 10px rgba(16,185,129,0.5), 0 0 20px rgba(6,182,212,0.35);
            animation: glow 3s ease-in-out infinite;
          }
          @keyframes glow {
            0%,100% { text-shadow: 0 0 10px rgba(16,185,129,0.4), 0 0 20px rgba(6,182,212,0.25); }
            50% { text-shadow: 0 0 18px rgba(16,185,129,0.8), 0 0 28px rgba(6,182,212,0.45); }
          }
        `}
      </style>

      {/* Hero Counter */}
      <section className="flex flex-col items-center py-16">
        <h1 className="hero-glow text-6xl font-extrabold">
          Lives Improved
        </h1>
        <div className="mt-4 text-5xl font-bold">
          <CountUp end={metrics.peopleProtected} duration={3} separator="," />
        </div>
        <p className="mt-2 text-cyan-200">
          Through data-driven action in {cityName}
        </p>
      </section>

      {/* Before & After */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="relative rounded-xl overflow-hidden shadow-xl ring-1 ring-emerald-500/30">
          <ReactCompareSlider
            itemOne={
              <ReactCompareSliderImage
                src={beforeImageUrl}
                alt="Before intervention"
              />
            }
            itemTwo={
              <ReactCompareSliderImage
                src={afterImageUrl}
                alt="After intervention"
              />
            }
            position={50}
            style={{ height: 400 }}
          />
          <div className="absolute top-4 left-4 bg-black/50 text-sm px-3 py-1 rounded">
            Before
          </div>
          <div className="absolute top-4 right-4 bg-black/50 text-sm px-3 py-1 rounded">
            After – {interventionName}
          </div>
        </div>
        <p className="mt-2 text-xs text-emerald-300">
          Imagery from NASA-derived products (e.g., MODIS LST, Landsat NDVI).
        </p>
      </section>

      {/* Metrics & Story */}
      <section className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c, i) => (
            <div
              key={i}
              className="group relative p-4 bg-white/[0.05] rounded-lg ring-1 ring-white/10 hover:ring-emerald-400/50 transition"
            >
              <h4 className="text-sm font-semibold">{c.title}</h4>
              <div className="mt-2 text-2xl font-bold">{c.value}</div>
              <div className="text-emerald-300">{c.change}</div>
              <div className="absolute bottom-2 left-2 text-xs opacity-0 group-hover:opacity-100 transition">
                Source: {c.source}
              </div>
            </div>
          ))}
        </div>
        <aside className="lg:col-span-1 p-4 bg-white/[0.05] rounded-lg ring-1 ring-white/10">
          <h3 className="text-lg font-bold text-emerald-200">Impact Story</h3>
          <p className="mt-2 text-sm">{story}</p>
          <div className="mt-3 text-[10px] text-emerald-300">
            Narrative from ASTRA metrics. (PRODUCTION: connect OpenAI)
          </div>
        </aside>
      </section>

      {/* Ripple Map */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h3 className="text-lg font-bold text-emerald-200 mb-2">
          Ripple Map of Projects
        </h3>
        <div className="relative rounded-lg overflow-hidden shadow-xl ring-1 ring-emerald-500/30">
          <div id={mapId} className="h-96 w-full" />
        </div>
        <p className="mt-2 text-xs text-emerald-300">
          Ripples show expanding project benefits—click for details.
        </p>
      </section>
    </div>
  );
};

export default ImpactTwo;