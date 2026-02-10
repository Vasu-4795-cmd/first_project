// import React, { useState } from 'react'
// import axios from 'axios'
// import { useNavigate, useLocation } from 'react-router-dom'

// const LoginForm = ({ onLogin }) => {
//   const [form, setForm] = useState({
//     username: '',
//     password: '',
//   })

//   const [showPassword, setShowPassword] = useState(false)
//   const [message, setMessage] = useState('')
//   const [isLoading, setIsLoading] = useState(false)

//   const navigate = useNavigate()
//   const location = useLocation()
//   const from = location.state?.from?.pathname || '/'

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       // CSRF handling
//       try {
//         const csrfResp = await axios.get('/api/csrf/', { withCredentials: true })
//         if (csrfResp?.data?.csrfToken) {
//           axios.defaults.headers.common['X-CSRFToken'] =
//             csrfResp.data.csrfToken
//         }
//       } catch {}

//       const response = await axios.post('/api/login/', form, {
//         withCredentials: true,
//       })

//       setMessage('Login Success')

//       if (onLogin) {
//         onLogin(response.data.user_id)
//       }

//       navigate('/buses')
//     } catch (error) {
//       const msg =
//         error.response?.data?.error ||
//         error.response?.data?.detail ||
//         'Invalid credentials'
//       setMessage('Login Failed: ' + msg)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="space-bg flex items-center justify-center px-4" >
//       <div className="space-card max-w-md w-full p-8" id='loginblock'>
//         <img src="https://www.shutterstock.com/image-vector/bus-ticket-online-pay-smart-600nw-2598472987.jpg"/>
//         <h2 className="text-center text-3xl font-extrabold text-white-900 mb-6">
//           Sign in to your account
//         </h2>

//         <form className="space-y-6" onSubmit={handleSubmit}>
//           {/* Username */}
//           <div>
//             <label className="block text-sm font-medium text-white-700">
//               Username
//             </label>
//             <input
//               id='uname'
//               name="username"
//               type="text"
//               placeholder='Enter your user name'
//               required
//               value={form.username}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           {/* Password with Eye Toggle */}
//           <div>
//             <label className="block text-sm font-medium text-white-700">
//               Password
//             </label>

//             <div className="relative mt-1">
//               <input
//                 name="password"
//                 placeholder='Enter your password'
//                 type={showPassword ? 'text' : 'password'}
//                 required
//                 value={form.password}
//                 onChange={handleChange}
//                 className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//               />

//               {/* Eye Button */}
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-indigo-600"
//                 tabIndex={-1}
//               >
//                 {showPassword ? '🙈' : '👁️'}
//               </button>
//             </div>
//           </div>

//           {/* Message */}
//           {message && (
//             <div
//               className={`p-3 rounded-md text-sm ${
//                 message.includes('Success')
//                   ? 'bg-green-50 text-green-800'
//                   : 'bg-red-50 text-red-800'
//               }`}
//             >
//               {message}
//             </div>
//           )}

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full flex justify-center py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
//           >
//             {isLoading ? 'Signing in...' : 'Sign in'}
//           </button>
//           <p>Don't have an account?
//                   <a href="register"><u>Register</u></a>
//               </p>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default LoginForm


import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'

const LoginForm = ({ onLogin }) => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  /* ========== ADDED STATES ========== */
  const [showForgot, setShowForgot] = useState(false)
  const [resetStep, setResetStep] = useState(1)
  const [resetUsername, setResetUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [resetMsg, setResetMsg] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  /* ================================= */

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      try {
        const csrfResp = await axios.get('/api/csrf/', { withCredentials: true })
        if (csrfResp?.data?.csrfToken) {
          axios.defaults.headers.common['X-CSRFToken'] =
            csrfResp.data.csrfToken
        }
      } catch {}

      const response = await axios.post('/api/login/', form, {
        withCredentials: true,
      })

      setMessage('Login Success')

      if (onLogin) {
        onLogin(response.data.user_id)
      }

      navigate('/buses')
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        'Invalid credentials'
      setMessage('Login Failed: ' + msg)
    } finally {
      setIsLoading(false)
    }
  }

  /* ========== ADDED HANDLERS ========== */
  const handleVerifyUser = async (e) => {
    e.preventDefault()
    setResetLoading(true)

    try {
      await axios.post('/api/forgot-password/', {
        username: resetUsername,
      })
      setResetStep(2)
      setResetMsg('')
    } catch {
      setResetMsg('User not found')
    } finally {
      setResetLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setResetLoading(true)

    try {
      await axios.post('/api/reset-password/', {
        username: resetUsername,
        new_password: newPassword,
      })
      setResetMsg('Password updated successfully')
      setResetStep(1)
      setShowForgot(false)
    } catch {
      setResetMsg('Password reset failed')
    } finally {
      setResetLoading(false)
    }
  }
  /* ================================= */

  return (
    <div className="space-bg flex items-center justify-center px-4">
      <div className="space-card max-w-md w-full p-8" id="loginblock">
        <img src="https://www.shutterstock.com/image-vector/bus-ticket-online-pay-smart-600nw-2598472987.jpg" />

        <h2 className="text-center text-3xl font-extrabold text-white-900 mb-6">
          Sign in to your account
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* ====== ADDED USERNAME FIELD ====== */}
          <div>
            <label className="block text-sm font-medium text-white-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md"
              placeholder="Enter username"
            />
          </div>

          {/* ====== ADDED PASSWORD FIELD ====== */}
          <div>
            <label className="block text-sm font-medium text-white-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border rounded-md pr-10"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 text-gray-500"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowForgot(!showForgot)}
              className="text-sm text-indigo-300 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* ====== MESSAGE ====== */}
          {message && (
            <div className="text-sm text-center text-red-500">{message}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          

          <p>
            Don't have an account?
            <a href="register">
              <u>Register</u>
            </a>
          </p>
        </form>

        {/* ====== RESET FLOW UI (UNCHANGED) ====== */}
        {showForgot && (
          <div className="mt-6 space-y-4 border-t pt-4">
            {resetStep === 1 && (
              <form onSubmit={handleVerifyUser}>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={resetUsername}
                  onChange={(e) => setResetUsername(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full mt-3 py-2 bg-indigo-500 text-white rounded-md"
                >
                  Verify User
                </button>
              </form>
            )}

            {resetStep === 2 && (
              <form onSubmit={handleResetPassword}>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full mt-3 py-2 bg-green-600 text-white rounded-md"
                >
                  Save New Password
                </button>
              </form>
            )}

            {resetMsg && (
              <div className="text-sm text-center text-indigo-200">
                {resetMsg}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginForm
