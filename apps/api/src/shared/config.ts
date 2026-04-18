type RecommendationWeights = {
  distance: number;
  rating: number;
  open: number;
};

export type AppConfig = {
  googleMapsApiKey: string;
  recommendationWeights: RecommendationWeights;
};

const parseWeight = (value: string | undefined, fallback: number) => {
  if (value === undefined) {
    return fallback;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

export const getConfig = (): AppConfig => {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY ?? process.env.GOOGLE_PLACES_API_KEY;

  if (!googleMapsApiKey) {
    throw new Error("GOOGLE_MAPS_API_KEY or GOOGLE_PLACES_API_KEY must be defined");
  }

  return {
    googleMapsApiKey,
    recommendationWeights: {
      distance: parseWeight(process.env.RECOMMENDATION_WEIGHT_DISTANCE, 0.5),
      rating: parseWeight(process.env.RECOMMENDATION_WEIGHT_RATING, 0.35),
      open: parseWeight(process.env.RECOMMENDATION_WEIGHT_OPEN, 0.15),
    },
  };
};
