// import React, { useEffect, useState } from 'react';
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
// import { Link } from "react-router-dom";

// const UserBookings = ({ userId }) => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [busLocations, setBusLocations] = useState({});
//   const [loadingLocation, setLoadingLocation] = useState({});

//   useEffect(() => {
//     if (!userId) return;

//     fetch(`/api/user/${userId}/bookings/`, {
//       credentials: 'include',
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error('Failed to fetch bookings');
//         }
//         return res.json();
//       })
//       .then((data) => {
//         setBookings(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setError(err.message);
//         setLoading(false);
//       });
//   }, [userId]);

//   const fetchBusLocation = (busId) => {
//     setLoadingLocation(prev => ({ ...prev, [busId]: true }));
//     fetch(`/api/bus/${busId}/location/`, {
//       credentials: 'include',
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error('Failed to fetch location');
//         return res.json();
//       })
//       .then((data) => {
//         setBusLocations(prev => ({ ...prev, [busId]: data }));
//         setLoadingLocation(prev => ({ ...prev, [busId]: false }));
//       })
//       .catch((err) => {
//         console.error('Error fetching location:', err);
//         setLoadingLocation(prev => ({ ...prev, [busId]: false }));
//       });
//   };

//   if (loading) return <p>Loading bookings...</p>;
//   if (error) return <p className="text-red-500">Error: {error}</p>;

//   return (
//     <div id='bus'>
//       <div className="max-w-6xl mx-auto mt-8 p-4">
//         <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

//         {bookings.length === 0 ? (
//           <p className="text-gray-600">No bookings found.</p>
//         ) : (
//           <div className="space-y-6">
//             {bookings.map((booking) => (
//               <div
//                 key={booking.id}
//                 className="border rounded-xl p-6 shadow-md bg-white grid grid-cols-1 md:grid-cols-2 gap-6"
//               >
//                 {/* Left: Bus & Booking Info */}
//                 <div>
//                   <h3 className="text-xl font-semibold mb-2">
//                     {booking.bus?.route}
//                   </h3>
//                   <p className="text-gray-700">
//                     <strong>Departure Time:</strong> {booking.bus?.departure_time}
//                   </p>
//                   <p className="text-gray-700">
//                     <strong>Arrival Time:</strong> {booking.bus?.arrival_time}
//                   </p>

//                   <p className="text-gray-700">
//                     <strong>Bus ID:</strong> {booking.bus?.bus_id}
//                   </p>
//                   <p className="text-gray-700">
//                     <strong>Bus Type:</strong> {booking.bus?.bus_type}
//                   </p>
//                   <p className="text-gray-700">
//                     <strong>Depot:</strong> {booking.bus?.depot}
//                   </p>

//                   <div className="mt-4">
//                     <p>
//                       <strong>Seat Number:</strong> {booking.seat?.seat_number}
//                     </p>
//                     <p>
//                       <strong>Booked At:</strong>{' '}
//                       {new Date(booking.booking_time).toLocaleString('en-IN', {
//                         year: 'numeric',
//                         month: 'long',
//                         day: 'numeric',
//                         hour: '2-digit',
//                         minute: '2-digit',
//                         second: '2-digit',
//                         timeZone: 'IST'
//                       })}
//                     </p>
//                     <p>
//                       <strong>Booked Day at:</strong>{' '}
//                       {new Date(booking.booking_time).toLocaleString('en-IN', {
//                         weekday: 'long',
//                         timeZone: 'IST'
//                       })}
//                     </p>

//                     <p>
//                       <strong>Fare:</strong> ₹{booking.bus?.fare_per_passenger}
//                     </p>
//                   </div>

//                   <button
//                     className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                     onClick={() =>
//                       console.log(`Payment completed for booking ${booking.id}`)
//                     }
//                   >
//                     Payment Successful
//                   </button>
//                 </div>

//                 {/* Right: GPS Tracking */}
//                 <div>
//                   <div className="flex flex-col space-y-3 mb-4">
//                     <Link
//                       to="/googlemapview"
//                       state={{ busId: booking.bus?.bus_id }}
//                       className="inline-block px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm text-center"
//                     >
//                       View Live Location on Map
//                     </Link>

//                     <Link
//                       to="/bus-tracking"
//                       state={{ busId: booking.bus?.bus_id }}
//                       className="inline-block px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm text-center"
//                     >
//                       Track Bus Journey
//                     </Link>

//                     <button
//                       className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm disabled:bg-gray-400"
//                       onClick={() => fetchBusLocation(booking.bus?.bus_id)}
//                       disabled={loadingLocation[booking.bus?.bus_id]}
//                     >
//                       {loadingLocation[booking.bus?.bus_id] ? 'Loading...' : 'Refresh Location Data'}
//                     </button>
//                   </div>

//                   {busLocations[booking.bus?.bus_id] ? (
//                     <div className="bg-gray-100 p-4 rounded">
//                       <h4 className="text-lg font-semibold mb-3">Current Location Data</h4>
//                       <p className="text-gray-700">
//                         <strong>Latitude:</strong> {busLocations[booking.bus?.bus_id].latitude}
//                       </p>
//                       <p className="text-gray-700">
//                         <strong>Longitude:</strong> {busLocations[booking.bus?.bus_id].longitude}
//                       </p>
//                       <p className="text-gray-700">
//                         <strong>Last Updated:</strong>{' '}
//                         {new Date(busLocations[booking.bus?.bus_id].timestamp).toLocaleString()}
//                       </p>
                      
//                       {import.meta.env.VITE_ABHIBUS_API_KEY ? (
//                         <div className="mt-4">
//                           <LoadScript googleMapsApiKey={import.meta.env.VITE_ABHIBUS_API_KEY}>
//                             <GoogleMap
//                               mapContainerStyle={{ width: '100%', height: '300px' }}
//                               center={{
//                                 lat: parseFloat(busLocations[booking.bus?.bus_id].latitude),
//                                 lng: parseFloat(busLocations[booking.bus?.bus_id].longitude),
//                               }}
//                               zoom={15}
//                             >
//                               <Marker
//                                 position={{
//                                   lat: parseFloat(busLocations[booking.bus?.bus_id].latitude),
//                                   lng: parseFloat(busLocations[booking.bus?.bus_id].longitude),
//                                 }}
//                                 title={`Bus ${booking.bus?.bus_id}`}
//                               />
//                             </GoogleMap>
//                           </LoadScript>
//                         </div>
//                       ) : (
//                         <p className="text-red-500 mt-2">Google Maps API key not configured</p>
//                       )}
//                     </div>
//                   ) : (
//                     <div className="bg-gray-100 p-4 rounded text-center">
//                       <p className="text-gray-500 italic">
//                         Click "Refresh Location Data" to see current bus location
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserBookings;


import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Link } from "react-router-dom";

const UserBookings = ({ userId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busLocations, setBusLocations] = useState({});
  const [loadingLocation, setLoadingLocation] = useState({});

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/user/${userId}/bookings/`, {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch bookings');
        }
        return res.json();
      })
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  const fetchBusLocation = (busId) => {
    setLoadingLocation(prev => ({ ...prev, [busId]: true }));
    fetch(`/api/bus/${busId}/location/`, {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch location');
        return res.json();
      })
      .then((data) => {
        setBusLocations(prev => ({ ...prev, [busId]: data }));
        setLoadingLocation(prev => ({ ...prev, [busId]: false }));
      })
      .catch((err) => {
        console.error('Error fetching location:', err);
        setLoadingLocation(prev => ({ ...prev, [busId]: false }));
      });
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div id='bus'>
      <div className="max-w-6xl mx-auto mt-8 p-4">
        <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

        {bookings.length === 0 ? (
          <p className="text-gray-600">No bookings found.</p>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="border rounded-xl p-6 shadow-md bg-white grid grid-cols-1 md:grid-cols-3 gap-6 relative"
              >
                {/* Vertical Circular Buttons at Top Right Corner */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                  <Link
                    to="/googlemapview"
                    state={{ busId: booking.bus?.bus_id }}
                    className="circular-btn bg-blue-600 hover:bg-blue-700"
                    title="View Live Location on Map"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </Link>

                  <Link
                    to="/bus-tracking"
                    state={{ busId: booking.bus?.bus_id }}
                    className="circular-btn bg-purple-600 hover:bg-purple-700"
                    title="Track Bus Journey"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  </Link>

                  <button
                    className="circular-btn bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400"
                    onClick={() => fetchBusLocation(booking.bus?.bus_id)}
                    disabled={loadingLocation[booking.bus?.bus_id]}
                    title="Refresh Location Data"
                  >
                    {loadingLocation[booking.bus?.bus_id] ? (
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Left: Bus & Booking Info */}
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold mb-2">
                    {booking.bus?.route}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-700 mb-2">
                        <strong className="block text-gray-500 text-sm">Departure Time</strong>
                        <span className="text-lg font-medium">{booking.bus?.departure_time}</span>
                      </p>
                      <p className="text-gray-700 mb-2">
                        <strong className="block text-gray-500 text-sm">Arrival Time</strong>
                        <span className="text-lg font-medium">{booking.bus?.arrival_time}</span>
                      </p>
                      <p className="text-gray-700 mb-2">
                        <strong className="block text-gray-500 text-sm">Bus ID</strong>
                        <span className="text-lg font-medium">{booking.bus?.bus_id}</span>
                      </p>
                      <p className="text-gray-700 mb-2">
                        <strong className="block text-gray-500 text-sm">Bus Type</strong>
                        <span className="text-lg font-medium">{booking.bus?.bus_type}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-700 mb-2">
                        <strong className="block text-gray-500 text-sm">Depot</strong>
                        <span className="text-lg font-medium">{booking.bus?.depot}</span>
                      </p>
                      <p className="text-gray-700 mb-2">
                        <strong className="block text-gray-500 text-sm">Seat Number</strong>
                        <span className="text-lg font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full inline-block">
                          {booking.seat?.seat_number}
                        </span>
                      </p>
                      <p className="text-gray-700 mb-2">
                        <strong className="block text-gray-500 text-sm">Fare</strong>
                        <span className="text-lg font-medium text-green-600">₹{booking.bus?.fare_per_passenger}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-700 mb-2">
                          <strong className="block text-gray-500 text-sm">Booked At</strong>
                          <span className="text-sm">
                            {new Date(booking.booking_time).toLocaleString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              timeZone: 'IST'
                            })}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-700 mb-2">
                          <strong className="block text-gray-500 text-sm">Booked Day</strong>
                          <span className="text-sm">
                            {new Date(booking.booking_time).toLocaleString('en-IN', {
                              weekday: 'long',
                              timeZone: 'IST'
                            })}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
                      onClick={() =>
                        console.log(`Payment completed for booking ${booking.id}`)
                      }
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Payment Successful
                      </span>
                    </button>
                  </div>
                </div>

                {/* Right: GPS Tracking */}
                <div className="md:col-span-1">
                  {busLocations[booking.bus?.bus_id] ? (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-full">
                      <h4 className="text-lg font-semibold mb-3 text-gray-800">Current Location</h4>
                      <div className="space-y-3 mb-4">
                        <div className="bg-white p-3 rounded shadow-sm">
                          <p className="text-sm text-gray-500 mb-1">Latitude</p>
                          <p className="font-mono text-gray-800">{busLocations[booking.bus?.bus_id].latitude}</p>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm">
                          <p className="text-sm text-gray-500 mb-1">Longitude</p>
                          <p className="font-mono text-gray-800">{busLocations[booking.bus?.bus_id].longitude}</p>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm">
                          <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                          <p className="text-sm text-gray-800">
                            {new Date(busLocations[booking.bus?.bus_id].timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      {import.meta.env.VITE_ABHIBUS_API_KEY ? (
                        <div className="mt-4">
                          <LoadScript googleMapsApiKey={import.meta.env.VITE_ABHIBUS_API_KEY}>
                            <GoogleMap
                              mapContainerStyle={{ width: '100%', height: '250px' }}
                              center={{
                                lat: parseFloat(busLocations[booking.bus?.bus_id].latitude),
                                lng: parseFloat(busLocations[booking.bus?.bus_id].longitude),
                              }}
                              zoom={15}
                            >
                              <Marker
                                position={{
                                  lat: parseFloat(busLocations[booking.bus?.bus_id].latitude),
                                  lng: parseFloat(busLocations[booking.bus?.bus_id].longitude),
                                }}
                                title={`Bus ${booking.bus?.bus_id}`}
                                icon={{
                                  url: 'https://maps.google.com/mapfiles/ms/icons/bus.png',
                                  scaledSize: new window.google.maps.Size(40, 40)
                                }}
                              />
                            </GoogleMap>
                          </LoadScript>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
                          <p className="text-yellow-700 text-sm">Google Maps API key not configured</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-full flex flex-col items-center justify-center text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <p className="text-gray-500 italic mb-4">
                        Click the refresh button to see current bus location
                      </p>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>• View live location on map</p>
                        <p>• Track bus journey</p>
                        <p>• Refresh location data</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom CSS for circular buttons */}
        <style>{`
          .circular-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            color: white;
            transition: all 0.2s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            border: 2px solid white;
          }
          
          .circular-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          }
          
          .circular-btn:active {
            transform: translateY(0);
          }
          
          .circular-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }
          
          /* Animation for refresh button */
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .animate-spin {
            animation: spin 1s linear infinite;
          }
          
          /* Responsive adjustments */
          @media (max-width: 768px) {
            .circular-btn {
              width: 36px;
              height: 36px;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default UserBookings;