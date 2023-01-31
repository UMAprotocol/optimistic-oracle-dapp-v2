import { Table } from "@/components";
import { desktopPageWidth } from "@/constants";
import { Meta, StoryObj } from "@storybook/react";
import { makeMockRequests } from "./mocks";

const meta: Meta<typeof Table> = {
  component: Table,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: desktopPageWidth, margin: "0 auto" }}>
        <Story />
      </div>
    ),
  ],
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
    requests: mockRequests,
  },
};

export const Settled: Story = {
  args: {
    page: "settled",
    requests: mockRequests,
  },
};
