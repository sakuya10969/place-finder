import type { TablerIcon } from "@tabler/icons-react";
import {
  IconBuildingStore,
  IconCoffee,
  IconFirstAidKit,
  IconMapPin,
  IconToolsKitchen2,
} from "@tabler/icons-react";

export type GenreOption = {
  label: string;
  value: string;
  color: string;
  icon: TablerIcon;
};

export const genreOptions: readonly GenreOption[] = [
  { label: "レストラン", value: "restaurant", color: "#E8590C", icon: IconToolsKitchen2 },
  { label: "カフェ", value: "cafe", color: "#D6A01E", icon: IconCoffee },
  { label: "コンビニ", value: "convenience_store", color: "#0CA678", icon: IconBuildingStore },
  { label: "薬局", value: "pharmacy", color: "#1C7ED6", icon: IconFirstAidKit },
] as const;

export const radiusOptions = [
  { label: "500m", value: 500 },
  { label: "1km", value: 1000 },
  { label: "2km", value: 2000 },
] as const;

export const defaultGenre: GenreOption = {
  label: "すべて",
  value: "",
  color: "#228BE6",
  icon: IconMapPin,
};

export const getGenreLabel = (type?: string) =>
  genreOptions.find((option) => option.value === type)?.label ?? "スポット";

export const getGenreColor = (type?: string) =>
  genreOptions.find((option) => option.value === type)?.color ?? "#228BE6";

export const getGenreIcon = (type?: string) =>
  genreOptions.find((option) => option.value === type)?.icon ?? IconMapPin;

export const getScoreColor = (score: number) => {
  if (score >= 0.7) return "#2B8A3E";
  if (score >= 0.4) return "#E8590C";
  return "#868E96";
};
