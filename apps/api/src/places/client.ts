import type { AppConfig } from "../shared/config";
import { ExternalApiError } from "../shared/errors";

type SearchPlacesParams = {
  lat: number;
  lng: number;
  radius: number;
  type?: string;
};

type GooglePlacesNearbyResponse = {
  places?: Array<{
    id?: string;
    displayName?: {
      text?: string;
    };
    primaryType?: string;
    types?: string[];
    location?: {
      latitude?: number;
      longitude?: number;
    };
    rating?: number;
    currentOpeningHours?: {
      openNow?: boolean;
    };
  }>;
};

export type RawPlace = {
  id: string;
  name: string;
  types: string[];
  location: {
    lat: number;
    lng: number;
  };
  rating: number | null;
  isOpen: boolean | null;
};

const PLACES_API_URL = "https://places.googleapis.com/v1/places:searchNearby";

const DEFAULT_FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.primaryType",
  "places.types",
  "places.location",
  "places.rating",
  "places.currentOpeningHours.openNow",
].join(",");

export class PlacesApiClient {
  constructor(private readonly config: AppConfig) {}

  async searchNearby(params: SearchPlacesParams): Promise<RawPlace[]> {
    const response = await fetch(PLACES_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": this.config.googleMapsApiKey,
        "X-Goog-FieldMask": DEFAULT_FIELD_MASK,
      },
      body: JSON.stringify({
        includedTypes: params.type ? [params.type] : undefined,
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: {
              latitude: params.lat,
              longitude: params.lng,
            },
            radius: params.radius,
          },
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new ExternalApiError(
        `Google Places API request failed with ${response.status}: ${body}`,
      );
    }

    const payload = (await response.json()) as GooglePlacesNearbyResponse;

    return (payload.places ?? [])
      .map((place): RawPlace | null => {
        const lat = place.location?.latitude;
        const lng = place.location?.longitude;

        if (!place.id || !place.displayName?.text || lat === undefined || lng === undefined) {
          return null;
        }

        return {
          id: place.id,
          name: place.displayName.text,
          types: place.types ?? (place.primaryType ? [place.primaryType] : []),
          location: {
            lat,
            lng,
          },
          rating: place.rating ?? null,
          isOpen: place.currentOpeningHours?.openNow ?? null,
        };
      })
      .filter((place): place is RawPlace => place !== null);
  }
}
