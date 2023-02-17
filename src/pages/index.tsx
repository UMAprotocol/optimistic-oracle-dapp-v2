import { Layout, OracleQueries } from "@/components";
import { useOracleDataContext } from "@/hooks";

export default function Verify() {
  const { verify } = useOracleDataContext();

  return (
    <Layout>
      <OracleQueries
        queries={verify ?? []}
        isLoading={verify === undefined}
        page="verify"
      />
    </Layout>
  );
}
