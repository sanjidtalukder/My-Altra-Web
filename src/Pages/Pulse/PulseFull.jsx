import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Thermometer, 
  Sun, 
  CloudRain, 
  Wind, 
  Download, 
  Calendar,
  MapPin,
  RefreshCw
} from 'lucide-react';

const PulseNewFull = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parameters, setParameters] = useState({
    start: '20230101',
    end: '20230107',
    latitude: 40.7128,
    longitude: -74.0060,
    community: 'RE'
  });

  // Fetch data from NASA POWER API
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { start, end, latitude, longitude, community } = parameters;
      const url = `https://power.larc.nasa.gov/api/temporal/hourly/point?start=${start}&end=${end}&latitude=${latitude}&longitude=${longitude}&community=${community}&format=JSON&parameters=T2M,RH2M,PS,WS10M,WD10M,ALLSKY_SFC_SW_DWN`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Transform the data into a format suitable for charts
      const processedData = processApiData(result);
      setData(processedData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Process the API response into chart-friendly format
  const processApiData = (apiData) => {
    const { properties } = apiData;
    const parameters = properties.parameter;
    
    // Get the time indexes (keys from any parameter object)
    const timeIndexes = Object.keys(parameters[Object.keys(parameters)[0]]);
    
    return timeIndexes.map(timeIndex => {
      const dateStr = timeIndex; // Format: YYYYMMDDHH
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      const hour = dateStr.substring(8, 10);
      
      return {
        timeIndex,
        date: `${month}/${day}/${year}`,
        hour: `${hour}:00`,
        temperature: parameters.T2M ? parameters.T2M[timeIndex] : null,
        humidity: parameters.RH2M ? parameters.RH2M[timeIndex] : null,
        pressure: parameters.PS ? parameters.PS[timeIndex] : null,
        windSpeed: parameters.WS10M ? parameters.WS10M[timeIndex] : null,
        windDirection: parameters.WD10M ? parameters.WD10M[timeIndex] : null,
        solarRadiation: parameters.ALLSKY_SFC_SW_DWN ? parameters.ALLSKY_SFC_SW_DWN[timeIndex] : null
      };
    });
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const handleParameterChange = (e) => {
    const { name, value } = e.target;
    setParameters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-100 p-4 rounded-lg shadow-lg border border-base-300">
          <p className="font-bold">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value} ${entry.unit || ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">NASA POWER Data Visualization</h1>
          <p className="text-lg text-indigo-600">
            Access and visualize NASA's Prediction Of Worldwide Energy Resources (POWER) data
          </p>
        </div>

        {/* Parameters Form */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">
              <Calendar className="mr-2" />
              Request Parameters
            </h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Start Date (YYYYMMDD)</span>
                </label>
                <input
                  type="text"
                  name="start"
                  value={parameters.start}
                  onChange={handleParameterChange}
                  className="input input-bordered"
                  placeholder="e.g., 20230101"
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">End Date (YYYYMMDD)</span>
                </label>
                <input
                  type="text"
                  name="end"
                  value={parameters.end}
                  onChange={handleParameterChange}
                  className="input input-bordered"
                  placeholder="e.g., 20230107"
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Latitude</span>
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={parameters.latitude}
                  onChange={handleParameterChange}
                  className="input input-bordered"
                  placeholder="e.g., 40.7128"
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Longitude</span>
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={parameters.longitude}
                  onChange={handleParameterChange}
                  className="input input-bordered"
                  placeholder="e.g., -74.0060"
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Community</span>
                </label>
                <select
                  name="community"
                  value={parameters.community}
                  onChange={handleParameterChange}
                  className="select select-bordered"
                >
                  <option value="AG">Agroclimatology</option>
                  <option value="RE">Renewable Energy</option>
                  <option value="SB">Sustainable Buildings</option>
                </select>
              </div>
              
              <div className="form-control md:col-span-2 lg:col-span-5 mt-4">
                <button type="submit" className="btn btn-primary w-full">
                  <RefreshCw className="mr-2" />
                  Fetch Data
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Location Info */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">
              <MapPin className="mr-2" />
              Location Information
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="stat">
                <div className="stat-title">Latitude</div>
                <div className="stat-value text-lg">{parameters.latitude}°</div>
              </div>
              <div className="stat">
                <div className="stat-title">Longitude</div>
                <div className="stat-value text-lg">{parameters.longitude}°</div>
              </div>
              <div className="stat">
                <div className="stat-title">Start Date</div>
                <div className="stat-value text-lg">{parameters.start}</div>
              </div>
              <div className="stat">
                <div className="stat-title">End Date</div>
                <div className="stat-value text-lg">{parameters.end}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="mt-4 text-lg">Fetching NASA POWER data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-error shadow-lg mb-8">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Error: {error}</span>
            </div>
          </div>
        )}

        {/* Data Visualization */}
        {!loading && !error && data.length > 0 && (
          <>
            {/* Temperature Chart */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">
                  <Thermometer className="mr-2" />
                  Temperature (°C)
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis unit="°C" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="temperature" 
                        stroke="#8884d8" 
                        name="Temperature"
                        unit="°C"
                        dot={{ r: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Solar Radiation Chart */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">
                  <Sun className="mr-2" />
                  Solar Radiation (kW/m²)
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis unit="kW/m²" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="solarRadiation" 
                        stroke="#ff7300" 
                        name="Solar Radiation"
                        unit="kW/m²"
                        dot={{ r: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Wind Speed Chart */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">
                  <Wind className="mr-2" />
                  Wind Speed (m/s)
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis unit="m/s" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="windSpeed" 
                        stroke="#82ca9d" 
                        name="Wind Speed"
                        unit="m/s"
                        dot={{ r: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">Raw Data</h2>
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Temp (°C)</th>
                        <th>Humidity (%)</th>
                        <th>Wind (m/s)</th>
                        <th>Solar (kW/m²)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.slice(0, 10).map((item, index) => (
                        <tr key={index}>
                          <td>{item.date}</td>
                          <td>{item.hour}</td>
                          <td>{item.temperature !== null ? item.temperature.toFixed(1) : 'N/A'}</td>
                          <td>{item.humidity !== null ? item.humidity.toFixed(1) : 'N/A'}</td>
                          <td>{item.windSpeed !== null ? item.windSpeed.toFixed(1) : 'N/A'}</td>
                          <td>{item.solarRadiation !== null ? item.solarRadiation.toFixed(2) : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-outline btn-primary">
                    <Download className="mr-2" />
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PulseNewFull;