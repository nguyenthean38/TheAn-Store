import { Input, Select } from '@/components/ui'
import { US_STATES } from './usStates'

/**
 * Nhóm ô địa chỉ (First name, Last name, Street, City, State, ZIP, Phone) gắn với react-hook-form.
 * `prefix` = 'address' | 'billing' (đường dẫn trong form).
 */
export function AddressFields({ register, errors = {}, touched = {}, values = {}, prefix }) {
  const field = (name) => ({
    ...register(`${prefix}.${name}`),
    error: errors[name]?.message,
    valid: Boolean(touched[name] && !errors[name] && values[name]),
  })
  return (
    <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
      <Input label="Tên" required autoComplete={`${prefix === 'billing' ? 'billing' : 'shipping'} given-name`} {...field('firstName')} />
      <Input label="Họ" required autoComplete={`${prefix === 'billing' ? 'billing' : 'shipping'} family-name`} {...field('lastName')} />
      <Input label="Địa chỉ (số nhà, tên đường)" required autoComplete={`${prefix === 'billing' ? 'billing' : 'shipping'} street-address`} className="sm:col-span-2" {...field('street')} />
      <Input label="Thành phố" required autoComplete={`${prefix === 'billing' ? 'billing' : 'shipping'} address-level2`} className="sm:col-span-2" {...field('city')} />
      <Select
        label="Tỉnh/Bang *"
        placeholder=" "
        options={US_STATES}
        autoComplete={`${prefix === 'billing' ? 'billing' : 'shipping'} address-level1`}
        {...register(`${prefix}.state`)}
        error={errors.state?.message}
      />
      <Input label="Mã ZIP" required inputMode="numeric" autoComplete={`${prefix === 'billing' ? 'billing' : 'shipping'} postal-code`} {...field('zip')} />
      <Input label="Số điện thoại" required type="tel" autoComplete="tel" hint="Chúng tôi chỉ gọi khi cần trao đổi về đơn hàng của bạn." className="sm:col-span-2" {...field('phone')} />
      <p className="text-sm text-gray-600 sm:col-span-2">Quốc gia: Hoa Kỳ</p>
    </div>
  )
}
