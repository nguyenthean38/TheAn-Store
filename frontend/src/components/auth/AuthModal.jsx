import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Button, Checkbox, Input, Modal } from '@/components/ui'
import { AdiclubLogo } from '@/components/club/AdiclubLogo'
import { brand } from '@/config/brand'
import { env } from '@/config/env'
import { useCheckEmail, useForgotPassword, useLogin, useRegister } from '@/hooks/useAuth'
import { useUI } from '@/store/ui'

/** Quy tắc mật khẩu — trùng với backend (docs/API_CONTRACT.md §2.1). */
export const PASSWORD_HINT = 'Tối thiểu 8 ký tự, gồm ít nhất một chữ hoa, một chữ thường, một ký tự đặc biệt và một chữ số.'
export const passwordSchema = z
  .string()
  .min(8, PASSWORD_HINT)
  .regex(/[a-z]/, PASSWORD_HINT)
  .regex(/[A-Z]/, PASSWORD_HINT)
  .regex(/\d/, PASSWORD_HINT)
  .regex(/[^A-Za-z0-9]/, PASSWORD_HINT)

const emailSchema = z.object({ email: z.email('Vui lòng nhập địa chỉ email hợp lệ'), keepLoggedIn: z.boolean() })
const loginSchema = z.object({ password: z.string().min(1, 'Vui lòng nhập mật khẩu') })
const registerSchema = z.object({ password: passwordSchema })

const SOCIALS = [
  {
    name: 'Apple',
    mark: (
      <svg viewBox="0 0 24 24" className="size-7" aria-hidden>
        <path fill="currentColor" d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9a4.8 4.8 0 0 0-3.8-2c-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9a5 5 0 0 0-4.2 2.6c-1.8 3.1-.5 7.7 1.3 10.2.8 1.2 1.8 2.6 3.1 2.5 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.5a10 10 0 0 0 1.4-2.8 4.3 4.3 0 0 1-2.1-4.1zM13.9 5c.7-.8 1.1-1.9 1-3a4.4 4.4 0 0 0-2.9 1.5 4.1 4.1 0 0 0-1 3c1.1 0 2.2-.6 2.9-1.5z" />
      </svg>
    ),
    cls: '',
  },
  { name: 'Facebook', mark: 'f', cls: 'size-7 rounded-full bg-[#1877f2] text-white font-bold text-lg leading-7' },
  { name: 'Google', mark: 'G', cls: 'text-2xl font-bold bg-[conic-gradient(#ea4335_0_25%,#fbbc05_0_50%,#34a853_0_75%,#4285f4_0)] bg-clip-text text-transparent' },
  { name: 'Yahoo', mark: 'Y!', cls: 'size-7 bg-[#5f01d1] text-white font-bold leading-7' },
]

/**
 * Modal Thean Club: email → (login | đăng ký) → quên mật khẩu (ảnh #1–#4, #126–#129).
 * Mở từ bất kỳ đâu bằng `useUI.getState().openAuth({ onSuccess })`.
 */
export function AuthModal() {
  const { open, step, email } = useUI((s) => s.auth)
  const closeAuth = useUI((s) => s.closeAuth)

  return (
    <Modal open={open} onClose={closeAuth} size="md" labelledBy="auth-title">
      <AdiclubLogo className="-ml-1 mb-4" />
      {step === 'email' && <EmailStep />}
      {step === 'login' && <LoginStep email={email} />}
      {step === 'register' && <RegisterStep email={email} />}
      {(step === 'forgot' || step === 'forgot-sent') && <ForgotStep email={email} />}
    </Modal>
  )
}

function Title({ children }) {
  return (
    <h2 id="auth-title" className="ds-h2 mb-4">
      {children}
    </h2>
  )
}

function Legal({ children }) {
  return <p className="mt-6 text-sm leading-relaxed text-gray-600">{children}</p>
}

function EmailChip({ email }) {
  const setAuth = useUI((s) => s.setAuth)
  return (
    <p className="mb-4 text-sm">
      {email}{' '}
      <button type="button" className="ds-link ml-2 font-semibold" onClick={() => setAuth({ step: 'email' })}>
        Đổi
      </button>
    </p>
  )
}

function EmailStep() {
  const { email, keepLoggedIn = true } = useUI((s) => s.auth)
  const setAuth = useUI((s) => s.setAuth)
  const toast = useUI((s) => s.toast)
  const check = useCheckEmail()
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    watch,
  } = useForm({ resolver: zodResolver(emailSchema), defaultValues: { email, keepLoggedIn }, mode: 'onTouched' })

  const onSubmit = async (values) => {
    try {
      const exists = await check.mutateAsync(values.email)
      setAuth({ email: values.email, keepLoggedIn: values.keepLoggedIn, step: exists ? 'login' : 'register' })
    } catch (e) {
      toast(e.message, 'error')
    }
  }
  const emailValid = dirtyFields.email && !errors.email && /^\S+@\S+\.\S+$/.test(watch('email') || '')

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Title>Đặc quyền {brand.clubName} đang chờ bạn</Title>
      <p className="mb-5 text-[15px]">Miễn phí giao hàng, voucher giảm giá và sản phẩm dành riêng cho thành viên khi bạn tham gia {brand.clubName}.</p>
      <p className="mb-3 text-[15px] font-bold">Đăng nhập hoặc đăng ký (miễn phí)</p>
      <div className="mb-5 flex gap-4">
        {SOCIALS.map((s) => (
          <button key={s.name} type="button" aria-label={`Tiếp tục với ${s.name}`} onClick={() => toast(`Đăng nhập bằng ${s.name} chưa khả dụng trong bản demo`, 'info')} className="flex size-[62px] items-center justify-center border border-ink hover:bg-gray-50">
            <span className={`inline-block text-center ${s.cls}`}>{s.mark}</span>
          </button>
        ))}
      </div>
      <Input label="Địa chỉ email" required type="email" autoComplete="email" error={errors.email?.message} valid={emailValid} {...register('email')} />
      <Checkbox className="mt-5" label="Duy trì đăng nhập. Áp dụng cho mọi phương thức." description={<span className="ds-link text-ink">Tìm hiểu thêm</span>} {...register('keepLoggedIn')} />
      <Button type="submit" arrow className="mt-6" loading={check.isPending}>
        Tiếp tục
      </Button>
      <Legal>
        Đăng ký {brand.clubName} để nhận ưu đãi và tin tức độc quyền từ {brand.name}. Khi bấm &ldquo;Tiếp tục&rdquo;, bạn tham gia {brand.clubName}, sẽ nhận email về tin tức mới nhất và đồng ý với{' '}
        <Link to="/help" className="ds-link">
          Điều khoản sử dụng
        </Link>{' '}
        và{' '}
        <Link to="/help" className="ds-link">
          Điều khoản & Điều kiện {brand.clubName}
        </Link>
        , đồng thời xác nhận đã đọc{' '}
        <Link to="/help" className="ds-link">
          Chính sách bảo mật của {brand.name}
        </Link>
        .
      </Legal>
    </form>
  )
}

function useFinish() {
  const auth = useUI((s) => s.auth)
  const closeAuth = useUI((s) => s.closeAuth)
  const toast = useUI((s) => s.toast)
  return (user, isNew) => {
    const cb = auth.onSuccess
    closeAuth()
    toast(isNew ? `Chào mừng bạn đến với ${brand.clubName}!` : `Chào mừng trở lại${user.firstName ? `, ${user.firstName}` : ''}!`, 'success')
    cb?.(user)
  }
}

function LoginStep({ email }) {
  const { keepLoggedIn } = useUI((s) => s.auth)
  const setAuth = useUI((s) => s.setAuth)
  const login = useLogin()
  const finish = useFinish()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { password: '' } })

  const onSubmit = async ({ password }) => {
    try {
      const user = await login.mutateAsync({ email, password, keepLoggedIn })
      finish(user, false)
    } catch (e) {
      setError('password', { message: e.message })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Title>Đăng nhập {brand.clubName}</Title>
      <p className="mb-4 text-[15px]">Miễn phí giao hàng, voucher giảm giá và sản phẩm dành riêng cho thành viên khi bạn tham gia {brand.clubName}.</p>
      <EmailChip email={email} />
      <Input label="Mật khẩu" required type="password" autoComplete="current-password" autoFocus error={errors.password?.message} {...register('password')} />
      {env.useMock && <p className="mt-2 text-xs text-gray-600">Tài khoản demo: alex@example.com / Password1!</p>}
      <Button type="submit" arrow className="mt-6" loading={login.isPending}>
        Đăng nhập
      </Button>
      <Legal>
        Khi bấm &lsquo;Đăng nhập&rsquo;, bạn đồng ý với{' '}
        <Link to="/help" className="ds-link">
          Điều khoản {brand.clubName}
        </Link>
        ,{' '}
        <Link to="/help" className="ds-link">
          Chính sách bảo mật
        </Link>{' '}
        và{' '}
        <Link to="/help" className="ds-link">
          Điều khoản &amp; Điều kiện
        </Link>{' '}
        của {brand.name}.
      </Legal>
      <button type="button" onClick={() => setAuth({ step: 'forgot' })} className="ds-link-strong mt-6 inline-block">
        Quên mật khẩu?
      </button>
    </form>
  )
}

function RegisterStep({ email }) {
  const { keepLoggedIn } = useUI((s) => s.auth)
  const reg = useRegister()
  const finish = useFinish()
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema), defaultValues: { password: '' }, mode: 'onChange' })
  const pwd = watch('password')
  const valid = passwordSchema.safeParse(pwd).success

  const onSubmit = async ({ password }) => {
    try {
      const user = await reg.mutateAsync({ email, password, keepLoggedIn, newsletter: true })
      finish(user, true)
    } catch (e) {
      setError('password', { message: e.fields?.password ?? e.message })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Title>Chào mừng đến với {brand.clubName}!</Title>
      <p className="mb-4 text-[15px]">Tạo mật khẩu để dùng đầy đủ đặc quyền {brand.clubName}: đổi điểm, lưu thông tin giao hàng và nhiều hơn nữa.</p>
      <EmailChip email={email} />
      <Input label="Mật khẩu" required type="password" autoComplete="new-password" autoFocus valid={valid} error={pwd && !valid ? undefined : errors.password?.message} hint={PASSWORD_HINT} {...register('password')} />
      <Button type="submit" arrow className="mt-6" loading={reg.isPending}>
        Tạo mật khẩu
      </Button>
    </form>
  )
}

function ForgotStep({ email }) {
  const { step } = useUI((s) => s.auth)
  const setAuth = useUI((s) => s.setAuth)
  const forgot = useForgotPassword()
  const sent = useRef(false)

  useEffect(() => {
    if (step !== 'forgot' || sent.current) return
    sent.current = true // tránh gọi 2 lần trong StrictMode
    forgot.mutateAsync(email).finally(() => setAuth({ step: 'forgot-sent' }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  return (
    <div>
      <Title>Quên mật khẩu?</Title>
      {step === 'forgot' ? (
        <p className="text-[15px]">Đang gửi…</p>
      ) : (
        <>
          <p className="text-[15px]">Chúng tôi đã gửi email cho bạn. Hãy bấm vào liên kết trong email để đặt lại mật khẩu.</p>
          {env.useMock && (
            <p className="mt-4 bg-surface p-3 text-sm">
              Chế độ demo: không có email nào được gửi.{' '}
              <Link to={`/reset-password?token=${btoa(email)}`} className="ds-link font-semibold" onClick={() => useUI.getState().closeAuth()}>
                Mở liên kết đặt lại mật khẩu
              </Link>
            </p>
          )}
          <button type="button" onClick={() => setAuth({ step: 'login' })} className="ds-link-strong mt-6 inline-block">
            Quay lại đăng nhập
          </button>
        </>
      )}
    </div>
  )
}
