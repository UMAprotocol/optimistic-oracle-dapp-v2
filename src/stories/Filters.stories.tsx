import { Filters } from "@/components";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Filters> = {
  component: Filters,
};

export default meta;

type Story = StoryObj<typeof Filters>;

export const Default: Story = {
  args: {
    expiry: {
      "Event-Based": {
        checked: false,
        count: 128,
      },
      "Time-Based": {
        checked: false,
        count: 128,
      },
    },
    projects: {
      Polymarket: {
        checked: false,
        count: 128,
      },
      UMA: {
        checked: false,
        count: 12,
      },
      "Cozy Finance": {
        checked: false,
        count: 50,
      },
      "stake.com": {
        checked: false,
        count: 0,
      },
    },
    chains: {
      Ethereum: {
        checked: false,
        count: 128,
      },
      Polygon: {
        checked: false,
        count: 12,
      },
      Optimism: {
        checked: false,
        count: 50,
      },
      Boba: {
        checked: false,
        count: 0,
      },
    },
  },
};
