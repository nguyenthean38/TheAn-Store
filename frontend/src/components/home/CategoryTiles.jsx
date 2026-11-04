import { Link } from 'react-router-dom'

/** Ô danh mục nền xám + nhãn in hoa gạch chân (ảnh #14). */
export function CategoryTiles({ items, className }) {
  return (
    <section className={className} aria-label="Mua theo danh mục">
      <ul className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-6">
        {items.map((it) => (
          <li key={it.label}>
            <Link to={it.href} className="group flex aspect-[392/305] flex-col items-center justify-end overflow-hidden bg-image px-3 pt-2 pb-5 lg:pb-7">
              <img src={it.image} alt="" loading="lazy" className="min-h-0 w-full flex-1 object-contain transition-transform duration-300 group-hover:scale-105" />
              <span className="mt-3 text-center text-[12px] font-bold tracking-[0.06em] uppercase underline underline-offset-4 group-hover:no-underline sm:text-[13px] lg:mt-8 lg:text-[15px]">
                {it.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
