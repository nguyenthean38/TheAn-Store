import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react'
import { IconButton, Logo, BagIcon, HeartIcon, UserIcon } from '@/components/ui'
import { announcements, brand } from '@/config/brand'
import { mainNav, utilityNav } from '@/config/navigation'
import { useMe } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { useUI } from '@/store/ui'
import { cn } from '@/utils/cn'
import { MegaMenu } from './MegaMenu'
import { SearchBox } from './SearchBox'

/** Thanh đen trên cùng, xoay vòng thông điệp (ảnh #0). */
export function AnnouncementBar() {
  const [i, setI] = useState(0)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (open) return
    const t = setInterval(() => setI((x) => (x + 1) % announcements.length), 5000)
    return () => clearInterval(t)
  }, [open])
  return (
    <div className="relative z-30 bg-ink text-white">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex h-[50px] w-full items-center justify-center gap-3 text-[13px] font-bold tracking-[0.06em] uppercase">
        <span key={i} className="animate-fade-in">
          {announcements[i]}
        </span>
        <ChevronDown className={cn('size-5 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
      {open && (
        <ul className="absolute inset-x-0 top-full animate-fade-in bg-ink pb-6 text-center">
          {announcements.map((a) => (
            <li key={a} className="py-2 text-sm font-bold tracking-[0.05em] uppercase">
              <Link to="/c/sale" onClick={() => setOpen(false)} className="hover:underline">
                {a}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function Header() {
  const { data: me } = useMe()
  const { data: cart } = useCart()
  const { data: wishlist } = useWishlist()
  const openAuth = useUI((s) => s.openAuth)
  const openClub = useUI((s) => s.openClub)
  const location = useLocation()
  const [activeMenu, setActiveMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeTimer = useRef()

  useEffect(() => {
    setActiveMenu(null)
    setMobileOpen(false)
  }, [location.pathname, location.search])

  const enter = (label) => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setActiveMenu(label), 120)
  }
  const leave = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setActiveMenu(null), 150)
  }

  const menu = mainNav.find((n) => n.label === activeMenu && n.columns)
  const bagCount = cart?.summary.itemCount ?? 0
  const wishCount = wishlist?.length ?? 0

  return (
    <header className="relative z-20 border-b border-line bg-white" onMouseLeave={leave}>
      <div className="container-page relative flex h-[62px] items-center lg:h-[102px] lg:items-end">
        <button type="button" className="mr-2 lg:hidden" aria-label="Mở menu" onClick={() => setMobileOpen(true)}>
          <Menu className="size-7" />
        </button>

        <Link to="/" className="lg:absolute lg:top-1/2 lg:-translate-y-1/2" aria-label="Trang chủ">
          <Logo className="h-7 w-24 lg:h-10 lg:w-32" />
        </Link>

        {/* Utility links */}
        <nav aria-label="Liên kết tiện ích" className="absolute top-0 right-4 hidden h-10 items-center gap-6 text-[14px] md:right-8 lg:flex xl:right-12">
          {utilityNav.map(([label, href]) => (
            <Link key={label} to={href} className="hover:underline">
              {label}
            </Link>
          ))}
          {!me && (
            <button type="button" onClick={() => openAuth()} className="hover:underline">
              tham gia {brand.clubName}
            </button>
          )}
          <span className="relative inline-flex h-3.5 w-5 items-center justify-center bg-[#da251d] text-[9px] leading-none text-[#ffcd00]" aria-label="Việt Nam" role="img">
            ★
          </span>
        </nav>

        {/* Main nav */}
        <nav aria-label="Danh mục chính" className="mx-auto hidden h-[62px] items-stretch lg:flex">
          {mainNav.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              onMouseEnter={() => (item.columns ? enter(item.label) : enter(null))}
              onFocus={() => item.columns && setActiveMenu(item.label)}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center px-3.5 text-[15px] tracking-[0.06em] uppercase',
                  item.bold ? 'font-bold' : 'font-normal',
                  (activeMenu === item.label || isActive) && 'after:absolute after:inset-x-3.5 after:bottom-0 after:h-[3px] after:bg-ink',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:absolute lg:right-8 lg:bottom-[10px] xl:right-12">
          <SearchBox className="mr-2 hidden w-[240px] md:block" />
          <div className="relative">
            <IconButton label={me ? 'Tài khoản' : 'Đăng nhập'} onClick={() => (me ? openClub() : openAuth())}>
              <UserIcon />
            </IconButton>
            {me && (
              <span className="pointer-events-none absolute -top-0.5 right-0 flex size-[18px] items-center justify-center rounded-full bg-warning text-[11px] font-bold" aria-hidden>
                {me.loyalty.level}
              </span>
            )}
          </div>
          <IconButton label={`Yêu thích (${wishCount})`} to="/wishlist" badge={wishCount}>
            <HeartIcon filled={wishCount > 0} />
          </IconButton>
          <IconButton label={`Giỏ hàng (${bagCount} sản phẩm)`} to="/cart" badge={bagCount}>
            <BagIcon />
          </IconButton>
        </div>
      </div>

      {menu && <MegaMenu item={menu} onMouseEnter={() => clearTimeout(closeTimer.current)} onNavigate={() => setActiveMenu(null)} />}

      {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} me={me} openAuth={openAuth} />}
    </header>
  )
}

function MobileMenu({ onClose, me, openAuth }) {
  const [sub, setSub] = useState(null)
  const item = mainNav.find((n) => n.label === sub)
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white lg:hidden">
      <div className="flex h-[62px] items-center justify-between border-b border-line px-4">
        {item ? (
          <button type="button" onClick={() => setSub(null)} className="ds-label">
            ← {item.label}
          </button>
        ) : (
          <Logo className="h-7 w-24" />
        )}
        <button type="button" onClick={onClose} aria-label="Đóng menu">
          <X className="size-7" />
        </button>
      </div>
      <div className="p-4">
        <SearchBox className="mb-4" />
      </div>
      <ul className="px-4">
        {item
          ? item.columns.map((col) => (
              <li key={col.title} className="border-b border-line py-3">
                <Link to={col.href} className="block font-bold uppercase">
                  {col.title}
                </Link>
                <ul className="mt-2 space-y-2 pl-2">
                  {col.links.map(([l, h]) => (
                    <li key={l}>
                      <Link to={h}>{l}</Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))
          : mainNav.map((n) => (
              <li key={n.label} className="border-b border-line">
                {n.columns ? (
                  <button type="button" onClick={() => setSub(n.label)} className="flex w-full items-center justify-between py-4 text-lg font-bold tracking-[0.05em] uppercase">
                    {n.label} <ChevronRight className="size-5" />
                  </button>
                ) : (
                  <Link to={n.href} className="block py-4 text-lg tracking-[0.05em] uppercase">
                    {n.label}
                  </Link>
                )}
              </li>
            ))}
      </ul>
      {!item && (
        <ul className="mt-4 space-y-3 px-4 pb-10 text-sm">
          {!me && (
            <li>
              <button type="button" onClick={() => (onClose(), openAuth())} className="underline">
                Đăng nhập / tham gia {brand.clubName}
              </button>
            </li>
          )}
          {me && (
            <li>
              <Link to="/account">Tài khoản của tôi</Link>
            </li>
          )}
          {utilityNav.map(([l, h]) => (
            <li key={l}>
              <Link to={h}>{l}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
