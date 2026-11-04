import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, TicketPercent, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { useApplyPromo, useRemovePromo } from '@/hooks/useCart'
import { useUI } from '@/store/ui'
import { cn } from '@/utils/cn'

/** Hộp "PROMO CODE APPLIED" (ảnh #118, #119) — dùng chung cho bag & checkout. */
export function PromoAppliedBox({ promo, className }) {
  const removePromo = useRemovePromo()
  const toast = useUI((s) => s.toast)
  return (
    <div className={cn('relative border border-ink px-6 py-6', className)}>
      <p className="font-bold tracking-wide uppercase">Đã áp dụng mã giảm giá</p>
      <p className="mt-3 text-sm tracking-wide uppercase">{promo.code}</p>
      {promo.description && <p className="mt-1 text-sm text-gray-600">{promo.description}</p>}
      <Link to="/help" className="ds-link mt-3 inline-block text-[15px]">
        Điều khoản &amp; Điều kiện
      </Link>
      <button
        type="button"
        onClick={() => removePromo.mutate(undefined, { onSuccess: () => toast('Đã gỡ mã giảm giá', 'info') })}
        disabled={removePromo.isPending}
        aria-label={`Gỡ mã giảm giá ${promo.code}`}
        className="absolute top-4 right-4 flex size-9 items-center justify-center hover:opacity-60 disabled:opacity-40"
      >
        <X className="size-6" strokeWidth={1.75} />
      </button>
    </div>
  )
}

/** Promo code trong bag: link "USE A PROMO CODE" → input + APPLY (ảnh #115–#117), đã áp dụng → hộp (ảnh #118). */
export function PromoCode({ promo, className }) {
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const applyPromo = useApplyPromo()
  const toast = useUI((s) => s.toast)
  const inputId = useId()

  if (promo) return <PromoAppliedBox promo={promo} className={className} />

  if (!open)
    return (
      <div className={className}>
        <button type="button" onClick={() => setOpen(true)} className="group inline-flex items-center gap-4" aria-expanded={false}>
          <TicketPercent className="size-6" strokeWidth={1.5} aria-hidden />
          <span className="ds-link-strong">Dùng mã giảm giá</span>
        </button>
      </div>
    )

  const submit = (e) => {
    e.preventDefault()
    const value = code.trim()
    if (!value) return setError('Vui lòng nhập mã giảm giá')
    setError('')
    applyPromo.mutate(value, {
      onSuccess: () => {
        toast('Đã áp dụng mã giảm giá', 'success')
        setCode('')
        setOpen(false)
      },
      onError: (err) => setError(err.message || 'Rất tiếc, mã giảm giá không hợp lệ hoặc đã hết hạn'),
    })
  }

  return (
    <form onSubmit={submit} className={cn('space-y-4', className)} noValidate>
      <div className="relative">
        <label htmlFor={inputId} className="sr-only">
          Nhập mã giảm giá
        </label>
        <input
          id={inputId}
          autoFocus
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            if (error) setError('')
          }}
          placeholder="Nhập mã giảm giá"
          autoComplete="off"
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${inputId}-err` : `${inputId}-hint`}
          className={cn('h-[68px] w-full border bg-white pr-14 pl-5 text-[15px] uppercase outline-none placeholder:normal-case placeholder:text-gray-400', error ? 'border-sale' : 'border-gray-400 focus:border-ink')}
        />
        {!code && (
          <Plus className="pointer-events-none absolute top-1/2 right-5 size-7 -translate-y-1/2" strokeWidth={1.5} aria-hidden />
        )}
      </div>
      {error ? (
        <p id={`${inputId}-err`} role="alert" className="text-sm text-sale">
          {error}
        </p>
      ) : (
        <p id={`${inputId}-hint`} className="text-sm text-gray-600">
          Thử mã <span className="font-semibold">WELCOME15</span> để được giảm 15% cho sản phẩm nguyên giá.
        </p>
      )}
      {code.trim() && (
        <Button type="submit" variant="outline" arrow fullWidth loading={applyPromo.isPending}>
          Áp dụng
        </Button>
      )}
    </form>
  )
}
