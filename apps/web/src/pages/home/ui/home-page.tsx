import {
  Alert,
  Button,
  Card,
  Group,
  Loader,
  SimpleGrid,
  Skeleton,
  Stack,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useGetApiPlacesSearch, useGetHealth } from "@place-finder/api-client/generated";
import type {
  GetApiPlacesSearch200PlacesItem,
  GetApiPlacesSearchParams,
} from "@place-finder/api-client/generated/model";
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
  const isMobile = useMediaQuery("(max-width: 48em)");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedRadius, setSelectedRadius] = useState(1000);
  const [selectedPlace, setSelectedPlace] = useState<GetApiPlacesSearch200PlacesItem | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const {
    coordinates,
    error: geolocationError,
    isLoading: isLoadingLocation,
    retry,
  } = useGeolocation();

  const params = useMemo<GetApiPlacesSearchParams | null>(() => {
    if (!coordinates) {
      return null;
    }

    return {
      lat: coordinates.lat,
      lng: coordinates.lng,
      radius: selectedRadius,
      type: selectedGenre ?? undefined,
    };
  }, [coordinates, selectedGenre, selectedRadius]);

  const healthQuery = useGetHealth({
    query: {
      staleTime: 30000,
      refetchInterval: 60000,
    },
  });

  const placesQuery = useGetApiPlacesSearch(params ?? { lat: 0, lng: 0 }, {
    query: {
      enabled: params !== null,
      staleTime: 30000,
    },
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

  const listPane = (
    <Stack gap="md">
      <Card withBorder padding="lg">
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={2} c="#0F1F4B">
                現在地周辺のおすすめ
              </Title>
              <Text size="sm" c="dimmed">
                距離・評価・営業状況をもとにおすすめ順で表示します。
              </Text>
            </div>
            <Text size="sm" c={healthQuery.data?.status === 200 ? "brand.9" : "red"}>
              API:{" "}
              {healthQuery.data?.status === 200
                ? "稼働中"
                : healthQuery.isLoading
                  ? "確認中"
                  : "要確認"}
            </Text>
          </Group>

          <GenreFilter
            selectedGenre={selectedGenre}
            selectedRadius={selectedRadius}
            onSelectGenre={setSelectedGenre}
            onSelectRadius={setSelectedRadius}
          />
        </Stack>
      </Card>

      {isLoadingLocation ? (
        <Card withBorder padding="lg">
          <Group>
            <Loader color="brand" size="sm" />
            <Text>現在地を取得しています...</Text>
          </Group>
        </Card>
      ) : null}

      {geolocationError ? (
        <Alert color="red" title="位置情報を取得できません">
          <Stack gap="xs">
            <Text size="sm">{geolocationError}</Text>
            <Button color="brand" variant="outline" onClick={retry}>
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
        <Alert color="brand" title="候補が見つかりません">
          条件を変えて再検索してください。
        </Alert>
      ) : null}

      <Stack gap="sm">
        {places.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            isSelected={selectedPlace?.id === place.id}
            onSelect={() => {
              setSelectedPlace(place);
              if (isMobile) {
                setMobileView("map");
              }
            }}
          />
        ))}
      </Stack>
    </Stack>
  );

  const mapPane = (
    <PlacesMap
      center={coordinates}
      places={places}
      selectedPlace={selectedPlace}
      onSelectPlace={setSelectedPlace}
    />
  );

  return (
    <Stack gap="lg">
      {isMobile ? (
        <Card withBorder padding="sm">
          <Tabs
            value={mobileView}
            onChange={(value) => setMobileView((value as "list" | "map") ?? "list")}
            color="brand"
          >
            <Tabs.List grow>
              <Tabs.Tab value="list">一覧</Tabs.Tab>
              <Tabs.Tab value="map">地図</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Card>
      ) : null}

      {isMobile ? (
        mobileView === "list" ? (
          listPane
        ) : (
          mapPane
        )
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" verticalSpacing="lg">
          {listPane}
          {mapPane}
        </SimpleGrid>
      )}
    </Stack>
  );
};
