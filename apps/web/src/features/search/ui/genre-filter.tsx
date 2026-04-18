import { Badge, Group, SegmentedControl, Stack, Text } from "@mantine/core";
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
      <Text size="sm" fw={700} c="#0F1F4B" mb="xs">
        ジャンル
      </Text>
      <Group gap="xs">
        <Badge
          color="brand"
          variant={selectedGenre === null ? "filled" : "outline"}
          size="lg"
          style={{ cursor: "pointer" }}
          onClick={() => onSelectGenre(null)}
        >
          すべて
        </Badge>
        {genreOptions.map((option) => (
          <Badge
            key={option.value}
            color="brand"
            variant={selectedGenre === option.value ? "filled" : "outline"}
            size="lg"
            style={{ cursor: "pointer" }}
            onClick={() => onSelectGenre(option.value)}
          >
            {option.label}
          </Badge>
        ))}
      </Group>
    </div>

    <div>
      <Text size="sm" fw={700} c="#0F1F4B" mb="xs">
        検索半径
      </Text>
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
