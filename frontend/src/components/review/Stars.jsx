import { Star } from 'lucide-react'
import { cn } from '@/utils/cn'

/** Màu sao xanh lá của khu vực review (ảnh #34, #38, #49). */
export const REVIEW_GREEN = 'text-[#1fb25a]'

/** Hàng sao chỉ đọc, tô theo phần thập phân (dùng cho review). */
export function ReviewStars({ value = 0, size = 18, className, colorClass = REVIEW_GREEN, label }) {
  return (
    <span className={cn('inline-flex', colorClass, className)} role="img" aria-label={label ?? `${value}/5 sao`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - (i - 1)))
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }} aria-hidden>
            <Star className="absolute inset-0" style={{ width: size, height: size }} strokeWidth={1.5} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="fill-current" style={{ width: size, height: size }} strokeWidth={1.5} />
            </span>
          </span>
        )
      })}
    </span>
  )
}
