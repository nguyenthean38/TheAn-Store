import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Baby,
  BicepsFlexed,
  Bike,
  CarFront,
  Check,
  CircleDot,
  Dumbbell,
  Flag,
  Footprints,
  Gamepad2,
  Goal,
  Mountain,
  MountainSnow,
  Shirt,
  Snowflake,
  Sparkles,
  TreePine,
  User,
  UserRound,
  Volleyball,
  Waves,
  Wind,
  Zap,
} from 'lucide-react'
import { Button, Checkbox } from '@/components/ui'
import { AccountSection, PanelTitle } from '@/components/account/AccountSection'
import { brand } from '@/config/brand'
import { useMe } from '@/hooks/useAuth'
import { useUpdatePreferences } from '@/hooks/useAccount'
import { useUI } from '@/store/ui'
import { cn } from '@/utils/cn'

const CATEGORIES = [
  { value: 'kids', label: 'Trẻ em', Icon: Baby },
  { value: 'men', label: 'Nam', Icon: User },
  { value: 'women', label: 'Nữ', Icon: UserRound },
  { value: 'unisex', label: 'Unisex', Icon: Shirt },
]

const Y3 = ({ className }) => (
  <span className={cn('font-display text-2xl font-extrabold tracking-tight', className)} aria-hidden>
    Y-3
  </span>
)

const INTERESTS = [
  { value: 'originals', label: 'Originals', Icon: Sparkles },
  { value: 'y-3', label: 'Y-3', Icon: Y3 },
  { value: 'gaming', label: 'Thể thao điện tử', Icon: Gamepad2 },
  { value: 'running', label: 'Chạy bộ', Icon: Footprints },
  { value: 'basketball', label: 'Bóng rổ', Icon: Volleyball },
  { value: 'soccer', label: 'Bóng đá', Icon: Goal },
  { value: 'training', label: 'Tập luyện', Icon: Dumbbell },
  { value: 'tennis', label: 'Quần vợt', Icon: CircleDot },
  { value: 'hiking', label: 'Đi bộ đường dài', Icon: Mountain },
  { value: 'climbing', label: 'Leo núi', Icon: MountainSnow },
  { value: 'trail-running', label: 'Chạy địa hình', Icon: TreePine },
  { value: 'mountain-biking', label: 'Đạp xe địa hình', Icon: Bike },
  { value: 'skiing', label: 'Trượt tuyết', Icon: Snowflake },
  { value: 'snowboarding', label: 'Trượt ván tuyết', Icon: Wind },
  { value: 'skateboarding', label: 'Trượt ván', Icon: Zap },
  { value: 'boxing', label: 'Quyền anh', Icon: BicepsFlexed },
  { value: 'swimming', label: 'Bơi lội', Icon: Waves },
  { value: 'golf', label: 'Golf', Icon: Flag },
  { value: 'motorsport', label: 'Đua xe', Icon: CarFront },
]

const sameSet = (a = [], b = []) => a.length === b.length && a.every((x) => b.includes(x))
const toggleIn = (list, v) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

function SectionHeading({ id, children }) {
  return (
    <h2 id={id} className="font-display text-[22px] font-extrabold uppercase">
      {children}
    </h2>
  )
}

/** Nút lưu: viền đen khi có thay đổi, xám khi chưa đổi (ảnh #105, #107). */
function SaveButton({ dirty, loading, onClick, children }) {
  return (
    <Button
      variant="outline"
      arrow
      size="lg"
      onClick={onClick}
      loading={loading}
      disabled={!dirty}
      className={cn('h-16 gap-6 px-5 text-sm tracking-[0.04em]', !dirty && 'border-gray-400 bg-gray-400 text-white')}
    >
      {children}
    </Button>
  )
}

function CheckMark() {
  return <Check className="absolute top-2 right-2 size-6" strokeWidth={2} aria-hidden />
}

/** Sở thích: newsletter, danh mục sản phẩm, môn thể thao (ảnh #78, #104–#108). */
export default function PreferencesPage() {
  const { data: me } = useMe()
  const update = useUpdatePreferences()
  const toast = useUI((s) => s.toast)
  const prefs = me?.preferences ?? { newsletter: false, productCategories: [], interests: [] }

  const [categories, setCategories] = useState(null) // null = dùng giá trị server
  const [interests, setInterests] = useState(null)
  const [saving, setSaving] = useState(null)
  const cats = categories ?? prefs.productCategories ?? []
  const ints = interests ?? prefs.interests ?? []
  const catsDirty = !sameSet(cats, prefs.productCategories)
  const intsDirty = !sameSet(ints, prefs.interests)

  const save = (field, patch, message, reset) => {
    setSaving(field)
    update.mutate(patch, {
      onSuccess: () => {
        reset?.()
        toast(message, 'success')
      },
      onError: (err) => toast(err.message, 'error'),
      onSettled: () => setSaving(null),
    })
  }

  return (
    <AccountSection>
      <PanelTitle title="Sở thích của bạn" description="Hãy thêm các môn thể thao bạn yêu thích để nhận nội dung, gợi ý và ưu đãi dành riêng cho bạn." />

      <section aria-labelledby="newsletter-title">
        <SectionHeading id="newsletter-title">Bản tin {brand.name}</SectionHeading>
        <Checkbox
          className="mt-6"
          checked={Boolean(prefs.newsletter)}
          disabled={saving === 'newsletter'}
          onChange={(e) =>
            save('newsletter', { newsletter: e.target.checked }, e.target.checked ? 'Bạn đã đăng ký nhận bản tin của chúng tôi.' : 'Bạn đã hủy đăng ký nhận bản tin.')
          }
          label={
            <span className="text-base leading-7">
              Đăng ký tham gia {brand.clubName} để nhận ưu đãi độc quyền, thông tin sản phẩm mới nhất, tin tức về các sự kiện sắp diễn ra và nhiều hơn nữa. Vui lòng xem Điều khoản &amp; Điều kiện,{' '}
              <Link to="/help" className="ds-link">
                Chính sách bảo mật
              </Link>{' '}
              và{' '}
              <Link to="/club" className="ds-link">
                Điều khoản &amp; Điều kiện của {brand.clubName}
              </Link>{' '}
              để biết thêm chi tiết. Tôi đồng ý nhận email tiếp thị được cá nhân hóa từ {brand.name}.
            </span>
          }
        />
        {prefs.newsletter && (
          <div className="mt-6 max-w-[926px] bg-image px-10 py-10" role="status">
            <p className="font-display text-[22px] font-extrabold uppercase">Bạn đang nhận bản tin của chúng tôi.</p>
            <p className="mt-4 text-lg">* Để hủy đăng ký, hãy bỏ chọn ô bên trên</p>
          </div>
        )}
      </section>

      <section aria-labelledby="categories-title" className="mt-16">
        <SectionHeading id="categories-title">Danh mục sản phẩm</SectionHeading>
        <div role="group" aria-labelledby="categories-title" className="mt-7 grid max-w-[880px] grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {CATEGORIES.map(({ value, label, Icon }) => {
            const on = cats.includes(value)
            return (
              <button
                key={value}
                type="button"
                aria-pressed={on}
                onClick={() => setCategories(toggleIn(cats, value))}
                className={cn('relative flex h-[146px] flex-col items-center justify-center gap-3 border transition-colors', on ? 'border-ink border-b-4' : 'border-gray-400 hover:border-ink')}
              >
                {on && <CheckMark />}
                <Icon className="size-9" strokeWidth={1.1} aria-hidden />
                <span className="text-[15px] font-semibold">{label}</span>
              </button>
            )
          })}
        </div>
        <div className="mt-5">
          <SaveButton dirty={catsDirty} loading={saving === 'categories'} onClick={() => save('categories', { productCategories: cats }, 'Đã lưu danh mục sản phẩm của bạn.', () => setCategories(null))}>
            Lưu
          </SaveButton>
        </div>
      </section>

      <section aria-labelledby="interests-title" className="mt-16">
        <SectionHeading id="interests-title">Môn thể thao yêu thích</SectionHeading>
        <p className="mt-6 text-base">Chọn các biểu tượng phù hợp với bạn để cá nhân hóa trải nghiệm mua sắm tại {brand.name}.</p>
        <ul className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-x-3 gap-y-6">
          {INTERESTS.map(({ value, label, Icon }) => {
            const on = ints.includes(value)
            return (
              <li key={value}>
                <button type="button" aria-pressed={on} onClick={() => setInterests(toggleIn(ints, value))} className="group flex w-full flex-col items-center text-center">
                  <span className={cn('relative flex aspect-square w-full items-center justify-center border transition-colors', on ? 'border-ink border-b-4' : 'border-gray-400 group-hover:border-ink')}>
                    {on && <CheckMark />}
                    <Icon className={cn('size-10', on ? 'text-ink' : 'text-gray-600')} strokeWidth={1.1} aria-hidden />
                  </span>
                  <span className={cn('mt-2 text-[15px] leading-tight', on ? 'text-ink' : 'text-gray-400')}>{label}</span>
                </button>
              </li>
            )
          })}
        </ul>
        <div className="mt-10 border-t-4 border-ink pt-5">
          <SaveButton dirty={intsDirty} loading={saving === 'interests'} onClick={() => save('interests', { interests: ints }, 'Đã cập nhật môn thể thao yêu thích của bạn.', () => setInterests(null))}>
            Cập nhật sở thích
          </SaveButton>
        </div>
      </section>
    </AccountSection>
  )
}
