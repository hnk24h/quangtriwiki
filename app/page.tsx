import {
  getBannerSlides,
  getFoods,
  getGuides,
  getItineraries,
  getPlaces,
  getServices,
  getSiteViews,
  getThreads,
  getZones,
} from '@/lib/get-data';
import { getQuangTriWeather } from '@/lib/weather';
import HomeClient from '@/components/HomeClient';

export const revalidate = 60;

export default async function HomePage() {
  const zones = await getZones();

  const [
    places,
    services,
    threads,
    foods,
    itineraries,
    guides,
    bannerSlides,
    siteViews,
    weatherData,
  ] = await Promise.all([
    getPlaces(),
    getServices(),
    getThreads(),
    getFoods(),
    getItineraries(),
    getGuides(),
    getBannerSlides(),
    getSiteViews(),
    getQuangTriWeather(zones),
  ]);

  return (
    <HomeClient
      initialPlaces={places}
      initialServices={services}
      initialThreads={threads}
      zones={zones}
      foods={foods}
      itineraries={itineraries}
      guides={guides}
      bannerSlides={bannerSlides}
      weatherData={weatherData}
      initialViews={siteViews}
    />
  );
}
