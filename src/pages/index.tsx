import { Filters, Layout, OracleQueries } from "@/components";
import { useFilters, useOracleDataContext, useSearch } from "@/hooks";
const keys = [
  "chainName",
  "oracleType",
  "project",
  "title",
  "ancillaryData",
  "decodedAncillaryData",
  "timeUTC",
  "timeFormatted",
  "price",
  "expiryType",
  "currency",
  "formattedBond",
  "formattedReward",
  "assertion",
];
export default function Verify() {
  const { verify } = useOracleDataContext();
  const { filteredQueries, ...filterProps } = useFilters({
    queries: verify ?? [],
  });
  const { searchResults, ...searchProps } = useSearch({
    queries: filteredQueries,
    keys,
  });

  return (
    <Layout>
      <Filters {...filterProps} {...searchProps} />
      <OracleQueries
        queries={searchResults}
        isLoading={verify === undefined}
        page="verify"
      />
    </Layout>
  );
}
