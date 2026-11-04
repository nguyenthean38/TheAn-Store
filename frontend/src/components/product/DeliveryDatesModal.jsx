import { useId, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { LocateFixed } from 'lucide-react'
import { catalogService } from '@/api'
import { Button, Checkbox, Input, Modal } from '@/components/ui'
import { useUI } from '@/store/ui'
import { formatPrice, formatShortDay } from '@/utils/format'
import { storage } from '@/utils/storage'

export const DELIVERY_ZIP_KEY = 'delivery.zip'
const ZIP_RE = /^\d{5}(-\d{4})?$/

/**
 * Modal "Xem ngày giao hàng" (ảnh #64, #65): nhập ZIP → hiển thị các phương thức giao hàng.
 * `onResult({ zip, options })` để PDP hiển thị "Giao đến 94025 sớm nhất …" (ảnh #66).
 */
export function DeliveryDatesModal({ open, onClose, productId, onResult }) {
  const titleId = useId()
  const toast = useUI((s) => s.toast)
  const [zip, setZip] = useState(() => storage.get(DELIVERY_ZIP_KEY, ''))
  const [save, setSave] = useState(true)
  const [touched, setTouched] = useState(false)

  const estimate = useMutation({
    mutationFn: (z) => catalogService.deliveryEstimate(z, productId),
    onSuccess: (res) => {
      if (save) storage.set(DELIVERY_ZIP_KEY, res.zip)
      else storage.remove(DELIVERY_ZIP_KEY)
      onResult?.(res)
    },
  })

  const valid = ZIP_RE.test(zip.trim())
  const error = (touched && zip && !valid ? 'Vui lòng nhập mã ZIP hợp lệ, ví dụ: 12345 hoặc 12345-1234' : null) || estimate.error?.fields?.zip || (estimate.isError && !estimate.error?.fields ? estimate.error.message : null)

  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (valid) estimate.mutate(zip.trim())
  }

  const locate = () => {
    // Demo: không có dịch vụ reverse-geocode → điền ZIP mẫu
    setZip('94025')
    setTouched(true)
    toast('Đang dùng vị trí gần đúng của bạn: 94025', 'info')
  }

  const options = estimate.data?.options

  return (
    <Modal open={open} onClose={onClose} size="md" labelledBy={titleId} className="max-w-[530px]" bodyClassName="sm:px-6 sm:py-7">
      <h2 id={titleId} className="font-display pr-8 text-[28px] leading-none font-extrabold uppercase sm:text-[36px]">
        Xem ngày giao hàng
      </h2>
      <form onSubmit={submit} noValidate className="mt-7">
        <p className="mb-3 text-sm">Nhập mã ZIP của bạn</p>
        <div className="flex items-start">
          <Input
            label="12345 hoặc 12345-1234"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={10}
            value={zip}
            onChange={(e) => {
              setZip(e.target.value.replace(/[^\d-]/g, ''))
              estimate.reset()
            }}
            onBlur={() => setTouched(true)}
            valid={valid}
            error={error}
            className="flex-1"
            inputClassName="normal-case"
          />
          <button type="button" onClick={locate} aria-label="Dùng vị trí của tôi" className="-ml-px flex h-[50px] w-[72px] shrink-0 items-center justify-center border border-ink bg-white hover:bg-gray-100">
            <LocateFixed className="size-6" strokeWidth={1.5} />
          </button>
        </div>
        <Checkbox className="mt-5" label="Lưu vị trí cho những lần sau" checked={save} onChange={(e) => setSave(e.target.checked)} />
        <Button type="submit" arrow loading={estimate.isPending} disabled={!valid} className="mt-5 gap-6">
          Xem lựa chọn
        </Button>
      </form>

      {options && (
        <div className="mt-8 border-t border-line pt-6" aria-live="polite">
          <p className="mb-4 font-bold">Phương thức giao hàng đến {estimate.data.zip}</p>
          <ul className="divide-y divide-line border-y border-line">
            {options.map((o) => (
              <li key={o.id} className="flex items-start justify-between gap-4 py-4">
                <div>
                  <p className="font-bold">{o.name}</p>
                  <p className="text-sm text-gray-600">{o.description}</p>
                  <p className="mt-1 text-sm">
                    {o.type === 'pickup' ? 'Sẵn sàng nhận từ' : 'Dự kiến giao'} <span className="font-semibold">{formatShortDay(o.estimatedDate)}</span>
                  </p>
                </div>
                <span className="shrink-0 font-semibold">{o.price ? formatPrice(o.price, { exact: true }) : 'Miễn phí'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-7 text-[15px] leading-relaxed text-gray-400">
        Chúng tôi luôn cố gắng đưa ra ngày giao hàng chính xác nhất, tuy nhiên đơn hàng có thể bị chậm trễ do thời tiết hoặc vào mùa cao điểm.
      </p>
    </Modal>
  )
}
