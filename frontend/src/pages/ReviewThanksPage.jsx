import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Button } from '@/components/ui'
import { brand } from '@/config/brand'

const FALLBACK_IMAGE = { url: '/images/products/adizero-evo-sl-black.jpg', alt: 'Giày chạy bộ Adizero' }

/** Cảm ơn sau khi gửi review (ảnh #48). Nhận `state: { productName, image }` từ WriteReviewPage. */
export default function ReviewThanksPage() {
  const { state } = useLocation()
  const image = state?.image ?? FALLBACK_IMAGE

  useEffect(() => {
    document.title = `Cảm ơn bạn đã đánh giá | ${brand.name}`
  }, [])

  return (
    <div className="mx-auto w-full max-w-[1026px] px-4 py-10 md:px-8 lg:py-24">
      <div className="flex min-h-[220px] flex-col-reverse items-start gap-6 bg-image px-8 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-16 lg:min-h-[262px]">
        <h1 className="font-display max-w-[480px] text-2xl leading-[1.2] font-extrabold tracking-[0.02em] uppercase sm:text-[32px]">Cảm ơn bạn đã gửi đánh giá!</h1>
        <img src={image.url} alt={state?.productName ?? image.alt} className="w-[200px] object-contain [mask-image:radial-gradient(closest-side,#000_72%,transparent)] sm:mr-24 sm:w-[240px]" />
      </div>

      <p className="mt-16 max-w-[940px] text-[15px] leading-relaxed">
        Sau khi được đội ngũ của chúng tôi kiểm duyệt, đánh giá sẽ xuất hiện trên website để giúp các khách hàng khác của {brand.name} tìm được sản phẩm phù hợp.
      </p>

      <div className="mt-14 flex flex-col items-start gap-3">
        <Button to="/c/men" variant="outline" arrow className="h-16 gap-6 px-5 text-sm">
          Mua đồ nam
        </Button>
        <Button to="/c/women" variant="outline" arrow className="h-16 gap-6 px-5 text-sm">
          Mua đồ nữ
        </Button>
        <Button to="/c/kids" variant="outline" arrow className="h-16 gap-6 px-5 text-sm">
          Mua đồ trẻ em
        </Button>
      </div>
    </div>
  )
}
