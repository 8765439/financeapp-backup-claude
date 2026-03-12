import { Card, StatCard, Table, Badge } from '../components/ui'
import { inr } from '../utils/format'

const BUDGET = [
  { category: 'Home Loan EMI (Main)',  type: 'LIABILITY',  monthly: 90000 },
  { category: 'Home Loan EMI (Insur)', type: 'LIABILITY',  monthly:  5000 },
  { category: 'School Fees',           type: 'EXPENSE',    monthly: 20000 },
  { category: 'Home Maintenance (H)',  type: 'EXPENSE',    monthly: 55000 },
  { category: 'Home Maintenance (V)',  type: 'EXPENSE',    monthly: 40000 },
  { category: 'Vehicle Maintenance',   type: 'EXPENSE',    monthly: 15000 },
  { category: 'Health Insurance',      type: 'EXPENSE',    monthly: 20000 },
  { category: 'PPF',                   type: 'INVESTMENT', monthly: 12500 },
  { category: 'NPS Tier I',            type: 'INVESTMENT', monthly: 12500 },
  { category: 'NPS Tier II',           type: 'INVESTMENT', monthly: 12500 },
  { category: 'MF SIPs — Axis',        type: 'INVESTMENT', monthly:  7500 },
  { category: 'MF SIPs — Kotak',       type: 'INVESTMENT', monthly:  6000 },
  { category: 'Post Office FD',        type: 'INVESTMENT', monthly:  7500 },
]

const BADGE = { LIABILITY: 'red', EXPENSE: 'blue', INVESTMENT: 'green' }

export default function Budget() {
  const liabilities  = BUDGET.filter(b => b.type === 'LIABILITY').reduce((s, b) => s + b.monthly, 0)
  const expenses     = BUDGET.filter(b => b.type === 'EXPENSE').reduce((s, b) => s + b.monthly, 0)
  const investments  = BUDGET.filter(b => b.type === 'INVESTMENT').reduce((s, b) => s + b.monthly, 0)
  const total        = BUDGET.reduce((s, b) => s + b.monthly, 0)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Monthly Budget</h1>
        <p className="text-sm text-gray-500 mt-1">Expense and investment plan</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon="💳" label="Liabilities / EMIs" value={inr(liabilities)}  color="red" />
        <StatCard icon="🛒" label="Expenses"            value={inr(expenses)}    color="yellow" />
        <StatCard icon="📈" label="Investments"         value={inr(investments)} color="green" />
      </div>

      <Card title="Budget Breakdown" icon="📊">
        <Table
          headers={['Category', 'Type', 'Monthly', 'Annual']}
          rows={BUDGET.map(b => [
            b.category,
            <Badge variant={BADGE[b.type]}>{b.type}</Badge>,
            inr(b.monthly),
            inr(b.monthly * 12)
          ])}
        />
        <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
          <span className="font-semibold text-gray-700">Total Monthly Outflow</span>
          <span className="text-lg font-bold text-gray-900">{inr(total)}</span>
        </div>
        <div className="mt-1 flex justify-between items-center text-sm text-gray-500">
          <span>Total Annual Outflow</span>
          <span className="font-medium">{inr(total * 12)}</span>
        </div>
      </Card>

      {/* Visual breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { type: 'LIABILITY',  label: 'Liabilities',  color: 'bg-red-50 border-red-200',    text: 'text-red-700',   val: liabilities },
          { type: 'EXPENSE',    label: 'Expenses',     color: 'bg-blue-50 border-blue-200',   text: 'text-blue-700',  val: expenses },
          { type: 'INVESTMENT', label: 'Investments',  color: 'bg-green-50 border-green-200', text: 'text-green-700', val: investments },
        ].map(({ type, label, color, text, val }) => (
          <div key={type} className={`rounded-xl border p-4 ${color}`}>
            <p className={`font-semibold text-sm ${text}`}>{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{inr(val)}<span className="text-sm font-normal text-gray-400">/mo</span></p>
            <div className="mt-3 space-y-1">
              {BUDGET.filter(b => b.type === type).map(b => (
                <div key={b.category} className="flex justify-between text-xs text-gray-600">
                  <span>{b.category}</span>
                  <span>{inr(b.monthly)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
