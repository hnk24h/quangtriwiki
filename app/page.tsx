import { getPlaces, getServices, getThreads } from '@/lib/get-data';
import { QUANGTRI_DATA } from '@/lib/data';
import HomeClient from '@/components/HomeClient';

export const revalidate = 60; // ISR cache revalidation every 60 seconds

export default async function HomePage() {
  const [places, services, threads] = await Promise.all([
    getPlaces(),
    getServices(),
    getThreads(),
  ]);

  return (
    <HomeClient
      initialPlaces={places || []}
      initialServices={services || []}
      initialThreads={threads || []}
      zones={QUANGTRI_DATA.zones || []}
      foods={QUANGTRI_DATA.foods || []}
      itineraries={QUANGTRI_DATA.itineraries || []}
      guides={QUANGTRI_DATA.guides || {}}
      bannerSlides={QUANGTRI_DATA.bannerSlides || []}
      weatherData={QUANGTRI_DATA.weatherData || {}}
    />
  );
}
