import { parseEtherSafe } from "@/helpers";
import VerifyPage from "@/pages";
import type { Meta } from "@storybook/react";
import { BigNumber } from "ethers/lib/ethers";
import {
  makeGraphqlHandlers,
  makeMockAssertions,
  makeMockRequests,
  makeMockRouterPathname,
  makeUnixTimestamp,
} from "../mocks";
import { Template } from "./shared";
import type { PageStory } from "./types";

const meta: Meta = {
  title: "Pages/Verify",
};

export default meta;

/**
 * Price requests are shown on the verify page in the following cases:
 *
 * 1. The request is in the `state` of `Proposed` which has the `ActionType` of `dispute`.
 *
 * 2. The request is in the `state` of `Disputed` or `Expired` which both have the `ActionType` of `settle`.
 *
 * Assertions are shown on the verify page in the following cases:
 *
 * 1. the assertion has no `settlementHash` and the `expirationTime` is in the _future_, which means it has the `ActionType` of `settle`.
 *
 * 1. the assertion has no `settlementHash` and the `expirationTime` is in the _past_, which means it has the `ActionType` of `dispute`.
 */
const VerifyTemplate: PageStory = {
  ...Template,
  parameters: {
    nextjs: makeMockRouterPathname(),
    msw: {
      handlers: makeGraphqlHandlers({
        v1: {
          Ethereum: makeMockRequests({
            inputs: [
              {
                identifier: "TEST_OO_V1",
                state: "Proposed",
                proposedPrice: BigNumber.from(parseEtherSafe("123")),
              },
              {
                identifier: "TEST_OO_V1",
                state: "Disputed",
                proposedPrice: BigNumber.from(parseEtherSafe("123")),
              },
            ],
          }),
        },
        v2: {
          Ethereum: makeMockRequests({
            inputs: [
              {
                identifier: "TEST_OO_V2",
                state: "Proposed",
                proposedPrice: BigNumber.from(parseEtherSafe("456")),
              },
              {
                identifier: "TEST_OO_V2",
                state: "Disputed",
                proposedPrice: BigNumber.from(parseEtherSafe("456")),
              },
            ],
          }),
        },
        v3: {
          Ethereum: makeMockAssertions({
            inputs: [
              {
                settlementHash: undefined,
                expirationTime: makeUnixTimestamp("future", { days: 1 }),
              },
              {
                settlementHash: undefined,
                expirationTime: makeUnixTimestamp("past", { days: 1 }),
              },
            ],
          }),
        },
      }),
    },
  },
};

export const Verify: PageStory = {
  ...VerifyTemplate,
  args: {
    Component: VerifyPage,
  },
};
