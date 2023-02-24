import { Filters, Layout, OracleQueries } from "@/components";
import { useFilterAndSearch, useOracleDataContext } from "@/hooks";

export default function Verify() {
  const { verify } = useOracleDataContext();
  const { results, searchProps, filterProps } = useFilterAndSearch(verify);

  return (
    <Layout>
      <Filters {...filterProps} {...searchProps} />
      <OracleQueries
        queries={results}
        isLoading={verify === undefined}
        page="verify"
      />
    </Layout>
  );
}
