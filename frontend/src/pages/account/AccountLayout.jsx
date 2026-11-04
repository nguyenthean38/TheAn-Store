import { Outlet, useLocation } from 'react-router-dom'
import { AccountHeader } from '@/components/account/AccountHeader'
import { useMe } from '@/hooks/useAuth'

/**
 * Khung khu vực tài khoản (ảnh #74, #75, #76).
 * - Feed / Account: lời chào + level + tabs, nội dung trên nền xám.
 * - Orders: chỉ tabs (ảnh #75).
 * - Chi tiết / huỷ đơn: trang trắng, không có tabs (ảnh #89, #92).
 */
export default function AccountLayout() {
  const { pathname } = useLocation()
  const { data: me } = useMe()
  const isOrderSubpage = /^\/account\/orders\/[^/]+/.test(pathname)
  const isOrders = /^\/account\/orders\/?$/.test(pathname)

  if (isOrderSubpage) return <Outlet />

  return (
    <div className="bg-surface">
      <AccountHeader me={me} showGreeting={!isOrders} />
      <Outlet />
    </div>
  )
}
