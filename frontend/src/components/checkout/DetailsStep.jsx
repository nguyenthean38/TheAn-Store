import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Checkbox, Input, Spinner } from '@/components/ui'
import { useAddresses, useDeleteAddress } from '@/hooks/useAccount'
import { useUI } from '@/store/ui'
import { cn } from '@/utils/cn'
import { AddressFields } from './AddressFields'
import { detailsSchema, emptyAddress } from './schemas'
import { AddressLines, StepSection } from './StepSection'

const pickAddress = (a) => ({ firstName: a.firstName, lastName: a.lastName, street: a.street, city: a.city, state: a.state, zip: a.zip, phone: a.phone })

/** Bản thu gọn của bước Contact + Address sau khi hoàn tất. */
export function DetailsSummary({ details, onEdit }) {
  return (
    <>
      <StepSection title="Liên hệ" status="done" onEdit={onEdit}>
        <p className="text-[15px] break-all">{details.email}</p>
      </StepSection>
      <StepSection title="Địa chỉ" status="done" onEdit={onEdit}>
        <AddressLines address={details.shippingAddress} />
        <div className="mt-8 bg-gray-100 px-6 py-6 text-[15px] sm:px-10">
          {details.billingSameAsShipping ? (
            'Địa chỉ giao hàng và địa chỉ thanh toán giống nhau'
          ) : (
            <>
              <p className="mb-2 font-bold">Địa chỉ thanh toán</p>
              <AddressLines address={details.billingAddress} />
            </>
          )}
        </div>
      </StepSection>
    </>
  )
}

/** Card địa chỉ đã lưu (ảnh #119): viền đen, gạch dưới dày khi được chọn. */
function SavedAddressCard({ address, selected, onSelect, onEdit, onDelete, deleting }) {
  return (
    <div className={cn('relative border p-6 transition-colors', selected ? 'border-ink border-b-4' : 'border-gray-300 hover:border-ink')}>
      <label className="block cursor-pointer">
        <input type="radio" name="savedAddress" className="sr-only" checked={selected} onChange={onSelect} />
        <AddressLines address={address} />
      </label>
      <div className="mt-5 flex gap-12">
        <button type="button" onClick={onEdit} className="ds-link-strong" aria-label={`Sửa địa chỉ ${address.street}`}>
          Sửa
        </button>
        <button type="button" onClick={onDelete} disabled={deleting} className="ds-link-strong disabled:opacity-40" aria-label={`Xóa địa chỉ ${address.street}`}>
          Xóa
        </button>
      </div>
    </div>
  )
}

/**
 * Bước 1: CONTACT + ADDRESS (ảnh #119, #120).
 * Đã đăng nhập: email hiển thị dạng text + EDIT, địa chỉ đã lưu dạng card. Khách: form đầy đủ.
 */
export function DetailsStep({ me, initial, onSubmit }) {
  const openAuth = useUI((s) => s.openAuth)
  const toast = useUI((s) => s.toast)
  const { data: addresses = [], isLoading: addressesLoading } = useAddresses(Boolean(me))
  const deleteAddress = useDeleteAddress()
  const [editingEmail, setEditingEmail] = useState(!me)

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm({
    resolver: zodResolver(detailsSchema),
    mode: 'onTouched',
    defaultValues: initial ?? {
      email: me?.email ?? '',
      addressMode: me ? 'saved' : 'new',
      savedAddressId: '',
      address: emptyAddress(),
      billingSame: true,
      billing: emptyAddress(),
      ageConfirmed: false,
    },
  })

  const [email, addressMode, savedAddressId, billingSame, addressValues, billingValues] = useWatch({
    control,
    name: ['email', 'addressMode', 'savedAddressId', 'billingSame', 'address', 'billing'],
  })

  // Khách đăng nhập giữa chừng → điền email + chuyển sang địa chỉ đã lưu
  const meId = me?.id
  const meEmail = me?.email
  useEffect(() => {
    if (!meId) return
    if (!getValues('email')) setValue('email', meEmail)
    setEditingEmail(false)
    const typed = Object.values(getValues('address')).some(Boolean)
    if (!typed && getValues('addressMode') === 'new') setValue('addressMode', 'saved')
  }, [meId, meEmail, getValues, setValue])

  // Chọn địa chỉ mặc định khi danh sách đã tải; không có địa chỉ → form mới
  useEffect(() => {
    if (!me || addressesLoading || addressMode !== 'saved') return
    if (!addresses.length) setValue('addressMode', 'new')
    else if (!addresses.some((a) => a.id === savedAddressId)) setValue('savedAddressId', (addresses.find((a) => a.isDefault) ?? addresses[0]).id)
  }, [me, addresses, addressesLoading, addressMode, savedAddressId, setValue])

  const switchToNew = (prefill) => {
    setValue('address', prefill ? pickAddress(prefill) : emptyAddress())
    setValue('addressMode', 'new')
  }

  const removeAddress = (a) => {
    if (!window.confirm('Xóa địa chỉ này khỏi sổ địa chỉ?')) return
    deleteAddress.mutate(a.id, {
      onSuccess: () => {
        toast('Đã xóa địa chỉ', 'success')
        if (a.id === savedAddressId) setValue('savedAddressId', '')
      },
      onError: (err) => toast(err.message, 'error'),
    })
  }

  const submit = (v) => {
    const saved = addresses.find((a) => a.id === v.savedAddressId)
    const shipping = v.addressMode === 'saved' && saved ? pickAddress(saved) : pickAddress(v.address)
    onSubmit({
      raw: v,
      email: v.email.trim(),
      shippingAddress: { ...shipping, country: 'US' },
      billingSameAsShipping: v.billingSame,
      billingAddress: v.billingSame ? null : { ...pickAddress(v.billing), country: 'US' },
    })
  }

  const showSaved = me && addressMode === 'saved'

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      {/* CONTACT */}
      <StepSection title="Liên hệ">
        {editingEmail || errors.email ? (
          <div className="space-y-3">
            <Input
              label="Email"
              type="email"
              required
              autoComplete="email"
              {...register('email')}
              error={errors.email?.message}
              valid={Boolean(touchedFields.email && !errors.email)}
            />
            {!me && (
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <button type="button" onClick={() => openAuth()} className="ds-link font-semibold text-ink">
                  Đăng nhập
                </button>{' '}
                để thanh toán nhanh hơn.
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-start justify-between gap-4">
            <p className="text-[15px] break-all">{email}</p>
            <button type="button" onClick={() => setEditingEmail(true)} className="ds-link-strong shrink-0" aria-label="Sửa email">
              Sửa
            </button>
          </div>
        )}
      </StepSection>

      {/* ADDRESS */}
      <StepSection
        title="Địa chỉ"
        action={
          showSaved ? (
            <button type="button" onClick={() => switchToNew()} className="ds-link-strong">
              Thêm mới
            </button>
          ) : me && addresses.length > 0 ? (
            <button type="button" onClick={() => setValue('addressMode', 'saved')} className="ds-link-strong">
              Dùng địa chỉ đã lưu
            </button>
          ) : null
        }
      >
        <h3 className="mb-5 text-[15px] font-bold">Địa chỉ giao hàng</h3>

        {showSaved ? (
          addressesLoading ? (
            <Spinner label="Đang tải địa chỉ…" />
          ) : (
            <div role="radiogroup" aria-label="Địa chỉ giao hàng đã lưu" className="grid gap-4 sm:grid-cols-2">
              {addresses.map((a) => (
                <SavedAddressCard
                  key={a.id}
                  address={a}
                  selected={a.id === savedAddressId}
                  onSelect={() => setValue('savedAddressId', a.id, { shouldValidate: true })}
                  onEdit={() => switchToNew(a)}
                  onDelete={() => removeAddress(a)}
                  deleting={deleteAddress.isPending}
                />
              ))}
              {errors.savedAddressId && <p className="text-xs text-sale sm:col-span-2">{errors.savedAddressId.message}</p>}
            </div>
          )
        ) : (
          <AddressFields prefix="address" register={register} errors={errors.address} touched={touchedFields.address} values={addressValues} />
        )}

        <div className="mt-10 space-y-8">
          <Checkbox label="Địa chỉ thanh toán giống địa chỉ giao hàng" {...register('billingSame')} />
          {!billingSame && (
            <div>
              <h3 className="mb-5 text-[15px] font-bold">Địa chỉ thanh toán</h3>
              <AddressFields prefix="billing" register={register} errors={errors.billing} touched={touchedFields.billing} values={billingValues} />
            </div>
          )}
          <Checkbox
            label={
              <>
                Tôi từ 13 tuổi trở lên. <span aria-hidden>*</span>
              </>
            }
            aria-required
            {...register('ageConfirmed')}
            error={errors.ageConfirmed?.message}
          />
        </div>

        <Button type="submit" arrow loading={isSubmitting} className="mt-10 w-full sm:w-[385px]">
          Tiếp theo
        </Button>
      </StepSection>
    </form>
  )
}
