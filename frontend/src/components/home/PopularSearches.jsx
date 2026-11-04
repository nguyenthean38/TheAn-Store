import { Link } from 'react-router-dom'

/** "Đang được tìm nhiều": từ khoá lớn chữ thường có gạch chân (ảnh #8). */
export function PopularSearches({ terms, title = 'Đang được tìm nhiều', className }) {
  return (
    <section className={className} aria-labelledby="popular-title">
      <h2 id="popular-title" className="text-[30px] font-bold tracking-[0.02em] lg:text-[40px]">
        {title}
      </h2>
      <ul className="mt-10 grid gap-8 md:grid-cols-3 md:gap-x-16 lg:mt-24">
        {terms.map((t) => (
          <li key={t}>
            <Link
              to={`/search?q=${encodeURIComponent(t)}`}
              className="block border-b-2 border-ink pb-1 font-display text-[36px] leading-none font-extrabold lowercase transition-colors hover:bg-ink hover:text-white lg:text-[48px]"
            >
              {t}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
