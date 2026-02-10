// // import axios from 'axios'
// // import React, { useState, useEffect } from 'react'
// // import { useParams, useNavigate } from 'react-router-dom'

// // const BusSeats = ({ userId }) => {
// //   const [bus, setBus] = useState(null)
// //   const [seats, setSeats] = useState([])
// //   const [selectedSeat, setSelectedSeat] = useState(null)
// //   const [loading, setLoading] = useState(true)
// //   const [bookingLoading, setBookingLoading] = useState(false)
// //   const [seatError, setSeatError] = useState('')
// //   const [isListening, setIsListening] = useState(false)
// //   const [showTimeSelection, setShowTimeSelection] = useState(false)
// //   const [selectedTime, setSelectedTime] = useState(null)
// //   const [pendingSeatId, setPendingSeatId] = useState(null)

// //   const { busId } = useParams()
// //   const navigate = useNavigate()

// //   // Initialize speech recognition
// //   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
// //   const recognitionRef = React.useRef(null)
// //   if (recognitionRef.current) {
// //     recognitionRef.current.abort()
// //   }
// //   useEffect(() => {
// //     if (SpeechRecognition) {
// //       recognitionRef.current = new SpeechRecognition()
// //       recognitionRef.current.continuous = false
// //       recognitionRef.current.interimResults = false
// //       recognitionRef.current.lang = 'en-US'

// //       recognitionRef.current.onresult = (event) => {
// //         const transcript = Array.from(event.results)
// //           .map(result => result[0].transcript)
// //           .join('')
// //           .toLowerCase()
// //           setSeatError('')
// //           const showDetailsMatch = transcript.match(/show\s+details/i)
// //           if (showDetailsMatch) {
// //             navigate('/my-bookings')
// //             return
// //           }
// //         const match = transcript.match(/book\s+seat\s+([a-z0-9]+)/i)
// //         if (match) {
// //           const seatIdentifier = match[1]
// //           const foundSeat = (seats || []).find(s => {
// //             const seatNum = s?.seat_number ?? s?.id ?? s?.pk
// //             return String(seatNum).toLowerCase() === seatIdentifier ||
// //                    Number(seatNum) === Number(seatIdentifier)
// //           })
// //           if (foundSeat) {
// //             handleBook(foundSeat?.id ?? foundSeat?.pk ?? foundSeat?.seat_number)
// //           } else {
// //             setSeatError(`Seat ${seatIdentifier} not found`)
// //           }
// //         }
// //       }

// //       recognitionRef.current.onerror = (event) => {
// //         setSeatError(`Speech recognition error: ${event.error}`)
// //         setIsListening(false)
// //       }

// //       recognitionRef.current.onend = () => {
// //         setIsListening(false)
// //       }
// //     }
// //   }, [seats])

// //   const toggleVoiceRecognition = () => {
// //     if (!recognitionRef.current) {
// //       setSeatError('Speech recognition not supported in your browser')
// //       return
// //     }

// //     if (isListening) {
// //       recognitionRef.current.stop()
// //       setIsListening(false)
// //     } else {
// //       setSeatError('')
// //       recognitionRef.current.start()
// //       setIsListening(true)
// //     }
// //   }

// //   useEffect(() => {
// //     let mounted = true

// //     const fetchBusDetails = async () => {
// //       try {
// //         // First try numeric PK endpoint (Django expects int PK)
// //         const numericId = Number(busId)
// //         if (!Number.isNaN(numericId)) {
// //           try {
// //             const resp = await axios.get(`/api/buses/${numericId}`)
// //             const data = resp.data || {}
// //             if (!mounted) return
// //             setBus(data)
// //             setSeats(data.seats || data.seat_list || data.seat || [])
// //             return
// //           } catch (err) {
// //             // continue to fallbacks
// //             console.warn('Numeric lookup failed, falling back', err)
// //           }
// //         }

// //         // Try direct GET with busId (in case API supports string identifier)
// //         try {
// //           const resp = await axios.get(`/api/buses/${encodeURIComponent(busId)}`)
// //           const data = resp.data || {}
// //           if (!mounted) return
// //           setBus(data)
// //           setSeats(data.seats || data.seat_list || data.seat || [])
// //           return
// //         } catch (err) {
// //           // fallback to list search
// //           console.warn('Direct lookup failed, trying list search', err)
// //         }

// //         // Fallback: fetch all buses and find by bus_id or route
// //         try {
// //           const listResp = await axios.get('/api/buses/')
// //           const list = Array.isArray(listResp.data) ? listResp.data : []
// //           const found = list.find(b => {
// //             if (!b) return false
// //             const bid = b.bus_id ?? b.id ?? b.pk
// //             if (bid && String(bid).toLowerCase() === String(busId).toLowerCase()) return true
// //             if (b.route && String(b.route).toLowerCase() === String(busId).toLowerCase()) return true
// //             return false
// //           })
// //           if (found) {
// //             if (!mounted) return
// //             setBus(found)
// //             setSeats(found.seats || found.seat_list || found.seat || [])
// //             return
// //           }
// //         } catch (err) {
// //           console.error('List lookup failed', err)
// //         }

// //         // If nothing found, ensure bus is null
// //         if (mounted) {
// //           setBus(null)
// //           setSeats([])
// //         }
// //       } catch (error) {
// //         console.error('Error fetching bus details', error)
// //         if (mounted) {
// //           setBus(null)
// //           setSeats([])
// //         }
// //       } finally {
// //         if (mounted) setLoading(false)
// //       }
// //     }

// //     if (busId) fetchBusDetails()
// //     return () => {
// //       mounted = false
// //     }
// //   }, [busId])

// //   const handleBook = async (seatId) => {
// //     if (!userId) {
// //       alert('Please login to book a seat')
// //       navigate('/login')
// //       return
// //     }

// //     setSelectedSeat(seatId)
// //     setPendingSeatId(seatId)
// //     setSeatError('')
// //     setShowTimeSelection(true)
// //   }

// //   const handleTimeSelection = async (time) => {
// //     if (!time) {
// //       setSeatError('Please select a time')
// //       return
// //     }

// //     setSelectedTime(time)
// //     setBookingLoading(true)

// //     try {
// //       // Determine actual seat id to send to backend
// //       const foundSeat = (seats || []).find((s, i) => s?.id === pendingSeatId || s?.pk === pendingSeatId || i === pendingSeatId)
// //       const payloadSeatId = foundSeat?.id ?? foundSeat?.pk ?? (Number.isFinite(Number(pendingSeatId)) ? Number(pendingSeatId) : pendingSeatId)

// //       await axios.post(
// //         '/api/booking/',
// //         { seat: payloadSeatId, travel_time: time },
// //         { withCredentials: true }
// //       )

// //       alert('🎉 Booking Successful!')
// //       setSeats(prev =>
// //         prev.map(seat =>
// //           (seat?.id === payloadSeatId || seat?.pk === payloadSeatId) ? { ...seat, is_booked: true } : seat
// //         )
// //       )
// //       setShowTimeSelection(false)
// //       setSelectedTime(null)
// //       setPendingSeatId(null)
// //       // Redirect to my-bookings after successful booking
// //       setTimeout(() => navigate('/my-bookings'), 1500)
// //     } catch (error) {
// //       let msg = 'Booking failed. Please try again.'
// //       const respData = error.response?.data
// //       if (respData) {
// //         // handle standard DRF messages
// //         msg = respData.error || respData.detail || JSON.stringify(respData)
// //       } else if (error.message) {
// //         msg = error.message
// //       }

// //       setSeatError(msg)
// //       alert(msg)

// //       // If token invalid/expired, clear and redirect to login quickly
// //       const status = error.response?.status
// //       if (status === 401) {
// //         navigate('/login')
// //       }
// //     } finally {
// //       setBookingLoading(false)
// //       setSelectedSeat(null)
// //     }
// //   }

// //   const handleCancelTimeSelection = () => {
// //     setShowTimeSelection(false)
// //     setSelectedSeat(null)
// //     setPendingSeatId(null)
// //     setSelectedTime(null)
// //   }

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen">
// //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
// //       </div>
// //     )
// //   }

// //   if (!bus) {
// //     return (
// //       <div className="text-center py-12">
// //         <h2 className="text-2xl font-bold text-gray-700">Bus not found</h2>
// //       </div>
// //     )
// //   }

// //   const availableSeats = (seats || []).filter(seat => !seat?.is_booked).length
// //   const totalSeats = (seats || []).length

// //   return (
// //     <div className="max-w-6xl mx-auto p-4 md:p-6" id='seat'>
// //       {/* Bus Header */}
// //         <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-xl p-8 text-white mb-8">
// //           <div className="flex flex-col md:flex-row justify-between mb-6">
// //             <div>
// //           <h1 className="text-3xl font-bold mb-1">{bus.route}</h1>
// //           <p className="text-indigo-100">
// //             Bus ID: {bus.bus_id} | {bus.bus_type}
// //           </p>
// //           <p className="text-indigo-100">Depot: {bus.depot}</p>
// //             </div>
// //             <div className="mt-4 md:mt-0 flex flex-col gap-3 items-end">
// //           <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3">
// //             <p className="text-lg font-bold">{availableSeats} seats available</p>
// //             <p className="text-sm">Out of {totalSeats}</p>
// //           </div>
// //           <button
// //             onClick={toggleVoiceRecognition}
// //             className={`px-4 py-2 rounded-lg font-semibold ${
// //               isListening
// //             ? 'bg-red-600 text-white'
// //             : 'bg-blue-600 text-white hover:bg-blue-700'
// //             }`}
// //           >
// //             {isListening ? '🎤 Listening...' : '🎤 Voice Book'}
// //           </button>
// //             </div>
// //           </div>

// //           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
// //             <div>
// //           <p className="text-sm text-indigo-200">Date</p>
// //           <p className="text-xl font-bold">{bus.date}</p>
// //             </div>
// //             <div>
// //           <p className="text-sm text-indigo-200">Day</p>
// //           <p className="text-xl font-bold">{bus.day_of_week}</p>
// //             </div>
// //             <div>
// //           <p className="text-sm text-indigo-200">Distance</p>
// //           <p className="text-xl font-bold">{bus.distance_km} km</p>
// //             </div>
// //             <div>
// //           <p className="text-sm text-indigo-200">Fare</p>
// //           <p className="text-xl font-bold">₹{bus.fare_per_passenger}</p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Seat Layout */}
// //         <div className="bg-white rounded-xl shadow-lg p-6">
// //           <div className="flex justify-center">
// //             <div className="flex flex-col gap-4">
// //               {(() => {
// //                 const rows = []
// //                 for (let i = 0; i < (seats || []).length; i += 5) {
// //                   rows.push((seats || []).slice(i, i + 5))
// //                 }

// //                 return rows.map((row, rowIndex) => (
// //                   <div key={rowIndex} className="flex justify-center gap-4">
// //                     {/* Left side (2 seats) */}
// //                     <div className="flex gap-4">
// //                       {row.slice(0, 2).map((seat, idx) => {
// //                         const seatId = seat?.id ?? seat?.pk ?? rowIndex * 5 + idx
// //                         const isBooked = Boolean(seat?.is_booked)
// //                         const isSelected = selectedSeat === seatId
// //                         const seatNumber = seat?.seat_number ?? seatId

// //                         const btnClass = isBooked
// //                           ? 'bg-red-500 text-white cursor-not-allowed'
// //                           : isSelected
// //                           ? 'bg-amber-500 text-white'
// //                           : 'bg-emerald-500 text-white hover:bg-emerald-600'

// //                         return (
// //                           <button
// //                             key={seatId}
// //                             onClick={() => !isBooked && handleBook(seatId)}
// //                             disabled={isBooked || bookingLoading}
// //                             className={`w-14 h-14 flex items-center justify-center rounded-lg font-bold ${btnClass}`}
// //                           >
// //                             {seatNumber}
// //                           </button>
// //                         )
// //                       })}
// //                     </div>

// //                     {/* Aisle Space */}
// //                     <div className="w-16"></div>

// //                     {/* Right side (3 seats) */}
// //                     <div className="flex gap-4">
// //                       {row.slice(2).map((seat, idx) => {
// //                         const seatId = seat?.id ?? seat?.pk ?? rowIndex * 5 + idx + 2
// //                         const isBooked = Boolean(seat?.is_booked)
// //                         const isSelected = selectedSeat === seatId
// //                         const seatNumber = seat?.seat_number ?? seatId

// //                         const btnClass = isBooked
// //                           ? 'bg-red-500 text-white cursor-not-allowed'
// //                           : isSelected
// //                           ? 'bg-amber-500 text-white'
// //                           : 'bg-emerald-500 text-white hover:bg-emerald-600'

// //                         return (
// //                           <button
// //                             key={seatId}
// //                             onClick={() => !isBooked && handleBook(seatId)}
// //                             disabled={isBooked || bookingLoading}
// //                             className={`w-14 h-14 flex items-center justify-center rounded-lg font-bold ${btnClass}`}
// //                           >
// //                             {seatNumber}
// //                           </button>
// //                         )
// //                       })}
// //                     </div>
// //                   </div>
// //                 ))
// //               })()}
// //             </div>
// //           </div>

// //           {showTimeSelection && (
// //             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //               <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
// //                 <h2 className="text-2xl font-bold mb-4">Select Schedule Time</h2>
// //                 <div className="space-y-3 mb-6">
// //                   {bus?.available_times && bus.available_times.length > 0 ? (
// //                     bus.available_times.map((time) => (
// //                       <button
// //                         key={time}
// //                         onClick={() => handleTimeSelection(time)}
// //                         className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
// //                           selectedTime === time
// //                             ? 'bg-indigo-600 text-white'
// //                             : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
// //                         }`}
// //                       >
// //                         {time}
// //                       </button>
// //                     ))
// //                   ) : (
// //                     <p className="text-gray-600">No available times for this bus</p>
// //                   )}
// //                 </div>
// //                 <div className="flex gap-3">
// //                   <button
// //                     onClick={handleCancelTimeSelection}
// //                     className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
// //                   >
// //                     Cancel
// //                   </button>
// //                   <button
// //                     onClick={() => handleTimeSelection(selectedTime)}
// //                     disabled={!selectedTime || bookingLoading}
// //                     className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
// //                   >
// //                     {bookingLoading ? 'Booking...' : 'Confirm Booking'}
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {seatError && (
// //             <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
// //               {seatError}
// //             </div>
// //           )}

// //           <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
// //             <p className="text-sm font-semibold text-blue-900 mb-2">
// //               Voice Transcription:
// //             </p>
// //             <p className="text-gray-700">
// //               {isListening ? 'Listening...' : 'Click "Voice Book" button to start speaking'}
// //             </p>
// //           </div>
// //           <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
// //             <p className="text-sm font-semibold text-green-900 mb-2">
// //               📋 Booking Instructions:
// //             </p>
// //             <p className="text-gray-700 text-sm">
// //               1. Click on an available seat (green button)<br />
// //               2. Select your preferred travel time from the popup<br />
// //               3. Click "Confirm Booking" to complete your reservation
// //             </p>
// //           </div>
// //           <div className="text-center">
// //             {!userId ? (
// //               <button
// //                 onClick={() => navigate('/login')}
// //                 className="px-8 py-3 bg-indigo-600 text-white rounded-lg"
// //               >
// //                 Login to Book Seats
// //               </button>
// //             ) : availableSeats === 0 ? (
// //               <p className="text-red-600 font-semibold">All seats are booked</p>
// //             ) : (
// //               <p className="text-gray-600">
// //                 Capacity: {bus.capacity} | Passengers: {bus.passengers} |
// //                 Occupancy: {bus.occupancy_rate}%
// //               </p>
// //             )}
// //           </div>
// //         </div>


// //       <button
// //         onClick={() => navigate('/my-bookings')}
// //         className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
// //       >
// //         View Booking Details
// //       </button>
// //     </div>
// //   )
// // }

// // export default BusSeats


// import axios from 'axios'
// import React, { useState, useEffect } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'

// const BusSeats = ({ userId }) => {
//   const [bus, setBus] = useState(null)
//   const [seats, setSeats] = useState([])
//   const [selectedSeat, setSelectedSeat] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [bookingLoading, setBookingLoading] = useState(false)
//   const [seatError, setSeatError] = useState('')
//   const [isListening, setIsListening] = useState(false)
//   const [pendingSeatId, setPendingSeatId] = useState(null)

//   const { busId } = useParams()
//   const navigate = useNavigate()

//   // Initialize speech recognition
//   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
//   const recognitionRef = React.useRef(null)
//   if (recognitionRef.current) {
//     recognitionRef.current.abort()
//   }
//   useEffect(() => {
//     if (SpeechRecognition) {
//       recognitionRef.current = new SpeechRecognition()
//       recognitionRef.current.continuous = false
//       recognitionRef.current.interimResults = false
//       recognitionRef.current.lang = 'en-US'

//       recognitionRef.current.onresult = (event) => {
//         const transcript = Array.from(event.results)
//           .map(result => result[0].transcript)
//           .join('')
//           .toLowerCase()
//         setSeatError('')
//         const showDetailsMatch = transcript.match(/show\s+details/i)
//         if (showDetailsMatch) {
//           if (userId) {
//             navigate('/my-bookings')
//           } else {
//             setSeatError('Please login to view your bookings')
//             navigate('/login')
//           }
//           return
//         }
//         const match = transcript.match(/book\s+seat\s+([a-z0-9]+)/i)
//         if (match) {
//           const seatIdentifier = match[1]
//           const foundSeat = (seats || []).find(s => {
//             const seatNum = s?.seat_number ?? s?.id ?? s?.pk
//             return String(seatNum).toLowerCase() === seatIdentifier ||
//                   Number(seatNum) === Number(seatIdentifier)
//           })
//           if (foundSeat) {
//             if (userId) {
//               const seatId = foundSeat?.id ?? foundSeat?.pk ?? foundSeat?.seat_number
//               setSelectedSeat(seatId)
//               setPendingSeatId(seatId)
//               navigate('/schedule', {
//                 state: {
//                   busId: busId,
//                   seatId: seatId,
//                   busDate: bus?.date,
//                   returnTo: '/bus/' + busId
//                 }
//               })
//             } else {
//               setSeatError('Please login to book a seat')
//               navigate('/login')
//             }
//           } else {
//             setSeatError(`Seat ${seatIdentifier} not found`)
//           }
//         }
//       }

//       recognitionRef.current.onerror = (event) => {
//         setSeatError(`Speech recognition error: ${event.error}`)
//         setIsListening(false)
//       }

//       recognitionRef.current.onend = () => {
//         setIsListening(false)
//       }
//     }
//   }, [seats, busId, bus, navigate, userId])

//   const toggleVoiceRecognition = () => {
//     if (!recognitionRef.current) {
//       setSeatError('Speech recognition not supported in your browser')
//       return
//     }

//     if (isListening) {
//       recognitionRef.current.stop()
//       setIsListening(false)
//     } else {
//       setSeatError('')
//       recognitionRef.current.start()
//       setIsListening(true)
//     }
//   }

//   useEffect(() => {
//     let mounted = true

//     const fetchBusDetails = async () => {
//       try {
//         // First try numeric PK endpoint (Django expects int PK)
//         const numericId = Number(busId)
//         if (!Number.isNaN(numericId)) {
//           try {
//             const resp = await axios.get(`/api/buses/${numericId}`)
//             const data = resp.data || {}
//             if (!mounted) return
//             setBus(data)
//             setSeats(data.seats || data.seat_list || data.seat || [])
//             return
//           } catch (err) {
//             // continue to fallbacks
//             console.warn('Numeric lookup failed, falling back', err)
//           }
//         }

//         // Try direct GET with busId (in case API supports string identifier)
//         try {
//           const resp = await axios.get(`/api/buses/${encodeURIComponent(busId)}`)
//           const data = resp.data || {}
//           if (!mounted) return
//           setBus(data)
//           setSeats(data.seats || data.seat_list || data.seat || [])
//           return
//         } catch (err) {
//           // fallback to list search
//           console.warn('Direct lookup failed, trying list search', err)
//         }

//         // Fallback: fetch all buses and find by bus_id or route
//         try {
//           const listResp = await axios.get('/api/buses/')
//           const list = Array.isArray(listResp.data) ? listResp.data : []
//           const found = list.find(b => {
//             if (!b) return false
//             const bid = b.bus_id ?? b.id ?? b.pk
//             if (bid && String(bid).toLowerCase() === String(busId).toLowerCase()) return true
//             if (b.route && String(b.route).toLowerCase() === String(busId).toLowerCase()) return true
//             return false
//           })
//           if (found) {
//             if (!mounted) return
//             setBus(found)
//             setSeats(found.seats || found.seat_list || found.seat || [])
//             return
//           }
//         } catch (err) {
//           console.error('List lookup failed', err)
//         }

//         // If nothing found, ensure bus is null
//         if (mounted) {
//           setBus(null)
//           setSeats([])
//         }
//       } catch (error) {
//         console.error('Error fetching bus details', error)
//         if (mounted) {
//           setBus(null)
//           setSeats([])
//         }
//       } finally {
//         if (mounted) setLoading(false)
//       }
//     }

//     if (busId) fetchBusDetails()
//     return () => {
//       mounted = false
//     }
//   }, [busId])

//   const handleBook = async (seatId) => {
//     if (!userId) {
//       alert('Please login to book a seat')
//       navigate('/login')
//       return
//     }

//     // Store the selected seat in session/state and navigate to schedule page
//     setSelectedSeat(seatId)
//     setPendingSeatId(seatId)
//     setSeatError('')
    
//     // Navigate to schedule page with seat info
//     navigate('/schedule', {
//       state: {
//         busId: busId,
//         seatId: seatId,
//         busDate: bus.date,
//         returnTo: '/bus/' + busId
//       }
//     })
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     )
//   }

//   if (!bus) {
//     return (
//       <div className="text-center py-12">
//         <h2 className="text-2xl font-bold text-gray-700">Bus not found</h2>
//       </div>
//     )
//   }

//   const availableSeats = (seats || []).filter(seat => !seat?.is_booked).length
//   const totalSeats = (seats || []).length

//   return (
//     <div className="max-w-6xl mx-auto p-4 md:p-6" id='seat'>
//       {/* Bus Header */}
//         <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-xl p-8 text-white mb-8">
//           <div className="flex flex-col md:flex-row justify-between mb-6">
//             <div>
//           <h1 className="text-3xl font-bold mb-1">{bus.route}</h1>
//           <p className="text-indigo-100">
//             Bus ID: {bus.bus_id} | {bus.bus_type}
//           </p>
//           <p className="text-indigo-100">Depot: {bus.depot}</p>
//             </div>
//             <div className="mt-4 md:mt-0 flex flex-col gap-3 items-end">
//           <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3">
//             <p className="text-lg font-bold">{availableSeats} seats available</p>
//             <p className="text-sm">Out of {totalSeats}</p>
//           </div>
//           <button
//             onClick={toggleVoiceRecognition}
//             className={`px-4 py-2 rounded-lg font-semibold ${
//               isListening
//             ? 'bg-red-600 text-white'
//             : 'bg-blue-600 text-white hover:bg-blue-700'
//             }`}
//           >
//             {isListening ? '🎤 Listening...' : '🎤 Voice Book'}
//           </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             <div>
//           <p className="text-sm text-indigo-200">Date</p>
//           <p className="text-xl font-bold">{bus.date}</p>
//             </div>
//             <div>
//           <p className="text-sm text-indigo-200">Day</p>
//           <p className="text-xl font-bold">{bus.day_of_week}</p>
//             </div>
//             <div>
//           <p className="text-sm text-indigo-200">Distance</p>
//           <p className="text-xl font-bold">{bus.distance_km} km</p>
//             </div>
//             <div>
//           <p className="text-sm text-indigo-200">Fare</p>
//           <p className="text-xl font-bold">₹{bus.fare_per_passenger}</p>
//             </div>
//           </div>
//         </div>

//         {/* Seat Layout */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <div className="flex justify-center">
//             <div className="flex flex-col gap-4">
//               {(() => {
//                 const rows = []
//                 for (let i = 0; i < (seats || []).length; i += 5) {
//                   rows.push((seats || []).slice(i, i + 5))
//                 }

//                 return rows.map((row, rowIndex) => (
//                   <div key={rowIndex} className="flex justify-center gap-4">
//                     {/* Left side (2 seats) */}
//                     <div className="flex gap-4">
//                       {row.slice(0, 2).map((seat, idx) => {
//                         const seatId = seat?.id ?? seat?.pk ?? rowIndex * 5 + idx
//                         const isBooked = Boolean(seat?.is_booked)
//                         const isSelected = selectedSeat === seatId
//                         const seatNumber = seat?.seat_number ?? seatId

//                         const btnClass = isBooked
//                           ? 'bg-red-500 text-white cursor-not-allowed'
//                           : isSelected
//                           ? 'bg-amber-500 text-white'
//                           : 'bg-emerald-500 text-white hover:bg-emerald-600'

//                         return (
//                           <button
//                             key={seatId}
//                             onClick={() => !isBooked && handleBook(seatId)}
//                             disabled={isBooked || bookingLoading}
//                             className={`w-14 h-14 flex items-center justify-center rounded-lg font-bold ${btnClass}`}
//                           >
//                             {seatNumber}
//                           </button>
//                         )
//                       })}
//                     </div>

//                     {/* Aisle Space */}
//                     <div className="w-16"></div>

//                     {/* Right side (3 seats) */}
//                     <div className="flex gap-4">
//                       {row.slice(2).map((seat, idx) => {
//                         const seatId = seat?.id ?? seat?.pk ?? rowIndex * 5 + idx + 2
//                         const isBooked = Boolean(seat?.is_booked)
//                         const isSelected = selectedSeat === seatId
//                         const seatNumber = seat?.seat_number ?? seatId

//                         const btnClass = isBooked
//                           ? 'bg-red-500 text-white cursor-not-allowed'
//                           : isSelected
//                           ? 'bg-amber-500 text-white'
//                           : 'bg-emerald-500 text-white hover:bg-emerald-600'

//                         return (
//                           <button
//                             key={seatId}
//                             onClick={() => !isBooked && handleBook(seatId)}
//                             disabled={isBooked || bookingLoading}
//                             className={`w-14 h-14 flex items-center justify-center rounded-lg font-bold ${btnClass}`}
//                           >
//                             {seatNumber}
//                           </button>
//                         )
//                       })}
//                     </div>
//                   </div>
//                 ))
//               })()}
//             </div>
//           </div>

//           {seatError && (
//             <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
//               {seatError}
//             </div>
//           )}

//           <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
//             <p className="text-sm font-semibold text-blue-900 mb-2">
//               Voice Transcription:
//             </p>
//             <p className="text-gray-700">
//               {isListening ? 'Listening...' : 'Click "Voice Book" button to start speaking'}
//             </p>
//           </div>
//           <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
//             <p className="text-sm font-semibold text-green-900 mb-2">
//               📋 Booking Instructions:
//             </p>
//             <p className="text-gray-700 text-sm">
//               1. Click on an available seat (green button)<br />
//               2. Select your preferred travel time on the next page<br />
//               3. Click "Confirm Booking" to complete your reservation<br />
//               4. Say "show details" to view your bookings
//             </p>
//           </div>
//           <div className="text-center">
//             {!userId ? (
//               <button
//                 onClick={() => navigate('/login')}
//                 className="px-8 py-3 bg-indigo-600 text-white rounded-lg"
//               >
//                 Login to Book Seats
//               </button>
//             ) : availableSeats === 0 ? (
//               <p className="text-red-600 font-semibold">All seats are booked</p>
//             ) : (
//               <p className="text-gray-600">
//                 Capacity: {bus.capacity} | Passengers: {bus.passengers} |
//                 Occupancy: {bus.occupancy_rate}%
//               </p>
//             )}
//           </div>
//         </div>


//       <button
//         onClick={() => navigate('/my-bookings')}
//         className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
//       >
//         View Booking Details
//       </button>
//     </div>
//   )
// }

// export default BusSeats





import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const BusSeats = ({ userId }) => {
  const [bus, setBus] = useState(null)
  const [seats, setSeats] = useState([])
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [seatError, setSeatError] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [pendingSeatId, setPendingSeatId] = useState(null)
  const [transcript, setTranscript] = useState('')
  const [showReceipt, setShowReceipt] = useState(false)
  const [bookingReceipt, setBookingReceipt] = useState(null)
  const [userName, setUserName] = useState('')

  const { busId } = useParams()
  const navigate = useNavigate()
  const recognitionRef = useRef(null)

  // Initialize speech recognition only once
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported')
      return
    }

    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang = 'en-US'

    recognitionRef.current.onstart = () => {
      setIsListening(true)
      setTranscript('')
      setSeatError('')
    }

    recognitionRef.current.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('')
        .toLowerCase()
      
      setTranscript(currentTranscript)
      
      // Check for "show details" command
      if (currentTranscript.match(/show\s+details/i)) {
        if (userId) {
          navigate('/my-bookings')
        } else {
          setSeatError('Please login to view your bookings')
          navigate('/login')
        }
        return
      }

      // Check for "book seat" command
      const match = currentTranscript.match(/book\s+seat\s+([a-z0-9]+)/i)
      if (match) {
        const seatIdentifier = match[1]
        const foundSeat = (seats || []).find(s => {
          const seatNum = s?.seat_number ?? s?.id ?? s?.pk
          return String(seatNum).toLowerCase() === seatIdentifier ||
                Number(seatNum) === Number(seatIdentifier)
        })
        
        if (foundSeat) {
          if (userId) {
            const seatId = foundSeat?.id ?? foundSeat?.pk ?? foundSeat?.seat_number
            handleVoiceBooking(seatId, foundSeat)
          } else {
            setSeatError('Please login to book a seat')
            navigate('/login')
          }
        } else {
          setSeatError(`Seat ${seatIdentifier} not found`)
        }
      }
    }

    recognitionRef.current.onerror = (event) => {
      setSeatError(`Speech recognition error: ${event.error}`)
      setIsListening(false)
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [userId, seats, navigate])

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      setSeatError('Speech recognition not supported in your browser')
      return
    }
    // Handle already listening state
    if (recognitionRef.current.isListening) {
      recognitionRef.current.stop()
      return
    }

    try {
      if (isListening) {
        recognitionRef.current.stop()
        setIsListening(false)
      } else {
        setSeatError('')
        setTranscript('')
        recognitionRef.current.start()
      }
    } catch (error) {
      console.error('Speech recognition error:', error)
      setSeatError('Failed to start speech recognition')
    }
  }

  useEffect(() => {
    let mounted = true

    const fetchUserName = async () => {
      if (!userId) return
      try {
        const resp = await axios.get('/api/auth/user/', { withCredentials: true })
        if (mounted && resp.data) {
          setUserName(resp.data?.first_name || resp.data?.last_name || resp.data?.username || resp.data?.name || 'Passenger')
        }
      } catch (error) {
        console.warn('Failed to fetch user name', error)
        // Fallback to localStorage if available
        const storedName = localStorage.getItem('username')
        if (mounted) {
          setUserName(storedName || 'Passenger')
        }
      }
    }

    const fetchBusDetails = async () => {
      try {
        const numericId = Number(busId)
        if (!Number.isNaN(numericId)) {
          try {
            const resp = await axios.get(`/api/buses/${numericId}`)
            const data = resp.data || {}
            if (!mounted) return
            setBus(data)
            setSeats(data.seats || data.seat_list || data.seat || [])
            return
          } catch (err) {
            console.warn('Numeric lookup failed, falling back', err)
          }
        }

        try {
          const resp = await axios.get(`/api/buses/${encodeURIComponent(busId)}`)
          const data = resp.data || {}
          if (!mounted) return
          setBus(data)
          setSeats(data.seats || data.seat_list || data.seat || [])
          return
        } catch (err) {
          console.warn('Direct lookup failed, trying list search', err)
        }

        try {
          const listResp = await axios.get('/api/buses/')
          const list = Array.isArray(listResp.data) ? listResp.data : []
          const found = list.find(b => {
            if (!b) return false
            const bid = b.bus_id ?? b.id ?? b.pk
            if (bid && String(bid).toLowerCase() === String(busId).toLowerCase()) return true
            if (b.route && String(b.route).toLowerCase() === String(busId).toLowerCase()) return true
            return false
          })
          if (found) {
            if (!mounted) return
            setBus(found)
            setSeats(found.seats || found.seat_list || found.seat || [])
            return
          }
        } catch (err) {
          console.error('List lookup failed', err)
        }

        if (mounted) {
          setBus(null)
          setSeats([])
        }
      } catch (error) {
        console.error('Error fetching bus details', error)
        if (mounted) {
          setBus(null)
          setSeats([])
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    if (busId) fetchBusDetails()
    if (userId) fetchUserName()
    return () => {
      mounted = false
    }
  }, [busId, userId])

  const handleBook = async (seatId) => {
    if (!userId) {
      alert('Please login to book a seat')
      navigate('/login')
      return
    }

    setSelectedSeat(seatId)
    setPendingSeatId(seatId)
    setSeatError('')
    
    navigate('/schedule', {
      state: {
        busId: busId,
        seatId: seatId,
        busDate: bus?.date,
        returnTo: '/bus/' + busId
      }
    })
  }

  const handleVoiceBooking = async (seatId, seatData) => {
    if (!userId) {
      setSeatError('Please login to book a seat')
      return
    }

    setBookingLoading(true)
    setSeatError('')

    try {
      // Validate bus data
      if (!bus || !bus.date || !bus.route) {
        throw new Error('Invalid bus data. Please refresh the page.')
      }

      // Get available times - with validation and fallback
      let availableTimes = bus?.available_times || []
      if (!availableTimes || availableTimes.length === 0) {
        availableTimes = ['10:00 AM', '02:00 PM', '06:00 PM']
      }

      // Use first available time
      const selectedTime = availableTimes[0]

      const response = await axios.post(
        '/api/booking/',
        { 
          seat: seatId, 
          travel_time: selectedTime,
          user: userId
        },
        { withCredentials: true }
      )

      // Create receipt data with validation
      if (!response.data) {
        throw new Error('No response from booking server')
      }

      const displayName = userName && userName.trim() ? userName : (localStorage.getItem('userName') || 'Passenger')
      const receipt = {
        bookingId: String(response.data?.id || response.data?.booking_id || `BK${Date.now()}`),
        seatNumber: String(seatData?.seat_number || seatId || 'N/A'),
        busRoute: String(bus?.route || bus?.bus_name || 'N/A'),
        busId: String(bus?.bus_id || bus?.id || 'N/A'),
        date: String(bus?.date || new Date().toISOString().split('T')[0] || 'N/A'),
        time: String(selectedTime || bus?.departure_time || 'N/A'),
        fare: Number(bus?.fare_per_passenger || bus?.fare || 0),
        userName: String(displayName || 'Passenger'),
        bookingTime: new Date().toLocaleString(),
        status: 'Confirmed',
        busType: String(bus?.bus_type || bus?.type || 'N/A'),
        depot: String(bus?.depot || bus?.source || 'N/A'),
        distance: String(bus?.distance_km || bus?.distance || 'N/A'),
        capacity: Number(bus?.capacity || bus?.total_seats || 0),
        dayOfWeek: String(bus?.day_of_week || bus?.day || 'N/A')
      }

      // Store receipt in localStorage for access across pages
      localStorage.setItem('lastBookingReceipt', JSON.stringify(receipt))

      setBookingReceipt(receipt)
      setShowReceipt(true)

      // Update seat status
      setSeats(prev =>
        prev.map(seat =>
          (seat?.id === seatId || seat?.pk === seatId) ? { ...seat, is_booked: true } : seat
        )
      )

      setIsListening(false)
    } catch (error) {
      console.error('Voice booking error:', error)
      let msg = 'Booking failed. Please try again.'
      const respData = error.response?.data
      if (respData) {
        msg = respData.error || respData.detail || (typeof respData === 'string' ? respData : JSON.stringify(respData))
      } else if (error.message) {
        msg = error.message
      }
      setSeatError(msg)
      
      const status = error.response?.status
      if (status === 401 || status === 403) {
        navigate('/login')
      }
    } finally {
      setBookingLoading(false)
    }
  }

  const handlePrintReceipt = () => {
    const printWindow = window.open('', '', 'height=600,width=800')
    printWindow.document.write(`
      <html>
      <head>
        <title>Booking Receipt</title>
        <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .receipt { border: 2px solid #333; padding: 20px; max-width: 400px; margin: auto; }
        .header { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
        .details { margin: 10px 0; line-height: 1.8; }
        .label { font-weight: bold; display: inline-block; width: 120px; }
        .divider { border-top: 1px dashed #999; margin: 15px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        .status { text-align: center; font-size: 18px; color: green; font-weight: bold; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="receipt">
        <div class="header">✈️ BOOKING RECEIPT</div>
        <div class="divider"></div>
        <div class="details">
          <div><span class="label">Booking ID:</span> ${bookingReceipt.bookingId}</div>
          <div><span class="label">Passenger:</span> ${bookingReceipt.username || bookingReceipt.user || res.data.username || 'Passenger'}</div>
          <div><span class="label">Bus Route:</span> ${bookingReceipt.busRoute}</div>
          <div><span class="label">Bus ID:</span> ${bookingReceipt.busId}</div>
          <div><span class="label">Seat Number:</span> ${bookingReceipt.seatNumber}</div>
          <div><span class="label">Date:</span> ${bookingReceipt.date}</div>
          <div><span class="label">Time:</span> ${bookingReceipt.time}</div>
          <div><span class="label">Fare:</span> ₹${bookingReceipt.fare}</div>
        </div>
        <div class="divider"></div>
        <div class="status">${bookingReceipt.status}</div>
        <div class="divider"></div>
        <div class="footer">
          <p>Booked on: ${bookingReceipt.bookingTime}</p>
          <p>Thank you for your booking!</p>
        </div>
        </div>
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!bus) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">Bus not found</h2>
      </div>
    )
  }

  const availableSeats = (seats || []).filter(seat => !seat?.is_booked).length
  const totalSeats = (seats || []).length

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6" id='seat'>
      {/* Bus Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-xl p-8 text-white mb-8">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">{bus.route}</h1>
            <p className="text-indigo-100">
              Bus ID: {bus.bus_id} | {bus.bus_type}
            </p>
            <p className="text-indigo-100">Depot: {bus.depot}</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col gap-3 items-end">
            <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3">
              <p className="text-lg font-bold">{availableSeats} seats available</p>
              <p className="text-sm">Out of {totalSeats}</p>
            </div>
            <button
              onClick={toggleVoiceRecognition}
              className={`px-4 py-2 rounded-lg font-semibold ${
                isListening
                  ? 'bg-red-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isListening ? '🎤 Listening...' : '🎤 Voice Book'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-indigo-200">Date</p>
            <p className="text-xl font-bold">{bus.date}</p>
          </div>
          <div>
            <p className="text-sm text-indigo-200">Day</p>
            <p className="text-xl font-bold">{bus.day_of_week}</p>
          </div>
          <div>
            <p className="text-sm text-indigo-200">Distance</p>
            <p className="text-xl font-bold">{bus.distance_km} km</p>
          </div>
          <div>
            <p className="text-sm text-indigo-200">Fare</p>
            <p className="text-xl font-bold">₹{bus.fare_per_passenger}</p>
          </div>
        </div>
      </div>

      {/* Seat Layout */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-center">
          <div className="flex flex-col gap-4">
            {(() => {
              const rows = []
              for (let i = 0; i < (seats || []).length; i += 5) {
                rows.push((seats || []).slice(i, i + 5))
              }

              return rows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-4">
                  {/* Left side (2 seats) - Men */}
                  <div className="flex gap-4">
                    {row.slice(0, 2).map((seat, idx) => {
                      const seatId = seat?.id ?? seat?.pk ?? rowIndex * 5 + idx
                      const isBooked = Boolean(seat?.is_booked)
                      const isSelected = selectedSeat === seatId
                      const seatNumber = seat?.seat_number ?? seatId

                        let btnClass = 'bg-sky-500 text-white hover:bg-sky-600'
                      if (isBooked) {
                        btnClass = 'bg-red-500 text-white cursor-not-allowed'
                      } else if (isSelected) {
                        btnClass = 'bg-amber-500 text-white'
                      }

                      return (
                        <button
                          key={seatId}
                          onClick={() => !isBooked && handleBook(seatId)}
                          disabled={isBooked || bookingLoading}
                          className={`w-14 h-14 flex items-center justify-center rounded-lg font-bold ${btnClass}`}
                        >
                          {seatNumber}
                        </button>
                      )
                    })}
                  </div>

                  {/* Aisle Space */}
                  <div className="w-16"></div>

                  {/* Right side (3 seats) - Women */}
                  <div className="flex gap-4">
                            {row.slice(2).map((seat, idx) => {
                      const seatId = seat?.id ?? seat?.pk ?? rowIndex * 5 + idx + 2
                      const isBooked = Boolean(seat?.is_booked)
                      const isSelected = selectedSeat === seatId
                      const seatNumber = seat?.seat_number ?? seatId

                      let btnClass = 'bg-pink-500 text-white hover:bg-pink-600'
                      if (isBooked) {
                        btnClass = 'bg-red-500 text-white cursor-not-allowed'
                      } else if (isSelected) {
                        btnClass = 'bg-amber-500 text-white'
                      }

                      return (
                        <button
                          key={seatId}
                          onClick={() => !isBooked && handleBook(seatId)}
                          disabled={isBooked || bookingLoading}
                          className={`w-14 h-14 flex items-center justify-center rounded-lg font-bold ${btnClass}`}
                        >
                          {seatNumber}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))
            })()}
          </div>
        </div>

        {seatError && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {seatError}
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-semibold text-blue-900 mb-2">
            🎙️ Voice Recognition:
          </p>
          <p className="text-gray-700 text-sm">
            {isListening ? `Listening... "${transcript}"` : 'Click "Voice Book" to start speaking'}
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Try: "book seat A1" or "show details"
          </p>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-3">
            🪑 Seat Colors:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-sky-500 rounded"></div>
              <span>Men </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-pink-500 rounded"></div>
              <span>Women </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded"></div>
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-amber-500 rounded"></div>
              <span>Selected</span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm font-semibold text-green-900 mb-2">
            📋 Booking Instructions:
          </p>
          <p className="text-gray-700 text-sm">
            1. Click on an available seat (Men[skyblue]/Women[pink])<br />
            2. Select your preferred travel time on the next page<br />
            3. Click "Confirm Booking" to complete your reservation<br />
            4. Or use voice: Say "book seat A1" or "show details"
          </p>
        </div>

        <div className="text-center mt-6">
          {!userId ? (
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Login to Book Seats
            </button>
          ) : availableSeats === 0 ? (
            <p className="text-red-600 font-semibold">All seats are booked</p>
          ) : (
            <p className="text-gray-600">
              Capacity: {bus.capacity} | Passengers: {bus.passengers} |
              Occupancy: {bus.occupancy_rate}%
            </p>
          )}
        </div>
      </div>

      {showReceipt && bookingReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-green-600 mb-2">✅ Booking Confirmed!</h2>
              <p className="text-sm text-gray-600">Your seat has been successfully booked</p>
            </div>

            <div className="border-b-2 border-dashed border-gray-300 mb-4 pb-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-bold">{bookingReceipt.bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Passenger:</span>
                  <span className="font-bold">{bookingReceipt.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Route:</span>
                  <span className="font-bold">{bookingReceipt.busRoute}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seat:</span>
                  <span className="font-bold text-lg text-indigo-600">{bookingReceipt.seatNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-bold">{bookingReceipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-bold">{bookingReceipt.time}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600 font-bold">Fare:</span>
                  <span className="font-bold text-lg text-green-600">₹{bookingReceipt.fare}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center mb-4">
              Booked on: {bookingReceipt.bookingTime}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePrintReceipt}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                🖨️ Print Receipt
              </button>
              <button
                onClick={() => {
                  setShowReceipt(false)
                  navigate('/my-bookings')
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                View Bookings
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate('/my-bookings')}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        View Booking Details
      </button>
    </div>
  )
}

export default BusSeats