import { Table } from "@/components";
import { Meta, StoryObj } from "@storybook/react";
import { makeMockRequests } from "./mocks";

const meta: Meta<typeof Table> = {
  component: Table,
};

export default meta;

type Story = StoryObj<typeof Table>;

const mockRequests = makeMockRequests(10);

export const Propose: Story = {
  args: {
    page: "propose",
    requests: mockRequests,
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
