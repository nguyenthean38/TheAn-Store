/**
 * Icon tuỳ biến (không có trong lucide-react): logo, mũi tên dài kiểu adidas, mạng xã hội.
 * Icon thông thường dùng trực tiếp từ `lucide-react`.
 */
import { brand } from '@/config/brand'

const base = (size) => ({ width: size, height: size, 'aria-hidden': true, focusable: false })

/** Logo chữ THEAN (wordmark). Đổi tại đây nếu có logo chính thức. */
export function Logo({ className, title = brand.name }) {
  return (
    <svg viewBox="0 0 148 40" className={className} role="img" aria-label={title}>
      <path fill="currentColor" d="M0 4h26v7h-9v25H9V11H0z" />
      <text x="29" y="36" textLength="118" lengthAdjust="spacingAndGlyphs" fontFamily="'Be Vietnam Pro', sans-serif" fontSize="40" fontWeight="800" fill="currentColor">
        HEAN
      </text>
    </svg>
  )
}

/** Mũi tên dài mảnh — dùng trong nút (CONTINUE ⟶). */
export function ArrowLong({ size = 24, className }) {
  return (
    <svg viewBox="0 0 32 16" {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="1.6" style={{ width: size * 1.3, height: size * 0.65 }}>
      <path d="M0 8h30M23 1l7 7-7 7" strokeLinecap="square" />
    </svg>
  )
}

/** Mũi tên quay lại ↩ ở breadcrumb "BACK". */
export function ArrowBack({ size = 18, className }) {
  return (
    <svg viewBox="0 0 20 16" {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 2 2 6l4 4" strokeLinecap="square" />
      <path d="M2 6h11a5 5 0 0 1 0 10h-2" />
    </svg>
  )
}

/** Trái tim kiểu adidas (nét vuông). */
export function HeartIcon({ size = 22, filled = false, className }) {
  return (
    <svg viewBox="0 0 24 24" {...base(size)} className={className} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path d="M12 21 3.5 12.2A5 5 0 0 1 12 6.4a5 5 0 0 1 8.5 5.8z" strokeLinejoin="miter" />
    </svg>
  )
}

/** Túi mua hàng kiểu adidas. */
export function BagIcon({ size = 22, className }) {
  return (
    <svg viewBox="0 0 24 24" {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 8h16v13H4z" />
      <path d="M8 8V5a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

export function UserIcon({ size = 22, className }) {
  return (
    <svg viewBox="0 0 24 24" {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4.5" />
      <path d="M3.5 21.5c1-4.5 4.4-7 8.5-7s7.5 2.5 8.5 7" />
    </svg>
  )
}

/** Chữ "thean club" nhỏ dùng trong huy hiệu thành viên. */
export function AdiclubMark({ className }) {
  return (
    <span className={className} aria-label={brand.clubName}>
      <span className="font-display text-[1em] font-extrabold tracking-tight lowercase italic">thean</span>
      <span className="font-display text-[1em] font-medium tracking-tight lowercase italic">club</span>
    </span>
  )
}

/* ------------------------- Social icons ------------------------- */
const social = {
  facebook: 'M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21z',
  instagram: 'M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm5.9-7.8a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 3.6c-2.3 0-2.6 0-3.5.1-3 .1-4.6 1.7-4.8 4.8C3.6 9.4 3.6 9.7 3.6 12s0 2.6.1 3.5c.1 3 1.7 4.6 4.8 4.8.9 0 1.2.1 3.5.1s2.6 0 3.5-.1c3-.1 4.6-1.7 4.8-4.8 0-.9.1-1.2.1-3.5s0-2.6-.1-3.5c-.1-3-1.7-4.6-4.8-4.8-.9-.1-1.2-.1-3.5-.1z',
  x: 'M17.7 3.5h3l-6.6 7.5 7.7 10.2h-6l-4.8-6.2-5.4 6.2H2.5l7-8L2.2 3.5h6.2l4.3 5.7zm-1 15.9h1.6L7.4 5.2H5.6z',
  pinterest: 'M12 2.5a9.5 9.5 0 0 0-3.5 18.3c-.1-.8-.2-2 0-2.8l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.6 1.3 1.4 0 .9-.5 2.1-.8 3.3-.2 1 .5 1.8 1.5 1.8 1.8 0 3.1-1.9 3.1-4.6 0-2.4-1.7-4.1-4.2-4.1-2.9 0-4.5 2.1-4.5 4.4 0 .9.3 1.8.8 2.3l.1.4-.3 1.1c0 .2-.2.2-.4.1-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.9-6.3 3.6 0 6.4 2.6 6.4 6 0 3.6-2.3 6.5-5.4 6.5-1.1 0-2.1-.6-2.4-1.2l-.7 2.5c-.2.9-.9 2.1-1.3 2.8A9.5 9.5 0 1 0 12 2.5z',
  tiktok: 'M16.6 2.5h-3.2v12.7a2.7 2.7 0 1 1-2.7-2.7c.3 0 .6 0 .8.1V9.3a6 6 0 1 0 5.1 5.9V8.8a7.6 7.6 0 0 0 4.4 1.4V7a4.4 4.4 0 0 1-4.4-4.5z',
  youtube: 'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.7 19 12 19 12 19s6.3 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z',
}

export function SocialIcon({ name, size = 20, className }) {
  return (
    <svg viewBox="0 0 24 24" {...base(size)} className={className} fill="currentColor">
      <path d={social[name]} fillRule="evenodd" />
    </svg>
  )
}

/** Logo phương thức thanh toán dạng chữ (tránh dùng file logo thương hiệu). */
export function PaymentBadge({ name }) {
  const styles = {
    VISA: 'text-[#1a1f71] italic font-extrabold',
    AMEX: 'bg-[#2e77bc] text-white text-[10px] font-bold',
    Mastercard: 'text-[#eb001b] font-bold',
    Discover: 'text-[#e55c20] font-bold text-[11px]',
    PayPal: 'text-[#003087] italic font-extrabold',
    'G Pay': 'text-gray-600 font-semibold',
    Klarna: 'bg-[#ffb3c7] text-black font-bold',
    Afterpay: 'bg-[#b2fce4] text-black font-bold',
    affirm: 'text-[#4a4af4] font-bold',
  }
  return (
    <span className={`inline-flex h-7 min-w-11 items-center justify-center border border-line px-1.5 text-xs ${styles[name] ?? ''}`}>{name}</span>
  )
}
