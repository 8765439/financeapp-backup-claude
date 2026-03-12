import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const links = [
  { to: '/',           icon: '🏠', label: 'Dashboard' },
  { to: '/salary',     icon: '💼', label: 'Salary' },
  { to: '/tax',        icon: '🧾', label: 'Tax Calculator' },
  { to: '/fd',         icon: '🏧', label: 'Fixed Deposits' },
  { to: '/sgb',        icon: '🥇', label: 'Sovereign Gold Bonds' },
  { to: '/mf',         icon: '📈', label: 'Mutual Funds' },
  { to: '/home-loan',  icon: '🏡', label: 'Home Loan' },
  { to: '/budget',     icon: '📊', label: 'Budget' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <div>
            <p className="font-bold text-gray-900 text-sm">Finance Manager</p>
            <p className="text-xs text-gray-400">FY 2025-26</p>
          </div>
        </div>
      </div>
      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to=='/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition mb-0.5 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }>
            <span>{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
      {/* User */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.username}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout}
          className="w-full text-left text-xs text-gray-400 hover:text-red-500 transition px-1">
          Sign out →
        </button>
      </div>
    </aside>
  )
}
