import { NavLink, useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { brand } from '@/config/brand'
import { useLogout } from '@/hooks/useAuth'
import { useUI } from '@/store/ui'
import { cn } from '@/utils/cn'

const LINKS = [
  { to: '/account/details', label: 'Thông tin cá nhân' },
  { to: '/account/addresses', label: 'Sổ địa chỉ' },
  { to: '/account/preferences', label: 'Sở thích' },
  { to: '/account/size-profile', label: 'Hồ sơ size' },
]

const HELP_LINKS = ['Sản phẩm', 'Đặt hàng & Thanh toán', 'Khuyến mãi & Voucher', 'Đổi trả & Hoàn tiền', 'Thông tin công ty']

const rowCls = 'flex h-14 w-full items-center justify-between gap-4 px-5 text-left text-lg transition-colors hover:bg-gray-50 lg:h-[74px]'

/** Sidebar "TỔNG QUAN TÀI KHOẢN" (ảnh #76). */
export function AccountSidebar({ className }) {
  const navigate = useNavigate()
  const logout = useLogout()
  const openClub = useUI((s) => s.openClub)
  const toast = useUI((s) => s.toast)

  const handleLogout = () => {
    // Rời khỏi /account trước để RequireAuth không bật modal đăng nhập
    navigate('/')
    logout.mutate(undefined, { onSettled: () => toast('Bạn đã đăng xuất.', 'info') })
  }

  return (
    <aside className={className} aria-labelledby="account-overview">
      <h2 id="account-overview" className="ds-h3 mb-1 lg:text-[22px]">
        Tổng quan tài khoản
      </h2>
      <nav aria-label="Tổng quan tài khoản" className="bg-white">
        <ul>
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className={({ isActive }) => cn(rowCls, isActive && 'font-bold')}>
                {l.label}
                <ChevronRight className="size-6 shrink-0" strokeWidth={2.25} aria-hidden />
              </NavLink>
            </li>
          ))}
          <li>
            <button type="button" onClick={openClub} className={rowCls}>
              Thẻ {brand.clubName}
            </button>
          </li>
          <li>
            <button type="button" onClick={handleLogout} disabled={logout.isPending} className={rowCls}>
              Đăng xuất
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

/** Khối "CẦN TRỢ GIÚP?" dưới panel nội dung (ảnh #77). */
export function NeedHelp() {
  return (
    <section aria-labelledby="need-help" className="mt-14">
      <h2 id="need-help" className="ds-h3 mb-5 lg:text-[22px]">
        Cần trợ giúp?
      </h2>
      <ul className="grid grid-flow-row gap-x-16 gap-y-3 bg-white px-8 py-8 sm:grid-flow-col sm:grid-rows-2 sm:justify-start">
        {HELP_LINKS.map((label) => (
          <li key={label}>
            <NavLink to="/help" className="ds-link text-lg">
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * Layout 2 cột cho các trang TÀI KHOẢN (thông tin, địa chỉ, sở thích, hồ sơ size):
 * sidebar trái + panel trắng bên phải.
 */
export function AccountSection({ children, panelClassName, showHelp = true }) {
  return (
    <div className="container-content grid gap-10 py-10 lg:grid-cols-[295px_minmax(0,1fr)] lg:gap-16 lg:py-[100px] xl:gap-[104px]">
      <AccountSidebar className="order-2 lg:order-1" />
      <div className="order-1 min-w-0 lg:order-2">
        <div className={cn('bg-white px-5 py-8 sm:px-7 lg:py-10', panelClassName)}>{children}</div>
        {showHelp && <NeedHelp />}
      </div>
    </div>
  )
}

/** Tiêu đề trang trong panel (THÔNG TIN CỦA TÔI, SỔ ĐỊA CHỈ...). */
export function PanelTitle({ title, description }) {
  return (
    <header className="mb-10 lg:mb-14">
      <h1 className="ds-h1 lg:text-[40px]">{title}</h1>
      {description && <p className="mt-5 text-lg">{description}</p>}
    </header>
  )
}
