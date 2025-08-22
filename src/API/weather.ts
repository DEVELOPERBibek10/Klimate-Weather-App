import { API_CONFIG } from "./config";
import type {
  Coordinates,
  ForecastData,
  GeocodingResponse,
  WeatherData,
} from "./types";

class WeatherAPI {
  private createURL(endpoint: string, params: Record<string, string | number>) {
    const searchParams = new URLSearchParams({
      appid: API_CONFIG.API_KEY,
      ...params,
    });
    return `${endpoint}?${searchParams.toString()}`;
  }

  private async fetchData<T>(url: string): Promise<T | undefined> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Weather API Error : ${error}`);
      }
      const data = await response.json();
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(String(error));
      }
      return undefined;
    }
  }

  async getCurrentWeather({ lat, lon }: Coordinates): Promise<WeatherData> {
    const url = this.createURL(`${API_CONFIG.BASE_URL}/weather`, {
      lat: lat.toString(),
      lon: lon.toString(),
      units: API_CONFIG.DEFAULT_PARAMS.units,
    });
    const data = await this.fetchData<WeatherData>(url);
    if (!data) {
      throw new Error("Failed to fetch weather data.");
    }
    return data;
  }

  async getForecast({ lat, lon }: Coordinates): Promise<ForecastData> {
    const url = this.createURL(`${API_CONFIG.BASE_URL}/forecast`, {
      lat: lat.toString(),
      lon: lon.toString(),
      units: API_CONFIG.DEFAULT_PARAMS.units,
    });
    const data = await this.fetchData<ForecastData>(url);
    if (!data) {
      throw new Error("Failed to fetch weather data.");
    }
    return data;
  }

  async reverseGeocode({
    lat,
    lon,
  }: Coordinates): Promise<GeocodingResponse[]> {
    const url = this.createURL(`${API_CONFIG.GEO}/reverse`, {
      lat: lat.toString(),
      lon: lon.toString(),
      limit: 1,
    });
    const data = await this.fetchData<GeocodingResponse[]>(url);
    if (!data) {
      throw new Error("Failed to fetch weather data.");
    }
    return data;
  }

  async searchLocations(query: string): Promise<GeocodingResponse[]> {
    const url = this.createURL(`${API_CONFIG.GEO}/direct`, {
      q: query,
      limit: 5,
    });
    const data = await this.fetchData<GeocodingResponse[]>(url);
    if (!data) {
      throw new Error("Failed to fetch weather data.");
    }
    return data;
  }
}

export const weatherAPI = new WeatherAPI();
