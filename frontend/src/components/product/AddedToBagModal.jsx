import { Button, Carousel, Modal } from '@/components/ui'
import { useRecommendations } from '@/hooks/useCatalog'
import { useUI } from '@/store/ui'
import { formatPrice } from '@/utils/format'
import { ProductCard } from './ProductCard'

/**
 * Modal "SUCCESSFULLY ADDED TO BAG!" (ảnh #61).
 * Mở bằng `useUI.getState().showAddedToBag({ product, size, quantity, cart })`.
 */
export function AddedToBagModal() {
  const payload = useUI((s) => s.addedToBag)
  const hide = useUI((s) => s.hideAddedToBag)
  const { data: matches, isLoading } = useRecommendations(payload?.product.id, 'complete_look', 6)
  if (!payload) return null
  const { product, size, quantity, cart } = payload
  const s = cart?.summary

  return (
    <Modal open onClose={hide} size="lg" title="Đã thêm vào giỏ hàng!" bodyClassName="p-6 sm:p-7">
      <div className="grid gap-6 md:grid-cols-[1fr_1px_1fr]">
        <div className="flex gap-5">
          <img src={product.image.url} alt={product.image.alt} className="size-[150px] shrink-0 bg-image object-cover sm:size-[200px]" />
          <div className="text-[15px] leading-snug">
            <p className="mb-1 text-xl uppercase">{product.name}</p>
            {product.primeEligible && <p className="font-bold text-[#00a8e1]">✓prime</p>}
            <p className="my-1 font-bold">{formatPrice(product.price)}</p>
            <p>Màu: {product.colorName}</p>
            <p>Size: {size}</p>
            <p>Số lượng: {quantity}</p>
          </div>
        </div>
        <div className="hidden bg-ink md:block" aria-hidden />
        {s && (
          <div className="flex flex-col">
            <p className="text-sm">Giỏ hàng của bạn</p>
            <p className="text-[15px]">{s.itemCount} sản phẩm</p>
            <dl className="mt-1 border-b border-ink pb-1 text-[15px]">
              <div className="flex justify-between">
                <dt>Tiền hàng:</dt>
                <dd>{formatPrice(s.subtotal, { exact: true })}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Phí giao hàng:</dt>
                <dd>{s.delivery ? formatPrice(s.delivery, { exact: true }) : 'Miễn phí'}</dd>
              </div>
            </dl>
            <div className="mt-2 flex justify-between text-[15px] font-bold">
              <span>Tổng cộng:</span>
              <span>{formatPrice(s.total, { exact: true })}</span>
            </div>
            <p className="mb-4 text-sm">(đã bao gồm thuế)</p>
            <Button to="/cart" arrow fullWidth onClick={hide}>
              Xem giỏ hàng
            </Button>
            <Button variant="outline" arrow fullWidth className="mt-4" onClick={hide}>
              Tiếp tục mua sắm
            </Button>
          </div>
        )}
      </div>

      {(isLoading || matches?.length > 0) && (
        <div className="mt-8 border-t border-line pt-8">
          <p className="mb-6 text-lg font-bold">Kết hợp hoàn hảo cùng sản phẩm</p>
          <Carousel itemClassName="w-[45%] sm:w-[30%] md:w-[16.4%]" ariaLabel="Kết hợp hoàn hảo cùng sản phẩm">
            {(matches ?? []).map((p) => (
              <div key={p.id} onClickCapture={hide}>
                <ProductCard product={p} compact showWishlist={false} />
              </div>
            ))}
          </Carousel>
        </div>
      )}
    </Modal>
  )
}
