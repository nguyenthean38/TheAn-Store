import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Skeleton } from '@/components/ui'
import { AccountSection, PanelTitle } from '@/components/account/AccountSection'
import { AddressFormModal } from '@/components/account/AddressFormModal'
import { useAddresses, useDeleteAddress, useUpdateAddress } from '@/hooks/useAccount'
import { useUI } from '@/store/ui'
import { cn } from '@/utils/cn'

const MAX_ADDRESSES = 5

function AddressCard({ address, onEdit }) {
  const remove = useDeleteAddress()
  const setDefault = useUpdateAddress()
  const toast = useUI((s) => s.toast)
  const name = `${address.firstName} ${address.lastName}`

  const handleRemove = () => {
    if (!window.confirm(`Xóa địa chỉ của ${name}?`)) return
    remove.mutate(address.id, {
      onSuccess: () => toast('Đã xóa địa chỉ.', 'info'),
      onError: (err) => toast(err.message, 'error'),
    })
  }

  return (
    <li className={cn('relative flex min-h-[264px] flex-col border p-6 pt-8', address.isDefault ? 'border-ink' : 'border-gray-300', remove.isPending && 'opacity-50')}>
      {address.isDefault && <span className="absolute -top-2.5 -right-2.5 size-8 rounded-full bg-ink" aria-hidden />}
      <p className="text-lg font-bold">{name}</p>
      <address className="mt-4 text-lg leading-7 not-italic">
        {address.street}
        <br />
        {address.city}, {address.state}, {address.zip}, {address.country}
        <br />
        {address.phone}
      </address>
      <div className="mt-auto flex items-center justify-between gap-4 pt-8 text-lg">
        <div className="flex gap-2">
          <button type="button" onClick={() => onEdit(address)} className="ds-link" aria-label={`Sửa địa chỉ của ${name}`}>
            Sửa
          </button>
          <button type="button" onClick={handleRemove} disabled={remove.isPending} className="ds-link" aria-label={`Xóa địa chỉ của ${name}`}>
            Xóa
          </button>
        </div>
        {address.isDefault ? (
          <span className="font-bold">Mặc định</span>
        ) : (
          <button
            type="button"
            onClick={() => setDefault.mutate({ id: address.id, isDefault: true }, { onSuccess: () => toast('Đã cập nhật địa chỉ mặc định.', 'success') })}
            disabled={setDefault.isPending}
            className="ds-link text-base text-gray-600"
          >
            Đặt làm mặc định
          </button>
        )}
      </div>
    </li>
  )
}

/** Sổ địa chỉ (ảnh #77, #103). */
export default function AddressBookPage() {
  const { data: addresses = [], isLoading } = useAddresses()
  const [modal, setModal] = useState(null) // null | { address? }
  const remaining = Math.max(0, MAX_ADDRESSES - addresses.length)

  return (
    <AccountSection>
      <PanelTitle
        title="Sổ địa chỉ"
        description={
          <>
            Bạn còn{' '}
            <strong>
              {remaining}/{MAX_ADDRESSES} vị trí địa chỉ
            </strong>{' '}
            trống.
          </>
        }
      />
      {isLoading ? (
        <div className="-mt-6 grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[264px]" />
          <Skeleton className="h-[264px]" />
        </div>
      ) : (
        <ul className="-mt-6 grid gap-6 md:grid-cols-2 lg:px-3">
          {remaining > 0 && (
            <li>
              <button
                type="button"
                onClick={() => setModal({})}
                className="flex min-h-[264px] w-full flex-col justify-between border border-gray-300 p-6 pt-8 text-left text-lg transition-colors hover:border-ink"
              >
                Địa chỉ mới
                <Plus className="size-9" strokeWidth={1.25} aria-hidden />
              </button>
            </li>
          )}
          {addresses.map((a) => (
            <AddressCard key={a.id} address={a} onEdit={(address) => setModal({ address })} />
          ))}
        </ul>
      )}
      <AddressFormModal open={Boolean(modal)} onClose={() => setModal(null)} address={modal?.address} forceDefault={addresses.length === 0} />
    </AccountSection>
  )
}
