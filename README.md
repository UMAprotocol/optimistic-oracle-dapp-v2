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

For provider and subgraph URLs you **must** follow this pattern **in this order**.

> next_public-("provider" | "subgraph")-(version or "skinny")-(chainId)

correct examples:

- NEXT_PUBLIC_PROVIDER_V1_11155111
- NEXT_PUBLIC_SUBGRAPH_SKINNY_11155111
