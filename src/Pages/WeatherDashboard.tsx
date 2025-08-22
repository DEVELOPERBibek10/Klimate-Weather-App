import type { GeocodingResponse } from "@/API/types";
import CurrentWeather from "@/Components/CurrentWeather";
import { FavoriteCities } from "@/Components/FavoriteCities";
import HourlyTemperature from "@/Components/HourlyTemperature";
import { Alert, AlertDescription, AlertTitle } from "@/Components/UI/alert";
import { Button } from "@/Components/UI/button";
import WeatherDetails from "@/Components/WeatherDetails";
import { WeatherForecast } from "@/Components/WeatherForecast";
import WeatherSkeleton from "@/Components/WeatherSkeleton";
import { useGeolocation } from "@/Hooks/useGeolocation";
import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "@/Hooks/useWeather";
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react";

const WeatherDashboard = () => {
  const {
    coordinates,
    error: locationError,
    getLocation,
    isLoading: locationLoading,
  } = useGeolocation();

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    }
  };

  const locationName = locationQuery.data?.[0];

  if (locationLoading) {
    return <WeatherSkeleton />;
  }

  if (locationError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error!</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!coordinates) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Location Required!</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable your location access to see your local weather</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error!</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to fetch the weather data. Please try again</p>
          <Button onClick={handleRefresh} variant={"outline"} className="w-fit">
            <RefreshCw
              className={`h-4 w-4 ${
                weatherQuery.isFetching ? "animate-spin" : ""
              }`}
            />
            retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Favorite Cities */}
      <FavoriteCities />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={handleRefresh}
          className="cursor-pointer transition-all duration-500"
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCw
            className={`h-4 w-4  ${
              weatherQuery.isFetching ? "animate-spin" : ""
            }`}
          />
        </Button>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2 items-start">
          <CurrentWeather
            data={weatherQuery.data}
            locationName={locationName ?? ({} as GeocodingResponse)}
          />
          <HourlyTemperature data={forecastQuery.data} />
        </div>

        <div className="grid gap-5 md:grid-cols-2 items-start">
          <WeatherDetails data={weatherQuery.data} />
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
