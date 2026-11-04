import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reviewService } from '@/api'
import { qk } from './queryClient'

export function useReviewSummary(productId) {
  return useQuery({ queryKey: qk.reviewSummary(productId), queryFn: () => reviewService.summary(productId), enabled: Boolean(productId) })
}

/** Danh sách review có "Read more reviews" (infinite). */
export function useReviews(productId, params) {
  return useInfiniteQuery({
    queryKey: qk.reviews(productId, params),
    queryFn: ({ pageParam }) => reviewService.list(productId, { ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined),
    enabled: Boolean(productId),
  })
}

export function useCreateReview(productId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload) => reviewService.create(productId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews', productId] }),
  })
}

export function useVoteReview() {
  return useMutation({ mutationFn: ({ id, vote }) => reviewService.vote(id, vote) })
}
