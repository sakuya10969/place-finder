import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "brand",
  colors: {
    brand: [
      "#e7f5ff",
      "#d0ebff",
      "#a5d8ff",
      "#74c0fc",
      "#4dabf7",
      "#339af0",
      "#228be6",
      "#1c7ed6",
      "#1971c2",
      "#1864ab",
    ],
  },
  primaryShade: 6,
  fontFamily: "system-ui, sans-serif",
  defaultRadius: "md",
});
