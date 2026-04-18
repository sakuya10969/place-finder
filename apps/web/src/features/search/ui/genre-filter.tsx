import { Badge, Group, SegmentedControl, Stack, Text } from "@mantine/core";
import { IconFilter, IconMapPin } from "@tabler/icons-react";
import { genreOptions, radiusOptions } from "../../../shared/lib/search-options";

type GenreFilterProps = {
  selectedGenre: string | null;
  selectedRadius: number;
  onSelectGenre: (genre: string | null) => void;
  onSelectRadius: (radius: number) => void;
};

export const GenreFilter = ({
  selectedGenre,
  selectedRadius,
  onSelectGenre,
  onSelectRadius,
}: GenreFilterProps) => (
  <Stack gap="md">
    <div>
      <Group gap={6} mb="xs">
        <IconFilter size={16} color="#1864AB" />
        <Text size="sm" fw={700} c="#1864AB">
          ジャンル
        </Text>
      </Group>
      <Group gap="xs">
        <Badge
          color="#228BE6"
          variant={selectedGenre === null ? "filled" : "outline"}
          size="lg"
          style={{ cursor: "pointer" }}
          onClick={() => onSelectGenre(null)}
          leftSection={<IconMapPin size={14} />}
        >
          すべて
        </Badge>
        {genreOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Badge
              key={option.value}
              color={option.color}
              variant={selectedGenre === option.value ? "filled" : "outline"}
              size="lg"
              style={{ cursor: "pointer" }}
              onClick={() => onSelectGenre(option.value)}
              leftSection={<Icon size={14} />}
            >
              {option.label}
            </Badge>
          );
        })}
      </Group>
    </div>

    <div>
      <Group gap={6} mb="xs">
        <IconMapPin size={16} color="#1864AB" />
        <Text size="sm" fw={700} c="#1864AB">
          検索半径
        </Text>
      </Group>
      <SegmentedControl
        color="brand"
        fullWidth
        value={String(selectedRadius)}
        onChange={(value) => onSelectRadius(Number(value))}
        data={radiusOptions.map((option) => ({
          label: option.label,
          value: String(option.value),
        }))}
      />
    </div>
  </Stack>
);
