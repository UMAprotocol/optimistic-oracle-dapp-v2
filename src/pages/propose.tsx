import { Filters, Layout, OracleQueries } from "@/components";
import { useFilterAndSearch, useOracleDataContext } from "@/hooks";

export default function Propose() {
  const { propose } = useOracleDataContext();
  const { results, searchProps, filterProps } = useFilterAndSearch(propose);

  return (
    <Layout>
      <Filters {...filterProps} {...searchProps} />
      <OracleQueries
        queries={results}
        isLoading={propose === undefined}
        page="propose"
      />
    </Layout>
  );
}
