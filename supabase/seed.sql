-- =============================================================================
-- QuangTri.wiki · Seed Data Generated from data.js & db.json (100% Validated)
-- =============================================================================

-- 1. Danh sách Places (14 điểm đến)
INSERT INTO public.places (id, name, zone_code, zone_name, category, category_name, rating, rating_count, hero_image, gallery, short_desc, history, highlights, coordinates, address, open_time, ticket_price, tips) VALUES (
  'thanh-co-quang-tri',
  'Thành Cổ Quảng Trị',
  'QT-02',
  'Thị Xã Quảng Trị',
  'history',
  'Di tích lịch sử',
  4.9,
  1420,
  'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80']::TEXT[],
  'Chiến trường 81 ngày đêm mùa hè đỏ lửa năm 1972, biểu tượng thiêng liêng về lòng quả cảm bất diệt.',
  'Thành Cổ Quảng Trị là di tích quốc gia đặc biệt, nơi đã hứng chịu hơn 328.000 tấn bom đạn trong suốt 81 ngày đêm năm 1972 - tương đương sức công phá của 7 quả bom nguyên tử ném xuống Hiroshima. Ngày nay, trung tâm Thành Cổ là Đài tưởng niệm được thiết kế như một nấm mộ chung của hàng ngàn chiến sĩ, xung quanh là công viên hòa bình rợp bóng cây xanh.',
  ARRAY['Đài tưởng niệm trung tâm Thành Cổ hình tượng bát giác', 'Bảo tàng chứng tích lịch sử 81 ngày đêm', 'Khu vực bờ hào và cổng thành cổ còn vết tích đạn bom', 'Nghi thức thắp nến và dâng hương tri ân']::TEXT[],
  '16.7533° N, 107.1912° E',
  'Phường 2, Thị xã Quảng Trị',
  '07:00 - 17:30 hằng ngày',
  'Miễn phí (Tự nguyện thắp hương / hướng dẫn viên thuyết minh tại điểm)',
  'Nên mặc trang phục lịch sự, trang nghiêm. Có thể kết hợp dâng hoa tại Bến thả hoa sông Thạch Hãn ngay gần đó vào chiều hoàng hôn.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hero_image = EXCLUDED.hero_image,
  short_desc = EXCLUDED.short_desc,
  history = EXCLUDED.history,
  highlights = EXCLUDED.highlights,
  open_time = EXCLUDED.open_time,
  ticket_price = EXCLUDED.ticket_price;

INSERT INTO public.places (id, name, zone_code, zone_name, category, category_name, rating, rating_count, hero_image, gallery, short_desc, history, highlights, coordinates, address, open_time, ticket_price, tips) VALUES (
  'cau-hien-luong-ben-hai',
  'Đôi Bờ Hiền Lương - Sông Bến Hải',
  'QT-03',
  'Vĩnh Linh & Vĩ Tuyến 17',
  'history',
  'Di tích lịch sử',
  4.9,
  1850,
  'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=80']::TEXT[],
  'Vĩ tuyến 17 lịch sử - nơi chứng kiến nỗi đau chia cắt đất nước hơn 20 năm ròng rã và ngày ca khúc khải hoàn.',
  'Cầu Hiền Lương bắc qua dòng sông Bến Hải êm đềm, nằm đúng trên vĩ tuyến 17 - ranh giới chia cắt tạm thời hai miền Nam - Bắc theo Hiệp định Genève 1954. Cây cầu sơn hai màu tương phản (xanh và vàng) tái hiện lại những năm tháng đau thương nhưng kiên cường. Tại đây còn có Cột cờ Giới tuyến cao 38m, Nhà liên hợp, Cụm tượng đài Khát vọng thống nhất non sông.',
  ARRAY['Cầu Hiền Lương lịch sử chia hai nửa màu sơn biểu tượng', 'Cột cờ Giới tuyến và kỳ đài Hiền Lương cao vút', 'Cụm tượng đài Khát vọng thống nhất non sông', 'Hệ thống loa phóng thanh công suất khủng đối kháng bờ Bắc - Nam xưa kia']::TEXT[],
  '17.0019° N, 107.0984° E',
  'Quốc lộ 1A, Vĩnh Thành, Vĩnh Linh, Quảng Trị',
  '07:00 - 17:30',
  '50.000 VNĐ / người lớn, 20.000 VNĐ / trẻ em',
  'Đứng giữa cầu ngắm dòng Bến Hải và lắng nghe thuyết minh qua loa tái hiện không gian lịch sử rất xúc động.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hero_image = EXCLUDED.hero_image,
  short_desc = EXCLUDED.short_desc,
  history = EXCLUDED.history,
  highlights = EXCLUDED.highlights,
  open_time = EXCLUDED.open_time,
  ticket_price = EXCLUDED.ticket_price;

INSERT INTO public.places (id, name, zone_code, zone_name, category, category_name, rating, rating_count, hero_image, gallery, short_desc, history, highlights, coordinates, address, open_time, ticket_price, tips) VALUES (
  'dia-dao-vinh-moc',
  'Địa Đạo Vịnh Mốc & Làng Hầm',
  'QT-03',
  'Vĩnh Linh',
  'history',
  'Di tích lịch sử',
  4.9,
  2100,
  'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80']::TEXT[],
  'Kỳ tích kiến trúc ngầm dưới lòng đất ba tầng kiên cố, nơi che chở hàng trăm người dân và sinh ra 17 em bé trong mưa bom.',
  'Địa đạo Vịnh Mốc là một kỳ quan quân sự độc nhất vô nhị. Được đào hoàn toàn bằng tay từ năm 1965 đến 1967, hệ thống địa đạo dài gần 2km với 3 tầng ngầm (tầng sâu nhất cách mặt đất 23m), có 13 cửa thông ra ngoài (trong đó có 6 cửa trổ ra biển). Trong lòng địa đạo có hội trường, giếng nước, bếp Hoàng Cầm, trạm phẫu thuật, phòng sinh và phòng nghỉ cho các gia đình.',
  ARRAY['Hệ thống đường hầm xuyên lòng đất 3 tầng kiên cố', 'Phòng hộ sinh ngầm - nơi 17 em bé cất tiếng khóc chào đời an toàn', 'Cửa hầm số 6 hướng tầm mắt thẳng ra đại dương xanh ngắt', 'Bảo tàng trưng bày các vật dụng và kỷ vật làng hầm Vĩnh Linh']::TEXT[],
  '17.0427° N, 107.1147° E',
  'Xã Kim Thạch, huyện Vĩnh Linh, Quảng Trị',
  '07:00 - 17:00',
  '50.000 VNĐ / người lớn, 25.000 VNĐ / trẻ em',
  'Trong hầm nhiệt độ mát mẻ nhưng độ ẩm cao, lối đi có đèn điện nhưng nên mang giày thể thao chống trơn trượt.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hero_image = EXCLUDED.hero_image,
  short_desc = EXCLUDED.short_desc,
  history = EXCLUDED.history,
  highlights = EXCLUDED.highlights,
  open_time = EXCLUDED.open_time,
  ticket_price = EXCLUDED.ticket_price;

INSERT INTO public.places (id, name, zone_code, zone_name, category, category_name, rating, rating_count, hero_image, gallery, short_desc, history, highlights, coordinates, address, open_time, ticket_price, tips) VALUES (
  'san-bay-ta-con',
  'Sân Bay Tà Cơn & Cứ Điểm Khe Sanh',
  'QT-05',
  'Hướng Hóa & Khe Sanh',
  'history',
  'Di tích lịch sử',
  4.8,
  960,
  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80']::TEXT[],
  'Cứ điểm đầu não trong tập đoàn cứ điểm Khe Sanh của quân đội Mỹ tại Chiến dịch Đường 9 - Khe Sanh 1968.',
  'Sân bay Tà Cơn là một cứ điểm chiến lược nòng cốt trong chiến tranh Việt Nam. Ngày nay, nơi đây lưu giữ nhiều hiện vật chiến tranh giá trị gồm máy bay vận tải C-130, trực thăng Chinook, máy bay UH-1A, xe tăng M48, đài chỉ huy và hệ thống hầm hào công sự.',
  ARRAY['Xác máy bay quân sự C-130, trực thăng UH-1 và xe tăng nguyên bản', 'Đường băng dã chiến bằng tôn đục lỗ đặc trưng', 'Nhà bảo tàng tư liệu Đường 9 - Khe Sanh', 'Vườn hoa hướng dương và cafe chill bên ngoài khuôn viên di tích']::TEXT[],
  '16.6534° N, 106.7118° E',
  'Xã Tân Hợp, huyện Hướng Hóa, Quảng Trị',
  '07:30 - 17:00',
  '50.000 VNĐ / người',
  'Nằm ngay trên đường đi thị trấn Khe Sanh, rất tiện kết hợp đi thác Chênh Vênh và đèo Sa Mù.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hero_image = EXCLUDED.hero_image,
  short_desc = EXCLUDED.short_desc,
  history = EXCLUDED.history,
  highlights = EXCLUDED.highlights,
  open_time = EXCLUDED.open_time,
  ticket_price = EXCLUDED.ticket_price;

INSERT INTO public.places (id, name, zone_code, zone_name, category, category_name, rating, rating_count, hero_image, gallery, short_desc, history, highlights, coordinates, address, open_time, ticket_price, tips) VALUES (
  'deo-sa-mu',
  'Đèo Sa Mù - Thiên Đường Săn Mây',
  'QT-05',
  'Hướng Hóa - Hướng Phùng',
  'adventure',
  'Phượt đèo & Săn mây',
  4.9,
  1340,
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80']::TEXT[],
  'Được mệnh danh là ''cổng trời'' nóc nhà Quảng Trị, dài gần 20km nối xã Hướng Phùng và Hướng Việt quanh năm mây ngàn bao phủ.',
  'Đèo Sa Mù nằm trên nhánh Tây đường Hồ Chí Minh, ở độ cao gần 1.400m so với mực nước biển. Đây là cung đèo huyền thoại với các phượt thủ miền Trung, nơi hội tụ khí hậu quanh năm se lạnh sương mù bao phủ, thảm thực vật rừng nguyên sinh rêu phong cổ thụ và những biển mây bềnh bồng cuồn cuộn vào sáng sớm.',
  ARRAY['Biển mây trắng xóa ôm trọn thung lũng Trường Sơn vào bình minh', 'Những khúc cua tay áo ngoạn mục giữa rừng già nguyên sinh', 'Rừng cây phong lá đỏ và các loài hoa dại nở rộ mùa đông xuân', 'Cung đường phượt nối liền Quảng Trị và Quảng Bình hoang sơ']::TEXT[],
  '16.7820° N, 106.5821° E',
  'Đường Hồ Chí Minh Tây, Hướng Hóa, Quảng Trị',
  'Tự do khám phá (Nên đi từ 06:00 - 17:00)',
  'Miễn phí',
  'Đoạn đèo thường có sương mù dày đặc và không có sóng điện thoại ở một số khúc, cần chuẩn bị xe máy tốt, bật đèn sương mù và giữ ấm cơ thể.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hero_image = EXCLUDED.hero_image,
  short_desc = EXCLUDED.short_desc,
  history = EXCLUDED.history,
  highlights = EXCLUDED.highlights,
  open_time = EXCLUDED.open_time,
  ticket_price = EXCLUDED.ticket_price;

INSERT INTO public.places (id, name, zone_code, zone_name, category, category_name, rating, rating_count, hero_image, gallery, short_desc, history, highlights, coordinates, address, open_time, ticket_price, tips) VALUES (
  'thac-chenh-venh',
  'Thác Chênh Vênh',
  'QT-05',
  'Hướng Hóa',
  'nature',
  'Sinh thái & Thác suối',
  4.8,
  780,
  'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80']::TEXT[],
  'Viên ngọc bích ẩn sâu dưới chân đèo Sa Mù với dòng nước xanh trong vắt len lỏi qua những khối đá cổ thụ.',
  'Thác Chênh Vênh nằm lọt thỏm giữa cánh rừng nguyên sinh bạt ngàn của xã Hướng Phùng. Dòng thác đổ từ trên vách đá cao xuống một hồ nước màu ngọc bích phẳng lặng. Nơi đây là điểm đến lý tưởng cho các hoạt động cắm trại dã ngoại, tắm suối giải nhiệt và trải nghiệm văn hóa bản địa người Vân Kiều.',
  ARRAY['Hồ nước trong veo màu ngọc lục bảo soi bóng mây trời', 'Bãi đá phẳng thích hợp dựng lều cắm trại glamping', 'Tiếng thác nước rì rầm hòa cùng tiếng chim rừng đại ngàn', 'Thưởng thức cá suối nướng muối ớt và cơm lam người Vân Kiều']::TEXT[],
  '16.7329° N, 106.6025° E',
  'Bản Chênh Vênh, xã Hướng Phùng, Hướng Hóa, Quảng Trị',
  '07:00 - 18:00',
  '20.000 VNĐ / người (Phí bảo vệ môi trường bản làng)',
  'Mang theo đồ bơi, thuốc chống côn trùng và nhớ dọn sạch rác khi rời đi để bảo vệ môi trường sinh thái.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hero_image = EXCLUDED.hero_image,
  short_desc = EXCLUDED.short_desc,
  history = EXCLUDED.history,
  highlights = EXCLUDED.highlights,
  open_time = EXCLUDED.open_time,
  ticket_price = EXCLUDED.ticket_price;

INSERT INTO public.places (id, name, zone_code, zone_name, category, category_name, rating, rating_count, hero_image, gallery, short_desc, history, highlights, coordinates, address, open_time, ticket_price, tips) VALUES (
  'canh-dong-dien-gio-huong-linh',
  'Cánh Đồng Quạt Gió Hướng Linh & Hướng Tân',
  'QT-05',
  'Hướng Hóa',
  'checkin',
  'Check-in sống ảo',
  4.7,
  1120,
  'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80']::TEXT[],
  'Những trụ tuabin gió khổng lồ trắng muốt vươn lên giữa đại ngàn đồi núi bazan bạt ngàn.',
  'Quảng Trị là một trong những thủ phủ năng lượng tái tạo lớn nhất miền Trung. Hàng trăm trụ điện gió cao ngút ngàn phân bố trên khắp các triền đồi Hướng Linh, Hướng Tân, Khe Sanh tạo nên một khung cảnh kỳ vĩ như trời Âu giữa lòng đại ngàn Trường Sơn.',
  ARRAY['Góc chụp ảnh hoàng hôn cực ''chill'' dưới chân các cánh quạt gió khổng lồ', 'Đường nhựa phẳng uốn lượn quanh các triền đồi hoa dại', 'Tầm nhìn ôm trọn hồ thủy điện Rào Quán thơ mộng', 'Gió mát lồng lộng quanh năm']::TEXT[],
  '16.7011° N, 106.7456° E',
  'Xã Hướng Linh và Hướng Tân, huyện Hướng Hóa',
  'Cả ngày (Lý tưởng nhất là 15:30 - 17:30)',
  'Miễn phí',
  'Đến vào buổi chiều tà để ngắm trọn cảnh hoàng hôn rực đỏ buông xuống sau những cánh quạt gió xoay nhẹ.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hero_image = EXCLUDED.hero_image,
  short_desc = EXCLUDED.short_desc,
  history = EXCLUDED.history,
  highlights = EXCLUDED.highlights,
  open_time = EXCLUDED.open_time,
  ticket_price = EXCLUDED.ticket_price;

INSERT INTO public.places (id, name, zone_code, zone_name, category, category_name, rating, rating_count, hero_image, gallery, short_desc, history, highlights, coordinates, address, open_time, ticket_price, tips) VALUES (
  'nghia-trang-truong-son',
  'Nghĩa Trang Liệt Sĩ Quốc Gia Trường Sơn',
  'QT-04',
  'Gio Linh',
  'history',
  'Di tích tâm linh',
  5,
  2300,
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80']::TEXT[],
  'Nơi an nghỉ đời đời của hơn 10.000 anh hùng liệt sĩ Đoàn 559 bộ đội Trường Sơn huyền thoại.',
  'Nằm trên đồi Bến Tắt bên cạnh Quốc lộ 15, Nghĩa trang Trường Sơn rộng 140.000m² được chia thành các khu mộ theo từng tỉnh thành phố khắp cả nước. Giữa đồi thông ngút ngàn gió hát, đây là điểm hành hương tâm linh xúc động và thiêng liêng bậc nhất của người dân cả nước.',
  ARRAY['Tượng đài trung tâm uy nghiêm khắc họa hình ảnh anh giải phóng quân', 'Khu tưởng niệm các anh hùng liệt sĩ từng tỉnh thành', 'Rừng thông bạt ngàn rợp bóng mát yên bình', 'Cây bồ đề cổ thụ và chuông đồng tri ân']::TEXT[],
  '16.9602° N, 106.9691° E',
  'Đồi Bến Tắt, xã Vĩnh Trường, huyện Gio Linh, Quảng Trị',
  '07:00 - 18:00 hằng ngày',
  'Miễn phí',
  'Mang theo hương nén để dâng kính các phần mộ liệt sĩ đồng hương của mình.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hero_image = EXCLUDED.hero_image,
  short_desc = EXCLUDED.short_desc,
  history = EXCLUDED.history,
  highlights = EXCLUDED.highlights,
  open_time = EXCLUDED.open_time,
  ticket_price = EXCLUDED.ticket_price;

INSERT INTO public.places (id, name, zone_code, zone_name, category, category_name, rating, rating_count, hero_image, gallery, short_desc, history, highlights, coordinates, address, open_time, ticket_price, tips) VALUES (
  'dao-con-co',
  'Hòn Đảo Tiền Tiêu Cồn Cỏ',
  'QT-07',
  'Huyện Đảo Cồn Cỏ',
  'island',
  'Biển đảo',
  4.9,
  680,
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80']::TEXT[],
  '''Viên ngọc xanh'' kiên cường giữa Biển Đông với thảm san hô tuyệt đẹp và rừng nguyên sinh biển đảo độc đáo.',
  'Đảo Cồn Cỏ có diện tích khoảng 2.3km², cách bờ biển Cửa Tùng khoảng 15 hải lý (khoảng 30km). Trong kháng chiến, Cồn Cỏ 2 lần được phong tặng danh hiệu Anh hùng Lực lượng Vũ trang. Ngày nay, Cồn Cỏ phát triển du lịch sinh thái bền vững với độ che phủ rừng trên 70%, biển xanh màu ngọc bích, các rạn san hô hình cành hoa tuyệt mỹ và hải sản trứ danh cua đá.',
  ARRAY['Cột cờ Tổ quốc huyện đảo Cồn Cỏ cao 35.5m uy nghi hướng biển', 'Ngọn hải đăng Cồn Cỏ - ngắm trọn bình minh và hoàng hôn biển Đông', 'Lặn biển ngắm rạn san hô đỏ và san hô đĩa nguyên sinh', 'Tham quan Bến Nghè, Bến Tranh và rừng nhiệt đới nguyên sinh Cồn Cỏ']::TEXT[],
  '17.1611° N, 107.3333° E',
  'Huyện đảo Cồn Cỏ, tỉnh Quảng Trị',
  'Tàu chạy vào các buổi sáng (Thứ 2, 4, 6, 7 & Chủ nhật - tùy thời tiết)',
  'Vé tàu cao tốc khứ hồi Cửa Việt - Cồn Cỏ: khoảng 300.000 - 450.000 VNĐ / lượt',
  'Cần mang theo CCCD bản gốc để làm thủ tục biên phòng. Mùa đẹp nhất để ra đảo là tháng 3 đến tháng 8 hàng năm khi biển êm.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hero_image = EXCLUDED.hero_image,
  short_desc = EXCLUDED.short_desc,
  history = EXCLUDED.history,
  highlights = EXCLUDED.highlights,
  open_time = EXCLUDED.open_time,
  ticket_price = EXCLUDED.ticket_price;

INSERT INTO public.places (id, name, zone_code, zone_name, category, category_name, rating, rating_count, hero_image, gallery, short_desc, history, highlights, coordinates, address, open_time, ticket_price, tips) VALUES (
  'bien-cua-viet',
  'Bãi Biển Cửa Việt',
  'QT-04',
  'Gio Linh & Cửa Việt',
  'beach',
  'Bãi biển',
  4.7,
  1250,
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80']::TEXT[],
  'Bãi cát trắng mịn phẳng lì thoai thoải bên rừng dương xanh rì rào, thiên đường tắm biển và thưởng thức hải sản tươi rói.',
  'Nằm ở cửa biển sông Thạch Hãn đổ ra đại dương, bãi biển Cửa Việt nổi bật với dải cát trắng mịn, độ dốc thoai thoải rất an toàn khi tắm. Buổi chiều ở Cửa Việt mát rượi, du khách có thể thỏa thích đắm mình trong làn nước biển trong xanh rồi thưởng thức mực hấp, ghẹ luộc chấm muối tiêu chanh ngay tại các dãy quán ven biển.',
  ARRAY['Bờ cát mịn thoai thoải an toàn cho cả gia đình', 'Rừng dương phi lao xanh rì chắn sóng chắn gió', 'Chợ hải sản chiều tươi ngon giá bình dân', 'Cảng biển Cửa Việt tấp nập thuyền bè ra khơi']::TEXT[],
  '16.8972° N, 107.1864° E',
  'Thị trấn Cửa Việt, huyện Gio Linh, Quảng Trị',
  'Tự do',
  'Miễn phí',
  'Thử mực một nắng nướng than hoa và ghẹ Cửa Việt tại các quán dãy mặt biển, giá rất hợp lý.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hero_image = EXCLUDED.hero_image,
  short_desc = EXCLUDED.short_desc,
  history = EXCLUDED.history,
  highlights = EXCLUDED.highlights,
  open_time = EXCLUDED.open_time,
  ticket_price = EXCLUDED.ticket_price;

INSERT INTO public.places (id, name, zone_code, zone_name, category, category_name, rating, rating_count, hero_image, gallery, short_desc, history, highlights, coordinates, address, open_time, ticket_price, tips) VALUES (
  'mui-treo-quang-tri',
  'Mũi Trèo - Mũi Trâu Hoang Sơ',
  'QT-04',
  'Gio Linh & Vĩnh Linh',
  'adventure',
  'Phượt biển & Cắm trại',
  4.8,
  890,
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80']::TEXT[],
  'Vách đá bazan kỳ vĩ nhô ra biển sâu cao từ 25 - 40m, một bên là rừng rú Bàu xanh thẳm, một bên là đại dương bao la.',
  'Mũi Trèo là một mỏm đá tự nhiên tuyệt đẹp nhô ra biển, nằm ẩn mình sau cánh rừng tự nhiên Rú Bàu. Đứng trên đỉnh Mũi Trèo, bạn sẽ được phóng tầm mắt chiêm ngưỡng toàn cảnh biển trời mênh mông, những con sóng bạc đầu vỗ vào vách đá tung bọt trắng xóa. Đây là điểm cắm trại đón bình minh hot nhất của giới trẻ Quảng Trị.',
  ARRAY['Vách đá Mũi Trèo nhô ra biển góc chụp sống ảo siêu thực', 'Băng qua cánh rừng Rú Bàu râm mát hoang sơ', 'Bãi biển bên dưới nguyên sơ không một dấu chân du lịch công nghiệp', 'Địa điểm hạ lều cắm trại đốt lửa ngắm bầu trời sao đêm']::TEXT[],
  '17.0678° N, 107.1356° E',
  'Xã Kim Thạch, huyện Vĩnh Linh, Quảng Trị',
  'Nên tham quan ban ngày',
  'Miễn phí',
  'Đoạn đường rừng vào bãi đá hơi gồ ghề, thích hợp cho xe số hoặc xe cào cào gầm cao. Hãy cẩn trọng đứng xa mép đá trơn ướt.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hero_image = EXCLUDED.hero_image,
  short_desc = EXCLUDED.short_desc,
  history = EXCLUDED.history,
  highlights = EXCLUDED.highlights,
  open_time = EXCLUDED.open_time,
  ticket_price = EXCLUDED.ticket_price;

INSERT INTO public.places (id, name, zone_code, zone_name, category, category_name, rating, rating_count, hero_image, gallery, short_desc, history, highlights, coordinates, address, open_time, ticket_price, tips) VALUES (
  'cau-treo-dakrong',
  'Cầu Treo Đakrông & Sông Đakrông',
  'QT-06',
  'Đakrông',
  'nature',
  'Thắng cảnh & Lịch sử',
  4.8,
  1040,
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80']::TEXT[],
  'Cây cầu dây văng duyên dáng vắt qua sông Đakrông hùng vĩ, khởi điểm nhánh Tây đường Trường Sơn lịch sử.',
  'Cầu treo Đakrông nằm ngay ngã ba giao nhau giữa Quốc lộ 9 và đường Hồ Chí Minh. Nơi đây là điểm huyết mạch nối liền các chiến trường xưa. Ngày nay, chiếc cầu dây văng hiện đại soi bóng xuống dòng sông Đakrông trong xanh, lưng tựa vào dãy núi Ta Lung trùng điệp tạo nên một bức tranh sơn thủy hữu tình mê hoặc lòng người.',
  ARRAY['Cầu dây văng kiến trúc thanh thoát giữa thung lũng đá hùng vĩ', 'Điểm giao nhau lịch sử của hai nhánh đường mòn Hồ Chí Minh', 'Ghé thăm suối nước nóng Klu gần chân cầu', 'Giao lưu văn hóa tại các nhà sàn truyền thống người Vân Kiều']::TEXT[],
  '16.6345° N, 106.9012° E',
  'Xã Đakrông, huyện Đakrông, Quảng Trị',
  'Tự do',
  'Miễn phí',
  'Dừng chân nghỉ ngơi chụp ảnh cầu, sau đó rẽ vào suối Klu tắm khoáng tự nhiên thư giãn trước khi lên Khe Sanh.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hero_image = EXCLUDED.hero_image,
  short_desc = EXCLUDED.short_desc,
  history = EXCLUDED.history,
  highlights = EXCLUDED.highlights,
  open_time = EXCLUDED.open_time,
  ticket_price = EXCLUDED.ticket_price;

INSERT INTO public.places (id, name, zone_code, zone_name, category, category_name, rating, rating_count, hero_image, gallery, short_desc, history, highlights, coordinates, address, open_time, ticket_price, tips) VALUES (
  'thanh-dia-la-vang',
  'Trung Tâm Hành Hương Đức Mẹ La Vang',
  'QT-02',
  'Hải Lăng',
  'history',
  'Di tích tâm linh',
  4.9,
  2200,
  'https://images.unsplash.com/photo-1548625361-19599a09995c?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1548625361-19599a09995c?auto=format&fit=crop&w=800&q=80']::TEXT[],
  'Thánh địa hành hương Công giáo quốc gia nổi tiếng linh thiêng giữa thung lũng cổ thụ tĩnh mịch.',
  'La Vang là trung tâm hành hương Công giáo lớn nhất Việt Nam. Nơi đây gắn liền với sự tích Đức Mẹ hiện ra che chở cho các tín hữu vào năm 1798 dưới gốc cây đa cổ thụ. Quần thể hiện nay có Vương cung thánh đường cổ kính (còn lưu tháp chuông rêu phong) và Vương cung thánh đường mới đồ sộ mang phong cách kiến trúc Á Đông thanh thoát.',
  ARRAY['Tháp chuông cổ kính in đậm dấu ấn thời gian', 'Cụm tượng đài Đức Mẹ La Vang dưới 3 tán cây cổ thụ', 'Vương cung thánh đường mới tráng lệ bề thế', 'Khuôn viên công viên tượng đài rợp bóng mát yên bình']::TEXT[],
  '16.7083° N, 107.1956° E',
  'Xã Hải Phú, huyện Hải Lăng, Quảng Trị',
  '06:00 - 20:00',
  'Miễn phí',
  'Du khách mọi tôn giáo đều có thể vào vãn cảnh tĩnh tâm, giữ trật tự và mặc trang phục kín đáo.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hero_image = EXCLUDED.hero_image,
  short_desc = EXCLUDED.short_desc,
  history = EXCLUDED.history,
  highlights = EXCLUDED.highlights,
  open_time = EXCLUDED.open_time,
  ticket_price = EXCLUDED.ticket_price;

INSERT INTO public.places (id, name, zone_code, zone_name, category, category_name, rating, rating_count, hero_image, gallery, short_desc, history, highlights, coordinates, address, open_time, ticket_price, tips) VALUES (
  'den-vua-ham-nghi-tan-so',
  'Đền Thờ Vua Hàm Nghi & Căn Cứ Tân Sở',
  'QT-08',
  'Cam Lộ',
  'history',
  'Di tích lịch sử',
  4.7,
  420,
  'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80']::TEXT[],
  'Nơi vị vua trẻ yêu nước Hàm Nghi hạ Chiếu Cần Vương kêu gọi sĩ phu và nhân dân cả nước kháng Pháp năm 1885.',
  'Căn cứ Tân Sở được Thượng thư Tôn Thất Thuyết bí mật chuẩn bị từ trước để làm kinh đô kháng chiến. Ngày 13/7/1885, tại đây, vua Hàm Nghi đã phát hịch Cần Vương làm dấy lên phong trào yêu nước sôi nổi khắp ba miền. Ngày nay khu đền thờ được tôn tạo uy nghiêm tưởng nhớ công đức vị vua anh hùng và các nghĩa sĩ Cần Vương.',
  ARRAY['Đền thờ vua Hàm Nghi và các tướng lĩnh phong trào Cần Vương', 'Vết tích thành lũy đất và hào lũy cổ xưa', 'Bia tưởng niệm khắc ghi toàn văn Chiếu Cần Vương bất hủ', 'Cảnh quan đồi chè và vườn cây thảo dược Cam Lộ bao quanh']::TEXT[],
  '16.7845° N, 107.0312° E',
  'Xã Cam Chính, huyện Cam Lộ, Quảng Trị',
  '07:30 - 17:00',
  'Miễn phí',
  'Rất thích hợp cho những ai đam mê lịch sử triều Nguyễn và phong trào kháng Pháp cuối thế kỷ 19.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  hero_image = EXCLUDED.hero_image,
  short_desc = EXCLUDED.short_desc,
  history = EXCLUDED.history,
  highlights = EXCLUDED.highlights,
  open_time = EXCLUDED.open_time,
  ticket_price = EXCLUDED.ticket_price;

-- 2. Danh sách Services (4 dịch vụ)
INSERT INTO public.services (id, name, type, type_label, zone_code, zone_name, price, rating, reviews, address, hotline, zalo, image, is_verified, affiliate_url, description) VALUES (
  'partner-1',
  'Sa Mù Cloud Glamping & Homestay',
  'homestay',
  'Homestay & Glamping',
  'QT-05',
  'Khe Sanh & Đèo Sa Mù',
  '450.000 VNĐ / đêm',
  4.9,
  86,
  'Bản Chênh Vênh, Hướng Phùng, Hướng Hóa, Quảng Trị',
  '0982 123 456',
  '0982123456',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
  true,
  '',
  'View săn mây 360 độ ngắm đỉnh đèo · Lều glamping ấm áp có máy sưởi · Phục vụ cơm lam cá suối nướng'
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.services (id, name, type, type_label, zone_code, zone_name, price, rating, reviews, address, hotline, zalo, image, is_verified, affiliate_url, description) VALUES (
  'partner-2',
  'Dịch Vụ Thuê Xe Máy Phượt Ga Đông Hà',
  'bike',
  'Cho thuê xe máy',
  'QT-01',
  'TP Đông Hà',
  '120.000 VNĐ / ngày',
  4.9,
  210,
  'Đối diện Ga Đông Hà, 21 Lê Duẩn, TP Đông Hà',
  '0914 987 654',
  '0914987654',
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
  true,
  '',
  'Miễn phí 2 mũ bảo hiểm chuẩn + 2 áo mưa · Giao xe miễn phí tại Ga tàu & Khách sạn · Bảo hành cứu hộ 24/7 trên toàn tỉnh'
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.services (id, name, type, type_label, zone_code, zone_name, price, rating, reviews, address, hotline, zalo, image, is_verified, affiliate_url, description) VALUES (
  'partner-3',
  'Đại Lý Vé Tàu Cao Tốc Đảo Cồn Cỏ',
  'boat',
  'Tàu cao tốc biển đảo',
  'QT-07',
  'Cửa Việt - Đảo Cồn Cỏ',
  '250.000 VNĐ / vé khứ hồi',
  4.8,
  140,
  'Cảng Cửa Việt, Gio Linh, Quảng Trị',
  '0905 345 678',
  '0905345678',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  true,
  '',
  'Tàu hai thân hiện đại không say sóng · Hỗ trợ khai báo thủ tục biên phòng ra đảo · Cam kết giữ chỗ vào dịp lễ cao điểm'
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.services (id, name, type, type_label, zone_code, zone_name, price, rating, reviews, address, hotline, zalo, image, is_verified, affiliate_url, description) VALUES (
  'partner-4',
  'Hướng Dẫn Viên Bản Địa Di Sản DMZ',
  'tour',
  'Tour Guide Di Sản',
  'QT-03',
  'Vĩ Tuyến 17 & Vịnh Mốc',
  '500.000 VNĐ / buổi',
  5,
  92,
  'Hiền Lương, Vĩnh Linh, Quảng Trị',
  '0977 888 999',
  '0977888999',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  true,
  '',
  'Kể chuyện lịch sử 81 ngày đêm & Vĩ tuyến 17 · Được chứng nhận thuyết minh viên di tích cấp quốc gia · Dẫn tour linh hoạt theo yêu cầu cá nhân và gia đình'
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 3. Sample Community Threads
INSERT INTO public.threads (author_name, author_avatar, author_badge, title, content, tag, zone_code, images, likes_count) VALUES (
  'Hoàng Nam (Phượt thủ Đà Nẵng)',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  'Đã đi 5 lần',
  'Kinh nghiệm săn mây đèo Sa Mù 2N1Đ - Bồng bềnh cổng trời nóc nhà Quảng Trị',
  'Vừa hoàn thành chuyến độc hành săn mây đèo Sa Mù cuối tuần qua. Mình xuất phát từ Đông Hà lúc 5h sáng theo QL9 lên Khe Sanh rồi rẽ vào đường mòn Hồ Chí Minh Tây. Tầm 6h30 sáng tới đỉnh đèo ở độ cao gần 1.400m, biển mây cuồn cuộn như thác đổ qua thung lũng! Nhiệt độ lúc sáng sớm chỉ tầm 15°C, lạnh buốt nhưng cảnh tượng thì xứng đáng điểm 10. Mẹo nhỏ cho anh em: Đèo thường có sương mù dày sau 8h sáng, nhớ kiểm tra phanh xe máy kỹ trước khi lên dốc và mang áo ấm chống gió.',
  'Săn mây',
  'QT-05',
  ARRAY['https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80']::TEXT[],
  42
);
INSERT INTO public.threads (author_name, author_avatar, author_badge, title, content, tag, zone_code, images, likes_count) VALUES (
  'Hương Giang (Hà Nội)',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
  'Du lịch gia đình',
  'Lắng đọng bước chân nơi đôi bờ Hiền Lương và làng hầm Vịnh Mốc',
  'Đưa cả gia đình về thăm vùng đất lửa Quảng Trị sau bao năm ấp ủ. Đứng giữa nhịp cầu Hiền Lương chia cắt hai nửa màu sơn, nghe tiếng gió thổi qua dòng Bến Hải mà rưng rưng xúc động. Xuống địa đạo Vịnh Mốc thì thực sự khâm phục ý chí của cha ông: dưới lòng đất sâu 3 tầng mát rượi, có cả phòng sinh nở nơi 17 đứa trẻ chào đời an toàn. Một chuyến đi giáo dục truyền thống vô cùng ý nghĩa cho các con.',
  'Lịch sử DMZ',
  'QT-03',
  ARRAY['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80']::TEXT[],
  58
);
INSERT INTO public.threads (author_name, author_avatar, author_badge, title, content, tag, zone_code, images, likes_count) VALUES (
  'Thanh Tùng (Sài Gòn)',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  'Tín đồ ẩm thực',
  'Hành trình càn quét ẩm thực Quảng Trị: Cháo vạt giường, Bún hến Mai Xá và Thịt luộc rau rừng',
  'Ẩm thực Quảng Trị mang vị cay tê nồng nàn đặc trưng của miền Trung gió Lào. Đã tới đây thì nhất định phải ăn tô Bánh canh cá lóc (cháo vạt giường) sợi bột gạo dẻo dai kèm đầu cá béo ngậy ở ngã ba Hải Lăng. Sang Mai Xá thì chén liền 2 tô Bún chắt chắt xào thơm lừng cay xé lưỡi mà ngọt thanh từ nước luộc chắt chắt. Giá cả cực kỳ bình dân, chỉ từ 25k - 40k/tô mà no ứ ự!',
  'Ẩm thực',
  'QT-01',
  ARRAY['https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80']::TEXT[],
  37
);
INSERT INTO public.threads (author_name, author_avatar, author_badge, title, content, tag, zone_code, images, likes_count) VALUES (
  'Lê Hải (Trekker)',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
  'Khám phá biển đảo',
  'Kinh nghiệm đi đảo Cồn Cỏ 2N1Đ tự túc: Lịch tàu, thuê xe máy và lặn ngắm san hô',
  'Đảo Cồn Cỏ được ví như viên ngọc xanh giữa Biển Đông. Từ cảng Cửa Việt đi tàu cao tốc Chính Nghĩa chỉ mất tầm 45-60 phút. Ra đảo không khí trong lành tuyệt đối, biển xanh màu ngọc bích nhìn thấy tận đáy san hô. Anh em nhớ mang theo CMND/CCCD để trình biên phòng, thuê xe máy chạy quanh đảo chỉ 150k/ngày ngắm ngọn hải đăng và rừng nguyên sinh bao phủ.',
  'Đảo Cồn Cỏ',
  'QT-07',
  ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80']::TEXT[],
  49
);
