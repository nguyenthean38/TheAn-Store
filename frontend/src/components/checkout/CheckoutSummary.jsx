import { Link } from 'react-router-dom'
import { OrderSummaryLines } from '@/components/cart/OrderSummary'
import { PromoAppliedBox } from '@/components/cart/PromoCode'
import { linePricing, promoRate } from '@/components/cart/cartMath'
import { formatPrice } from '@/utils/format'

/** Dòng sản phẩm thu gọn (ảnh #119 cột phải, cũng dùng ở trang xác nhận). */
export function SummaryItem({ image, name, size, quantity, colorName, price, originalPrice, href }) {
  const img = (
    <div className="aspect-square w-[150px] shrink-0 bg-image sm:w-[192px]">
      <img src={image?.url} alt={image?.alt ?? ''} className="size-full object-cover" loading="lazy" />
    </div>
  )
  return (
    <li className="flex gap-6 text-[15px]">
      {href ? (
        <Link to={href} tabIndex={-1} aria-hidden>
          {img}
        </Link>
      ) : (
        img
      )}
      <div className="min-w-0 pt-2">
        <p>{name}</p>
        <p>
          {originalPrice && originalPrice - price > 0.004 ? (
            <>
              <s className="text-gray-600">{formatPrice(originalPrice)}</s> <span className="text-sale">{formatPrice(price)}</span>
            </>
          ) : (
            formatPrice(price, { exact: true })
          )}
        </p>
        <p className="mt-3 text-gray-400">
          Size: {size} / Số lượng: {quantity}
        </p>
        {colorName && <p className="text-gray-400">Màu: {colorName}</p>}
      </div>
    </li>
  )
}

/** Cột phải checkout "YOUR ORDER" (ảnh #119). */
export function CheckoutSummary({ cart, delivery }) {
  const rate = promoRate(cart)
  return (
    <aside aria-labelledby="your-order-title">
      <div className="mb-10 flex items-center justify-between">
        <h2 id="your-order-title" className="ds-h3 lg:text-[22px]">
          Đơn hàng của bạn
        </h2>
        <Link to="/cart" className="ds-link-strong" aria-label="Sửa giỏ hàng">
          Sửa
        </Link>
      </div>
      <OrderSummaryLines cart={cart} delivery={delivery} />
      {cart.promo && <PromoAppliedBox promo={cart.promo} className="mt-8" />}
      <hr className="my-10 border-gray-300" />
      <ul className="space-y-8" aria-label="Sản phẩm trong đơn hàng">
        {cart.items.map((it) => {
          const { original, current } = linePricing(it, rate)
          return (
            <SummaryItem
              key={it.id}
              href={`/p/${it.product.slug}`}
              image={it.product.image}
              name={it.product.name}
              size={it.size}
              quantity={it.quantity}
              colorName={it.product.colorName}
              price={current}
              originalPrice={original}
            />
          )
        })}
      </ul>
    </aside>
  )
}
