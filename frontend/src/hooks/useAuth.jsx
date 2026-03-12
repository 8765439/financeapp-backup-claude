import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, getMe } from '../api/client'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('jwt')
    if (token) {
      getMe().then(r => setUser(r.data)).catch(() => localStorage.removeItem('jwt'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    const r = await apiLogin(username, password)
    localStorage.setItem('jwt', r.data.token)
    setUser(r.data)
    return r.data
  }

  const logout = () => {
    localStorage.removeItem('jwt')
    setUser(null)
  }

  return (
    <AuthCtx.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
