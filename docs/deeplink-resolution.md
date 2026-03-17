# Deeplink Resolution

## Problem

Deeplinks like `?transactionHash=0x...&eventIndex=239&chainId=137&oracleType=Optimistic+Oracle+V2` were broken after the per-page data loading refactor. The old `useQueryInSearchParams` hook searched the in-memory `all` lookup table, which only contained data for the current page's state (e.g. verify). A settled request would never resolve when landing on the verify page. The hook also fired RPC calls to every ethers provider as a fallback, which was slow and error-prone.

## Solution

Deeplinks are now resolved server-side via a dedicated API route. The client hook fetches the API, redirects to the correct page if needed, and opens the panel with the resolved entity.

### Architecture

```
Browser URL with ?transactionHash=0x...
        |
        v
useDeeplinkQuery (client hook)
        |
        v
GET /api/resolve-deeplink?transactionHash=...&chainId=...&oracleType=...
        |
        v
Server queries subgraphs directly (GQL aliased queries)
        |
        v
Returns: { entity, chainId, oracleType, oracleAddress, page }
        |
        v
Client redirects to correct page if needed, opens panel
```

### Key files

| File | Purpose |
|------|---------|
| `src/pages/api/resolve-deeplink.ts` | API route — queries subgraphs, scores results, returns best match with target page |
| `src/hooks/useDeeplinkQuery.ts` | Client hook — Tanstack Query fetch, page redirect, panel open |
| `src/hooks/useDeeplinkParams.ts` | Shared deeplink URL param keys and parser |
| `src/contexts/PanelContext.tsx` | Panel state — added `openPanelWithQuery` for deeplink-resolved entities, `openedFromTable` to distinguish row clicks from deeplinks |
| `libs/.../oraclev1/gql/queries.ts` | Added `getRequestByHash` (4-alias GQL), `getRequestByDetails` (legacy lookup) |
| `libs/.../managedv2/gql/queries.ts` | Added `getRequestByHash` for managed oracle |
| `libs/.../oraclev3/gql/queries.ts` | Added `getAssertionByHash` (3-alias GQL) |

### How the API route works

1. Parses query params: `transactionHash`, `eventIndex`, `chainId`, `oracleType` (hash-based) or `requester`, `timestamp`, `identifier`, `ancillaryData` (legacy)
2. Filters subgraph configs by `chainId`/`oracleType` if provided (fast path: 1 subgraph). Otherwise queries all subgraphs in parallel.
3. For each subgraph, runs a single GQL request with aliased queries to search by all hash fields at once (e.g. `requestHash`, `proposalHash`, `disputeHash`, `settlementHash`)
4. Scores results using the same priority logic as the old client hook: request hash match > proposal > dispute > settlement, with event index distance scoring for tiebreaking
5. Determines target page from entity state: `Requested` -> propose, `Proposed`/`Disputed`/`Expired` -> verify, `Resolved`/`Settled` -> settled
6. Returns entity + metadata with `Cache-Control: s-maxage=300, stale-while-revalidate=600`

### How the client hook works

1. Reads URL params via `useSearchParams`
2. Fires Tanstack Query fetch to `/api/resolve-deeplink` (disabled when panel was opened from a table row click via `openedFromTable`)
3. On response, checks if current page matches the target page. If not, `router.replace` redirects with deeplink params preserved.
4. After redirect (or if already on correct page), converts the raw graph entity to `OracleQueryUI` and calls `openPanelWithQuery`
5. Tanstack Query caches with `staleTime: Infinity` so redirects don't re-fetch

### Panel context changes

- `openPanelWithQuery(query)`: opens panel with a directly-provided `OracleQueryUI` (bypasses table lookup). Used by deeplinks.
- `openPanel(queryId)`: existing path for table row clicks. Sets `openedFromTable = true` so the deeplink hook doesn't fire.
- `closePanel()`: clears all deeplink params (`transactionHash`, `eventIndex`, `chainId`, `oracleType`) from URL
- URL params now include `chainId` and `oracleType` (via updated `makeUrlParamsForQuery`) so deeplinks are self-contained

### Supported deeplink formats

**Hash-based (primary):**
```
/?transactionHash=0x...&eventIndex=239&chainId=137&oracleType=Optimistic+Oracle+V2
```
`chainId` and `oracleType` are optional — if omitted, all subgraphs are searched.

**Legacy (detail-based):**
```
/?chainId=137&oracleType=OptimisticV2&requester=0x...&timestamp=...&identifier=...&ancillaryData=...
```

## Settled page limit

Settled page data is capped at **5000 requests per subgraph**. Previously the `getSettledRequests` queries used time-based cursor pagination after the skip limit, fetching the entire settlement history (unbounded). The time-based fallback was removed for settled queries in both `oraclev1` and `managedv2`. V3 assertions were already capped at 5000.

This was done to reduce the data volume on the settled page, which was loading 200+ MB of resources and causing UI lockups.
