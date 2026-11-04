import { useState } from 'react'
import { Badge, Button, Skeleton } from '@/components/ui'
import { VouchersModal } from '@/components/account/VouchersModal'
import { brand } from '@/config/brand'
import { useMe } from '@/hooks/useAuth'
import { useVouchers } from '@/hooks/useAccount'
import { useUI } from '@/store/ui'
import { pluralize } from '@/utils/format'

const REWARDS = [
  { id: 'r1', title: 'Voucher $10', text: 'Đổi điểm để được giảm $10 cho đơn hàng tiếp theo.', points: 500, image: '/images/banners/promo-samba.jpg' },
  { id: 'r2', title: 'Miễn phí giao hàng nhanh', text: 'Nhận đơn hàng tiếp theo nhanh hơn, phí giao hàng để chúng tôi lo.', points: 250, image: '/images/banners/promo-superstar.jpg' },
  { id: 'r3', title: 'Bộ sưu tập dành riêng cho thành viên', text: 'Quyền mua sớm các sản phẩm phiên bản giới hạn.', points: 1000, image: '/images/banners/hero-runners.jpg' },
]

/** Bảng tin tài khoản (ảnh #74, #132): voucher + điểm & phần thưởng thành viên. */
export default function FeedPage() {
  const { data: me } = useMe()
  const { data: vouchers, isLoading } = useVouchers()
  const openClub = useUI((s) => s.openClub)
  const [open, setOpen] = useState(false)

  const points = me?.loyalty?.points ?? 0
  const newCount = vouchers?.filter((v) => v.isNew).length ?? 0

  return (
    <div className="container-content pt-12 pb-20 lg:pt-[100px]">
      <div className="max-w-[490px]">
        <section aria-labelledby="vouchers-title" className="bg-white px-5 pt-10 pb-10">
          {isLoading ? (
            <Skeleton className="h-48" />
          ) : (
            <>
              <h2 id="vouchers-title" className="font-display text-[22px] font-extrabold uppercase">
                Voucher của bạn <span className="font-normal">({vouchers?.length ?? 0})</span>
              </h2>
              <p className="mt-4 text-lg leading-7">
                {vouchers?.length ? 'Mở danh sách voucher của bạn bằng liên kết bên dưới.' : 'Hiện bạn chưa có voucher nào.'}
              </p>
              {newCount > 0 && (
                <Badge tone="info" className="mt-8 px-3 py-2 text-[13px] tracking-[0.07em]">
                  {pluralize(newCount, 'voucher mới')}
                </Badge>
              )}
              <div className={newCount > 0 ? 'mt-3' : 'mt-8'}>
                <Button variant="outline" size="lg" arrow onClick={() => setOpen(true)} className="h-16 gap-8 px-5 text-sm tracking-[0.04em]">
                  Xem voucher của bạn
                </Button>
              </div>
            </>
          )}
        </section>
        <p className="mt-2 text-lg leading-7">Hiện bạn chưa đủ điểm {brand.clubName} để mở khóa voucher giảm giá.</p>
        <button type="button" onClick={openClub} className="ds-link-strong mt-12 text-sm tracking-[0.07em]">
          Cách tích thêm điểm
        </button>
      </div>

      <section aria-labelledby="rewards-title" className="mt-24 lg:mt-[220px]">
        <h2 id="rewards-title" className="font-display text-[22px] font-extrabold uppercase">
          Điểm và phần thưởng {brand.clubName}
        </h2>
        <p className="mt-3 text-lg">
          Bạn đang có <strong>{points} điểm</strong>. Tiếp tục mua sắm, viết đánh giá và tham gia sự kiện để mở khóa thêm phần thưởng.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REWARDS.map((r) => {
            const progress = Math.min(100, Math.round((points / r.points) * 100))
            const unlocked = points >= r.points
            return (
              <li key={r.id} className="flex flex-col bg-white">
                <img src={r.image} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
                <div className="flex flex-1 flex-col p-5">
                  <p className="ds-label text-gray-600">{r.points} điểm</p>
                  <h3 className="mt-2 text-xl font-bold uppercase">{r.title}</h3>
                  <p className="mt-1 text-gray-600">{r.text}</p>
                  <div className="mt-5" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Tiến độ: ${r.title}`}>
                    <div className="h-1 bg-gray-200">
                      <div className="h-full bg-ink" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="ds-caption mt-2">{unlocked ? 'Sẵn sàng để đổi' : `Cần thêm ${r.points - points} điểm để mở khóa`}</p>
                  </div>
                  <Button variant="link" onClick={openClub} className="mt-5 self-start">
                    {unlocked ? 'Đổi ngay' : 'Xem cửa hàng đổi điểm'}
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <VouchersModal open={open} onClose={() => setOpen(false)} vouchers={vouchers} isLoading={isLoading} />
    </div>
  )
}
