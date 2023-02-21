import { Filters, Layout, OracleQueries } from "@/components";
import { useOracleDataContext } from "@/hooks";
import { mockFilters } from "@/stories/mocks";

export default function Propose() {
  const { settled } = useOracleDataContext();

  return (
    <Layout>
      <Filters {...mockFilters} />
      <OracleQueries
        queries={settled ?? []}
        isLoading={settled === undefined}
        page="settled"
      />
    </Layout>
  );
}
