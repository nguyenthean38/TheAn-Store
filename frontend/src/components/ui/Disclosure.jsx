import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

/**
 * Accordion item (Reviews / Description / Details ở PDP, nhóm filter).
 * `summary` hiển thị dòng phụ dưới tiêu đề (VD: GENDER — "Men").
 * `marked` vẽ vạch đen bên trái khi nhóm filter đang được chọn (ảnh #26).
 */
export function AccordionItem({ title, summary, right, defaultOpen = false, open: controlledOpen, onToggle, marked = false, children, className, headerClassName, contentClassName }) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen)
  const open = controlledOpen ?? innerOpen
  const id = useId()
  const toggle = () => (onToggle ? onToggle(!open) : setInnerOpen((o) => !o))
  return (
    <div className={cn('border-b border-line', className)}>
      <h3>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={id}
          className={cn('relative flex w-full items-center justify-between gap-4 py-5 text-left', marked && 'before:absolute before:inset-y-0 before:-left-6 before:w-1 before:bg-ink', headerClassName)}
        >
          <span>
            <span className="block text-base font-bold uppercase">{title}</span>
            {summary && <span className="mt-0.5 block text-sm font-normal normal-case">{summary}</span>}
          </span>
          <span className="flex items-center gap-4">
            {right}
            <ChevronDown className={cn('size-6 shrink-0 transition-transform', open && 'rotate-180')} aria-hidden />
          </span>
        </button>
      </h3>
      {open && (
        <div id={id} className={cn('pb-6', contentClassName)}>
          {children}
        </div>
      )}
    </div>
  )
}

/**
 * Tabs.
 * - `underline`: FEED / ORDERS / ACCOUNT (ảnh #100), sub-category PLP (ảnh #17).
 * - `boxed`: New Arrivals / Best Sellers (ảnh #0).
 */
export function Tabs({ items, value, onChange, variant = 'underline', className, renderItem }) {
  return (
    <div role="tablist" className={cn('flex gap-1 overflow-x-auto scrollbar-none', variant === 'underline' && 'gap-8', className)}>
      {items.map((it) => {
        const active = it.value === value
        const cls =
          variant === 'boxed'
            ? cn('h-10 shrink-0 border px-3 text-[15px] whitespace-nowrap transition-colors', active ? 'border-ink bg-ink text-white' : 'border-gray-400 bg-white hover:border-ink')
            : cn('relative shrink-0 pb-3 text-[15px] whitespace-nowrap transition-colors', active ? 'font-semibold text-ink after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-ink' : 'text-gray-600 hover:text-ink')
        if (renderItem) return renderItem(it, { active, className: cls })
        return (
          <button key={it.value} type="button" role="tab" aria-selected={active} className={cls} onClick={() => onChange?.(it.value)}>
            {it.label}
          </button>
        )
      })}
    </div>
  )
}
