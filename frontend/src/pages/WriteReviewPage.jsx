import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, X } from 'lucide-react'
import { Button, EmptyState, Input, PageSpinner, Radio, Textarea } from '@/components/ui'
import { ScaleInput } from '@/components/review/ScaleInput'
import { COMFORT_LABELS, RATING_LABELS, StarInput } from '@/components/review/StarInput'
import { useMe } from '@/hooks/useAuth'
import { useProduct } from '@/hooks/useCatalog'
import { useCreateReview } from '@/hooks/useReviews'
import { useUI } from '@/store/ui'
import { cn } from '@/utils/cn'
import { brand } from '@/config/brand'

const MAX_PHOTO = 5 * 1024 * 1024
const pick = (msg) => z.number().int().min(1, msg).max(5)

const schema = z.object({
  rating: pick('Vui lòng chọn số sao'),
  recommend: z.enum(['yes', 'no'], { error: 'Vui lòng chọn Có hoặc Không' }),
  body: z.string().trim().min(10, 'Vui lòng viết ít nhất 10 ký tự').max(2000, 'Đánh giá không được vượt quá 2000 ký tự'),
  title: z.string().trim().min(1, 'Vui lòng nhập tiêu đề đánh giá').max(100, 'Tối đa 100 ký tự'),
  size: pick('Vui lòng chọn'),
  width: pick('Vui lòng chọn'),
  comfort: pick('Vui lòng chọn'),
  quality: pick('Vui lòng chọn'),
  nickname: z
    .string()
    .trim()
    .min(2, 'Vui lòng nhập biệt danh')
    .max(25, 'Tối đa 25 ký tự')
    .refine((v) => !v.includes('@'), 'Vui lòng không dùng địa chỉ email'),
})

// thứ tự field để cuộn tới lỗi đầu tiên
const FIELD_ORDER = ['rating', 'recommend', 'body', 'title', 'size', 'width', 'comfort', 'quality', 'nickname']

const REVIEW_TIPS = [
  'Nói rõ lý do bạn thích hay không thích - ví dụ: rất êm chân, màu đẹp, v.v.',
  'Tránh nhắc đến giá hoặc khuyến mãi - những thông tin này chỉ mang tính tạm thời và có thể không còn đúng khi người khác đọc đánh giá của bạn.',
  'Viết ngắn gọn - chi tiết là tốt, nhưng hãy giữ độ dài vừa phải để người đọc không ngại.',
  'Dùng ngôn từ lịch sự - dù bạn yêu thích sản phẩm đến đâu, đừng dùng những từ bạn sẽ không nói trước mặt bà mình!',
  'Tập trung vào sản phẩm - nếu bạn gặp vấn đề không liên quan đến sản phẩm (ví dụ: thời gian giao hàng, giá), vui lòng liên hệ bộ phận chăm sóc khách hàng để được hỗ trợ.',
]
const PHOTO_TIPS = [
  'Bạn có thể tải ảnh lên ở định dạng PNG và JPEG',
  'Dung lượng ảnh tối đa là 5 MB',
  'Chỉ tải lên những ảnh mà bạn sở hữu bản quyền',
  'Không chấp nhận ảnh phản cảm hoặc không phù hợp',
]

function experiencePrompt(rating) {
  if (rating >= 4) return 'Bạn thích điều gì ở sản phẩm này?'
  if (rating && rating <= 2) return 'Bạn không hài lòng điều gì ở sản phẩm này?'
  return 'Chia sẻ thêm về sản phẩm cho mọi người. Chất lượng thế nào? Có thoải mái không?'
}

function ProductBox({ product, className }) {
  return (
    <div className={cn('flex min-h-[200px] items-center gap-6 bg-image px-8 py-8 sm:px-16 lg:min-h-[262px]', className)}>
      <h2 className="font-display max-w-[200px] text-2xl leading-[1.15] font-extrabold uppercase sm:text-[32px]">{product.name}</h2>
      <img src={product.image.url} alt={product.image.alt} className="w-[45%] max-w-[240px] object-contain [mask-image:radial-gradient(closest-side,#000_72%,transparent)]" />
    </div>
  )
}

function Tips({ title, items }) {
  return (
    <section>
      <h3 className="text-[17px] font-bold">{title}</h3>
      <ul className="mt-6 list-disc space-y-0 pl-6 text-[15px] leading-[1.65]">
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </section>
  )
}

/** Upload ảnh cục bộ (preview + tên file + nút ×), ảnh #45–#46. */
function PhotoUpload({ file, onChange }) {
  const inputRef = useRef(null)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (!file) return setPreview(null)
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const onPick = (e) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    if (!['image/png', 'image/jpeg'].includes(f.type)) return setError('Vui lòng tải lên ảnh PNG hoặc JPEG')
    if (f.size > MAX_PHOTO) return setError('Dung lượng ảnh tối đa là 5 MB')
    setError(null)
    onChange(f)
  }

  return (
    <div>
      <p className="mb-4 text-[15px] font-bold">Bạn có muốn thêm ảnh không?</p>
      {file && (
        <div className="mb-4 flex items-center gap-4">
          {preview && <img src={preview} alt="" className="size-14 bg-image object-cover" />}
          <span className="min-w-0 flex-1 truncate text-[15px]">{file.name}</span>
          <button type="button" onClick={() => onChange(null)} aria-label={`Xóa ${file.name}`} className="p-1 hover:opacity-60">
            <X className="size-6" strokeWidth={2} />
          </button>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/png,image/jpeg" className="sr-only" tabIndex={-1} onChange={onPick} aria-hidden />
      <Button variant="outline" fullWidth onClick={() => inputRef.current?.click()} className="h-16 justify-between px-5 text-sm">
        <span className="flex w-full items-center justify-between">
          {file ? 'Đổi ảnh' : 'Tải ảnh lên'} <Plus className="size-7" strokeWidth={1.5} aria-hidden />
        </span>
      </Button>
      {error && (
        <p role="alert" className="mt-2 text-xs text-sale">
          {error}
        </p>
      )}
    </div>
  )
}

export default function WriteReviewPage() {
  const { slug } = useParams()
  const { data: product, isLoading, isError } = useProduct(slug)

  if (isLoading) return <PageSpinner />
  if (isError || !product)
    return (
      <div className="container-content">
        <EmptyState
          title="Không tìm thấy sản phẩm"
          description="Sản phẩm bạn muốn đánh giá có thể không còn kinh doanh."
          action={
            <Button to="/" arrow>
              Tiếp tục mua sắm
            </Button>
          }
        />
      </div>
    )
  return <ReviewForm key={product.id} product={product} />
}

function ReviewForm({ product }) {
  const navigate = useNavigate()
  const toast = useUI((s) => s.toast)
  const { data: me } = useMe()
  const create = useCreateReview(product.id)
  const [photo, setPhoto] = useState(null)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    shouldFocusError: false,
    defaultValues: { rating: 0, recommend: undefined, body: '', title: '', size: 0, width: 0, comfort: 0, quality: 0, nickname: '' },
  })

  useEffect(() => {
    document.title = `Viết đánh giá - ${product.name} | ${brand.name}`
  }, [product.name])

  const rating = watch('rating')
  const titleVal = watch('title')
  const nicknameVal = watch('nickname')

  const scrollToFirstError = (errs) => {
    const key = FIELD_ORDER.find((k) => errs[k])
    const el = key && document.querySelector(`[data-field="${key}"]`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.querySelector('input, textarea, button')?.focus({ preventScroll: true })
    }
  }

  const onValid = async (v) => {
    try {
      await create.mutateAsync({
        rating: v.rating,
        recommend: v.recommend === 'yes',
        title: v.title,
        body: v.body,
        nickname: v.nickname,
        attributes: { size: v.size, width: v.width, comfort: v.comfort, quality: v.quality },
        // ảnh chỉ preview cục bộ; BE nhận URL sau khi có API upload
        ...(photo ? { photo: { name: photo.name, type: photo.type, size: photo.size } } : {}),
      })
      navigate('/review/thanks', { state: { productName: product.name, image: product.image, slug: product.slug } })
    } catch (e) {
      if (e?.fields) {
        Object.entries(e.fields).forEach(([k, message]) => setError(k, { message }))
        scrollToFirstError(e.fields)
      } else toast(e?.message || 'Không thể gửi đánh giá. Vui lòng thử lại.', 'error')
    }
  }

  const err = (k) => errors[k]?.message

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-10 md:px-8 lg:py-24">
      <ProductBox product={product} className="mb-10 lg:hidden" />
      <div className="lg:grid lg:grid-cols-[minmax(0,540px)_minmax(0,610px)] lg:justify-between lg:gap-16">
        <form onSubmit={handleSubmit(onValid, scrollToFirstError)} noValidate className="max-w-[540px]">
          <h1 className="ds-h1 lg:text-[40px]">Viết đánh giá của bạn</h1>

          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <StarInput name="rating" label="Đánh giá chung của bạn" required value={field.value} onChange={field.onChange} labels={RATING_LABELS} error={err('rating')} className="mt-14" />
            )}
          />

          <fieldset className="mt-14" data-field="recommend" aria-invalid={Boolean(errors.recommend) || undefined}>
            <legend className="mb-5 text-[15px] font-bold">
              Bạn có giới thiệu sản phẩm này cho người khác không?<span className="ml-1 text-sale">*</span>
            </legend>
            <div className="flex gap-4">
              <Radio label="Có" value="yes" {...register('recommend')} className="[&>span:first-child]:size-[30px] [&_span_span]:inset-[8px]" />
              <Radio label="Không" value="no" {...register('recommend')} className="[&>span:first-child]:size-[30px] [&_span_span]:inset-[8px]" />
            </div>
            {errors.recommend && <p className="mt-2 text-sm text-sale">{err('recommend')}</p>}
          </fieldset>

          <section className="mt-14">
            <h2 className="text-[15px] font-bold">Chia sẻ trải nghiệm của bạn</h2>
            <p className="mt-6 text-[15px] leading-relaxed">{experiencePrompt(rating)}</p>
            <div data-field="body" className="mt-6">
              <Textarea label="Đánh giá của bạn" rows={6} maxLength={2000} {...register('body')} error={err('body')} />
            </div>
            <p className="mt-14 text-[15px] leading-relaxed">Tóm tắt cảm nhận của bạn trong một câu. Ví dụ: Món đồ đáng mua nhất từ trước đến nay.</p>
            <div data-field="title" className="mt-6">
              <Input label="Tiêu đề đánh giá" required maxLength={100} {...register('title')} error={err('title')} valid={!errors.title && titleVal?.trim().length > 0} />
            </div>
          </section>

          <Controller
            name="size"
            control={control}
            render={({ field }) => <ScaleInput name="size" label="Bạn thấy size giày thế nào?" required value={field.value} onChange={field.onChange} error={err('size')} className="mt-14" />}
          />
          <Controller
            name="width"
            control={control}
            render={({ field }) => (
              <ScaleInput
                name="width"
                label="Bạn thấy độ rộng thế nào?"
                required
                value={field.value}
                onChange={field.onChange}
                ends={['Quá hẹp', 'Vừa vặn', 'Quá rộng']}
                valueLabels={['Quá hẹp', 'Hơi hẹp', 'Vừa vặn', 'Hơi rộng', 'Quá rộng']}
                error={err('width')}
                className="mt-14"
              />
            )}
          />
          <Controller
            name="comfort"
            control={control}
            render={({ field }) => (
              <StarInput name="comfort" label="Bạn đánh giá độ thoải mái thế nào?" required value={field.value} onChange={field.onChange} labels={COMFORT_LABELS} error={err('comfort')} className="mt-14" />
            )}
          />
          <Controller
            name="quality"
            control={control}
            render={({ field }) => <StarInput name="quality" label="Còn chất lượng thì sao?" required value={field.value} onChange={field.onChange} labels={RATING_LABELS} error={err('quality')} className="mt-14" />}
          />

          <div className="mt-14">
            <PhotoUpload file={photo} onChange={setPhoto} />
          </div>

          <section className="mt-14">
            <h2 className="text-[15px] font-bold">Thông tin của bạn</h2>
            <p className="mt-6 text-[15px] leading-relaxed">Ví dụ: Minh27. Hãy bảo vệ quyền riêng tư của bạn, đừng dùng họ tên đầy đủ hoặc địa chỉ email.</p>
            <div data-field="nickname" className="mt-6">
              <Input
                label="Biệt danh"
                required
                autoComplete="nickname"
                maxLength={25}
                {...register('nickname')}
                error={err('nickname')}
                valid={!errors.nickname && nicknameVal?.trim().length >= 2}
              />
            </div>
            {me?.email && (
              <p className="mt-14 text-[15px] font-bold break-all">
                Email của bạn: <span>{me.email}</span>
              </p>
            )}
          </section>

          <p className="mt-16 text-[15px] leading-relaxed">
            Khi gửi đánh giá, bạn đồng ý với{' '}
            <a href="/help" className="ds-link">
              Điều khoản và Điều kiện
            </a>{' '}
            của chúng tôi
          </p>

          <Button type="submit" arrow loading={isSubmitting || create.isPending} className="mt-10 gap-6">
            Gửi đánh giá
          </Button>
        </form>

        <aside className="mt-16 space-y-14 lg:mt-0" aria-label="Hướng dẫn viết đánh giá">
          <ProductBox product={product} className="hidden lg:flex" />
          <Tips title="Cách viết một đánh giá hay" items={REVIEW_TIPS} />
          <Tips title="Cách chia sẻ ảnh đẹp" items={PHOTO_TIPS} />
        </aside>
      </div>
    </div>
  )
}
