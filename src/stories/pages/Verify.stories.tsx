import VerifyPage from "@/pages";
import type { Meta } from "@storybook/react";
import {
  defaultMockNotifications,
  handlersForAllPages,
  makeMockRouterPathname,
} from "../mocks";
import { NotificationsDecorator, Template } from "./shared";
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
  },
};

export const Verify: PageStory = {
  ...VerifyTemplate,
  args: {
    Component: VerifyPage,
  },
  parameters: {
    msw: {
      handlers: handlersForAllPages,
    },
  },
};

export const WithNotifications: PageStory = {
  ...Verify,
  args: {
    ...Verify.args,
    notifications: defaultMockNotifications,
  },
  decorators: [NotificationsDecorator],
};
