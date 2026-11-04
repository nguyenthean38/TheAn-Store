const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const usdShort = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

/** $150 nếu là số nguyên (dùng ở card/PDP), $15.00 khi `exact` (bag, checkout). */
export function formatPrice(value, { exact = false } = {}) {
  if (value == null) return ''
  if (exact) return usd.format(value)
  return Number.isInteger(value) ? usdShort.format(value) : usd.format(value)
}

export function formatDate(iso, opts = { day: 'numeric', month: 'numeric', year: 'numeric' }) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('vi-VN', opts)
}

export function formatShortDay(iso) {
  return formatDate(iso, { weekday: 'short', day: 'numeric', month: 'long' })
}

/** Tiếng Việt không chia số nhiều: pluralize(2, 'sản phẩm') → '2 sản phẩm'. */
export function pluralize(n, word) {
  return `${n} ${word}`
}

export function klarnaInstallment(total) {
  return usd.format(Math.round((total / 4) * 100) / 100)
}
