/**
 * "Database" của mock server: dữ liệu có thể thay đổi (users, carts, orders...) được lưu localStorage.
 * Dữ liệu tĩnh (products, categories) import thẳng từ seed.
 * Xoá key `mockdb.v2` trong localStorage để reset dữ liệu demo.
 */
import { storage } from '@/utils/storage'
import { reviews as seedReviews } from './seed/reviews'

const KEY = 'mockdb.v2' // v2: dữ liệu tiếng Việt (bỏ dữ liệu tiếng Anh cũ của v1)
const HOUR = 3600000
const DAY = 24 * HOUR

export const DEMO_USER = { email: 'alex@example.com', password: 'Password1!' }

function seed() {
  const now = Date.now()
  const address = {
    id: 'addr_1',
    firstName: 'Alex',
    lastName: 'Smith',
    street: '1226 University Dr',
    city: 'Menlo Park',
    state: 'CA',
    zip: '94025',
    country: 'US',
    phone: '+16502137552',
    isDefault: true,
  }
  return {
    users: [
      {
        id: 'u_1',
        email: DEMO_USER.email,
        password: DEMO_USER.password, // chỉ mock! BE thật phải hash (bcrypt/argon2)
        firstName: 'Alex',
        lastName: 'Smith',
        dateOfBirth: '1995-02-18',
        gender: null,
        loyalty: { level: 1, points: 50 },
        preferences: { newsletter: true, productCategories: [], interests: [] },
        sizeProfile: { top: null, shoe: null },
      },
    ],
    addresses: { u_1: [address] },
    carts: {},
    wishlists: {},
    reviews: seedReviews,
    orders: [
      {
        number: 'AS09018514',
        userId: 'u_1',
        email: DEMO_USER.email,
        status: 'in_progress',
        placedAt: new Date(now - 2 * HOUR).toISOString(),
        expectedDelivery: new Date(now + 5 * DAY).toISOString(),
        cancellableUntil: new Date(now + 7 * DAY).toISOString(), // demo: nới rộng để thử luồng huỷ
        items: [
          { id: 'oi_1', productId: 'JD6566', name: 'Tất RUNxBOOST (1 đôi)', size: 'M', quantity: 1, price: 15, colorName: 'Trắng / Xanh mòng két', image: { url: '/images/products/runxboost-socks.jpg', alt: 'Tất RUNxBOOST (1 đôi) — Trắng / Xanh mòng két' }, cancelled: false },
        ],
        shippingAddress: address,
        shippingMethod: { id: 'standard', name: 'Giao hàng tiêu chuẩn', price: 0 },
        payment: { method: 'card', brand: 'visa', last4: '0561' },
        totals: { subtotal: 15, discount: 0, tax: 1.8, delivery: 0, total: 16.8 },
      },
      {
        number: 'AS08770231',
        userId: 'u_1',
        email: DEMO_USER.email,
        status: 'delivered',
        placedAt: new Date(now - 40 * DAY).toISOString(),
        expectedDelivery: new Date(now - 35 * DAY).toISOString(),
        items: [
          { id: 'oi_2', productId: 'B75806', name: 'Giày Samba OG', size: '9', quantity: 1, price: 100, colorName: 'Trắng / Đen / Xám granite', image: { url: '/images/products/samba-og-white.jpg', alt: 'Giày Samba OG — Trắng / Đen / Xám granite' }, cancelled: false },
        ],
        shippingAddress: address,
        shippingMethod: { id: 'standard', name: 'Giao hàng tiêu chuẩn', price: 0 },
        payment: { method: 'paypal' },
        totals: { subtotal: 100, discount: 0, tax: 12, delivery: 0, total: 112 },
      },
    ],
    vouchers: {
      u_1: [
        { id: 'v_1', title: 'Voucher Thean Club -15%', description: 'Giảm 15% cho đơn hàng nguyên giá tiếp theo của bạn.', code: 'WELCOME15', discountPercent: 15, expiresAt: new Date(now + 20 * DAY).toISOString(), isNew: true },
      ],
    },
  }
}

let state = storage.get(KEY) ?? seed()

export const db = {
  get state() {
    return state
  },
  /** Gọi sau mỗi thay đổi để lưu lại. */
  commit() {
    storage.set(KEY, state)
  },
  reset() {
    state = seed()
    storage.set(KEY, state)
  },
}
