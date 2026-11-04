import { useId } from 'react'
import { cn } from '@/utils/cn'

const DEFAULT_ENDS = ['Quá nhỏ', 'Vừa vặn', 'Quá lớn']
const DEFAULT_VALUES = ['Quá nhỏ', 'Hơi nhỏ', 'Vừa vặn', 'Hơi lớn', 'Quá lớn']

/**
 * Thang 5 điểm trên một đường kẻ (size / width, ảnh #43–#44). 3 = Vừa vặn.
 * Dùng radio native (ẩn) để có sẵn bàn phím + screen reader.
 */
export function ScaleInput({ label, required, value = 0, onChange, ends = DEFAULT_ENDS, valueLabels = DEFAULT_VALUES, error, className, name }) {
  const id = useId()
  const groupName = name ?? id
  return (
    <fieldset className={cn('w-full max-w-[540px]', className)} data-field={name} aria-invalid={Boolean(error) || undefined}>
      <legend className="mb-6 text-[15px] font-bold">
        {label}
        {required && <span className="ml-1 text-sale">*</span>}
      </legend>
      <div className="mb-3 flex justify-between text-sm" aria-hidden>
        <span>{ends[0]}</span>
        <span>{ends[1]}</span>
        <span>{ends[2]}</span>
      </div>
      <div className="relative flex items-center justify-between">
        <span className="absolute inset-x-3 top-1/2 h-px -translate-y-1/2 bg-gray-600" aria-hidden />
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="relative z-10 cursor-pointer">
            <input
              type="radio"
              name={groupName}
              value={n}
              checked={value === n}
              onChange={() => onChange?.(n)}
              aria-label={valueLabels[n - 1]}
              className="peer sr-only"
            />
            <span
              className={cn(
                'flex size-[30px] items-center justify-center rounded-full border-2 transition-colors',
                'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink',
                value === n ? 'border-ink bg-ink' : 'border-gray-400 bg-white hover:border-ink',
                error && !value && 'border-sale',
              )}
              aria-hidden
            >
              {value === n && <span className="size-2 rounded-full bg-white" />}
            </span>
          </label>
        ))}
      </div>
      <p className={cn('mt-3 text-sm', error && !value && 'text-sale')} aria-live="polite">
        {value ? valueLabels[value - 1] : error || 'Vui lòng chọn'}
      </p>
    </fieldset>
  )
}
