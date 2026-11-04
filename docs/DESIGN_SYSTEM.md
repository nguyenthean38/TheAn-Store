# Design System — adidas-store

Tài liệu này được lập **trước khi viết code**, dựa trên 133 ảnh trong `adidas web Jun 2025/`.
Mọi giá trị ở đây đều được hiện thực hoá trong `frontend/src/styles/index.css` (block `@theme`)
và trong các component ở `frontend/src/components/ui/`. Khi đổi một token, chỉ cần sửa ở `@theme`.

---

## 1. Nguyên tắc thiết kế (rút ra từ ảnh)

| Nguyên tắc | Biểu hiện trong ảnh |
|---|---|
| **Đen – trắng là chủ đạo** | Nút chính đen, chữ đen, nền trắng; màu chỉ dùng cho trạng thái (sale đỏ, badge xanh, success xanh lá). |
| **Góc vuông** | Không có border-radius ở nút, input, card, modal (radius = 0). Ngoại lệ: badge đếm số tròn. |
| **Chữ IN HOA + giãn chữ** | Nav, nút, tiêu đề section dùng uppercase + `letter-spacing` 1.5–2px. |
| **Nút có "bóng viền lệch"** | Nút primary: nền đen + một khung viền 1px lệch xuống-phải 3px (đặc trưng adidas). Hover: chữ chuyển xám. |
| **Ảnh sản phẩm trên nền xám lạnh** | Mọi ảnh packshot có nền `#eaeff0`, tỉ lệ 1:1. |
| **Mật độ thông tin cao, khoảng trắng rộng** | Grid 4 cột ở desktop, gap nhỏ (1–2px giữa card), padding trang lớn. |

---

## 2. Design tokens

### 2.1 Màu sắc

| Token (Tailwind) | Hex | Dùng cho |
|---|---|---|
| `black` / `ink` | `#000000` | Chữ chính, nút primary, thanh announcement |
| `white` | `#ffffff` | Nền trang, chữ trên nền đen |
| `gray-50` → `surface` | `#f7f7f7` | Nền trang tài khoản / checkout |
| `gray-100` → `image` | `#eaeff0` | Nền ảnh sản phẩm, ô size, tile category |
| `gray-150` → `field` | `#ebedee` | Ô search header, strip khuyến mãi |
| `gray-200` → `line` | `#e7e7e7` | Đường kẻ, viền card |
| `gray-400` → `muted` | `#767677` | Chữ phụ (subtitle, "4 colors") |
| `gray-600` | `#4d4d4d` | Chữ phụ đậm hơn, hover nút |
| `sale` | `#e32b2b` | Giá sale, % giảm, lỗi form |
| `info` | `#0071ae` | Badge đếm (wishlist/bag), voucher, link thông tin |
| `success` | `#008a3e` | Dấu tick input hợp lệ, "order being processed" |
| `warning` | `#ede734` | Badge adiClub (vàng), banner giveaway |
| `club` | `#1c4f9c` | Viền logo adiClub |

### 2.2 Typography

Giao diện tiếng Việt nên dùng font thiết kế tốt cho dấu tiếng Việt (dấu rõ, không dính chữ khi viết hoa):

| Vai trò | Font | Token | Ví dụ |
|---|---|---|---|
| Body / UI / Heading | **Be Vietnam Pro** 400/500/600/700/800 | `font-sans`, `font-display` | mô tả, giá, form, "GIÀY SNEAKER NAM" |
| Condensed (banner/section) | **Roboto Condensed** 700 | `font-condensed` | "ADIZERO EVO SL", "GỢI Ý DÀNH CHO BẠN" |

Thang chữ (utility trong `index.css`):

| Class | Size / line-height | Font | Dùng cho |
|---|---|---|---|
| `ds-h1` | 40px / 1.2 (mobile 28px) | display 800, uppercase | Tiêu đề trang |
| `ds-h2` | 28px / 1.25 | display 800, uppercase | Tiêu đề khối |
| `ds-h3` | 20px / 1.3 | display 700, uppercase | Tóm tắt đơn hàng, tiêu đề modal |
| `ds-h-condensed` | 40px / 1.15 | condensed, uppercase | Tiêu đề carousel |
| `ds-label` | 13px / 1.35, 600, giãn 0.06em, uppercase | sans | Nút, nav, accordion |
| `ds-body` | 16px / 1.625 | sans | Đoạn văn |
| `ds-small` | 14px / 1.5 | sans | Chú thích, meta |
| `ds-caption` | 12px / 1.5 | sans | Pháp lý, footnote |

Quy tắc cho tiếng Việt:
- **Không giãn chữ quá 0.08em** khi viết hoa (giãn rộng làm chữ có dấu trông rời rạc).
- **Không dùng `leading-none`** cho chữ có thể chứa dấu — tối thiểu 1.15 cho tiêu đề, 1.35 cho nhãn, để dấu trên (Ố, Ể) và dấu dưới (Ạ, Ậ) không bị cắt khi có `overflow: hidden`/`truncate`.
- Cỡ chữ nội dung phổ biến: 15px (card, nav) và 14px (meta).

### 2.3 Spacing, layout, breakpoints

- Thang spacing: dùng mặc định Tailwind (4px). Các khoảng hay gặp: 4, 8, 12, 16, 24, 32, 40, 64.
- Container:
  - `.container-page` — max 1600px, padding 16px (mobile) / 48px (desktop): header, home.
  - `.container-content` — max 1520px: PLP, PDP info, cart, account.
- Breakpoints (Tailwind mặc định): `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.
- Grid sản phẩm: 2 cột (mobile) → 3 cột (md) → 4 cột (lg).
- Header cao 102px desktop (utility 40px + nav 62px), announcement bar 50px.

### 2.4 Khác

| Token | Giá trị |
|---|---|
| Radius | `0` toàn bộ (trừ badge tròn `rounded-full`) |
| Shadow | Không dùng đổ bóng mờ; chỉ dùng "offset outline" cho nút primary |
| Overlay | `rgba(0,0,0,.5)` cho modal / drawer |
| Z-index | header 30, drawer 40, modal 50, toast 60 |
| Motion | 150–300ms `ease-out`; drawer trượt từ phải; modal fade |

---

## 3. Thư viện component (`src/components/ui`)

Mỗi component nhận `className` để mở rộng, và có props ổn định để backend/QA dễ hiểu.

| Component | Variants / props chính | Nơi xuất hiện trong ảnh |
|---|---|---|
| `Button` | `variant: primary \| secondary \| outline \| ghost \| link`, `size: sm \| md \| lg`, `arrow`, `fullWidth`, `loading` | CONTINUE, ADD TO BAG, CHECKOUT, SHOP NOW |
| `IconButton` | `label` (aria), `badge` (số) | heart, bag, account, close |
| `Input` | `label` (floating), `error`, `valid` (tick xanh), `hint`, `type=password` có nút SHOW | form auth, address, checkout |
| `Select` | native select style adidas | số lượng trong bag, state, lý do huỷ |
| `Checkbox`, `Radio` | vuông đen | keep me logged in, gender, recommend |
| `Modal` | `size: sm \| md \| lg`, nút close vuông góc ngoài | adiClub login, size guide, added to bag |
| `Drawer` | `side: right`, `title`, `footer` | Filter & Sort, adiClub panel |
| `Accordion` | single/multi, header uppercase | Reviews/Description/Details, filter group |
| `Tabs` | `variant: underline \| boxed` | New Arrivals/Best Sellers (boxed), Feed/Orders/Account (underline) |
| `Badge` | `tone: info \| sale \| neutral`, `count` | bag count, "NEW", "1 NEW VOUCHER" |
| `Rating` | `value`, `count`, `interactive` | sao đánh giá |
| `Price` | `price`, `originalPrice`, `layout` | card & PDP |
| `Breadcrumbs` | `items`, `backTo` | PLP, PDP |
| `SizeGrid` | `sizes[{label,inStock}]`, `value`, `onChange`, `columns` | PDP, filter |
| `ColorSwatches` | ảnh thumbnail / chấm màu | PDP colors, filter color |
| `QuantitySelect` | 1–10 | bag |
| `Spinner`, `Skeleton` | — | loading |
| `EmptyState` | `title`, `description`, `action` | no results, empty bag |
| `Toast` | `success \| error \| info` | thông báo nhanh |
| `Pagination` | `page`, `totalPages` | PLP "Page 1 of 21  NEXT" |

### Component nghiệp vụ (`src/components/*`)

- **layout/**: `AnnouncementBar`, `Header`, `MegaMenu`, `SearchBox`, `PromoStrip`, `Footer`, `MainLayout`, `CheckoutLayout`.
- **product/**: `ProductCard`, `ProductCarousel`, `ProductGrid`, `ProductGallery`, `FilterSortDrawer`, `SizeGuideModal`, `AddedToBagModal`, `DeliveryDatesModal`.
- **review/**: `ReviewSummary`, `ReviewList`, `StarInput`, `ScaleInput`.
- **auth/**: `AuthModal` (email → login | đăng ký → quên mật khẩu).
- **account/**: `AccountHeader`, `AccountSidebar`, `EditDetailsModal`, `AddressFormModal`.
- **home/**: `HeroBanner`, `PromoCards`, `CategoryTiles`, `PopularSearches`, `RelatedResources`, `SeoBlock`.

---

## 4. Trạng thái tương tác chuẩn

| Trạng thái | Quy tắc |
|---|---|
| Hover link | gạch chân → bỏ gạch chân (hoặc ngược lại); nút đen → chữ xám `gray-400` |
| Focus | `outline 2px black, offset 2px` (accessibility, không bỏ outline) |
| Disabled | nền `gray-200`, chữ `gray-400`, cursor not-allowed |
| Hết size | chữ gạch ngang + icon chuông (notify me) |
| Input hợp lệ | viền dưới xanh `success` + icon tick |
| Input lỗi | viền `sale` + message đỏ dưới input |
| Loading | nút giữ kích thước, hiện spinner thay mũi tên |

---

## 5. Quy ước giúp backend tích hợp dễ

1. **Mọi gọi API đi qua `src/api/http.js`** — một chỗ duy nhất gắn `Authorization`, base URL, xử lý lỗi.
2. **`VITE_USE_MOCK=true`** → request được chuyển tới mock server trong trình duyệt (`src/api/mock`),
   dữ liệu lưu `localStorage`. Backend xong chỉ cần đặt `VITE_USE_MOCK=false` và `VITE_API_URL`.
3. **Services theo domain** (`src/api/services/*.js`) — mỗi hàm map 1:1 với 1 endpoint trong `docs/API_CONTRACT.md`.
4. **React Query hooks** (`src/hooks/*`) là nơi duy nhất UI lấy dữ liệu server → cache, loading, error thống nhất.
5. **Định dạng response** thống nhất: `{ data, meta? }`, lỗi `{ error: { code, message, fields? } }`.
6. **Tiền tệ** trả về dạng số (USD, 2 chữ số thập phân), FE format bằng `formatPrice()`.
7. **ID & slug**: sản phẩm có `id` (mã article, VD `JP7149`) và `slug` cho URL.
