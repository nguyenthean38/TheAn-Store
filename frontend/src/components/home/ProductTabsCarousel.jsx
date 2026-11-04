import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tabs } from '@/components/ui'
import { ProductCarousel } from '@/components/product/ProductCarousel'
import { useProducts } from '@/hooks/useCatalog'

/**
 * Tab "New Arrivals / Best Sellers" + VIEW ALL + carousel (ảnh #0, #7).
 * `tabs` = [{ value, label, filters, href }]
 */
export function ProductTabsCarousel({ tabs, className }) {
  const [value, setValue] = useState(tabs[0].value)
  const tab = tabs.find((t) => t.value === value) ?? tabs[0]
  const { data, isLoading } = useProducts({ ...tab.filters, pageSize: 12 })

  return (
    <section className={className} aria-label="Sản phẩm nổi bật">
      <div className="mb-7 flex items-center justify-between gap-4">
        <Tabs variant="boxed" items={tabs} value={value} onChange={setValue} />
        <Link to={tab.href} className="ds-link-strong shrink-0 text-sm lg:text-[17px]">
          Xem tất cả
        </Link>
      </div>
      <div role="tabpanel" aria-label={tab.label}>
        <ProductCarousel products={data?.data} loading={isLoading} />
      </div>
    </section>
  )
}
