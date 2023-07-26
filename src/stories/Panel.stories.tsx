import { Button, Panel } from "@/components";
import { PageContext, PanelContext } from "@/contexts";
import * as queryHooks from "@/hooks/queries";
import type { OracleQueryUI } from "@/types";
import type { PageName } from "@shared/types";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { createMock } from "storybook-addon-module-mock";
import { makeMockOracleQueryUI } from "./mocks";

const meta: Meta<typeof Panel> = {
  component: Panel,
};

export default meta;

type Args = {
  page: PageName;
};

type Story = StoryObj<Args>;

function Wrapper({ page }: Args) {
  const [panelOpen, setPanelOpen] = useState(true);

  return (
    <PageContext.Provider value={{ page, setPage: () => null }}>
      <PanelContext.Provider
        value={{
          panelOpen,
          id: "mock-id",
          setPanelOpen,
          setId: () => null,
          openPanel: () => setPanelOpen(true),
          closePanel: () => setPanelOpen(false),
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

export const Loading: Story = {
  ...Template,
};

export const VerifyWithDispute: Story = {
  ...Template,
  args: {
    page: "verify",
  },
  parameters: makePanelContentMock(
    makeMockOracleQueryUI({
      actionType: "dispute",
    }),
  ),
};

export const VerifyWithSettle: Story = {
  ...Template,
  args: {
    page: "verify",
  },
  parameters: makePanelContentMock(
    makeMockOracleQueryUI({
      actionType: "settle",
    }),
  ),
};

export const VerifyAlreadySettled: Story = {
  ...Template,
  args: {
    page: "verify",
  },
  parameters: makePanelContentMock(
    makeMockOracleQueryUI({
      actionType: undefined,
    }),
  ),
};

export const Propose: Story = {
  ...Template,
  args: {
    page: "propose",
  },
  parameters: makePanelContentMock(
    makeMockOracleQueryUI({
      actionType: "propose",
    }),
  ),
};

export const ProposeAlreadyProposedWithDispute: Story = {
  ...Template,
  args: {
    page: "propose",
  },
  parameters: makePanelContentMock(
    makeMockOracleQueryUI({
      actionType: "dispute",
    }),
  ),
};

export const ProposeAlreadyProposedWithSettle: Story = {
  ...Template,
  args: {
    page: "propose",
  },
  parameters: makePanelContentMock(
    makeMockOracleQueryUI({
      actionType: "settle",
    }),
  ),
};

export const ProposeAlreadySettled: Story = {
  ...Template,
  args: {
    page: "propose",
  },
  parameters: makePanelContentMock(
    makeMockOracleQueryUI({
      actionType: undefined,
    }),
  ),
};

export const Settled: Story = {
  ...Template,
  args: {},
  parameters: makePanelContentMock(
    makeMockOracleQueryUI({
      actionType: undefined,
    }),
  ),
};

export const WithError: Story = {
  ...Template,
  args: {},
  parameters: makePanelContentMock(makeMockOracleQueryUI()),
};

export const WithDifferentProject: Story = {
  ...Template,
  args: {},
  parameters: makePanelContentMock(
    makeMockOracleQueryUI({
      project: "Polymarket",
    }),
  ),
};

export const WithDifferentInfoIcons: Story = {
  ...Template,
  args: {},
  parameters: makePanelContentMock(
    makeMockOracleQueryUI({
      oracleType: "Skinny Optimistic Oracle",
      chainId: 137,
      expiryType: "Time-based",
    }),
  ),
};

export const WithDifferentCurrency: Story = {
  ...Template,
  args: {},
  parameters: makePanelContentMock(makeMockOracleQueryUI()),
};

export const WithPrice: Story = {
  ...Template,
  args: {},
  parameters: makePanelContentMock(
    makeMockOracleQueryUI({
      oracleType: "Optimistic Oracle V1",
      valueText: "200",
    }),
  ),
};

function makePanelContentMock(content?: OracleQueryUI) {
  return {
    moduleMock: {
      mock: () => {
        const mock = createMock(queryHooks, "useQueryWithId");
        mock.mockReturnValue(content);
        return mock;
      },
    },
  };
}
