import { useCallback, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui'
import { useProducts } from '@/hooks/useCatalog'
import { cn } from '@/utils/cn'
import { FilterChips, FilterSortDrawer } from './FilterSortDrawer'
import { ProductCard, ProductCardSkeleton } from './ProductCard'
import { EMPTY_FILTERS, countActiveFilters, describeFilters, pageSearch, parseListingParams, removeFilter, toApiFilters, writeListingParams } from './listingFilters'

/**
 * Hook dùng chung cho PLP và Search: đọc filter/sort/page từ URL, gọi GET /products.
 * `baseFilters` = filter cố định của trang (category.filters hoặc { q }); filter của người dùng ghi đè.
 */
export function useListing(baseFilters, { pageSize = 12, enabled = true } = {}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { sort, page, filters } = useMemo(() => parseListingParams(searchParams), [searchParams])
  const [drawerOpen, setDrawerOpen] = useState(false)

  const query = { ...baseFilters, ...toApiFilters(filters), sort: sort || undefined, page, pageSize }
  const result = useProducts(query, { enabled })
  // Facets của trang không kèm filter người dùng → danh sách lựa chọn trong drawer luôn đầy đủ.
  const facetsQuery = useProducts({ ...baseFilters, pageSize: 1 }, { enabled })

  const apply = useCallback((next) => setSearchParams((prev) => writeListingParams(prev, next)), [setSearchParams])

  return {
    baseFilters,
    sort,
    page,
    filters,
    result,
    products: result.data?.data ?? [],
    meta: result.data?.meta,
    facets: facetsQuery.data?.meta?.facets,
    activeCount: countActiveFilters(filters),
    apply,
    removeFilter: (chip) => apply({ sort, filters: removeFilter(filters, chip) }),
    clearFilters: () => apply({ sort, filters: EMPTY_FILTERS }),
    pageHref: (n) => pageSearch(searchParams, n),
    drawerOpen,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
  }
}

/** Nút "FILTER & SORT" viền đen + icon sliders (ảnh #17). */
export function FilterSortButton({ onClick, count = 0, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      className={cn('ds-label inline-flex h-12 shrink-0 items-center gap-3 border border-ink bg-white px-5 text-sm tracking-[0.06em] transition-colors hover:bg-ink hover:text-white', className)}
    >
      Lọc &amp; Sắp xếp
      {count > 0 && <span className="text-[13px]">({count})</span>}
      <SlidersHorizontal className="size-5" strokeWidth={1.75} aria-hidden />
    </button>
  )
}

/** Lưới sản phẩm 2 → 3 → 4 cột. */
export function ProductGrid({ products, loading, skeletonCount = 12, dimmed = false, className }) {
  return (
    <ul className={cn('grid grid-cols-2 gap-x-1 gap-y-6 transition-opacity md:grid-cols-3 md:gap-x-3 lg:grid-cols-4 lg:gap-y-10', dimmed && 'opacity-60', className)} aria-busy={loading || dimmed || undefined}>
      {loading
        ? Array.from({ length: skeletonCount }, (_, i) => (
            <li key={i}>
              <ProductCardSkeleton />
            </li>
          ))
        : products.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
    </ul>
  )
}

/** "Page: 1 of 21" + thanh tiến trình + PREVIOUS / NEXT (ảnh #19). Dùng link để URL chia sẻ được. */
export function ListingPagination({ page, totalPages, hrefFor, className }) {
  if (!totalPages || totalPages <= 1) return null
  return (
    <nav aria-label="Phân trang" className={cn('flex flex-col items-center', className)}>
      <p className="text-[15px]">
        Trang: {page} / {totalPages}
      </p>
      <div className="relative mt-4 h-0.5 w-full max-w-[460px] bg-gray-200" aria-hidden>
        <div className="absolute inset-y-0 bg-ink" style={{ left: `${((page - 1) / totalPages) * 100}%`, width: `${100 / totalPages}%` }} />
      </div>
      <div className="mt-7 flex w-full items-center justify-between gap-4">
        {page > 1 ? (
          <Link to={hrefFor(page - 1)} rel="prev" className="ds-label inline-flex h-[60px] min-w-[140px] items-center justify-center border border-ink px-6 tracking-[0.06em] hover:bg-ink hover:text-white md:min-w-[188px]">
            Trang trước
          </Link>
        ) : (
          <span />
        )}
        {page < totalPages && (
          <Link to={hrefFor(page + 1)} rel="next" className="ds-label inline-flex h-[60px] min-w-[140px] items-center justify-center bg-ink px-6 tracking-[0.06em] text-white hover:text-gray-300 md:min-w-[188px]">
            Trang sau
          </Link>
        )}
      </div>
    </nav>
  )
}

/**
 * Phần thân danh sách: chip filter + lưới + phân trang + drawer Filter & Sort.
 * Header (tiêu đề, nút FILTER & SORT) do từng trang tự dựng.
 */
export function ProductListingResults({ listing, className }) {
  const { result, products, meta, filters, facets } = listing
  const chips = describeFilters(filters, facets)
  const loading = result.isLoading || (result.isFetching && !result.data)

  return (
    <div className={className}>
      {chips.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          <FilterChips chips={chips} onRemove={listing.removeFilter} />
          <button type="button" onClick={listing.clearFilters} className="text-sm underline underline-offset-4 hover:no-underline">
            Xóa tất cả
          </button>
        </div>
      )}

      {result.isError ? (
        <div className="py-16">
          <p className="ds-body mb-6">Hiện không thể tải sản phẩm. Vui lòng thử lại.</p>
          <Button variant="secondary" onClick={() => result.refetch()}>
            Thử lại
          </Button>
        </div>
      ) : !loading && products.length === 0 ? (
        <div className="py-16">
          <h2 className="ds-h3 mb-3">Không có sản phẩm phù hợp với lựa chọn của bạn</h2>
          <p className="ds-body mb-6 text-gray-600">Hãy thử bỏ bớt bộ lọc để xem thêm kết quả.</p>
          {listing.activeCount > 0 && (
            <Button variant="secondary" arrow onClick={listing.clearFilters}>
              Xóa bộ lọc
            </Button>
          )}
        </div>
      ) : (
        <ProductGrid products={products} loading={loading} dimmed={result.isPlaceholderData} />
      )}

      <ListingPagination page={meta?.page ?? listing.page} totalPages={meta?.totalPages} hrefFor={listing.pageHref} className="mt-14 lg:mt-16" />

      <FilterSortDrawer
        open={listing.drawerOpen}
        onClose={listing.closeDrawer}
        baseFilters={listing.baseFilters}
        sort={listing.sort}
        filters={filters}
        facets={facets}
        onApply={listing.apply}
      />
    </div>
  )
}
