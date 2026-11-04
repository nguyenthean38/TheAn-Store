import { useEffect } from 'react'
import {
  CategoryTiles,
  HeroBanner,
  PopularSearches,
  ProductTabsCarousel,
  PromoCards,
  PromoStrip,
  RelatedResources,
  SeoBlock,
  SeoLinkColumns,
} from '@/components/home'
import { ProductCarousel } from '@/components/product/ProductCarousel'
import { brand } from '@/config/brand'
import { categoryTiles, heroSlides, promoCards, promoCards2, promoStrip, relatedResources, seoText } from '@/config/home'
import { popularSearches, seoLinkColumns } from '@/config/navigation'
import { useProducts } from '@/hooks/useCatalog'

// Tab sản phẩm nổi bật: filter gửi lên GET /products, href = trang PLP tương ứng.
const FEATURED_TABS = [
  { value: 'new', label: 'Hàng mới về', filters: { badge: 'new', sort: 'newest' }, href: '/c/new-arrivals' },
  { value: 'best', label: 'Bán chạy', filters: { badge: 'best_seller', sort: 'top_sellers' }, href: '/c/best-sellers' },
]

function TopPicks({ className }) {
  const { data, isLoading } = useProducts({ sort: 'top_sellers', pageSize: 12 })
  return <ProductCarousel title="Gợi ý dành cho bạn" products={data?.data} loading={isLoading} className={className} />
}

/** Trang chủ (ảnh #0, #6–#10, #13–#14). */
export default function HomePage() {
  useEffect(() => {
    document.title = `${brand.name} | Website chính thức`
  }, [])

  return (
    <>
      <PromoStrip text={promoStrip.text} href={promoStrip.href} />
      <HeroBanner slides={heroSlides} />

      <div className="container-page">
        <ProductTabsCarousel tabs={FEATURED_TABS} className="mt-14 lg:mt-24" />
        <PromoCards items={promoCards} className="mt-16 lg:mt-20" />
        <PopularSearches terms={popularSearches} className="mt-16 lg:mt-20" />
        <CategoryTiles items={categoryTiles} className="mt-16 lg:mt-28" />
        <PromoCards items={promoCards2} label="Mua sắm thêm" className="mt-12 lg:mt-16" />
        <TopPicks className="mt-16 lg:mt-24" />
        <RelatedResources items={relatedResources} className="mt-16 lg:mt-24" />
        <SeoLinkColumns columns={seoLinkColumns} className="mt-16 mb-16 lg:mt-24 lg:mb-20" />
      </div>

      <SeoBlock title={seoText.title} paragraphs={seoText.paragraphs} tone="dark" />
    </>
  )
}
