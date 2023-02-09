import { Pagination } from "@/components";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Pagination> = {
  component: Pagination,
};

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {};
