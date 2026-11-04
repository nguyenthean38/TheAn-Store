import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui'
import { ClubWordmark } from '@/components/account/ClubWordmark'
import { brand } from '@/config/brand'
import { useMe } from '@/hooks/useAuth'
import { useUI } from '@/store/ui'

const BENEFITS = [
  'Miễn phí giao hàng',
  'Voucher giảm 15% cho lần mua tiếp theo',
  'Quyền mua sản phẩm và tham gia đợt giảm giá dành riêng cho thành viên',
  `Tham gia cộng đồng chạy bộ ${brand.shortName}`,
  'Ưu đãi và chương trình khuyến mãi đặc biệt',
]

/** Logo "theanclub" lớn với vòng elip xanh (ảnh #111). */
function ClubLogo() {
  return (
    <div className="relative inline-block px-4 py-6">
      <span className="pointer-events-none absolute inset-0 -rotate-[10deg] rounded-[50%] border-[3px] border-club" aria-hidden />
      <ClubWordmark className="relative block text-[64px] leading-none lg:text-[76px]" />
    </div>
  )
}

/** Trang giới thiệu & tham gia Thean Club (ảnh #111) — route /club. */
export default function AdiclubPage() {
  const { data: me } = useMe()
  const openAuth = useUI((s) => s.openAuth)
  const openClub = useUI((s) => s.openClub)

  return (
    <div className="container-content grid gap-14 pt-12 pb-24 lg:grid-cols-2 lg:gap-16 lg:pt-[100px] xl:px-[160px]">
      <div>
        {/* Collage ảnh */}
        <div className="relative grid aspect-[780/370] grid-cols-[31%_1fr_27%] gap-0 overflow-hidden bg-[#f1f0ec]">
          <img src="/images/banners/hero-runners.jpg" alt="Người chạy bộ trên đường mòn" className="h-[89%] w-full object-cover" />
          <img src="/images/banners/promo-dropset.jpg" alt="Vận động viên ăn mừng" className="mt-auto h-[72%] w-full object-cover grayscale" />
          <img src="/images/banners/promo-samba.jpg" alt={`Thành viên ${brand.clubName} đang mỉm cười`} className="mt-[5%] h-[58%] w-full border-[3px] border-info object-cover" />
          <ClubWordmark className="absolute right-3 bottom-3 text-2xl lg:text-[32px]" />
          <span className="absolute inset-y-0 left-[5.5%] w-0.5 bg-info" aria-hidden />
          <span className="absolute inset-y-0 right-[6%] w-0.5 bg-info" aria-hidden />
        </div>

        <h1 className="ds-h1 mt-12 lg:text-[50px]">Tham gia {brand.clubName}. Nhận ưu đãi giảm 15%.</h1>
        <p className="mt-4 text-lg leading-7">
          Là thành viên {brand.clubName}, bạn được thưởng những điều mình yêu thích khi làm điều mình đam mê. Đăng ký ngay hôm nay để nhận ngay các quyền lợi Hạng 1:
        </p>
        <ul className="mt-6 space-y-3 pl-3">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-center gap-4 text-lg">
              <Check className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
              {b}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-lg leading-7">Tham gia ngay để bắt đầu tích điểm, lên hạng và mở khóa thêm nhiều phần thưởng, quyền lợi từ {brand.clubName}.</p>
      </div>

      <div className="lg:pt-4">
        <ClubLogo />
        {me ? (
          <>
            <h2 className="ds-h2 mt-8">Chào mừng {me.firstName || 'bạn'} đã là thành viên!</h2>
            <p className="mt-4 text-lg">
              Bạn là thành viên {brand.clubName} <strong>Hạng {me.loyalty?.level ?? 1}</strong> với <strong>{me.loyalty?.points ?? 0} điểm</strong> có thể dùng.
            </p>
            <div className="mt-8 flex flex-wrap gap-6">
              <Button to="/account" arrow size="lg">
                Đến tài khoản của tôi
              </Button>
              <Button variant="outline" arrow size="lg" onClick={openClub}>
                Mở thẻ {brand.clubName}
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="ds-h2 mt-8">Quyền lợi {brand.clubName} đang chờ bạn</h2>
            <p className="mt-4 text-[15px]">Nhận miễn phí giao hàng, voucher giảm giá và sản phẩm dành riêng cho thành viên khi tham gia {brand.clubName}.</p>
            <p className="mt-8 text-lg font-semibold">Đăng nhập hoặc đăng ký (miễn phí)</p>
            <Button arrow size="lg" className="mt-5 min-w-[260px]" onClick={() => openAuth()}>
              Tham gia ngay
            </Button>
            <p className="mt-10 text-lg text-gray-600">Đăng ký {brand.clubName} để nhận ưu đãi và tin tức độc quyền từ {brand.name}</p>
            <p className="mt-1 text-base leading-7 text-gray-600">
              Khi nhấn nút &quot;Tham gia ngay&quot;, bạn sẽ trở thành thành viên {brand.clubName}, nhận email về tin tức và cập nhật mới nhất, đồng ý với{' '}
              <Link to="/help" className="ds-link uppercase">
                Điều khoản sử dụng
              </Link>{' '}
              và{' '}
              <Link to="/help" className="ds-link uppercase">
                Điều khoản &amp; Điều kiện của {brand.clubName}
              </Link>
              , đồng thời xác nhận đã đọc{' '}
              <Link to="/help" className="ds-link uppercase">
                Chính sách bảo mật của {brand.name}
              </Link>
              .
            </p>
          </>
        )}
      </div>
    </div>
  )
}
