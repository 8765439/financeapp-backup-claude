import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllSGB, createSGB, deleteSGB, updateSGBPrice, getSGBSum } from '../api/client'
import { Card, StatCard, Table, Modal, FormField, Badge, Spinner, SectionHeader } from '../components/ui'
import { inr } from '../utils/format'
import { format, parseISO } from 'date-fns'

const empty = {
  seriesName: '', nseSymbol: '', isin: '', subscriptionDate: '', settlementDate: '',
  issuePrice: '', currentPrice: '0', quantityGrams: '', investedAmount: '',
  maturityDate: '', roi: '0.025'
}

export default function SovereignGoldBonds() {
  const qc = useQueryClient()
  const [modal, setModal]         = useState(false)
  const [priceModal, setPriceModal] = useState(null)
  const [form, setForm]           = useState(empty)
  const [newPrice, setNewPrice]   = useState('')

  const { data: sgbs = [], isLoading } = useQuery({
    queryKey: ['sgbs'],
    queryFn: () => getAllSGB().then(r => r.data)
  })
  const { data: sum = {} } = useQuery({
    queryKey: ['sgb-sum'],
    queryFn: () => getSGBSum().then(r => r.data)
  })

  const save  = useMutation({
    mutationFn: createSGB,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sgbs', 'sgb-sum'] }); setModal(false) }
  })
  const del   = useMutation({
    mutationFn: deleteSGB,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sgbs', 'sgb-sum'] })
  })
  const updPx = useMutation({
    mutationFn: ({ id, price }) => updateSGBPrice(id, price),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sgbs'] }); setPriceModal(null) }
  })

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const rows = sgbs.map(s => {
    const curVal = Number(s.currentPrice || 0) * Number(s.quantityGrams || 0)
    const pl     = curVal - Number(s.investedAmount || 0)
    return [
      <div>
        <p className="font-medium text-sm">{s.seriesName}</p>
        <p className="text-xs text-gray-400">{s.nseSymbol}</p>
      </div>,
      `${s.quantityGrams}g`,
      inr(s.issuePrice),
      s.currentPrice > 0
        ? inr(s.currentPrice)
        : <span className="text-gray-400 text-xs italic">tap to update</span>,
      inr(s.investedAmount),
      curVal > 0 ? inr(curVal) : '—',
      curVal > 0
        ? <span className={pl >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{inr(pl)}</span>
        : '—',
      s.maturityDate ? format(parseISO(s.maturityDate), 'MMM-yyyy') : '—',
      <div className="flex gap-2">
        <button onClick={() => { setPriceModal(s.id); setNewPrice(s.currentPrice || '') }}
          className="text-xs text-blue-600 hover:underline">Price</button>
        <button onClick={() => del.mutate(s.id)}
          className="text-xs text-red-500 hover:underline">Del</button>
      </div>
    ]
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sovereign Gold Bonds</h1>
        <p className="text-sm text-gray-500 mt-1">2.5% annual interest + gold price appreciation, tax-free on maturity</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon="🥇" label="Total Gold"      value={`${Number(sum.totalGrams || 0).toFixed(1)}g`} color="yellow" />
        <StatCard icon="💰" label="Total Invested"   value={inr(sum.totalInvested)} color="blue" />
        <StatCard icon="📊" label="Series Count"     value={`${sum.count || 0} series`} color="purple" />
      </div>

      <Card>
        <SectionHeader title="SGB Holdings"
          action={<button onClick={() => { setForm(empty); setModal(true) }} className="btn-primary text-sm">+ Add SGB</button>} />
        {isLoading
          ? <div className="flex justify-center py-8"><Spinner /></div>
          : <Table
              headers={['Series', 'Grams', 'Issue Price', 'Current Price', 'Invested', 'Market Value', 'P&L', 'Maturity', 'Actions']}
              rows={rows}
              emptyMsg="No SGBs yet. Click + Add SGB to get started." />
        }
      </Card>

      {/* Add SGB Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Add Sovereign Gold Bond">
        <div className="grid grid-cols-2 gap-3">
          {[
            ['seriesName',       'Series Name',       'text'],
            ['nseSymbol',        'NSE Symbol',        'text'],
            ['isin',             'ISIN',              'text'],
            ['issuePrice',       'Issue Price (₹)',   'number'],
            ['quantityGrams',    'Quantity (grams)',  'number'],
            ['investedAmount',   'Amount Invested (₹)', 'number'],
            ['subscriptionDate', 'Subscription Date', 'date'],
            ['settlementDate',   'Settlement Date',   'date'],
            ['maturityDate',     'Maturity Date',     'date'],
            ['currentPrice',     'Current Price (₹)', 'number'],
          ].map(([name, label, type]) => (
            <FormField key={name} label={label}>
              <input name={name} value={form[name]} onChange={handle} type={type} className="input" />
            </FormField>
          ))}
        </div>
        <div className="flex gap-3 justify-end pt-4">
          <button onClick={() => setModal(false)} className="btn-ghost">Cancel</button>
          <button onClick={() => save.mutate(form)} className="btn-primary" disabled={save.isPending}>
            {save.isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </Modal>

      {/* Update Price Modal */}
      <Modal open={!!priceModal} onClose={() => setPriceModal(null)} title="Update Gold Price">
        <FormField label="Current Price per gram (₹)">
          <input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="input" />
        </FormField>
        <p className="text-xs text-gray-400 mt-1">Get live price from NSE or MCX gold spot price</p>
        <div className="flex gap-3 justify-end pt-4">
          <button onClick={() => setPriceModal(null)} className="btn-ghost">Cancel</button>
          <button onClick={() => updPx.mutate({ id: priceModal, price: newPrice })} className="btn-primary">
            Update
          </button>
        </div>
      </Modal>
    </div>
  )
}
