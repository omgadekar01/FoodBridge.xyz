import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Eye,
  EyeOff,
  HeartHandshake,
  Leaf,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Utensils,
  UserRound,
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './authContext.js'
import { dashboardPathForRole } from './roleRoutes.js'
import RoleSelector from './RoleSelector.jsx'

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100'
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/

function Field({ label, icon: Icon, error, ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-800">{label}</span>
      <span className="relative block">
        {Icon && <Icon aria-hidden="true" size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />}
        <input className={`${inputClass} ${Icon ? 'pl-10' : ''} ${inputProps.type === 'password' ? 'pr-11' : ''}`} {...inputProps} />
      </span>
      {error && <span className="mt-1 block text-xs font-medium text-rose-700">{error}</span>}
    </label>
  )
}

export default function AuthPage() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { signIn, register } = useAuth()
  const isRegister = pathname === '/register'
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'NGO',
    organization: '',
    serviceArea: '',
    individualDonor: false,
    termsAccepted: false,
    remember: true,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('error')
  const [hasInteracted, setHasInteracted] = useState(false)

  const passwordStrength = useMemo(() => {
    const checks = [
      form.password.length >= 8,
      /[a-z]/.test(form.password) && /[A-Z]/.test(form.password),
      /\d/.test(form.password),
      /[^A-Za-z\d]/.test(form.password),
    ]
    return checks.filter(Boolean).length
  }, [form.password])

  const update = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((current) => ({ ...current, [key]: value }))
    setHasInteracted(true)
    setMessage('')
  }

  const isValid = useMemo(() => {
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return false
    if (form.password.length < 8) return false
    if (isRegister) {
      if (!form.name.trim() || !/^\+?[0-9\s()-]{7,20}$/.test(form.phone.trim())) return false
      if (!passwordPattern.test(form.password) || form.password !== form.confirmPassword || !form.termsAccepted) return false
      if (form.role === 'NGO' && (!form.organization.trim() || !form.serviceArea.trim())) return false
      if (form.role === 'Donor' && !form.individualDonor && !form.organization.trim()) return false
      if (form.role === 'User' && !form.serviceArea.trim()) return false
    }
    return true
  }, [form, isRegister])

  const showNotice = (text, type = 'error') => {
    setMessage(text)
    setMessageType(type)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isValid || submitting) return

    setSubmitting(true)
    setMessage('')
    try {
      let user
      if (isRegister) {
        user = await register(form)
      } else {
        user = await signIn({
          email: form.email,
          password: form.password,
          role: form.role,
          remember: form.remember,
        })
      }
      navigate(dashboardPathForRole(user.role), { replace: true })
    } catch (error) {
      showNotice(error instanceof Error ? error.message : 'We could not complete sign in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleForgotPassword = (event) => {
    event.preventDefault()
    showNotice('Password reset email is not available in demo mode. You can create a new demo account instead.', 'info')
  }

  const registrationFields = () => (
    <>
      <Field label="Full name" icon={UserRound} autoComplete="name" value={form.name} onChange={update('name')} error={form.name && !form.name.trim() ? 'Enter your full name.' : ''} required />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Email address" icon={Mail} type="email" autoComplete="email" value={form.email} onChange={update('email')} error={form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'Enter a valid email address.' : ''} required />
        <Field label="Phone number" icon={Phone} type="tel" autoComplete="tel" value={form.phone} onChange={update('phone')} error={form.phone && !/^\+?[0-9\s()-]{7,20}$/.test(form.phone.trim()) ? 'Enter a valid phone number.' : ''} required />
      </div>
      {form.role === 'NGO' && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Organization name" icon={HeartHandshake} value={form.organization} onChange={update('organization')} required />
          <Field label="Service area" icon={MapPin} value={form.serviceArea} onChange={update('serviceArea')} required />
        </div>
      )}
      {form.role === 'Donor' && (
        <>
          {!form.individualDonor && (
            <Field label="Organization or restaurant" icon={Utensils} value={form.organization} onChange={update('organization')} required />
          )}
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={form.individualDonor} onChange={(event) => {
              update('individualDonor')(event)
              if (event.target.checked) setForm((current) => ({ ...current, organization: '' }))
            }} className="h-4 w-4 rounded border-slate-300 accent-emerald-700" />
            I’m registering as an individual donor
          </label>
        </>
      )}
      {form.role === 'User' && (
        <Field label="Location or service area" icon={MapPin} value={form.serviceArea} onChange={update('serviceArea')} required />
      )}
    </>
  )

  return (
    <main className="auth-page min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_100px_rgba(6,45,31,0.18)] lg:grid-cols-[0.94fr_1.06fr]">
        <motion.aside
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="auth-story relative hidden flex-col justify-between overflow-hidden bg-[#073d2b] p-10 text-white lg:flex xl:p-14"
        >
          <div className="absolute -right-24 top-24 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -right-10 top-36 h-52 w-52 rounded-full border border-white/10" />
          <div className="relative z-10">
            <Link to="/login" className="inline-flex items-center gap-3 text-white" aria-label="FoodBridge home">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-[#073d2b]"><Leaf size={23} /></span>
              <span className="text-xl font-extrabold tracking-tight">FoodBridge</span>
            </Link>
            <div className="mt-20 max-w-md">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
                <Sparkles size={14} /> A smarter rescue network
              </div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">Rescue Food.<br />Match Smarter.<br /><span className="text-emerald-300">Deliver Faster.</span></h1>
              <p className="mt-5 max-w-sm text-base leading-7 text-emerald-50/75">Turning surplus into sustenance by connecting local food donors, community organizations, and people who need support.</p>
            </div>
            <div className="mt-12 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300"><Utensils size={22} /></div>
              <div>
                <p className="font-semibold">Good food belongs on a plate.</p>
                <p className="mt-1 text-sm text-emerald-50/60">Every connection creates a little more impact.</p>
              </div>
              <HeartHandshake className="ml-auto shrink-0 text-emerald-300/70" size={23} />
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-2 text-xs text-emerald-50/55">
            <ShieldCheck size={15} /> Hackathon prototype · Demo mode only
          </div>
        </motion.aside>

        <section className="flex items-center justify-center px-5 py-8 sm:px-10 lg:px-12 xl:px-16">
          <motion.div
            key={isRegister ? 'register' : 'login'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg"
          >
            <div className="mb-7 flex items-center gap-2 text-sm font-extrabold text-emerald-800 lg:hidden">
              <Leaf size={19} /> FoodBridge
              <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-amber-700">Demo mode</span>
            </div>
            <div className="mb-7 flex rounded-xl bg-slate-100 p-1" aria-label="Authentication pages">
              <Link to="/login" aria-current={!isRegister ? 'page' : undefined} className={`flex-1 rounded-lg px-3 py-2.5 text-center text-sm font-bold transition ${!isRegister ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Sign in</Link>
              <Link to="/register" aria-current={isRegister ? 'page' : undefined} className={`flex-1 rounded-lg px-3 py-2.5 text-center text-sm font-bold transition ${isRegister ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Create account</Link>
            </div>

            <div className="mb-6">
              <div className="mb-2 hidden w-fit items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-800 lg:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Demo environment
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">{isRegister ? 'Join the rescue network' : 'Welcome back'}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{isRegister ? 'Create your account and make every meal count.' : 'Sign in to continue making a difference.'}</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <RoleSelector value={form.role} onChange={(role) => {
                setForm((current) => ({ ...current, role, organization: '', serviceArea: '', individualDonor: false }))
                setHasInteracted(true)
                setMessage('')
              }} />
              {isRegister && registrationFields()}
              {!isRegister && (
                <Field
                  label="Email address"
                  icon={Mail}
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={update('email')}
                  error={form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'Enter a valid email address.' : ''}
                  required
                />
              )}
              <Field
                label="Password"
                icon={LockKeyhole}
                type={showPassword ? 'text' : 'password'}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={form.password}
                onChange={update('password')}
                minLength={8}
                required
                error={form.password && form.password.length < 8 ? 'Password must be at least 8 characters.' : ''}
                aria-describedby={isRegister ? 'password-strength' : undefined}
              />
              <div className="-mt-3 flex justify-end">
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}{showPassword ? 'Hide password' : 'Show password'}
                </button>
              </div>

              {isRegister && (
                <>
                  <div id="password-strength" className="-mt-1">
                    <div className="mb-1 flex justify-between text-[11px] text-slate-500">
                      <span>Password strength</span>
                      <span>{['Add a password', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength]}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1" aria-label={`Password strength ${passwordStrength} out of 4`}>
                      {[0, 1, 2, 3].map((item) => (
                        <span key={item} className={`h-1 rounded-full ${item < passwordStrength ? (passwordStrength < 3 ? 'bg-amber-400' : 'bg-emerald-500') : 'bg-slate-200'}`} />
                      ))}
                    </div>
                    {form.password && !passwordPattern.test(form.password) && <p className="mt-1 text-xs text-slate-500">Use 8+ characters with uppercase, lowercase, a number, and a symbol.</p>}
                  </div>
                  <Field
                    label="Confirm password"
                    icon={LockKeyhole}
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={update('confirmPassword')}
                    error={form.confirmPassword && form.password !== form.confirmPassword ? 'Passwords do not match.' : ''}
                    required
                  />
                  <div className="-mt-3 flex justify-end">
                    <button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
                      {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}{showConfirmPassword ? 'Hide confirmation' : 'Show confirmation'}
                    </button>
                  </div>
                  <label className="flex items-start gap-2.5 text-xs leading-5 text-slate-600">
                    <input type="checkbox" checked={form.termsAccepted} onChange={update('termsAccepted')} className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-emerald-700" required />
                    <span>I agree to the demo terms and understand this prototype does not provide production authentication.</span>
                  </label>
                </>
              )}

              {!isRegister && (
                <div className="-mt-1 flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <input type="checkbox" checked={form.remember} onChange={update('remember')} className="h-4 w-4 rounded border-slate-300 accent-emerald-700" />
                    Remember me
                  </label>
                  <button type="button" onClick={handleForgotPassword} className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">Forgot password?</button>
                </div>
              )}

              {message && (
                <p role={messageType === 'error' ? 'alert' : 'status'} className={`rounded-xl border px-3 py-2.5 text-sm ${messageType === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-sky-200 bg-sky-50 text-sky-800'}`}>
                  {message}
                </p>
              )}
              {hasInteracted && !isValid && !message && (
                <p className="text-xs text-slate-500" role="status">Complete the required fields with valid details to continue.</p>
              )}
              <button type="submit" disabled={!isValid || submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-800/15 transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none">
                {submitting ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />{isRegister ? 'Creating account…' : 'Signing in…'}</> : <>{isRegister ? 'Create account' : 'Sign in'}<ArrowRight size={17} /></>}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              <span className="h-px flex-1 bg-slate-200" /> Demo prototype <span className="h-px flex-1 bg-slate-200" />
            </div>
            <p className="text-center text-xs leading-5 text-slate-500">
              Demo mode only. No backend is connected, and this client-side flow is not production security.
            </p>
          </motion.div>
        </section>
      </div>
    </main>
  )
}
