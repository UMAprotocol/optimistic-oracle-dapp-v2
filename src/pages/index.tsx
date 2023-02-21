import { Filters, Layout, OracleQueries } from "@/components";
import { useOracleDataContext } from "@/hooks";
import { mockFilters } from "@/stories/mocks";
import type { OracleQueryUI } from "@/types";
import { useEffect, useState } from "react";

export default function Verify() {
  const { verify } = useOracleDataContext();
  const [queries, setQueries] = useState<OracleQueryUI[]>([]);

  useEffect(() => {
    if (verify) {
      setQueries(verify);
    }
  }, [verify]);

  return (
    <Layout>
      <Filters {...mockFilters} dataSet={queries} setResults={setQueries} />
      <OracleQueries
        queries={verify ?? []}
        isLoading={verify === undefined}
        page="verify"
      />
    </Layout>
  );
}
