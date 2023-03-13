import { parseEtherSafe } from "@/helpers";
import SettledPage from "@/pages/settled";
import type { Meta } from "@storybook/react";
import { BigNumber } from "ethers/lib/ethers";
import {
  makeGraphqlHandlers,
  makeMockAssertions,
  makeMockRequests,
  makeMockRouterPathname,
} from "../mocks";
import { Template } from "./shared";
import type { PageStory } from "./types";

const meta: Meta = {
  title: "Pages/Settled",
};

export default meta;

/**
 * Queries should end up on the settled page when they have no action type
 * TODO: We might need to tighten this up later
 */
const SettledTemplate: PageStory = {
  ...Template,
  parameters: {
    nextjs: makeMockRouterPathname("/settled"),
    msw: {
      handlers: makeGraphqlHandlers({
        v1: {
          Ethereum: makeMockRequests({
            inputs: [
              {
                state: "Settled",
                settlementPrice: BigNumber.from(parseEtherSafe("123")),
              },
            ],
          }),
          Arbitrum: makeMockRequests({
            inputs: [
              {
                state: "Settled",
                settlementPrice: BigNumber.from(parseEtherSafe("123")),
              },
            ],
          }),
        },
        v2: {
          Ethereum: makeMockRequests({
            inputs: [
              {
                state: "Settled",
                settlementPrice: BigNumber.from(parseEtherSafe("123")),
              },
            ],
          }),
          Arbitrum: makeMockRequests({
            inputs: [
              {
                state: "Settled",
                settlementPrice: BigNumber.from(parseEtherSafe("123")),
              },
            ],
          }),
        },
        v3: {
          Ethereum: makeMockAssertions({
            inputs: [
              { settlementHash: "0x123", settlementResolution: "false" },
            ],
          }),
        },
      }),
    },
  },
};

export const Settled: PageStory = {
  ...SettledTemplate,
  args: {
    Component: SettledPage,
  },
};
