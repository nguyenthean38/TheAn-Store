import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Camera, Check, History, Info, RotateCcw, Ruler, Sparkles, Truck } from 'lucide-react'
import { AccordionItem, Breadcrumbs, Button, ColorSwatches, EmptyState, HeartIcon, Price, Rating, SizeGrid, Skeleton } from '@/components/ui'
import { DeliveryDatesModal, DELIVERY_ZIP_KEY } from '@/components/product/DeliveryDatesModal'
import { ProductCarousel } from '@/components/product/ProductCarousel'
import { ProductGallery } from '@/components/product/ProductGallery'
import { SizeGuideModal } from '@/components/product/SizeGuideModal'
import { ReviewList } from '@/components/review/ReviewList'
import { ReviewSummary } from '@/components/review/ReviewSummary'
import { ReviewStars } from '@/components/review/Stars'
import { useAddToCart } from '@/hooks/useCart'
import { useProduct, useRecommendations } from '@/hooks/useCatalog'
import { useReviewSummary } from '@/hooks/useReviews'
import { useToggleWishlist } from '@/hooks/useWishlist'
import { useUI } from '@/store/ui'
import { cn } from '@/utils/cn'
import { formatPrice, formatShortDay } from '@/utils/format'
import { storage } from '@/utils/storage'
import { brand } from '@/config/brand'

const BADGE_TEXT = { new: 'Mới', best_seller: 'Bán chạy', online_only: 'Chỉ có online' }
const REVIEWS_ID = 'pdp-reviews'
const REVIEW_FILTERS_ID = 'pdp-review-filters'

/**
 * Tách giới tính khỏi subtitle để hiển thị "Nam • Chạy bộ".
 * Hỗ trợ "Chạy bộ Nam", "Nam Chạy bộ" và dữ liệu cũ "Men's Running".
 */
function splitSubtitle(subtitle = '') {
  const vi = /(Nam|Nữ|Trẻ em|Unisex)/i
  const lead = subtitle.match(new RegExp(`^${vi.source}\\s+(.+)$`, 'i'))
  if (lead) return [lead[1], lead[2]]
  const trail = subtitle.match(new RegExp(`^(.+?)\\s+${vi.source}$`, 'i'))
  if (trail) return [trail[2], trail[1]]
  const en = subtitle.match(/^((?:Men|Women|Kid|Children)[’']?s?)\s+(.+)$/i)
  return en ? [en[1], en[2]] : [subtitle]
}

/** "Đúng size. Chúng tôi khuyên…" → câu đầu in đậm. */
function SizeFitNote({ text }) {
  const i = text.indexOf('. ')
  const head = i > 0 ? text.slice(0, i + 1) : text
  const rest = i > 0 ? text.slice(i + 1) : ''
  return (
    <div className="mt-6 flex gap-2 border border-ink p-4 text-sm leading-snug">
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p>
        <span className="font-bold">{head}</span>
        {rest}
      </p>
    </div>
  )
}

function PrimeLogo() {
  return (
    <span className="inline-flex items-end text-[22px] leading-none font-bold" aria-label="prime">
      <Check className="size-5 text-[#ff9900]" strokeWidth={4} aria-hidden />
      <span className="text-[#00a8e1]">prime</span>
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Cột thông tin bên phải                                                     */
/* -------------------------------------------------------------------------- */
function ProductInfo({ product, onShowReviews }) {
  const [searchParams] = useSearchParams()
  const toast = useUI((s) => s.toast)
  const addToCart = useAddToCart()
  const { isWished, toggle } = useToggleWishlist()
  const sizesRef = useRef(null)

  // giữ size đã chọn khi đổi màu (?size=8)
  const [size, setSize] = useState(() => {
    const s = searchParams.get('size')
    return product.sizes.some((x) => x.label === s && x.inStock) ? s : null
  })
  const [sizeError, setSizeError] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const [deliveryOpen, setDeliveryOpen] = useState(false)
  const [delivery, setDelivery] = useState(() => ({ zip: storage.get(DELIVERY_ZIP_KEY, null), options: null }))

  const [rawGender, sport] = splitSubtitle(product.subtitle)
  const gender = rawGender ? rawGender.charAt(0).toUpperCase() + rawGender.slice(1) : rawGender
  const wished = isWished(product.id)
  const monthly = Math.round(product.price * 1.0776 * 100 / 12) / 100 // Klarna 12 tháng (demo)
  const fastest = delivery.options?.filter((o) => o.type === 'delivery').sort((a, b) => new Date(a.estimatedDate) - new Date(b.estimatedDate))[0]

  const onSizeChange = (label, inStock) => {
    if (!inStock) {
      toast(`Chúng tôi sẽ báo cho bạn khi size ${label} có hàng trở lại.`, 'info')
      return
    }
    setSize(label)
    setSizeError(false)
  }

  const onAdd = async () => {
    if (!size) {
      setSizeError(true)
      sizesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    try {
      const cart = await addToCart.mutateAsync({ productId: product.id, size, quantity: 1 })
      useUI.getState().showAddedToBag({ product, size, quantity: 1, cart })
    } catch (e) {
      toast(e?.message || 'Không thể thêm sản phẩm vào giỏ. Vui lòng thử lại.', 'error')
    }
  }

  return (
    <div className="px-4 pt-6 pb-10 md:px-8 lg:px-12 lg:pt-12">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[15px]">
          {gender}
          {sport && (
            <>
              <span className="mx-1.5" aria-hidden>
                •
              </span>
              {sport}
            </>
          )}
        </p>
        {product.rating?.count > 0 && (
          <a href={`#${REVIEWS_ID}`} onClick={onShowReviews} className="shrink-0" aria-label={`Được đánh giá ${product.rating.average}/5, xem ${product.rating.count} đánh giá`}>
            <Rating value={product.rating.average} size={14} className="pointer-events-none" />
            <span className="ds-link ml-2 text-[15px]">{product.rating.count}</span>
          </a>
        )}
      </div>

      <h1 className="ds-h2 mt-3 lg:text-[34px]">{product.name}</h1>
      <Price price={product.price} originalPrice={product.originalPrice} discountPercent={product.discountPercent} layout="inline" className="mt-4 text-lg" />

      {product.badges?.includes('best_seller') && (
        <div className="mt-6 flex gap-2 bg-gray-100 px-4 py-3 text-sm leading-snug">
          <Sparkles className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>
            <span className="font-bold">Được ưa chuộng</span> hơn 33 người đã mua sản phẩm này trong 24 giờ qua.
          </p>
        </div>
      )}

      {product.promoExcluded && <p className="mt-10 text-[15px]">Mã giảm giá không áp dụng cho sản phẩm này.</p>}

      {product.colorVariants?.length > 0 && (
        <section className="mt-10" aria-labelledby="pdp-colors">
          <h2 id="pdp-colors" className="mb-3 text-[15px]">
            <span className="font-bold">{size ? 'Màu có sẵn ở size' : 'Màu'}</span>
            {size && ` ${size}`}
          </h2>
          <ColorSwatches variants={product.colorVariants} activeId={product.id} getHref={(v) => `/p/${v.slug}${size ? `?size=${encodeURIComponent(size)}` : ''}`} />
          <p className="mt-4 text-[15px]">{product.colorName}</p>
        </section>
      )}

      <section ref={sizesRef} className="mt-12 scroll-mt-6" aria-labelledby="pdp-sizes">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="pdp-sizes" className="text-[15px] font-bold">
            Size
          </h2>
          <button type="button" onClick={() => setGuideOpen(true)} className="flex items-center gap-2 text-[15px]">
            <Ruler className="size-5" strokeWidth={1.5} aria-hidden />
            <span className="ds-link">Hướng dẫn chọn size</span>
          </button>
        </div>
        <SizeGrid sizes={product.sizes} value={size} onChange={onSizeChange} columns={5} />
        {sizeError && (
          <p role="alert" className="mt-3 text-sm text-sale">
            Vui lòng chọn size
          </p>
        )}
      </section>

      {product.sizeFit && <SizeFitNote text={product.sizeFit} />}

      <div className="mt-10 flex gap-3">
        <Button size="lg" arrow fullWidth loading={addToCart.isPending} onClick={onAdd} className="h-[60px] min-w-0 shrink text-sm">
          Thêm vào giỏ
        </Button>
        <button
          type="button"
          onClick={() => toggle(product)}
          aria-pressed={wished}
          aria-label={wished ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
          className="flex size-[60px] shrink-0 items-center justify-center border border-ink transition-colors hover:bg-gray-100"
        >
          <HeartIcon size={22} filled={wished} />
        </button>
      </div>

      <p className="mt-8 text-sm leading-snug">
        Chỉ từ {formatPrice(monthly, { exact: true })}/tháng, hoặc trả góp 4 kỳ lãi suất 0% với <span className="font-extrabold">Klarna</span>{' '}
        <a href="#klarna" onClick={(e) => e.preventDefault()} className="ds-link">
          Tìm hiểu thêm
        </a>
      </p>

      <div className="mt-5 border-y border-line py-5">
        {product.primeEligible ? (
          <div className="flex items-center gap-3">
            <History className="size-4 shrink-0" aria-hidden />
            <div className="flex-1">
              <PrimeLogo />
              {fastest ? (
                <>
                  <p className="mt-1 text-[15px] leading-snug">
                    Giao đến{' '}
                    <button type="button" onClick={() => setDeliveryOpen(true)} className="ds-link">
                      {delivery.zip}
                    </button>{' '}
                    sớm nhất: <span className="font-bold">{formatShortDay(fastest.estimatedDate)}</span>
                  </p>
                  <p className="text-[15px] text-gray-400">Miễn phí giao hàng và đổi trả dễ dàng</p>
                </>
              ) : (
                <>
                  <p className="mt-1 text-[15px] leading-snug text-gray-400">Miễn phí giao hàng Prime và đổi trả dễ dàng cho một số size và màu</p>
                  <button type="button" onClick={() => setDeliveryOpen(true)} className="ds-link mt-1 text-[15px]">
                    Xem ngày giao hàng
                  </button>
                </>
              )}
            </div>
            <Info className="size-4 shrink-0" aria-hidden />
          </div>
        ) : (
          <button type="button" onClick={() => setDeliveryOpen(true)} className="flex items-center gap-3 text-[15px]">
            <History className="size-4" aria-hidden />
            <span className="ds-link">Xem ngày giao hàng</span>
          </button>
        )}
      </div>

      <ul className="mt-6 space-y-4 text-[15px]">
        <li>
          <Link to="/club" className="flex items-center gap-3">
            <Truck className="size-5" strokeWidth={1.5} aria-hidden />
            <span className="ds-link">Miễn phí giao hàng với {brand.clubName}</span>
          </Link>
        </li>
        <li>
          <Link to="/help" className="flex items-center gap-3">
            <RotateCcw className="size-5" strokeWidth={1.5} aria-hidden />
            <span className="ds-link">Đổi trả miễn phí trong 30 ngày</span>
          </Link>
        </li>
      </ul>

      <SizeGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
      <DeliveryDatesModal open={deliveryOpen} onClose={() => setDeliveryOpen(false)} productId={product.id} onResult={(res) => setDelivery({ zip: res.zip, options: res.options })} />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Accordion dưới gallery                                                      */
/* -------------------------------------------------------------------------- */
function ProductAccordions({ product, summary, reviewsOpen, setReviewsOpen }) {
  const [topic, setTopic] = useState(null)
  const descImage = product.images[1] ?? product.images[0]
  const styleImages = useMemo(() => {
    const imgs = product.images.length ? product.images : [product.image]
    return [0, 1, 2].map((i) => imgs[(i + 1) % imgs.length])
  }, [product])
  const count = summary?.count ?? product.rating?.count ?? 0
  const average = summary?.average ?? product.rating?.average ?? 0

  return (
    <div className="px-4 md:px-8 lg:px-12 xl:px-[110px]">
      <div className="border-t border-line">
        <AccordionItem
          title={<span className="normal-case">Đánh giá ({count})</span>}
          open={reviewsOpen}
          onToggle={setReviewsOpen}
          headerClassName="py-8 px-0 sm:px-6"
          contentClassName="px-0 sm:px-5 pb-10"
          className="scroll-mt-4"
          right={
            count > 0 && (
              <span className="flex items-center gap-3">
                <span className="text-lg font-bold">{average.toFixed(1)}</span>
                <ReviewStars value={average} size={20} />
              </span>
            )
          }
        >
          <ReviewSummary summary={summary} writeHref={`/p/${product.slug}/review`} topic={topic} onTopicChange={setTopic} filtersId={REVIEW_FILTERS_ID} />
          <ReviewList productId={product.id} topic={topic} filtersId={REVIEW_FILTERS_ID} className="mt-8" />
        </AccordionItem>

        <AccordionItem title={<span className="normal-case">Mô tả</span>} headerClassName="py-8 px-0 sm:px-6" contentClassName="px-0 sm:px-5 pb-10">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-display text-[28px] leading-[1.1] font-extrabold uppercase lg:text-[36px]">{product.description?.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed">{product.description?.body}</p>
            </div>
            {descImage && <img src={descImage.url} alt={descImage.alt} loading="lazy" className="aspect-square w-full bg-image object-cover" />}
          </div>
        </AccordionItem>

        <AccordionItem title={<span className="normal-case">Chi tiết</span>} headerClassName="py-8 px-0 sm:px-6" contentClassName="px-0 sm:px-5 pb-10">
          <ul className="list-disc gap-x-16 pl-6 text-[15px] leading-loose sm:columns-2">
            {product.details?.map((d) => (
              <li key={d} className="break-inside-avoid-column">
                {d}
              </li>
            ))}
            <li className="break-inside-avoid-column">Mã sản phẩm: {product.id}</li>
          </ul>
        </AccordionItem>

        <AccordionItem title={<span className="normal-case">Gợi ý phối đồ</span>} headerClassName="py-8 px-0 sm:px-6" contentClassName="px-0 sm:px-5 pb-10">
          <p className="text-[15px]">
            Chia sẻ ảnh món đồ {brand.shortName} yêu thích của bạn để xuất hiện trong bộ sưu tập của chúng tôi. Đừng quên gắn thẻ @{brand.shortName.toLowerCase()} vào ảnh nhé.
          </p>
          <div className="mt-4 flex snap-x gap-3 overflow-x-auto scrollbar-none">
            {styleImages.map((img, i) => (
              <figure key={i} className="w-[80%] shrink-0 snap-start bg-image sm:w-[calc((100%-24px)/3)]">
                <div className="relative aspect-square">
                  <img src={img.url} alt={`Gợi ý phối đồ ${i + 1} với ${product.name}`} loading="lazy" className="size-full object-cover" />
                  <Camera className="absolute top-4 left-4 size-6 text-white drop-shadow" aria-hidden />
                </div>
                <figcaption className="py-6 text-center">
                  <a href="#complete-the-look" className="ds-label text-sm underline underline-offset-4 hover:no-underline">
                    Xem sản phẩm
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </AccordionItem>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Loading / lỗi                                                               */
/* -------------------------------------------------------------------------- */
function PdpSkeleton() {
  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(400px,30%)]" aria-busy="true" aria-label="Đang tải sản phẩm">
      <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-2">
        <Skeleton className="aspect-square" />
        <Skeleton className="hidden aspect-square lg:block" />
        <Skeleton className="hidden aspect-square lg:block" />
        <Skeleton className="hidden aspect-square lg:block" />
      </div>
      <div className="space-y-4 px-4 pt-6 md:px-8 lg:px-12 lg:pt-12">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-9 w-4/5" />
        <Skeleton className="h-5 w-16" />
        <div className="grid grid-cols-5 gap-1.5 pt-8">
          {Array.from({ length: 15 }, (_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
        <Skeleton className="mt-8 h-[60px]" />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Trang                                                                       */
/* -------------------------------------------------------------------------- */
export default function ProductDetailPage() {
  const { slug } = useParams()
  const { data: product, isLoading, isError, error } = useProduct(slug)

  useEffect(() => {
    if (product) document.title = `${product.name} - ${product.colorName} | ${brand.name}`
  }, [product])

  if (isLoading) return <PdpSkeleton />
  if (isError || !product) {
    const notFound = !error || error.status === 404
    return (
      <div className="container-content">
        <EmptyState
          title={notFound ? 'Không tìm thấy sản phẩm' : 'Đã có lỗi xảy ra'}
          description={notFound ? 'Sản phẩm bạn tìm có thể đã bị gỡ hoặc không còn kinh doanh.' : 'Hiện chưa thể tải sản phẩm này. Vui lòng thử lại sau giây lát.'}
          action={
            <Button to="/" arrow>
              Tiếp tục mua sắm
            </Button>
          }
        />
      </div>
    )
  }
  // key theo id → đổi màu sẽ reset state (size, accordion…)
  return <ProductDetail key={product.id} product={product} />
}

function ProductDetail({ product }) {
  const [reviewsOpen, setReviewsOpen] = useState(false)
  const { data: summary } = useReviewSummary(product.id)
  const completeLook = useRecommendations(product.id, 'complete_look', 8)
  const similar = useRecommendations(product.id, 'similar', 8)

  const badge = BADGE_TEXT[product.badges?.[0]]

  const showReviews = (e) => {
    e?.preventDefault()
    setReviewsOpen(true)
    requestAnimationFrame(() => document.getElementById(REVIEWS_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(400px,30%)]">
      {/* Gallery */}
      <div className="min-w-0 lg:col-start-1 lg:row-start-1">
        <Breadcrumbs items={product.breadcrumbs} className="px-4 py-3 text-sm md:px-8 lg:hidden" />
        <ProductGallery images={product.images} badge={badge} overlay={<Breadcrumbs items={product.breadcrumbs} />} />
      </div>

      {/* Thông tin (sticky ở desktop) */}
      <aside className="min-w-0 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:border-l lg:border-line" aria-label="Thông tin sản phẩm">
        <div className="scrollbar-none lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto">
          <ProductInfo product={product} onShowReviews={showReviews} />
        </div>
      </aside>

      {/* Accordion */}
      <div id={REVIEWS_ID} className="min-w-0 scroll-mt-4 pt-10 lg:col-start-1 lg:row-start-2 lg:pt-24">
        <ProductAccordions product={product} summary={summary} reviewsOpen={reviewsOpen} setReviewsOpen={setReviewsOpen} />
      </div>

      {/* Gợi ý */}
      <div className="min-w-0 space-y-16 px-4 py-16 md:px-8 lg:col-start-1 lg:row-start-3 lg:px-6 lg:py-20">
        <div id="complete-the-look" className={cn('scroll-mt-6', !completeLook.isLoading && !completeLook.data?.length && 'hidden')}>
          <ProductCarousel title="Phối trọn bộ" products={completeLook.data} loading={completeLook.isLoading} />
        </div>
        <ProductCarousel title="Có thể bạn cũng thích" products={similar.data} loading={similar.isLoading} />
      </div>
    </div>
  )
}
