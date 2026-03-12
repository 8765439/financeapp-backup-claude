import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Sidebar from './components/Sidebar'
import { Spinner } from './components/ui'

import Login             from './pages/Login'
import Dashboard         from './pages/Dashboard'
import Salary            from './pages/Salary'
import TaxCalculator     from './pages/TaxCalculator'
import FixedDeposits     from './pages/FixedDeposits'
import SovereignGoldBonds from './pages/SovereignGoldBonds'
import MutualFunds       from './pages/MutualFunds'
import HomeLoan          from './pages/HomeLoan'
import Budget            from './pages/Budget'

function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <Routes>
          <Route path="/"          element={<Dashboard />} />
          <Route path="/salary"    element={<Salary />} />
          <Route path="/tax"       element={<TaxCalculator />} />
          <Route path="/fd"        element={<FixedDeposits />} />
          <Route path="/sgb"       element={<SovereignGoldBonds />} />
          <Route path="/mf"        element={<MutualFunds />} />
          <Route path="/home-loan" element={<HomeLoan />} />
          <Route path="/budget"    element={<Budget />} />
          <Route path="*"          element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  )
}

function AuthGuard() {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/*"     element={user ? <Layout /> : <Navigate to="/login" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AuthGuard />
    </AuthProvider>
  )
}
