import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AdiclubMark, PageSpinner } from '@/components/ui'
import { AcceptedPaymentMethods } from '@/components/cart/PaymentMethods'
import { cartTotals } from '@/components/cart/cartMath'
import { CheckoutSummary } from '@/components/checkout/CheckoutSummary'
import { DetailsStep, DetailsSummary } from '@/components/checkout/DetailsStep'
import { PaymentStep } from '@/components/checkout/PaymentStep'
import { ShippingStep } from '@/components/checkout/ShippingStep'
import { useMe } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { usePlaceOrder, useShippingMethods } from '@/hooks/useOrders'
import { useUI } from '@/store/ui'
import { formatPrice, pluralize } from '@/utils/format'

const STEPS = { details: 1, shipping: 2, payment: 3 }

/** Checkout 3 bước: Contact + Address → Shipping → Payment (ảnh #119–#124). */
export default function CheckoutPage() {
  const navigate = useNavigate()
  const toast = useUI((s) => s.toast)
  const { data: me, isLoading: meLoading } = useMe()
  const { data: cart, isLoading: cartLoading } = useCart()
  const { data: methods, isLoading: methodsLoading } = useShippingMethods()
  const placeOrder = usePlaceOrder()

  const [step, setStep] = useState(STEPS.details)
  const [details, setDetails] = useState(null)
  const [shippingId, setShippingId] = useState('standard')
  const placedRef = useRef(false)

  // Cuộn lên đầu bước mới
  const topRef = useRef(null)
  useEffect(() => {
    if (step > STEPS.details) topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [step])

  if (meLoading || cartLoading) return <PageSpinner />
  if (!cart?.items?.length && !placedRef.current) return <Navigate to="/cart" replace />
  if (!cart?.items?.length) return <PageSpinner />

  const method = methods?.find((m) => m.id === shippingId)
  const totals = cartTotals(cart, method?.price)

  const place = (payment) => {
    if (!details || !method) return setStep(!details ? STEPS.details : STEPS.shipping)
    placedRef.current = true
    placeOrder.mutate(
      {
        email: details.email,
        shippingAddress: details.shippingAddress,
        billingSameAsShipping: details.billingSameAsShipping,
        ...(details.billingAddress ? { billingAddress: details.billingAddress } : {}),
        shippingMethodId: method.id,
        payment,
      },
      {
        onSuccess: (order) => navigate(`/order/${order.number}/confirmation`, { replace: true }),
        onError: (err) => {
          placedRef.current = false
          toast(err.message || 'Không thể đặt hàng. Vui lòng thử lại.', 'error')
        },
      },
    )
  }

  return (
    <>
      {me && (
        <div className="border-b border-gray-300">
          <div className="container-content flex h-[70px] items-center justify-between">
            <p className="font-bold tracking-wide uppercase">Xin chào, {me.firstName}!</p>
            <AdiclubMark className="text-xl" />
          </div>
        </div>
      )}

      <div className="container-content pt-14 pb-20">
        <header className="mb-14 text-center lg:mb-20">
          <h1 className="ds-h2 lg:text-[40px]">Thanh toán</h1>
          <p className="mt-2 text-[15px] font-semibold text-gray-600">
            ({pluralize(totals.itemCount, 'sản phẩm')}) <span className="ml-1">{formatPrice(totals.total, { exact: true })}</span>
          </p>
        </header>

        <div ref={topRef} className="mx-auto grid max-w-[1460px] gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,770px)_minmax(320px,465px)] lg:justify-between">
          <div className="min-w-0">
            {step === STEPS.details ? (
              <DetailsStep
                me={me}
                initial={details?.raw}
                onSubmit={(d) => {
                  setDetails(d)
                  setStep(STEPS.shipping)
                }}
              />
            ) : (
              <DetailsSummary details={details} onEdit={() => setStep(STEPS.details)} />
            )}

            <ShippingStep
              status={step === STEPS.shipping ? 'active' : step > STEPS.shipping ? 'done' : 'upcoming'}
              methods={methods}
              loading={methodsLoading}
              value={shippingId}
              onChange={setShippingId}
              onNext={() => setStep(STEPS.payment)}
              onEdit={() => setStep(STEPS.shipping)}
            />

            <PaymentStep status={step === STEPS.payment ? 'active' : 'upcoming'} isLoggedIn={Boolean(me)} placing={placeOrder.isPending} onPlace={place} />

            {step < STEPS.payment && <AcceptedPaymentMethods title={null} muted className="mt-6" />}
          </div>

          <div className="min-w-0">
            <CheckoutSummary cart={cart} delivery={method?.price} />
          </div>
        </div>
      </div>
    </>
  )
}
