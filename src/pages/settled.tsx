import { Layout, OracleQueryTable } from "@/components";
import { useOracleDataContext } from "@/hooks";

export default function Propose() {
  const { settled } = useOracleDataContext();

  return (
    <Layout>
      <OracleQueryTable
        rows={settled ?? []}
        isLoading={settled === undefined}
        page="settled"
      />
    </Layout>
  );
}
