# MyFlix KKPhim V3

V3 chỉ dùng KKPhim / PhimAPI, không dùng OneDrive hay Google Drive.

## Tính năng
- Giao diện kiểu Netflix với banner phim nổi bật
- Hàng ngang: Mới cập nhật, Phim lẻ, Phim bộ
- Tìm kiếm
- Trang chi tiết riêng
- Danh sách server / tập phim
- Trang xem full-screen, ưu tiên HLS.js và fallback link_embed
- Tiếp tục xem: lưu tiến trình từng tập bằng localStorage
- Danh sách yêu thích: lưu localStorage
- Hiện thanh tiến trình trên poster
- Responsive cho điện thoại

## Render
Build Command: `npm install`
Start Command: `npm start`

Không cần MongoDB.

Tùy chọn Environment:
`KKPHIM_API=https://phimapi.com`

## Lưu ý
Dữ liệu/phim được lấy từ API nguồn. Khả năng phát phụ thuộc link mà API trả về và chính sách/CORS của nguồn.
