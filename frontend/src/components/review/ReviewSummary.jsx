import { Button } from '@/components/ui'
import { cn } from '@/utils/cn'
import { ReviewStars, REVIEW_GREEN } from './Stars'

/** Chủ đề lọc review (client-side theo từ khoá, gồm cả tiếng Việt và tiếng Anh). */
export const REVIEW_TOPICS = [
  { value: 'runners', label: 'Cho người chạy bộ', keywords: ['chạy', 'đua', 'tempo', 'km', 'run', 'race', 'mile', 'jog'] },
  { value: 'comfort', label: 'Thoải mái', keywords: ['thoải mái', 'êm', 'đệm', 'mềm', 'comfort', 'comfy', 'cushion', 'soft'] },
  { value: 'satisfaction', label: 'Hài lòng', keywords: ['thích', 'yêu', 'tuyệt', 'hài lòng', 'nhất', 'love', 'best', 'favorite', 'happy', 'great', 'awesome'] },
  { value: 'weight', label: 'Trọng lượng', keywords: ['nhẹ', 'nặng', 'trọng lượng', 'light', 'weight', 'heavy'] },
  { value: 'purchase', label: 'Mua hàng', keywords: ['mua', 'đôi', 'đặt hàng', 'đơn', 'bought', 'buy', 'purchase', 'pair', 'order'] },
  { value: 'everyday', label: 'Mang hằng ngày', keywords: ['hằng ngày', 'hàng ngày', 'mỗi ngày', 'đi chơi', 'everyday', 'daily'] },
  { value: 'price', label: 'Giá cả', keywords: ['giá', 'tiền', 'đáng', 'rẻ', 'price', 'value', 'worth', 'money', 'cheap'] },
  { value: 'color', label: 'Màu sắc', keywords: ['màu', 'kiểu dáng', 'đẹp', 'phong cách', 'color', 'colour', 'look', 'style'] },
  { value: 'long', label: 'Độ bền', keywords: ['bền', 'lâu', 'đường dài', 'long', 'distance', 'durab', 'last'] },
  { value: 'fit', label: 'Độ vừa vặn', keywords: ['vừa', 'size', 'hẹp', 'rộng', 'chật', 'nhỏ', 'fit', 'narrow', 'wide', 'small', 'big', 'snug'] },
]

/**
 * Thanh đánh giá thuộc tính: track xám chia `segments` đoạn + vạch xanh tại vị trí giá trị (1..5).
 */
function AttributeBar({ title, value, labels }) {
  const segments = labels.length === 3 ? 3 : 2
  const pct = Math.max(0, Math.min(1, ((value ?? 3) - 1) / 4))
  const markerW = 12
  const nearest = Math.round(pct * (labels.length - 1)) // nhãn gần vạch nhất được tô đậm
  return (
    <div>
      <p className="mb-4 text-[15px] font-bold">{title}</p>
      <div className="relative h-1" role="img" aria-label={`${title}: ${labels[nearest]} (${(value ?? 3).toFixed(1)}/5)`}>
        <div className="flex h-full gap-1.5">
          {Array.from({ length: segments }, (_, i) => (
            <span key={i} className="h-full flex-1 bg-gray-200" />
          ))}
        </div>
        <span className={cn('absolute top-0 h-full bg-current', REVIEW_GREEN)} style={{ width: `${markerW}%`, left: `${pct * (100 - markerW)}%` }} />
      </div>
      <div className="mt-3 flex justify-between text-sm" aria-hidden>
        {labels.map((l, i) => (
          <span key={l} className={cn(i !== nearest && 'text-gray-400')}>
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Tóm tắt review (ảnh #38): điểm trung bình, nút Viết đánh giá, 4 thanh thuộc tính,
 * "Khách hàng nói gì" (AI) và chip "Lọc đánh giá theo".
 */
export function ReviewSummary({ summary, writeHref, topic, onTopicChange, filtersId, className }) {
  if (!summary) return null
  const attrs = summary.attributes ?? {}
  return (
    <div className={className}>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="font-display text-5xl leading-none font-extrabold">{summary.average.toFixed(1)}</span>
          <ReviewStars value={summary.average} size={20} />
          <span className="sr-only">{summary.count} đánh giá</span>
        </div>
        <Button to={writeHref} variant="outline" arrow className="h-[52px] gap-6 px-5">
          Viết đánh giá
        </Button>
      </div>

      {summary.count > 0 && (
        <div className="mt-10 grid gap-x-12 gap-y-8 border-b border-line pb-10 sm:grid-cols-2">
          <AttributeBar title="Độ thoải mái" value={attrs.comfort} labels={['Không thoải mái', 'Thoải mái']} />
          <AttributeBar title="Chất lượng" value={attrs.quality} labels={['Kém', 'Hoàn hảo']} />
          <AttributeBar title="Size" value={attrs.size} labels={['Quá nhỏ', 'Vừa vặn', 'Quá lớn']} />
          <AttributeBar title="Độ rộng" value={attrs.width} labels={['Quá hẹp', 'Vừa vặn', 'Quá rộng']} />
        </div>
      )}

      {summary.aiSummary?.length > 0 && (
        <section className="border-b border-line py-10" aria-labelledby="ai-summary-title">
          <h4 id="ai-summary-title" className="text-xl font-bold">
            Khách hàng nói gì
          </h4>
          <p className="mt-1 text-[15px] text-gray-400">Bản tóm tắt này được tạo bởi trí tuệ nhân tạo dựa trên đánh giá của khách hàng</p>
          <ul className="mt-8 list-disc gap-x-16 pl-6 text-[15px] leading-relaxed md:columns-2">
            {summary.aiSummary.map((s) => (
              <li key={s} className="break-inside-avoid-column pl-1">
                {s}
              </li>
            ))}
          </ul>
        </section>
      )}

      {onTopicChange && (
        <section id={filtersId} className="scroll-mt-6 pt-10" aria-labelledby="review-topics-title">
          <h4 id="review-topics-title" className="mb-4 text-lg font-bold">
            Lọc đánh giá theo
          </h4>
          <div className="flex flex-wrap gap-3">
            {REVIEW_TOPICS.map((t) => {
              const active = topic === t.value
              return (
                <button
                  key={t.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onTopicChange(active ? null : t.value)}
                  className={cn('h-14 border px-3.5 text-[15px] transition-colors', active ? 'border-ink bg-ink font-semibold text-white' : 'border-gray-300 hover:border-ink')}
                >
                  {t.label}
                </button>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
