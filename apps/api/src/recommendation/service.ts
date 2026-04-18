import type { AppConfig } from "../shared/config";
import type { ScoredPlace } from "./schema";
import { createPlaceScorer } from "./scorer";

type RecommendationInput = Omit<ScoredPlace, "score">;

export const scorePlaces = (
  places: RecommendationInput[],
  weights: AppConfig["recommendationWeights"],
): ScoredPlace[] => {
  const maxDistance = places.reduce((currentMax, place) => Math.max(currentMax, place.distance), 0);
  const scorePlace = createPlaceScorer(weights);

  return places
    .map((place) => ({
      ...place,
      score: Number(scorePlace(place, maxDistance).toFixed(4)),
    }))
    .sort((left, right) => right.score - left.score);
};
