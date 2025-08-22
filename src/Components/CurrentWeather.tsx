import type { GeocodingResponse, WeatherData } from "@/API/types";
import { Card, CardContent } from "./UI/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";

type CurrentWeatherProps = {
  data: WeatherData;
  locationName?: GeocodingResponse;
};

const CurrentWeather = ({ data, locationName }: CurrentWeatherProps) => {
  const {
    weather: [currentWeather],
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed },
  } = data;

  const formatTemp = (temp: number) => `${Math.round(temp)}°`;

  return (
    <Card className="overflow-hidden">
      <CardContent className="px-6 py-3 h-full">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6 md:space-y-4">
            <div className="space-y-2">
              <div className="flex items-center flex-col md:flex-row gap-1">
                <h2 className="text-xl md:text-[22px] font-bold text-nowrap">
                  {locationName?.name}
                </h2>
                {locationName?.state && (
                  <span className="text-muted-foreground tracking-tight">
                    ,<span className="text-nowrap"> {locationName.state}</span>
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground text-center md:text-left">
                {locationName?.country}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-5xl md:text-7xl font-bold tracking-tighter">
                {formatTemp(temp)}
              </p>
              <div className="space-y-1 px-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Feels like {formatTemp(feels_like)}
                </p>
                <div className="flex gap-2 text-sm font-medium">
                  <span className="flex items-center gap-1 text-blue-500">
                    <ArrowDown className="h-3 w-3" />
                    {formatTemp(temp_min)}
                  </span>
                  <span className="flex items-center gap-1 text-red-500">
                    <ArrowUp className="h-3 w-3" />
                    {formatTemp(temp_max)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Humidity</p>
                  <p className="text-sm text-muted-foreground">{humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-blue-500" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Wind Speed</p>
                  <p className="text-sm text-muted-foreground">{speed} m/s</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative flex aspect-square w-full max-w-[160px] md:max-w-[200px] items-center justify-center">
              <img
                src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
                alt={currentWeather.description}
                className="h-full w-full object-contain"
              />
              <div className="absolute bottom-0 text-center">
                <p className="text-sm font-medium capitalize">
                  {currentWeather.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
