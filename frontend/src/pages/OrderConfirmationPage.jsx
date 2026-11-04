import { useParams } from 'react-router-dom'
import { Check, CircleCheck, ExternalLink, Truck, Warehouse } from 'lucide-react'
import { Button, EmptyState, PageSpinner } from '@/components/ui'
import { DecorativeQr } from '@/components/checkout/DecorativeQr'
import { SummaryItem } from '@/components/checkout/CheckoutSummary'
import { AddressLines } from '@/components/checkout/StepSection'
import { useOrder } from '@/hooks/useOrders'
import { brand } from '@/config/brand'
import { formatDate, formatPrice, pluralize } from '@/utils/format'

const NEXT_STEPS = [
  { icon: Warehouse, title: 'Đang xử lý', text: 'Đơn hàng của bạn sẽ được chuẩn bị tại kho.' },
  { icon: Truck, title: 'Đang giao', text: 'Khi đơn hàng được gửi đi, bạn sẽ nhận thông tin theo dõi qua email.' },
  { icon: Check, title: 'Đã giao', text: 'Đơn hàng sẽ được giao đến địa chỉ hoặc điểm nhận hàng bạn đã chọn.' },
]

const PAYMENT_LABEL = { visa: 'Visa', mastercard: 'Mastercard', amex: 'American Express', discover: 'Discover' }

function TotalsRow({ label, value, strong }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? 'pt-3 font-bold' : ''}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

/** Tóm tắt đơn hàng dưới lời cảm ơn: sản phẩm, địa chỉ, giao hàng, thanh toán, tổng tiền. */
function OrderDetails({ order }) {
  const money = (v) => formatPrice(v, { exact: true })
  const itemCount = order.items.reduce((s, it) => s + it.quantity, 0)
  const { totals } = order
  return (
    <section aria-labelledby="order-details-title" className="mt-16 border-t border-gray-300 pt-10">
      <h2 id="order-details-title" className="ds-h3 mb-8 lg:text-[22px]">
        Tóm tắt đơn hàng <span className="ml-2 font-sans text-base font-normal normal-case text-gray-600">({pluralize(itemCount, 'sản phẩm')})</span>
      </h2>
      <ul className="space-y-8">
        {order.items.map((it) => (
          <SummaryItem key={it.id} image={it.image} name={it.name} size={it.size} quantity={it.quantity} colorName={it.colorName} price={it.price * it.quantity} />
        ))}
      </ul>

      <div className="mt-10 grid gap-8 text-[15px] sm:grid-cols-2">
        <div>
          <h3 className="ds-label mb-3">{order.shippingMethod?.id === 'pickup' ? 'Thông tin liên hệ' : 'Địa chỉ giao hàng'}</h3>
          <AddressLines address={order.shippingAddress} />
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="ds-label mb-3">Vận chuyển</h3>
            <p>{order.shippingMethod?.name}</p>
            {order.expectedDelivery && <p className="text-gray-600">Dự kiến {formatDate(order.expectedDelivery, { weekday: 'long', month: 'short', day: 'numeric' })}</p>}
          </div>
          <div>
            <h3 className="ds-label mb-3">Thanh toán</h3>
            <p>
              {order.payment?.method === 'card'
                ? `${PAYMENT_LABEL[order.payment.brand] ?? 'Thẻ'} có số cuối ${order.payment.last4}`
                : order.payment?.method === 'paypal'
                  ? 'PayPal'
                  : '—'}
            </p>
          </div>
        </div>
      </div>

      <dl className="mt-10 max-w-md space-y-1.5 text-[15px]">
        <TotalsRow label="Tạm tính" value={money(totals.subtotal)} />
        {totals.discount > 0 && <TotalsRow label="Giảm giá" value={`- ${money(totals.discount)}`} />}
        <TotalsRow label="Thuế" value={money(totals.tax)} />
        <TotalsRow label="Phí giao hàng" value={totals.delivery === 0 ? 'Miễn phí' : money(totals.delivery)} />
        <TotalsRow label="Tổng cộng" value={money(totals.total)} strong />
      </dl>
    </section>
  )
}

/** Trang cảm ơn sau khi đặt hàng (ảnh #125). */
export default function OrderConfirmationPage() {
  const { number } = useParams()
  const { data: order, isLoading, isError, error } = useOrder(number)

  if (isLoading) return <PageSpinner />

  if (isError || !order)
    return (
      <div className="container-content py-16">
        <EmptyState
          title="Không tìm thấy đơn hàng"
          description={error?.message || 'Chúng tôi không tìm thấy đơn hàng này. Nếu bạn vừa đặt hàng, hãy kiểm tra email xác nhận.'}
          action={
            <Button to="/" variant="outline" arrow>
              Về trang chủ
            </Button>
          }
        />
      </div>
    )

  return (
    <div className="container-content py-10 lg:py-14">
      <div className="mx-auto grid max-w-[1460px] gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1fr)_minmax(320px,465px)]">
        {/* Trái: cảm ơn */}
        <div className="min-w-0">
          <h1 className="ds-h2">Cảm ơn bạn!</h1>
          <div className="mt-5 flex items-center gap-3 bg-gray-100 px-6 py-10 text-[15px] sm:px-10" role="status">
            <CircleCheck className="size-8 shrink-0 fill-success text-white" strokeWidth={2} aria-hidden />
            Đơn hàng của bạn đang được xử lý
          </div>
          <p className="mt-8 text-[15px]">Mã đơn hàng: {order.number}</p>
          <p className="mt-4 text-[15px] leading-relaxed">
            Bạn sẽ sớm nhận được email xác nhận{order.email ? ` tại ${order.email}` : ''}. Đơn hàng sẽ xuất hiện trong tài khoản của bạn ngay khi bạn nhận được
            email.
          </p>
          <p className="mt-4 text-[15px]">Trong lúc chờ giao hàng, bạn có thể tiếp tục khám phá thêm nhiều sản phẩm trên website của chúng tôi.</p>
          <Button to="/" variant="outline" arrow className="mt-6 h-16 px-5">
            Về trang chủ
          </Button>

          <OrderDetails order={order} />
        </div>

        {/* Phải: các bước tiếp theo */}
        <aside aria-labelledby="next-steps-title">
          <h2 id="next-steps-title" className="ds-h2">
            Các bước tiếp theo
          </h2>
          <ol className="mt-6 space-y-7">
            {NEXT_STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="flex gap-6">
                <span className="flex size-[62px] shrink-0 items-center justify-center border border-ink">
                  <Icon className="size-6" strokeWidth={1.5} aria-hidden />
                </span>
                <div className="text-[15px] leading-relaxed">
                  <p className="font-bold">
                    <span className="sr-only">Bước {i + 1}: </span>
                    {title}
                  </p>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-16 bg-gray-100 px-6 py-12 sm:px-7">
            <h3 className="ds-h3 max-w-sm">Nhận thông báo ngay khi trạng thái đơn hàng thay đổi</h3>
            <p className="mt-10 max-w-[170px] text-sm leading-relaxed">
              Quét mã QR để tải ứng dụng {brand.shortName} và nhận thông báo mỗi khi đơn hàng có cập nhật.
            </p>
            <a
              href="/help"
              target="_blank"
              rel="noreferrer"
              className="ds-label mt-12 inline-flex h-16 items-center gap-6 border border-ink bg-white px-5 transition-colors hover:bg-ink hover:text-white"
            >
              Tải ứng dụng
              <ExternalLink className="size-6" strokeWidth={1.5} aria-hidden />
              <span className="sr-only">(mở trong thẻ mới)</span>
            </a>
            <div className="mt-6">
              <DecorativeQr seed={Number(order.number.replace(/\D/g, '').slice(-4)) || 7} size={136} className="border border-ink" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
