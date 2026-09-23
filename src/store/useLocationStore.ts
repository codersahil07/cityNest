import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface City {
  id: string;
  name: string;
  slug: string;
}

interface LocationState {
  currentCity: City | null;
  locationPermission: 'prompt' | 'granted' | 'denied';
  isLoading: boolean;
  setCity: (city: City) => void;
  setLocationPermission: (permission: 'prompt' | 'granted' | 'denied') => void;
  setIsLoading: (loading: boolean) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      currentCity: null,
      locationPermission: 'prompt',
      isLoading: true,
      setCity: (city) => set({ currentCity: city }),
      setLocationPermission: (permission) => set({ locationPermission: permission }),
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'citynest-location-storage',
    }
  )
);
