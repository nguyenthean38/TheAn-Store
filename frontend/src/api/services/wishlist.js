import { http } from '../http'

const data = (r) => r.data

export const wishlistService = {
  list: () => http.get('/wishlist').then(data),
  add: (productId) => http.post('/wishlist', { productId }).then(data),
  remove: (productId) => http.delete(`/wishlist/${productId}`).then(data),
}
