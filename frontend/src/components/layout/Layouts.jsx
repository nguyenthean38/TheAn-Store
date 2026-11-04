import { Suspense, useEffect } from 'react'
import { Link, Outlet, ScrollRestoration } from 'react-router-dom'
import { Button, Logo, PageSpinner } from '@/components/ui'
import { AuthModal } from '@/components/auth/AuthModal'
import { ClubDrawer } from '@/components/club/ClubDrawer'
import { AddedToBagModal } from '@/components/product/AddedToBagModal'
import { brand } from '@/config/brand'
import { useMe } from '@/hooks/useAuth'
import { useUI } from '@/store/ui'
import { AnnouncementBar, Header } from './Header'
import { CheckoutFooter, Footer } from './Footer'

/** Overlay toàn cục: modal đăng nhập, panel adiClub, modal "added to bag". */
function GlobalOverlays() {
  return (
    <>
      <AuthModal />
      <ClubDrawer />
      <AddedToBagModal />
    </>
  )
}

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">
        Bỏ qua đến nội dung
      </a>
      <AnnouncementBar />
      <Header />
      <main id="main" className="flex-1">
        <Suspense fallback={<PageSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <GlobalOverlays />
      <ScrollRestoration />
    </div>
  )
}

/** Layout tối giản cho checkout / xác nhận đơn (ảnh #119, #125). */
export function CheckoutLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-line">
        <div className="container-content flex h-[70px] items-center justify-between">
          <Link to="/" aria-label="Trang chủ">
            <Logo className="h-8 w-28" />
          </Link>
          <p className="hidden text-sm md:block">
            Cần hỗ trợ? <a href={`tel:${brand.supportPhone}`} className="ds-link">{brand.supportPhone}</a>
            <span className="ml-3 text-gray-600">{brand.supportHours}</span>
          </p>
        </div>
      </header>
      <main id="main" className="flex-1">
        <Suspense fallback={<PageSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      <CheckoutFooter />
      <GlobalOverlays />
      <ScrollRestoration />
    </div>
  )
}

/** Bảo vệ route cần đăng nhập: chưa login → mở modal adiClub. */
export function RequireAuth({ children }) {
  const { data: me, isLoading } = useMe()
  const openAuth = useUI((s) => s.openAuth)
  useEffect(() => {
    if (!isLoading && !me) openAuth()
  }, [isLoading, me, openAuth])
  if (isLoading) return <PageSpinner />
  if (!me)
    return (
      <div className="container-content py-20">
        <h1 className="ds-h1 mb-4">Đăng nhập để tiếp tục</h1>
        <p className="mb-8 text-gray-600">Đăng nhập hoặc tham gia {brand.clubName} để xem đơn hàng, voucher và thông tin tài khoản.</p>
        <Button arrow onClick={() => openAuth()}>
          Đăng nhập hoặc đăng ký
        </Button>
      </div>
    )
  return children
}
