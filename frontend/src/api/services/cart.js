import { http } from '../http'

const data = (r) => r.data

export const cartService = {
  get: () => http.get('/cart').then(data),
  addItem: ({ productId, size, quantity = 1 }) => http.post('/cart/items', { productId, size, quantity }).then(data),
  updateItem: (itemId, patch) => http.patch(`/cart/items/${itemId}`, patch).then(data),
  removeItem: (itemId) => http.delete(`/cart/items/${itemId}`).then(data),
  applyPromo: (code) => http.post('/cart/promo', { code }).then(data),
  removePromo: () => http.delete('/cart/promo').then(data),
}
