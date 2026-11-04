import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLong } from '@/components/ui'
import { cn } from '@/utils/cn'

const INTERVAL = 7000

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

/**
 * Hero toàn chiều rộng (ảnh #0, #6, #13): ảnh + tiêu đề condensed trên nền trắng + CTA viền.
 * Tự xoay vòng giữa các slide (dừng khi hover/focus hoặc khi người dùng giảm chuyển động).
 */
export function HeroBanner({ slides = [] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = slides.length

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])

  useEffect(() => {
    if (count < 2 || paused || prefersReducedMotion()) return
    const t = setInterval(next, INTERVAL)
    return () => clearInterval(t)
  }, [count, paused, next])

  if (!count) return null

  return (
    <section
      aria-roledescription="băng chuyền"
      aria-label="Nổi bật"
      className="relative h-[560px] overflow-hidden bg-image sm:h-[620px] lg:aspect-[2.4/1] lg:h-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((s, i) => {
        const active = i === index
        return (
          <div
            key={s.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${count}`}
            aria-hidden={!active}
            inert={!active}
            className={cn('absolute inset-0 transition-opacity duration-700 ease-out', active ? 'z-10 opacity-100' : 'z-0 opacity-0')}
          >
            <img src={s.image} alt="" className="size-full object-cover" fetchPriority={i === 0 ? 'high' : undefined} loading={i === 0 ? 'eager' : 'lazy'} />
            <div className="absolute inset-x-0 bottom-10 lg:bottom-20">
              <div className="container-page">
                <div className="flex flex-col items-start">
                  <h2 className="bg-white px-1.5 py-0.5 font-condensed text-[26px] leading-tight font-bold tracking-[0.04em] uppercase md:text-[32px]">{s.title}</h2>
                  <p className="mt-2.5 bg-white px-1.5 py-0.5 text-base md:text-[17px]">{s.subtitle}</p>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {s.ctas?.map((c) => (
                      <Link
                        key={c.label}
                        to={c.href}
                        className="inline-flex h-10 items-center gap-4 border border-ink bg-white px-2.5 text-[15px] font-bold tracking-[0.04em] uppercase transition-colors hover:bg-ink hover:text-white"
                      >
                        {c.label}
                        <ArrowLong size={22} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {count > 1 && (
        <div className="absolute right-4 bottom-4 z-20 flex gap-2 md:right-8 xl:right-12">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Xem slide ${i + 1}`}
              aria-current={i === index || undefined}
              className="flex h-6 items-center"
            >
              <span className={cn('block h-1 w-8 transition-colors', i === index ? 'bg-white' : 'bg-white/45 hover:bg-white/80')} />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
