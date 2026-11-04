import { Carousel } from '@/components/ui'
import { ProductCard, ProductCardSkeleton } from './ProductCard'

/** Carousel sản phẩm với tiêu đề condensed (TOP PICKS FOR YOU, YOU MAY ALSO LIKE...). */
export function ProductCarousel({ title, products, loading, className, itemClassName, headerRight }) {
  if (!loading && !products?.length) return null
  return (
    <section className={className}>
      {(title || headerRight) && (
        <div className="mb-6 flex items-end justify-between gap-4">
          {title && <h2 className="ds-h-condensed">{title}</h2>}
          {headerRight}
        </div>
      )}
      <Carousel ariaLabel={typeof title === 'string' ? title : 'Sản phẩm'} itemClassName={itemClassName}>
        {loading ? Array.from({ length: 4 }, (_, i) => <ProductCardSkeleton key={i} />) : products.map((p) => <ProductCard key={p.id} product={p} />)}
      </Carousel>
    </section>
  )
}
