/**
 * Mock server chạy trong trình duyệt. Mỗi route khớp 1:1 với docs/API_CONTRACT.md.
 * Khi có backend thật: đặt VITE_USE_MOCK=false — file này sẽ không được tải nữa.
 */
import { env } from '@/config/env'
import { uid } from '@/utils/storage'
import { db } from './db'
import { products } from './seed/products'
import { categories } from './seed/categories'
import { reviewCountBoost, aiSummaries } from './seed/reviews'

/* ------------------------------------------------------------------ */
/* Router                                                              */
/* ------------------------------------------------------------------ */

const routes = []
function route(method, pattern, handler) {
  const keys = []
  const re = new RegExp('^' + pattern.replace(/:(\w+)/g, (_, k) => (keys.push(k), '([^/]+)')) + '/?$')
  routes.push({ method, re, keys, handler })
}

class MockError extends Error {
  constructor(status, code, message, fields) {
    super(message)
    Object.assign(this, { status, code, fields })
  }
}
const fail = (status, code, message, fields) => {
  throw new MockError(status, code, message, fields)
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const clone = (v) => (v === undefined ? v : structuredClone(v))
const round2 = (n) => Math.round(n * 100) / 100

export async function handleMockRequest({ method, path, params = {}, body, headers = {} }) {
  await sleep(env.mockDelay)
  const [pathname, qs] = path.split('?')
  const query = { ...Object.fromEntries(new URLSearchParams(qs || '')), ...params }
  const token = (headers.Authorization || '').replace('Bearer ', '')
  const user = token.startsWith('mock.') ? db.state.users.find((u) => u.id === token.slice(5)) ?? null : null
  const cartId = headers['X-Cart-Id']
  const owner = user ? `user:${user.id}` : `guest:${cartId}`

  for (const r of routes) {
    if (r.method !== method) continue
    const m = pathname.match(r.re)
    if (!m) continue
    const pathParams = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]))
    try {
      const result = await r.handler({ params: pathParams, query, body: clone(body) ?? {}, user, owner, cartId })
      db.commit()
      if (result === undefined) return { status: 204, body: null }
      return { status: 200, body: clone(result) }
    } catch (e) {
      if (e instanceof MockError) return { status: e.status, body: { error: { code: e.code, message: e.message, fields: e.fields } } }
      console.error('[mock] handler error', e)
      return { status: 500, body: { error: { code: 'INTERNAL', message: e.message } } }
    }
  }
  return { status: 404, body: { error: { code: 'NOT_FOUND', message: `Không có route mock cho ${method} ${pathname}` } } }
}

/* ------------------------------------------------------------------ */
/* Helpers: products                                                   */
/* ------------------------------------------------------------------ */

const byId = (id) => products.find((p) => p.id === id)
const requireAuth = (user) => user ?? fail(401, 'UNAUTHORIZED', 'Vui lòng đăng nhập để tiếp tục.')

function modelReviews(modelId) {
  return db.state.reviews.filter((r) => r.modelId === modelId && !r.pending)
}

function ratingOf(modelId) {
  const list = modelReviews(modelId)
  if (!list.length) return { average: 0, count: 0 }
  const avg = list.reduce((s, r) => s + r.rating, 0) / list.length
  return { average: Math.round(Math.min(5, avg + 0.3) * 10) / 10, count: list.length + (reviewCountBoost[modelId] ?? 0) }
}

function toSummary(p) {
  return {
    id: p.id,
    slug: p.slug,
    modelId: p.modelId,
    name: p.name,
    subtitle: p.subtitle,
    gender: p.gender,
    category: p.category,
    productType: p.productType,
    sport: p.sport,
    collection: p.collection,
    price: p.price,
    originalPrice: p.originalPrice,
    discountPercent: p.discountPercent,
    colorName: p.colorName,
    colorFamily: p.colorFamily,
    colorsCount: products.filter((x) => x.modelId === p.modelId).length,
    image: p.image,
    hoverImage: p.images[1] ?? null,
    badges: p.badges,
    rating: ratingOf(p.modelId),
    primeEligible: p.primeEligible,
    promoExcluded: p.promoExcluded,
  }
}

const GENDER_LABEL = { men: 'Nam', women: 'Nữ', kids: 'Trẻ em', unisex: 'Unisex' }
const CATEGORY_LABEL = { shoes: 'Giày', clothing: 'Quần áo', accessories: 'Phụ kiện' }

function toDetail(p) {
  const g = p.gender === 'unisex' ? 'men' : p.gender
  return {
    ...toSummary(p),
    images: p.images,
    sizes: p.sizes,
    sizeFit: p.sizeFit,
    promoExcluded: p.promoExcluded,
    description: p.description,
    details: p.details,
    colorVariants: products
      .filter((x) => x.modelId === p.modelId)
      .map((x) => ({ id: x.id, slug: x.slug, colorName: x.colorName, image: x.image, available: x.sizes.some((s) => s.inStock) })),
    breadcrumbs: [
      { label: 'Trang chủ', href: '/' },
      { label: GENDER_LABEL[g], href: `/c/${g}` },
      { label: CATEGORY_LABEL[p.category], href: `/c/${g === 'kids' ? 'kids' : `${g}-${p.category}`}` },
    ],
  }
}

function matchGender(p, g) {
  if (!g) return true
  if (g === 'men' || g === 'women') return p.gender === g || p.gender === 'unisex'
  return p.gender === g
}

const csv = (v) => (Array.isArray(v) ? v : String(v ?? '').split(',')).map((s) => s.trim()).filter(Boolean)

function applyBaseFilters(list, f) {
  const q = (f.q || '').trim().toLowerCase()
  return list.filter((p) => {
    if (q) {
      // Gồm cả slugBase (tên tiếng Anh) để tìm "samba", "socks"... vẫn ra kết quả.
      const hay = `${p.name} ${p.slugBase} ${p.subtitle} ${p.colorName} ${p.collection} ${p.productType} ${p.sport}`.toLowerCase()
      if (!q.split(/\s+/).every((w) => hay.includes(w))) return false
    }
    if (!matchGender(p, f.gender)) return false
    if (f.category && p.category !== f.category) return false
    if (f.productType && p.productType !== f.productType) return false
    if (f.sport && !csv(f.sport).includes(p.sport)) return false
    if (f.activity && !csv(f.activity).includes(p.activity)) return false
    if (f.collection && !csv(f.collection).includes(p.collection)) return false
    if (f.badge && !p.badges.includes(f.badge)) return false
    if (String(f.sale) === 'true' && !p.originalPrice) return false
    if (f.subtitleIncludes && !p.subtitle.includes(f.subtitleIncludes)) return false
    return true
  })
}

function applyFacetFilters(list, f) {
  const colors = csv(f.color)
  const sizes = csv(f.size)
  const min = f.minPrice != null && f.minPrice !== '' ? Number(f.minPrice) : null
  const max = f.maxPrice != null && f.maxPrice !== '' ? Number(f.maxPrice) : null
  return list.filter((p) => {
    if (colors.length && !colors.includes(p.colorFamily)) return false
    if (sizes.length && !p.sizes.some((s) => s.inStock && sizes.includes(s.label))) return false
    if (min != null && p.price < min) return false
    if (max != null && p.price > max) return false
    return true
  })
}

const SPORT_LABEL = { running: 'Chạy bộ', lifestyle: 'Phong cách sống', training: 'Tập luyện', soccer: 'Bóng đá', swim: 'Bơi lội', baseball: 'Bóng chày' }
const ACTIVITY_LABEL = { athletic: 'Thể thao', casual: 'Thường ngày' }
const PRODUCT_TYPE_LABEL = { sneakers: 'Giày sneaker', 't-shirts': 'Áo thun', slides: 'Dép', socks: 'Tất', 'track-tops': 'Áo khoác thể thao', dresses: 'Váy' }
const COLOR_LABEL = { black: 'Đen', white: 'Trắng', grey: 'Xám', blue: 'Xanh dương', red: 'Đỏ', green: 'Xanh lá', yellow: 'Vàng', beige: 'Be', brown: 'Nâu', multi: 'Nhiều màu' }
const capitalize = (v) => v.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
const COLOR_HEX = { black: '#000000', white: '#ffffff', grey: '#8c8c8c', blue: '#1f4fd1', red: '#e32b2b', green: '#2a8a4a', yellow: '#f2e10c', beige: '#d8c3a5', brown: '#7b4b2a', multi: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }

function countBy(list, key, labeler = (v) => v) {
  const map = new Map()
  for (const p of list) {
    const v = typeof key === 'function' ? key(p) : p[key]
    for (const one of [].concat(v)) map.set(one, (map.get(one) ?? 0) + 1)
  }
  return [...map.entries()].map(([value, count]) => ({ value, label: labeler(value), count })).sort((a, b) => b.count - a.count)
}

function facetsFor(list) {
  const sizeOrder = (s) => (isNaN(parseFloat(s)) ? 100 + ['XS', 'S', 'M', 'L', 'XL', '2XL'].indexOf(s) : parseFloat(s))
  const prices = list.map((p) => p.price)
  return {
    gender: countBy(list, 'gender', (v) => GENDER_LABEL[v]),
    activity: countBy(list, 'activity', (v) => ACTIVITY_LABEL[v] ?? capitalize(v)),
    productType: countBy(list, 'productType', (v) => PRODUCT_TYPE_LABEL[v] ?? capitalize(v)),
    sport: countBy(list, 'sport', (v) => SPORT_LABEL[v] ?? v),
    collection: countBy(list, 'collection', (v) => v.replace(/^\w/, (c) => c.toUpperCase())),
    color: countBy(list, 'colorFamily', (v) => COLOR_LABEL[v] ?? capitalize(v)).map((c) => ({ ...c, hex: COLOR_HEX[c.value] })),
    size: countBy(list, (p) => p.sizes.filter((s) => s.inStock).map((s) => s.label))
      .sort((a, b) => sizeOrder(a.value) - sizeOrder(b.value)),
    price: { min: prices.length ? Math.min(...prices) : 0, max: prices.length ? Math.max(...prices) : 0 },
  }
}

const SORTERS = {
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  top_sellers: (a, b) => a.salesRank - b.salesRank,
}

function paginate(list, query, defaultSize = 24) {
  const pageSize = Math.max(1, Number(query.pageSize) || defaultSize)
  const total = list.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(Math.max(1, Number(query.page) || 1), totalPages)
  return { items: list.slice((page - 1) * pageSize, page * pageSize), meta: { page, pageSize, total, totalPages } }
}

/* ------------------------------------------------------------------ */
/* Catalog                                                             */
/* ------------------------------------------------------------------ */

route('GET', '/categories/:slug', ({ params }) => {
  const c = categories.find((x) => x.slug === params.slug) ?? fail(404, 'NOT_FOUND', 'Không tìm thấy danh mục')
  return { data: c }
})

route('GET', '/products', ({ query }) => {
  const base = applyBaseFilters(products, query)
  let list = applyFacetFilters(base, query)
  const sorter = SORTERS[query.sort]
  list = sorter ? [...list].sort(sorter) : list
  const { items, meta } = paginate(list, query)
  return { data: items.map(toSummary), meta: { ...meta, facets: facetsFor(base) } }
})

route('GET', '/products/:slug', ({ params }) => {
  const p = products.find((x) => x.slug === params.slug || x.id === params.slug) ?? fail(404, 'NOT_FOUND', 'Không tìm thấy sản phẩm')
  return { data: toDetail(p) }
})

route('GET', '/products/:id/recommendations', ({ params, query }) => {
  const p = byId(params.id) ?? fail(404, 'NOT_FOUND', 'Không tìm thấy sản phẩm')
  const others = products.filter((x) => x.modelId !== p.modelId)
  let list
  if (query.type === 'complete_look') {
    list = others.filter((x) => x.category !== 'shoes' || x.productType === 'slides')
  } else if (query.type === 'top_picks') {
    list = [...others].sort(SORTERS.top_sellers)
  } else {
    list = others.filter((x) => x.category === p.category).sort((a, b) => (b.sport === p.sport) - (a.sport === p.sport))
  }
  const seen = new Set()
  list = list.filter((x) => !seen.has(x.modelId) && seen.add(x.modelId))
  return { data: list.slice(0, Number(query.limit) || 8).map(toSummary) }
})

route('GET', '/search/suggestions', ({ query }) => {
  const q = (query.q || '').trim().toLowerCase()
  if (!q) return { data: { terms: [], products: [] } }
  const found = applyBaseFilters(products, { q })
  // Tên tiếng Việt chứa q, cộng tên của sản phẩm khớp qua slugBase tiếng Anh (vd. "socks" → "tất runxboost (1 đôi)").
  const direct = products.flatMap((p) => [p.name.toLowerCase(), p.collection]).filter((t) => t.includes(q))
  const terms = [...new Set([...direct, ...found.map((p) => p.name.toLowerCase())])].slice(0, 5)
  return { data: { terms, products: found.slice(0, 4).map(toSummary) } }
})

function shippingOptions() {
  const d = (n) => new Date(Date.now() + n * 86400000).toISOString()
  return [
    { id: 'standard', name: 'Giao hàng tiêu chuẩn', description: 'Giao bởi đối tác vận chuyển', price: 0, estimatedDate: d(5), type: 'delivery' },
    { id: 'express', name: 'Giao hàng nhanh', description: 'Nhận hàng sớm hơn', price: 3.99, estimatedDate: d(2), type: 'delivery' },
    { id: 'pickup', name: 'Nhận tại cửa hàng', description: 'Cửa hàng Thean Quận 1, 123 Lê Lợi, TP. Hồ Chí Minh', price: 0, estimatedDate: d(4), type: 'pickup' },
  ]
}

route('GET', '/delivery-estimate', ({ query }) => {
  if (!/^\d{5}(-\d{4})?$/.test(query.zip || '')) fail(422, 'VALIDATION_ERROR', 'Mã ZIP không hợp lệ', { zip: 'Vui lòng nhập mã ZIP hợp lệ' })
  return { data: { zip: query.zip, options: shippingOptions() } }
})

route('GET', '/checkout/shipping-methods', () => ({ data: shippingOptions() }))

/* ------------------------------------------------------------------ */
/* Reviews                                                             */
/* ------------------------------------------------------------------ */

route('GET', '/products/:id/reviews/summary', ({ params }) => {
  const p = byId(params.id) ?? fail(404, 'NOT_FOUND', 'Không tìm thấy sản phẩm')
  const list = modelReviews(p.modelId)
  const { average, count } = ratingOf(p.modelId)
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  list.forEach((r) => distribution[r.rating]++)
  const avgAttr = (k) => (list.length ? round2(list.reduce((s, r) => s + (r.attributes?.[k] ?? 3), 0) / list.length) : 3)
  return {
    data: {
      average,
      count,
      distribution,
      attributes: { comfort: avgAttr('comfort'), quality: avgAttr('quality'), size: avgAttr('size'), width: avgAttr('width') },
      recommendPercent: list.length ? Math.round((list.filter((r) => r.recommend).length / list.length) * 100) : 0,
      aiSummary: aiSummaries[p.modelId] ?? null,
    },
  }
})

route('GET', '/products/:id/reviews', ({ params, query }) => {
  const p = byId(params.id) ?? fail(404, 'NOT_FOUND', 'Không tìm thấy sản phẩm')
  let list = modelReviews(p.modelId)
  const ratings = csv(query.rating).map(Number)
  if (ratings.length) list = list.filter((r) => ratings.includes(r.rating))
  const sorters = {
    newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    helpful: (a, b) => b.helpful.up - a.helpful.up,
    highest: (a, b) => b.rating - a.rating,
    lowest: (a, b) => a.rating - b.rating,
    relevant: (a, b) => b.body.length - a.body.length,
  }
  list = [...list].sort(sorters[query.sort] ?? sorters.newest)
  const { items, meta } = paginate(list, query, 3)
  return { data: items, meta }
})

route('POST', '/products/:id/reviews', ({ params, body }) => {
  const p = byId(params.id) ?? fail(404, 'NOT_FOUND', 'Không tìm thấy sản phẩm')
  const fields = {}
  if (!(body.rating >= 1 && body.rating <= 5)) fields.rating = 'Vui lòng chọn số sao'
  if (typeof body.recommend !== 'boolean') fields.recommend = 'Vui lòng chọn'
  if (!body.body || body.body.length < 10) fields.body = 'Vui lòng viết ít nhất 10 ký tự'
  if (!body.title) fields.title = 'Vui lòng nhập tiêu đề đánh giá'
  if (!body.nickname) fields.nickname = 'Vui lòng nhập biệt danh'
  if (Object.keys(fields).length) fail(422, 'VALIDATION_ERROR', 'Đánh giá không hợp lệ', fields)
  const review = {
    id: uid('rv_'),
    modelId: p.modelId,
    rating: body.rating,
    title: body.title,
    body: body.body,
    nickname: body.nickname,
    recommend: body.recommend,
    verifiedPurchase: false,
    attributes: body.attributes ?? {},
    helpful: { up: 0, down: 0 },
    createdAt: new Date().toISOString(),
    pending: true, // chờ kiểm duyệt
  }
  db.state.reviews.push(review)
  return { data: review }
})

route('POST', '/reviews/:id/helpful', ({ params, body }) => {
  const r = db.state.reviews.find((x) => x.id === params.id) ?? fail(404, 'NOT_FOUND', 'Không tìm thấy đánh giá')
  r.helpful[body.vote === 'down' ? 'down' : 'up']++
  return { data: r.helpful }
})

/* ------------------------------------------------------------------ */
/* Auth & account                                                      */
/* ------------------------------------------------------------------ */

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

function publicUser(u) {
  // eslint-disable-next-line no-unused-vars
  const { password, ...rest } = u
  return rest
}

/** Gộp giỏ hàng + wishlist của khách vào tài khoản khi đăng nhập. */
function mergeGuest(user, cartId) {
  const s = db.state
  const guestKey = `guest:${cartId}`
  const userKey = `user:${user.id}`
  const guestCart = s.carts[guestKey]
  if (guestCart?.items?.length) {
    const target = (s.carts[userKey] ??= { id: uid('cart_'), items: [], promo: null })
    for (const it of guestCart.items) {
      const same = target.items.find((x) => x.productId === it.productId && x.size === it.size)
      if (same) same.quantity = Math.min(10, same.quantity + it.quantity)
      else target.items.push(it)
    }
    delete s.carts[guestKey]
  }
  const gw = s.wishlists[guestKey]
  if (gw?.length) {
    s.wishlists[userKey] = [...new Set([...(s.wishlists[userKey] ?? []), ...gw])]
    delete s.wishlists[guestKey]
  }
}

const session = (u) => ({ data: { accessToken: `mock.${u.id}`, user: publicUser(u) } })

route('POST', '/auth/check-email', ({ body }) => {
  if (!/^\S+@\S+\.\S+$/.test(body.email || '')) fail(422, 'VALIDATION_ERROR', 'Email không hợp lệ', { email: 'Vui lòng nhập địa chỉ email hợp lệ' })
  return { data: { exists: db.state.users.some((u) => u.email.toLowerCase() === body.email.toLowerCase()) } }
})

route('POST', '/auth/register', ({ body, cartId }) => {
  const email = (body.email || '').trim()
  if (db.state.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) fail(409, 'CONFLICT', 'Đã có tài khoản sử dụng email này')
  if (!PASSWORD_RULE.test(body.password || '')) fail(422, 'VALIDATION_ERROR', 'Mật khẩu quá yếu', { password: 'Tối thiểu 8 ký tự, gồm ít nhất một chữ hoa, một chữ thường, một ký tự đặc biệt và một chữ số' })
  const user = {
    id: uid('u_'),
    email,
    password: body.password,
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    gender: null,
    loyalty: { level: 1, points: 0 },
    preferences: { newsletter: Boolean(body.newsletter), productCategories: [], interests: [] },
    sizeProfile: { top: null, shoe: null },
  }
  db.state.users.push(user)
  db.state.vouchers[user.id] = [
    { id: uid('v_'), title: 'Voucher chào mừng -15%', description: 'Cảm ơn bạn đã tham gia Thean Club! Giảm 15% cho đơn hàng tiếp theo.', code: 'WELCOME15', discountPercent: 15, expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(), isNew: true },
  ]
  mergeGuest(user, cartId)
  return session(user)
})

route('POST', '/auth/login', ({ body, cartId }) => {
  const u = db.state.users.find((x) => x.email.toLowerCase() === (body.email || '').toLowerCase())
  if (!u || u.password !== body.password) fail(401, 'INVALID_CREDENTIALS', 'Email hoặc mật khẩu không đúng — vui lòng kiểm tra và thử lại')
  mergeGuest(u, cartId)
  return session(u)
})

route('POST', '/auth/logout', () => undefined)

route('POST', '/auth/forgot-password', ({ body }) => {
  // BE thật: gửi email chứa link. Mock: in link ra console để test.
  const token = btoa(body.email || '')
  console.info(`[mock] Reset password link: ${location.origin}/reset-password?token=${token}`)
  return undefined
})

route('POST', '/auth/reset-password', ({ body }) => {
  let email = ''
  try {
    email = atob(body.token || '')
  } catch {
    fail(422, 'VALIDATION_ERROR', 'Liên kết không hợp lệ hoặc đã hết hạn')
  }
  const u = db.state.users.find((x) => x.email.toLowerCase() === email.toLowerCase()) ?? fail(422, 'VALIDATION_ERROR', 'Liên kết không hợp lệ hoặc đã hết hạn')
  if (!PASSWORD_RULE.test(body.password || '')) fail(422, 'VALIDATION_ERROR', 'Mật khẩu quá yếu', { password: 'Mật khẩu chưa đáp ứng yêu cầu' })
  u.password = body.password
  return session(u)
})

route('GET', '/me', ({ user }) => ({ data: publicUser(requireAuth(user)) }))

route('PATCH', '/me', ({ user, body }) => {
  const u = requireAuth(user)
  for (const k of ['firstName', 'lastName', 'dateOfBirth', 'gender']) if (k in body) u[k] = body[k]
  return { data: publicUser(u) }
})

route('PATCH', '/me/preferences', ({ user, body }) => {
  const u = requireAuth(user)
  u.preferences = { ...u.preferences, ...body }
  return { data: publicUser(u) }
})

route('PATCH', '/me/size-profile', ({ user, body }) => {
  const u = requireAuth(user)
  u.sizeProfile = { ...u.sizeProfile, ...body }
  return { data: publicUser(u) }
})

route('GET', '/me/addresses', ({ user }) => ({ data: db.state.addresses[requireAuth(user).id] ?? [] }))

route('POST', '/me/addresses', ({ user, body }) => {
  const u = requireAuth(user)
  const list = (db.state.addresses[u.id] ??= [])
  if (list.length >= 5) fail(422, 'VALIDATION_ERROR', 'Bạn chỉ có thể lưu tối đa 5 địa chỉ')
  const addr = { ...body, id: uid('addr_'), isDefault: list.length === 0 || Boolean(body.isDefault) }
  if (addr.isDefault) list.forEach((a) => (a.isDefault = false))
  list.push(addr)
  return { data: addr }
})

route('PATCH', '/me/addresses/:id', ({ user, params, body }) => {
  const list = db.state.addresses[requireAuth(user).id] ?? []
  const a = list.find((x) => x.id === params.id) ?? fail(404, 'NOT_FOUND', 'Không tìm thấy địa chỉ')
  if (body.isDefault) list.forEach((x) => (x.isDefault = false))
  Object.assign(a, body, { id: a.id })
  return { data: a }
})

route('DELETE', '/me/addresses/:id', ({ user, params }) => {
  const id = requireAuth(user).id
  const list = db.state.addresses[id] ?? []
  const removed = list.find((x) => x.id === params.id)
  db.state.addresses[id] = list.filter((x) => x.id !== params.id)
  if (removed?.isDefault && db.state.addresses[id][0]) db.state.addresses[id][0].isDefault = true
  return undefined
})

route('GET', '/me/vouchers', ({ user }) => ({ data: db.state.vouchers[requireAuth(user).id] ?? [] }))

/* ------------------------------------------------------------------ */
/* Cart                                                                */
/* ------------------------------------------------------------------ */

const PROMOS = { WELCOME15: { percent: 15, description: 'Giảm 15% cho sản phẩm nguyên giá' } }
const TAX_RATE = 0.12

function getCart(owner) {
  return (db.state.carts[owner] ??= { id: uid('cart_'), items: [], promo: null })
}

function serializeCart(cart, user) {
  const items = cart.items
    .map((it) => {
      const p = byId(it.productId)
      if (!p) return null
      const stock = p.sizes.find((s) => s.label === it.size)
      return { id: it.id, productId: it.productId, size: it.size, quantity: it.quantity, product: toSummary(p), lowStock: stock ? stock.label.length % 2 === 0 : false, lineTotal: round2(p.price * it.quantity) }
    })
    .filter(Boolean)
  const subtotal = round2(items.reduce((s, it) => s + it.lineTotal, 0))
  let discount = 0
  let promo = null
  if (cart.promo && PROMOS[cart.promo]) {
    const eligible = items.filter((it) => !it.product.promoExcluded).reduce((s, it) => s + it.lineTotal, 0)
    discount = round2((eligible * PROMOS[cart.promo].percent) / 100)
    promo = { code: cart.promo, description: PROMOS[cart.promo].description, amount: discount }
  }
  const taxable = Math.max(0, subtotal - discount)
  const tax = round2(taxable * TAX_RATE)
  const delivery = items.length === 0 || user || subtotal >= 50 ? 0 : 5
  return {
    id: cart.id,
    items,
    promo,
    summary: { itemCount: items.reduce((s, it) => s + it.quantity, 0), subtotal, discount, tax, delivery, total: round2(taxable + tax + delivery) },
  }
}

route('GET', '/cart', ({ owner, user }) => ({ data: serializeCart(getCart(owner), user) }))

route('POST', '/cart/items', ({ owner, user, body }) => {
  const p = byId(body.productId) ?? fail(404, 'NOT_FOUND', 'Không tìm thấy sản phẩm')
  const size = p.sizes.find((s) => s.label === String(body.size))
  if (!size) fail(422, 'VALIDATION_ERROR', 'Vui lòng chọn size', { size: 'Vui lòng chọn size của bạn' })
  if (!size.inStock) fail(409, 'OUT_OF_STOCK', 'Size này đã hết hàng')
  const cart = getCart(owner)
  const qty = Math.max(1, Number(body.quantity) || 1)
  const same = cart.items.find((x) => x.productId === p.id && x.size === size.label)
  if (same) same.quantity = Math.min(10, same.quantity + qty)
  else cart.items.push({ id: uid('ci_'), productId: p.id, size: size.label, quantity: qty })
  return { data: serializeCart(cart, user) }
})

route('PATCH', '/cart/items/:itemId', ({ owner, user, params, body }) => {
  const cart = getCart(owner)
  const it = cart.items.find((x) => x.id === params.itemId) ?? fail(404, 'NOT_FOUND', 'Không tìm thấy sản phẩm trong giỏ hàng')
  if (body.quantity != null) it.quantity = Math.min(10, Math.max(1, Number(body.quantity)))
  if (body.size != null) it.size = String(body.size)
  return { data: serializeCart(cart, user) }
})

route('DELETE', '/cart/items/:itemId', ({ owner, user, params }) => {
  const cart = getCart(owner)
  cart.items = cart.items.filter((x) => x.id !== params.itemId)
  return { data: serializeCart(cart, user) }
})

route('POST', '/cart/promo', ({ owner, user, body }) => {
  const code = String(body.code || '').trim().toUpperCase()
  if (!PROMOS[code]) fail(422, 'INVALID_PROMO', 'Rất tiếc, mã giảm giá không hợp lệ hoặc đã hết hạn', { code: 'Mã giảm giá không hợp lệ' })
  const cart = getCart(owner)
  cart.promo = code
  return { data: serializeCart(cart, user) }
})

route('DELETE', '/cart/promo', ({ owner, user }) => {
  const cart = getCart(owner)
  cart.promo = null
  return { data: serializeCart(cart, user) }
})

/* ------------------------------------------------------------------ */
/* Wishlist                                                            */
/* ------------------------------------------------------------------ */

const wishlistOf = (owner) => (db.state.wishlists[owner] ??= [])
const wishlistData = (owner) => ({ data: wishlistOf(owner).map(byId).filter(Boolean).map(toSummary) })

route('GET', '/wishlist', ({ owner }) => wishlistData(owner))
route('POST', '/wishlist', ({ owner, body }) => {
  byId(body.productId) ?? fail(404, 'NOT_FOUND', 'Không tìm thấy sản phẩm')
  const list = wishlistOf(owner)
  if (!list.includes(body.productId)) list.unshift(body.productId)
  return wishlistData(owner)
})
route('DELETE', '/wishlist/:productId', ({ owner, params }) => {
  db.state.wishlists[owner] = wishlistOf(owner).filter((id) => id !== params.productId)
  return wishlistData(owner)
})

/* ------------------------------------------------------------------ */
/* Orders                                                              */
/* ------------------------------------------------------------------ */

function publicOrder(o) {
  // eslint-disable-next-line no-unused-vars
  const { userId, ...rest } = o
  return rest
}

route('POST', '/orders', ({ owner, user, body }) => {
  const cart = serializeCart(getCart(owner), user)
  if (!cart.items.length) fail(422, 'VALIDATION_ERROR', 'Giỏ hàng của bạn đang trống')
  const fields = {}
  if (!/^\S+@\S+\.\S+$/.test(body.email || '')) fields.email = 'Vui lòng nhập email hợp lệ'
  const a = body.shippingAddress || {}
  for (const k of ['firstName', 'lastName', 'street', 'city', 'state', 'zip', 'phone']) if (!a[k]) fields[`shippingAddress.${k}`] = 'Bắt buộc'
  if (!body.payment?.method) fields.payment = 'Vui lòng chọn phương thức thanh toán'
  if (Object.keys(fields).length) fail(422, 'VALIDATION_ERROR', 'Vui lòng kiểm tra lại thông tin của bạn', fields)
  const method = shippingOptions().find((m) => m.id === body.shippingMethodId) ?? shippingOptions()[0]
  const delivery = method.price
  const order = {
    number: 'AS' + String(Math.floor(10000000 + Math.random() * 89999999)),
    userId: user?.id ?? null,
    email: body.email,
    status: 'in_progress',
    placedAt: new Date().toISOString(),
    expectedDelivery: method.estimatedDate,
    cancellableUntil: new Date(Date.now() + 15 * 60000).toISOString(),
    items: cart.items.map((it) => ({ id: uid('oi_'), productId: it.productId, name: it.product.name, size: it.size, quantity: it.quantity, price: it.product.price, colorName: it.product.colorName, image: it.product.image, cancelled: false })),
    shippingAddress: { ...a, country: a.country || 'US' },
    shippingMethod: { id: method.id, name: method.name, price: method.price },
    payment: body.payment.method === 'card' ? { method: 'card', brand: body.payment.brand || 'visa', last4: body.payment.last4 || '4242' } : { method: body.payment.method },
    totals: { subtotal: cart.summary.subtotal, discount: cart.summary.discount, tax: cart.summary.tax, delivery, total: round2(cart.summary.total - cart.summary.delivery + delivery) },
  }
  db.state.orders.unshift(order)
  db.state.carts[owner] = { id: uid('cart_'), items: [], promo: null }
  if (user) user.loyalty.points += Math.floor(order.totals.total)
  return { data: publicOrder(order) }
})

route('GET', '/orders', ({ user, query }) => {
  const u = requireAuth(user)
  const { items, meta } = paginate(db.state.orders.filter((o) => o.userId === u.id), query, 10)
  return { data: items.map(publicOrder), meta }
})

route('GET', '/orders/:number', ({ params, user }) => {
  const o = db.state.orders.find((x) => x.number === params.number) ?? fail(404, 'NOT_FOUND', 'Không tìm thấy đơn hàng')
  if (o.userId && (!user || user.id !== o.userId)) fail(403, 'FORBIDDEN', 'Đơn hàng này thuộc về tài khoản khác')
  return { data: publicOrder(o) }
})

const CANCEL_REASONS = ['wrong_size', 'wrong_quantity', 'wrong_colour', 'forgot_voucher', 'changed_mind']

route('POST', '/orders/:number/cancel', ({ params, user, body }) => {
  const o = db.state.orders.find((x) => x.number === params.number) ?? fail(404, 'NOT_FOUND', 'Không tìm thấy đơn hàng')
  if (o.userId && (!user || user.id !== o.userId)) fail(403, 'FORBIDDEN', 'Bạn không có quyền thực hiện thao tác này')
  if (o.status !== 'in_progress' || new Date(o.cancellableUntil) < new Date()) fail(422, 'VALIDATION_ERROR', 'Đơn hàng này không thể hủy được nữa')
  if (!CANCEL_REASONS.includes(body.reason)) fail(422, 'VALIDATION_ERROR', 'Vui lòng chọn lý do', { reason: 'Vui lòng chọn lý do' })
  const ids = body.itemIds ?? []
  if (!ids.length) fail(422, 'VALIDATION_ERROR', 'Vui lòng chọn ít nhất một sản phẩm', { itemIds: 'Chọn một sản phẩm' })
  o.items.forEach((it) => ids.includes(it.id) && (it.cancelled = true))
  o.cancelReason = body.reason
  if (o.items.every((it) => it.cancelled)) {
    o.status = 'cancelled'
    o.cancelledAt = new Date().toISOString()
  }
  return { data: publicOrder(o) }
})
