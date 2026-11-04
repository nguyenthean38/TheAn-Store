# API Contract — adidas-store (v1)

Frontend đang chạy với mock server (`frontend/src/api/mock`) hiện thực **đúng** hợp đồng dưới đây.
Backend chỉ cần làm theo tài liệu này rồi đặt `VITE_USE_MOCK=false`, `VITE_API_URL=https://.../api/v1`.

## 0. Quy ước chung

- Base URL: `/api/v1`. JSON, UTF-8. Thời gian ISO-8601 (UTC). Tiền: số thực USD (`150.0`).
- Xác thực: `Authorization: Bearer <accessToken>`. Endpoint có 🔒 bắt buộc đăng nhập.
- Giỏ hàng khách (chưa đăng nhập): header `X-Cart-Id: <uuid>` (FE tự sinh và lưu). Khi login, BE gộp giỏ khách vào giỏ user.
- Response thành công: `{ "data": ..., "meta": { ... } }` (`meta` chỉ có ở danh sách).
- Response lỗi (HTTP 4xx/5xx):
  ```json
  { "error": { "code": "VALIDATION_ERROR", "message": "Invalid input", "fields": { "email": "Invalid email" } } }
  ```
  Mã lỗi dùng: `VALIDATION_ERROR` 422, `UNAUTHORIZED` 401, `FORBIDDEN` 403, `NOT_FOUND` 404,
  `CONFLICT` 409 (email đã tồn tại), `OUT_OF_STOCK` 409, `INVALID_PROMO` 422, `INTERNAL` 500.
- Phân trang: query `page` (bắt đầu 1), `pageSize` (mặc định 24). `meta = { page, pageSize, total, totalPages }`.

---

## 1. Data models

```ts
type Gender = 'men' | 'women' | 'kids' | 'unisex'

interface Image { url: string; alt: string }

interface Size { label: string; inStock: boolean }

interface ProductSummary {           // dùng trong grid / carousel
  id: string                         // mã article, VD "JP7149"
  slug: string                       // "adizero-evo-sl-shoes-jp7149"
  modelId: string                    // nhóm các colorway của cùng 1 mẫu
  name: string                       // "Adizero EVO SL Shoes"
  subtitle: string                   // "Men's Running"
  gender: Gender
  category: 'shoes' | 'clothing' | 'accessories'
  productType: string                // "sneakers" | "running" | "socks" | ...
  sport?: string                     // "running" | "soccer" | "training" | ...
  collection?: string                // "originals" | "adizero" | "ultraboost" ...
  price: number
  originalPrice?: number | null      // có => đang sale
  discountPercent?: number | null
  colorName: string                  // "Cloud White / Royal Blue / Pure Ruby"
  colorFamily: string                // "white" | "black" | "blue" | ... (để filter)
  colorsCount: number                // số colorway cùng modelId
  image: Image
  badges: Array<'new' | 'best_seller' | 'online_only'>
  rating: { average: number; count: number }
  primeEligible: boolean
}

interface ProductDetail extends ProductSummary {
  images: Image[]
  sizes: Size[]
  sizeFit?: string                   // "True to size. We recommend ordering your usual size."
  promoExcluded: boolean             // "Promo codes will not apply to this product."
  description: { title: string; body: string }
  details: string[]                  // bullet list
  colorVariants: Array<{ id: string; slug: string; colorName: string; image: Image; available: boolean }>
  breadcrumbs: Array<{ label: string; href: string }>
}

interface Category {
  slug: string                       // "men-sneakers"
  title: string                      // "MEN'S SNEAKERS"
  description: string
  breadcrumbs: Array<{ label: string; href: string }>
  tabs: Array<{ label: string; slug: string }>      // thanh sub-category
  filters: Record<string, string>    // filter mặc định, VD { gender: 'men', productType: 'sneakers' }
  seo?: { title: string; body: string }
  faq?: Array<{ question: string; answer: string }>
}

interface Facets {                    // trả kèm danh sách sản phẩm để dựng Filter & Sort
  gender: FacetValue[]; productType: FacetValue[]; sport: FacetValue[]
  size: FacetValue[]; color: FacetValue[]; collection: FacetValue[]
  price: { min: number; max: number }
}
interface FacetValue { value: string; label: string; count: number }

interface Review {
  id: string; productId: string
  rating: number                     // 1..5
  title: string; body: string
  nickname: string
  recommend: boolean
  verifiedPurchase: boolean
  attributes?: { size?: number; width?: number; comfort?: number; quality?: number } // size/width: 1..5 (3 = perfect)
  helpful: { up: number; down: number }
  photos?: Image[]
  createdAt: string
}
interface ReviewSummary {
  average: number; count: number
  distribution: Record<'1'|'2'|'3'|'4'|'5', number>
  attributes: { comfort: number; quality: number; size: number; width: number } // trung bình
  recommendPercent: number
  aiSummary?: string[]               // "What the reviews say"
}

interface CartItem {
  id: string                         // line id
  productId: string; size: string; quantity: number
  product: ProductSummary            // snapshot để hiển thị
  lowStock: boolean
  lineTotal: number
}
interface Cart {
  id: string
  items: CartItem[]
  promo?: { code: string; description: string; amount: number } | null
  summary: { itemCount: number; subtotal: number; discount: number; tax: number; delivery: number; total: number }
}

interface User {
  id: string; email: string
  firstName: string; lastName: string
  dateOfBirth?: string | null        // "1995-02-18"
  gender?: 'male' | 'female' | 'other' | null
  loyalty: { level: number; points: number }
  preferences: { newsletter: boolean; productCategories: string[]; interests: string[] }
  sizeProfile: { headwear?: string | null; top?: string | null; bra?: string | null; bottom?: string | null; shoe?: string | null }
}

interface Address {
  id: string; firstName: string; lastName: string
  street: string; city: string; state: string; zip: string; country: string
  phone: string; isDefault: boolean
}

type OrderStatus = 'in_progress' | 'on_its_way' | 'delivered' | 'cancelled'
interface Order {
  number: string                     // "AS09018514"
  status: OrderStatus
  placedAt: string; expectedDelivery?: string; cancelledAt?: string
  cancellableUntil?: string          // ISO; FE hiển thị nút Cancel nếu còn hạn
  email: string
  items: Array<{ id: string; productId: string; name: string; size: string; quantity: number; price: number; colorName: string; image: Image; cancelled: boolean }>
  shippingAddress: Address
  shippingMethod: { id: string; name: string; price: number }
  payment: { method: 'card' | 'paypal'; brand?: string; last4?: string }
  totals: { subtotal: number; discount: number; tax: number; delivery: number; total: number }
}

interface ShippingMethod { id: string; name: string; description: string; price: number; estimatedDate: string; type: 'delivery' | 'pickup' }

interface Voucher { id: string; title: string; description: string; code: string; discountPercent: number; expiresAt: string; isNew: boolean }
```

---

## 2. Endpoints

### 2.1 Auth

| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/auth/check-email` | `{ email }` | `{ data: { exists: boolean } }` — quyết định bước Login hay Create password |
| POST | `/auth/register` | `{ email, password, keepLoggedIn, newsletter }` | `{ data: { accessToken, user } }` |
| POST | `/auth/login` | `{ email, password, keepLoggedIn }` | `{ data: { accessToken, user } }` · 401 `INVALID_CREDENTIALS` |
| POST | `/auth/logout` 🔒 | — | `204` |
| POST | `/auth/forgot-password` | `{ email }` | `204` (luôn 204 để không lộ email) |
| POST | `/auth/reset-password` | `{ token, password }` | `{ data: { accessToken, user } }` |

Quy tắc mật khẩu: ≥ 8 ký tự, ít nhất 1 chữ hoa, 1 chữ thường, 1 ký tự đặc biệt và 1 số.

### 2.2 Tài khoản 🔒

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/me` | — | `User` |
| PATCH | `/me` | `{ firstName?, lastName?, dateOfBirth?, gender? }` | `User` |
| PATCH | `/me/preferences` | `{ newsletter?, productCategories?, interests? }` | `User` |
| PATCH | `/me/size-profile` | `{ headwear?, top?, bra?, bottom?, shoe? }` | `User` |
| GET | `/me/addresses` | — | `Address[]` (tối đa 5) |
| POST | `/me/addresses` | `Address` (không id) | `Address` |
| PATCH | `/me/addresses/:id` | partial | `Address` |
| DELETE | `/me/addresses/:id` | — | `204` |
| GET | `/me/vouchers` | — | `Voucher[]` |

### 2.3 Catalog

| Method | Path | Query | Response |
|---|---|---|---|
| GET | `/categories/:slug` | — | `Category` |
| GET | `/products` | `q, gender, category, productType, sport, collection, color (csv), size (csv), minPrice, maxPrice, sale (bool), badge, sort, page, pageSize` | `{ data: ProductSummary[], meta: { ...paging, facets: Facets } }` |
| GET | `/products/:slug` | — | `ProductDetail` |
| GET | `/products/:id/recommendations` | `type = similar \| complete_look \| top_picks` | `ProductSummary[]` |
| GET | `/search/suggestions` | `q` | `{ terms: string[], products: ProductSummary[] }` |
| GET | `/delivery-estimate` | `zip, productId` | `{ zip, options: ShippingMethod[] }` |

`sort`: `relevance` (mặc định) · `price_asc` · `price_desc` · `newest` · `top_sellers`.

### 2.4 Reviews

| Method | Path | Query/Body | Response |
|---|---|---|---|
| GET | `/products/:id/reviews/summary` | — | `ReviewSummary` |
| GET | `/products/:id/reviews` | `rating (csv), sort = newest\|relevant\|helpful\|highest\|lowest, page` | `{ data: Review[], meta }` |
| POST | `/products/:id/reviews` | `{ rating, recommend, title, body, attributes, nickname, photo? }` | `Review` (trạng thái chờ duyệt) |
| POST | `/reviews/:id/helpful` | `{ vote: 'up' \| 'down' }` | `{ up, down }` |

### 2.5 Giỏ hàng (`X-Cart-Id` hoặc Bearer)

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/cart` | — | `Cart` |
| POST | `/cart/items` | `{ productId, size, quantity }` | `Cart` · 409 `OUT_OF_STOCK` |
| PATCH | `/cart/items/:itemId` | `{ quantity?, size? }` | `Cart` |
| DELETE | `/cart/items/:itemId` | — | `Cart` |
| POST | `/cart/promo` | `{ code }` | `Cart` · 422 `INVALID_PROMO` |
| DELETE | `/cart/promo` | — | `Cart` |

Mã khuyến mãi demo trong mock: `WELCOME15` (−15%, sản phẩm không bị `promoExcluded`).
Thuế demo: 12% subtotal sau giảm. Phí giao: miễn phí khi là thành viên hoặc subtotal ≥ $50, ngược lại $5.

### 2.6 Wishlist (khách: theo `X-Cart-Id`; đã login: theo user — gộp khi đăng nhập)

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/wishlist` | — | `ProductSummary[]` |
| POST | `/wishlist` | `{ productId }` | `ProductSummary[]` |
| DELETE | `/wishlist/:productId` | — | `ProductSummary[]` |

### 2.7 Checkout & Orders

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/checkout/shipping-methods` | query `zip` | `ShippingMethod[]` |
| POST | `/orders` | `{ email, shippingAddress, billingSameAsShipping, billingAddress?, shippingMethodId, payment: { method, cardToken? , saveCard } }` | `Order` (giỏ được làm trống) |
| GET | `/orders` 🔒 | `page` | `{ data: Order[], meta }` |
| GET | `/orders/:number` | (khách cần `?email=`) | `Order` |
| POST | `/orders/:number/cancel` | `{ itemIds: string[], reason }` | `Order` |

Lý do huỷ hợp lệ: `wrong_size`, `wrong_quantity`, `wrong_colour`, `forgot_voucher`, `changed_mind`.
FE **không bao giờ** gửi số thẻ thô — chỉ gửi `cardToken` từ cổng thanh toán (mock tự sinh).

### 2.8 Nội dung (CMS) — tuỳ chọn

Hiện FE giữ nội dung tĩnh trong `src/config/*.js` (mega menu, footer, banner trang chủ).
Nếu muốn quản trị động, BE có thể cung cấp: `GET /content/home`, `GET /content/navigation`, `GET /content/footer`
với đúng cấu trúc của các file config tương ứng.
