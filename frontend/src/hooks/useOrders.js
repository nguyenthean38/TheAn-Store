import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orderService } from '@/api'
import { qk } from './queryClient'

export function useOrders(enabled = true) {
  return useQuery({ queryKey: qk.orders, queryFn: () => orderService.list(), enabled })
}

export function useOrder(number) {
  return useQuery({ queryKey: qk.order(number), queryFn: () => orderService.get(number), enabled: Boolean(number) })
}

export function useShippingMethods() {
  return useQuery({ queryKey: qk.shippingMethods, queryFn: () => orderService.shippingMethods() })
}

export function usePlaceOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: orderService.place,
    onSuccess: (order) => {
      qc.setQueryData(qk.order(order.number), order)
      qc.invalidateQueries({ queryKey: qk.cart })
      qc.invalidateQueries({ queryKey: qk.orders })
      qc.invalidateQueries({ queryKey: qk.me })
    },
  })
}

export function useCancelOrder(number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload) => orderService.cancel(number, payload),
    onSuccess: (order) => {
      qc.setQueryData(qk.order(number), order)
      qc.invalidateQueries({ queryKey: qk.orders })
    },
  })
}
