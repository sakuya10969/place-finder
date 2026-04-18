import { AppShell, Burger, Drawer, Group, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCompass, IconCurrentLocation } from "@tabler/icons-react";
import { HomePage } from "../pages/home/ui/home-page";

export default function App() {
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Navigation" padding="lg" hiddenFrom="sm">
        <Stack gap="md">
          <Text c="#1A1A1A" fw={600}>Search</Text>
          <Text c="#1A1A1A" fw={600}>Map</Text>
        </Stack>
      </Drawer>

      <AppShell header={{ height: 72 }} padding="lg">
        <AppShell.Header
          style={{
            background: "#1864AB",
            borderBottom: "none",
          }}
        >
          <Group justify="space-between" h="100%" px="lg">
            <Group gap="sm">
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" color="white" size="sm" />
              <IconCompass size={28} color="white" />
              <div>
                <Title order={3} c="white">
                  Place Finder
                </Title>
                <Text size="xs" c="rgba(255,255,255,0.72)">
                  近くのスポットをおすすめ順で確認
                </Text>
              </div>
            </Group>
            <Group gap="xs">
              <IconCurrentLocation size={20} color="rgba(255,255,255,0.8)" />
              <Text size="sm" c="rgba(255,255,255,0.8)" visibleFrom="sm">
                現在地取得中
              </Text>
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Main
          style={{
            background: "#FFFFFF",
            minHeight: "calc(100vh - 72px)",
          }}
        >
          <HomePage />
        </AppShell.Main>
      </AppShell>
    </>
  );
}
