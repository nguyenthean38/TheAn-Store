import { Link } from 'react-router-dom'
import { Logo, SocialIcon } from '@/components/ui'
import { brand } from '@/config/brand'
import { footerColumns, socialLinks } from '@/config/navigation'

/** Footer: cột link + mạng xã hội + thanh pháp lý (ảnh #10, #11). */
export function Footer() {
  return (
    <footer className="mt-auto">
      <div className="border-t border-line bg-white">
        <div className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-3 lg:grid-cols-6">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-bold uppercase">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link to={href} className="text-sm hover:underline">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase">Theo dõi chúng tôi</h3>
            <ul className="space-y-3">
              {socialLinks.map((s) => (
                <li key={s}>
                  <a href="#" aria-label={s} className="inline-flex hover:opacity-60">
                    <SocialIcon name={s} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 text-white">
        <div className="container-page flex flex-col items-center gap-3 py-5 text-[13px] md:flex-row md:justify-center md:gap-6">
          <Link to="/help" className="hover:underline">
            Lựa chọn quyền riêng tư
          </Link>
          <span className="hidden md:inline">|</span>
          <Link to="/help" className="hover:underline">
            Chính sách bảo mật
          </Link>
          <span className="hidden md:inline">|</span>
          <Link to="/help" className="hover:underline">
            Điều khoản & Điều kiện
          </Link>
        </div>
        <p className="pb-5 text-center text-xs text-gray-300">{brand.copyright}</p>
      </div>
    </footer>
  )
}

/** Footer tối giản cho checkout (ảnh #120). */
export function CheckoutFooter() {
  return (
    <footer className="mt-auto bg-gray-800 py-6 text-center text-xs text-white">
      <p>
        Cần hỗ trợ? {brand.supportPhone} · {brand.supportHours}
      </p>
      <p className="mt-2 flex items-center justify-center gap-3">
        <Link to="/help" className="underline">
          Chính sách bảo mật
        </Link>
        <Link to="/help" className="underline">
          Điều khoản & Điều kiện
        </Link>
      </p>
      <p className="mt-2 text-gray-300">{brand.copyright}</p>
      <Logo className="mx-auto mt-3 h-6 w-20" />
    </footer>
  )
}
