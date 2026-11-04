/**
 * Helper thuần cho PLP / Search: chuyển đổi filter giữa URL search params ⇄ state ⇄ query API.
 * URL params (chia sẻ được, BE đọc trực tiếp): sort, page, gender, activity, sport, collection,
 * size, color (csv), minPrice, maxPrice.
 */
import { formatPrice } from '@/utils/format'

export const SORT_OPTIONS = [
  { value: 'price_asc', label: 'Giá (thấp - cao)' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'top_sellers', label: 'Bán chạy nhất' },
  { value: 'price_desc', label: 'Giá (cao - thấp)' },
]

/** Filter nhiều giá trị (csv). `gender` chỉ một giá trị. */
export const MULTI_KEYS = ['activity', 'size', 'sport', 'color', 'collection']
export const FILTER_KEYS = ['gender', ...MULTI_KEYS, 'minPrice', 'maxPrice']
const LISTING_KEYS = [...FILTER_KEYS, 'sort', 'page']

export const EMPTY_FILTERS = Object.freeze({ gender: '', activity: [], size: [], sport: [], color: [], collection: [], minPrice: '', maxPrice: '' })

const splitCsv = (v) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [])

/** URLSearchParams → { sort, page, filters } */
export function parseListingParams(sp) {
  const filters = { ...EMPTY_FILTERS, gender: sp.get('gender') ?? '', minPrice: sp.get('minPrice') ?? '', maxPrice: sp.get('maxPrice') ?? '' }
  for (const k of MULTI_KEYS) filters[k] = splitCsv(sp.get(k))
  return { sort: sp.get('sort') ?? '', page: Math.max(1, Number(sp.get('page')) || 1), filters }
}

/** filters → object gửi GET /products (bỏ giá trị rỗng để query key ổn định). */
export function toApiFilters(filters) {
  const out = {}
  if (filters.gender) out.gender = filters.gender
  for (const k of MULTI_KEYS) if (filters[k]?.length) out[k] = filters[k].join(',')
  if (filters.minPrice !== '' && filters.minPrice != null) out.minPrice = Number(filters.minPrice)
  if (filters.maxPrice !== '' && filters.maxPrice != null) out.maxPrice = Number(filters.maxPrice)
  return out
}

/** Ghi { sort, filters } vào search params hiện có (giữ các param khác như `q`), reset page. */
export function writeListingParams(prev, { sort, filters }) {
  const next = new URLSearchParams(prev)
  for (const k of LISTING_KEYS) next.delete(k)
  if (sort) next.set('sort', sort)
  for (const [k, v] of Object.entries(toApiFilters(filters))) next.set(k, String(v))
  return next
}

/** search string cho trang `page` (giữ nguyên filter). */
export function pageSearch(sp, page) {
  const next = new URLSearchParams(sp)
  if (page > 1) next.set('page', String(page))
  else next.delete('page')
  const s = next.toString()
  return s ? `?${s}` : ''
}

export function countActiveFilters(filters) {
  let n = filters.gender ? 1 : 0
  for (const k of MULTI_KEYS) n += filters[k]?.length ?? 0
  if (filters.minPrice !== '' || filters.maxPrice !== '') n += 1
  return n
}

const labelOf = (facetList, value) => facetList?.find((f) => f.value === value)?.label ?? value.replace(/^\w/, (c) => c.toUpperCase())

export function priceLabel(min, max) {
  const hasMin = min !== '' && min != null
  const hasMax = max !== '' && max != null
  if (hasMin && hasMax) return `${formatPrice(Number(min))} - ${formatPrice(Number(max))}`
  if (hasMin) return `${formatPrice(Number(min))}+`
  if (hasMax) return `Đến ${formatPrice(Number(max))}`
  return ''
}

/** Danh sách chip "Bộ lọc đã chọn": [{ key, value, label }] */
export function describeFilters(filters, facets) {
  const chips = []
  if (filters.gender) chips.push({ key: 'gender', value: filters.gender, label: labelOf(facets?.gender, filters.gender) })
  for (const k of MULTI_KEYS) {
    for (const v of filters[k] ?? []) chips.push({ key: k, value: v, label: k === 'size' ? `Size ${v}` : labelOf(facets?.[k], v) })
  }
  const price = priceLabel(filters.minPrice, filters.maxPrice)
  if (price) chips.push({ key: 'price', value: 'price', label: price })
  return chips
}

export function removeFilter(filters, chip) {
  if (chip.key === 'gender') return { ...filters, gender: '' }
  if (chip.key === 'price') return { ...filters, minPrice: '', maxPrice: '' }
  return { ...filters, [chip.key]: filters[chip.key].filter((v) => v !== chip.value) }
}

/** Tóm tắt lựa chọn dưới tiêu đề accordion (GENDER — "Men"). */
export function summarize(filters, key, facets) {
  if (key === 'gender') return filters.gender ? labelOf(facets?.gender, filters.gender) : ''
  if (key === 'price') return priceLabel(filters.minPrice, filters.maxPrice)
  const vals = filters[key] ?? []
  return vals.map((v) => (key === 'size' ? v : labelOf(facets?.[key], v))).join(', ')
}
