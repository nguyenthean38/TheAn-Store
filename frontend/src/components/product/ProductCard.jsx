import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Price } from '@/components/ui'
import { HeartIcon } from '@/components/ui/icons'
import { useToggleWishlist } from '@/hooks/useWishlist'
import { cn } from '@/utils/cn'

const BADGE_TEXT = { new: 'Mới', best_seller: 'Bán chạy', online_only: 'Chỉ bán online' }

/**
 * Card sản phẩm dùng ở PLP, carousel, wishlist (ảnh #17).
 * Nhận `ProductSummary` theo docs/API_CONTRACT.md.
 */
export function ProductCard({ product, className, showWishlist = true, showMeta = true, compact = false }) {
  const { isWished, toggle } = useToggleWishlist()
  const [hover, setHover] = useState(false)
  const wished = isWished(product.id)
  const img = hover && product.hoverImage ? product.hoverImage : product.image

  return (
    <article
      className={cn('group relative flex h-full flex-col border border-transparent bg-white transition-colors hover:border-ink', className)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link to={`/p/${product.slug}`} className="flex flex-1 flex-col" aria-label={`${product.name}, ${product.colorName}`}>
        <div className="relative aspect-square overflow-hidden bg-image">
          <img src={img.url} alt={img.alt} loading="lazy" className="size-full object-cover transition-transform duration-300" />
        </div>
        <div className={cn('flex flex-1 flex-col px-3 pt-3 pb-5', compact && 'px-2 pt-2 pb-3')}>
          <Price price={product.price} originalPrice={product.originalPrice} discountPercent={product.discountPercent} className="text-[15px]" />
          <h3 className={cn('mt-2 text-[15px] leading-snug', compact && 'text-sm')}>{product.name}</h3>
          {showMeta && (
            <>
              <p className="text-[15px] text-gray-400">{product.subtitle}</p>
              {product.colorsCount > 1 && <p className="text-[15px] text-gray-400">{product.colorsCount} màu</p>}
              {product.badges?.[0] && <p className="mt-0.5 text-[15px]">{BADGE_TEXT[product.badges[0]]}</p>}
            </>
          )}
        </div>
      </Link>
      {showWishlist && (
        <button
          type="button"
          onClick={() => toggle(product)}
          aria-pressed={wished}
          aria-label={wished ? `Bỏ ${product.name} khỏi yêu thích` : `Thêm ${product.name} vào yêu thích`}
          className="absolute top-3 right-3 flex size-8 items-center justify-center transition-transform hover:scale-110"
        >
          <HeartIcon size={20} filled={wished} />
        </button>
      )}
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="aspect-square animate-pulse bg-gray-100" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-12 animate-pulse bg-gray-100" />
        <div className="h-4 w-3/4 animate-pulse bg-gray-100" />
        <div className="h-4 w-1/2 animate-pulse bg-gray-100" />
      </div>
    </div>
  )
}
