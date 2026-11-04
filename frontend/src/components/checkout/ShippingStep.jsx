import { Button, Skeleton } from '@/components/ui'
import { cn } from '@/utils/cn'
import { brand } from '@/config/brand'
import { formatDate, formatPrice } from '@/utils/format'
import { StepSection } from './StepSection'

const longDay = (iso) => formatDate(iso, { weekday: 'long', month: 'short', day: 'numeric' })
const shortDay = (iso) => formatDate(iso, { weekday: 'short', month: 'short', day: 'numeric' })
const priceLabel = (p) => (p === 0 ? 'Miễn phí' : formatPrice(p, { exact: true }))

function MethodBody({ method }) {
  if (method.type === 'pickup')
    return (
      <>
        <div className="flex justify-between gap-4">
          <span className="font-bold">Cửa hàng {brand.shortName}</span>
          <span>{priceLabel(method.price)}</span>
        </div>
        <p className="mt-5">Nhận hàng từ {shortDay(method.estimatedDate)}</p>
        <p className="mt-5">{method.description}</p>
      </>
    )
  return (
    <>
      <div className="flex justify-between gap-4">
        <span className="font-bold">{method.name}</span>
        <span>{priceLabel(method.price)}</span>
      </div>
      <p className="mt-5">{longDay(method.estimatedDate)}</p>
    </>
  )
}

/** Card radio chọn phương thức giao hàng (ảnh #121): chọn → viền đen + gạch dưới dày. */
function MethodCard({ method, checked, onChange }) {
  return (
    <label
      className={cn(
        'block cursor-pointer border px-5 pt-6 pb-8 text-[15px] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink',
        checked ? 'border-ink border-b-4 pb-7' : 'border-gray-300 hover:border-gray-600',
      )}
    >
      <input type="radio" name="shippingMethod" value={method.id} checked={checked} onChange={() => onChange(method.id)} className="sr-only" />
      <MethodBody method={method} />
    </label>
  )
}

/** Bước 2: SHIPPING (ảnh #121). Thu gọn → ảnh #122 với nút "SHOW ALL". */
export function ShippingStep({ status, methods, loading, value, onChange, onNext, onEdit }) {
  const selected = methods?.find((m) => m.id === value)

  if (status === 'done' && selected)
    return (
      <StepSection title="Vận chuyển" status="done" onEdit={onEdit} editLabel="Xem tất cả">
        <div className="text-[15px]">
          <MethodBody method={selected} />
        </div>
      </StepSection>
    )

  if (status !== 'active') return <StepSection title="Vận chuyển" status="upcoming" />

  const delivery = methods?.filter((m) => m.type !== 'pickup') ?? []
  const pickup = methods?.filter((m) => m.type === 'pickup') ?? []

  return (
    <StepSection title="Vận chuyển">
      {loading ? (
        <div className="space-y-5">
          <Skeleton className="h-[160px]" />
          <Skeleton className="h-[160px]" />
        </div>
      ) : (
        <fieldset>
          <legend className="sr-only">Chọn phương thức vận chuyển</legend>
          <div className="space-y-5">
            {delivery.map((m) => (
              <MethodCard key={m.id} method={m} checked={m.id === value} onChange={onChange} />
            ))}
          </div>
          {pickup.length > 0 && (
            <>
              <h3 className="mt-12 mb-5 text-[15px] font-bold">Nhận tại cửa hàng</h3>
              <div className="space-y-5">
                {pickup.map((m) => (
                  <MethodCard key={m.id} method={m} checked={m.id === value} onChange={onChange} />
                ))}
              </div>
            </>
          )}
        </fieldset>
      )}
      <Button arrow onClick={onNext} disabled={!selected} className="mt-10 w-full sm:w-[385px]">
        Tiếp theo
      </Button>
    </StepSection>
  )
}
