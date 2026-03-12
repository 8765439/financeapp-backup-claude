import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { FormField } from '../components/ui'

export default function Login() {
  const [creds, setCreds]   = useState({ username: 'lnarayana', password: 'Finance@123' })
  const [err, setErr]       = useState('')
  const [loading, setLoading] = useState(false)
  const { login }   = useAuth()
  const navigate    = useNavigate()

  const handle = e => setCreds(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      await login(creds.username, creds.password)
      navigate('/')
    } catch {
      setErr('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">💰</div>
          <h1 className="text-2xl font-bold text-gray-900">Finance Manager</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <FormField label="Username">
            <input name="username" value={creds.username} onChange={handle}
              className="input" autoFocus />
          </FormField>
          <FormField label="Password">
            <input name="password" type="password" value={creds.password} onChange={handle}
              className="input" />
          </FormField>
          {err && <p className="text-red-500 text-sm text-center">{err}</p>}
          <button type="submit" disabled={loading}
            className="btn-primary w-full py-3 text-base">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-4">
          Default: lnarayana / Finance@123
        </p>
      </div>
    </div>
  )
}
