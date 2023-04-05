import SettledPage from "@/pages/settled";
import type { Meta } from "@storybook/react";
import {
  defaultMockNotifications,
  handlersForAllPages,
  handlersWithNoData,
  makeMockRouterPathname,
} from "../mocks";
import { NotificationsDecorator, Template } from "./shared";
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
  args: {
    Component: SettledPage,
  },
  parameters: {
    nextjs: makeMockRouterPathname("/settled"),
    msw: {
      handlers: handlersForAllPages,
    },
  },
};

export const Default: PageStory = {
  ...SettledTemplate,
};

export const WithNoData: PageStory = {
  ...SettledTemplate,
  parameters: {
    ...SettledTemplate.parameters,
    msw: {
      handlers: handlersWithNoData,
    },
  },
};

export const WithNotifications: PageStory = {
  ...SettledTemplate,
  args: {
    ...SettledTemplate.args,
    notifications: defaultMockNotifications,
  },
  decorators: [NotificationsDecorator],
};
