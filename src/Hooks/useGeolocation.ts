import type { Coordinates } from "@/API/types";
import { useEffect, useState } from "react";

type GeoLocationState = {
  coordinates: Coordinates | null;
  error: string | null;
  isLoading: boolean;
};

export function useGeolocation() {
  const [locationData, setLocationData] = useState<GeoLocationState>({
    coordinates: null,
    error: null,
    isLoading: true,
  });

  function getLocation() {
    setLocationData((prev) => ({ ...prev, isLoading: true, error: null }));
    if (!navigator.geolocation) {
      setLocationData(() => {
        return {
          coordinates: null,
          error: "Geolocation is not supported in your browser",
          isLoading: false,
        };
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationData(() => ({
          coordinates: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          error: null,
          isLoading: false,
        }));
      },
      (error) => {
        let errorMessage: string;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred.";
        }

        setLocationData({
          coordinates: null,
          error: errorMessage,
          isLoading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }

  useEffect(() => {
    getLocation();
  }, []);

  return {
    ...locationData,
    getLocation,
  };
}
