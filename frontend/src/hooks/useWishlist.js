import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { wishlistService } from '@/api'
import { useUI } from '@/store/ui'
import { qk } from './queryClient'

export function useWishlist() {
  return useQuery({ queryKey: qk.wishlist, queryFn: wishlistService.list })
}

/** Toggle wishlist với optimistic update (tim đổi màu ngay lập tức). */
export function useToggleWishlist() {
  const qc = useQueryClient()
  const toast = useUI((s) => s.toast)
  const { data: list = [] } = useWishlist()

  const mutation = useMutation({
    mutationFn: ({ product, wished }) => (wished ? wishlistService.remove(product.id) : wishlistService.add(product.id)),
    onMutate: async ({ product, wished }) => {
      await qc.cancelQueries({ queryKey: qk.wishlist })
      const prev = qc.getQueryData(qk.wishlist)
      qc.setQueryData(qk.wishlist, (old = []) => (wished ? old.filter((p) => p.id !== product.id) : [product, ...old]))
      return { prev }
    },
    onError: (_e, _v, ctx) => {
      qc.setQueryData(qk.wishlist, ctx?.prev)
      toast('Không thể cập nhật danh sách yêu thích', 'error')
    },
    onSuccess: (data, { wished }) => {
      qc.setQueryData(qk.wishlist, data)
      toast(wished ? 'Đã bỏ khỏi yêu thích' : 'Đã thêm vào yêu thích', 'success')
    },
  })

  const isWished = (id) => list.some((p) => p.id === id)
  const toggle = (product) => mutation.mutate({ product, wished: isWished(product.id) })
  return { isWished, toggle, count: list.length }
}
