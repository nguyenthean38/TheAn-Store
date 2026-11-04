import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Input } from '@/components/ui'
import { brand } from '@/config/brand'
import { useResetPassword } from '@/hooks/useAuth'
import { useUI } from '@/store/ui'

const PASSWORD_HINT = 'Tối thiểu 8 ký tự, gồm ít nhất một chữ hoa, một chữ thường, một ký tự đặc biệt và một chữ số.'
const schema = z.object({
  password: z.string().min(8, PASSWORD_HINT).regex(/[a-z]/, PASSWORD_HINT).regex(/[A-Z]/, PASSWORD_HINT).regex(/\d/, PASSWORD_HINT).regex(/[^A-Za-z0-9]/, PASSWORD_HINT),
})

/** Tạo mật khẩu mới từ link email (ảnh #130, #131). */
export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const navigate = useNavigate()
  const openAuth = useUI((s) => s.openAuth)
  const toast = useUI((s) => s.toast)
  const reset = useResetPassword()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), mode: 'onTouched', defaultValues: { password: '' } })
  const password = watch('password')
  const valid = schema.safeParse({ password }).success

  if (!token)
    return (
      <div className="container-content max-w-[1440px] py-16 lg:px-[60px]">
        <h1 className="ds-h2">Liên kết không hợp lệ hoặc đã hết hạn</h1>
        <p className="ds-body mt-4 max-w-xl">Mỗi liên kết đặt lại mật khẩu chỉ dùng được một lần. Hãy yêu cầu liên kết mới, chúng tôi sẽ gửi qua email cho bạn.</p>
        <Button arrow className="mt-8" onClick={() => openAuth()}>
          Yêu cầu liên kết mới
        </Button>
      </div>
    )

  const onSubmit = ({ password }) =>
    reset.mutate(
      { token, password },
      {
        onSuccess: () => {
          toast('Đã cập nhật mật khẩu của bạn.', 'success')
          navigate('/account', { replace: true })
        },
      },
    )

  return (
    <div className="container-content max-w-[1440px] pt-[88px] pb-24 lg:px-[60px]">
      <h1 className="text-[22px]">Tạo mật khẩu mới</h1>
      <p className="text-lg">Đặt mật khẩu mới cho tài khoản {brand.name} của bạn. Sau khi tạo mật khẩu, bạn vẫn sẽ ở trạng thái đăng nhập.</p>

      {reset.isError && (
        <div role="alert" className="mt-8 max-w-[508px] border border-sale px-4 py-3 text-sale">
          {reset.error?.fields?.password ?? reset.error?.message ?? 'Đã có lỗi xảy ra. Vui lòng thử lại.'}
          {!reset.error?.fields && (
            <button type="button" onClick={() => openAuth()} className="ds-link ml-1 text-ink">
              Yêu cầu liên kết mới
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-12 max-w-[508px]">
        <Input
          type="password"
          label="Mật khẩu"
          required
          autoComplete="new-password"
          {...register('password')}
          valid={valid}
          error={errors.password?.message}
        />
        {!errors.password && <p className="mt-14 text-gray-600">{PASSWORD_HINT}</p>}
        <Button type="submit" arrow fullWidth size="lg" loading={reset.isPending} className="mt-24">
          Xác nhận
        </Button>
      </form>
    </div>
  )
}
