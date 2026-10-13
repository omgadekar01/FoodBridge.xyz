import { HandHeart, Utensils, Users } from 'lucide-react'

const roles = [
  {
    id: 'NGO',
    title: 'NGO',
    description: 'Discover surplus food and coordinate food rescue for communities.',
    icon: HandHeart,
  },
  {
    id: 'Donor',
    title: 'Donor',
    description: 'List surplus food from restaurants, events, and organizations.',
    icon: Utensils,
  },
  {
    id: 'User',
    title: 'Food recipient',
    description: 'Find available food assistance and nearby donation opportunities.',
    icon: Users,
  },
]

export default function RoleSelector({ value, onChange }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-semibold text-slate-800">I’m joining as</legend>
      <div role="radiogroup" aria-label="Account role" className="grid grid-cols-3 gap-2">
        {roles.map(({ id, title, description, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={value === id}
            aria-label={`${title}: ${description}`}
            onClick={() => onChange(id)}
            className={`rounded-2xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
              value === id
                ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm'
                : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300'
            }`}
          >
            <Icon size={19} aria-hidden="true" className={value === id ? 'text-emerald-700' : 'text-slate-500'} />
            <span className="mt-2 block text-xs font-bold sm:text-sm">{title}</span>
            <span className="mt-1 block text-[10px] leading-4 text-slate-500">{description}</span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{value ? `${value} role selected` : 'Choose an account role'}</p>
    </fieldset>
  )
}
