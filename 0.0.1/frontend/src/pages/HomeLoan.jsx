import { useQuery } from '@tanstack/react-query'
import { getHomeLoan } from '../api/client'
import { Card, StatCard, Table } from '../components/ui'
import { inr, lakhs } from '../utils/format'

const RATE_HISTORY = [
  { date: '29-Jul-2024', rate: '8.65%', note: 'Initial rate' },
  { date: '05-Jan-2025', rate: '8.40%', note: 'Rate reduction' },
  { date: '15-Apr-2025', rate: '8.15%', note: 'Rate reduction' },
  { date: '15-Jun-2025', rate: '7.65%', note: 'Rate reduction' },
  { date: '15-Sep-2025', rate: '7.40%', note: 'Rate reduction' },
]

export default function HomeLoan() {
  const { data: loans = [] } = useQuery({
    queryKey: ['hl'],
    queryFn: () => getHomeLoan().then(r => r.data)
  })
  const loan = loans[0]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Home Loan Tracker</h1>
        <p className="text-sm text-gray-500 mt-1">SBI Home Loan — Primark Inspira, Hyderabad</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="🏦" label="Sanctioned"    value={lakhs(loan?.sanctionedAmount  || 9990000)}  color="blue" />
        <StatCard icon="💸" label="Disbursed"      value={lakhs(loan?.disbursedAmount   || 9948439)}  color="green" />
        <StatCard icon="📅" label="Tenure"         value={`${loan?.tenureYears || 30} years`}         color="purple" />
        <StatCard icon="📊" label="Current Rate"   value="7.40% p.a."                                color="yellow" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Interest Rate History" icon="📉">
          <Table
            headers={['Effective Date', 'Interest Rate', 'Note']}
            rows={RATE_HISTORY.map(r => [
              r.date,
              <span className="font-semibold text-blue-700">{r.rate}</span>,
              <span className="text-gray-400 text-xs">{r.note}</span>
            ])}
          />
        </Card>

        <Card title="Loan Details" icon="🏡">
          <div className="space-y-3">
            {[
              ['Property',            'Primark Inspira, Hyderabad'],
              ['Lender',              'SBI Home Loans'],
              ['Sanction Date',       '29-Jul-2024'],
              ['Sanction Amount',     '₹99,90,000'],
              ['Disbursed Amount',    '₹99,48,439'],
              ['Tenure',              '30 years'],
              ['EMI (approx)',        '₹90,000 – ₹95,000 / month'],
              ['Insurance Loan',      '₹5,27,214 (20yr @ 8.85%)'],
              ['Total Property Cost', '₹1,36,34,842'],
              ['Type',                'Self-occupied'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-gray-50 pb-2 last:border-0">
                <span className="text-sm text-gray-500">{k}</span>
                <span className="text-sm font-medium text-gray-800 text-right">{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Tax Benefits" icon="🧾">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Principal (80C)',         val: '₹1,50,000', note: 'Capped at ₹1.5L under 80C' },
            { label: 'Interest (24b)',           val: '₹1,50,000', note: 'Max ₹2L for self-occupied, if <₹35L stamped' },
            { label: 'Available in',            val: 'Old Regime only', note: 'New regime: no HL deductions' },
          ].map(r => (
            <div key={r.label} className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-blue-600 font-medium">{r.label}</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{r.val}</p>
              <p className="text-xs text-gray-400 mt-1">{r.note}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
