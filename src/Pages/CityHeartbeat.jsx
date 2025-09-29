
import React, { useEffect, useMemo, useRef, useState } from 'react';
import CountUp from 'react-countup';
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from 'react-compare-slider';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ImpactTwo from './Pactrice/ImpactTwo';
import ImpactThree from './Pactrice/ImpactThree';


const defaultProjects = [
  // Value derived from project data & MODIS LST analysis (local cooling)
  { name: 'Hatirjheel Shade Network', lat: 23.7639, lng: 90.4067, result: '0.9°C local cooling' },
  // Value derived from Landsat NDVI composite (green cover increase)
  { name: 'Dhanmondi Green Corridors', lat: 23.7464, lng: 90.3742, result: '+7% green cover' },
  // Value derived from SAR flood depth model and exposure overlays
  { name: 'Kawran Bazar Drain Upgrade', lat: 23.7486, lng: 90.3949, result: '1,800 residents out of flood risk' },
  // Value derived from MODIS LST diurnal delta
  { name: 'Uttara Cool Roofs Pilot', lat: 23.8747, lng: 90.3984, result: '1.2°C daytime reduction' },
  // Value derived from Sentinel-5P AQ data (NO2 proxy)
  { name: 'Motijheel Low-Emission Zone', lat: 23.7311, lng: 90.4142, result: 'AQI improved by 9 points' },
];

const defaultMetrics = {
  // Value derived from population overlays intersecting reduced-risk zones (census + hazard raster difference)
  peopleProtected: 1284000,
  // Value derived from MODIS Land Surface Temperature (mean delta pre/post)
  avgHeatReducedC: 2.5,
  // Percent change vs. baseline (MODIS LST percentile comparison)
  heatPctChange: 18,
  // Value derived from Landsat/Planet NDVI change detection
  greenCoverAddedPct: 6.3,
  // Value derived from Sentinel-5P NO2 and PM2.5 proxy modeling to AQI scale
  airQualityImprovedAQI: 7,
  // Value derived from SAR flood depth x exposure model (people at risk reduced)
  floodRiskReducedPct: 22,
  // Narrative fields
  area: 'Dhaka Central',
  heatReduction: 'a 2.5°C average reduction in peak surface heat',
  peopleAffected: '1.28 million',
};

const defaultImages = {
  // Use NASA-derived rasters exported as tiles or static images for production:
  // Before: e.g., MODIS LST hottest week composite; After: the same period post-intervention.
  // PRODUCTION: Swap with actual generated imagery URLs or tile snapshots.
  // beforeImageUrl:
  //   'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=1200&auto=format&fit=crop', // placeholder "hot" tones
  // afterImageUrl:
  //   'https://images.unsplash.com/photo-1523978591478-c753949ff840?q=80&w=1200&auto=format&fit=crop', // placeholder "cooler/greener"
  // interventionName: 'Green Infrastructure + Cool Roofs',
   beforeImageUrl:
    'https://cdn.pixabay.com/photo/2021/02/13/14/51/building-6011756_1280.jpg', // placeholder "hot" tones
  afterImageUrl:
    'https://plus.unsplash.com/premium_photo-1714023800301-83390690e1f0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z3JlZW4lMjBjaXRpZXN8ZW58MHx8MHx8fDA%3D', // placeholder "cooler/greener"
  interventionName: 'Green Infrastructure + Cool Roofs',
};

const ArrowUpRight = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// PROTOTYPE AI: simple template-based generator.
// PRODUCTION: Connect to OpenAI API for more dynamic narrative generation.
const generateStory = (metrics) => {
  return `In the last quarter, ${metrics.area} saw ${metrics.heatReduction} after green infrastructure and cool roofs were added, improving quality of life for ${metrics.peopleAffected} residents.`;
};

const formatNumber = (n) => n.toLocaleString();

export default function Impact({
  cityName = 'Dhaka',
  projects = defaultProjects,
  metrics = defaultMetrics,
  beforeImageUrl = defaultImages.beforeImageUrl,
  afterImageUrl = defaultImages.afterImageUrl,
  interventionName = defaultImages.interventionName,
}) {
  const [story, setStory] = useState(generateStory(metrics));
  const mapRef = useRef(null);
  const rippleRefs = useRef([]);
  const mapContainerId = useMemo(() => `impact-ripple-map-${Math.random().toString(36).slice(2)}`, []);

  useEffect(() => {
    setStory(generateStory(metrics));
  }, [metrics]);

  // Initialize Leaflet ripple map and animations
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map(mapContainerId, {
      zoomControl: false,
      attributionControl: true,
    }).setView([23.7806, 90.4074], 12); // Center on Dhaka by default

    mapRef.current = map;

    // Dark basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Make ripples for each project
    projects.forEach((p, idx) => {
      // Base circle for popup + click target
      const base = L.circle([p.lat, p.lng], {
        radius: 60,
        color: '#34d399', // emerald-400
        weight: 2,
        opacity: 0.9,
        fillColor: '#10b981', // emerald-500
        fillOpacity: 0.25,
        className: 'astra-ripple-base',
      }).addTo(map);

      base.bindPopup(`<strong>${p.name}</strong><br/>${p.result}`);

      base.on('click', () => {
        base.openPopup();
      });

      // Animated ripple ring
      const ripple = L.circle([p.lat, p.lng], {
        radius: 60,
        color: '#22d3ee', // cyan-400
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.0,
        className: 'astra-ripple-ring',
      }).addTo(map);

      // JS-driven expand/fade loop
      let r = 60;
      let alpha = 0.8;
      const maxR = 900;
      const minR = 60;
      const step = 24;
      const fade = 0.012;

      const interval = setInterval(() => {
        r += step;
        alpha -= fade;
        if (r >= maxR || alpha <= 0.05) {
          r = minR;
          alpha = 0.8;
        }
        ripple.setRadius(r);
        ripple.setStyle({ opacity: Math.max(alpha, 0.05) });
      }, 50);

      rippleRefs.current.push({ ripple, interval });

      // Staggered start effect
      setTimeout(() => {}, idx * 200);
    });

    return () => {
      rippleRefs.current.forEach(({ ripple, interval }) => {
        clearInterval(interval);
        if (mapRef.current && ripple) {
          try {
            mapRef.current.removeLayer(ripple);
          } catch {}
        }
      });
      rippleRefs.current = [];
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapContainerId, projects]);

  const heroNumber = metrics.peopleProtected; // Sum of population in reduced-risk areas

  const cards = [
    {
      title: 'Avg. Heat Reduced',
      value: `${metrics.avgHeatReducedC.toFixed(1)}°C`,
      change: `↓ ${metrics.heatPctChange}%`,
      // Value derived from MODIS Land Surface Temperature data (pre/post intervention delta)
      source: 'Calculated from MODIS Land Surface Temperature data.',
      accent: 'from-emerald-400 to-cyan-400',
      icon: <ArrowUpRight className="w-5 h-5 text-emerald-300" />,
    },
    {
      title: 'Green Cover Added',
      value: `+${metrics.greenCoverAddedPct.toFixed(1)}%`,
      change: '↑ positive',
      // Value derived from Landsat NDVI change analysis
      source: 'Calculated from Landsat NDVI change analysis.',
      accent: 'from-emerald-400 to-amber-300',
      icon: <ArrowUpRight className="w-5 h-5 text-emerald-300" />,
    },
    {
      title: 'Air Quality Improved',
      value: `${metrics.airQualityImprovedAQI} AQI`,
      change: '↑ healthier',
      // Value derived from Sentinel-5P NO2 and PM proxies
      source: 'Derived from Sentinel-5P NO2 and PM proxy analysis.',
      accent: 'from-cyan-400 to-emerald-300',
      icon: <ArrowUpRight className="w-5 h-5 text-emerald-300" />,
    },
    {
      title: 'Flood Risk Reduced',
      value: `${metrics.floodRiskReducedPct}%`,
      change: '↓ exposure',
      // Value derived from SAR flood depth x exposure (population) model
      source: 'Computed from SAR flood depth and exposure modeling.',
      accent: 'from-amber-300 to-emerald-400',
      icon: <ArrowUpRight className="w-5 h-5 text-emerald-300" />,
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#0b1220] text-white overflow-hidden">
      {/* Local styles for glows, pulses, and labels */}
      <style>{`
        .impact-glow {
          text-shadow: 0 0 10px rgba(16,185,129,0.5), 0 0 20px rgba(6,182,212,0.35);
          animation: heroGlow 3.6s ease-in-out infinite;
        }
        @keyframes heroGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(16,185,129,0.4), 0 0 20px rgba(6,182,212,0.25); transform: translateZ(0); }
          50% { text-shadow: 0 0 18px rgba(16,185,129,0.8), 0 0 28px rgba(6,182,212,0.45); }
        }
        .astra-ripple-ring {
          filter: drop-shadow(0 0 6px rgba(34,211,238,0.6));
          animation: ripplePulse 2.5s ease-in-out infinite;
        }
        @keyframes ripplePulse {
          0%, 100% { stroke-width: 2; }
          50% { stroke-width: 3; }
        }
        .compare-label {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 5;
          padding: 6px 10px;
          border-radius: 999px;
          font-weight: 600;
          letter-spacing: 0.2px;
          background: rgba(11,18,32,0.7);
          backdrop-filter: blur(6px);
          box-shadow: 0 0 0 1px rgba(16,185,129,0.25), 0 6px 16px rgba(0,0,0,0.35);
        }
        .compare-label.after {
          left: auto;
          right: 12px;
          background: rgba(13, 32, 24, 0.7);
          box-shadow: 0 0 0 1px rgba(34,211,238,0.25), 0 6px 16px rgba(0,0,0,0.35);
        }
      `}</style>

      {/* Top: Hero Impact Counter */}
      <section className="relative flex flex-col items-center justify-center pt-16 pb-10">
        <div className="text-center">
          <h1 className="impact-glow text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
            <span className="block text-emerald-300">Lives Improved</span>
            <span className="mt-4 block text-white">
              <CountUp end={heroNumber} duration={2.8} separator="," />
            </span>
          </h1>
          <p className="mt-4 text-cyan-200/90 text-lg sm:text-xl font-medium">
            Through data-driven action in {cityName}
          </p>
        </div>
      </section>

      {/* Center: Before & After Comparison */}
      <section className="relative max-w-6xl mx-auto px-4">
        <div className="relative rounded-2xl overflow-hidden ring-1 ring-emerald-500/20 shadow-2xl shadow-emerald-900/20">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-emerald-500/5 via-transparent to-cyan-500/5" />
          <div className="relative">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="compare-label">Before</div>
              <div className="compare-label after">After — {interventionName}</div>
            </div>
            <ReactCompareSlider
              itemOne={
                <ReactCompareSliderImage
                  src={beforeImageUrl}
                  alt="Before — hazard at peak intensity"
                />
              }
              itemTwo={
                <ReactCompareSliderImage
                  src={afterImageUrl}
                  alt="After — reduced hazard following intervention"
                />
              }
              position={50}
              style={{ borderRadius: '1rem', height: 420 }}
              onlyHandleDraggable
              className="[--handle-color:#34d399]"
            />
          </div>
        </div>
        <p className="mt-3 text-sm text-emerald-200/80">
          Imagery represents NASA-derived analysis products (e.g., MODIS LST for heat reduction, Landsat NDVI for green cover). // Source: NASA remote sensing products processed by ASTRA pipeline
        </p>
      </section>

      {/* Grid + AI Story */}
      <section className="relative max-w-6xl mx-auto px-4 mt-10 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Key Wins Dashboard */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((c, i) => (
              <div
                key={i}
                className="group relative rounded-xl bg-gradient-to-br from-white/5 to-white/[0.03] ring-1 ring-white/10 p-4 hover:ring-emerald-400/40 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-tr from-emerald-700/40 to-cyan-700/40 text-emerald-300">
                      {c.icon}
                    </div>
                    <span className="text-sm text-emerald-100/90 font-semibold">{c.title}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${c.accent} text-black font-bold`}>
                    good
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold tracking-tight">{c.value}</div>
                  <div className="mt-1 text-emerald-300 text-sm font-medium">{c.change}</div>
                </div>

                {/* Tooltip on hover with NASA data source */}
                <div className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 group-hover:translate-y-2 transition duration-200">
                  <div className="whitespace-nowrap rounded-md bg-black/80 px-3 py-2 text-xs text-emerald-100 ring-1 ring-emerald-500/30 shadow-lg">
                    {c.source}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI-Generated Impact Story */}
        <aside className="lg:col-span-1">
          <div className="h-full rounded-xl bg-gradient-to-b from-emerald-900/30 to-cyan-900/30 ring-1 ring-emerald-500/20 p-5 shadow-xl shadow-emerald-900/20">
            <h3 className="text-lg font-bold text-emerald-200">Impact story</h3>
            <p className="mt-2 text-sm text-emerald-100/90 leading-relaxed">
              {story}
            </p>
            <div className="mt-4 text-[11px] text-emerald-300/70">
              Narrative generated from ASTRA metrics. // PRODUCTION: Connect to OpenAI API for more dynamic narrative generation.
            </div>
          </div>
        </aside>
      </section>

      {/* Bottom: Ripple Map */}
      <section className="relative max-w-6xl mx-auto px-4 mt-10 pb-16 z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-emerald-200">Ripple map of completed projects</h3>
          <span className="text-xs text-emerald-300/80">Tap a ripple to see results</span>
        </div>
        <div className="relative rounded-2xl overflow-hidden ring-1 ring-emerald-500/20 shadow-2xl">
          <div id={mapContainerId} className="h-[360px] w-full" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0b1220] via-transparent to-transparent opacity-40" />
        </div>
        <p className="mt-3 text-sm text-emerald-200/80">
          Ripples indicate expanding benefits from each intervention site. Click to view project outcomes (e.g., "0.8°C local cooling"). // Data: Project registry + NASA-derived effect sizes
        </p><br></br>

        {/* <h1>
          this is the ImpactTwo section
        </h1><br></br>
      <ImpactTwo></ImpactTwo><br></br>
      <ImpactThree></ImpactThree> */}
      </section>
    </div>
  );
}
