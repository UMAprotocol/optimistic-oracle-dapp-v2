# Optimistic Oracle dApp (deprecated)

oracle.uma.xyz has been deprecated. Every path on the site renders a single
static page pointing users to the [UMA Explorer](https://explorer.uma.xyz/).

The full dApp source, last deployed at commit
[`63b1533`](https://github.com/UMAprotocol/optimistic-oracle-dapp-v2/tree/63b15337a1d718c81269255885a61db976e3c151),
is still available in git history for anyone who wants to fork and run it.

## What is still served

- `/` (and any other path, via a fallback rewrite in `next.config.js`): the
  deprecation page.
- `/api/get-voting-info`: DVM vote phase and active request count, read over
  RPC. The Explorer calls this endpoint. Requires the `NODE_URLS` env variable
  (a JSON map of chain id to RPC URL).

No subgraphs are queried.

## Development

```bash
yarn dev
yarn lint
yarn test
```
