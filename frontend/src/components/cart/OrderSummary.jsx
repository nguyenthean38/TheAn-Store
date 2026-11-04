import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { formatPrice, klarnaInstallment, pluralize } from '@/utils/format'
import { cartTotals } from './cartMath'

function Row({ label, value, className }) {
  return (
    <div className={cn('flex items-baseline justify-between gap-4', className)}>
      <dt>{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  )
}

/**
 * Các dòng tổng tiền (ảnh #114, #118, #119): n items, Original price, Sales Tax, Delivery, % off, Total, Klarna.
 * `delivery` (tuỳ chọn) ghi đè phí giao hàng theo phương thức đã chọn ở checkout.
 */
export function OrderSummaryLines({ cart, delivery, className }) {
  const t = cartTotals(cart, delivery)
  const money = (v) => formatPrice(v, { exact: true })
  return (
    <div className={cn('text-[15px]', className)}>
      <dl className="space-y-1.5">
        <Row label={pluralize(t.itemCount, 'sản phẩm')} value={money(t.current)} />
        {t.original - t.current > 0.004 && <Row label="Giá gốc" value={money(t.original)} />}
        <Row label="Thuế" value={money(t.tax)} />
        <Row label="Phí giao hàng" value={t.delivery === 0 ? 'Miễn phí' : money(t.delivery)} />
        {t.discount > 0 && <Row className="pt-4 text-gray-400" label={`Giảm ${t.percent}% mỗi sản phẩm`} value={`- ${money(t.discount)}`} />}
      </dl>
      <dl className="mt-5">
        <Row className="font-bold" label="Tổng cộng" value={money(t.total)} />
      </dl>
      <p className="mt-1 text-sm leading-snug">
        Hoặc trả góp 4 kỳ không lãi suất, mỗi kỳ {klarnaInstallment(t.total)}, với <span className="font-extrabold tracking-tight">Klarna</span>.{' '}
        <Link to="/help" className="ds-link">
          Tìm hiểu thêm
        </Link>
      </p>
    </div>
  )
}
