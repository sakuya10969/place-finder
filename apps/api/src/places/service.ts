import { scorePlaces } from "../recommendation/service";
import type { AppConfig } from "../shared/config";
import { PlacesApiClient } from "./client";
import type { PlaceSearchQuery, PlaceSearchResponse } from "./schema";

const EARTH_RADIUS_METERS = 6_371_000;

const toRadians = (value: number) => (value * Math.PI) / 180;

const haversineDistance = (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
) => {
  const latitudeDelta = toRadians(destination.lat - origin.lat);
  const longitudeDelta = toRadians(destination.lng - origin.lng);
  const originLat = toRadians(origin.lat);
  const destinationLat = toRadians(destination.lat);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(originLat) * Math.cos(destinationLat) * Math.sin(longitudeDelta / 2) ** 2;

  return Math.round(2 * EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export class PlacesService {
  private readonly client: PlacesApiClient;

  constructor(private readonly config: AppConfig) {
    this.client = new PlacesApiClient(config);
  }

  async searchPlaces(query: PlaceSearchQuery): Promise<PlaceSearchResponse> {
    const origin = { lat: Number(query.lat), lng: Number(query.lng) };
    const radius = query.radius === undefined ? 1000 : Number(query.radius);
    const places = await this.client.searchNearby({
      lat: origin.lat,
      lng: origin.lng,
      radius,
      type: query.type,
    });

    return {
      places: scorePlaces(
        places.map((place) => ({
          ...place,
          distance: haversineDistance(origin, place.location),
        })),
        this.config.recommendationWeights,
      ),
    };
  }
}
