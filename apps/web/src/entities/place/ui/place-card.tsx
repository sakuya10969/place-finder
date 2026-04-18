import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import type { GetApiPlacesSearch200PlacesItem } from "@place-finder/api-client/generated/model";
import { IconClock, IconMapPin, IconStarFilled } from "@tabler/icons-react";
import {
  getGenreColor,
  getGenreIcon,
  getGenreLabel,
  getScoreColor,
} from "../../../shared/lib/search-options";

type PlaceCardProps = {
  place: GetApiPlacesSearch200PlacesItem;
  isSelected: boolean;
  onSelect: () => void;
};

export const PlaceCard = ({ place, isSelected, onSelect }: PlaceCardProps) => {
  const genreColor = getGenreColor(place.types[0]);
  const GenreIcon = getGenreIcon(place.types[0]);
  const scoreColor = getScoreColor(place.score);

  return (
    <Card
      withBorder
      padding="lg"
      radius="md"
      onClick={onSelect}
      style={{
        cursor: "pointer",
        borderColor: isSelected ? "#228BE6" : "#E5E7EB",
        borderLeft: `4px solid ${genreColor}`,
        background: isSelected ? "#F8F9FA" : "#FFFFFF",
      }}
    >
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Group gap="xs" align="flex-start">
            <GenreIcon size={18} color={genreColor} style={{ marginTop: 2 }} />
            <div>
              <Text fw={700} c="#1A1A1A">
                {place.name}
              </Text>
              <Text size="sm" c={genreColor}>
                {getGenreLabel(place.types[0])}
              </Text>
            </div>
          </Group>
          <Badge
            color={place.isOpen ? "#2B8A3E" : "#868E96"}
            variant={place.isOpen ? "filled" : "outline"}
            leftSection={<IconClock size={12} />}
          >
            {place.isOpen ? "営業中" : "営業時間不明"}
          </Badge>
        </Group>

        <Group gap="xs">
          <Badge variant="filled" color={scoreColor} size="sm">
            ★ {place.score.toFixed(2)}
          </Badge>
          <Group gap={4}>
            <IconMapPin size={14} color="#228BE6" />
            <Text size="sm" c="#1A1A1A">
              {place.distance}m
            </Text>
          </Group>
          <Group gap={4}>
            <IconStarFilled size={14} color="#D6A01E" />
            <Text size="sm" c="#1A1A1A">
              {place.rating?.toFixed(1) ?? "-"}
            </Text>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
};
