import type { Meta, StoryObj } from "@storybook/react-vite";
import CaseSlider from "./CaseSlider";

const meta = {
  title: "Секции/Слайдер кейсов",
  component: CaseSlider,
  parameters: { layout: "padded" },
} satisfies Meta<typeof CaseSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
