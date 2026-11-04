import { Link } from 'react-router-dom'
import { Bell, LoaderCircle, Star } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/format'
import { ArrowBack } from './icons'

/* ------------------------------ Badge ------------------------------ */
const BADGE_TONES = {
  info: 'bg-info text-white',
  sale: 'bg-sale text-white',
  neutral: 'bg-white text-ink',
  dark: 'bg-ink text-white',
  warning: 'bg-warning text-ink',
}
export function Badge({ tone = 'neutral', className, children }) {
  return <span className={cn('inline-flex items-center px-2 py-1 text-[11px] font-bold tracking-[0.05em] uppercase', BADGE_TONES[tone], className)}>{children}</span>
}

/* ------------------------------ Rating ----------------------------- */
/** Hiển thị sao (đọc). Dùng `StarInput` (review/) cho nhập liệu. */
export function Rating({ value = 0, count, size = 16, href, className, showValue = false }) {
  const stars = (
    <span className="inline-flex" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - (i - 1)))
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star className="absolute inset-0 text-ink" style={{ width: size, height: size }} strokeWidth={1.5} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="fill-ink text-ink" style={{ width: size, height: size }} strokeWidth={1.5} />
            </span>
          </span>
        )
      })}
    </span>
  )
  return (
    <span className={cn('inline-flex items-center gap-2', className)} aria-label={`Đánh giá ${value} trên 5${count != null ? `, ${count} lượt đánh giá` : ''}`}>
      {showValue && <span className="font-bold">{value.toFixed(1)}</span>}
      {stars}
      {count != null &&
        (href ? (
          <a href={href} className="ds-link text-sm">
            {count}
          </a>
        ) : (
          <span className="text-sm">{count}</span>
        ))}
    </span>
  )
}

/* ------------------------------ Price ------------------------------ */
/** Giá: sale đỏ + giá gốc + % giảm (ảnh #17). */
export function Price({ price, originalPrice, discountPercent, exact = false, layout = 'stack', className }) {
  const onSale = originalPrice && originalPrice > price
  if (!onSale) return <div className={cn('font-semibold', className)}>{formatPrice(price, { exact })}</div>
  return (
    <div className={cn(layout === 'inline' ? 'flex flex-wrap items-baseline gap-2' : '', className)}>
      <div className="font-semibold text-sale">{formatPrice(price, { exact })}</div>
      <div className="text-sm text-gray-600">
        <span className="sr-only">Giá gốc </span>
        <span className={layout === 'inline' ? 'line-through' : ''}>{formatPrice(originalPrice, { exact })}</span>
        {layout !== 'inline' && ' Giá gốc'}
        {discountPercent ? <span className="ml-1.5 text-sale">-{discountPercent}%</span> : null}
      </div>
    </div>
  )
}

/* ---------------------------- Breadcrumbs -------------------------- */
export function Breadcrumbs({ items = [], back = true, className, onBack }) {
  return (
    <nav aria-label="Đường dẫn" className={cn('flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px]', className)}>
      {back && (
        <button type="button" onClick={onBack ?? (() => window.history.back())} className="mr-3 inline-flex items-center gap-2 font-bold tracking-[0.05em] uppercase underline underline-offset-4 hover:no-underline">
          <ArrowBack /> Quay lại
        </button>
      )}
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-2">
          {i > 0 && <span aria-hidden>/</span>}
          {it.href && i < items.length - 1 ? (
            <Link to={it.href} className="ds-link">
              {it.label}
            </Link>
          ) : (
            <span aria-current={i === items.length - 1 ? 'page' : undefined}>{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

/* ----------------------------- SizeGrid ---------------------------- */
/**
 * Lưới chọn size (ảnh #32). Size hết hàng: gạch ngang + icon chuông.
 * `variant="filter"` cho drawer lọc (ô viền, ảnh #26).
 */
export function SizeGrid({ sizes, value, onChange, columns = 5, variant = 'pdp', multiple = false, className }) {
  const selected = multiple ? value ?? [] : [value]
  return (
    <div role={multiple ? 'group' : 'radiogroup'} className={cn('grid', variant === 'pdp' ? 'gap-1.5' : 'border-t border-l border-gray-300', className)} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {sizes.map((s) => {
        const label = typeof s === 'string' ? s : s.label
        const inStock = typeof s === 'string' ? true : s.inStock !== false
        const active = selected.includes(label)
        return (
          <button
            key={label}
            type="button"
            role={multiple ? 'checkbox' : 'radio'}
            aria-checked={active}
            aria-label={`Size ${label}${inStock ? '' : ' — hết hàng, nhận thông báo khi có hàng'}`}
            onClick={() => onChange?.(label, inStock)}
            className={cn(
              'relative flex h-12 items-center justify-center text-sm transition-colors',
              variant === 'pdp'
                ? active
                  ? 'bg-ink font-semibold text-white'
                  : inStock
                    ? 'bg-gray-100 hover:outline hover:outline-1 hover:outline-ink'
                    : 'bg-gray-50 text-gray-400'
                : cn('border-r border-b border-gray-300', active ? 'z-10 font-bold outline outline-1 outline-ink' : 'hover:bg-gray-50'),
            )}
          >
            <span className={cn(!inStock && 'line-through')}>{label}</span>
            {!inStock && <Bell className="absolute top-1.5 right-2 size-4 text-ink" aria-hidden />}
          </button>
        )
      })}
    </div>
  )
}

/* --------------------------- ColorSwatches ------------------------- */
/** Thumbnail colorway trên PDP (ảnh #32): ô ảnh + gạch dưới khi chọn, gạch chéo khi hết hàng. */
export function ColorSwatches({ variants, activeId, className, getHref }) {
  return (
    <div className={cn('grid grid-cols-5 gap-1.5', className)}>
      {variants.map((v) => {
        const active = v.id === activeId
        return (
          <Link
            key={v.id}
            to={getHref(v)}
            title={v.colorName}
            aria-label={v.colorName}
            aria-current={active || undefined}
            className={cn('relative block aspect-square bg-image', active ? 'after:absolute after:inset-x-0 after:-bottom-1.5 after:h-1 after:bg-ink' : 'hover:outline hover:outline-1 hover:outline-ink')}
          >
            <img src={v.image.url} alt="" className="size-full object-contain" loading="lazy" />
            {!v.available && <span className="absolute inset-0 bg-[linear-gradient(to_top_right,transparent_calc(50%-1px),#000_50%,transparent_calc(50%+1px))]" aria-hidden />}
          </Link>
        )
      })}
    </div>
  )
}

/* ------------------------- Spinner / Skeleton ---------------------- */
export function Spinner({ className, label = 'Đang tải' }) {
  return (
    <span role="status" className={cn('inline-flex items-center justify-center', className)}>
      <LoaderCircle className="size-8 animate-spin" aria-hidden />
      <span className="sr-only">{label}</span>
    </span>
  )
}

export function PageSpinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner />
    </div>
  )
}

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse bg-gray-100', className)} aria-hidden />
}

/* ----------------------------- EmptyState -------------------------- */
export function EmptyState({ title, description, action, className }) {
  return (
    <div className={cn('py-16', className)}>
      <h2 className="ds-h2 mb-3">{title}</h2>
      {description && <p className="ds-body mb-6 max-w-xl text-gray-600">{description}</p>}
      {action}
    </div>
  )
}

/* ----------------------------- Pagination -------------------------- */
export function Pagination({ page, totalPages, onChange, className }) {
  if (totalPages <= 1) return null
  return (
    <nav aria-label="Phân trang" className={cn('flex items-center justify-between gap-4', className)}>
      <div className="w-32">
        {page > 1 && (
          <button type="button" onClick={() => onChange(page - 1)} className="ds-label h-10 border border-ink px-4 hover:bg-ink hover:text-white">
            Trước
          </button>
        )}
      </div>
      <span className="text-sm">
        Trang {page} / {totalPages}
      </span>
      <div className="flex w-32 justify-end">
        {page < totalPages && (
          <button type="button" onClick={() => onChange(page + 1)} className="ds-label h-10 bg-ink px-6 text-white hover:text-gray-300">
            Tiếp
          </button>
        )}
      </div>
    </nav>
  )
}
