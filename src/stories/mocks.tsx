import { OracleQueryUI } from "@/types";
import { MockConnector } from "@wagmi/core/connectors/mock";
import { addMinutes, format } from "date-fns";
import { Wallet } from "ethers";
import { createClient } from "wagmi";
import { chains, provider } from "../pages/_app";

export const mockAddress =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

export const mockWallet = new Wallet(mockAddress);

export const mockWagmiClient = createClient({
  autoConnect: true,
  provider,
  connectors: [
    new MockConnector({
      chains,
      options: {
        signer: mockWallet,
        chainId: 1,
      },
    }),
  ],
});

export function makeMockOracleQueryUI(input?: Partial<OracleQueryUI>) {
  const defaultMockOracleQueryUI: OracleQueryUI = {
    id: `mock-id-${Math.random()}`,
    chainId: 1,
    chainName: "Ethereum",
    oracleType: "Optimistic Asserter",
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
