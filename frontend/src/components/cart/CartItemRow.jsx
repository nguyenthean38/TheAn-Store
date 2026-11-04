import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { HeartIcon, Select } from '@/components/ui'
import { useRemoveCartItem, useUpdateCartItem } from '@/hooks/useCart'
import { useToggleWishlist } from '@/hooks/useWishlist'
import { useUI } from '@/store/ui'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/format'
import { linePricing } from './cartMath'

const QTY_OPTIONS = Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))

/** Logo "prime" dạng chữ (không dùng file logo thương hiệu). */
function PrimeMark() {
  return (
    <span className="inline-flex items-baseline gap-0.5 text-[20px] leading-none font-bold text-[#00a8e1]" aria-label="Đủ điều kiện Prime">
      <span className="text-[#ff9900]" aria-hidden>
        ✓
      </span>
      <span aria-hidden>prime</span>
    </span>
  )
}

/** Một dòng sản phẩm trong bag (ảnh #114): ảnh, tên + màu, size, tồn kho, số lượng, giá, xoá & chuyển sang wishlist. */
export function CartItemRow({ item, promoRate = 0 }) {
  const { product } = item
  const update = useUpdateCartItem()
  const remove = useRemoveCartItem()
  const { isWished, toggle } = useToggleWishlist()
  const toast = useUI((s) => s.toast)
  const wished = isWished(product.id)
  const { original, current, reduced } = linePricing(item, promoRate)
  const href = `/p/${product.slug}`
  const busy = update.isPending || remove.isPending

  const moveToWishlist = () => {
    if (!wished) toggle(product)
    remove.mutate(item.id, { onSuccess: () => toast(`Đã chuyển ${product.name} vào danh sách yêu thích`, 'success') })
  }

  return (
    <li className={cn('flex border border-gray-400 transition-opacity', busy && 'opacity-60')}>
      <Link to={href} className="block aspect-square w-[38%] max-w-[305px] shrink-0 self-start bg-image" tabIndex={-1} aria-hidden>
        <img src={product.image.url} alt="" className="size-full object-cover" loading="lazy" />
      </Link>

      <div className="relative flex min-w-0 flex-1 flex-col p-4 pr-12 sm:p-6 sm:pr-16 md:pl-10">
        <div className="flex flex-col gap-2 text-sm uppercase sm:flex-row sm:justify-between sm:gap-6 sm:text-[15px]">
          <div className="min-w-0">
            <Link to={href} className="hover:underline">
              {product.name}
            </Link>
            <p>{product.colorName}</p>
          </div>
          <p className="shrink-0 whitespace-nowrap normal-case">
            {reduced ? (
              <>
                <span className="sr-only">Giá gốc </span>
                <s className="text-gray-600">{formatPrice(original, { exact: true })}</s>{' '}
                <span className="sr-only">Giá hiện tại </span>
                <span className="text-sale">{formatPrice(current, { exact: true })}</span>
              </>
            ) : (
              formatPrice(current, { exact: true })
            )}
          </p>
        </div>

        <p className="mt-3 text-sm uppercase sm:text-[15px]">Size: {item.size}</p>
        {item.lowStock && <p className="mt-1 text-sm font-bold sm:text-[15px]">Sắp hết hàng</p>}
        {product.primeEligible && (
          <p className="mt-2">
            <PrimeMark />
          </p>
        )}

        <div className="mt-auto pt-6">
          <Select
            aria-label={`Số lượng ${product.name}`}
            options={QTY_OPTIONS}
            value={String(item.quantity)}
            disabled={busy}
            onChange={(e) => update.mutate({ id: item.id, quantity: Number(e.target.value) })}
            className="w-[127px]"
            selectClassName="h-[70px] border-gray-400 font-bold"
          />
        </div>

        <div className="absolute top-3 right-2 flex flex-col items-center gap-1 sm:top-5 sm:right-4">
          <button
            type="button"
            onClick={() => remove.mutate(item.id)}
            disabled={busy}
            aria-label={`Xóa ${product.name} khỏi giỏ hàng`}
            className="flex size-10 items-center justify-center hover:opacity-60"
          >
            <X className="size-6" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={moveToWishlist}
            disabled={busy}
            aria-label={`Chuyển ${product.name} vào danh sách yêu thích`}
            className="flex size-10 items-center justify-center hover:opacity-60"
          >
            <HeartIcon size={22} filled={wished} />
          </button>
        </div>
      </div>
    </li>
  )
}
