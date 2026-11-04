import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

/** Khoá scroll body + đóng bằng phím Esc khi overlay mở. */
function useOverlayBehavior(open, onClose) {
  const panelRef = useRef(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })
  // Chỉ phụ thuộc `open`: tránh chạy lại (và cướp focus) mỗi khi parent render lại.
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const prevFocus = document.activeElement
    const onKey = (e) => e.key === 'Escape' && onCloseRef.current?.()
    document.addEventListener('keydown', onKey)
    requestAnimationFrame(() => panelRef.current?.focus())
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
      prevFocus?.focus?.()
    }
  }, [open])
  return panelRef
}

const MODAL_SIZES = { sm: 'max-w-[420px]', md: 'max-w-[570px]', lg: 'max-w-[860px]', xl: 'max-w-[1100px]', full: 'max-w-none h-full' }

/**
 * Modal chuẩn: nền tối 50%, panel trắng góc vuông, nút đóng dạng ô vuông viền đen ở góc (ảnh #1).
 */
export function Modal({ open, onClose, title, size = 'md', children, className, bodyClassName, hideClose = false, labelledBy }) {
  const panelRef = useOverlayBehavior(open, onClose)
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 animate-fade-in bg-black/50" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={!labelledBy && typeof title === 'string' ? title : undefined}
        aria-labelledby={labelledBy}
        className={cn('relative flex max-h-full w-full animate-slide-up flex-col bg-white outline-none', MODAL_SIZES[size], className)}
      >
        {!hideClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="absolute -top-2 -right-2 z-10 flex size-12 items-center justify-center border border-ink bg-white transition-colors hover:bg-ink hover:text-white sm:-top-8 sm:-right-8"
          >
            <X className="size-6" />
          </button>
        )}
        <div className={cn('overflow-y-auto p-6 sm:p-8', bodyClassName)}>
          {title && <h2 className="ds-h3 mb-5 pr-8">{title}</h2>}
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}

/** Drawer trượt từ phải (Filter & Sort ảnh #21, panel adiClub ảnh #5). */
export function Drawer({ open, onClose, title, headerRight, footer, children, width = 'max-w-[576px]', className, bodyClassName }) {
  const panelRef = useOverlayBehavior(open, onClose)
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 animate-fade-in bg-black/50" onClick={onClose} aria-hidden />
      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        className={cn('absolute top-0 right-0 flex h-full w-full animate-slide-in-right flex-col bg-white outline-none', width, className)}
      >
        <header className="flex h-[70px] shrink-0 items-center justify-between gap-4 border-b border-line px-6">
          <div className="text-xl font-bold">{title}</div>
          <div className="flex items-center gap-5">
            {headerRight}
            <button type="button" onClick={onClose} aria-label="Đóng" className="transition-opacity hover:opacity-60">
              <X className="size-7" strokeWidth={1.75} />
            </button>
          </div>
        </header>
        <div className={cn('flex-1 overflow-y-auto', bodyClassName)}>{children}</div>
        {footer && <footer className="shrink-0 border-t border-line bg-white px-6 py-5">{footer}</footer>}
      </aside>
    </div>,
    document.body,
  )
}
