import { Filters } from "@/components";
import type { Meta, StoryObj } from "@storybook/react";
import { mockFilters } from "./mocks";

const meta: Meta<typeof Filters> = {
  component: Filters,
};

export default meta;

type Story = StoryObj<typeof Filters>;

export const Default: Story = {
  args: mockFilters,
};
