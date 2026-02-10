import React, { useState, useCallback } from "react";
import { LoadScript, GoogleMap, Marker, TrafficLayer, TransitLayer, BicyclingLayer } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 13.0827,
  lng: 80.2707,
};

const GoogleMapView = () => {
  const [loadError, setLoadError] = useState(null);
  const [mapType, setMapType] = useState('roadmap');
  const [layers, setLayers] = useState({
    traffic: false,
    transit: false,
    bicycle: false,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const GOOGLE_API_KEY = "AIzaSyDrD4_Uluk_2vhB5QqtraYS0mGIL4ZIdYk";

  // Toggle layer visibility
  const toggleLayer = useCallback((layerName) => {
    setLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  }, []);

  // Handle map load success
  const onMapLoad = useCallback(() => {
    setIsLoaded(true);
    setLoadError(null);
  }, []);

  // Handle map load error
  const onMapError = useCallback(() => {
    setLoadError("Failed to load Google Maps. Please check your API key and try again.");
    setIsLoaded(false);
  }, []);

  // Check for API key
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY.trim() === "") {
    return (
      <div className="max-w-3xl mx-auto mt-6 p-4 rounded-lg border border-red-300 bg-red-50 text-red-700">
        <p className="font-semibold">⚠️ Google Maps API key missing</p>
        <p className="text-sm mt-1">
          Add <code className="bg-red-100 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> to your <b>.env</b> file.
        </p>
        <p className="text-sm mt-2">
          Get your API key from{" "}
          <a
            href="https://console.cloud.google.com/google/maps-apis"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Google Cloud Console
          </a>
        </p>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <h4 className="font-semibold text-yellow-800">Setup Steps:</h4>
          <ol className="mt-2 text-sm text-yellow-700 list-decimal pl-5 space-y-1">
            <li>Enable "Maps JavaScript API" in Google Cloud Console</li>
            <li>Enable billing for your Google Cloud project</li>
            <li>Add your API key to the .env file</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-5">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">GPS Location</h1>
        <p className="text-sm text-gray-500">Live bus tracking – Chennai</p>
      </div>

      {/* Map Type Controls */}
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Map Type:</span>
          {['roadmap', 'satellite', 'hybrid', 'terrain'].map((type) => (
            <button
              key={type}
              onClick={() => setMapType(type)}
              className={`px-3 py-1 text-xs rounded-md transition ${
                mapType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Layer Controls */}
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Layers:</span>
          {[
            { key: 'traffic', label: 'Traffic', icon: '🚗' },
            { key: 'transit', label: 'Transit', icon: '🚇' },
            { key: 'bicycle', label: 'Bicycle', icon: '🚲' }
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => toggleLayer(key)}
              className={`px-3 py-1 text-xs rounded-md transition flex items-center gap-1 ${
                layers[key]
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-200">
        <LoadScript
          googleMapsApiKey={GOOGLE_API_KEY}
          onError={onMapError}
          loadingElement={
            <div className="h-[400px] flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
                <p className="text-gray-600">Loading Google Maps...</p>
              </div>
            </div>
          }
        >
          {loadError ? (
            <div className="h-[400px] flex items-center justify-center bg-red-50">
              <div className="text-center">
                <p className="text-red-600 font-semibold mb-2">{loadError}</p>
                <button
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                  onClick={() => setLoadError(null)}
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={14}
              mapTypeId={mapType}
              onLoad={onMapLoad}
              options={{
                fullscreenControl: true,
                mapTypeControl: false, // We have our own controls
                streetViewControl: true,
                zoomControl: true,
                gestureHandling: 'greedy',
              }}
            >
              <Marker
                position={center}
                title="Chennai Central Bus Station"
                animation={window.google?.maps?.Animation?.DROP}
              />

              {/* Layer Components */}
              {layers.traffic && <TrafficLayer />}
              {layers.transit && <TransitLayer />}
              {layers.bicycle && <BicyclingLayer />}
            </GoogleMap>
          )}
        </LoadScript>
      </div>

      {/* Status and Info */}
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-600">
        <div className="mb-2 sm:mb-0">
          <span className="font-medium">📍 Coordinates:</span> 13.0827° N, 80.2707° E
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isLoaded ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span>{isLoaded ? 'Map Loaded' : 'Loading...'}</span>
        </div>
      </div>

      {/* Active Layers Indicator */}
      <div className="mt-2 flex flex-wrap gap-1 text-xs text-gray-500">
        <span className="font-medium">Active:</span>
        <span>{mapType.charAt(0).toUpperCase() + mapType.slice(1)} View</span>
        {layers.traffic && <span>• Traffic</span>}
        {layers.transit && <span>• Transit</span>}
        {layers.bicycle && <span>• Bicycle</span>}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
        <p>Map data ©{new Date().getFullYear()} Google</p>
        <button
          onClick={() => window.open(`https://www.google.com/maps?q=${center.lat},${center.lng}`, '_blank')}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Open in Google Maps
        </button>
      </div>
    </div>
  );
};

export default GoogleMapView;

