import { useMemo } from 'react'

const N = 25

/** Hash chuỗi → số nguyên (để sinh mẫu QR ổn định theo mã đơn). */
function seedFrom(str) {
  let h = 2166136261
  for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return h >>> 0
}

function isFinder(x, y) {
  const inBox = (bx, by) => x >= bx && x < bx + 7 && y >= by && y < by + 7
  return inBox(0, 0) || inBox(N - 7, 0) || inBox(0, N - 7)
}

/** QR trang trí (không mã hoá dữ liệu thật) cho khối "GET QUICK ORDER UPDATES". */
export function DecorativeQr({ value = '', size = 128, className }) {
  const cells = useMemo(() => {
    let s = seedFrom(value) || 1
    const rand = () => {
      s ^= s << 13
      s ^= s >>> 17
      s ^= s << 5
      return ((s >>> 0) % 1000) / 1000
    }
    const out = []
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++) {
        if (isFinder(x, y) || (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9)) continue
        if (rand() > 0.52) out.push([x, y])
      }
    return out
  }, [value])

  const finder = (fx, fy) => (
    <g key={`${fx}-${fy}`}>
      <rect x={fx} y={fy} width="7" height="7" fill="#000" />
      <rect x={fx + 1} y={fy + 1} width="5" height="5" fill="#fff" />
      <rect x={fx + 2} y={fy + 2} width="3" height="3" fill="#000" />
    </g>
  )

  return (
    <svg viewBox={`-2 -2 ${N + 4} ${N + 4}`} width={size} height={size} className={className} role="img" aria-label="Mã QR nhận cập nhật đơn hàng" shapeRendering="crispEdges">
      <rect x="-2" y="-2" width={N + 4} height={N + 4} fill="#fff" stroke="#000" strokeWidth="0.25" />
      {finder(0, 0)}
      {finder(N - 7, 0)}
      {finder(0, N - 7)}
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#000" />
      ))}
    </svg>
  )
}
