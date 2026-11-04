import { Check } from 'lucide-react'
import { ArrowLong, Button, EmptyState, Skeleton } from '@/components/ui'
import { ProductCarousel } from '@/components/product/ProductCarousel'
import { CartItemRow } from '@/components/cart/CartItemRow'
import { OrderSummaryLines } from '@/components/cart/OrderSummary'
import { PromoCode } from '@/components/cart/PromoCode'
import { AcceptedPaymentMethods } from '@/components/cart/PaymentMethods'
import { cartTotals } from '@/components/cart/cartMath'
import { useCart } from '@/hooks/useCart'
import { useRecommendations } from '@/hooks/useCatalog'
import { useUI } from '@/store/ui'
import { formatPrice, pluralize } from '@/utils/format'

function CartSkeleton() {
  return (
    <div className="container-content py-10 lg:py-16" aria-busy>
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <Skeleton className="h-11 w-60" />
          <Skeleton className="h-5 w-80" />
          <Skeleton className="h-[260px] w-full" />
          <Skeleton className="h-[260px] w-full" />
        </div>
        <div className="space-y-4 lg:col-span-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    </div>
  )
}

/** Google Pay (ảnh #115) — demo: chỉ thông báo. */
function GooglePayButton() {
  const toast = useUI((s) => s.toast)
  return (
    <button
      type="button"
      onClick={() => toast('Google Pay chưa khả dụng trong bản demo. Vui lòng chọn Thanh toán.', 'info')}
      className="flex h-16 w-full items-center justify-between border border-ink px-5 transition-colors hover:bg-gray-50"
      aria-label="Thanh toán bằng Google Pay"
    >
      <span className="text-[26px] leading-none font-medium tracking-tight" aria-hidden>
        <span className="font-bold text-[#4285f4]">G</span> <span className="text-gray-600">Pay</span>
      </span>
      <ArrowLong size={22} />
    </button>
  )
}

export default function CartPage() {
  const { data: cart, isLoading, isError, refetch } = useCart()
  const firstId = cart?.items?.[0]?.productId
  const { data: picks, isLoading: picksLoading } = useRecommendations(firstId, 'top_picks')

  if (isLoading) return <CartSkeleton />

  if (isError)
    return (
      <div className="container-content py-16">
        <EmptyState
          title="Đã có lỗi xảy ra"
          description="Không thể tải giỏ hàng của bạn. Vui lòng thử lại."
          action={
            <Button onClick={() => refetch()} arrow>
              Thử lại
            </Button>
          }
        />
      </div>
    )

  if (!cart?.items?.length)
    return (
      <div className="container-content py-10 lg:py-16">
        <EmptyState
          title="Giỏ hàng của bạn đang trống"
          description="Sản phẩm bạn thêm vào giỏ sẽ hiển thị tại đây. Bắt đầu mua sắm ngay nhé?"
          action={
            <Button to="/" arrow className="min-w-[240px]">
              Bắt đầu mua sắm
            </Button>
          }
        />
      </div>
    )

  const totals = cartTotals(cart)

  return (
    <div className="container-content py-10 lg:py-16">
      <div className="mx-auto grid max-w-[1460px] gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,465px)]">
        {/* Cột trái: danh sách sản phẩm */}
        <div className="min-w-0 lg:pt-7">
          <h1 className="ds-h1">Giỏ hàng của bạn</h1>
          <p className="mt-6 text-[15px]">
            <span className="uppercase">Tổng cộng</span>: ({pluralize(cart.summary.itemCount, 'sản phẩm')}) <strong className="font-bold">{formatPrice(totals.total, { exact: true })}</strong>
          </p>
          <p className="mt-3 text-[15px]">Sản phẩm trong giỏ chưa được giữ cho bạn — hãy thanh toán ngay để không bỏ lỡ.</p>

          <ul className="mt-12 space-y-12" aria-label="Sản phẩm trong giỏ hàng">
            {cart.items.map((item) => (
              <CartItemRow key={item.id} item={item} promoRate={totals.rate} />
            ))}
          </ul>

          {cart.promo && totals.percent > 0 && (
            <p className="mt-5 flex items-center gap-3 text-[15px] font-bold">
              <Check className="size-5 text-success" strokeWidth={2.5} aria-hidden />
              Đã áp dụng giảm {totals.percent}% cho mỗi sản phẩm
            </p>
          )}
        </div>

        {/* Cột phải: tổng kết */}
        <aside aria-labelledby="order-summary-title" className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
          <h2 id="order-summary-title" className="ds-h3 mb-10 lg:text-[26px]">
            Tóm tắt đơn hàng
          </h2>
          <OrderSummaryLines cart={cart} />

          <PromoCode promo={cart.promo} className="mt-12" />

          <Button to="/checkout" arrow fullWidth size="lg" className="mt-10 h-16">
            Thanh toán
          </Button>
          <p className="my-5 text-center text-[15px] uppercase">hoặc</p>
          <GooglePayButton />

          <AcceptedPaymentMethods className="mt-14" />
        </aside>

        <ProductCarousel title="Gợi ý dành cho bạn" products={picks} loading={picksLoading && Boolean(firstId)} className="min-w-0 lg:col-start-1" />
      </div>
    </div>
  )
}
