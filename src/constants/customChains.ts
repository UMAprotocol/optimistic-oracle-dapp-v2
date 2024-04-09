import { defineChain } from "viem";

// TODO: import via wagmi after upgrading to v2 (Amoy is not available in v1).
export const polygonAmoy = defineChain({
  id: 80002,
  name: "Polygon Amoy",
  network: "polygonAmoy",
  nativeCurrency: {
    decimals: 18,
    name: "MATIC",
    symbol: "MATIC",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-amoy.polygon.technology"],
    },
    public: {
      http: ["https://rpc-amoy.polygon.technology"],
    },
  },
  blockExplorers: {
    default: { name: "OK LINK", url: "https://www.oklink.com/amoy" },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 3127388,
    },
  },
  testnet: true,
});
