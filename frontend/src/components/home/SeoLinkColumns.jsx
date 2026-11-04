import { Link } from 'react-router-dom'

/** 4 cột link SEO (ảnh #9 dưới). Link dạng chuỗi → trang tìm kiếm; dạng [label, href] → href. */
export function SeoLinkColumns({ columns, className }) {
  return (
    <section className={className} aria-label="Khám phá thêm">
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="text-[15px] font-bold uppercase lg:text-[17px]">{col.title}</h2>
            <ul className="mt-6 space-y-5 lg:mt-9 lg:space-y-8">
              {col.links.map((link) => {
                const [text, href] = Array.isArray(link) ? link : [link, `/search?q=${encodeURIComponent(link.toLowerCase())}`]
                return (
                  <li key={text}>
                    <Link to={href} className="text-sm hover:underline lg:text-[15px]">
                      {text}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
