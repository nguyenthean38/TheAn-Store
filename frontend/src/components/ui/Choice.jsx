import { forwardRef, useId } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/utils/cn'

/** Checkbox vuông đen (ảnh #1 "Keep me logged in"). */
export const Checkbox = forwardRef(function Checkbox({ label, description, error, className, id, ...rest }, ref) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <div className={className}>
      <label htmlFor={inputId} className="flex cursor-pointer items-start gap-3">
        <span className="relative mt-0.5 inline-flex size-6 shrink-0">
          <input ref={ref} id={inputId} type="checkbox" className="peer absolute inset-0 cursor-pointer appearance-none border border-ink bg-white checked:bg-ink" {...rest} />
          <Check className="pointer-events-none absolute inset-0 m-auto size-4 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} aria-hidden />
        </span>
        <span className="text-sm leading-snug">
          {label}
          {description && <span className="mt-0.5 block text-sm text-gray-600">{description}</span>}
        </span>
      </label>
      {error && <p className="mt-1 text-xs text-sale">{error}</p>}
    </div>
  )
})

/** Radio tròn (gender, recommend Yes/No, shipping method). */
export const Radio = forwardRef(function Radio({ label, className, id, ...rest }, ref) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <label htmlFor={inputId} className={cn('inline-flex cursor-pointer items-center gap-2', className)}>
      <span className="relative inline-flex size-5 shrink-0">
        <input ref={ref} id={inputId} type="radio" className="peer absolute inset-0 cursor-pointer appearance-none rounded-full border border-ink bg-white" {...rest} />
        <span className="pointer-events-none absolute inset-[4px] rounded-full bg-ink opacity-0 peer-checked:opacity-100" />
      </span>
      <span className="text-sm">{label}</span>
    </label>
  )
})
