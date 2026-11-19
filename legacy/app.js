/**
 * QuangTri.wiki - Interactive Application Logic
 * Pure ES6, zero external npm dependencies, high performance
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  const state = {
    activeCategory: 'all',
    activeZone: 'all',
    searchQuery: '',
    selectedItinerary: 'dmz-1-day',
    bookmarks: JSON.parse(localStorage.getItem('qt_bookmarks') || '[]'),
    notes: localStorage.getItem('qt_notes') || '',
    checklist: JSON.parse(localStorage.getItem('qt_checklist') || '{}'),
    budget: {
      days: 2,
      people: 2,
      gas: 250000,
      hotelPerNight: 400000,
      foodPerDay: 250000,
      other: 200000
    }
  };

  // DOM Elements
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const notebookToggleBtn = document.getElementById('notebook-toggle-btn');
  const notebookDrawer = document.getElementById('notebook-drawer');
  const notebookOverlay = document.getElementById('notebook-overlay');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const searchInputs = document.querySelectorAll('.search-input');
  const bookmarkCountBadge = document.getElementById('bookmark-count-badge');
  const zonesContainer = document.getElementById('zones-container');
  const placesContainer = document.getElementById('places-container');
  const foodContainer = document.getElementById('food-container');
  const categoryFilterBtns = document.querySelectorAll('.filter-btn');
  const itineraryTabsContainer = document.getElementById('itinerary-tabs');
  const itineraryContentContainer = document.getElementById('itinerary-content');
  const detailModalOverlay = document.getElementById('detail-modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  // =========================================================================
  // Theme Toggle (Dark / Light)
  // =========================================================================
  const savedTheme = localStorage.getItem('qt_theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('qt_theme', nextTheme);
      updateThemeIcon(nextTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    themeToggleBtn.innerHTML = theme === 'dark'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }

  // =========================================================================
  // Hagiang.wiki Style Hero Slider & Dynamic Weather Card
  // =========================================================================
  function renderHagiangHeroSlider() {
    const bgTrack = document.getElementById('hagiang-hero-bg-track');
    const dotsContainer = document.getElementById('hagiang-capsule-dots');

    if (!bgTrack || !QUANGTRI_DATA.bannerSlides || QUANGTRI_DATA.bannerSlides.length === 0) return;

    const slides = QUANGTRI_DATA.bannerSlides;
    let currentIndex = 0;
    let autoPlayTimer = null;
    const duration = 6500;

    // Render Background Slides
    bgTrack.innerHTML = slides.map((slide, idx) => `
      <div class="hagiang-hero-bg-slide ${idx === 0 ? 'active' : ''}" style="background-image: url('${slide.image}');" data-index="${idx}"></div>
    `).join('');

    // Render Capsule Dots
    if (dotsContainer) {
      dotsContainer.innerHTML = slides.map((_, idx) => `
        <div class="hagiang-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}" title="Xem ảnh ${idx + 1}"></div>
      `).join('');

      dotsContainer.querySelectorAll('.hagiang-dot').forEach(dot => {
        dot.addEventListener('click', () => {
          const idx = parseInt(dot.getAttribute('data-index'), 10);
          goToSlide(idx);
          resetAutoPlay();
        });
      });
    }

    function goToSlide(index) {
      const allSlides = bgTrack.querySelectorAll('.hagiang-hero-bg-slide');
      const allDots = dotsContainer ? dotsContainer.querySelectorAll('.hagiang-dot') : [];

      allSlides.forEach(s => s.classList.remove('active'));
      allDots.forEach(d => d.classList.remove('active'));

      currentIndex = (index + slides.length) % slides.length;

      if (allSlides[currentIndex]) allSlides[currentIndex].classList.add('active');
      if (allDots[currentIndex]) allDots[currentIndex].classList.add('active');
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(nextSlide, duration);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    }

    function resetAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    startAutoPlay();
  }

  // Weather Card Controller
  function setupWeatherCard() {
    const districtSelect = document.getElementById('weather-district-select');
    const regionTag = document.getElementById('weather-region-tag');
    const daysRow = document.getElementById('weather-days-row');
    const hourlyTitle = document.getElementById('weather-hourly-title');
    const detailIcon = document.getElementById('weather-detail-icon');
    const conditionText = document.getElementById('weather-condition-text');
    const rainPct = document.getElementById('metric-rain-pct');
    const rainNote = document.getElementById('metric-rain-note');
    const humidityPct = document.getElementById('metric-humidity-pct');
    const humidityNote = document.getElementById('metric-humidity-note');
    const windSpeed = document.getElementById('metric-wind-speed');
    const windNote = document.getElementById('metric-wind-note');
    const advisoryRainText = document.getElementById('advisory-rain-text');
    const advisoryVibeText = document.getElementById('advisory-vibe-text');

    if (!districtSelect || !QUANGTRI_DATA.weatherData) return;

    function getWeatherIcon(icon) {
      switch (icon) {
        case 'rain': return '🌧️';
        case 'sun': return '☀️';
        case 'cloud': return '☁️';
        case 'cloud-sun': return '⛅';
        default: return '⛅';
      }
    }

    function renderWeather(districtKey) {
      const data = QUANGTRI_DATA.weatherData[districtKey] || QUANGTRI_DATA.weatherData["huong-hoa"];
      if (!data) return;

      if (regionTag) regionTag.textContent = data.region;
      if (hourlyTitle) hourlyTitle.textContent = `Dự báo theo giờ · 07:00 · ${data.name.split('(')[0].trim()}`;
      if (detailIcon) detailIcon.textContent = getWeatherIcon(data.current.icon);
      if (conditionText) conditionText.textContent = data.current.condition;

      if (rainPct) rainPct.textContent = data.current.rainChance;
      if (rainNote) rainNote.textContent = data.current.rainNote;
      if (humidityPct) humidityPct.textContent = data.current.humidity;
      if (humidityNote) humidityNote.textContent = data.current.humidityNote;
      if (windSpeed) windSpeed.textContent = data.current.wind;
      if (windNote) windNote.textContent = data.current.windNote;

      if (advisoryRainText) advisoryRainText.textContent = data.tipRain;
      if (advisoryVibeText) advisoryVibeText.textContent = data.tipSleep;

      // Render 7-day row
      if (daysRow) {
        daysRow.innerHTML = data.forecast.map((f, idx) => `
          <div class="weather-day-card ${idx === 0 ? 'active' : ''}" data-day-index="${idx}" style="cursor: pointer;">
            <div class="day-title">${f.day}</div>
            <div class="day-date">${f.date}</div>
            <div class="day-icon">${getWeatherIcon(f.icon)}</div>
            <div class="day-high">${f.high}°</div>
            <div class="day-low">${f.low}°</div>
            <div class="day-rain">${f.rain}</div>
          </div>
        `).join('');

        daysRow.querySelectorAll('.weather-day-card').forEach(card => {
          card.addEventListener('click', () => {
            daysRow.querySelectorAll('.weather-day-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const dayIdx = parseInt(card.getAttribute('data-day-index'), 10);
            const targetForecast = data.forecast[dayIdx];
            if (targetForecast && conditionText) {
              conditionText.textContent = `Nhiệt độ ${targetForecast.high}° / ${targetForecast.low}° · Mưa ${targetForecast.rain}`;
              if (detailIcon) detailIcon.textContent = getWeatherIcon(targetForecast.icon);
              if (hourlyTitle) hourlyTitle.textContent = `Dự báo ${targetForecast.day} (${targetForecast.date}) · ${data.name.split('(')[0].trim()}`;
            }
          });
        });
      }
    }

    districtSelect.addEventListener('change', (e) => {
      renderWeather(e.target.value);
    });

    renderWeather('huong-hoa');
  }

  // Bottom Green Bar Navigation Link
  function setupHagiangNavLinks() {
    const bottomBarBtn = document.getElementById('bottom-bar-zone-btn');
    if (bottomBarBtn) {
      bottomBarBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const zonesSec = document.getElementById('cung-duong');
        if (zonesSec) zonesSec.scrollIntoView({ behavior: 'smooth' });
      });
    }

    const headerNotebookLink = document.getElementById('header-notebook-link');
    const mobileNotebookTrigger = document.getElementById('mobile-notebook-trigger');
    if (headerNotebookLink) headerNotebookLink.addEventListener('click', openNotebookDrawer);
    if (mobileNotebookTrigger) mobileNotebookTrigger.addEventListener('click', openNotebookDrawer);

    // Dynamic header opacity & frosted glass on scroll
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
          siteHeader.classList.add('scrolled');
        } else {
          siteHeader.classList.remove('scrolled');
        }
      }, { passive: true });
    }
  }

  // =========================================================================
  // Render Zones (QT-01 -> QT-08)
  // =========================================================================
  function renderZones() {
    if (!zonesContainer) return;
    zonesContainer.innerHTML = QUANGTRI_DATA.zones.map(zone => `
      <div class="zone-card" data-zone-code="${zone.code}">
        <div class="zone-card-media">
          <img src="${zone.heroImage}" alt="${zone.name}" loading="lazy" />
          <span class="zone-code-badge">${zone.code}</span>
          <span class="zone-count-badge">${zone.featuredCount}</span>
        </div>
        <div class="zone-card-body">
          <h3 class="zone-card-title">${zone.name}</h3>
          <p class="zone-card-tagline">${zone.tagline}</p>
          <p class="zone-card-desc">${zone.description}</p>
          <div class="zone-card-footer">
            <span>Xem các điểm đến</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>
      </div>
    `).join('');

    // Click zone card to filter places and highlight map
    document.querySelectorAll('.zone-card').forEach(card => {
      card.addEventListener('click', () => {
        const zoneCode = card.getAttribute('data-zone-code');
        filterByZone(zoneCode);
        if (typeof focusMapZone === 'function') focusMapZone(zoneCode);
        const placesSec = document.getElementById('diem-den');
        if (placesSec) placesSec.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // =========================================================================
  // Render Places with Filters & Search
  // =========================================================================
  function renderPlaces() {
    if (!placesContainer) return;

    let filtered = QUANGTRI_DATA.places;

    // Filter by Category
    if (state.activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === state.activeCategory);
    }

    // Filter by Zone
    if (state.activeZone !== 'all') {
      filtered = filtered.filter(p => p.zoneCode === state.activeZone);
    }

    // Filter by Search Query
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.zoneName.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      placesContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <svg style="margin: 0 auto 1rem; width: 48px; height: 48px; stroke: var(--text-light);" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">Không tìm thấy điểm đến phù hợp</h3>
          <p>Thử tìm kiếm với từ khóa khác như "Hiền Lương", "Sa Mù", "Tà Cơn", hoặc xóa bộ lọc.</p>
          <button id="reset-filter-btn" style="margin-top: 1rem; padding: 0.5rem 1.25rem; background: var(--primary); color: white; border-radius: var(--radius-full); font-weight: 700;">Xem tất cả địa điểm</button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-filter-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.activeCategory = 'all';
          state.activeZone = 'all';
          state.searchQuery = '';
          searchInputs.forEach(input => input.value = '');
          updateCategoryFilterButtons();
          renderPlaces();
        });
      }
      return;
    }

    placesContainer.innerHTML = filtered.map(place => {
      const isSaved = state.bookmarks.includes(place.id);
      return `
        <div class="place-card" data-place-id="${place.id}">
          <div class="place-card-media">
            <img src="${place.image}" alt="${place.name}" loading="lazy" />
            <span class="place-category-badge">${place.categoryName}</span>
            <button class="bookmark-btn ${isSaved ? 'saved' : ''}" data-place-id="${place.id}" title="${isSaved ? 'Bỏ lưu' : 'Lưu vào sổ tay'}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </button>
          </div>
          <div class="place-card-body">
            <div class="place-zone-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              ${place.zoneCode} · ${place.zoneName}
            </div>
            <h3 class="place-card-title">${place.name}</h3>
            <p class="place-card-desc">${place.shortDesc}</p>
            <div class="place-card-meta">
              <div class="place-rating">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span>${place.rating}</span>
                <span style="color: var(--text-light); font-weight: 400;">(${place.reviewsCount})</span>
              </div>
              <button class="detail-btn" data-place-id="${place.id}">
                <span>Khám phá</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach click listeners for modal & bookmarking
    document.querySelectorAll('.detail-btn, .place-card-title').forEach(el => {
      el.addEventListener('click', (e) => {
        const card = el.closest('.place-card');
        const id = card.getAttribute('data-place-id');
        openDetailModal(id);
      });
    });

    document.querySelectorAll('.bookmark-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-place-id');
        toggleBookmark(id);
      });
    });
  }

  function filterByZone(zoneCode) {
    state.activeZone = zoneCode;
    const zoneBanner = document.getElementById('zone-filter-banner');
    if (zoneBanner) {
      if (zoneCode === 'all') {
        zoneBanner.style.display = 'none';
      } else {
        const zoneObj = QUANGTRI_DATA.zones.find(z => z.code === zoneCode);
        zoneBanner.style.display = 'flex';
        zoneBanner.innerHTML = `
          <span>Đang lọc theo vùng: <strong>${zoneObj ? zoneObj.code + ' - ' + zoneObj.name : zoneCode}</strong></span>
          <button id="clear-zone-filter" style="margin-left: 1rem; color: var(--primary); font-weight: 700;">Hủy lọc vùng ✕</button>
        `;
        document.getElementById('clear-zone-filter').addEventListener('click', () => {
          state.activeZone = 'all';
          zoneBanner.style.display = 'none';
          renderPlaces();
        });
      }
    }
    renderPlaces();
  }

  function updateCategoryFilterButtons() {
    categoryFilterBtns.forEach(btn => {
      const cat = btn.getAttribute('data-category');
      btn.classList.toggle('active', cat === state.activeCategory);
    });
  }

  // Category filter clicks
  categoryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeCategory = btn.getAttribute('data-category');
      updateCategoryFilterButtons();
      renderPlaces();
    });
  });

  // Search input listeners
  searchInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      // Sync other search inputs if any
      searchInputs.forEach(other => {
        if (other !== input) other.value = e.target.value;
      });
      renderPlaces();
    });
  });

  // Quick tag chips in hero
  document.querySelectorAll('.quick-tag-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const tag = chip.getAttribute('data-tag');
      searchInputs.forEach(input => input.value = tag);
      state.searchQuery = tag;
      renderPlaces();
      const placesSec = document.getElementById('diem-den');
      if (placesSec) placesSec.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // =========================================================================
  // Render Food & Culinary
  // =========================================================================
  function renderFood() {
    if (!foodContainer) return;
    foodContainer.innerHTML = QUANGTRI_DATA.foods.map(food => `
      <div class="food-card">
        <div class="food-media">
          <img src="${food.image}" alt="${food.name}" loading="lazy" />
          <span class="food-price-badge">${food.priceRange}</span>
        </div>
        <div class="food-body">
          <h3 class="food-title">${food.name}</h3>
          <p class="food-origin">${food.type} · ${food.origin}</p>
          <p class="food-desc">${food.description}</p>
          <div class="food-taste-box">
            "${food.tasteNotes}"
          </div>
          <div class="food-recs-title">Địa chỉ gợi ý:</div>
          <ul class="food-recs-list">
            ${food.addressRecs.map(addr => `<li>📍 ${addr}</li>`).join('')}
          </ul>
        </div>
      </div>
    `).join('');
  }

  // =========================================================================
  // Render Itineraries (Lịch trình)
  // =========================================================================
  function renderItineraries() {
    if (!itineraryTabsContainer || !itineraryContentContainer) return;

    // Tabs
    itineraryTabsContainer.innerHTML = QUANGTRI_DATA.itineraries.map(it => `
      <button class="itinerary-tab-btn ${it.id === state.selectedItinerary ? 'active' : ''}" data-itinerary-id="${it.id}">
        <span class="tab-badge">${it.duration}</span>
        <div class="tab-title">${it.title}</div>
      </button>
    `).join('');

    // Tab buttons click
    document.querySelectorAll('.itinerary-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectedItinerary = btn.getAttribute('data-itinerary-id');
        renderItineraries();
      });
    });

    // Content of selected itinerary
    const current = QUANGTRI_DATA.itineraries.find(it => it.id === state.selectedItinerary) || QUANGTRI_DATA.itineraries[0];
    itineraryContentContainer.innerHTML = `
      <div class="itinerary-detail-card">
        <div class="itinerary-header">
          <div>
            <span class="tab-badge">${current.duration}</span>
            <h3 style="font-size: 1.5rem; font-weight: 800; margin: 0.35rem 0 0.5rem;">${current.title}</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem;">${current.highlight}</p>
            <div class="itinerary-meta-chips">
              <span class="meta-chip">📏 Quãng đường: ${current.distance}</span>
              <span class="meta-chip">👥 Phù hợp: ${current.suitability}</span>
            </div>
          </div>
        </div>

        <div class="timeline-list">
          ${current.steps.map(step => `
            <div class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-time">${step.time}</div>
              <h4 class="timeline-title">${step.name}</h4>
              <p class="timeline-desc">${step.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // Interactive Real Map Explorer (Google Maps Tiles & Leaflet Engine)
  // =========================================================================
  let travelMap = null;
  let currentMapMarkers = [];
  let mapPolylines = {};

  const ZONE_CENTERS = {
    "all": { center: [16.78, 106.98], zoom: 10, name: "Toàn cảnh tỉnh Quảng Trị" },
    "QT-01": { center: [16.805, 107.09], zoom: 13, name: "Đông Hà & Vùng Trung Tâm" },
    "QT-02": { center: [16.753, 107.19], zoom: 13, name: "Thị Xã Quảng Trị & Thành Cổ" },
    "QT-03": { center: [17.020, 107.10], zoom: 12, name: "Vĩnh Linh & Vĩ Tuyến 17" },
    "QT-04": { center: [16.897, 107.18], zoom: 12, name: "Gio Linh & Cửa Việt" },
    "QT-05": { center: [16.720, 106.65], zoom: 11, name: "Hướng Hóa & Khe Sanh (Đèo Sa Mù)" },
    "QT-06": { center: [16.635, 106.90], zoom: 12, name: "Đakrông & Đường Hồ Chí Minh" },
    "QT-07": { center: [17.161, 107.33], zoom: 13, name: "Huyện Đảo Cồn Cỏ" },
    "QT-08": { center: [16.785, 107.03], zoom: 12, name: "Cam Lộ & Tân Sở" }
  };

  function parseCoordinates(coordStr) {
    if (!coordStr) return null;
    const match = coordStr.match(/([\d\.]+).*N.*([\d\.]+).*E/);
    if (match) {
      return [parseFloat(match[1]), parseFloat(match[2])];
    }
    return null;
  }

  function getCategoryPinClass(category, zoneCode) {
    if (zoneCode === 'QT-07') return 'pin-island';
    switch (category) {
      case 'history': return 'pin-history';
      case 'adventure': return 'pin-adventure';
      case 'nature': return 'pin-nature';
      case 'culture': return 'pin-culture';
      default: return 'pin-history';
    }
  }

  function setupRealTravelMap() {
    const mapElement = document.getElementById('real-travel-map');
    if (!mapElement) return;

    // Fallback if Leaflet CDN is offline
    if (typeof L === 'undefined') {
      mapElement.innerHTML = `
        <div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #e2e8f0; padding: 2rem; text-align: center;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#133e2f" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
          <h3 style="margin-top: 1rem; color: #133e2f; font-weight: 800;">Bản Đồ Google Maps Quảng Trị</h3>
          <p style="color: #64748b; font-size: 0.88rem; margin: 0.5rem 0 1rem; max-width: 420px;">
            Đang tải dữ liệu vệ tinh và địa hình trực tuyến của Google Maps...
          </p>
          <a href="https://www.google.com/maps/place/Qu%E1%BA%A3ng+Tr%E1%BB%8B,+Vi%E1%BB%87t+Nam" target="_blank" rel="noopener noreferrer" style="padding: 0.6rem 1.4rem; background: #133e2f; color: white; border-radius: 9999px; font-size: 0.85rem; font-weight: 700; display: inline-flex; align-items: center; gap: 0.4rem;">
            Mở Google Maps toàn màn hình ↗
          </a>
        </div>
      `;
      return;
    }

    // 1. Tile Layers: Google Maps & Du lịch
    const googleRoad = L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20,
      attribution: '&copy; Google Maps'
    });

    const googleTerrain = L.tileLayer('https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20,
      attribution: '&copy; Google Maps Terrain'
    });

    const googleHybrid = L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20,
      attribution: '&copy; Google Maps Satellite'
    });

    const cartoVoyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap, &copy; CARTO'
    });

    // 2. Khởi tạo bản đồ
    travelMap = L.map('real-travel-map', {
      center: ZONE_CENTERS.all.center,
      zoom: ZONE_CENTERS.all.zoom,
      layers: [googleRoad],
      zoomControl: false
    });

    L.control.zoom({ position: 'topleft' }).addTo(travelMap);

    const baseMaps = {
      "🗺️ Google Bản Đồ": googleRoad,
      "🏞️ Google Địa Hình 3D": googleTerrain,
      "🛰️ Google Vệ Tinh": googleHybrid,
      "🌿 Phong Cách Travel Kem": cartoVoyager
    };
    L.control.layers(baseMaps, null, { position: 'topright', collapsed: false }).addTo(travelMap);

    // 3. Vẽ 4 Tuyến đường Di Sản & Khám Phá
    const dmzCoords = [
      [16.7533, 107.1912], // Thành Cổ Quảng Trị
      [16.8050, 107.0900], // TP Đông Hà
      [16.9240, 107.0500], // Dốc Miếu
      [17.0019, 107.0984], // Cầu Hiền Lương
      [17.0210, 107.1260], // Cửa Tùng
      [17.0427, 107.1147], // Vịnh Mốc
      [17.0678, 107.1356]  // Mũi Trèo
    ];
    mapPolylines.dmz = L.polyline(dmzCoords, {
      color: '#dc2626',
      weight: 4.5,
      opacity: 0.85,
      dashArray: '8, 6'
    }).addTo(travelMap).bindTooltip("Tuyến Di Sản DMZ & Vĩ Tuyến 17", { sticky: true });

    const truongSonCoords = [
      [16.6345, 106.9012], // Cầu treo Đakrông
      [16.6200, 106.7320], // TT Khe Sanh
      [16.6534, 106.7118], // Sân bay Tà Cơn
      [16.7011, 106.7456], // Điện gió Hướng Linh
      [16.7329, 106.6025], // Thác Chênh Vênh
      [16.7820, 106.5821]  // Đèo Sa Mù
    ];
    mapPolylines.truongson = L.polyline(truongSonCoords, {
      color: '#059669',
      weight: 4.5,
      opacity: 0.85
    }).addTo(travelMap).bindTooltip("Cung Đường Phượt Tây Trường Sơn & Đèo Sa Mù", { sticky: true });

    const ql9Coords = [
      [16.8050, 107.0900], // Đông Hà
      [16.7845, 107.0312], // Cam Lộ
      [16.6345, 106.9012], // Cầu treo Đakrông
      [16.6200, 106.7320], // Khe Sanh
      [16.6180, 106.5900]  // Cửa khẩu Quốc tế Lao Bảo
    ];
    mapPolylines.ql9 = L.polyline(ql9Coords, {
      color: '#d97706',
      weight: 4,
      opacity: 0.8,
      dashArray: '6, 6'
    }).addTo(travelMap).bindTooltip("Quốc Lộ 9: Hành Lang Xuyên Á", { sticky: true });

    const concoCoords = [
      [16.8972, 107.1864], // Cảng Cửa Việt
      [17.0210, 107.1260], // Cửa Tùng
      [17.1611, 107.3333]  // Đảo Cồn Cỏ
    ];
    mapPolylines.conco = L.polyline(concoCoords, {
      color: '#0284c7',
      weight: 3.5,
      opacity: 0.85,
      dashArray: '5, 8'
    }).addTo(travelMap).bindTooltip("Tuyến Hải Trình Ra Đảo Cồn Cỏ", { sticky: true });

    // 4. Render Markers cho 14 điểm đến
    const places = QUANGTRI_DATA.places || [];
    currentMapMarkers = [];

    places.forEach((place, index) => {
      const coords = parseCoordinates(place.coordinates);
      if (!coords) return;

      const pinClass = getCategoryPinClass(place.category, place.zoneCode);
      const pinText = place.zoneCode ? place.zoneCode.replace('QT-', '') : `0${index + 1}`;

      const customIcon = L.divIcon({
        className: 'qt-leaflet-marker-wrap',
        html: `
          <div class="qt-custom-pin ${pinClass}" data-place-id="${place.id}" title="${place.name}">
            <span class="qt-pin-inner">${pinText}</span>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -32]
      });

      const marker = L.marker(coords, { icon: customIcon }).addTo(travelMap);

      const googleNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords[0]},${coords[1]}`;
      const popupHtml = `
        <div class="map-popup-card">
          <img class="map-popup-img" src="${place.image}" alt="${place.name}" loading="lazy" />
          <div class="map-popup-body">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
              <span class="map-popup-tag">${place.zoneCode} · ${place.categoryName}</span>
              <span style="font-size: 0.75rem; font-weight: 700; color: #d97706;">⭐ ${place.rating}</span>
            </div>
            <h4 class="map-popup-title">${place.name}</h4>
            <p class="map-popup-desc">${place.shortDesc}</p>
            <div class="map-popup-actions">
              <a href="${googleNavUrl}" target="_blank" rel="noopener noreferrer" class="map-popup-btn" title="Mở bản đồ Google Maps chỉ đường">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                <span>Chỉ đường</span>
              </a>
              <button class="map-popup-btn map-popup-btn-outline" onclick="window.viewPlaceDetails('${place.id}')">
                Chi tiết
              </button>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 280 });

      marker.on('click', () => {
        updateSidePanelWithPlace(place);
      });

      currentMapMarkers.push({ marker, place, coords });
    });

    // 5. Setup Quick Route Buttons & Side Panel Actions
    setupMapControls();
  }

  function updateSidePanelWithPlace(place) {
    const titleEl = document.getElementById('side-panel-title');
    const tagEl = document.getElementById('side-panel-tagline');
    const descEl = document.getElementById('side-panel-desc');
    const gmapBtn = document.getElementById('side-panel-gmap-btn');

    if (titleEl) titleEl.textContent = place.name;
    if (tagEl) tagEl.textContent = `${place.zoneCode} · ${place.categoryName} · ⭐ ${place.rating}`;
    if (descEl) descEl.textContent = place.shortDesc;

    if (gmapBtn) {
      const coords = parseCoordinates(place.coordinates);
      if (coords) {
        gmapBtn.href = `https://www.google.com/maps/search/?api=1&query=${coords[0]},${coords[1]}`;
      } else {
        gmapBtn.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' Quảng Trị')}`;
      }
    }
  }

  function setupMapControls() {
    // Quick Map Pills
    const pills = document.querySelectorAll('.map-pill-btn');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const viewKey = pill.getAttribute('data-view');
        focusMapZone(viewKey);
      });
    });

    // Route Buttons in Side Panel
    const routeDMZ = document.getElementById('route-btn-dmz');
    const routeTS = document.getElementById('route-btn-truongson');
    const routeQL9 = document.getElementById('route-btn-ql9');
    const routeCC = document.getElementById('route-btn-conco');

    if (routeDMZ) {
      routeDMZ.addEventListener('click', () => {
        focusMapZone('QT-03');
        if (mapPolylines.dmz) mapPolylines.dmz.openTooltip();
      });
    }

    if (routeTS) {
      routeTS.addEventListener('click', () => {
        focusMapZone('QT-05');
        if (mapPolylines.truongson) mapPolylines.truongson.openTooltip();
      });
    }

    if (routeQL9) {
      routeQL9.addEventListener('click', () => {
        if (travelMap) travelMap.flyTo([16.71, 106.85], 11, { duration: 1.2 });
        if (mapPolylines.ql9) mapPolylines.ql9.openTooltip();
      });
    }

    if (routeCC) {
      routeCC.addEventListener('click', () => {
        focusMapZone('QT-07');
        if (mapPolylines.conco) mapPolylines.conco.openTooltip();
      });
    }

    // Default button in side panel to scroll to places
    const defaultBtn = document.getElementById('view-zone-default-btn');
    if (defaultBtn) {
      defaultBtn.addEventListener('click', () => {
        const placesSec = document.getElementById('diem-den');
        if (placesSec) placesSec.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  function focusMapZone(zoneKey) {
    if (!travelMap) return;
    const target = ZONE_CENTERS[zoneKey] || ZONE_CENTERS.all;
    travelMap.flyTo(target.center, target.zoom, { duration: 1.2 });

    // Open first marker of this zone if specific zone selected
    if (zoneKey !== 'all') {
      const match = currentMapMarkers.find(m => m.place.zoneCode === zoneKey);
      if (match) {
        match.marker.openPopup();
        updateSidePanelWithPlace(match.place);
      }
    }
  }

  // Expose global helper for popup detail button
  window.viewPlaceDetails = function(placeId) {
    openDetailModal(placeId);
  };

  // =========================================================================
  // Detail Modal for Places
  // =========================================================================
  function openDetailModal(placeId) {
    const place = QUANGTRI_DATA.places.find(p => p.id === placeId);
    if (!place || !detailModalOverlay) return;

    const modalBody = document.getElementById('detail-modal-body');
    const isSaved = state.bookmarks.includes(place.id);

    modalBody.innerHTML = `
      <div class="modal-media">
        <img src="${place.image}" alt="${place.name}" />
        <span class="place-category-badge" style="top: 1rem; left: 1rem;">${place.categoryName}</span>
      </div>
      <div class="modal-content-body">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
          <div class="place-zone-tag" style="margin: 0;">
            📍 ${place.zoneCode} · ${place.zoneName}
          </div>
          <button class="bookmark-btn ${isSaved ? 'saved' : ''}" id="modal-bookmark-btn" data-place-id="${place.id}" style="position: static;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
        <h2 style="font-size: 1.75rem; font-weight: 900; margin-bottom: 0.75rem; line-height: 1.25;">${place.name}</h2>
        <p style="font-size: 0.95rem; color: var(--text-main); line-height: 1.6; margin-bottom: 1.25rem;">${place.fullDesc}</p>

        <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--primary); text-transform: uppercase; margin-top: 1rem;">Trải nghiệm nổi bật</h4>
        <ul class="modal-highlights-list">
          ${place.highlights.map(h => `<li>✨ ${h}</li>`).join('')}
        </ul>

        <div class="modal-info-grid">
          <div>
            <strong>🎟️ Vé tham quan:</strong>
            <div style="color: var(--text-muted); margin-top: 0.2rem;">${place.ticket}</div>
          </div>
          <div>
            <strong>⏰ Giờ mở cửa:</strong>
            <div style="color: var(--text-muted); margin-top: 0.2rem;">${place.openHours}</div>
          </div>
          <div>
            <strong>📍 Địa chỉ & Tọa độ:</strong>
            <div style="color: var(--text-muted); margin-top: 0.2rem;">${place.address} (${place.coordinates})</div>
          </div>
          <div>
            <strong>💡 Lưu ý cẩm nang:</strong>
            <div style="color: var(--text-muted); margin-top: 0.2rem;">${place.tips}</div>
          </div>
        </div>
      </div>
    `;

    const bookmarkBtn = document.getElementById('modal-bookmark-btn');
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener('click', () => {
        toggleBookmark(place.id);
        const nowSaved = state.bookmarks.includes(place.id);
        bookmarkBtn.classList.toggle('saved', nowSaved);
        bookmarkBtn.querySelector('svg').setAttribute('fill', nowSaved ? 'currentColor' : 'none');
      });
    }

    detailModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDetailModal() {
    if (!detailModalOverlay) return;
    detailModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeDetailModal);
  if (detailModalOverlay) {
    detailModalOverlay.addEventListener('click', (e) => {
      if (e.target === detailModalOverlay) closeDetailModal();
    });
  }

  // =========================================================================
  // Trip Notebook ("Sổ tay của tôi")
  // =========================================================================
  function toggleBookmark(placeId) {
    const idx = state.bookmarks.indexOf(placeId);
    if (idx > -1) {
      state.bookmarks.splice(idx, 1);
    } else {
      state.bookmarks.push(placeId);
    }
    localStorage.setItem('qt_bookmarks', JSON.stringify(state.bookmarks));
    updateBookmarkBadge();
    renderPlaces();
    renderSavedPlacesInDrawer();
  }

  function updateBookmarkBadge() {
    if (!bookmarkCountBadge) return;
    bookmarkCountBadge.textContent = state.bookmarks.length;
    bookmarkCountBadge.style.display = state.bookmarks.length > 0 ? 'flex' : 'none';
  }

  function renderSavedPlacesInDrawer() {
    const container = document.getElementById('saved-places-container');
    if (!container) return;

    if (state.bookmarks.length === 0) {
      container.innerHTML = `
        <p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 1.5rem 0;">
          Chưa có địa điểm nào được lưu.<br>Bấm vào biểu tượng bookmark 🔖 ở các địa điểm để gom vào sổ tay của bạn!
        </p>
      `;
      return;
    }

    const savedPlaces = QUANGTRI_DATA.places.filter(p => state.bookmarks.includes(p.id));
    container.innerHTML = savedPlaces.map(p => `
      <div class="saved-place-item">
        <div>
          <div class="saved-place-name">${p.name}</div>
          <div class="saved-place-zone">${p.zoneCode} · ${p.zoneName}</div>
        </div>
        <button class="remove-saved-btn" data-place-id="${p.id}" style="color: var(--text-light); font-size: 1.1rem; padding: 0.25rem;" title="Xóa khỏi sổ tay">✕</button>
      </div>
    `).join('');

    container.querySelectorAll('.remove-saved-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-place-id');
        toggleBookmark(id);
      });
    });
  }

  // Budget Calculator logic
  function setupBudgetCalculator() {
    const daysInput = document.getElementById('calc-days');
    const peopleInput = document.getElementById('calc-people');
    const gasInput = document.getElementById('calc-gas');
    const hotelInput = document.getElementById('calc-hotel');
    const foodInput = document.getElementById('calc-food');
    const totalEl = document.getElementById('calc-total-val');
    const perPersonEl = document.getElementById('calc-per-person');

    function calculate() {
      const days = parseInt(daysInput.value) || 1;
      const people = parseInt(peopleInput.value) || 1;
      const gas = parseInt(gasInput.value) || 0;
      const hotel = parseInt(hotelInput.value) || 0;
      const food = parseInt(foodInput.value) || 0;

      // Hotel per room (assuming 2 persons per room)
      const rooms = Math.ceil(people / 2);
      const totalHotel = (days - 1) * rooms * hotel;
      const totalFood = days * people * food;
      const totalGas = Math.ceil(people / 2) * gas; // 1 motorbike per 2 people
      const total = totalHotel + totalFood + totalGas;
      const perPerson = Math.round(total / people);

      totalEl.textContent = total.toLocaleString('vi-VN') + ' đ';
      perPersonEl.textContent = 'Khoảng ' + perPerson.toLocaleString('vi-VN') + ' đ / người';
    }

    [daysInput, peopleInput, gasInput, hotelInput, foodInput].forEach(inp => {
      if (inp) inp.addEventListener('input', calculate);
    });

    calculate();
  }

  // Offline Notes Box
  const notesArea = document.getElementById('trip-notes-textarea');
  if (notesArea) {
    notesArea.value = state.notes;
    notesArea.addEventListener('input', (e) => {
      state.notes = e.target.value;
      localStorage.setItem('qt_notes', state.notes);
    });
  }

  // Checklist packing list
  function renderChecklist() {
    const listEl = document.getElementById('packing-checklist-items');
    if (!listEl) return;

    listEl.innerHTML = QUANGTRI_DATA.guides.packingChecklist.map((item, index) => {
      const isChecked = !!state.checklist[index];
      return `
        <label style="display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.85rem; cursor: pointer; user-select: none;">
          <input type="checkbox" data-index="${index}" ${isChecked ? 'checked' : ''} style="margin-top: 0.2rem; accent-color: var(--primary);" />
          <span style="${isChecked ? 'text-decoration: line-through; color: var(--text-light);' : ''}">${item}</span>
        </label>
      `;
    }).join('');

    listEl.querySelectorAll('input[type="checkbox"]').forEach(box => {
      box.addEventListener('change', (e) => {
        const idx = e.target.getAttribute('data-index');
        state.checklist[idx] = e.target.checked;
        localStorage.setItem('qt_checklist', JSON.stringify(state.checklist));
        renderChecklist();
      });
    });
  }

  // Open/Close Drawer
  function openNotebookDrawer() {
    if (!notebookOverlay) return;
    renderSavedPlacesInDrawer();
    notebookOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeNotebookDrawer() {
    if (!notebookOverlay) return;
    notebookOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (notebookToggleBtn) notebookToggleBtn.addEventListener('click', openNotebookDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeNotebookDrawer);
  if (notebookOverlay) {
    notebookOverlay.addEventListener('click', (e) => {
      if (e.target === notebookOverlay) closeNotebookDrawer();
    });
  }

  // Hotlines & Utilities
  function renderUtilities() {
    const hotlineContainer = document.getElementById('hotlines-list');
    const gasContainer = document.getElementById('gas-stations-list');

    if (hotlineContainer) {
      hotlineContainer.innerHTML = QUANGTRI_DATA.guides.emergencyHotlines.map(h => `
        <div class="hotline-item">
          <div>
            <div class="hotline-name">${h.name}</div>
            <div class="hotline-note">${h.note}</div>
          </div>
          <a href="tel:${h.phone.replace(/[^0-9]/g, '')}" class="hotline-number">📞 ${h.phone}</a>
        </div>
      `).join('');
    }

    if (gasContainer) {
      gasContainer.innerHTML = QUANGTRI_DATA.guides.gasStations.map(g => `
        <div class="hotline-item">
          <div>
            <div class="hotline-name">${g.name}</div>
            <div class="hotline-note">📍 ${g.route} · <em>${g.tip}</em></div>
          </div>
        </div>
      `).join('');
    }
  }

  // =========================================================================
  // Local Services & Verified Partners (Monetization & Lead Generation)
  // =========================================================================
  let activeServiceCategory = 'all';

  function renderServices() {
    const servicesContainer = document.getElementById('services-container');
    if (!servicesContainer) return;

    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        const services = (data && data.services) ? data.services : (QUANGTRI_DATA.services || []);
        displayServices(services);
      })
      .catch(() => {
        displayServices(QUANGTRI_DATA.services || []);
      });
  }

  function displayServices(services) {
    const servicesContainer = document.getElementById('services-container');
    if (!servicesContainer) return;

    let filtered = services;
    if (activeServiceCategory !== 'all') {
      filtered = filtered.filter(s => s.category === activeServiceCategory);
    }

    if (filtered.length === 0) {
      servicesContainer.innerHTML = `
        <div style="grid-column: 1 / -1; background: var(--bg-card); padding: 3rem; text-align: center; border-radius: var(--radius-lg); border: 1px dashed var(--border);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🤝</div>
          <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-title); margin-bottom: 0.25rem;">Chưa có cơ sở dịch vụ nào trong mục này</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">Bạn là chủ cơ sở homestay, xe máy hoặc tour guide tại Quảng Trị?</p>
          <button onclick="document.getElementById('open-partner-reg-btn').click()" style="padding: 0.6rem 1.4rem; background: var(--primary); color: white; border-radius: 9999px; font-weight: 700; font-size: 0.85rem; border: none; cursor: pointer;">
            + Đăng ký đưa cơ sở lên web ngay
          </button>
        </div>
      `;
      return;
    }

    servicesContainer.innerHTML = filtered.map(item => `
      <div class="service-card" data-service-id="${item.id}">
        <div class="service-card-media">
          <img src="${item.image}" alt="${item.name}" loading="lazy" />
          ${item.verified ? `<span class="service-badge-verified">✓ ${item.badge || 'Bảo chứng uy tín'}</span>` : ''}
        </div>
        <div class="service-card-body">
          <span class="service-card-category">${item.categoryName} · ${item.zoneCode}</span>
          <h3 class="service-card-title">${item.name}</h3>
          <div class="service-card-address">
            <span>📍</span>
            <span>${item.address}</span>
          </div>
          <div class="service-price-tag">${item.price}</div>
          <ul class="service-highlights-list">
            ${(item.highlights || []).map(h => `<li>${h}</li>`).join('')}
          </ul>
          <div class="service-card-actions">
            <a href="tel:${(item.phone || '').replace(/\s+/g, '')}" class="service-btn-call" data-service-id="${item.id}" data-service-name="${item.name}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>Gọi Hotline</span>
            </a>
            <a href="https://zalo.me/${(item.zalo || item.phone || '').replace(/\s+/g, '')}" target="_blank" rel="noopener noreferrer" class="service-btn-zalo" data-service-id="${item.id}" data-service-name="${item.name}">
              <span>Nhắn Zalo</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </a>
          </div>
        </div>
      </div>
    `).join('');

    // Lead Tracking for Monetization (Ghi nhận lượt click tạo doanh thu)
    servicesContainer.querySelectorAll('.service-btn-call, .service-btn-zalo').forEach(btn => {
      btn.addEventListener('click', () => {
        const serviceId = btn.getAttribute('data-service-id');
        const serviceName = btn.getAttribute('data-service-name');
        const type = btn.classList.contains('service-btn-call') ? 'click_call_hotline' : 'click_open_zalo';

        fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, partnerId: serviceId, partnerName: serviceName, source: 'service_card' })
        }).catch(() => {});
      });
    });
  }

  function setupServiceFilters() {
    const pills = document.querySelectorAll('.service-filter-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeServiceCategory = pill.getAttribute('data-category');
        renderServices();
      });
    });
  }

  function setupPartnerRegistrationModal() {
    const openBtn = document.getElementById('open-partner-reg-btn');
    const modalOverlay = document.getElementById('partner-reg-modal-overlay');
    const closeBtn = document.getElementById('close-partner-modal-btn');
    const cancelBtn = document.getElementById('cancel-partner-modal-btn');
    const form = document.getElementById('partner-reg-form');

    function openModal() {
      if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeModal() {
      if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const businessName = document.getElementById('reg-business-name').value.trim();
        const category = document.getElementById('reg-category').value;
        const categoryName = document.getElementById('reg-category').options[document.getElementById('reg-category').selectedIndex].text;
        const zoneCode = document.getElementById('reg-zone').value;
        const phone = document.getElementById('reg-phone').value.trim();
        const zalo = document.getElementById('reg-zalo').value.trim();
        const address = document.getElementById('reg-address').value.trim();
        const priceRange = document.getElementById('reg-price').value.trim();
        const description = document.getElementById('reg-desc').value.trim();

        fetch('/api/partners/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessName, category, categoryName, zoneCode, phone, zalo, address, priceRange, description
          })
        })
        .then(res => res.json())
        .then(data => {
          alert(data.message || 'Gửi hồ sơ thành công! Đội ngũ QuangTri.wiki sẽ liên hệ bạn.');
          form.reset();
          closeModal();
        })
        .catch(() => {
          alert('Hồ sơ đã được gửi thành công! Đội ngũ QuangTri.wiki sẽ liên hệ bạn.');
          form.reset();
          closeModal();
        });
      });
    }
  }

  function setupAdminMetricsModal() {
    const openBtn = document.getElementById('open-admin-metrics-btn');
    const modalOverlay = document.getElementById('admin-metrics-modal-overlay');
    const closeBtn = document.getElementById('close-admin-metrics-btn');

    function openModal() {
      if (modalOverlay) {
        fetch('/api/admin/metrics')
          .then(res => res.json())
          .then(data => {
            if (data && data.metrics) {
              const m = data.metrics;
              const elPartners = document.getElementById('metric-partners-count');
              const elReg = document.getElementById('metric-registrations-count');
              const elLeads = document.getElementById('metric-leads-count');
              const elRev = document.getElementById('metric-revenue-estimate');

              if (elPartners) elPartners.textContent = m.totalPartners;
              if (elReg) elReg.textContent = m.totalRegistrations;
              if (elLeads) elLeads.textContent = m.totalLeads;
              if (elRev) elRev.textContent = m.estimatedRevenue;
            }
          })
          .catch(() => {});

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeModal() {
      if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
      });
    }
  }

  // =========================================================================
  // Community Forum & Experiences ("Diễn Đàn Chia Sẻ")
  // =========================================================================
  function setupCommunityForum() {
    const feedContainer = document.getElementById('forum-threads-feed');
    const filterPills = document.querySelectorAll('.forum-filter-pill');
    const openModalBtn = document.getElementById('open-create-thread-btn');
    const modalOverlay = document.getElementById('create-thread-modal-overlay');
    const closeModalBtn = document.getElementById('close-thread-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-thread-modal-btn');
    const createForm = document.getElementById('create-thread-form');

    if (!feedContainer) return;

    let forumThreads = [];
    let activeForumCategory = 'all';

    // Fetch live threads from Backend REST API (with localStorage fallback)
    function loadThreads() {
      fetch('/api/threads')
        .then(res => res.json())
        .then(data => {
          if (data && data.threads && data.threads.length > 0) {
            forumThreads = data.threads;
          } else {
            forumThreads = JSON.parse(localStorage.getItem('qt_forum_threads')) || QUANGTRI_DATA.forumThreads || [];
          }
          renderThreads();
        })
        .catch(() => {
          forumThreads = JSON.parse(localStorage.getItem('qt_forum_threads')) || QUANGTRI_DATA.forumThreads || [];
          renderThreads();
        });
    }

    function renderThreads() {
      let filtered = forumThreads;
      if (activeForumCategory !== 'all') {
        filtered = filtered.filter(t => t.tag === activeForumCategory);
      }

      if (filtered.length === 0) {
        feedContainer.innerHTML = `
          <div style="background: var(--bg-card); padding: 3rem 2rem; border-radius: var(--radius-lg); text-align: center; border: 1px dashed var(--border);">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📝</div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-title); margin-bottom: 0.35rem;">Chưa có bài viết nào trong chủ đề này</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">Hãy là người đầu tiên chia sẻ cảm nhận hoặc kinh nghiệm của bạn!</p>
            <button onclick="document.getElementById('open-create-thread-btn').click()" style="padding: 0.6rem 1.4rem; background: var(--primary); color: white; border-radius: 9999px; font-weight: 700; font-size: 0.85rem; border: none; cursor: pointer;">
              + Viết bài chia sẻ ngay
            </button>
          </div>
        `;
        return;
      }

      feedContainer.innerHTML = filtered.map(thread => {
        const isLiked = localStorage.getItem(`qt_liked_${thread.id}`) === 'true';
        const likeCount = thread.likes || 0;
        const commentCount = (thread.comments || []).length;
        const galleryImgs = thread.images || [];

        let galleryHtml = '';
        if (galleryImgs.length === 1) {
          galleryHtml = `
            <div class="thread-gallery-grid grid-1">
              <img class="thread-gallery-img" src="${galleryImgs[0]}" alt="${thread.title}" loading="lazy" />
            </div>
          `;
        } else if (galleryImgs.length > 1) {
          galleryHtml = `
            <div class="thread-gallery-grid grid-2">
              ${galleryImgs.map(img => `<img class="thread-gallery-img" src="${img}" alt="${thread.title}" loading="lazy" />`).join('')}
            </div>
          `;
        }

        const commentsHtml = (thread.comments || []).map(c => `
          <div class="comment-item">
            <img class="comment-avatar" src="${c.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}" alt="${c.author}" />
            <div class="comment-bubble">
              <div class="comment-header">
                <span class="comment-author-name">${c.author}</span>
                <span class="comment-time">${c.time || 'Vừa xong'}</span>
              </div>
              <div class="comment-text">${c.text}</div>
            </div>
          </div>
        `).join('');

        return `
          <article class="forum-thread-card" data-thread-id="${thread.id}">
            <div class="thread-header">
              <div class="thread-author-wrap">
                <img class="thread-author-avatar" src="${thread.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}" alt="${thread.author}" />
                <div class="thread-author-info">
                  <div class="thread-author-name-row">
                    <span class="thread-author-name">${thread.author}</span>
                    ${thread.badge ? `<span class="thread-author-badge">${thread.badge}</span>` : ''}
                  </div>
                  <span class="thread-time">${thread.time || 'Gần đây'}</span>
                </div>
              </div>
              <div class="thread-tags-row">
                <span class="thread-pill-tag">${thread.tag}</span>
                <span class="thread-pill-zone">${thread.zoneCode}</span>
              </div>
            </div>

            <h3 class="thread-title">${thread.title}</h3>
            <p class="thread-body-text">${thread.content}</p>

            ${galleryHtml}

            <div class="thread-actions-bar">
              <button class="thread-action-btn like-btn ${isLiked ? 'active' : ''}" data-thread-id="${thread.id}">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="${isLiked ? '#dc2626' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <span>Thích (${likeCount})</span>
              </button>

              <button class="thread-action-btn comment-toggle-btn" data-thread-id="${thread.id}">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span>Bình luận (${commentCount})</span>
              </button>

              <button class="thread-action-btn share-btn" data-thread-id="${thread.id}" title="Sao chép liên kết bài viết">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                <span>Chia sẻ</span>
              </button>
            </div>

            <!-- Comments Box -->
            <div class="thread-comments-section" id="comments-${thread.id}">
              <div class="comments-list">
                ${commentsHtml || '<div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">Chưa có bình luận nào. Hãy gửi câu hỏi hoặc lời nhắn đầu tiên!</div>'}
              </div>
              <form class="comment-form-row" data-thread-id="${thread.id}">
                <input type="text" class="comment-input" placeholder="Viết bình luận hoặc câu hỏi của bạn..." required />
                <button type="submit" class="comment-submit-btn">Gửi</button>
              </form>
            </div>
          </article>
        `;
      }).join('');

      // Attach Event Listeners on Threads
      // 1. Likes
      feedContainer.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const threadId = btn.getAttribute('data-thread-id');
          const thread = forumThreads.find(t => t.id === threadId);
          if (!thread) return;

          const isCurrentlyLiked = localStorage.getItem(`qt_liked_${threadId}`) === 'true';
          if (isCurrentlyLiked) {
            localStorage.removeItem(`qt_liked_${threadId}`);
            thread.likes = Math.max(0, (thread.likes || 1) - 1);
            btn.classList.remove('active');
            btn.querySelector('svg').setAttribute('fill', 'none');
          } else {
            localStorage.setItem(`qt_liked_${threadId}`, 'true');
            thread.likes = (thread.likes || 0) + 1;
            btn.classList.add('active');
            btn.querySelector('svg').setAttribute('fill', '#dc2626');
          }
          btn.querySelector('span').textContent = `Thích (${thread.likes})`;
          localStorage.setItem('qt_forum_threads', JSON.stringify(forumThreads));
        });
      });

      // 2. Toggle Comments Section
      feedContainer.querySelectorAll('.comment-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const threadId = btn.getAttribute('data-thread-id');
          const commentsBox = document.getElementById(`comments-${threadId}`);
          if (commentsBox) {
            commentsBox.classList.toggle('open');
            if (commentsBox.classList.contains('open')) {
              const input = commentsBox.querySelector('.comment-input');
              if (input) input.focus();
            }
          }
        });
      });

      // 3. Share Button
      feedContainer.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          navigator.clipboard.writeText(window.location.href.split('#')[0] + '#dien-dan');
          const span = btn.querySelector('span');
          const oldText = span.textContent;
          span.textContent = 'Đã chép link!';
          setTimeout(() => { span.textContent = oldText; }, 2000);
        });
      });

      // 4. Submit Comment (REST API + Local update)
      feedContainer.querySelectorAll('.comment-form-row').forEach(form => {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const threadId = form.getAttribute('data-thread-id');
          const input = form.querySelector('.comment-input');
          const commentText = input.value.trim();
          if (!commentText) return;

          const thread = forumThreads.find(t => t.id === threadId);
          if (!thread) return;

          const newComment = {
            author: 'Bạn (Du khách)',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
            time: 'Vừa xong',
            text: commentText
          };

          if (!thread.comments) thread.comments = [];
          thread.comments.push(newComment);
          localStorage.setItem('qt_forum_threads', JSON.stringify(forumThreads));
          renderThreads();

          // Sync to backend API
          fetch(`/api/threads/${threadId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author: newComment.author, text: newComment.text })
          }).catch(() => {});

          const targetBox = document.getElementById(`comments-${threadId}`);
          if (targetBox) targetBox.classList.add('open');
        });
      });
    }

    // Category Filter Click
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeForumCategory = pill.getAttribute('data-category');
        renderThreads();
      });
    });

    // Create Thread Modal Handlers
    function openThreadModal() {
      if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeThreadModal() {
      if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    if (openModalBtn) openModalBtn.addEventListener('click', openThreadModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeThreadModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeThreadModal);
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeThreadModal();
      });
    }

    // Submit New Thread (REST API + Local update)
    if (createForm) {
      createForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const author = document.getElementById('thread-author-input').value.trim();
        const tag = document.getElementById('thread-tag-input').value;
        const zoneCode = document.getElementById('thread-zone-input').value;
        const title = document.getElementById('thread-title-input').value.trim();
        const content = document.getElementById('thread-content-input').value.trim();
        const image = document.getElementById('thread-image-input').value.trim();

        if (!author || !title || !content) return;

        const newThreadPayload = {
          author: author,
          tag: tag,
          zoneCode: zoneCode,
          title: title,
          content: content,
          images: image ? [image] : []
        };

        // Post to backend API
        fetch('/api/threads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newThreadPayload)
        })
        .then(res => res.json())
        .then(data => {
          if (data && data.thread) {
            forumThreads.unshift(data.thread);
          } else {
            forumThreads.unshift({
              id: `thread-${Date.now()}`,
              ...newThreadPayload,
              avatar: `https://images.unsplash.com/photo-1535713875002?auto=format&fit=crop&w=150&q=80`,
              badge: 'Thành viên mới',
              time: 'Vừa xong',
              likes: 1,
              comments: []
            });
          }
          localStorage.setItem('qt_forum_threads', JSON.stringify(forumThreads));
          createForm.reset();
          closeThreadModal();
          renderThreads();
        })
        .catch(() => {
          forumThreads.unshift({
            id: `thread-${Date.now()}`,
            ...newThreadPayload,
            avatar: `https://images.unsplash.com/photo-1535713875002?auto=format&fit=crop&w=150&q=80`,
            badge: 'Thành viên mới',
            time: 'Vừa xong',
            likes: 1,
            comments: []
          });
          localStorage.setItem('qt_forum_threads', JSON.stringify(forumThreads));
          createForm.reset();
          closeThreadModal();
          renderThreads();
        });

        // Scroll to forum section
        const forumSec = document.getElementById('dien-dan');
        if (forumSec) forumSec.scrollIntoView({ behavior: 'smooth' });
      });
    }

    loadThreads();
  }

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDetailModal();
      closeNotebookDrawer();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const heroSearch = document.getElementById('hero-search');
      if (heroSearch) {
        heroSearch.focus();
        heroSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavMenu = document.getElementById('mobile-nav-menu');
  if (mobileMenuBtn && mobileNavMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isVisible = mobileNavMenu.style.display === 'flex';
      mobileNavMenu.style.display = isVisible ? 'none' : 'flex';
    });
    // Close mobile nav on link click
    mobileNavMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavMenu.style.display = 'none';
      });
    });
  }

  // Initialize Everything (Hagiang.wiki Style & Components)
  renderHagiangHeroSlider();
  setupWeatherCard();
  setupHagiangNavLinks();
  renderZones();
  renderPlaces();
  renderServices();
  setupServiceFilters();
  setupPartnerRegistrationModal();
  setupAdminMetricsModal();
  renderFood();
  renderItineraries();
  setupRealTravelMap();
  setupCommunityForum();
  setupBudgetCalculator();
  renderChecklist();
  renderUtilities();
  updateBookmarkBadge();
});
