import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLocationStore } from '@/store/useLocationStore';

export function useLocation() {
  const { currentCity, setCity, setLocationPermission, setIsLoading } = useLocationStore();

  useEffect(() => {
    async function initializeLocation() {
      // If we already have a city persisted, don't force a new fetch immediately,
      // but we could refresh it. For now, just use it.
      if (currentCity) {
        setIsLoading(false);
        return;
      }

      if (!navigator.geolocation) {
        setLocationPermission('denied');
        setIsLoading(false);
        return;
      }

      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        
        if (permission.state === 'denied') {
          setLocationPermission('denied');
          setIsLoading(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            setLocationPermission('granted');
            try {
              // Reverse geocode using OpenStreetMap Nominatim (free, no API key)
              const { latitude, longitude } = position.coords;
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();
              
              const detectedCityName = data.address?.city || data.address?.town || data.address?.village || 'Patna';

              // Look up in Supabase
              const { data: cityData, error } = await supabase
                .from('cities')
                .select('id, name, slug')
                .ilike('name', detectedCityName)
                .single();

              if (cityData && !error) {
                setCity(cityData);
              } else {
                // Fallback to Patna if not found
                const { data: defaultCity } = await supabase
                  .from('cities')
                  .select('id, name, slug')
                  .ilike('name', 'Patna')
                  .single();
                  
                if (defaultCity) setCity(defaultCity);
              }
            } catch (err) {
              console.error('Error reverse geocoding:', err);
              // Fallback
              const { data: defaultCity } = await supabase.from('cities').select('*').ilike('name', 'Patna').single();
              if (defaultCity) setCity(defaultCity);
            } finally {
              setIsLoading(false);
            }
          },
          async (error) => {
            console.error('Geolocation error:', error);
            setLocationPermission('denied');
            
            // Fallback to Patna
            const { data: defaultCity } = await supabase.from('cities').select('*').ilike('name', 'Patna').single();
            if (defaultCity) setCity(defaultCity);
            
            setIsLoading(false);
          },
          { timeout: 10000 }
        );
      } catch (err) {
        console.error('Permission query error:', err);
        setIsLoading(false);
      }
    }

    // Only run on client
    if (typeof window !== 'undefined') {
      initializeLocation();
    }
  }, [currentCity, setCity, setLocationPermission, setIsLoading]);

  return { currentCity };
}
