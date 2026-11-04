import { Link } from 'react-router-dom'

/**
 * Hàng 4 thẻ khuyến mãi: ảnh dọc + tiêu đề in hoa + mô tả + SHOP NOW (ảnh #8, #14).
 * Mobile: cuộn ngang có snap; desktop: lưới 4 cột.
 */
export function PromoCards({ items, className, label = 'Khuyến mãi' }) {
  return (
    <section className={className} aria-label={label}>
      <ul className="-mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 scrollbar-none md:mx-0 md:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible">
        {items.map((it) => (
          <li key={it.title} className="w-[80%] shrink-0 snap-start sm:w-[45%] lg:w-auto">
            <Link to={it.href} className="group flex h-full flex-col">
              <div className="aspect-[3/4] overflow-hidden bg-image">
                <img src={it.image} alt="" loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
              </div>
              <div className="flex flex-1 flex-col px-5 pt-7 pb-2">
                <h3 className="text-[15px] font-bold tracking-[0.02em] uppercase">{it.title}</h3>
                <p className="mt-4 mb-6 text-[15px] leading-relaxed">{it.body}</p>
                <span className="mt-auto self-start border-b-2 border-ink pb-0.5 text-[15px] font-bold uppercase group-hover:border-transparent group-hover:bg-ink group-hover:text-white">
                  Mua ngay
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
