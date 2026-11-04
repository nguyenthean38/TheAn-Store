/** Helper hiển thị đơn hàng dùng chung cho Đơn hàng / Chi tiết đơn / Hủy đơn. */

export const CANCEL_REASONS = [
  { value: 'wrong_size', label: 'Sai size' },
  { value: 'wrong_quantity', label: 'Sai số lượng' },
  { value: 'wrong_colour', label: 'Sai màu' },
  { value: 'forgot_voucher', label: 'Quên áp dụng voucher' },
  { value: 'changed_mind', label: 'Muốn đổi sản phẩm khác' },
]

export const STATUS_LABEL = {
  in_progress: 'Đang xử lý',
  on_its_way: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
}

/** "12/06/2025" */
export function formatOrderDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

/** "Thứ Ba, 17 tháng 6" (in hoa bằng CSS khi cần). */
export function formatLongDay(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })
}

/** "Th 5, 12/6" */
export function formatPlacedDay(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' })
}

/** Số mili-giây còn lại để hủy đơn (0 nếu không hủy được). */
export function cancelTimeLeft(order, now = Date.now()) {
  if (!order || order.status !== 'in_progress' || !order.cancellableUntil) return 0
  if (!order.items?.some((it) => !it.cancelled)) return 0
  return Math.max(0, new Date(order.cancellableUntil).getTime() - now)
}

/** 15 phút → "15 phút", 30 giờ → "30 giờ", 7 ngày → "7 ngày". */
export function humanizeDuration(ms) {
  const minutes = Math.max(1, Math.ceil(ms / 60000))
  if (minutes < 60) return `${minutes} phút`
  const hours = Math.floor(minutes / 60)
  if (hours < 48) return `${hours} giờ`
  const days = Math.floor(hours / 24)
  return `${days} ngày`
}

const BRAND_NAMES = { visa: 'VISA', mastercard: 'Mastercard', amex: 'AMEX', discover: 'Discover' }

export function paymentInfo(payment) {
  if (!payment) return { label: '', badge: null }
  if (payment.method === 'paypal') return { label: 'PayPal', badge: 'PayPal' }
  return {
    label: payment.last4 ? `Thẻ tín dụng/ghi nợ (... ${payment.last4})` : 'Thẻ tín dụng/ghi nợ',
    badge: BRAND_NAMES[payment.brand?.toLowerCase()] ?? null,
  }
}

export function itemCount(items = []) {
  return items.reduce((n, it) => n + (it.quantity ?? 1), 0)
}
