import * as oracle from "@libs/oracle";

let client: oracle.types.interfaces.ClientTable | undefined;
if (process.env.NEXT_PUBLIC_PROVIDER_URL_137) {
  const config: oracle.types.state.PartialChainConfig = {
    rpcUrls: [process.env.NEXT_PUBLIC_PROVIDER_URL_137],
    chainId: 137,
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
    },
    chainName: "Polygon",
    blockExplorerUrls: ["https://polygonscan.com"],
    optimisticOracleAddress: "0xBb1A8db2D4350976a11cdfA60A1d43f97710Da49",
  };

  client = oracle.factory(
    {
      [oracle.types.state.OracleType.Optimistic]: {
        chains: [
          {
            ...config,
            optimisticOracleAddress:
              "0xd2ecb3afe598b746F8123CaE365a598DA831A449",
          },
        ],
      },
      [oracle.types.state.OracleType.OptimisticV2]: {
        chains: [
          {
            ...config,
            optimisticOracleAddress:
              "0xBb1A8db2D4350976a11cdfA60A1d43f97710Da49",
            // polygon mainnet does not have requests before this block
            earliestBlockNumber: 20000000,
            // this value was selected with testing to give a balance between quantity of requests found vs how fast the latest
            // requests show removing this will enable the client to query the full range in one request.
            maxEventRangeQuery: 200000,
          },
        ],
      },
    },
    console.log
  );
}
export default client;
