import ProposePage from "@/pages/propose";
import type { Meta } from "@storybook/react";
import {
  defaultMockNotifications,
  handlersForAllPages,
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
  parameters: {
    nextjs: makeMockRouterPathname("/propose"),
    msw: {
      handlers: handlersForAllPages,
    },
  },
};

export const Propose: PageStory = {
  ...ProposeTemplate,
  args: {
    Component: ProposePage,
  },
};

export const WithNotifications: PageStory = {
  ...Propose,
  args: {
    ...Propose.args,
    notifications: defaultMockNotifications,
  },
  decorators: [NotificationsDecorator],
};
