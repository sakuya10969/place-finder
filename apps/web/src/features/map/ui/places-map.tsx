import { Alert, Card, Stack, Text } from "@mantine/core";
import type { GetApiPlacesSearch200PlacesItem } from "@place-finder/api-client/generated/model";
import { APIProvider, Map as GoogleMap, InfoWindow, Marker } from "@vis.gl/react-google-maps";
import { getGenreLabel } from "../../../shared/lib/search-options";

type PlacesMapProps = {
  center: { lat: number; lng: number } | null;
  places: GetApiPlacesSearch200PlacesItem[];
  selectedPlace: GetApiPlacesSearch200PlacesItem | null;
  onSelectPlace: (place: GetApiPlacesSearch200PlacesItem | null) => void;
};

export const PlacesMap = ({ center, places, selectedPlace, onSelectPlace }: PlacesMapProps) => {
  if (!__GOOGLE_MAPS_API_KEY__) {
    return (
      <Card withBorder padding="lg">
        <Alert color="red" title="Google Maps API キーが見つかりません">
          フロントエンド表示には `GOOGLE_MAPS_API_KEY` が必要です。
        </Alert>
      </Card>
    );
  }

  if (!center) {
    return (
      <Card withBorder padding="lg">
        <Alert color="brand" title="現在地を待機中">
          現在地が取得できると、ここに地図を表示します。
        </Alert>
      </Card>
    );
  }

  return (
    <Card withBorder padding="sm" radius="md" style={{ height: "100%" }}>
      <APIProvider apiKey={__GOOGLE_MAPS_API_KEY__}>
        <GoogleMap
          defaultCenter={center}
          defaultZoom={14}
          mapId="place-finder-map"
          style={{ width: "100%", minHeight: 420, borderRadius: 12 }}
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
              <Stack gap={4}>
                <Text fw={700}>{selectedPlace.name}</Text>
                <Text size="sm">{getGenreLabel(selectedPlace.types[0])}</Text>
                <Text size="sm">評価: {selectedPlace.rating?.toFixed(1) ?? "-"}</Text>
              </Stack>
            </InfoWindow>
          ) : null}
        </GoogleMap>
      </APIProvider>
    </Card>
  );
};
