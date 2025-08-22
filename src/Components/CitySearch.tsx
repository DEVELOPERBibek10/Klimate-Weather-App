import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "cmdk";
import { CommandDialog } from "./UI/command";
import { useState } from "react";
import { Button } from "./UI/button";
import { Clock, Loader2, Search, Star, XCircle } from "lucide-react";
import { useLocationSearch } from "@/Hooks/useWeather";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/Hooks/useSearchHistory";
import { format } from "date-fns";
import { useFavorites } from "@/Hooks/useFavorite";

function CitySearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { data: locations, isLoading } = useLocationSearch(query);
  const { history, addToHistory, clearHistory } = useSearchHistory();
  const { favorites } = useFavorites();

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split("|");

    // Add Search History

    addToHistory.mutate({
      query,
      name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
    });

    setOpen(false);
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  return (
    <>
      <Button
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        variant={"outline"}
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search cities...
      </Button>

      <CommandDialog className="w-full" open={open} onOpenChange={setOpen}>
        <div className="relative border-b-2 border-gray-500/50">
          <div className="flex justify-center items-center bg-blend-darken absolute w-[50px] px-2 py-3 rounded-tl-md">
            <Search className="text-gray-500" />
          </div>
          <CommandInput
            className="px-14 outline-none w-full"
            value={query}
            onValueChange={setQuery}
            placeholder="Type a command or search..."
          />
        </div>
        <CommandList>
          {query.length > 0 && !isLoading && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}

          {favorites.length > 0 && (
            <CommandGroup className="mt-2" heading="Favorites">
              {favorites.map(
                (favorite: {
                  id: string;
                  lat: number;
                  lon: number;
                  name: string;
                  country?: string;
                  state?: string;
                  searchedAt: number;
                }) => {
                  return (
                    <CommandItem
                      className="cursor-pointer"
                      key={favorite.id}
                      value={`${favorite.lat}|${favorite.lon}|${favorite.name}|${favorite.country}`}
                      onSelect={(value) => {
                        handleSelect(value);
                        setQuery("");
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Star className="mr-2 h-4 w-4 text-yellow-400" />
                        <span> {favorite.name}</span>
                        {favorite.state && (
                          <span className="text-sm text-muted-foreground">
                            , {favorite.state}
                          </span>
                        )}
                        {favorite.country && (
                          <span className="text-sm text-muted-foreground">
                            , {favorite.country}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  );
                }
              )}
            </CommandGroup>
          )}

          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup className="mt-2">
                <div className="flex items-center justify-between my-2 px-2">
                  <p className="text-xs text-muted-foreground">
                    RecentSearches
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearHistory.mutate()}
                  >
                    <XCircle className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
                {history.map(
                  (location: {
                    lat: number;
                    lon: number;
                    name: string;
                    country?: string;
                    state?: string;
                    searchedAt: number;
                  }) => {
                    return (
                      <CommandItem
                        className="cursor-pointer"
                        key={`${location.lat}-${location.lon}`}
                        value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                        onSelect={(value) => {
                          handleSelect(value);
                          setQuery("");
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="mr-2 h-4 w-4" />
                          <span> {location.name}</span>
                          {location.state && (
                            <span className="text-sm text-muted-foreground">
                              , {location.state}
                            </span>
                          )}
                          {location.country && (
                            <>
                              <span className="text-sm text-muted-foreground">
                                , {location.country}
                              </span>
                              <span className="ml-auto text-xs text-muted-foreground">
                                {format(location.searchedAt, "MM d, h:mm a")}
                              </span>
                            </>
                          )}
                        </div>
                      </CommandItem>
                    );
                  }
                )}
              </CommandGroup>
            </>
          )}

          <CommandSeparator />

          {locations && locations.length > 0 && (
            <CommandGroup className="mt-2" heading="Sugesstions">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {locations.map((location) => (
                <CommandItem
                  className="cursor-pointer"
                  key={`${location.lat}-${location.lon}`}
                  value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                  onSelect={(value) => {
                    handleSelect(value);
                    setQuery("");
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Search className="mr-2 h-4 w-4" />
                    <span> {location.name}</span>
                    {location.state && (
                      <span className="text-sm text-muted-foreground">
                        , {location.state}
                      </span>
                    )}
                    {location.country && (
                      <span className="text-sm text-muted-foreground">
                        , {location.country}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default CitySearch;
