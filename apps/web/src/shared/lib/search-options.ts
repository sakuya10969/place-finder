export const genreOptions = [
  { label: "レストラン", value: "restaurant" },
  { label: "カフェ", value: "cafe" },
  { label: "コンビニ", value: "convenience_store" },
  { label: "薬局", value: "pharmacy" },
] as const;

export const radiusOptions = [
  { label: "500m", value: 500 },
  { label: "1km", value: 1000 },
  { label: "2km", value: 2000 },
] as const;

export const getGenreLabel = (type?: string) =>
  genreOptions.find((option) => option.value === type)?.label ?? "スポット";
