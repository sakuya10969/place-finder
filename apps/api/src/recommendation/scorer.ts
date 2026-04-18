import type { AppConfig } from "../shared/config";
import type { ScoredPlace } from "./schema";

type ScoreInput = Omit<ScoredPlace, "score">;

const MAX_RATING = 5;

export const createPlaceScorer = (weights: AppConfig["recommendationWeights"]) => {
  const totalWeight = weights.distance + weights.rating + weights.open;

  return (place: ScoreInput, maxDistance: number) => {
    const normalizedDistance =
      maxDistance <= 0 ? 1 : Math.max(0, 1 - Math.min(place.distance, maxDistance) / maxDistance);
    const normalizedRating =
      place.rating === null ? 0 : Math.max(0, Math.min(place.rating / MAX_RATING, 1));
    const openBonus = place.isOpen ? 1 : 0;

    const rawScore =
      normalizedDistance * weights.distance +
      normalizedRating * weights.rating +
      openBonus * weights.open;

    return totalWeight > 0 ? rawScore / totalWeight : 0;
  };
};
