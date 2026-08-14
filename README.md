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


## V3 Player Fix
- Ưu tiên `link_embed` của nguồn phim để phát bằng iframe.
- `link_m3u8` chỉ dùng làm fallback.
- Thêm quyền autoplay/fullscreen cho iframe.
- Có thông báo khi fallback HLS gặp lỗi fatal.


## Series / Episode Fix
- Thêm danh sách tập ngay trong màn hình xem.
- Tập đang phát được tô đỏ.
- Chuyển tập không cần quay lại trang chi tiết.
- Backend fallback từ `/phim/{slug}` sang `/v1/api/phim/{slug}` nếu format đầu không trả tập.
- Chuẩn hóa cả `episodes -> server_data` và danh sách tập phẳng.


## Watch Layout Update
- Màn xem phim đổi sang bố cục giống ảnh mẫu: player lớn bên trái, danh sách tập cố định bên phải.
- Sidebar có tên phim, tên gốc/năm, server, ô tìm tập.
- Tập đang phát tô đỏ.
- Có nút Tập trước / Tập tiếp dưới player.
- Trên điện thoại sidebar tự chuyển xuống dưới player.


## PC layout fix
- Desktop luôn giữ player bên trái và danh sách tập 360px bên phải.
- Chỉ chuyển danh sách tập xuống dưới khi viewport <= 600px.
- Desktop có min-width 1000px để player không bị ép biến mất.


## V3 Cinema + Genres
- Thêm `Phim chiếu rạp` lên menu và trang chủ.
- Trang chủ có hàng ngang `🍿 Phim chiếu rạp`.
- Thêm menu `Thể loại` dạng dropdown.
- Danh sách thể loại tải động từ `/the-loai`.
- Chọn thể loại mở danh sách phim qua `/v1/api/the-loai/{slug}`.
