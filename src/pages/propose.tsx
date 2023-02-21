import { Filters, Layout, OracleQueries } from "@/components";
import { useOracleDataContext } from "@/hooks";
import { mockFilters } from "@/stories/mocks";

export default function Propose() {
  const { propose } = useOracleDataContext();

  return (
    <Layout>
      <Filters {...mockFilters} />
      <OracleQueries
        queries={propose ?? []}
        isLoading={propose === undefined}
        page="propose"
      />
    </Layout>
  );
}
