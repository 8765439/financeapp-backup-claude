export const inr = (val, decimals = 0) => {
  if (val == null || isNaN(val)) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR',
    maximumFractionDigits: decimals, minimumFractionDigits: decimals
  }).format(val)
}

export const lakhs = (val) => {
  if (val == null) return '₹0'
  const n = Number(val)
  if (Math.abs(n) >= 1e7) return `₹${(n/1e7).toFixed(2)}Cr`
  if (Math.abs(n) >= 1e5) return `₹${(n/1e5).toFixed(2)}L`
  return inr(n)
}

export const pct = (val, dec = 2) => `${Number(val).toFixed(dec)}%`

export const MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar']

export const clsx = (...args) => args.filter(Boolean).join(' ')
