import { Layout, Table } from "@/components";
import { useOracleDataContext } from "@/hooks";

export default function Propose() {
  const { settled } = useOracleDataContext();

  return (
    <Layout>
      <Table
        rows={settled ?? []}
        isLoading={settled === undefined}
        page="settled"
      />
    </Layout>
  );
}
