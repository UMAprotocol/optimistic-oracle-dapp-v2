import { Filters, Layout, OracleQueries } from "@/components";
import { useOracleDataContext } from "@/hooks";
import { mockFilters } from "@/stories/mocks";

export default function Verify() {
  const { verify } = useOracleDataContext();

  return (
    <Layout>
      <Filters {...mockFilters} />
      <OracleQueries
        queries={verify ?? []}
        isLoading={verify === undefined}
        page="verify"
      />
    </Layout>
  );
}
