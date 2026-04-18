import { t } from "elysia";
import { ScoredPlaceSchema } from "../recommendation/schema";

export const PlaceSearchQuerySchema = t.Object({
  lat: t.Numeric(),
  lng: t.Numeric(),
  radius: t.Optional(t.Numeric({ minimum: 1, maximum: 50000, default: 1000 })),
  type: t.Optional(t.String()),
});

export const PlaceSearchResponseSchema = t.Object({
  places: t.Array(ScoredPlaceSchema),
});

export type PlaceSearchQuery = typeof PlaceSearchQuerySchema.static;
export type PlaceSearchResponse = typeof PlaceSearchResponseSchema.static;
