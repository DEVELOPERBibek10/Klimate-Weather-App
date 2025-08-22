import type { WeatherData } from "@/API/types";
import { Button } from "./UI/button";
import { useFavorites } from "@/Hooks/useFavorite";
import { Star } from "lucide-react";
import { toast } from "sonner";

type FavoriteButtonProps = {
  data: WeatherData;
};

function FavoriteButton({ data }: FavoriteButtonProps) {
  const { addToFavorites, removeFavorite, isFavorite } = useFavorites();
  const isCurrentlyFavorite = isFavorite(data.coord.lat, data.coord.lon);

  const handleToggleFavorite = () => {
    if (isCurrentlyFavorite) {
      removeFavorite.mutate(`${data.coord.lat}-${data.coord.lon}`);
      toast.error(`Removed ${data.name} from Favorites`);
    } else {
      addToFavorites.mutate({
        name: data.name,
        lat: data.coord.lat,
        lon: data.coord.lon,
        country: data.sys.country,
      });
      toast.success(`Added ${data.name} to Favorites`);
    }
  };

  return (
    <Button
      variant={isCurrentlyFavorite ? "default" : "outline"}
      size={"icon"}
      onClick={handleToggleFavorite}
      className={
        isCurrentlyFavorite
          ? "bg-yellow-500 hover:bg-yellow-600 cursor-pointer"
          : "cursor-pointer"
      }
    >
      <Star
        className={`h-4 w-4 ${isCurrentlyFavorite ? "fill-current" : ""}`}
      />
    </Button>
  );
}

export default FavoriteButton;
