import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase.js'

/**
 * AuthCallback.jsx
 *
 * Handles all Supabase auth redirects:
 *   - Email confirmation  → /auth/callback#access_token=...
 *   - Password reset      → /auth/callback#type=recovery
 *   - Magic link login    → /auth/callback#access_token=...
 *
 * Supabase sends the user to this URL after clicking the confirmation email.
 * This page reads the tokens from the URL hash, establishes the session,
 * then redirects to the dashboard.
 */
export default function AuthCallback() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying') // verifying | success | error
  const [message, setMessage] = useState('Verifying your email...')
  const [errorDetail, setErrorDetail] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Parse hash params (Supabase puts tokens in the URL hash)
        const hash = window.location.hash
        const params = new URLSearchParams(hash.replace('#', '?'))

        const accessToken  = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        const type         = params.get('type')
        const errorCode    = params.get('error')
        const errorDesc    = params.get('error_description')

        // Handle error in URL
        if (errorCode) {
          setStatus('error')
          setMessage('Verification failed')
          setErrorDetail(errorDesc || errorCode)
          return
        }

        // If tokens are present, set the session manually
        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) {
            setStatus('error')
            setMessage('Session error')
            setErrorDetail(error.message)
            return
          }

          setStatus('success')

          if (type === 'recovery') {
            // Password reset flow — go to settings
            setMessage('Password reset confirmed! Redirecting...')
            setTimeout(() => navigate('/settings', { replace: true }), 1500)
          } else {
            // Email confirmation / magic link — go to dashboard
            setMessage('Email confirmed! Welcome to EcoEvent AI 🌿')
            setTimeout(() => navigate('/dashboard', { replace: true }), 1500)
          }
          return
        }

        // No tokens in URL — try to get existing session (user may have already confirmed)
        const { data: { session }, error } = await supabase.auth.getSession()
        if (session) {
          setStatus('success')
          setMessage('Already verified! Redirecting...')
          setTimeout(() => navigate('/dashboard', { replace: true }), 1000)
        } else {
          setStatus('error')
          setMessage('No confirmation token found')
          setErrorDetail('The link may have expired. Please try signing up again or request a new confirmation email.')
        }
      } catch (err) {
        setStatus('error')
        setMessage('Unexpected error')
        setErrorDetail(err.message)
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-eco-50/30 dark:from-gray-950 dark:to-eco-950/30 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-eco-500/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-60" />
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-gray-200/60 dark:border-white/10 rounded-3xl p-10 text-center shadow-2xl">

            {/* Icon */}
            <motion.div
              className="text-6xl mb-6 inline-block"
              animate={status === 'verifying' ? { rotate: 360 } : {}}
              transition={status === 'verifying' ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
            >
              {status === 'verifying' && '⏳'}
              {status === 'success'   && '✅'}
              {status === 'error'     && '❌'}
            </motion.div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {status === 'verifying' && 'Confirming your email...'}
              {status === 'success'   && 'Email Confirmed!'}
              {status === 'error'     && 'Verification Failed'}
            </h1>

            {/* Message */}
            <p className="text-gray-500 dark:text-gray-400 mb-4">{message}</p>

            {/* Error detail */}
            {errorDetail && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-500/10 rounded-xl p-3 mb-4">
                {errorDetail}
              </p>
            )}

            {/* Loading dots */}
            {status === 'verifying' && (
              <div className="flex justify-center gap-1 mt-4">
                {[0, 150, 300].map((d) => (
                  <span
                    key={d}
                    className="w-2 h-2 rounded-full bg-eco-500 animate-bounce"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
            )}

            {/* Error actions */}
            {status === 'error' && (
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={() => navigate('/signup', { replace: true })}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-eco-500 to-emerald-600 text-white font-semibold hover:from-eco-600 hover:to-emerald-700 transition-all"
                >
                  Back to Sign Up
                </button>
                <button
                  onClick={() => navigate('/login', { replace: true })}
                  className="w-full py-3 px-6 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold hover:bg-white dark:hover:bg-white/10 transition-all"
                >
                  Go to Login
                </button>
              </div>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  )
}
