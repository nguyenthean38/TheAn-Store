import { useId } from 'react'
import { cn } from '@/utils/cn'

/**
 * Một bước trong checkout (ảnh #119–#122).
 * status: 'active' (đang nhập) | 'done' (thu gọn + EDIT) | 'upcoming' (tiêu đề xám).
 */
export function StepSection({ title, status = 'active', onEdit, editLabel = 'Sửa', action, children, className }) {
  const id = useId()
  return (
    <section aria-labelledby={id} className={cn('border-b border-gray-300 py-10 first:pt-0', className)}>
      <div className={cn('flex items-center justify-between gap-4', status !== 'upcoming' && 'mb-8')}>
        <h2 id={id} className={cn('ds-h3 lg:text-[22px]', status === 'upcoming' && 'text-gray-400')}>
          {title}
        </h2>
        {status === 'done' && onEdit ? (
          <button type="button" onClick={onEdit} className="ds-link-strong" aria-label={`${editLabel} ${title.toLowerCase()}`}>
            {editLabel}
          </button>
        ) : (
          status === 'active' && action
        )}
      </div>
      {status !== 'upcoming' && children}
    </section>
  )
}

/** Hiển thị địa chỉ nhiều dòng (card địa chỉ & bản thu gọn). */
export function AddressLines({ address, className }) {
  if (!address) return null
  return (
    <address className={cn('text-[15px] leading-relaxed not-italic', className)}>
      <span className="block font-bold">
        {address.firstName} {address.lastName}
      </span>
      <span className="block">{address.street}</span>
      <span className="block">
        {address.city}, {address.state} {address.zip}, {address.country || 'US'}
      </span>
      <span className="block">{address.phone}</span>
    </address>
  )
}
