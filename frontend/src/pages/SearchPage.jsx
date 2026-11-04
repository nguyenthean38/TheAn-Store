import { useEffect, useId, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui'
import { FilterSortButton, ProductListingResults, useListing } from '@/components/product/ProductListing'
import { brand } from '@/config/brand'

const NO_FILTERS = {}

/** Ô tìm kiếm full-width (ảnh #68–#69). */
function SearchForm({ initial = '' }) {
  const navigate = useNavigate()
  const [value, setValue] = useState(initial)
  const inputRef = useRef(null)
  const id = useId()

  const submit = (e) => {
    e.preventDefault()
    const term = value.trim()
    if (term) navigate(`/search?q=${encodeURIComponent(term)}`)
  }

  return (
    <form role="search" onSubmit={submit} className="mt-7 flex h-16 items-center gap-3 border border-gray-400 px-4 focus-within:border-ink">
      <label htmlFor={id} className="sr-only">
        Tìm kiếm
      </label>
      <button type="submit" aria-label="Tìm kiếm" className="shrink-0">
        <Search className="size-6" strokeWidth={2} aria-hidden />
      </button>
      <input
        ref={inputRef}
        id={id}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tìm kiếm"
        autoComplete="off"
        className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:tracking-[0.06em] placeholder:text-gray-600 placeholder:uppercase [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          aria-label="Xóa nội dung tìm kiếm"
          onClick={() => {
            setValue('')
            inputRef.current?.focus()
          }}
          className="shrink-0 hover:opacity-60"
        >
          <X className="size-7" strokeWidth={1.75} aria-hidden />
        </button>
      )}
    </form>
  )
}

/** Không có kết quả / chưa nhập từ khoá (ảnh #68–#69). Cột link bên dưới chính là footer của layout. */
function NoResults({ q }) {
  return (
    <div className="container-content py-12 lg:py-20">
      <h1 className="ds-h2 tracking-[0.04em]">{q ? `Rất tiếc - không có kết quả cho "${q}".` : 'Bạn đang tìm gì?'}</h1>
      <p className="mt-2 text-[15px]">{q ? 'Đừng bỏ cuộc! Hãy kiểm tra lại chính tả hoặc thử từ khóa chung hơn.' : 'Tìm giày, quần áo, phụ kiện và nhiều hơn nữa.'}</p>
      <SearchForm key={q} initial="" />
      <p className="mt-6 text-[15px]">
        Hoặc quay lại{' '}
        <Link to="/" className="ds-link">
          Trang chủ
        </Link>{' '}
        và bắt đầu lại.
      </p>
    </div>
  )
}

/** Trang tìm kiếm — /search?q= (ảnh #68–#70). Dùng chung lưới + Filter & Sort với PLP. */
export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const q = (searchParams.get('q') ?? '').trim()
  const listing = useListing(q ? { q } : NO_FILTERS, { enabled: Boolean(q) })
  const { result, meta, activeCount } = listing
  const total = result.isPlaceholderData ? undefined : meta?.total

  useEffect(() => {
    document.title = q ? `Kết quả tìm kiếm cho "${q}" | ${brand.name}` : `Tìm kiếm | ${brand.name}`
  }, [q])

  if (!q) return <NoResults q="" />
  if (result.isSuccess && !result.isPlaceholderData && total === 0 && activeCount === 0) return <NoResults q={q} />

  return (
    <div className="container-content pt-6 pb-16 lg:pt-8 lg:pb-24">
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tìm kiếm' }]} />
      <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6 lg:mt-14">
        <div className="min-w-0">
          <p className="text-[15px]">kết quả tìm kiếm cho:</p>
          <h1 className="mt-1 flex flex-wrap items-end gap-x-4 gap-y-1">
            <span className="ds-h1 break-words">“{q}”</span>
            {total != null && <span className="pb-0.5 text-sm text-gray-400 lg:pb-1">[{total}]</span>}
          </h1>
        </div>
        <FilterSortButton onClick={listing.openDrawer} count={activeCount} />
      </div>
      <ProductListingResults listing={listing} className="mt-5" />
    </div>
  )
}
