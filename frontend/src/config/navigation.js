/**
 * Mega menu + footer. Cấu trúc này có thể được BE trả về qua GET /content/navigation sau này.
 * Mọi `href` dạng `/c/<slug>` khớp với categories trong mock (src/api/mock/seed/categories.js).
 */
import { brand } from '@/config/brand'

export const mainNav = [
  {
    label: 'Nam',
    href: '/c/men',
    bold: true,
    columns: [
      { title: 'Mới & Nổi bật', href: '/c/new-arrivals', links: [['Hàng mới về', '/c/new-arrivals'], ['Bán chạy', '/c/best-sellers'], ['Áo thun in họa tiết', '/c/men-clothing'], ['Superstar mới', '/c/originals'], ['Họa tiết hoa Liberty London', '/search?q=liberty']], promo: { label: 'Giảm đến 40%', href: '/c/sale' } },
      { title: 'Giày', href: '/c/men-shoes', links: [['Chạy bộ', '/c/men-running-shoes'], ['Giày sneaker', '/c/men-sneakers'], ['Dép & Sandal', '/c/men-slides'], ['Tập luyện & Gym', '/c/men-training-shoes'], ['Giày từ $100 trở xuống', '/c/men-shoes-under-100']], footer: ['Tất cả giày nam', '/c/men-shoes'] },
      { title: 'Quần áo', href: '/c/men-clothing', links: [['Áo thun & Áo', '/c/men-clothing'], ['Bộ đồ thể thao', '/c/men-clothing'], ['Áo đấu', '/c/men-clothing'], ['Áo hoodie & Áo nỉ', '/c/men-clothing'], ['Quần dài', '/c/men-clothing']], footer: ['Tất cả quần áo nam', '/c/men-clothing'] },
      { title: 'Phụ kiện', href: '/c/accessories', links: [['Túi & Ba lô', '/c/accessories'], ['Tất', '/c/accessories'], ['Mũ', '/c/accessories'], ['Bình nước', '/c/accessories']], footer: ['Tất cả phụ kiện nam', '/c/accessories'] },
      { title: 'Mua theo môn thể thao', href: '/c/running', links: [['Chạy bộ', '/c/running'], ['Bóng đá', '/search?q=soccer'], ['Bóng rổ', '/search?q=basketball'], ['Tập luyện', '/c/men-training-shoes'], ['Golf', '/search?q=golf'], ['Tennis', '/search?q=tennis']], footer: ['Tất cả đồ thể thao nam', '/c/running'] },
      { title: 'Mua theo bộ sưu tập', href: '/c/originals', links: [['Adizero', '/search?q=adizero'], ['Samba', '/search?q=samba'], ['Gazelle', '/search?q=gazelle'], ['Ultraboost', '/search?q=ultraboost'], ['Superstar', '/c/originals'], ['Adilette', '/search?q=adilette']], footer: ['Tất cả đồ nam', '/c/men'] },
    ],
  },
  {
    label: 'Nữ',
    href: '/c/women',
    bold: true,
    columns: [
      { title: 'Mới & Nổi bật', href: '/c/new-arrivals', links: [['Hàng mới về', '/c/new-arrivals'], ['Bán chạy', '/c/best-sellers'], ['Họa tiết hoa Liberty London', '/search?q=liberty']], promo: { label: 'Giảm đến 40%', href: '/c/sale' } },
      { title: 'Giày', href: '/c/women-shoes', links: [['Giày sneaker', '/c/women-shoes'], ['Chạy bộ', '/c/running'], ['Dép & Sandal', '/search?q=slides']], footer: ['Tất cả giày nữ', '/c/women-shoes'] },
      { title: 'Quần áo', href: '/c/women-clothing', links: [['Áo khoác thể thao', '/c/women-clothing'], ['Váy đầm', '/c/women-clothing'], ['Áo', '/c/women-clothing']], footer: ['Tất cả quần áo nữ', '/c/women-clothing'] },
      { title: 'Phụ kiện', href: '/c/accessories', links: [['Tất', '/c/accessories'], ['Túi', '/c/accessories']], footer: ['Tất cả phụ kiện nữ', '/c/accessories'] },
    ],
  },
  {
    label: 'Trẻ em',
    href: '/c/kids',
    bold: true,
    columns: [
      { title: 'Trẻ em', href: '/c/kids', links: [['Tất cả đồ trẻ em', '/c/kids'], ['Tất', '/c/kids']], footer: ['Tất cả đồ trẻ em', '/c/kids'] },
    ],
  },
  { label: 'Khuyến mãi', href: '/c/sale' },
  { label: 'Mới & Nổi bật', href: '/c/new-arrivals' },
]

export const utilityNav = [
  ['trợ giúp', '/help'],
  ['đơn hàng & đổi trả', '/account/orders'],
  ['thẻ quà tặng', '/gift-cards'],
]

export const footerColumns = [
  { title: 'Sản phẩm', links: [['Giày', '/c/shoes'], ['Quần áo', '/c/clothing'], ['Phụ kiện', '/c/accessories'], ['Thẻ quà tặng', '/gift-cards'], ['Hàng mới về', '/c/new-arrivals'], ['Bán chạy', '/c/best-sellers'], ['Lịch ra mắt', '/c/new-arrivals'], ['Khuyến mãi', '/c/sale']] },
  { title: 'Thể thao', links: [['Bóng đá', '/search?q=soccer'], ['Chạy bộ', '/c/running'], ['Bóng rổ', '/search?q=basketball'], ['Bóng bầu dục', '/search?q=football'], ['Dã ngoại', '/search?q=outdoor'], ['Golf', '/search?q=golf'], ['Bóng chày', '/search?q=baseball'], ['Tennis', '/search?q=tennis'], ['Trượt ván', '/search?q=skate'], ['Tập luyện', '/c/men-training-shoes']] },
  { title: 'Bộ sưu tập', links: [['adicolor', '/c/originals'], ['Ultraboost', '/search?q=ultraboost'], ['Forum', '/search?q=forum'], ['Superstar', '/c/originals'], ['Giày chạy bộ', '/c/running'], ['adilette', '/search?q=adilette'], ['Stan Smith', '/search?q=stan'], ['adizero', '/search?q=adizero'], ['Samba', '/search?q=samba'], ['Gazelle', '/search?q=gazelle']] },
  { title: 'Hỗ trợ', links: [['Trợ giúp', '/help'], ['Đổi trả & Đổi hàng', '/help'], ['Vận chuyển', '/help'], ['Theo dõi đơn hàng', '/account/orders'], ['Tìm cửa hàng', '/help'], ['Bảng size', '/help'], ['Số dư thẻ quà tặng', '/gift-cards'], ['Cách vệ sinh giày', '/help'], ['Khuyến mãi', '/c/sale'], ['Sơ đồ trang', '/']] },
  { title: 'Thông tin công ty', links: [['Về chúng tôi', '/help'], ['Ưu đãi sinh viên', '/help'], ['Ưu đãi cho quân nhân & nhân viên y tế', '/help'], [`Câu chuyện ${brand.shortName}`, '/help'], [`Ứng dụng ${brand.shortName}`, '/help'], ['Tác động', '/help'], ['Con người', '/help'], ['Hành tinh', '/help'], [brand.clubName, '/club'], ['Đối tác liên kết', '/help'], ['Báo chí', '/help'], ['Tuyển dụng', '/help']] },
]

export const socialLinks = ['facebook', 'instagram', 'x', 'pinterest', 'tiktok', 'youtube']

export const popularSearches = ['ultraboost', 'samba', 'gazelle']

// Link dạng [nhãn, href]: giữ từ khoá tìm kiếm gốc (tiếng Anh) để khớp dữ liệu sản phẩm.
const q = (term) => `/search?q=${encodeURIComponent(term)}`

export const seoLinkColumns = [
  { title: 'Món hè được yêu thích', links: [['Áo sơ mi mùa hè', q('summer shirts')], ['Áo ba lỗ', q('tank tops')], ['Quần short', q('shorts')], ['Dép đi biển & Sandal', q('pool slides & sandals')], ['Mũ & phụ kiện mùa hè', q('summer hats & accessories')]] },
  { title: 'Đồ hè cho cả nhà', links: [['Quần áo hè cho nữ', q("women's summer clothes")], ['Trang phục hè cho nam', q("men's summer outfits")], ['Trẻ em (0 - 16 tuổi)', q('kids (age 0 - 16)')], ['Thiếu nhi (4 - 8 tuổi)', q('children (age 4 - 8)')], ['Em bé & trẻ nhỏ (0 - 4 tuổi)', q('babies & toddlers (age 0 - 4)')]] },
  { title: 'Phụ kiện được yêu thích', links: [['Túi laptop', q('laptop bags')], ['Túi đeo hông', q('belt bags')], ['Bình nước', q('water bottles')], ['Tất trắng', q('white socks')], ['Thẻ quà tặng', '/gift-cards']] },
  { title: 'Đồng phục học sinh', links: [['Quần đồng phục', q('uniform pants')], ['Áo polo đồng phục', q('uniform polos')], ['Giày đồng phục', q('uniform shoes')], ['Đồng phục kaki', q('khaki uniforms')], ['Đồng phục xanh navy', q('navy uniforms')]] },
]
