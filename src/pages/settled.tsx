import { Filters, Layout, OracleQueries } from "@/components";
import { useFilterAndSearch, useOracleDataContext } from "@/hooks";

export default function Propose() {
  const { settled } = useOracleDataContext();
  const { results, searchProps, filterProps } = useFilterAndSearch(settled);

  return (
    <Layout>
      <Filters {...filterProps} {...searchProps} />
      <OracleQueries
        queries={results}
        isLoading={settled === undefined}
        page="settled"
      />
    </Layout>
  );
}
