import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { LoaderCircle } from 'lucide-react'
import { cn } from '@/utils/cn'
import { ArrowLong } from './icons'

const VARIANTS = {
  primary: 'bg-ink text-white btn-offset hover:text-gray-300 disabled:bg-gray-300 disabled:text-white',
  secondary: 'bg-white text-ink border border-ink btn-offset hover:text-gray-600',
  outline: 'bg-white text-ink border border-ink hover:bg-ink hover:text-white',
  ghost: 'bg-transparent text-ink hover:bg-gray-100',
  link: 'bg-transparent text-ink underline underline-offset-4 decoration-2 hover:bg-ink hover:text-white hover:no-underline px-0.5 h-auto',
}

const SIZES = {
  sm: 'h-9 px-3 text-[11px]',
  md: 'h-12 px-4 text-[13px]',
  lg: 'h-[52px] px-5 text-sm',
}

/**
 * Nút chuẩn của design system.
 * - `to` → render <Link>, `href` → <a>, mặc định <button>.
 * - `arrow` thêm mũi tên dài bên phải (CONTINUE ⟶), nút sẽ `justify-between`.
 */
export const Button = forwardRef(function Button(
  { as, to, href, variant = 'primary', size = 'md', arrow = false, fullWidth = false, loading = false, disabled, className, children, type = 'button', ...rest },
  ref,
) {
  const classes = cn(
    'ds-label inline-flex shrink-0 items-center gap-4 whitespace-nowrap transition-colors select-none',
    arrow ? 'justify-between' : 'justify-center',
    VARIANTS[variant],
    variant !== 'link' && SIZES[size],
    fullWidth && 'w-full',
    (disabled || loading) && 'pointer-events-none',
    className,
  )
  const content = (
    <>
      {/* line-height đủ cao để không cắt dấu tiếng Việt (Ụ, Ặ, Ố...) khi truncate */}
      <span className="truncate py-0.5 leading-[1.4]">{children}</span>
      {loading ? <LoaderCircle className="size-5 animate-spin" aria-hidden /> : arrow && <ArrowLong size={20} />}
    </>
  )
  if (to) return <Link ref={ref} to={to} className={classes} {...rest}>{content}</Link>
  if (href) return <a ref={ref} href={href} className={classes} {...rest}>{content}</a>
  const Comp = as ?? 'button'
  return (
    <Comp ref={ref} type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={classes} {...rest}>
      {content}
    </Comp>
  )
})

/** Nút icon vuông (header, close, wishlist) — luôn cần `label` cho screen reader. */
export const IconButton = forwardRef(function IconButton({ label, badge, className, children, to, ...rest }, ref) {
  const classes = cn('relative inline-flex size-10 items-center justify-center text-ink transition-opacity hover:opacity-60', className)
  const inner = (
    <>
      {children}
      {badge ? (
        <span className="absolute -top-0.5 -right-0.5 flex size-[18px] items-center justify-center rounded-full bg-info text-[11px] font-bold text-white">
          {badge > 9 ? '9+' : badge}
        </span>
      ) : null}
    </>
  )
  if (to)
    return (
      <Link ref={ref} to={to} aria-label={label} className={classes} {...rest}>
        {inner}
      </Link>
    )
  return (
    <button ref={ref} type="button" aria-label={label} className={classes} {...rest}>
      {inner}
    </button>
  )
})
