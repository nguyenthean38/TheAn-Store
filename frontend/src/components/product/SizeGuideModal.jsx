import { useId, useState } from 'react'
import { Footprints } from 'lucide-react'
import { Modal } from '@/components/ui'
import { cn } from '@/utils/cn'
import { brand } from '@/config/brand'

/* Bảng size giày (người lớn). Chiều dài gót–mũi (cm) theo từng size US nam. */
const US_MEN = [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 16, 17, 18]
const HEEL_TOE_CM = [22.1, 22.5, 22.9, 23.3, 23.8, 24.2, 24.6, 25.1, 25.5, 25.9, 26.3, 26.7, 27.1, 27.6, 28, 28.4, 28.8, 29.3, 29.7, 30.1, 30.5, 31, 31.4, 32.2, 33.1, 33.9]

/** EU đi theo bước 2/3 mỗi nửa size → hiển thị dạng "36 2/3". */
function euLabel(halfSteps) {
  const thirds = 108 + halfSteps * 2 // 36 * 3 = 108
  const whole = Math.floor(thirds / 3)
  const rest = thirds % 3
  return rest ? `${whole} ${rest}/3` : String(whole)
}

const COLUMNS = US_MEN.map((men, i) => {
  const h = Math.round((men - 4) * 2)
  const cm = HEEL_TOE_CM[i]
  return {
    men: String(men),
    women: String(men + 1),
    eu: euLabel(h),
    uk: String(men - 0.5),
    jp: String(220 + h * 5),
    cm: `${cm.toFixed(1)} cm`,
    inch: `${(cm / 2.54).toFixed(1)}"`,
  }
})

const ROWS = [
  { key: 'men', label: 'US - Nam' },
  { key: 'women', label: 'US - Nữ' },
  { key: 'eu', label: 'EU' },
  { key: 'uk', label: 'UK' },
  { key: 'jp', label: 'JP' },
]

const MEASURE_STEPS = [
  ['Chiều dài', 'Đo khoảng cách từ đầu ngón chân cái đến điểm ngoài cùng của gót chân.'],
  ['Tờ giấy', 'Đứng trên một tờ giấy, gót chân áp sát tường. Đánh dấu đầu ngón chân dài nhất.'],
  ['Đo', 'Đo từ tường đến điểm đánh dấu và so sánh kết quả với hàng gót–mũi trong bảng.'],
]

function Subhead({ children }) {
  return <h3 className="font-condensed text-[34px] leading-none font-medium tracking-[0.04em] uppercase italic sm:text-[40px]">{children}</h3>
}

/** Modal hướng dẫn chọn size (ảnh #57 inches, #59 cm). */
export function SizeGuideModal({ open, onClose }) {
  const titleId = useId()
  const [unit, setUnit] = useState('inch')
  const head = unit === 'inch' ? 'inch' : 'cm'
  const rows = unit === 'inch' ? [...ROWS, { key: 'cm', label: 'Gót–mũi (cm)' }] : ROWS

  return (
    <Modal open={open} onClose={onClose} size="xl" labelledBy={titleId} className="max-w-[960px]" bodyClassName="sm:px-6 sm:pt-7 sm:pb-8">
      <h2 id={titleId} className="font-display pr-10 text-[26px] leading-[1.1] font-extrabold uppercase sm:text-[36px]">
        Bảng size giày nam và nữ {brand.name}
      </h2>

      <section className="mt-14">
        <Subhead>Bảng size giày</Subhead>
        <div role="tablist" aria-label="Đơn vị đo" className="mt-5 inline-flex">
          {[
            ['inch', 'Inch'],
            ['cm', 'cm'],
          ].map(([v, l]) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={unit === v}
              onClick={() => setUnit(v)}
              className={cn('relative h-16 w-[136px] border border-gray-200 text-[15px] -ml-px first:ml-0', unit === v ? 'font-bold after:absolute after:inset-x-0 after:-bottom-px after:h-[3px] after:bg-ink' : 'text-gray-400 hover:text-ink')}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="mt-3 overflow-x-auto" tabIndex={0} role="region" aria-label="Bảng size, cuộn ngang để xem thêm">
          <table className="w-max min-w-full border-collapse text-center text-[15px]">
            <thead>
              <tr className="bg-ink text-white">
                <th scope="row" className="sticky left-0 z-10 min-w-[190px] bg-ink px-6 py-5 font-bold">
                  {unit === 'inch' ? 'Gót–mũi (inch)' : 'Gót–mũi'}
                </th>
                {COLUMNS.map((c) => (
                  <th key={c.men} scope="col" className="min-w-[152px] px-4 py-5 font-bold whitespace-nowrap">
                    {c[head]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key}>
                  <th scope="row" className="sticky left-0 z-10 border-r border-ink bg-white px-6 py-5 font-bold whitespace-nowrap">
                    {r.label}
                  </th>
                  {COLUMNS.map((c, i) => (
                    <td key={c.men} className={cn('px-4 py-5 whitespace-nowrap', i % 2 === 0 && 'bg-gray-100')}>
                      {c[r.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-[15px] text-gray-400">Cuộn ngang để xem thêm.</p>
      </section>

      <section className="mt-16">
        <Subhead>Phân vân giữa hai size?</Subhead>
        <p className="mt-4 text-[15px] leading-relaxed">
          Muốn đi ôm chân, hãy chọn nhỏ hơn một size.
          <br />
          Muốn đi rộng rãi, hãy chọn lớn hơn một size.
        </p>
      </section>

      <section className="mt-16">
        <Subhead>Cách đo chân</Subhead>
        <p className="mt-4 text-[15px] leading-relaxed">Làm theo các bước đơn giản sau để chọn đúng size. Để có kết quả chính xác nhất, hãy đo chân vào cuối ngày.</p>
        <div className="mt-4 grid gap-8 bg-gray-100 p-8 sm:grid-cols-2">
          <div className="flex items-center justify-center">
            <Footprints className="size-40 text-gray-400" strokeWidth={0.75} aria-hidden />
          </div>
          <ol className="space-y-4 text-[15px] leading-relaxed">
            {MEASURE_STEPS.map(([t, d], i) => (
              <li key={t}>
                <span className="font-bold">
                  {i + 1}. {t}
                </span>
                : {d}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </Modal>
  )
}
