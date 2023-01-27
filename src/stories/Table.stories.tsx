import { Table } from "@/components";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Table> = {
  component: Table,
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Propose: Story = {
  args: {
    page: "propose",
  },
};

export const Verify: Story = {
  args: {
    page: "verify",
  },
};

export const Settled: Story = {
  args: {
    page: "settled",
  },
};
