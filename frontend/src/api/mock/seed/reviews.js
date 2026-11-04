/** Đánh giá được chia sẻ giữa các colorway cùng modelId. */

const DAY = 86400000
const ago = (d) => new Date(Date.now() - d * DAY).toISOString()

const EVO_SL = [
  { rating: 5, title: 'Đôi giày chạy bộ thích nhất', body: 'Đôi giày mình thích nhất để chạy và mang đi dạo phố. Siêu êm và nhẹ', nickname: 'Yii', days: 2, attributes: { size: 3, width: 3, comfort: 5, quality: 5 } },
  { rating: 4, title: 'Tốt', body: 'Mang rất thích chân, nhưng kiểu dáng hơi xấu một chút.', nickname: 'Good', days: 3, attributes: { size: 3, width: 2, comfort: 4, quality: 4 } },
  { rating: 5, title: 'Giày tốt nhất', body: 'Đúng là đôi giày chạy bộ không tấm carbon hoàn hảo. Rất thích độ êm và độ nảy.', nickname: 'CM77', days: 4, verified: true, attributes: { size: 3, width: 3, comfort: 5, quality: 5 } },
  { rating: 5, title: 'Một đôi giày tuyệt vời', body: 'Thoải mái, rất hợp cho cả buổi tập lẫn ngày thi đấu', nickname: 'Franks', days: 6, attributes: { size: 3, width: 3, comfort: 5, quality: 4 } },
  { rating: 5, title: 'Tuyệt vời', body: 'Nhẹ, thoải mái và đẹp. Tới giờ mình vẫn rất hài lòng', nickname: 'Megui284', days: 7, attributes: { size: 4, width: 3, comfort: 5, quality: 5 } },
  { rating: 1, title: 'Giày rất êm và phong cách, mình rất thích', body: 'Mình mong sẽ có thêm nhiều màu cho dòng SL. Đôi giày rất thoải mái và phong cách, chắc chắn sẽ giới thiệu cho bạn bè', nickname: 'Adam', days: 9, attributes: { size: 3, width: 3, comfort: 5, quality: 5 } },
  { rating: 5, title: 'ĐỈNH NHẤT PHÂN KHÚC :)', body: 'Mấy năm qua mình đã thử rất nhiều giày và đôi này hoàn toàn xứng đáng với lời đồn. Cảm giác dưới chân thật sự tuyệt vời — phản hồi nhanh và êm ái — cân được cả chạy tempo, chạy hằng ngày và mọi thứ ở giữa. Chắc chắn là đôi giày số một của mình hiện tại và là đôi mình thích nhất trong một thời gian rất dài.', nickname: 'JJ22', days: 130, verified: true, attributes: { size: 3, width: 3, comfort: 5, quality: 5 } },
  { rating: 5, title: 'Không nghi ngờ gì, đôi giày của năm. Xuất sắc.', body: 'Mình đã dùng hàng chục đôi giày chạy bộ và đây dễ dàng là đôi mình thích nhất. Nảy, nhẹ, thoải mái. Sống động hơn hẳn Boston 12. Thân giày rất tốt, cực kỳ thoáng khí.', nickname: 'CorryHaul', days: 70, verified: true, attributes: { size: 3, width: 3, comfort: 5, quality: 5 } },
  { rating: 4, title: 'Nhanh và vui', body: 'Rất hợp cho những ngày chạy tempo. Phần giữa bàn chân hơi chật nhưng sẽ giãn ra sau vài buổi chạy.', nickname: 'RunnerJo', days: 22, attributes: { size: 3, width: 2, comfort: 4, quality: 4 } },
]

const GENERIC = [
  { rating: 5, title: 'Rất thích', body: 'Thoải mái ngay từ ngày đầu tiên. Đúng size và chất lượng tuyệt vời.', nickname: 'Sam', days: 5, attributes: { size: 3, width: 3, comfort: 5, quality: 5 } },
  { rating: 4, title: 'Đôi giày tuyệt vời cho mỗi ngày', body: 'Phối với gì cũng đẹp. Mất vài ngày để quen chân.', nickname: 'Taylor', days: 18, attributes: { size: 3, width: 3, comfort: 4, quality: 4 } },
  { rating: 5, title: 'Kinh điển', body: 'Đã mua thêm đôi thứ hai màu khác. Không cần nói thêm.', nickname: 'Chris_R', days: 40, verified: true, attributes: { size: 3, width: 3, comfort: 5, quality: 5 } },
  { rating: 3, title: 'Hơi nhỏ so với size', body: 'Sản phẩm đẹp nhưng mình nghĩ nên chọn lớn hơn nửa size.', nickname: 'Morgan', days: 65, attributes: { size: 2, width: 2, comfort: 3, quality: 4 } },
]

const MODEL_IDS = ['4dfwd-4', 'runfalcon-5', 'samba-og', 'samba-liberty', 'ultraboost-1', 'gazelle-indoor', 'adios-pro-4', 'adizero-prime-x', 'adizero-boston-12', 'adizero-sl2', 'dropset-control', 'adilette-aqua', 'tee-omaha', 'firebird-leopard', 'tiro-dress', 'runxboost-socks', 'mid-ankle-socks']

function build(modelId, list) {
  return list.map((r, i) => ({
    id: `rv_${modelId}_${i}`,
    modelId,
    rating: r.rating,
    title: r.title,
    body: r.body,
    nickname: r.nickname,
    recommend: r.rating >= 4,
    verifiedPurchase: Boolean(r.verified),
    attributes: r.attributes,
    helpful: { up: (i * 3) % 7, down: i % 2 },
    createdAt: ago(r.days),
  }))
}

export const reviews = [
  ...build('adizero-evo-sl', EVO_SL),
  ...MODEL_IDS.flatMap((m, idx) => build(m, GENERIC.slice(0, 2 + (idx % 3)))),
]

/** Số lượng review "hiển thị" (giả lập lớn như site thật), dùng cho rating count. */
export const reviewCountBoost = {
  'adizero-evo-sl': 877,
  'samba-og': 4312,
  'ultraboost-1': 2190,
  'gazelle-indoor': 958,
  'runfalcon-5': 1430,
}

export const aiSummaries = {
  'adizero-evo-sl': [
    'Đôi giày mang lại hiệu năng và sự thoải mái ở mức cao với mức giá hợp lý.',
    'Người đánh giá khen ngợi đế giữa phản hồi nhanh và có độ nảy, mang lại cảm giác chạy đầy năng lượng, phù hợp với nhiều kiểu chạy khác nhau.',
    'Đôi giày được mô tả là cực kỳ thoải mái, nhẹ và thoáng khí, với phần mũi rộng rãi phù hợp với nhiều độ rộng bàn chân.',
    'Một vài phàn nàn nhỏ gồm lưỡi gà hay bị trượt xuống và dây giày hơi mỏng, nhưng nhìn chung mọi người đều đồng ý đây là một đôi giày chạy bộ toàn diện xuất sắc và rất đáng tiền.',
  ],
}
