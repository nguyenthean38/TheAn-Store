import { Link } from 'react-router-dom'
import { Button, EmptyState, Skeleton } from '@/components/ui'
import { OrderFaq } from '@/components/account/OrderFaq'
import { STATUS_LABEL, formatOrderDate } from '@/components/account/orderUtils'
import { useOrders } from '@/hooks/useOrders'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/format'

const STATUS_TONE = {
  in_progress: 'text-success',
  on_its_way: 'text-info',
  delivered: 'text-ink',
  cancelled: 'text-gray-400',
}

function OrderCard({ order }) {
  const visible = order.items.slice(0, 6)
  const more = order.items.length - visible.length
  return (
    <li>
      <Link
        to={`/account/orders/${order.number}`}
        className="group block bg-white px-6 pt-12 pb-[90px] outline-offset-4 transition-shadow hover:shadow-[inset_0_0_0_1px_#000]"
        aria-label={`Đơn hàng ${order.number}, ${formatOrderDate(order.placedAt)}, ${STATUS_LABEL[order.status]}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-display text-[22px] font-extrabold">
              {formatOrderDate(order.placedAt)} | {formatPrice(order.totals.total, { exact: true })}
            </p>
            <p className="text-lg">Mã đơn hàng: {order.number}</p>
          </div>
          <span className={cn('ds-label', STATUS_TONE[order.status])}>{STATUS_LABEL[order.status]}</span>
        </div>
        <ul className="mt-10 flex flex-wrap gap-3">
          {visible.map((it) => (
            <li key={it.id} className={cn('size-[102px] bg-image', it.cancelled && 'opacity-50')}>
              <img src={it.image?.url} alt={it.name} className="size-full object-contain" loading="lazy" />
            </li>
          ))}
          {more > 0 && <li className="flex size-[102px] items-center justify-center bg-gray-50 text-lg font-bold">+{more}</li>}
        </ul>
      </Link>
    </li>
  )
}

/** Lịch sử đơn hàng (ảnh #75). */
export default function OrdersPage() {
  const { data, isLoading, isError, refetch } = useOrders()
  const orders = data?.data ?? []

  return (
    <>
      <div className="container-content pt-12 pb-24">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-80" />
          </div>
        ) : isError ? (
          <EmptyState
            title="Đã có lỗi xảy ra"
            description="Không thể tải đơn hàng của bạn. Vui lòng thử lại."
            action={
              <Button variant="primary" onClick={() => refetch()}>
                Thử lại
              </Button>
            }
          />
        ) : orders.length === 0 ? (
          <div className="bg-white px-6 py-4">
            <EmptyState
              title="Bạn chưa có đơn hàng nào"
              description="Sau khi đặt hàng, bạn có thể theo dõi đơn và quản lý đổi trả tại đây."
              action={
                <Button to="/" arrow>
                  Bắt đầu mua sắm
                </Button>
              }
            />
          </div>
        ) : (
          <ul className="space-y-6">
            {orders.map((o) => (
              <OrderCard key={o.number} order={o} />
            ))}
          </ul>
        )}

        <div className="mt-16">
          <p className="text-lg">Bạn đang tìm đơn hàng của một tài khoản khác?</p>
          <Link to="/help" className="mt-3 inline-block border-b border-ink pb-0.5 text-lg uppercase hover:border-transparent">
            Tra cứu đơn hàng
          </Link>
        </div>
      </div>
      <OrderFaq />
    </>
  )
}
