import { utf8ToHex } from "@/helpers";
import VerifyPage from "@/pages";
import type { Meta } from "@storybook/react";
import {
  defaultMockNotifications,
  handlersForAllPages,
  handlersWithNoData,
  makeEtherValueString,
  makeGraphqlHandlers,
  makeMockRequestGraphEntities,
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
  args: {
    Component: VerifyPage,
  },
  parameters: {
    nextjs: makeMockRouterPathname(),
    msw: {
      handlers: handlersForAllPages,
    },
  },
};

export const Default: PageStory = {
  ...VerifyTemplate,
};

export const WithNoData: PageStory = {
  ...VerifyTemplate,
  parameters: {
    ...VerifyTemplate.parameters,
    msw: {
      handlers: handlersWithNoData,
    },
  },
};

export const WithNotifications: PageStory = {
  ...VerifyTemplate,
  args: {
    ...VerifyTemplate.args,
    notifications: defaultMockNotifications,
  },
  decorators: [NotificationsDecorator],
};

const longLoremWords =
  "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque, veritatis, optio expedita consequatur fugiat eveniet recusandae quidem, nemo magni iusto facilis sapiente. Laudantium quam ut ab exercitationem. Veritatis quidem ratione aliquam dolorum id dolores, deserunt mollitia reiciendis eos non quisquam praesentium et sint dolore. Quibusdam assumenda laboriosam et, placeat corporis aspernatur deserunt iusto aperiam labore officia, possimus dolor tempora illo at blanditiis deleniti ullam officiis aut explicabo? Facilis eveniet quo praesentium natus totam nam provident obcaecati officia! Accusamus, sed unde eaque atque deleniti itaque qui, vel eos tempora ea facere quibusdam totam, quia alias? Quod excepturi et voluptas necessitatibus consectetur.";

export const WithLongTitles: PageStory = {
  ...VerifyTemplate,
  parameters: {
    ...VerifyTemplate.parameters,
    msw: {
      handlers: makeGraphqlHandlers({
        v1: {
          Ethereum: makeMockRequestGraphEntities({
            inputs: [
              {
                identifier: "YES_OR_NO_QUERY",
                ancillaryData: utf8ToHex(`q: title: ${longLoremWords}
                description: This is a test for the type of Polymarket request that DOES have an option for early request.
                res_data: p1: 0, p2: 1, p3: 0.5, p4: -57896044618658097711785492504343953926634992332820282019728.792003956564819968
                Where p1 corresponds to Something, p2 to Another, p3 to unknown, and p4 to an early request`),
                state: "Proposed",
                proposedPrice: makeEtherValueString(123),
              },
            ],
          }),
        },
      }),
    },
  },
};
