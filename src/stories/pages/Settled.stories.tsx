import SettledPage from "@/pages/settled";
import type { Meta } from "@storybook/react";
import { handlersForAllPages, makeMockRouterPathname } from "../mocks";
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
      handlers: handlersForAllPages,
    },
  },
};

export const Settled: PageStory = {
  ...SettledTemplate,
  args: {
    Component: SettledPage,
  },
};