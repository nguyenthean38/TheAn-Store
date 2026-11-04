import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AccordionItem, Breadcrumbs, Button, EmptyState, Skeleton } from '@/components/ui'
import { FilterSortButton, ProductListingResults, useListing } from '@/components/product/ProductListing'
import { brand } from '@/config/brand'
import { useCategory } from '@/hooks/useCatalog'
import { cn } from '@/utils/cn'

const NO_FILTERS = {}

function PlpHeaderSkeleton() {
  return (
    <div className="container-content pt-8" aria-hidden>
      <Skeleton className="h-5 w-64" />
      <Skeleton className="mt-12 h-11 w-2/3 max-w-[520px]" />
      <Skeleton className="mt-10 h-5 w-full max-w-[900px]" />
      <Skeleton className="mt-2 h-5 w-1/2" />
    </div>
  )
}

/** FAQ dạng accordion (ảnh #20). */
function CategoryFaq({ title, items }) {
  const [openIndex, setOpenIndex] = useState(-1)
  return (
    <section className="mt-16 lg:mt-20" aria-labelledby="plp-faq">
      <h2 id="plp-faq" className="ds-h2 mb-6 tracking-[0.04em] lg:mb-8">
        Câu hỏi thường gặp về {title}
      </h2>
      <div>
        {items.map((f, i) => (
          <AccordionItem
            key={f.question}
            title={<span className="text-[15px] normal-case">{f.question}</span>}
            open={openIndex === i}
            onToggle={(o) => setOpenIndex(o ? i : -1)}
            headerClassName="py-5"
          >
            <p className="ds-body max-w-[1260px]">{f.answer}</p>
          </AccordionItem>
        ))}
      </div>
    </section>
  )
}

/** PLP — /c/:slug (ảnh #17–#20). Filter/sort/page nằm trên URL. */
export default function ProductListPage() {
  const { slug } = useParams()
  const { data: category, isLoading, error } = useCategory(slug)
  const listing = useListing(category?.filters ?? NO_FILTERS, { enabled: Boolean(category) })
  const total = listing.meta?.total

  useEffect(() => {
    if (category) document.title = `${category.title} | ${brand.name}`
  }, [category])

  if (isLoading) return <PlpHeaderSkeleton />

  if (error || !category) {
    const notFound = error?.status === 404
    return (
      <div className="container-content">
        <EmptyState
          title={notFound ? 'Không tìm thấy danh mục' : 'Đã có lỗi xảy ra'}
          description={notFound ? 'Chúng tôi không tìm thấy trang bạn cần. Trang có thể đã được chuyển đi hoặc không còn tồn tại.' : error?.message}
          action={
            <Button to="/" arrow>
              Về trang chủ
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="pb-16 lg:pb-24">
      <div className="container-content pt-6 lg:pt-8">
        <Breadcrumbs items={category.breadcrumbs ?? []} />
        <h1 className="mt-10 flex flex-wrap items-end gap-x-4 gap-y-1 lg:mt-14">
          <span className="ds-h1">{category.title}</span>
          {total != null && <span className="pb-0.5 text-sm text-gray-400 lg:pb-1">[{total}]</span>}
        </h1>
        {category.description && <p className="ds-body mt-8 max-w-[1260px] text-[15px] lg:mt-12">{category.description}</p>}
      </div>

      {/* Thanh tab sub-category + FILTER & SORT — dính đầu trang khi cuộn (ảnh #18) */}
      <div className="sticky top-0 z-20 mt-8 bg-white lg:mt-10">
        <div className="container-content">
          <div className="flex items-end justify-between gap-6 border-b border-line">
            {category.tabs?.length > 0 ? (
              <nav aria-label={`Danh mục ${category.title}`} className="min-w-0 flex-1">
                <ul className="flex gap-8 overflow-x-auto pt-3 scrollbar-none">
                  {category.tabs.map((t) => {
                    const active = t.slug === slug
                    return (
                      <li key={t.slug} className="shrink-0">
                        <Link
                          to={`/c/${t.slug}`}
                          aria-current={active ? 'page' : undefined}
                          className={cn(
                            'relative block pb-3 text-[15px] whitespace-nowrap transition-colors',
                            active ? 'font-semibold text-ink after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-ink' : 'text-gray-600 hover:text-ink',
                          )}
                        >
                          {t.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            ) : (
              <span />
            )}
            <FilterSortButton onClick={listing.openDrawer} count={listing.activeCount} className="mt-2 mb-2.5" />
          </div>
        </div>
      </div>

      <div className="container-content mt-5">
        <ProductListingResults listing={listing} />

        {category.seo && (
          <section className="mt-16 lg:mt-24" aria-labelledby="plp-seo">
            <h2 id="plp-seo" className="ds-h2 tracking-[0.04em]">
              {category.seo.title}
            </h2>
            <p className="ds-body mt-5 max-w-[1260px] text-[15px] leading-relaxed">{category.seo.body}</p>
          </section>
        )}

        {category.faq?.length > 0 && <CategoryFaq title={category.title} items={category.faq} />}
      </div>
    </div>
  )
}
