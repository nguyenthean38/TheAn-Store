/** Tính toán hiển thị cho bag / checkout (server đã tính tổng; ở đây chỉ suy ra số liệu để hiển thị). */

export const round2 = (n) => Math.round(n * 100) / 100

/** Tỉ lệ giảm của promo trên các item hợp lệ (VD 0.15). */
export function promoRate(cart) {
  if (!cart?.summary?.discount) return 0
  const eligible = cart.items.filter((it) => !it.product.promoExcluded).reduce((s, it) => s + it.lineTotal, 0)
  return eligible > 0 ? cart.summary.discount / eligible : 0
}

/** Giá gốc & giá sau giảm của một dòng (sale + promo). */
export function linePricing(item, rate = 0) {
  const original = round2((item.product.originalPrice ?? item.product.price) * item.quantity)
  const current = item.product.promoExcluded ? item.lineTotal : round2(item.lineTotal * (1 - rate))
  return { original, current, reduced: original - current > 0.004 }
}

/** Tổng hiển thị; `delivery` cho phép ghi đè phí giao hàng theo phương thức đã chọn ở checkout. */
export function cartTotals(cart, delivery) {
  const s = cart.summary
  const rate = promoRate(cart)
  const deliveryFee = delivery ?? s.delivery
  return {
    rate,
    percent: Math.round(rate * 100),
    itemCount: s.itemCount,
    current: round2(s.subtotal - s.discount),
    original: round2(cart.items.reduce((sum, it) => sum + (it.product.originalPrice ?? it.product.price) * it.quantity, 0)),
    tax: s.tax,
    discount: s.discount,
    delivery: deliveryFee,
    total: round2(s.total - s.delivery + deliveryFee),
  }
}
