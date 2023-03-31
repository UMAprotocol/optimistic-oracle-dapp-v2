import { Button, Panel } from "@/components";
import type { PanelContextState } from "@/contexts";
import { PanelContext } from "@/contexts";
import type { OracleQueryUI } from "@/types";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { makeMockOracleQueryUI } from "./mocks";

const meta: Meta<typeof Panel> = {
  component: Panel,
};

export default meta;

type Story = StoryObj<PanelContextState>;

interface Props {
  Component: typeof Panel;
  content: OracleQueryUI | undefined;
}
function Wrapper({ Component, content }: Props) {
  const [panelOpen, setPanelOpen] = useState(true);

  if (!content) return null;

  return (
    <PanelContext.Provider
      value={{
        panelOpen,
        openPanel: () => setPanelOpen(true),
        closePanel: () => setPanelOpen(false),
        content: {
          ...content,
        },
      }}
    >
      <Button variant="primary" onClick={() => setPanelOpen(true)}>
        Open panel
      </Button>
      <Component />
    </PanelContext.Provider>
  );
}

const Template: Story = {
  render: (args) => <Wrapper Component={Panel} {...args} />,
};

export const VerifyWithDispute: Story = {
  ...Template,
  args: {
    content: makeMockOracleQueryUI({
      actionType: "dispute",
    }),
  },
};

export const VerifyWithSettle: Story = {
  ...Template,
  args: {
    content: makeMockOracleQueryUI({
      actionType: "settle",
    }),
  },
};

export const Propose: Story = {
  ...Template,
  args: {
    content: makeMockOracleQueryUI({
      actionType: "propose",
    }),
  },
};

export const Settled: Story = {
  ...Template,
  args: {
    content: makeMockOracleQueryUI({
      actionType: undefined,
    }),
  },
};

export const WithError: Story = {
  ...Template,
  args: {
    content: makeMockOracleQueryUI(),
  },
};

export const WithDifferentProject: Story = {
  ...Template,
  args: {
    content: makeMockOracleQueryUI({
      project: "Polymarket",
    }),
  },
};

export const WithDifferentInfoIcons: Story = {
  ...Template,
  args: {
    content: makeMockOracleQueryUI({
      oracleType: "Skinny Optimistic Oracle",
      chainId: 137,
      expiryType: "Time-based",
    }),
  },
};

export const WithDifferentCurrency: Story = {
  ...Template,
  args: {
    content: makeMockOracleQueryUI(),
  },
};

export const WithPrice: Story = {
  ...Template,
  args: {
    content: makeMockOracleQueryUI({
      oracleType: "Optimistic Oracle V1",
      valueText: "200",
    }),
  },
};
