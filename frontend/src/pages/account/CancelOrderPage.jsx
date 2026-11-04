import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button, EmptyState, PageSpinner, Select } from '@/components/ui'
import { BackLink, OrderFaq } from '@/components/account/OrderFaq'
import { OrderItem } from '@/components/account/OrderItem'
import { CANCEL_REASONS, cancelTimeLeft } from '@/components/account/orderUtils'
import { useCancelOrder, useOrder } from '@/hooks/useOrders'
import { useUI } from '@/store/ui'

/** Checkbox vuông đè lên góc ảnh sản phẩm (ảnh #92). */
function ItemCheckbox({ checked, onChange, label }) {
  return (
    <label className="absolute top-3 left-3 inline-flex size-8 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} aria-label={label} className="peer absolute inset-0 cursor-pointer appearance-none border border-ink bg-white checked:bg-ink" />
      <Check className="pointer-events-none absolute inset-0 m-auto size-5 text-white opacity-0 peer-checked:opacity-100" strokeWidth={2} aria-hidden />
    </label>
  )
}

/** Hủy đơn 2 bước: chọn sản phẩm + lý do → xác nhận (ảnh #92–#96). */
export default function CancelOrderPage() {
  const { number } = useParams()
  const navigate = useNavigate()
  const toast = useUI((s) => s.toast)
  const { data: order, isLoading, isError } = useOrder(number)
  const cancel = useCancelOrder(number)

  const [step, setStep] = useState(1)
  const [picked, setPicked] = useState(null) // null = chưa chạm → mặc định theo đơn
  const [reason, setReason] = useState('')

  // Sau khi hủy xong, giữ spinner cho tới khi điều hướng (tránh nháy trạng thái "không hủy được")
  if (isLoading || cancel.isSuccess) return <PageSpinner />

  const active = order?.items.filter((it) => !it.cancelled) ?? []
  const selectedIds = picked ?? (active.length === 1 ? [active[0].id] : [])
  const selectedItems = active.filter((it) => selectedIds.includes(it.id))
  const canCancel = order && cancelTimeLeft(order) > 0

  if (isError || !order || !canCancel)
    return (
      <div className="container-content pt-12 pb-24">
        <BackLink to={order ? `/account/orders/${number}` : '/account/orders'}>{order ? 'Quay lại đơn hàng' : 'Lịch sử đơn hàng'}</BackLink>
        <EmptyState
          title={order ? 'Đơn hàng này không thể hủy được nữa' : 'Không tìm thấy đơn hàng'}
          description={
            order
              ? 'Đơn hàng chỉ có thể hủy trong một khoảng thời gian ngắn sau khi đặt. Bạn vẫn có thể trả lại sản phẩm sau khi nhận hàng.'
              : 'Chúng tôi không tìm thấy đơn hàng này.'
          }
          action={
            <Button to={order ? `/account/orders/${number}` : '/account/orders'} arrow>
              {order ? 'Xem đơn hàng' : 'Xem đơn hàng của bạn'}
            </Button>
          }
        />
      </div>
    )

  const toggle = (id) => setPicked((prev) => {
    const base = prev ?? selectedIds
    return base.includes(id) ? base.filter((x) => x !== id) : [...base, id]
  })
  const valid = selectedIds.length > 0 && reason
  const reasonLabel = CANCEL_REASONS.find((r) => r.value === reason)?.label

  const confirm = () =>
    cancel.mutate(
      { itemIds: selectedIds, reason },
      {
        onSuccess: () => navigate(`/account/orders/${number}`, { replace: true, state: { cancelled: true } }),
        onError: (err) => toast(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.', 'error'),
      },
    )

  return (
    <div className="bg-white">
      <div className="container-content pt-12 pb-24">
        {step === 1 ? (
          <form
            className="max-w-[813px]"
            onSubmit={(e) => {
              e.preventDefault()
              if (valid) setStep(2)
            }}
          >
            <BackLink to={`/account/orders/${number}`}>Quay lại đơn hàng</BackLink>
            <h1 className="ds-h1 mt-10 lg:text-[40px]">Bạn muốn hủy sản phẩm nào?</h1>
            <p className="mt-8 text-lg leading-7">
              Chọn (các) sản phẩm bạn không muốn nhận. Bạn có thể hủy trong vòng 15 phút sau khi đặt hàng.{' '}
              <Link to="/help" className="ds-link">
                Xem thêm
              </Link>
            </p>

            <fieldset className="mt-12">
              <legend className="sr-only">Sản phẩm</legend>
              <ul className="space-y-6">
                {active.map((it) => (
                  <li key={it.id}>
                    <OrderItem
                      item={it}
                      imageClassName="sm:w-[264px]"
                      imageOverlay={<ItemCheckbox checked={selectedIds.includes(it.id)} onChange={() => toggle(it.id)} label={`Hủy ${it.name}, size ${it.size}`} />}
                    />
                  </li>
                ))}
              </ul>
            </fieldset>

            <Select
              aria-label="Lý do hủy"
              placeholder="Chọn lý do"
              options={CANCEL_REASONS}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-12"
              selectClassName="h-[60px] font-semibold"
            />

            <Button type="submit" arrow disabled={!valid} className="mt-24 h-[60px] text-[15px] tracking-[0.04em] disabled:text-ink">
              Tiếp tục
            </Button>
          </form>
        ) : (
          <div className="max-w-[813px]">
            <BackLink onClick={() => setStep(1)}>Quay lại</BackLink>
            <h1 className="ds-h1 mt-10 lg:text-[40px]">Xác nhận hủy đơn</h1>
            <ul className="mt-12 space-y-6">
              {selectedItems.map((it) => (
                <li key={it.id}>
                  <OrderItem item={it} imageClassName="sm:w-[264px]" />
                </li>
              ))}
            </ul>
            <p className="mt-6 bg-image px-10 py-10 text-lg">Lý do hủy: {reasonLabel}</p>
            <Button onClick={confirm} loading={cancel.isPending} className="mt-24 h-[60px] text-[15px] tracking-[0.06em]">
              Xác nhận
            </Button>
          </div>
        )}
      </div>
      <OrderFaq />
    </div>
  )
}
