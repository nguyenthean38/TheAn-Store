import { useMemo } from 'react'
import { brand } from '@/config/brand'
import { cn } from '@/utils/cn'

const N = 25

/** Ô định vị 7x7 ở 3 góc của mã QR. */
function isFinder(x, y) {
  const corners = [
    [0, 0],
    [N - 7, 0],
    [0, N - 7],
  ]
  return corners.some(([cx, cy]) => x >= cx - 1 && x <= cx + 7 && y >= cy - 1 && y <= cy + 7)
}

/**
 * Mã QR trang trí (không mã hoá dữ liệu thật) — vẽ bằng SVG, không cần thư viện.
 * `seed` cố định để hình không đổi giữa các lần render.
 */
export function DecorativeQr({ seed = 7, size = 128, className, label = `Mã QR để tải ứng dụng ${brand.shortName}` }) {
  const cells = useMemo(() => {
    let s = seed * 9301 + 49297
    const rand = () => {
      s = (s * 9301 + 49297) % 233280
      return s / 233280
    }
    const out = []
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!isFinder(x, y) && rand() > 0.52) out.push([x, y])
    return out
  }, [seed])

  const finder = (x, y) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="7" height="7" fill="#000" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" fill="#000" />
    </g>
  )

  return (
    <div className={cn('inline-block bg-white p-2', className)}>
      <svg viewBox={`0 0 ${N} ${N}`} width={size} height={size} role="img" aria-label={label} shapeRendering="crispEdges">
        <rect width={N} height={N} fill="#fff" />
        {cells.map(([x, y]) => (
          <rect key={`${x}.${y}`} x={x} y={y} width="1" height="1" fill="#000" />
        ))}
        {finder(0, 0)}
        {finder(N - 7, 0)}
        {finder(0, N - 7)}
      </svg>
    </div>
  )
}
