import { Layout, Table } from "@/components";
import { useOracleDataContext } from "@/hooks";

export default function Propose() {
  const { verify } = useOracleDataContext();
  
  return (
    <Layout>
      <Table rows={verify} isLoading={false} page="propose" />
    </Layout>
  );
}
