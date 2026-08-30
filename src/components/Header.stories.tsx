import type { Meta, StoryObj } from "@storybook/react-vite";
import Header from "./Header";

const meta = {
  title: "Навигация/Header",
  component: Header,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MobileMenu: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
  play: async ({ canvas }) => {
    await canvas.getByRole("button", { name: "Открыть меню" }).click();
  },
};
