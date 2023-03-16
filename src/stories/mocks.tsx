import { parseEtherSafe, utf8ToHex } from "@/helpers";
import type { OracleQueryUI } from "@/types";
import { chainNames } from "@shared/constants";
import type {
  Assertion,
  AssertionGraphEntity,
  PriceRequestGraphEntity,
} from "@shared/types";
import { makeQueryName } from "@shared/utils";
import { add, addMinutes, format, sub } from "date-fns";
import { BigNumber } from "ethers";
import type { GraphQLHandler, GraphQLRequest, GraphQLVariables } from "msw";
import { graphql } from "msw";

const defaultMockRequestGraphEntity = (
  number = Math.random()
): PriceRequestGraphEntity => {
  const identifier = "YES_OR_NO_QUERY";
  const time = makeUnixTimestamp("past", { hours: 1 });
  const ancillaryData = utf8ToHex(
    `q: Random test data #${number} ${Math.random()}}`
  );
  const id = `${identifier}-${time}-${ancillaryData}`;
  return {
    requester: "0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D",
    identifier,
    ancillaryData,
    id,
    time,
    currency: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    reward: makeEtherValueString(100),
    finalFee: makeEtherValueString(100),
    state: "Requested",
    proposer: null,
    proposedPrice: null,
    proposalExpirationTimestamp: null,
    disputer: null,
    settlementPrice: null,
    settlementPayout: null,
    settlementRecipient: null,
    requestTimestamp: null,
    requestBlockNumber: null,
    requestHash: null,
    requestLogIndex: null,
    proposalTimestamp: null,
    proposalBlockNumber: null,
    proposalHash: null,
    proposalLogIndex: null,
    disputeTimestamp: null,
    disputeBlockNumber: null,
    disputeHash: null,
    disputeLogIndex: null,
    settlementTimestamp: null,
    settlementBlockNumber: null,
    settlementHash: null,
    settlementLogIndex: null,
  };
};

export const defaultMockAssertionGraphEntity = (
  number = Math.ceil(Math.random() * 100)
): AssertionGraphEntity => {
  const identifier = "ASSERT_TRUTH";
  const assertionTimestamp = makeUnixTimestamp("past", { hours: 1 });
  const expirationTime = assertionTimestamp;
  const bond = BigNumber.from(1000000000000000).toString();
  const claim = utf8ToHex(`
    q: title: Paradoxical test assertion #${number}
    description: One of these statements is true.

    This sentence is false.
    The previous sentence is true.
  `);
  const currency = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const callbackRecipient = "0x0000000000000000000000000000000000000000";
  const escalationManager = "0x0000000000000000000000000000000000000000";
  const asserter = "0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D";
  const id = `${identifier}-${assertionTimestamp}-${claim}`;
  const domainId =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  const assertionId = `0x1234567890${number}`;
  return {
    identifier,
    id,
    assertionId,
    domainId,
    claim,
    asserter,
    callbackRecipient,
    escalationManager,
    caller: asserter,
    expirationTime,
    currency,
    bond,
    assertionTimestamp,
    assertionBlockNumber: "8624262",
    assertionHash:
      "0x9c06a3cf368e5ec0c43b5591a1d445bf39a1a20ca76d1d59e6afa3cfb9fde729",
    assertionLogIndex:
      "0x9c06a3cf368e5ec0c43b5591a1d445bf39a1a20ca76d1d59e6afa3cfb9fde729",
    disputer: null,
    settlementPayout: null,
    settlementRecipient: null,
    settlementResolution: true,
    disputeTimestamp: null,
    disputeBlockNumber: null,
    disputeHash: null,
    disputeLogIndex: null,
    settlementTimestamp: null,
    settlementBlockNumber: null,
    settlementHash: null,
    settlementLogIndex: null,
  };
};

export function makeMockRequestGraphEntities(
  args: {
    count?: number;
    inputs?: Partial<PriceRequestGraphEntity>[];
    inputForAll?: Partial<PriceRequestGraphEntity> | undefined;
  } = {}
) {
  const { count, inputs = [], inputForAll } = args;

  const length = count || inputs.length;

  const requests = Array.from({ length }, () =>
    defaultMockRequestGraphEntity()
  );

  if (inputForAll) {
    requests.forEach((request) => Object.assign(request, inputForAll));
  }

  requests.forEach((request, i) => {
    Object.assign(request, inputs[i]);
  });

  return requests;
}

export function makeMockAssertions(
  args: {
    count?: number;
    inputs?: Partial<Assertion>[];
    inputForAll?: Partial<Assertion> | undefined;
  } = {}
) {
  const { count, inputs = [], inputForAll } = args;

  const length = count || inputs.length;

  const requests = Array.from({ length }, () =>
    defaultMockAssertionGraphEntity()
  );

  if (inputForAll) {
    requests.forEach((request) => Object.assign(request, inputForAll));
  }

  requests.forEach((request, i) => {
    Object.assign(request, inputs[i]);
  });

  return requests;
}

const defaultMockOracleQueryUI: OracleQueryUI = {
  id: `mock-id-${Math.random()}`,
  oracleAddress: "0xA0Ae6609447e57a42c51B50EAe921D701823FFAe",
  bond: BigNumber.from(50000000000),
  reward: BigNumber.from(50000000000),
  tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  chainId: 1,
  chainName: "Ethereum",
  oracleType: "Optimistic Oracle V2",
  project: "UMA",
  title:
    "More than 2.5 million people traveled through a TSA checkpoint on any day by December 31, 2022",
  identifier: "YES_OR_NO_QUERY",
  queryTextHex: `0x713a207469746c653a204469642045756c657220676574206861636b65643f202c206465736372697074696f6e3a205761732074686572652061206861636b2c206275672c2075736572206572726f722c206f72206d616c66656173616e636520726573756c74696e6720696e2061206c6f7373206f72206c6f636b2d7570206f6620746f6b656e7320696e2045756c6572202868747470733a2f2f6170702e65756c65722e6669`,
  queryText: `q: title: Did Euler get hacked? , description: Was there a hack,
  bug, user error, or malfeasance resulting in a loss or lock-up
  of tokens in Euler (https://app.euler.finance/) at any point
  after Ethereum Mainnet block number 16175802? This will revert
  if a non-YES answer is proposed.`,
  timeUNIX: Math.floor(Date.now() / 1000),
  timeUTC: new Date().toUTCString(),
  timeMilliseconds: Date.now(),
  timeFormatted: format(new Date(), "Pp"),
  valueText: "123",
  formattedBond: "50,000",
  formattedReward: "250,000",
  livenessEndsMilliseconds: addMinutes(new Date(), 53).getTime(),
  formattedLivenessEndsIn: "53 min 11 sec",
  actionType: "dispute",
  expiryType: "Event-based",
  moreInformation: [
    {
      title: "Requester",
      href: "https://goerli.etherscan.io/address/0xF40C3EF015B699cc70088c35efA2cC96aF5F8554",
      text: "0xF40C3EF015B699cc70088c35efA2cC96aF5F8554",
    },
    {
      title: "Identifier",
      href: "https://docs.umaproject.org/resources/approved-valueText-identifiers",
      text: "0xB40C3EF015B6919cc70088cF87",
    },
    {
      title: "UMIP",
      text: "UMIP-107",
      href: "https://github.com/UMAprotocol/UMIPs/blob/master/UMIPs/umip-107.md",
    },
  ],
  approveBondSpendParams: null,
  proposePriceParams: null,
  disputePriceParams: null,
  settlePriceParams: null,
  disputeAssertionParams: null,
  settleAssertionParams: null,
};

export function makeMockOracleQueryUI(input?: Partial<OracleQueryUI>) {
  return {
    ...defaultMockOracleQueryUI,
    ...input,
  };
}

export function makeMockOracleQueryUIs({
  count,
  inputs = [],
  inputForAll,
}: {
  count: number;
  inputs?: Partial<OracleQueryUI>[];
  inputForAll?: Partial<OracleQueryUI>;
}) {
  const defaultMocks = Array.from({ length: count }, () =>
    makeMockOracleQueryUI()
  );

  if (inputForAll) {
    defaultMocks.forEach((mock) => {
      Object.assign(mock, inputForAll);
    });
  }

  defaultMocks.forEach((mock, i) => {
    Object.assign(mock, inputs[i]);
  });

  return defaultMocks;
}

export function makeRandomTitle() {
  const words = [
    "fun",
    "random",
    "title",
    "for",
    "a",
    "mock",
    "oracle",
    "query",
    "ui",
    "component",
    "in",
    "storybook",
    "and",
    "react",
    "typescript",
    "nextjs",
  ];

  const randomWords = Array.from(
    { length: words.length },
    () => words[Math.floor(Math.random() * words.length)]
  ).join(" ");

  return randomWords + ` ${Math.random() * 10000000}`;
}

export const proposeMockOracleQueryUIs = (count = 3) =>
  makeMockOracleQueryUIs({
    count,
    inputs: [
      { title: "With project specified", project: "Cozy Finance" },
      {
        title: "With expiry type and weird random currency",
        expiryType: "Time-based",
      },
      {
        title: "With chain name, oracle type and other known currency",
        chainName: "Polygon",
        oracleType: "Skinny Optimistic Oracle",
      },
    ],
  });

export const verifyMockOracleQueryUIs = (count = 3) =>
  makeMockOracleQueryUIs({
    count,
    inputs: [
      {
        title: "With project specified and valueText",
        project: "Cozy Finance",
        chainName: "Polygon",
        valueText: "123",
      },
      {
        title: "With expiry type and weird random currency and liveness ends",
        expiryType: "Time-based",
        project: "UMA",
        chainName: "Ethereum",
        oracleType: "Skinny Optimistic Oracle",
        livenessEndsMilliseconds: Date.now() + 10_000,
      },
      {
        title: "With chain name, oracle type and other known currency",
        chainName: "Polygon",
        oracleType: "Skinny Optimistic Oracle",
      },
    ],
  });

export const settledMockOracleQueryUIs = (count = 3) =>
  makeMockOracleQueryUIs({
    count,
    inputForAll: { actionType: undefined },
    inputs: [
      {
        title: "With project specified and valueText",
        project: "Cozy Finance",
        valueText: "123",
      },
      {
        title: "With expiry type and weird random currency and liveness ends",
        expiryType: "Time-based",
        livenessEndsMilliseconds: Date.now() + 10_000,
      },
      {
        title: "With chain name, oracle type and other known currency",
        chainName: "Polygon",
        oracleType: "Skinny Optimistic Oracle",
      },
    ],
  });

export const mockFilters = {
  expiry: {
    "Event-Based": {
      checked: false,
      count: 128,
    },
    "Time-Based": {
      checked: false,
      count: 128,
    },
  },
  projects: {
    Polymarket: {
      checked: false,
      count: 128,
    },
    UMA: {
      checked: false,
      count: 12,
    },
    "Cozy Finance": {
      checked: false,
      count: 50,
    },
    "stake.com": {
      checked: false,
      count: 0,
    },
  },
  chains: {
    Ethereum: {
      checked: false,
      count: 128,
    },
    Polygon: {
      checked: false,
      count: 12,
    },
    Optimism: {
      checked: false,
      count: 50,
    },
    Boba: {
      checked: false,
      count: 0,
    },
  },
};

export type Handler = GraphQLHandler<GraphQLRequest<GraphQLVariables>>;

export function makeGraphqlHandlers(args: {
  v1?: Record<string, PriceRequestGraphEntity[]>;
  v2?: Record<string, PriceRequestGraphEntity[]>;
  skinny?: Record<string, PriceRequestGraphEntity[]>;
  v3?: Record<string, AssertionGraphEntity[]>;
}) {
  const handlers: Handler[] = [];

  chainNames.forEach((chainName) => {
    handlers.push(
      graphql.query(
        makeQueryName("Optimistic Oracle V1", chainName),
        (_req, res, ctx) => {
          const data = { optimisticPriceRequests: args?.v1?.[chainName] };
          return res(ctx.data(data));
        }
      )
    );
    handlers.push(
      graphql.query(
        makeQueryName("Optimistic Oracle V2", chainName),
        (_req, res, ctx) => {
          const data = { optimisticPriceRequests: args?.v2?.[chainName] };
          return res(ctx.data(data));
        }
      )
    );
    handlers.push(
      graphql.query(
        makeQueryName("Optimistic Oracle V3", chainName),
        (_req, res, ctx) => {
          const data = { assertions: args?.v3?.[chainName] };
          return res(ctx.data(data));
        }
      )
    );
    handlers.push(
      graphql.query(
        makeQueryName("Skinny Optimistic Oracle", chainName),
        (_req, res, ctx) => {
          const data = { optimisticPriceRequests: args?.skinny?.[chainName] };
          return res(ctx.data(data));
        }
      )
    );
  });

  return handlers;
}

export const handlersForAllPages = makeGraphqlHandlers({
  v1: {
    Ethereum: makeMockRequestGraphEntities({
      inputs: [
        {
          identifier: "TEST_VERIFY",
          state: "Proposed",
          proposedPrice: makeEtherValueString(123),
        },
        {
          identifier: "TEST_VERIFY",
          state: "Disputed",
          proposedPrice: makeEtherValueString(123),
        },
        {
          state: "Requested",
          identifier: "TEST_PROPOSE",
          currency: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        },
        {
          state: "Requested",
          identifier: "TEST_PROPOSE",
          bond: makeEtherValueString(1230000),
        },
        {
          state: "Settled",
          settlementPrice: makeEtherValueString(123),
          identifier: "TEST_SETTLED",
        },
      ],
    }),
  },
  v2: {
    Ethereum: makeMockRequestGraphEntities({
      inputs: [
        {
          identifier: "TEST_VERIFY",
          state: "Proposed",
          proposedPrice: makeEtherValueString(456),
        },
        {
          identifier: "TEST_VERIFY",
          state: "Disputed",
          proposedPrice: makeEtherValueString(456),
        },
        {
          state: "Requested",
          identifier: "TEST_PROPOSE",
          bond: makeEtherValueString(123),
        },
        {
          state: "Settled",
          identifier: "TEST_SETTLED",
          settlementPrice: makeEtherValueString(123),
        },
      ],
    }),
    Polygon: makeMockRequestGraphEntities({
      inputs: [
        {
          state: "Requested",
          identifier: "MXNUSD",
          bond: makeEtherValueString(456),
          currency: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        },
        {
          state: "Requested",
          identifier: "TEST_PROPOSE",
          currency: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
          bond: makeEtherValueString(789),
        },
      ],
    }),
  },
  skinny: {
    Ethereum: makeMockRequestGraphEntities({
      inputs: [
        {
          identifier: "TEST_VERIFY",
          state: "Proposed",
          proposedPrice: makeEtherValueString(789),
        },
        {
          identifier: "TEST_VERIFY",
          state: "Disputed",
          proposedPrice: makeEtherValueString(789),
        },
        { state: "Requested", identifier: "TEST_PROPOSE" },
        {
          state: "Settled",
          identifier: "TEST_SETTLED",
          settlementPrice: makeEtherValueString(123),
        },
      ],
    }),
  },
  v3: {
    Ethereum: makeMockAssertions({
      inputs: [
        {},
        {
          settlementHash: null,
          expirationTime: makeUnixTimestamp("future", { days: 1 }),
          identifier: "TEST_VERIFY",
        },
        {
          settlementHash: null,
          expirationTime: makeUnixTimestamp("past", { days: 1 }),
          identifier: "TEST_VERIFY",
        },
        {
          settlementHash: "0x123",
          settlementResolution: false,
          identifier: "TEST_SETTLED",
        },
      ],
    }),
  },
});

export function makeMockRouterPathname(pathname = "") {
  return {
    router: {
      pathname,
    },
  };
}

export function makeUnixTimestamp(
  direction: "future" | "past",
  duration: Duration
) {
  const addOrSub = direction === "future" ? add : sub;

  return Math.floor(addOrSub(new Date(), duration).getTime() / 1000).toString();
}

export function makeEtherValueString(value: number) {
  return BigNumber.from(parseEtherSafe(value.toString())).toString();
}
