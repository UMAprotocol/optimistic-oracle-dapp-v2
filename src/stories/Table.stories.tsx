import { Panel, Table } from "@/components";
import { PanelProvider } from "@/contexts";
import { Meta, StoryObj } from "@storybook/react";
import { makeMockOracleQueryUIs } from "./mocks";

const meta: Meta<typeof Table> = {
  component: Table,
  decorators: [
    (Story) => (
      <PanelProvider>
        <Panel />
        <Story />
      </PanelProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Propose: Story = {
  args: {
    page: "propose",
    rows: makeMockOracleQueryUIs({
      count: 3,
      inputs: [
        { title: "With project specified", project: "Cozy Finance" },
        {
          title: "With expiry type and weird random currency",
          expiryType: "Time-based",
          currency: "RY",
        },
        {
          title: "With chain name, oracle type and other known currency",
          currency: "ETH",
          chainName: "Polygon",
          oracleType: "Skinny Optimistic Oracle",
        },
      ],
    }),
  },
};

export const Verify: Story = {
  args: {
    page: "verify",
    rows: makeMockOracleQueryUIs({
      count: 3,
      inputs: [
        {
          title: "With project specified and price",
          project: "Cozy Finance",
          assertion: undefined,
          price: 123,
        },
        {
          title: "With expiry type and weird random currency and liveness ends",
          expiryType: "Time-based",
          currency: "RY",
          livenessEndsMilliseconds: Date.now() + 10_000,
        },
        {
          title: "With chain name, oracle type and other known currency",
          currency: "ETH",
          chainName: "Polygon",
          oracleType: "Skinny Optimistic Oracle",
        },
      ],
    }),
  },
};

export const Settled: Story = {
  args: {
    page: "settled",
    rows: makeMockOracleQueryUIs({
      count: 3,
      inputForAll: { action: undefined, actionType: undefined },
      inputs: [
        {
          title: "With project specified and price",
          project: "Cozy Finance",
          assertion: undefined,
          price: 123,
        },
        {
          title: "With expiry type and weird random currency and liveness ends",
          expiryType: "Time-based",
          currency: "RY",
          livenessEndsMilliseconds: Date.now() + 10_000,
        },
        {
          title: "With chain name, oracle type and other known currency",
          currency: "ETH",
          chainName: "Polygon",
          oracleType: "Skinny Optimistic Oracle",
        },
      ],
    }),
  },
};
