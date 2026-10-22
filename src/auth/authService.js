const SESSION_KEY = 'foodbridge-demo-session'
const users = new Map()

export const accountRoles = ['NGO', 'Donor', 'User']

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration))

function createDemoUser(profile) {
  return {
    id: globalThis.crypto.randomUUID(),
    role: profile.role,
    email: profile.email,
    name: profile.name,
    individualDonor: profile.role === 'Donor' && profile.individualDonor === true,
  }
}

function fssaiStatusKey(userId) {
  return `foodbridge-demo-fssai-status:${userId}`
}

function saveSession(user, remember) {
  const storage = remember ? window.localStorage : window.sessionStorage
  const otherStorage = remember ? window.sessionStorage : window.localStorage
  otherStorage.removeItem(SESSION_KEY)
  storage.setItem(SESSION_KEY, JSON.stringify({
    id: user.id,
    role: user.role,
    individualDonor: user.individualDonor,
    expiresAt: Date.now() + 8 * 60 * 60 * 1000,
  }))
}

export async function signInDemo({ email, password, role, remember }) {
  await wait(450)
  const normalizedEmail = email.trim().toLowerCase()
  const existingUser = users.get(normalizedEmail)

  if (existingUser && (existingUser.password !== password || existingUser.role !== role)) {
    throw new Error('Those details do not match a demo account. Check your password and selected role.')
  }

  const user = existingUser?.profile ?? createDemoUser({
    email: normalizedEmail,
    name: 'FoodBridge member',
    role,
  })

  if (!existingUser) {
    users.set(normalizedEmail, { password, profile: user })
  }

  saveSession(user, remember)
  return user
}

export async function registerDemo(profile) {
  await wait(450)
  const normalizedEmail = profile.email.trim().toLowerCase()

  if (users.has(normalizedEmail)) {
    throw new Error('A demo account with this email already exists. Sign in instead.')
  }

  const user = createDemoUser({ ...profile, email: normalizedEmail })
  users.set(normalizedEmail, { password: profile.password, profile: user })
  saveSession(user, false)
  return user
}

export function restoreDemoSession() {
  const storage = window.localStorage.getItem(SESSION_KEY)
    ? window.localStorage
    : window.sessionStorage
  const savedSession = storage.getItem(SESSION_KEY)

  if (!savedSession) return null

  try {
    const session = JSON.parse(savedSession)
    if (
      typeof session.id !== 'string'
      || !accountRoles.includes(session.role)
      || typeof session.expiresAt !== 'number'
      || session.expiresAt <= Date.now()
    ) {
      throw new Error('The saved demo session is invalid or expired.')
    }

    return {
      id: session.id,
      role: session.role,
      individualDonor: session.individualDonor === true,
      name: 'FoodBridge member',
      email: '',
    }
  } catch {
    window.localStorage.removeItem(SESSION_KEY)
    window.sessionStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function clearDemoSession() {
  window.localStorage.removeItem(SESSION_KEY)
  window.sessionStorage.removeItem(SESSION_KEY)
}

export function hasDemoFssaiVerification(user) {
  return Boolean(
    user?.role === 'Donor'
    && !user.individualDonor
    && window.localStorage.getItem(fssaiStatusKey(user.id)) === 'demo-approved',
  )
}

export function markDemoFssaiVerification(user) {
  if (user?.role !== 'Donor' || user.individualDonor) {
    throw new Error('FSSAI demo verification is only available for food-business donors.')
  }

  window.localStorage.setItem(fssaiStatusKey(user.id), 'demo-approved')
}

export function requiresFssaiVerification(user) {
  return Boolean(user?.role === 'Donor' && !user.individualDonor && !hasDemoFssaiVerification(user))
}
