import { Button } from '@/components/ui'

/** Trang 404. */
export default function NotFoundPage() {
  return (
    <div className="container-content flex min-h-[55vh] flex-col justify-center py-20">
      <p className="ds-label text-gray-600">Lỗi 404</p>
      <h1 className="ds-h1 mt-4">Không tìm thấy trang</h1>
      <p className="ds-body mt-5 max-w-xl">
        Rất tiếc, chúng tôi không tìm thấy trang bạn đang tìm. Trang có thể đã được chuyển đi hoặc không còn tồn tại. Hãy kiểm tra lại địa chỉ hoặc quay về trang chủ.
      </p>
      <div className="mt-10 flex flex-wrap gap-6">
        <Button to="/" arrow size="lg" className="min-w-[260px]">
          Về trang chủ
        </Button>
        <Button to="/help" variant="outline" arrow size="lg">
          Nhận trợ giúp
        </Button>
      </div>
    </div>
  )
}
