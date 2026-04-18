import { Alert, Card, Group, Stack, Text } from "@mantine/core";
import type { GetApiPlacesSearch200PlacesItem } from "@place-finder/api-client/generated/model";
import { IconAlertCircle, IconMap, IconStarFilled } from "@tabler/icons-react";
import { APIProvider, Map as GoogleMap, InfoWindow, Marker } from "@vis.gl/react-google-maps";
import { getGenreColor, getGenreIcon, getGenreLabel } from "../../../shared/lib/search-options";

type PlacesMapProps = {
  center: { lat: number; lng: number } | null;
  places: GetApiPlacesSearch200PlacesItem[];
  selectedPlace: GetApiPlacesSearch200PlacesItem | null;
  onSelectPlace: (place: GetApiPlacesSearch200PlacesItem | null) => void;
};

export const PlacesMap = ({ center, places, selectedPlace, onSelectPlace }: PlacesMapProps) => {
  if (!__GOOGLE_MAPS_API_KEY__) {
    return (
      <Card withBorder padding="lg" style={{ borderColor: "#E5E7EB" }}>
        <Alert color="red" title="Google Maps API キーが見つかりません" icon={<IconAlertCircle size={20} />}>
          フロントエンド表示には `GOOGLE_MAPS_API_KEY` が必要です。
        </Alert>
      </Card>
    );
  }

  if (!center) {
    return (
      <Card withBorder padding="lg" style={{ borderColor: "#E5E7EB" }}>
        <Alert color="brand" title="現在地を待機中" icon={<IconMap size={20} />}>
          現在地が取得できると、ここに地図を表示します。
        </Alert>
      </Card>
    );
  }

  return (
    <Card withBorder padding="sm" radius="md" style={{ borderColor: "#E5E7EB", height: "100%" }}>
      <APIProvider apiKey={__GOOGLE_MAPS_API_KEY__}>
        <GoogleMap
          defaultCenter={center}
          defaultZoom={14}
          mapId="place-finder-map"
          style={{ width: "100%", height: "100%", borderRadius: 12 }}
          gestureHandling="greedy"
        >
          <Marker position={center} title="現在地" />
          {places.map((place) => (
            <Marker
              key={place.id}
              position={place.location}
              title={place.name}
              onClick={() => onSelectPlace(place)}
            />
          ))}
          {selectedPlace ? (
            <InfoWindow position={selectedPlace.location} onCloseClick={() => onSelectPlace(null)}>
              <InfoWindowContent place={selectedPlace} />
            </InfoWindow>
          ) : null}
        </GoogleMap>
      </APIProvider>
    </Card>
  );
};

const InfoWindowContent = ({ place }: { place: GetApiPlacesSearch200PlacesItem }) => {
  const genreColor = getGenreColor(place.types[0]);
  const GenreIcon = getGenreIcon(place.types[0]);

  return (
    <Stack gap={4}>
      <Group gap={6}>
        <GenreIcon size={16} color={genreColor} />
        <Text fw={700}>{place.name}</Text>
      </Group>
      <Text size="sm" c={genreColor}>
        {getGenreLabel(place.types[0])}
      </Text>
      <Group gap={4}>
        <IconStarFilled size={14} color="#D6A01E" />
        <Text size="sm">評価: {place.rating?.toFixed(1) ?? "-"}</Text>
      </Group>
    </Stack>
  );
};
