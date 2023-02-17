import { Layout, OracleQueryTable } from "@/components";
import { useOracleDataContext } from "@/hooks";

export default function Propose() {
  const { propose } = useOracleDataContext();

  return (
    <Layout>
      <OracleQueryTable
        rows={propose ?? []}
        isLoading={propose === undefined}
        page="propose"
      />
    </Layout>
  );
}
