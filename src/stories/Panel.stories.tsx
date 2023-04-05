import { Button, Panel } from "@/components";
import type { PanelContextState } from "@/contexts";
import { PageContext, PanelContext } from "@/contexts";
import type { PageName } from "@shared/types";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { makeMockOracleQueryUI } from "./mocks";

const meta: Meta<typeof Panel> = {
  component: Panel,
};

export default meta;

interface Args extends PanelContextState {
  page: PageName;
}

type Story = StoryObj<Args>;

function Wrapper({ content, page }: Args) {
  const [panelOpen, setPanelOpen] = useState(true);

  if (!content) return null;

  return (
    <PageContext.Provider value={{ page, setPage: () => null }}>
      <PanelContext.Provider
        value={{
          panelOpen,
          openPanel: () => Promise.resolve(setPanelOpen(true)),
          closePanel: () => Promise.resolve(setPanelOpen(false)),
          content,
        }}
      >
        <Button variant="primary" onClick={() => setPanelOpen(true)}>
          Open panel
        </Button>
        <Panel />
      </PanelContext.Provider>
    </PageContext.Provider>
  );
}

const Template: Story = {
  render: (args) => <Wrapper {...args} />,
};

export const VerifyWithDispute: Story = {
  ...Template,
  args: {
    page: "verify",
    content: makeMockOracleQueryUI({
      actionType: "dispute",
    }),
  },
};

export const VerifyWithSettle: Story = {
  ...Template,
  args: {
    page: "verify",
    content: makeMockOracleQueryUI({
      actionType: "settle",
    }),
  },
};

export const VerifyAlreadySettled: Story = {
  ...Template,
  args: {
    page: "verify",
    content: makeMockOracleQueryUI({
      actionType: undefined,
    }),
  },
};

export const Propose: Story = {
  ...Template,
  args: {
    page: "propose",
    content: makeMockOracleQueryUI({
      actionType: "propose",
    }),
  },
};

export const ProposeAlreadyProposedWithDispute: Story = {
  ...Template,
  args: {
    page: "propose",
    content: makeMockOracleQueryUI({
      actionType: "dispute",
    }),
  },
};

export const ProposeAlreadyProposedWithSettle: Story = {
  ...Template,
  args: {
    page: "propose",
    content: makeMockOracleQueryUI({
      actionType: "settle",
    }),
  },
};

export const ProposeAlreadySettled: Story = {
  ...Template,
  args: {
    page: "propose",
    content: makeMockOracleQueryUI({
      actionType: undefined,
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
