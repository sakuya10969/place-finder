import {
  Alert,
  Box,
  Button,
  Card,
  Group,
  Loader,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useGetApiPlacesSearch, useGetHealth } from "@place-finder/api-client/generated";
import type {
  GetApiPlacesSearch200PlacesItem,
  GetApiPlacesSearchParams,
} from "@place-finder/api-client/generated/model";
import {
  IconAlertCircle,
  IconCurrentLocation,
  IconRefresh,
  IconSearch,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { PlaceCard } from "../../../entities/place/ui/place-card";
import { PlacesMap } from "../../../features/map/ui/places-map";
import { GenreFilter } from "../../../features/search/ui/genre-filter";
import { useGeolocation } from "../../../shared/hooks/use-geolocation";

const extractErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return "検索に失敗しました。";
};

export const HomePage = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedRadius, setSelectedRadius] = useState(1000);
  const [selectedPlace, setSelectedPlace] = useState<GetApiPlacesSearch200PlacesItem | null>(null);
  const {
    coordinates,
    error: geolocationError,
    isLoading: isLoadingLocation,
    retry,
  } = useGeolocation();

  const params = useMemo<GetApiPlacesSearchParams | null>(() => {
    if (!coordinates) return null;
    return {
      lat: coordinates.lat,
      lng: coordinates.lng,
      radius: selectedRadius,
      type: selectedGenre ?? undefined,
    };
  }, [coordinates, selectedGenre, selectedRadius]);

  useGetHealth({
    query: { staleTime: 30000, refetchInterval: 60000 },
  });

  const placesQuery = useGetApiPlacesSearch(params ?? { lat: 0, lng: 0 }, {
    query: { enabled: params !== null, staleTime: 30000 },
  });

  const successfulPlacesResponse = placesQuery.data?.status === 200 ? placesQuery.data.data : null;
  const places = successfulPlacesResponse?.places ?? [];

  useEffect(() => {
    if (geolocationError) {
      notifications.show({
        color: "red",
        title: "位置情報エラー",
        message: geolocationError,
      });
    }
  }, [geolocationError]);

  useEffect(() => {
    if (placesQuery.isError) {
      notifications.show({
        color: "red",
        title: "検索エラー",
        message: extractErrorMessage(placesQuery.error),
      });
    }
  }, [placesQuery.error, placesQuery.isError]);

  useEffect(() => {
    setSelectedPlace((current) =>
      current
        ? (places.find((place) => place.id === current.id) ?? places[0] ?? null)
        : (places[0] ?? null),
    );
  }, [places]);

  return (
    <Stack gap="md">
      <Card withBorder padding="lg" style={{ borderColor: "#E5E7EB" }}>
        <Group align="flex-start" justify="space-between" wrap="nowrap" gap="lg">
          <Stack gap="md" style={{ flex: 1, minWidth: 0 }}>
            <Group gap="xs">
              <IconSearch size={22} color="#228BE6" />
              <div>
                <Title order={2} c="#1864AB">
                  現在地周辺のおすすめ
                </Title>
                <Text size="sm" c="dimmed">
                  距離・評価・営業状況をもとにおすすめ順で表示します。
                </Text>
              </div>
            </Group>

            <GenreFilter
              selectedGenre={selectedGenre}
              selectedRadius={selectedRadius}
              onSelectGenre={setSelectedGenre}
              onSelectRadius={setSelectedRadius}
            />
          </Stack>

          <Box style={{ flexShrink: 0, width: 380, height: 260 }}>
            <PlacesMap
              center={coordinates}
              places={places}
              selectedPlace={selectedPlace}
              onSelectPlace={setSelectedPlace}
            />
          </Box>
        </Group>
      </Card>

      {isLoadingLocation ? (
        <Card withBorder padding="lg" style={{ borderColor: "#E5E7EB" }}>
          <Group>
            <Loader color="brand" size="sm" />
            <IconCurrentLocation size={18} color="#228BE6" />
            <Text>現在地を取得しています...</Text>
          </Group>
        </Card>
      ) : null}

      {geolocationError ? (
        <Alert color="red" title="位置情報を取得できません" icon={<IconAlertCircle size={20} />}>
          <Stack gap="xs">
            <Text size="sm">{geolocationError}</Text>
            <Button
              color="brand"
              variant="outline"
              onClick={retry}
              leftSection={<IconRefresh size={16} />}
            >
              再試行
            </Button>
          </Stack>
        </Alert>
      ) : null}

      {placesQuery.isLoading ? (
        <Stack gap="sm">
          {["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4"].map((key) => (
            <Skeleton key={key} height={112} radius="md" />
          ))}
        </Stack>
      ) : null}

      {!placesQuery.isLoading && places.length === 0 && params ? (
        <Alert color="brand" title="候補が見つかりません" icon={<IconSearch size={20} />}>
          条件を変えて再検索してください。
        </Alert>
      ) : null}

      <Stack gap="sm">
        {places.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            isSelected={selectedPlace?.id === place.id}
            onSelect={() => setSelectedPlace(place)}
          />
        ))}
      </Stack>
    </Stack>
  );
};
