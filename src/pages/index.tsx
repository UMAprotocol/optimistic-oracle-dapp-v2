import { Layout, Table } from "@/components";
import { useOracleDataContext } from "@/hooks";

export default function Verify() {
  const { verify } = useOracleDataContext();

  return (
    <Layout>
      <Table
        rows={verify ?? []}
        isLoading={verify === undefined}
        page="verify"
      />
    </Layout>
  );
}
