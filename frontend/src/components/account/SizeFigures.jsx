/** Hình minh hoạ & icon nét mảnh cho trang Size profile (ảnh #79, #109, #110). */

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function CapIcon(props) {
  return (
    <svg viewBox="0 0 32 32" {...props} aria-hidden>
      <g {...stroke}>
        <path d="M5 20c0-6 4-10 10-10s9 4 9 9v1H5z" />
        <path d="M24 20h5c0-1.5-1.5-2.5-5-2.5" />
        <path d="M15 10v-1" />
      </g>
    </svg>
  )
}
export function TeeIcon(props) {
  return (
    <svg viewBox="0 0 32 32" {...props} aria-hidden>
      <path {...stroke} d="M11 5 4 9l3 5 3-1.5V27h12V12.5l3 1.5 3-5-7-4c-.8 1.8-2.6 3-5 3s-4.2-1.2-5-3z" />
    </svg>
  )
}
export function BraIcon(props) {
  return (
    <svg viewBox="0 0 32 32" {...props} aria-hidden>
      <g {...stroke}>
        <path d="M9 5v8c-2 1.5-3 3.5-3 6v5h20v-5c0-2.5-1-4.5-3-6V5" />
        <path d="M9 13c3 0 5.5 1.5 7 4 1.5-2.5 4-4 7-4" />
      </g>
    </svg>
  )
}
export function PantsIcon(props) {
  return (
    <svg viewBox="0 0 32 32" {...props} aria-hidden>
      <g {...stroke}>
        <path d="M9 4h14l1.5 24h-5.5L16 11l-3 17H7.5z" />
        <path d="M9 7h14M16 7v4" />
      </g>
    </svg>
  )
}
export function ShoeIcon(props) {
  return (
    <svg viewBox="0 0 32 32" {...props} aria-hidden>
      <g {...stroke}>
        <path d="M3 21v-7l6 1.5 4-3.5 5 5 7.5 1.5c2 .4 3.5 1.5 3.5 3v.5z" />
        <path d="M3 24h26M12 15l1.5 1.5M14.5 13.5 16 15" />
      </g>
    </svg>
  )
}

const dash = { ...stroke, strokeWidth: 1.2, strokeDasharray: '4 3' }

/** Hình người nét mảnh, `focus` khoanh vùng đo (tops / bottoms / headwear / bra). */
export function BodyFigure({ focus, className }) {
  return (
    <svg viewBox="0 0 200 330" className={className} role="img" aria-label="Hình minh họa số đo cơ thể">
      <defs>
        <radialGradient id="floor-shadow">
          <stop offset="0" stopColor="#000" stopOpacity="0.12" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="318" rx="90" ry="10" fill="url(#floor-shadow)" />
      <g {...stroke} strokeWidth={1.3}>
        <ellipse cx="100" cy="30" rx="17" ry="21" />
        <path d="M92 50v8c-12 3-26 5-30 14-3 8-5 30-8 50-2 14-4 30-6 42-1 6 3 10 7 8M108 50v8c12 3 26 5 30 14 3 8 5 30 8 50 2 14 4 30 6 42 1 6-3 10-7 8" />
        <path d="M68 92c2 18 3 35 0 52-2 14-3 22-2 34 2 40 6 80 9 120 0 6-8 10-6 14h16c2-4 0-10 1-16 2-30 6-70 12-104 2-6 4-6 4-6s2 0 4 6c6 34 10 74 12 104 1 6-1 12 1 16h16c2-4-6-8-6-14 3-40 7-80 9-120 1-12 0-20-2-34-3-17-2-34 0-52" />
      </g>
      {focus === 'headwear' && <ellipse {...dash} cx="100" cy="22" rx="26" ry="7" />}
      {(focus === 'top' || focus === 'bra' || !focus) && <ellipse {...dash} cx="100" cy="96" rx={focus ? 38 : 46} ry="8" />}
      {(focus === 'top' || !focus) && <ellipse {...dash} cx="100" cy="132" rx={focus ? 34 : 54} ry="8" />}
      {(focus === 'bottom' || !focus) && <ellipse {...dash} cx="100" cy="168" rx={focus ? 40 : 64} ry="9" />}
      {focus === 'bottom' && <path {...dash} d="M86 190v110" />}
    </svg>
  )
}

/** Bàn chân nhìn ngang với mũi tên đo chiều dài (ảnh #110). */
export function FootFigure({ className }) {
  return (
    <svg viewBox="0 0 300 300" className={className} role="img" aria-label="Hình minh họa đo chiều dài bàn chân">
      <defs>
        <radialGradient id="foot-shadow">
          <stop offset="0" stopColor="#000" stopOpacity="0.12" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="150" cy="250" rx="140" ry="16" fill="url(#foot-shadow)" />
      <g {...stroke} strokeWidth={1.5}>
        <path d="M60 10l18 170c1 20-6 34-6 46 0 18 12 22 30 18 30-6 60-6 100-2 22 3 40 4 54 2 12-2 12-14 2-18-16-6-28-10-44-22-18-12-36-22-60-40-6-6-8-30-8-44l1-110" />
        <path d="M92 160c8 10 14 18 10 34" />
      </g>
      <path {...dash} d="M200 175c18 4 26 18 22 36" />
      <g {...stroke} strokeWidth={1.3}>
        <path strokeDasharray="5 4" d="M72 280h196" />
        <path d="M78 275l-6 5 6 5M262 275l6 5-6 5" />
      </g>
    </svg>
  )
}
