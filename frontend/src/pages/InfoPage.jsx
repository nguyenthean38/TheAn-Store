import { Link } from 'react-router-dom'
import { ChevronRight, Phone } from 'lucide-react'
import { AccordionItem, Breadcrumbs } from '@/components/ui'
import { brand } from '@/config/brand'

const LINKS = [
  { label: 'Theo dõi đơn hàng', to: '/account/orders', text: 'Kiểm tra trạng thái đơn hàng gần đây.' },
  { label: 'Đổi trả & hoàn tiền', to: '/account/orders', text: 'Bắt đầu trả hàng hoặc hủy đơn hàng.' },
  { label: brand.clubName, to: '/club', text: 'Miễn phí giao hàng, voucher và phần thưởng thành viên.' },
  { label: 'Danh sách yêu thích', to: '/wishlist', text: 'Tất cả sản phẩm bạn đã lưu lại.' },
  { label: 'Giỏ hàng của bạn', to: '/cart', text: 'Xem lại sản phẩm và thanh toán.' },
  { label: 'Mua hàng khuyến mãi', to: '/c/sale', text: 'Giảm đến 40% cho các mẫu được chọn.' },
]

const FAQ = [
  { q: 'Giao hàng mất bao lâu?', a: `Giao hàng tiêu chuẩn mất 3–5 ngày làm việc. Thành viên ${brand.clubName} được miễn phí giao hàng tiêu chuẩn cho mọi đơn hàng.` },
  { q: 'Tôi có thể hủy đơn hàng không?', a: 'Bạn có thể hủy đơn hàng trong thời gian ngắn sau khi đặt, ngay tại trang chi tiết đơn hàng trong tài khoản của bạn.' },
  { q: 'Làm sao để trả lại (một phần) đơn hàng?', a: 'Đổi trả miễn phí trong 30 ngày. Hãy bắt đầu trả hàng từ lịch sử đơn hàng và gửi bưu kiện tại bất kỳ điểm nhận hàng nào của đơn vị vận chuyển.' },
  { q: 'Khi nào tôi nhận được tiền hoàn?', a: 'Tiền hoàn được xử lý trong vòng 14 ngày kể từ khi chúng tôi nhận được hàng trả lại, tùy theo ngân hàng của bạn.' },
]

/** Trang thông tin chung (Trợ giúp, Thẻ quà tặng...) — nội dung minh họa. */
export default function InfoPage({ title = 'Trợ giúp' }) {
  return (
    <div className="container-content pt-6 pb-24">
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: title }]} />
      <h1 className="ds-h1 mt-10">{title}</h1>
      <p className="ds-body mt-4 max-w-2xl text-gray-600">
        Đây là trang minh họa trong cửa hàng demo. Dưới đây là một số mục có thể giúp bạn ngay.
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LINKS.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="group flex h-full items-center justify-between gap-4 border border-gray-300 p-6 transition-colors hover:border-ink">
              <span>
                <span className="block text-lg font-bold uppercase group-hover:underline">{l.label}</span>
                <span className="mt-1 block text-gray-600">{l.text}</span>
              </span>
              <ChevronRight className="size-6 shrink-0" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section aria-labelledby="info-faq">
          <h2 id="info-faq" className="ds-h3 mb-2">
            Câu hỏi thường gặp
          </h2>
          {FAQ.map((f) => (
            <AccordionItem key={f.q} title={f.q}>
              <p className="ds-body">{f.a}</p>
            </AccordionItem>
          ))}
        </section>
        <aside className="self-start bg-surface p-8">
          <h2 className="ds-h3">Liên hệ với chúng tôi</h2>
          <p className="mt-4 flex items-center gap-3 text-lg font-bold">
            <Phone className="size-5" aria-hidden />
            <a href={`tel:${brand.supportPhone.replace(/\s/g, '')}`} className="ds-link">
              {brand.supportPhone}
            </a>
          </p>
          <p className="ds-small mt-2 text-gray-600">{brand.supportHours}</p>
        </aside>
      </div>
    </div>
  )
}
