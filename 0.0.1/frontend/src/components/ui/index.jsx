import { clsx } from '../../utils/format'

// ── Card ──────────────────────────────────────────────────────────────────
export function Card({ children, className = '', title, icon }) {
  return (
    <div className={clsx('card', className)}>
      {title && (
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          {icon && <span className="text-lg">{icon}</span>}
          <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">{title}</h3>
        </div>
      )}
      {children}
    </div>
  )
}

// ── StatCard ─────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, color = 'blue', icon }) {
  const colors = {
    blue:   'bg-blue-50 text-blue-600',
    green:  'bg-green-50 text-green-600',
    red:    'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
    gray:   'bg-gray-50 text-gray-600',
  }
  return (
    <div className="card flex flex-col gap-1">
      <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center text-lg mb-2', colors[color])}>
        {icon}
      </div>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────────
export function Badge({ children, variant = 'blue' }) {
  const v = { green:'badge-green', red:'badge-red', blue:'badge-blue' }
  return <span className={v[variant] || 'badge-blue'}>{children}</span>
}

// ── Spinner ───────────────────────────────────────────────────────────────
export function Spinner({ size = 'md' }) {
  const s = { sm:'h-4 w-4', md:'h-8 w-8', lg:'h-12 w-12' }
  return (
    <div className={clsx('animate-spin rounded-full border-2 border-gray-200 border-t-blue-600', s[size])} />
  )
}

// ── Table ─────────────────────────────────────────────────────────────────
export function Table({ headers, rows, emptyMsg = 'No data' }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>{headers.map(h => <th key={h} className="table-th">{h}</th>)}</tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.length === 0
            ? <tr><td colSpan={headers.length} className="table-td text-center text-gray-400 py-8">{emptyMsg}</td></tr>
            : rows.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  {row.map((cell, j) => <td key={j} className="table-td">{cell}</td>)}
                </tr>
              ))
          }
        </tbody>
      </table>
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  )
}

// ── FormField ─────────────────────────────────────────────────────────────
export function FormField({ label, children, error }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ── SectionHeader ─────────────────────────────────────────────────────────
export function SectionHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {action}
    </div>
  )
}
