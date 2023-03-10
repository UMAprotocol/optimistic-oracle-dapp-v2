import type { OracleQueryUI } from "@/types";
import { addMinutes, format } from "date-fns";

export function makeMockOracleQueryUI(input?: Partial<OracleQueryUI>) {
  const defaultMockOracleQueryUI: OracleQueryUI = {
    id: `mock-id-${Math.random()}`,
    oracleAddress: "0xc43767f4592df265b4a9f1a398b97ff24f38c6a6",
    bond: "50000000000",
    tokenAddress: "0xc43767f4592df265b4a9f1a398b97ff24f38c6a6",
    chainId: 1,
    chainName: "Ethereum",
    oracleType: "Optimistic Oracle V1",
    project: "UMA",
    title:
      "More than 2.5 million people traveled through a TSA checkpoint on any day by December 31, 2022",
    ancillaryData: `0x713a207469746c653a204469642045756c657220676574206861636b65643f202c206465736372697074696f6e3a205761732074686572652061206861636b2c206275672c2075736572206572726f722c206f72206d616c66656173616e636520726573756c74696e6720696e2061206c6f7373206f72206c6f636b2d7570206f6620746f6b656e7320696e2045756c6572202868747470733a2f2f6170702e65756c65722e6669`,
    decodedAncillaryData: `q: title: Did Euler get hacked? , description: Was there a hack,
    bug, user error, or malfeasance resulting in a loss or lock-up
    of tokens in Euler (https://app.euler.finance/) at any point
    after Ethereum Mainnet block number 16175802? This will revert
    if a non-YES answer is proposed.`,
    timeUNIX: Math.floor(Date.now() / 1000),
    timeUTC: new Date().toUTCString(),
    timeMilliseconds: Date.now(),
    timeFormatted: format(new Date(), "Pp"),
    assertion: true,
    price: undefined,
    currency: "USDC",
    formattedBond: "50,000",
    formattedReward: "250,000",
    livenessEndsMilliseconds: addMinutes(new Date(), 53).getTime(),
    formattedLivenessEndsIn: "53 min 11 sec",
    actionType: "Dispute",
    action: () => alert("Dispute or propose or settle"),
    expiryType: "Event-based",
    moreInformation: [
      {
        title: "Requester",
        href: "https://goerli.etherscan.io/address/0xF40C3EF015B699cc70088c35efA2cC96aF5F8554",
        text: "0xF40C3EF015B699cc70088c35efA2cC96aF5F8554",
      },
      {
        title: "Identifier",
        href: "https://docs.umaproject.org/resources/approved-price-identifiers",
        text: "0xB40C3EF015B6919cc70088cF87",
      },
      {
        title: "UMIP",
        text: "UMIP-107",
        href: "https://github.com/UMAprotocol/UMIPs/blob/master/UMIPs/umip-107.md",
      },
    ],
    error: "",
    setError: () => undefined,
  };

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
        currency: "RY",
      },
      {
        title: "With chain name, oracle type and other known currency",
        currency: "ETH",
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
        title: "With project specified and price",
        project: "Cozy Finance",
        chainName: "Polygon",
        assertion: undefined,
        price: "123",
      },
      {
        title: "With expiry type and weird random currency and liveness ends",
        expiryType: "Time-based",
        currency: "RY",
        project: "UMA",
        chainName: "Ethereum",
        oracleType: "Skinny Optimistic Oracle",
        livenessEndsMilliseconds: Date.now() + 10_000,
      },
      {
        title: "With chain name, oracle type and other known currency",
        currency: "ETH",
        chainName: "Polygon",
        oracleType: "Skinny Optimistic Oracle",
      },
    ],
  });

export const settledMockOracleQueryUIs = (count = 3) =>
  makeMockOracleQueryUIs({
    count,
    inputForAll: { action: undefined, actionType: undefined },
    inputs: [
      {
        title: "With project specified and price",
        project: "Cozy Finance",
        assertion: undefined,
        price: "123",
      },
      {
        title: "With expiry type and weird random currency and liveness ends",
        expiryType: "Time-based",
        currency: "RY",
        livenessEndsMilliseconds: Date.now() + 10_000,
      },
      {
        title: "With chain name, oracle type and other known currency",
        currency: "ETH",
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
