import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShieldCheck } from 'lucide-react'
import { Button, Checkbox, Input, PaymentBadge } from '@/components/ui'
import { brand as storeBrand } from '@/config/brand'
import { cn } from '@/utils/cn'
import { BRAND_BADGE, detectBrand, digitsOnly, formatCardNumber, formatExpiry, paymentSchema } from './schemas'
import { StepSection } from './StepSection'

const CARD_BADGES = ['AMEX', 'Discover', 'Mastercard', 'VISA']

/** Hàng chọn phương thức thanh toán (ảnh #122–#124). */
function MethodRow({ value, checked, label, badges, register, children }) {
  return (
    <div className={cn('border transition-colors', checked ? 'border-ink border-b-4' : 'border-gray-300 hover:border-gray-600')}>
      <label className="flex min-h-20 cursor-pointer items-center justify-between gap-4 px-5 py-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ink">
        <input type="radio" value={value} className="sr-only" {...register('method')} />
        <span className="text-[15px] font-bold">{label}</span>
        <span className="flex flex-wrap justify-end gap-1.5">
          {badges.map((b) => (
            <PaymentBadge key={b} name={b} />
          ))}
        </span>
      </label>
      {checked && children}
    </div>
  )
}

/**
 * Bước 3: PAYMENT (ảnh #122–#124).
 * Không gửi số thẻ thô lên server — chỉ brand + 4 số cuối (giả lập token hoá phía client).
 */
export function PaymentStep({ status, isLoggedIn, placing, onPlace }) {
  const [giftCard, setGiftCard] = useState(false)
  const [cvvHelp, setCvvHelp] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, touchedFields, isValid },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    mode: 'onTouched',
    defaultValues: { method: '', cardNumber: '', cardName: '', expiry: '', cvv: '', saveCard: isLoggedIn },
  })
  const [method, cardNumber, cardName, expiry, cvv] = useWatch({ control, name: ['method', 'cardNumber', 'cardName', 'expiry', 'cvv'] })

  if (status !== 'active') return <StepSection title="Thanh toán" status="upcoming" className="border-b-0" />

  const brand = detectBrand(cardNumber)
  const ok = (name, value) => Boolean(touchedFields[name] && !errors[name] && value)

  // Định dạng khi gõ nhưng vẫn để react-hook-form xử lý onChange
  const formatted = (name, format) => {
    const reg = register(name)
    return {
      ...reg,
      onChange: (e) => {
        e.target.value = format(e.target.value)
        return reg.onChange(e)
      },
    }
  }

  const submit = (v) => {
    const payment =
      v.method === 'card'
        ? { method: 'card', brand: detectBrand(v.cardNumber), last4: digitsOnly(v.cardNumber).slice(-4), saveCard: isLoggedIn && v.saveCard }
        : { method: 'paypal', saveCard: false }
    onPlace(payment)
  }

  return (
    <StepSection title="Thanh toán" className="border-b-0">
      <form onSubmit={handleSubmit(submit)} noValidate>
        <div className="flex items-center gap-4 bg-gray-100 px-6 py-5 text-sm sm:px-8">
          <p className="flex-1">Giao dịch được mã hóa SSL để bảo vệ an toàn thông tin thẻ và thanh toán của bạn.</p>
          <ShieldCheck className="size-7 shrink-0" strokeWidth={1.5} aria-hidden />
        </div>

        <fieldset className="mt-6">
          <legend className="sr-only">Phương thức thanh toán</legend>
          <div className="space-y-4">
            <MethodRow value="card" checked={method === 'card'} label="Thẻ tín dụng/ghi nợ" badges={brand ? [BRAND_BADGE[brand]] : CARD_BADGES} register={register}>
              <div className="space-y-8 px-5 pt-4 pb-6">
                <Input
                  label="Số thẻ"
                  required
                  inputMode="numeric"
                  autoComplete="cc-number"
                  {...formatted('cardNumber', formatCardNumber)}
                  error={errors.cardNumber?.message}
                  valid={ok('cardNumber', cardNumber)}
                />
                <Input label="Tên in trên thẻ" required autoComplete="cc-name" {...register('cardName')} error={errors.cardName?.message} valid={ok('cardName', cardName)} />
                <div className="flex items-start gap-4 sm:gap-7">
                  <Input
                    label="MM / YY"
                    required
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    maxLength={7}
                    {...formatted('expiry', formatExpiry)}
                    error={errors.expiry?.message}
                    valid={ok('expiry', expiry)}
                    hint={errors.expiry ? undefined : 'Ngày hết hạn của thẻ'}
                    className="flex-1"
                  />
                  <Input
                    label="CVV"
                    required
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    maxLength={4}
                    {...formatted('cvv', (x) => digitsOnly(x).slice(0, 4))}
                    error={errors.cvv?.message}
                    valid={ok('cvv', cvv)}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => setCvvHelp((s) => !s)}
                    aria-expanded={cvvHelp}
                    aria-controls="cvv-help"
                    aria-label="Mã bảo mật nằm ở đâu?"
                    className="mt-1.5 flex size-11 shrink-0 items-center justify-center bg-gray-100 text-2xl hover:bg-gray-200"
                  >
                    ?
                  </button>
                </div>
                {cvvHelp && (
                  <p id="cvv-help" className="-mt-4 text-sm text-gray-600">
                    CVV là mã bảo mật 3 chữ số ở mặt sau thẻ. Với thẻ American Express, đó là mã 4 chữ số ở mặt trước.
                  </p>
                )}

                {isLoggedIn && (
                  <div className="border-2 border-info p-6 shadow-[4px_4px_0_-2px_#fff,4px_4px_0_0_var(--color-info)]">
                    <p className="font-display text-xl font-extrabold text-info uppercase sm:text-2xl">Thành viên thanh toán nhanh hơn</p>
                    <Checkbox label="Lưu thẻ này cho các lần thanh toán sau" className="mt-3" {...register('saveCard')} />
                    <p className="mt-2 text-[15px] leading-relaxed">
                      Bạn đồng ý để đơn vị cung cấp dịch vụ thanh toán lưu thông tin thẻ của bạn. Vì lý do bảo mật, mã CVV sẽ không được lưu. Bạn có thể
                      xem hoặc xóa thẻ tại trang thanh toán.
                    </p>
                  </div>
                )}
              </div>
            </MethodRow>

            <MethodRow value="paypal" checked={method === 'paypal'} label="PayPal" badges={['PayPal']} register={register}>
              <p className="px-5 pb-6 text-sm text-gray-600">Bạn sẽ được chuyển đến PayPal để hoàn tất thanh toán an toàn.</p>
            </MethodRow>
          </div>
          {errors.method && <p className="mt-2 text-xs text-sale">{errors.method.message}</p>}
        </fieldset>

        <Checkbox label={<span className="font-bold">Dùng thẻ quà tặng {storeBrand.shortName}</span>} className="mt-8" checked={giftCard} onChange={(e) => setGiftCard(e.target.checked)} />
        {giftCard && <p className="mt-3 ml-9 text-sm text-gray-600">Có thể dùng thẻ quà tặng sau khi chọn phương thức thanh toán. Bản demo chưa hỗ trợ kiểm tra số dư thẻ quà tặng.</p>}

        <Button type="submit" arrow disabled={!isValid} loading={placing} className="mt-12 w-full sm:w-[570px]">
          Đặt hàng
        </Button>
        <p className="mt-4 max-w-[680px] text-sm leading-snug">
          Khi nhấn Đặt hàng, bạn đồng ý với{' '}
          <Link to="/help" className="ds-link">
            Điều khoản &amp; Điều kiện
          </Link>{' '}
          và việc lưu thông tin thanh toán nếu đã chọn ở trên.
        </p>
      </form>
    </StepSection>
  )
}
