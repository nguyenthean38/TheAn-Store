import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/utils/cn'

/**
 * Carousel cuộn ngang (snap) + mũi tên + thanh tiến trình (ảnh #7, #15).
 * `itemClassName` quyết định độ rộng mỗi item (mặc định 4 item/desktop).
 */
export function Carousel({ children, className, itemClassName = 'w-[70%] sm:w-[45%] md:w-[31%] lg:w-[24.3%]', showProgress = true, ariaLabel }) {
  const ref = useRef(null)
  const [state, setState] = useState({ canPrev: false, canNext: false, progress: 0, ratio: 1 })

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setState({
      canPrev: el.scrollLeft > 4,
      canNext: el.scrollLeft < max - 4,
      progress: max > 0 ? el.scrollLeft / max : 0,
      ratio: el.scrollWidth ? el.clientWidth / el.scrollWidth : 1,
    })
  }, [])

  useEffect(() => {
    update()
    const el = ref.current
    const ro = new ResizeObserver(update)
    if (el) ro.observe(el)
    return () => ro.disconnect()
  }, [update, children])

  const scroll = (dir) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.9, behavior: 'smooth' })
  const items = Array.isArray(children) ? children : [children]

  return (
    <div className={cn('group/carousel relative', className)} role="region" aria-label={ariaLabel}>
      <div ref={ref} onScroll={update} className="flex snap-x snap-mandatory gap-1 overflow-x-auto scroll-smooth scrollbar-none">
        {items.map((child, i) => (
          <div key={child?.key ?? i} className={cn('shrink-0 snap-start', itemClassName)}>
            {child}
          </div>
        ))}
      </div>
      {state.canPrev && (
        <button type="button" onClick={() => scroll(-1)} aria-label="Trước" className="absolute top-[35%] left-0 hidden size-11 items-center justify-center border border-ink bg-white opacity-0 transition-opacity group-hover/carousel:opacity-100 lg:flex">
          <ArrowLeft className="size-5" />
        </button>
      )}
      {state.canNext && (
        <button type="button" onClick={() => scroll(1)} aria-label="Tiếp" className="absolute top-[35%] right-0 hidden size-11 items-center justify-center border border-ink bg-white opacity-0 transition-opacity group-hover/carousel:opacity-100 lg:flex">
          <ArrowRight className="size-5" />
        </button>
      )}
      {showProgress && state.ratio < 1 && (
        <div className="relative mt-6 h-0.5 bg-gray-200" aria-hidden>
          <div className="absolute inset-y-0 bg-ink transition-[left]" style={{ width: `${state.ratio * 100}%`, left: `${state.progress * (1 - state.ratio) * 100}%` }} />
        </div>
      )}
    </div>
  )
}
