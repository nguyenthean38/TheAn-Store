import { http } from '../http'

const data = (r) => r.data

export const catalogService = {
  category: (slug) => http.get(`/categories/${slug}`).then(data),
  /** Trả về nguyên `{ data: ProductSummary[], meta: { page, pageSize, total, totalPages, facets } }`. */
  products: (filters) => http.get('/products', filters),
  product: (slug) => http.get(`/products/${slug}`).then(data),
  recommendations: (id, type = 'similar', limit = 8) => http.get(`/products/${id}/recommendations`, { type, limit }).then(data),
  suggestions: (q) => http.get('/search/suggestions', { q }).then(data),
  deliveryEstimate: (zip, productId) => http.get('/delivery-estimate', { zip, productId }).then(data),
}
