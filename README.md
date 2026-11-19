# 🇻🇳 QuangTri.wiki · Nền Tảng Du Lịch & Cung Đường Di Sản (Next.js + Supabase)

**QuangTri.wiki** là nền tảng cẩm nang du lịch và khám phá cung đường trực tuyến độc lập về **tỉnh Quảng Trị, Việt Nam**, được kiến trúc chuẩn mực theo mô hình hiện đại **Next.js 15 (App Router) + Supabase (PostgreSQL Database, Realtime, Storage, RLS)** lấy cảm hứng từ giao diện nổi tiếng [Hagiang.wiki](https://hagiang.wiki/).

---

## ⚡ Kiến Trúc Chuyển Đổi: Next.js + Supabase

Dự án đã được chuyển đổi hoàn chỉnh từ Vanilla web sang **Next.js + Supabase**:

### 1. Database & Supabase Integration (`supabase/`)
- **[supabase/schema.sql](file:///home/hoank/workspace/quangtri/supabase/schema.sql)**:
  - Khởi tạo 6 bảng quan hệ: `places` (24 điểm đến), `services` (homestay, nhà xe, vé tàu), `threads` (bài viết diễn đàn), `comments` (bình luận), `leads` (tracking click Zalo/Hotline), `partner_registrations` (hồ sơ đăng ký đối tác).
  - Tích hợp sẵn **Row Level Security (RLS)** phân quyền truy cập an toàn.
- **[supabase/seed.sql](file:///home/hoank/workspace/quangtri/supabase/seed.sql)**:
  - Script nạp toàn bộ 24 danh thắng Quảng Trị và 4 đối tác bản địa vào Database chỉ bằng 1 click trong Supabase SQL Editor.
- **Supabase Clients**:
  - `lib/supabase/client.ts`: Client tương tác phía trình duyệt.
  - `lib/supabase/server.ts`: Server client tối ưu hóa bảo mật và SSR.
  - `lib/supabase/types.ts`: TypeScript Database Schema đồng bộ 100%.

### 2. Next.js App Router (`app/`)
- **`app/layout.tsx`**: Typography Playfair Display + Plus Jakarta Sans, siêu dữ liệu SEO toàn cầu.
- **`app/page.tsx`**: Trang chủ Hagiang.wiki style, kết nối trực tiếp Supabase để tải danh thắng và dịch vụ.
- **`app/diem-den/[slug]/page.tsx`**: Trang chi tiết từng địa danh chuẩn SEO Google, nhúng dữ liệu cấu trúc Schema.org `TouristAttraction` và OpenGraph.
- **`app/dich-vu/page.tsx`**: Danh bạ đối tác Homestay, Thuê xe Sa Mù, Vé tàu Cồn Cỏ với nút Gọi Hotline và Chat Zalo.
- **`app/dien-dan/page.tsx`**: Diễn đàn cộng đồng chia sẻ kinh nghiệm, ảnh check-in và review.
- **`app/admin/page.tsx`**: Bảng điều khiển quản trị theo dõi lượt Leads và tính toán doanh thu thực tế.
- **`app/sitemap.ts` & `app/robots.ts`**: Tự động sinh sitemap và robots chuẩn Google Search Console.
- **`app/api/`**: Cụm Route Handlers (`/api/leads`, `/api/threads`, `/api/services`, `/api/admin/metrics`).

---

## 🚀 Hướng Dẫn Khởi Chạy

### Cách 1: Chạy Dự Án Next.js 15 (Khuyên dùng)
```bash
cd /home/hoank/workspace/quangtri

# 1. Cài đặt dependencies (yêu cầu internet)
npm install

# 2. Cấu hình Supabase trong file .env.local
# Điền NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY của dự án bạn

# 3. Chạy môi trường phát triển
npm run dev
```
Truy cập: **`http://localhost:3000`**

### Cách 2: Chạy Phiên Bản Vanilla HTML/CSS/JS (Dự phòng)
Toàn bộ mã nguồn bản Vanilla thuần trước đây đã được lưu trữ an toàn trong thư mục `legacy/`:
```bash
cd /home/hoank/workspace/quangtri
npm run legacy
# hoặc: node legacy/server.js
```
Truy cập: **`http://localhost:3000`** (hoặc `http://localhost:3001`).

---

## 🌟 Điểm Nhấn & Thiết Kế Chuẩn Hagiang.wiki

### 1. Phong Cách Thiết Kế Đặc Trưng Từ Hagiang.wiki
- **Tone màu kem ấm tự nhiên (Warm Ecru/Cream `#f7f4ee`):** Màu sắc nền thanh nhã, tôn lên vẻ đẹp mộc mạc và chân thật của đất trời.
- **Nghệ thuật Typography Serif ("Playfair Display"):** Tiêu đề chính *"Gần hơn với Quảng Trị chân thật"* và phụ đề *"Đèo núi. Miền đất thiêng yên bình. Hành trình đáng để đi chậm"* mang lại cảm giác bình yên, sâu lắng, đậm chất văn hóa du lịch đi chậm.
- **Header chuẩn mực & Khẩu hiệu:** Logo đỉnh núi + tên thương hiệu `Quangtri Wiki` đi kèm dòng chữ `ĐI CHẬM · KHÁM PHÁ`, thanh điều hướng gạch chân tinh tế, nút capsule xanh rừng già `Kết nối với chúng tôi ↗` và dải motto `Lên lịch trình · Trải nghiệm · Lưu nhật ký`.

### 2. Hero Panoramic Tràn Viền & Hiệu Ứng Sương Khói
- **Full-bleed 100vw Slideshow:** Bức tranh phong cảnh đại ngàn Trường Sơn, đèo Sa Mù mây ngàn và biển đảo Cồn Cỏ trải dài trọn vẹn màn hình.
- **Lớp sương mờ chuyển sắc (Misty Gradient Wash):** Hòa quyện ảnh phong cảnh vào nền kem chữ bên trái một cách mềm mại, tự nhiên.
- **Thanh chấm Capsule:** Bộ chỉ báo chuyển slide viên thuốc thanh mảnh nằm giữa đáy banner.

### 3. Thẻ Kính Thời Tiết Động ("Thời Tiết Sắp Tới")
Tái hiện chính xác widget nổi tiếng trên Hagiang.wiki:
- **Bộ chọn khu vực:** Linh hoạt chuyển đổi giữa `Hướng Hóa (Đèo Sa Mù)`, `TP Đông Hà`, `Huyện Đảo Cồn Cỏ`, `Vĩnh Linh (DMZ)`.
- **Dự báo 7 ngày:** Hiển thị nhiệt độ cao/thấp, icon thời tiết và tỷ lệ mưa theo ngày.
- **Chỉ số chi tiết:** Cập nhật mưa (%), độ ẩm (%), tốc độ gió giật theo giờ.
- **Lời khuyên thời tiết thực tế:** *"Trời có thể mưa phùn, nhớ mang áo ấm và áo mưa nhé!"*, *"Lạnh quá, ghé Khe Sanh nhâm nhi ly cà phê cho ấm!"*.

### 4. Dải Ruy-băng Xanh Rừng Già Toàn Màn Hình (Bottom Bar)
- Thanh ribbon màu xanh rừng già `#133e2f`:
  - Trái: *"Bắt đầu từ toàn cảnh. Chọn nơi muốn đến."*
  - Phải: Nút tròn *"Chọn vùng ∨"* dẫn trực tiếp tới 8 phân khu lộ trình QT-01 -> QT-08.

### 5. Hệ Thống Phân Vùng Lộ Trình (QT Route Codes)
Tương tự mô hình mã cung đường HG-01...HG-10 của Hà Giang, Quảng Trị được chuẩn hóa thành 8 khu vực trải nghiệm:
- **QT-01: TP Đông Hà & Vùng Trung Tâm** - Đô thị huyết mạch ngã ba QL1A & Đường 9.
- **QT-02: Thị Xã Quảng Trị & Hải Lăng** - Thành Cổ 81 ngày đêm rực lửa, sông Thạch Hãn, Thánh địa La Vang, làng bánh lọc Mỹ Chánh.
- **QT-03: Vĩnh Linh & Vĩ Tuyến 17 (DMZ)** - Cầu Hiền Lương - Sông Bến Hải, Địa đạo Vịnh Mốc 3 tầng ngầm, bãi biển Cửa Tùng.
- **QT-04: Gio Linh & Cửa Việt** - Bãi biển Cửa Việt cát mịn, Nghĩa trang Liệt sĩ Quốc gia Trường Sơn, Mũi Trèo hoang sơ.
- **QT-05: Hướng Hóa & Khe Sanh** - Thiên đường săn mây đèo Sa Mù (1.400m), Thác Chênh Vênh, Sân bay Tà Cơn, cánh đồng điện gió.
- **QT-06: Đakrông & Đường Hồ Chí Minh** - Cầu treo Đakrông, suối nước nóng Klu, bản văn hóa Bru - Vân Kiều.
- **QT-07: Huyện Đảo Cồn Cỏ** - "Viên ngọc xanh" tiền đồn Tổ quốc giữa Biển Đông, lặn ngắm san hô Bến Tranh, hải đăng Cồn Cỏ.
- **QT-08: Cam Lộ & Vùng Trung Du** - Căn cứ Tân Sở, đền thờ vua Hàm Nghi, đặc sản gà Cùa và thảo dược Chè Vằng.

### 2. Bản Đồ Tương Tác Trực Quan (Interactive SVG Map)
- Mô phỏng trọn vẹn địa hình Quảng Trị từ sườn Tây dãy Trường Sơn đến Biển Đông.
- Trực quan hóa các trục giao thông huyết mạch: Quốc lộ 9 (xuyên Á sang Lào), Quốc lộ 1A, Nhánh Tây đường mòn Hồ Chí Minh, và tuyến tàu cao tốc ra đảo Cồn Cỏ.
- Bấm vào từng trạm cung đường (nodes) để xem thông tin tóm tắt và lọc điểm đến tự động.

### 3. Tìm Kiếm & Lọc Điểm Đến Tức Thì (Instant Search & Filter)
- Hỗ trợ phím tắt `Ctrl + K` hoặc bấm vào thanh tìm kiếm.
- Lọc theo danh mục: Di tích lịch sử & Tâm linh, Săn mây & Phượt đèo, Bãi biển cát trắng, Biển đảo Cồn Cỏ, Sinh thái & Thác suối.
- Xem modal chi tiết gồm: Lịch sử, điểm nhấn tham quan, giá vé, giờ mở cửa, tọa độ GPS và lời khuyên phượt thủ.

### 4. Sổ Tay Cá Nhân Của Tôi (My Trip Notebook & Local Storage)
Lấy cảm hứng từ tính năng bảo mật không cần đăng nhập của Hagiang.wiki:
- **Bookmark địa điểm:** Lưu các tọa độ yêu thích chỉ bằng 1 cú click.
- **Tính toán ngân sách tự động (Budget Calculator):** Tùy chỉnh số ngày, số người, xăng xe, khách sạn, tiền ăn để ra tổng kinh phí và chi phí/người.
- **Checklist chuẩn bị đồ:** Danh mục vật dụng cần mang khi đi phượt Sa Mù và ra đảo Cồn Cỏ (lưu trạng thái checkbox).
- **Ghi chú cá nhân offline:** Ghi chép lịch trình riêng tư lưu trực tiếp trên thiết bị của bạn.

### 5. Cẩm Nang Ẩm Thực Đặc Sản
- Cháo vạt giường (Bánh canh cá lóc Hải Lăng)
- Bánh bột lọc Mỹ Chánh & tôm sông bọc bột sắn trong veo
- Thịt trâu lá trơng non cay the thơm nồng
- Bún hến Mai Xá (Di sản ẩm thực Việt Nam)
- Gà Cùa Cam Lộ nướng than hồng
- Cà phê Arabica Khe Sanh đặc sản vùng cao nguyên

### 6. Tiện Ích, Cây Xăng & Hotline Cứu Hộ Khẩn Cấp
- Cảnh báo các đoạn đèo dốc sương mù và danh sách cây xăng trước khi vào đường Tây Trường Sơn vắng.
- Số hotline cứu hộ xe máy đèo Sa Mù, trạm y tế, số đặt vé tàu cao tốc ra đảo Cồn Cỏ.
- Hướng dẫn thời tiết: Mùa săn mây (T11 - T2), mùa biển đảo (T3 - T8), cẩm nang tránh gió Lào (T5 - T7).

## 🚀 4 Bước Nâng Cấp Production & Hệ Thống Kiếm Tiền (Monetization)

Nền tảng đã hoàn tất 4 bước chuyển đổi từ MVP tĩnh sang **Nền tảng Du lịch Quảng Trị Production**:

### 🎯 BƯỚC 1: Cầu Nối Dịch Vụ & Đối Tác Bản Địa (Local Partner Hub)
- **Mục "Lưu trú & Dịch vụ" (`#dich-vu`):**
  - Danh mục Homestay, Khách sạn, Thuê xe máy phượt Sa Mù, Vé tàu cao tốc đảo Cồn Cỏ, Tour Guide bản địa.
  - Mỗi dịch vụ hiển thị đầy đủ: ảnh đại diện, giá niêm yết, địa chỉ, badge *Đã xác minh (Verified Partner)*, hotline và nút **Nhắn Zalo** tiện lợi.
- **Form Đăng ký Dịch vụ / Hợp tác kinh doanh (`#partner-reg-modal-overlay`):**
  - Các chủ cơ sở tại Quảng Trị có thể trực tiếp gửi thông tin homestay/dịch vụ lên hệ thống.
  - Tự động lưu vào database (`db.json`) và thông báo trạng thái phê duyệt.

### 🔌 BƯỚC 2: Backend REST API & Persistent Database (Zero External Dependencies)
- **Cơ sở dữ liệu bền vững `db.json`:**
  - `threads`: Lưu trữ toàn bộ bài viết, bình luận, lượt thích của Diễn đàn Cộng đồng.
  - `partners`: Danh sách đối tác dịch vụ đã xác minh.
  - `partnerRegistrations`: Hồ sơ đăng ký từ các chủ homestay, nhà xe, nhà tàu.
  - `leads`: Lưu nhật ký click gọi điện / nhắn Zalo để đối soát hoa hồng.
- **Hệ thống REST API Endpoints:**
  - `GET /api/places`: Danh sách 24+ điểm đến chuẩn hóa.
  - `GET /api/services`: Danh sách dịch vụ & lưu trú.
  - `GET /api/threads` & `POST /api/threads`: Lấy và đăng bài viết diễn đàn thời gian thực.
  - `POST /api/threads/:id/comments`: Gửi bình luận và câu hỏi.
  - `POST /api/partners/register`: Đăng ký làm đối tác dịch vụ.
  - `POST /api/leads`: Ghi nhận chuyển đổi khách du lịch liên hệ đối tác (Lead Tracking).
  - `GET /api/admin/metrics`: Số liệu thống kê chuyển đổi và doanh thu dự kiến.

### 🌐 BƯỚC 3: SEO Đa Trang, Rich Snippets Schema.org, Sitemap & Robots
- **Dynamic SEO Landing Pages (`/diem-den/:id`):**
  - Tạo URL tĩnh riêng cho từng địa danh (ví dụ: `/diem-den/thanh-co-quang-tri`, `/diem-den/dao-con-co`, `/diem-den/deo-sa-mu`).
  - Tích hợp chuẩn dữ liệu có cấu trúc **Schema.org JSON-LD (`TouristAttraction`, `GeoCoordinates`)** giúp Google hiển thị sao đánh giá, hình ảnh và địa chỉ trực tiếp trên kết quả tìm kiếm.
  - Thẻ OpenGraph (og:title, og:image, og:description) và Twitter Card tối ưu hiển thị khi share lên Facebook/Zalo.
- **Sitemap & Robots.txt:**
  - `/sitemap.xml`: XML Sitemap chuẩn Google Search Console, tự động đồng bộ tất cả điểm đến.
  - `/robots.txt`: Hướng dẫn các bot tìm kiếm Google/Bing thu thập dữ liệu hiệu quả.

### 💰 BƯỚC 4: Hệ thống Quản trị & Mô Hình Kiếm Tiền (Monetization Engine)
- **Mô hình Doanh thu Đa kênh:**
  1. **Phí Niêm Yết Xác Minh (Verified Listing Fee):** 500.000 - 1.000.000 VNĐ/năm cho mỗi homestay/nhà xe có huy hiệu xanh uy tín.
  2. **Thu Phí Lead / Commission (Pay-per-Lead):** Nhận 5% - 10% hoa hồng trên mỗi giao dịch đặt phòng hoặc 15.000 VNĐ/lần click Zalo hotline chất lượng cao.
  3. **Affiliate Marketing:** Tích hợp nút đặt phòng Agoda, Booking.com, Klook (`affiliateConfig` trong `data.js`) với tracking affiliate ID.
- **Admin Dashboard Xem Chỉ Số Thời Gian Thực:**
  - Nhấp vào link bí mật `⚙️ Quản trị Doanh thu & Leads` ở footer hoặc nút Admin để mở modal thống kê:
    - Tổng đối tác đang hoạt động.
    - Tổng hồ sơ đăng ký mới cần duyệt.
    - Tổng số lượt kết nối khách hàng (Leads gọi điện & Zalo).
    - Doanh thu dự kiến tạm tính thời gian thực.

---

## 🚀 Hướng Dẫn Chạy Website

Dự án được viết bằng **thuần chuẩn Web hiện đại (HTML5, CSS3, ES6)** kết hợp **Node.js HTTP Server tích hợp sẵn**, hoàn toàn **không cần cài thêm npm packages bên ngoài**:

```bash
cd /home/hoank/workspace/quangtri
node server.js
```
- Mở trình duyệt: **`http://localhost:3000`** (hoặc `http://localhost:3001` nếu cổng 3000 đang bận).
- Sitemap: `http://localhost:3000/sitemap.xml`
- Robots: `http://localhost:3000/robots.txt`
- Trang SEO mẫu: `http://localhost:3000/diem-den/thanh-co-quang-tri`

---

## 📁 Cấu Trúc Thư Mục
```
quangtri/
├── index.html       # Giao diện chính chuẩn Hagiang.wiki, tích hợp Dịch vụ & Diễn đàn
├── styles.css       # Toàn bộ mã CSS thiết kế tinh tế, Glassmorphism & Responsive
├── app.js           # Logic giao diện, tương tác bản đồ, filter, lead tracking, modal
├── data.js          # Dữ liệu 24 điểm đến, ẩm thực, lịch trình, 4 đối tác bản địa & affiliate
├── server.js        # Node.js REST API Backend, dynamic SEO routes, Sitemap & Robots.txt
├── db.json          # Persistent JSON Database (threads, partners, registrations, leads)
├── package.json     # Thông tin dự án và script `npm start`
└── README.md        # Tài liệu hướng dẫn đầy đủ
```
quangtri/
├── index.html        # Giao diện chính Responsive, Dark/Light Mode, Hero, Map, Danh mục
├── styles.css        # Hệ thống CSS biến màu, bố cục, hiệu ứng thẻ, Drawer, Modal
├── data.js           # Dữ liệu 8 phân vùng, 14 điểm đến chi tiết, 6 đặc sản, 3 lịch trình
├── app.js            # Logic tương tác, bản đồ SVG, tìm kiếm, lưu trữ LocalStorage, tính tiền
├── server.js         # Web server tĩnh nhẹ viết bằng native Node.js (Zero external dependencies)
├── package.json      # Metadata và lệnh khởi chạy
└── README.md         # Hướng dẫn chi tiết dự án
```

---
*© 2026 QuangTri.wiki · Thiết kế dành riêng cho những ai yêu mến mảnh đất kiên cường và thiên nhiên kỳ vĩ Quảng Trị.*
