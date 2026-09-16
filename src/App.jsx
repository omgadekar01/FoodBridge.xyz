import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  ArrowRight,
  Bell,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Cpu,
  FileText,
  Gauge,
  HandCoins,
  Home,
  Leaf,
  MapPinned,
  Menu,
  PackageCheck,
  QrCode,
  Search,
  ShieldCheck,
  ShieldX,
  ShoppingCart,
  Sparkles,
  Truck,
  Users,
  X,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'listings', label: 'Food Listings', icon: ShoppingCart },
  { id: 'matching', label: 'AI Matching', icon: Sparkles },
  { id: 'dispatch', label: 'Dispatch & Routes', icon: Truck },
  { id: 'safety', label: 'Food Safety', icon: ShieldCheck },
  { id: 'verification', label: 'Verification', icon: QrCode },
  { id: 'analytics', label: 'Impact Analytics', icon: Activity },
  { id: 'audit', label: 'Audit Logs', icon: FileText },
  { id: 'donor', label: 'Donor Portal', icon: HandCoins },
  { id: 'recipient', label: 'NGO Portal', icon: Users },
  { id: 'driver', label: 'Driver Portal', icon: Truck },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'architecture', label: 'System Architecture', icon: Cpu },
]

const kpis = [
  { label: 'Food Listings Today', value: 48, suffix: '', icon: ShoppingCart, tone: 'emerald' },
  { label: 'Meals Available', value: 3840, suffix: '', icon: PackageCheck, tone: 'blue' },
  { label: 'AI Matches Generated', value: 42, suffix: '', icon: Sparkles, tone: 'violet' },
  { label: 'Successful Matches', value: 36, suffix: '', icon: CheckCircle2, tone: 'green' },
  { label: 'Drivers Online', value: 12, suffix: '', icon: Truck, tone: 'amber' },
  { label: 'Active Routes', value: 7, suffix: '', icon: MapPinned, tone: 'gray' },
  { label: 'Meals Rescued', value: 3120, suffix: '', icon: Leaf, tone: 'green' },
  { label: 'Delivery Success Rate', value: 94.8, suffix: '%', icon: Gauge, tone: 'blue' },
  { label: 'Safety Compliance', value: 98.6, suffix: '%', icon: ShieldCheck, tone: 'emerald' },
]

const foodListings = [
  { id: 'FB-2048', donor: 'Green Leaf Restaurant', food: 'Vegetarian Meals', quantity: 120, expiry: '18:45', location: 'Bandra West', status: 'Dispatch Ready', match: 'AI Match 94' },
  { id: 'FB-2049', donor: 'Annapurna Hostel', food: 'Rice & Dal', quantity: 95, expiry: '19:12', location: 'Andheri East', status: 'Matched', match: 'AI Match 91' },
  { id: 'FB-2050', donor: 'CityCare Shelter', food: 'Fruit Boxes', quantity: 72, expiry: '20:40', location: 'Powai', status: 'Processing', match: 'AI Match 88' },
  { id: 'FB-2051', donor: 'Hope Community Kitchen', food: 'Soup Packs', quantity: 60, expiry: '17:50', location: 'Dadar', status: 'Safety Review', match: 'AI Match 82' },
  { id: 'FB-2052', donor: 'Sahyog Foundation', food: 'Bread & Sandwiches', quantity: 110, expiry: '18:10', location: 'Lower Parel', status: 'Rejected', match: 'AI Match 46' },
  { id: 'FB-2053', donor: 'Swaraj Canteen', food: 'Khichdi', quantity: 78, expiry: '18:30', location: 'Chembur', status: 'Expired', match: 'AI Match 0' },
]

const matchCandidates = [
  { title: '120 Vegetarian Meals', donor: 'Green Leaf Restaurant', recipient: 'Hope Shelter', score: 94, expiry: 28, distance: 24, quantity: 19, compatibility: 14, capacity: 9 },
  { title: '80 Rice & Dal Packs', donor: 'Annapurna Hostel', recipient: 'CityCare Shelter', score: 91, expiry: 26, distance: 22, quantity: 19, compatibility: 14, capacity: 10 },
  { title: '60 Fruit Boxes', donor: 'CityCare Shelter', recipient: 'Sahyog Foundation', score: 88, expiry: 24, distance: 21, quantity: 18, compatibility: 15, capacity: 10 },
]

const auditEvents = [
  { time: '20:04:12', role: 'DONOR', event: 'Food listing FB-2048 created', status: 'success' },
  { time: '20:04:15', role: 'AI ENGINE', event: 'Match candidates generated', status: 'info' },
  { time: '20:04:16', role: 'SAFETY ENGINE', event: 'Route validated', status: 'success' },
  { time: '20:04:20', role: 'DISPATCH', event: 'Driver assigned', status: 'warning' },
  { time: '20:16:41', role: 'DRIVER', event: 'Pickup verified', status: 'success' },
  { time: '20:29:03', role: 'NGO', event: 'Delivery handover verified', status: 'success' },
]

const routeSegments = [
  [19.0188, 72.8448],
  [19.076, 72.8777],
  [19.0596, 72.8467],
]

const routeChart = [
  { name: 'Mon', rescued: 280 },
  { name: 'Tue', rescued: 340 },
  { name: 'Wed', rescued: 420 },
  { name: 'Thu', rescued: 390 },
  { name: 'Fri', rescued: 490 },
  { name: 'Sat', rescued: 540 },
  { name: 'Sun', rescued: 610 },
]

const successChart = [
  { name: 'Successful', value: 84 },
  { name: 'Failed', value: 16 },
]

const categoryChart = [
  { name: 'Vegetarian', value: 42 },
  { name: 'Staples', value: 23 },
  { name: 'Bakery', value: 17 },
  { name: 'Fruit', value: 10 },
  { name: 'Prepared', value: 8 },
]

const donorChart = [
  { name: 'Green Leaf', value: 28 },
  { name: 'Annapurna', value: 18 },
  { name: 'CityCare', value: 16 },
  { name: 'Hope Kitchen', value: 14 },
  { name: 'Others', value: 24 },
]

const efficiencyChart = [
  { day: 'Mon', efficiency: 72 },
  { day: 'Tue', efficiency: 76 },
  { day: 'Wed', efficiency: 81 },
  { day: 'Thu', efficiency: 79 },
  { day: 'Fri', efficiency: 89 },
  { day: 'Sat', efficiency: 92 },
  { day: 'Sun', efficiency: 94 },
]

const deliveryRate = [
  { rate: 96, month: 'Jan' },
  { rate: 94, month: 'Feb' },
  { rate: 97, month: 'Mar' },
  { rate: 95, month: 'Apr' },
  { rate: 98, month: 'May' },
  { rate: 96, month: 'Jun' },
]

const demoSteps = [
  'New surplus received',
  'Ingestion queue',
  'AI analysis',
  'Match scoring',
  'Safety validation',
  'Driver assignment',
  'Route generation',
  'ETA calculation',
  'Delivery verification',
  'Impact updated',
]

const rolePermissions = {
  Admin: ['dashboard','listings','matching','dispatch','safety','verification','analytics','audit','donor','recipient','driver','security','architecture'],
  Donor: ['dashboard','listings','donor','analytics'],
  NGO: ['dashboard','matching','safety','verification','analytics','recipient','audit'],
  Driver: ['dashboard','dispatch','driver','verification','analytics'],
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-IN').format(value)
}

function AnimatedNumber({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let start = 0
    const totalFrames = 30
    const increment = value / totalFrames
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setDisplay(value)
        clearInterval(timer)
      } else {
        setDisplay(start)
      }
    }, 30)
    return () => clearInterval(timer)
  }, [value])

  const formatDisplay = (num) => {
    if (value >= 1000) return formatNumber(Number(num.toFixed(value % 1 === 0 ? 0 : 1)))
    return Number(num.toFixed(value % 1 === 0 ? 0 : 1))
  }

  return <span>{formatDisplay(display)}{suffix}</span>
}

function MetricCard({ label, value, suffix, icon: Icon, tone }) {
  const toneClasses = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    blue: 'bg-sky-50 text-sky-700 border-sky-100',
    violet: 'bg-violet-50 text-violet-700 border-violet-100',
    green: 'bg-green-50 text-green-700 border-green-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    gray: 'bg-slate-100 text-slate-700 border-slate-200',
  }

  return (
    <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)] backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
          <div className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            <AnimatedNumber value={value} suffix={suffix} />
          </div>
        </div>
        <div className={`rounded-xl border p-2 ${toneClasses[tone]}`}>
          <Icon size={20} />
        </div>
      </div>
    </motion.div>
  )
}

function StatusBadge({ label, tone = 'success' }) {
  const toneMap = {
    success: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
    warning: 'bg-amber-100 text-amber-700 ring-amber-200',
    info: 'bg-sky-100 text-sky-700 ring-sky-200',
    danger: 'bg-red-100 text-red-700 ring-red-200',
    neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ring-1 ${toneMap[tone]}`}>
      {label}
    </span>
  )
}

function Sidebar({ activeSection, setActiveSection, role, mobileOpen, setMobileOpen }) {
  const visible = rolePermissions[role] || rolePermissions.Admin

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200/80 bg-white/90 p-5 shadow-[0_25px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between pb-6">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-600">FoodBridge</div>
            <h1 className="mt-1 text-xl font-black text-slate-900">Rescue Network</h1>
          </div>
          <button className="rounded-lg border border-slate-200 p-2 text-slate-700 lg:hidden" onClick={() => setMobileOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="space-y-1.5">
          {navItems.filter((item) => visible.includes(item.id)).map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveSection(item.id)
                  setMobileOpen(false)
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${activeSection === item.id ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={16} />
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </aside>
      {mobileOpen && <button className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu" />} 
    </>
  )
}

function MatchScoreCard({ item }) {
  const breakdown = [
    { label: 'Expiry Urgency', value: item.expiry, max: 30, color: 'bg-emerald-500' },
    { label: 'Distance', value: item.distance, max: 25, color: 'bg-sky-500' },
    { label: 'Quantity Match', value: item.quantity, max: 20, color: 'bg-violet-500' },
    { label: 'Food Compatibility', value: item.compatibility, max: 15, color: 'bg-amber-500' },
    { label: 'Recipient Capacity', value: item.capacity, max: 10, color: 'bg-rose-500' },
  ]

  return (
    <motion.div whileHover={{ y: -2 }} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_15px_35px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xl font-bold text-slate-900">{item.title}</p>
          <p className="mt-1 text-sm text-slate-500">Donor: <span className="font-semibold text-slate-700">{item.donor}</span></p>
          <p className="text-sm text-slate-500">Recipient: <span className="font-semibold text-slate-700">{item.recipient}</span></p>
        </div>
        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-600">Match Score</div>
          <div className="mt-1 text-3xl font-black text-emerald-700">{item.score}/100</div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {breakdown.map((bar) => (
          <div key={bar.label}>
            <div className="mb-1 flex justify-between text-xs font-medium text-slate-600">
              <span>{bar.label}</span>
              <span>{bar.value}/{bar.max}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(bar.value / bar.max) * 100}%` }} transition={{ duration: 0.8 }} className={`h-full rounded-full ${bar.color}`} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function SafetyIndicator() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_15px_35px_rgba(15,23,42,0.06)]">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Food Expiry</div>
            <div className="mt-2 text-3xl font-black text-slate-900">18:45</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Current Time</div>
            <div className="mt-2 text-3xl font-black text-slate-900">17:00</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Estimated Travel Time</div>
            <div className="mt-2 text-3xl font-black text-slate-900">14 min</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Safety Buffer</div>
            <div className="mt-2 text-3xl font-black text-slate-900">15 min</div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="flex items-center gap-3 text-emerald-700">
            <CheckCircle2 size={22} />
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em]">Safety Margin</div>
              <div className="text-2xl font-black">91 minutes</div>
            </div>
          </div>
          <div className="mt-3 text-lg font-bold text-emerald-700">✓ FEASIBLE</div>
        </div>
      </div>

      <div className="rounded-3xl border border-red-100 bg-white p-5 shadow-[0_15px_35px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-2 text-red-600">
          <ShieldX size={18} />
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em]">Unsafe Route</div>
        </div>
        <div className="mt-4 grid gap-4 rounded-2xl bg-red-50 p-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-red-500">Travel Time</div>
            <div className="mt-1 text-2xl font-black text-red-700">105 min</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-red-500">Expiry Remaining</div>
            <div className="mt-1 text-2xl font-black text-red-700">60 min</div>
          </div>
          <div className="text-xl font-black text-red-700">✕ NOT FEASIBLE</div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          Route rejected because estimated transit duration exceeds the safe consumption window.
        </p>
      </div>
    </div>
  )
}

function AuditTimeline() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_15px_35px_rgba(15,23,42,0.06)]">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Evidence trail</div>
          <h3 className="mt-1 text-2xl font-black text-slate-900">Audit Log</h3>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
          {['User', 'Role', 'Event', 'Date', 'Status'].map((tag) => (
            <button key={tag} type="button" className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 hover:border-slate-300">
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {auditEvents.map((event, index) => (
          <div key={event.time} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex h-3 w-3 rounded-full bg-emerald-500" />
              {index !== auditEvents.length - 1 && <div className="mt-2 h-full w-px bg-slate-200" />}
            </div>
            <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{event.time}</div>
                <StatusBadge label={event.role} tone={event.status === 'success' ? 'success' : event.status === 'warning' ? 'warning' : 'info'} />
              </div>
              <div className="mt-2 text-base font-bold text-slate-800">{event.event}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [role, setRole] = useState(() => localStorage.getItem('foodbridge-role') || 'Admin')
  const [distance, setDistance] = useState(4.8)
  const [quantity, setQuantity] = useState(120)
  const [expiry, setExpiry] = useState(46)
  const [capacity, setCapacity] = useState(88)
  const [otpValue, setOtpValue] = useState('')
  const [verified, setVerified] = useState(false)
  const [liveDemoStep, setLiveDemoStep] = useState(-1)
  const [toast, setToast] = useState('')

  useEffect(() => {
    localStorage.setItem('foodbridge-role', role)
  }, [role])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 1800)
    return () => clearTimeout(timer)
  }, [toast])

  const matchScore = useMemo(() => {
    const expiryScore = Math.min(30, Math.max(0, (expiry / 100) * 30))
    const distanceScore = Math.min(25, Math.max(0, 25 * ((12 - distance) / 12)))
    const quantityScore = Math.min(20, Math.max(0, (quantity / 180) * 20))
    const compatibilityScore = 15
    const capacityScore = (capacity / 100) * 10
    const total = Math.round(expiryScore + distanceScore + quantityScore + compatibilityScore + capacityScore)
    return {
      total,
      breakdown: {
        expiry: Number(expiryScore.toFixed(1)),
        distance: Number(distanceScore.toFixed(1)),
        quantity: Number(quantityScore.toFixed(1)),
        compatibility: Number(compatibilityScore.toFixed(1)),
        capacity: Number(capacityScore.toFixed(1)),
      },
    }
  }, [distance, quantity, expiry, capacity])

  useEffect(() => {
    if (otpValue.length === 6 && otpValue === '482913') {
      setVerified(true)
      setToast('Handover Verified')
    } else if (otpValue.length === 6) {
      setVerified(false)
    }
  }, [otpValue])

  const runDemo = () => {
    setLiveDemoStep(0)
    let step = 0
    const interval = setInterval(() => {
      step += 1
      if (step < demoSteps.length) {
        setLiveDemoStep(step)
      } else {
        setLiveDemoStep(demoSteps.length - 1)
        clearInterval(interval)
        setToast('Impact updated')
      }
    }, 700)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_18%),linear-gradient(#f7faf8,#f1f9f5)] text-slate-900">
      <div className="mx-auto max-w-[1800px] lg:flex">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} role={role} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button type="button" className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 lg:hidden" onClick={() => setMobileOpen(true)}>
                  <Menu size={18} />
                </button>
                <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-emerald-700 sm:flex">
                  <CircleDashed size={14} className="animate-spin" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Live operations</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button type="button" className="hidden rounded-full border border-slate-200 bg-white p-2 text-slate-600 sm:inline-flex">
                  <Search size={16} />
                </button>
                <button type="button" className="hidden rounded-full border border-slate-200 bg-white p-2 text-slate-600 sm:inline-flex">
                  <Bell size={16} />
                </button>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm">
                  <div className="text-right">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Demo Role</div>
                    <div className="text-sm font-semibold text-slate-700">{role}</div>
                  </div>
                  <select
                    aria-label="Select role"
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-sm font-medium text-slate-700 outline-none"
                  >
                    <option>Admin</option>
                    <option>Donor</option>
                    <option>NGO</option>
                    <option>Driver</option>
                  </select>
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
            <section id="dashboard" className="rounded-[28px] border border-slate-200/80 bg-white/80 p-4 shadow-[0_25px_60px_rgba(15,23,42,0.05)] backdrop-blur-sm sm:p-6 xl:p-8">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-600">FoodBridge</div>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">Rescue Food. Match Smarter. Deliver Faster.</h2>
                  <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
                    An AI-powered surplus food redistribution platform connecting donors, recipients and logistics in real time.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={runDemo}
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02]"
                >
                  <Activity size={18} className="mr-2" />
                  RUN LIVE DEMO
                </button>
              </div>

              <div className="mt-8 grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
                <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-emerald-50 to-sky-50 p-4 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Operational flow</div>
                    <StatusBadge label="Prototype Simulation" tone="info" />
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                    {['DONOR', 'FOOD INGESTION', 'AI MATCH ENGINE', 'SAFETY VALIDATION', 'DISPATCH', 'LIVE ROUTE', 'OTP / QR HANDOVER', 'IMPACT'].map((step, index) => (
                      <div key={step} className="flex items-center gap-3">
                        <div className="rounded-full border border-emerald-200 bg-white px-2.5 py-1.5 shadow-sm">{step}</div>
                        {index !== 7 && <ArrowRight size={14} className="text-slate-400" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-900 p-4 text-white shadow-[0_18px_40px_rgba(15,23,42,0.16)] sm:p-6">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300">Live status</div>
                  <div className="mt-4 text-sm text-slate-300">{liveDemoStep >= 0 ? demoSteps[liveDemoStep] : 'Awaiting trigger'}</div>
                  <div className="mt-5 space-y-4">
                    {demoSteps.map((step, index) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0.4 }}
                        animate={{ opacity: index <= liveDemoStep ? 1 : 0.4 }}
                        className="flex items-center gap-3"
                      >
                        <div className={`h-2.5 w-2.5 rounded-full ${index <= liveDemoStep ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                        <span className={`text-sm ${index <= liveDemoStep ? 'text-white' : 'text-slate-400'}`}>{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {kpis.map((item) => (
                <MetricCard key={item.label} label={item.label} value={item.value} suffix={item.suffix} icon={item.icon} tone={item.tone} />
              ))}
            </section>

            <section id="listings" className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_15px_35px_rgba(15,23,42,0.06)]">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Real-time queue</div>
                    <h3 className="mt-1 text-2xl font-black text-slate-900">Food listings</h3>
                  </div>
                  <StatusBadge label="Live" tone="success" />
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-[760px] w-full border-separate border-spacing-y-3 text-left text-sm">
                    <thead>
                      <tr className="text-slate-500">
                        <th className="px-3 py-2 font-semibold">Listing ID</th>
                        <th className="px-3 py-2 font-semibold">Donor</th>
                        <th className="px-3 py-2 font-semibold">Food</th>
                        <th className="px-3 py-2 font-semibold">Quantity</th>
                        <th className="px-3 py-2 font-semibold">Expiry</th>
                        <th className="px-3 py-2 font-semibold">Location</th>
                        <th className="px-3 py-2 font-semibold">Status</th>
                        <th className="px-3 py-2 font-semibold">AI Match</th>
                      </tr>
                    </thead>
                    <tbody>
                      {foodListings.map((row) => (
                        <tr key={row.id} className="rounded-2xl bg-slate-50 shadow-sm">
                          <td className="rounded-l-2xl px-3 py-3 font-semibold text-slate-900">{row.id}</td>
                          <td className="px-3 py-3 text-slate-600">{row.donor}</td>
                          <td className="px-3 py-3 text-slate-600">{row.food}</td>
                          <td className="px-3 py-3 text-slate-600">{row.quantity}</td>
                          <td className="px-3 py-3 text-slate-600">{row.expiry}</td>
                          <td className="px-3 py-3 text-slate-600">{row.location}</td>
                          <td className="px-3 py-3">
                            <StatusBadge label={row.status} tone={row.status === 'Dispatch Ready' ? 'success' : row.status === 'Matched' ? 'info' : row.status === 'Rejected' || row.status === 'Expired' ? 'danger' : row.status === 'Safety Review' ? 'warning' : 'neutral'} />
                          </td>
                          <td className="rounded-r-2xl px-3 py-3 text-slate-600">{row.match}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div id="safety" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_15px_35px_rgba(15,23,42,0.06)]">
                <div className="mb-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Food safety</div>
                  <h3 className="mt-1 text-2xl font-black text-slate-900">Safety validation</h3>
                </div>
                <SafetyIndicator />
              </div>
            </section>

            <section id="matching" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_15px_35px_rgba(15,23,42,0.06)]">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Prototype Simulation</div>
                  <h3 className="mt-1 text-3xl font-black text-slate-900">AI Match Intelligence</h3>
                </div>
                <StatusBadge label="Prototype Simulation" tone="info" />
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4">
                  {matchCandidates.map((item) => (
                    <MatchScoreCard key={item.title} item={item} />
                  ))}
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Scenario controls</div>
                  <div className="mt-5 space-y-5">
                    <div>
                      <div className="mb-2 flex justify-between text-sm font-medium text-slate-700">
                        <span>Distance</span>
                        <span>{distance.toFixed(1)} km</span>
                      </div>
                      <input type="range" min="1" max="12" step="0.1" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full accent-emerald-600" />
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between text-sm font-medium text-slate-700">
                        <span>Quantity</span>
                        <span>{quantity} meals</span>
                      </div>
                      <input type="range" min="40" max="200" step="5" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full accent-emerald-600" />
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between text-sm font-medium text-slate-700">
                        <span>Expiry</span>
                        <span>{expiry}% urgency</span>
                      </div>
                      <input type="range" min="20" max="90" step="1" value={expiry} onChange={(e) => setExpiry(Number(e.target.value))} className="w-full accent-emerald-600" />
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between text-sm font-medium text-slate-700">
                        <span>Recipient capacity</span>
                        <span>{capacity}%</span>
                      </div>
                      <input type="range" min="40" max="100" step="1" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="w-full accent-emerald-600" />
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Updated Match</div>
                        <div className="mt-1 text-3xl font-black text-emerald-700">{matchScore.total}/100</div>
                      </div>
                      <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Dynamic</div>
                    </div>

                    <div className="mt-5 space-y-3 text-sm text-slate-700">
                      {Object.entries(matchScore.breakdown).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="capitalize">{key}</span>
                          <span className="font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="dispatch" className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_15px_35px_rgba(15,23,42,0.06)]">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Dispatch & routes</div>
                    <h3 className="mt-1 text-2xl font-black text-slate-900">Route intelligence</h3>
                  </div>
                  <button type="button" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                    OPTIMIZE ROUTE
                  </button>
                </div>

                <div className="h-[300px] overflow-hidden rounded-2xl border border-slate-200">
                  <MapContainer center={[19.076, 72.8777]} zoom={12} scrollWheelZoom={false} className="h-full w-full">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                    <CircleMarker center={[19.0188, 72.8448]} radius={10} pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 1 }}>
                      <Popup>Green Leaf Restaurant</Popup>
                    </CircleMarker>
                    <CircleMarker center={[19.076, 72.8777]} radius={10} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 1 }}>
                      <Popup>Driver</Popup>
                    </CircleMarker>
                    <CircleMarker center={[19.0596, 72.8467]} radius={10} pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 1 }}>
                      <Popup>Hope Shelter</Popup>
                    </CircleMarker>
                    <Polyline positions={routeSegments} pathOptions={{ color: '#0f766e', weight: 4, opacity: 0.9 }} />
                  </MapContainer>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300">Route overview</div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/5 p-4">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-300">Total Distance</div>
                    <div className="mt-2 text-2xl font-black">4.8 km</div>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-300">Estimated Travel Time</div>
                    <div className="mt-2 text-2xl font-black">14 min</div>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-300">Meals Collected</div>
                    <div className="mt-2 text-2xl font-black">120</div>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-300">Meals Delivered</div>
                    <div className="mt-2 text-2xl font-black">118</div>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-300">Fuel Estimate</div>
                    <div className="mt-2 text-2xl font-black">₹180</div>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-300">Safety Margin</div>
                    <div className="mt-2 text-2xl font-black">91 min</div>
                  </div>
                </div>
              </div>
            </section>

            <section id="driver" className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_15px_35px_rgba(15,23,42,0.06)]">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Driver portal</div>
                    <h3 className="mt-1 text-2xl font-black text-slate-900">Route FB-2048</h3>
                  </div>
                  <StatusBadge label="Ready" tone="success" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Pickup</div>
                    <div className="mt-2 text-lg font-black text-slate-900">Green Leaf Restaurant</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Meals</div>
                    <div className="mt-2 text-lg font-black text-slate-900">120</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Drop-off</div>
                    <div className="mt-2 text-lg font-black text-slate-900">Hope Shelter</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Distance</div>
                    <div className="mt-2 text-lg font-black text-slate-900">4.8 km</div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {['START PICKUP', 'ARRIVED', 'PICKUP CONFIRMED', 'START DELIVERY', 'ARRIVED AT RECIPIENT', 'VERIFY HANDOVER'].map((action) => (
                    <button key={action} type="button" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
                      {action}
                    </button>
                  ))}
                </div>

                <div className="mt-6 space-y-4">
                  {[
                    { label: 'Pickup scheduled', time: '17:35', done: true },
                    { label: 'Driver en route', time: '17:42', done: true },
                    { label: 'Pickup confirmed', time: '17:48', done: true },
                    { label: 'Handover verification', time: '18:00', done: false },
                  ].map((step) => (
                    <div key={step.label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step.done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                        {step.done ? <CheckCircle2 size={16} /> : <Clock3 size={16} />}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800">{step.label}</div>
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{step.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div id="verification" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_15px_35px_rgba(15,23,42,0.06)]">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Secure handover verification</div>
                <h3 className="mt-1 text-2xl font-black text-slate-900">Verification Code</h3>

                <div className="mt-6 flex items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6 ring-1 ring-slate-200">
                  <div className="grid h-36 w-36 place-items-center rounded-2xl border-2 border-slate-900 bg-white text-center shadow-inner">
                    <div className="grid grid-cols-3 gap-1.5">
                      {Array.from({ length: 9 }).map((_, idx) => (
                        <div key={idx} className="h-3.5 w-3.5 rounded-sm bg-slate-900" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-3xl font-black tracking-[0.55em] text-slate-900">482913</div>

                <div className="mt-5">
                  <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Enter OTP</label>
                  <input
                    value={otpValue}
                    onChange={(event) => setOtpValue(event.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    placeholder="482913"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-bold tracking-[0.3em] text-slate-900 outline-none ring-0 placeholder:text-slate-400"
                  />
                </div>

                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
                  {verified ? (
                    <div className="flex items-center gap-2 text-lg font-black">
                      <CheckCircle2 size={20} />
                      ✓ Handover Verified
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-lg font-black">
                      <Clock3 size={20} />
                      Awaiting verification
                    </div>
                  )}
                </div>

                {verified && (
                  <div className="mt-5 space-y-2 text-sm text-slate-600">
                    <div className="flex justify-between"><span>Timestamp</span><span className="font-semibold text-slate-800">20:29:03</span></div>
                    <div className="flex justify-between"><span>Driver ID</span><span className="font-semibold text-slate-800">DRV-208</span></div>
                    <div className="flex justify-between"><span>Recipient ID</span><span className="font-semibold text-slate-800">NGO-104</span></div>
                    <div className="flex justify-between"><span>Listing ID</span><span className="font-semibold text-slate-800">FB-2048</span></div>
                    <div className="flex justify-between"><span>Quantity</span><span className="font-semibold text-slate-800">120 meals</span></div>
                    <div className="flex justify-between"><span>GPS verification</span><span className="font-semibold text-slate-800">Confirmed</span></div>
                    <div className="flex justify-between"><span>Handover ID</span><span className="font-semibold text-slate-800">FBH-2026-004821</span></div>
                  </div>
                )}
                <p className="mt-5 text-xs uppercase tracking-[0.18em] text-slate-500">Simulated Cryptographic Verification</p>
              </div>
            </section>

            <section id="analytics" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_15px_35px_rgba(15,23,42,0.06)]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Impact analytics</div>
                  <h3 className="mt-1 text-2xl font-black text-slate-900">Performance overview</h3>
                </div>
                <StatusBadge label="Demo Data" tone="info" />
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Meals Rescued', value: '3,120', tone: 'emerald' },
                  { label: 'Food Listings', value: '20', tone: 'blue' },
                  { label: 'Successful Matches', value: '36', tone: 'green' },
                  { label: 'Delivery Success Rate', value: '94.8%', tone: 'amber' },
                  { label: 'Food Waste Diverted', value: '1.4 t', tone: 'amber' },
                  { label: 'Active Routes', value: '7', tone: 'slate' },
                  { label: 'Recipients Served', value: '48', tone: 'cyan' },
                  { label: 'CO₂e Avoided', value: '2.1 t', tone: 'emerald' },
                ].map((tile) => (
                  <div key={tile.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">{tile.label}</div>
                    <div className="mt-2 text-2xl font-black text-slate-900">{tile.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-4 text-sm font-semibold text-slate-700">Meals rescued per day</div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={routeChart}>
                        <defs>
                          <linearGradient id="colorMeals" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="rescued" stroke="#10b981" fill="url(#colorMeals)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-4 text-sm font-semibold text-slate-700">Successful vs failed matches</div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={successChart} dataKey="value" nameKey="name" innerRadius={48} outerRadius={75} paddingAngle={3}>
                          {successChart.map((entry, index) => (
                            <Cell key={entry.name} fill={['#10b981', '#e2e8f0'][index]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-4 text-sm font-semibold text-slate-700">Food category distribution</div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryChart}>
                        <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#0f766e" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-4 text-sm font-semibold text-slate-700">Donor contribution</div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={donorChart} layout="vertical" margin={{ left: 12 }}>
                        <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={80} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-4 text-sm font-semibold text-slate-700">Rescue efficiency</div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={efficiencyChart.map((item) => ({ ...item, efficiency: item.efficiency / 1.2 }))}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="day" />
                        <Radar dataKey="efficiency" stroke="#0f766e" fill="#10b981" fillOpacity={0.5} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-4 text-sm font-semibold text-slate-700">Delivery success rate</div>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={deliveryRate}>
                        <defs>
                          <linearGradient id="deliveryFill" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.7} />
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.08} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[90, 100]} />
                        <Tooltip />
                        <Area type="monotone" dataKey="rate" stroke="#2563eb" fill="url(#deliveryFill)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </section>

            <section id="audit" className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_15px_35px_rgba(15,23,42,0.06)]">
                <div className="mb-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Security</div>
                  <h3 className="mt-1 text-2xl font-black text-slate-900">System integrity</h3>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Verification coverage', value: 96 },
                    { label: 'Compliance checks', value: 98 },
                    { label: 'Driver authentication', value: 92 },
                    { label: 'Inventory traceability', value: 95 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between text-sm font-medium text-slate-700">
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-slate-100">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <AuditTimeline />
            </section>

            <section id="architecture" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_15px_35px_rgba(15,23,42,0.06)]">
              <div className="mb-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">System architecture</div>
                <h3 className="mt-1 text-2xl font-black text-slate-900">Operational blueprint</h3>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Donor Input', icon: HandCoins, detail: 'Inventory & surplus capture' },
                  { label: 'AI Match Engine', icon: Sparkles, detail: 'Scoring & prioritization' },
                  { label: 'Safety Layer', icon: ShieldCheck, detail: 'Expiry & compliance checks' },
                  { label: 'Logistics Core', icon: Truck, detail: 'Routes & driver handoff' },
                ].map((module) => (
                  <div key={module.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <module.icon size={20} />
                    </div>
                    <div className="mt-4 text-lg font-black text-slate-900">{module.label}</div>
                    <div className="mt-1 text-sm text-slate-600">{module.detail}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            className="fixed bottom-5 right-5 z-50 rounded-2xl border border-emerald-200 bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
