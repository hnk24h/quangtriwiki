import {
  getPlaces,
  getServices,
  getThreads,
  getFoods,
  getItineraries,
  getZones,
  getGuides,
  getBannerSlides,
} from '@/lib/get-data';
import { QUANGTRI_DATA } from '@/lib/data';
import HomeClient from '@/components/HomeClient';

export const revalidate = 60; // ISR cache revalidation every 60 seconds

export default async function HomePage() {
  const [
    places,
    services,
    threads,
    foods,
    itineraries,
    zones,
    guides,
    bannerSlides,
  ] = await Promise.all([
    getPlaces(),
    getServices(),
    getThreads(),
    getFoods(),
    getItineraries(),
    getZones(),
    getGuides(),
    getBannerSlides(),
  ]);

  return (
    <HomeClient
      initialPlaces={places || []}
      initialServices={services || []}
      initialThreads={threads || []}
      zones={zones || []}
      foods={foods || []}
      itineraries={itineraries || []}
      guides={guides || {}}
      bannerSlides={bannerSlides || []}
      weatherData={QUANGTRI_DATA.weatherData || {}}
    />
  );
}
