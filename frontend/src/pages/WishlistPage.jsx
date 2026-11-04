import { Button, EmptyState } from '@/components/ui'
import { ProductCard, ProductCardSkeleton } from '@/components/product/ProductCard'
import { DecorativeQr } from '@/components/checkout/DecorativeQr'
import { useMe } from '@/hooks/useAuth'
import { useWishlist } from '@/hooks/useWishlist'
import { useUI } from '@/store/ui'
import { cn } from '@/utils/cn'
import { brand } from '@/config/brand'
import { pluralize } from '@/utils/format'

const APP_PERKS = ['Nhận thông báo ngay khi sản phẩm giảm giá hoặc sắp hết hàng', 'Chia sẻ danh sách yêu thích với bạn bè và gia đình', 'Xem sản phẩm yêu thích nào được áp dụng voucher']

/** Ô quảng bá app (ảnh #112, #113) — chiếm phần cột còn lại của hàng. */
function AppPromo({ className }) {
  return (
    <aside className={cn('flex flex-col bg-gray-100 px-6 py-8 sm:px-10 sm:py-10', className)} aria-labelledby="wishlist-app-title">
      <h2 id="wishlist-app-title" className="font-display text-2xl leading-tight font-extrabold tracking-tight lg:text-[36px]">
        Tận dụng tối đa danh sách yêu thích với ứng dụng
      </h2>
      <ul className="mt-6 list-disc space-y-4 pl-10 text-[15px] marker:text-ink">
        {APP_PERKS.map((p) => (
          <li key={p} className="pl-3">
            {p}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
        <p className="flex items-center gap-8 pb-6 text-[15px] font-bold">
          Quét mã để tải ứng dụng {brand.shortName}
          <svg viewBox="0 0 150 12" className="hidden h-3 w-36 text-gray-400 sm:block" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
            <path d="M1 8 C40 5 100 5 146 6 M139 1 L146 6 L139 11" />
          </svg>
        </p>
        <DecorativeQr seed={42} size={112} />
      </div>
    </aside>
  )
}

/** Trang wishlist (ảnh #112, #113). Card dùng `ProductCard`: tim đặc = bấm để bỏ khỏi wishlist. */
export default function WishlistPage() {
  const { data: items = [], isLoading } = useWishlist()
  const { data: me } = useMe()
  const openAuth = useUI((s) => s.openAuth)

  return (
    <div className="container-content py-10 lg:py-16">
      <div className="mx-auto max-w-[1232px]">
        <h1 className="ds-h1">Danh sách yêu thích</h1>

        {!me && (
          <p className="mt-4 text-sm text-gray-600">
            Danh sách yêu thích chỉ được lưu trên thiết bị này.{' '}
            <button type="button" onClick={() => openAuth()} className="ds-link font-semibold text-ink">
              Đăng nhập
            </button>{' '}
            để lưu vào tài khoản của bạn.
          </p>
        )}

        {isLoading ? (
          <div className="mt-10 grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4" aria-busy>
            {Array.from({ length: 4 }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            className="pt-8"
            title="Danh sách yêu thích của bạn đang trống"
            description="Sản phẩm bạn thêm vào danh sách yêu thích sẽ hiển thị tại đây. Nhấn biểu tượng trái tim trên sản phẩm bất kỳ để lưu lại xem sau."
            action={
              <Button to="/" arrow className="min-w-[240px]">
                Bắt đầu mua sắm
              </Button>
            }
          />
        ) : (
          <>
            <p className="mt-5 text-[15px] uppercase" aria-live="polite">
              {pluralize(items.length, 'sản phẩm')}
            </p>
            <div className="mt-10 grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} showMeta={false} />
              ))}
              <AppPromo className="col-span-full md:col-span-2 lg:col-span-3" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
