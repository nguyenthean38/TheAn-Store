import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Checkbox, Input, Modal, Select } from '@/components/ui'
import { useCreateAddress, useUpdateAddress } from '@/hooks/useAccount'
import { useUI } from '@/store/ui'

export const US_STATES = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'], ['CO', 'Colorado'],
  ['CT', 'Connecticut'], ['DE', 'Delaware'], ['DC', 'District of Columbia'], ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'],
  ['ID', 'Idaho'], ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'],
  ['ME', 'Maine'], ['MD', 'Maryland'], ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'],
  ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'], ['NH', 'New Hampshire'], ['NJ', 'New Jersey'],
  ['NM', 'New Mexico'], ['NY', 'New York'], ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'],
  ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'], ['SD', 'South Dakota'], ['TN', 'Tennessee'],
  ['TX', 'Texas'], ['UT', 'Utah'], ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'], ['WV', 'West Virginia'],
  ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
].map(([value, label]) => ({ value, label }))

const schema = z.object({
  firstName: z.string().trim().min(1, 'Vui lòng nhập tên'),
  lastName: z.string().trim().min(1, 'Vui lòng nhập họ'),
  street: z.string().trim().min(3, 'Vui lòng nhập địa chỉ'),
  apt: z.string().trim().optional(),
  city: z.string().trim().min(1, 'Vui lòng nhập thành phố'),
  state: z.string().min(1, 'Vui lòng chọn bang'),
  zip: z.string().trim().regex(/^\d{5}(-\d{4})?$/, 'Vui lòng nhập mã ZIP hợp lệ (12345 hoặc 12345-1234)'),
  phone: z
    .string()
    .trim()
    .refine((v) => v.replace(/\D/g, '').length >= 10, 'Vui lòng nhập số điện thoại hợp lệ'),
  isDefault: z.boolean(),
})

function AddressForm({ address, forceDefault, onClose }) {
  const create = useCreateAddress()
  const update = useUpdateAddress()
  const toast = useUI((s) => s.toast)
  const [showApt, setShowApt] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      firstName: address?.firstName ?? '',
      lastName: address?.lastName ?? '',
      street: address?.street ?? '',
      apt: '',
      city: address?.city ?? '',
      state: address?.state ?? '',
      zip: address?.zip ?? '',
      phone: address?.phone ?? '',
      isDefault: address?.isDefault ?? forceDefault,
    },
  })

  const onSubmit = ({ apt, ...values }) => {
    // Hợp đồng API chỉ có `street` → ghép thông tin căn hộ vào cuối
    const payload = { ...values, street: apt ? `${values.street}, ${apt}` : values.street, country: 'US' }
    const opts = {
      onSuccess: () => {
        toast(address ? 'Đã cập nhật địa chỉ của bạn.' : 'Đã lưu địa chỉ của bạn.', 'success')
        onClose()
      },
      onError: (err) => toast(err.message, 'error'),
    }
    if (address) update.mutate({ id: address.id, ...payload }, opts)
    else create.mutate(payload, opts)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-x-0 gap-y-4 sm:grid-cols-2">
        <Input label="Tên" required autoComplete="given-name" {...register('firstName')} error={errors.firstName?.message} />
        <Input label="Họ" required autoComplete="family-name" {...register('lastName')} error={errors.lastName?.message} />
        <div className="sm:col-span-2">
          <Input label="Địa chỉ (số nhà, tên đường, hộp thư)" required autoComplete="address-line1" hint={errors.street ? undefined : 'VD: 123 Main Street'} {...register('street')} error={errors.street?.message} />
          {showApt ? (
            <Input label="Căn hộ, tòa nhà, số phòng…" autoComplete="address-line2" className="mt-4" {...register('apt')} />
          ) : (
            <button type="button" onClick={() => setShowApt(true)} className="ds-link mt-1 text-[15px]">
              Thêm thông tin địa chỉ
            </button>
          )}
        </div>
        <Input label="Thành phố/Thị trấn" required autoComplete="address-level2" {...register('city')} error={errors.city?.message} />
        <Select aria-label="Bang" placeholder="Bang *" options={US_STATES} autoComplete="address-level1" {...register('state')} error={errors.state?.message} selectClassName="font-semibold" />
        <Input label="Mã ZIP" required inputMode="numeric" autoComplete="postal-code" hint={errors.zip ? undefined : '12345 hoặc 12345-1234'} {...register('zip')} error={errors.zip?.message} />
      </div>
      <p className="mt-3 text-[15px]">
        <strong>Quốc gia:</strong> Hoa Kỳ
      </p>
      <Input
        label="Số điện thoại"
        required
        type="tel"
        autoComplete="tel"
        className="mt-6 sm:max-w-[604px]"
        hint={errors.phone ? undefined : 'VD: (123) 456-7890'}
        {...register('phone')}
        error={errors.phone?.message}
      />
      {!address?.isDefault && !forceDefault && <Checkbox label="Đặt làm địa chỉ mặc định" className="mt-6" {...register('isDefault')} />}
      <div className="mt-6 flex items-center gap-14">
        <Button type="submit" arrow loading={create.isPending || update.isPending}>
          Lưu
        </Button>
        <button type="button" onClick={onClose} className="ds-link-strong text-sm">
          Hủy
        </button>
      </div>
    </form>
  )
}

/** Modal "THÊM ĐỊA CHỈ MỚI" / "SỬA ĐỊA CHỈ" (ảnh #101). */
export function AddressFormModal({ open, onClose, address, forceDefault = false }) {
  return (
    <Modal open={open} onClose={onClose} title={address ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'} size="lg" bodyClassName="sm:px-7 sm:py-7" className="[&_h2]:mb-0 [&_h2]:text-[30px] lg:[&_h2]:text-[40px]">
      <AddressForm address={address} forceDefault={forceDefault} onClose={onClose} />
    </Modal>
  )
}
