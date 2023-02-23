import { Filters, Layout, OracleQueries } from "@/components";
import { useFilters, useOracleDataContext } from "@/hooks";

export default function Verify() {
  const { verify } = useOracleDataContext();
  const { filteredQueries, ...filterProps } = useFilters({
    queries: verify ?? [],
  });

  return (
    <Layout>
      <Filters {...filterProps} />
      <OracleQueries
        queries={filteredQueries}
        isLoading={verify === undefined}
        page="verify"
      />
    </Layout>
  );
}
