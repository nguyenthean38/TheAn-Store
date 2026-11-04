import { useId } from 'react'
import { Logo } from '@/components/ui'
import { cn } from '@/utils/cn'

/**
 * Khối SEO: tiêu đề condensed căn giữa + đoạn văn.
 * `tone="dark"` = nền đen + logo (ảnh #10, trang chủ); `tone="light"` = nền trắng, căn giữa (ảnh #15).
 */
export function SeoBlock({ title, paragraphs = [], tone = 'dark', className }) {
  const dark = tone === 'dark'
  const id = useId()
  return (
    <section className={cn(dark ? 'bg-ink text-white' : 'bg-white text-ink', className)} aria-labelledby={id}>
      <div className={cn('mx-auto max-w-[860px] px-4', dark ? 'py-16 lg:py-24' : 'py-12 lg:py-16')}>
        <h2 id={id} className="text-center font-condensed text-[32px] leading-[1.1] font-bold tracking-[0.06em] uppercase lg:text-[48px]">
          {title}
        </h2>
        <div className={cn('mt-6 space-y-7 text-[15px] leading-relaxed', dark ? 'text-justify' : 'text-center')}>
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {dark && <Logo className="mx-auto mt-14 h-8 w-14 text-white lg:mt-16" />}
      </div>
    </section>
  )
}
