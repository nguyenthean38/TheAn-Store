/** Nội dung trang chủ (có thể chuyển sang GET /content/home). */
import { brand } from '@/config/brand'

export const heroSlides = [
  {
    id: 'evo-sl-runners',
    image: '/images/banners/hero-runners.jpg',
    title: 'Adizero EVO SL',
    subtitle: 'Cảm nhận tốc độ. Trong mọi khoảnh khắc của cuộc sống.',
    ctas: [
      { label: 'Mua đồ nam', href: '/c/men-running-shoes' },
      { label: 'Mua đồ nữ', href: '/c/women-shoes' },
    ],
  },
  {
    id: 'evo-sl-lifestyle',
    image: '/images/banners/hero-evo.jpg',
    title: 'Adizero EVO SL',
    subtitle: 'Cảm hứng tốc độ. Sẵn sàng cho mỗi ngày.',
    ctas: [
      { label: 'Mua đồ nam', href: '/p/adizero-evo-sl-shoes-jh6206' },
      { label: 'Mua đồ nữ', href: '/c/women' },
    ],
  },
]

export const promoStrip = { text: 'Sắm đồ hè thả ga với ưu đãi giảm đến 40%.', href: '/c/sale' }

export const promoCards = [
  { image: '/images/banners/promo-superstar.jpg', title: 'Quá khứ, hiện tại, tương lai', body: 'Khám phá Superstar, nay được làm mới cho thế hệ kế tiếp.', href: '/c/originals' },
  { image: '/images/banners/promo-dad.jpg', title: 'Bố là số 1', body: 'Chọn quà 3 Sọc để bố — người ủng hộ lớn nhất của bạn — biết bố quan trọng thế nào.', href: '/c/men' },
  { image: '/images/banners/promo-ae1.jpg', title: 'Anthony Edwards 1', body: 'Sinh ra cho tốc độ. Vững chãi như bê tông. Hãy tin điều đó.', href: '/search?q=basketball' },
  { image: '/images/banners/promo-dropset.jpg', title: 'Dropset 3', body: 'Bắt nguồn từ sức mạnh.', href: '/c/men-training-shoes' },
]

export const promoCards2 = [
  { image: '/images/banners/promo-samba.jpg', title: 'Samba', body: 'Đậm chất retro. Vượt thời gian như chưa từng.', href: '/search?q=samba' },
  { image: '/images/banners/promo-dropset-man.jpg', title: 'Dropset 3', body: 'Bắt nguồn từ sức mạnh.', href: '/c/men-training-shoes' },
  { image: '/images/banners/promo-crazy-lite.jpg', title: 'Quần short Crazy Lite', body: 'Thiết kế để nâng tầm lối chơi của bạn.', href: '/c/men-clothing' },
  { image: '/images/banners/promo-dad.jpg', title: 'Bố là số 1', body: 'Chọn quà 3 Sọc để bố — người ủng hộ lớn nhất của bạn — biết bố quan trọng thế nào.', href: '/c/men' },
]

export const categoryTiles = [
  { image: '/images/categories/sneakers.jpg', label: 'Giày sneaker', href: '/c/men-sneakers' },
  { image: '/images/categories/tops.jpg', label: 'Áo', href: '/c/men-clothing' },
  { image: '/images/categories/hoodies.jpg', label: 'Áo hoodie & áo nỉ', href: '/c/clothing' },
  { image: '/images/categories/pants.jpg', label: 'Quần dài', href: '/c/clothing' },
]

export const relatedResources = [
  { image: '/images/resources/clean-shoes.jpg', title: 'Cách vệ sinh giày', body: `Xắn tay áo cùng ${brand.name} và học cách vệ sinh giày sneaker đúng cách.` },
  { image: '/images/resources/samba-size.jpg', title: 'Hướng dẫn chọn size Samba', body: 'Khám phá di sản kinh điển qua form dáng và cảm giác mang của đôi Samba có một không hai.' },
  { image: '/images/resources/tennis-skirt.jpg', title: 'Phối đồ chuẩn sân: Cách mặc chân váy tennis', body: `Sẵn sàng giao bóng chưa? Học cách phối chân váy tennis cùng ${brand.name}.` },
  { image: '/images/resources/soccer-jersey.jpg', title: 'Cách phối áo đấu bóng đá', body: 'Từ thể thao, điệu đà đến chỉn chu — áo đấu bóng đá là món đồ đa năng đến bất ngờ trong tủ đồ.' },
]

export const seoText = {
  title: 'Giày sneaker, đồ thể thao và dụng cụ thể thao',
  paragraphs: [
    `Gọi tên mọi vận động viên. Sẵn sàng cho môn thể thao yêu thích với giày sneaker và đồ thể thao nam, nữ từ ${brand.name}. Từ chạy bộ đến bóng đá, từ phòng gym đến đường mòn, quần áo và giày tập hiệu năng cao giúp bạn luôn ở trạng thái tốt nhất. Tìm đôi giày chuyên biệt cho từng môn để tiếp lửa đam mê và khẳng định phong cách của bạn.`,
    `Lấy hiệu năng làm nền tảng, dụng cụ thể thao tại ${brand.name} đồng hành cùng vận động viên ở mọi cấp độ. Nam, nữ và trẻ em đều tìm được phong độ tốt nhất với giày sneaker và đồ thể thao được tạo ra để bứt phá dưới áp lực. Trang phục thể thao thoáng khí, kiểm soát mồ hôi và hỗ trợ cơ bắp khi vận động. Khám phá chất liệu vải hiệu năng và công nghệ giày mới nhất để tận dụng tối đa mỗi buổi tập.`,
  ],
}
