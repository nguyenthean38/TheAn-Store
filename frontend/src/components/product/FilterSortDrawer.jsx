import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { AccordionItem, Button, Checkbox, Drawer, SizeGrid } from '@/components/ui'
import { useProducts } from '@/hooks/useCatalog'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/format'
import { EMPTY_FILTERS, SORT_OPTIONS, describeFilters, removeFilter, summarize, toApiFilters } from './listingFilters'

/* ------------------------------------------------------------------ */
/* Chip filter (dùng cả trong drawer và trên trang)                     */
/* ------------------------------------------------------------------ */
export function FilterChips({ chips, onRemove, className }) {
  if (!chips.length) return null
  return (
    <ul className={cn('flex flex-wrap gap-3', className)}>
      {chips.map((c) => (
        <li key={`${c.key}:${c.value}`}>
          <button
            type="button"
            onClick={() => onRemove(c)}
            aria-label={`Bỏ bộ lọc ${c.label}`}
            className="inline-flex h-11 items-center gap-3 bg-gray-100 px-4 text-[15px] transition-colors hover:bg-gray-200"
          >
            <X className="size-5" strokeWidth={1.75} aria-hidden />
            {c.label}
          </button>
        </li>
      ))}
    </ul>
  )
}

/* ------------------------------------------------------------------ */
/* Các khối con                                                         */
/* ------------------------------------------------------------------ */
function CheckList({ options, selected, onToggle, limit = 6 }) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? options : options.slice(0, limit)
  return (
    <div>
      <ul className="space-y-5">
        {visible.map((o) => (
          <li key={o.value}>
            <Checkbox
              checked={selected.includes(o.value)}
              onChange={() => onToggle(o.value)}
              label={
                <span className="text-[15px]">
                  {o.label} <span className="ml-1.5 text-gray-400">({o.count})</span>
                </span>
              }
            />
          </li>
        ))}
      </ul>
      {options.length > limit && (
        <button type="button" onClick={() => setExpanded((e) => !e)} className="mt-6 text-[15px] hover:underline" aria-expanded={expanded}>
          {expanded ? 'Thu gọn' : 'Xem thêm'}
        </button>
      )}
    </div>
  )
}

/** Màu sáng → dấu tick đen; màu tối → tick trắng. */
function isLight(hex) {
  if (!hex?.startsWith('#') || hex.length < 7) return true
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return 0.299 * r + 0.587 * g + 0.114 * b > 150
}

function ColorGrid({ options, selected, onToggle }) {
  return (
    <ul className="grid grid-cols-6 gap-x-4 gap-y-6 sm:grid-cols-7">
      {options.map((o) => {
        const active = selected.includes(o.value)
        return (
          <li key={o.value}>
            <button
              type="button"
              onClick={() => onToggle(o.value)}
              aria-pressed={active}
              aria-label={`${o.label} (${o.count})`}
              title={o.label}
              className={cn('relative flex size-8 items-center justify-center border transition-shadow hover:shadow-[0_0_0_2px_#fff,0_0_0_3px_#000]', isLight(o.hex) ? 'border-gray-300' : 'border-transparent', active && 'shadow-[0_0_0_2px_#fff,0_0_0_3px_#000]')}
              style={{ background: o.hex ?? '#ccc' }}
            >
              {active && <Check className={cn('size-6', isLight(o.hex) ? 'text-ink' : 'text-white')} strokeWidth={2} aria-hidden />}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

const thumb =
  'pointer-events-none absolute inset-0 h-6 w-full appearance-none bg-transparent focus-visible:outline-none ' +
  '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[6px] [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:bg-white ' +
  '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:box-border [&::-moz-range-thumb]:size-6 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[6px] [&::-moz-range-thumb]:border-solid [&::-moz-range-thumb]:border-ink [&::-moz-range-thumb]:bg-white [&::-moz-range-track]:bg-transparent ' +
  '[&:focus-visible::-webkit-slider-thumb]:shadow-[0_0_0_3px_#fff,0_0_0_5px_#000] [&:focus-visible::-moz-range-thumb]:shadow-[0_0_0_3px_#fff,0_0_0_5px_#000]'

/** Thanh trượt 2 đầu (ảnh #29–#30): 2 input range chồng lên nhau. */
function PriceRange({ bounds, min, max, onChange }) {
  const lo = Math.min(Math.max(min === '' ? bounds.min : Number(min), bounds.min), bounds.max)
  const hi = Math.max(Math.min(max === '' ? bounds.max : Number(max), bounds.max), lo)
  const span = bounds.max - bounds.min || 1
  const pct = (v) => ((v - bounds.min) / span) * 100
  // Vị trí tâm thumb (thumb 24px) để căn nhãn số bên dưới.
  const at = (v) => `calc(${pct(v)}% + ${12 - pct(v) * 0.24}px)`
  const emit = (nextLo, nextHi) => onChange(nextLo <= bounds.min ? '' : String(nextLo), nextHi >= bounds.max ? '' : String(nextHi))

  return (
    <div className="px-1 pt-1 pb-2">
      <p className="text-center text-[17px]" aria-live="polite">
        {formatPrice(lo)} - {formatPrice(hi)}
      </p>
      <div className="relative mt-4 h-6">
        <div className="absolute inset-x-3 top-1/2 h-px -translate-y-1/2 bg-gray-400" aria-hidden />
        <div className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-ink" style={{ left: at(lo), right: `calc(100% - ${at(hi)})` }} aria-hidden />
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={1}
          value={lo}
          onChange={(e) => emit(Math.min(Number(e.target.value), hi), hi)}
          aria-label="Giá thấp nhất"
          aria-valuetext={formatPrice(lo)}
          className={cn(thumb, pct(lo) > 50 ? 'z-20' : 'z-10')}
        />
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={1}
          value={hi}
          onChange={(e) => emit(lo, Math.max(Number(e.target.value), lo))}
          aria-label="Giá cao nhất"
          aria-valuetext={formatPrice(hi)}
          className={cn(thumb, 'z-[15]')}
        />
      </div>
      <div className="relative mt-3 h-5 text-sm font-bold" aria-hidden>
        <span className="absolute -translate-x-1/2" style={{ left: at(lo) }}>
          {lo}
        </span>
        {hi !== lo && (
          <span className="absolute -translate-x-1/2" style={{ left: at(hi) }}>
            {hi}
          </span>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Drawer                                                               */
/* ------------------------------------------------------------------ */

/**
 * Drawer "Filter & Sort" (ảnh #21–#31). Mọi thay đổi là bản nháp cho tới khi bấm APPLY.
 * Props:
 *  - baseFilters: filter cố định của trang (category.filters hoặc { q })
 *  - sort, filters: giá trị đang áp dụng (từ URL)
 *  - facets: facets của baseFilters (GET /products meta.facets)
 *  - onApply({ sort, filters })
 */
export function FilterSortDrawer({ open, ...props }) {
  // Chỉ mount panel khi mở → bản nháp luôn khởi tạo lại từ giá trị đang áp dụng.
  if (!open) return null
  return <FilterSortPanel {...props} />
}

function FilterSortPanel({ onClose, baseFilters = {}, sort: appliedSort = '', filters: appliedFilters = EMPTY_FILTERS, facets, onApply }) {
  const [sort, setSort] = useState(appliedSort)
  const [draft, setDraft] = useState(appliedFilters)

  // Số kết quả "sống" cho bản nháp (query nhẹ pageSize=1).
  const countQuery = useProducts({ ...baseFilters, ...toApiFilters(draft), pageSize: 1 })
  const total = countQuery.data?.meta?.total

  const toggle = (key, value) =>
    setDraft((d) => (key === 'gender' ? { ...d, gender: d.gender === value ? '' : value } : { ...d, [key]: d[key].includes(value) ? d[key].filter((v) => v !== value) : [...d[key], value] }))

  const chips = describeFilters(draft, facets)
  const clearAll = () => {
    setDraft(EMPTY_FILTERS)
    setSort('')
  }
  const apply = () => {
    onApply({ sort, filters: draft })
    onClose()
  }

  const section = (key, title, content, { show = true } = {}) => {
    if (!show) return null
    const summary = summarize(draft, key, facets)
    return <AccordionItem key={key} title={title} summary={summary || undefined} marked={Boolean(summary)}>{content}</AccordionItem>
  }

  const has = (k) => (facets?.[k]?.length ?? 0) > 0
  const priceBounds = facets?.price ? { min: Math.floor(facets.price.min), max: Math.ceil(facets.price.max) } : null

  return (
    <Drawer
      open
      onClose={onClose}
      title="Lọc & Sắp xếp"
      headerRight={
        <button type="button" onClick={clearAll} className="text-[15px] text-gray-600 underline underline-offset-4 hover:text-ink hover:no-underline">
          Xóa tất cả
        </button>
      }
      footer={
        <Button fullWidth arrow size="lg" onClick={apply} loading={countQuery.isLoading}>
          Áp dụng{total != null ? ` (${total})` : ''}
        </Button>
      }
    >
      <div className="px-6">
        {chips.length > 0 && (
          <section className="border-b border-line py-7" aria-labelledby="applied-filters">
            <h3 id="applied-filters" className="mb-5 text-base font-bold uppercase">
              Bộ lọc đã chọn
            </h3>
            <FilterChips chips={chips} onRemove={(c) => setDraft((d) => removeFilter(d, c))} />
          </section>
        )}

        <AccordionItem title="Sắp xếp theo" defaultOpen contentClassName="pb-0">
          <ul aria-label="Sắp xếp theo" className="-mb-px">
            {SORT_OPTIONS.map((o) => {
              const active = sort === o.value
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSort(active ? '' : o.value)}
                    className={cn(
                      'relative flex h-16 w-full items-center border-t border-line text-left text-[15px] uppercase transition-colors hover:bg-gray-50',
                      active && 'font-semibold before:absolute before:inset-y-0 before:-left-6 before:w-1 before:bg-ink',
                    )}
                  >
                    {o.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </AccordionItem>

        {section('gender', 'Giới tính', <CheckList options={facets?.gender ?? []} selected={draft.gender ? [draft.gender] : []} onToggle={(v) => toggle('gender', v)} />, { show: has('gender') })}
        {section('activity', 'Hoạt động', <CheckList options={facets?.activity ?? []} selected={draft.activity} onToggle={(v) => toggle('activity', v)} />, { show: has('activity') })}
        {section(
          'size',
          'Size',
          <SizeGrid variant="filter" multiple columns={5} sizes={(facets?.size ?? []).map((s) => s.value)} value={draft.size} onChange={(label) => toggle('size', label)} />,
          { show: has('size') },
        )}
        {section('sport', 'Môn thể thao', <CheckList options={facets?.sport ?? []} selected={draft.sport} onToggle={(v) => toggle('sport', v)} />, { show: has('sport') })}
        {section('color', 'Màu', <ColorGrid options={facets?.color ?? []} selected={draft.color} onToggle={(v) => toggle('color', v)} />, { show: has('color') })}
        {section('collection', 'Bộ sưu tập', <CheckList options={facets?.collection ?? []} selected={draft.collection} onToggle={(v) => toggle('collection', v)} />, { show: has('collection') })}
        {section(
          'price',
          'Giá',
          priceBounds && <PriceRange bounds={priceBounds} min={draft.minPrice} max={draft.maxPrice} onChange={(minPrice, maxPrice) => setDraft((d) => ({ ...d, minPrice, maxPrice }))} />,
          { show: Boolean(priceBounds && priceBounds.max > priceBounds.min) },
        )}
      </div>
    </Drawer>
  )
}
