import { AppShell, Burger, Drawer, Group, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { HomePage } from "../pages/home/ui/home-page";

export default function App() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const navigation = ["Search", "Map"];

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Navigation" padding="lg" hiddenFrom="sm">
        <Stack gap="md">
          {navigation.map((item) => (
            <Text key={item} c="#1A1A1A" fw={600}>
              {item}
            </Text>
          ))}
        </Stack>
      </Drawer>

      <AppShell header={{ height: 72 }} padding="lg">
        <AppShell.Header
          style={{
            background: "#0F1F4B",
            borderBottom: "none",
          }}
        >
          <Group justify="space-between" h="100%" px="lg">
            <Group gap="sm">
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" color="white" size="sm" />
              <div>
                <Title order={3} c="white">
                  Place Finder
                </Title>
                <Text size="sm" c="rgba(255,255,255,0.72)">
                  近くのスポットをおすすめ順で確認
                </Text>
              </div>
            </Group>
            <Group visibleFrom="sm" gap="lg">
              {navigation.map((item) => (
                <Text key={item} c="white" fw={600}>
                  {item}
                </Text>
              ))}
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
