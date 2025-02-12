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

// TODO: import via wagmi after upgrading to v2 (Blast is not available in v1).
export const blast = defineChain({
  id: 81457,
  name: "Blast",
  network: "blast",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://rpc.blast.io"] },
    public: { http: ["https://rpc.blast.io"] },
  },
  blockExplorers: {
    default: {
      name: "Blastscan",
      url: "https://blastscan.io",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 212929,
    },
  },
});

export const blastSepolia = defineChain({
  id: 168587773,
  name: "Blast Sepolia",
  network: "blastSepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://sepolia.blast.io"] },
    public: { http: ["https://sepolia.blast.io"] },
  },
  blockExplorers: {
    default: {
      name: "Blastscan",
      url: "https://sepolia.blastscan.io/",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 756690,
    },
  },
  testnet: true,
});

export const storyOdyssey = defineChain({
  id: 1516,
  name: "Story Odyssey",
  network: "storyOdyssey",
  nativeCurrency: {
    decimals: 18,
    name: "IP",
    symbol: "IP",
  },
  rpcUrls: {
    default: { http: ["https://rpc.odyssey.storyrpc.io/"] },
    public: { http: ["https://rpc.odyssey.storyrpc.io/"] },
  },
  blockExplorers: {
    default: {
      name: "Storyscan",
      url: "https://odyssey-testnet-explorer.storyscan.xyz",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 14880,
    },
  },
  testnet: true,
});

export const story = defineChain({
  id: 1514,
  name: "Story",
  network: "story",
  nativeCurrency: {
    decimals: 18,
    name: "IP",
    symbol: "IP",
  },
  rpcUrls: {
    default: { http: ["http://mainnet.storyrpc.io/"] },
    public: { http: ["http://mainnet.storyrpc.io/"] },
  },
  blockExplorers: {
    default: {
      name: "Storyscan",
      url: "https://dev-mainnet.storyscan.xyz",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 1000, // TODO: confirm deploy block
    },
  },
  testnet: false,
});
