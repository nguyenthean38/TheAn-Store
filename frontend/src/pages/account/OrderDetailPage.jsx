import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Ban, Check, Store, Truck } from 'lucide-react'
import { Button, EmptyState, PageSpinner, PaymentBadge } from '@/components/ui'
import { DecorativeQr } from '@/components/account/DecorativeQr'
import { BackLink, OrderFaq } from '@/components/account/OrderFaq'
import { OrderItem, UnderlineButton } from '@/components/account/OrderItem'
import { STATUS_LABEL, cancelTimeLeft, formatLongDay, formatPlacedDay, humanizeDuration, itemCount, paymentInfo } from '@/components/account/orderUtils'
import { brand } from '@/config/brand'
import { useOrder } from '@/hooks/useOrders'
import { cn } from '@/utils/cn'
import { formatDate, formatPrice, pluralize } from '@/utils/format'

/** Thời gian hiện tại, cập nhật định kỳ (đếm ngược thời hạn hủy đơn). */
function useNow(interval = 30_000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), interval)
    return () => clearInterval(id)
  }, [interval])
  return now
}

const STEPS = {
  default: [
    { key: 'in_progress', label: STATUS_LABEL.in_progress, Icon: Store },
    { key: 'on_its_way', label: STATUS_LABEL.on_its_way, Icon: Truck },
    { key: 'delivered', label: STATUS_LABEL.delivered, Icon: Check },
  ],
  cancelled: [
    { key: 'in_progress', label: STATUS_LABEL.in_progress, Icon: Store },
    { key: 'cancelled', label: STATUS_LABEL.cancelled, Icon: Ban },
  ],
}

function ProgressTracker({ status }) {
  const steps = status === 'cancelled' ? STEPS.cancelled : STEPS.default
  const current = Math.max(0, steps.findIndex((s) => s.key === status))
  return (
    <ol className="grid gap-3" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }} aria-label="Tiến trình đơn hàng">
      {steps.map(({ key, label, Icon }, i) => {
        const reached = i <= current
        return (
          <li key={key} aria-current={i === current ? 'step' : undefined}>
            <Icon className={cn('ml-1 size-8', reached ? 'text-ink' : 'text-gray-400')} strokeWidth={1.2} aria-hidden />
            <div className={cn('mt-3 h-[3px]', reached ? 'bg-gray-600' : 'bg-gray-300')} />
            <p className={cn('mt-5 text-[13px] font-bold tracking-[0.04em] uppercase', reached ? 'text-ink' : 'text-gray-400')}>
              {label}
              {i < current && <span className="sr-only"> (đã hoàn thành)</span>}
            </p>
          </li>
        )
      })}
    </ol>
  )
}

function statusCopy(order) {
  switch (order.status) {
    case 'on_its_way':
      return { title: STATUS_LABEL.on_its_way, lines: ['Đơn hàng đã rời kho và đang trên đường đến với bạn.'], dateLabel: 'Dự kiến giao hàng:', date: order.expectedDelivery }
    case 'delivered':
      return { title: STATUS_LABEL.delivered, lines: ['Đơn hàng đã được giao. Hy vọng bạn sẽ thích!', 'Chưa thật sự ưng ý? Bạn có thể trả hàng trong vòng 30 ngày.'], dateLabel: 'Ngày giao:', date: order.expectedDelivery }
    case 'cancelled':
      return {
        title: STATUS_LABEL.cancelled,
        lines: ['Bạn đã hủy sản phẩm này. Nếu muốn đặt màu hoặc size khác, bạn có thể thêm lại sản phẩm vào giỏ hàng.'],
        dateLabel: 'Ngày hủy:',
        date: order.cancelledAt,
      }
    default:
      return {
        title: STATUS_LABEL.in_progress,
        lines: ['Chúng tôi đang chuẩn bị đơn hàng để gửi đi.', 'Đường dẫn theo dõi đơn sẽ xuất hiện khi đơn hàng bắt đầu được giao.'],
        dateLabel: 'Dự kiến giao hàng:',
        date: order.expectedDelivery,
      }
  }
}

/** Tải hóa đơn dạng text (demo — backend thật sẽ trả PDF). */
function downloadInvoice(order) {
  const lines = [
    brand.name,
    `HÓA ĐƠN — ĐƠN HÀNG ${order.number}`,
    `Ngày đặt: ${formatDate(order.placedAt)}`,
    `Email: ${order.email}`,
    '',
    ...order.items.map((it) => `${it.quantity} x ${it.name} (size ${it.size}) — ${formatPrice(it.price * it.quantity, { exact: true })}${it.cancelled ? ' [đã hủy]' : ''}`),
    '',
    `Tạm tính: ${formatPrice(order.totals.subtotal, { exact: true })}`,
    order.totals.discount ? `Giảm giá: -${formatPrice(order.totals.discount, { exact: true })}` : null,
    `Phí giao hàng: ${order.totals.delivery ? formatPrice(order.totals.delivery, { exact: true }) : 'Miễn phí'}`,
    `Thuế: ${formatPrice(order.totals.tax, { exact: true })}`,
    `Tổng cộng: ${formatPrice(order.totals.total, { exact: true })}`,
  ].filter((l) => l !== null)
  // BOM để Notepad/Excel nhận đúng tiếng Việt (UTF-8)
  const url = URL.createObjectURL(new Blob(['﻿' + lines.join('\n')], { type: 'text/plain;charset=utf-8' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: `hoa-don-${order.number}.txt` })
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function Row({ label, children, strong }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5 text-lg">
      <dt className={strong === false ? '' : 'font-bold'}>{label}</dt>
      <dd className={cn('text-right', strong && 'font-bold')}>{children}</dd>
    </div>
  )
}

function SideHeading({ children, className }) {
  return <h2 className={cn('font-display text-[22px] font-extrabold uppercase', className)}>{children}</h2>
}

function ItemsBlock({ order }) {
  const [expanded, setExpanded] = useState(false)
  const count = itemCount(order.items)
  return (
    <div className="pt-12">
      <p className="text-lg">{pluralize(count, 'sản phẩm')}</p>
      {expanded ? (
        <ul className="mt-4 space-y-8">
          {order.items.map((it) => (
            <li key={it.id}>
              <OrderItem item={it} imageClassName="sm:w-[284px]" />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mt-4 flex flex-wrap gap-3">
          {order.items.map((it) => (
            <li key={it.id} className={cn('size-[134px] bg-image', it.cancelled && 'opacity-50')}>
              <img src={it.image?.url} alt={it.name} className="size-full object-contain" loading="lazy" />
            </li>
          ))}
        </ul>
      )}
      <UnderlineButton onClick={() => setExpanded((e) => !e)} aria-expanded={expanded} className="mt-6">
        {expanded ? 'Ẩn chi tiết sản phẩm' : 'Xem chi tiết sản phẩm'}
      </UnderlineButton>
    </div>
  )
}

/** Chi tiết đơn hàng (ảnh #89–#91, #97). */
export default function OrderDetailPage() {
  const { number } = useParams()
  const location = useLocation()
  const { data: order, isLoading, isError, error } = useOrder(number)
  const now = useNow()
  const [allDetails, setAllDetails] = useState(false)

  if (isLoading) return <PageSpinner />
  if (isError || !order)
    return (
      <div className="container-content pt-12 pb-24">
        <BackLink to="/account/orders">Lịch sử đơn hàng</BackLink>
        <EmptyState
          title="Không tìm thấy đơn hàng"
          description={error?.status === 403 ? 'Đơn hàng này thuộc về một tài khoản khác.' : 'Chúng tôi không tìm thấy đơn hàng này. Vui lòng kiểm tra lại mã đơn hàng và thử lại.'}
          action={
            <Button to="/account/orders" arrow>
              Xem đơn hàng của bạn
            </Button>
          }
        />
      </div>
    )

  const copy = statusCopy(order)
  const isCancelled = order.status === 'cancelled'
  const timeLeft = cancelTimeLeft(order, now)
  const pay = paymentInfo(order.payment)
  const showBanner = isCancelled || location.state?.cancelled
  const count = itemCount(order.items)
  const addr = order.shippingAddress
  const firstActive = order.items.find((it) => !it.cancelled) ?? order.items[0]

  return (
    <div className="bg-white">
      <div className="container-content pt-12 pb-16">
        {showBanner && (
          <div role="status" className="mb-10 bg-image px-6 py-10 sm:px-10">
            <h2 className="font-display text-[22px] font-extrabold uppercase">Đã xác nhận. Đơn hàng đã được hủy!</h2>
            <p className="mt-3 text-lg">
              Chúng tôi đang xử lý hoàn tiền cho bạn. Quá trình này có thể mất đến 14 ngày, tùy vào ngân hàng bạn sử dụng. Thẻ tín dụng sẽ không bị trừ tiền.
            </p>
          </div>
        )}

        <BackLink to="/account/orders">Lịch sử đơn hàng</BackLink>
        <h1 className="mt-14 font-display text-[22px] font-extrabold uppercase">Đơn hàng {order.number}</h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,950px)_minmax(0,540px)] lg:justify-between lg:gap-16">
          {/* Cột trái: tiến trình + sản phẩm */}
          <section aria-label="Trạng thái đơn hàng" className="self-start border border-gray-300 px-5 pt-10 pb-10 sm:px-10">
            <ProgressTracker status={order.status} />

            <div className="grid gap-8 border-b border-gray-300 pt-24 pb-12 sm:grid-cols-[minmax(0,1fr)_minmax(0,300px)]">
              <div>
                <h2 className="font-display text-3xl font-extrabold uppercase">{copy.title}</h2>
                <div className="mt-7 max-w-md space-y-3 text-lg leading-7">
                  {copy.lines.map((l) => (
                    <p key={l}>{l}</p>
                  ))}
                </div>
                {isCancelled && firstActive && (
                  <Button to={`/search?q=${encodeURIComponent(firstActive.name)}`} arrow className="mt-12 w-full max-w-[436px] text-[15px] tracking-[0.06em]" size="lg">
                    Đặt lại
                  </Button>
                )}
              </div>
              {copy.date && (
                <div className="text-lg">
                  <p>{copy.dateLabel}</p>
                  <p className="mt-3 font-display text-[22px] font-extrabold uppercase">{formatLongDay(copy.date)}</p>
                </div>
              )}
            </div>

            <ItemsBlock order={order} />
          </section>

          {/* Cột phải: QR, quản lý đơn, thông tin đơn */}
          <aside className="space-y-0">
            {!isCancelled && order.status !== 'delivered' && (
              <section aria-labelledby="qr-title" className="pb-12">
                <SideHeading>
                  <span id="qr-title">Nhận cập nhật đơn hàng nhanh</span>
                </SideHeading>
                <p className="mt-6 text-lg">Quét mã QR bên dưới bằng điện thoại của bạn</p>
                <DecorativeQr value={order.number} className="mt-6" />
              </section>
            )}

            {timeLeft > 0 && (
              <section aria-labelledby="manage-title" className="border-b border-gray-300 pb-12">
                <SideHeading>
                  <span id="manage-title">Quản lý đơn hàng</span>
                </SideHeading>
                <p className="mt-6 text-lg">
                  Bạn có thể hủy đơn hàng trong vòng <strong>{humanizeDuration(timeLeft)}</strong> tới
                </p>
                <Button to={`/account/orders/${order.number}/cancel`} variant="outline" arrow className="mt-6 h-[60px] w-full max-w-[436px] text-[15px] tracking-[0.06em]">
                  Hủy đơn hàng
                </Button>
              </section>
            )}

            <section aria-labelledby="details-title" className={cn(timeLeft > 0 && 'pt-14')}>
              <SideHeading>
                <span id="details-title">Chi tiết đơn hàng</span>
              </SideHeading>
              <dl className="mt-5">
                <Row label="Mã đơn hàng:">{order.number}</Row>
                <Row label="Ngày đặt:">{formatPlacedDay(order.placedAt)}</Row>
                <div className="py-1.5 text-lg">
                  <dt className="font-bold">Đơn vị vận chuyển:</dt>
                  <dd className="mt-2 flex items-center justify-between gap-4">
                    {order.shippingMethod?.name}
                    <Truck className="size-7 shrink-0" strokeWidth={1.2} aria-hidden />
                  </dd>
                </div>
                <div className="py-1.5 text-lg">
                  <dt className="font-bold">Phương thức thanh toán:</dt>
                  <dd className="mt-2 flex items-center justify-between gap-4">
                    {pay.label}
                    {pay.badge && <PaymentBadge name={pay.badge} />}
                  </dd>
                </div>
                <Row label="Tổng cộng:" strong>
                  {formatPrice(order.totals.total, { exact: true })}
                </Row>
              </dl>
              <UnderlineButton onClick={() => downloadInvoice(order)} className="mt-8">
                Tải hóa đơn
              </UnderlineButton>
            </section>

            {allDetails && (
              <div id="all-details" className="mt-10">
                <section className="border-t border-gray-300 py-12">
                  <SideHeading>Giao hàng</SideHeading>
                  <p className="mt-8 text-lg font-bold">Đơn vị vận chuyển</p>
                  <p className="mt-2 flex items-center justify-between text-lg">
                    {order.shippingMethod?.name}
                    <Truck className="size-7" strokeWidth={1.2} aria-hidden />
                  </p>
                  <p className="mt-8 text-lg font-bold">Địa chỉ giao hàng</p>
                  {addr && (
                    <address className="mt-4 text-lg leading-7 not-italic">
                      {addr.firstName} {addr.lastName}
                      <br />
                      {addr.street}
                      <br />
                      {addr.city}, {addr.state} {addr.zip}
                      <br />
                      {addr.country === 'US' ? 'Hoa Kỳ' : addr.country}
                      <br />
                      {addr.phone}
                      <br />
                      {order.email}
                    </address>
                  )}
                </section>
                <section className="border-t border-gray-300 py-12">
                  <SideHeading>Phương thức thanh toán</SideHeading>
                  <p className="mt-6 flex items-center justify-between text-lg">
                    {pay.label}
                    {pay.badge && <PaymentBadge name={pay.badge} />}
                  </p>
                </section>
                <section className="border-t border-gray-300 pt-12">
                  <SideHeading>Tổng tiền</SideHeading>
                  <dl className="mt-6">
                    <Row label={pluralize(count, 'sản phẩm')} strong={false}>
                      {formatPrice(order.totals.subtotal, { exact: true })}
                    </Row>
                    {order.totals.discount > 0 && (
                      <Row label="Giảm giá" strong={false}>
                        -{formatPrice(order.totals.discount, { exact: true })}
                      </Row>
                    )}
                    <Row label="Phí giao hàng" strong={false}>
                      {order.totals.delivery ? formatPrice(order.totals.delivery, { exact: true }) : 'Miễn phí'}
                    </Row>
                    <Row label="Thuế" strong={false}>
                      {formatPrice(order.totals.tax, { exact: true })}
                    </Row>
                    <div className="mt-3">
                      <Row label="Tổng cộng" strong>
                        {formatPrice(order.totals.total, { exact: true })}
                      </Row>
                    </div>
                  </dl>
                </section>
              </div>
            )}

            <UnderlineButton onClick={() => setAllDetails((v) => !v)} aria-expanded={allDetails} aria-controls="all-details" className="mt-12">
              {allDetails ? 'Ẩn tất cả chi tiết' : 'Xem tất cả chi tiết'}
            </UnderlineButton>
          </aside>
        </div>
      </div>
      <OrderFaq />
    </div>
  )
}
