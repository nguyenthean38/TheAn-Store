import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cartService } from '@/api'
import { qk } from './queryClient'

export function useCart() {
  return useQuery({ queryKey: qk.cart, queryFn: cartService.get })
}

/** Mọi mutation giỏ hàng trả về Cart mới → ghi thẳng vào cache. */
function useCartMutation(fn) {
  const qc = useQueryClient()
  return useMutation({ mutationFn: fn, onSuccess: (cart) => qc.setQueryData(qk.cart, cart) })
}

export const useAddToCart = () => useCartMutation(cartService.addItem)
export const useUpdateCartItem = () => useCartMutation(({ id, ...patch }) => cartService.updateItem(id, patch))
export const useRemoveCartItem = () => useCartMutation(cartService.removeItem)
export const useApplyPromo = () => useCartMutation(cartService.applyPromo)
export const useRemovePromo = () => useCartMutation(cartService.removePromo)
