import ProposePage from "@/pages/propose";
import type { Meta } from "@storybook/react";
import {
  makeGraphqlHandlers,
  makeMockAssertions,
  makeMockRequests,
  makeMockRouterPathname,
} from "../mocks";
import { Template } from "./shared";
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
  parameters: {
    nextjs: makeMockRouterPathname("/propose"),
    msw: {
      handlers: makeGraphqlHandlers({
        v1: {
          Ethereum: makeMockRequests({
            inputs: [{ state: "Requested" }],
          }),
        },
        v2: {
          Ethereum: makeMockRequests({
            inputs: [{ state: "Requested" }],
          }),
        },
        v3: {
          Ethereum: makeMockAssertions({
            count: 1,
          }),
        },
      }),
    },
  },
};

export const Propose: PageStory = {
  ...ProposeTemplate,
  args: {
    Component: ProposePage,
  },
};
