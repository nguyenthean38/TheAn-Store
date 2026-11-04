import { useEffect, useId, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ChevronDown, X } from 'lucide-react'
import { Modal } from '@/components/ui'
import { cn } from '@/utils/cn'

const VISIBLE = 4

/**
 * Lightbox toàn màn hình (ảnh #33, #62): ảnh lớn, nút ← → vuông, dải thumbnail, nút đóng.
 * Phím ← → để chuyển ảnh, Esc để đóng (Modal xử lý).
 */
function Lightbox({ images, index, onIndex, onClose }) {
  const titleId = useId()
  const stripRef = useRef(null)
  const open = index != null
  const count = images.length
  const go = (dir) => onIndex((i) => (i + dir + count) % count)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') onIndex((i) => (i + 1) % count)
      if (e.key === 'ArrowLeft') onIndex((i) => (i - 1 + count) % count)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, count, onIndex])

  // giữ thumbnail đang chọn trong vùng nhìn thấy
  useEffect(() => {
    stripRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [index])

  if (!open) return null
  const img = images[index]

  return (
    <Modal
      open
      onClose={onClose}
      size="full"
      hideClose
      labelledBy={titleId}
      className="fixed inset-0 h-full max-h-none max-w-none animate-fade-in bg-image"
      bodyClassName="flex h-full flex-col overflow-hidden p-0 sm:p-0"
    >
      <h2 id={titleId} className="sr-only">
        Hình ảnh sản phẩm
      </h2>
      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <img key={img.url} src={img.url} alt={img.alt} className="max-h-full max-w-full animate-fade-in object-contain" />
        <p className="sr-only" aria-live="polite">
          Ảnh {index + 1}/{count}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 flex size-12 items-center justify-center border border-ink bg-white/80 transition-colors hover:bg-ink hover:text-white sm:top-10 sm:right-10 sm:size-16"
        >
          <X className="size-7" strokeWidth={1.5} />
        </button>
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Ảnh trước"
              className="absolute top-1/2 left-4 flex size-12 -translate-y-1/2 items-center justify-center border border-ink bg-white/80 transition-colors hover:bg-ink hover:text-white sm:left-10 sm:size-16"
            >
              <ArrowLeft className="size-7" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Ảnh tiếp theo"
              className="absolute top-1/2 right-4 flex size-12 -translate-y-1/2 items-center justify-center border border-ink bg-white/80 transition-colors hover:bg-ink hover:text-white sm:right-10 sm:size-16"
            >
              <ArrowRight className="size-7" strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>
      {count > 1 && (
        <div ref={stripRef} className="mx-auto flex max-w-full shrink-0 gap-1 overflow-x-auto bg-white p-1 scrollbar-none">
          {images.map((im, i) => (
            <button
              key={im.url}
              type="button"
              onClick={() => onIndex(() => i)}
              aria-label={`Xem ảnh ${i + 1}`}
              aria-current={i === index}
              className={cn('relative size-16 shrink-0 bg-image sm:size-[90px]', i === index ? 'after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:bg-ink' : 'opacity-80 hover:opacity-100')}
            >
              <img src={im.url} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </Modal>
  )
}

/**
 * Gallery PDP (ảnh #32, #56, #58):
 * - Desktop: lưới 2 cột ảnh vuông, hiện 4 ảnh đầu + nút SHOW MORE.
 * - Mobile: cuộn ngang (snap) từng ảnh.
 * `overlay` (breadcrumbs) phủ trên ảnh đầu; `badge` dọc ở ảnh thứ 2.
 */
export function ProductGallery({ images = [], badge, overlay, className }) {
  const [expanded, setExpanded] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const [slide, setSlide] = useState(0)
  const scrollerRef = useRef(null)

  const shown = expanded ? images : images.slice(0, VISIBLE)
  const hasMore = images.length > VISIBLE

  const onScroll = () => {
    const el = scrollerRef.current
    if (el) setSlide(Math.round(el.scrollLeft / el.clientWidth))
  }

  const tile = (img, i) => (
    <button
      type="button"
      onClick={() => setLightbox(i)}
      aria-label={`Mở ảnh ${i + 1}/${images.length} ở chế độ toàn màn hình`}
      className="group block size-full cursor-zoom-in"
    >
      <img src={img.url} alt={img.alt} loading={i < 2 ? 'eager' : 'lazy'} className="size-full object-cover" />
    </button>
  )

  return (
    <div className={className}>
      {/* Mobile: cuộn ngang */}
      <div className="relative lg:hidden">
        <div ref={scrollerRef} onScroll={onScroll} className="flex snap-x snap-mandatory overflow-x-auto scrollbar-none" aria-roledescription="băng chuyền" aria-label="Hình ảnh sản phẩm">
          {images.map((img, i) => (
            <div key={img.url} className="relative aspect-square w-full shrink-0 snap-start bg-image" aria-roledescription="ảnh" aria-label={`${i + 1}/${images.length}`}>
              {tile(img, i)}
              {i === 0 && badge && <VerticalBadge>{badge}</VerticalBadge>}
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden>
            {images.map((img, i) => (
              <span key={img.url} className={cn('h-0.5 w-6 transition-colors', i === slide ? 'bg-ink' : 'bg-ink/25')} />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: lưới 2 cột */}
      <div className="relative hidden lg:block">
        <div className="grid grid-cols-2 gap-0.5">
          {shown.map((img, i) => (
            <div key={img.url} className="relative aspect-square bg-image">
              {tile(img, i)}
              {i === 0 && overlay && <div className="absolute top-0 left-0 p-8">{overlay}</div>}
              {i === 1 && badge && <VerticalBadge>{badge}</VerticalBadge>}
            </div>
          ))}
        </div>
        {hasMore && (
          <div className="relative flex h-8 justify-center">
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              aria-expanded={expanded}
              className="ds-label absolute -top-8 flex h-16 items-center gap-8 border border-ink bg-white px-5 text-sm transition-colors hover:bg-ink hover:text-white"
            >
              {expanded ? 'Thu gọn' : 'Xem thêm'}
              <ChevronDown className={cn('size-6 transition-transform', expanded && 'rotate-180')} aria-hidden />
            </button>
          </div>
        )}
      </div>

      <Lightbox images={images} index={lightbox} onIndex={(fn) => setLightbox((i) => fn(i))} onClose={() => setLightbox(null)} />
    </div>
  )
}

function VerticalBadge({ children }) {
  return (
    <span className="pointer-events-none absolute top-10 right-4 rotate-180 bg-white px-2 py-3 text-sm tracking-[0.05em] uppercase [writing-mode:vertical-rl]">
      {children}
    </span>
  )
}
