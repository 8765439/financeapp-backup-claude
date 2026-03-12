import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllMF, createMF, deleteMF, getMFSum } from '../api/client'
import { Card, StatCard, Table, Modal, FormField, Badge, SectionHeader } from '../components/ui'
import { inr } from '../utils/format'

const empty = { fundName: '', amc: '', fundCategory: 'Equity', monthlySip: '', isActive: true }

export default function MutualFunds() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(false)
  const [form, setForm]   = useState(empty)

  const { data: mfs = [] } = useQuery({
    queryKey: ['mfs'],
    queryFn: () => getAllMF().then(r => r.data)
  })
  const { data: sum = {} } = useQuery({
    queryKey: ['mf-sum'],
    queryFn: () => getMFSum().then(r => r.data)
  })

  const save = useMutation({
    mutationFn: createMF,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['mfs', 'mf-sum'] }); setModal(false) }
  })
  const del = useMutation({
    mutationFn: deleteMF,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mfs', 'mf-sum'] })
  })

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const byAmc  = sum.byAmc || {}

  const rows = mfs.map(m => [
    <div>
      <p className="font-medium text-sm">{m.fundName}</p>
      <p className="text-xs text-gray-400">{m.amc}</p>
    </div>,
    m.fundCategory || '—',
    <span className="font-medium text-blue-700">{inr(m.monthlySip)}</span>,
    <span className="text-gray-600">{inr(Number(m.monthlySip) * 12)}</span>,
    m.isActive
      ? <Badge variant="green">Active</Badge>
      : <Badge variant="red">Paused</Badge>,
    <button onClick={() => del.mutate(m.id)} className="text-xs text-red-500 hover:underline">Remove</button>
  ])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mutual Fund SIPs</h1>
        <p className="text-sm text-gray-500 mt-1">Monthly systematic investment plans</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon="📈" label="Monthly SIP"  value={inr(sum.totalMonthlySip)} color="blue" />
        <StatCard icon="📅" label="Annual SIP"   value={inr(sum.totalAnnualSip)}  color="green" />
        <StatCard icon="🏦" label="AMCs"         value={`${Object.keys(byAmc).length} AMCs`} color="purple" />
      </div>

      {/* Per-AMC breakdown */}
      {Object.keys(byAmc).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(byAmc).map(([amc, amt]) => (
            <div key={amc} className="card text-center py-4">
              <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">{amc}</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{inr(amt)}<span className="text-xs text-gray-400 font-normal">/mo</span></p>
            </div>
          ))}
        </div>
      )}

      <Card>
        <SectionHeader title="All SIPs"
          action={<button onClick={() => { setForm(empty); setModal(true) }} className="btn-primary text-sm">+ Add SIP</button>} />
        <Table
          headers={['Fund', 'Category', 'Monthly', 'Annual', 'Status', 'Action']}
          rows={rows}
          emptyMsg="No SIPs yet. Click + Add SIP to get started." />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Mutual Fund SIP">
        <div className="space-y-3">
          <FormField label="Fund Name">
            <input name="fundName" value={form.fundName} onChange={handle} className="input" />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="AMC">
              <input name="amc" value={form.amc} onChange={handle} className="input" placeholder="Axis, Kotak…" />
            </FormField>
            <FormField label="Category">
              <select name="fundCategory" value={form.fundCategory} onChange={handle} className="input">
                {['Equity', 'Debt', 'Gold', 'Silver', 'Index', 'ELSS', 'FOF', 'Hybrid'].map(c =>
                  <option key={c}>{c}</option>
                )}
              </select>
            </FormField>
          </div>
          <FormField label="Monthly SIP (₹)">
            <input name="monthlySip" type="number" value={form.monthlySip} onChange={handle} className="input" />
          </FormField>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setModal(false)} className="btn-ghost">Cancel</button>
            <button onClick={() => save.mutate(form)} className="btn-primary" disabled={save.isPending}>
              {save.isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
