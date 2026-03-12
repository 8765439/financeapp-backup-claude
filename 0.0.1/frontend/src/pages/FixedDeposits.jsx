import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllFD, createFD, updateFD, deleteFD, getFDSummary } from '../api/client'
import { Card, StatCard, Table, Modal, FormField, Spinner, Badge, SectionHeader } from '../components/ui'
import { inr, lakhs } from '../utils/format'
import { differenceInDays, format, parseISO } from 'date-fns'

const emptyFD = {
  accountNumber: '', bankName: 'SBI', fdType: 'FD', startDate: '', maturityDate: '',
  principalAmount: '', interestRate: '', monthlyInterest: '', isActive: true, notes: ''
}

export default function FixedDeposits() {
  const qc = useQueryClient()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(emptyFD)

  const { data: fds = [], isLoading } = useQuery({
    queryKey: ['fds'],
    queryFn: () => getAllFD().then(r => r.data)
  })
  const { data: summary = {} } = useQuery({
    queryKey: ['fd-summary'],
    queryFn: () => getFDSummary().then(r => r.data)
  })

  const save = useMutation({
    mutationFn: d => d.id ? updateFD(d.id, d) : createFD(d),
    onSuccess: () => { qc.invalidateQueries(['fds','fd-summary']); setModal(false) }
  })
  const remove = useMutation({
    mutationFn: deleteFD,
    onSuccess: () => qc.invalidateQueries(['fds','fd-summary'])
  })

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const open = (fd = null) => { setForm(fd ? {...fd} : emptyFD); setModal(true) }

  const rows = fds.map(fd => {
    const days = fd.maturityDate ? differenceInDays(parseISO(fd.maturityDate), new Date()) : '-'
    return [
      <span className="font-mono text-xs">{fd.accountNumber}</span>,
      fd.bankName || '-',
      <Badge variant="blue">{fd.fdType}</Badge>,
      fd.startDate ? format(parseISO(fd.startDate), 'dd-MMM-yy') : '-',
      fd.maturityDate ? format(parseISO(fd.maturityDate), 'dd-MMM-yy') : '-',
      inr(fd.principalAmount),
      inr(fd.monthlyInterest),
      typeof days === 'number' ? (
        <span className={days < 90 ? 'text-red-600 font-medium' : 'text-gray-700'}>{days}d</span>
      ) : '-',
      fd.isActive ? <Badge variant="green">Active</Badge> : <Badge variant="red">Closed</Badge>,
      <div className="flex gap-2">
        <button onClick={() => open(fd)} className="text-xs text-blue-600 hover:underline">Edit</button>
        <button onClick={() => remove.mutate(fd.id)} className="text-xs text-red-500 hover:underline">Del</button>
      </div>
    ]
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fixed Deposits</h1>
        <p className="text-sm text-gray-500 mt-1">Track all FDs, RDs and recurring deposits</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard icon="💰" label="Total Principal" value={lakhs(summary.totalPrincipal)} color="blue" />
        <StatCard icon="📅" label="Monthly Interest" value={inr(summary.monthlyInterest)} color="green" />
        <StatCard icon="📋" label="Active FDs" value={`${summary.activeFdCount || 0} FDs`} color="purple" />
      </div>

      {/* Table */}
      <Card>
        <SectionHeader title="All Fixed Deposits"
          action={<button onClick={() => open()} className="btn-primary text-sm">+ Add FD</button>} />
        {isLoading ? <div className="flex justify-center py-12"><Spinner /></div> : (
          <Table
            headers={['Account No.','Bank','Type','Start','Maturity','Principal','Monthly Int.','Days Left','Status','Actions']}
            rows={rows}
            emptyMsg="No fixed deposits yet. Click + Add FD to get started."
          />
        )}
      </Card>

      {/* Modal */}
      <Modal open={modal} onClose={() => setModal(false)}
        title={form.id ? 'Edit Fixed Deposit' : 'Add Fixed Deposit'}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Account Number">
              <input name="accountNumber" value={form.accountNumber} onChange={handle} className="input" />
            </FormField>
            <FormField label="Bank Name">
              <input name="bankName" value={form.bankName} onChange={handle} className="input" />
            </FormField>
            <FormField label="FD Type">
              <select name="fdType" value={form.fdType} onChange={handle} className="input">
                {['FD','RD','MIS','POSB'].map(t => <option key={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Principal (₹)">
              <input name="principalAmount" type="number" value={form.principalAmount} onChange={handle} className="input" />
            </FormField>
            <FormField label="Start Date">
              <input name="startDate" type="date" value={form.startDate} onChange={handle} className="input" />
            </FormField>
            <FormField label="Maturity Date">
              <input name="maturityDate" type="date" value={form.maturityDate} onChange={handle} className="input" />
            </FormField>
            <FormField label="Interest Rate (%)">
              <input name="interestRate" type="number" step="0.01" value={form.interestRate} onChange={handle} className="input" />
            </FormField>
            <FormField label="Monthly Interest (₹)">
              <input name="monthlyInterest" type="number" value={form.monthlyInterest} onChange={handle} className="input" />
            </FormField>
          </div>
          <FormField label="Notes">
            <input name="notes" value={form.notes} onChange={handle} className="input" />
          </FormField>
          <div className="flex gap-3 justify-end pt-3">
            <button onClick={() => setModal(false)} className="btn-ghost">Cancel</button>
            <button onClick={() => save.mutate(form)} className="btn-primary"
              disabled={save.isPending}>
              {save.isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
