import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import type { GetApiPlacesSearch200PlacesItem } from "@place-finder/api-client/generated/model";
import { IconMapPin, IconStar } from "@tabler/icons-react";
import { getGenreLabel } from "../../../shared/lib/search-options";

type PlaceCardProps = {
  place: GetApiPlacesSearch200PlacesItem;
  isSelected: boolean;
  onSelect: () => void;
};

export const PlaceCard = ({ place, isSelected, onSelect }: PlaceCardProps) => (
  <Card
    withBorder
    padding="lg"
    radius="md"
    onClick={onSelect}
    style={{
      cursor: "pointer",
      borderColor: isSelected ? "#1A3C8A" : "#D9D9D9",
      background: "#FFFFFF",
    }}
  >
    <Stack gap="sm">
      <Group justify="space-between" align="flex-start">
        <div>
          <Text fw={700} c="#1A1A1A">
            {place.name}
          </Text>
          <Text size="sm" c="dimmed">
            {getGenreLabel(place.types[0])}
          </Text>
        </div>
        <Badge
          color={place.isOpen ? "brand" : "gray"}
          variant={place.isOpen ? "filled" : "outline"}
        >
          {place.isOpen ? "営業中" : "営業時間不明"}
        </Badge>
      </Group>

      <Group gap="xs">
        <Badge variant="outline" color="brand">
          #{place.score.toFixed(2)}
        </Badge>
        <Group gap={4}>
          <IconMapPin size={14} color="#1A3C8A" />
          <Text size="sm" c="#1A1A1A">
            {place.distance}m
          </Text>
        </Group>
        <Group gap={4}>
          <IconStar size={14} color="#1A3C8A" />
          <Text size="sm" c="#1A1A1A">
            {place.rating?.toFixed(1) ?? "-"}
          </Text>
        </Group>
      </Group>
    </Stack>
  </Card>
);
