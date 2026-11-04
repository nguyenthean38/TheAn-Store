import { useId, useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/utils/cn'

export const RATING_LABELS = ['Tệ', 'Tạm được', 'Bình thường', 'Khá tốt', 'Tuyệt vời']
export const COMFORT_LABELS = ['Không thoải mái', 'Hơi khó chịu', 'Bình thường', 'Thoải mái', 'Rất thoải mái']

/**
 * Nhập số sao 1..5 (ảnh #39–#45). Dạng radiogroup: phím ← → để đổi giá trị.
 * Dưới hàng sao hiển thị nhãn (Tệ…Tuyệt vời) hoặc "Vui lòng chọn".
 */
export function StarInput({ label, required, value = 0, onChange, labels = RATING_LABELS, error, size = 30, className, name }) {
  const id = useId()
  const [hover, setHover] = useState(0)
  const shown = hover || value
  const caption = shown ? labels[shown - 1] : 'Vui lòng chọn'

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      onChange?.(Math.min(5, (value || 0) + 1))
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      onChange?.(Math.max(1, (value || 2) - 1))
    }
  }

  return (
    <div className={className} data-field={name}>
      {label && (
        <p id={`${id}-label`} className="mb-4 text-[15px] font-bold">
          {label}
          {required && <span className="ml-1 text-sale">*</span>}
        </p>
      )}
      <div role="radiogroup" aria-labelledby={label ? `${id}-label` : undefined} aria-invalid={Boolean(error) || undefined} className="flex gap-3" onMouseLeave={() => setHover(0)} onKeyDown={onKeyDown}>
        {[1, 2, 3, 4, 5].map((n) => {
          const active = n <= shown
          const checked = n === value
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={`${n} sao — ${labels[n - 1]}`}
              tabIndex={checked || (!value && n === 1) ? 0 : -1}
              onMouseEnter={() => setHover(n)}
              onClick={() => onChange?.(n)}
              className="transition-transform hover:scale-110"
            >
              <Star className={cn('text-ink', active && 'fill-ink')} style={{ width: size, height: size }} strokeWidth={1.25} aria-hidden />
            </button>
          )
        })}
      </div>
      <p className={cn('mt-3 text-sm', error && !value ? 'text-sale' : 'text-ink')} aria-live="polite">
        {error && !value ? error : caption}
      </p>
    </div>
  )
}
