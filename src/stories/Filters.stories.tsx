import { Filters } from "@/components";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Filters> = {
  component: Filters,
};

export default meta;

type Story = StoryObj<typeof Filters>;

export const Default: Story = {
  args: {},
};
