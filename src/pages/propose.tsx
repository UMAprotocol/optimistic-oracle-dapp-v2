import { Layout, OracleQueries } from "@/components";
import { useOracleDataContext } from "@/hooks";

export default function Propose() {
  const { propose } = useOracleDataContext();

  return (
    <Layout>
      <OracleQueries
        queries={propose ?? []}
        isLoading={propose === undefined}
        page="propose"
      />
    </Layout>
  );
}
