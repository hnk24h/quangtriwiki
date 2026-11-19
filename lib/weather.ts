import { DEFAULT_ZONE_META } from '@/lib/normalize';
import type { Zone } from '@/lib/supabase/types';

export type WeatherIcon = 'sun' | 'partly-cloudy' | 'fog' | 'rain' | 'storm';

export interface WeatherHourlySlot {
  time: string;
  temp: number;
  rain: string;
  icon: WeatherIcon;
  wind: string;
}

export interface WeatherForecastDay {
  day: string;
  date: string;
  isoDate: string;
  icon: WeatherIcon;
  condition: string;
  high: number;
  low: number;
  rain: string;
  rainMm: number;
  windMax: string;
  uvMax: number;
  sunrise: string;
  sunset: string;
  hourly: WeatherHourlySlot[];
}

export interface WeatherLocationData {
  key: string;
  zoneCode: string;
  name: string;
  region: string;
  lat: number;
  lon: number;
  typeGroup: 'history' | 'mountain' | 'coastal';
  source: 'open-meteo' | 'fallback';
  updatedAt: string;
  current: {
    condition: string;
    icon: WeatherIcon;
    temp: number;
    feelsLike: number;
    rainChance: string;
    rainMm: number;
    rainNote: string;
    humidity: string;
    humidityNote: string;
    cloudCover: string;
    wind: string;
    windDir: string;
    windNote: string;
    uvMax: number;
    sunrise: string;
    sunset: string;
  };
  tipRain: string;
  tipSleep: string;
  forecast: WeatherForecastDay[];
}

export interface WeatherTargetZone {
  key: string;
  zoneCode: string;
  name: string;
  region: string;
  lat: number;
  lon: number;
  typeGroup: 'history' | 'mountain' | 'coastal';
}

const DEFAULT_FALLBACK_ZONES: { code: string; name: string }[] = [
  { code: 'QT-05', name: 'Hướng Hóa & Khe Sanh' },
  { code: 'QT-01', name: 'Đông Hà & Vùng Trung Tâm' },
  { code: 'QT-02', name: 'Thị Xã Quảng Trị & Hải Lăng' },
  { code: 'QT-03', name: 'Vĩnh Linh & Vĩ Tuyến 17' },
  { code: 'QT-04', name: 'Gio Linh & Cửa Việt' },
  { code: 'QT-06', name: 'Đakrông & Đường Hồ Chí Minh' },
  { code: 'QT-07', name: 'Huyện Đảo Cồn Cỏ' },
  { code: 'QT-08', name: 'Cam Lộ & Vùng Trung Du' },
];

const VN_WEEKDAYS = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
const WIND_DIRS = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
const SLOT_HOURS = [6, 9, 12, 15, 18, 21];

export function resolveWeatherTargets(zones?: Zone[]): WeatherTargetZone[] {
  const sourceZones: WeatherTargetZone[] = [];

  if (Array.isArray(zones) && zones.length > 0) {
    for (const z of zones) {
      if (z.showInWeather === false) continue;
      const def = DEFAULT_ZONE_META[z.code];
      const lat = typeof z.lat === 'number' && Number.isFinite(z.lat) ? z.lat : def?.lat;
      const lon = typeof z.lon === 'number' && Number.isFinite(z.lon) ? z.lon : def?.lon;
      if (lat === undefined || lon === undefined) continue;

      sourceZones.push({
        key: z.code,
        zoneCode: z.code,
        name: z.name,
        region: z.weatherRegionLabel || def?.weatherRegionLabel || z.name.toUpperCase(),
        lat,
        lon,
        typeGroup: z.typeGroup || def?.typeGroup || 'history',
      });
    }
  }

  if (sourceZones.length > 0) {
    // Keep QT-05 (Sa Mù) convenient in selector if present, otherwise code ascending
    return sourceZones;
  }

  return DEFAULT_FALLBACK_ZONES.map((z) => {
    const def = DEFAULT_ZONE_META[z.code];
    return {
      key: z.code,
      zoneCode: z.code,
      name: z.name,
      region: def?.weatherRegionLabel || z.name.toUpperCase(),
      lat: def?.lat ?? 16.8163,
      lon: def?.lon ?? 107.1003,
      typeGroup: def?.typeGroup ?? 'history',
    };
  });
}

export function buildOpenMeteoBatchUrl(targets: WeatherTargetZone[]): string {
  const lats = targets.map((t) => t.lat.toFixed(4)).join(',');
  const lons = targets.map((t) => t.lon.toFixed(4)).join(',');
  const params = new URLSearchParams({
    latitude: lats,
    longitude: lons,
    current:
      'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,is_day',
    hourly: 'temperature_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max,sunrise,sunset',
    timezone: 'Asia/Ho_Chi_Minh',
    forecast_days: '7',
  });
  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
}

function formatDateInfo(offsetDays: number, isoDate?: string): { day: string; date: string; isoDate: string } {
  let d: Date;
  if (isoDate) {
    d = new Date(`${isoDate}T12:00:00+07:00`);
  } else {
    d = new Date(Date.now() + 7 * 3600 * 1000 + offsetDays * 86400 * 1000);
  }
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const dayNum = d.getUTCDay();
  return {
    day: offsetDays === 0 ? 'Hôm nay' : VN_WEEKDAYS[dayNum],
    date: `${dd}.${mm}`,
    isoDate: isoDate || `${yyyy}-${mm}-${dd}`,
  };
}

export function mapWmoCode(code: number): { condition: string; icon: WeatherIcon } {
  if (code === 0) return { condition: 'Trời quang, nắng nhẹ', icon: 'sun' };
  if (code === 1) return { condition: 'Ít mây, trời hửng nắng', icon: 'partly-cloudy' };
  if (code === 2) return { condition: 'Mây rải rác, dịu mát', icon: 'partly-cloudy' };
  if (code === 3) return { condition: 'Nhiều mây âm u', icon: 'partly-cloudy' };
  if (code === 45 || code === 48) return { condition: 'Sương mù & Biển mây', icon: 'fog' };
  if (code === 51 || code === 53 || code === 55) return { condition: 'Mưa phùn / Mưa bụi nhẹ', icon: 'rain' };
  if (code === 56 || code === 57) return { condition: 'Mưa phùn se lạnh', icon: 'rain' };
  if (code === 61 || code === 80) return { condition: 'Mưa rào nhẹ', icon: 'rain' };
  if (code === 63 || code === 81) return { condition: 'Mưa vừa rải rác', icon: 'rain' };
  if (code === 65 || code === 82) return { condition: 'Mưa to cục bộ', icon: 'rain' };
  if (code >= 95) return { condition: 'Có dông gió mạnh', icon: 'storm' };
  return { condition: 'Có mây & Mưa nhẹ', icon: 'partly-cloudy' };
}

function mapWindDirection(deg: number): string {
  if (!Number.isFinite(deg)) return 'Nhẹ';
  const idx = Math.round((((deg % 360) + 360) % 360) / 45) % 8;
  return WIND_DIRS[idx];
}

export function buildAdvisories(
  target: WeatherTargetZone,
  windNum: number,
  rainPct: number,
  temp: number,
  uvMax: number
) {
  let tipRain = 'Thời tiết thuận lợi cho hành trình tham quan di tích & khám phá ngoài trời.';
  if (rainPct >= 65) {
    tipRain = 'Xác suất mưa cao — nên mang áo mưa bộ, bọc chống nước balo và đi chậm qua đường đèo.';
  } else if (target.zoneCode === 'QT-07' && windNum >= 25) {
    tipRain = `Cảnh báo gió biển ${windNum} km/h — kiểm tra kỹ lịch tàu cao tốc Cửa Việt trước khi ra đảo Cồn Cỏ.`;
  } else if (target.typeGroup === 'mountain' && temp <= 21) {
    tipRain = 'Nhiệt độ vùng cao mát se lạnh & ẩm sương, cực kỳ lý tưởng săn biển mây sớm 05:30–07:00.';
  } else if (uvMax >= 8) {
    tipRain = `Chỉ số UV cao (${uvMax}) vào buổi trưa — chuẩn bị kính râm, áo chống nắng và nước uống.`;
  }

  let tipSleep = 'Buổi tối thời tiết dễ chịu, thích hợp dạo phố thưởng thức đặc sản Quảng Trị.';
  if (target.typeGroup === 'mountain') {
    tipSleep = 'Ban đêm khu vực núi cao/đèo gió khá lạnh, nhớ chuẩn bị áo khoác ấm và thưởng thức cà phê Khe Sanh.';
  } else if (target.typeGroup === 'coastal') {
    tipSleep = 'Vùng ven biển & hải đảo gió lộng về đêm, chuẩn bị thêm áo khoác mỏng và thuốc chống côn trùng.';
  }

  return { tipRain, tipSleep };
}

function extractTimeHHMM(val?: string): string {
  if (!val || typeof val !== 'string') return '06:00';
  const match = val.match(/(\d{2}:\d{2})$/);
  return match ? match[1] : '06:00';
}

export function parseOpenMeteoResponse(
  rawJson: any,
  targets: WeatherTargetZone[]
): Record<string, WeatherLocationData> {
  const items = Array.isArray(rawJson) ? rawJson : [rawJson];
  const updatedAt = new Date().toISOString();
  const output: Record<string, WeatherLocationData> = {};

  targets.forEach((target, idx) => {
    const json = items[idx];
    if (!json || !json.daily || !Array.isArray(json.daily.time) || json.daily.time.length === 0) {
      output[target.key] = buildFallbackLocation(target, updatedAt);
      return;
    }

    const daily = json.daily;
    const hourly = json.hourly || {};
    const hourlyTimes: string[] = Array.isArray(hourly.time) ? hourly.time : [];

    // Group hourly items by isoDate -> hour index
    const hourlyByDay = new Map<string, WeatherHourlySlot[]>();
    hourlyTimes.forEach((timeStr, hIdx) => {
      const [isoDate, hhmm] = String(timeStr).split('T');
      if (!isoDate || !hhmm) return;
      const hourNum = parseInt(hhmm.slice(0, 2), 10);
      if (!SLOT_HOURS.includes(hourNum)) return;

      const list = hourlyByDay.get(isoDate) || [];
      const wmo = mapWmoCode(Number(hourly.weather_code?.[hIdx] ?? 2));
      list.push({
        time: `${String(hourNum).padStart(2, '0')}h`,
        temp: Math.round(Number(hourly.temperature_2m?.[hIdx] ?? 22)),
        rain: `${Math.round(Number(hourly.precipitation_probability?.[hIdx] ?? 10))}%`,
        icon: wmo.icon,
        wind: `${Math.round(Number(hourly.wind_speed_10m?.[hIdx] ?? 8))} km/h`,
      });
      hourlyByDay.set(isoDate, list);
    });

    const forecast: WeatherForecastDay[] = daily.time.slice(0, 7).map((isoDate: string, dIdx: number) => {
      const wmo = mapWmoCode(Number(daily.weather_code?.[dIdx] ?? 2));
      const { day, date } = formatDateInfo(dIdx, isoDate);
      const rainVal = Math.round(Number(daily.precipitation_probability_max?.[dIdx] ?? 20));
      const rainMm = Math.round(Number(daily.precipitation_sum?.[dIdx] ?? 0) * 10) / 10;
      const windVal = Math.round(Number(daily.wind_speed_10m_max?.[dIdx] ?? 10));
      const uvMax = Math.round(Number(daily.uv_index_max?.[dIdx] ?? 5) * 10) / 10;

      return {
        day,
        date,
        isoDate,
        icon: wmo.icon,
        condition: wmo.condition,
        high: Math.round(Number(daily.temperature_2m_max?.[dIdx] ?? 25)),
        low: Math.round(Number(daily.temperature_2m_min?.[dIdx] ?? 19)),
        rain: `${rainVal}%`,
        rainMm,
        windMax: `${windVal} km/h`,
        uvMax,
        sunrise: extractTimeHHMM(daily.sunrise?.[dIdx]),
        sunset: extractTimeHHMM(daily.sunset?.[dIdx]),
        hourly: hourlyByDay.get(isoDate) || [],
      };
    });

    const cur = json.current || {};
    const curWmo = mapWmoCode(Number(cur.weather_code ?? 2));
    const curTemp = Math.round(Number(cur.temperature_2m ?? forecast[0].high));
    const curFeelsLike = Math.round(Number(cur.apparent_temperature ?? curTemp));
    const curHumidity = Math.round(Number(cur.relative_humidity_2m ?? 78));
    const curCloudCover = Math.round(Number(cur.cloud_cover ?? 40));
    const curWind = Math.round(Number(cur.wind_speed_10m ?? 10));
    const curWindDir = mapWindDirection(Number(cur.wind_direction_10m ?? 90));
    const curRainMm = Math.round(Number(cur.precipitation ?? forecast[0].rainMm ?? 0) * 10) / 10;
    const curRainPct = parseInt(forecast[0].rain, 10) || 20;
    const todayUv = forecast[0].uvMax;

    const { tipRain, tipSleep } = buildAdvisories(target, curWind, curRainPct, curTemp, todayUv);

    output[target.key] = {
      key: target.key,
      zoneCode: target.zoneCode,
      name: target.name,
      region: target.region,
      lat: target.lat,
      lon: target.lon,
      typeGroup: target.typeGroup,
      source: 'open-meteo',
      updatedAt,
      current: {
        condition: curWmo.condition,
        icon: curWmo.icon,
        temp: curTemp,
        feelsLike: curFeelsLike,
        rainChance: forecast[0].rain,
        rainMm: curRainMm,
        rainNote: curRainPct >= 50 ? 'Có khả năng mưa' : 'Ít khả năng mưa',
        humidity: `${curHumidity}%`,
        humidityNote: curHumidity >= 85 ? 'Độ ẩm cao' : 'Dễ chịu',
        cloudCover: `${curCloudCover}%`,
        wind: `${curWind} km/h`,
        windDir: curWindDir,
        windNote: curWind >= 22 ? 'Gió khá mạnh' : 'Gió nhẹ',
        uvMax: todayUv,
        sunrise: forecast[0].sunrise,
        sunset: forecast[0].sunset,
      },
      tipRain,
      tipSleep,
      forecast,
    };
  });

  return output;
}

export function buildFallbackLocation(
  target: WeatherTargetZone,
  updatedAt = new Date().toISOString()
): WeatherLocationData {
  const isMountain = target.typeGroup === 'mountain';
  const isCoastal = target.typeGroup === 'coastal';
  const baseHigh = isMountain ? 22 : isCoastal ? 26 : 27;
  const baseLow = isMountain ? 16 : 21;

  const forecast: WeatherForecastDay[] = Array.from({ length: 7 }, (_, idx) => {
    const { day, date, isoDate } = formatDateInfo(idx);
    const wave = (idx % 3) - 1;
    const icon: WeatherIcon = isMountain
      ? idx % 2 === 0
        ? 'fog'
        : 'partly-cloudy'
      : idx % 3 === 0
      ? 'rain'
      : 'partly-cloudy';
    const condition =
      icon === 'fog' ? 'Sương mù & Săn mây' : icon === 'rain' ? 'Mưa nhẹ rải rác' : 'Có mây, nắng nhẹ';
    const high = baseHigh + wave;
    const low = baseLow + wave;
    const rainPct = icon === 'rain' ? 50 : icon === 'fog' ? 30 : 15;
    const windSpeed = isCoastal ? 16 : 9;

    const hourly: WeatherHourlySlot[] = SLOT_HOURS.map((h) => {
      const hourOffset = h === 12 || h === 15 ? high : h === 6 || h === 21 ? low + 1 : Math.round((high + low) / 2);
      return {
        time: `${String(h).padStart(2, '0')}h`,
        temp: hourOffset,
        rain: `${rainPct}%`,
        icon,
        wind: `${windSpeed} km/h`,
      };
    });

    return {
      day,
      date,
      isoDate,
      icon,
      condition,
      high,
      low,
      rain: `${rainPct}%`,
      rainMm: icon === 'rain' ? 2.4 : 0,
      windMax: `${windSpeed} km/h`,
      uvMax: isMountain ? 5 : 7,
      sunrise: '05:45',
      sunset: '17:38',
      hourly,
    };
  });

  const today = forecast[0];
  const windNum = isCoastal ? 15 : 9;
  const { tipRain, tipSleep } = buildAdvisories(target, windNum, 25, today.high, today.uvMax);

  return {
    key: target.key,
    zoneCode: target.zoneCode,
    name: target.name,
    region: target.region,
    lat: target.lat,
    lon: target.lon,
    typeGroup: target.typeGroup,
    source: 'fallback',
    updatedAt,
    current: {
      condition: today.condition,
      icon: today.icon,
      temp: today.high,
      feelsLike: today.high,
      rainChance: today.rain,
      rainMm: today.rainMm,
      rainNote: 'Theo dõi trước khi đi',
      humidity: isMountain ? '88%' : '76%',
      humidityNote: isMountain ? 'Sương ẩm miền núi' : 'Thoáng mát',
      cloudCover: isMountain ? '65%' : '45%',
      wind: `${windNum} km/h`,
      windDir: isCoastal ? 'Đông Bắc' : 'Đông Nam',
      windNote: 'Gió nhẹ',
      uvMax: today.uvMax,
      sunrise: today.sunrise,
      sunset: today.sunset,
    },
    tipRain,
    tipSleep,
    forecast,
  };
}

export async function getQuangTriWeather(
  zones?: Zone[],
  options: { forceFresh?: boolean; timeoutMs?: number } = {}
): Promise<Record<string, WeatherLocationData>> {
  const targets = resolveWeatherTargets(zones);
  const url = buildOpenMeteoBatchUrl(targets);
  const timeoutMs = options.timeoutMs ?? 4000;

  try {
    const isServer = typeof window === 'undefined';
    const fetchOpts: RequestInit & { next?: { revalidate: number } } = {
      signal: AbortSignal.timeout(timeoutMs),
    };

    if (options.forceFresh) {
      fetchOpts.cache = 'no-store';
    } else if (isServer) {
      fetchOpts.next = { revalidate: 900 }; // 15 min cache on server
    }

    const res = await fetch(url, fetchOpts);
    if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
    const json = await res.json();
    return parseOpenMeteoResponse(json, targets);
  } catch {
    const updatedAt = new Date().toISOString();
    const fallback: Record<string, WeatherLocationData> = {};
    for (const target of targets) {
      fallback[target.key] = buildFallbackLocation(target, updatedAt);
    }
    return fallback;
  }
}
