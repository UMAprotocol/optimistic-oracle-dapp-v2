import { OracleQueryList, Panel } from "@/components";
import { PanelProvider } from "@/contexts";
import type { Meta, StoryObj } from "@storybook/react";
import {
  makeMockOracleQueryUIs,
  makeRandomTitle,
  proposeMockOracleQueryUIs,
  settledMockOracleQueryUIs,
  verifyMockOracleQueryUIs,
} from "./mocks";

const meta: Meta = {
  component: OracleQueryList,
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

type Story = StoryObj<typeof OracleQueryList>;

export const Propose: Story = {
  args: {
    page: "propose",
    items: proposeMockOracleQueryUIs,
  },
};

export const Verify: Story = {
  args: {
    page: "verify",
    items: verifyMockOracleQueryUIs,
  },
};

export const Settled: Story = {
  args: {
    page: "settled",
    items: settledMockOracleQueryUIs,
  },
};

export const WithMany: Story = {
  args: {
    page: "propose",
    items: makeMockOracleQueryUIs({
      count: 100,
      inputs: Array.from({ length: 100 }, () => ({
        title: makeRandomTitle(),
      })),
    }),
  },
};

export const ProposeIsLoading: Story = {
  args: {
    page: "propose",
    items: [],
    isLoading: true,
  },
};

export const VerifyIsLoading: Story = {
  args: {
    page: "verify",
    items: [],
    isLoading: true,
  },
};

export const SettledIsLoading: Story = {
  args: {
    page: "settled",
    items: [],
    isLoading: true,
  },
};
