import { useQuery } from '@tanstack/react-query'
import { getDashboard } from '../api/client'
import { Card, StatCard, Spinner, Badge } from '../components/ui'
import { inr, lakhs } from '../utils/format'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4']

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getDashboard().then(r => r.data)
  })

  if (isLoading) return (
    <div className="flex items-center justify-center h-96">
      <Spinner size="lg" />
    </div>
  )

  if (error) return (
    <div className="p-6 text-red-600">Failed to load dashboard. Please refresh.</div>
  )

  const d = data || {}
  const isNew = d.recommendedRegime === 'NEW'

  // Chart data
  const taxCompare = [
    { regime: 'Old Regime', tax: Number(d.totalTaxOld || 0), fill: '#ef4444' },
    { regime: 'New Regime', tax: Number(d.totalTaxNew || 0), fill: '#10b981' },
  ]
  const sipData = [
    { name: 'Monthly SIP', value: Number(d.totalMonthlySip || 0) },
    { name: 'Home Loan EMI', value: 95000 },
    { name: 'Expenses', value: 130000 },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">FY 2025-26 • Overview</p>
      </div>

      {/* Regime Recommendation Banner */}
      <div className={`rounded-xl p-4 flex items-center gap-4 ${isNew ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
        <span className="text-2xl">{isNew ? '✅' : '✅'}</span>
        <div>
          <p className={`font-bold ${isNew ? 'text-green-800' : 'text-blue-800'}`}>
            {d.recommendedRegime} REGIME recommended — saves {lakhs(d.taxSaving)}
          </p>
          <p className={`text-sm ${isNew ? 'text-green-600' : 'text-blue-600'}`}>
            Old Regime Tax: {lakhs(d.totalTaxOld)} &nbsp;|&nbsp; New Regime Tax: {lakhs(d.totalTaxNew)}
          </p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="💼" label="Gross CTC" value={lakhs(d.grossSalary)} color="blue" />
        <StatCard icon="📤" label="Tax Paid" value={lakhs(d.taxPaid)} color="red" />
        <StatCard icon="🏧" label="FD Principal" value={lakhs(d.fdTotalPrincipal)} color="purple" />
        <StatCard icon="🥇" label="SGB Invested" value={inr(d.sgbTotalInvested)} color="yellow" />
      </div>

      {/* Tax Comparison + SIP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tax Comparison */}
        <Card title="Tax Comparison" icon="🧾">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={taxCompare} barSize={60}>
              <XAxis dataKey="regime" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={v => `₹${(v/100000).toFixed(1)}L`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={v => inr(v)} />
              <Bar dataKey="tax" radius={[6,6,0,0]}>
                {taxCompare.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
            {[
              { label: 'Net Taxable (Old)', val: lakhs(d.netTaxableOld) },
              { label: 'Net Taxable (New)', val: lakhs(d.netTaxableNew) },
              { label: 'Balance Due (Old)', val: inr(d.balanceDueOld), red: Number(d.balanceDueOld) > 0 },
              { label: 'Balance Due (New)', val: inr(d.balanceDueNew), green: Number(d.balanceDueNew) < 0 },
            ].map(r => (
              <div key={r.label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs">{r.label}</p>
                <p className={`font-semibold ${r.red ? 'text-red-600' : r.green ? 'text-green-600' : 'text-gray-900'}`}>
                  {r.val}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Deductions Summary */}
        <Card title="Key Deductions" icon="📦">
          <div className="space-y-2">
            {[
              { label: '80C Produced',         val: d.sec80cProduced, max: 150000 },
              { label: '80C Allowed (capped)',  val: d.sec80cAllowed,  max: 150000 },
              { label: 'NPS Employee 80CCD(1)', val: d.npsEmployee80ccd1, max: 50000 },
              { label: 'NPS Employer 80CCD(2)', val: d.npsEmployer80ccd2, max: 200000 },
              { label: 'Home Loan Interest 24b',val: d.homeLoanInterest24b, max: 200000 },
              { label: 'SB Interest 80TTA',     val: d.sbInterest80tta, max: 10000 },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600">{r.label}</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">{inr(r.val || 0)}</span>
                  <span className="text-xs text-gray-400 ml-1">/ {inr(r.max)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* FD + SGB + MF row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FD */}
        <Card title="Fixed Deposits" icon="🏧">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Total Principal</span>
              <span className="font-semibold">{inr(d.fdTotalPrincipal || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Maturing in 2026</span>
              <span className="font-semibold text-orange-600">{inr(d.fdMaturingThisYear || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">FDs Maturing</span>
              <Badge variant="blue">{d.fdMaturingCount || 0} FDs</Badge>
            </div>
          </div>
        </Card>

        {/* SGB */}
        <Card title="Sovereign Gold Bonds" icon="🥇">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Total Gold</span>
              <span className="font-semibold">{Number(d.sgbTotalGrams || 0).toFixed(1)} g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Invested</span>
              <span className="font-semibold">{inr(d.sgbTotalInvested || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Annual Interest</span>
              <span className="font-semibold text-green-600">{inr(d.sgbAnnualInterest || 0)}</span>
            </div>
            {d.sgbNextMaturity && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Next Maturity</span>
                <Badge variant="blue">{new Date(d.sgbNextMaturity).toLocaleDateString('en-IN', {month:'short',year:'numeric'})}</Badge>
              </div>
            )}
          </div>
        </Card>

        {/* MF SIPs */}
        <Card title="MF SIPs" icon="📈">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Monthly SIP</span>
              <span className="font-semibold text-blue-600">{inr(d.totalMonthlySip || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Annual SIP</span>
              <span className="font-semibold">{inr(d.totalAnnualSip || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Home Loan</span>
              <span className="font-semibold">{inr(d.hlSanctionedAmount || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Tenure</span>
              <span className="font-semibold">{d.hlTenureYears || 0} years</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
