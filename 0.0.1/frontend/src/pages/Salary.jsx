import { useQuery } from '@tanstack/react-query'
import { getSalarySlips } from '../api/client'
import { Card, Spinner, StatCard } from '../components/ui'
import { inr, lakhs, MONTHS } from '../utils/format'

const COMPONENTS = [
  { key: 'basic',               label: 'Basic' },
  { key: 'personalAllowance',   label: 'Personal Allow.' },
  { key: 'otherAllowance',      label: 'Other Allow.' },
  { key: 'hra',                 label: 'HRA' },
  { key: 'onCallShiftAllowance',label: 'On-Call / Shift' },
  { key: 'variablePay',         label: 'Variable Pay' },
  { key: 'esppRefund',          label: 'ESPP Refund' },
  { key: 'leaveEncashment',     label: 'Leave Encash.' },
]

const DEDUCTIONS = [
  { key: 'pfDeduction',  label: 'PF (Employee)' },
  { key: 'vpfDeduction', label: 'VPF' },
  { key: 'npsEmployer',  label: 'NPS Employer' },
  { key: 'incomeTax',    label: 'Income Tax' },
  { key: 'professionTax',label: 'Prof. Tax' },
]

export default function Salary() {
  const { data: slips = [], isLoading } = useQuery({
    queryKey: ['salary-slips'],
    queryFn: () => getSalarySlips('2025-26').then(r => r.data)
  })

  const get = (month, key) => {
    const slip = slips.find(s => s.month === month)
    return Number(slip?.[key] || 0)
  }

  const rowTotal = (key) => MONTHS.reduce((sum, m) => sum + get(m, key), 0)

  const grossTotal = slips.reduce((sum, s) => {
    return sum + Number(s.basic||0) + Number(s.personalAllowance||0) +
      Number(s.otherAllowance||0) + Number(s.hra||0) +
      Number(s.onCallShiftAllowance||0) + Number(s.variablePay||0) +
      Number(s.esppRefund||0) + Number(s.leaveEncashment||0)
  }, 0)

  const taxTotal = rowTotal('incomeTax')
  const takeHomeTotal = slips.reduce((sum, s) => sum + Number(s.netTakeHome || 0), 0)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Salary Breakdown</h1>
        <p className="text-sm text-gray-500 mt-1">FY 2025-26 — month by month</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon="💼" label="Gross CTC"      value={lakhs(grossTotal)}   color="blue" />
        <StatCard icon="📤" label="Tax Deducted"   value={lakhs(taxTotal)}     color="red" />
        <StatCard icon="🏠" label="Net Take-Home"  value={lakhs(takeHomeTotal)} color="green" />
      </div>

      {/* Earnings table */}
      <Card title="Earnings" icon="💰">
        {isLoading
          ? <div className="flex justify-center py-8"><Spinner /></div>
          : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left font-medium text-gray-500 sticky left-0 bg-gray-50 min-w-[140px]">Component</th>
                    {MONTHS.map(m => <th key={m} className="px-3 py-2 text-right font-medium text-gray-500 whitespace-nowrap">{m}</th>)}
                    <th className="px-3 py-2 text-right font-bold text-gray-700 whitespace-nowrap">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPONENTS.map(({ key, label }) => {
                    const total = rowTotal(key)
                    if (total === 0) return null
                    return (
                      <tr key={key} className="border-t border-gray-50 hover:bg-gray-50">
                        <td className="px-3 py-2 font-medium text-gray-700 sticky left-0 bg-white">{label}</td>
                        {MONTHS.map(m => {
                          const v = get(m, key)
                          return <td key={m} className="px-3 py-2 text-right text-gray-600">
                            {v > 0 ? inr(v) : <span className="text-gray-200">—</span>}
                          </td>
                        })}
                        <td className="px-3 py-2 text-right font-semibold text-gray-900">{inr(total)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        }
      </Card>

      {/* Deductions table */}
      <Card title="Deductions" icon="📤">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left font-medium text-gray-500 sticky left-0 bg-gray-50 min-w-[140px]">Component</th>
                {MONTHS.map(m => <th key={m} className="px-3 py-2 text-right font-medium text-gray-500 whitespace-nowrap">{m}</th>)}
                <th className="px-3 py-2 text-right font-bold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {DEDUCTIONS.map(({ key, label }) => {
                const total = rowTotal(key)
                if (total === 0) return null
                return (
                  <tr key={key} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-gray-700 sticky left-0 bg-white">{label}</td>
                    {MONTHS.map(m => {
                      const v = get(m, key)
                      return <td key={m} className="px-3 py-2 text-right text-red-500">
                        {v > 0 ? inr(v) : <span className="text-gray-200">—</span>}
                      </td>
                    })}
                    <td className="px-3 py-2 text-right font-semibold text-red-600">{inr(total)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
