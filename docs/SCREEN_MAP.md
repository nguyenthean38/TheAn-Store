# Screen map — ảnh thiết kế → route / component

Số `#n` là số trong tên file `adidas web Jun 2025 n.png`.

| Ảnh | Màn hình | Route | File chính |
|---|---|---|---|
| #0, #6, #7–#11, #13–#14 | Trang chủ: hero, tab New Arrivals/Best Sellers, promo cards, popular, related resources, SEO, footer | `/` | `pages/HomePage.jsx` |
| #12 | Mega menu (hover MEN) | (header) | `components/layout/MegaMenu.jsx` |
| #1–#4, #126–#129 | Modal adiClub: nhập email → login / tạo mật khẩu / quên mật khẩu | (modal toàn cục) | `components/auth/AuthModal.jsx` |
| #130–#131 | Tạo mật khẩu mới | `/reset-password?token=` | `pages/ResetPasswordPage.jsx` |
| #5, #71–#73, #80–#88 | Panel adiClub (Just for you / Points shop / Earn points, vouchers) | (drawer toàn cục) | `components/club/ClubDrawer.jsx` |
| #15–#20 | PLP: tiêu đề, tabs, grid, phân trang, SEO, FAQ | `/c/:slug` | `pages/ProductListPage.jsx` |
| #21–#31 | Drawer Filter & Sort (sort, gender, activity, size, color, price) | (drawer trong PLP) | `components/product/FilterSortDrawer.jsx` |
| #68–#70 | Tìm kiếm có / không có kết quả | `/search?q=` | `pages/SearchPage.jsx` |
| #32–#38, #53–#60, #62–#63, #66 | PDP: gallery, info, size, accordion, complete the look, reviews | `/p/:slug` | `pages/ProductDetailPage.jsx` |
| #33, #62 | Lightbox ảnh | (modal) | `components/product/ProductGallery.jsx` |
| #57, #59 | Size guide | (modal) | `components/product/SizeGuideModal.jsx` |
| #64–#65 | Get delivery dates | (modal) | `components/product/DeliveryDatesModal.jsx` |
| #61 | Added to bag | (modal) | `components/product/AddedToBagModal.jsx` |
| #38, #49–#52 | Reviews: tóm tắt, filter, sort, danh sách | (section PDP) | `components/review/*` |
| #39–#47 | Viết đánh giá | `/p/:slug/review` | `pages/WriteReviewPage.jsx` |
| #48 | Cảm ơn đã đánh giá | `/review/thanks` | `pages/ReviewThanksPage.jsx` |
| #112–#113 | Wishlist | `/wishlist` | `pages/WishlistPage.jsx` |
| #114–#118 | Giỏ hàng + promo code | `/cart` | `pages/CartPage.jsx` |
| #119–#124 | Checkout: contact, address, shipping, payment | `/checkout` | `pages/CheckoutPage.jsx` |
| #125 | Cảm ơn / đặt hàng thành công | `/order/:number/confirmation` | `pages/OrderConfirmationPage.jsx` |
| #74, #132 | Account – Feed (vouchers, points) | `/account` | `pages/account/FeedPage.jsx` |
| #75 | Account – Orders | `/account/orders` | `pages/account/OrdersPage.jsx` |
| #89–#91, #97 | Chi tiết đơn hàng (tiến trình, QR, tổng tiền) | `/account/orders/:number` | `pages/account/OrderDetailPage.jsx` |
| #92–#96 | Huỷ đơn: chọn sản phẩm, lý do, xác nhận | `/account/orders/:number/cancel` | `pages/account/CancelOrderPage.jsx` |
| #76, #98–#100 | My details + modal sửa | `/account/details` | `pages/account/DetailsPage.jsx` |
| #77, #101–#103 | Address book + modal thêm địa chỉ | `/account/addresses` | `pages/account/AddressBookPage.jsx` |
| #78, #104–#108 | Preferences (newsletter, categories, interests) | `/account/preferences` | `pages/account/PreferencesPage.jsx` |
| #79, #109–#110 | Size profile | `/account/size-profile` | `pages/account/SizeProfilePage.jsx` |
| #111 | Trang join adiClub | `/adiclub` | `pages/AdiclubPage.jsx` |
