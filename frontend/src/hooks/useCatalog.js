import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { catalogService } from '@/api'
import { qk } from './queryClient'

export function useCategory(slug) {
  return useQuery({ queryKey: qk.category(slug), queryFn: () => catalogService.category(slug), enabled: Boolean(slug), placeholderData: keepPreviousData })
}

/** Danh sách sản phẩm + meta (paging, facets). Giữ data cũ khi đổi filter để UI không nháy. */
export function useProducts(filters, options = {}) {
  return useQuery({
    queryKey: qk.products(filters),
    queryFn: () => catalogService.products(filters),
    placeholderData: keepPreviousData,
    ...options,
  })
}

export function useProduct(slug) {
  return useQuery({ queryKey: qk.product(slug), queryFn: () => catalogService.product(slug), enabled: Boolean(slug) })
}

export function useRecommendations(productId, type = 'similar', limit = 8) {
  return useQuery({
    queryKey: qk.recommendations(productId, type),
    queryFn: () => catalogService.recommendations(productId, type, limit),
    enabled: Boolean(productId),
  })
}

export function useSearchSuggestions(q) {
  const term = q.trim()
  return useQuery({
    queryKey: qk.suggestions(term),
    queryFn: () => catalogService.suggestions(term),
    enabled: term.length >= 2,
    staleTime: 60_000,
  })
}
