import { chainsById } from "@/constants";
import { utf8ToHex } from "@/helpers";
import type { OracleQueryUI } from "@/types";
import type {
  Assertion,
  AssertionGraphEntity,
  PriceRequestGraphEntity,
} from "@shared/types";
import { makeQueryName } from "@shared/utils";
import { addMinutes, format, subHours } from "date-fns";
import { BigNumber } from "ethers/lib/ethers";
import { graphql } from "msw";

const defaultMockRequest = (
  number = Math.ceil(Math.random() * 100)
): PriceRequestGraphEntity => {
  const identifier = utf8ToHex("YES_OR_NO_QUERY");
  const time = Math.floor(
    subHours(new Date(), Math.floor(Math.random() * 10)).getTime() / 1000
  ).toString();
  const ancillaryData =
    utf8ToHex(`q: title: Test Polymarket Request with Early Request Option #${number}
    description: This is a test for the type of Polymarket request that DOES have an option for early request.
  res_data: p1: 0, p2: 1, p3: 0.5, p4: -57896044618658097711785492504343953926634992332820282019728.792003956564819968
  Where p1 corresponds to No, p2 to a Yes, p3 to unknown, and p4 to an early request`);
  const id = `${identifier}-${time}-${ancillaryData}`;
  return {
    requester: "0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D",
    identifier,
    ancillaryData,
    id,
    time,
    currency: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    reward: "0",
    finalFee: "1500000000",
    proposer: "0x9a8f92a830a5cb89a3816e3d267cb7791c16b04d",
    proposedPrice: "316862804742802",
    proposalExpirationTimestamp: "1642655274",
    disputer: "0x9a8f92a830a5cb89a3816e3d267cb7791c16b04d",
    settlementPrice: "316860000000000",
    settlementPayout: "1500000000",
    settlementRecipient: "0x9a8f92a830a5cb89a3816e3d267cb7791c16b04d",
    state: "Proposed",
    requestTimestamp: "1642650989",
    requestBlockNumber: "2455264",
    requestHash:
      "0xb5a334e783043c2429c5543bb6c8d782a977c7f369e0b1af226ac78cb39406a3",
    requestLogIndex: "0",
    proposalTimestamp: "1642651674",
    proposalBlockNumber: "2455506",
    proposalHash:
      "0x99ede462af14b39b3e861d96d8fdbb45b17aac38d35a0a0e9f0337ba929b7b9a",
    proposalLogIndex: "2",
    disputeTimestamp: "1642651899",
    disputeBlockNumber: "2455536",
    disputeHash:
      "0x9bf32010749d937c55747bff6aa6821dbe144f822d99b869b9061f432c42a502",
    disputeLogIndex: "8",
    settlementTimestamp: "1643656746",
    settlementBlockNumber: "3060556",
    settlementHash:
      "0x5a10991fece83a983f3bef139c9bf351aa4a279e4970991c2d26279376a68a4c",
    settlementLogIndex: "1",
  };
};

export const defaultMockAssertion = (
  number = Math.ceil(Math.random() * 100)
): AssertionGraphEntity => {
  return {
    identifier: "ASSERT_TRUTH",
    id: `0x16670def63d2b32468377efd92ed1b2b0c993381a70fc0e818d46c63594b75a2${number}`,
    assertionId:
      "0x16670def63d2b32468377efd92ed1b2b0c993381a70fc0e818d46c63594b75a2",
    domainId:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    claim: "0x5465737420617373657274696f6e",
    asserter: "0xdf4e039ebc83eea87981930917a10a0f27ae64a1",
    callbackRecipient: "0x0000000000000000000000000000000000000000",
    escalationManager: "0x0000000000000000000000000000000000000000",
    caller: "0xdf4e039ebc83eea87981930917a10a0f27ae64a1",
    expirationTime: "1674487332",
    currency: "0x07865c6e87b9f70255377e024ace6630c1eaa37f",
    bond: BigNumber.from(0),
    disputer: "0x9a8f92a830a5cb89a3816e3d267cb7791c16b04d",
    settlementPayout: null,
    settlementRecipient: "0xdf4e039ebc83eea87981930917a10a0f27ae64a1",
    settlementResolution: "true",
    assertionTimestamp: "1674480132",
    assertionBlockNumber: "8362232",
    assertionHash:
      "0x8578a249f804d5fa99736424ab26c70ba162752f582ed7e22d9d4f694a7f750c",
    assertionLogIndex: "55",
    disputeTimestamp: "1674480300",
    disputeBlockNumber: "8362243",
    disputeHash:
      "0x8a79946f9481929b8b1bcaf86b9b485c8fad4055d0d679a83bb81094ba9e502f",
    disputeLogIndex: "136",
    settlementTimestamp: "1674482580",
    settlementBlockNumber: "8362404",
    settlementHash:
      "0x9509a53eeddac864f3d25711ac3879618e20be664be7fead1f1473c481132801",
    settlementLogIndex: "81",
  };
};

export function makeMockRequests(
  {
    count = 5,
    inputs = [],
    inputForAll,
  }: {
    count: number;
    inputs: Partial<Request>[];
    inputForAll: Partial<Request> | undefined;
  } = {
    count: 5,
    inputs: [],
    inputForAll: undefined,
  }
) {
  const requests = Array.from({ length: count }, (_, i) =>
    defaultMockRequest(i)
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
  {
    count = 5,
    inputs = [],
    inputForAll,
  }: {
    count: number;
    inputs: Partial<Assertion>[];
    inputForAll: Partial<Assertion> | undefined;
  } = {
    count: 5,
    inputs: [],
    inputForAll: undefined,
  }
) {
  const requests = Array.from({ length: count }, () => defaultMockAssertion());

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
  tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  chainId: 1,
  chainName: "Ethereum",
  oracleType: "Optimistic Oracle V2",
  project: "UMA",
  title:
    "More than 2.5 million people traveled through a TSA checkpoint on any day by December 31, 2022",
  identifier: "0x0000000",
  decodedIdentifier: "0x0000000",
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

export function makeQueryNamesOnAllChains(version: 1 | 2 | 3) {
  return Object.keys(chainsById).map((chainId) =>
    makeQueryName(`Optimistic Oracle V${version}`, Number(chainId))
  );
}

export function makeQueryNamesForAllOracles() {
  return [
    ...makeQueryNamesOnAllChains(1),
    ...makeQueryNamesOnAllChains(2),
    ...makeQueryNamesOnAllChains(3),
  ];
}

type VersionAndChain = {
  version: 1 | 2 | 3;
  chainId: number;
  requests?: PriceRequestGraphEntity[];
  assertions?: AssertionGraphEntity[];
};
export function makeRequestHandlerForOraclesAndChains(
  versionsAndChains: VersionAndChain[]
) {
  const withMockQueryNames = versionsAndChains.map((versionAndChain) => {
    const { version, chainId, assertions, requests } = versionAndChain;
    if ((version === 1 || version === 2) && assertions) {
      throw new Error("Cannot have assertions on OO V1 or V2");
    }
    if (version === 3 && requests) {
      throw new Error("Cannot have requests on OO V3");
    }
    return {
      ...versionAndChain,
      mockQueryName: makeQueryName(`Optimistic Oracle V${version}`, chainId),
    };
  });
  const assertionsToMock = withMockQueryNames.filter(({ mockQueryName }) =>
    mockQueryName.includes("V3")
  );
  const optimisticPriceRequestsToMock = withMockQueryNames.filter(
    ({ mockQueryName }) => !mockQueryName.includes("V3")
  );
  return makeQueryNamesForAllOracles().map((queryName) =>
    graphql.query(queryName, (_req, res, ctx) => {
      const isAssertions = queryName.includes("V3");
      const optimisticPriceRequests: PriceRequestGraphEntity[] = [];
      const assertions: AssertionGraphEntity[] = [];
      if (isAssertions) {
        const mock = assertionsToMock.find(
          ({ mockQueryName }) => mockQueryName === queryName
        );
        if (mock) {
          assertions.push(...(mock?.assertions ?? []));
        }
      } else {
        const mock = optimisticPriceRequestsToMock.find(
          ({ mockQueryName }) => mockQueryName === queryName
        );
        if (mock) {
          optimisticPriceRequests.push(...(mock.requests ?? []));
        }
      }
      const data = isAssertions ? { assertions } : { optimisticPriceRequests };
      return res(ctx.data(data));
    })
  );
}

export function makeMockRouterPathname(pathname = "") {
  return {
    router: {
      pathname,
    },
  };
}
