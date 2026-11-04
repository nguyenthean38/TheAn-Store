import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Copy, X } from 'lucide-react'
import { ArrowLong, Button, Tabs } from '@/components/ui'
import { useLogout, useMe } from '@/hooks/useAuth'
import { useVouchers } from '@/hooks/useAccount'
import { useUI } from '@/store/ui'
import { formatDate } from '@/utils/format'
import { LevelBadge } from './AdiclubLogo'

const JUST_FOR_YOU = [
  { title: 'Tải ứng dụng Thean', body: 'Nhận thông báo về sản phẩm mới, khuyến mãi và ưu đãi thành viên' },
  { title: 'Nhận gói Spotify Premium', body: 'Đổi điểm Thean Club để mở khóa tới 5 tháng Spotify Premium' },
  { title: 'Tham gia ngay', body: 'Chương trình quà tặng phối màu bí ẩn Harden Vol 9' },
  { title: 'Chạy bộ và tích điểm', body: 'Tải ứng dụng Thean Running và nhận 2 điểm cho mỗi km được ghi nhận' },
  { title: 'Tìm sự cân bằng cùng Thean Club', body: 'Dùng miễn phí ứng dụng số 1 về giấc ngủ, thiền và thư giãn.' },
  { title: 'Nhận ưu đãi $10', body: 'Mời bạn bè tham gia Thean Club, cả hai cùng được giảm $10' },
]

const POINTS_VOUCHERS = [
  { label: 'Voucher giảm 15%', points: 800 },
  { label: 'Voucher giảm 20%', points: 1500 },
]

const EARN = [
  { title: 'Mua sắm', body: 'Nhận 10 điểm cho mỗi $1 chi tiêu trên website hoặc ứng dụng Thean.', cta: 'Xem sản phẩm', href: '/c/new-arrivals' },
  { title: 'Đánh giá', body: 'Viết đánh giá sản phẩm và nhận 25 điểm khi đánh giá được đăng.', cta: 'Viết đánh giá', href: '/account/orders' },
  { title: 'Hoàn thiện hồ sơ', body: 'Thêm ngày sinh và sở thích để nhận 50 điểm.', cta: 'Cập nhật hồ sơ', href: '/account/details' },
]

/** Panel Thean Club trượt phải khi bấm icon tài khoản (đã đăng nhập). */
export function ClubDrawer() {
  const open = useUI((s) => s.clubOpen)
  const close = useUI((s) => s.closeClub)
  const toast = useUI((s) => s.toast)
  const { data: me } = useMe()
  const { data: vouchers = [] } = useVouchers(Boolean(me) && open)
  const logout = useLogout()
  const navigate = useNavigate()
  const [tab, setTab] = useState('for-you')
  const [showVouchers, setShowVouchers] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && close()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  if (!open || !me) return null

  const go = (href) => {
    close()
    navigate(href)
  }
  const copy = (code) => {
    navigator.clipboard?.writeText(code)
    toast(`Đã sao chép mã ${code}`, 'success')
  }

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 animate-fade-in bg-black/50" onClick={close} aria-hidden />
      <aside role="dialog" aria-modal="true" aria-label="Thean Club" className="absolute top-0 right-0 flex h-full w-full max-w-[496px] animate-slide-in-right flex-col bg-white">
        {/* Header */}
        <div className="shrink-0 bg-[linear-gradient(135deg,#f2f2f2,#e6e6e6)] px-9 pt-6 pb-5">
          <div className="relative mb-3 text-center">
            <p className="font-display text-xl font-extrabold uppercase">Xin chào {me.firstName || ''}</p>
            <button type="button" onClick={close} aria-label="Đóng" className="absolute top-0 right-0 hover:opacity-60">
              <X className="size-7" strokeWidth={1.75} />
            </button>
          </div>
          <div className="mb-5 flex items-center justify-between">
            <LevelBadge level={me.loyalty.level} className="scale-75 origin-left" />
            <div className="text-right">
              <p className="text-sm">Điểm có thể dùng</p>
              <p className="text-2xl font-bold">◎ {me.loyalty.points}</p>
            </div>
          </div>
          {[
            ['Tài khoản của bạn', '/account'],
            ['Lịch sử điểm', '/account'],
          ].map(([label, href]) => (
            <button key={label} type="button" onClick={() => go(href)} className="ds-label flex w-full items-center justify-between py-2.5 text-sm">
              {label} <ArrowLong size={20} />
            </button>
          ))}
        </div>

        <Tabs
          className="shrink-0 border-b border-line px-9 pt-5"
          items={[
            { value: 'for-you', label: 'Dành cho bạn' },
            { value: 'shop', label: 'Đổi điểm' },
            { value: 'earn', label: 'Tích điểm' },
          ]}
          value={tab}
          onChange={setTab}
          renderItem={(it, { active }) => (
            <button key={it.value} type="button" role="tab" aria-selected={active} onClick={() => setTab(it.value)} className={`ds-label relative shrink-0 pb-5 text-sm ${active ? 'after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-ink' : 'font-normal'}`}>
              {it.label}
            </button>
          )}
        />

        <div className="flex-1 space-y-3 overflow-y-auto p-3">
          {tab === 'for-you' && (
            <>
              <div className="px-6 py-3">
                <button type="button" onClick={() => setShowVouchers((v) => !v)} className="ds-link-strong">
                  Xem voucher của tôi ({vouchers.length})
                </button>
                {showVouchers && (
                  <ul className="mt-4 space-y-3">
                    {vouchers.map((v) => (
                      <li key={v.id} className="bg-info p-4 text-white">
                        <p className="font-condensed text-2xl font-bold uppercase italic">{v.title}</p>
                        <p className="mt-1 text-sm">{v.description}</p>
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <span>Hết hạn {formatDate(v.expiresAt)}</span>
                          <button type="button" onClick={() => copy(v.code)} className="inline-flex items-center gap-1.5 font-bold underline">
                            <Copy className="size-4" /> {v.code}
                          </button>
                        </div>
                      </li>
                    ))}
                    {!vouchers.length && <li className="text-sm text-gray-600">Bạn chưa có voucher nào.</li>}
                  </ul>
                )}
              </div>
              {JUST_FOR_YOU.map((c) => (
                <OfferCard key={c.title} {...c} />
              ))}
            </>
          )}
          {tab === 'shop' && (
            <div className="px-6 py-3">
              <h3 className="mb-1 font-display text-2xl font-bold">Đổi điểm lấy voucher</h3>
              <p className="mb-4 text-sm text-gray-600">Đổi điểm để nhận giảm giá hoặc ưu đãi đặc biệt.</p>
              <div className="flex gap-3 overflow-x-auto scrollbar-none">
                {POINTS_VOUCHERS.map((v) => (
                  <div key={v.label} className="flex h-36 w-56 shrink-0 flex-col justify-between bg-info p-4 text-white">
                    <p className="font-condensed text-2xl font-bold uppercase italic">{v.label}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>◎ {v.points} điểm</span>
                      <span className="font-display font-extrabold italic">thean club</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm text-gray-600">Bạn cần thêm {Math.max(0, 800 - me.loyalty.points)} điểm để mở khóa voucher đầu tiên.</p>
              <h3 className="mt-8 mb-1 font-display text-2xl font-bold">Ưu đãi từ đối tác</h3>
              <p className="text-sm text-gray-600">Thean Club hợp tác cùng các đối tác hàng đầu để mang đến ưu đãi hấp dẫn cho bạn.</p>
            </div>
          )}
          {tab === 'earn' && (
            <div className="space-y-3">
              <div className="px-6 py-3">
                <h3 className="mb-1 font-display text-2xl font-bold">Tích điểm Thean Club</h3>
                <p className="text-sm text-gray-600">Tích điểm thật dễ dàng. Tương tác càng nhiều, điểm càng cao.</p>
              </div>
              {EARN.map((e) => (
                <div key={e.title} className="border border-line p-6">
                  <p className="ds-label mb-2">{e.title}</p>
                  <p className="mb-4 text-sm">{e.body}</p>
                  <Button variant="outline" size="sm" arrow onClick={() => go(e.href)}>
                    {e.cta}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-line px-9 py-4 text-sm">
          <Link to="/account/details" onClick={close} className="ds-link mr-6">
            Cài đặt tài khoản
          </Link>
          <button
            type="button"
            className="ds-link"
            onClick={async () => {
              await logout.mutateAsync()
              close()
              navigate('/')
            }}
          >
            Đăng xuất
          </button>
        </div>
      </aside>
    </div>
  )
}

function OfferCard({ title, body }) {
  return (
    <div className="relative flex items-center gap-4 border border-line p-6">
      <span className="absolute top-6 right-4 size-1.5 rounded-full bg-warning" aria-hidden />
      <div className="flex-1">
        <p className="mb-2 text-lg font-bold">{title}</p>
        <p className="text-sm text-gray-800">{body}</p>
      </div>
      <ArrowLong size={20} />
    </div>
  )
}
