import type { Preview } from "@storybook/react-vite";
import "@fontsource-variable/manrope";
import "../src/styles/global.css";

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "canvas", values: [{ name: "canvas", value: "#ffffff" }] },
    a11y: { test: "todo" },
  },
};

export default preview;
