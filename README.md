This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

-

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Env variables

### Subgraphs

Subgraph URLs are per oracle version because each version has its own schema.
The variable name encodes both the version and the chain:

```
NEXT_PUBLIC_SUBGRAPH_(V1 | V2 | V3 | SKINNY | MANAGED)_(CHAIN_ID)
```

Examples:

- `NEXT_PUBLIC_SUBGRAPH_V2_137`
- `NEXT_PUBLIC_SUBGRAPH_SKINNY_11155111`
- `NEXT_PUBLIC_SUBGRAPH_MANAGED_137`

### RPC providers

Provider URLs are **per chain** — one URL serves every oracle version on that
chain. The dapp resolves the URL for each chain in this order:

1. `NEXT_PUBLIC_PROVIDER_<chainId>` — explicit override (always wins).
2. `NEXT_PUBLIC_ALCHEMY_KEY` — a single Alchemy app key; the dapp composes the
   chain URL as `https://<alchemy-slug>.g.alchemy.com/v2/<key>` for every
   Alchemy-supported chain (see `alchemySlugByChainId` in
   `src/constants/env.ts`).
3. `NEXT_PUBLIC_QUICKNODE_KEY` — a QuickNode URL template containing the
   literal placeholder `{chain}`. The placeholder is replaced per chain with
   the QN subdomain segment (empty on Ethereum mainnet, `.matic` on Polygon,
   `.arbitrum-mainnet` on Arbitrum, etc — see `quicknodeSlugByChainId`).
   Example template:
   `https://your-endpoint{chain}.quiknode.pro/your-token/`

If both Alchemy and QuickNode universal keys are set, Alchemy wins. If neither
is set and no per-chain override exists, the chain has no provider and the
real-time updates path stays disabled for that chain.

Examples:

- `NEXT_PUBLIC_PROVIDER_137=https://my-custom-rpc.example.com/...`
- `NEXT_PUBLIC_ALCHEMY_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- `NEXT_PUBLIC_QUICKNODE_KEY=https://my-endpoint{chain}.quiknode.pro/my-token/`
