import ProposePage from "@/pages/propose";
import type { Meta } from "@storybook/react";
import {
  defaultMockNotifications,
  handlersForAllPages,
  handlersWithNoData,
  makeGraphqlHandlers,
  makeMockRequestGraphEntities,
  makeMockRouterPathname,
} from "../mocks";
import { NotificationsDecorator, Template } from "./shared";
import type { PageStory } from "./types";

const meta: Meta = {
  title: "Pages/Propose",
};

export default meta;

/**
 * The only queries that show up on the propose page are the ones that are in `state` of `Requested`, which also means they have an `ActionType` of `propose`.
 *
 * Assertions are never shown on the propose page.
 */
const ProposeTemplate: PageStory = {
  ...Template,
  args: {
    Component: ProposePage,
  },
  parameters: {
    nextjs: makeMockRouterPathname("/propose"),
    msw: {
      handlers: handlersForAllPages,
    },
  },
};

export const Default: PageStory = {
  ...ProposeTemplate,
};

export const WithNoData: PageStory = {
  ...ProposeTemplate,
  parameters: {
    ...ProposeTemplate.parameters,
    msw: {
      handlers: handlersWithNoData,
    },
  },
};

export const WithNotifications: PageStory = {
  ...ProposeTemplate,
  args: {
    ...ProposeTemplate.args,
    notifications: defaultMockNotifications,
  },
  decorators: [NotificationsDecorator],
};

export const WithDifferentCurrencies: PageStory = {
  ...ProposeTemplate,
  parameters: {
    ...ProposeTemplate.parameters,
    msw: {
      handlers: makeGraphqlHandlers({
        v2: {
          Ethereum: makeMockRequestGraphEntities({
            inputs: [
              {
                state: "Requested",
                identifier: "USDC_CURRENCY",
                bond: "123000000",
              },
              {
                state: "Requested",
                identifier: "UMA_CURRENCY",
                currency: "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828",
                bond: "123000000000000000000",
              },
              {
                state: "Requested",
                identifier: "WETH_CURRENCY",
                currency: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                bond: "123000000000000000000",
              },
              {
                state: "Requested",
                identifier: "DAI_CURRENCY",
                currency: "0x6b175474e89094c44da98b954eedeac495271d0f",
                bond: "123000000000000000000",
              },
              {
                state: "Requested",
                identifier: "UNKNOWN_CURRENCY",
                currency: "0x2a98f128092aBBadef25d17910EbE15B8495D0c1",
                bond: "12300000000",
              },
            ],
          }),
        },
      }),
    },
  },
};
