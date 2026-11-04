import { http } from '../http'

const data = (r) => r.data

export const orderService = {
  shippingMethods: (zip) => http.get('/checkout/shipping-methods', { zip }).then(data),
  place: (payload) => http.post('/orders', payload).then(data),
  /** Trả về `{ data: Order[], meta }`. */
  list: (params) => http.get('/orders', params),
  get: (number) => http.get(`/orders/${number}`).then(data),
  cancel: (number, payload) => http.post(`/orders/${number}/cancel`, payload).then(data),
}
