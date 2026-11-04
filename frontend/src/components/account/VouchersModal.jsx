import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Badge, Modal, Skeleton } from '@/components/ui'
import { brand } from '@/config/brand'
import { useUI } from '@/store/ui'
import { formatDate } from '@/utils/format'

function VoucherCard({ voucher }) {
  const [copied, setCopied] = useState(false)
  const toast = useUI((s) => s.toast)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(voucher.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast('Không thể sao chép mã. Vui lòng sao chép thủ công.', 'error')
    }
  }

  return (
    <li className="border border-gray-300 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-3xl font-extrabold">-{voucher.discountPercent}%</p>
          <h3 className="mt-1 font-bold uppercase">{voucher.title}</h3>
        </div>
        {voucher.isNew && <Badge tone="info">Mới</Badge>}
      </div>
      <p className="mt-2 text-gray-600">{voucher.description}</p>
      <div className="mt-4 flex items-stretch">
        <span className="flex flex-1 items-center bg-field px-4 font-mono text-lg tracking-[0.06em]" aria-label={`Mã voucher ${voucher.code}`}>
          {voucher.code}
        </span>
        <button type="button" onClick={copy} className="ds-label flex h-12 items-center gap-2 bg-ink px-4 text-white hover:text-gray-300" aria-live="polite">
          {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          {copied ? 'Đã sao chép' : 'Sao chép'}
        </button>
      </div>
      <p className="ds-caption mt-3">Có hiệu lực đến {formatDate(voucher.expiresAt)}</p>
    </li>
  )
}

/** Modal danh sách voucher (mở từ "XEM VOUCHER CỦA BẠN"). */
export function VouchersModal({ open, onClose, vouchers, isLoading }) {
  return (
    <Modal open={open} onClose={onClose} title="Voucher của bạn">
      {isLoading ? (
        <Skeleton className="h-40" />
      ) : vouchers?.length ? (
        <ul className="space-y-4">
          {vouchers.map((v) => (
            <VoucherCard key={v.id} voucher={v} />
          ))}
        </ul>
      ) : (
        <p className="ds-body">Bạn chưa có voucher nào. Hãy tiếp tục tích điểm {brand.clubName} để mở khóa ưu đãi giảm giá.</p>
      )}
      <p className="ds-caption mt-6">Nhập mã trong giỏ hàng hoặc khi thanh toán. Voucher không áp dụng cùng các chương trình khuyến mãi khác.</p>
    </Modal>
  )
}
