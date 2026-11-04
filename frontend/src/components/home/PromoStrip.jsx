import { Link } from 'react-router-dom'
import { ArrowLong } from '@/components/ui'

/** Dải xám khuyến mãi ngay dưới header (ảnh #0). */
export function PromoStrip({ text, href }) {
  return (
    <Link to={href} className="group block bg-field transition-colors hover:bg-gray-200">
      <div className="relative flex min-h-[60px] items-center justify-center px-12 py-3 text-center text-sm md:text-[15px]">
        <span className="group-hover:underline">{text}</span>
        <ArrowLong size={24} className="absolute right-4 md:right-8 xl:right-12" />
      </div>
    </Link>
  )
}
