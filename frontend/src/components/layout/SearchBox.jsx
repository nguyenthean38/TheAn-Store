import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useSearchSuggestions } from '@/hooks/useCatalog'
import { formatPrice } from '@/utils/format'
import { cn } from '@/utils/cn'

/** Ô tìm kiếm header + gợi ý (debounce 250ms). */
export function SearchBox({ className }) {
  const [params] = useSearchParams()
  const [value, setValue] = useState(params.get('q') ?? '')
  const [debounced, setDebounced] = useState(value)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const wrapRef = useRef(null)
  const { data } = useSearchSuggestions(debounced)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), 250)
    return () => clearTimeout(t)
  }, [value])

  useEffect(() => {
    const onDoc = (e) => !wrapRef.current?.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const submit = (e) => {
    e.preventDefault()
    const q = value.trim()
    if (!q) return
    setOpen(false)
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  const hasSuggestions = open && debounced.trim().length >= 2 && data && (data.terms.length || data.products.length)

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      <form role="search" onSubmit={submit} className="flex h-10 items-center bg-field">
        <input
          type="search"
          value={value}
          onChange={(e) => (setValue(e.target.value), setOpen(true))}
          onFocus={() => setOpen(true)}
          placeholder="Tìm kiếm"
          aria-label="Tìm kiếm"
          className="h-full min-w-0 flex-1 bg-transparent px-3.5 text-[15px] outline-none placeholder:text-gray-600 [&::-webkit-search-cancel-button]:hidden"
        />
        {value && (
          <button type="button" aria-label="Xóa tìm kiếm" onClick={() => setValue('')} className="px-1">
            <X className="size-5" />
          </button>
        )}
        <button type="submit" aria-label="Tìm" className="px-2.5">
          <Search className="size-6" strokeWidth={2.2} />
        </button>
      </form>
      {hasSuggestions ? (
        <div className="absolute top-full right-0 z-40 mt-1 w-[min(420px,90vw)] animate-fade-in border border-line bg-white p-4 shadow-lg">
          {data.terms.length > 0 && (
            <>
              <p className="ds-label mb-2 text-gray-600">Gợi ý</p>
              <ul className="mb-4 space-y-1">
                {data.terms.map((t) => (
                  <li key={t}>
                    <Link to={`/search?q=${encodeURIComponent(t)}`} onClick={() => (setValue(t), setOpen(false))} className="block py-1 capitalize hover:underline">
                      {t}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          {data.products.length > 0 && (
            <>
              <p className="ds-label mb-2 text-gray-600">Sản phẩm</p>
              <ul className="space-y-2">
                {data.products.map((p) => (
                  <li key={p.id}>
                    <Link to={`/p/${p.slug}`} onClick={() => setOpen(false)} className="flex items-center gap-3 hover:bg-gray-50">
                      <img src={p.image.url} alt="" className="size-14 bg-image object-cover" />
                      <span className="flex-1 text-sm">
                        <span className="block">{p.name}</span>
                        <span className="text-gray-600">{formatPrice(p.price)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ) : null}
    </div>
  )
}
