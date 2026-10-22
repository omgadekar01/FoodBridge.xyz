import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  BadgeCheck,
  Building2,
  Leaf,
  LoaderCircle,
  LogOut,
  ShieldCheck,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './authContext.js'
import { markDemoFssaiVerification } from './authService.js'
import { verifyFssaiLicenseDemo } from './fssaiVerificationService.js'
import { dashboardPathForRole } from './roleRoutes.js'

const failureMessage = 'License verification failed. Please check your details and try again.'

export default function FssaiVerificationModal() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [licenseNumber, setLicenseNumber] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!success) return undefined

    const timeout = window.setTimeout(() => {
      navigate(dashboardPathForRole(user.role), {
        replace: true,
        state: { fssaiDemoNotice: true },
      })
    }, 1200)

    return () => window.clearTimeout(timeout)
  }, [navigate, success, user.role])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting || success) return

    if (!licenseNumber) {
      setError('Enter your 14-digit FSSAI License Number.')
      return
    }
    if (!/^\d{14}$/.test(licenseNumber)) {
      setError('Enter exactly 14 digits. Letters, spaces, and symbols are not allowed.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      const result = await verifyFssaiLicenseDemo(licenseNumber)
      if (result.status !== 'demo-approved') {
        setError(failureMessage)
        return
      }

      markDemoFssaiVerification(user)
      setSuccess(true)
    } catch {
      setError(failureMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="fssai-backdrop flex min-h-screen items-center justify-center p-4 sm:p-8">
      <motion.section
        aria-labelledby="fssai-title"
        aria-modal="true"
        className="fssai-modal relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        role="dialog"
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <div className="h-1.5 bg-gradient-to-r from-emerald-800 via-teal-500 to-amber-400" />
        <div className="p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-emerald-950">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                <Leaf size={22} aria-hidden="true" />
              </span>
              <span className="text-lg font-extrabold tracking-tight">FoodBridge</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              aria-label="Log out instead of verifying"
            >
              <LogOut size={15} aria-hidden="true" />
              Log out
            </button>
          </div>

          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100">
            <ShieldCheck size={25} aria-hidden="true" />
          </div>
          <h1 id="fssai-title" className="text-2xl font-extrabold tracking-tight text-slate-900">
            FSSAI License Verification
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Verify your food business license to help ensure safe and trusted food donations.
          </p>

          <div className="mt-5 flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950" role="note">
            <Building2 className="mt-0.5 shrink-0 text-amber-700" size={17} aria-hidden="true" />
            <p>
              <strong>Demo simulation only.</strong> No official FSSAI lookup is connected. Any other valid-format number simulates a demo pass; <code className="font-bold">00000000000000</code> simulates failure. Do not enter a real license number.
            </p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            <label htmlFor="fssai-license" className="block text-sm font-semibold text-slate-800">
              FSSAI License Number
            </label>
            <input
              ref={inputRef}
              id="fssai-license"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={14}
              pattern="[0-9]{14}"
              placeholder="Enter your 14-digit FSSAI License Number"
              value={licenseNumber}
              onChange={(event) => {
                setLicenseNumber(event.target.value)
                setError('')
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'fssai-error' : 'fssai-hint'}
              disabled={submitting || success}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-50"
            />
            <p id="fssai-hint" className="text-xs text-slate-500">
              Enter 14 digits with no spaces or punctuation.
            </p>

            <AnimatePresence initial={false}>
              {error && (
                <motion.p
                  id="fssai-error"
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-800"
                >
                  <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </motion.p>
              )}
              {success && (
                <motion.p
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-900"
                >
                  <BadgeCheck size={18} className="mt-0.5 shrink-0 text-emerald-700" aria-hidden="true" />
                  <span>FSSAI License Verified Successfully! <span className="font-normal">(Demo only — not officially verified.)</span></span>
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={submitting || success}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {submitting ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />
                  Simulating verification…
                </>
              ) : success ? (
                <>Demo complete <BadgeCheck size={17} aria-hidden="true" /></>
              ) : (
                <>Verify License <ShieldCheck size={17} aria-hidden="true" /></>
              )}
            </button>
          </form>
        </div>
      </motion.section>
    </main>
  )
}
