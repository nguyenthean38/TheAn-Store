import { PaymentBadge } from '@/components/ui'
import { cn } from '@/utils/cn'

export const ACCEPTED_METHODS = ['AMEX', 'Discover', 'Mastercard', 'G Pay', 'VISA', 'affirm', 'PayPal', 'Afterpay']

/** "ACCEPTED PAYMENT METHODS" + hàng logo (ảnh #114). `muted` = bản xám ở cuối checkout (ảnh #120). */
export function AcceptedPaymentMethods({ title = 'Phương thức thanh toán được chấp nhận', muted = false, className }) {
  return (
    <div className={className}>
      {title && <h2 className="ds-label mb-5">{title}</h2>}
      <ul className={cn('flex flex-wrap gap-2', muted && 'opacity-50 grayscale')} aria-label={title || 'Phương thức thanh toán được chấp nhận'}>
        {ACCEPTED_METHODS.map((m) => (
          <li key={m}>
            <PaymentBadge name={m} />
          </li>
        ))}
      </ul>
    </div>
  )
}
