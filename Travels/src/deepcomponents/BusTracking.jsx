// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { GoogleMap, Marker, InfoWindow, LoadScript } from '@react-google-maps/api'
// const BusTracking = () => {
//   const [bus, setBus] = useState(null)
//   const [currentLocation, setCurrentLocation] = useState(null)
//   const [routeProgress, setRouteProgress] = useState(0)
//   const [estimatedArrival, setEstimatedArrival] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [selectedMarker, setSelectedMarker] = useState(null)
//   const [mapCenter, setMapCenter] = useState({
//     lat: 12.9716, // Default to Bangalore
//     lng: 77.5946
//   })

//   const location = useLocation()
//   const navigate = useNavigate()
//   const busId = location.state?.busId

//   const mapContainerStyle = {
//     width: '100%',
//     height: '400px',
//     borderRadius: '8px'
//   }

//   // Mock location data generator - fixed to not depend on bus initially
//   const generateMockLocation = useCallback((busId, route = 'Route') => {
//     const baseLat = 12.9716 + (parseInt(busId) % 10) * 0.01
//     const baseLng = 77.5946 + (parseInt(busId) % 10) * 0.01
//     return {
//       latitude: baseLat + Math.random() * 0.02 - 0.01,
//       longitude: baseLng + Math.random() * 0.02 - 0.01,
//       address: `Near ${route} Stop`,
//       speed: Math.floor(Math.random() * 60) + 20,
//       heading: Math.floor(Math.random() * 360),
//       lastUpdated: new Date()
//     }
//   }, [])

//   useEffect(() => {
//     const fetchBusDetails = async () => {
//       try {
//         // Fetch bus details - corrected endpoint
//         const busResponse = await axios.get(`/api/buses/${busId}/`)
//         const busData = busResponse.data

//         // Add mock departure/arrival times
//         const now = new Date()
//         const departureTime = new Date(now.getTime() - Math.random() * 2 * 60 * 60 * 1000) // Random past time
//         const arrivalTime = new Date(departureTime.getTime() + 4 * 60 * 60 * 1000) // 4 hours later

//         const enhancedBusData = {
//           ...busData,
//           departure_time: departureTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
//           arrival_time: arrivalTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
//         }

//         setBus(enhancedBusData)

//         // Use mock location data with route
//         const mockLocation = generateMockLocation(busId, enhancedBusData.route)
//         setCurrentLocation(mockLocation)
//         setMapCenter({
//           lat: mockLocation.latitude,
//           lng: mockLocation.longitude
//         })

//         // Calculate route progress
//         const progress = Math.floor(Math.random() * 100)
//         setRouteProgress(progress)

//         // Estimate arrival time
//         const estimatedArrivalTime = new Date(now.getTime() + ((100 - progress) / 100 * 2 * 60 * 60 * 1000))
//         setEstimatedArrival(estimatedArrivalTime)

//         setLoading(false)
//       } catch (error) {
//         console.error('Error fetching bus details:', error)
//         setError('Failed to load bus tracking information. Please check your connection.')
//         setLoading(false)
//       }
//     }

//     if (busId) {
//       fetchBusDetails()

//       // Set up auto-refresh every 30 seconds for faster updates
//       const intervalId = setInterval(() => {
//         // Only update location and progress, not full fetch
//         if (bus) {
//           const mockLocation = generateMockLocation(busId, bus.route)
//           setCurrentLocation(mockLocation)
//           setMapCenter({
//             lat: mockLocation.latitude,
//             lng: mockLocation.longitude
//           })
//           const progress = Math.floor(Math.random() * 100)
//           setRouteProgress(progress)
//           const now = new Date()
//           const estimatedArrivalTime = new Date(now.getTime() + ((100 - progress) / 100 * 2 * 60 * 60 * 1000))
//           setEstimatedArrival(estimatedArrivalTime)
//         }
//       }, 30000) // Reduced from 60s to 30s for faster updates

//       return () => clearInterval(intervalId)
//     }
//   }, [busId]) // Removed generateMockLocation from dependencies as it's memoized

//   // Memoized time remaining calculation
//   const timeRemaining = useMemo(() => {
//     if (!estimatedArrival) return null

//     const now = new Date()
//     const diffMs = estimatedArrival - now
//     const diffMins = Math.round(diffMs / 60000)

//     if (diffMins <= 0) return 'Arrived'
//     if (diffMins < 60) return `${diffMins} minutes`

//     const hours = Math.floor(diffMins / 60)
//     const mins = diffMins % 60
//     return `${hours}h ${mins}m`
//   }, [estimatedArrival])

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
//         <p className="text-gray-600">Loading bus tracking information...</p>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="max-w-4xl mx-auto p-4 md:p-6">
//         <div className="text-center py-12 bg-white rounded-xl shadow-lg p-8">
//           <div className="text-5xl mb-4">🚍</div>
//           <h2 className="text-2xl font-bold text-red-600 mb-4">Unable to Track Bus</h2>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <div className="space-y-4">
//             <button
//               onClick={() => navigate('/my-bookings')}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
//             >
//               Back to My Bookings
//             </button>
//             <button
//               onClick={() => window.location.reload()}
//               className="block mx-auto px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-4 md:p-6">
//       <div className="mb-6">
//         <button
//           onClick={() => navigate('/my-bookings')}
//           className="px-5 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium flex items-center gap-2"
//         >
//           <span>←</span> Back to Bookings
//         </button>
//       </div>

//       <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
//         <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">Live Bus Tracking</h1>
//           <div className="mt-2 md:mt-0">
//             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
//               <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
//               Live Tracking Active
//             </span>
//           </div>
//         </div>

//         {bus && (
//           <div className="bg-blue-50 rounded-lg p-5 mb-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Bus Route</p>
//                 <p className="text-lg font-bold text-gray-800">{bus.route}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Bus ID</p>
//                 <p className="text-lg font-bold text-gray-800">{bus.bus_id}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Bus Type</p>
//                 <p className="text-lg font-bold text-gray-800">{bus.bus_type}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Depot</p>
//                 <p className="text-lg font-bold text-gray-800">{bus.depot}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//           {/* Route Progress Card */}
//           <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
//             <h3 className="text-lg font-semibold mb-4 flex items-center">
//               <span className="mr-2">📊</span> Route Progress
//             </h3>
//             <div className="mb-4">
//               <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
//                 <div
//                   className="bg-blue-600 h-4 rounded-full transition-all duration-500"
//                   style={{ width: `${routeProgress}%` }}
//                 ></div>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">Departure</span>
//                 <span className="font-medium text-blue-600">{routeProgress}%</span>
//                 <span className="text-gray-600">Arrival</span>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-4 text-center">
//               <div>
//                 <p className="text-sm text-gray-600">Departure Time</p>
//                 <p className="font-bold">{bus?.departure_time || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">Arrival Time</p>
//                 <p className="font-bold">{bus?.arrival_time || 'N/A'}</p>
//               </div>
//             </div>
//           </div>

//           {/* Current Location Card */}
//           {currentLocation && (
//             <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
//               <h3 className="text-lg font-semibold mb-4 flex items-center">
//                 <span className="mr-2">📍</span> Current Location
//               </h3>
//               <div className="space-y-3">
//                 <div>
//                   <p className="text-sm text-gray-600">Coordinates</p>
//                   <p className="font-mono text-sm bg-gray-100 p-2 rounded">
//                     {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Address</p>
//                   <p className="text-sm font-medium">{currentLocation.address}</p>
//                 </div>
//                 {(currentLocation.speed || currentLocation.heading) && (
//                   <div className="grid grid-cols-2 gap-4">
//                     {currentLocation.speed && (
//                       <div>
//                         <p className="text-sm text-gray-600">Speed</p>
//                         <p className="font-bold">{currentLocation.speed} km/h</p>
//                       </div>
//                     )}
//                     {currentLocation.heading && (
//                       <div>
//                         <p className="text-sm text-gray-600">Direction</p>
//                         <p className="font-bold">{currentLocation.heading}°</p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//                 {currentLocation.lastUpdated && (
//                   <p className="text-xs text-gray-500">
//                     Updated: {currentLocation.lastUpdated.toLocaleTimeString('en-IN')}
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Estimated Arrival Card */}
//           <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
//             <h3 className="text-lg font-semibold mb-4 flex items-center">
//               <span className="mr-2">⏰</span> Estimated Arrival
//             </h3>
//             {estimatedArrival ? (
//               <div className="space-y-4">
//                 <div className="text-center">
//                   <p className="text-3xl font-bold text-green-600">
//                     {estimatedArrival.toLocaleTimeString('en-IN', {
//                       hour: '2-digit',
//                       minute: '2-digit',
//                       hour12: true
//                     })}
//                   </p>
//                   <p className="text-sm text-gray-600 mt-1">
//                     {estimatedArrival.toLocaleDateString('en-IN', {
//                       weekday: 'long',
//                       day: 'numeric',
//                       month: 'long'
//                     })}
//                   </p>
//                 </div>
//                 {timeRemaining && (
//                   <div className="text-center">
//                     <p className="text-sm text-gray-600">Time Remaining</p>
//                     <p className="text-xl font-bold text-blue-600">{timeRemaining}</p>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <p className="text-gray-500">Arrival time not available</p>
//             )}
//           </div>
//         </div>

//         {/* Google Maps Integration */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold">Live Bus Location</h3>
//             <p className="text-sm text-gray-600">
//               Auto-updates every 30 seconds
//             </p>
//           </div>
          
//           {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
//             <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
//               <GoogleMap
//                 mapContainerStyle={mapContainerStyle}
//                 center={mapCenter}
//                 zoom={15}
//                 options={{
//                   streetViewControl: false,
//                   mapTypeControl: false,
//                   fullscreenControl: true
//                 }}
//               >
//                 {currentLocation && (
//                   <Marker
//                     position={{ lat: currentLocation.latitude, lng: currentLocation.longitude }}
//                     onClick={() => setSelectedMarker(currentLocation)}
//                     icon={{
//                       url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
//                           <circle cx="20" cy="20" r="16" fill="#3B82F6" stroke="#FFFFFF" stroke-width="3"/>
//                           <rect x="12" y="12" width="16" height="16" rx="3" fill="#FFFFFF"/>
//                           <path d="M15,20 L25,20 M20,15 L20,25" stroke="#3B82F6" stroke-width="2"/>
//                         </svg>
//                       `),
//                       scaledSize: window.google && window.google.maps ? new window.google.maps.Size(40, 40) : undefined,
//                       anchor: window.google && window.google.maps ? new window.google.maps.Point(20, 40) : undefined
//                     }}
//                   />
//                 )}

//                 {selectedMarker && (
//                   <InfoWindow
//                     position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
//                     onCloseClick={() => setSelectedMarker(null)}
//                   >
//                     <div className="p-2 max-w-xs">
//                       <h3 className="font-bold text-sm mb-1">Bus {bus?.bus_id || 'Location'}</h3>
//                       <p className="text-xs text-gray-600 mb-2">{selectedMarker.address}</p>
//                       <div className="space-y-1">
//                         <p className="text-xs">
//                           <span className="font-medium">Coordinates:</span> {selectedMarker.latitude.toFixed(6)}, {selectedMarker.longitude.toFixed(6)}
//                         </p>
//                         {selectedMarker.speed && (
//                           <p className="text-xs">
//                             <span className="font-medium">Speed:</span> {selectedMarker.speed} km/h
//                           </p>
//                         )}
//                         {selectedMarker.heading && (
//                           <p className="text-xs">
//                             <span className="font-medium">Direction:</span> {selectedMarker.heading}°
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </InfoWindow>
//                 )}
//               </GoogleMap>
//             </LoadScript>
//           ) : (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
//               <p className="text-red-600 font-medium">Google Maps API key not configured</p>
//               <p className="text-sm text-red-500 mt-1">Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables</p>
//             </div>
//           )}
//         </div>

//         {/* Status Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
//             <div className="text-3xl mb-3">⏱️</div>
//             <p className="font-semibold text-lg">On Schedule</p>
//             <p className="text-sm text-gray-600">Running as per timetable</p>
//           </div>

//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
//             <div className="text-3xl mb-3">🚍</div>
//             <p className="font-semibold text-lg">In Service</p>
//             <p className="text-sm text-gray-600">Currently operating</p>
//           </div>

//           <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
//             <div className="text-3xl mb-3">📍</div>
//             <p className="font-semibold text-lg">GPS Active</p>
//             <p className="text-sm text-gray-600">Real-time tracking enabled</p>
//           </div>
//         </div>

//         <div className="mt-8 pt-6 border-t border-gray-200 text-center">
//           <p className="text-sm text-gray-500">
//             Having issues with tracking?{' '}
//             <button 
//               onClick={() => window.location.reload()}
//               className="text-blue-600 hover:text-blue-800 font-medium"
//             >
//               Refresh the page
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default BusTracking

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { GoogleMap, Marker, InfoWindow, LoadScript, Polyline } from '@react-google-maps/api'

const BusTracking = () => {
  const [bus, setBus] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [routeProgress, setRouteProgress] = useState(0)
  const [estimatedArrival, setEstimatedArrival] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [mapCenter, setMapCenter] = useState({
    lat: 12.9716,
    lng: 77.5946
  })
  const [routePath, setRoutePath] = useState([])
  const [stops, setStops] = useState([])
  const [nextStop, setNextStop] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [refreshCount, setRefreshCount] = useState(0)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [travelHistory, setTravelHistory] = useState([])
  const [passengerCount, setPassengerCount] = useState(0)

  const location = useLocation()
  const navigate = useNavigate()
  const busId = location.state?.busId

  const mapContainerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb'
  }

  // API Keys
  const API_KEYS = {
    GOOGLE_MAPS: "AIzaSyDrD4_Uluk_2vhB5QqtraYS0mGIL4ZIdYk",
  }

  // Generate mock route path
  const generateRoutePath = useCallback((startLat, startLng) => {
    const path = []
    const points = 10
    for (let i = 0; i < points; i++) {
      path.push({
        lat: startLat + (i * 0.01),
        lng: startLng + (i * 0.005)
      })
    }
    return path
  }, [])

  // Generate mock bus stops
  const generateStops = useCallback((routeName) => {
    const stopNames = [
      'Central Station', 'City Mall', 'University', 'Tech Park', 
      'Hospital', 'Shopping Complex', 'Metro Station', 'Airport'
    ]
    return stopNames.map((name, index) => ({
      id: index + 1,
      name: `${routeName} - ${name}`,
      lat: 12.9716 + (index * 0.02),
      lng: 77.5946 + (index * 0.01),
      arrivalTime: new Date(Date.now() + (index * 30 * 60 * 1000))
    }))
  }, [])

  // Generate mock location with realistic movement
  const generateMockLocation = useCallback((busId, route = 'Route', previousLocation) => {
    const baseLat = 12.9716 + (parseInt(busId) % 10) * 0.01
    const baseLng = 77.5946 + (parseInt(busId) % 10) * 0.01
    
    let newLat, newLng
    if (previousLocation) {
      // Move along route
      newLat = previousLocation.latitude + 0.001
      newLng = previousLocation.longitude + 0.0005
    } else {
      newLat = baseLat + Math.random() * 0.02 - 0.01
      newLng = baseLng + Math.random() * 0.02 - 0.01
    }

    return {
      latitude: newLat,
      longitude: newLng,
      address: `Near ${route} Stop ${Math.floor(Math.random() * 5) + 1}`,
      speed: Math.floor(Math.random() * 40) + 20,
      heading: Math.floor(Math.random() * 360),
      lastUpdated: new Date(),
      accuracy: Math.random() * 20 + 5 // Accuracy in meters
    }
  }, [])

  // Generate mock alerts
  const generateMockAlerts = () => {
    const alertTypes = [
      { type: 'traffic', message: 'Traffic congestion ahead', severity: 'warning' },
      { type: 'weather', message: 'Light rain expected', severity: 'info' },
      { type: 'schedule', message: 'Running 5 minutes ahead', severity: 'success' },
      { type: 'bus', message: 'Bus is on time', severity: 'success' },
      { type: 'route', message: 'Alternative route available', severity: 'info' }
    ]
    return [alertTypes[Math.floor(Math.random() * alertTypes.length)]]
  }

  // Fetch bus details
  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        setLoading(true)
        
        // Generate mock bus data
        const now = new Date()
        const departureTime = new Date(now.getTime() - Math.random() * 2 * 60 * 60 * 1000)
        const arrivalTime = new Date(departureTime.getTime() + 4 * 60 * 60 * 1000)

        const mockBus = {
          bus_id: busId || 'BUS001',
          route: `Route ${busId || '001'}`,
          bus_type: 'AC Volvo',
          depot: 'Central Depot',
          capacity: 45,
          driver_name: 'Rajesh Kumar',
          driver_license: 'DL-7894561230',
          contact: '+91 9876543210',
          departure_time: departureTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          arrival_time: arrivalTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          departure_time_obj: departureTime,
          arrival_time_obj: arrivalTime,
          conductor_name: 'Suresh Patel',
          conductor_contact: '+91 9876543211'
        }

        setBus(mockBus)

        // Generate initial location
        const mockLocation = generateMockLocation(busId, mockBus.route)
        setCurrentLocation(mockLocation)
        setMapCenter({
          lat: mockLocation.latitude,
          lng: mockLocation.longitude
        })

        // Generate route path
        const path = generateRoutePath(mockLocation.latitude, mockLocation.longitude)
        setRoutePath(path)

        // Generate stops
        const stopsData = generateStops(mockBus.route)
        setStops(stopsData)
        
        // Set next stop (based on progress)
        const nextStopIndex = Math.floor((stopsData.length - 1) * (routeProgress / 100))
        setNextStop(stopsData[nextStopIndex + 1] || stopsData[stopsData.length - 1])

        // Calculate initial progress
        const progress = Math.floor(Math.random() * 30) + 20 // 20-50% progress
        setRouteProgress(progress)

        // Estimate arrival
        const estimatedArrivalTime = new Date(now.getTime() + ((100 - progress) / 100 * 2 * 60 * 60 * 1000))
        setEstimatedArrival(estimatedArrivalTime)

        // Generate initial alerts
        setAlerts(generateMockAlerts())

        // Set initial passenger count
        const initialPassengers = Math.floor(Math.random() * (mockBus.capacity * 0.7)) + 10
        setPassengerCount(initialPassengers)

        // Add to travel history
        setTravelHistory(prev => [...prev.slice(-4), {
          time: new Date(),
          location: mockLocation,
          speed: mockLocation.speed,
          passengers: initialPassengers
        }])

        setLoading(false)
        setError(null)
      } catch (error) {
        console.error('Error fetching bus details:', error)
        setError('Failed to load bus tracking information. Please try again.')
        setLoading(false)
      }
    }

    if (busId) {
      fetchBusDetails()
    } else {
      // Handle missing busId
      setError('No bus selected. Please go back and select a bus to track.')
      setLoading(false)
    }
  }, [busId, refreshCount])

  // Auto-refresh interval
  useEffect(() => {
    let intervalId
    
    if (autoRefresh && bus) {
      intervalId = setInterval(() => {
        // Update location and progress
        if (bus) {
          const mockLocation = generateMockLocation(busId, bus.route, currentLocation)
          setCurrentLocation(mockLocation)
          
          // Smooth map transition
          setMapCenter(prev => ({
            lat: prev.lat + (mockLocation.latitude - prev.lat) * 0.1,
            lng: prev.lng + (mockLocation.longitude - prev.lng) * 0.1
          }))

          // Update progress (small increments)
          setRouteProgress(prev => {
            const newProgress = Math.min(prev + (Math.random() * 2), 100)
            
            // Update next stop based on new progress
            if (stops.length > 0) {
              const nextStopIndex = Math.floor((stops.length - 1) * (newProgress / 100))
              setNextStop(stops[nextStopIndex + 1] || stops[stops.length - 1])
            }
            
            return newProgress
          })

          // Update passenger count (random small changes)
          setPassengerCount(prev => {
            const change = Math.floor(Math.random() * 3) - 1 // -1, 0, or +1
            const newCount = Math.max(0, Math.min(bus.capacity, prev + change))
            return newCount
          })

          // Update alerts (occasionally)
          if (Math.random() > 0.7) {
            setAlerts(generateMockAlerts())
          }

          // Update travel history
          setTravelHistory(prev => [...prev.slice(-4), {
            time: new Date(),
            location: mockLocation,
            speed: mockLocation.speed,
            passengers: passengerCount
          }])

          // Update estimated arrival based on progress
          if (estimatedArrival) {
            const now = new Date()
            const timeDiff = estimatedArrival - now
            if (timeDiff > 0) {
              // Slightly adjust ETA based on speed
              const adjustment = mockLocation.speed > 40 ? -60000 : // 1 minute earlier if fast
                                mockLocation.speed < 20 ? 60000 :  // 1 minute later if slow
                                0
              setEstimatedArrival(new Date(estimatedArrival.getTime() + adjustment))
            }
          }
        }
      }, 10000) // Update every 10 seconds

      return () => clearInterval(intervalId)
    }
  }, [autoRefresh, bus, busId, currentLocation, stops, routeProgress, passengerCount, estimatedArrival])

  // Memoized calculations
  const timeRemaining = useMemo(() => {
    if (!estimatedArrival) return null

    const now = new Date()
    const diffMs = estimatedArrival - now
    const diffMins = Math.round(diffMs / 60000)

    if (diffMins <= 0) return 'Arrived'
    if (diffMins < 60) return `${diffMins} minutes`

    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60
    return `${hours}h ${mins}m`
  }, [estimatedArrival])

  const journeyDuration = useMemo(() => {
    if (!bus?.departure_time_obj || !bus?.arrival_time_obj) return null
    
    const durationMs = bus.arrival_time_obj - bus.departure_time_obj
    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hours}h ${minutes}m`
  }, [bus])

  const occupancyPercentage = useMemo(() => {
    if (!bus?.capacity) return 0
    return Math.round((passengerCount / bus.capacity) * 100)
  }, [passengerCount, bus])

  const getOccupancyColor = (percentage) => {
    if (percentage < 50) return 'bg-green-500'
    if (percentage < 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const handleManualRefresh = () => {
    setRefreshCount(prev => prev + 1)
  }

  const handleToggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev)
  }

  const handleSendAlert = () => {
    const newAlert = {
      type: 'user',
      message: 'Passenger requested assistance',
      severity: 'info',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    }
    setAlerts(prev => [newAlert, ...prev.slice(0, 2)])
    
    // Show confirmation
    setTimeout(() => {
      alert('Alert sent to driver and control center')
    }, 100)
  }

  const handleEmergencyStop = () => {
    if (window.confirm('Are you sure you want to request an emergency stop? This will notify the driver immediately.')) {
      const emergencyAlert = {
        type: 'emergency',
        message: 'EMERGENCY STOP REQUESTED - Please stop at next safe location',
        severity: 'error',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      }
      setAlerts(prev => [emergencyAlert, ...prev])
      
      // Simulate emergency response
      setAutoRefresh(false)
      setTimeout(() => {
        alert('Emergency stop request sent. Driver has been notified.')
      }, 100)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 text-2xl">🚌</div>
        </div>
        <p className="mt-4 text-lg text-gray-600 font-medium">Loading bus tracking information...</p>
        <p className="text-sm text-gray-500 mt-2">Fetching real-time data for Bus {busId}</p>
      </div>
    )
  }

  if (error && !bus) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center">
        <div className="text-center py-12 bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-6xl mb-6 text-red-500">🚍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to Track Bus</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/my-bookings')}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              ← Back to My Bookings
            </button>
            <button
              onClick={handleManualRefresh}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              ↻ Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={() => navigate('/my-bookings')}
          className="px-5 py-2.5 bg-white text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2 shadow-sm border border-gray-200 transition-all duration-200 w-fit"
        >
          ← Back to Bookings
        </button>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleSendAlert}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium flex items-center gap-2 transition-all duration-200"
          >
            ⚠️ Send Alert
          </button>
          <button
            onClick={handleEmergencyStop}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2 transition-all duration-200"
          >
            🚨 Emergency
          </button>
          <button
            onClick={handleManualRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-all duration-200"
          >
            ↻ Refresh
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Auto-refresh:</span>
            <button
              onClick={handleToggleAutoRefresh}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoRefresh ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoRefresh ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Bus Info Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                🚌 Live Bus Tracking
              </h1>
              <p className="text-blue-100">Real-time tracking for {bus?.route || 'your bus'}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></span>
                <span className="font-medium">Live Tracking Active</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
              <p className="text-sm opacity-90">Bus ID</p>
              <p className="text-xl font-bold">{bus?.bus_id}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
              <p className="text-sm opacity-90">Bus Type</p>
              <p className="text-xl font-bold">{bus?.bus_type}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
              <p className="text-sm opacity-90">Capacity</p>
              <p className="text-xl font-bold">{bus?.capacity || '45'} seats</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
              <p className="text-sm opacity-90">Journey Time</p>
              <p className="text-xl font-bold">{journeyDuration}</p>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              📢 Live Alerts & Notifications
            </h3>
            <button
              onClick={handleSendAlert}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              + Request Assistance
            </button>
          </div>
          
          <div className="space-y-3">
            {alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <div 
                  key={index}
                  className={`flex items-start gap-3 p-4 rounded-lg ${
                    alert.severity === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                    alert.severity === 'error' ? 'bg-red-50 border border-red-200' :
                    alert.severity === 'success' ? 'bg-green-50 border border-green-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <div className={`mt-0.5 ${
                    alert.severity === 'warning' ? 'text-yellow-600' :
                    alert.severity === 'error' ? 'text-red-600' :
                    alert.severity === 'success' ? 'text-green-600' :
                    'text-blue-600'
                  }`}>
                    {alert.severity === 'error' ? '🚨' : '⚠️'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{alert.message}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-600">{alert.timestamp || 'Just now'}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        alert.severity === 'error' ? 'bg-red-100 text-red-800' :
                        alert.severity === 'success' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.type === 'user' ? 'User Request' : 
                         alert.type === 'emergency' ? 'EMERGENCY' :
                         alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">No active alerts</p>
                <p className="text-sm text-gray-400 mt-1">All systems normal</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Progress and ETA Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Route Progress */}
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  🗺️ Route Progress
                </h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {routeProgress.toFixed(1)}%
                </span>
              </div>
              
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${routeProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <div className="text-left">
                    <div className="font-medium">Departure</div>
                    <div>{bus?.departure_time}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">Arrival</div>
                    <div>{bus?.arrival_time}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Time Elapsed</p>
                  <p className="font-bold text-lg">
                    {Math.floor(routeProgress / 100 * 4)}h {Math.floor((routeProgress / 100 * 4) % 1 * 60)}m
                  </p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Time Remaining</p>
                  <p className="font-bold text-lg">{timeRemaining}</p>
                </div>
              </div>
            </div>

            {/* Current Location */}
            {currentLocation && (
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  📍 Current Location
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Address</p>
                    <div className="flex items-start gap-2">
                      <div className="text-red-500 mt-1">📍</div>
                      <p className="text-sm font-medium">{currentLocation.address}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Coordinates</p>
                      <p className="font-mono text-sm">
                        {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Accuracy</p>
                      <p className="font-medium">{currentLocation.accuracy.toFixed(1)}m</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                        🚀 Speed
                      </p>
                      <p className="text-xl font-bold">{currentLocation.speed} km/h</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                        🧭 Direction
                      </p>
                      <p className="text-xl font-bold">{currentLocation.heading}°</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 pt-2 border-t">
                    Updated: {currentLocation.lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )}

            {/* Next Stop & ETA */}
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                ⏰ Next Stop & ETA
              </h3>

              {nextStop && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Next Stop</p>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {nextStop.id}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{nextStop.name}</p>
                      <p className="text-sm text-gray-600">
                        ETA: {nextStop.arrivalTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {estimatedArrival && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Estimated Arrival at Destination</p>
                  <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <p className="text-2xl font-bold text-green-700 mb-1">
                      {estimatedArrival.toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                    {timeRemaining && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Time remaining:</span> {timeRemaining}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Passenger Count */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Passenger Occupancy</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${getOccupancyColor(occupancyPercentage)}`}
                        style={{ width: `${occupancyPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>{passengerCount}/{bus?.capacity || 45}</span>
                      <span>{bus?.capacity || 45}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    occupancyPercentage < 50 ? 'bg-green-100 text-green-800' :
                    occupancyPercentage < 80 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {occupancyPercentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                🗺️ Live Location Map
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Auto-updates {autoRefresh ? 'every 10s' : 'paused'}
                </span>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span>Bus</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <span>Stops</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>Route</span>
                  </div>
                </div>
              </div>
            </div>

            {API_KEYS.GOOGLE_MAPS ? (
              <LoadScript googleMapsApiKey={API_KEYS.GOOGLE_MAPS}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={14}
                  options={{
                    streetViewControl: false,
                    mapTypeControl: true,
                    fullscreenControl: true,
                    zoomControl: true,
                    styles: [
                      {
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [{ visibility: 'off' }]
                      }
                    ]
                  }}
                >
                  {/* Route Path */}
                  {routePath.length > 0 && (
                    <Polyline
                      path={routePath}
                      options={{
                        strokeColor: '#8B5CF6',
                        strokeOpacity: 0.6,
                        strokeWeight: 4,
                        geodesic: true
                      }}
                    />
                  )}

                  {/* Bus Stops */}
                  {stops.map((stop) => (
                    <Marker
                      key={stop.id}
                      position={{ lat: stop.lat, lng: stop.lng }}
                      icon={{
                        path: window.google && window.google.maps ? window.google.maps.SymbolPath.CIRCLE : '',
                        fillColor: stop.id === (nextStop?.id || 0) ? '#F59E0B' : '#10B981',
                        fillOpacity: 1,
                        strokeColor: '#FFFFFF',
                        strokeWeight: 2,
                        scale: 8
                      }}
                      onClick={() => setSelectedMarker({
                        ...stop,
                        type: 'stop'
                      })}
                    />
                  ))}

                  {/* Current Bus Location */}
                  {currentLocation && (
                    <Marker
                      position={{ lat: currentLocation.latitude, lng: currentLocation.longitude }}
                      onClick={() => setSelectedMarker({
                        ...currentLocation,
                        type: 'bus'
                      })}
                      icon={{
                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
                            <circle cx="24" cy="24" r="20" fill="#3B82F6" stroke="#FFFFFF" stroke-width="3"/>
                            <rect x="14" y="14" width="20" height="20" rx="4" fill="#FFFFFF"/>
                            <path d="M18,24 L30,24 M24,18 L24,30" stroke="#3B82F6" stroke-width="3"/>
                            <path d="M24,24 L${24 + Math.cos((currentLocation.heading - 90) * Math.PI / 180) * 15},${24 + Math.sin((currentLocation.heading - 90) * Math.PI / 180) * 15}" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>
                          </svg>
                        `),
                        scaledSize: window.google && window.google.maps ? new window.google.maps.Size(48, 48) : undefined,
                        anchor: window.google && window.google.maps ? new window.google.maps.Point(24, 48) : undefined
                      }}
                    />
                  )}

                  {/* Info Window */}
                  {selectedMarker && (
                    <InfoWindow
                      position={selectedMarker.type === 'bus' 
                        ? { lat: selectedMarker.latitude, lng: selectedMarker.longitude }
                        : { lat: selectedMarker.lat, lng: selectedMarker.lng }
                      }
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div className="p-2 max-w-xs">
                        <h3 className="font-bold text-sm mb-1">
                          {selectedMarker.type === 'bus' ? `Bus ${bus?.bus_id}` : `Stop ${selectedMarker.id}`}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2">
                          {selectedMarker.type === 'bus' ? selectedMarker.address : selectedMarker.name}
                        </p>
                        <div className="space-y-1">
                          {selectedMarker.type === 'bus' && (
                            <>
                              <p className="text-xs">
                                <span className="font-medium">Speed:</span> {selectedMarker.speed} km/h
                              </p>
                              <p className="text-xs">
                                <span className="font-medium">Direction:</span> {selectedMarker.heading}°
                              </p>
                              <p className="text-xs">
                                <span className="font-medium">Accuracy:</span> {selectedMarker.accuracy?.toFixed(1)}m
                              </p>
                            </>
                          )}
                          {selectedMarker.type === 'stop' && (
                            <p className="text-xs">
                              <span className="font-medium">ETA:</span> {selectedMarker.arrivalTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </LoadScript>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                <div className="text-4xl text-red-500 mx-auto mb-4">⚠️</div>
                <p className="text-red-600 font-medium text-lg mb-2">Google Maps API Key Required</p>
                <p className="text-red-500">Please configure VITE_GOOGLE_MAPS_API_KEY in your environment variables</p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left">
                  <code className="text-sm text-gray-700">
                    VITE_GOOGLE_MAPS_API_KEY=AIzaSyDrD4_Uluk_2vhB5QqtraYS0mGIL4ZIdYk
                  </code>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-5 text-center">
              <div className="text-3xl text-yellow-600 mx-auto mb-3">⏱️</div>
              <p className="font-semibold text-lg mb-1">On Schedule</p>
              <p className="text-sm text-gray-600">{routeProgress > 45 && routeProgress < 55 ? 'Perfect timing' : 'Slightly ahead'}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 text-center">
              <div className="text-3xl text-blue-600 mx-auto mb-3">🚌</div>
              <p className="font-semibold text-lg mb-1">In Service</p>
              <p className="text-sm text-gray-600">Currently operating</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 text-center">
              <div className="text-3xl text-green-600 mx-auto mb-3">📍</div>
              <p className="font-semibold text-lg mb-1">GPS Active</p>
              <p className="text-sm text-gray-600">Real-time tracking</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 text-center">
              <div className="text-3xl text-purple-600 mx-auto mb-3">✅</div>
              <p className="font-semibold text-lg mb-1">Passenger Count</p>
              <p className="text-sm text-gray-600">{passengerCount}/{bus?.capacity || 45} ({occupancyPercentage}%)</p>
            </div>
          </div>

          {/* Travel History */}
          {travelHistory.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                📊 Recent Travel History
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {travelHistory.slice().reverse().map((point, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border hover:bg-blue-50 transition-colors">
                      <p className="text-sm font-medium mb-1">
                        {point.time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-gray-600 mb-2 truncate">
                        {point.location.address}
                      </p>
                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="text-gray-600">Speed: </span>
                          <span className="font-medium">{point.speed} km/h</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Passengers: </span>
                          <span className="font-medium">{point.passengers}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Driver & Conductor Info */}
          {bus?.driver_name && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-8 border border-blue-200">
              <h3 className="text-lg font-semibold mb-4">👤 Crew Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Driver Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    {bus.driver_name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg">{bus.driver_name}</p>
                    <p className="text-gray-600 text-sm">Licensed Bus Driver</p>
                    <p className="text-sm text-blue-600 mt-1">{bus.contact}</p>
                    <p className="text-xs text-gray-500 mt-1">License: {bus.driver_license}</p>
                  </div>
                  <button
                    onClick={() => window.open(`tel:${bus.contact.replace(/\D/g, '')}`, '_blank')}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
                  >
                    Call
                  </button>
                </div>

                {/* Conductor Info */}
                {bus.conductor_name && (
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      {bus.conductor_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg">{bus.conductor_name}</p>
                      <p className="text-gray-600 text-sm">Conductor</p>
                      <p className="text-sm text-green-600 mt-1">{bus.conductor_contact}</p>
                      <p className="text-xs text-gray-500 mt-1">Available for assistance</p>
                    </div>
                    <button
                      onClick={() => window.open(`tel:${bus.conductor_contact.replace(/\D/g, '')}`, '_blank')}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm"
                    >
                      Call
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  Tracking ID: <span className="font-mono font-bold">{busId || 'N/A'}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Last updated: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleSendAlert}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium flex items-center gap-2 transition-all duration-200 text-sm"
                >
                  ⚠️ Request Help
                </button>
                <button 
                  onClick={handleManualRefresh}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-all duration-200 text-sm"
                >
                  ↻ Refresh Now
                </button>
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-all duration-200 text-sm"
                >
                  Print Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
        <p className="text-sm text-yellow-700 text-center">
          ⚠️ <strong>Note:</strong> This is a simulation with mock data. Real tracking would connect to GPS devices on the bus.
          For emergencies, always call the emergency number: <strong>108</strong>
        </p>
      </div>

      {/* Safety Tips */}
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
        <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">🛡️ Safety Tips:</h4>
        <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
          <li>Always wear your seatbelt while the bus is moving</li>
          <li>Keep emergency exits clear at all times</li>
          <li>Contact driver or conductor for any assistance needed</li>
          <li>Report any suspicious activity immediately</li>
          <li>Stay seated until the bus comes to a complete stop</li>
        </ul>
      </div>
    </div>
  )
}

export default BusTracking