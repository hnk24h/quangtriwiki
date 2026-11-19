import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="travel-footer">
      {/* 1. Travel Pledge / Lời Hứa Du Lịch Văn Minh */}
      <div className="travel-pledge-strip">
        <div className="container">
          <div className="pledge-grid">
            <div className="pledge-item">
              <span className="pledge-icon">🌿</span>
              <div className="pledge-content">
                <strong>Du Lịch Xanh & Không Rác Thải</strong>
                <p>Giữ gìn vẻ đẹp hoang sơ của Trường Sơn đại ngàn và biển đảo Cồn Cỏ</p>
              </div>
            </div>
            <div className="pledge-item">
              <span className="pledge-icon">🕊️</span>
              <div className="pledge-content">
                <strong>Tôn Nghiêm Di Sản Lịch Sử</strong>
                <p>Trang nghiêm, thành kính tại các di tích chiến trường và nghĩa trang liệt sĩ</p>
              </div>
            </div>
            <div className="pledge-item">
              <span className="pledge-icon">🤝</span>
              <div className="pledge-content">
                <strong>Ủng Hộ Kinh Tế Bản Địa</strong>
                <p>Đồng hành cùng đồng bào Vân Kiều, Pa Cô và người dân Quảng Trị</p>
              </div>
            </div>
            <div className="pledge-item">
              <span className="pledge-icon">🧭</span>
              <div className="pledge-content">
                <strong>An Toàn Là Trên Hết</strong>
                <p>Kiểm tra thời tiết, đèo dốc và chuẩn bị đồ bảo hộ trước khi khởi hành</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer 4-Column Directory */}
      <div className="travel-footer-main">
        <div className="container">
          <div className="travel-footer-grid">
            {/* Col 1: Brand & Editorial Philosophy */}
            <div className="footer-col-brand">
              <Link href="/" className="footer-brand-logo">
                <span className="logo-pin">📍</span>
                <span className="logo-text">QuangTri.wiki</span>
                <span className="logo-badge">2026</span>
              </Link>
              <p className="footer-tagline">
                Nền tảng cẩm nang du lịch và cung đường di sản Quảng Trị độc lập. Đi chậm để cảm nhận vùng đất thiêng anh hùng, từ đèo mây Sa Mù đại ngàn đến đảo ngọc Cồn Cỏ tiền tiêu.
              </p>

              <div className="footer-badges-wrap">
                <span className="footer-cert-pill">🇻🇳 Cẩm nang phi lợi nhuận</span>
                <span className="footer-cert-pill">✦ Dữ liệu thực địa 100%</span>
              </div>

              <div className="footer-social-row">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-pill" title="Cộng đồng Facebook">
                  <span>Facebook Phượt</span> ↗
                </a>
                <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" className="social-pill" title="Hội nhóm Zalo">
                  <span>Zalo Hỗ Trợ</span> ↗
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-pill" title="Video Review">
                  <span>Youtube</span> ↗
                </a>
              </div>
            </div>

            {/* Col 2: Cung Đường & Danh Thắng */}
            <div className="footer-col-links">
              <h4 className="footer-col-heading">Cung Đường & Danh Thắng</h4>
              <ul className="footer-menu-list">
                <li><Link href="/cung-duong">Bản Đồ Tọa Độ Toàn Cảnh</Link></li>
                <li><Link href="/diem-den/cau-hien-luong-ben-hai">Cầu Hiền Lương · Vĩ Tuyến 17</Link></li>
                <li><Link href="/diem-den/thanh-co-quang-tri">Thành Cổ Quảng Trị 81 Ngày Đêm</Link></li>
                <li><Link href="/diem-den/dia-dao-vinh-moc">Kỳ Quan Địa Đạo Vịnh Mốc</Link></li>
                <li><Link href="/diem-den/deo-sa-mu">Đỉnh Đèo Sa Mù Săn Mây 1.400m</Link></li>
                <li><Link href="/diem-den/san-bay-ta-con">Cứ Điểm Khe Sanh & Tà Cơn</Link></li>
                <li><Link href="/diem-den/dao-con-co">Đảo Tiền Tiêu Cồn Cỏ</Link></li>
              </ul>
            </div>

            {/* Col 3: Cẩm Nang Thực Địa */}
            <div className="footer-col-links">
              <h4 className="footer-col-heading">Cẩm Nang & Tiện Ích</h4>
              <ul className="footer-menu-list">
                <li><Link href="/am-thuc">Ẩm Thực & Quán Ngon Đất Lửa</Link></li>
                <li><Link href="/dich-vu">Homestay, Thuê Xe & Tàu Cồn Cỏ</Link></li>
                <li><Link href="/lich-trinh">Lộ Trình Gợi Ý Theo Ngày</Link></li>
                <li><Link href="/chi-phi">Dự Toán Chi Phí Tự Túc</Link></li>
                <li><Link href="/dien-dan">Diễn Đàn Chia Sẻ Kinh Nghiệm</Link></li>
                <li><Link href="/tien-ich">Trạm Xăng & Điểm Cứu Hộ 24/7</Link></li>
                <li><Link href="/so-tay">Sổ Tay Lưu Trữ Cá Nhân</Link></li>
              </ul>
            </div>

            {/* Col 4: Hotline Bảo An & Hỗ Trợ Khẩn Cấp */}
            <div className="footer-col-safety">
              <h4 className="footer-col-heading">Hotline Bảo An 24/7</h4>
              <p className="safety-subtext">Lưu vào điện thoại các số liên lạc khẩn cấp trước khi khởi hành qua đường rừng:</p>
              
              <div className="safety-phone-list">
                <div className="safety-phone-card emergency">
                  <span className="phone-label">🚨 Cứu hộ Đèo Sa Mù & Khe Sanh</span>
                  <a href="tel:0914123456" className="phone-num">0914.123.456</a>
                </div>
                <div className="safety-phone-card">
                  <span className="phone-label">🚑 Cấp cứu Y tế Khẩn cấp</span>
                  <a href="tel:115" className="phone-num">115</a>
                </div>
                <div className="safety-phone-card">
                  <span className="phone-label">👮 CSGT Tỉnh Quảng Trị</span>
                  <a href="tel:02333852445" className="phone-num">0233.385.2445</a>
                </div>
              </div>

              <div className="footer-contact-box">
                <span className="contact-box-title">Đóng góp thông tin & cẩm nang:</span>
                <a href="mailto:bandoc@quangtri.wiki" className="contact-email-link">bandoc@quangtri.wiki</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal & Administration Bar */}
      <div className="travel-footer-bottom">
        <div className="container bottom-inner">
          <div className="bottom-copyright">
            © 2026 <strong>QuangTri.wiki</strong> · Nền tảng cẩm nang du lịch và cung đường di sản Quảng Trị độc lập, phi thương mại.
          </div>
          <div className="bottom-sublinks">
            <Link href="/dich-vu">Đăng ký Đối tác Bản địa</Link>
            <span className="bottom-dot">·</span>
            <Link href="/tien-ich">Bảo an & Cứu hộ</Link>
            <span className="bottom-dot">·</span>
            <Link href="/chi-phi">Dự toán chuyến đi</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
