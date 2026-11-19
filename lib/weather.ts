export interface WeatherForecastDay {
  day: string;
  date: string;
  icon: 'sun' | 'partly-cloudy' | 'fog' | 'rain' | 'storm';
  condition: string;
  high: number;
  low: number;
  rain: string;
  windMax?: string;
}

export interface WeatherLocationData {
  key: string;
  name: string;
  region: string;
  source: 'open-meteo' | 'fallback';
  current: {
    condition: string;
    icon: WeatherForecastDay['icon'];
    temp: number;
    rainChance: string;
    rainNote: string;
    humidity: string;
    humidityNote: string;
    wind: string;
    windNote: string;
  };
  tipRain: string;
  tipSleep: string;
  forecast: WeatherForecastDay[];
}

const WEATHER_LOCATIONS = [
  { key: 'huong-hoa', name: 'Hướng Hóa (Đèo Sa Mù)', region: 'VÙNG CAO TRƯỜNG SƠN', lat: 16.69, lon: 106.71, baseHigh: 21, baseLow: 15 },
  { key: 'dong-ha', name: 'TP. Đông Hà · Thành Cổ', region: 'ĐỒNG BẰNG TRUNG TÂM', lat: 16.81, lon: 107.1, baseHigh: 25, baseLow: 19 },
  { key: 'vinh-linh', name: 'Vĩnh Linh & Vịnh Mốc', region: 'VĨ TUYẾN 17 · BỜ BIỂN', lat: 17.07, lon: 107.11, baseHigh: 24, baseLow: 19 },
  { key: 'con-co', name: 'Đảo Tiền Tiêu Cồn Cỏ', region: 'HẢI ĐẢO · 15 HẢI LÝ', lat: 17.16, lon: 107.34, baseHigh: 24, baseLow: 20 },
] as const;

const VN_WEEKDAYS = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

function formatRollingDateInfo(offsetDays: number, isoDate?: string): { day: string; date: string } {
  let d: Date;
  if (isoDate) {
    d = new Date(`${isoDate}T12:00:00+07:00`);
  } else {
    d = new Date(Date.now() + 7 * 3600 * 1000 + offsetDays * 86400 * 1000);
  }
  const dayNum = d.getUTCDay();
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  return {
    day: offsetDays === 0 ? 'Hôm nay' : VN_WEEKDAYS[dayNum],
    date: `${dd}.${mm}`,
  };
}

function mapWmoCode(code: number): { condition: string; icon: WeatherForecastDay['icon'] } {
  if (code === 0) return { condition: 'Trời quang, nắng nhẹ', icon: 'sun' };
  if (code >= 1 && code <= 3) return { condition: 'Có mây, thời tiết dịu mát', icon: 'partly-cloudy' };
  if (code === 45 || code === 48) return { condition: 'Sương mù & Biển mây', icon: 'fog' };
  if (code >= 95) return { condition: 'Dông gió mạnh', icon: 'storm' };
  return { condition: 'Mưa nhẹ / Mưa rào rải rác', icon: 'rain' };
}

function buildAdvisories(key: string, windNum: number, rainPct: number, temp: number) {
  let tipRain = 'Thời tiết thuận lợi cho hành trình tham quan di tích ngoài trời.';
  if (rainPct >= 60) {
    tipRain = 'Xác suất mưa cao, nhớ mang áo mưa bộ và bọc chống nước balo.';
  } else if (key === 'con-co' && windNum >= 25) {
    tipRain = 'Biển Cồn Cỏ có gió mạnh, kiểm tra lịch tàu Cửa Việt trước khi ra khơi.';
  } else if (key === 'huong-hoa' && temp <= 20) {
    tipRain = 'Độ ẩm & sương sớm đẹp, rất lý tưởng săn biển mây đỉnh đèo Sa Mù 05:30 - 07:00.';
  }

  let tipSleep = 'Buổi tối mát mẻ, phù hợp dạo chợ đêm Đông Hà thưởng thức đặc sản.';
  if (key === 'huong-hoa') {
    tipSleep = 'Ban đêm đèo gió se lạnh, nhớ mang áo khoác gió và thưởng thức cà phê Khe Sanh.';
  } else if (key === 'con-co') {
    tipSleep = 'Ban đêm đảo Cồn Cỏ gió biển lồng lộng, chuẩn bị áo mỏng và thuốc chống muỗi.';
  }

  return { tipRain, tipSleep };
}

function buildFallbackLocation(loc: (typeof WEATHER_LOCATIONS)[number]): WeatherLocationData {
  const forecast: WeatherForecastDay[] = Array.from({ length: 7 }, (_, idx) => {
    const { day, date } = formatRollingDateInfo(idx);
    const wave = (idx % 3) - 1;
    const isHill = loc.key === 'huong-hoa';
    const icon: WeatherForecastDay['icon'] = isHill
      ? idx % 2 === 0
        ? 'fog'
        : 'partly-cloudy'
      : idx % 3 === 0
      ? 'rain'
      : 'partly-cloudy';
    const condition =
      icon === 'fog'
        ? 'Sương mù & Săn mây'
        : icon === 'rain'
        ? 'Mưa nhẹ rải rác'
        : 'Nắng nhẹ & Có mây';
    return {
      day,
      date,
      icon,
      condition,
      high: loc.baseHigh + wave,
      low: loc.baseLow + wave,
      rain: icon === 'rain' ? '55%' : icon === 'fog' ? '35%' : '20%',
      windMax: loc.key === 'con-co' ? '18 km/h' : '11 km/h',
    };
  });

  const todayFc = forecast[0];
  const { tipRain, tipSleep } = buildAdvisories(loc.key, 12, 35, todayFc.high);

  return {
    key: loc.key,
    name: loc.name,
    region: loc.region,
    source: 'fallback',
    current: {
      condition: todayFc.condition,
      icon: todayFc.icon,
      temp: todayFc.high,
      rainChance: todayFc.rain,
      rainNote: 'Theo dõi sát trước khi đi',
      humidity: loc.key === 'huong-hoa' ? '88%' : '78%',
      humidityNote: loc.key === 'huong-hoa' ? 'Sương ẩm miền núi' : 'Thoáng mát',
      wind: loc.key === 'con-co' ? '16 km/h' : '9 km/h',
      windNote: loc.key === 'con-co' ? 'Gió biển vừa' : 'Gió nhẹ',
    },
    tipRain,
    tipSleep,
    forecast,
  };
}

export async function getQuangTriWeather(): Promise<Record<string, WeatherLocationData>> {
  const results = await Promise.allSettled(
    WEATHER_LOCATIONS.map(async (loc) => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=Asia%2FHo_Chi_Minh&forecast_days=7`;
      const res = await fetch(url, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(3500),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      const daily = json.daily || {};
      const times: string[] = daily.time || [];
      const forecast: WeatherForecastDay[] = times.slice(0, 7).map((isoDate, idx) => {
        const wmo = mapWmoCode(Number(daily.weather_code?.[idx] ?? 2));
        const { day, date } = formatRollingDateInfo(idx, isoDate);
        const rainVal = Number(daily.precipitation_probability_max?.[idx] ?? 20);
        const windVal = Math.round(Number(daily.wind_speed_10m_max?.[idx] ?? 10));
        return {
          day,
          date,
          icon: wmo.icon,
          condition: wmo.condition,
          high: Math.round(Number(daily.temperature_2m_max?.[idx] ?? loc.baseHigh)),
          low: Math.round(Number(daily.temperature_2m_min?.[idx] ?? loc.baseLow)),
          rain: `${rainVal}%`,
          windMax: `${windVal} km/h`,
        };
      });

      if (forecast.length === 0) throw new Error('Empty Open-Meteo forecast');

      const cur = json.current || {};
      const curWmo = mapWmoCode(Number(cur.weather_code ?? 2));
      const curTemp = Math.round(Number(cur.temperature_2m ?? forecast[0].high));
      const curHumidity = Math.round(Number(cur.relative_humidity_2m ?? 80));
      const curWind = Math.round(Number(cur.wind_speed_10m ?? 10));
      const curRainNum = parseInt(forecast[0].rain, 10) || 20;

      const { tipRain, tipSleep } = buildAdvisories(loc.key, curWind, curRainNum, curTemp);

      const data: WeatherLocationData = {
        key: loc.key,
        name: loc.name,
        region: loc.region,
        source: 'open-meteo',
        current: {
          condition: curWmo.condition,
          icon: curWmo.icon,
          temp: curTemp,
          rainChance: forecast[0].rain,
          rainNote: curRainNum >= 50 ? 'Có khả năng mưa' : 'Ít khả năng mưa',
          humidity: `${curHumidity}%`,
          humidityNote: curHumidity >= 85 ? 'Độ ẩm cao' : 'Dễ chịu',
          wind: `${curWind} km/h`,
          windNote: curWind >= 22 ? 'Gió khá mạnh' : 'Gió nhẹ',
        },
        tipRain,
        tipSleep,
        forecast,
      };
      return data;
    })
  );

  const output: Record<string, WeatherLocationData> = {};
  WEATHER_LOCATIONS.forEach((loc, idx) => {
    const res = results[idx];
    if (res.status === 'fulfilled') {
      output[loc.key] = res.value;
    } else {
      output[loc.key] = buildFallbackLocation(loc);
    }
  });

  return output;
}
