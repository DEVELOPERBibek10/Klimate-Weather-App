import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./useLocalStorage";

type FavoriteCityItem = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  addedAt: number;
};

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<FavoriteCityItem[]>(
    "favorites",
    []
  );

  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: () => favorites,
    initialData: favorites,
    staleTime: Infinity,
  });

  const addToFavorites = useMutation({
    mutationFn: async (city: Omit<FavoriteCityItem, "id" | "addedAt">) => {
      const newFavorite: FavoriteCityItem = {
        ...city,
        id: `${city.lat}-${city.lon}`,
        addedAt: Date.now(),
      };

      const exists = favorites.some(
        (fav: { id: string }) => fav.id === newFavorite.id
      );
      if (exists) return favorites;

      const newFavorites = [...favorites, newFavorite].slice(0, 10);
      setFavorites(newFavorites);
      return newFavorites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });

  const removeFavorite = useMutation({
    mutationFn: async (cityId: string) => {
      const newFavorites: FavoriteCityItem[] = favorites.filter(
        (city: FavoriteCityItem) => city.id !== cityId
      );
      setFavorites(newFavorites);
      return newFavorites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });

  return {
    favorites: favoritesQuery.data ?? [],
    addToFavorites,
    removeFavorite,
    isFavorite: (lat: number, lon: number) => {
      return favorites.some(
        (city: FavoriteCityItem) => city.lat === lat && city.lon === lon
      );
    },
  };
}
