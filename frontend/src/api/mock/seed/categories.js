/**
 * Seed danh mục (PLP). `filters` là filter mặc định áp vào GET /products.
 * Mỗi category có `tabs` = thanh sub-category ngang trên PLP (ảnh #17).
 */

const MEN_SHOE_TABS = [
  { label: 'Tất cả giày nam', slug: 'men-shoes' },
  { label: 'Giày sneaker', slug: 'men-sneakers' },
  { label: 'Chạy bộ', slug: 'men-running-shoes' },
  { label: 'Tập luyện & Gym', slug: 'men-training-shoes' },
  { label: 'Dép & Sandal', slug: 'men-slides' },
  { label: 'Giày từ $100 trở xuống', slug: 'men-shoes-under-100' },
]

const WOMEN_TABS = [
  { label: 'Tất cả đồ nữ', slug: 'women' },
  { label: 'Giày', slug: 'women-shoes' },
  { label: 'Quần áo', slug: 'women-clothing' },
]

const home = { label: 'Trang chủ', href: '/' }
const men = { label: 'Nam', href: '/c/men' }
const women = { label: 'Nữ', href: '/c/women' }

const MEN_FAQ = [
  { question: 'Thế nào được coi là giày thể thao chuyên dụng?', answer: 'Giày thể thao chuyên dụng được thiết kế cho thể thao và vận động. Chúng có đệm, khả năng nâng đỡ và độ bám được tối ưu cho từng chuyển động như chạy bộ, tập luyện hay các môn thể thao trên sân.' },
  { question: 'Giày sneaker và giày thể thao chuyên dụng khác nhau thế nào?', answer: 'Sneaker là cách gọi chung cho những đôi giày đế cao su mang hằng ngày, còn giày thể thao chuyên dụng được thiết kế để tối ưu hiệu năng cho một môn thể thao cụ thể. Nhiều mẫu giày tại Thean store kết hợp được cả hai.' },
  { question: 'Làm sao để chọn được đôi sneaker phù hợp nhất với bàn chân?', answer: 'Hãy cân nhắc hoạt động bạn thường làm, hình dáng bàn chân và kiểu ôm chân bạn thích. Dùng hướng dẫn chọn size, xem đánh giá về độ vừa vặn và chú ý ghi chú "Đúng size" trên mỗi trang sản phẩm.' },
]

const SNEAKER_SEO = {
  title: 'Giày sneaker nam tại Thean store',
  body: 'Bước vào thế giới phong cách và hiệu năng với giày sneaker nam tại Thean store. Dù bạn tìm một đôi giày kinh điển để dạo phố hay một đôi giày thể thao kỹ thuật để chinh phục buổi tập tiếp theo, Thean store đều có đôi giày hoàn hảo dành cho bạn. Những mẫu biểu tượng như Samba và Gazelle mang đậm phong cách di sản, trong khi Ultraboost và Adizero mang đến công nghệ hiệu năng cho mọi buổi chạy.',
}

export const categories = [
  {
    slug: 'men',
    title: 'Giày & quần áo nam',
    description: 'Sẵn sàng cho mọi mục tiêu với giày sneaker, quần áo và phụ kiện nam dành cho thể thao lẫn phong cách.',
    breadcrumbs: [home, { label: 'Nam' }],
    tabs: MEN_SHOE_TABS,
    filters: { gender: 'men' },
    seo: { title: 'Giày sneaker và quần áo tập luyện nam', body: 'Gửi tới các vận động viên và những người sáng tạo trong thể thao: hãy tự tin, tự hào và thể hiện tốt nhất với giày và quần áo nam tiếp sức cho đam mê và định hình phong cách của bạn. Thean store luôn đặt sự thoải mái và hiệu năng lên hàng đầu. Trang bị ngay đồ thể thao chất lượng hàng đầu, vừa vặn và dễ chịu không kém vẻ ngoài.' },
    faq: MEN_FAQ,
  },
  { slug: 'men-shoes', title: 'Giày nam', description: 'Từ Ultraboost đến Superstar, tìm đôi giày nam hoàn hảo cho mọi hoạt động và mọi phong cách.', breadcrumbs: [home, men, { label: 'Giày' }], tabs: MEN_SHOE_TABS, filters: { gender: 'men', category: 'shoes' }, seo: SNEAKER_SEO, faq: MEN_FAQ },
  { slug: 'men-sneakers', title: 'Giày sneaker nam', description: 'Từ Ultraboost đến Superstar, bạn sẽ tìm thấy đôi giày thể thao nam hoàn hảo cho lối sống của mình. Những đôi sneaker được thiết kế vì sự thoải mái của bạn, để bạn dồn hết tâm trí cho buổi tập tiếp theo.', breadcrumbs: [home, men, { label: 'Giày thể thao & sneaker' }], tabs: MEN_SHOE_TABS, filters: { gender: 'men', productType: 'sneakers' }, seo: SNEAKER_SEO, faq: MEN_FAQ },
  { slug: 'men-running-shoes', title: 'Giày chạy bộ nam', description: 'Giày chạy bộ nhẹ, phản hồi tốt cho mọi cự ly — từ những buổi chạy hằng ngày đến ngày đua.', breadcrumbs: [home, men, { label: 'Chạy bộ' }], tabs: MEN_SHOE_TABS, filters: { gender: 'men', category: 'shoes', sport: 'running' }, faq: MEN_FAQ },
  { slug: 'men-training-shoes', title: 'Giày tập luyện & gym nam', description: 'Giày tập ổn định, bám tốt cho nâng tạ, HIIT và mọi bài tập khác.', breadcrumbs: [home, men, { label: 'Tập luyện & Gym' }], tabs: MEN_SHOE_TABS, filters: { gender: 'men', category: 'shoes', sport: 'training' } },
  { slug: 'men-slides', title: 'Dép & sandal nam', description: 'Thoải mái xỏ chân với những đôi dép cho hồ bơi, bãi biển và phục hồi sau trận đấu.', breadcrumbs: [home, men, { label: 'Dép & Sandal' }], tabs: MEN_SHOE_TABS, filters: { gender: 'men', productType: 'slides' } },
  { slug: 'men-shoes-under-100', title: 'Giày nam từ $100 trở xuống', description: 'Giày tốt, giá tốt. Mua các mẫu giày nam từ $100 trở xuống.', breadcrumbs: [home, men, { label: 'Giày từ $100 trở xuống' }], tabs: MEN_SHOE_TABS, filters: { gender: 'men', category: 'shoes', maxPrice: 100 } },
  { slug: 'men-clothing', title: 'Quần áo nam', description: 'Áo thun, bộ đồ thể thao và trang phục tập luyện sinh ra để vận động.', breadcrumbs: [home, men, { label: 'Quần áo' }], tabs: MEN_SHOE_TABS, filters: { gender: 'men', category: 'clothing' } },
  { slug: 'women', title: 'Giày & quần áo nữ', description: 'Mua giày sneaker, đồ thể thao và phụ kiện nữ được thiết kế cho mọi chuyển động.', breadcrumbs: [home, { label: 'Nữ' }], tabs: WOMEN_TABS, filters: { gender: 'women' } },
  { slug: 'women-shoes', title: 'Giày nữ', description: 'Giày sneaker biểu tượng và giày hiệu năng dành cho nữ.', breadcrumbs: [home, women, { label: 'Giày' }], tabs: WOMEN_TABS, filters: { gender: 'women', category: 'shoes' } },
  { slug: 'women-clothing', title: 'Quần áo nữ', description: 'Áo khoác thể thao, váy và những món đồ tập luyện thiết yếu.', breadcrumbs: [home, women, { label: 'Quần áo' }], tabs: WOMEN_TABS, filters: { gender: 'women', category: 'clothing' } },
  { slug: 'kids', title: 'Giày & quần áo trẻ em', description: 'Trang bị cho mọi trận đấu, mọi sân chơi và mọi cuộc phiêu lưu.', breadcrumbs: [home, { label: 'Trẻ em' }], tabs: [], filters: { gender: 'kids' } },
  { slug: 'shoes', title: 'Giày', description: 'Giày sneaker, giày chạy bộ, dép và nhiều hơn nữa cho mọi người.', breadcrumbs: [home, { label: 'Giày' }], tabs: [{ label: 'Tất cả giày', slug: 'shoes' }, { label: 'Nam', slug: 'men-shoes' }, { label: 'Nữ', slug: 'women-shoes' }], filters: { category: 'shoes' } },
  { slug: 'clothing', title: 'Quần áo', description: 'Trang phục cho thể thao và đường phố.', breadcrumbs: [home, { label: 'Quần áo' }], tabs: [], filters: { category: 'clothing' } },
  { slug: 'accessories', title: 'Phụ kiện', description: 'Tất, túi và mọi thứ để hoàn thiện set đồ.', breadcrumbs: [home, { label: 'Phụ kiện' }], tabs: [], filters: { category: 'accessories' } },
  { slug: 'sale', title: 'Khuyến mãi', description: 'Tiết kiệm lớn cho đồ mùa hè với ưu đãi lên đến 60%.', breadcrumbs: [home, { label: 'Khuyến mãi' }], tabs: [], filters: { sale: true } },
  { slug: 'new-arrivals', title: 'Hàng mới về', description: 'Những mẫu mới nhất và phong cách tươi mới nhất.', breadcrumbs: [home, { label: 'Mới & Nổi bật' }], tabs: [], filters: { badge: 'new' } },
  { slug: 'best-sellers', title: 'Bán chạy', description: 'Những mẫu mà ai cũng đang nhắc đến.', breadcrumbs: [home, { label: 'Bán chạy' }], tabs: [], filters: { badge: 'best_seller' } },
  { slug: 'originals', title: 'Originals', description: 'Những biểu tượng di sản như Samba, Gazelle và Superstar.', breadcrumbs: [home, { label: 'Originals' }], tabs: [], filters: { subtitleIncludes: 'Originals' } },
  { slug: 'running', title: 'Chạy bộ', description: 'Giày và trang phục giúp bạn chạy tốt nhất.', breadcrumbs: [home, { label: 'Chạy bộ' }], tabs: [], filters: { sport: 'running' } },
  { slug: 'all', title: 'Tất cả sản phẩm', description: 'Mua sắm mọi thứ.', breadcrumbs: [home, { label: 'Tất cả' }], tabs: [], filters: {} },
]
