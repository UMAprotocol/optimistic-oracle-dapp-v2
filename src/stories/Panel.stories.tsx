import { Panel } from "@/components";
import {
  defaultPanelContextState,
  PanelContext,
  PanelContextState,
} from "@/contexts";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Panel> = {
  component: Panel,
};

export default meta;

type Story = StoryObj<PanelContextState>;

const defaultArgs = {
  ...defaultPanelContextState,
  panelOpen: true,
};

export const Verify: Story = {
  args: {
    ...defaultArgs,
    page: "verify",
    content: {
      chainId: 1,
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
      assertion: true,
      price: undefined,
      currency: "USDC",
      bond: 500,
      reward: 250,
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
    },
  },
  render: (args) => (
    <PanelContext.Provider value={{ ...args }}>
      <Panel />
    </PanelContext.Provider>
  ),
};
