import { Link } from 'react-router-dom'
import { ArrowBack } from '@/components/ui'
import { cn } from '@/utils/cn'

const FAQ = [
  { q: 'Làm sao để trả lại (một phần) đơn hàng?', topic: 'Đổi trả & Hoàn tiền' },
  { q: 'Khi nào tôi nhận được tiền hoàn?', topic: 'Đổi trả & Hoàn tiền' },
]

/** Khối "CÂU HỎI THƯỜNG GẶP" cuối trang đơn hàng (ảnh #75, #96). */
export function OrderFaq({ className }) {
  return (
    <section aria-labelledby="order-faq" className={cn('bg-white', className)}>
      <div className="container-content border-t border-line pt-16 pb-20 lg:pt-20">
        <h2 id="order-faq" className="ds-h3 mb-10 lg:mb-14">
          Câu hỏi thường gặp
        </h2>
        <div className="grid gap-6 md:grid-cols-2 md:gap-10">
          {FAQ.map((f) => (
            <Link key={f.q} to="/help" className="group flex min-h-48 flex-col justify-between border border-gray-300 p-8 transition-colors hover:border-ink">
              <span className="text-xl font-semibold group-hover:underline">{f.q}</span>
              <span className="mt-10 text-lg text-gray-400">{f.topic}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Link quay lại ↩ (LỊCH SỬ ĐƠN HÀNG / QUAY LẠI ĐƠN HÀNG). Truyền `onClick` để dùng như nút. */
export function BackLink({ to, onClick, children, className }) {
  const cls = cn('inline-flex items-center gap-4 text-[15px] uppercase', className)
  const inner = (
    <>
      <ArrowBack size={26} />
      <span className="underline underline-offset-4 hover:no-underline">{children}</span>
    </>
  )
  if (to)
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    )
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  )
}
