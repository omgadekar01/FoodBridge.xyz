import { useCallback, useMemo, useState } from 'react'
import {
  clearDemoSession,
  registerDemo,
  restoreDemoSession,
  signInDemo,
} from './authService.js'
import { AuthContext } from './authContext.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(restoreDemoSession)

  const signIn = useCallback(async (credentials) => {
    const signedInUser = await signInDemo(credentials)
    setUser(signedInUser)
    return signedInUser
  }, [])

  const register = useCallback(async (profile) => {
    const registeredUser = await registerDemo(profile)
    setUser(registeredUser)
    return registeredUser
  }, [])

  const logout = useCallback(() => {
    clearDemoSession()
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, signIn, register, logout }), [user, signIn, register, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
