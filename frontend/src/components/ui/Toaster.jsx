import { CircleAlert, CircleCheck, Info, X } from 'lucide-react'
import { useUI } from '@/store/ui'
import { cn } from '@/utils/cn'

const ICONS = { success: CircleCheck, error: CircleAlert, info: Info }

/** Hiển thị toast từ `useUI().toast(message, tone)`. Gắn 1 lần ở App. */
export function Toaster() {
  const toasts = useUI((s) => s.toasts)
  const dismiss = useUI((s) => s.dismissToast)
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[60] flex w-full max-w-md -translate-x-1/2 flex-col gap-2 px-4" aria-live="polite">
      {toasts.map((t) => {
        const Icon = ICONS[t.tone] ?? Info
        return (
          <div key={t.id} className={cn('pointer-events-auto flex animate-slide-up items-center gap-3 bg-ink px-4 py-3 text-white', t.tone === 'error' && 'bg-sale')}>
            <Icon className="size-5 shrink-0" aria-hidden />
            <span className="flex-1 text-sm">{t.message}</span>
            <button type="button" onClick={() => dismiss(t.id)} aria-label="Đóng thông báo">
              <X className="size-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
