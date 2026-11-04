import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Star, ThumbsDown, ThumbsUp } from 'lucide-react'
import { Button, Spinner } from '@/components/ui'
import { useReviews, useVoteReview } from '@/hooks/useReviews'
import { useUI } from '@/store/ui'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/format'
import { REVIEW_TOPICS } from './ReviewSummary'
import { ReviewStars } from './Stars'

const SORT_OPTIONS = [
  { value: 'relevant', label: 'Liên quan nhất' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'helpful', label: 'Hữu ích nhất' },
  { value: 'highest', label: 'Điểm cao nhất' },
  { value: 'lowest', label: 'Điểm thấp nhất' },
]

/** Dropdown "Sắp xếp" dạng listbox vuông (ảnh #51). */
function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = SORT_OPTIONS.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => !ref.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <p id="review-sort-label" className="mb-3 text-lg font-bold">
        Sắp xếp
      </p>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby="review-sort-label review-sort-value"
        onClick={() => setOpen((o) => !o)}
        className="flex h-[58px] min-w-[128px] items-center justify-between gap-2 border border-ink bg-white px-3.5 text-lg font-bold"
      >
        <span id="review-sort-value">{current?.label}</span>
        <ChevronDown className={cn('size-5 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
      {open && (
        <ul role="listbox" aria-labelledby="review-sort-label" className="absolute top-full right-0 z-20 w-full min-w-[128px] border border-t-0 border-ink bg-white">
          {SORT_OPTIONS.map((o) => (
            <li key={o.value} role="option" aria-selected={o.value === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(o.value)
                  setOpen(false)
                }}
                className={cn('block w-full border-t border-gray-200 px-3.5 py-3 text-left text-[15px] hover:bg-gray-100', o.value === value && 'bg-gray-100 font-bold')}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** Một review (ảnh #49): cột trái sao + nickname, cột phải tiêu đề, ngày, nội dung, Hữu ích? */
function ReviewItem({ review, votes, onVote, onReport }) {
  const counts = votes?.counts ?? review.helpful
  return (
    <article className="grid gap-4 border-b border-line py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-8">
      <div>
        <ReviewStars value={review.rating} size={20} />
        <p className="mt-4 font-bold">{review.nickname}</p>
        {review.verifiedPurchase && (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-gray-400">
            <Check className="size-4 text-success" aria-hidden /> Đã mua hàng
          </p>
        )}
      </div>
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <h4 className="text-[15px] font-bold">{review.title}</h4>
          <time dateTime={review.createdAt} className="shrink-0 text-sm text-gray-400">
            {formatDate(review.createdAt, { month: 'long', day: 'numeric', year: 'numeric' })}
          </time>
        </div>
        <p className="mt-3 text-[15px] leading-relaxed">{review.body}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px]">
          <span>Hữu ích?</span>
          <button
            type="button"
            onClick={() => onVote(review, 'up')}
            disabled={Boolean(votes?.voted)}
            aria-pressed={votes?.voted === 'up'}
            aria-label={`Có, đánh giá này hữu ích (${counts.up})`}
            className="inline-flex items-center gap-1.5 disabled:cursor-default"
          >
            <ThumbsUp className={cn('size-5', votes?.voted === 'up' && 'fill-ink')} strokeWidth={1.5} aria-hidden /> {counts.up}
          </button>
          <button
            type="button"
            onClick={() => onVote(review, 'down')}
            disabled={Boolean(votes?.voted)}
            aria-pressed={votes?.voted === 'down'}
            aria-label={`Không, đánh giá này không hữu ích (${counts.down})`}
            className="-ml-2 inline-flex items-center gap-1.5 disabled:cursor-default"
          >
            <ThumbsDown className={cn('size-5', votes?.voted === 'down' && 'fill-ink')} strokeWidth={1.5} aria-hidden /> {counts.down}
          </button>
          <button type="button" onClick={() => onReport(review)} className="ds-link ml-2">
            Báo cáo đánh giá
          </button>
        </div>
      </div>
    </article>
  )
}

/**
 * Danh sách review (ảnh #49–#52): lọc theo số sao, sắp xếp, "Hữu ích?", nút Xem thêm đánh giá.
 * `topic` (từ chip "Lọc đánh giá theo") lọc client-side theo từ khoá.
 */
export function ReviewList({ productId, topic, filtersId, className }) {
  const [ratings, setRatings] = useState([])
  const [sort, setSort] = useState('newest')
  const [votes, setVotes] = useState({})
  const toast = useUI((s) => s.toast)
  const vote = useVoteReview()

  const params = useMemo(() => ({ sort, rating: [...ratings].sort() }), [sort, ratings])
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useReviews(productId, params)

  const all = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data])
  const topicDef = REVIEW_TOPICS.find((t) => t.value === topic)
  const list = topicDef ? all.filter((r) => topicDef.keywords.some((k) => `${r.title} ${r.body}`.toLowerCase().includes(k))) : all

  const toggleRating = (n) => setRatings((rs) => (rs.includes(n) ? rs.filter((x) => x !== n) : [...rs, n]))

  const onVote = (review, dir) => {
    if (votes[review.id]?.voted) return
    const prev = votes[review.id]?.counts ?? review.helpful
    // cập nhật lạc quan, rồi đồng bộ với số liệu server
    setVotes((v) => ({ ...v, [review.id]: { voted: dir, counts: { ...prev, [dir]: prev[dir] + 1 } } }))
    vote.mutate(
      { id: review.id, vote: dir },
      {
        onSuccess: (counts) => setVotes((v) => ({ ...v, [review.id]: { voted: dir, counts } })),
        onError: () => {
          setVotes((v) => ({ ...v, [review.id]: { voted: null, counts: prev } }))
          toast('Không thể ghi nhận bình chọn của bạn. Vui lòng thử lại.', 'error')
        },
      },
    )
  }

  const onReport = () => toast('Cảm ơn bạn đã báo cho chúng tôi. Đội ngũ của chúng tôi sẽ xem xét báo cáo này.', 'success')

  const goToFilters = () => document.getElementById(filtersId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className={className}>
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-10">
        <div>
          <p id="star-filter-label" className="mb-3 text-lg font-bold">
            Lọc theo số sao
          </p>
          <div role="group" aria-labelledby="star-filter-label" className="flex flex-wrap gap-3">
            {[5, 4, 3, 2, 1].map((n) => {
              const active = ratings.includes(n)
              return (
                <button
                  key={n}
                  type="button"
                  aria-pressed={active}
                  aria-label={`Đánh giá ${n} sao`}
                  onClick={() => toggleRating(n)}
                  className={cn('flex h-[58px] min-w-[62px] items-center justify-center gap-1.5 border px-3 text-lg transition-colors', active ? 'border-ink bg-ink text-white' : 'border-gray-300 hover:border-ink')}
                >
                  <Star className="size-4 fill-current" aria-hidden /> {n}
                </button>
              )
            })}
          </div>
        </div>
        <SortDropdown value={sort} onChange={setSort} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner label="Đang tải đánh giá" />
        </div>
      ) : isError ? (
        <p className="py-10 text-[15px] text-sale">Hiện chưa thể tải đánh giá. Vui lòng thử lại sau.</p>
      ) : list.length === 0 ? (
        <p className="py-10 text-[15px]">Chưa có đánh giá nào phù hợp với bộ lọc của bạn.</p>
      ) : (
        <div>
          {list.map((r) => (
            <ReviewItem key={r.id} review={r} votes={votes[r.id]} onVote={onVote} onReport={onReport} />
          ))}
        </div>
      )}

      <div className="relative mt-10 flex min-h-[64px] flex-col items-center justify-center gap-4 sm:flex-row">
        {hasNextPage && (
          <Button variant="outline" onClick={() => fetchNextPage()} loading={isFetchingNextPage} className="h-16 gap-8 px-5">
            <span className="flex items-center gap-8">
              Xem thêm đánh giá <ChevronDown className="size-6" aria-hidden />
            </span>
          </Button>
        )}
        {filtersId && (
          <button type="button" onClick={goToFilters} className="ds-link text-[15px] sm:absolute sm:right-0">
            Đến bộ lọc
          </button>
        )}
      </div>
    </div>
  )
}
