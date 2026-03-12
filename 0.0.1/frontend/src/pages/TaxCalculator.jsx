import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { computeTax } from '../api/client'
import { Card, Spinner } from '../components/ui'
import { inr, lakhs } from '../utils/format'

const Field = ({ label, name, value, onChange }) => (
  <div>
    <label className="text-xs text-gray-500 font-medium block mb-1">{label}</label>
    <input type="number" name={name} value={value} onChange={onChange}
      className="input" placeholder="0" />
  </div>
)

const defaults = {
  grossSalary: 3768980,
  otherIncome: 30000,
  sec80c: 322448,
  npsEmployee: 90000,
  npsEmployer: 122448,
  homeLoanInterest: 150000,
  sbInterest: 5000,
  professionTax: 2400,
}

export default function TaxCalculator() {
  const [form, setForm] = useState(defaults)
  const [result, setResult] = useState(null)

  const mutation = useMutation({
    mutationFn: computeTax,
    onSuccess: r => setResult(r.data)
  })

  const handle = e => setForm(p => ({ ...p, [e.target.name]: Number(e.target.value) }))
  const compute = () => mutation.mutate(form)

  const R = ({ label, old, neo, highlight }) => (
    <tr className={highlight ? 'font-bold bg-blue-50' : 'border-b border-gray-50 hover:bg-gray-50'}>
      <td className="py-2.5 pl-3 text-sm text-gray-700">{label}</td>
      <td className={`py-2.5 px-4 text-sm text-right ${Number(old) > 0 ? 'text-gray-900' : 'text-green-600'}`}>
        {inr(old || 0)}
      </td>
      <td className={`py-2.5 px-4 text-sm text-right ${Number(neo) > 0 ? 'text-gray-900' : 'text-green-600'}`}>
        {inr(neo || 0)}
      </td>
    </tr>
  )

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tax Calculator</h1>
        <p className="text-sm text-gray-500 mt-1">FY 2025-26 — Old vs New Regime comparison</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <Card title="Income & Deductions" icon="📝" className="lg:col-span-1">
          <div className="space-y-3">
            <Field label="Gross Salary (₹)" name="grossSalary" value={form.grossSalary} onChange={handle} />
            <Field label="Other Income (₹)" name="otherIncome" value={form.otherIncome} onChange={handle} />
            <div className="border-t pt-3 mt-1">
              <p className="text-xs text-gray-400 uppercase font-medium mb-2">Deductions</p>
              <Field label="80C (EPF+PPF+HL+ELSS)" name="sec80c" value={form.sec80c} onChange={handle} />
              <div className="mt-2" />
              <Field label="NPS Employee 80CCD(1)" name="npsEmployee" value={form.npsEmployee} onChange={handle} />
              <div className="mt-2" />
              <Field label="NPS Employer 80CCD(2)" name="npsEmployer" value={form.npsEmployer} onChange={handle} />
              <div className="mt-2" />
              <Field label="Home Loan Interest 24b" name="homeLoanInterest" value={form.homeLoanInterest} onChange={handle} />
              <div className="mt-2" />
              <Field label="SB Interest 80TTA" name="sbInterest" value={form.sbInterest} onChange={handle} />
              <div className="mt-2" />
              <Field label="Profession Tax" name="professionTax" value={form.professionTax} onChange={handle} />
            </div>
            <button onClick={compute}
              className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
              disabled={mutation.isPending}>
              {mutation.isPending ? <Spinner size="sm" /> : '⚡'}
              Compute Tax
            </button>
          </div>
        </Card>

        {/* Results */}
        <Card title="Tax Comparison" icon="🧾" className="lg:col-span-2">
          {!result ? (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <p className="text-4xl mb-3">🧾</p>
                <p>Click "Compute Tax" to see comparison</p>
              </div>
            </div>
          ) : (
            <div>
              {/* Recommendation */}
              <div className={`rounded-lg p-4 mb-4 flex items-center gap-3 
                ${result.recommended === 'NEW' ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-bold text-gray-800">
                    {result.recommended} REGIME saves you {inr(result.saving)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Old: {inr(result.oldRegime?.totalTax)} &nbsp;|&nbsp; New: {inr(result.newRegime?.totalTax)}
                  </p>
                </div>
              </div>

              {/* Comparison table */}
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 pl-3 text-xs text-gray-500 uppercase">Metric</th>
                    <th className="text-right py-2 px-4 text-xs text-red-600 uppercase">Old Regime</th>
                    <th className="text-right py-2 px-4 text-xs text-green-600 uppercase">New Regime</th>
                  </tr>
                </thead>
                <tbody>
                  <R label="Taxable Income"  old={result.oldRegime?.netTaxable} neo={result.newRegime?.netTaxable} />
                  <R label="Income Tax"      old={result.oldRegime?.tax}       neo={result.newRegime?.tax} />
                  <R label="Surcharge"       old={result.oldRegime?.surcharge} neo={result.newRegime?.surcharge} />
                  <R label="H&E Cess (4%)"  old={result.oldRegime?.cess}      neo={result.newRegime?.cess} />
                  <R label="Total Tax"       old={result.oldRegime?.totalTax}  neo={result.newRegime?.totalTax} highlight />
                </tbody>
              </table>

              {/* Slabs info */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs text-red-600 font-medium mb-2">Old Regime Slabs</p>
                  {[['0 – 2.5L','0%'],['2.5L – 5L','5%'],['5L – 10L','20%'],['>10L','30%']].map(([r,t])=>(
                    <div key={r} className="flex justify-between text-xs text-gray-700 py-0.5">
                      <span>{r}</span><span className="font-medium">{t}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-600 font-medium mb-2">New Regime Slabs</p>
                  {[['0 – 4L','0%'],['4L – 8L','5%'],['8L – 12L','10%'],['12L – 16L','15%'],['16L – 20L','20%'],['20L – 24L','25%'],['>24L','30%']].map(([r,t])=>(
                    <div key={r} className="flex justify-between text-xs text-gray-700 py-0.5">
                      <span>{r}</span><span className="font-medium">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
