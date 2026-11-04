import { NavLink, useLocation } from 'react-router-dom'
import { Tabs } from '@/components/ui'
import { brand } from '@/config/brand'
import { cn } from '@/utils/cn'
import { ClubWordmark } from './ClubWordmark'

const TABS = [
  { value: 'feed', label: 'Bảng tin', to: '/account' },
  { value: 'orders', label: 'Đơn hàng', to: '/account/orders' },
  { value: 'account', label: 'Tài khoản', to: '/account/details' },
]

const ACCOUNT_PATHS = ['/account/details', '/account/addresses', '/account/preferences', '/account/size-profile']

export function activeAccountTab(pathname) {
  if (pathname.startsWith('/account/orders')) return 'orders'
  if (ACCOUNT_PATHS.some((p) => pathname.startsWith(p))) return 'account'
  return 'feed'
}

/** Icon đồng xu điểm thành viên (◎). */
export function PointsIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('size-[22px]', className)} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6.5" />
      <path d="M9.5 14.5 12 9l2.5 5.5" strokeLinejoin="round" />
    </svg>
  )
}

/** Huy hiệu "theanclub HẠNG 1" với số nghiêng trong vòng elip (ảnh #100). */
export function LevelBadge({ level = 1, className }) {
  return (
    <div className={cn('relative inline-flex items-center gap-4 pr-10', className)} aria-label={`${brand.clubName} hạng ${level}`} role="img">
      <div className="text-right leading-none" aria-hidden>
        <ClubWordmark className="block text-[24px] lg:text-[32px]" />
        <span className="mt-1 block text-sm font-semibold tracking-[0.06em] uppercase lg:text-[15px]">Hạng</span>
      </div>
      <span className="font-display text-5xl leading-none font-light italic lg:text-[66px]" aria-hidden>
        {level}
      </span>
      <span className="pointer-events-none absolute top-1/2 right-0 h-[64px] w-[96px] -translate-y-1/2 -rotate-12 rounded-[50%] border border-gray-300 lg:h-[82px] lg:w-[124px]" aria-hidden />
    </div>
  )
}

/** Dải đầu trang tài khoản: lời chào + điểm + hạng, và tabs BẢNG TIN / ĐƠN HÀNG / TÀI KHOẢN. */
export function AccountHeader({ me, showGreeting = true }) {
  const { pathname } = useLocation()
  const active = activeAccountTab(pathname)
  const firstName = me?.firstName?.trim()
  const points = me?.loyalty?.points ?? 0

  return (
    <div className="bg-white">
      {showGreeting && (
        <div className="container-content flex items-center justify-between gap-6 pt-10 pb-6 lg:pt-14 lg:pb-3">
          <div>
            <h1 className="ds-h1">{firstName ? `Xin chào, ${firstName}` : 'Xin chào'}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-lg">
              <PointsIcon />
              {points} điểm có thể dùng
            </p>
          </div>
          <LevelBadge level={me?.loyalty?.level ?? 1} className="hidden shrink-0 sm:inline-flex" />
        </div>
      )}
      <nav aria-label="Tài khoản" className={cn('border-b border-gray-300', showGreeting && active !== 'feed' && 'border-t')}>
        <Tabs
          items={TABS}
          value={active}
          className="justify-center gap-6 pt-9 sm:gap-11"
          renderItem={(it, { active: isActive, className }) => (
            <NavLink
              key={it.value}
              to={it.to}
              end={it.value === 'feed'}
              aria-current={isActive ? 'page' : undefined}
              className={cn(className, 'px-5 pb-7 uppercase', isActive ? 'font-semibold' : 'font-normal')}
            >
              {it.label}
            </NavLink>
          )}
        />
      </nav>
    </div>
  )
}
