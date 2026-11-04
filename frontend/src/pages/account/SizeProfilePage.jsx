import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { AccountSection } from '@/components/account/AccountSection'
import { BodyFigure, BraIcon, CapIcon, FootFigure, PantsIcon, ShoeIcon, TeeIcon } from '@/components/account/SizeFigures'
import { useMe } from '@/hooks/useAuth'
import { useUpdateSizeProfile } from '@/hooks/useAccount'
import { useUI } from '@/store/ui'
import { cn } from '@/utils/cn'

const APPAREL = ['2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL']
const SHOE = Array.from({ length: 21 }, (_, i) => String(4 + i * 0.5))

/**
 * Hợp đồng API chính thức có `top` và `shoe`; `headwear`, `bra`, `bottom` là trường mở rộng
 * (mock server lưu được, backend thật có thể bỏ qua).
 */
const CATEGORIES = [
  { key: 'headwear', name: 'mũ', Icon: CapIcon, sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { key: 'top', name: 'áo', Icon: TeeIcon, sizes: APPAREL },
  { key: 'bra', name: 'áo bra thể thao', Icon: BraIcon, sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { key: 'bottom', name: 'quần', Icon: PantsIcon, sizes: APPAREL },
  { key: 'shoe', name: 'giày', Icon: ShoeIcon, sizes: SHOE },
]

function SizeRow({ sizes, value, onSelect, label }) {
  const ref = useRef(null)
  // Cuộn size đang chọn vào giữa (dải size giày dài)
  useEffect(() => {
    const box = ref.current
    const el = box?.querySelector('[aria-checked="true"]')
    if (box && el) box.scrollLeft = el.offsetLeft - box.offsetLeft - box.clientWidth / 2 + el.clientWidth / 2
  }, [sizes])
  return (
    <div ref={ref} role="radiogroup" aria-label={label} className="scrollbar-none flex overflow-x-auto border-b-2 border-gray-200">
      {sizes.map((s) => {
        const on = s === value
        return (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onSelect(s)}
            className={cn('relative h-14 min-w-[68px] flex-1 shrink-0 px-2 text-[17px] transition-colors hover:text-ink', on ? 'font-semibold text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[3px] after:bg-ink' : 'text-gray-600')}
          >
            {s}
          </button>
        )
      })}
    </div>
  )
}

/** Hồ sơ size (ảnh #79, #109, #110). */
export default function SizeProfilePage() {
  const { data: me } = useMe()
  const update = useUpdateSizeProfile()
  const toast = useUI((s) => s.toast)
  const [activeKey, setActiveKey] = useState(null)
  const [savedKey, setSavedKey] = useState(null)

  const profile = me?.sizeProfile ?? {}
  const active = CATEGORIES.find((c) => c.key === activeKey)
  const value = active ? profile[active.key] : null

  const select = (size) => {
    setSavedKey(null)
    update.mutate(
      { [active.key]: size },
      {
        onSuccess: () => setSavedKey(active.key),
        onError: (err) => toast(err.message, 'error'),
      },
    )
  }

  return (
    <AccountSection showHelp={false} panelClassName="min-h-[720px]">
      <h1 className="sr-only">Hồ sơ size</h1>
      <div className="mx-auto flex max-w-[508px] flex-col items-center pt-4">
        <div className="min-h-[72px] text-center" aria-live="polite">
          {active ? (
            <>
              <p className="font-semibold">{active.key === 'shoe' ? 'Size giày tôi thường đi là' : `Size ${active.name} tôi thường mặc là`}</p>
              <p className="mt-1 font-display text-4xl font-extrabold">{value ?? '-'}</p>
            </>
          ) : (
            <p className="max-w-[460px] text-lg font-semibold text-gray-600">Bạn thường mặc size nào cho từng loại sản phẩm dưới đây?</p>
          )}
        </div>

        {active?.key === 'shoe' ? <FootFigure className="mt-6 h-[340px] w-auto" /> : <BodyFigure focus={active?.key} className="mt-6 h-[340px] w-auto" />}

        <div className="mt-8 grid w-full grid-cols-5 border-t border-l border-gray-300" role="group" aria-label="Loại sản phẩm">
          {CATEGORIES.map(({ key, name, Icon }) => {
            const on = key === activeKey
            const v = profile[key]
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                aria-label={`${name}: ${v ?? 'chưa chọn'}`}
                onClick={() => {
                  setActiveKey(key)
                  setSavedKey(null)
                }}
                className={cn(
                  'relative -mt-px -ml-px flex h-[106px] flex-col items-center justify-center gap-3 border transition-colors',
                  on ? 'z-10 border-ink bg-ink text-white' : v ? 'z-[1] border-ink' : 'border-gray-300 hover:bg-gray-50',
                )}
              >
                <Icon className="size-8" />
                <span className="text-sm font-bold">{v ?? '-'}</span>
              </button>
            )
          })}
        </div>

        {active && (
          <div className="mt-8 w-full">
            <SizeRow sizes={active.sizes} value={value} onSelect={select} label={`Size ${active.name}`} />
            <p className={cn('mt-6 flex items-center gap-2 text-gray-600 transition-opacity', savedKey === active.key && !update.isPending ? 'opacity-100' : 'opacity-0')} role="status">
              <Check className="size-5" strokeWidth={1.5} aria-hidden />
              Đã lưu thay đổi của bạn
            </p>
          </div>
        )}
      </div>
    </AccountSection>
  )
}
