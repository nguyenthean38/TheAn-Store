import { Badge } from '@/components/ui'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/format'

/** Dòng sản phẩm trong đơn (ảnh #90, #92): ảnh vuông + tên, giá, size, màu, mã sản phẩm. */
export function OrderItem({ item, imageOverlay, className, imageClassName }) {
  return (
    <div className={cn('flex gap-5 sm:gap-10', className)}>
      <div className={cn('relative aspect-square w-32 shrink-0 bg-image sm:w-[264px]', imageClassName)}>
        <img src={item.image?.url} alt={item.image?.alt ?? item.name} className="size-full object-contain" loading="lazy" />
        {imageOverlay}
      </div>
      <div className="min-w-0 pt-3 text-[15px] leading-7">
        <p>{item.name}</p>
        <p>{formatPrice(item.price, { exact: true })}</p>
        <div className="mt-2 text-gray-400">
          <p>Size: {item.size}</p>
          {item.quantity > 1 && <p>Số lượng: {item.quantity}</p>}
          <p>Màu: {item.colorName}</p>
          <p>Mã sản phẩm: {item.productId}</p>
        </div>
        {item.cancelled && (
          <Badge tone="dark" className="mt-3">
            Đã hủy
          </Badge>
        )}
      </div>
    </div>
  )
}

/** Link gạch chân dạng chữ in hoa (LỊCH SỬ ĐƠN HÀNG, XEM CHI TIẾT SẢN PHẨM...). */
export function UnderlineButton({ className, children, ...rest }) {
  return (
    <button type="button" className={cn('border-b border-ink pb-0.5 text-[15px] uppercase transition-colors hover:border-transparent', className)} {...rest}>
      {children}
    </button>
  )
}
