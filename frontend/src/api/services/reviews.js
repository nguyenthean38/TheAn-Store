import { http } from '../http'

export const reviewService = {
  summary: (productId) => http.get(`/products/${productId}/reviews/summary`).then((r) => r.data),
  /** Trả về `{ data: Review[], meta }`. */
  list: (productId, params) => http.get(`/products/${productId}/reviews`, params),
  create: (productId, payload) => http.post(`/products/${productId}/reviews`, payload).then((r) => r.data),
  vote: (reviewId, vote) => http.post(`/reviews/${reviewId}/helpful`, { vote }).then((r) => r.data),
}
