import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { accountService } from '@/api'
import { qk } from './queryClient'

function useUserMutation(fn) {
  const qc = useQueryClient()
  return useMutation({ mutationFn: fn, onSuccess: (user) => qc.setQueryData(qk.me, user) })
}

export const useUpdateMe = () => useUserMutation(accountService.updateMe)
export const useUpdatePreferences = () => useUserMutation(accountService.updatePreferences)
export const useUpdateSizeProfile = () => useUserMutation(accountService.updateSizeProfile)

export function useAddresses(enabled = true) {
  return useQuery({ queryKey: qk.addresses, queryFn: accountService.addresses, enabled })
}

function useAddressMutation(fn) {
  const qc = useQueryClient()
  return useMutation({ mutationFn: fn, onSuccess: () => qc.invalidateQueries({ queryKey: qk.addresses }) })
}

export const useCreateAddress = () => useAddressMutation(accountService.createAddress)
export const useUpdateAddress = () => useAddressMutation(({ id, ...patch }) => accountService.updateAddress(id, patch))
export const useDeleteAddress = () => useAddressMutation(accountService.deleteAddress)

export function useVouchers(enabled = true) {
  return useQuery({ queryKey: qk.vouchers, queryFn: accountService.vouchers, enabled })
}
