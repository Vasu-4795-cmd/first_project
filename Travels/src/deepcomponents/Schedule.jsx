// // // import React, { useState, useEffect } from 'react'
// // // import axios from 'axios'
// // // import { useNavigate, useLocation } from 'react-router-dom'
// // // import { loadStripe } from '@stripe/stripe-js'
// // // import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
// // // import Image from './upi.jpg';
// // // import Image2 from './gpay2.jpg';

// // // const Schedule = ({ userId }) => {
// // //     const [buses, setBuses] = useState([])
// // //     const [isLoading, setIsLoading] = useState(true)
// // //     const [error, setError] = useState(null)
// // //     const [bookingLoading, setBookingLoading] = useState(false)

// // //     const [selectedBusId, setSelectedBusId] = useState('')
// // //     const [selectedBusDetails, setSelectedBusDetails] = useState(null)
// // //     const [bookingDate, setBookingDate] = useState('')
// // //     const [bookingTime, setBookingTime] = useState('')
// // //     const [agreedToTerms, setAgreedToTerms] = useState(false)

// // //     const [isBookingClosed, setIsBookingClosed] = useState(false)
// // //     const [bookingConfirmed, setBookingConfirmed] = useState(false)
// // //     const [bookingReceipt, setBookingReceipt] = useState(null)
// // //     const [autoBookingEnabled, setAutoBookingEnabled] = useState(false)
// // //     const [paymentMethod, setPaymentMethod] = useState('card')

// // //     const navigate = useNavigate()
// // //     const location = useLocation()
    
// // //     // Check if coming from seat selection
// // //     const { seatId: incomingSeatId, busId: incomingBusId, bookingDate: incomingDate, bookingTime: incomingTime } = location.state || {}
// // //     const [seatId, setSeatId] = useState(incomingSeatId || null)
// // //     const [busIdFromSeat, setBusIdFromSeat] = useState(incomingBusId || null)
// // //     const [showConfirmation, setShowConfirmation] = useState(!!incomingSeatId)

// // //     // ================= FETCH BUSES =================
// // //     useEffect(() => {
// // //         const fetchBuses = async () => {
// // //             try {
// // //                 const response = await axios.get('/api/buses/')
// // //                 setBuses(response.data)
                
// // //                 // If coming from seat selection, auto-select that bus
// // //                 if (incomingBusId) {
// // //                     setSelectedBusId(String(incomingBusId))
// // //                     const bus = response.data.find(b => b.id === parseInt(incomingBusId))
// // //                     if (bus) {
// // //                         setSelectedBusDetails(bus)
// // //                         setBookingDate(incomingDate || bus.date)
// // //                         setBookingTime(incomingTime || '')
// // //                     }
// // //                 }
// // //             } catch {
// // //                 setError('Failed to load buses')
// // //             } finally {
// // //                 setIsLoading(false)
// // //             }
// // //         }
// // //         fetchBuses()
// // //     }, [])

// // //     useEffect(() => {
// // //         if (incomingSeatId) {
// // //             setSeatId(incomingSeatId)
// // //             setBusIdFromSeat(incomingBusId)
// // //             setBookingDate(incomingDate || '')
// // //             setBookingTime(incomingTime || '')
// // //             setShowConfirmation(true)
// // //         }
// // //     }, [incomingSeatId, incomingBusId, incomingDate, incomingTime])

// // //     // ================= TIME LOCK LOGIC =================
// // //     useEffect(() => {
// // //         if (!bookingDate || !bookingTime) {
// // //             setIsBookingClosed(false)
// // //             return
// // //         }

// // //         try {
// // //             const [y, m, d] = bookingDate.split('-').map(Number)
// // //             const [hh, mm] = bookingTime.split(':').map(Number)
            
// // //             const bookingDateTime = new Date(y, m - 1, d, hh, mm, 0)
            
// // //             if (isNaN(bookingDateTime.getTime())) {
// // //                 return
// // //             }

// // //             const now = new Date()

// // //             if (now >= bookingDateTime) {
// // //                 setIsBookingClosed(true)
// // //                 setError('Booking time has passed. Please select a future time.')
// // //                 return
// // //             }

// // //             setIsBookingClosed(false)

// // //             const interval = setInterval(() => {
// // //                 const currentNow = new Date()
// // //                 if (currentNow >= bookingDateTime) {
// // //                     setIsBookingClosed(true)
// // //                     setError('Booking time has passed. Seat booking is closed.')
// // //                     clearInterval(interval)
// // //                 }
// // //             }, 1000)

// // //             return () => clearInterval(interval)
// // //         } catch (err) {
// // //             setIsBookingClosed(false)
// // //             return
// // //         }
// // //     }, [bookingDate, bookingTime])

// // //     // ================= AUTO BOOKING TRIGGER =================
// // //     useEffect(() => {
// // //         if (!autoBookingEnabled || !seatId || !bookingDate || !bookingTime || bookingConfirmed || !agreedToTerms) {
// // //             return
// // //         }

// // //         try {
// // //             const [y, m, d] = bookingDate.split('-').map(Number)
// // //             const [hh, mm] = bookingTime.split(':').map(Number)
// // //             const bookingDateTime = new Date(y, m - 1, d, hh, mm, 0)
            
// // //             if (isNaN(bookingDateTime.getTime())) {
// // //                 return
// // //             }

// // //             const now = new Date()
// // //             const timeUntilBooking = bookingDateTime.getTime() - now.getTime()

// // //             if (timeUntilBooking <= 0) {
// // //                 if (bookingLoading === false) {
// // //                     executeAutoBooking()
// // //                 }
// // //             } else {
// // //                 const timeoutId = setTimeout(() => {
// // //                     if (!bookingConfirmed) {
// // //                         executeAutoBooking()
// // //                     }
// // //                 }, timeUntilBooking)

// // //                 return () => clearTimeout(timeoutId)
// // //             }
// // //         } catch (err) {
// // //             setError('Error scheduling auto booking')
// // //         }
// // //     }, [autoBookingEnabled, seatId, bookingDate, bookingTime, agreedToTerms, bookingConfirmed, bookingLoading])

// // //     // ================= HELPER: Extract Receipt Data =================
// // //     const buildReceiptFromResponse = (data, source = 'manual') => {
// // //         // Handle nested API response structure
// // //         const seatData = data?.seat || {}
// // //         const busData = seatData?.bus || {}
        
// // //         const receipt = {
// // //             bookingId: data?.id || data?.booking_id || 'N/A',
// // //             bookingTime: data?.booking_time ? new Date(data.booking_time).toLocaleString() : new Date().toLocaleString(),
// // //             user: data?.user?.username || data?.user || 'Guest',
// // //             seatNumber: seatData?.seat_number || seatId || 'N/A',
// // //             route: busData?.route || selectedBusDetails?.route || 'N/A',
// // //             busId: busData?.bus_id || selectedBusDetails?.bus_id || 'N/A',
// // //             depot: busData?.depot || selectedBusDetails?.depot || 'N/A',
// // //             date: bookingDate || busData?.date || selectedBusDetails?.date || 'N/A',
// // //             time: bookingTime || data?.travel_time || 'N/A',
// // //             fare: busData?.fare_per_passenger || selectedBusDetails?.fare_per_passenger || 'N/A',
// // //             dayOfWeek: busData?.day_of_week || selectedBusDetails?.day_of_week || 'N/A',
// // //             source: source
// // //         }
// // //         return receipt
// // //     }

// // //     // ================= EXECUTE AUTO BOOKING =================
// // //     const executeAutoBooking = async () => {
// // //         setBookingLoading(true)

// // //         try {
// // //             const response = await axios.post(
// // //                 '/api/booking/',
// // //                 { 
// // //                     seat: seatId, 
// // //                     travel_time: bookingTime 
// // //                 },
// // //                 { withCredentials: true }
// // //             )

// // //             const receipt = buildReceiptFromResponse(response.data, 'auto')
// // //             receipt.autoBooked = true
            
// // //             setBookingReceipt(receipt)
// // //             setBookingConfirmed(true)
// // //             setError(null)
// // //         } catch (error) {
// // //             let msg = 'Auto booking failed. Please try again.'
// // //             const respData = error.response?.data
// // //             if (respData) {
// // //                 msg = respData.error || respData.detail || JSON.stringify(respData)
// // //             } else if (error.message) {
// // //                 msg = error.message
// // //             }

// // //             setError(msg)
// // //             setAutoBookingEnabled(false)

// // //             if (error.response?.status === 401) {
// // //                 navigate('/login')
// // //             }
// // //         } finally {
// // //             setBookingLoading(false)
// // //         }
// // //     }

// // //     // ================= BUS SELECT =================
// // //     const handleBusSelect = (e) => {
// // //         const busId = e.target.value
// // //         setSelectedBusId(busId)
// // //         setBusIdFromSeat(busId)

// // //         const bus = buses.find(b => b.id === parseInt(busId))
// // //         setSelectedBusDetails(bus || null)

// // //         setBookingDate(bus?.date || '')
// // //         setBookingTime('')
// // //         setIsBookingClosed(false)
// // //         setError(null)
// // //         setAgreedToTerms(false)
// // //         setAutoBookingEnabled(false)
// // //     }

// // //     // ================= CONFIRM BOOKING (Manual) =================
// // //     const confirmBooking = async () => {
// // //         if (!seatId) {
// // //             setError('Seat information missing. Please go back and select a seat.')
// // //             return
// // //         }

// // //         if (!bookingTime) {
// // //             setError('Please select a travel time')
// // //             return
// // //         }

// // //         if (!agreedToTerms) {
// // //             setError('Please agree to booking terms')
// // //             return
// // //         }

// // //         try {
// // //             const [y, m, d] = bookingDate.split('-').map(Number)
// // //             const [hh, mm] = bookingTime.split(':').map(Number)
// // //             const selectedDateTime = new Date(y, m - 1, d, hh, mm, 0)
            
// // //             if (selectedDateTime <= new Date()) {
// // //                 setError('Booking time has passed. Please select a future time.')
// // //                 setIsBookingClosed(true)
// // //                 return
// // //             }
// // //         } catch (err) {
// // //             setError('Invalid booking time. Please try again.')
// // //             return
// // //         }

// // //         setBookingLoading(true)

// // //         try {
// // //             const response = await axios.post(
// // //                 '/api/booking/',
// // //                 { 
// // //                     seat: seatId, 
// // //                     travel_time: bookingTime 
// // //                 },
// // //                 { withCredentials: true }
// // //             )

// // //             const receipt = buildReceiptFromResponse(response.data, 'manual')
// // //             setBookingReceipt(receipt)
// // //             setBookingConfirmed(true)
// // //             setError(null)
// // //         } catch (error) {
// // //             let msg = 'Booking failed. Please try again.'
// // //             const respData = error.response?.data
// // //             if (respData) {
// // //                 msg = respData.error || respData.detail || JSON.stringify(respData)
// // //             } else if (error.message) {
// // //                 msg = error.message
// // //             }

// // //             setError(msg)
// // //             alert(msg)

// // //             if (error.response?.status === 401) {
// // //                 navigate('/login')
// // //             }
// // //         } finally {
// // //             setBookingLoading(false)
// // //         }
// // //     }

// // //     // ================= PROCEED TO SEATS =================
// // //     const proceedToSeats = () => {
// // //         if (!selectedBusId || !bookingDate || !bookingTime || !agreedToTerms) {
// // //             setError('Please complete all fields')
// // //             return
// // //         }

// // //         if (isBookingClosed) {
// // //             setError('Booking is closed for this schedule.')
// // //             return
// // //         }

// // //         if (!selectedBusDetails) {
// // //             setError('Bus details not found. Please select a bus again.')
// // //             return
// // //         }

// // //         // Get the actual bus ID from bus details - check both possible field names
// // //         const actualBusId = selectedBusDetails.bus_id || selectedBusDetails.busId || selectedBusDetails.id;
        
// // //         if (!actualBusId) {
// // //             setError('Bus ID not found in bus details. Please select a valid bus.')
// // //             return
// // //         }

// // //         // Navigate to the bus seats page with the actual bus ID
// // //         navigate(`/bus/${actualBusId}`, {
// // //             state: {
// // //                 busId: actualBusId,
// // //                 bookingDate,
// // //                 bookingTime,
// // //                 route: selectedBusDetails.route,
// // //                 depot: selectedBusDetails.depot,
// // //                 fare: selectedBusDetails.fare_per_passenger,
// // //                 dayOfWeek: selectedBusDetails.day_of_week,
// // //                 busNumber: actualBusId, // Use the same ID for bus number
// // //                 fromSchedule: true
// // //             }
// // //         })
// // //     }

// // //     if (isLoading) return <p className="loading">Loading buses...</p>

// // //     return (
// // //         <div className="schedule-container">
// // //             <h2>🚌 Bus Schedule {seatId ? '- Confirm Booking' : ''}</h2>

// // //             {error && <div className="error-message">{error}</div>}

// // //             <div className="card">
// // //                 {/* Receipt Display */}
// // //                 {bookingConfirmed && bookingReceipt && (
// // //                     <div className="receipt-container" id="receipt-section">
// // //                         <div className="receipt">
// // //                             <div className="receipt-header">
// // //                                 <h3>✅ Booking Confirmed!</h3>
// // //                                 {bookingReceipt.autoBooked && (
// // //                                     <div className="auto-booking-badge">
// // //                                         ⏰ Automatically Booked at Scheduled Time
// // //                                     </div>
// // //                                 )}
// // //                             </div>
// // //                             <div className="receipt-details">
// // //                                 <div className="receipt-row">
// // //                                     <span className="receipt-label">Booking ID:</span>
// // //                                     <span className="receipt-value">{bookingReceipt.bookingId}</span>
// // //                                 </div>
// // //                                 <div className="receipt-row">
// // //                                     <span className="receipt-label">Passenger Name:</span>
// // //                                     <span className="receipt-value">{bookingReceipt.user}</span>
// // //                                 </div>
// // //                                 <div className="receipt-row">
// // //                                     <span className="receipt-label">Bus ID:</span>
// // //                                     <span className="receipt-value">{bookingReceipt.busId}</span>
// // //                                 </div>
// // //                                 <div className="receipt-row">
// // //                                     <span className="receipt-label">Route:</span>
// // //                                     <span className="receipt-value">{bookingReceipt.route}</span>
// // //                                 </div>
// // //                                 <div className="receipt-row">
// // //                                     <span className="receipt-label">Depot:</span>
// // //                                     <span className="receipt-value">{bookingReceipt.depot}</span>
// // //                                 </div>
// // //                                 <div className="receipt-row">
// // //                                     <span className="receipt-label">Seat Number:</span>
// // //                                     <span className="receipt-value">{bookingReceipt.seatNumber}</span>
// // //                                 </div>
// // //                                 <div className="receipt-row">
// // //                                     <span className="receipt-label">Journey Date:</span>
// // //                                     <span className="receipt-value">{bookingReceipt.date}</span>
// // //                                 </div>
// // //                                 <div className="receipt-row">
// // //                                     <span className="receipt-label">Journey Time:</span>
// // //                                     <span className="receipt-value">{bookingReceipt.time}</span>
// // //                                 </div>
// // //                                 <div className="receipt-row">
// // //                                     <span className="receipt-label">Day:</span>
// // //                                     <span className="receipt-value">{bookingReceipt.dayOfWeek}</span>
// // //                                 </div>
// // //                                 <div className="receipt-row fare-row">
// // //                                     <span className="receipt-label">Fare:</span>
// // //                                     <span className="receipt-value">₹{bookingReceipt.fare}</span>
// // //                                 </div>
// // //                                 <div className="receipt-row">
// // //                                     <span className="receipt-label">Booked On:</span>
// // //                                     <span className="receipt-value">{bookingReceipt.bookingTime}</span>
// // //                                 </div>
// // //                             </div>
// // //                             <div className="receipt-actions">
// // //                                 <button 
// // //                                     className="print-btn"
// // //                                     onClick={() => window.print()}
// // //                                 >
// // //                                     🖨️ Print Receipt
// // //                                 </button>
// // //                                 <button 
// // //                                     className="continue-btn"
// // //                                     onClick={() => navigate('/my-bookings')}
// // //                                 >
// // //                                     View My Bookings
// // //                                 </button>
// // //                             </div>
// // //                         </div>
// // //                     </div>
// // //                 )}
// // //                 {/* If coming from seat selection, show confirmation page */}
// // //                 {showConfirmation && seatId && !bookingConfirmed ? (
// // //                     <div>
// // //                         <h3>Complete Your Booking</h3>
// // //                         <div className="booking-summary">
// // //                             <p><b>Seat ID:</b> {seatId}</p>
// // //                             <p><b>Route:</b> {selectedBusDetails?.route || 'N/A'}</p>
// // //                             <p><b>Date:</b> {bookingDate}</p>
// // //                         </div>

// // //                         <div className="form-group">
// // //                             <label>Select Travel Time</label>
// // //                             <input
// // //                                 type="time"
// // //                                 value={bookingTime}
// // //                                 onChange={(e) => {
// // //                                     const newTime = e.target.value
// // //                                     setBookingTime(newTime)
                                    
// // //                                     if (newTime && bookingDate) {
// // //                                         try {
// // //                                             const [y, m, d] = bookingDate.split('-').map(Number)
// // //                                             const [hh, mm] = newTime.split(':').map(Number)
// // //                                             const selectedDateTime = new Date(y, m - 1, d, hh, mm, 0)
                                            
// // //                                             if (selectedDateTime > new Date()) {
// // //                                                 setIsBookingClosed(false)
// // //                                                 setError(null)
// // //                                             } else {
// // //                                                 setIsBookingClosed(true)
// // //                                                 setError('Booking time has passed. Please select a future time.')
// // //                                             }
// // //                                         } catch (err) {
// // //                                             setIsBookingClosed(false)
// // //                                             setError(null)
// // //                                         }
// // //                                     }
// // //                                 }}
// // //                             />
// // //                         </div>

// // //                         <div className="checkbox">
// // //                             <input
// // //                                 type="checkbox"
// // //                                 checked={agreedToTerms}
// // //                                 disabled={isBookingClosed}
// // //                                 onChange={e => setAgreedToTerms(e.target.checked)}
// // //                             />
// // //                             <span>I agree to booking terms</span>
// // //                         </div>

// // //                         <div className="checkbox auto-booking-checkbox">
// // //                             <input
// // //                                 type="checkbox"
// // //                                 checked={autoBookingEnabled}
// // //                                 disabled={isBookingClosed || !agreedToTerms}
// // //                                 onChange={e => setAutoBookingEnabled(e.target.checked)}
// // //                                 id="autoBooking"
// // //                             />
// // //                             <label htmlFor="autoBooking" style={{ margin: 0 }}>
// // //                                 ⏰ Auto-book when scheduled time arrives
// // //                             </label>
// // //                         </div>

// // //                         <div className="form-group">
// // //                             <label>Payment Method</label>
// // //                             <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
// // //                                 <option value="card">Credit/Debit Card</option>
// // //                                 <option value="upi">UPI</option>
// // //                                 <option value="googlepay">Google Pay</option>
// // //                             </select>
// // //                         </div>

// // //                         {paymentMethod === 'upi' && (
// // //                             <div className="form-group">
// // //                                 <label>UPI QR</label>
                                
// // //                                 <img src={Image} alt="UPI QR"  display="block" place-items="center" width="200" height="200"/>

// // //                             </div>
// // //                         )}

// // //                         {paymentMethod === 'googlepay' && (
// // //                             <div className="form-group">
// // //                                 <label>GPay QR</label>
// // //                                 <img src={Image2} alt="UPI QR"  display="block" place-items="center" width="200" height="200"/>

// // //                             </div>
// // //                         )}

// // //                         <div className="button-group">
// // //                             <button
// // //                                 className="cancel-btn"
// // //                                 onClick={() => navigate(-1)}
// // //                                 disabled={bookingLoading}
// // //                             >
// // //                                 Back
// // //                             </button>
// // //                             <button
// // //                                 className="submit-btn"
// // //                                 disabled={
// // //                                     bookingLoading ||
// // //                                     !bookingTime ||
// // //                                     !agreedToTerms
// // //                                 }
// // //                                 onClick={() => {
// // //                                     if (!agreedToTerms) {
// // //                                         setError('Please agree to booking terms')
// // //                                         return
// // //                                     }
// // //                                     if (!autoBookingEnabled) {
// // //                                         confirmBooking()
// // //                                     } else {
// // //                                         setError(null)
// // //                                     }
// // //                                 }}
// // //                             >
// // //                                 {bookingLoading ? 'Processing...' : autoBookingEnabled ? 'Booking Set to Auto' : 'Confirm Booking'}
// // //                             </button>
// // //                         </div>

// // //                         {autoBookingEnabled && bookingTime && (
// // //                             <div className="info-message">
// // //                                 ℹ️ Your booking will be automatically confirmed at {bookingTime}. Keep this page open.
// // //                             </div>
// // //                         )}
// // //                     </div>
// // //                 ) : (
// // //                     // Regular schedule selection flow
// // //                     <>
// // //                         <div className="form-group">
// // //                             <label>Select Bus Route</label>
// // //                             <select value={selectedBusId} onChange={handleBusSelect}>
// // //                                 <option value="">-- Choose a bus --</option>
// // //                                 {buses.map(bus => (
// // //                                     <option key={bus.id} value={bus.id}>
// // //                                         {bus.route} - {bus.bus_id} ({bus.date})
// // //                                     </option>
// // //                                 ))}
// // //                             </select>
// // //                         </div>

// // //                         {selectedBusDetails && (
// // //                             <>
// // //                                 <div className="bus-info">
// // //                                     <p><b>Route:</b> {selectedBusDetails.route}</p>
// // //                                     <p><b>Depot:</b> {selectedBusDetails.depot}</p>
// // //                                     <p><b>Fare:</b> ₹{selectedBusDetails.fare_per_passenger}</p>
// // //                                 </div>

// // //                                 <div className="grid-2">
// // //                                     <div>
// // //                                         <label>Date</label>
// // //                                         <input
// // //                                             type="date"
// // //                                             value={bookingDate}
// // //                                             min={selectedBusDetails.date}
// // //                                             onChange={e => setBookingDate(e.target.value)}
// // //                                         />
// // //                                     </div>

// // //                                     <div>
// // //                                         <label>Time</label>
// // //                                         <input
// // //                                             type="time"
// // //                                             value={bookingTime}
// // //                                             onChange={e => {
// // //                                                 setBookingTime(e.target.value)
// // //                                                 setIsBookingClosed(false)
// // //                                                 setError(null)
// // //                                             }}
// // //                                         />
// // //                                     </div>
// // //                                 </div>

// // //                                 <div className="checkbox">
// // //                                     <input
// // //                                         type="checkbox"
// // //                                         checked={agreedToTerms}
// // //                                         disabled={isBookingClosed}
// // //                                         onChange={e => setAgreedToTerms(e.target.checked)}
// // //                                     />
// // //                                     <span>I agree to booking terms</span>
// // //                                 </div>

// // //                                 <button
// // //                                     className="submit-btn"
// // //                                     disabled={
// // //                                         isBookingClosed ||
// // //                                         !bookingDate ||
// // //                                         !bookingTime ||
// // //                                         !agreedToTerms
// // //                                     }
// // //                                     onClick={proceedToSeats}
// // //                                 >
// // //                                     {isBookingClosed ? 'Booking Closed' : 'Proceed to Seat Selection'}
// // //                                 </button>
// // //                             </>
// // //                         )}
// // //                     </>
// // //                 )}
// // //             </div>

// // //             {/* ================= STYLES ================= */}
// // //             <style>{`
// // //                 body { background:#f4f6f9; }

// // //                 .schedule-container {
// // //                     max-width: 650px;
// // //                     margin: 40px auto;
// // //                     padding: 0 16px;
// // //                     font-family: 'Segoe UI', sans-serif;
// // //                 }

// // //                 h2, h3 { text-align:center; margin-bottom:20px; }
// // //                 h3 { font-size: 20px; }

// // //                 .card {
// // //                     background:white;
// // //                     padding:24px;
// // //                     border-radius:12px;
// // //                     box-shadow:0 10px 25px rgba(0,0,0,0.08);
// // //                 }

// // //                 .form-group {
// // //                     display:flex;
// // //                     flex-direction:column;
// // //                     margin-bottom:16px;
// // //                 }

// // //                 label { font-weight:600; margin-bottom:6px; }

// // //                 select, input {
// // //                     padding:10px;
// // //                     border-radius:6px;
// // //                     border:1px solid #ccc;
// // //                 }

// // //                 .bus-info {
// // //                     background:#e3f2fd;
// // //                     padding:12px;
// // //                     border-radius:8px;
// // //                     margin-bottom:12px;
// // //                 }

// // //                 .booking-summary {
// // //                     background:#e8f5e9;
// // //                     padding:12px;
// // //                     border-radius:8px;
// // //                     margin-bottom:16px;
// // //                 }

// // //                 .grid-2 {
// // //                     display:grid;
// // //                     grid-template-columns:1fr 1fr;
// // //                     gap:12px;
// // //                     margin-bottom:12px;
// // //                 }

// // //                 .checkbox {
// // //                     display:flex;
// // //                     align-items:center;
// // //                     gap:8px;
// // //                     margin-bottom:16px;
// // //                 }

// // //                 .auto-booking-checkbox label {
// // //                     cursor: pointer;
// // //                     font-weight: 500;
// // //                 }

// // //                 .button-group {
// // //                     display:flex;
// // //                     gap:12px;
// // //                     margin-bottom:12px;
// // //                 }

// // //                 .submit-btn, .cancel-btn {
// // //                     flex:1;
// // //                     padding:12px;
// // //                     border:none;
// // //                     border-radius:8px;
// // //                     font-size:16px;
// // //                     font-weight:600;
// // //                     cursor:pointer;
// // //                     transition: all 0.3s ease;
// // //                 }

// // //                 .submit-btn {
// // //                     background:#4caf50;
// // //                     color:white;
// // //                 }

// // //                 .cancel-btn {
// // //                     background:#f44336;
// // //                     color:white;
// // //                 }

// // //                 .submit-btn:disabled, .cancel-btn:disabled {
// // //                     background:#ccc;
// // //                     cursor:not-allowed;
// // //                 }

// // //                 .error-message {
// // //                     background:#fdecea;
// // //                     color:#b71c1c;
// // //                     padding:10px;
// // //                     border-radius:6px;
// // //                     margin-bottom:16px;
// // //                     text-align:center;
// // //                 }

// // //                 .info-message {
// // //                     background:#e3f2fd;
// // //                     color:#1976d2;
// // //                     padding:12px;
// // //                     border-radius:6px;
// // //                     margin-top:12px;
// // //                     text-align:center;
// // //                     border-left:4px solid #1976d2;
// // //                 }

// // //                 .receipt-container {
// // //                     display:flex;
// // //                     justify-content:center;
// // //                     align-items:center;
// // //                     padding:20px 0;
// // //                 }

// // //                 .receipt {
// // //                     background:white;
// // //                     border:2px solid #4caf50;
// // //                     border-radius:12px;
// // //                     padding:24px;
// // //                     width:100%;
// // //                     max-width:500px;
// // //                     box-shadow: 0 4px 12px rgba(0,0,0,0.1);
// // //                 }

// // //                 .receipt-header {
// // //                     border-bottom: 2px solid #4caf50;
// // //                     padding-bottom:12px;
// // //                     margin-bottom:16px;
// // //                 }

// // //                 .receipt h3 {
// // //                     color:#2e7d32;
// // //                     margin:0 0 12px 0;
// // //                 }

// // //                 .auto-booking-badge {
// // //                     background:#fff9c4;
// // //                     border-left:4px solid #fbc02d;
// // //                     padding:10px;
// // //                     border-radius:6px;
// // //                     text-align:center;
// // //                     font-weight:600;
// // //                     color:#f57f17;
// // //                     font-size:13px;
// // //                 }

// // //                 .receipt-details {
// // //                     background:#f9f9f9;
// // //                     padding:16px;
// // //                     border-radius:8px;
// // //                     margin-bottom:16px;
// // //                     border-left:4px solid #4caf50;
// // //                 }

// // //                 .receipt-row {
// // //                     display:flex;
// // //                     justify-content:space-between;
// // //                     padding:8px 0;
// // //                     font-size:14px;
// // //                     border-bottom:1px solid #eee;
// // //                 }

// // //                 .receipt-row:last-child {
// // //                     border-bottom:none;
// // //                 }

// // //                 .receipt-row.fare-row {
// // //                     font-weight:600;
// // //                     font-size:16px;
// // //                     background:#e8f5e9;
// // //                     padding:10px 8px;
// // //                     border-radius:4px;
// // //                 }

// // //                 .receipt-label {
// // //                     font-weight:600;
// // //                     color:#333;
// // //                 }

// // //                 .receipt-value {
// // //                     color:#666;
// // //                     text-align:right;
// // //                 }

// // //                 .receipt-actions {
// // //                     display:flex;
// // //                     gap:12px;
// // //                     flex-direction:column;
// // //                 }

// // //                 .print-btn, .continue-btn {
// // //                     padding:12px;
// // //                     border:none;
// // //                     border-radius:8px;
// // //                     font-size:16px;
// // //                     font-weight:600;
// // //                     cursor:pointer;
// // //                     transition: all 0.3s ease;
// // //                 }

// // //                 .print-btn {
// // //                     background:#2196f3;
// // //                     color:white;
// // //                 }

// // //                 .continue-btn {
// // //                     background:#4caf50;
// // //                     color:white;
// // //                 }

// // //                 .print-btn:hover, .continue-btn:hover {
// // //                     opacity:0.9;
// // //                     transform: translateY(-2px);
// // //                     box-shadow: 0 4px 8px rgba(0,0,0,0.2);
// // //                 }

// // //                 @media print {
// // //                     body * { visibility: hidden; }
// // //                     #receipt-section, #receipt-section * { visibility: visible; }
// // //                     #receipt-section { position: absolute; left: 0; top: 0; width: 100%; }
// // //                     .receipt-actions { display: none !important; }
// // //                     .receipt { box-shadow: none; border: 1px solid #ccc; }
// // //                 }
// // //             `}</style>
// // //         </div>
// // //     )
// // // }

// // // export default Schedule


// // // import React, { useState, useEffect } from 'react'
// // // import axios from 'axios'
// // // import { useNavigate, useLocation } from 'react-router-dom'
// // // import Image from './upi.jpg';
// // // import Image2 from './gpay2.jpg';

// // // const Schedule = ({ userId }) => {
// // //     const [buses, setBuses] = useState([])
// // //     const [isLoading, setIsLoading] = useState(true)
// // //     const [error, setError] = useState(null)
// // //     const [bookingLoading, setBookingLoading] = useState(false)
// // //     const [verifying, setVerifying] = useState(false)

// // //     const [selectedBusId, setSelectedBusId] = useState('')
// // //     const [selectedBusDetails, setSelectedBusDetails] = useState(null)
// // //     const [bookingDate, setBookingDate] = useState('')
// // //     const [bookingTime, setBookingTime] = useState('')
// // //     const [agreedToTerms, setAgreedToTerms] = useState(false)
// // //     const [humanVerified, setHumanVerified] = useState(false)

// // //     const [isBookingClosed, setIsBookingClosed] = useState(false)
// // //     const [bookingConfirmed, setBookingConfirmed] = useState(false)
// // //     const [bookingReceipt, setBookingReceipt] = useState(null)
// // //     const [paymentMethod, setPaymentMethod] = useState('card')

// // //     const navigate = useNavigate()
// // //     const location = useLocation()
    
// // //     // Check if coming from seat selection
// // //     const { 
// // //         seatId: incomingSeatId, 
// // //         busId: incomingBusId, 
// // //         bookingDate: incomingDate, 
// // //         bookingTime: incomingTime,
// // //         seatNumber: incomingSeatNumber,
// // //         seatDetails: incomingSeatDetails,
// // //         // Get bus details from seat selection page
// // //         route: incomingRoute,
// // //         depot: incomingDepot,
// // //         fare: incomingFare,
// // //         dayOfWeek: incomingDayOfWeek,
// // //         busNumber: incomingBusNumber
// // //     } = location.state || {}
    
// // //     const [seatId, setSeatId] = useState(incomingSeatId || null)
// // //     const [seatNumber, setSeatNumber] = useState(incomingSeatNumber || null)
// // //     const [busIdFromSeat, setBusIdFromSeat] = useState(incomingBusId || null)
// // //     const [showConfirmation, setShowConfirmation] = useState(!!incomingSeatId)

// // //     // ================= FETCH BUSES =================
// // //     useEffect(() => {
// // //         const fetchBuses = async () => {
// // //             try {
// // //                 const response = await axios.get('/api/buses/')
// // //                 setBuses(response.data)
                
// // //                 // If coming from seat selection, auto-select that bus
// // //                 if (incomingBusId) {
// // //                     setSelectedBusId(String(incomingBusId))
// // //                     const bus = response.data.find(b => b.id === parseInt(incomingBusId))
// // //                     if (bus) {
// // //                         setSelectedBusDetails(bus)
// // //                         setBookingDate(incomingDate || bus.date)
// // //                         setBookingTime(incomingTime || '')
// // //                     } else {
// // //                         // If bus not found in API response, use details from seat selection
// // //                         setSelectedBusDetails({
// // //                             id: incomingBusId,
// // //                             bus_id: incomingBusNumber || incomingBusId,
// // //                             route: incomingRoute || 'N/A',
// // //                             depot: incomingDepot || 'N/A',
// // //                             fare_per_passenger: incomingFare || 'N/A',
// // //                             day_of_week: incomingDayOfWeek || 'N/A',
// // //                             date: incomingDate || ''
// // //                         })
// // //                     }
// // //                 }
// // //             } catch {
// // //                 setError('Failed to load buses')
// // //             } finally {
// // //                 setIsLoading(false)
// // //             }
// // //         }
// // //         fetchBuses()
// // //     }, [])

// // //     useEffect(() => {
// // //         if (incomingSeatId) {
// // //             setSeatId(incomingSeatId)
// // //             setSeatNumber(incomingSeatNumber)
// // //             setBusIdFromSeat(incomingBusId)
// // //             setBookingDate(incomingDate || '')
// // //             setBookingTime(incomingTime || '')
// // //             setShowConfirmation(true)
// // //         }
// // //     }, [incomingSeatId, incomingSeatNumber, incomingBusId, incomingDate, incomingTime])

// // //     // ================= TIME LOCK LOGIC =================
// // //     useEffect(() => {
// // //         if (!bookingDate || !bookingTime) {
// // //             setIsBookingClosed(false)
// // //             return
// // //         }

// // //         try {
// // //             const [y, m, d] = bookingDate.split('-').map(Number)
// // //             const [hh, mm] = bookingTime.split(':').map(Number)
            
// // //             const bookingDateTime = new Date(y, m - 1, d, hh, mm, 0)
            
// // //             if (isNaN(bookingDateTime.getTime())) {
// // //                 return
// // //             }

// // //             const now = new Date()

// // //             if (now >= bookingDateTime) {
// // //                 setIsBookingClosed(true)
// // //                 setError('Booking time has passed. Please select a future time.')
// // //                 return
// // //             }

// // //             setIsBookingClosed(false)

// // //             const interval = setInterval(() => {
// // //                 const currentNow = new Date()
// // //                 if (currentNow >= bookingDateTime) {
// // //                     setIsBookingClosed(true)
// // //                     setError('Booking time has passed. Seat booking is closed.')
// // //                     clearInterval(interval)
// // //                 }
// // //             }, 1000)

// // //             return () => clearInterval(interval)
// // //         } catch (err) {
// // //             setIsBookingClosed(false)
// // //             return
// // //         }
// // //     }, [bookingDate, bookingTime])

// // //     // ================= HELPER: Extract Receipt Data =================
// // //     const buildReceiptFromResponse = (data) => {
// // //         const seatData = data?.seat || {}
// // //         const busData = seatData?.bus || {}
        
// // //         const receipt = {
// // //             bookingId: data?.id || data?.booking_id || 'N/A',
// // //             bookingTime: data?.booking_time ? new Date(data.booking_time).toLocaleString() : new Date().toLocaleString(),
// // //             user: data?.user?.username || data?.user || 'Guest',
// // //             seatNumber: seatNumber || seatData?.seat_number || seatId || 'N/A',
// // //             route: busData?.route || selectedBusDetails?.route || incomingRoute || 'N/A',
// // //             busId: busData?.bus_id || selectedBusDetails?.bus_id || incomingBusNumber || incomingBusId || 'N/A',
// // //             depot: busData?.depot || selectedBusDetails?.depot || incomingDepot || 'N/A',
// // //             date: bookingDate || busData?.date || selectedBusDetails?.date || 'N/A',
// // //             time: bookingTime || data?.travel_time || 'N/A',
// // //             fare: busData?.fare_per_passenger || selectedBusDetails?.fare_per_passenger || incomingFare || 'N/A',
// // //             dayOfWeek: busData?.day_of_week || selectedBusDetails?.day_of_week || incomingDayOfWeek || 'N/A',
// // //             paymentMethod: paymentMethod
// // //         }
// // //         return receipt
// // //     }

// // //     // ================= BUS SELECT =================
// // //     const handleBusSelect = (e) => {
// // //         const busId = e.target.value
// // //         setSelectedBusId(busId)
// // //         setBusIdFromSeat(busId)

// // //         const bus = buses.find(b => b.id === parseInt(busId))
// // //         setSelectedBusDetails(bus || null)

// // //         setBookingDate(bus?.date || '')
// // //         setBookingTime('')
// // //         setIsBookingClosed(false)
// // //         setError(null)
// // //         setAgreedToTerms(false)
// // //         setHumanVerified(false)
// // //     }

// // //     // ================= HUMAN VERIFICATION =================
// // //     const handleHumanVerification = () => {
// // //         if (!humanVerified) {
// // //             setVerifying(true)
// // //             // Simulate verification process
// // //             setTimeout(() => {
// // //                 setHumanVerified(true)
// // //                 setVerifying(false)
// // //             }, 1500)
// // //         }
// // //     }

// // //     // ================= CONFIRM BOOKING =================
// // //     const confirmBooking = async () => {
// // //         if (!seatId) {
// // //             setError('Seat information missing. Please go back and select a seat.')
// // //             return
// // //         }

// // //         if (!bookingTime) {
// // //             setError('Please select a travel time')
// // //             return
// // //         }

// // //         if (!agreedToTerms) {
// // //             setError('Please agree to booking terms')
// // //             return
// // //         }

// // //         if (!paymentMethod) {
// // //             setError('Please select a payment method')
// // //             return
// // //         }

// // //         if (!humanVerified) {
// // //             setError('Please complete human verification')
// // //             return
// // //         }

// // //         try {
// // //             const [y, m, d] = bookingDate.split('-').map(Number)
// // //             const [hh, mm] = bookingTime.split(':').map(Number)
// // //             const selectedDateTime = new Date(y, m - 1, d, hh, mm, 0)
            
// // //             if (selectedDateTime <= new Date()) {
// // //                 setError('Booking time has passed. Please select a future time.')
// // //                 setIsBookingClosed(true)
// // //                 return
// // //             }
// // //         } catch (err) {
// // //             setError('Invalid booking time. Please try again.')
// // //             return
// // //         }

// // //         setBookingLoading(true)

// // //         try {
// // //             const response = await axios.post(
// // //                 '/api/booking/',
// // //                 { 
// // //                     seat: seatId, 
// // //                     travel_time: bookingTime 
// // //                 },
// // //                 { withCredentials: true }
// // //             )

// // //             const receipt = buildReceiptFromResponse(response.data)
// // //             setBookingReceipt(receipt)
// // //             setBookingConfirmed(true)
// // //             setError(null)
// // //         } catch (error) {
// // //             let msg = 'Booking failed. Please try again.'
// // //             const respData = error.response?.data
// // //             if (respData) {
// // //                 msg = respData.error || respData.detail || JSON.stringify(respData)
// // //             } else if (error.message) {
// // //                 msg = error.message
// // //             }

// // //             setError(msg)
// // //             alert(msg)

// // //             if (error.response?.status === 401) {
// // //                 navigate('/login')
// // //             }
// // //         } finally {
// // //             setBookingLoading(false)
// // //         }
// // //     }

// // //     // ================= PROCEED TO SEATS =================
// // //     const proceedToSeats = () => {
// // //         if (!selectedBusId || !bookingDate || !bookingTime || !agreedToTerms) {
// // //             setError('Please complete all fields')
// // //             return
// // //         }

// // //         if (isBookingClosed) {
// // //             setError('Booking is closed for this schedule.')
// // //             return
// // //         }

// // //         if (!selectedBusDetails) {
// // //             setError('Bus details not found. Please select a bus again.')
// // //             return
// // //         }

// // //         // Get the actual bus ID from bus details
// // //         const actualBusId = selectedBusDetails.bus_id || selectedBusDetails.busId || selectedBusDetails.id;
        
// // //         if (!actualBusId) {
// // //             setError('Bus ID not found in bus details. Please select a valid bus.')
// // //             return
// // //         }

// // //         // Navigate to the bus seats page with the actual bus ID
// // //         navigate(`/bus/${actualBusId}`, {
// // //             state: {
// // //                 busId: actualBusId,
// // //                 bookingDate,
// // //                 bookingTime,
// // //                 route: selectedBusDetails.route,
// // //                 depot: selectedBusDetails.depot,
// // //                 fare: selectedBusDetails.fare_per_passenger,
// // //                 dayOfWeek: selectedBusDetails.day_of_week,
// // //                 busNumber: actualBusId,
// // //                 fromSchedule: true
// // //             }
// // //         })
// // //     }

// // //     // Check if confirm booking button should be enabled
// // //     const isConfirmButtonEnabled = () => {
// // //         return bookingTime && agreedToTerms && paymentMethod && humanVerified && !bookingLoading && !isBookingClosed
// // //     }

// // //     // Reset human verification when payment method changes
// // //     useEffect(() => {
// // //         setHumanVerified(false)
// // //         setVerifying(false)
// // //     }, [paymentMethod])

// // //     if (isLoading) return <p className="loading">Loading buses...</p>

// // //     return (
// // //         <div className="schedule-container">
// // //             <h2>🚌 Bus Schedule {seatId ? '- Confirm Booking' : ''}</h2>

// // //             {error && <div className="error-message">{error}</div>}

// // //             <div className="card">
// // //                 {/* Receipt Display - This should be at the top when booking is confirmed */}
// // //                 {bookingConfirmed && bookingReceipt ? (
// // //                     <div className="receipt-container" id="receipt-section">
// // //                         <div className="receipt">
// // //                             <div className="receipt-header">
// // //                                 <div className="receipt-title">
// // //                                     <h3>✅ Booking Confirmed!</h3>
// // //                                     <div className="receipt-subtitle">Thank you for your booking</div>
// // //                                 </div>
// // //                                 <div className="payment-method-badge">
// // //                                     <span className="badge-icon">💳</span>
// // //                                     Paid via {paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'googlepay' ? 'Google Pay' : 'Credit/Debit Card'}
// // //                                 </div>
// // //                             </div>
                            
// // //                             <div className="receipt-body">
// // //                                 <div className="receipt-section">
// // //                                     <h4>Booking Details</h4>
// // //                                     <div className="receipt-grid">
// // //                                         <div className="receipt-item">
// // //                                             <span className="receipt-label">Booking ID:</span>
// // //                                             <span className="receipt-value highlight">{bookingReceipt.bookingId}</span>
// // //                                         </div>
// // //                                         <div className="receipt-item">
// // //                                             <span className="receipt-label">Booking Time:</span>
// // //                                             <span className="receipt-value">{bookingReceipt.bookingTime}</span>
// // //                                         </div>
// // //                                     </div>
// // //                                 </div>

// // //                                 <div className="receipt-section">
// // //                                     <h4>Passenger Details</h4>
// // //                                     <div className="receipt-grid">
// // //                                         <div className="receipt-item">
// // //                                             <span className="receipt-label">Name:</span>
// // //                                             <span className="receipt-value">{bookingReceipt.user}</span>
// // //                                         </div>
// // //                                     </div>
// // //                                 </div>

// // //                                 <div className="receipt-section">
// // //                                     <h4>Journey Details</h4>
// // //                                     <div className="receipt-grid">
// // //                                         <div className="receipt-item">
// // //                                             <span className="receipt-label">Bus ID:</span>
// // //                                             <span className="receipt-value">{bookingReceipt.busId}</span>
// // //                                         </div>
// // //                                         <div className="receipt-item">
// // //                                             <span className="receipt-label">Route:</span>
// // //                                             <span className="receipt-value">{bookingReceipt.route}</span>
// // //                                         </div>
// // //                                         <div className="receipt-item">
// // //                                             <span className="receipt-label">Depot:</span>
// // //                                             <span className="receipt-value">{bookingReceipt.depot}</span>
// // //                                         </div>
// // //                                         <div className="receipt-item">
// // //                                             <span className="receipt-label">Seat Number:</span>
// // //                                             <span className="receipt-value seat-number">{bookingReceipt.seatNumber}</span>
// // //                                         </div>
// // //                                         <div className="receipt-item">
// // //                                             <span className="receipt-label">Date:</span>
// // //                                             <span className="receipt-value">{bookingReceipt.date}</span>
// // //                                         </div>
// // //                                         <div className="receipt-item">
// // //                                             <span className="receipt-label">Time:</span>
// // //                                             <span className="receipt-value">{bookingReceipt.time}</span>
// // //                                         </div>
// // //                                         <div className="receipt-item">
// // //                                             <span className="receipt-label">Day:</span>
// // //                                             <span className="receipt-value">{bookingReceipt.dayOfWeek}</span>
// // //                                         </div>
// // //                                     </div>
// // //                                 </div>

// // //                                 <div className="receipt-section payment-section">
// // //                                     <h4>Payment Details</h4>
// // //                                     <div className="receipt-grid">
// // //                                         <div className="receipt-item">
// // //                                             <span className="receipt-label">Payment Method:</span>
// // //                                             <span className="receipt-value">
// // //                                                 {paymentMethod === 'upi' ? 'UPI Payment' : 
// // //                                                  paymentMethod === 'googlepay' ? 'Google Pay' : 
// // //                                                  'Credit/Debit Card'}
// // //                                             </span>
// // //                                         </div>
// // //                                         <div className="receipt-item fare-item">
// // //                                             <span className="receipt-label">Total Fare:</span>
// // //                                             <span className="receipt-value fare-amount">₹{bookingReceipt.fare}</span>
// // //                                         </div>
// // //                                         <div className="receipt-item status-item">
// // //                                             <span className="receipt-label">Payment Status:</span>
// // //                                             <span className="receipt-value status-paid">✅ Paid</span>
// // //                                         </div>
// // //                                     </div>
// // //                                 </div>
// // //                             </div>

// // //                             <div className="receipt-footer">
// // //                                 <p className="footer-note">
// // //                                     Please keep this receipt for your records. Present it at the boarding point.
// // //                                 </p>
// // //                                 <div className="receipt-actions">
// // //                                     <button 
// // //                                         className="print-btn"
// // //                                         onClick={() => window.print()}
// // //                                     >
// // //                                         🖨️ Print Receipt
// // //                                     </button>
// // //                                     <button 
// // //                                         className="continue-btn"
// // //                                         onClick={() => navigate('/my-bookings')}
// // //                                     >
// // //                                         📋 View My Bookings
// // //                                     </button>
// // //                                 </div>
// // //                             </div>
// // //                         </div>
// // //                     </div>
// // //                 ) : (
// // //                     <>
// // //                         {/* If coming from seat selection, show confirmation page */}
// // //                         {showConfirmation && seatId ? (
// // //                             <div>
// // //                                 <h3>Complete Your Booking</h3>
                                
// // //                                 <div className="booking-summary">
// // //                                     <h4>Booking Summary</h4>
// // //                                     <div className="summary-grid">
// // //                                         <div className="summary-item">
// // //                                             <span className="summary-label">Seat Number:</span>
// // //                                             <span className="summary-value seat-highlight">{seatNumber || seatId}</span>
// // //                                         </div>
// // //                                         <div className="summary-item">
// // //                                             <span className="summary-label">Route:</span>
// // //                                             <span className="summary-value">{selectedBusDetails?.route || incomingRoute || 'N/A'}</span>
// // //                                         </div>
// // //                                         <div className="summary-item">
// // //                                             <span className="summary-label">Bus ID:</span>
// // //                                             <span className="summary-value">{selectedBusDetails?.bus_id || incomingBusNumber || incomingBusId || 'N/A'}</span>
// // //                                         </div>
// // //                                         <div className="summary-item">
// // //                                             <span className="summary-label">Depot:</span>
// // //                                             <span className="summary-value">{selectedBusDetails?.depot || incomingDepot || 'N/A'}</span>
// // //                                         </div>
// // //                                         <div className="summary-item">
// // //                                             <span className="summary-label">Date:</span>
// // //                                             <span className="summary-value">{bookingDate}</span>
// // //                                         </div>
// // //                                         <div className="summary-item">
// // //                                             <span className="summary-label">Day:</span>
// // //                                             <span className="summary-value">{selectedBusDetails?.day_of_week || incomingDayOfWeek || 'N/A'}</span>
// // //                                         </div>
// // //                                         <div className="summary-item fare-item-summary">
// // //                                             <span className="summary-label">Fare:</span>
// // //                                             <span className="summary-value fare-highlight">₹{selectedBusDetails?.fare_per_passenger || incomingFare || 'N/A'}</span>
// // //                                         </div>
// // //                                     </div>
// // //                                 </div>

// // //                                 <div className="form-group">
// // //                                     <label>Select Travel Time <span className="required">*</span></label>
// // //                                     <input
// // //                                         type="time"
// // //                                         value={bookingTime}
// // //                                         onChange={(e) => {
// // //                                             const newTime = e.target.value
// // //                                             setBookingTime(newTime)
                                            
// // //                                             if (newTime && bookingDate) {
// // //                                                 try {
// // //                                                     const [y, m, d] = bookingDate.split('-').map(Number)
// // //                                                     const [hh, mm] = newTime.split(':').map(Number)
// // //                                                     const selectedDateTime = new Date(y, m - 1, d, hh, mm, 0)
                                                    
// // //                                                     if (selectedDateTime > new Date()) {
// // //                                                         setIsBookingClosed(false)
// // //                                                         setError(null)
// // //                                                     } else {
// // //                                                         setIsBookingClosed(true)
// // //                                                         setError('Booking time has passed. Please select a future time.')
// // //                                                     }
// // //                                                 } catch (err) {
// // //                                                     setIsBookingClosed(false)
// // //                                                     setError(null)
// // //                                                 }
// // //                                             }
// // //                                         }}
// // //                                     />
// // //                                 </div>

// // //                                 <div className="form-group">
// // //                                     <label>Select Payment Method <span className="required">*</span></label>
// // //                                     <select 
// // //                                         value={paymentMethod} 
// // //                                         onChange={(e) => setPaymentMethod(e.target.value)}
// // //                                         required
// // //                                     >
// // //                                         <option value="">-- Select Payment Method --</option>
// // //                                         <option value="card">Credit/Debit Card</option>
// // //                                         <option value="upi">UPI</option>
// // //                                         <option value="googlepay">Google Pay</option>
// // //                                     </select>
// // //                                 </div>

// // //                                 {paymentMethod === 'upi' && (
// // //                                     <div className="payment-qr-container">
// // //                                         <h4>Scan UPI QR Code to Pay</h4>
// // //                                         <div className="qr-code">
// // //                                             <img src={Image} alt="UPI QR" width="200" height="200"/>
// // //                                         </div>
// // //                                         <p className="qr-instruction">Scan the QR code using any UPI app to complete payment</p>
// // //                                     </div>
// // //                                 )}

// // //                                 {paymentMethod === 'googlepay' && (
// // //                                     <div className="payment-qr-container">
// // //                                         <h4>Scan Google Pay QR Code</h4>
// // //                                         <div className="qr-code">
// // //                                             <img src={Image2} alt="Google Pay QR" width="200" height="200"/>
// // //                                         </div>
// // //                                         <p className="qr-instruction">Scan the QR code using Google Pay app to complete payment</p>
// // //                                     </div>
// // //                                 )}

// // //                                 <div className="verification-container">
// // //                                     <h4>Human Verification <span className="required">*</span></h4>
// // //                                     <div className="verification-checkbox">
// // //                                         {!humanVerified ? (
// // //                                             <button
// // //                                                 className="verify-btn"
// // //                                                 onClick={handleHumanVerification}
// // //                                                 disabled={verifying}
// // //                                             >
// // //                                                 {verifying ? (
// // //                                                     <>
// // //                                                         <span className="verifying-dots">
// // //                                                             <span className="dot"></span>
// // //                                                             <span className="dot"></span>
// // //                                                             <span className="dot"></span>
// // //                                                         </span>
// // //                                                         Verifying...
// // //                                                     </>
// // //                                                 ) : (
// // //                                                     'Click to Verify You Are Human'
// // //                                                 )}
// // //                                             </button>
// // //                                         ) : (
// // //                                             <div className="verified-badge">
// // //                                                 <span className="verified-icon">✅</span>
// // //                                                 <span className="verified-text">Verified</span>
// // //                                             </div>
// // //                                         )}
// // //                                     </div>
// // //                                 </div>

// // //                                 <div className="terms-container">
// // //                                     <div className="terms-checkbox">
// // //                                         <input
// // //                                             type="checkbox"
// // //                                             id="termsAgreement"
// // //                                             checked={agreedToTerms}
// // //                                             onChange={(e) => setAgreedToTerms(e.target.checked)}
// // //                                         />
// // //                                         <label htmlFor="termsAgreement">
// // //                                             <span className="checkbox-custom"></span>
// // //                                             <span className="checkbox-label">
// // //                                                 I agree to the booking terms and conditions <span className="required">*</span>
// // //                                             </span>
// // //                                         </label>
// // //                                     </div>
// // //                                 </div>

// // //                                 <div className="button-group">
// // //                                     <button
// // //                                         className="cancel-btn"
// // //                                         onClick={() => navigate(-1)}
// // //                                         disabled={bookingLoading}
// // //                                     >
// // //                                         ↩ Back
// // //                                     </button>
// // //                                     <button
// // //                                         className="submit-btn"
// // //                                         disabled={!isConfirmButtonEnabled()}
// // //                                         onClick={confirmBooking}
// // //                                     >
// // //                                         {bookingLoading ? 'Processing...' : '✅ Confirm Booking'}
// // //                                     </button>
// // //                                 </div>

// // //                                 <div className="form-notes">
// // //                                     <p><small><span className="required">*</span> Required fields</small></p>
// // //                                     <p><small>Note: Booking will be confirmed only after payment verification</small></p>
// // //                                 </div>
// // //                             </div>
// // //                         ) : (
// // //                             // Regular schedule selection flow
// // //                             <>
// // //                                 <div className="form-group">
// // //                                     <label>Select Bus Route</label>
// // //                                     <select value={selectedBusId} onChange={handleBusSelect}>
// // //                                         <option value="">-- Choose a bus --</option>
// // //                                         {buses.map(bus => (
// // //                                             <option key={bus.id} value={bus.id}>
// // //                                                 {bus.route} - {bus.bus_id} ({bus.date})
// // //                                             </option>
// // //                                         ))}
// // //                                     </select>
// // //                                 </div>

// // //                                 {selectedBusDetails && (
// // //                                     <>
// // //                                         <div className="bus-info">
// // //                                             <h4>Bus Details</h4>
// // //                                             <div className="bus-details-grid">
// // //                                                 <div className="bus-detail">
// // //                                                     <span className="detail-label">Route:</span>
// // //                                                     <span className="detail-value">{selectedBusDetails.route}</span>
// // //                                                 </div>
// // //                                                 <div className="bus-detail">
// // //                                                     <span className="detail-label">Depot:</span>
// // //                                                     <span className="detail-value">{selectedBusDetails.depot}</span>
// // //                                                 </div>
// // //                                                 <div className="bus-detail">
// // //                                                     <span className="detail-label">Fare:</span>
// // //                                                     <span className="detail-value">₹{selectedBusDetails.fare_per_passenger}</span>
// // //                                                 </div>
// // //                                                 <div className="bus-detail">
// // //                                                     <span className="detail-label">Day:</span>
// // //                                                     <span className="detail-value">{selectedBusDetails.day_of_week}</span>
// // //                                                 </div>
// // //                                             </div>
// // //                                         </div>

// // //                                         <div className="grid-2">
// // //                                             <div className="form-group">
// // //                                                 <label>Date</label>
// // //                                                 <input
// // //                                                     type="date"
// // //                                                     value={bookingDate}
// // //                                                     min={selectedBusDetails.date}
// // //                                                     onChange={e => setBookingDate(e.target.value)}
// // //                                                 />
// // //                                             </div>

// // //                                             <div className="form-group">
// // //                                                 <label>Time</label>
// // //                                                 <input
// // //                                                     type="time"
// // //                                                     value={bookingTime}
// // //                                                     onChange={e => {
// // //                                                         setBookingTime(e.target.value)
// // //                                                         setIsBookingClosed(false)
// // //                                                         setError(null)
// // //                                                     }}
// // //                                                 />
// // //                                             </div>
// // //                                         </div>

// // //                                         <div className="terms-container">
// // //                                             <div className="terms-checkbox">
// // //                                                 <input
// // //                                                     type="checkbox"
// // //                                                     id="scheduleTerms"
// // //                                                     checked={agreedToTerms}
// // //                                                     onChange={(e) => setAgreedToTerms(e.target.checked)}
// // //                                                 />
// // //                                                 <label htmlFor="scheduleTerms">
// // //                                                     <span className="checkbox-custom"></span>
// // //                                                     <span className="checkbox-label">
// // //                                                         I agree to the booking terms and conditions
// // //                                                     </span>
// // //                                                 </label>
// // //                                             </div>
// // //                                         </div>

// // //                                         <button
// // //                                             className="submit-btn"
// // //                                             disabled={
// // //                                                 isBookingClosed ||
// // //                                                 !bookingDate ||
// // //                                                 !bookingTime ||
// // //                                                 !agreedToTerms
// // //                                             }
// // //                                             onClick={proceedToSeats}
// // //                                         >
// // //                                             {isBookingClosed ? '⏰ Booking Closed' : '🎯 Proceed to Seat Selection'}
// // //                                         </button>
// // //                                     </>
// // //                                 )}
// // //                             </>
// // //                         )}
// // //                     </>
// // //                 )}
// // //             </div>

// // //             {/* ================= STYLES ================= */}
// // //             <style>{`
// // //                 body { 
// // //                     background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
// // //                     font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
// // //                 }

// // //                 .schedule-container {
// // //                     max-width: 700px;
// // //                     margin: 30px auto;
// // //                     padding: 0 20px;
// // //                 }

// // //                 h2, h3 { 
// // //                     text-align: center; 
// // //                     margin-bottom: 20px; 
// // //                     color: #2c3e50;
// // //                 }
                
// // //                 h2 {
// // //                     font-size: 28px;
// // //                     background: linear-gradient(45deg, #3498db, #2ecc71);
// // //                     -webkit-background-clip: text;
// // //                     -webkit-text-fill-color: transparent;
// // //                     background-clip: text;
// // //                 }
                
// // //                 h3 { 
// // //                     font-size: 22px;
// // //                     color: #34495e;
// // //                 }
                
// // //                 h4 {
// // //                     color: #2c3e50;
// // //                     margin-bottom: 15px;
// // //                     font-size: 18px;
// // //                 }

// // //                 .card {
// // //                     background: white;
// // //                     padding: 30px;
// // //                     border-radius: 15px;
// // //                     box-shadow: 0 10px 30px rgba(0,0,0,0.1);
// // //                     min-height: 300px;
// // //                     border: 1px solid #e0e0e0;
// // //                 }

// // //                 .form-group {
// // //                     display: flex;
// // //                     flex-direction: column;
// // //                     margin-bottom: 20px;
// // //                 }

// // //                 label { 
// // //                     font-weight: 600; 
// // //                     margin-bottom: 8px;
// // //                     color: #2c3e50;
// // //                     display: flex;
// // //                     align-items: center;
// // //                     gap: 5px;
// // //                 }

// // //                 .required {
// // //                     color: #e74c3c;
// // //                     font-weight: bold;
// // //                 }

// // //                 select, input {
// // //                     padding: 12px;
// // //                     border-radius: 8px;
// // //                     border: 2px solid #ddd;
// // //                     font-size: 15px;
// // //                     transition: border-color 0.3s;
// // //                 }

// // //                 select:focus, input:focus {
// // //                     outline: none;
// // //                     border-color: #3498db;
// // //                     box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
// // //                 }

// // //                 .bus-info {
// // //                     background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
// // //                     padding: 20px;
// // //                     border-radius: 10px;
// // //                     margin-bottom: 20px;
// // //                     border-left: 4px solid #2196f3;
// // //                 }

// // //                 .bus-details-grid {
// // //                     display: grid;
// // //                     grid-template-columns: repeat(2, 1fr);
// // //                     gap: 10px;
// // //                 }

// // //                 .bus-detail {
// // //                     display: flex;
// // //                     justify-content: space-between;
// // //                     padding: 8px 0;
// // //                     border-bottom: 1px solid rgba(33, 150, 243, 0.2);
// // //                 }

// // //                 .bus-detail:last-child {
// // //                     border-bottom: none;
// // //                 }

// // //                 .detail-label {
// // //                     font-weight: 600;
// // //                     color: #1565c0;
// // //                 }

// // //                 .detail-value {
// // //                     color: #0d47a1;
// // //                     font-weight: 500;
// // //                 }

// // //                 .booking-summary {
// // //                     background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
// // //                     padding: 20px;
// // //                     border-radius: 10px;
// // //                     margin-bottom: 25px;
// // //                     border-left: 4px solid #4caf50;
// // //                 }

// // //                 .summary-grid {
// // //                     display: grid;
// // //                     grid-template-columns: repeat(2, 1fr);
// // //                     gap: 15px;
// // //                 }

// // //                 .summary-item {
// // //                     display: flex;
// // //                     flex-direction: column;
// // //                     gap: 5px;
// // //                 }

// // //                 .summary-label {
// // //                     font-weight: 600;
// // //                     color: #2e7d32;
// // //                     font-size: 13px;
// // //                 }

// // //                 .summary-value {
// // //                     color: #1b5e20;
// // //                     font-weight: 500;
// // //                     font-size: 15px;
// // //                 }

// // //                 .seat-highlight {
// // //                     background: #4caf50;
// // //                     color: white;
// // //                     padding: 4px 12px;
// // //                     border-radius: 20px;
// // //                     font-weight: bold;
// // //                     display: inline-block;
// // //                     width: fit-content;
// // //                 }

// // //                 .fare-highlight {
// // //                     color: #e74c3c;
// // //                     font-weight: bold;
// // //                     font-size: 18px;
// // //                 }

// // //                 .fare-item-summary {
// // //                     grid-column: span 2;
// // //                     background: #f8f9fa;
// // //                     padding: 12px;
// // //                     border-radius: 8px;
// // //                     margin-top: 10px;
// // //                 }

// // //                 .grid-2 {
// // //                     display: grid;
// // //                     grid-template-columns: 1fr 1fr;
// // //                     gap: 15px;
// // //                     margin-bottom: 20px;
// // //                 }

// // //                 /* Custom Checkbox Styles */
// // //                 .terms-container {
// // //                     margin: 20px 0;
// // //                     padding: 15px;
// // //                     background: #f8f9fa;
// // //                     border-radius: 8px;
// // //                     border: 1px solid #e9ecef;
// // //                 }

// // //                 .terms-checkbox {
// // //                     position: relative;
// // //                     margin-bottom: 10px;
// // //                 }

// // //                 .terms-checkbox input[type="checkbox"] {
// // //                     display: none;
// // //                 }

// // //                 .terms-checkbox label {
// // //                     display: flex;
// // //                     align-items: center;
// // //                     cursor: pointer;
// // //                     position: relative;
// // //                     padding-left: 35px;
// // //                     min-height: 24px;
// // //                 }

// // //                 .checkbox-custom {
// // //                     position: absolute;
// // //                     left: 0;
// // //                     top: 0;
// // //                     width: 24px;
// // //                     height: 24px;
// // //                     background: white;
// // //                     border: 2px solid #ddd;
// // //                     border-radius: 6px;
// // //                     transition: all 0.3s;
// // //                 }

// // //                 .terms-checkbox input[type="checkbox"]:checked + label .checkbox-custom {
// // //                     background: #4caf50;
// // //                     border-color: #4caf50;
// // //                 }

// // //                 .terms-checkbox input[type="checkbox"]:checked + label .checkbox-custom::after {
// // //                     content: '✓';
// // //                     position: absolute;
// // //                     color: white;
// // //                     font-size: 16px;
// // //                     font-weight: bold;
// // //                     left: 50%;
// // //                     top: 50%;
// // //                     transform: translate(-50%, -50%);
// // //                 }

// // //                 .checkbox-label {
// // //                     color: #2c3e50;
// // //                     font-weight: 500;
// // //                     line-height: 1.4;
// // //                 }

// // //                 /* Human Verification Styles */
// // //                 .verification-container {
// // //                     margin: 20px 0;
// // //                     padding: 20px;
// // //                     background: linear-gradient(135deg, #fff3e0 0%, #ffecb3 100%);
// // //                     border-radius: 10px;
// // //                     border: 2px solid #ff9800;
// // //                 }

// // //                 .verification-checkbox {
// // //                     display: flex;
// // //                     justify-content: center;
// // //                     align-items: center;
// // //                     min-height: 60px;
// // //                 }

// // //                 .verify-btn {
// // //                     background: linear-gradient(45deg, #ff9800, #f57c00);
// // //                     color: white;
// // //                     border: none;
// // //                     padding: 15px 30px;
// // //                     border-radius: 10px;
// // //                     font-size: 16px;
// // //                     font-weight: 600;
// // //                     cursor: pointer;
// // //                     transition: all 0.3s;
// // //                     display: flex;
// // //                     align-items: center;
// // //                     gap: 10px;
// // //                     min-width: 250px;
// // //                     justify-content: center;
// // //                 }

// // //                 .verify-btn:hover:not(:disabled) {
// // //                     transform: translateY(-3px);
// // //                     box-shadow: 0 8px 20px rgba(255, 152, 0, 0.3);
// // //                 }

// // //                 .verify-btn:disabled {
// // //                     opacity: 0.7;
// // //                     cursor: not-allowed;
// // //                 }

// // //                 .verifying-dots {
// // //                     display: inline-flex;
// // //                     align-items: center;
// // //                     gap: 4px;
// // //                 }

// // //                 .dot {
// // //                     width: 8px;
// // //                     height: 8px;
// // //                     background: white;
// // //                     border-radius: 50%;
// // //                     animation: pulse 1.5s infinite ease-in-out;
// // //                 }

// // //                 .dot:nth-child(2) {
// // //                     animation-delay: 0.2s;
// // //                 }

// // //                 .dot:nth-child(3) {
// // //                     animation-delay: 0.4s;
// // //                 }

// // //                 @keyframes pulse {
// // //                     0%, 100% {
// // //                         transform: scale(1);
// // //                         opacity: 0.7;
// // //                     }
// // //                     50% {
// // //                         transform: scale(1.3);
// // //                         opacity: 1;
// // //                     }
// // //                 }

// // //                 .verified-badge {
// // //                     display: flex;
// // //                     align-items: center;
// // //                     gap: 10px;
// // //                     background: linear-gradient(45deg, #4caf50, #2e7d32);
// // //                     color: white;
// // //                     padding: 12px 25px;
// // //                     border-radius: 10px;
// // //                     font-weight: 600;
// // //                     font-size: 16px;
// // //                     animation: verifiedAppear 0.5s ease;
// // //                 }

// // //                 .verified-icon {
// // //                     font-size: 20px;
// // //                 }

// // //                 .verified-text {
// // //                     font-size: 16px;
// // //                 }

// // //                 @keyframes verifiedAppear {
// // //                     from {
// // //                         opacity: 0;
// // //                         transform: scale(0.9);
// // //                     }
// // //                     to {
// // //                         opacity: 1;
// // //                         transform: scale(1);
// // //                     }
// // //                 }

// // //                 .button-group {
// // //                     display: flex;
// // //                     gap: 15px;
// // //                     margin: 25px 0 15px;
// // //                 }

// // //                 .submit-btn, .cancel-btn {
// // //                     flex: 1;
// // //                     padding: 14px;
// // //                     border: none;
// // //                     border-radius: 10px;
// // //                     font-size: 16px;
// // //                     font-weight: 600;
// // //                     cursor: pointer;
// // //                     transition: all 0.3s ease;
// // //                     display: flex;
// // //                     align-items: center;
// // //                     justify-content: center;
// // //                     gap: 8px;
// // //                 }

// // //                 .submit-btn {
// // //                     background: linear-gradient(45deg, #2ecc71, #27ae60);
// // //                     color: white;
// // //                 }

// // //                 .cancel-btn {
// // //                     background: linear-gradient(45deg, #e74c3c, #c0392b);
// // //                     color: white;
// // //                 }

// // //                 .submit-btn:disabled, .cancel-btn:disabled {
// // //                     background: #bdc3c7;
// // //                     cursor: not-allowed;
// // //                     transform: none !important;
// // //                     box-shadow: none !important;
// // //                 }

// // //                 .submit-btn:hover:not(:disabled) {
// // //                     transform: translateY(-3px);
// // //                     box-shadow: 0 6px 15px rgba(46, 204, 113, 0.4);
// // //                 }

// // //                 .cancel-btn:hover:not(:disabled) {
// // //                     transform: translateY(-3px);
// // //                     box-shadow: 0 6px 15px rgba(231, 76, 60, 0.4);
// // //                 }

// // //                 .error-message {
// // //                     background: linear-gradient(45deg, #ffcdd2, #ef9a9a);
// // //                     color: #c62828;
// // //                     padding: 15px;
// // //                     border-radius: 8px;
// // //                     margin-bottom: 20px;
// // //                     text-align: center;
// // //                     border-left: 4px solid #c62828;
// // //                     font-weight: 500;
// // //                 }

// // //                 .form-notes {
// // //                     margin-top: 20px;
// // //                     padding: 12px;
// // //                     background: #f1f8e9;
// // //                     border-radius: 8px;
// // //                     font-size: 13px;
// // //                     color: #689f38;
// // //                     border-left: 4px solid #8bc34a;
// // //                 }

// // //                 .payment-qr-container {
// // //                     text-align: center;
// // //                     padding: 25px;
// // //                     margin: 25px 0;
// // //                     background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
// // //                     border-radius: 12px;
// // //                     border: 2px solid #7b1fa2;
// // //                 }

// // //                 .payment-qr-container h4 {
// // //                     color: #7b1fa2;
// // //                     margin-bottom: 20px;
// // //                 }

// // //                 .qr-code {
// // //                     display: flex;
// // //                     justify-content: center;
// // //                     align-items: center;
// // //                     margin-bottom: 20px;
// // //                     padding: 15px;
// // //                     background: white;
// // //                     border-radius: 10px;
// // //                     border: 2px dashed #9c27b0;
// // //                 }

// // //                 .qr-instruction {
// // //                     font-size: 14px;
// // //                     color: #6a1b9a;
// // //                     margin-top: 10px;
// // //                     font-weight: 500;
// // //                 }

// // //                 /* Receipt Styles */
// // //                 .receipt-container {
// // //                     width: 100%;
// // //                     display: flex;
// // //                     justify-content: center;
// // //                     align-items: center;
// // //                     padding: 20px 0;
// // //                 }

// // //                 .receipt {
// // //                     background: white;
// // //                     border: 2px solid #4caf50;
// // //                     border-radius: 15px;
// // //                     padding: 30px;
// // //                     width: 100%;
// // //                     max-width: 550px;
// // //                     box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
// // //                     animation: fadeIn 0.5s ease;
// // //                 }

// // //                 @keyframes fadeIn {
// // //                     from { opacity: 0; transform: translateY(30px); }
// // //                     to { opacity: 1; transform: translateY(0); }
// // //                 }

// // //                 .receipt-header {
// // //                     text-align: center;
// // //                     padding-bottom: 20px;
// // //                     margin-bottom: 25px;
// // //                     border-bottom: 3px dashed #4caf50;
// // //                 }

// // //                 .receipt-title h3 {
// // //                     margin: 0;
// // //                     color: #2e7d32;
// // //                     font-size: 26px;
// // //                 }

// // //                 .receipt-subtitle {
// // //                     color: #666;
// // //                     margin-top: 5px;
// // //                     font-size: 14px;
// // //                 }

// // //                 .payment-method-badge {
// // //                     display: inline-flex;
// // //                     align-items: center;
// // //                     gap: 8px;
// // //                     background: linear-gradient(45deg, #2196f3, #1976d2);
// // //                     color: white;
// // //                     padding: 10px 20px;
// // //                     border-radius: 25px;
// // //                     font-weight: 600;
// // //                     font-size: 14px;
// // //                     margin-top: 15px;
// // //                 }

// // //                 .badge-icon {
// // //                     font-size: 16px;
// // //                 }

// // //                 .receipt-body {
// // //                     margin-bottom: 25px;
// // //                 }

// // //                 .receipt-section {
// // //                     margin-bottom: 25px;
// // //                     padding-bottom: 20px;
// // //                     border-bottom: 1px solid #eee;
// // //                 }

// // //                 .receipt-section:last-child {
// // //                     border-bottom: none;
// // //                 }

// // //                 .receipt-section h4 {
// // //                     color: #3498db;
// // //                     margin-bottom: 15px;
// // //                     font-size: 16px;
// // //                     text-transform: uppercase;
// // //                     letter-spacing: 1px;
// // //                 }

// // //                 .receipt-grid {
// // //                     display: grid;
// // //                     grid-template-columns: repeat(2, 1fr);
// // //                     gap: 12px;
// // //                 }

// // //                 .receipt-item {
// // //                     display: flex;
// // //                     justify-content: space-between;
// // //                     align-items: center;
// // //                     padding: 8px 0;
// // //                 }

// // //                 .receipt-label {
// // //                     font-weight: 600;
// // //                     color: #555;
// // //                     font-size: 14px;
// // //                 }

// // //                 .receipt-value {
// // //                     color: #333;
// // //                     text-align: right;
// // //                     font-size: 14px;
// // //                 }

// // //                 .highlight {
// // //                     color: #e74c3c;
// // //                     font-weight: bold;
// // //                     font-size: 15px;
// // //                 }

// // //                 .seat-number {
// // //                     background: #e8f5e9;
// // //                     padding: 4px 12px;
// // //                     border-radius: 20px;
// // //                     font-weight: bold;
// // //                     color: #2e7d32;
// // //                 }

// // //                 .fare-item {
// // //                     background: #f8f9fa;
// // //                     padding: 12px;
// // //                     border-radius: 8px;
// // //                     margin-top: 10px;
// // //                 }

// // //                 .fare-amount {
// // //                     font-size: 20px;
// // //                     font-weight: bold;
// // //                     color: #e74c3c;
// // //                 }

// // //                 .status-item {
// // //                     background: #e8f5e9;
// // //                     padding: 8px 12px;
// // //                     border-radius: 8px;
// // //                 }

// // //                 .status-paid {
// // //                     color: #2e7d32;
// // //                     font-weight: bold;
// // //                 }

// // //                 .payment-section {
// // //                     background: #f8f9fa;
// // //                     padding: 20px;
// // //                     border-radius: 10px;
// // //                     border: 1px solid #e0e0e0;
// // //                 }

// // //                 .receipt-footer {
// // //                     text-align: center;
// // //                     padding-top: 20px;
// // //                     border-top: 2px dashed #ddd;
// // //                 }

// // //                 .footer-note {
// // //                     color: #666;
// // //                     font-size: 13px;
// // //                     margin-bottom: 20px;
// // //                     font-style: italic;
// // //                 }

// // //                 .receipt-actions {
// // //                     display: flex;
// // //                     gap: 15px;
// // //                 }

// // //                 .print-btn, .continue-btn {
// // //                     flex: 1;
// // //                     padding: 14px;
// // //                     border: none;
// // //                     border-radius: 10px;
// // //                     font-size: 16px;
// // //                     font-weight: 600;
// // //                     cursor: pointer;
// // //                     transition: all 0.3s ease;
// // //                     display: flex;
// // //                     align-items: center;
// // //                     justify-content: center;
// // //                     gap: 8px;
// // //                 }

// // //                 .print-btn {
// // //                     background: linear-gradient(45deg, #2196f3, #1976d2);
// // //                     color: white;
// // //                 }

// // //                 .continue-btn {
// // //                     background: linear-gradient(45deg, #4caf50, #2e7d32);
// // //                     color: white;
// // //                 }

// // //                 .print-btn:hover, .continue-btn:hover {
// // //                     transform: translateY(-3px);
// // //                     box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
// // //                 }

// // //                 .loading {
// // //                     text-align: center;
// // //                     font-size: 18px;
// // //                     color: #666;
// // //                     margin-top: 40px;
// // //                 }

// // //                 @media print {
// // //                     body * { 
// // //                         visibility: hidden; 
// // //                         background: white !important;
// // //                     }
// // //                     .schedule-container, .schedule-container * { 
// // //                         visibility: visible; 
// // //                         background: white !important;
// // //                         color: black !important;
// // //                         box-shadow: none !important;
// // //                     }
// // //                     .schedule-container { 
// // //                         position: absolute; 
// // //                         left: 0; 
// // //                         top: 0; 
// // //                         width: 100%;
// // //                         margin: 0;
// // //                         padding: 0;
// // //                     }
// // //                     .receipt-actions, 
// // //                     .receipt-footer .footer-note,
// // //                     .receipt-header .payment-method-badge { 
// // //                         display: none !important; 
// // //                     }
// // //                     .receipt { 
// // //                         box-shadow: none !important; 
// // //                         border: 2px solid #000 !important;
// // //                         max-width: 100% !important;
// // //                         margin: 0 !important;
// // //                         padding: 20px !important;
// // //                     }
// // //                     .card {
// // //                         box-shadow: none !important;
// // //                         padding: 0 !important;
// // //                         border: none !important;
// // //                     }
// // //                     .receipt-title h3 {
// // //                         color: black !important;
// // //                     }
// // //                     .seat-number {
// // //                         background: none !important;
// // //                         border: 1px solid #000 !important;
// // //                     }
// // //                 }

// // //                 @media (max-width: 768px) {
// // //                     .schedule-container {
// // //                         max-width: 95%;
// // //                         margin: 20px auto;
// // //                         padding: 0 15px;
// // //                     }
                    
// // //                     .grid-2,
// // //                     .bus-details-grid,
// // //                     .summary-grid,
// // //                     .receipt-grid {
// // //                         grid-template-columns: 1fr;
// // //                     }
                    
// // //                     .receipt {
// // //                         padding: 20px;
// // //                     }
                    
// // //                     .receipt-item {
// // //                         flex-direction: column;
// // //                         align-items: flex-start;
// // //                         gap: 5px;
// // //                     }
                    
// // //                     .receipt-value {
// // //                         text-align: left;
// // //                     }
                    
// // //                     .payment-qr-container {
// // //                         padding: 20px;
// // //                     }
                    
// // //                     .qr-code img {
// // //                         width: 180px;
// // //                         height: 180px;
// // //                     }
                    
// // //                     .button-group,
// // //                     .receipt-actions {
// // //                         flex-direction: column;
// // //                     }
                    
// // //                     .verify-btn {
// // //                         min-width: 200px;
// // //                         padding: 12px 20px;
// // //                         font-size: 15px;
// // //                     }
// // //                 }
// // //             `}</style>
// // //         </div>
// // //     )
// // // }

// // // export default Schedule



// // import React, { useState, useEffect } from 'react'
// // import axios from 'axios'
// // import { useNavigate, useLocation } from 'react-router-dom'
// // import Image from './upi.jpg';
// // import Image2 from './gpay2.jpg';

// // const Schedule = ({ userId }) => {
// //     const [buses, setBuses] = useState([])
// //     const [isLoading, setIsLoading] = useState(true)
// //     const [error, setError] = useState(null)
// //     const [bookingLoading, setBookingLoading] = useState(false)
// //     const [verifying, setVerifying] = useState(false)

// //     const [selectedBusId, setSelectedBusId] = useState('')
// //     const [selectedBusDetails, setSelectedBusDetails] = useState(null)
// //     const [bookingDate, setBookingDate] = useState('')
// //     const [bookingTime, setBookingTime] = useState('')
// //     const [agreedToTerms, setAgreedToTerms] = useState(false)
// //     const [humanVerified, setHumanVerified] = useState(false)

// //     const [isBookingClosed, setIsBookingClosed] = useState(false)
// //     const [bookingConfirmed, setBookingConfirmed] = useState(false)
// //     const [bookingReceipt, setBookingReceipt] = useState(null)
// //     const [paymentMethod, setPaymentMethod] = useState('card')

// //     const navigate = useNavigate()
// //     const location = useLocation()
    
// //     // Check if coming from seat selection with all details
// //     const { 
// //         seatId: incomingSeatId, 
// //         busId: incomingBusId, 
// //         bookingDate: incomingDate, 
// //         bookingTime: incomingTime,
// //         seatNumber: incomingSeatNumber,
// //         // Bus details from seats page
// //         route: incomingRoute,
// //         depot: incomingDepot,
// //         fare: incomingFare,
// //         dayOfWeek: incomingDayOfWeek,
// //         busNumber: incomingBusNumber,
// //         // Additional bus details
// //         busType: incomingBusType,
// //         departureTime: incomingDepartureTime,
// //         arrivalTime: incomingArrivalTime
// //     } = location.state || {}
    
// //     const [seatId, setSeatId] = useState(incomingSeatId || null)
// //     const [seatNumber, setSeatNumber] = useState(incomingSeatNumber || null)
// //     const [busIdFromSeat, setBusIdFromSeat] = useState(incomingBusId || null)
// //     const [showConfirmation, setShowConfirmation] = useState(!!incomingSeatId)

// //     // ================= FETCH BUSES =================
// //     useEffect(() => {
// //         const fetchBuses = async () => {
// //             try {
// //                 const response = await axios.get('/api/buses/')
// //                 setBuses(response.data)
                
// //                 // If coming from seat selection, auto-select that bus
// //                 if (incomingBusId) {
// //                     setSelectedBusId(String(incomingBusId))
// //                     const bus = response.data.find(b => b.id === parseInt(incomingBusId))
// //                     if (bus) {
// //                         setSelectedBusDetails(bus)
// //                         setBookingDate(incomingDate || bus.date)
// //                         setBookingTime(incomingTime || '')
// //                     } else {
// //                         // If bus not found in API response, create bus details from seat selection data
// //                         setSelectedBusDetails({
// //                             id: incomingBusId,
// //                             bus_id: incomingBusNumber || incomingBusId,
// //                             route: incomingRoute || 'N/A',
// //                             depot: incomingDepot || 'N/A',
// //                             fare_per_passenger: incomingFare || 'N/A',
// //                             day_of_week: incomingDayOfWeek || 'N/A',
// //                             date: incomingDate || '',
// //                             bus_type: incomingBusType || 'Standard',
// //                             departure_time: incomingDepartureTime || 'N/A',
// //                             arrival_time: incomingArrivalTime || 'N/A'
// //                         })
// //                     }
// //                 }
// //             } catch {
// //                 setError('Failed to load buses')
// //             } finally {
// //                 setIsLoading(false)
// //             }
// //         }
// //         fetchBuses()
// //     }, [])

// //     useEffect(() => {
// //         if (incomingSeatId) {
// //             setSeatId(incomingSeatId)
// //             setSeatNumber(incomingSeatNumber)
// //             setBusIdFromSeat(incomingBusId)
// //             setBookingDate(incomingDate || '')
// //             setBookingTime(incomingTime || '')
// //             setShowConfirmation(true)
// //         }
// //     }, [incomingSeatId, incomingSeatNumber, incomingBusId, incomingDate, incomingTime])

// //     // ================= TIME LOCK LOGIC =================
// //     useEffect(() => {
// //         if (!bookingDate || !bookingTime) {
// //             setIsBookingClosed(false)
// //             return
// //         }

// //         try {
// //             const [y, m, d] = bookingDate.split('-').map(Number)
// //             const [hh, mm] = bookingTime.split(':').map(Number)
            
// //             const bookingDateTime = new Date(y, m - 1, d, hh, mm, 0)
            
// //             if (isNaN(bookingDateTime.getTime())) {
// //                 return
// //             }

// //             const now = new Date()

// //             if (now >= bookingDateTime) {
// //                 setIsBookingClosed(true)
// //                 setError('Booking time has passed. Please select a future time.')
// //                 return
// //             }

// //             setIsBookingClosed(false)

// //             const interval = setInterval(() => {
// //                 const currentNow = new Date()
// //                 if (currentNow >= bookingDateTime) {
// //                     setIsBookingClosed(true)
// //                     setError('Booking time has passed. Seat booking is closed.')
// //                     clearInterval(interval)
// //                 }
// //             }, 1000)

// //             return () => clearInterval(interval)
// //         } catch (err) {
// //             setIsBookingClosed(false)
// //             return
// //         }
// //     }, [bookingDate, bookingTime])

// //     // ================= HELPER: Extract Receipt Data =================
// //     const buildReceiptFromResponse = (data) => {
// //         const seatData = data?.seat || {}
// //         const busData = seatData?.bus || {}
        
// //         // Use seat selection data first, then API data, then selected bus details
// //         const receipt = {
// //             bookingId: data?.id || data?.booking_id || 'N/A',
// //             bookingTime: data?.booking_time ? new Date(data.booking_time).toLocaleString() : new Date().toLocaleString(),
// //             user: data?.user?.username || data?.user || 'Guest',
// //             seatNumber: seatNumber || seatData?.seat_number || seatId || 'N/A',
// //             route: incomingRoute || busData?.route || selectedBusDetails?.route || 'N/A',
// //             busId: incomingBusNumber || busData?.bus_id || selectedBusDetails?.bus_id || incomingBusId || 'N/A',
// //             depot: incomingDepot || busData?.depot || selectedBusDetails?.depot || 'N/A',
// //             date: bookingDate || busData?.date || selectedBusDetails?.date || 'N/A',
// //             time: bookingTime || data?.travel_time || incomingTime || 'N/A',
// //             fare: incomingFare || busData?.fare_per_passenger || selectedBusDetails?.fare_per_passenger || 'N/A',
// //             dayOfWeek: incomingDayOfWeek || busData?.day_of_week || selectedBusDetails?.day_of_week || 'N/A',
// //             busType: incomingBusType || busData?.bus_type || selectedBusDetails?.bus_type || 'Standard',
// //             departureTime: incomingDepartureTime || busData?.departure_time || selectedBusDetails?.departure_time || 'N/A',
// //             arrivalTime: incomingArrivalTime || busData?.arrival_time || selectedBusDetails?.arrival_time || 'N/A',
// //             paymentMethod: paymentMethod
// //         }
// //         return receipt
// //     }

// //     // ================= BUS SELECT =================
// //     const handleBusSelect = (e) => {
// //         const busId = e.target.value
// //         setSelectedBusId(busId)
// //         setBusIdFromSeat(busId)

// //         const bus = buses.find(b => b.id === parseInt(busId))
// //         setSelectedBusDetails(bus || null)

// //         setBookingDate(bus?.date || '')
// //         setBookingTime('')
// //         setIsBookingClosed(false)
// //         setError(null)
// //         setAgreedToTerms(false)
// //         setHumanVerified(false)
// //     }

// //     // ================= HUMAN VERIFICATION =================
// //     const handleHumanVerification = () => {
// //         if (!humanVerified) {
// //             setVerifying(true)
// //             // Simulate verification process
// //             setTimeout(() => {
// //                 setHumanVerified(true)
// //                 setVerifying(false)
// //             }, 1500)
// //         }
// //     }

// //     // ================= CONFIRM BOOKING =================
// //     const confirmBooking = async () => {
// //         if (!seatId) {
// //             setError('Seat information missing. Please go back and select a seat.')
// //             return
// //         }

// //         if (!bookingTime) {
// //             setError('Please select a travel time')
// //             return
// //         }

// //         if (!agreedToTerms) {
// //             setError('Please agree to booking terms')
// //             return
// //         }

// //         if (!paymentMethod) {
// //             setError('Please select a payment method')
// //             return
// //         }

// //         if (!humanVerified) {
// //             setError('Please complete human verification')
// //             return
// //         }

// //         try {
// //             const [y, m, d] = bookingDate.split('-').map(Number)
// //             const [hh, mm] = bookingTime.split(':').map(Number)
// //             const selectedDateTime = new Date(y, m - 1, d, hh, mm, 0)
            
// //             if (selectedDateTime <= new Date()) {
// //                 setError('Booking time has passed. Please select a future time.')
// //                 setIsBookingClosed(true)
// //                 return
// //             }
// //         } catch (err) {
// //             setError('Invalid booking time. Please try again.')
// //             return
// //         }

// //         setBookingLoading(true)

// //         try {
// //             const response = await axios.post(
// //                 '/api/booking/',
// //                 { 
// //                     seat: seatId, 
// //                     travel_time: bookingTime 
// //                 },
// //                 { withCredentials: true }
// //             )

// //             const receipt = buildReceiptFromResponse(response.data)
// //             setBookingReceipt(receipt)
// //             setBookingConfirmed(true)
// //             setError(null)
// //         } catch (error) {
// //             let msg = 'Booking failed. Please try again.'
// //             const respData = error.response?.data
// //             if (respData) {
// //                 msg = respData.error || respData.detail || JSON.stringify(respData)
// //             } else if (error.message) {
// //                 msg = error.message
// //             }

// //             setError(msg)
// //             alert(msg)

// //             if (error.response?.status === 401) {
// //                 navigate('/login')
// //             }
// //         } finally {
// //             setBookingLoading(false)
// //         }
// //     }

// //     // ================= PROCEED TO SEATS =================
// //     const proceedToSeats = () => {
// //         if (!selectedBusId || !bookingDate || !bookingTime || !agreedToTerms) {
// //             setError('Please complete all fields')
// //             return
// //         }

// //         if (isBookingClosed) {
// //             setError('Booking is closed for this schedule.')
// //             return
// //         }

// //         if (!selectedBusDetails) {
// //             setError('Bus details not found. Please select a bus again.')
// //             return
// //         }

// //         // Get the actual bus ID from bus details
// //         const actualBusId = selectedBusDetails.bus_id || selectedBusDetails.busId || selectedBusDetails.id;
        
// //         if (!actualBusId) {
// //             setError('Bus ID not found in bus details. Please select a valid bus.')
// //             return
// //         }

// //         // Navigate to the bus seats page with all bus details
// //         navigate(`/bus/${actualBusId}`, {
// //             state: {
// //                 busId: actualBusId,
// //                 bookingDate,
// //                 bookingTime,
// //                 route: selectedBusDetails.route,
// //                 depot: selectedBusDetails.depot,
// //                 fare: selectedBusDetails.fare_per_passenger,
// //                 dayOfWeek: selectedBusDetails.day_of_week,
// //                 busNumber: actualBusId,
// //                 busType: selectedBusDetails.bus_type,
// //                 departureTime: selectedBusDetails.departure_time,
// //                 arrivalTime: selectedBusDetails.arrival_time,
// //                 fromSchedule: true
// //             }
// //         })
// //     }

// //     // Check if confirm booking button should be enabled
// //     const isConfirmButtonEnabled = () => {
// //         return bookingTime && agreedToTerms && paymentMethod && humanVerified && !bookingLoading && !isBookingClosed
// //     }

// //     // Reset human verification when payment method changes
// //     useEffect(() => {
// //         setHumanVerified(false)
// //         setVerifying(false)
// //     }, [paymentMethod])

// //     if (isLoading) return <p className="loading">Loading buses...</p>

// //     return (
// //         <div className="schedule-container">
// //             <h2>🚌 Bus Schedule {seatId ? '- Confirm Booking' : ''}</h2>

// //             {error && <div className="error-message">{error}</div>}

// //             <div className="card">
// //                 {/* Receipt Display - This should be at the top when booking is confirmed */}
// //                 {bookingConfirmed && bookingReceipt ? (
// //                     <div className="receipt-container" id="receipt-section">
// //                         <div className="receipt">
// //                             <div className="receipt-header">
// //                                 <div className="receipt-title">
// //                                     <h3>✅ Booking Confirmed!</h3>
// //                                     <div className="receipt-subtitle">Thank you for your booking</div>
// //                                 </div>
// //                                 <div className="payment-method-badge">
// //                                     <span className="badge-icon">💳</span>
// //                                     Paid via {paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'googlepay' ? 'Google Pay' : 'Credit/Debit Card'}
// //                                 </div>
// //                             </div>
                            
// //                             <div className="receipt-body">
// //                                 <div className="receipt-section">
// //                                     <h4>Booking Details</h4>
// //                                     <div className="receipt-grid">
// //                                         <div className="receipt-item">
// //                                             <span className="receipt-label">Booking ID:</span>
// //                                             <span className="receipt-value highlight">{bookingReceipt.bookingId}</span>
// //                                         </div>
// //                                         <div className="receipt-item">
// //                                             <span className="receipt-label">Booking Time:</span>
// //                                             <span className="receipt-value">{bookingReceipt.bookingTime}</span>
// //                                         </div>
// //                                     </div>
// //                                 </div>

// //                                 <div className="receipt-section">
// //                                     <h4>Passenger Details</h4>
// //                                     <div className="receipt-grid">
// //                                         <div className="receipt-item">
// //                                             <span className="receipt-label">Name:</span>
// //                                             <span className="receipt-value">{bookingReceipt.user}</span>
// //                                         </div>
// //                                     </div>
// //                                 </div>

// //                                 <div className="receipt-section">
// //                                     <h4>Journey Details</h4>
// //                                     <div className="receipt-grid">
// //                                         <div className="receipt-item">
// //                                             <span className="receipt-label">Bus ID:</span>
// //                                             <span className="receipt-value">{bookingReceipt.busId}</span>
// //                                         </div>
// //                                         <div className="receipt-item">
// //                                             <span className="receipt-label">Route:</span>
// //                                             <span className="receipt-value">{bookingReceipt.route}</span>
// //                                         </div>
// //                                         <div className="receipt-item">
// //                                             <span className="receipt-label">Depot:</span>
// //                                             <span className="receipt-value">{bookingReceipt.depot}</span>
// //                                         </div>
// //                                         <div className="receipt-item">
// //                                             <span className="receipt-label">Seat Number:</span>
// //                                             <span className="receipt-value seat-number">{bookingReceipt.seatNumber}</span>
// //                                         </div>
// //                                         <div className="receipt-item">
// //                                             <span className="receipt-label">Date:</span>
// //                                             <span className="receipt-value">{bookingReceipt.date}</span>
// //                                         </div>
// //                                         <div className="receipt-item">
// //                                             <span className="receipt-label">Time:</span>
// //                                             <span className="receipt-value">{bookingReceipt.time}</span>
// //                                         </div>
// //                                         <div className="receipt-item">
// //                                             <span className="receipt-label">Day:</span>
// //                                             <span className="receipt-value">{bookingReceipt.dayOfWeek}</span>
// //                                         </div>
// //                                     </div>
// //                                 </div>

// //                                 <div className="receipt-section payment-section">
// //                                     <h4>Payment Details</h4>
// //                                     <div className="receipt-grid">
// //                                         <div className="receipt-item">
// //                                             <span className="receipt-label">Payment Method:</span>
// //                                             <span className="receipt-value">
// //                                                 {paymentMethod === 'upi' ? 'UPI Payment' : 
// //                                                  paymentMethod === 'googlepay' ? 'Google Pay' : 
// //                                                  'Credit/Debit Card'}
// //                                             </span>
// //                                         </div>
// //                                         <div className="receipt-item fare-item">
// //                                             <span className="receipt-label">Total Fare:</span>
// //                                             <span className="receipt-value fare-amount">₹{bookingReceipt.fare}</span>
// //                                         </div>
// //                                         <div className="receipt-item status-item">
// //                                             <span className="receipt-label">Payment Status:</span>
// //                                             <span className="receipt-value status-paid">✅ Paid</span>
// //                                         </div>
// //                                     </div>
// //                                 </div>
// //                             </div>

// //                             <div className="receipt-footer">
// //                                 <p className="footer-note">
// //                                     Please keep this receipt for your records. Present it at the boarding point.
// //                                 </p>
// //                                 <div className="receipt-actions">
// //                                     <button 
// //                                         className="print-btn"
// //                                         onClick={() => window.print()}
// //                                     >
// //                                         🖨️ Print Receipt
// //                                     </button>
// //                                     <button 
// //                                         className="continue-btn"
// //                                         onClick={() => navigate('/my-bookings')}
// //                                     >
// //                                         📋 View My Bookings
// //                                     </button>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 ) : (
// //                     <>
// //                         {/* If coming from seat selection, show confirmation page */}
// //                         {showConfirmation && seatId ? (
// //                             <div>
// //                                 <h3>Complete Your Booking</h3>
                                
// //                                 <div className="booking-summary">
// //                                     <h4>Booking Summary</h4>
// //                                     <div className="summary-grid">
// //                                         {/* Seat Details */}
// //                                         <div className="summary-item seat-details">
// //                                             <span className="summary-label">Selected Seat:</span>
// //                                             <span className="summary-value seat-highlight">{seatNumber || seatId}</span>
// //                                         </div>
                                        
// //                                         {/* Bus Route and ID */}
// //                                         <div className="summary-item">
// //                                             <span className="summary-label">Bus Route:</span>
// //                                             <span className="summary-value route-text">{incomingRoute || selectedBusDetails?.route || 'N/A'}</span>
// //                                         </div>
                                        
// //                                         <div className="summary-item">
// //                                             <span className="summary-label">Bus ID:</span>
// //                                             <span className="summary-value bus-id">{incomingBusNumber || selectedBusDetails?.bus_id || incomingBusId || 'N/A'}</span>
// //                                         </div>
                                        
// //                                         {/* Depot and Bus Type */}
// //                                         <div className="summary-item">
// //                                             <span className="summary-label">Depot:</span>
// //                                             <span className="summary-value">{incomingDepot || selectedBusDetails?.depot || 'N/A'}</span>
// //                                         </div>
                                        
// //                                         <div className="summary-item">
// //                                             <span className="summary-label">Bus Type:</span>
// //                                             <span className="summary-value bus-type">{incomingBusType || selectedBusDetails?.bus_type || 'Standard'}</span>
// //                                         </div>
                                        
// //                                         {/* Schedule Details */}
// //                                         <div className="summary-item">
// //                                             <span className="summary-label">Journey Date:</span>
// //                                             <span className="summary-value">{bookingDate}</span>
// //                                         </div>
                                        
// //                                         <div className="summary-item">
// //                                             <span className="summary-label">Day of Week:</span>
// //                                             <span className="summary-value day-highlight">{incomingDayOfWeek || selectedBusDetails?.day_of_week || 'N/A'}</span>
// //                                         </div>
                                        
// //                                         {/* Time Details */}
// //                                         <div className="summary-item">
// //                                             <span className="summary-label">Departure:</span>
// //                                             <span className="summary-value time-text">{incomingDepartureTime || selectedBusDetails?.departure_time || 'N/A'}</span>
// //                                         </div>
                                        
// //                                         <div className="summary-item">
// //                                             <span className="summary-label">Arrival:</span>
// //                                             <span className="summary-value time-text">{incomingArrivalTime || selectedBusDetails?.arrival_time || 'N/A'}</span>
// //                                         </div>
                                        
// //                                         {/* Fare - Full Width */}
// //                                         <div className="summary-item fare-item-summary">
// //                                             <div className="fare-details">
// //                                                 <span className="summary-label">Total Fare:</span>
// //                                                 <span className="summary-value fare-highlight">₹{incomingFare || selectedBusDetails?.fare_per_passenger || 'N/A'}</span>
// //                                             </div>
// //                                         </div>
// //                                     </div>
// //                                 </div>

// //                                 <div className="form-group">
// //                                     <label>Select Travel Time <span className="required">*</span></label>
// //                                     <input
// //                                         type="time"
// //                                         value={bookingTime}
// //                                         onChange={(e) => {
// //                                             const newTime = e.target.value
// //                                             setBookingTime(newTime)
                                            
// //                                             if (newTime && bookingDate) {
// //                                                 try {
// //                                                     const [y, m, d] = bookingDate.split('-').map(Number)
// //                                                     const [hh, mm] = newTime.split(':').map(Number)
// //                                                     const selectedDateTime = new Date(y, m - 1, d, hh, mm, 0)
                                                    
// //                                                     if (selectedDateTime > new Date()) {
// //                                                         setIsBookingClosed(false)
// //                                                         setError(null)
// //                                                     } else {
// //                                                         setIsBookingClosed(true)
// //                                                         setError('Booking time has passed. Please select a future time.')
// //                                                     }
// //                                                 } catch (err) {
// //                                                     setIsBookingClosed(false)
// //                                                     setError(null)
// //                                                 }
// //                                             }
// //                                         }}
// //                                     />
// //                                 </div>

// //                                 <div className="form-group">
// //                                     <label>Select Payment Method <span className="required">*</span></label>
// //                                     <select 
// //                                         value={paymentMethod} 
// //                                         onChange={(e) => setPaymentMethod(e.target.value)}
// //                                         required
// //                                     >
// //                                         <option value="">-- Select Payment Method --</option>
// //                                         <option value="card">Credit/Debit Card</option>
// //                                         <option value="upi">UPI</option>
// //                                         <option value="googlepay">Google Pay</option>
// //                                     </select>
// //                                 </div>

// //                                 {paymentMethod === 'upi' && (
// //                                     <div className="payment-qr-container">
// //                                         <h4>Scan UPI QR Code to Pay</h4>
// //                                         <div className="qr-code">
// //                                             <img src={Image} alt="UPI QR" width="200" height="200"/>
// //                                         </div>
// //                                         <p className="qr-instruction">Scan the QR code using any UPI app to complete payment</p>
// //                                     </div>
// //                                 )}

// //                                 {paymentMethod === 'googlepay' && (
// //                                     <div className="payment-qr-container">
// //                                         <h4>Scan Google Pay QR Code</h4>
// //                                         <div className="qr-code">
// //                                             <img src={Image2} alt="Google Pay QR" width="200" height="200"/>
// //                                         </div>
// //                                         <p className="qr-instruction">Scan the QR code using Google Pay app to complete payment</p>
// //                                     </div>
// //                                 )}

// //                                 <div className="verification-container">
// //                                     <h4>Human Verification <span className="required">*</span></h4>
// //                                     <div className="verification-checkbox">
// //                                         {!humanVerified ? (
// //                                             <button
// //                                                 className="verify-btn"
// //                                                 onClick={handleHumanVerification}
// //                                                 disabled={verifying}
// //                                             >
// //                                                 {verifying ? (
// //                                                     <>
// //                                                         <span className="verifying-dots">
// //                                                             <span className="dot"></span>
// //                                                             <span className="dot"></span>
// //                                                             <span className="dot"></span>
// //                                                         </span>
// //                                                         Verifying...
// //                                                     </>
// //                                                 ) : (
// //                                                     'Click to Verify You Are Human'
// //                                                 )}
// //                                             </button>
// //                                         ) : (
// //                                             <div className="verified-badge">
// //                                                 <span className="verified-icon">✅</span>
// //                                                 <span className="verified-text">Verified</span>
// //                                             </div>
// //                                         )}
// //                                     </div>
// //                                 </div>

// //                                 <div className="terms-container">
// //                                     <div className="terms-checkbox">
// //                                         <input
// //                                             type="checkbox"
// //                                             id="termsAgreement"
// //                                             checked={agreedToTerms}
// //                                             onChange={(e) => setAgreedToTerms(e.target.checked)}
// //                                         />
// //                                         <label htmlFor="termsAgreement">
// //                                             <span className="checkbox-custom"></span>
// //                                             <span className="checkbox-label">
// //                                                 I agree to the booking terms and conditions <span className="required">*</span>
// //                                             </span>
// //                                         </label>
// //                                     </div>
// //                                 </div>

// //                                 <div className="button-group">
// //                                     <button
// //                                         className="cancel-btn"
// //                                         onClick={() => navigate(-1)}
// //                                         disabled={bookingLoading}
// //                                     >
// //                                         ↩ Back
// //                                     </button>
// //                                     <button
// //                                         className="submit-btn"
// //                                         disabled={!isConfirmButtonEnabled()}
// //                                         onClick={confirmBooking}
// //                                     >
// //                                         {bookingLoading ? 'Processing...' : '✅ Confirm Booking'}
// //                                     </button>
// //                                 </div>

// //                                 <div className="form-notes">
// //                                     <p><small><span className="required">*</span> Required fields</small></p>
// //                                     <p><small>Note: Booking will be confirmed only after payment verification</small></p>
// //                                 </div>
// //                             </div>
// //                         ) : (
// //                             // Regular schedule selection flow
// //                             <>
// //                                 <div className="form-group">
// //                                     <label>Select Bus Route</label>
// //                                     <select value={selectedBusId} onChange={handleBusSelect}>
// //                                         <option value="">-- Choose a bus --</option>
// //                                         {buses.map(bus => (
// //                                             <option key={bus.id} value={bus.id}>
// //                                                 {bus.route} - {bus.bus_id} ({bus.date})
// //                                             </option>
// //                                         ))}
// //                                     </select>
// //                                 </div>

// //                                 {selectedBusDetails && (
// //                                     <>
// //                                         <div className="bus-info">
// //                                             <h4>Bus Details</h4>
// //                                             <div className="bus-details-grid">
// //                                                 <div className="bus-detail">
// //                                                     <span className="detail-label">Route:</span>
// //                                                     <span className="detail-value">{selectedBusDetails.route}</span>
// //                                                 </div>
// //                                                 <div className="bus-detail">
// //                                                     <span className="detail-label">Depot:</span>
// //                                                     <span className="detail-value">{selectedBusDetails.depot}</span>
// //                                                 </div>
// //                                                 <div className="bus-detail">
// //                                                     <span className="detail-label">Fare:</span>
// //                                                     <span className="detail-value">₹{selectedBusDetails.fare_per_passenger}</span>
// //                                                 </div>
// //                                                 <div className="bus-detail">
// //                                                     <span className="detail-label">Day:</span>
// //                                                     <span className="detail-value">{selectedBusDetails.day_of_week}</span>
// //                                                 </div>
// //                                             </div>
// //                                         </div>

// //                                         <div className="grid-2">
// //                                             <div className="form-group">
// //                                                 <label>Date</label>
// //                                                 <input
// //                                                     type="date"
// //                                                     value={bookingDate}
// //                                                     min={selectedBusDetails.date}
// //                                                     onChange={e => setBookingDate(e.target.value)}
// //                                                 />
// //                                             </div>

// //                                             <div className="form-group">
// //                                                 <label>Time</label>
// //                                                 <input
// //                                                     type="time"
// //                                                     value={bookingTime}
// //                                                     onChange={e => {
// //                                                         setBookingTime(e.target.value)
// //                                                         setIsBookingClosed(false)
// //                                                         setError(null)
// //                                                     }}
// //                                                 />
// //                                             </div>
// //                                         </div>

// //                                         <div className="terms-container">
// //                                             <div className="terms-checkbox">
// //                                                 <input
// //                                                     type="checkbox"
// //                                                     id="scheduleTerms"
// //                                                     checked={agreedToTerms}
// //                                                     onChange={(e) => setAgreedToTerms(e.target.checked)}
// //                                                 />
// //                                                 <label htmlFor="scheduleTerms">
// //                                                     <span className="checkbox-custom"></span>
// //                                                     <span className="checkbox-label">
// //                                                         I agree to the booking terms and conditions
// //                                                     </span>
// //                                                 </label>
// //                                             </div>
// //                                         </div>

// //                                         <button
// //                                             className="submit-btn"
// //                                             disabled={
// //                                                 isBookingClosed ||
// //                                                 !bookingDate ||
// //                                                 !bookingTime ||
// //                                                 !agreedToTerms
// //                                             }
// //                                             onClick={proceedToSeats}
// //                                         >
// //                                             {isBookingClosed ? '⏰ Booking Closed' : '🎯 Proceed to Seat Selection'}
// //                                         </button>
// //                                     </>
// //                                 )}
// //                             </>
// //                         )}
// //                     </>
// //                 )}
// //             </div>

// //             {/* ================= STYLES ================= */}
// //             <style>{`
// //                 body { 
// //                     background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
// //                     font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
// //                 }

// //                 .schedule-container {
// //                     max-width: 700px;
// //                     margin: 30px auto;
// //                     padding: 0 20px;
// //                 }

// //                 h2, h3 { 
// //                     text-align: center; 
// //                     margin-bottom: 20px; 
// //                     color: #2c3e50;
// //                 }
                
// //                 h2 {
// //                     font-size: 28px;
// //                     background: linear-gradient(45deg, #3498db, #2ecc71);
// //                     -webkit-background-clip: text;
// //                     -webkit-text-fill-color: transparent;
// //                     background-clip: text;
// //                 }
                
// //                 h3 { 
// //                     font-size: 22px;
// //                     color: #34495e;
// //                 }
                
// //                 h4 {
// //                     color: #2c3e50;
// //                     margin-bottom: 15px;
// //                     font-size: 18px;
// //                 }

// //                 .card {
// //                     background: white;
// //                     padding: 30px;
// //                     border-radius: 15px;
// //                     box-shadow: 0 10px 30px rgba(0,0,0,0.1);
// //                     min-height: 300px;
// //                     border: 1px solid #e0e0e0;
// //                 }

// //                 .form-group {
// //                     display: flex;
// //                     flex-direction: column;
// //                     margin-bottom: 20px;
// //                 }

// //                 label { 
// //                     font-weight: 600; 
// //                     margin-bottom: 8px;
// //                     color: #2c3e50;
// //                     display: flex;
// //                     align-items: center;
// //                     gap: 5px;
// //                 }

// //                 .required {
// //                     color: #e74c3c;
// //                     font-weight: bold;
// //                 }

// //                 select, input {
// //                     padding: 12px;
// //                     border-radius: 8px;
// //                     border: 2px solid #ddd;
// //                     font-size: 15px;
// //                     transition: border-color 0.3s;
// //                 }

// //                 select:focus, input:focus {
// //                     outline: none;
// //                     border-color: #3498db;
// //                     box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
// //                 }

// //                 .bus-info {
// //                     background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
// //                     padding: 20px;
// //                     border-radius: 10px;
// //                     margin-bottom: 20px;
// //                     border-left: 4px solid #2196f3;
// //                 }

// //                 .bus-details-grid {
// //                     display: grid;
// //                     grid-template-columns: repeat(2, 1fr);
// //                     gap: 10px;
// //                 }

// //                 .bus-detail {
// //                     display: flex;
// //                     justify-content: space-between;
// //                     padding: 8px 0;
// //                     border-bottom: 1px solid rgba(33, 150, 243, 0.2);
// //                 }

// //                 .bus-detail:last-child {
// //                     border-bottom: none;
// //                 }

// //                 .detail-label {
// //                     font-weight: 600;
// //                     color: #1565c0;
// //                 }

// //                 .detail-value {
// //                     color: #0d47a1;
// //                     font-weight: 500;
// //                 }

// //                 /* Updated Booking Summary Styles */
// //                 .booking-summary {
// //                     background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
// //                     padding: 20px;
// //                     border-radius: 10px;
// //                     margin-bottom: 25px;
// //                     border-left: 4px solid #4caf50;
// //                 }

// //                 .booking-summary h4 {
// //                     color: #2e7d32;
// //                     margin-bottom: 20px;
// //                     font-size: 20px;
// //                     text-align: center;
// //                 }

// //                 .summary-grid {
// //                     display: grid;
// //                     grid-template-columns: repeat(2, 1fr);
// //                     gap: 15px;
// //                 }

// //                 .summary-item {
// //                     display: flex;
// //                     flex-direction: column;
// //                     gap: 5px;
// //                 }

// //                 .summary-label {
// //                     font-weight: 600;
// //                     color: #2e7d32;
// //                     font-size: 13px;
// //                     text-transform: uppercase;
// //                     letter-spacing: 0.5px;
// //                 }

// //                 .summary-value {
// //                     color: #1b5e20;
// //                     font-weight: 500;
// //                     font-size: 15px;
// //                 }

// //                 /* Special styling for seat details */
// //                 .seat-details {
// //                     grid-column: span 2;
// //                     text-align: center;
// //                     margin-bottom: 10px;
// //                 }

// //                 .seat-highlight {
// //                     background: #4caf50;
// //                     color: white;
// //                     padding: 8px 20px;
// //                     border-radius: 25px;
// //                     font-weight: bold;
// //                     font-size: 18px;
// //                     display: inline-block;
// //                     min-width: 80px;
// //                     text-align: center;
// //                 }

// //                 /* Route and ID styling */
// //                 .route-text {
// //                     font-weight: 600;
// //                     color: #1565c0;
// //                     font-size: 16px;
// //                 }

// //                 .bus-id {
// //                     background: #e3f2fd;
// //                     padding: 4px 10px;
// //                     border-radius: 6px;
// //                     color: #0d47a1;
// //                     font-weight: 600;
// //                 }

// //                 .bus-type {
// //                     background: #fff3e0;
// //                     padding: 4px 10px;
// //                     border-radius: 6px;
// //                     color: #f57c00;
// //                     font-weight: 600;
// //                 }

// //                 .day-highlight {
// //                     background: #f3e5f5;
// //                     padding: 4px 10px;
// //                     border-radius: 6px;
// //                     color: #7b1fa2;
// //                     font-weight: 600;
// //                 }

// //                 .time-text {
// //                     font-weight: 600;
// //                     color: #d84315;
// //                 }

// //                 /* Fare styling */
// //                 .fare-item-summary {
// //                     grid-column: span 2;
// //                     background: #f8f9fa;
// //                     padding: 15px;
// //                     border-radius: 10px;
// //                     margin-top: 10px;
// //                     text-align: center;
// //                 }

// //                 .fare-details {
// //                     display: flex;
// //                     justify-content: space-between;
// //                     align-items: center;
// //                 }

// //                 .fare-highlight {
// //                     color: #e74c3c;
// //                     font-weight: bold;
// //                     font-size: 22px;
// //                 }

// //                 .grid-2 {
// //                     display: grid;
// //                     grid-template-columns: 1fr 1fr;
// //                     gap: 15px;
// //                     margin-bottom: 20px;
// //                 }

// //                 /* Custom Checkbox Styles */
// //                 .terms-container {
// //                     margin: 20px 0;
// //                     padding: 15px;
// //                     background: #f8f9fa;
// //                     border-radius: 8px;
// //                     border: 1px solid #e9ecef;
// //                 }

// //                 .terms-checkbox {
// //                     position: relative;
// //                     margin-bottom: 10px;
// //                 }

// //                 .terms-checkbox input[type="checkbox"] {
// //                     display: none;
// //                 }

// //                 .terms-checkbox label {
// //                     display: flex;
// //                     align-items: center;
// //                     cursor: pointer;
// //                     position: relative;
// //                     padding-left: 35px;
// //                     min-height: 24px;
// //                 }

// //                 .checkbox-custom {
// //                     position: absolute;
// //                     left: 0;
// //                     top: 0;
// //                     width: 24px;
// //                     height: 24px;
// //                     background: white;
// //                     border: 2px solid #ddd;
// //                     border-radius: 6px;
// //                     transition: all 0.3s;
// //                 }

// //                 .terms-checkbox input[type="checkbox"]:checked + label .checkbox-custom {
// //                     background: #4caf50;
// //                     border-color: #4caf50;
// //                 }

// //                 .terms-checkbox input[type="checkbox"]:checked + label .checkbox-custom::after {
// //                     content: '✓';
// //                     position: absolute;
// //                     color: white;
// //                     font-size: 16px;
// //                     font-weight: bold;
// //                     left: 50%;
// //                     top: 50%;
// //                     transform: translate(-50%, -50%);
// //                 }

// //                 .checkbox-label {
// //                     color: #2c3e50;
// //                     font-weight: 500;
// //                     line-height: 1.4;
// //                 }

// //                 /* Human Verification Styles */
// //                 .verification-container {
// //                     margin: 20px 0;
// //                     padding: 20px;
// //                     background: linear-gradient(135deg, #fff3e0 0%, #ffecb3 100%);
// //                     border-radius: 10px;
// //                     border: 2px solid #ff9800;
// //                 }

// //                 .verification-checkbox {
// //                     display: flex;
// //                     justify-content: center;
// //                     align-items: center;
// //                     min-height: 60px;
// //                 }

// //                 .verify-btn {
// //                     background: linear-gradient(45deg, #ff9800, #f57c00);
// //                     color: white;
// //                     border: none;
// //                     padding: 15px 30px;
// //                     border-radius: 10px;
// //                     font-size: 16px;
// //                     font-weight: 600;
// //                     cursor: pointer;
// //                     transition: all 0.3s;
// //                     display: flex;
// //                     align-items: center;
// //                     gap: 10px;
// //                     min-width: 250px;
// //                     justify-content: center;
// //                 }

// //                 .verify-btn:hover:not(:disabled) {
// //                     transform: translateY(-3px);
// //                     box-shadow: 0 8px 20px rgba(255, 152, 0, 0.3);
// //                 }

// //                 .verify-btn:disabled {
// //                     opacity: 0.7;
// //                     cursor: not-allowed;
// //                 }

// //                 .verifying-dots {
// //                     display: inline-flex;
// //                     align-items: center;
// //                     gap: 4px;
// //                 }

// //                 .dot {
// //                     width: 8px;
// //                     height: 8px;
// //                     background: white;
// //                     border-radius: 50%;
// //                     animation: pulse 1.5s infinite ease-in-out;
// //                 }

// //                 .dot:nth-child(2) {
// //                     animation-delay: 0.2s;
// //                 }

// //                 .dot:nth-child(3) {
// //                     animation-delay: 0.4s;
// //                 }

// //                 @keyframes pulse {
// //                     0%, 100% {
// //                         transform: scale(1);
// //                         opacity: 0.7;
// //                     }
// //                     50% {
// //                         transform: scale(1.3);
// //                         opacity: 1;
// //                     }
// //                 }

// //                 .verified-badge {
// //                     display: flex;
// //                     align-items: center;
// //                     gap: 10px;
// //                     background: linear-gradient(45deg, #4caf50, #2e7d32);
// //                     color: white;
// //                     padding: 12px 25px;
// //                     border-radius: 10px;
// //                     font-weight: 600;
// //                     font-size: 16px;
// //                     animation: verifiedAppear 0.5s ease;
// //                 }

// //                 .verified-icon {
// //                     font-size: 20px;
// //                 }

// //                 .verified-text {
// //                     font-size: 16px;
// //                 }

// //                 @keyframes verifiedAppear {
// //                     from {
// //                         opacity: 0;
// //                         transform: scale(0.9);
// //                     }
// //                     to {
// //                         opacity: 1;
// //                         transform: scale(1);
// //                     }
// //                 }

// //                 .button-group {
// //                     display: flex;
// //                     gap: 15px;
// //                     margin: 25px 0 15px;
// //                 }

// //                 .submit-btn, .cancel-btn {
// //                     flex: 1;
// //                     padding: 14px;
// //                     border: none;
// //                     border-radius: 10px;
// //                     font-size: 16px;
// //                     font-weight: 600;
// //                     cursor: pointer;
// //                     transition: all 0.3s ease;
// //                     display: flex;
// //                     align-items: center;
// //                     justify-content: center;
// //                     gap: 8px;
// //                 }

// //                 .submit-btn {
// //                     background: linear-gradient(45deg, #2ecc71, #27ae60);
// //                     color: white;
// //                 }

// //                 .cancel-btn {
// //                     background: linear-gradient(45deg, #e74c3c, #c0392b);
// //                     color: white;
// //                 }

// //                 .submit-btn:disabled, .cancel-btn:disabled {
// //                     background: #bdc3c7;
// //                     cursor: not-allowed;
// //                     transform: none !important;
// //                     box-shadow: none !important;
// //                 }

// //                 .submit-btn:hover:not(:disabled) {
// //                     transform: translateY(-3px);
// //                     box-shadow: 0 6px 15px rgba(46, 204, 113, 0.4);
// //                 }

// //                 .cancel-btn:hover:not(:disabled) {
// //                     transform: translateY(-3px);
// //                     box-shadow: 0 6px 15px rgba(231, 76, 60, 0.4);
// //                 }

// //                 .error-message {
// //                     background: linear-gradient(45deg, #ffcdd2, #ef9a9a);
// //                     color: #c62828;
// //                     padding: 15px;
// //                     border-radius: 8px;
// //                     margin-bottom: 20px;
// //                     text-align: center;
// //                     border-left: 4px solid #c62828;
// //                     font-weight: 500;
// //                 }

// //                 .form-notes {
// //                     margin-top: 20px;
// //                     padding: 12px;
// //                     background: #f1f8e9;
// //                     border-radius: 8px;
// //                     font-size: 13px;
// //                     color: #689f38;
// //                     border-left: 4px solid #8bc34a;
// //                 }

// //                 .payment-qr-container {
// //                     text-align: center;
// //                     padding: 25px;
// //                     margin: 25px 0;
// //                     background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
// //                     border-radius: 12px;
// //                     border: 2px solid #7b1fa2;
// //                 }

// //                 .payment-qr-container h4 {
// //                     color: #7b1fa2;
// //                     margin-bottom: 20px;
// //                 }

// //                 .qr-code {
// //                     display: flex;
// //                     justify-content: center;
// //                     align-items: center;
// //                     margin-bottom: 20px;
// //                     padding: 15px;
// //                     background: white;
// //                     border-radius: 10px;
// //                     border: 2px dashed #9c27b0;
// //                 }

// //                 .qr-instruction {
// //                     font-size: 14px;
// //                     color: #6a1b9a;
// //                     margin-top: 10px;
// //                     font-weight: 500;
// //                 }

// //                 /* Receipt Styles */
// //                 .receipt-container {
// //                     width: 100%;
// //                     display: flex;
// //                     justify-content: center;
// //                     align-items: center;
// //                     padding: 20px 0;
// //                 }

// //                 .receipt {
// //                     background: white;
// //                     border: 2px solid #4caf50;
// //                     border-radius: 15px;
// //                     padding: 30px;
// //                     width: 100%;
// //                     max-width: 550px;
// //                     box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
// //                     animation: fadeIn 0.5s ease;
// //                 }

// //                 @keyframes fadeIn {
// //                     from { opacity: 0; transform: translateY(30px); }
// //                     to { opacity: 1; transform: translateY(0); }
// //                 }

// //                 .receipt-header {
// //                     text-align: center;
// //                     padding-bottom: 20px;
// //                     margin-bottom: 25px;
// //                     border-bottom: 3px dashed #4caf50;
// //                 }

// //                 .receipt-title h3 {
// //                     margin: 0;
// //                     color: #2e7d32;
// //                     font-size: 26px;
// //                 }

// //                 .receipt-subtitle {
// //                     color: #666;
// //                     margin-top: 5px;
// //                     font-size: 14px;
// //                 }

// //                 .payment-method-badge {
// //                     display: inline-flex;
// //                     align-items: center;
// //                     gap: 8px;
// //                     background: linear-gradient(45deg, #2196f3, #1976d2);
// //                     color: white;
// //                     padding: 10px 20px;
// //                     border-radius: 25px;
// //                     font-weight: 600;
// //                     font-size: 14px;
// //                     margin-top: 15px;
// //                 }

// //                 .badge-icon {
// //                     font-size: 16px;
// //                 }

// //                 .receipt-body {
// //                     margin-bottom: 25px;
// //                 }

// //                 .receipt-section {
// //                     margin-bottom: 25px;
// //                     padding-bottom: 20px;
// //                     border-bottom: 1px solid #eee;
// //                 }

// //                 .receipt-section:last-child {
// //                     border-bottom: none;
// //                 }

// //                 .receipt-section h4 {
// //                     color: #3498db;
// //                     margin-bottom: 15px;
// //                     font-size: 16px;
// //                     text-transform: uppercase;
// //                     letter-spacing: 1px;
// //                 }

// //                 .receipt-grid {
// //                     display: grid;
// //                     grid-template-columns: repeat(2, 1fr);
// //                     gap: 12px;
// //                 }

// //                 .receipt-item {
// //                     display: flex;
// //                     justify-content: space-between;
// //                     align-items: center;
// //                     padding: 8px 0;
// //                 }

// //                 .receipt-label {
// //                     font-weight: 600;
// //                     color: #555;
// //                     font-size: 14px;
// //                 }

// //                 .receipt-value {
// //                     color: #333;
// //                     text-align: right;
// //                     font-size: 14px;
// //                 }

// //                 .highlight {
// //                     color: #e74c3c;
// //                     font-weight: bold;
// //                     font-size: 15px;
// //                 }

// //                 .seat-number {
// //                     background: #e8f5e9;
// //                     padding: 4px 12px;
// //                     border-radius: 20px;
// //                     font-weight: bold;
// //                     color: #2e7d32;
// //                 }

// //                 .fare-item {
// //                     background: #f8f9fa;
// //                     padding: 12px;
// //                     border-radius: 8px;
// //                     margin-top: 10px;
// //                 }

// //                 .fare-amount {
// //                     font-size: 20px;
// //                     font-weight: bold;
// //                     color: #e74c3c;
// //                 }

// //                 .status-item {
// //                     background: #e8f5e9;
// //                     padding: 8px 12px;
// //                     border-radius: 8px;
// //                 }

// //                 .status-paid {
// //                     color: #2e7d32;
// //                     font-weight: bold;
// //                 }

// //                 .payment-section {
// //                     background: #f8f9fa;
// //                     padding: 20px;
// //                     border-radius: 10px;
// //                     border: 1px solid #e0e0e0;
// //                 }

// //                 .receipt-footer {
// //                     text-align: center;
// //                     padding-top: 20px;
// //                     border-top: 2px dashed #ddd;
// //                 }

// //                 .footer-note {
// //                     color: #666;
// //                     font-size: 13px;
// //                     margin-bottom: 20px;
// //                     font-style: italic;
// //                 }

// //                 .receipt-actions {
// //                     display: flex;
// //                     gap: 15px;
// //                 }

// //                 .print-btn, .continue-btn {
// //                     flex: 1;
// //                     padding: 14px;
// //                     border: none;
// //                     border-radius: 10px;
// //                     font-size: 16px;
// //                     font-weight: 600;
// //                     cursor: pointer;
// //                     transition: all 0.3s ease;
// //                     display: flex;
// //                     align-items: center;
// //                     justify-content: center;
// //                     gap: 8px;
// //                 }

// //                 .print-btn {
// //                     background: linear-gradient(45deg, #2196f3, #1976d2);
// //                     color: white;
// //                 }

// //                 .continue-btn {
// //                     background: linear-gradient(45deg, #4caf50, #2e7d32);
// //                     color: white;
// //                 }

// //                 .print-btn:hover, .continue-btn:hover {
// //                     transform: translateY(-3px);
// //                     box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
// //                 }

// //                 .loading {
// //                     text-align: center;
// //                     font-size: 18px;
// //                     color: #666;
// //                     margin-top: 40px;
// //                 }

// //                 @media print {
// //                     body * { 
// //                         visibility: hidden; 
// //                         background: white !important;
// //                     }
// //                     .schedule-container, .schedule-container * { 
// //                         visibility: visible; 
// //                         background: white !important;
// //                         color: black !important;
// //                         box-shadow: none !important;
// //                     }
// //                     .schedule-container { 
// //                         position: absolute; 
// //                         left: 0; 
// //                         top: 0; 
// //                         width: 100%;
// //                         margin: 0;
// //                         padding: 0;
// //                     }
// //                     .receipt-actions, 
// //                     .receipt-footer .footer-note,
// //                     .receipt-header .payment-method-badge { 
// //                         display: none !important; 
// //                     }
// //                     .receipt { 
// //                         box-shadow: none !important; 
// //                         border: 2px solid #000 !important;
// //                         max-width: 100% !important;
// //                         margin: 0 !important;
// //                         padding: 20px !important;
// //                     }
// //                     .card {
// //                         box-shadow: none !important;
// //                         padding: 0 !important;
// //                         border: none !important;
// //                     }
// //                     .receipt-title h3 {
// //                         color: black !important;
// //                     }
// //                     .seat-number {
// //                         background: none !important;
// //                         border: 1px solid #000 !important;
// //                     }
// //                 }

// //                 @media (max-width: 768px) {
// //                     .schedule-container {
// //                         max-width: 95%;
// //                         margin: 20px auto;
// //                         padding: 0 15px;
// //                     }
                    
// //                     .grid-2,
// //                     .bus-details-grid,
// //                     .summary-grid,
// //                     .receipt-grid {
// //                         grid-template-columns: 1fr;
// //                     }
                    
// //                     .receipt {
// //                         padding: 20px;
// //                     }
                    
// //                     .receipt-item {
// //                         flex-direction: column;
// //                         align-items: flex-start;
// //                         gap: 5px;
// //                     }
                    
// //                     .receipt-value {
// //                         text-align: left;
// //                     }
                    
// //                     .payment-qr-container {
// //                         padding: 20px;
// //                     }
                    
// //                     .qr-code img {
// //                         width: 180px;
// //                         height: 180px;
// //                     }
                    
// //                     .button-group,
// //                     .receipt-actions {
// //                         flex-direction: column;
// //                     }
                    
// //                     .verify-btn {
// //                         min-width: 200px;
// //                         padding: 12px 20px;
// //                         font-size: 15px;
// //                     }
                    
// //                     .seat-details {
// //                         grid-column: span 1;
// //                     }
                    
// //                     .fare-item-summary {
// //                         grid-column: span 1;
// //                     }
                    
// //                     .fare-details {
// //                         flex-direction: column;
// //                         gap: 10px;
// //                     }
// //                 }
// //             `}</style>
// //         </div>
// //     )
// // }

// // export default Schedule





// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import { useNavigate, useLocation } from 'react-router-dom'
// import Image from './upi.jpg';
// import Image2 from './gpay2.jpg';

// const Schedule = ({ userId }) => {
//     const [buses, setBuses] = useState([])
//     const [isLoading, setIsLoading] = useState(true)
//     const [error, setError] = useState(null)
//     const [bookingLoading, setBookingLoading] = useState(false)
//     const [verifying, setVerifying] = useState(false)

//     const [selectedBusId, setSelectedBusId] = useState('')
//     const [selectedBusDetails, setSelectedBusDetails] = useState(null)
//     const [bookingDate, setBookingDate] = useState('')
//     const [bookingTime, setBookingTime] = useState('')
//     const [agreedToTerms, setAgreedToTerms] = useState(false)
//     const [humanVerified, setHumanVerified] = useState(false)

//     const [isBookingClosed, setIsBookingClosed] = useState(false)
//     const [bookingConfirmed, setBookingConfirmed] = useState(false)
//     const [bookingReceipt, setBookingReceipt] = useState(null)
//     const [paymentMethod, setPaymentMethod] = useState('card')

//     const navigate = useNavigate()
//     const location = useLocation()
    
//     // Check if coming from seat selection with all details
//     const { 
//         seatId: incomingSeatId, 
//         busId: incomingBusId, 
//         bookingDate: incomingDate, 
//         bookingTime: incomingTime,
//         seatNumber: incomingSeatNumber,
//         // Bus details from seats page
//         route: incomingRoute,
//         depot: incomingDepot,
//         fare: incomingFare,
//         dayOfWeek: incomingDayOfWeek,
//         busNumber: incomingBusNumber,
//         // Additional bus details from BusList
//         busType: incomingBusType,
//         departureTime: incomingDepartureTime,
//         arrivalTime: incomingArrivalTime,
//         capacity: incomingCapacity,
//         passengers: incomingPassengers,
//         occupancyRate: incomingOccupancyRate,
//         distanceKm: incomingDistanceKm,
//         revenue: incomingRevenue
//     } = location.state || {}
    
//     const [seatId, setSeatId] = useState(incomingSeatId || null)
//     const [seatNumber, setSeatNumber] = useState(incomingSeatNumber || null)
//     const [busIdFromSeat, setBusIdFromSeat] = useState(incomingBusId || null)
//     const [showConfirmation, setShowConfirmation] = useState(!!incomingSeatId)

//     // ================= FETCH BUSES =================
//     useEffect(() => {
//         const fetchBuses = async () => {
//             try {
//                 const response = await axios.get('/api/buses/')
//                 setBuses(response.data)
                
//                 // If coming from seat selection, auto-select that bus
//                 if (incomingBusId) {
//                     setSelectedBusId(String(incomingBusId))
//                     const bus = response.data.find(b => b.id === parseInt(incomingBusId) || b.bus_id === incomingBusId)
//                     if (bus) {
//                         setSelectedBusDetails(bus)
//                         setBookingDate(incomingDate || bus.date)
//                         setBookingTime(incomingTime || '')
//                     } else {
//                         // If bus not found in API response, create bus details from incoming data
//                         setSelectedBusDetails({
//                             id: incomingBusId,
//                             bus_id: incomingBusNumber || incomingBusId,
//                             route: incomingRoute || 'N/A',
//                             depot: incomingDepot || 'N/A',
//                             fare_per_passenger: incomingFare || 'N/A',
//                             day_of_week: incomingDayOfWeek || 'N/A',
//                             date: incomingDate || '',
//                             bus_type: incomingBusType || 'Standard',
//                             departure_time: incomingDepartureTime || 'N/A',
//                             arrival_time: incomingArrivalTime || 'N/A',
//                             capacity: incomingCapacity || 0,
//                             passengers: incomingPassengers || 0,
//                             occupancy_rate: incomingOccupancyRate || 0,
//                             distance_km: incomingDistanceKm || 0,
//                             revenue: incomingRevenue || 0
//                         })
//                     }
//                 }
//             } catch {
//                 setError('Failed to load buses')
//             } finally {
//                 setIsLoading(false)
//             }
//         }
//         fetchBuses()
//     }, [])

//     useEffect(() => {
//         if (incomingSeatId) {
//             setSeatId(incomingSeatId)
//             setSeatNumber(incomingSeatNumber)
//             setBusIdFromSeat(incomingBusId)
//             setBookingDate(incomingDate || '')
//             setBookingTime(incomingTime || '')
//             setShowConfirmation(true)
//         }
//     }, [incomingSeatId, incomingSeatNumber, incomingBusId, incomingDate, incomingTime])

//     // ================= TIME LOCK LOGIC =================
//     useEffect(() => {
//         if (!bookingDate || !bookingTime) {
//             setIsBookingClosed(false)
//             return
//         }

//         try {
//             const [y, m, d] = bookingDate.split('-').map(Number)
//             const [hh, mm] = bookingTime.split(':').map(Number)
            
//             const bookingDateTime = new Date(y, m - 1, d, hh, mm, 0)
            
//             if (isNaN(bookingDateTime.getTime())) {
//                 return
//             }

//             const now = new Date()

//             if (now >= bookingDateTime) {
//                 setIsBookingClosed(true)
//                 setError('Booking time has passed. Please select a future time.')
//                 return
//             }

//             setIsBookingClosed(false)

//             const interval = setInterval(() => {
//                 const currentNow = new Date()
//                 if (currentNow >= bookingDateTime) {
//                     setIsBookingClosed(true)
//                     setError('Booking time has passed. Seat booking is closed.')
//                     clearInterval(interval)
//                 }
//             }, 1000)

//             return () => clearInterval(interval)
//         } catch (err) {
//             setIsBookingClosed(false)
//             return
//         }
//     }, [bookingDate, bookingTime])

//     // ================= HELPER: Extract Receipt Data =================
//     const buildReceiptFromResponse = (data) => {
//         const seatData = data?.seat || {}
//         const busData = seatData?.bus || {}
        
//         // Use incoming data first, then API data, then selected bus details
//         const receipt = {
//             bookingId: data?.id || data?.booking_id || 'N/A',
//             bookingTime: data?.booking_time ? new Date(data.booking_time).toLocaleString() : new Date().toLocaleString(),
//             user: data?.user?.username || data?.user || 'Guest',
//             seatNumber: seatNumber || seatData?.seat_number || seatId || 'N/A',
//             route: incomingRoute || busData?.route || selectedBusDetails?.route || 'N/A',
//             busId: incomingBusNumber || busData?.bus_id || selectedBusDetails?.bus_id || incomingBusId || 'N/A',
//             depot: incomingDepot || busData?.depot || selectedBusDetails?.depot || 'N/A',
//             date: bookingDate || busData?.date || selectedBusDetails?.date || 'N/A',
//             time: bookingTime || data?.travel_time || incomingTime || 'N/A',
//             fare: incomingFare || busData?.fare_per_passenger || selectedBusDetails?.fare_per_passenger || 'N/A',
//             dayOfWeek: incomingDayOfWeek || busData?.day_of_week || selectedBusDetails?.day_of_week || 'N/A',
//             busType: incomingBusType || busData?.bus_type || selectedBusDetails?.bus_type || 'Standard',
//             departureTime: incomingDepartureTime || busData?.departure_time || selectedBusDetails?.departure_time || 'N/A',
//             arrivalTime: incomingArrivalTime || busData?.arrival_time || selectedBusDetails?.arrival_time || 'N/A',
//             paymentMethod: paymentMethod
//         }
//         return receipt
//     }

//     // ================= BUS SELECT =================
//     const handleBusSelect = (e) => {
//         const busId = e.target.value
//         setSelectedBusId(busId)
//         setBusIdFromSeat(busId)

//         const bus = buses.find(b => b.id === parseInt(busId))
//         setSelectedBusDetails(bus || null)

//         setBookingDate(bus?.date || '')
//         setBookingTime('')
//         setIsBookingClosed(false)
//         setError(null)
//         setAgreedToTerms(false)
//         setHumanVerified(false)
//     }

//     // ================= HUMAN VERIFICATION =================
//     const handleHumanVerification = () => {
//         if (!humanVerified) {
//             setVerifying(true)
//             // Simulate verification process
//             setTimeout(() => {
//                 setHumanVerified(true)
//                 setVerifying(false)
//             }, 1500)
//         }
//     }

//     // ================= CONFIRM BOOKING =================
//     const confirmBooking = async () => {
//         if (!seatId) {
//             setError('Seat information missing. Please go back and select a seat.')
//             return
//         }

//         if (!bookingTime) {
//             setError('Please select a travel time')
//             return
//         }

//         if (!agreedToTerms) {
//             setError('Please agree to booking terms')
//             return
//         }

//         if (!paymentMethod) {
//             setError('Please select a payment method')
//             return
//         }

//         if (!humanVerified) {
//             setError('Please complete human verification')
//             return
//         }

//         try {
//             const [y, m, d] = bookingDate.split('-').map(Number)
//             const [hh, mm] = bookingTime.split(':').map(Number)
//             const selectedDateTime = new Date(y, m - 1, d, hh, mm, 0)
            
//             if (selectedDateTime <= new Date()) {
//                 setError('Booking time has passed. Please select a future time.')
//                 setIsBookingClosed(true)
//                 return
//             }
//         } catch (err) {
//             setError('Invalid booking time. Please try again.')
//             return
//         }

//         setBookingLoading(true)

//         try {
//             const response = await axios.post(
//                 '/api/booking/',
//                 { 
//                     seat: seatId, 
//                     travel_time: bookingTime 
//                 },
//                 { withCredentials: true }
//             )

//             const receipt = buildReceiptFromResponse(response.data)
//             setBookingReceipt(receipt)
//             setBookingConfirmed(true)
//             setError(null)
//         } catch (error) {
//             let msg = 'Booking failed. Please try again.'
//             const respData = error.response?.data
//             if (respData) {
//                 msg = respData.error || respData.detail || JSON.stringify(respData)
//             } else if (error.message) {
//                 msg = error.message
//             }

//             setError(msg)
//             alert(msg)

//             if (error.response?.status === 401) {
//                 navigate('/login')
//             }
//         } finally {
//             setBookingLoading(false)
//         }
//     }

//     // ================= PROCEED TO SEATS =================
//     const proceedToSeats = () => {
//         if (!selectedBusId || !bookingDate || !bookingTime || !agreedToTerms) {
//             setError('Please complete all fields')
//             return
//         }

//         if (isBookingClosed) {
//             setError('Booking is closed for this schedule.')
//             return
//         }

//         if (!selectedBusDetails) {
//             setError('Bus details not found. Please select a bus again.')
//             return
//         }

//         // Get the actual bus ID from bus details
//         const actualBusId = selectedBusDetails.bus_id || selectedBusDetails.busId || selectedBusDetails.id;
        
//         if (!actualBusId) {
//             setError('Bus ID not found in bus details. Please select a valid bus.')
//             return
//         }

//         // Navigate to the bus seats page with all bus details
//         navigate(`/bus/${actualBusId}`, {
//             state: {
//                 busId: actualBusId,
//                 bookingDate,
//                 bookingTime,
//                 route: selectedBusDetails.route,
//                 depot: selectedBusDetails.depot,
//                 fare: selectedBusDetails.fare_per_passenger,
//                 dayOfWeek: selectedBusDetails.day_of_week,
//                 busNumber: actualBusId,
//                 busType: selectedBusDetails.bus_type,
//                 departureTime: selectedBusDetails.departure_time,
//                 arrivalTime: selectedBusDetails.arrival_time,
//                 capacity: selectedBusDetails.capacity,
//                 passengers: selectedBusDetails.passengers,
//                 occupancyRate: selectedBusDetails.occupancy_rate,
//                 distanceKm: selectedBusDetails.distance_km,
//                 revenue: selectedBusDetails.revenue,
//                 fromSchedule: true
//             }
//         })
//     }

//     // Check if confirm booking button should be enabled
//     const isConfirmButtonEnabled = () => {
//         return bookingTime && agreedToTerms && paymentMethod && humanVerified && !bookingLoading && !isBookingClosed
//     }

//     // Reset human verification when payment method changes
//     useEffect(() => {
//         setHumanVerified(false)
//         setVerifying(false)
//     }, [paymentMethod])

//     if (isLoading) return <p className="loading">Loading buses...</p>

//     return (
//         <div className="schedule-container">
//             <h2>🚌 Bus Schedule {seatId ? '- Confirm Booking' : ''}</h2>

//             {error && <div className="error-message">{error}</div>}

//             <div className="card">
//                 {/* Receipt Display - This should be at the top when booking is confirmed */}
//                 {bookingConfirmed && bookingReceipt ? (
//                     <div className="receipt-container" id="receipt-section">
//                         <div className="receipt">
//                             <div className="receipt-header">
//                                 <div className="receipt-title">
//                                     <h3>✅ Booking Confirmed!</h3>
//                                     <div className="receipt-subtitle">Thank you for your booking</div>
//                                 </div>
//                                 <div className="payment-method-badge">
//                                     <span className="badge-icon">💳</span>
//                                     Paid via {paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'googlepay' ? 'Google Pay' : 'Credit/Debit Card'}
//                                 </div>
//                             </div>
                            
//                             <div className="receipt-body">
//                                 <div className="receipt-section">
//                                     <h4>Booking Details</h4>
//                                     <div className="receipt-grid">
//                                         <div className="receipt-item">
//                                             <span className="receipt-label">Booking ID:</span>
//                                             <span className="receipt-value highlight">{bookingReceipt.bookingId}</span>
//                                         </div>
//                                         <div className="receipt-item">
//                                             <span className="receipt-label">Booking Time:</span>
//                                             <span className="receipt-value">{bookingReceipt.bookingTime}</span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="receipt-section">
//                                     <h4>Passenger Details</h4>
//                                     <div className="receipt-grid">
//                                         <div className="receipt-item">
//                                             <span className="receipt-label">Name:</span>
//                                             <span className="receipt-value">{bookingReceipt.user}</span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="receipt-section">
//                                     <h4>Journey Details</h4>
//                                     <div className="receipt-grid">
//                                         <div className="receipt-item">
//                                             <span className="receipt-label">Bus ID:</span>
//                                             <span className="receipt-value">{bookingReceipt.busId}</span>
//                                         </div>
//                                         <div className="receipt-item">
//                                             <span className="receipt-label">Route:</span>
//                                             <span className="receipt-value">{bookingReceipt.route}</span>
//                                         </div>
//                                         <div className="receipt-item">
//                                             <span className="receipt-label">Depot:</span>
//                                             <span className="receipt-value">{bookingReceipt.depot}</span>
//                                         </div>
//                                         <div className="receipt-item">
//                                             <span className="receipt-label">Seat Number:</span>
//                                             <span className="receipt-value seat-number">{bookingReceipt.seatNumber}</span>
//                                         </div>
//                                         <div className="receipt-item">
//                                             <span className="receipt-label">Date:</span>
//                                             <span className="receipt-value">{bookingReceipt.date}</span>
//                                         </div>
//                                         <div className="receipt-item">
//                                             <span className="receipt-label">Time:</span>
//                                             <span className="receipt-value">{bookingReceipt.time}</span>
//                                         </div>
//                                         <div className="receipt-item">
//                                             <span className="receipt-label">Day:</span>
//                                             <span className="receipt-value">{bookingReceipt.dayOfWeek}</span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="receipt-section payment-section">
//                                     <h4>Payment Details</h4>
//                                     <div className="receipt-grid">
//                                         <div className="receipt-item">
//                                             <span className="receipt-label">Payment Method:</span>
//                                             <span className="receipt-value">
//                                                 {paymentMethod === 'upi' ? 'UPI Payment' : 
//                                                  paymentMethod === 'googlepay' ? 'Google Pay' : 
//                                                  'Credit/Debit Card'}
//                                             </span>
//                                         </div>
//                                         <div className="receipt-item fare-item">
//                                             <span className="receipt-label">Total Fare:</span>
//                                             <span className="receipt-value fare-amount">₹{bookingReceipt.fare}</span>
//                                         </div>
//                                         <div className="receipt-item status-item">
//                                             <span className="receipt-label">Payment Status:</span>
//                                             <span className="receipt-value status-paid">✅ Paid</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="receipt-footer">
//                                 <p className="footer-note">
//                                     Please keep this receipt for your records. Present it at the boarding point.
//                                 </p>
//                                 <div className="receipt-actions">
//                                     <button 
//                                         className="print-btn"
//                                         onClick={() => window.print()}
//                                     >
//                                         🖨️ Print Receipt
//                                     </button>
//                                     <button 
//                                         className="continue-btn"
//                                         onClick={() => navigate('/my-bookings')}
//                                     >
//                                         📋 View My Bookings
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     <>
//                         {/* If coming from seat selection, show confirmation page */}
//                         {showConfirmation && seatId ? (
//                             <div>
//                                 <h3>Complete Your Booking</h3>
                                
//                                 <div className="booking-summary">
//                                     <h4>Booking Summary</h4>
//                                     <div className="summary-grid">
//                                         {/* Seat Details */}
//                                         <div className="summary-item seat-details">
//                                             <span className="summary-label">Selected Seat:</span>
//                                             <span className="summary-value seat-highlight">{seatNumber || seatId}</span>
//                                         </div>
                                        
//                                         {/* Bus Route and ID */}
//                                         <div className="summary-item">
//                                             <span className="summary-label">Bus Route:</span>
//                                             <span className="summary-value route-text">{incomingRoute || selectedBusDetails?.route || 'N/A'}</span>
//                                         </div>
                                        
//                                         <div className="summary-item">
//                                             <span className="summary-label">Bus ID:</span>
//                                             <span className="summary-value bus-id">{incomingBusNumber || selectedBusDetails?.bus_id || incomingBusId || 'N/A'}</span>
//                                         </div>
                                        
//                                         {/* Depot and Bus Type */}
//                                         <div className="summary-item">
//                                             <span className="summary-label">Depot:</span>
//                                             <span className="summary-value">{incomingDepot || selectedBusDetails?.depot || 'N/A'}</span>
//                                         </div>
                                        
//                                         <div className="summary-item">
//                                             <span className="summary-label">Bus Type:</span>
//                                             <span className="summary-value bus-type">{incomingBusType || selectedBusDetails?.bus_type || 'Standard'}</span>
//                                         </div>
                                        
//                                         {/* Schedule Details */}
//                                         <div className="summary-item">
//                                             <span className="summary-label">Journey Date:</span>
//                                             <span className="summary-value">{bookingDate}</span>
//                                         </div>
                                        
//                                         <div className="summary-item">
//                                             <span className="summary-label">Day of Week:</span>
//                                             <span className="summary-value day-highlight">{incomingDayOfWeek || selectedBusDetails?.day_of_week || 'N/A'}</span>
//                                         </div>
                                        
//                                         {/* Time Details */}
//                                         <div className="summary-item">
//                                             <span className="summary-label">Departure Time:</span>
//                                             <span className="summary-value time-text">{incomingDepartureTime || selectedBusDetails?.departure_time || 'N/A'}</span>
//                                         </div>
                                        
//                                         <div className="summary-item">
//                                             <span className="summary-label">Arrival Time:</span>
//                                             <span className="summary-value time-text">{incomingArrivalTime || selectedBusDetails?.arrival_time || 'N/A'}</span>
//                                         </div>
                                        
//                                         {/* Additional Bus Info */}
//                                         <div className="summary-item">
//                                             <span className="summary-label">Capacity:</span>
//                                             <span className="summary-value">{incomingCapacity || selectedBusDetails?.capacity || 'N/A'}</span>
//                                         </div>
                                        
//                                         <div className="summary-item">
//                                             <span className="summary-label">Distance:</span>
//                                             <span className="summary-value">{incomingDistanceKm || selectedBusDetails?.distance_km || 'N/A'} km</span>
//                                         </div>
                                        
//                                         {/* Fare - Full Width */}
//                                         <div className="summary-item fare-item-summary">
//                                             <div className="fare-details">
//                                                 <span className="summary-label">Total Fare:</span>
//                                                 <span className="summary-value fare-highlight">₹{incomingFare || selectedBusDetails?.fare_per_passenger || 'N/A'}</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="form-group">
//                                     <label>Select Travel Time <span className="required">*</span></label>
//                                     <input
//                                         type="time"
//                                         value={bookingTime}
//                                         onChange={(e) => {
//                                             const newTime = e.target.value
//                                             setBookingTime(newTime)
                                            
//                                             if (newTime && bookingDate) {
//                                                 try {
//                                                     const [y, m, d] = bookingDate.split('-').map(Number)
//                                                     const [hh, mm] = newTime.split(':').map(Number)
//                                                     const selectedDateTime = new Date(y, m - 1, d, hh, mm, 0)
                                                    
//                                                     if (selectedDateTime > new Date()) {
//                                                         setIsBookingClosed(false)
//                                                         setError(null)
//                                                     } else {
//                                                         setIsBookingClosed(true)
//                                                         setError('Booking time has passed. Please select a future time.')
//                                                     }
//                                                 } catch (err) {
//                                                     setIsBookingClosed(false)
//                                                     setError(null)
//                                                 }
//                                             }
//                                         }}
//                                     />
//                                 </div>

//                                 <div className="form-group">
//                                     <label>Select Payment Method <span className="required">*</span></label>
//                                     <select 
//                                         value={paymentMethod} 
//                                         onChange={(e) => setPaymentMethod(e.target.value)}
//                                         required
//                                     >
//                                         <option value="">-- Select Payment Method --</option>
//                                         <option value="card">Credit/Debit Card</option>
//                                         <option value="upi">UPI</option>
//                                         <option value="googlepay">Google Pay</option>
//                                     </select>
//                                 </div>

//                                 {paymentMethod === 'upi' && (
//                                     <div className="payment-qr-container">
//                                         <h4>Scan UPI QR Code to Pay</h4>
//                                         <div className="qr-code">
//                                             <img src={Image} alt="UPI QR" width="200" height="200"/>
//                                         </div>
//                                         <p className="qr-instruction">Scan the QR code using any UPI app to complete payment</p>
//                                     </div>
//                                 )}

//                                 {paymentMethod === 'googlepay' && (
//                                     <div className="payment-qr-container">
//                                         <h4>Scan Google Pay QR Code</h4>
//                                         <div className="qr-code">
//                                             <img src={Image2} alt="Google Pay QR" width="200" height="200"/>
//                                         </div>
//                                         <p className="qr-instruction">Scan the QR code using Google Pay app to complete payment</p>
//                                     </div>
//                                 )}

//                                 <div className="verification-container">
//                                     <h4>Human Verification <span className="required">*</span></h4>
//                                     <div className="verification-checkbox">
//                                         {!humanVerified ? (
//                                             <button
//                                                 className="verify-btn"
//                                                 onClick={handleHumanVerification}
//                                                 disabled={verifying}
//                                             >
//                                                 {verifying ? (
//                                                     <>
//                                                         <span className="verifying-dots">
//                                                             <span className="dot"></span>
//                                                             <span className="dot"></span>
//                                                             <span className="dot"></span>
//                                                         </span>
//                                                         Verifying...
//                                                     </>
//                                                 ) : (
//                                                     'Click to Verify You Are Human'
//                                                 )}
//                                             </button>
//                                         ) : (
//                                             <div className="verified-badge">
//                                                 <span className="verified-icon">✅</span>
//                                                 <span className="verified-text">Verified</span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>

//                                 <div className="terms-container">
//                                     <div className="terms-checkbox">
//                                         <input
//                                             type="checkbox"
//                                             id="termsAgreement"
//                                             checked={agreedToTerms}
//                                             onChange={(e) => setAgreedToTerms(e.target.checked)}
//                                         />
//                                         <label htmlFor="termsAgreement">
//                                             <span className="checkbox-custom"></span>
//                                             <span className="checkbox-label">
//                                                 I agree to the booking terms and conditions <span className="required">*</span>
//                                             </span>
//                                         </label>
//                                     </div>
//                                 </div>

//                                 <div className="button-group">
//                                     <button
//                                         className="cancel-btn"
//                                         onClick={() => navigate(-1)}
//                                         disabled={bookingLoading}
//                                     >
//                                         ↩ Back
//                                     </button>
//                                     <button
//                                         className="submit-btn"
//                                         disabled={!isConfirmButtonEnabled()}
//                                         onClick={confirmBooking}
//                                     >
//                                         {bookingLoading ? 'Processing...' : '✅ Confirm Booking'}
//                                     </button>
//                                 </div>

//                                 <div className="form-notes">
//                                     <p><small><span className="required">*</span> Required fields</small></p>
//                                     <p><small>Note: Booking will be confirmed only after payment verification</small></p>
//                                 </div>
//                             </div>
//                         ) : (
//                             // Regular schedule selection flow
//                             <>
//                                 <div className="form-group">
//                                     <label>Select Bus Route</label>
//                                     <select value={selectedBusId} onChange={handleBusSelect}>
//                                         <option value="">-- Choose a bus --</option>
//                                         {buses.map(bus => (
//                                             <option key={bus.id} value={bus.id}>
//                                                 {bus.route} - {bus.bus_id} ({bus.date})
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 {selectedBusDetails && (
//                                     <>
//                                         <div className="bus-info">
//                                             <h4>Bus Details</h4>
//                                             <div className="bus-details-grid">
//                                                 <div className="bus-detail">
//                                                     <span className="detail-label">Route:</span>
//                                                     <span className="detail-value">{selectedBusDetails.route}</span>
//                                                 </div>
//                                                 <div className="bus-detail">
//                                                     <span className="detail-label">Depot:</span>
//                                                     <span className="detail-value">{selectedBusDetails.depot}</span>
//                                                 </div>
//                                                 <div className="bus-detail">
//                                                     <span className="detail-label">Fare:</span>
//                                                     <span className="detail-value">₹{selectedBusDetails.fare_per_passenger}</span>
//                                                 </div>
//                                                 <div className="bus-detail">
//                                                     <span className="detail-label">Day:</span>
//                                                     <span className="detail-value">{selectedBusDetails.day_of_week}</span>
//                                                 </div>
//                                                 <div className="bus-detail">
//                                                     <span className="detail-label">Bus Type:</span>
//                                                     <span className="detail-value">{selectedBusDetails.bus_type || 'Standard'}</span>
//                                                 </div>
//                                                 <div className="bus-detail">
//                                                     <span className="detail-label">Capacity:</span>
//                                                     <span className="detail-value">{selectedBusDetails.capacity || 'N/A'}</span>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="grid-2">
//                                             <div className="form-group">
//                                                 <label>Date</label>
//                                                 <input
//                                                     type="date"
//                                                     value={bookingDate}
//                                                     min={selectedBusDetails.date}
//                                                     onChange={e => setBookingDate(e.target.value)}
//                                                 />
//                                             </div>

//                                             <div className="form-group">
//                                                 <label>Time</label>
//                                                 <input
//                                                     type="time"
//                                                     value={bookingTime}
//                                                     onChange={e => {
//                                                         setBookingTime(e.target.value)
//                                                         setIsBookingClosed(false)
//                                                         setError(null)
//                                                     }}
//                                                 />
//                                             </div>
//                                         </div>

//                                         <div className="terms-container">
//                                             <div className="terms-checkbox">
//                                                 <input
//                                                     type="checkbox"
//                                                     id="scheduleTerms"
//                                                     checked={agreedToTerms}
//                                                     onChange={(e) => setAgreedToTerms(e.target.checked)}
//                                                 />
//                                                 <label htmlFor="scheduleTerms">
//                                                     <span className="checkbox-custom"></span>
//                                                     <span className="checkbox-label">
//                                                         I agree to the booking terms and conditions
//                                                     </span>
//                                                 </label>
//                                             </div>
//                                         </div>

//                                         <button
//                                             className="submit-btn"
//                                             disabled={
//                                                 isBookingClosed ||
//                                                 !bookingDate ||
//                                                 !bookingTime ||
//                                                 !agreedToTerms
//                                             }
//                                             onClick={proceedToSeats}
//                                         >
//                                             {isBookingClosed ? '⏰ Booking Closed' : '🎯 Proceed to Seat Selection'}
//                                         </button>
//                                     </>
//                                 )}
//                             </>
//                         )}
//                     </>
//                 )}
//             </div>

//             {/* ================= STYLES ================= */}
//             <style>{`
//                 body { 
//                     background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
//                     font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//                 }

//                 .schedule-container {
//                     max-width: 700px;
//                     margin: 30px auto;
//                     padding: 0 20px;
//                 }

//                 h2, h3 { 
//                     text-align: center; 
//                     margin-bottom: 20px; 
//                     color: #2c3e50;
//                 }
                
//                 h2 {
//                     font-size: 28px;
//                     background: linear-gradient(45deg, #3498db, #2ecc71);
//                     -webkit-background-clip: text;
//                     -webkit-text-fill-color: transparent;
//                     background-clip: text;
//                 }
                
//                 h3 { 
//                     font-size: 22px;
//                     color: #34495e;
//                 }
                
//                 h4 {
//                     color: #2c3e50;
//                     margin-bottom: 15px;
//                     font-size: 18px;
//                 }

//                 .card {
//                     background: white;
//                     padding: 30px;
//                     border-radius: 15px;
//                     box-shadow: 0 10px 30px rgba(0,0,0,0.1);
//                     min-height: 300px;
//                     border: 1px solid #e0e0e0;
//                 }

//                 .form-group {
//                     display: flex;
//                     flex-direction: column;
//                     margin-bottom: 20px;
//                 }

//                 label { 
//                     font-weight: 600; 
//                     margin-bottom: 8px;
//                     color: #2c3e50;
//                     display: flex;
//                     align-items: center;
//                     gap: 5px;
//                 }

//                 .required {
//                     color: #e74c3c;
//                     font-weight: bold;
//                 }

//                 select, input {
//                     padding: 12px;
//                     border-radius: 8px;
//                     border: 2px solid #ddd;
//                     font-size: 15px;
//                     transition: border-color 0.3s;
//                 }

//                 select:focus, input:focus {
//                     outline: none;
//                     border-color: #3498db;
//                     box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
//                 }

//                 .bus-info {
//                     background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
//                     padding: 20px;
//                     border-radius: 10px;
//                     margin-bottom: 20px;
//                     border-left: 4px solid #2196f3;
//                 }

//                 .bus-details-grid {
//                     display: grid;
//                     grid-template-columns: repeat(2, 1fr);
//                     gap: 10px;
//                 }

//                 .bus-detail {
//                     display: flex;
//                     justify-content: space-between;
//                     padding: 8px 0;
//                     border-bottom: 1px solid rgba(33, 150, 243, 0.2);
//                 }

//                 .bus-detail:last-child {
//                     border-bottom: none;
//                 }

//                 .detail-label {
//                     font-weight: 600;
//                     color: #1565c0;
//                 }

//                 .detail-value {
//                     color: #0d47a1;
//                     font-weight: 500;
//                 }

//                 /* Updated Booking Summary Styles */
//                 .booking-summary {
//                     background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
//                     padding: 20px;
//                     border-radius: 10px;
//                     margin-bottom: 25px;
//                     border-left: 4px solid #4caf50;
//                 }

//                 .booking-summary h4 {
//                     color: #2e7d32;
//                     margin-bottom: 20px;
//                     font-size: 20px;
//                     text-align: center;
//                 }

//                 .summary-grid {
//                     display: grid;
//                     grid-template-columns: repeat(2, 1fr);
//                     gap: 15px;
//                 }

//                 .summary-item {
//                     display: flex;
//                     flex-direction: column;
//                     gap: 5px;
//                 }

//                 .summary-label {
//                     font-weight: 600;
//                     color: #2e7d32;
//                     font-size: 13px;
//                     text-transform: uppercase;
//                     letter-spacing: 0.5px;
//                 }

//                 .summary-value {
//                     color: #1b5e20;
//                     font-weight: 500;
//                     font-size: 15px;
//                 }

//                 /* Special styling for seat details */
//                 .seat-details {
//                     grid-column: span 2;
//                     text-align: center;
//                     margin-bottom: 10px;
//                 }

//                 .seat-highlight {
//                     background: #4caf50;
//                     color: white;
//                     padding: 8px 20px;
//                     border-radius: 25px;
//                     font-weight: bold;
//                     font-size: 18px;
//                     display: inline-block;
//                     min-width: 80px;
//                     text-align: center;
//                 }

//                 /* Route and ID styling */
//                 .route-text {
//                     font-weight: 600;
//                     color: #1565c0;
//                     font-size: 16px;
//                 }

//                 .bus-id {
//                     background: #e3f2fd;
//                     padding: 4px 10px;
//                     border-radius: 6px;
//                     color: #0d47a1;
//                     font-weight: 600;
//                 }

//                 .bus-type {
//                     background: #fff3e0;
//                     padding: 4px 10px;
//                     border-radius: 6px;
//                     color: #f57c00;
//                     font-weight: 600;
//                 }

//                 .day-highlight {
//                     background: #f3e5f5;
//                     padding: 4px 10px;
//                     border-radius: 6px;
//                     color: #7b1fa2;
//                     font-weight: 600;
//                 }

//                 .time-text {
//                     font-weight: 600;
//                     color: #d84315;
//                 }

//                 /* Fare styling */
//                 .fare-item-summary {
//                     grid-column: span 2;
//                     background: #f8f9fa;
//                     padding: 15px;
//                     border-radius: 10px;
//                     margin-top: 10px;
//                     text-align: center;
//                 }

//                 .fare-details {
//                     display: flex;
//                     justify-content: space-between;
//                     align-items: center;
//                 }

//                 .fare-highlight {
//                     color: #e74c3c;
//                     font-weight: bold;
//                     font-size: 22px;
//                 }

//                 .grid-2 {
//                     display: grid;
//                     grid-template-columns: 1fr 1fr;
//                     gap: 15px;
//                     margin-bottom: 20px;
//                 }

//                 /* Custom Checkbox Styles */
//                 .terms-container {
//                     margin: 20px 0;
//                     padding: 15px;
//                     background: #f8f9fa;
//                     border-radius: 8px;
//                     border: 1px solid #e9ecef;
//                 }

//                 .terms-checkbox {
//                     position: relative;
//                     margin-bottom: 10px;
//                 }

//                 .terms-checkbox input[type="checkbox"] {
//                     display: none;
//                 }

//                 .terms-checkbox label {
//                     display: flex;
//                     align-items: center;
//                     cursor: pointer;
//                     position: relative;
//                     padding-left: 35px;
//                     min-height: 24px;
//                 }

//                 .checkbox-custom {
//                     position: absolute;
//                     left: 0;
//                     top: 0;
//                     width: 24px;
//                     height: 24px;
//                     background: white;
//                     border: 2px solid #ddd;
//                     border-radius: 6px;
//                     transition: all 0.3s;
//                 }

//                 .terms-checkbox input[type="checkbox"]:checked + label .checkbox-custom {
//                     background: #4caf50;
//                     border-color: #4caf50;
//                 }

//                 .terms-checkbox input[type="checkbox"]:checked + label .checkbox-custom::after {
//                     content: '✓';
//                     position: absolute;
//                     color: white;
//                     font-size: 16px;
//                     font-weight: bold;
//                     left: 50%;
//                     top: 50%;
//                     transform: translate(-50%, -50%);
//                 }

//                 .checkbox-label {
//                     color: #2c3e50;
//                     font-weight: 500;
//                     line-height: 1.4;
//                 }

//                 /* Human Verification Styles */
//                 .verification-container {
//                     margin: 20px 0;
//                     padding: 20px;
//                     background: linear-gradient(135deg, #fff3e0 0%, #ffecb3 100%);
//                     border-radius: 10px;
//                     border: 2px solid #ff9800;
//                 }

//                 .verification-checkbox {
//                     display: flex;
//                     justify-content: center;
//                     align-items: center;
//                     min-height: 60px;
//                 }

//                 .verify-btn {
//                     background: linear-gradient(45deg, #ff9800, #f57c00);
//                     color: white;
//                     border: none;
//                     padding: 15px 30px;
//                     border-radius: 10px;
//                     font-size: 16px;
//                     font-weight: 600;
//                     cursor: pointer;
//                     transition: all 0.3s;
//                     display: flex;
//                     align-items: center;
//                     gap: 10px;
//                     min-width: 250px;
//                     justify-content: center;
//                 }

//                 .verify-btn:hover:not(:disabled) {
//                     transform: translateY(-3px);
//                     box-shadow: 0 8px 20px rgba(255, 152, 0, 0.3);
//                 }

//                 .verify-btn:disabled {
//                     opacity: 0.7;
//                     cursor: not-allowed;
//                 }

//                 .verifying-dots {
//                     display: inline-flex;
//                     align-items: center;
//                     gap: 4px;
//                 }

//                 .dot {
//                     width: 8px;
//                     height: 8px;
//                     background: white;
//                     border-radius: 50%;
//                     animation: pulse 1.5s infinite ease-in-out;
//                 }

//                 .dot:nth-child(2) {
//                     animation-delay: 0.2s;
//                 }

//                 .dot:nth-child(3) {
//                     animation-delay: 0.4s;
//                 }

//                 @keyframes pulse {
//                     0%, 100% {
//                         transform: scale(1);
//                         opacity: 0.7;
//                     }
//                     50% {
//                         transform: scale(1.3);
//                         opacity: 1;
//                     }
//                 }

//                 .verified-badge {
//                     display: flex;
//                     align-items: center;
//                     gap: 10px;
//                     background: linear-gradient(45deg, #4caf50, #2e7d32);
//                     color: white;
//                     padding: 12px 25px;
//                     border-radius: 10px;
//                     font-weight: 600;
//                     font-size: 16px;
//                     animation: verifiedAppear 0.5s ease;
//                 }

//                 .verified-icon {
//                     font-size: 20px;
//                 }

//                 .verified-text {
//                     font-size: 16px;
//                 }

//                 @keyframes verifiedAppear {
//                     from {
//                         opacity: 0;
//                         transform: scale(0.9);
//                     }
//                     to {
//                         opacity: 1;
//                         transform: scale(1);
//                     }
//                 }

//                 .button-group {
//                     display: flex;
//                     gap: 15px;
//                     margin: 25px 0 15px;
//                 }

//                 .submit-btn, .cancel-btn {
//                     flex: 1;
//                     padding: 14px;
//                     border: none;
//                     border-radius: 10px;
//                     font-size: 16px;
//                     font-weight: 600;
//                     cursor: pointer;
//                     transition: all 0.3s ease;
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                     gap: 8px;
//                 }

//                 .submit-btn {
//                     background: linear-gradient(45deg, #2ecc71, #27ae60);
//                     color: white;
//                 }

//                 .cancel-btn {
//                     background: linear-gradient(45deg, #e74c3c, #c0392b);
//                     color: white;
//                 }

//                 .submit-btn:disabled, .cancel-btn:disabled {
//                     background: #bdc3c7;
//                     cursor: not-allowed;
//                     transform: none !important;
//                     box-shadow: none !important;
//                 }

//                 .submit-btn:hover:not(:disabled) {
//                     transform: translateY(-3px);
//                     box-shadow: 0 6px 15px rgba(46, 204, 113, 0.4);
//                 }

//                 .cancel-btn:hover:not(:disabled) {
//                     transform: translateY(-3px);
//                     box-shadow: 0 6px 15px rgba(231, 76, 60, 0.4);
//                 }

//                 .error-message {
//                     background: linear-gradient(45deg, #ffcdd2, #ef9a9a);
//                     color: #c62828;
//                     padding: 15px;
//                     border-radius: 8px;
//                     margin-bottom: 20px;
//                     text-align: center;
//                     border-left: 4px solid #c62828;
//                     font-weight: 500;
//                 }

//                 .form-notes {
//                     margin-top: 20px;
//                     padding: 12px;
//                     background: #f1f8e9;
//                     border-radius: 8px;
//                     font-size: 13px;
//                     color: #689f38;
//                     border-left: 4px solid #8bc34a;
//                 }

//                 .payment-qr-container {
//                     text-align: center;
//                     padding: 25px;
//                     margin: 25px 0;
//                     background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
//                     border-radius: 12px;
//                     border: 2px solid #7b1fa2;
//                 }

//                 .payment-qr-container h4 {
//                     color: #7b1fa2;
//                     margin-bottom: 20px;
//                 }

//                 .qr-code {
//                     display: flex;
//                     justify-content: center;
//                     align-items: center;
//                     margin-bottom: 20px;
//                     padding: 15px;
//                     background: white;
//                     border-radius: 10px;
//                     border: 2px dashed #9c27b0;
//                 }

//                 .qr-instruction {
//                     font-size: 14px;
//                     color: #6a1b9a;
//                     margin-top: 10px;
//                     font-weight: 500;
//                 }

//                 /* Receipt Styles */
//                 .receipt-container {
//                     width: 100%;
//                     display: flex;
//                     justify-content: center;
//                     align-items: center;
//                     padding: 20px 0;
//                 }

//                 .receipt {
//                     background: white;
//                     border: 2px solid #4caf50;
//                     border-radius: 15px;
//                     padding: 30px;
//                     width: 100%;
//                     max-width: 550px;
//                     box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
//                     animation: fadeIn 0.5s ease;
//                 }

//                 @keyframes fadeIn {
//                     from { opacity: 0; transform: translateY(30px); }
//                     to { opacity: 1; transform: translateY(0); }
//                 }

//                 .receipt-header {
//                     text-align: center;
//                     padding-bottom: 20px;
//                     margin-bottom: 25px;
//                     border-bottom: 3px dashed #4caf50;
//                 }

//                 .receipt-title h3 {
//                     margin: 0;
//                     color: #2e7d32;
//                     font-size: 26px;
//                 }

//                 .receipt-subtitle {
//                     color: #666;
//                     margin-top: 5px;
//                     font-size: 14px;
//                 }

//                 .payment-method-badge {
//                     display: inline-flex;
//                     align-items: center;
//                     gap: 8px;
//                     background: linear-gradient(45deg, #2196f3, #1976d2);
//                     color: white;
//                     padding: 10px 20px;
//                     border-radius: 25px;
//                     font-weight: 600;
//                     font-size: 14px;
//                     margin-top: 15px;
//                 }

//                 .badge-icon {
//                     font-size: 16px;
//                 }

//                 .receipt-body {
//                     margin-bottom: 25px;
//                 }

//                 .receipt-section {
//                     margin-bottom: 25px;
//                     padding-bottom: 20px;
//                     border-bottom: 1px solid #eee;
//                 }

//                 .receipt-section:last-child {
//                     border-bottom: none;
//                 }

//                 .receipt-section h4 {
//                     color: #3498db;
//                     margin-bottom: 15px;
//                     font-size: 16px;
//                     text-transform: uppercase;
//                     letter-spacing: 1px;
//                 }

//                 .receipt-grid {
//                     display: grid;
//                     grid-template-columns: repeat(2, 1fr);
//                     gap: 12px;
//                 }

//                 .receipt-item {
//                     display: flex;
//                     justify-content: space-between;
//                     align-items: center;
//                     padding: 8px 0;
//                 }

//                 .receipt-label {
//                     font-weight: 600;
//                     color: #555;
//                     font-size: 14px;
//                 }

//                 .receipt-value {
//                     color: #333;
//                     text-align: right;
//                     font-size: 14px;
//                 }

//                 .highlight {
//                     color: #e74c3c;
//                     font-weight: bold;
//                     font-size: 15px;
//                 }

//                 .seat-number {
//                     background: #e8f5e9;
//                     padding: 4px 12px;
//                     border-radius: 20px;
//                     font-weight: bold;
//                     color: #2e7d32;
//                 }

//                 .fare-item {
//                     background: #f8f9fa;
//                     padding: 12px;
//                     border-radius: 8px;
//                     margin-top: 10px;
//                 }

//                 .fare-amount {
//                     font-size: 20px;
//                     font-weight: bold;
//                     color: #e74c3c;
//                 }

//                 .status-item {
//                     background: #e8f5e9;
//                     padding: 8px 12px;
//                     border-radius: 8px;
//                 }

//                 .status-paid {
//                     color: #2e7d32;
//                     font-weight: bold;
//                 }

//                 .payment-section {
//                     background: #f8f9fa;
//                     padding: 20px;
//                     border-radius: 10px;
//                     border: 1px solid #e0e0e0;
//                 }

//                 .receipt-footer {
//                     text-align: center;
//                     padding-top: 20px;
//                     border-top: 2px dashed #ddd;
//                 }

//                 .footer-note {
//                     color: #666;
//                     font-size: 13px;
//                     margin-bottom: 20px;
//                     font-style: italic;
//                 }

//                 .receipt-actions {
//                     display: flex;
//                     gap: 15px;
//                 }

//                 .print-btn, .continue-btn {
//                     flex: 1;
//                     padding: 14px;
//                     border: none;
//                     border-radius: 10px;
//                     font-size: 16px;
//                     font-weight: 600;
//                     cursor: pointer;
//                     transition: all 0.3s ease;
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                     gap: 8px;
//                 }

//                 .print-btn {
//                     background: linear-gradient(45deg, #2196f3, #1976d2);
//                     color: white;
//                 }

//                 .continue-btn {
//                     background: linear-gradient(45deg, #4caf50, #2e7d32);
//                     color: white;
//                 }

//                 .print-btn:hover, .continue-btn:hover {
//                     transform: translateY(-3px);
//                     box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
//                 }

//                 .loading {
//                     text-align: center;
//                     font-size: 18px;
//                     color: #666;
//                     margin-top: 40px;
//                 }

//                 @media print {
//                     body * { 
//                         visibility: hidden; 
//                         background: white !important;
//                     }
//                     .schedule-container, .schedule-container * { 
//                         visibility: visible; 
//                         background: white !important;
//                         color: black !important;
//                         box-shadow: none !important;
//                     }
//                     .schedule-container { 
//                         position: absolute; 
//                         left: 0; 
//                         top: 0; 
//                         width: 100%;
//                         margin: 0;
//                         padding: 0;
//                     }
//                     .receipt-actions, 
//                     .receipt-footer .footer-note,
//                     .receipt-header .payment-method-badge { 
//                         display: none !important; 
//                     }
//                     .receipt { 
//                         box-shadow: none !important; 
//                         border: 2px solid #000 !important;
//                         max-width: 100% !important;
//                         margin: 0 !important;
//                         padding: 20px !important;
//                     }
//                     .card {
//                         box-shadow: none !important;
//                         padding: 0 !important;
//                         border: none !important;
//                     }
//                     .receipt-title h3 {
//                         color: black !important;
//                     }
//                     .seat-number {
//                         background: none !important;
//                         border: 1px solid #000 !important;
//                     }
//                 }

//                 @media (max-width: 768px) {
//                     .schedule-container {
//                         max-width: 95%;
//                         margin: 20px auto;
//                         padding: 0 15px;
//                     }
                    
//                     .grid-2,
//                     .bus-details-grid,
//                     .summary-grid,
//                     .receipt-grid {
//                         grid-template-columns: 1fr;
//                     }
                    
//                     .receipt {
//                         padding: 20px;
//                     }
                    
//                     .receipt-item {
//                         flex-direction: column;
//                         align-items: flex-start;
//                         gap: 5px;
//                     }
                    
//                     .receipt-value {
//                         text-align: left;
//                     }
                    
//                     .payment-qr-container {
//                         padding: 20px;
//                     }
                    
//                     .qr-code img {
//                         width: 180px;
//                         height: 180px;
//                     }
                    
//                     .button-group,
//                     .receipt-actions {
//                         flex-direction: column;
//                     }
                    
//                     .verify-btn {
//                         min-width: 200px;
//                         padding: 12px 20px;
//                         font-size: 15px;
//                     }
                    
//                     .seat-details {
//                         grid-column: span 1;
//                     }
                    
//                     .fare-item-summary {
//                         grid-column: span 1;
//                     }
                    
//                     .fare-details {
//                         flex-direction: column;
//                         gap: 10px;
//                     }
//                 }
//             `}</style>
//         </div>
//     )
// }

// export default Schedule

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import Image from './upi.jpg';
import Image2 from './gpay2.jpg';

const Schedule = ({ userId }) => {
    const [buses, setBuses] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [bookingLoading, setBookingLoading] = useState(false)
    const [verifying, setVerifying] = useState(false)

    const [selectedBusId, setSelectedBusId] = useState('')
    const [selectedBusDetails, setSelectedBusDetails] = useState(null)
    const [bookingDate, setBookingDate] = useState('')
    const [bookingTime, setBookingTime] = useState('')
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [humanVerified, setHumanVerified] = useState(false)

    const [isBookingClosed, setIsBookingClosed] = useState(false)
    const [bookingConfirmed, setBookingConfirmed] = useState(false)
    const [bookingReceipt, setBookingReceipt] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState('card')

    const navigate = useNavigate()
    const location = useLocation()
    
    // Check if coming from seat selection with all details
    const { 
        seatId: incomingSeatId, 
        busId: incomingBusId, 
        bookingDate: incomingDate, 
        bookingTime: incomingTime,
        seatNumber: incomingSeatNumber,
        // Bus details from seats page
        route: incomingRoute,
        depot: incomingDepot,
        fare: incomingFare,
        dayOfWeek: incomingDayOfWeek,
        busNumber: incomingBusNumber,
        // Additional bus details from BusList
        busType: incomingBusType,
        departureTime: incomingDepartureTime,
        arrivalTime: incomingArrivalTime,
        capacity: incomingCapacity,
        passengers: incomingPassengers,
        occupancyRate: incomingOccupancyRate,
        distanceKm: incomingDistanceKm,
        revenue: incomingRevenue
    } = location.state || {}
    
    const [seatId, setSeatId] = useState(incomingSeatId || null)
    const [seatNumber, setSeatNumber] = useState(incomingSeatNumber || null)
    const [busIdFromSeat, setBusIdFromSeat] = useState(incomingBusId || null)
    const [showConfirmation, setShowConfirmation] = useState(!!incomingSeatId)

    // ================= FETCH BUSES =================
    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const response = await axios.get('/api/buses/')
                setBuses(response.data)
                
                // If coming from seat selection, auto-select that bus
                if (incomingBusId) {
                    setSelectedBusId(String(incomingBusId))
                    const bus = response.data.find(b => b.id === parseInt(incomingBusId) || b.bus_id === incomingBusId)
                    if (bus) {
                        setSelectedBusDetails(bus)
                        setBookingDate(incomingDate || bus.date)
                        // Don't set bookingTime from incomingTime yet - let user select it
                        setBookingTime('')
                    } else {
                        // If bus not found in API response, create bus details from incoming data
                        setSelectedBusDetails({
                            id: incomingBusId,
                            bus_id: incomingBusNumber || incomingBusId,
                            route: incomingRoute || 'N/A',
                            depot: incomingDepot || 'N/A',
                            fare_per_passenger: incomingFare || 'N/A',
                            day_of_week: incomingDayOfWeek || 'N/A',
                            date: incomingDate || '',
                            bus_type: incomingBusType || 'Standard',
                            departure_time: incomingDepartureTime || 'N/A',
                            arrival_time: incomingArrivalTime || 'N/A',
                            capacity: incomingCapacity || 0,
                            passengers: incomingPassengers || 0,
                            occupancy_rate: incomingOccupancyRate || 0,
                            distance_km: incomingDistanceKm || 0,
                            revenue: incomingRevenue || 0
                        })
                        setBookingDate(incomingDate || '')
                        setBookingTime('')
                    }
                }
            } catch {
                setError('Failed to load buses')
            } finally {
                setIsLoading(false)
            }
        }
        fetchBuses()
    }, [])

    useEffect(() => {
        if (incomingSeatId) {
            setSeatId(incomingSeatId)
            setSeatNumber(incomingSeatNumber)
            setBusIdFromSeat(incomingBusId)
            setBookingDate(incomingDate || '')
            // Don't set bookingTime from incomingTime - user needs to select it fresh
            setBookingTime('')
            setShowConfirmation(true)
        }
    }, [incomingSeatId, incomingSeatNumber, incomingBusId, incomingDate, incomingTime])

    // ================= TIME LOCK LOGIC =================
    const checkBookingTime = (date, time) => {
        if (!date || !time) {
            setIsBookingClosed(false)
            setError(null)
            return false
        }

        try {
            const [y, m, d] = date.split('-').map(Number)
            const [hh, mm] = time.split(':').map(Number)
            
            const bookingDateTime = new Date(y, m - 1, d, hh, mm, 0)
            
            if (isNaN(bookingDateTime.getTime())) {
                setIsBookingClosed(false)
                setError(null)
                return false
            }

            const now = new Date()

            if (now >= bookingDateTime) {
                setIsBookingClosed(true)
                setError('Booking time has passed. Please select a future time.')
                return true
            }

            setIsBookingClosed(false)
            setError(null)
            return false
        } catch (err) {
            setIsBookingClosed(false)
            setError(null)
            return false
        }
    }

    useEffect(() => {
        if (bookingDate && bookingTime) {
            checkBookingTime(bookingDate, bookingTime)
        } else {
            setIsBookingClosed(false)
            setError(null)
        }
    }, [bookingDate, bookingTime])

    // ================= HELPER: Extract Receipt Data =================
    const buildReceiptFromResponse = (data) => {
        const seatData = data?.seat || {}
        const busData = seatData?.bus || {}
        
        // Use incoming data first, then API data, then selected bus details
        const receipt = {
            bookingId: data?.id || data?.booking_id || 'N/A',
            bookingTime: data?.booking_time ? new Date(data.booking_time).toLocaleString() : new Date().toLocaleString(),
            user: data?.user?.username || data?.user || 'Guest',
            seatNumber: seatNumber || seatData?.seat_number || seatId || 'N/A',
            route: incomingRoute || busData?.route || selectedBusDetails?.route || 'N/A',
            busId: incomingBusNumber || busData?.bus_id || selectedBusDetails?.bus_id || incomingBusId || 'N/A',
            depot: incomingDepot || busData?.depot || selectedBusDetails?.depot || 'N/A',
            date: bookingDate || busData?.date || selectedBusDetails?.date || 'N/A',
            time: bookingTime || data?.travel_time || 'N/A',
            fare: incomingFare || busData?.fare_per_passenger || selectedBusDetails?.fare_per_passenger || 'N/A',
            dayOfWeek: incomingDayOfWeek || busData?.day_of_week || selectedBusDetails?.day_of_week || 'N/A',
            busType: incomingBusType || busData?.bus_type || selectedBusDetails?.bus_type || 'Standard',
            departureTime: incomingDepartureTime || busData?.departure_time || selectedBusDetails?.departure_time || 'N/A',
            arrivalTime: incomingArrivalTime || busData?.arrival_time || selectedBusDetails?.arrival_time || 'N/A',
            paymentMethod: paymentMethod
        }
        return receipt
    }

    // ================= BUS SELECT =================
    const handleBusSelect = (e) => {
        const busId = e.target.value
        setSelectedBusId(busId)
        setBusIdFromSeat(busId)

        const bus = buses.find(b => b.id === parseInt(busId))
        setSelectedBusDetails(bus || null)

        setBookingDate(bus?.date || '')
        setBookingTime('')
        setIsBookingClosed(false)
        setError(null)
        setAgreedToTerms(false)
        setHumanVerified(false)
    }

    // ================= HUMAN VERIFICATION =================
    const handleHumanVerification = () => {
        if (!humanVerified) {
            setVerifying(true)
            // Simulate verification process
            setTimeout(() => {
                setHumanVerified(true)
                setVerifying(false)
            }, 1500)
        }
    }

    // ================= CONFIRM BOOKING =================
    const confirmBooking = async () => {
        // Reset any previous errors
        setError(null)
        
        if (!seatId) {
            setError('Seat information missing. Please go back and select a seat.')
            return
        }

        if (!bookingTime) {
            setError('Please select a travel time')
            return
        }

        if (!agreedToTerms) {
            setError('Please agree to booking terms')
            return
        }

        if (!paymentMethod) {
            setError('Please select a payment method')
            return
        }

        if (!humanVerified) {
            setError('Please complete human verification')
            return
        }

        // Check if booking time has passed
        const timeHasPassed = checkBookingTime(bookingDate, bookingTime)
        if (timeHasPassed) {
            setError('Booking time has passed. Please select a future time.')
            return
        }

        setBookingLoading(true)

        try {
            // ACTUAL API CALL TO BOOK THE SEAT
            const response = await axios.post('/api/booking/', { 
                seat: seatId, 
                travel_time: bookingTime 
            }, { withCredentials: true })

            // If API call is successful, book the seat
            if (response.status === 201 || response.status === 200) {
                // First, mark the seat as booked
                try {
                    // Update seat status to 'booked'
                    await axios.patch(`/api/seats/${seatId}/`, {
                        status: 'booked'
                    }, { withCredentials: true })

                    // Now create the receipt from the actual API response
                    const receipt = buildReceiptFromResponse(response.data)
                    setBookingReceipt(receipt)
                    setBookingConfirmed(true)
                    setError(null)
                    
                } catch (seatError) {
                    console.error('Failed to update seat status:', seatError)
                    // Even if seat update fails, still show booking confirmation
                    const receipt = buildReceiptFromResponse(response.data)
                    setBookingReceipt(receipt)
                    setBookingConfirmed(true)
                    setError(null)
                }
            } else {
                throw new Error('Booking failed with status: ' + response.status)
            }

        } catch (error) {
            let msg = 'Booking failed. Please try again.'
            const respData = error.response?.data
            if (respData) {
                msg = respData.error || respData.detail || JSON.stringify(respData)
            } else if (error.message) {
                msg = error.message
            }

            setError(msg)
            alert(msg)

            if (error.response?.status === 401) {
                navigate('/login')
            }
        } finally {
            setBookingLoading(false)
        }
    }

    // ================= PROCEED TO SEATS =================
    const proceedToSeats = () => {
        if (!selectedBusId || !bookingDate || !bookingTime || !agreedToTerms) {
            setError('Please complete all fields')
            return
        }

        if (isBookingClosed) {
            setError('Booking is closed for this schedule. Please select a future time.')
            return
        }

        if (!selectedBusDetails) {
            setError('Bus details not found. Please select a bus again.')
            return
        }

        // Get the actual bus ID from bus details
        const actualBusId = selectedBusDetails.bus_id || selectedBusDetails.busId || selectedBusDetails.id;
        
        if (!actualBusId) {
            setError('Bus ID not found in bus details. Please select a valid bus.')
            return
        }

        // Navigate to the bus seats page with all bus details
        navigate(`/bus/${actualBusId}`, {
            state: {
                busId: actualBusId,
                bookingDate,
                bookingTime,
                route: selectedBusDetails.route,
                depot: selectedBusDetails.depot,
                fare: selectedBusDetails.fare_per_passenger,
                dayOfWeek: selectedBusDetails.day_of_week,
                busNumber: actualBusId,
                busType: selectedBusDetails.bus_type,
                departureTime: selectedBusDetails.departure_time,
                arrivalTime: selectedBusDetails.arrival_time,
                capacity: selectedBusDetails.capacity,
                passengers: selectedBusDetails.passengers,
                occupancyRate: selectedBusDetails.occupancy_rate,
                distanceKm: selectedBusDetails.distance_km,
                revenue: selectedBusDetails.revenue,
                fromSchedule: true
            }
        })
    }

    // Check if confirm booking button should be enabled
    const isConfirmButtonEnabled = () => {
        return bookingTime && agreedToTerms && paymentMethod && humanVerified && !bookingLoading && !isBookingClosed
    }

    // Reset human verification when payment method changes
    useEffect(() => {
        setHumanVerified(false)
        setVerifying(false)
    }, [paymentMethod])

    // Function to get tomorrow's date in YYYY-MM-DD format
    const getTomorrowDate = () => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const y = tomorrow.getFullYear()
        const m = (tomorrow.getMonth() + 1).toString().padStart(2, '0')
        const d = tomorrow.getDate().toString().padStart(2, '0')
        return `${y}-${m}-${d}`
    }

    if (isLoading) return <p className="loading">Loading buses...</p>

    return (
        <div className="schedule-container">
            <h2>🚌 Bus Schedule {seatId ? '- Confirm Booking' : ''}</h2>

            {error && <div className="error-message">{error}</div>}

            <div className="card">
                {/* Receipt Display - This should be at the top when booking is confirmed */}
                {bookingConfirmed && bookingReceipt ? (
                    <div className="receipt-container" id="receipt-section">
                        <div className="receipt">
                            <div className="receipt-header">
                                <div className="receipt-title">
                                    <h3>✅ Booking Confirmed!</h3>
                                    <div className="receipt-subtitle">Thank you for your booking</div>
                                </div>
                                <div className="payment-method-badge">
                                    <span className="badge-icon">💳</span>
                                    Paid via {paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'googlepay' ? 'Google Pay' : 'Credit/Debit Card'}
                                </div>
                            </div>
                            
                            <div className="receipt-body">
                                <div className="receipt-section">
                                    <h4>Booking Details</h4>
                                    <div className="receipt-grid">
                                        <div className="receipt-item">
                                            <span className="receipt-label">Booking ID:</span>
                                            <span className="receipt-value highlight">{bookingReceipt.bookingId}</span>
                                        </div>
                                        <div className="receipt-item">
                                            <span className="receipt-label">Booking Time:</span>
                                            <span className="receipt-value">{bookingReceipt.bookingTime}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="receipt-section">
                                    <h4>Passenger Details</h4>
                                    <div className="receipt-grid">
                                        <div className="receipt-item">
                                            <span className="receipt-label">Name:</span>
                                            <span className="receipt-value">{bookingReceipt.user}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="receipt-section">
                                    <h4>Journey Details</h4>
                                    <div className="receipt-grid">
                                        <div className="receipt-item">
                                            <span className="receipt-label">Bus ID:</span>
                                            <span className="receipt-value">{bookingReceipt.busId}</span>
                                        </div>
                                        <div className="receipt-item">
                                            <span className="receipt-label">Route:</span>
                                            <span className="receipt-value">{bookingReceipt.route}</span>
                                        </div>
                                        <div className="receipt-item">
                                            <span className="receipt-label">Depot:</span>
                                            <span className="receipt-value">{bookingReceipt.depot}</span>
                                        </div>
                                        <div className="receipt-item">
                                            <span className="receipt-label">Seat Number:</span>
                                            <span className="receipt-value seat-number">{bookingReceipt.seatNumber}</span>
                                        </div>
                                        <div className="receipt-item">
                                            <span className="receipt-label">Date:</span>
                                            <span className="receipt-value">{bookingReceipt.date}</span>
                                        </div>
                                        <div className="receipt-item">
                                            <span className="receipt-label">Time:</span>
                                            <span className="receipt-value">{bookingReceipt.time}</span>
                                        </div>
                                        <div className="receipt-item">
                                            <span className="receipt-label">Day:</span>
                                            <span className="receipt-value">{bookingReceipt.dayOfWeek}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="receipt-section payment-section">
                                    <h4>Payment Details</h4>
                                    <div className="receipt-grid">
                                        <div className="receipt-item">
                                            <span className="receipt-label">Payment Method:</span>
                                            <span className="receipt-value">
                                                {paymentMethod === 'upi' ? 'UPI Payment' : 
                                                 paymentMethod === 'googlepay' ? 'Google Pay' : 
                                                 'Credit/Debit Card'}
                                            </span>
                                        </div>
                                        <div className="receipt-item fare-item">
                                            <span className="receipt-label">Total Fare:</span>
                                            <span className="receipt-value fare-amount">₹{bookingReceipt.fare}</span>
                                        </div>
                                        <div className="receipt-item status-item">
                                            <span className="receipt-label">Payment Status:</span>
                                            <span className="receipt-value status-paid">✅ Paid</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="receipt-footer">
                                <p className="footer-note">
                                    Please keep this receipt for your records. Present it at the boarding point.
                                </p>
                                <div className="receipt-actions">
                                    <button 
                                        className="print-btn"
                                        onClick={() => {
                                            // First scroll to receipt section
                                            document.getElementById('receipt-section')?.scrollIntoView({ behavior: 'smooth' });
                                            // Then trigger print after a small delay
                                            setTimeout(() => window.print(), 100);
                                        }}
                                    >
                                        🖨️ Print Receipt
                                    </button>
                                    <button 
                                        className="continue-btn"
                                        onClick={() => navigate('/my-bookings')}
                                    >
                                        📋 View My Bookings
                                    </button>
                                    <button 
                                        className="home-btn"
                                        onClick={() => navigate('/')}
                                    >
                                        🏠 Back to Home
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* If coming from seat selection, show confirmation page */}
                        {showConfirmation && seatId ? (
                            <div>
                                <h3>Complete Your Booking</h3>
                                
                                <div className="booking-summary">
                                    <h4>Booking Summary</h4>
                                    <div className="summary-grid">
                                        {/* Seat Details */}
                                        <div className="summary-item seat-details">
                                            <span className="summary-label">Selected Seat:</span>
                                            <span className="summary-value seat-highlight">{seatNumber || seatId}</span>
                                        </div>
                                        
                                        {/* Bus Route and ID */}
                                        <div className="summary-item">
                                            <span className="summary-label">Bus Route:</span>
                                            <span className="summary-value route-text">{incomingRoute || selectedBusDetails?.route || 'N/A'}</span>
                                        </div>
                                        
                                        <div className="summary-item">
                                            <span className="summary-label">Bus ID:</span>
                                            <span className="summary-value bus-id">{incomingBusNumber || selectedBusDetails?.bus_id || incomingBusId || 'N/A'}</span>
                                        </div>
                                        
                                        {/* Depot and Bus Type */}
                                        <div className="summary-item">
                                            <span className="summary-label">Depot:</span>
                                            <span className="summary-value">{incomingDepot || selectedBusDetails?.depot || 'N/A'}</span>
                                        </div>
                                        
                                        <div className="summary-item">
                                            <span className="summary-label">Bus Type:</span>
                                            <span className="summary-value bus-type">{incomingBusType || selectedBusDetails?.bus_type || 'Standard'}</span>
                                        </div>
                                        
                                        {/* Schedule Details */}
                                        <div className="summary-item">
                                            <span className="summary-label">Journey Date:</span>
                                            <span className="summary-value">{bookingDate}</span>
                                        </div>
                                        
                                        <div className="summary-item">
                                            <span className="summary-label">Day of Week:</span>
                                            <span className="summary-value day-highlight">{incomingDayOfWeek || selectedBusDetails?.day_of_week || 'N/A'}</span>
                                        </div>
                                        
                                        {/* Time Details */}
                                        <div className="summary-item">
                                            <span className="summary-label">Departure Time:</span>
                                            <span className="summary-value time-text">{incomingDepartureTime || selectedBusDetails?.departure_time || 'N/A'}</span>
                                        </div>
                                        
                                        <div className="summary-item">
                                            <span className="summary-label">Arrival Time:</span>
                                            <span className="summary-value time-text">{incomingArrivalTime || selectedBusDetails?.arrival_time || 'N/A'}</span>
                                        </div>
                                        
                                        {/* Additional Bus Info */}
                                        <div className="summary-item">
                                            <span className="summary-label">Capacity:</span>
                                            <span className="summary-value">{incomingCapacity || selectedBusDetails?.capacity || 'N/A'}</span>
                                        </div>
                                        
                                        <div className="summary-item">
                                            <span className="summary-label">Distance:</span>
                                            <span className="summary-value">{incomingDistanceKm || selectedBusDetails?.distance_km || 'N/A'} km</span>
                                        </div>
                                        
                                        {/* Fare - Full Width */}
                                        <div className="summary-item fare-item-summary">
                                            <div className="fare-details">
                                                <span className="summary-label">Total Fare:</span>
                                                <span className="summary-value fare-highlight">₹{incomingFare || selectedBusDetails?.fare_per_passenger || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Select Travel Time <span className="required">*</span></label>
                                    <input
                                        type="time"
                                        value={bookingTime}
                                        onChange={(e) => {
                                            const newTime = e.target.value
                                            setBookingTime(newTime)
                                            
                                            if (newTime && bookingDate) {
                                                checkBookingTime(bookingDate, newTime)
                                            }
                                        }}
                                        min="00:00"
                                        max="23:59"
                                        // Suggest future time by default
                                        placeholder="Select future time"
                                    />
                                    {isBookingClosed && (
                                        <p className="time-warning" style={{color: '#e74c3c', fontSize: '14px', marginTop: '5px'}}>
                                            ⚠️ This time has already passed. Please select a future time.
                                        </p>
                                    )}
                                    {!isBookingClosed && bookingTime && (
                                        <p className="time-valid" style={{color: '#2ecc71', fontSize: '14px', marginTop: '5px'}}>
                                            ✅ This time is available for booking
                                        </p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Date <span className="required">*</span></label>
                                    <input
                                        type="date"
                                        value={bookingDate}
                                        min={getTomorrowDate()} // Set min to tomorrow to ensure future date
                                        onChange={e => setBookingDate(e.target.value)}
                                    />
                                    <small style={{color: '#666', marginTop: '5px'}}>
                                        Select a future date for booking
                                    </small>
                                </div>

                                <div className="form-group">
                                    <label>Select Payment Method <span className="required">*</span></label>
                                    <select 
                                        value={paymentMethod} 
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        required
                                    >
                                        <option value="">-- Select Payment Method --</option>
                                        <option value="card">Credit/Debit Card</option>
                                        <option value="upi">UPI</option>
                                        <option value="googlepay">Google Pay</option>
                                    </select>
                                </div>

                                {paymentMethod === 'upi' && (
                                    <div className="payment-qr-container">
                                        <h4>Scan UPI QR Code to Pay</h4>
                                        <div className="qr-code">
                                            <img src={Image} alt="UPI QR" width="200" height="200"/>
                                        </div>
                                        <p className="qr-instruction">Scan the QR code using any UPI app to complete payment</p>
                                    </div>
                                )}

                                {paymentMethod === 'googlepay' && (
                                    <div className="payment-qr-container">
                                        <h4>Scan Google Pay QR Code</h4>
                                        <div className="qr-code">
                                            <img src={Image2} alt="Google Pay QR" width="200" height="200"/>
                                        </div>
                                        <p className="qr-instruction">Scan the QR code using Google Pay app to complete payment</p>
                                    </div>
                                )}

                                <div className="verification-container">
                                    <h4>Human Verification <span className="required">*</span></h4>
                                    <div className="verification-checkbox">
                                        {!humanVerified ? (
                                            <button
                                                className="verify-btn"
                                                onClick={handleHumanVerification}
                                                disabled={verifying}
                                            >
                                                {verifying ? (
                                                    <>
                                                        <span className="verifying-dots">
                                                            <span className="dot"></span>
                                                            <span className="dot"></span>
                                                            <span className="dot"></span>
                                                        </span>
                                                        Verifying...
                                                    </>
                                                ) : (
                                                    'Click to Verify You Are Human'
                                                )}
                                            </button>
                                        ) : (
                                            <div className="verified-badge">
                                                <span className="verified-icon">✅</span>
                                                <span className="verified-text">Verified</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="terms-container">
                                    <div className="terms-checkbox">
                                        <input
                                            type="checkbox"
                                            id="termsAgreement"
                                            checked={agreedToTerms}
                                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        />
                                        <label htmlFor="termsAgreement">
                                            <span className="checkbox-custom"></span>
                                            <span className="checkbox-label">
                                                I agree to the booking terms and conditions <span className="required">*</span>
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="button-group">
                                    <button
                                        className="cancel-btn"
                                        onClick={() => navigate(-1)}
                                        disabled={bookingLoading}
                                    >
                                        ↩ Back
                                    </button>
                                    <button
                                        className="submit-btn"
                                        disabled={!isConfirmButtonEnabled()}
                                        onClick={confirmBooking}
                                    >
                                        {bookingLoading ? 'Processing...' : '✅ Confirm Booking'}
                                    </button>
                                </div>

                                <div className="form-notes">
                                    <p><small><span className="required">*</span> Required fields</small></p>
                                    <p><small>Note: Booking will be confirmed only after payment verification</small></p>
                                    {isBookingClosed && (
                                        <p style={{color: '#e74c3c', marginTop: '5px'}}>
                                            <small>⚠️ Booking time has passed. Please select a future time to proceed.</small>
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // Regular schedule selection flow
                            <>
                                <div className="form-group">
                                    <label>Select Bus Route</label>
                                    <select value={selectedBusId} onChange={handleBusSelect}>
                                        <option value="">-- Choose a bus --</option>
                                        {buses.map(bus => (
                                            <option key={bus.id} value={bus.id}>
                                                {bus.route} - {bus.bus_id} ({bus.date})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedBusDetails && (
                                    <div>
                                        <div className="bus-info">
                                            <h4>Bus Details</h4>
                                            <div className="bus-details-grid">
                                                <div className="bus-detail">
                                                    <span className="detail-label">Route:</span>
                                                    <span className="detail-value">{selectedBusDetails.route}</span>
                                                </div>
                                                <div className="bus-detail">
                                                    <span className="detail-label">Depot:</span>
                                                    <span className="detail-value">{selectedBusDetails.depot}</span>
                                                </div>
                                                <div className="bus-detail">
                                                    <span className="detail-label">Fare:</span>
                                                    <span className="detail-value">₹{selectedBusDetails.fare_per_passenger}</span>
                                                </div>
                                                <div className="bus-detail">
                                                    <span className="detail-label">Day:</span>
                                                    <span className="detail-value">{selectedBusDetails.day_of_week}</span>
                                                </div>
                                                <div className="bus-detail">
                                                    <span className="detail-label">Bus Type:</span>
                                                    <span className="detail-value">{selectedBusDetails.bus_type || 'Standard'}</span>
                                                </div>
                                                <div className="bus-detail">
                                                    <span className="detail-label">Capacity:</span>
                                                    <span className="detail-value">{selectedBusDetails.capacity || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid-2">
                                            <div className="form-group">
                                                <label>Date <span className="required">*</span></label>
                                                <input
                                                    type="date"
                                                    value={bookingDate}
                                                    min={getTomorrowDate()} // Set min to tomorrow to ensure future date
                                                    onChange={e => setBookingDate(e.target.value)}
                                                />
                                                <small style={{color: '#666', marginTop: '5px'}}>
                                                    Select a future date for booking
                                                </small>
                                            </div>

                                            <div className="form-group">
                                                <label>Time <span className="required">*</span></label>
                                                <input
                                                    type="time"
                                                    value={bookingTime}
                                                    onChange={e => {
                                                        const newTime = e.target.value
                                                        setBookingTime(newTime)
                                                        checkBookingTime(bookingDate, newTime)
                                                    }}
                                                    min="00:00"
                                                    max="23:59"
                                                />
                                                {isBookingClosed && (
                                                    <p className="time-warning" style={{color: '#e74c3c', fontSize: '14px', marginTop: '5px'}}>
                                                        ⚠️ This time has already passed. Please select a future time.
                                                    </p>
                                                )}
                                                {!isBookingClosed && bookingTime && (
                                                    <p className="time-valid" style={{color: '#2ecc71', fontSize: '14px', marginTop: '5px'}}>
                                                        ✅ This time is available for booking
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="terms-container">
                                            <div className="terms-checkbox">
                                                <input
                                                    type="checkbox"
                                                    id="scheduleTerms"
                                                    checked={agreedToTerms}
                                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                                />
                                                <label htmlFor="scheduleTerms">
                                                    <span className="checkbox-custom"></span>
                                                    <span className="checkbox-label">
                                                        I agree to the booking terms and conditions
                                                    </span>
                                                </label>
                                            </div>
                                        </div>

                                        <button
                                            className="submit-btn"
                                            disabled={
                                                isBookingClosed ||
                                                !bookingDate ||
                                                !bookingTime ||
                                                !agreedToTerms
                                            }
                                            onClick={proceedToSeats}
                                        >
                                            {isBookingClosed ? '⏰ Booking Closed' : '🎯 Proceed to Seat Selection'}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>

            {/* ================= STYLES ================= */}
            <style>{`
                body { 
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                .schedule-container {
                    max-width: 700px;
                    margin: 30px auto;
                    padding: 0 20px;
                }

                h2, h3 { 
                    text-align: center; 
                    margin-bottom: 20px; 
                    color: #2c3e50;
                }
                
                h2 {
                    font-size: 28px;
                    background: linear-gradient(45deg, #3498db, #2ecc71);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                h3 { 
                    font-size: 22px;
                    color: #34495e;
                }
                
                h4 {
                    color: #2c3e50;
                    margin-bottom: 15px;
                    font-size: 18px;
                }

                .card {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    min-height: 300px;
                    border: 1px solid #e0e0e0;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 20px;
                }

                label { 
                    font-weight: 600; 
                    margin-bottom: 8px;
                    color: #2c3e50;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .required {
                    color: #e74c3c;
                    font-weight: bold;
                }

                select, input {
                    padding: 12px;
                    border-radius: 8px;
                    border: 2px solid #ddd;
                    font-size: 15px;
                    transition: border-color 0.3s;
                }

                select:focus, input:focus {
                    outline: none;
                    border-color: #3498db;
                    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
                }

                .bus-info {
                    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
                    padding: 20px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                    border-left: 4px solid #2196f3;
                }

                .bus-details-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                }

                .bus-detail {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid rgba(33, 150, 243, 0.2);
                }

                .bus-detail:last-child {
                    border-bottom: none;
                }

                .detail-label {
                    font-weight: 600;
                    color: #1565c0;
                }

                .detail-value {
                    color: #0d47a1;
                    font-weight: 500;
                }

                /* Updated Booking Summary Styles */
                .booking-summary {
                    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
                    padding: 20px;
                    border-radius: 10px;
                    margin-bottom: 25px;
                    border-left: 4px solid #4caf50;
                }

                .booking-summary h4 {
                    color: #2e7d32;
                    margin-bottom: 20px;
                    font-size: 20px;
                    text-align: center;
                }

                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                }

                .summary-item {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .summary-label {
                    font-weight: 600;
                    color: #2e7d32;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .summary-value {
                    color: #1b5e20;
                    font-weight: 500;
                    font-size: 15px;
                }

                /* Special styling for seat details */
                .seat-details {
                    grid-column: span 2;
                    text-align: center;
                    margin-bottom: 10px;
                }

                .seat-highlight {
                    background: #4caf50;
                    color: white;
                    padding: 8px 20px;
                    border-radius: 25px;
                    font-weight: bold;
                    font-size: 18px;
                    display: inline-block;
                    min-width: 80px;
                    text-align: center;
                }

                /* Route and ID styling */
                .route-text {
                    font-weight: 600;
                    color: #1565c0;
                    font-size: 16px;
                }

                .bus-id {
                    background: #e3f2fd;
                    padding: 4px 10px;
                    border-radius: 6px;
                    color: #0d47a1;
                    font-weight: 600;
                }

                .bus-type {
                    background: #fff3e0;
                    padding: 4px 10px;
                    border-radius: 6px;
                    color: #f57c00;
                    font-weight: 600;
                }

                .day-highlight {
                    background: #f3e5f5;
                    padding: 4px 10px;
                    border-radius: 6px;
                    color: #7b1fa2;
                    font-weight: 600;
                }

                .time-text {
                    font-weight: 600;
                    color: #d84315;
                }

                /* Fare styling */
                .fare-item-summary {
                    grid-column: span 2;
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 10px;
                    margin-top: 10px;
                    text-align: center;
                }

                .fare-details {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .fare-highlight {
                    color: #e74c3c;
                    font-weight: bold;
                    font-size: 22px;
                }

                .grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-bottom: 20px;
                }

                /* Custom Checkbox Styles */
                .terms-container {
                    margin: 20px 0;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border: 1px solid #e9ecef;
                }

                .terms-checkbox {
                    position: relative;
                    margin-bottom: 10px;
                }

                .terms-checkbox input[type="checkbox"] {
                    display: none;
                }

                .terms-checkbox label {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    position: relative;
                    padding-left: 35px;
                    min-height: 24px;
                }

                .checkbox-custom {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 24px;
                    height: 24px;
                    background: white;
                    border: 2px solid #ddd;
                    border-radius: 6px;
                    transition: all 0.3s;
                }

                .terms-checkbox input[type="checkbox"]:checked + label .checkbox-custom {
                    background: #4caf50;
                    border-color: #4caf50;
                }

                .terms-checkbox input[type="checkbox"]:checked + label .checkbox-custom::after {
                    content: '✓';
                    position: absolute;
                    color: white;
                    font-size: 16px;
                    font-weight: bold;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }

                .checkbox-label {
                    color: #2c3e50;
                    font-weight: 500;
                    line-height: 1.4;
                }

                /* Human Verification Styles */
                .verification-container {
                    margin: 20px 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #fff3e0 0%, #ffecb3 100%);
                    border-radius: 10px;
                    border: 2px solid #ff9800;
                }

                .verification-checkbox {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 60px;
                }

                .verify-btn {
                    background: linear-gradient(45deg, #ff9800, #f57c00);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    min-width: 250px;
                    justify-content: center;
                }

                .verify-btn:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 20px rgba(255, 152, 0, 0.3);
                }

                .verify-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .verifying-dots {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                }

                .dot {
                    width: 8px;
                    height: 8px;
                    background: white;
                    border-radius: 50%;
                    animation: pulse 1.5s infinite ease-in-out;
                }

                .dot:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .dot:nth-child(3) {
                    animation-delay: 0.4s;
                }

                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0.7;
                    }
                    50% {
                        transform: scale(1.3);
                        opacity: 1;
                    }
                }

                .verified-badge {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: linear-gradient(45deg, #4caf50, #2e7d32);
                    color: white;
                    padding: 12px 25px;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 16px;
                    animation: verifiedAppear 0.5s ease;
                }

                .verified-icon {
                    font-size: 20px;
                }

                .verified-text {
                    font-size: 16px;
                }

                @keyframes verifiedAppear {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .button-group {
                    display: flex;
                    gap: 15px;
                    margin: 25px 0 15px;
                }

                .submit-btn, .cancel-btn {
                    flex: 1;
                    padding: 14px;
                    border: none;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .submit-btn {
                    background: linear-gradient(45deg, #2ecc71, #27ae60);
                    color: white;
                }

                .cancel-btn {
                    background: linear-gradient(45deg, #e74c3c, #c0392b);
                    color: white;
                }

                .submit-btn:disabled, .cancel-btn:disabled {
                    background: #bdc3c7;
                    cursor: not-allowed;
                    transform: none !important;
                    box-shadow: none !important;
                }

                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 15px rgba(46, 204, 113, 0.4);
                }

                .cancel-btn:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 15px rgba(231, 76, 60, 0.4);
                }

                .error-message {
                    background: linear-gradient(45deg, #ffcdd2, #ef9a9a);
                    color: #c62828;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    text-align: center;
                    border-left: 4px solid #c62828;
                    font-weight: 500;
                }

                .form-notes {
                    margin-top: 20px;
                    padding: 12px;
                    background: #f1f8e9;
                    border-radius: 8px;
                    font-size: 13px;
                    color: #689f38;
                    border-left: 4px solid #8bc34a;
                }

                .payment-qr-container {
                    text-align: center;
                    padding: 25px;
                    margin: 25px 0;
                    background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
                    border-radius: 12px;
                    border: 2px solid #7b1fa2;
                }

                .payment-qr-container h4 {
                    color: #7b1fa2;
                    margin-bottom: 20px;
                }

                .qr-code {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 20px;
                    padding: 15px;
                    background: white;
                    border-radius: 10px;
                    border: 2px dashed #9c27b0;
                }

                .qr-instruction {
                    font-size: 14px;
                    color: #6a1b9a;
                    margin-top: 10px;
                    font-weight: 500;
                }

                /* Receipt Styles */
                .receipt-container {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px 0;
                }

                .receipt {
                    background: white;
                    border: 2px solid #4caf50;
                    border-radius: 15px;
                    padding: 30px;
                    width: 100%;
                    max-width: 550px;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                    animation: fadeIn 0.5s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .receipt-header {
                    text-align: center;
                    padding-bottom: 20px;
                    margin-bottom: 25px;
                    border-bottom: 3px dashed #4caf50;
                }

                .receipt-title h3 {
                    margin: 0;
                    color: #2e7d32;
                    font-size: 26px;
                }

                .receipt-subtitle {
                    color: #666;
                    margin-top: 5px;
                    font-size: 14px;
                }

                .payment-method-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: linear-gradient(45deg, #2196f3, #1976d2);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 25px;
                    font-weight: 600;
                    font-size: 14px;
                    margin-top: 15px;
                }

                .badge-icon {
                    font-size: 16px;
                }

                .receipt-body {
                    margin-bottom: 25px;
                }

                .receipt-section {
                    margin-bottom: 25px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #eee;
                }

                .receipt-section:last-child {
                    border-bottom: none;
                }

                .receipt-section h4 {
                    color: #3498db;
                    margin-bottom: 15px;
                    font-size: 16px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .receipt-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                }

                .receipt-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                }

                .receipt-label {
                    font-weight: 600;
                    color: #555;
                    font-size: 14px;
                }

                .receipt-value {
                    color: #333;
                    text-align: right;
                    font-size: 14px;
                }

                .highlight {
                    color: #e74c3c;
                    font-weight: bold;
                    font-size: 15px;
                }

                .seat-number {
                    background: #e8f5e9;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-weight: bold;
                    color: #2e7d32;
                }

                .fare-item {
                    background: #f8f9fa;
                    padding: 12px;
                    border-radius: 8px;
                    margin-top: 10px;
                }

                .fare-amount {
                    font-size: 20px;
                    font-weight: bold;
                    color: #e74c3c;
                }

                .status-item {
                    background: #e8f5e9;
                    padding: 8px 12px;
                    border-radius: 8px;
                }

                .status-paid {
                    color: #2e7d32;
                    font-weight: bold;
                }

                .payment-section {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 10px;
                    border: 1px solid #e0e0e0;
                }

                .receipt-footer {
                    text-align: center;
                    padding-top: 20px;
                    border-top: 2px dashed #ddd;
                }

                .footer-note {
                    color: #666;
                    font-size: 13px;
                    margin-bottom: 20px;
                    font-style: italic;
                }

                .receipt-actions {
                    display: flex;
                    gap: 15px;
                    margin-top: 20px;
                }

                .print-btn, .continue-btn, .home-btn {
                    flex: 1;
                    padding: 14px;
                    border: none;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .print-btn {
                    background: linear-gradient(45deg, #2196f3, #1976d2);
                    color: white;
                }

                .continue-btn {
                    background: linear-gradient(45deg, #4caf50, #2e7d32);
                    color: white;
                }

                .home-btn {
                    background: linear-gradient(45deg, #9c27b0, #7b1fa2);
                    color: white;
                }

                .print-btn:hover, .continue-btn:hover, .home-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
                }

                .loading {
                    text-align: center;
                    font-size: 18px;
                    color: #666;
                    margin-top: 40px;
                }

                @media print {
                    body * { 
                        visibility: hidden; 
                        background: white !important;
                    }
                    .schedule-container, .schedule-container * { 
                        visibility: visible; 
                        background: white !important;
                        color: black !important;
                        box-shadow: none !important;
                    }
                    .schedule-container { 
                        position: absolute; 
                        left: 0; 
                        top: 0; 
                        width: 100%;
                        margin: 0;
                        padding: 0;
                    }
                    .receipt-actions, 
                    .receipt-footer .footer-note,
                    .receipt-header .payment-method-badge { 
                        display: none !important; 
                    }
                    .receipt { 
                        box-shadow: none !important; 
                        border: 2px solid #000 !important;
                        max-width: 100% !important;
                        margin: 0 !important;
                        padding: 20px !important;
                    }
                    .card {
                        box-shadow: none !important;
                        padding: 0 !important;
                        border: none !important;
                    }
                    .receipt-title h3 {
                        color: black !important;
                    }
                    .seat-number {
                        background: none !important;
                        border: 1px solid #000 !important;
                    }
                    .receipt-header {
                        border-bottom: 2px solid #000 !important;
                    }
                    .receipt-section {
                        border-bottom: 1px solid #000 !important;
                    }
                }

                @media (max-width: 768px) {
                    .schedule-container {
                        max-width: 95%;
                        margin: 20px auto;
                        padding: 0 15px;
                    }
                    
                    .grid-2,
                    .bus-details-grid,
                    .summary-grid,
                    .receipt-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .receipt {
                        padding: 20px;
                    }
                    
                    .receipt-item {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 5px;
                    }
                    
                    .receipt-value {
                        text-align: left;
                    }
                    
                    .payment-qr-container {
                        padding: 20px;
                    }
                    
                    .qr-code img {
                        width: 180px;
                        height: 180px;
                    }
                    
                    .button-group,
                    .receipt-actions {
                        flex-direction: column;
                    }
                    
                    .verify-btn {
                        min-width: 200px;
                        padding: 12px 20px;
                        font-size: 15px;
                    }
                    
                    .seat-details {
                        grid-column: span 1;
                    }
                    
                    .fare-item-summary {
                        grid-column: span 1;
                    }
                    
                    .fare-details {
                        flex-direction: column;
                        gap: 10px;
                    }
                }
            `}</style>
        </div>
    )
}

export default Schedule