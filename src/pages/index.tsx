import { Layout, Table } from "@/components";
import { useOracleDataContext } from "@/hooks";

export default function Verify() {
  const { verify } = useOracleDataContext();

  return (
    <Layout>
      <Table rows={verify} isLoading={verify.length === 0} page="verify" />
    </Layout>
  );
}
