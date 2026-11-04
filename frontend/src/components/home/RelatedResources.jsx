import { Carousel } from '@/components/ui'

/** "Related resources": thẻ bài viết, khối chữ trắng đè lên mép dưới ảnh (ảnh #9). */
export function RelatedResources({ items, title = 'Bài viết liên quan', className }) {
  return (
    <section className={className} aria-labelledby="resources-title">
      <h2 id="resources-title" className="ds-h2 mb-5 tracking-[0.04em]">
        {title}
      </h2>
      <Carousel ariaLabel={title} itemClassName="w-[80%] sm:w-[45%] lg:w-[24.5%]">
        {items.map((it) => (
          <article key={it.title} className="flex h-full flex-col">
            <div className="aspect-[395/270] overflow-hidden bg-image">
              <img src={it.image} alt="" loading="lazy" className="size-full object-cover" />
            </div>
            <div className="relative -mt-6 ml-6 bg-white pt-4 pr-4 pl-6">
              <h3 className="text-[15px] leading-snug font-bold lg:text-[17px]">{it.title}</h3>
              <p className="mt-1 line-clamp-4 text-[15px] leading-relaxed lg:text-[17px]">{it.body}</p>
            </div>
          </article>
        ))}
      </Carousel>
    </section>
  )
}
