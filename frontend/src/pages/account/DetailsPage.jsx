import { useState } from 'react'
import { AccountSection, PanelTitle } from '@/components/account/AccountSection'
import { EditDetailsModal, GENDERS } from '@/components/account/EditDetailsModal'
import { useMe } from '@/hooks/useAuth'
import { useUI } from '@/store/ui'

function SectionTitle({ children }) {
  return <h2 className="ds-h1 lg:text-[40px]">{children}</h2>
}

function EditLink({ onClick, label }) {
  return (
    <button type="button" onClick={onClick} className="ds-link-strong mt-4 text-sm tracking-[0.06em]" aria-label={label}>
      Sửa
    </button>
  )
}

/** "1990-05-12" → "12/05/1990" (không qua Date để tránh lệch múi giờ). */
function formatDob(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

/** Thông tin cá nhân (ảnh #76, #100). */
export default function DetailsPage() {
  const { data: me } = useMe()
  const openAuth = useUI((s) => s.openAuth)
  const toast = useUI((s) => s.toast)
  const [editing, setEditing] = useState(false)

  const name = [me?.firstName, me?.lastName].filter(Boolean).join(' ')
  const gender = GENDERS.find((g) => g.value === me?.gender)?.label

  return (
    <AccountSection>
      <PanelTitle title="Thông tin của tôi" description="Hãy cập nhật thông tin bên dưới để tài khoản của bạn luôn chính xác." />

      <section aria-labelledby="details-heading" className="pt-6">
        <SectionTitle>
          <span id="details-heading">Thông tin cá nhân</span>
        </SectionTitle>
        <dl className="mt-6 space-y-5 text-lg uppercase">
          <div>
            <dt className="sr-only">Họ tên</dt>
            <dd className={name ? '' : 'text-gray-600'}>{name || 'Họ tên'}</dd>
          </div>
          <div>
            <dt className="sr-only">Ngày sinh</dt>
            <dd className={me?.dateOfBirth ? '' : 'text-gray-600'}>{formatDob(me?.dateOfBirth) || 'Ngày sinh'}</dd>
          </div>
          <div>
            <dt className="sr-only">Giới tính</dt>
            <dd className={gender ? '' : 'text-gray-600'}>{gender || 'Giới tính'}</dd>
          </div>
        </dl>
        <EditLink onClick={() => setEditing(true)} label="Sửa thông tin của bạn" />
      </section>

      <section aria-labelledby="login-heading" className="pt-24">
        <SectionTitle>
          <span id="login-heading">Thông tin đăng nhập</span>
        </SectionTitle>
        <h3 className="mt-8 font-display text-[22px] font-extrabold uppercase">Email</h3>
        <p className="mt-6 text-lg break-all uppercase">{me?.email}</p>
        <EditLink onClick={() => toast('Để đổi địa chỉ email, vui lòng liên hệ bộ phận chăm sóc khách hàng.', 'info')} label="Sửa địa chỉ email" />

        <h3 className="mt-12 font-display text-[22px] font-extrabold uppercase">Mật khẩu</h3>
        <p className="mt-6 text-lg tracking-[0.04em]" aria-label="Mật khẩu đã được ẩn">
          ●●●●●●●●●●
        </p>
        <EditLink onClick={() => openAuth({ step: 'forgot', email: me?.email ?? '' })} label="Đổi mật khẩu" />
      </section>

      <EditDetailsModal open={editing} onClose={() => setEditing(false)} me={me} />
    </AccountSection>
  )
}
