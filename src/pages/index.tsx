import { Layout, OracleQueryTable } from "@/components";
import { useOracleDataContext } from "@/hooks";

export default function Verify() {
  const { verify } = useOracleDataContext();

  return (
    <Layout>
      <OracleQueryTable
        rows={verify ?? []}
        isLoading={verify === undefined}
        page="verify"
      />
    </Layout>
  );
}
