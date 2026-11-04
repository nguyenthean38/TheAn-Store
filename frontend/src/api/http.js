/**
 * HTTP client duy nhất của ứng dụng.
 * - VITE_USE_MOCK=true  → chuyển request tới mock server trong trình duyệt.
 * - VITE_USE_MOCK=false → fetch tới VITE_API_URL (backend thật).
 * Tự gắn `Authorization: Bearer <token>` và `X-Cart-Id` (giỏ hàng khách).
 */
import { env } from '@/config/env'
import { storage, uid } from '@/utils/storage'

export class ApiError extends Error {
  constructor(status, code, message, fields) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fields = fields ?? null
  }
}

const TOKEN_KEY = 'auth.token'
const CART_KEY = 'cart.id'

export const tokenStore = {
  get: () => storage.get(TOKEN_KEY),
  set: (t) => storage.set(TOKEN_KEY, t),
  clear: () => storage.remove(TOKEN_KEY),
}

export function getCartId() {
  let id = storage.get(CART_KEY)
  if (!id) {
    id = uid('guest_')
    storage.set(CART_KEY, id)
  }
  return id
}

function buildQuery(params) {
  if (!params) return ''
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) continue
    sp.set(k, Array.isArray(v) ? v.join(',') : String(v))
  }
  const s = sp.toString()
  return s ? `?${s}` : ''
}

async function request(method, path, { params, body } = {}) {
  const headers = { 'Content-Type': 'application/json', 'X-Cart-Id': getCartId() }
  const token = tokenStore.get()
  if (token) headers.Authorization = `Bearer ${token}`

  let status
  let json
  if (env.useMock) {
    const { handleMockRequest } = await import('./mock/server')
    const res = await handleMockRequest({ method, path: path + buildQuery(params), body, headers })
    status = res.status
    json = res.body
  } else {
    const res = await fetch(env.apiUrl + path + buildQuery(params), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    status = res.status
    json = status === 204 ? null : await res.json().catch(() => null)
  }

  if (status >= 400) {
    if (status === 401) tokenStore.clear()
    const err = json?.error ?? {}
    throw new ApiError(status, err.code ?? 'INTERNAL', err.message ?? 'Đã có lỗi xảy ra. Vui lòng thử lại.', err.fields)
  }
  return json
}

export const http = {
  get: (path, params) => request('GET', path, { params }),
  post: (path, body) => request('POST', path, { body }),
  patch: (path, body) => request('PATCH', path, { body }),
  delete: (path) => request('DELETE', path),
}
