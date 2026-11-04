import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (count, error) => (error?.status ?? 500) >= 500 && count < 2,
    },
  },
})

/** Query keys tập trung — dùng chung cho invalidate. */
export const qk = {
  me: ['me'],
  category: (slug) => ['category', slug],
  products: (filters) => ['products', filters],
  product: (slug) => ['product', slug],
  recommendations: (id, type) => ['recommendations', id, type],
  suggestions: (q) => ['suggestions', q],
  reviewSummary: (id) => ['reviews', id, 'summary'],
  reviews: (id, params) => ['reviews', id, 'list', params],
  cart: ['cart'],
  wishlist: ['wishlist'],
  orders: ['orders'],
  order: (number) => ['orders', number],
  addresses: ['addresses'],
  vouchers: ['vouchers'],
  shippingMethods: ['shipping-methods'],
}
