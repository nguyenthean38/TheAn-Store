import { z } from 'zod'

/* ----------------------------- Address ----------------------------- */
export const ADDRESS_KEYS = ['firstName', 'lastName', 'street', 'city', 'state', 'zip', 'phone']
export const emptyAddress = () => Object.fromEntries(ADDRESS_KEYS.map((k) => [k, '']))

export const addressSchema = z.object({
  firstName: z.string().trim().min(1, 'Vui lòng nhập tên').max(40, 'Quá dài'),
  lastName: z.string().trim().min(1, 'Vui lòng nhập họ').max(40, 'Quá dài'),
  street: z.string().trim().min(3, 'Vui lòng nhập địa chỉ').max(100, 'Quá dài'),
  city: z.string().trim().min(2, 'Vui lòng nhập thành phố').max(60, 'Quá dài'),
  state: z.string().min(1, 'Vui lòng chọn tỉnh/bang'),
  zip: z.string().trim().regex(/^\d{5}(-\d{4})?$/, 'Vui lòng nhập mã ZIP hợp lệ'),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s().-]{7,20}$/, 'Vui lòng nhập số điện thoại hợp lệ')
    .refine((v) => v.replace(/\D/g, '').length >= 10, 'Vui lòng nhập số điện thoại hợp lệ'),
})

const looseAddress = z.object(Object.fromEntries(ADDRESS_KEYS.map((k) => [k, z.string().optional().default('')])))

/** Đẩy lỗi của một schema con vào ctx với tiền tố path. */
function forward(schema, value, ctx, path) {
  const r = schema.safeParse(value)
  if (!r.success) r.error.issues.forEach((i) => ctx.addIssue({ code: 'custom', message: i.message, path: [...path, ...i.path] }))
}

/* ------------------------- Contact + address ------------------------ */
// Shape lỏng + superRefine: mọi rule chạy cùng lúc (zod bỏ qua refine khi shape đã lỗi).
export const detailsSchema = z
  .object({
    email: z.string().default(''),
    addressMode: z.enum(['saved', 'new']),
    savedAddressId: z.string().optional().default(''),
    address: looseAddress,
    billingSame: z.boolean(),
    billing: looseAddress,
    ageConfirmed: z.boolean(),
  })
  .superRefine((v, ctx) => {
    if (!v.email.trim()) ctx.addIssue({ code: 'custom', message: 'Vui lòng nhập địa chỉ email', path: ['email'] })
    else if (!z.email().safeParse(v.email.trim()).success) ctx.addIssue({ code: 'custom', message: 'Vui lòng nhập địa chỉ email hợp lệ', path: ['email'] })
    if (v.addressMode === 'new') forward(addressSchema, v.address, ctx, ['address'])
    else if (!v.savedAddressId) ctx.addIssue({ code: 'custom', message: 'Vui lòng chọn địa chỉ giao hàng', path: ['savedAddressId'] })
    if (!v.billingSame) forward(addressSchema, v.billing, ctx, ['billing'])
    if (!v.ageConfirmed) ctx.addIssue({ code: 'custom', message: 'Bạn phải từ 13 tuổi trở lên để đặt hàng', path: ['ageConfirmed'] })
  })

/* ------------------------------ Payment ----------------------------- */
export const digitsOnly = (v = '') => v.replace(/\D/g, '')

export function detectBrand(value) {
  const d = digitsOnly(value)
  if (/^4/.test(d)) return 'visa'
  if (/^(5[1-5]|2[2-7])/.test(d)) return 'mastercard'
  if (/^3[47]/.test(d)) return 'amex'
  if (/^(6011|65|64[4-9])/.test(d)) return 'discover'
  return null
}

export const BRAND_BADGE = { visa: 'VISA', mastercard: 'Mastercard', amex: 'AMEX', discover: 'Discover' }

function luhn(d) {
  let sum = 0
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i])
    if (i % 2 === 1) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
  }
  return sum % 10 === 0
}

/** 4242 4242 4242 4242 (AMEX: 3782 822463 10005). */
export function formatCardNumber(value) {
  const brand = detectBrand(value)
  const d = digitsOnly(value).slice(0, brand === 'amex' ? 15 : 19)
  if (brand === 'amex') return [d.slice(0, 4), d.slice(4, 10), d.slice(10)].filter(Boolean).join(' ')
  return d.replace(/(\d{4})(?=\d)/g, '$1 ')
}

/** "0827" → "08 / 27". */
export function formatExpiry(value) {
  const d = digitsOnly(value).slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d
}

function expiryValid(value) {
  const m = /^(\d{2}) \/ (\d{2})$/.exec(value || '')
  if (!m) return false
  const month = Number(m[1])
  const year = 2000 + Number(m[2])
  if (month < 1 || month > 12) return false
  const now = new Date()
  const endOfMonth = new Date(year, month, 1) // đầu tháng kế tiếp
  return endOfMonth > now && year <= now.getFullYear() + 20
}

export const paymentSchema = z
  .object({
    method: z.enum(['card', 'paypal'], { message: 'Vui lòng chọn phương thức thanh toán' }),
    cardNumber: z.string().default(''),
    cardName: z.string().default(''),
    expiry: z.string().default(''),
    cvv: z.string().default(''),
    saveCard: z.boolean().default(false),
  })
  .superRefine((v, ctx) => {
    if (v.method !== 'card') return
    const d = digitsOnly(v.cardNumber)
    const brand = detectBrand(d)
    if (!d) ctx.addIssue({ code: 'custom', message: 'Vui lòng nhập số thẻ', path: ['cardNumber'] })
    else if (!brand || d.length < 13 || !luhn(d)) ctx.addIssue({ code: 'custom', message: 'Vui lòng nhập số thẻ hợp lệ', path: ['cardNumber'] })
    if (v.cardName.trim().length < 2) ctx.addIssue({ code: 'custom', message: 'Vui lòng nhập tên in trên thẻ', path: ['cardName'] })
    else if (!/^[\p{L} .'-]+$/u.test(v.cardName.trim())) ctx.addIssue({ code: 'custom', message: 'Vui lòng chỉ nhập chữ cái', path: ['cardName'] })
    if (!expiryValid(v.expiry)) ctx.addIssue({ code: 'custom', message: 'Vui lòng nhập ngày hết hạn hợp lệ', path: ['expiry'] })
    const cvvLen = brand === 'amex' ? 4 : 3
    if (!new RegExp(`^\\d{${cvvLen}}$`).test(v.cvv)) ctx.addIssue({ code: 'custom', message: `Vui lòng nhập CVV hợp lệ gồm ${cvvLen} chữ số`, path: ['cvv'] })
  })
