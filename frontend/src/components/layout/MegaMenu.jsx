import { Link } from 'react-router-dom'

/** Mega menu khi hover MEN / WOMEN / KIDS (ảnh #12). */
export function MegaMenu({ item, onMouseEnter, onNavigate }) {
  return (
    <div className="absolute inset-x-0 top-full hidden animate-fade-in border-t border-line bg-white shadow-[0_8px_16px_rgba(0,0,0,0.08)] lg:block" onMouseEnter={onMouseEnter}>
      <div className="container-page grid grid-cols-6 gap-6 pt-8">
        {item.columns.map((col) => (
          <div key={col.title} className="pb-6">
            <Link to={col.href} onClick={onNavigate} className="mb-3 block text-sm font-bold uppercase hover:underline">
              {col.title}
            </Link>
            <ul className="space-y-1.5">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <Link to={href} onClick={onNavigate} className="text-sm hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            {col.promo && (
              <Link to={col.promo.href} onClick={onNavigate} className="mt-4 inline-block bg-sale px-3 py-2 text-center text-xs leading-tight font-bold text-white uppercase">
                {col.promo.label}
              </Link>
            )}
          </div>
        ))}
      </div>
      <div className="border-t border-line bg-gray-50">
        <div className="container-page grid grid-cols-6 gap-6 py-4">
          {item.columns.map((col) => (
            <div key={col.title}>
              {col.footer && (
                <Link to={col.footer[1]} onClick={onNavigate} className="text-sm font-semibold hover:underline">
                  {col.footer[0]}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
