import { brand } from '@/config/brand'
import { cn } from '@/utils/cn'

/** Logo chữ "thean club" với vòng elip xanh (ảnh #1). */
export function AdiclubLogo({ className }) {
  return (
    <svg viewBox="0 0 250 130" className={cn('h-auto w-[180px] sm:w-[240px]', className)} role="img" aria-label={brand.clubName}>
      <ellipse cx="122" cy="68" rx="118" ry="50" fill="none" stroke="#1c4f9c" strokeWidth="2.5" transform="rotate(-12 122 68)" />
      <text x="14" y="86" fontFamily="'Be Vietnam Pro', sans-serif" fontSize="50" fontWeight="800" letterSpacing="-2" fill="#000">
        thean
        <tspan fontStyle="italic" fontWeight="700">
          club
        </tspan>
      </text>
    </svg>
  )
}

/** Huy hiệu hạng thành viên (ảnh #100). */
export function LevelBadge({ level = 1, className }) {
  return (
    <div className={cn('relative inline-flex items-center gap-2 pr-8', className)}>
      <div className="text-right leading-none">
        <span className="block font-display text-[26px] font-extrabold tracking-tight italic">
          thean<span className="font-semibold">club</span>
        </span>
        <span className="text-xs font-bold tracking-[0.04em] uppercase">Hạng</span>
      </div>
      <span className="font-display text-5xl leading-none font-light italic">{level}</span>
      <span className="pointer-events-none absolute top-1/2 right-0 h-[72px] w-[110px] -translate-y-1/2 rounded-[50%] border border-gray-300" aria-hidden />
    </div>
  )
}
