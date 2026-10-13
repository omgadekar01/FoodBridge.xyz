export function dashboardPathForRole(role) {
  const rolePath = { NGO: 'ngo', Donor: 'donor', User: 'user' }[role]
  return rolePath ? `/dashboard/${rolePath}` : '/login'
}
