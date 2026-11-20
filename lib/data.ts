/**
 * QuangTri.wiki - Dữ liệu cung đường, điểm đến, ẩm thực, lịch trình và cẩm nang
 * Lấy cảm hứng từ hệ thống phân vùng trực quan của Hagiang.wiki
 */

export const QUANGTRI_DATA = {
  provinceInfo: {
    name: "Quảng Trị",
    slogan: "Từ Di sản Phong Nha - Kẻ Bàng đến Thành Cổ, Vĩ tuyến 17 & Biển đảo Cồn Cỏ",
    description: "Tỉnh Quảng Trị mới (sau hợp nhất Quảng Bình & Quảng Trị) trải dài từ Đèo Ngang - Vũng Chùa đến Hải Lăng - Đakrông, hội tụ Di sản thiên nhiên thế giới Phong Nha - Kẻ Bàng, Hang Sơn Đoòng, biển Nhật Lệ, Vĩ tuyến 17, Thành Cổ Quảng Trị, đèo Sa Mù và đảo ngọc Cồn Cỏ.",
    stats: {
      districts: 12,
      historicalSites: 750,
      coastlineKm: 191,
      highestPeak: "1.617m (Đỉnh Sa Mù - Voi Mẹp)",
      popularRoutes: 6
    }
  },

  // Hệ thống mã vùng cung đường tương tự HG-01...HG-10
  zones: [
    {
      code: "QT-01",
      name: "Đông Hà & Vùng Trung Tâm",
      slug: "dong-ha",
      tagline: "Đô thị trung tâm ngã ba Quốc lộ 1A & Đường 9",
      description: "Thành phố trung tâm tỉnh lỵ, điểm khởi đầu thuận tiện nhất cho mọi hành trình khám phá Quảng Trị. Nơi hội tụ các dịch vụ lưu trú, ẩm thực địa phương phong phú và các tuyến giao thông huyết mạch.",
      icon: "building-2",
      heroImage: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
      featuredCount: "8 điểm đến · 12 món ngon"
    },
    {
      code: "QT-02",
      name: "Thị Xã Quảng Trị & Hải Lăng",
      slug: "thanh-co-hai-lang",
      tagline: "Vùng đất thiêng bên dòng Thạch Hãn & Di tích Thành Cổ",
      description: "Nơi diễn ra bản hùng ca 81 ngày đêm rực lửa năm 1972 tại Thành Cổ Quảng Trị. Cùng với dòng sông Thạch Hãn huyền thoại, Thánh địa La Vang linh thiêng và cái nôi của món cháo vạt giường nức tiếng.",
      icon: "shield",
      heroImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
      featuredCount: "6 di tích · 4 làng nghề"
    },
    {
      code: "QT-03",
      name: "Vĩnh Linh & Vĩ Tuyến 17",
      slug: "vinh-linh-dmz",
      tagline: "Cầu Hiền Lương, Địa đạo Vịnh Mốc & Bãi biển Cửa Tùng",
      description: "Tâm điểm của vùng phi quân sự DMZ lịch sử với biểu tượng Cầu Hiền Lương - Sông Bến Hải chia cắt hai miền suốt 20 năm, kỳ quan ngầm Địa đạo Vịnh Mốc và bãi biển Cửa Tùng thơ mộng.",
      icon: "flag",
      heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      featuredCount: "7 điểm di tích · 1 bãi biển"
    },
    {
      code: "QT-04",
      name: "Gio Linh & Cửa Việt",
      slug: "gio-linh-cua-viet",
      tagline: "Biển xanh Cửa Việt, Nghĩa trang Trường Sơn & Mũi Trèo",
      description: "Cửa ngõ biển cả với bãi cát dài thoai thoải tại Cửa Việt, Nghĩa trang Liệt sĩ Quốc gia Trường Sơn trang nghiêm, Mũi Trèo vách đá kỳ vĩ và hệ thống Giếng cổ Chăm nghìn năm tuổi.",
      icon: "waves",
      heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      featuredCount: "5 danh thắng · Bún hến Mai Xá"
    },
    {
      code: "QT-05",
      name: "Hướng Hóa & Khe Sanh",
      slug: "huong-hoa-khe-sanh",
      tagline: "Đèo Sa Mù, xứ sở săn mây, Tà Cơn & Cánh đồng điện gió",
      description: "Đà Lạt thu nhỏ của Quảng Trị với khí hậu mát lạnh ôn đới quanh năm. Điểm phượt săn mây huyền thoại tại đèo Sa Mù, Thác Chênh Vênh giữa rừng nguyên sinh và di tích Sân bay Tà Cơn hào hùng.",
      icon: "cloud-fog",
      heroImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
      featuredCount: "9 điểm check-in · Cafe Khe Sanh"
    },
    {
      code: "QT-06",
      name: "Đakrông & Đường Hồ Chí Minh",
      slug: "dakrong-truong-son",
      tagline: "Cầu treo Đakrông, suối nước nóng Klu & Bản làng Bru - Vân Kiều",
      description: "Vùng đất giao thoa giữa hai nhánh Đông và Tây đường mòn Hồ Chí Minh. Khung cảnh non nước hùng vĩ bên sông Đakrông, suối khoáng Klu và nét văn hóa cồng chiêng đặc sắc của đồng bào Bru - Vân Kiều.",
      icon: "mountain",
      heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      featuredCount: "5 thắng cảnh · Văn hóa cồng chiêng"
    },
    {
      code: "QT-07",
      name: "Huyện Đảo Cồn Cỏ",
      slug: "dao-con-co",
      tagline: "Tiền đồn biển đảo Tổ quốc & Hòn ngọc xanh giữa Biển Đông",
      description: "Đảo tiền tiêu anh hùng cách đất liền 30km, được ví như một công viên sinh thái biển giữa đại dương với rừng nguyên sinh bao phủ, ngọn hải đăng sừng sững và những rạn san hô nguyên sơ lộng lẫy.",
      icon: "compass",
      heroImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      featuredCount: "1 đảo ngọc · Lặn san hô"
    },
    {
      code: "QT-08",
      name: "Cam Lộ & Vùng Trung Du",
      slug: "cam-lo",
      tagline: "Căn cứ Tân Sở, Chiếu Cần Vương & Vùng dược liệu thảo mộc",
      description: "Cái nôi lịch sử nơi vua Hàm Nghi ban Chiếu Cần Vương năm 1885 tại Căn cứ Tân Sở. Vùng đất trù phú với đặc sản Gà Cùa, Chè vằng Định Sơn và Chùa Cam Lộ cổ kính.",
      icon: "tree-pine",
      heroImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
      featuredCount: "4 di tích · Làng chè Vằng"
    },
    {
      code: "QT-09",
      name: "Đồng Hới & Biển Nhật Lệ",
      slug: "dong-hoi-nhat-le",
      tagline: "Trung tâm hành chính mới, Biển Nhật Lệ & Đồi cát Quang Phú",
      description: "Đô thị biển sôi động bên dòng Nhật Lệ thơ mộng, sở hữu sân bay Đồng Hới (VDH), bãi biển Bảo Ninh cát trắng mịn, đồi cát Quang Phú và nền ẩm thực cháo canh cá lóc trứ danh.",
      icon: "waves",
      heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      featuredCount: "6 điểm đến · Sân bay VDH"
    },
    {
      code: "QT-10",
      name: "Phong Nha - Kẻ Bàng & Sơn Đoòng",
      slug: "phong-nha-ke-bang",
      tagline: "Di sản thiên nhiên thế giới UNESCO · Vương quốc hang động",
      description: "Kỳ quan địa chất tầm cỡ toàn cầu với Động Phong Nha, Động Thiên Đường, Hang Sơn Đoòng, Suối Nước Moọc và Sông Chày - Hang Tối giữa đại ngàn Trường Sơn.",
      icon: "mountain",
      heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      featuredCount: "Di sản UNESCO · Hang động"
    },
    {
      code: "QT-11",
      name: "Bố Trạch, Vũng Chùa & Đèo Ngang",
      slug: "vung-chua-deo-ngang",
      tagline: "Vũng Chùa - Đảo Yến, Đèo Ngang & Làng biển Cảnh Dương",
      description: "Cửa ngõ phía Bắc của tỉnh với Hoành Sơn Quan trên đỉnh Đèo Ngang lịch sử, nơi an nghỉ linh thiêng của Đại tướng Võ Nguyên Giáp tại Vũng Chùa - Đảo Yến và Bãi Đá Nhảy.",
      icon: "compass",
      heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      featuredCount: "Bắc tỉnh · Đèo Ngang"
    },
    {
      code: "QT-12",
      name: "Lệ Thủy & Suối Khoáng Bang",
      slug: "le-thuy-suoi-bang",
      tagline: "Nhà lưu niệm Đại tướng Võ Nguyên Giáp & Suối nước nóng Bang",
      description: "Vùng đất giàu truyền thống bên sông Kiến Giang với Nhà lưu niệm Đại tướng Võ Nguyên Giáp tại làng An Xá, suối khoáng nóng Bang sôi 105°C và chùa Hoằng Phúc cổ tự.",
      icon: "shield",
      heroImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
      featuredCount: "Khoáng nóng · Di tích"
    }
  ],

  // Danh mục điểm đến phong phú
  places: [
    {
      id: "thanh-co-quang-tri",
      name: "Thành Cổ Quảng Trị",
      zoneCode: "QT-02",
      zoneName: "Thị Xã Quảng Trị",
      category: "history",
      categoryName: "Di tích lịch sử",
      image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewsCount: 1420,
      shortDesc: "Chiến trường 81 ngày đêm mùa hè đỏ lửa năm 1972, biểu tượng thiêng liêng về lòng quả cảm bất diệt.",
      fullDesc: "Thành Cổ Quảng Trị là di tích quốc gia đặc biệt, nơi đã hứng chịu hơn 328.000 tấn bom đạn trong suốt 81 ngày đêm năm 1972 - tương đương sức công phá của 7 quả bom nguyên tử ném xuống Hiroshima. Ngày nay, trung tâm Thành Cổ là Đài tưởng niệm được thiết kế như một nấm mộ chung của hàng ngàn chiến sĩ, xung quanh là công viên hòa bình rợp bóng cây xanh.",
      highlights: [
        "Đài tưởng niệm trung tâm Thành Cổ hình tượng bát giác",
        "Bảo tàng chứng tích lịch sử 81 ngày đêm",
        "Khu vực bờ hào và cổng thành cổ còn vết tích đạn bom",
        "Nghi thức thắp nến và dâng hương tri ân"
      ],
      ticket: "Miễn phí (Tự nguyện thắp hương / hướng dẫn viên thuyết minh tại điểm)",
      openHours: "07:00 - 17:30 hằng ngày",
      coordinates: "16.7533° N, 107.1912° E",
      address: "Phường 2, Thị xã Quảng Trị",
      tips: "Nên mặc trang phục lịch sự, trang nghiêm. Có thể kết hợp dâng hoa tại Bến thả hoa sông Thạch Hãn ngay gần đó vào chiều hoàng hôn."
    },
    {
      id: "cau-hien-luong-ben-hai",
      name: "Đôi Bờ Hiền Lương - Sông Bến Hải",
      zoneCode: "QT-03",
      zoneName: "Vĩnh Linh & Vĩ Tuyến 17",
      category: "history",
      categoryName: "Di tích lịch sử",
      image: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewsCount: 1850,
      shortDesc: "Vĩ tuyến 17 lịch sử - nơi chứng kiến nỗi đau chia cắt đất nước hơn 20 năm ròng rã và ngày ca khúc khải hoàn.",
      fullDesc: "Cầu Hiền Lương bắc qua dòng sông Bến Hải êm đềm, nằm đúng trên vĩ tuyến 17 - ranh giới chia cắt tạm thời hai miền Nam - Bắc theo Hiệp định Genève 1954. Cây cầu sơn hai màu tương phản (xanh và vàng) tái hiện lại những năm tháng đau thương nhưng kiên cường. Tại đây còn có Cột cờ Giới tuyến cao 38m, Nhà liên hợp, Cụm tượng đài Khát vọng thống nhất non sông.",
      highlights: [
        "Cầu Hiền Lương lịch sử chia hai nửa màu sơn biểu tượng",
        "Cột cờ Giới tuyến và kỳ đài Hiền Lương cao vút",
        "Cụm tượng đài Khát vọng thống nhất non sông",
        "Hệ thống loa phóng thanh công suất khủng đối kháng bờ Bắc - Nam xưa kia"
      ],
      ticket: "50.000 VNĐ / người lớn, 20.000 VNĐ / trẻ em",
      openHours: "07:00 - 17:30",
      coordinates: "17.0019° N, 107.0984° E",
      address: "Quốc lộ 1A, Vĩnh Thành, Vĩnh Linh, Quảng Trị",
      tips: "Đứng giữa cầu ngắm dòng Bến Hải và lắng nghe thuyết minh qua loa tái hiện không gian lịch sử rất xúc động."
    },
    {
      id: "dia-dao-vinh-moc",
      name: "Địa Đạo Vịnh Mốc & Làng Hầm",
      zoneCode: "QT-03",
      zoneName: "Vĩnh Linh",
      category: "history",
      categoryName: "Di tích lịch sử",
      image: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewsCount: 2100,
      shortDesc: "Kỳ tích kiến trúc ngầm dưới lòng đất ba tầng kiên cố, nơi che chở hàng trăm người dân và sinh ra 17 em bé trong mưa bom.",
      fullDesc: "Địa đạo Vịnh Mốc là một kỳ quan quân sự độc nhất vô nhị. Được đào hoàn toàn bằng tay từ năm 1965 đến 1967, hệ thống địa đạo dài gần 2km với 3 tầng ngầm (tầng sâu nhất cách mặt đất 23m), có 13 cửa thông ra ngoài (trong đó có 6 cửa trổ ra biển). Trong lòng địa đạo có hội trường, giếng nước, bếp Hoàng Cầm, trạm phẫu thuật, phòng sinh và phòng nghỉ cho các gia đình.",
      highlights: [
        "Hệ thống đường hầm xuyên lòng đất 3 tầng kiên cố",
        "Phòng hộ sinh ngầm - nơi 17 em bé cất tiếng khóc chào đời an toàn",
        "Cửa hầm số 6 hướng tầm mắt thẳng ra đại dương xanh ngắt",
        "Bảo tàng trưng bày các vật dụng và kỷ vật làng hầm Vĩnh Linh"
      ],
      ticket: "50.000 VNĐ / người lớn, 25.000 VNĐ / trẻ em",
      openHours: "07:00 - 17:00",
      coordinates: "17.0427° N, 107.1147° E",
      address: "Xã Kim Thạch, huyện Vĩnh Linh, Quảng Trị",
      tips: "Trong hầm nhiệt độ mát mẻ nhưng độ ẩm cao, lối đi có đèn điện nhưng nên mang giày thể thao chống trơn trượt."
    },
    {
      id: "san-bay-ta-con",
      name: "Sân Bay Tà Cơn & Cứ Điểm Khe Sanh",
      zoneCode: "QT-05",
      zoneName: "Hướng Hóa & Khe Sanh",
      category: "history",
      categoryName: "Di tích lịch sử",
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewsCount: 960,
      shortDesc: "Cứ điểm đầu não trong tập đoàn cứ điểm Khe Sanh của quân đội Mỹ tại Chiến dịch Đường 9 - Khe Sanh 1968.",
      fullDesc: "Sân bay Tà Cơn là một cứ điểm chiến lược nòng cốt trong chiến tranh Việt Nam. Ngày nay, nơi đây lưu giữ nhiều hiện vật chiến tranh giá trị gồm máy bay vận tải C-130, trực thăng Chinook, máy bay UH-1A, xe tăng M48, đài chỉ huy và hệ thống hầm hào công sự.",
      highlights: [
        "Xác máy bay quân sự C-130, trực thăng UH-1 và xe tăng nguyên bản",
        "Đường băng dã chiến bằng tôn đục lỗ đặc trưng",
        "Nhà bảo tàng tư liệu Đường 9 - Khe Sanh",
        "Vườn hoa hướng dương và cafe chill bên ngoài khuôn viên di tích"
      ],
      ticket: "50.000 VNĐ / người",
      openHours: "07:30 - 17:00",
      coordinates: "16.6534° N, 106.7118° E",
      address: "Xã Tân Hợp, huyện Hướng Hóa, Quảng Trị",
      tips: "Nằm ngay trên đường đi thị trấn Khe Sanh, rất tiện kết hợp đi thác Chênh Vênh và đèo Sa Mù."
    },
    {
      id: "deo-sa-mu",
      name: "Đèo Sa Mù - Thiên Đường Săn Mây",
      zoneCode: "QT-05",
      zoneName: "Hướng Hóa - Hướng Phùng",
      category: "adventure",
      categoryName: "Phượt đèo & Săn mây",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewsCount: 1340,
      shortDesc: "Được mệnh danh là 'cổng trời' nóc nhà Quảng Trị, dài gần 20km nối xã Hướng Phùng và Hướng Việt quanh năm mây ngàn bao phủ.",
      fullDesc: "Đèo Sa Mù nằm trên nhánh Tây đường Hồ Chí Minh, ở độ cao gần 1.400m so với mực nước biển. Đây là cung đèo huyền thoại với các phượt thủ miền Trung, nơi hội tụ khí hậu quanh năm se lạnh sương mù bao phủ, thảm thực vật rừng nguyên sinh rêu phong cổ thụ và những biển mây bềnh bồng cuồn cuộn vào sáng sớm.",
      highlights: [
        "Biển mây trắng xóa ôm trọn thung lũng Trường Sơn vào bình minh",
        "Những khúc cua tay áo ngoạn mục giữa rừng già nguyên sinh",
        "Rừng cây phong lá đỏ và các loài hoa dại nở rộ mùa đông xuân",
        "Cung đường phượt nối liền Quảng Trị và Quảng Bình hoang sơ"
      ],
      ticket: "Miễn phí",
      openHours: "Tự do khám phá (Nên đi từ 06:00 - 17:00)",
      coordinates: "16.7820° N, 106.5821° E",
      address: "Đường Hồ Chí Minh Tây, Hướng Hóa, Quảng Trị",
      tips: "Đoạn đèo thường có sương mù dày đặc và không có sóng điện thoại ở một số khúc, cần chuẩn bị xe máy tốt, bật đèn sương mù và giữ ấm cơ thể."
    },
    {
      id: "thac-chenh-venh",
      name: "Thác Chênh Vênh",
      zoneCode: "QT-05",
      zoneName: "Hướng Hóa",
      category: "nature",
      categoryName: "Sinh thái & Thác suối",
      image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewsCount: 780,
      shortDesc: "Viên ngọc bích ẩn sâu dưới chân đèo Sa Mù với dòng nước xanh trong vắt len lỏi qua những khối đá cổ thụ.",
      fullDesc: "Thác Chênh Vênh nằm lọt thỏm giữa cánh rừng nguyên sinh bạt ngàn của xã Hướng Phùng. Dòng thác đổ từ trên vách đá cao xuống một hồ nước màu ngọc bích phẳng lặng. Nơi đây là điểm đến lý tưởng cho các hoạt động cắm trại dã ngoại, tắm suối giải nhiệt và trải nghiệm văn hóa bản địa người Vân Kiều.",
      highlights: [
        "Hồ nước trong veo màu ngọc lục bảo soi bóng mây trời",
        "Bãi đá phẳng thích hợp dựng lều cắm trại glamping",
        "Tiếng thác nước rì rầm hòa cùng tiếng chim rừng đại ngàn",
        "Thưởng thức cá suối nướng muối ớt và cơm lam người Vân Kiều"
      ],
      ticket: "20.000 VNĐ / người (Phí bảo vệ môi trường bản làng)",
      openHours: "07:00 - 18:00",
      coordinates: "16.7329° N, 106.6025° E",
      address: "Bản Chênh Vênh, xã Hướng Phùng, Hướng Hóa, Quảng Trị",
      tips: "Mang theo đồ bơi, thuốc chống côn trùng và nhớ dọn sạch rác khi rời đi để bảo vệ môi trường sinh thái."
    },
    {
      id: "canh-dong-dien-gio-huong-linh",
      name: "Cánh Đồng Quạt Gió Hướng Linh & Hướng Tân",
      zoneCode: "QT-05",
      zoneName: "Hướng Hóa",
      category: "checkin",
      categoryName: "Check-in sống ảo",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviewsCount: 1120,
      shortDesc: "Những trụ tuabin gió khổng lồ trắng muốt vươn lên giữa đại ngàn đồi núi bazan bạt ngàn.",
      fullDesc: "Quảng Trị là một trong những thủ phủ năng lượng tái tạo lớn nhất miền Trung. Hàng trăm trụ điện gió cao ngút ngàn phân bố trên khắp các triền đồi Hướng Linh, Hướng Tân, Khe Sanh tạo nên một khung cảnh kỳ vĩ như trời Âu giữa lòng đại ngàn Trường Sơn.",
      highlights: [
        "Góc chụp ảnh hoàng hôn cực 'chill' dưới chân các cánh quạt gió khổng lồ",
        "Đường nhựa phẳng uốn lượn quanh các triền đồi hoa dại",
        "Tầm nhìn ôm trọn hồ thủy điện Rào Quán thơ mộng",
        "Gió mát lồng lộng quanh năm"
      ],
      ticket: "Miễn phí",
      openHours: "Cả ngày (Lý tưởng nhất là 15:30 - 17:30)",
      coordinates: "16.7011° N, 106.7456° E",
      address: "Xã Hướng Linh và Hướng Tân, huyện Hướng Hóa",
      tips: "Đến vào buổi chiều tà để ngắm trọn cảnh hoàng hôn rực đỏ buông xuống sau những cánh quạt gió xoay nhẹ."
    },
    {
      id: "nghia-trang-truong-son",
      name: "Nghĩa Trang Liệt Sĩ Quốc Gia Trường Sơn",
      zoneCode: "QT-04",
      zoneName: "Gio Linh",
      category: "history",
      categoryName: "Di tích tâm linh",
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
      rating: 5.0,
      reviewsCount: 2300,
      shortDesc: "Nơi an nghỉ đời đời của hơn 10.000 anh hùng liệt sĩ Đoàn 559 bộ đội Trường Sơn huyền thoại.",
      fullDesc: "Nằm trên đồi Bến Tắt bên cạnh Quốc lộ 15, Nghĩa trang Trường Sơn rộng 140.000m² được chia thành các khu mộ theo từng tỉnh thành phố khắp cả nước. Giữa đồi thông ngút ngàn gió hát, đây là điểm hành hương tâm linh xúc động và thiêng liêng bậc nhất của người dân cả nước.",
      highlights: [
        "Tượng đài trung tâm uy nghiêm khắc họa hình ảnh anh giải phóng quân",
        "Khu tưởng niệm các anh hùng liệt sĩ từng tỉnh thành",
        "Rừng thông bạt ngàn rợp bóng mát yên bình",
        "Cây bồ đề cổ thụ và chuông đồng tri ân"
      ],
      ticket: "Miễn phí",
      openHours: "07:00 - 18:00 hằng ngày",
      coordinates: "16.9602° N, 106.9691° E",
      address: "Đồi Bến Tắt, xã Vĩnh Trường, huyện Gio Linh, Quảng Trị",
      tips: "Mang theo hương nén để dâng kính các phần mộ liệt sĩ đồng hương của mình."
    },
    {
      id: "dao-con-co",
      name: "Hòn Đảo Tiền Tiêu Cồn Cỏ",
      zoneCode: "QT-07",
      zoneName: "Huyện Đảo Cồn Cỏ",
      category: "island",
      categoryName: "Biển đảo",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewsCount: 680,
      shortDesc: "'Viên ngọc xanh' kiên cường giữa Biển Đông với thảm san hô tuyệt đẹp và rừng nguyên sinh biển đảo độc đáo.",
      fullDesc: "Đảo Cồn Cỏ có diện tích khoảng 2.3km², cách bờ biển Cửa Tùng khoảng 15 hải lý (khoảng 30km). Trong kháng chiến, Cồn Cỏ 2 lần được phong tặng danh hiệu Anh hùng Lực lượng Vũ trang. Ngày nay, Cồn Cỏ phát triển du lịch sinh thái bền vững với độ che phủ rừng trên 70%, biển xanh màu ngọc bích, các rạn san hô hình cành hoa tuyệt mỹ và hải sản trứ danh cua đá.",
      highlights: [
        "Cột cờ Tổ quốc huyện đảo Cồn Cỏ cao 35.5m uy nghi hướng biển",
        "Ngọn hải đăng Cồn Cỏ - ngắm trọn bình minh và hoàng hôn biển Đông",
        "Lặn biển ngắm rạn san hô đỏ và san hô đĩa nguyên sinh",
        "Tham quan Bến Nghè, Bến Tranh và rừng nhiệt đới nguyên sinh Cồn Cỏ"
      ],
      ticket: "Vé tàu cao tốc khứ hồi Cửa Việt - Cồn Cỏ: khoảng 300.000 - 450.000 VNĐ / lượt",
      openHours: "Tàu chạy vào các buổi sáng (Thứ 2, 4, 6, 7 & Chủ nhật - tùy thời tiết)",
      coordinates: "17.1611° N, 107.3333° E",
      address: "Huyện đảo Cồn Cỏ, tỉnh Quảng Trị",
      tips: "Cần mang theo CCCD bản gốc để làm thủ tục biên phòng. Mùa đẹp nhất để ra đảo là tháng 3 đến tháng 8 hàng năm khi biển êm."
    },
    {
      id: "bien-cua-viet",
      name: "Bãi Biển Cửa Việt",
      zoneCode: "QT-04",
      zoneName: "Gio Linh & Cửa Việt",
      category: "beach",
      categoryName: "Bãi biển",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviewsCount: 1250,
      shortDesc: "Bãi cát trắng mịn phẳng lì thoai thoải bên rừng dương xanh rì rào, thiên đường tắm biển và thưởng thức hải sản tươi rói.",
      fullDesc: "Nằm ở cửa biển sông Thạch Hãn đổ ra đại dương, bãi biển Cửa Việt nổi bật với dải cát trắng mịn, độ dốc thoai thoải rất an toàn khi tắm. Buổi chiều ở Cửa Việt mát rượi, du khách có thể thỏa thích đắm mình trong làn nước biển trong xanh rồi thưởng thức mực hấp, ghẹ luộc chấm muối tiêu chanh ngay tại các dãy quán ven biển.",
      highlights: [
        "Bờ cát mịn thoai thoải an toàn cho cả gia đình",
        "Rừng dương phi lao xanh rì chắn sóng chắn gió",
        "Chợ hải sản chiều tươi ngon giá bình dân",
        "Cảng biển Cửa Việt tấp nập thuyền bè ra khơi"
      ],
      ticket: "Miễn phí",
      openHours: "Tự do",
      coordinates: "16.8972° N, 107.1864° E",
      address: "Thị trấn Cửa Việt, huyện Gio Linh, Quảng Trị",
      tips: "Thử mực một nắng nướng than hoa và ghẹ Cửa Việt tại các quán dãy mặt biển, giá rất hợp lý."
    },
    {
      id: "mui-treo-quang-tri",
      name: "Mũi Trèo - Mũi Trâu Hoang Sơ",
      zoneCode: "QT-04",
      zoneName: "Gio Linh & Vĩnh Linh",
      category: "adventure",
      categoryName: "Phượt biển & Cắm trại",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewsCount: 890,
      shortDesc: "Vách đá bazan kỳ vĩ nhô ra biển sâu cao từ 25 - 40m, một bên là rừng rú Bàu xanh thẳm, một bên là đại dương bao la.",
      fullDesc: "Mũi Trèo là một mỏm đá tự nhiên tuyệt đẹp nhô ra biển, nằm ẩn mình sau cánh rừng tự nhiên Rú Bàu. Đứng trên đỉnh Mũi Trèo, bạn sẽ được phóng tầm mắt chiêm ngưỡng toàn cảnh biển trời mênh mông, những con sóng bạc đầu vỗ vào vách đá tung bọt trắng xóa. Đây là điểm cắm trại đón bình minh hot nhất của giới trẻ Quảng Trị.",
      highlights: [
        "Vách đá Mũi Trèo nhô ra biển góc chụp sống ảo siêu thực",
        "Băng qua cánh rừng Rú Bàu râm mát hoang sơ",
        "Bãi biển bên dưới nguyên sơ không một dấu chân du lịch công nghiệp",
        "Địa điểm hạ lều cắm trại đốt lửa ngắm bầu trời sao đêm"
      ],
      ticket: "Miễn phí",
      openHours: "Nên tham quan ban ngày",
      coordinates: "17.0678° N, 107.1356° E",
      address: "Xã Kim Thạch, huyện Vĩnh Linh, Quảng Trị",
      tips: "Đoạn đường rừng vào bãi đá hơi gồ ghề, thích hợp cho xe số hoặc xe cào cào gầm cao. Hãy cẩn trọng đứng xa mép đá trơn ướt."
    },
    {
      id: "cau-treo-dakrong",
      name: "Cầu Treo Đakrông & Sông Đakrông",
      zoneCode: "QT-06",
      zoneName: "Đakrông",
      category: "nature",
      categoryName: "Thắng cảnh & Lịch sử",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewsCount: 1040,
      shortDesc: "Cây cầu dây văng duyên dáng vắt qua sông Đakrông hùng vĩ, khởi điểm nhánh Tây đường Trường Sơn lịch sử.",
      fullDesc: "Cầu treo Đakrông nằm ngay ngã ba giao nhau giữa Quốc lộ 9 và đường Hồ Chí Minh. Nơi đây là điểm huyết mạch nối liền các chiến trường xưa. Ngày nay, chiếc cầu dây văng hiện đại soi bóng xuống dòng sông Đakrông trong xanh, lưng tựa vào dãy núi Ta Lung trùng điệp tạo nên một bức tranh sơn thủy hữu tình mê hoặc lòng người.",
      highlights: [
        "Cầu dây văng kiến trúc thanh thoát giữa thung lũng đá hùng vĩ",
        "Điểm giao nhau lịch sử của hai nhánh đường mòn Hồ Chí Minh",
        "Ghé thăm suối nước nóng Klu gần chân cầu",
        "Giao lưu văn hóa tại các nhà sàn truyền thống người Vân Kiều"
      ],
      ticket: "Miễn phí",
      openHours: "Tự do",
      coordinates: "16.6345° N, 106.9012° E",
      address: "Xã Đakrông, huyện Đakrông, Quảng Trị",
      tips: "Dừng chân nghỉ ngơi chụp ảnh cầu, sau đó rẽ vào suối Klu tắm khoáng tự nhiên thư giãn trước khi lên Khe Sanh."
    },
    {
      id: "thanh-dia-la-vang",
      name: "Trung Tâm Hành Hương Đức Mẹ La Vang",
      zoneCode: "QT-02",
      zoneName: "Hải Lăng",
      category: "history",
      categoryName: "Di tích tâm linh",
      image: "https://images.unsplash.com/photo-1548625361-195fe5787e41?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewsCount: 2200,
      shortDesc: "Thánh địa hành hương Công giáo quốc gia nổi tiếng linh thiêng giữa thung lũng cổ thụ tĩnh mịch.",
      fullDesc: "La Vang là trung tâm hành hương Công giáo lớn nhất Việt Nam. Nơi đây gắn liền với sự tích Đức Mẹ hiện ra che chở cho các tín hữu vào năm 1798 dưới gốc cây đa cổ thụ. Quần thể hiện nay có Vương cung thánh đường cổ kính (còn lưu tháp chuông rêu phong) và Vương cung thánh đường mới đồ sộ mang phong cách kiến trúc Á Đông thanh thoát.",
      highlights: [
        "Tháp chuông cổ kính in đậm dấu ấn thời gian",
        "Cụm tượng đài Đức Mẹ La Vang dưới 3 tán cây cổ thụ",
        "Vương cung thánh đường mới tráng lệ bề thế",
        "Khuôn viên công viên tượng đài rợp bóng mát yên bình"
      ],
      ticket: "Miễn phí",
      openHours: "06:00 - 20:00",
      coordinates: "16.7083° N, 107.1956° E",
      address: "Xã Hải Phú, huyện Hải Lăng, Quảng Trị",
      tips: "Du khách mọi tôn giáo đều có thể vào vãn cảnh tĩnh tâm, giữ trật tự và mặc trang phục kín đáo."
    },
    {
      id: "den-vua-ham-nghi-tan-so",
      name: "Đền Thờ Vua Hàm Nghi & Căn Cứ Tân Sở",
      zoneCode: "QT-08",
      zoneName: "Cam Lộ",
      category: "history",
      categoryName: "Di tích lịch sử",
      image: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviewsCount: 420,
      shortDesc: "Nơi vị vua trẻ yêu nước Hàm Nghi hạ Chiếu Cần Vương kêu gọi sĩ phu và nhân dân cả nước kháng Pháp năm 1885.",
      fullDesc: "Căn cứ Tân Sở được Thượng thư Tôn Thất Thuyết bí mật chuẩn bị từ trước để làm kinh đô kháng chiến. Ngày 13/7/1885, tại đây, vua Hàm Nghi đã phát hịch Cần Vương làm dấy lên phong trào yêu nước sôi nổi khắp ba miền. Ngày nay khu đền thờ được tôn tạo uy nghiêm tưởng nhớ công đức vị vua anh hùng và các nghĩa sĩ Cần Vương.",
      highlights: [
        "Đền thờ vua Hàm Nghi và các tướng lĩnh phong trào Cần Vương",
        "Vết tích thành lũy đất và hào lũy cổ xưa",
        "Bia tưởng niệm khắc ghi toàn văn Chiếu Cần Vương bất hủ",
        "Cảnh quan đồi chè và vườn cây thảo dược Cam Lộ bao quanh"
      ],
      ticket: "Miễn phí",
      openHours: "07:30 - 17:00",
      coordinates: "16.7845° N, 107.0312° E",
      address: "Xã Cam Chính, huyện Cam Lộ, Quảng Trị",
      tips: "Rất thích hợp cho những ai đam mê lịch sử triều Nguyễn và phong trào kháng Pháp cuối thế kỷ 19."
    },
    {
      id: "dong-phong-nha",
      name: "Động Phong Nha & Sông Son",
      zoneCode: "QT-10",
      zoneName: "Phong Nha - Kẻ Bàng",
      category: "nature",
      categoryName: "Di sản UNESCO",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewsCount: 2450,
      shortDesc: "Kỳ quan hang động nước nổi tiếng thế giới với dòng sông ngầm xanh biếc và hệ thống thạch nhũ triệu năm.",
      fullDesc: "Động Phong Nha thuộc Vườn Quốc gia Phong Nha - Kẻ Bàng (Di sản thiên nhiên thế giới UNESCO), nổi bật với hành trình ngồi thuyền rồng ngược dòng sông Son phẳng lặng tiến vào lòng hang đá vôi mát lạnh quanh năm.",
      highlights: [
        "Ngồi thuyền sông Son chiêm ngưỡng hang Bi Ký, hang Tiên, hang Cung Đình",
        "Hệ thống nhũ đá kỳ ảo hình thành qua hàng trăm triệu năm",
        "Kết hợp tham quan Động Tiên Sơn ngay phía trên cửa động"
      ],
      ticket: "150.000 VNĐ (thuyền 550k/chuyến chia 12 người)",
      openHours: "07:30 - 17:00",
      coordinates: "17.5819° N, 106.2836° E",
      address: "Thị trấn Phong Nha, Bố Trạch, Quảng Trị",
      tips: "Nên đi thuyền buổi sáng từ 08:00 để tránh đông đoàn và ánh sáng trên sông Son đẹp nhất."
    },
    {
      id: "dong-thien-duong",
      name: "Động Thiên Đường (Phong Nha - Kẻ Bàng)",
      zoneCode: "QT-10",
      zoneName: "Phong Nha - Kẻ Bàng",
      category: "nature",
      categoryName: "Di sản UNESCO",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
      rating: 5.0,
      reviewsCount: 1980,
      shortDesc: "Hoàng cung trong lòng đất với cầu gỗ dài hơn 1km xuyên qua vòm hang khổng lồ cao hàng chục mét.",
      fullDesc: "Động Thiên Đường dài hơn 31km, là động khô dài nhất châu Á nằm sâu trong vùng lõi VQG Phong Nha - Kẻ Bàng trên nhánh Tây đường Hồ Chí Minh.",
      highlights: [
        "Hệ thống cầu gỗ 1km bên trong lòng hang với ánh sáng nghệ thuật",
        "Quần thể thạch nhũ Tháp Liên Hoa, Ruộng Bậc Thang kỳ vĩ",
        "Cung đường nhánh Tây Hồ Chí Minh xuyên rừng nguyên sinh cực đẹp"
      ],
      ticket: "250.000 VNĐ / người lớn",
      openHours: "07:00 - 16:30",
      coordinates: "17.5194° N, 106.2236° E",
      address: "Km 16 đường Hồ Chí Minh nhánh Tây, Bố Trạch, Quảng Trị",
      tips: "Chuẩn bị giày thể thao thoải mái để leo khoảng 500 bậc đá lên cửa động."
    },
    {
      id: "suoi-nuoc-mooc",
      name: "Suối Nước Moọc & Sông Chày Hang Tối",
      zoneCode: "QT-10",
      zoneName: "Phong Nha - Kẻ Bàng",
      category: "adventure",
      categoryName: "Sinh thái & Trải nghiệm",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewsCount: 1320,
      shortDesc: "Suối nước xanh ngọc bích mát lạnh giữa rừng già, nổi tiếng với chèo kayak, zipline và tắm bùn hang động.",
      fullDesc: "Điểm vui chơi sinh thái ngoài trời hấp dẫn nhất khu vực Phong Nha - Kẻ Bàng với làn nước xanh màu ngọc bích đặc trưng chảy ra từ mạch ngầm núi đá vôi.",
      highlights: [
        "Chèo thuyền kayak và zipline trên sông Chày",
        "Cầu tre uốn lượn và võng nghỉ giữa suối Nước Moọc",
        "Thưởng thức gà nướng chấm muối cheo bên bờ suối"
      ],
      ticket: "180.000 - 450.000 VNĐ tùy gói",
      openHours: "08:00 - 17:00",
      coordinates: "17.5625° N, 106.2358° E",
      address: "Đường Hồ Chí Minh nhánh Tây, Phong Nha, Quảng Trị",
      tips: "Đẹp nhất vào mùa nắng tháng 3 - tháng 8, nhớ mang đồ bơi và túi chống nước cho điện thoại."
    },
    {
      id: "bai-bien-nhat-le",
      name: "Biển Nhật Lệ & Đồi Cát Quang Phú",
      zoneCode: "QT-09",
      zoneName: "Đồng Hới & Nhật Lệ",
      category: "beach",
      categoryName: "Biển & Đồi cát",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewsCount: 1640,
      shortDesc: "Bãi biển cát trắng mịn ngay trung tâm Đồng Hới, kết hợp trượt cát đồi Quang Phú đón bình minh rực rỡ.",
      fullDesc: "Biển Nhật Lệ và bán đảo Bảo Ninh sở hữu bờ cát phẳng trải dài cùng làn nước trong xanh. Ngay sát đó là Đồi cát Quang Phú với những triền cát thay đổi hình dáng mỗi ngày theo gió biển.",
      highlights: [
        "Trượt cát lúc 05:30 - 07:30 sáng tại Đồi cát Quang Phú",
        "Tắm biển Nhật Lệ & dạo cầu Nhật Lệ về đêm",
        "Thưởng thức hải sản tươi sống và cháo canh cá lóc Đồng Hới"
      ],
      ticket: "Miễn phí",
      openHours: "Mở cửa cả ngày",
      coordinates: "17.4848° N, 106.6252° E",
      address: "Đường Trương Pháp, TP. Đồng Hới, Quảng Trị",
      tips: "Nên đi trượt cát sáng sớm hoặc sau 16:30 chiều để cát không bị nóng."
    },
    {
      id: "vung-chua-dao-yen",
      name: "Vũng Chùa - Đảo Yến & Đèo Ngang",
      zoneCode: "QT-11",
      zoneName: "Bố Trạch & Đèo Ngang",
      category: "history",
      categoryName: "Di tích & Danh thắng",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      rating: 5.0,
      reviewsCount: 2180,
      shortDesc: "Nơi an nghỉ linh thiêng của Đại tướng Võ Nguyên Giáp dưới chân dãy Hoành Sơn hướng ra Đảo Yến thanh bình.",
      fullDesc: "Nằm dưới chân Đèo Ngang hùng vĩ nhìn ra Biển Đông, Vũng Chùa - Đảo Yến là điểm đến thiêng liêng bậc nhất của người dân cả nước khi đi qua cửa ngõ phía Bắc Quảng Trị.",
      highlights: [
        "Viếng khu mộ Đại tướng Võ Nguyên Giáp tại mũi Rồng",
        "Check-in Hoành Sơn Quan trên đỉnh Đèo Ngang",
        "Ngắm Bãi Đá Nhảy kỳ thú trên Quốc lộ 1A"
      ],
      ticket: "Miễn phí",
      openHours: "07:00 - 17:00",
      coordinates: "17.9347° N, 106.4847° E",
      address: "Xã Quảng Đông, Quảng Trạch, Quảng Trị",
      tips: "Mặc trang phục chỉnh tề, giữ sự trang nghiêm khi vào khu vực viếng Đại tướng."
    },
    {
      id: "nha-luu-niem-dai-tuong-vo-nguyen-giap",
      name: "Nhà Lưu Niệm Đại Tướng Võ Nguyên Giáp & Suối Bang",
      zoneCode: "QT-12",
      zoneName: "Lệ Thủy",
      category: "history",
      categoryName: "Di tích & Nghỉ dưỡng",
      image: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviewsCount: 790,
      shortDesc: "Ngôi nhà gỗ 3 gian giản dị bên sông Kiến Giang gắn với tuổi thơ Đại tướng, kết hợp tắm khoáng nóng suối Bang.",
      fullDesc: "Tại làng An Xá, Lệ Thủy, ngôi nhà lưu niệm lưu giữ nhiều kỷ vật mộc mạc của Đại tướng Võ Nguyên Giáp. Cách đó không xa là khu suối khoáng nóng Bang nổi tiếng với nhiệt độ sôi tự nhiên lên tới 105°C.",
      highlights: [
        "Tham quan ngôi nhà 3 gian và cây khế hơn trăm tuổi tại làng An Xá",
        "Trải nghiệm tắm khoáng nóng onsen tự nhiên tại Suối Bang",
        "Viếng Chùa Hoằng Phúc cổ tự hơn 700 năm lịch sử"
      ],
      ticket: "Miễn phí (tắm khoáng Suối Bang theo dịch vụ)",
      openHours: "07:30 - 17:00",
      coordinates: "17.2215° N, 106.7985° E",
      address: "Làng An Xá, xã Lộc Thủy, Lệ Thủy, Quảng Trị",
      tips: "Rất thuận tiện kết hợp trên cung đường giữa Đồng Hới và Vĩnh Linh - Đông Hà."
    }
  ],

  // Ẩm thực đặc sản Quảng Trị
  foods: [
    {
      id: "chao-vat-giuong",
      name: "Cháo Vạt Giường (Bánh Canh Cá Lóc)",
      type: "Món mặn truyền thống",
      origin: "Hải Lăng & Thị xã Quảng Trị",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80",
      priceRange: "25.000 - 45.000 VNĐ",
      description: "Món ăn 'quốc hồn quốc túy' của người Quảng Trị. Sợi bánh cắt thủ công dài như thanh vạt giường làm từ bột gạo dẻo thơm hoặc bột gạo nhào lọc. Cá lóc đồng béo ngậy được luộc gỡ thịt ướp nghệ, củ nén (hành tăm) thơm nức, nấu cùng nước dùng ngọt từ xương cá và rắc ớt cay xé lưỡi.",
      addressRecs: [
        "Cháo bột Diên Sanh (Ngã 3 Hải Lăng, huyện Hải Lăng)",
        "Quán O Cúc (Đường Hai Bà Trưng, TX Quảng Trị)",
        "Bánh canh cá lóc Hải Lăng (Đường Ngô Quyền, TP Đông Hà)"
      ],
      tasteNotes: "Sợi bánh dẻo dai, thịt cá lóc thơm lừng mùi củ nén, vị cay nồng đặc trưng miền Trung làm ấm bụng ngày mưa."
    },
    {
      id: "banh-bot-loc",
      name: "Bánh Bột Lọc Mỹ Chánh",
      type: "Bánh truyền thống",
      origin: "Làng Mỹ Chánh, Hải Lăng & Đông Hà",
      image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80",
      priceRange: "3.000 - 5.000 VNĐ / chiếc (30k - 50k / đĩa)",
      description: "Được làm từ bột sắn lọc kỹ, khi hấp chín lớp vỏ bánh trong vắt hé lộ con tôm sông đỏ au và miếng thịt ba chỉ kho mằn mặn đậm đà. Bánh được gói trong lá chuối xanh thoang thoảng mùi thơm đồng nội, chấm nước mắm nhĩ ớt chỉ thiên cay nồng.",
      addressRecs: [
        "Bánh lọc làng Mỹ Chánh (Xã Hải Chánh, Hải Lăng)",
        "Quán Bánh Bột Lọc O Liên (Đường Trần Hưng Đạo, Đông Hà)",
        "Bánh lọc Chợ Đông Hà (Tầng 1 chợ hoa quả)"
      ],
      tasteNotes: "Vỏ bánh dẻo dai giòn sần sật, vị ngọt đậm đà của tôm sông quyện cùng nước mắm ớt cay tê lưỡi."
    },
    {
      id: "thit-trau-la-trong",
      name: "Thịt Trâu Lá Trơng",
      type: "Món nhậu đặc sản rừng",
      origin: "Vùng núi Hướng Hóa & Đakrông",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
      priceRange: "150.000 - 220.000 VNĐ / đĩa",
      description: "Thịt trâu non thái mỏng được nướng trên vỉ than hồng hoặc xào thơm lừng với lá trơng rừng (loại lá cây mọc hoang dã trên các cánh rừng miền Tây Quảng Trị có mùi thơm the the, cay nhẹ). Món ăn vừa bùi béo vừa ấm áp sảng khoái.",
      addressRecs: [
        "Quán Trâu Lá Trơng Sáu Hùng (Đường Lê Quý Đôn, TP Đông Hà)",
        "Nhà hàng ẩm thực Khe Sanh (Thị trấn Khe Sanh)",
        "Quán Lâm Viên (Đường Lý Thường Kiệt, TP Đông Hà)"
      ],
      tasteNotes: "Thịt trâu mềm ngọt không hề dai, mùi lá trơng thơm the the nồng nàn lạ miệng, kích thích vị giác tột cùng."
    },
    {
      id: "bun-hen-mai-xa",
      name: "Bún Hến Mai Xá (Bún Chắt Chắt)",
      type: "Di sản ẩm thực Việt Nam",
      origin: "Làng Mai Xá, Gio Mai, Gio Linh",
      image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=600&q=80",
      priceRange: "20.000 - 35.000 VNĐ / tô",
      description: "Từng lọt top 100 món ăn đặc sản tiêu biểu của Việt Nam. Món ăn nấu từ con chắt chắt (họ hàng với hến nhưng nhỏ hơn, sống ở vùng nước lợ sông Thạch Hãn). Thịt chắt chắt phi cùng hành tăm thơm phức, chan nước dùng ngọt lịm từ nước luộc chắt chắt, ăn cùng rau thơm, gừng tươi và ớt hiểm.",
      addressRecs: [
        "Quán Bún Chắt Chắt Mai Xá (Làng Mai Xá, xã Gio Mai, Gio Linh)",
        "Bún hến Mai Xá O Thu (Đường Nguyễn Tri Phương, TP Đông Hà)",
        "Quán Bún Chắt Chắt Thạch Hãn (Gần cầu Ga, TX Quảng Trị)"
      ],
      tasteNotes: "Vị ngọt thanh đạm tinh khiết từ nước luộc chắt chắt, quyện cùng cay nồng của ớt gừng làm bừng tỉnh mọi giác quan."
    },
    {
      id: "ga-cua-cam-lo",
      name: "Gà Cùa Cam Lộ",
      type: "Đặc sản gà đồi",
      origin: "Vùng đồi Cùa, huyện Cam Lộ",
      image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80",
      priceRange: "200.000 - 280.000 VNĐ / con",
      description: "Gà kiến nuôi thả tự nhiên trên những quả đồi đất đỏ bazan vùng Cùa màu mỡ. Thịt gà Cùa nổi tiếng chắc nịch, da vàng giòn, thớ thịt ngọt lịm thơm phức. Ngon nhất là gà nướng muối ớt trên than hồng hoặc luộc bóp gỏi bắp chuối ăn kèm xôi nếp.",
      addressRecs: [
        "Khu ẩm thực đồi Cùa (Xã Cam Chính, Cam Lộ)",
        "Quán gà Cùa Hoàng Long (Quốc lộ 9, Cam Lộ)",
        "Nhà hàng Dân Dã Cùa (Đường Điện Biên Phủ, TP Đông Hà)"
      ],
      tasteNotes: "Thịt dai giòn ngọt tự nhiên, thơm mùi cỏ cây thảo mộc đồi bazan."
    },
    {
      id: "ca-phe-khe-sanh",
      name: "Cà Phê Arabica Khe Sanh",
      type: "Đồ uống & Nông sản di sản",
      origin: "Thung lũng Khe Sanh, Hướng Hóa",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
      priceRange: "20.000 - 45.000 VNĐ / ly (180k - 250k / gói 500g)",
      description: "Được trồng ở độ cao từ 600m đến 1.000m trên đất bazan màu mỡ với khí hậu mát lạnh, Khe Sanh là một trong những vùng sản xuất Arabica ngon nhất Đông Nam Á. Cà phê mang hương thơm hoa quả quả mọng, vị chua thanh tinh tế và hậu vị ngọt sâu lắng.",
      addressRecs: [
        "Khe Sanh Coffee Farm & Camp (Đường Hùng Vương, Khe Sanh)",
        "Tiệm Cà phê Cổ Thụ Khe Sanh (Khối 3A, thị trấn Khe Sanh)",
        "Vườn Cà Phê Pun Coffee (Xã Hướng Phùng, Hướng Hóa)"
      ],
      tasteNotes: "Hương hoa quả tươi mới, vị chua dịu thanh tao không đắng gắt, hậu vị lưu luyến dài lâu."
    },
    {
      id: "chao-canh-dong-hoi",
      name: "Cháo Canh Cá Lóc Đồng Hới & Ram Đẻn Biển",
      type: "Món đặc sản vùng biển",
      origin: "TP. Đồng Hới & Nhật Lệ",
      image: "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=600&q=80",
      priceRange: "30.000 - 50.000 VNĐ",
      description: "Bánh canh bột mì hoặc bột gạo dai mềm nấu cùng cá lóc đồng, tôm, thịt và xương heo ninh ngọt thanh, ăn kèm ram giòn rụm và cải xanh thái nhỏ.",
      addressRecs: [
        "Cháo canh Gia Bảo (08 Lý Thường Kiệt, Đồng Hới)",
        "Quán Cháo Canh O Hạnh (04 Lê Lợi, Đồng Hới)",
        "Hải sản ven biển Nhật Lệ (Đường Trương Pháp)"
      ],
      tasteNotes: "Nước dùng ngọt dịu đậm đà, sợi bánh mềm quyện vị béo của cá lóc và ram nóng giòn."
    },
    {
      id: "ga-nuong-muoi-cheo-phong-nha",
      name: "Gà Nướng Chấm Muối Cheo & Cá Trắm Sông Son",
      type: "Đặc sản Di sản Phong Nha",
      origin: "Phong Nha - Kẻ Bàng, Bố Trạch",
      image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80",
      priceRange: "220.000 - 320.000 VNĐ / mẹt",
      description: "Gà đồi thả vườn nướng than hoa da giòn vàng ruộm, chấm muối cheo giã từ lá chanh, ớt xanh và húng quế rừng. Cá trắm nuôi lồng trên sông Son thịt chắc ngọt không tanh.",
      addressRecs: [
        "Nhà hàng Thung Lũng Phong Nha (TT. Phong Nha)",
        "Quán Gà Nướng Suối Nước Moọc",
        "Ẩm thực Sông Son (Cạnh bến thuyền Phong Nha)"
      ],
      tasteNotes: "Da gà giòn rụm thơm lừng, vị muối cheo cay thơm đặc trưng núi rừng Trường Sơn."
    }
  ],

  // Lịch trình phượt mẫu chi tiết
  itineraries: [
    {
      id: "dmz-1-day",
      title: "Hành Trình Ký Ức DMZ - Vĩ Tuyến 17",
      duration: "1 Ngày (Sáng - Chiều)",
      distance: "Khoảng 90 km",
      suitability: "Gia đình, du khách thích lịch sử, phượt xe máy hoặc ô tô",
      highlight: "Thành Cổ Quảng Trị · Cầu Hiền Lương · Địa đạo Vịnh Mốc · Nghĩa trang Trường Sơn",
      steps: [
        {
          time: "07:30 - 08:30",
          name: "Ăn sáng cháo vạt giường & Viếng Thành Cổ Quảng Trị",
          desc: "Thưởng thức tô cháo bột cá lóc Hải Lăng cay nồng tiếp năng lượng, sau đó viếng dâng hương Đài tưởng niệm Thành Cổ linh thiêng và bảo tàng 81 ngày đêm."
        },
        {
          time: "09:00 - 10:30",
          name: "Đôi bờ Hiền Lương - Sông Bến Hải (Vĩ tuyến 17)",
          desc: "Di chuyển ra bờ Bắc sông Bến Hải, ngắm nhìn cây cầu lịch sử sơn hai màu, cột cờ Giới tuyến cao 38m và cụm tượng đài Khát vọng thống nhất non sông."
        },
        {
          time: "11:00 - 13:00",
          name: "Khám phá kỳ quan ngầm Địa đạo Vịnh Mốc & Ăn trưa hải sản Cửa Tùng",
          desc: "Xuống sâu trong lòng địa đạo 3 tầng để cảm nhận sự kiên cường phi thường của quân dân Vĩnh Linh. Sau đó ăn trưa mực một nắng và canh chua cá ngừ tại bãi biển Cửa Tùng."
        },
        {
          time: "14:00 - 15:30",
          name: "Dâng hương tại Nghĩa trang Liệt sĩ Quốc gia Trường Sơn",
          desc: "Đến đồi Bến Tắt, đi dạo dưới bóng thông reo và thắp những nén tâm nhang tri ân hơn 10.000 anh hùng liệt sĩ đã hy sinh trên con đường Trường Sơn huyền thoại."
        },
        {
          time: "16:00 - 17:30",
          name: "Trở về TP Đông Hà, uống cafe bờ sông Hiếu",
          desc: "Trở về thành phố, ghé chợ Đông Hà mua bánh lọc Mỹ Chánh, tỏi Cồn Cỏ hoặc cao chè vằng về làm quà, ngắm hoàng hôn sông Hiếu."
        }
      ]
    },
    {
      id: "san-may-tay-quang-tri-2n1d",
      title: "Chinh Phục Tây Quảng Trị & Săn Mây Sa Mù",
      duration: "2 Ngày 1 Đêm",
      distance: "Khoảng 180 km khứ hồi",
      suitability: "Phượt thủ, người yêu thiên nhiên hoang dã, săn ảnh mây ngàn",
      highlight: "Cầu treo Đakrông · Sân bay Tà Cơn · Đèo Sa Mù · Thác Chênh Vênh · Điện gió Hướng Linh",
      steps: [
        {
          time: "Ngày 1: 08:00 - 11:30",
          name: "Đông Hà -> Ngã ba Cầu treo Đakrông -> Suối Klu",
          desc: "Bắt đầu hành trình ngược Đường 9 huyền thoại lên dãy Trường Sơn. Check-in cầu treo Đakrông soi bóng sông xanh ngắt, tắm suối nước khoáng ấm Klu thư giãn."
        },
        {
          time: "Ngày 1: 12:00 - 15:00",
          name: "Ăn trưa gà Cùa & Thăm di tích Sân bay Tà Cơn",
          desc: "Lên thị trấn Khe Sanh thưởng thức thịt nướng cơm lam hoặc gà đồi, sau đó tham quan khu trưng bày xác máy bay C-130 và công sự Tà Cơn."
        },
        {
          time: "Ngày 1: 15:30 - 18:00",
          name: "Ngắm hoàng hôn trên cánh đồng điện gió Hướng Linh",
          desc: "Lái xe qua những con đường uốn lượn giữa các cánh quạt gió khổng lồ xoay nhẹ trong ráng chiều vàng rực, ngắm hồ Rào Quán từ trên cao."
        },
        {
          time: "Ngày 1: 18:30 - 21:30",
          name: "Nghỉ đêm tại Khe Sanh / Glamping Hướng Phùng, thưởng thức thịt trâu lá trơng",
          desc: "Đốt lửa trại, nướng thịt trâu lá trơng thơm lừng giữa thời tiết se lạnh 18°C của vùng cao nguyên Khe Sanh, thưởng thức ly cafe Arabica đậm vị."
        },
        {
          time: "Ngày 2: 05:30 - 08:00",
          name: "Đón bình minh & Săn biển mây đỉnh Đèo Sa Mù",
          desc: "Dậy sớm chạy lên đèo Sa Mù ở độ cao 1.400m. Đắm chìm trong biển mây bồng bềnh cuộn trôi qua những tán rừng già nguyên sinh phủ rêu phong."
        },
        {
          time: "Ngày 2: 09:00 - 11:30",
          name: "Trekking nhẹ xuống tắm Thác Chênh Vênh",
          desc: "Dưới chân đèo Sa Mù, lội bộ vào rừng già khoảng 500m để đắm mình vào hồ nước xanh như ngọc bích của thác Chênh Vênh."
        },
        {
          time: "Ngày 2: 13:00 - 16:30",
          name: "Thong thả trở về lại TP Đông Hà",
          desc: "Ghé mua cafe bột Arabica Khe Sanh đặc sản tại các nông trại, kết thúc chuyến phượt mây ngàn đáng nhớ."
        }
      ]
    },
    {
      id: "dao-ngoc-con-co-2n1d",
      title: "Hành Trình Khám Phá Hòn Ngọc Xanh Cồn Cỏ",
      duration: "2 Ngày 1 Đêm",
      distance: "Cửa Việt -> Đảo Cồn Cỏ (15 hải lý đường biển)",
      suitability: "Những ai yêu biển đảo nguyên sơ, lặn ngắm san hô, check-in cột cờ Tổ quốc",
      highlight: "Tàu cao tốc xuyên biển · Cột cờ Cồn Cỏ · Hải đăng · Rạn san hô Bến Tranh · Cua đá Cồn Cỏ",
      steps: [
        {
          time: "Ngày 1: 07:00 - 09:00",
          name: "Cảng Cửa Việt -> Lên tàu cao tốc ra đảo Cồn Cỏ",
          desc: "Làm thủ tục tại cảng Cửa Việt, đón chuyến tàu cao tốc lướt sóng Biển Đông khoảng 45 - 60 phút để đặt chân lên cầu cảng đảo anh hùng Cồn Cỏ."
        },
        {
          time: "Ngày 1: 09:30 - 11:30",
          name: "Chào cờ tại Cột cờ Tổ quốc Cồn Cỏ & Thăm ngọn Hải đăng",
          desc: "Chụp ảnh lưu niệm dưới lá cờ đỏ sao vàng tung bay kiêu hãnh giữa biển trời. Leo lên đỉnh ngọn hải đăng phóng tầm mắt ngắm toàn cảnh 360 độ đảo ngọc."
        },
        {
          time: "Ngày 1: 12:00 - 14:30",
          name: "Ăn trưa hải sản Cồn Cỏ & Nghỉ trưa tại homestay đảo",
          desc: "Thưởng thức ốc mắt ngọc, mực nang câu đêm, canh chua cá dìa nấu lá giang do chính các hộ gia đình cư dân trên đảo chế biến mộc mạc."
        },
        {
          time: "Ngày 1: 15:00 - 18:00",
          name: "Lặn biển ngắm san hô tại Bến Tranh & Tắm biển Bến Nghè",
          desc: "Đeo kính lặn chiêm ngưỡng những rạn san hô cành hình tán hoa tuyệt đẹp ngay dưới làn nước trong vắt cách bờ chỉ vài mét."
        },
        {
          time: "Ngày 2: 05:30 - 08:00",
          name: "Đón bình minh tại Đồi 37 & Trekking rừng nguyên sinh biển đảo",
          desc: "Đi bộ xuyên qua con đường rợp bóng cây bàng vuông, ngắm nhìn thảm thực vật nhiệt đới độc đáo và nghe tiếng chim hải âu ríu rít."
        },
        {
          time: "Ngày 2: 09:30 - 11:00",
          name: "Lên tàu trở về đất liền Cửa Việt",
          desc: "Chia tay bà con và các chiến sĩ biển đảo hiếu khách, cập bến Cửa Việt và tiếp tục hành trình."
        }
      ]
    }
  ],

  // Cẩm nang kinh nghiệm & Tiện ích
  guides: {
    bestTimeToVisit: [
      {
        season: "Mùa Săn Mây & Hoa Dã Quỳ (Tháng 11 - Tháng 2)",
        desc: "Thời tiết miền núi Hướng Hóa và đèo Sa Mù se lạnh mát rượi (15-20°C). Mây biển xuất hiện dày đặc vào sáng sớm, hoa dã quỳ nở vàng rực khắp triền đồi Đường 9. Rất thích hợp cho phượt thủ."
      },
      {
        season: "Mùa Du Lịch Biển & Di Tích (Tháng 3 - Tháng 8)",
        desc: "Trời nắng ráo, biển Cửa Tùng, Cửa Việt và đảo Cồn Cỏ trong xanh như ngọc, sóng êm tuyệt đối. Rất lý tưởng để ra đảo Cồn Cỏ, tắm biển và thăm các di tích DMZ."
      },
      {
        season: "Lưu ý mùa Gió Lào & Mưa Bão (Tháng 5-7 nắng gắt, Tháng 9-10 mưa lũ)",
        desc: "Tháng 6-7 có gió Tây Nam khô nóng (gió Phơn). Nếu đi mùa này nên trang bị mũ nón rộng vành, kem chống nắng và nhiều nước khoáng. Tránh đi rừng thác vào mùa mưa lũ tháng 9-10."
      }
    ],

    packingChecklist: [
      "Giấy tờ tùy thân: CCCD/Hộ chiếu (bắt buộc khi đi tàu ra đảo Cồn Cỏ)",
      "Trang phục: Quần áo dài tay lịch sự khi viếng Thành Cổ, Nghĩa trang Trường Sơn; đồ bơi đi biển Cửa Việt & Cồn Cỏ",
      "Đồ đi đèo: Áo khoác gió giữ ấm khi lên Sa Mù (nhiệt độ chênh 5-8°C so với đồng bằng)",
      "Kính râm, kem chống nắng, mũ nón chống gió Lào",
      "Thuốc men: Thuốc chống muỗi/vắt khi đi rừng Chênh Vênh, thuốc say tàu xe khi đi biển Cồn Cỏ",
      "Bộ dụng cụ sửa xe mini & bơm lốp dự phòng khi đi phượt đường Tây Trường Sơn vắng vẻ"
    ],

    emergencyHotlines: [
      { name: "Cứu hộ xe máy & sửa xe đèo Sa Mù (Hướng Hóa)", phone: "0914.823.xxx / 0983.152.xxx", note: "Hỗ trợ vá xe, kéo xe từ đỉnh đèo về thị trấn" },
      { name: "Ban Quản lý Cảng Cửa Việt - Đặt vé tàu Cồn Cỏ", phone: "0233.3588.666", note: "Kiểm tra lịch tàu chạy theo tình hình thời tiết" },
      { name: "Công an tỉnh Quảng Trị (Trực ban)", phone: "0233.3852.345", note: "Hỗ trợ an ninh trật tự khẩn cấp" },
      { name: "Bệnh viện Đa khoa tỉnh Quảng Trị (TP Đông Hà)", phone: "0233.3852.202", note: "Đường dây nóng cấp cứu y tế" },
      { name: "Cứu hộ giao thông Quảng Trị 24/7", phone: "0905.123.456", note: "Cứu hộ xe ô tô, kéo xe tai nạn trên Quốc lộ 1A & Đường 9" }
    ],

    gasStations: [
      { name: "Petrolimex Cửa khẩu Lao Bảo & Khe Sanh", route: "Quốc lộ 9 - Hướng Hóa", tip: "Nên đổ đầy bình xăng trước khi rẽ vào đường nhánh Tây Trường Sơn lên đèo Sa Mù" },
      { name: "Cây xăng Ngã ba Cầu treo Đakrông", route: "Ngã ba QL9 & Đường Hồ Chí Minh", tip: "Trạm xăng cuối cùng trước khi vào đoạn đường rừng vắng" },
      { name: "Petrolimex TP Đông Hà (Nhiều trạm)", route: "Quốc lộ 1A & Đường Lê Duẩn", tip: "Hoạt động 24/7, có trụ rửa xe và bơm lốp tự động" },
      { name: "Cây xăng Dốc Miếu & Quán Ngang", route: "Quốc lộ 1A - Gio Linh", tip: "Nằm trên trục đường chính đi Cầu Hiền Lương và Địa đạo Vịnh Mốc" }
    ]
  },

  // Slideshow ảnh Banner Travel Phiêu Lãng
  bannerSlides: [
    {
      id: "deo-sa-mu",
      placeId: "deo-sa-mu",
      zoneCode: "QT-05",
      badge: "🏔️ SĂN MÂY ĐỈNH ĐÈO SA MÙ",
      title: "Biển Mây Bồng Bềnh Trên 'Cổng Trời' Trường Sơn",
      subtitle: "Độ cao gần 1.400m quanh năm mát lạnh, biển mây cuộn trôi qua những tán rừng già rêu phong nguyên sinh.",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=85",
      statsTag: "18°C · Biển mây sáng sớm",
      elevation: "1.400m"
    },
    {
      id: "dao-con-co",
      placeId: "dao-con-co",
      zoneCode: "QT-07",
      badge: "🏝️ VIÊN NGỌC XANH TIỀN ĐỒN",
      title: "Đảo Tiền Tiêu Cồn Cỏ Giữa Đại Dương Xanh Biếc",
      subtitle: "Hòn đảo anh hùng hiên ngang giữa Biển Đông, rạn san hô lộng lẫy và ngọn hải đăng sừng sững đón bình minh.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85",
      statsTag: "26°C · 15 hải lý từ bờ",
      elevation: "Đảo ngọc"
    },
    {
      id: "dia-dao-vinh-moc",
      placeId: "dia-dao-vinh-moc",
      zoneCode: "QT-03",
      badge: "🏛️ KỲ QUAN LÀNG HẦM 3 TẦNG",
      title: "Địa Đạo Vịnh Mốc - Bản Hùng Ca Trong Lòng Đất",
      subtitle: "Hệ thống đường ngầm kỳ vĩ sâu đến 23m, nơi che chở hàng trăm người dân với cửa hầm trổ thẳng ra biển cả.",
      image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1600&q=85",
      statsTag: "Sâu 23m · Hướng biển Đông",
      elevation: "Di tích Quốc gia"
    },
    {
      id: "thac-chenh-venh",
      placeId: "thac-chenh-venh",
      zoneCode: "QT-05",
      badge: "🌲 NGỌC BÍCH ĐẠI NGÀN",
      title: "Thác Chênh Vênh - Hồ Nước Lục Bảo Giữa Rừng Già",
      subtitle: "Dòng thác trong vắt đổ xuống mặt hồ xanh như ngọc, điểm cắm trại glamping lý tưởng dưới chân đèo Sa Mù.",
      image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1600&q=85",
      statsTag: "Nước ngọc bích · Glamping",
      elevation: "Chân đèo Sa Mù"
    },
    {
      id: "canh-dong-dien-gio-huong-linh",
      placeId: "canh-dong-dien-gio-huong-linh",
      zoneCode: "QT-05",
      badge: "💨 HOÀNG HÔN TRỜI ÂU",
      title: "Cánh Đồng Quạt Gió Hướng Linh & Hướng Tân",
      subtitle: "Những trụ tuabin gió khổng lồ vươn giữa triền đồi bazan bạt ngàn đón ráng chiều hoàng hôn rực rỡ.",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1600&q=85",
      statsTag: "Ráng chiều vàng · Hồ Rào Quán",
      elevation: "Đồi hoa dã quỳ"
    },
    {
      id: "cau-hien-luong-ben-hai",
      placeId: "cau-hien-luong-ben-hai",
      zoneCode: "QT-03",
      badge: "🇻🇳 VĨ TUYẾN 17 LỊCH SỬ",
      title: "Đôi Bờ Hiền Lương - Dòng Sông Bến Hải Huyền Thoại",
      subtitle: "Cây cầu hai nửa màu sơn biểu tượng cho khát vọng thống nhất non sông liền một dải của dân tộc Việt Nam.",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85",
      statsTag: "Cột cờ 38m · Sông Bến Hải",
      elevation: "Biểu tượng hòa bình"
    }
  ],

  // Dữ liệu thời tiết chi tiết theo phong cách Hagiang.wiki
  weatherData: {
    "huong-hoa": {
      name: "Hướng Hóa (Đèo Sa Mù)",
      region: "VÙNG CAO QUẢNG TRỊ",
      elevation: "1.400m",
      current: {
        condition: "Mưa phùn & Sương mây",
        icon: "rain",
        temp: 17,
        rainChance: "47%",
        rainNote: "Có thể có mưa",
        humidity: "96%",
        humidityNote: "Độ ẩm cao",
        wind: "4 km/h",
        windNote: "Gió nhẹ · Giật 9 km/h"
      },
      tipRain: "Trời có thể mưa phùn, nhớ mang áo ấm và áo mưa nhé!",
      tipSleep: "Lạnh quá, ghé Khe Sanh nhâm nhi ly cà phê Arabica cho ấm! (17°C)",
      forecast: [
        { day: "Hôm nay", date: "19.11", icon: "rain", high: 17, low: 11, rain: "80%" },
        { day: "Thứ 6", date: "20.11", icon: "rain", high: 14, low: 10, rain: "100%" },
        { day: "Thứ 7", date: "21.11", icon: "cloud", high: 16, low: 10, rain: "6%" },
        { day: "CN", date: "22.11", icon: "rain", high: 17, low: 10, rain: "2%" },
        { day: "Thứ 2", date: "23.11", icon: "rain", high: 18, low: 14, rain: "42%" },
        { day: "Thứ 3", date: "24.11", icon: "rain", high: 17, low: 12, rain: "54%" },
        { day: "Thứ 4", date: "25.11", icon: "rain", high: 17, low: 9, rain: "28%" }
      ]
    },
    "dong-ha": {
      name: "TP Đông Hà",
      region: "ĐÔ THỊ TRUNG TÂM",
      elevation: "Trung tâm",
      current: {
        condition: "Mây rải rác, trời mát",
        icon: "cloud-sun",
        temp: 24,
        rainChance: "15%",
        rainNote: "Khô ráo",
        humidity: "76%",
        humidityNote: "Vừa phải",
        wind: "8 km/h",
        windNote: "Gió nhẹ"
      },
      tipRain: "Thời tiết đẹp, rất thích hợp dạo chợ đêm và thưởng thức ẩm thực!",
      tipSleep: "Ghé đường Ngô Quyền xì xụp tô cháo vạt giường cá lóc cay nồng nhé! (24°C)",
      forecast: [
        { day: "Hôm nay", date: "19.11", icon: "cloud-sun", high: 24, low: 18, rain: "15%" },
        { day: "Thứ 6", date: "20.11", icon: "sun", high: 25, low: 19, rain: "10%" },
        { day: "Thứ 7", date: "21.11", icon: "sun", high: 26, low: 20, rain: "5%" },
        { day: "CN", date: "22.11", icon: "cloud", high: 24, low: 19, rain: "20%" },
        { day: "Thứ 2", date: "23.11", icon: "sun", high: 26, low: 20, rain: "10%" },
        { day: "Thứ 3", date: "24.11", icon: "cloud-sun", high: 25, low: 19, rain: "15%" },
        { day: "Thứ 4", date: "25.11", icon: "sun", high: 25, low: 18, rain: "10%" }
      ]
    },
    "con-co": {
      name: "Huyện Đảo Cồn Cỏ",
      region: "TIỀN ĐỒN BIỂN ĐÔNG",
      elevation: "Biển đảo",
      current: {
        condition: "Nắng nhẹ, biển êm",
        icon: "sun",
        temp: 26,
        rainChance: "10%",
        rainNote: "Không mưa",
        humidity: "72%",
        humidityNote: "Mát lành",
        wind: "11 km/h",
        windNote: "Sóng êm · Cấp 2-3"
      },
      tipRain: "Biển êm sóng lặng, tàu cao tốc Cửa Việt - Cồn Cỏ xuất bến an toàn!",
      tipSleep: "Thời tiết tuyệt vời để lặn ngắm rạn san hô Bến Tranh và ngắm hải đăng! (26°C)",
      forecast: [
        { day: "Hôm nay", date: "19.11", icon: "sun", high: 26, low: 21, rain: "10%" },
        { day: "Thứ 6", date: "20.11", icon: "sun", high: 27, low: 22, rain: "5%" },
        { day: "Thứ 7", date: "21.11", icon: "cloud-sun", high: 26, low: 21, rain: "15%" },
        { day: "CN", date: "22.11", icon: "sun", high: 27, low: 22, rain: "5%" },
        { day: "Thứ 2", date: "23.11", icon: "sun", high: 26, low: 21, rain: "10%" },
        { day: "Thứ 3", date: "24.11", icon: "sun", high: 26, low: 21, rain: "10%" },
        { day: "Thứ 4", date: "25.11", icon: "cloud-sun", high: 25, low: 20, rain: "20%" }
      ]
    },
    "vinh-linh": {
      name: "Vĩnh Linh (DMZ & Vịnh Mốc)",
      region: "VĨ TUYẾN 17 LỊCH SỬ",
      elevation: "Ven biển",
      current: {
        condition: "Trời thu mát mẻ, nắng nhẹ",
        icon: "cloud-sun",
        temp: 23,
        rainChance: "20%",
        rainNote: "Ít mây",
        humidity: "82%",
        humidityNote: "Dễ chịu",
        wind: "7 km/h",
        windNote: "Gió nhẹ"
      },
      tipRain: "Khí hậu mát mẻ, rất thuận lợi viếng Cầu Hiền Lương và Địa đạo Vịnh Mốc!",
      tipSleep: "Trong lòng hầm địa đạo Vịnh Mốc nhiệt độ luôn giữ 20-22°C cực mát! (23°C)",
      forecast: [
        { day: "Hôm nay", date: "19.11", icon: "cloud-sun", high: 23, low: 18, rain: "20%" },
        { day: "Thứ 6", date: "20.11", icon: "cloud", high: 24, low: 18, rain: "25%" },
        { day: "Thứ 7", date: "21.11", icon: "sun", high: 25, low: 19, rain: "10%" },
        { day: "CN", date: "22.11", icon: "sun", high: 25, low: 19, rain: "10%" },
        { day: "Thứ 2", date: "23.11", icon: "cloud-sun", high: 24, low: 18, rain: "15%" },
        { day: "Thứ 3", date: "24.11", icon: "sun", high: 24, low: 18, rain: "10%" },
        { day: "Thứ 4", date: "25.11", icon: "sun", high: 24, low: 17, rain: "10%" }
      ]
    }
  },

  // =========================================================================
  // Diễn đàn cộng đồng - Kinh nghiệm & Review thực tế (Forum Threads)
  // =========================================================================
  forumThreads: [
    {
      id: "thread-1",
      author: "Hoàng Nam (Phượt thủ Đà Nẵng)",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      badge: "Đã đi 5 lần",
      time: "Hôm qua lúc 08:30",
      zoneCode: "QT-05",
      zoneName: "Đèo Sa Mù & Khe Sanh",
      tag: "Săn mây",
      title: "Kinh nghiệm săn mây đèo Sa Mù 2N1Đ - Bồng bềnh cổng trời nóc nhà Quảng Trị",
      content: "Vừa hoàn thành chuyến độc hành săn mây đèo Sa Mù cuối tuần qua. Mình xuất phát từ Đông Hà lúc 5h sáng theo QL9 lên Khe Sanh rồi rẽ vào đường mòn Hồ Chí Minh Tây. Tầm 6h30 sáng tới đỉnh đèo ở độ cao gần 1.400m, biển mây cuồn cuộn như thác đổ qua thung lũng! Nhiệt độ lúc sáng sớm chỉ tầm 15°C, lạnh buốt nhưng cảnh tượng thì xứng đáng điểm 10. Mẹo nhỏ cho anh em: Đèo thường có sương mù dày sau 8h sáng, nhớ kiểm tra phanh xe máy kỹ trước khi lên dốc và mang áo ấm chống gió.",
      images: [
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
      ],
      likes: 42,
      comments: [
        {
          author: "Minh Trang",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
          time: "Hôm qua lúc 10:15",
          text: "Ảnh đẹp quá anh ơi! Cho em hỏi đường đèo Sa Mù xe tay ga đi ổn không ạ?"
        },
        {
          author: "Hoàng Nam",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
          time: "Hôm qua lúc 11:00",
          text: "Xe tay ga đi được nhưng nên chọn xe khỏe từ 125cc trở lên và không rà phanh liên tục lúc đổ dốc nha em, tốt nhất vẫn là xe số hoặc côn tay."
        }
      ]
    },
    {
      id: "thread-2",
      author: "Hương Giang (Hà Nội)",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      badge: "Du lịch gia đình",
      time: "2 ngày trước",
      zoneCode: "QT-03",
      zoneName: "Vĩ Tuyến 17 & Vịnh Mốc",
      tag: "Lịch sử DMZ",
      title: "Lắng đọng bước chân nơi đôi bờ Hiền Lương và làng hầm Vịnh Mốc",
      content: "Đưa cả gia đình về thăm vùng đất lửa Quảng Trị sau bao năm ấp ủ. Đứng giữa nhịp cầu Hiền Lương chia cắt hai nửa màu sơn, nghe tiếng gió thổi qua dòng Bến Hải mà rưng rưng xúc động. Xuống địa đạo Vịnh Mốc thì thực sự khâm phục ý chí của cha ông: dưới lòng đất sâu 3 tầng mát rượi, có cả phòng sinh nở nơi 17 đứa trẻ chào đời an toàn. Một chuyến đi giáo dục truyền thống vô cùng ý nghĩa cho các con.",
      images: [
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"
      ],
      likes: 58,
      comments: [
        {
          author: "Bác Lâm (Cựu chiến binh)",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
          time: "1 ngày trước",
          text: "Cảm ơn cháu đã chia sẻ. Chiến trường xưa nay đã xanh ngắt một màu bình yên, thế hệ trẻ nhớ về cội nguồn là điều quý báu nhất."
        }
      ]
    },
    {
      id: "thread-3",
      author: "Thanh Tùng (Sài Gòn)",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      badge: "Tín đồ ẩm thực",
      time: "3 ngày trước",
      zoneCode: "QT-01",
      zoneName: "Đông Hà & Hải Lăng",
      tag: "Ẩm thực",
      title: "Hành trình càn quét ẩm thực Quảng Trị: Cháo vạt giường, Bún hến Mai Xá và Thịt luộc rau rừng",
      content: "Ẩm thực Quảng Trị mang vị cay tê nồng nàn đặc trưng của miền Trung gió Lào. Đã tới đây thì nhất định phải ăn tô Bánh canh cá lóc (cháo vạt giường) sợi bột gạo dẻo dai kèm đầu cá béo ngậy ở ngã ba Hải Lăng. Sang Mai Xá thì chén liền 2 tô Bún chắt chắt xào thơm lừng cay xé lưỡi mà ngọt thanh từ nước luộc chắt chắt. Giá cả cực kỳ bình dân, chỉ từ 25k - 40k/tô mà no ứ ự!",
      images: [
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
      ],
      likes: 37,
      comments: [
        {
          author: "Kim Ngân",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
          time: "2 ngày trước",
          text: "Nhìn thèm quá anh ơi! Cho em xin địa chỉ quán bún hến Mai Xá chuẩn vị nhất với ạ."
        },
        {
          author: "Thanh Tùng",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
          time: "2 ngày trước",
          text: "Em ghé quán Bún Hến Mai Xá bên làng Mai Xá, xã Gio Mai nha, quán mộc mạc bên bờ sông mà ngon đỉnh luôn."
        }
      ]
    },
    {
      id: "thread-4",
      author: "Lê Hải (Trekker)",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80",
      badge: "Khám phá biển đảo",
      time: "4 ngày trước",
      zoneCode: "QT-07",
      zoneName: "Huyện Đảo Cồn Cỏ",
      tag: "Đảo Cồn Cỏ",
      title: "Kinh nghiệm đi đảo Cồn Cỏ 2N1Đ tự túc: Lịch tàu, thuê xe máy và lặn ngắm san hô",
      content: "Đảo Cồn Cỏ được ví như viên ngọc xanh giữa Biển Đông. Từ cảng Cửa Việt đi tàu cao tốc Chính Nghĩa chỉ mất tầm 45-60 phút. Ra đảo không khí trong lành tuyệt đối, biển xanh màu ngọc bích nhìn thấy tận đáy san hô. Anh em nhớ mang theo CMND/CCCD để trình biên phòng, thuê xe máy chạy quanh đảo chỉ 150k/ngày ngắm ngọn hải đăng và rừng nguyên sinh bao phủ.",
      images: [
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"
      ],
      likes: 49,
      comments: []
    }
  ],

  // =========================================================================
  // Dịch vụ & Đối tác Bản Địa (Homestay, Thuê xe, Vé tàu, Tour Guide)
  // =========================================================================
  services: [
    {
      id: "partner-1",
      name: "Sa Mù Cloud Glamping & Homestay",
      category: "homestay",
      categoryName: "Homestay & Glamping",
      zoneCode: "QT-05",
      zoneName: "Khe Sanh & Đèo Sa Mù",
      address: "Bản Chênh Vênh, Hướng Phùng, Hướng Hóa, Quảng Trị",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
      price: "450.000 VNĐ / đêm",
      rating: 4.9,
      reviewsCount: 86,
      phone: "0982 123 456",
      zalo: "0982123456",
      verified: true,
      badge: "Đối tác Bảo chứng",
      highlights: ["View săn mây 360 độ ngắm đỉnh đèo", "Lều glamping ấm áp có máy sưởi", "Phục vụ cơm lam cá suối nướng"]
    },
    {
      id: "partner-2",
      name: "Dịch Vụ Thuê Xe Máy Phượt Ga Đông Hà",
      category: "bike",
      categoryName: "Cho thuê xe máy",
      zoneCode: "QT-01",
      zoneName: "TP Đông Hà",
      address: "Đối diện Ga Đông Hà, 21 Lê Duẩn, TP Đông Hà",
      image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
      price: "120.000 VNĐ / ngày",
      rating: 4.9,
      reviewsCount: 210,
      phone: "0914 987 654",
      zalo: "0914987654",
      verified: true,
      badge: "Xe mới giao tận nơi",
      highlights: ["Miễn phí 2 mũ bảo hiểm chuẩn + 2 áo mưa", "Giao xe miễn phí tại Ga tàu & Khách sạn", "Bảo hành cứu hộ 24/7 trên toàn tỉnh"]
    },
    {
      id: "partner-3",
      name: "Đại Lý Vé Tàu Cao Tốc Đảo Cồn Cỏ",
      category: "boat",
      categoryName: "Tàu cao tốc biển đảo",
      zoneCode: "QT-07",
      zoneName: "Cửa Việt - Đảo Cồn Cỏ",
      address: "Cảng Cửa Việt, Gio Linh, Quảng Trị",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      price: "250.000 VNĐ / vé khứ hồi",
      rating: 4.8,
      reviewsCount: 140,
      phone: "0905 345 678",
      zalo: "0905345678",
      verified: true,
      badge: "Đặt vé trực tuyến",
      highlights: ["Tàu hai thân hiện đại không say sóng", "Hỗ trợ khai báo thủ tục biên phòng ra đảo", "Cam kết giữ chỗ vào dịp lễ cao điểm"]
    },
    {
      id: "partner-4",
      name: "Hướng Dẫn Viên Bản Địa Di Sản DMZ",
      category: "tour",
      categoryName: "Tour Guide Di Sản",
      zoneCode: "QT-03",
      zoneName: "Vĩ Tuyến 17 & Vịnh Mốc",
      address: "Hiền Lương, Vĩnh Linh, Quảng Trị",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      price: "500.000 VNĐ / buổi",
      rating: 5.0,
      reviewsCount: 92,
      phone: "0977 888 999",
      zalo: "0977888999",
      verified: true,
      badge: "Thuyết minh chuyên sâu",
      highlights: ["Kể chuyện lịch sử 81 ngày đêm & Vĩ tuyến 17", "Được chứng nhận thuyết minh viên di tích cấp quốc gia", "Dẫn tour linh hoạt theo yêu cầu cá nhân và gia đình"]
    }
  ],

  // Cấu hình Affiliate & Monetization
  affiliateConfig: {
    agodaPartnerId: "QUANGTRI_AGODA_PROMO",
    bookingAffiliateId: "QUANGTRI_BOOKING_WIKI",
    klookCampaign: "QUANGTRI_DISCOVERY"
  }
};

// Xuất cho môi trường browser hoặc node

