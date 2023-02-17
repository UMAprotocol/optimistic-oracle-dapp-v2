import { Layout, OracleQueries } from "@/components";
import { useOracleDataContext } from "@/hooks";

export default function Propose() {
  const { settled } = useOracleDataContext();

  return (
    <Layout>
      <OracleQueries
        queries={settled ?? []}
        isLoading={settled === undefined}
        page="settled"
      />
    </Layout>
  );
}
