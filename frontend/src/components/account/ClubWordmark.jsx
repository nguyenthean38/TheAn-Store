import { brand } from '@/config/brand'

/** Wordmark "theanclub" (chữ thường nghiêng) cho chương trình thành viên Thean Club. */
export function ClubWordmark({ className }) {
  const [first, ...rest] = brand.clubName.split(' ')
  return (
    <span className={className} role="img" aria-label={brand.clubName}>
      <span className="font-display text-[1em] font-extrabold tracking-tight lowercase italic">{first}</span>
      <span className="font-display text-[1em] font-medium tracking-tight lowercase italic">{rest.join('')}</span>
    </span>
  )
}
