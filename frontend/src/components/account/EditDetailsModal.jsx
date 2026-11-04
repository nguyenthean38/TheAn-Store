import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check } from 'lucide-react'
import { Button, Input, Modal, Radio } from '@/components/ui'
import { useUpdateMe } from '@/hooks/useAccount'
import { useUI } from '@/store/ui'

export const GENDERS = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
]

const schema = z
  .object({
    firstName: z.string().trim().min(1, 'Vui lòng nhập tên').max(50),
    lastName: z.string().trim().min(1, 'Vui lòng nhập họ').max(50),
    mm: z.string().regex(/^(0?[1-9]|1[0-2])$/, 'Tháng không hợp lệ'),
    dd: z.string().regex(/^(0?[1-9]|[12]\d|3[01])$/, 'Ngày không hợp lệ'),
    yyyy: z.string().regex(/^(19|20)\d{2}$/, 'Năm không hợp lệ'),
    gender: z.string().nullable().optional(),
  })
  .superRefine((v, ctx) => {
    const d = new Date(Number(v.yyyy), Number(v.mm) - 1, Number(v.dd))
    const realDate = d.getMonth() === Number(v.mm) - 1 && d.getDate() === Number(v.dd)
    if (!realDate) return ctx.addIssue({ code: 'custom', path: ['dd'], message: 'Vui lòng nhập ngày hợp lệ' })
    if (d > new Date()) return ctx.addIssue({ code: 'custom', path: ['yyyy'], message: 'Ngày sinh không thể ở tương lai' })
    const age = (Date.now() - d.getTime()) / (365.25 * 864e5)
    if (age < 13) ctx.addIssue({ code: 'custom', path: ['yyyy'], message: 'Bạn phải từ 13 tuổi trở lên' })
  })

function splitDob(iso) {
  if (!iso) return { mm: '', dd: '', yyyy: '' }
  const [y, m, d] = iso.slice(0, 10).split('-')
  return { mm: String(Number(m)), dd: String(Number(d)), yyyy: y }
}

function EditDetailsForm({ me, onClose }) {
  const update = useUpdateMe()
  const toast = useUI((s) => s.toast)
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, touchedFields },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: { firstName: me.firstName ?? '', lastName: me.lastName ?? '', ...splitDob(me.dateOfBirth), gender: me.gender ?? null },
  })
  const v = watch()
  // Tick xanh khi trường có giá trị và không lỗi (ảnh #99)
  const ok = (name) => Boolean(v[name]?.trim?.()) && !errors[name] && (dirtyFields[name] || touchedFields[name] || Boolean(me[name]))
  const dobOk = ['dd', 'mm', 'yyyy'].every((k) => v[k] && !errors[k])
  const dobError = errors.dd?.message || errors.mm?.message || errors.yyyy?.message

  const onSubmit = (values) =>
    update.mutate(
      {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        dateOfBirth: `${values.yyyy}-${values.mm.padStart(2, '0')}-${values.dd.padStart(2, '0')}`,
        gender: values.gender || null,
      },
      {
        onSuccess: () => {
          toast('Đã cập nhật thông tin của bạn.', 'success')
          onClose()
        },
        onError: (err) => toast(err.message, 'error'),
      },
    )

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <Input label="Tên" required autoComplete="given-name" {...register('firstName')} error={errors.firstName?.message} valid={ok('firstName')} />
      <Input label="Họ" required autoComplete="family-name" {...register('lastName')} error={errors.lastName?.message} valid={ok('lastName')} />

      <fieldset>
        <legend className="ds-h3 mb-4 text-xl lg:text-[22px]">Ngày sinh</legend>
        <div className="flex items-center gap-4">
          {/* Thứ tự ngày / tháng / năm theo cách viết của Việt Nam */}
          <div className="grid flex-1 grid-cols-3 gap-4">
            <Input label="Ngày" required inputMode="numeric" maxLength={2} autoComplete="bday-day" {...register('dd')} error={errors.dd ? ' ' : undefined} />
            <Input label="Tháng" required inputMode="numeric" maxLength={2} autoComplete="bday-month" {...register('mm')} error={errors.mm ? ' ' : undefined} />
            <Input label="Năm" required inputMode="numeric" maxLength={4} autoComplete="bday-year" {...register('yyyy')} error={errors.yyyy ? ' ' : undefined} />
          </div>
          <Check className={dobOk ? 'size-6 text-success' : 'invisible size-6'} aria-hidden />
        </div>
        {dobError && (
          <p className="mt-1.5 text-xs text-sale" role="alert">
            {dobError}
          </p>
        )}
      </fieldset>

      <fieldset>
        <legend className="ds-h3 mb-4 text-xl lg:text-[22px]">Giới tính</legend>
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          {GENDERS.map((g) => (
            <Radio key={g.value} value={g.value} label={g.label} {...register('gender')} />
          ))}
        </div>
      </fieldset>

      <div className="space-y-6 pt-2">
        <Button type="submit" arrow fullWidth size="lg" loading={update.isPending}>
          Cập nhật thông tin
        </Button>
        <Button variant="outline" arrow fullWidth size="lg" onClick={onClose}>
          Hủy
        </Button>
      </div>
    </form>
  )
}

/** Modal "SỬA THÔNG TIN CỦA BẠN" (ảnh #98, #99). */
export function EditDetailsModal({ open, onClose, me }) {
  return (
    <Modal open={open} onClose={onClose} title="Sửa thông tin của bạn" size="lg" bodyClassName="sm:px-11 sm:py-8" className="[&_h2]:text-[30px] lg:[&_h2]:text-[40px]">
      {me && <EditDetailsForm me={me} onClose={onClose} />}
    </Modal>
  )
}
