import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AUTH_STORAGE_KEY = 'ruet-cse-auth-user-v1'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && typeof parsed === 'object') {
          setUser(parsed)
        }
      }
    } catch (_) {
      /* ignore invalid storage */
    } finally {
      setIsReady(true)
    }
  }, [])

  const login = (payload) => {
    const nextUser = {
      name: payload.name?.trim() || 'Student User',
      email: payload.email?.trim() || '',
      studentId: payload.studentId?.trim() || '',
      username: payload.username?.trim() || '',
      loggedInAt: new Date().toISOString(),
    }
    setUser(nextUser)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const value = useMemo(() => ({
    user,
    isLoggedIn: !!user,
    isReady,
    login,
    logout,
  }), [user, isReady])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
