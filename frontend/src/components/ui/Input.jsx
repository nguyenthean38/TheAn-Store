import { forwardRef, useId, useState } from 'react'
import { Check, ChevronDown, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/utils/cn'

/**
 * Input với floating label kiểu adidas (ảnh #1, #101).
 * Tương thích react-hook-form: `<Input {...register('email')} label="Email address" error={errors.email?.message} />`
 */
export const Input = forwardRef(function Input(
  { label, error, hint, valid = false, required, type = 'text', className, inputClassName, id, ...rest },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className={cn('w-full', className)}>
      {isPassword && (
        <div className="mb-1 flex justify-end">
          <button type="button" onClick={() => setShow((s) => !s)} className="ds-label flex items-center gap-1.5 text-[11px]" aria-controls={inputId}>
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            <span className="underline underline-offset-2">{show ? 'Ẩn' : 'Hiện'}</span>
          </button>
        </div>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={isPassword && show ? 'text' : type}
          placeholder=" "
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error || hint ? `${inputId}-msg` : undefined}
          className={cn(
            'peer h-[50px] w-full border bg-white px-4 pt-4 text-base text-ink outline-none transition-colors',
            'placeholder-shown:pt-0 focus:pt-4',
            error ? 'border-sale' : valid ? 'border-gray-400 border-b-2 border-b-success pr-10' : 'border-gray-400 hover:border-ink focus:border-ink',
            inputClassName,
          )}
          {...rest}
        />
        <label
          htmlFor={inputId}
          className={cn(
            'pointer-events-none absolute top-1.5 left-4 text-xs text-gray-600 transition-all',
            'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:uppercase',
            'peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:normal-case',
            error && 'text-sale',
          )}
        >
          {label}
          {required && ' *'}
        </label>
        {valid && !error && <Check className="absolute top-1/2 right-3 size-5 -translate-y-1/2 text-success" aria-hidden />}
      </div>
      {(error || hint) && (
        <p id={`${inputId}-msg`} className={cn('mt-1.5 text-xs', error ? 'text-sale' : 'text-gray-600')}>
          {error || hint}
        </p>
      )}
    </div>
  )
})

export const Textarea = forwardRef(function Textarea({ label, error, hint, required, className, id, rows = 5, ...rest }, ref) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <div className={cn('w-full', className)}>
      <div className="relative">
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          placeholder=" "
          aria-invalid={Boolean(error) || undefined}
          className={cn('peer w-full resize-y border bg-white px-4 pt-6 pb-2 text-base outline-none', error ? 'border-sale' : 'border-gray-400 focus:border-ink')}
          {...rest}
        />
        <label htmlFor={inputId} className={cn('pointer-events-none absolute top-2 left-4 text-xs text-gray-600', error && 'text-sale')}>
          {label}
          {required && ' *'}
        </label>
      </div>
      {(error || hint) && <p className={cn('mt-1.5 text-xs', error ? 'text-sale' : 'text-gray-600')}>{error || hint}</p>}
    </div>
  )
})

/** Select native (số lượng trong bag, state, lý do huỷ đơn). */
export const Select = forwardRef(function Select({ label, error, options = [], placeholder, className, selectClassName, id, ...rest }, ref) {
  const autoId = useId()
  const selectId = id ?? autoId
  return (
    <div className={cn('w-full', className)}>
      <div className="relative">
        {label && (
          <label htmlFor={selectId} className="pointer-events-none absolute top-1.5 left-4 text-xs text-gray-600">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error) || undefined}
          className={cn(
            'h-[50px] w-full appearance-none border bg-white pr-10 pl-4 text-base text-ink outline-none',
            label && 'pt-4',
            error ? 'border-sale' : 'border-gray-400 hover:border-ink focus:border-ink',
            selectClassName,
          )}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => {
            const opt = typeof o === 'object' ? o : { value: o, label: o }
            return (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            )
          })}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2" aria-hidden />
      </div>
      {error && <p className="mt-1.5 text-xs text-sale">{error}</p>}
    </div>
  )
})
