import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { accountService, authService, tokenStore } from '@/api'
import { qk } from './queryClient'

/** User hiện tại (null nếu chưa đăng nhập). */
export function useMe() {
  return useQuery({
    queryKey: qk.me,
    queryFn: () => (tokenStore.get() ? accountService.me().catch(() => null) : null),
    staleTime: 60_000,
  })
}

export function useIsLoggedIn() {
  const { data } = useMe()
  return Boolean(data)
}

function useSessionMutation(fn) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: (user) => {
      qc.setQueryData(qk.me, user)
      // giỏ hàng & wishlist khách đã được gộp vào tài khoản
      qc.invalidateQueries({ queryKey: qk.cart })
      qc.invalidateQueries({ queryKey: qk.wishlist })
      qc.invalidateQueries({ queryKey: qk.orders })
    },
  })
}

export const useLogin = () => useSessionMutation(authService.login)
export const useRegister = () => useSessionMutation(authService.register)
export const useResetPassword = () => useSessionMutation(authService.resetPassword)

export function useCheckEmail() {
  return useMutation({ mutationFn: authService.checkEmail })
}

export function useForgotPassword() {
  return useMutation({ mutationFn: authService.forgotPassword })
}

export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      qc.setQueryData(qk.me, null)
      qc.removeQueries({ queryKey: qk.orders })
      qc.removeQueries({ queryKey: qk.addresses })
      qc.removeQueries({ queryKey: qk.vouchers })
      qc.invalidateQueries({ queryKey: qk.cart })
      qc.invalidateQueries({ queryKey: qk.wishlist })
    },
  })
}
