import { t } from "elysia";

export const ScoredPlaceSchema = t.Object({
  id: t.String(),
  name: t.String(),
  types: t.Array(t.String()),
  location: t.Object({
    lat: t.Number(),
    lng: t.Number(),
  }),
  rating: t.Nullable(t.Number()),
  isOpen: t.Nullable(t.Boolean()),
  distance: t.Number(),
  score: t.Number(),
});

export type ScoredPlace = typeof ScoredPlaceSchema.static;
